import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

// plain title + one-line description, no card background — the consistent
// "what is this section" block used at the top of a page's content area
const SectionHeader = ({ title, description, actions, className = "" }: SectionHeaderProps) => (
  <div className={`flex justify-between items-start gap-4 mb-6 ${className}`}>
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
  </div>
);

export default SectionHeader;
