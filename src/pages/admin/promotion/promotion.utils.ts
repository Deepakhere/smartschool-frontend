import { IAcademicYear, IClass, IPromotionCandidate, ISection } from "@/types";

// the lanes of the board, in the order they show
export type Lane = "decide" | "promote" | "detain" | "pass_out" | "leave";

export const LANES: { key: Lane; title: string; hint: string }[] = [
  { key: "decide", title: "To decide", hint: "No published result yet" },
  { key: "promote", title: "Promote", hint: "Move up to the next class" },
  { key: "detain", title: "Repeat", hint: "Stay in the same class next year" },
  { key: "pass_out", title: "Pass out", hint: "Finished the final class; records are kept" },
  { key: "leave", title: "Leaving school", hint: "Transfer or withdrawal; records are kept" },
];

// where a student starts: their result decides, the final class passes out instead of promoting
export const startLane = (candidate: IPromotionCandidate, isFinalClass: boolean): Lane => {
  const status = candidate.result?.promotionStatus;
  if (!status || status === "pending") return "decide";
  if (status === "fail") return "detain";
  return isFinalClass ? "pass_out" : "promote";
};

// the year that starts next after the given one
export const nextYearOf = (years: IAcademicYear[], yearId: string) => {
  const current = years.find((year) => year.id === yearId);
  if (!current) return undefined;
  return [...years]
    .filter((year) => new Date(year.startDate) > new Date(current.startDate))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
};

// classes in school order: by level or set order, then naturally by name ("Grade 9" before "Grade 10")
export const inSchoolOrder = (classes: IClass[]) =>
  [...classes].sort(
    (a, b) =>
      (a.numericLevel ?? a.sequence ?? 0) - (b.numericLevel ?? b.sequence ?? 0) ||
      a.name.localeCompare(b.name, undefined, { numeric: true })
  );

// the class `step` places after the given one, found in the other year by name, else by position
export const classAfter = (
  sourceClasses: IClass[],
  targetClasses: IClass[],
  sourceClass: IClass | undefined,
  step: number
) => {
  const source = inSchoolOrder(sourceClasses);
  const index = source.findIndex((klass) => klass.id === sourceClass?.id);
  const wanted = index < 0 ? undefined : source[index + step];
  if (!wanted) return undefined;
  return targetClasses.find((klass) => klass.name === wanted.name) ?? inSchoolOrder(targetClasses)[index + step];
};

// the section to land in: the one with the same name, or the class's first
export const sectionIn = (sections: ISection[], classId: string | undefined, sectionName: string | undefined) => {
  const own = sections.filter((section) => section.classId === classId);
  return own.find((section) => section.name === sectionName) ?? own[0];
};

// new roll numbers in a section, by name, after the students already there
export const rollNumbersFor = (names: { id: string; name: string }[], alreadyThere = 0) =>
  Object.fromEntries(
    [...names]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((student, index) => [student.id, String(alreadyThere + index + 1)])
  );
