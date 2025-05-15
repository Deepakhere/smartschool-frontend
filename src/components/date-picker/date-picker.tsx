import { useState, useRef, useEffect } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  min?: string;
  max?: string;
  dateFormat?: string;
}

const DatePicker = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  disabled = false,
  required = false,
  name,
  id,
  min,
  max,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayDate = value
    ? new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(value))
    : "";

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.showPicker();
        }, 0);
      }
    }
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative" ref={datePickerRef}>
        <div
          className={`relative w-full cursor-pointer rounded-md border ${
            isOpen
              ? "border-indigo-500 ring-1 ring-indigo-500"
              : "border-gray-300"
          } bg-white py-2 pl-3 pr-10 text-left shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 sm:text-sm`}
          onClick={toggleCalendar}
        >
          <div className="flex items-center">
            {displayDate ? (
              <span className="block truncate">{displayDate}</span>
            ) : (
              <span className="block truncate text-gray-500">
                {placeholder}
              </span>
            )}
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <CalendarIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>

          <input
            ref={inputRef}
            type="date"
            id={id}
            name={name}
            value={value}
            onChange={handleDateChange}
            min={min}
            max={max}
            required={required}
            disabled={disabled}
            className="sr-only"
            onBlur={() => setIsOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
