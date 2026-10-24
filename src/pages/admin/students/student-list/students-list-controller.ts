import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";

import {
  useAddStudent,
  useDeleteStudent,
  useGetStudentDetails,
  useReinviteParent,
  useUpdateStudentDetail,
} from "../service";
import { IStudentFormData } from "@/types";
import { EMAIL_REGEX_PATTERN, TOTAL_STEPS } from "@/utils";
import { useNavigate, useParams } from "react-router-dom";
import useGetParentByEmail from "../service/get-parent-by-email";
import downloadStudentsCsv from "../service/export-students";
import { useError, useExportRows, usePaging } from "@/hooks";
import { useGetAcademicYears, useGetClasses } from "@/pages/admin/classes/service/academics-service";
import { createStudentSchema } from "../student-modal/create-update-student-modal/student-form.schema";
import { useAreaBase, useCan } from "@/context/tenant-context";

const emptyFormData = {} as IStudentFormData;

export type StudentListRow = NonNullable<ReturnType<typeof useGetStudentDetails>["data"]>["rows"][number];

const useStudentsListController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();
  const areaBase = useAreaBase();
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const form = useForm<IStudentFormData>({ resolver: zodResolver(createStudentSchema), defaultValues: emptyFormData });
  const [currentStep, setCurrentStep] = useState(1);
  const [isParentExist, setIsParentExist] = useState(false);

  const { page, pageSize, setPage, setPageSize, resetPage } = usePaging();
  // what is typed shows at once; the search runs half a second after typing stops
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [deleteStudentId, setDeleteStudentId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigateToStudentDetails = (studentId: string) => {
    navigate(`${areaBase}/students/detail/${studentId}`);
  };

  // the detail page owns the full edit flow (fetches complete student data, prefills the form);
  // jump straight there with a flag so it opens the edit modal instead of just viewing
  const onClickEditStudent = (studentId: string) => {
    navigate(`${areaBase}/students/detail/${studentId}`, {
      state: { openEdit: true },
    });
  };

  const runSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
        resetPage();
      }, 500),
    [resetPage]
  );
  useEffect(() => () => runSearch.cancel(), [runSearch]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    runSearch(value);
  };

  const clearFilters = () => {
    runSearch.cancel();
    setSearchInput("");
    setSearchTerm("");
    setClassFilter("all");
    resetPage();
  };

  // Handle class filter change
  const handleClassFilterChange = (classId: string) => {
    setClassFilter(classId);
    resetPage();
  };

  const academicYears = useGetAcademicYears(organizationId || "");
  const currentAcademicYearId =
    academicYears.data?.items.find((y) => y.isCurrent)?.id || academicYears.data?.items[0]?.id || "";
  const classesForFilter = useGetClasses(organizationId || "", currentAcademicYearId, "active");
  const CLASS_OPTIONS = classesForFilter.data?.items || [];


  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    localStorage.setItem("formData", JSON.stringify(form.getValues()));
  };

  const prevStep = () => {
    const saved = localStorage.getItem("formData");
    if (saved) {
      form.reset(JSON.parse(saved));
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getStudentDetails = useGetStudentDetails(
    organizationId || "",
    classFilter,
    searchTerm,
    pageSize,
    page
  );

  const { openExport, exportDialog } = useExportRows({
    total: getStudentDetails.data?.pagination.totalItems ?? 0,
    itemLabel: { one: "student", other: "students" },
    download: (limit) => downloadStudentsCsv(organizationId || "", classFilter, searchTerm, limit),
  });

  const canManage = useCan()("students.manage");

  const addStudentProfile = useAddStudent(organizationId || "");

  const updateStudentDetail = useUpdateStudentDetail(organizationId || "");

  const parentEmail = form.watch("parentEmail");
  const getParentDetails = useGetParentByEmail(organizationId || "", parentEmail);

  const deleteStudent = useDeleteStudent(organizationId || "");
  const reinviteParent = useReinviteParent();

  useError({ mutation: reinviteParent });
  // a full section or a roll number already taken must be shown, not fail silently
  useError({ mutation: addStudentProfile });

  useError({
    mutation: deleteStudent,
    cb: () => {
      setIsDeleteModalOpen(false);
      setDeleteStudentId("");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    addStudentProfile.mutate(values);
  });

  const onClickAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const onClickBulkUpload = () => {
    setIsBulkModalOpen(true);
  };

  const onCloseBulkModal = () => {
    setIsBulkModalOpen(false);
  };

  const onBulkImported = () => {
    getStudentDetails.refetch();
  };

  const onCloseModal = () => {
    setIsAddModalOpen(false);
    form.reset(emptyFormData);
    setCurrentStep(1);
  };

  const handleDeleteAction = (studentId: string) => {
    setDeleteStudentId(studentId);
    setIsDeleteModalOpen(true);
  };

  const onCancelDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteStudentId("");
  };

  const handleResendInvite = (parentUserId: string) => {
    reinviteParent.mutate(parentUserId, { onSuccess: () => toast.success(t("messages.invite_resent")) });
  };

  const handleDeleteStudent = () => {
    if (!deleteStudentId) return;
    deleteStudent.mutate(deleteStudentId);
  };

  useEffect(() => {
    if (getParentDetails.isSuccess && getParentDetails.data) {
      const { item: parent, is_parent_exists } = getParentDetails.data;
      form.setValue("parentName", parent.name);
      form.setValue("phoneNumber", parent.phoneNumber);
      setIsParentExist(is_parent_exists);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getParentDetails.isSuccess, getParentDetails.data]);

  useEffect(() => {
    if (EMAIL_REGEX_PATTERN.test(parentEmail)) {
      getParentDetails.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentEmail]);

  useEffect(() => {
    if (addStudentProfile.isSuccess) {
      setIsAddModalOpen(false);
      localStorage.removeItem("formData");
      form.reset(emptyFormData);
      setCurrentStep(1);
      getStudentDetails.refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStudentProfile.isSuccess]);

  useEffect(() => {
    if (deleteStudent.isSuccess) {
      setIsDeleteModalOpen(false);
      setDeleteStudentId("");
      clearFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteStudent.isSuccess]);

  return {
    t,
    organizationId: organizationId || "",
    form,
    isAddModalOpen,
    isBulkModalOpen,
    onClickBulkUpload,
    onCloseBulkModal,
    onBulkImported,
    currentStep,
    isParentExist,
    handleSearchChange,
    searchInput,
    clearFilters,
    CLASS_OPTIONS,
    page,
    pageSize,
    setPage,
    setPageSize,
    searchTerm,
    classFilter,
    isDeleteModalOpen,
    deleteStudentId,
    studentDetail: getStudentDetails?.data?.rows,
    studentTotalCount: getStudentDetails?.data?.pagination.totalItems,
    isLoadingGetStudentDetails: getStudentDetails.isLoading,
    isLoadingAddStudent: addStudentProfile.isPending,
    isLoadingUpdateStudent: updateStudentDetail.isPending,
    isDeletingStudent: deleteStudent.isPending,
    isFetchingStudentList: getStudentDetails.isFetching,
    onSubmit,
    onCloseModal,
    nextStep,
    prevStep,
    setCurrentStep,
    onClickAddStudent,
    setSearchTerm,
    handleClassFilterChange,
    handleDeleteAction,
    handleDeleteStudent,
    handleResendInvite,
    onCancelDeleteModal,
    setClassFilter,
    navigateToStudentDetails,
    onClickEditStudent,
    openExport,
    exportDialog,
    canManage,
  };
};

export default useStudentsListController;
