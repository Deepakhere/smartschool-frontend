import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BellIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

import useGetAiGeneratedContent from "./service";
import { ICreateNoticeRequest, SelectOption } from "../../types";
import { useError } from "../../hooks";

const useNoticeModalWrapperController = (
  isSuccessNoticeCreation: boolean,
  onCancel: () => void,
  onSubmit: (formData: ICreateNoticeRequest) => void
) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [formData, setFormData] = useState<ICreateNoticeRequest>({
    title: "",
    content: "",
    date: "",
    type: "announcement",
    attachment: null,
  });

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
    });
    setFile(null);

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
    handleChange,
    handleDateChange,
    handleNoticeTypeChange,
    handleFileChange,
    handleSubmit,
    generateContentWithAI,
    handleSelectAI,
    handleSelectCustom,
    closeNoticeModal,
  };
};

export default useNoticeModalWrapperController;
