import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteInvoice } from "@/hooks/useInvoices";
import { toast } from "sonner";

interface DeleteInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: number | null;
  invoiceNumber: string;
}

export function DeleteInvoiceDialog({ open, onOpenChange, invoiceId, invoiceNumber }: DeleteInvoiceDialogProps) {
  const deleteInvoice = useDeleteInvoice();

  const handleDelete = async () => {
    if (!invoiceId) return;
    
    try {
      await deleteInvoice.mutateAsync(invoiceId);
      toast.success(`Invoice ${invoiceNumber} deleted successfully!`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete invoice");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete invoice <span className="font-semibold">{invoiceNumber}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteInvoice.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteInvoice.isPending} className="bg-destructive hover:bg-destructive/90">
            {deleteInvoice.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
