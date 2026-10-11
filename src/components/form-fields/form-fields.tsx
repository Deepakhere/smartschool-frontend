import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import CustomSelectDropdown from "@/components/custom-select";
import DatePicker from "@/components/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types";

interface FieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const TextField = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  disabled,
  className,
  type = "text",
  placeholder,
  autoFocus,
  min,
  max,
  step,
}: FieldProps<T> & {
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            value={field.value ?? ""}
            type={type}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

export const TextareaField = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  disabled,
  className,
  placeholder,
  rows = 3,
}: FieldProps<T> & { placeholder?: string; rows?: number }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea {...field} value={field.value ?? ""} rows={rows} placeholder={placeholder} disabled={disabled} />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

export const SelectField = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  disabled,
  className,
  options,
  placeholder = "Select",
  onValueChange,
}: FieldProps<T> & {
  options: SelectOption[];
  placeholder?: string;
  // called with the chosen id after the form value has been updated
  onValueChange?: (id: string) => void;
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <CustomSelectDropdown
            placeholder={placeholder}
            disabled={disabled}
            options={options}
            value={options.find((option) => String(option.id) === String(field.value)) ?? null}
            onChange={(option) => {
              field.onChange(String(option.id));
              onValueChange?.(String(option.id));
            }}
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

// value is a YYYY-MM-DD string
export const DateField = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  disabled,
  className,
  min,
  max,
}: FieldProps<T> & { min?: string; max?: string }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <DatePicker value={field.value ?? ""} onChange={field.onChange} disabled={disabled} min={min} max={max} />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

export const CheckboxField = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  disabled,
  className,
}: FieldProps<T>) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <div className="flex items-center gap-2">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              disabled={disabled}
            />
          </FormControl>
          <FormLabel className="mb-0 font-normal">{label}</FormLabel>
        </div>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

// holds the chosen File; the input remounts when the value is cleared so the browser forgets the old file
export const FileField = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  disabled,
  className,
  accept,
}: FieldProps<T> & { accept?: string }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            key={field.value ? "chosen" : "empty"}
            type="file"
            accept={accept}
            disabled={disabled}
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

// multi-select as toggle chips, for short lists such as classes or sections; value is an array of ids
export const ChipsField = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  disabled,
  className,
  options,
  emptyText,
  onToggle,
}: FieldProps<T> & {
  options: SelectOption[];
  emptyText?: string;
  // called with the next list, after the form value has been updated
  onToggle?: (next: string[]) => void;
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => {
      const selected: string[] = field.value ?? [];
      return (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-wrap gap-2">
            {options.length === 0 && emptyText && <p className="text-sm text-gray-500">{emptyText}</p>}
            {options.map((option) => {
              const id = String(option.id);
              const isOn = selected.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  disabled={disabled}
                  aria-pressed={isOn}
                  onClick={() => {
                    const next = isOn ? selected.filter((value) => value !== id) : [...selected, id];
                    field.onChange(next);
                    onToggle?.(next);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50",
                    isOn ? "border-primary-300 bg-primary-100 text-primary-800" : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {option.name}
                </button>
              );
            })}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      );
    }}
  />
);
