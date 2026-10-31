import { ReactNode } from "react";
import { AdjustmentsHorizontalIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

import CustomSelectDropdown from "@/shared/ui/custom-select";
import { Label } from "@/shared/ui/kit/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/kit/popover";
import useAcademicFilterController, { ALL, AcademicFilterValue, fromOption } from "../model/academic-filter-controller";

interface AcademicFilterProps {
  organizationId: string;
  value: AcademicFilterValue;
  onChange: (value: AcademicFilterValue) => void;
  // more fields for the same panel, and how they read in the button's summary
  extra?: ReactNode;
  extraSummary?: string;
}

// one button that reads out the chosen year, class and section; the choices open in a small panel
const AcademicFilter = ({ organizationId, value, onChange, extra, extraSummary }: AcademicFilterProps) => {
  const c = useAcademicFilterController(organizationId, value, onChange);
  const summary = [c.summary, extraSummary].filter(Boolean).join(" · ");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 max-w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">{summary || "Filters"}</span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-3 p-4">
        <div>
          <Label>Academic year</Label>
          <CustomSelectDropdown
            placeholder="Select"
            options={c.yearOptions}
            value={c.selected(c.yearOptions, value.academicYearId)}
            onChange={(o) => onChange({ academicYearId: String(o.id), classId: "", sectionId: "" })}
            emptyText="No academic years yet."
          />
        </div>
        <div>
          <Label>Class</Label>
          <CustomSelectDropdown
            placeholder="All classes"
            disabled={!value.academicYearId}
            options={c.classOptions}
            value={c.selected(c.classOptions, value.classId || ALL)}
            onChange={(o) => onChange({ ...value, classId: fromOption(o.id), sectionId: "" })}
          />
        </div>
        <div>
          <Label>Section</Label>
          <CustomSelectDropdown
            placeholder="All sections"
            disabled={!value.classId}
            options={c.sectionOptions}
            value={c.selected(c.sectionOptions, value.sectionId || ALL)}
            onChange={(o) => onChange({ ...value, sectionId: fromOption(o.id) })}
          />
        </div>
        {extra}
      </PopoverContent>
    </Popover>
  );
};

export default AcademicFilter;
