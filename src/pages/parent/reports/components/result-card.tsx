import { ArrowDownTrayIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

import { Button } from "@/shared/ui/kit/button";
import { cn } from "@/shared/lib/utils";
import { IResult, IResultSubjectRow } from "@/entities/exam";

const toneFor = (percent: number) =>
  percent >= 75 ? "bg-green-500" : percent >= 50 ? "bg-blue-500" : percent >= 33 ? "bg-amber-500" : "bg-red-500";

const subjectName = (row: IResultSubjectRow) => (typeof row.subjectId === "object" ? row.subjectId.name : "");

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
    <p className="text-lg font-semibold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const SubjectBar = ({ row }: { row: IResultSubjectRow }) => {
  const percent = row.max > 0 ? Math.round((row.obtained / row.max) * 100) : 0;
  return (
    <li className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium text-gray-900">{subjectName(row)}</span>
        {row.isAbsent ? (
          <span className="text-sm font-medium text-red-600">Absent</span>
        ) : (
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{row.obtained}</span> / {row.max}
            {row.grade && (
              <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium">{row.grade}</span>
            )}
          </span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
        {!row.isAbsent && (
          <div className={cn("h-full rounded-full", toneFor(percent))} style={{ width: `${percent}%` }} />
        )}
      </div>
    </li>
  );
};

interface ResultCardProps {
  result: IResult;
  isEmailing: boolean;
  onDownload: () => void;
  onEmail: () => void;
}

// one published result: the headline numbers first, then a bar per subject, then the report card actions
const ResultCard = ({ result, isEmailing, onDownload, onEmail }: ResultCardProps) => {
  const exam = typeof result.examId === "object" ? result.examId : null;
  const passed = result.promotionStatus === "pass";
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-gray-900">{exam?.name}</p>
          <p className="text-xs text-gray-500">
            {exam?.startDate && new Date(exam.startDate).toLocaleDateString()}
            {exam?.term && ` · ${exam.term}`}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
            passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}
        >
          {passed ? "Pass" : "Needs improvement"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Score" value={`${result.totals.percentage}%`} />
        <Stat label="Grade" value={result.grade || "-"} />
        <Stat label="GPA" value={result.gpa ?? "-"} />
      </div>

      {result.subjects.length === 0 ? (
        <p className="text-sm text-gray-500">No subjects in this result.</p>
      ) : (
        <ul className="space-y-3">
          {result.subjects.map((row, index) => (
            <SubjectBar key={index} row={row} />
          ))}
        </ul>
      )}

      {(result.rankInSection || result.rankInClass) && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
          {result.rankInSection && <span>Rank in section: {result.rankInSection}</span>}
          {result.rankInClass && <span>Rank in class: {result.rankInClass}</span>}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" size="sm" className="sm:flex-1" onClick={onDownload}>
          <ArrowDownTrayIcon className="h-4 w-4" />
          Download report card
        </Button>
        <Button variant="secondary" size="sm" className="sm:flex-1" disabled={isEmailing} onClick={onEmail}>
          <EnvelopeIcon className="h-4 w-4" />
          Email me a copy
        </Button>
      </div>
    </div>
  );
};

export default ResultCard;
