import { useEffect, useMemo } from "react";

import CustomSelectDropdown from "@/shared/ui/custom-select";
import { Label } from "@/shared/ui/kit/label";
import { useGetAcademicYears, useGetClasses, useGetSections } from "@/entities/academics/api/academics-service";
import { SelectOption } from "@/shared/types";

export interface AcademicFilterValue {
  academicYearId: string;
  classId: string;
  sectionId: string;
}

interface AcademicFilterProps {
  organizationId: string;
  value: AcademicFilterValue;
  onChange: (value: AcademicFilterValue) => void;
}

// the select can't hold an empty value, so "All" is a sentinel that means no filter
const ALL = "all";
const fromOption = (id: string | number) => (String(id) === ALL ? "" : String(id));

// year, optional class, optional section; picks the current year first. For reports where "All" is a real choice
const AcademicFilter = ({ organizationId, value, onChange }: AcademicFilterProps) => {
  const years = useGetAcademicYears(organizationId);
  const classes = useGetClasses(organizationId, value.academicYearId || undefined, "active");
  const sections = useGetSections(organizationId, value.classId || undefined, "active");

  const yearItems = useMemo(() => years.data?.items ?? [], [years.data]);
  useEffect(() => {
    if (value.academicYearId || !yearItems.length) return;
    const current = yearItems.find((year) => year.isCurrent) ?? yearItems[0];
    onChange({ academicYearId: current.id, classId: "", sectionId: "" });
  }, [yearItems, value.academicYearId, onChange]);

  const toOption = (item: { id: string; name: string }): SelectOption => ({ id: item.id, name: item.name });
  const classOptions = [{ id: ALL, name: "All classes" }, ...(classes.data?.items ?? []).map(toOption)];
  const sectionOptions = [{ id: ALL, name: "All sections" }, ...(sections.data?.items ?? []).map(toOption)];
  const selected = (options: SelectOption[], id: string) => options.find((o) => String(o.id) === id) ?? null;

  return (
    <>
      <div>
        <Label>Academic year</Label>
        <CustomSelectDropdown
          placeholder="Select"
          options={yearItems.map(toOption)}
          value={selected(yearItems.map(toOption), value.academicYearId)}
          onChange={(o) => onChange({ academicYearId: String(o.id), classId: "", sectionId: "" })}
          emptyText="No academic years yet."
        />
      </div>
      <div>
        <Label>Class</Label>
        <CustomSelectDropdown
          placeholder="All classes"
          disabled={!value.academicYearId}
          options={classOptions}
          value={selected(classOptions, value.classId || ALL)}
          onChange={(o) => onChange({ ...value, classId: fromOption(o.id), sectionId: "" })}
        />
      </div>
      <div>
        <Label>Section</Label>
        <CustomSelectDropdown
          placeholder="All sections"
          disabled={!value.classId}
          options={sectionOptions}
          value={selected(sectionOptions, value.sectionId || ALL)}
          onChange={(o) => onChange({ ...value, sectionId: fromOption(o.id) })}
        />
      </div>
    </>
  );
};

export default AcademicFilter;
