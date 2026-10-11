import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  useGetFeeHeads,
  useCreateFeeHead,
  useGetFeeStructures,
  useCreateFeeStructure,
  useAssignFeeStructure,
  useGetStudentFeeSummary,
  useRecordPayment,
  useReversePayment,
  useGetPaymentLedger,
  useGrantConcession,
  fetchWholeLedger,
  LEDGER_PAGE_SIZE,
} from "./service/fees-service";
import { useGetAcademicYears, useGetClasses, useGetYearSections } from "../classes/service/academics-service";
import useGetStudentDetails from "../students/service/get-student-details/get-student-details";
import { useError } from "@/hooks";
import { exportToCsv } from "@/utils";

type Tab = "heads" | "structures" | "students" | "ledger";

// the form takes rupees; the server keeps every amount in paise
const toPaise = (rupees: string) => Math.round(Number(rupees) * 100);

const emptyPayment = { studentFeeId: "", amount: "", method: "cash", instrumentRef: "", remarks: "" };
const emptyConcession = { studentFeeId: "", amount: "", reason: "", installmentLabel: "" };

const useFeesController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();
  const org = organizationId || "";

  const [activeTab, setActiveTab] = useState<Tab>("structures");

  const [headForm, setHeadForm] = useState({ name: "", code: "", category: "tuition", isRefundable: false });

  const [classIds, setClassIds] = useState<string[]>([]);
  const [sectionIds, setSectionIds] = useState<string[]>([]);
  const [items, setItems] = useState<{ feeHeadId: string; amount: string }[]>([{ feeHeadId: "", amount: "" }]);
  const [installments, setInstallments] = useState<{ label: string; dueDate: string; amount: string }[]>([
    { label: "Installment 1", dueDate: "", amount: "" },
  ]);
  const [structureName, setStructureName] = useState("");

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [paymentForm, setPaymentForm] = useState(emptyPayment);
  const [concessionForm, setConcessionForm] = useState(emptyConcession);
  const [paymentToReverse, setPaymentToReverse] = useState<string | null>(null);
  const [ledgerPage, setLedgerPage] = useState(1);
  const [isExportingLedger, setIsExportingLedger] = useState(false);

  const getAcademicYears = useGetAcademicYears(org);
  const currentAcademicYearId = getAcademicYears.data?.items.find((y) => y.isCurrent)?.id;
  const getClasses = useGetClasses(org, currentAcademicYearId, "active");
  const getSections = useGetYearSections(org, currentAcademicYearId);
  const getFeeHeads = useGetFeeHeads(org);
  const getFeeStructures = useGetFeeStructures(org);
  const getStudentSearch = useGetStudentDetails(org, "all", studentSearch, 10, 1);
  const getStudentFeeSummary = useGetStudentFeeSummary(org, selectedStudentId);
  const getPaymentLedger = useGetPaymentLedger(org, ledgerPage);

  const createFeeHead = useCreateFeeHead(org);
  const createFeeStructure = useCreateFeeStructure(org);
  const assignFeeStructure = useAssignFeeStructure(org);
  const recordPayment = useRecordPayment(org);
  const reversePayment = useReversePayment(org);
  const grantConcession = useGrantConcession(org);

  useError({ mutation: createFeeHead });
  useError({ mutation: createFeeStructure });
  useError({ mutation: assignFeeStructure });
  useError({ mutation: recordPayment });
  useError({ mutation: reversePayment });
  useError({ mutation: grantConcession });

  const feeHeads = getFeeHeads.data?.items || [];
  const feeStructures = getFeeStructures.data?.items || [];
  const classOptions = getClasses.data?.items || [];
  // only sections of the ticked classes, named with their class since several classes have an "A"
  const sectionOptions = (getSections.data?.items || [])
    .filter((section) => classIds.includes(section.classId))
    .map((section) => ({
      ...section,
      name: `${classOptions.find((c) => c.id === section.classId)?.name ?? ""} - ${section.name}`,
    }));
  const studentSearchResults = getStudentSearch.data?.items || [];
  const studentFeeSummaries = getStudentFeeSummary.data?.items || [];
  const paymentLedger = getPaymentLedger.data?.items || [];

  const handleHeadFormChange = (field: string, value: string | boolean) => {
    setHeadForm({ ...headForm, [field]: value });
  };

  const handleCreateFeeHead = () => {
    if (!headForm.name || !headForm.code) {
      toast.error("Name and code are required.");
      return;
    }
    createFeeHead.mutate(headForm, {
      onSuccess: () => {
        toast.success("Fee head created.");
        setHeadForm({ name: "", code: "", category: "tuition", isRefundable: false });
      },
    });
  };

  const toggleClass = (classId: string) => {
    if (classIds.includes(classId)) {
      // unticking a class also drops any of its sections that were picked
      const sectionsOfClass = new Set(
        (getSections.data?.items || []).filter((section) => section.classId === classId).map((section) => section.id),
      );
      setSectionIds((prev) => prev.filter((id) => !sectionsOfClass.has(id)));
    }
    setClassIds((prev) => (prev.includes(classId) ? prev.filter((c) => c !== classId) : [...prev, classId]));
  };

  const toggleSection = (sectionId: string) => {
    setSectionIds((prev) => (prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]));
  };

  const addItemRow = () => setItems([...items, { feeHeadId: "", amount: "" }]);
  const updateItemRow = (index: number, field: string, value: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };
  const removeItemRow = (index: number) => setItems(items.filter((_, i) => i !== index));

  const addInstallmentRow = () =>
    setInstallments([...installments, { label: `Installment ${installments.length + 1}`, dueDate: "", amount: "" }]);
  const updateInstallmentRow = (index: number, field: string, value: string) => {
    const next = [...installments];
    next[index] = { ...next[index], [field]: value };
    setInstallments(next);
  };
  const removeInstallmentRow = (index: number) => setInstallments(installments.filter((_, i) => i !== index));

  const itemsTotal = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const installmentsTotal = installments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const handleCreateFeeStructure = () => {
    if (!currentAcademicYearId || !structureName || !classIds.length) {
      toast.error("Name and at least one class are required.");
      return;
    }

    const validItems = items
      .filter((i) => i.feeHeadId && i.amount)
      .map((i) => ({ feeHeadId: i.feeHeadId, amount: toPaise(i.amount) }));
    const validInstallments = installments
      .filter((i) => i.label && i.dueDate && i.amount)
      .map((i) => ({ label: i.label, dueDate: i.dueDate, amount: toPaise(i.amount) }));

    if (!validItems.length) {
      toast.error(
        feeHeads.length === 0
          ? "Create a fee head first (see the Fee Heads tab), then pick it here."
          : "Pick a fee head and enter an amount for at least one item row."
      );
      return;
    }
    if (!validInstallments.length) {
      toast.error("Fill in label, due date and amount for at least one installment row.");
      return;
    }
    if (toPaise(String(itemsTotal)) !== toPaise(String(installmentsTotal))) {
      toast.error("Installment total must match fee head items total.");
      return;
    }

    createFeeStructure.mutate(
      {
        academicYearId: currentAcademicYearId,
        name: structureName,
        classIds,
        sectionIds,
        items: validItems,
        installments: validInstallments,
      },
      {
        onSuccess: () => {
          toast.success("Fee structure created.");
          setStructureName("");
          setClassIds([]);
          setSectionIds([]);
          setItems([{ feeHeadId: "", amount: "" }]);
          setInstallments([{ label: "Installment 1", dueDate: "", amount: "" }]);
        },
      }
    );
  };

  const handleAssignStructure = (feeStructureId: string) => {
    assignFeeStructure.mutate(feeStructureId, {
      onSuccess: (data) => {
        toast.success(`Assigned to ${data.assigned_count} student(s), skipped ${data.skipped_count} already assigned.`);
      },
    });
  };

  // one form is open at a time: typing into another student fee record's form starts a fresh one there
  const handlePaymentFormChange = (studentFeeId: string, field: string, value: string) => {
    setPaymentForm((prev) => ({ ...(prev.studentFeeId === studentFeeId ? prev : emptyPayment), studentFeeId, [field]: value }));
  };

  const handleRecordPayment = () => {
    if (!paymentForm.studentFeeId || !paymentForm.amount) {
      toast.error("Select a fee record and enter an amount.");
      return;
    }
    recordPayment.mutate(
      { ...paymentForm, amount: toPaise(paymentForm.amount) },
      {
        onSuccess: () => {
          toast.success("Payment recorded.");
          setPaymentForm(emptyPayment);
        },
      }
    );
  };

  // reversing cannot be undone, so it is confirmed first
  const confirmReversePayment = () => {
    if (!paymentToReverse) return;
    reversePayment.mutate(paymentToReverse, {
      onSuccess: () => {
        toast.success("Payment reversed.");
        setPaymentToReverse(null);
      },
    });
  };

  const handleConcessionFormChange = (studentFeeId: string, field: string, value: string) => {
    setConcessionForm((prev) => ({ ...(prev.studentFeeId === studentFeeId ? prev : emptyConcession), studentFeeId, [field]: value }));
  };

  const handleGrantConcession = () => {
    if (!concessionForm.studentFeeId || !concessionForm.amount || !concessionForm.reason) {
      toast.error("Select a fee record, enter an amount and a reason.");
      return;
    }
    grantConcession.mutate(
      {
        studentFeeId: concessionForm.studentFeeId,
        amount: toPaise(concessionForm.amount),
        reason: concessionForm.reason,
        installmentLabel: concessionForm.installmentLabel || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Concession granted.");
          setConcessionForm(emptyConcession);
        },
      }
    );
  };

  // the export holds every payment, not just the page on screen
  const handleExportLedger = async () => {
    setIsExportingLedger(true);
    try {
      const payments = await fetchWholeLedger(org);
      exportToCsv(
        "payment-ledger",
        payments.map((p) => ({
          receipt: p.receiptNumber,
          student: typeof p.studentId === "object" ? p.studentId.name : "",
          type: p.entryType === "reversal" ? "Reversal" : "Payment",
          amount: p.amount / 100,
          method: p.method,
          date: new Date(p.paidAt).toLocaleDateString(),
        }))
      );
    } catch {
      toast.error("The ledger could not be exported. Please try again.");
    } finally {
      setIsExportingLedger(false);
    }
  };

  return {
    t,
    activeTab,
    setActiveTab,
    feeHeads,
    headForm,
    handleHeadFormChange,
    handleCreateFeeHead,
    isCreatingHead: createFeeHead.isPending,
    feeStructures,
    classOptions,
    sectionOptions,
    classIds,
    sectionIds,
    toggleClass,
    toggleSection,
    items,
    addItemRow,
    updateItemRow,
    removeItemRow,
    installments,
    addInstallmentRow,
    updateInstallmentRow,
    removeInstallmentRow,
    structureName,
    setStructureName,
    itemsTotal,
    installmentsTotal,
    handleCreateFeeStructure,
    isCreatingStructure: createFeeStructure.isPending,
    handleAssignStructure,
    isAssigning: assignFeeStructure.isPending,
    studentSearch,
    setStudentSearch,
    studentSearchResults,
    selectedStudentId,
    setSelectedStudentId,
    studentFeeSummaries,
    paymentForm,
    handlePaymentFormChange,
    handleRecordPayment,
    isRecordingPayment: recordPayment.isPending,
    paymentLedger,
    ledgerPage,
    setLedgerPage,
    ledgerTotal: getPaymentLedger.data?.total_count ?? 0,
    ledgerPageSize: LEDGER_PAGE_SIZE,
    isLoadingLedger: getPaymentLedger.isLoading,
    handleExportLedger,
    isExportingLedger,
    isLoadingStudentFees: getStudentFeeSummary.isLoading,
    studentFeesFailed: getStudentFeeSummary.isError,
    paymentToReverse,
    setPaymentToReverse,
    confirmReversePayment,
    isReversing: reversePayment.isPending,
    concessionForm,
    handleConcessionFormChange,
    handleGrantConcession,
    isGrantingConcession: grantConcession.isPending,
  };
};

export default useFeesController;
