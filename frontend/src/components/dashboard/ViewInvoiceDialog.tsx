import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  date: string;
  dueDate: string;
}

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function ViewInvoiceDialog({ open, onOpenChange, invoice }: ViewInvoiceDialogProps) {
  if (!invoice) return null;

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid": return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "pending": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "overdue": return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "draft": return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Number</p>
              <p className="font-semibold">{invoice.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={getStatusColor(invoice.status)} variant="secondary">
                {invoice.status}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Client</p>
            <p className="font-semibold">{invoice.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-2xl font-bold">₦{invoice.amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Issue Date</p>
              <p className="font-semibold">{invoice.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-semibold">{invoice.dueDate}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
