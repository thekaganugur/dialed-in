"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteBeanButtonProps {
  beanId: string;
  beanName: string;
  brewCount: number;
  deleteAction: (beanId: string) => Promise<void>;
}

export function DeleteBeanButton({
  beanId,
  beanName,
  brewCount,
  deleteAction,
}: DeleteBeanButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const canDelete = brewCount === 0;

  const handleDelete = () => {
    if (!canDelete) return;
    
    startTransition(async () => {
      try {
        await deleteAction(beanId);
        toast.success("Bean deleted successfully");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete bean");
      }
    });
  };

  const handleViewBrews = () => {
    router.push(`/app/brews?bean=${beanId}`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          <Trash2 className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {canDelete ? "Delete Coffee Bean" : "Cannot Delete Bean"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete
              ? `Are you sure you want to delete "${beanName}"? This action cannot be undone.`
              : `Cannot delete "${beanName}" because it has ${brewCount} associated brew${brewCount === 1 ? '' : 's'}. Delete the brews first, then you can delete this bean.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          {canDelete ? (
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={handleViewBrews}>
              <Eye className="h-4 w-4 mr-2" />
              View Brews
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

