import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BellIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

import { useParams } from "react-router-dom";

import useGetAiGeneratedContent from "./service";
import { ICreateNoticeRequest, INoticeAudience, NoticeAudienceScope, SelectOption } from "../../types";
import { useError } from "../../hooks";
import { useGetClasses, useGetSections, useGetAcademicYears } from "../../pages/admin/classes/service/academics-service";

const useNoticeModalWrapperController = (
  isSuccessNoticeCreation: boolean,
  onCancel: () => void,
  onSubmit: (formData: ICreateNoticeRequest) => void
) => {
  const { t } = useTranslation();
  const { organizationId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [isAIPreviewModalOpen, setIsAIPreviewModalOpen] = useState(false);

  const defaultAudience: INoticeAudience = { scope: "SCHOOL", roles: [], classIds: [], sectionIds: [] };

  const [formData, setFormData] = useState<ICreateNoticeRequest>({
    title: "",
    content: "",
    date: "",
    type: "announcement",
    attachment: null,
    audience: defaultAudience,
  });

  const [sectionPickerClassId, setSectionPickerClassId] = useState("");

  const getAcademicYears = useGetAcademicYears(organizationId || "");
  const currentAcademicYearId = getAcademicYears.data?.items.find((y) => y.isCurrent)?.id;
  const getClasses = useGetClasses(organizationId || "", currentAcademicYearId);
  const classOptions = getClasses.data?.items || [];
  const getSections = useGetSections(organizationId || "", sectionPickerClassId || undefined);
  const sectionOptions = getSections.data?.items || [];

  const roleOptions = ["SCHOOL_ADMIN", "TEACHER", "PARENT", "STAFF"];

  const handleAudienceScopeChange = (scope: NoticeAudienceScope) => {
    setFormData({ ...formData, audience: { scope, roles: [], classIds: [], sectionIds: [] } });
  };

  const handleAudienceRoleToggle = (role: string) => {
    const current = formData.audience?.roles || [];
    const roles = current.includes(role) ? current.filter((r) => r !== role) : [...current, role];
    setFormData({ ...formData, audience: { ...(formData.audience || defaultAudience), roles } });
  };

  const handleAudienceClassToggle = (classId: string) => {
    const current = formData.audience?.classIds || [];
    const classIds = current.includes(classId) ? current.filter((c) => c !== classId) : [...current, classId];
    setFormData({ ...formData, audience: { ...(formData.audience || defaultAudience), classIds } });
  };

  const handleAudienceSectionToggle = (sectionId: string) => {
    const current = formData.audience?.sectionIds || [];
    const sectionIds = current.includes(sectionId) ? current.filter((s) => s !== sectionId) : [...current, sectionId];
    setFormData({ ...formData, audience: { ...(formData.audience || defaultAudience), sectionIds } });
  };

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const getAiGeneratedContent = useGetAiGeneratedContent();

  useError({
    mutation: getAiGeneratedContent,
    cb: () => {
      setIsGeneratingContent(false);
    },
  });

  const noticeTypeOptions: SelectOption[] = [
    {
      id: "announcement",
      name: t("common.notice_types.announcement"),
      description: t("common.notice_types.announcement_description"),
      icon: <BellIcon className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: "holiday",
      name: t("common.notice_types.holiday"),
      description: t("common.notice_types.holiday_description"),
      icon: <CalendarDaysIcon className="h-5 w-5 text-green-500" />,
    },
  ];

  const selectedNoticeType =
    noticeTypeOptions.find((option) => option.id === formData.type) ||
    noticeTypeOptions[0];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date });
  };

  const handleNoticeTypeChange = (option: SelectOption) => {
    setFormData({ ...formData, type: option.id as "announcement" | "holiday" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFormData({
        ...formData,
        attachment: e.target.files[0] ? e.target.files[0] : null,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      date: "",
      type: "announcement",
      attachment: null,
      audience: defaultAudience,
    });
    setFile(null);
    setSectionPickerClassId("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const generateContentWithAI = async () => {
    if (!formData.title.trim() || !formData.type) {
      return;
    }

    const values = {
      title: formData.title,
      type: formData.type,
    };

    getAiGeneratedContent.mutate(values);

    setIsGeneratingContent(true);
  };

  const handleSelectAI = () => {
    setIsAIModalOpen(true);
    openNoticeModal();
    onCancel();
  };

  const handleSelectCustom = () => {
    setIsAIModalOpen(false);
    openNoticeModal();
    onCancel();
  };

  // Notice modal handlers
  const openNoticeModal = () => {
    setIsNoticeModalOpen(true);
  };

  const closeNoticeModal = () => {
    setIsNoticeModalOpen(false);
    resetForm();
  };

  const onClickAIPreviewButton = () => {
    setIsAIPreviewModalOpen(true);
  };

  const onCloseAIPreviewModal = () => {
    setIsAIPreviewModalOpen(false);
  };

  useEffect(() => {
    if (getAiGeneratedContent.isSuccess && getAiGeneratedContent.data) {
      setFormData({
        ...formData,
        content: getAiGeneratedContent.data.content,
      });
      setIsGeneratingContent(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAiGeneratedContent.isSuccess, getAiGeneratedContent.data]);

  useEffect(() => {
    if (getAiGeneratedContent.isError) {
      setIsGeneratingContent(false);
    }
  }, [getAiGeneratedContent.isError]);

  useEffect(() => {
    if (isSuccessNoticeCreation) {
      closeNoticeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessNoticeCreation]);

  return {
    t,
    file,
    formData,
    fileInputRef,
    isAIModalOpen,
    isNoticeModalOpen,
    noticeTypeOptions,
    selectedNoticeType,
    isGeneratingContent,
    isAIPreviewModalOpen,
    classOptions,
    sectionOptions,
    roleOptions,
    sectionPickerClassId,
    setSectionPickerClassId,
    handleAudienceScopeChange,
    handleAudienceRoleToggle,
    handleAudienceClassToggle,
    handleAudienceSectionToggle,
    handleChange,
    handleDateChange,
    handleNoticeTypeChange,
    handleFileChange,
    handleSubmit,
    generateContentWithAI,
    handleSelectAI,
    handleSelectCustom,
    closeNoticeModal,
    onClickAIPreviewButton,
    onCloseAIPreviewModal,
  };
};

export default useNoticeModalWrapperController;
