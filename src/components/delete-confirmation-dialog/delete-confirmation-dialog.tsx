import { ReactNode } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import ButtonSpinner from "../../icons/button-spinner";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

// the one shared confirmation surface for every destructive/delete action in the
// app — built on Radix's AlertDialog so focus trapping, Escape-to-close and
// overlay click are all handled correctly instead of each screen hand-rolling it
const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: DeleteConfirmationDialogProps) => (
  <AlertDialog open={open} onOpenChange={(next) => !next && onClose()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction
          disabled={isLoading}
          onClick={(e) => {
            // AlertDialogAction closes the dialog on click by default; the confirm
            // handler decides when to close (only after the mutation succeeds)
            e.preventDefault();
            onConfirm();
          }}
        >
          {isLoading ? <ButtonSpinner /> : confirmLabel}
        </AlertDialogAction>
        <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteConfirmationDialog;
