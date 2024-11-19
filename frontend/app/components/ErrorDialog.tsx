import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { getErrorMessage } from "../errors";

type Props = Readonly<{
  error: unknown;
  onClose?(): false | void;
  title?: string;
}>;

export function ErrorDialog({ error, onClose, title }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          if (!onClose || onClose() !== false) {
            setIsOpen(false);
          }
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {title ?? "We encountered the following error"}
          </AlertDialogTitle>
          <AlertDialogDescription className="border-l-4 border-muted p-4 italic">
            {getErrorMessage(error, "Unknown")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button>Close</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
