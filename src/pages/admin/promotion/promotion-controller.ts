import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useGetAcademicYears, useGetClasses, useGetSections } from "../classes/service/academics-service";
import { useGetPromotionCandidates, useProcessPromotions } from "./service/promotion-service";
import { PromotionAction } from "@/types";

interface RowState {
  action: PromotionAction;
  rollNumber: string;
}

const defaultActionFor = (promotionStatus?: string): PromotionAction =>
  promotionStatus === "fail" ? "detain" : "promote";

export const usePromotionController = () => {
  const { organizationId = "" } = useParams();

  const [sourceAcademicYearId, setSourceAcademicYearId] = useState("");
  const [sourceClassId, setSourceClassId] = useState("");
  const [sourceSectionId, setSourceSectionId] = useState("");

  const [targetAcademicYearId, setTargetAcademicYearId] = useState("");
  const [targetClassId, setTargetClassId] = useState("");
  const [targetSectionId, setTargetSectionId] = useState("");
  // detained students repeat a class, so they go into a (usually lower) class of the target year too
  const [detainClassId, setDetainClassId] = useState("");
  const [detainSectionId, setDetainSectionId] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  // kept apart from the list: promoted students leave the section, and their outcome must still show
  const [lastRun, setLastRun] = useState<{ name: string; action: PromotionAction; success: boolean; message?: string }[]>([]);

  const [rowsState, setRowsState] = useState<Record<string, RowState>>({});
  const [resultsByStudent, setResultsByStudent] = useState<Record<string, { success: boolean; message?: string }>>({});

  const academicYears = useGetAcademicYears(organizationId);
  const sourceClasses = useGetClasses(organizationId, sourceAcademicYearId);
  const sourceSections = useGetSections(organizationId, sourceClassId);
  const targetClasses = useGetClasses(organizationId, targetAcademicYearId, "active");
  const targetSections = useGetSections(organizationId, targetClassId, "active");
  const detainSections = useGetSections(organizationId, detainClassId, "active");

  const candidates = useGetPromotionCandidates(organizationId, sourceAcademicYearId, sourceSectionId);
  const processPromotions = useProcessPromotions(organizationId);

  useEffect(() => {
    if (!candidates.data?.items) return;
    setRowsState((prev) => {
      const next = { ...prev };
      for (const item of candidates.data!.items) {
        if (!next[item.student.id]) {
          next[item.student.id] = {
            action: defaultActionFor(item.result?.promotionStatus),
            rollNumber: item.rollNumber,
          };
        }
      }
      return next;
    });
  }, [candidates.data]);

  // outcomes belong to one section's run, so they are cleared only when the section changes
  useEffect(() => {
    setResultsByStudent({});
    setLastRun([]);
  }, [sourceSectionId]);

  const setSourceAcademicYear = (id: string) => {
    setSourceAcademicYearId(id);
    setSourceClassId("");
    setSourceSectionId("");
  };
  const setSourceClass = (id: string) => {
    setSourceClassId(id);
    setSourceSectionId("");
  };
  const setTargetAcademicYear = (id: string) => {
    setTargetAcademicYearId(id);
    setTargetClassId("");
    setTargetSectionId("");
    setDetainClassId("");
    setDetainSectionId("");
  };
  const setDetainClass = (id: string) => {
    setDetainClassId(id);
    setDetainSectionId("");
  };
  const setTargetClass = (id: string) => {
    setTargetClassId(id);
    setTargetSectionId("");
  };

  const setRowAction = (studentId: string, action: PromotionAction) => {
    setRowsState((prev) => ({ ...prev, [studentId]: { ...prev[studentId], action } }));
  };
  const setRowRollNumber = (studentId: string, rollNumber: string) => {
    setRowsState((prev) => ({ ...prev, [studentId]: { ...prev[studentId], rollNumber } }));
  };

  const actionOf = (studentId: string): PromotionAction => rowsState[studentId]?.action || "promote";
  const counts = (candidates.data?.items || []).reduce(
    (acc, item) => ({ ...acc, [actionOf(item.student.id)]: (acc[actionOf(item.student.id)] || 0) + 1 }),
    {} as Partial<Record<PromotionAction, number>>
  );

  // checks the destinations, then asks for confirmation: these changes cannot be undone from here
  const handleProcess = () => {
    if (!candidates.data?.items.length) return;
    if (counts.promote && (!targetAcademicYearId || !targetClassId || !targetSectionId)) {
      toast.error("Select the target year, class and section for promoted students.");
      return;
    }
    if (counts.detain && (!targetAcademicYearId || !detainClassId || !detainSectionId)) {
      toast.error("Select the class and section in the target year for detained students.");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmProcess = () => {
    const items = candidates.data?.items || [];
    const decisions = items.map((item) => {
      const action = actionOf(item.student.id);
      if (action === "promote" || action === "detain") {
        return {
          studentId: item.student.id,
          action,
          academicYearId: targetAcademicYearId,
          classId: action === "promote" ? targetClassId : detainClassId,
          sectionId: action === "promote" ? targetSectionId : detainSectionId,
          rollNumber: rowsState[item.student.id]?.rollNumber || item.rollNumber,
        };
      }
      return { studentId: item.student.id, action };
    });

    processPromotions.mutate(decisions, {
      onSuccess: (data) => {
        const map: Record<string, { success: boolean; message?: string }> = {};
        for (const r of data.items) map[r.studentId] = { success: r.success, message: r.message };
        setResultsByStudent(map);
        setLastRun(
          items.map((item) => ({
            name: item.student.name,
            action: actionOf(item.student.id),
            success: map[item.student.id]?.success ?? false,
            message: map[item.student.id]?.message,
          }))
        );
        setConfirmOpen(false);
        const failedCount = data.items.filter((r) => !r.success).length;
        if (failedCount === 0) toast.success("All students processed successfully.");
        else toast.error(`${failedCount} of ${data.items.length} failed, see details below.`);
      },
      onError: (error) => {
        setConfirmOpen(false);
        toast.error(error?.response?.Error?.message || "Failed to process promotions");
      },
    });
  };

  return {
    academicYears: academicYears.data?.items || [],
    sourceAcademicYearId,
    setSourceAcademicYear,
    sourceClasses: sourceClasses.data?.items || [],
    sourceClassId,
    setSourceClass,
    sourceSections: sourceSections.data?.items || [],
    sourceSectionId,
    setSourceSectionId,
    targetAcademicYearId,
    setTargetAcademicYear,
    targetClasses: targetClasses.data?.items || [],
    targetClassId,
    setTargetClass,
    targetSections: targetSections.data?.items || [],
    targetSectionId,
    setTargetSectionId,
    detainClassId,
    setDetainClass,
    detainSections: detainSections.data?.items || [],
    detainSectionId,
    setDetainSectionId,
    counts,
    confirmOpen,
    setConfirmOpen,
    confirmProcess,
    lastRun,
    candidates: candidates.data?.items || [],
    isLoadingCandidates: candidates.isLoading,
    rowsState,
    setRowAction,
    setRowRollNumber,
    resultsByStudent,
    handleProcess,
    isProcessing: processPromotions.isPending,
  };
};
