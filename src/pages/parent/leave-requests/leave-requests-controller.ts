import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useGetMyChildren } from "../ptm/service/my-children-service";
import { useGetMyLeaveRequests, useCreateLeaveRequest, useCancelLeaveRequest } from "./service/leave-request-service";

const today = () => new Date().toISOString().slice(0, 10);

export const useLeaveRequestsController = () => {
  const { organizationId = "" } = useParams();

  const [showForm, setShowForm] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [fromDate, setFromDate] = useState(today());
  const [toDate, setToDate] = useState(today());
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [leaveRequestIdPendingCancel, setLeaveRequestIdPendingCancel] = useState<string | null>(null);

  const children = useGetMyChildren(organizationId);
  const leaveRequests = useGetMyLeaveRequests(organizationId);
  const createLeaveRequest = useCreateLeaveRequest(organizationId);
  const cancelLeaveRequest = useCancelLeaveRequest(organizationId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachment(e.target.files?.[0] || null);
  };

  const resetForm = () => {
    setStudentId("");
    setFromDate(today());
    setToDate(today());
    setReason("");
    setAttachment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !fromDate || !toDate || !reason) {
      toast.error("Please fill all required fields");
      return;
    }
    if (fromDate > toDate) {
      toast.error("From date cannot be after to date");
      return;
    }

    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("fromDate", fromDate);
    formData.append("toDate", toDate);
    formData.append("reason", reason);
    if (attachment) formData.append("attachment", attachment);

    createLeaveRequest.mutate(formData);
  };

  useEffect(() => {
    if (createLeaveRequest.isSuccess) {
      toast.success("Leave request submitted.");
      setShowForm(false);
      resetForm();
    }
    if (createLeaveRequest.isError) {
      toast.error(createLeaveRequest.error?.response?.Error?.message || "Failed to submit leave request");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLeaveRequest.isSuccess, createLeaveRequest.isError]);

  const handleCancel = (leaveRequestId: string) => setLeaveRequestIdPendingCancel(leaveRequestId);
  const cancelDialogClose = () => setLeaveRequestIdPendingCancel(null);
  const confirmCancel = () => {
    if (!leaveRequestIdPendingCancel) return;
    cancelLeaveRequest.mutate(leaveRequestIdPendingCancel, {
      onSuccess: () => setLeaveRequestIdPendingCancel(null),
    });
  };

  return {
    children: children.data?.items || [],
    leaveRequests: leaveRequests.data?.items || [],
    isLoading: leaveRequests.isLoading,
    showForm,
    setShowForm,
    studentId,
    setStudentId,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    reason,
    setReason,
    handleFileChange,
    handleSubmit,
    isCreating: createLeaveRequest.isPending,
    handleCancel,
    leaveRequestIdPendingCancel,
    cancelDialogClose,
    confirmCancel,
    isCancelling: cancelLeaveRequest.isPending,
  };
};
