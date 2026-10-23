import { ComponentType } from "react";

import { Button } from "@/components/ui/button";

export interface Action {
  label: string;
  onClick: () => void;
  icon?: ComponentType<{ className?: string }>;
  variant?: "primary" | "secondary" | "danger";
  // hover hint, e.g. why the button is disabled
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  // leave it out of the row, e.g. when the user lacks the permission
  hidden?: boolean;
}

// a row of buttons described as data, so headers and tables draw them the same way
const ActionButtons = ({ actions, variant = "secondary" }: { actions: Action[]; variant?: Action["variant"] }) => (
  <>
    {actions
      .filter((action) => !action.hidden)
      .map(({ label, onClick, icon: Icon, loading, disabled, title, variant: own }) => (
        <Button key={label} variant={own ?? variant} onClick={onClick} loading={loading} disabled={disabled} title={title}>
          {Icon && !loading && <Icon className="h-4 w-4" />}
          {label}
        </Button>
      ))}
  </>
);

export default ActionButtons;
