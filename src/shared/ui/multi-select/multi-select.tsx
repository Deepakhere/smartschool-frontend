import { useMemo, useState } from "react";
import { ChevronUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

import { Checkbox } from "@/shared/ui/kit/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/kit/popover";
import { cn } from "@/shared/lib/utils";
import { SelectOption } from "@/shared/types";

export interface MultiOption extends SelectOption {
  // options sharing a group are listed under it, e.g. sections under their class
  group?: string;
  // the name inside its group, e.g. "A" under "Grade 6"
  short?: string;
}

interface MultiSelectProps {
  options: MultiOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
}

const SHOWN = 3;

// picks many from a list of any length: the box reads out the picks, the panel searches and groups the choices
const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select",
  emptyText,
  disabled,
  id,
  invalid,
}: MultiSelectProps) => {
  const [query, setQuery] = useState("");
  const picked = new Set(value);
  const names = options.filter((o) => picked.has(String(o.id))).map((o) => o.name);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => `${o.group ?? ""} ${o.name}`.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const groups = useMemo(() => {
    const byGroup = new Map<string, MultiOption[]>();
    for (const option of visible) byGroup.set(option.group ?? "", [...(byGroup.get(option.group ?? "") ?? []), option]);
    return [...byGroup.entries()];
  }, [visible]);

  const setMany = (ids: string[], on: boolean) =>
    onChange(on ? [...new Set([...value, ...ids])] : value.filter((v) => !ids.includes(v)));
  const visibleIds = visible.map((o) => String(o.id));
  const allVisibleOn = visibleIds.length > 0 && visibleIds.every((v) => picked.has(v));

  return (
    <Popover onOpenChange={(open) => !open && setQuery("")}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled || options.length === 0}
          aria-invalid={invalid}
          className={cn(
            "flex min-h-[38px] w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-1.5 text-left text-sm shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-60",
            invalid ? "border-red-400" : "border-gray-300"
          )}
        >
          <span className="flex min-w-0 flex-wrap gap-1">
            {names.length === 0 && (
              <span className="text-gray-400">{options.length === 0 && emptyText ? emptyText : placeholder}</span>
            )}
            {names.slice(0, SHOWN).map((name) => (
              <span key={name} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
                {name}
              </span>
            ))}
            {names.length > SHOWN && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                +{names.length - SHOWN} more
              </span>
            )}
          </span>
          <ChevronUpDownIcon className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-64 p-0">
        {options.length > 6 && (
          <div className="relative border-b border-gray-100 p-2">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search options"
              className="w-full rounded-md border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
        )}
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 text-xs">
          <button
            type="button"
            className="font-medium text-primary-600 hover:underline disabled:opacity-50"
            disabled={visibleIds.length === 0}
            onClick={() => setMany(visibleIds, !allVisibleOn)}
          >
            {allVisibleOn ? "Clear these" : `Select all${query ? " shown" : ""}`}
          </button>
          <span className="text-gray-500">{value.length} selected</span>
        </div>
        <div className="max-h-64 overflow-y-auto py-1" role="listbox" aria-multiselectable>
          {visible.length === 0 && <p className="px-3 py-3 text-sm text-gray-500">No match.</p>}
          {groups.map(([group, items]) => {
            const ids = items.map((o) => String(o.id));
            const groupOn = ids.every((v) => picked.has(v));
            return (
              <div key={group || "_"}>
                {group && (
                  <label className="flex cursor-pointer items-center gap-2 px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-700">
                    <Checkbox checked={groupOn} onChange={() => setMany(ids, !groupOn)} />
                    {group}
                  </label>
                )}
                {items.map((option) => {
                  const optionId = String(option.id);
                  return (
                    <label
                      key={optionId}
                      role="option"
                      aria-selected={picked.has(optionId)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 py-1.5 pr-3 text-sm text-gray-700 hover:bg-gray-50",
                        group ? "pl-8" : "pl-3"
                      )}
                    >
                      <Checkbox
                        checked={picked.has(optionId)}
                        onChange={() => setMany([optionId], !picked.has(optionId))}
                      />
                      {option.short ?? option.name}
                    </label>
                  );
                })}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
