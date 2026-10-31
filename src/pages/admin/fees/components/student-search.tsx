import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

import { Input } from "@/shared/ui/kit/input";
import { cn } from "@/shared/lib/utils";
import { StudentMatch } from "../tabs/student-fees-controller";

interface StudentSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  matches: StudentMatch[];
  isSearching: boolean;
  hasQuery: boolean;
  selected: StudentMatch | null;
  onPick: (match: StudentMatch) => void;
  onClear: () => void;
}

// type a name or admission number, pick from the matches; arrow keys and Enter work too
const StudentSearch = ({
  search,
  onSearchChange,
  matches,
  isSearching,
  hasQuery,
  selected,
  onPick,
  onClear,
}: StudentSearchProps) => {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const showList = open && search.trim().length > 0;

  const pick = (match: StudentMatch) => {
    onPick(match);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!matches.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(matches[Math.min(active, matches.length - 1)]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
      <div className="relative w-full sm:w-96">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          role="combobox"
          aria-expanded={showList}
          aria-controls="student-matches"
          aria-label="Search students"
          placeholder="Find a student by name or admission number"
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="pl-9"
        />
        {showList && (
          <ul
            id="student-matches"
            role="listbox"
            className="absolute z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          >
            {matches.map((match, index) => (
              <li
                key={match.id}
                role="option"
                aria-selected={index === active}
                // mousedown, so the pick lands before the input's blur closes the list
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(match);
                }}
                onMouseEnter={() => setActive(index)}
                className={cn("cursor-pointer px-3 py-2", index === active && "bg-gray-100")}
              >
                <p className="text-sm font-medium text-gray-900">{match.name}</p>
                {match.detail && <p className="text-xs text-gray-500">{match.detail}</p>}
              </li>
            ))}
            {!matches.length && (
              <li className="px-3 py-2 text-sm text-gray-500">
                {isSearching || !hasQuery ? "Searching..." : "No student matches this."}
              </li>
            )}
          </ul>
        )}
      </div>

      {selected && (
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-1 text-sm">
          <span className="font-medium text-gray-900">{selected.name}</span>
          {selected.detail && <span className="text-gray-500">{selected.detail}</span>}
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear student"
            className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
