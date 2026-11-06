import { cn } from "@/shared/lib/utils";
import { Button, ButtonProps } from "@/shared/ui/kit/button";

// the round icon buttons in the header (support, notifications): one size for the button and for its icon, so they
// always match; the icon's own size class is overridden on purpose
const HeaderIconButton = ({ className, ...props }: ButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      "relative h-9 w-9 shrink-0 rounded-full p-0 text-gray-500 hover:text-primary-600 [&>svg]:h-5 [&>svg]:w-5",
      className
    )}
    {...props}
  />
);

export default HeaderIconButton;
