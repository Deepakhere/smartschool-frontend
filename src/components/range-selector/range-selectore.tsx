import useRangeSelectorController from "./range-selectore-controller";

const RangeSelector = () => {
  const {
    date,
    currentMonth,
    quickSelectOptions,
    setDate,
    handleMonthChange,
    renderCalendar,
    formatDate,
  } = useRangeSelectorController();

  return (
    <div className="relative inline-block w-fit">
      <button
        className="flex items-center gap-2 px-4 py-2 border rounded-md"
        onClick={() =>
          document.getElementById("date-popover")?.classList.toggle("hidden")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {date?.from ? (
          date.to ? (
            <>
              {formatDate(date.from)} - {formatDate(date.to)}
            </>
          ) : (
            formatDate(date.from)
          )
        ) : (
          <span>Pick a date</span>
        )}
      </button>

      <div
        id="date-popover"
        className="absolute top-12 right-0 z-50 bg-white border rounded-lg shadow-lg hidden w-[720px]"
      >
        <div className="flex">
          <div className="border-r p-3 space-y-2 w-48">
            {quickSelectOptions.map((option) => (
              <button
                key={option.label}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                onClick={() => setDate(option.getValue())}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            <div className="flex gap-8">
              {/* Left Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => handleMonthChange("prev")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <span>
                    {currentMonth.left.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="h-8 w-8 flex items-center justify-center text-sm text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                  {renderCalendar(currentMonth.left)}
                </div>
              </div>

              {/* Right Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span>
                    {currentMonth.right.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button onClick={() => handleMonthChange("next")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="h-8 w-8 flex items-center justify-center text-sm text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                  {renderCalendar(currentMonth.right)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RangeSelector;
