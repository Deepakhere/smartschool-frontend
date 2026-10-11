import { ReactNode } from "react";
import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  // "neutral" for confirmations that change something without destroying it
  tone?: "danger" | "neutral";
}

// the one shared confirmation surface for every destructive/delete action in the
// app, built on Radix's AlertDialog so focus trapping, Escape-to-close and
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
  tone = "danger",
}: DeleteConfirmationDialogProps) => (
  <AlertDialog open={open} onOpenChange={(next) => !next && onClose()}>
    <AlertDialogContent>
      <div className="flex flex-col items-center p-4 text-center sm:p-6">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
            tone === "danger" ? "bg-red-100" : "bg-gray-100"
          }`}
        >
          {tone === "danger" ? (
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          ) : (
            <InformationCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          )}
        </div>
        <AlertDialogTitle className="mt-4">{title}</AlertDialogTitle>
        <AlertDialogDescription className="mt-2">{description}</AlertDialogDescription>

        <div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <AlertDialogCancel asChild>
            <Button variant="secondary" disabled={isLoading} className="sm:w-32">
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={tone === "danger" ? "danger" : "primary"}
              loading={isLoading}
              className="sm:w-32"
              onClick={(e) => {
                // the confirm handler decides when to close (only after the mutation succeeds)
                e.preventDefault();
                onConfirm();
              }}
            >
              {!isLoading && confirmLabel}
            </Button>
          </AlertDialogAction>
        </div>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteConfirmationDialog;
