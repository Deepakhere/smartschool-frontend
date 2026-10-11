import { ChartPieIcon } from "@heroicons/react/24/outline";

// shown in place of a chart that has nothing to plot yet (e.g. a ratio of two zero
// counts) - a chart library drawing axes/connectors around no data looks broken,
// so this replaces the chart body while keeping the card's title and height
const ChartEmptyState = ({ title, message, height = 300 }: { title: string; message: string; height?: number }) => (
  <div style={{ height }} className="flex flex-col">
    <p className="mb-1 text-base font-medium text-gray-800 dark:text-gray-50">{title}</p>
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <ChartPieIcon className="h-8 w-8 text-gray-300" aria-hidden="true" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  </div>
);

export default ChartEmptyState;
