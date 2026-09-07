import { ReactNode } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <AlertDialogTitle className="mt-4">{title}</AlertDialogTitle>
        <AlertDialogDescription className="mt-2">{description}</AlertDialogDescription>

        <div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <AlertDialogCancel disabled={isLoading} className="mt-0 sm:w-32">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            className="sm:w-32"
            onClick={(e) => {
              // AlertDialogAction closes the dialog on click by default; the confirm
              // handler decides when to close (only after the mutation succeeds)
              e.preventDefault();
              onConfirm();
            }}
          >
            {isLoading ? <ButtonSpinner /> : confirmLabel}
          </AlertDialogAction>
        </div>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteConfirmationDialog;
