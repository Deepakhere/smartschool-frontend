import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  useAddStudent,
  useGetStudentDetails,
  useUpdateStudentDetail,
} from "./service";
import { IStudentFormData } from "../../../types";
import { EMAIL_REGEX_PATTERN, TOTAL_STEPS } from "../../../utils";
import { useParams } from "react-router-dom";
import useGetParentByEmail from "./service/get-parent-by-email";
import debounce from "lodash.debounce";

export const useStudentsController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<IStudentFormData>(
    {} as IStudentFormData
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [isParentExist, setIsParentExist] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle search input change
  const handleSearchChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }
  );

  // Handle class filter change
  const handleClassFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassFilter(e.target.value);
    setCurrentPage(1);
  };

  // Toggle dropdown menu
  const toggleDropdown = (studentId: string) => {
    setActiveDropdown(activeDropdown === studentId ? null : studentId);
  };

  // Get unique class IDs for filter dropdown
  const CLASS_OPTIONS = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  // Get current students for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredStudents.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const nextStep = () => {
    setFormData(JSON.parse(localStorage.getItem("formData") || "{}"));
    const isValidDetail = validateStudentDetails();

    if (isValidDetail) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      localStorage.setItem("formData", JSON.stringify(formData));
    } else {
      toast.error(t("messages.please_fill_all_required_fields"));
    }
  };

  const prevStep = () => {
    const formData = localStorage.getItem("formData");
    if (formData) {
      setFormData(JSON.parse(formData));
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getStudentDetails = useGetStudentDetails(organizationId || "");

  const addStudentProfile = useAddStudent(organizationId || "");

  const updateStudentDetail = useUpdateStudentDetail();

  const getParentDetails = useGetParentByEmail(
    organizationId || "",
    formData.parentEmail
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    addStudentProfile.mutate({
      ...formData,
    });
  };

  const onClickAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const onCloseModal = () => {
    setIsAddModalOpen(false);
    setFormData({} as IStudentFormData);
    setCurrentStep(1);
  };

  const validateStudentDetails = () => {
    if (!formData.admissionId?.trim()) return false;
    if (!formData.admissionDate) return false;
    if (!formData.name?.trim()) return false;
    if (!formData.classId?.trim()) return false;
    if (!formData.rollNumber?.trim()) return false;
    if (!formData.dateOfBirth) return false;
    if (!formData.city?.trim()) return false;
    if (!formData.state?.trim()) return false;
    if (!formData.address?.trim()) return false;
    return true;
  };

  // const validateParentDetails = () => {
  //   if (!formData.parentName?.trim()) return false;
  //   if (!formData.parentEmail?.trim()) return false;
  //   if (!formData.phoneNumber?.trim()) return false;
  //   return true;
  // };

  useEffect(() => {
    if (getParentDetails.isSuccess && getParentDetails.data) {
      const { item: parent, is_parent_exist } = getParentDetails.data;
      setFormData((prev) => ({
        ...prev,
        parentName: parent.name,
        phoneNumber: parent.phoneNumber,
      }));
      setIsParentExist(is_parent_exist);
    }
  }, [getParentDetails.isSuccess, getParentDetails.data]);

  useEffect(() => {
    if (EMAIL_REGEX_PATTERN.test(formData.parentEmail)) {
      getParentDetails.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.parentEmail]);

  useEffect(() => {
    if (addStudentProfile.isSuccess) {
      setIsAddModalOpen(false);
      localStorage.removeItem("formData");
      setFormData({} as IStudentFormData);
      setCurrentStep(1);
      getStudentDetails.refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStudentProfile.isSuccess]);

  // useEffect(() => {
  //   if (getStudentDetails.isSuccess && getStudentDetails.data) {

  //   }
  // }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    t,
    formData,
    isAddModalOpen,
    currentStep,
    isParentExist,
    handleSearchChange,
    CLASS_OPTIONS,
    indexOfLastItem,
    indexOfFirstItem,
    currentPage,
    itemsPerPage,
    searchTerm,
    classFilter,
    activeDropdown,
    dropdownRef,
    studentDetail: getStudentDetails?.data?.items,
    studentTotalCount: getStudentDetails?.data?.total_count,
    isLoadingGetStudentDetails: getStudentDetails.isLoading,
    isLoadingAddStudent: addStudentProfile.isLoading,
    isLoadingUpdateStudent: updateStudentDetail.isLoading,
    handleChange,
    handleSubmit,
    setFormData,
    onCloseModal,
    nextStep,
    prevStep,
    setCurrentStep,
    onClickAddStudent,
    paginate,
    toggleDropdown,
    setSearchTerm,
    setActiveDropdown,
    handleClassFilterChange,
  };
};
