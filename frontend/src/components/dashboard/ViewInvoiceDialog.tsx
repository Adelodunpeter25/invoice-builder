import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Invoice } from "@/types/invoice";
import { formatCurrency } from "@/lib/currency";

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
      case "sent": return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "overdue": return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "draft": return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      case "cancelled": return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
    }
  };

  const calculateLineTotal = (quantity: number, unitPrice: number, taxRate: number) => {
    const subtotal = quantity * unitPrice;
    const tax = subtotal * (taxRate / 100);
    return subtotal + tax;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Number</p>
              <p className="font-semibold">{invoice.invoice_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={getStatusColor(invoice.status)} variant="secondary">
                {invoice.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Issue Date</p>
              <p className="font-semibold">{new Date(invoice.issue_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-semibold">{new Date(invoice.due_date).toLocaleDateString()}</p>
            </div>
          </div>

          {invoice.payment_terms && (
            <div>
              <p className="text-sm text-muted-foreground">Payment Terms</p>
              <p className="text-sm">{invoice.payment_terms}</p>
            </div>
          )}

          {invoice.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm">{invoice.notes}</p>
            </div>
          )}

          {invoice.line_items && invoice.line_items.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Line Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Tax %</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.line_items.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unit_price, invoice.currency)}
                        </TableCell>
                        <TableCell className="text-right">{item.tax_rate}%</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            calculateLineTotal(item.quantity, item.unit_price, item.tax_rate),
                            invoice.currency
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          <Separator />
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(invoice.amount, invoice.currency)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
