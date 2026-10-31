import { useState } from "react";
import toast from "react-hot-toast";

import { useDebouncedValue, useError } from "@/shared/lib/hooks";
import { useGetStudentDetails } from "@/entities/student";
import { useGetStudentFeeSummary, useReversePayment } from "@/entities/fee";

export interface StudentMatch {
  id: string;
  name: string;
  // class, section and admission number, to tell students with the same name apart
  detail: string;
}

const useStudentFeesController = (organizationId: string) => {
  const [search, setSearch] = useState("");
  // the chosen student stays shown after the search box is cleared
  const [selected, setSelected] = useState<StudentMatch | null>(null);
  const studentId = selected?.id ?? "";
  const [paymentToReverse, setPaymentToReverse] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search.trim());
  // nothing is listed until something is typed, so the matches always mean something
  const students = useGetStudentDetails(organizationId, "all", debouncedSearch, 8, 1, !!debouncedSearch);
  const matches: StudentMatch[] = (students.data?.rows ?? []).map((student) => ({
    id: student.id,
    name: student.name,
    detail: [
      [student.currentEnrollment?.classId?.name, student.currentEnrollment?.sectionId?.name]
        .filter(Boolean)
        .join(" - "),
      student.admissionNumber,
    ]
      .filter(Boolean)
      .join(" · "),
  }));
  const feeSummary = useGetStudentFeeSummary(organizationId, studentId);
  const reversePayment = useReversePayment(organizationId);
  useError({ mutation: reversePayment });

  // reversing cannot be undone, so it is confirmed first
  const confirmReverse = () => {
    if (!paymentToReverse) return;
    reversePayment.mutate(paymentToReverse, {
      onSuccess: () => {
        toast.success("Payment reversed.");
        setPaymentToReverse(null);
      },
    });
  };

  return {
    search,
    setSearch,
    debouncedSearch,
    matches,
    isSearching: !!debouncedSearch && students.isFetching,
    selected,
    pick: (match: StudentMatch) => {
      setSelected(match);
      setSearch("");
    },
    clearPick: () => setSelected(null),
    studentId,
    summaries: feeSummary.data?.items ?? [],
    isLoadingSummary: feeSummary.isLoading,
    summaryError: feeSummary.isError ? feeSummary.error : null,
    retrySummary: () => feeSummary.refetch(),
    paymentToReverse,
    setPaymentToReverse,
    confirmReverse,
    isReversing: reversePayment.isPending,
  };
};

export default useStudentFeesController;
