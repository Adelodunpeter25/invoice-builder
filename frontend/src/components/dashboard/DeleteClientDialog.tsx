import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteClient } from "@/hooks/useClients";
import { toast } from "sonner";

interface DeleteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: number | null;
  clientName: string;
}

export function DeleteClientDialog({ open, onOpenChange, clientId, clientName }: DeleteClientDialogProps) {
  const deleteClient = useDeleteClient();

  const handleDelete = async () => {
    if (!clientId) return;
    
    try {
      await deleteClient.mutateAsync(clientId);
      toast.success("Client deleted successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete client");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Client</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{clientName}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteClient.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteClient.isPending} className="bg-destructive hover:bg-destructive/90">
            {deleteClient.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
