"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Lock, MoreHorizontal, Share } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleBrewSharing } from "./actions";

interface ShareBrewButtonProps {
  brewId: string;
  isPublic: boolean;
}

export function ShareBrewButton({ brewId, isPublic }: ShareBrewButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}/share/brew/${brewId}`);
  }, [brewId]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  function handleMakePublic() {
    startTransition(async () => {
      try {
        const result = await toggleBrewSharing(brewId, false);
        if (result.success) {
          setShowShareDialog(false);
          toast.success("Brew is now public");
        }
      } catch {
        toast.error("Failed to update sharing");
      }
    });
  }

  function handleMakePrivate() {
    startTransition(async () => {
      try {
        const result = await toggleBrewSharing(brewId, true);
        if (result.success) {
          toast.success("Brew is now private");
        }
      } catch {
        toast.error("Failed to update sharing");
      }
    });
  }

  if (isPublic) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          Public
        </Badge>
        <Button variant="default" size="sm" onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMakePrivate} disabled={isPending}>
              <Lock className="mr-2 h-4 w-4" />
              Make Private
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share className="mr-2 h-4 w-4" />
          Share Brew
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Brew</DialogTitle>
          <DialogDescription>
            Make this brew public so other coffee enthusiasts can view your
            brewing notes, parameters, and rating. You can make it private again
            at any time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setShowShareDialog(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleMakePublic} disabled={isPending}>
            <Share className="mr-2 h-4 w-4" />
            {isPending ? "Sharing..." : "Share Publicly"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
