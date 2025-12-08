import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Send, MoreVertical, Eye, Edit, Trash, Copy } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CreateInvoiceModal } from "@/components/dashboard/CreateInvoiceModal";
import { ViewInvoiceDialog } from "@/components/dashboard/ViewInvoiceDialog";
import { DeleteInvoiceDialog } from "@/components/dashboard/DeleteInvoiceDialog";
import { SendInvoiceModal } from "@/components/dashboard/SendInvoiceModal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { toast } from "sonner";
import { useInvoices, useDeleteInvoice, useCloneInvoice } from "@/hooks/useInvoices";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getCurrencySymbol, formatCurrency } from "@/lib/currency";
import { CurrencyAmount } from "@/components/CurrencyAmount";

const Invoices = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const { user } = useAuth();
  const { data: allInvoices, isLoading } = useInvoices({});
  const deleteInvoice = useDeleteInvoice();
  const cloneInvoice = useCloneInvoice();

  const currencySymbol = getCurrencySymbol(user?.preferred_currency || 'NGN');
  const userCurrency = user?.preferred_currency || 'NGN';
  const allInvoicesList = allInvoices?.items || [];

  // Filter invoices locally instead of making separate API calls
  const { draftInvoices, sentInvoices, paidInvoices, overdueInvoices } = useMemo(() => ({
    draftInvoices: allInvoicesList.filter((inv: any) => inv.status === 'draft'),
    sentInvoices: allInvoicesList.filter((inv: any) => inv.status === 'sent'),
    paidInvoices: allInvoicesList.filter((inv: any) => inv.status === 'paid'),
    overdueInvoices: allInvoicesList.filter((inv: any) => inv.status === 'overdue'),
  }), [allInvoicesList]);

  // Get invoices based on active tab
  const invoices = useMemo(() => {
    switch (activeTab) {
      case 'draft': return draftInvoices;
      case 'sent': return sentInvoices;
      case 'paid': return paidInvoices;
      case 'overdue': return overdueInvoices;
      default: return allInvoicesList;
    }
  }, [activeTab, allInvoicesList, draftInvoices, sentInvoices, paidInvoices, overdueInvoices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20";
      case "sent": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20";
      case "overdue": return "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20";
      case "draft": return "bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20";
      case "cancelled": return "bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20";
      default: return "bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20";
    }
  };

  const handleDownload = async (invoice: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/invoices/${invoice.id}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Downloaded ${invoice.invoice_number}`);
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const handleSend = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsSendModalOpen(true);
  };

  const handleView = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (invoice: any) => {
    navigate(`/dashboard/invoices/${invoice.id}/edit`);
  };

  const handleClone = async (invoice: any) => {
    try {
      await cloneInvoice.mutateAsync(invoice.id);
      toast.success(`Cloned ${invoice.invoice_number}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to clone invoice");
    }
  };

  const handleDelete = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const InvoiceTable = ({ invoices }: { invoices: any[] }) => (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      {invoices.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No invoices found.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="text-left text-xs sm:text-sm">
              <th className="pb-3 font-medium text-muted-foreground px-2 sm:px-0">Invoice</th>
              <th className="pb-3 font-medium text-muted-foreground px-2">Client</th>
              <th className="pb-3 font-medium text-muted-foreground px-2">Amount</th>
              <th className="pb-3 font-medium text-muted-foreground px-2">Status</th>
              <th className="pb-3 font-medium text-muted-foreground px-2 hidden sm:table-cell">Due Date</th>
              <th className="pb-3 font-medium text-muted-foreground px-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((invoice: any) => (
              <tr key={invoice.id} className="text-xs sm:text-sm">
                <td className="py-4 px-2 sm:px-0 font-medium">{invoice.invoice_number}</td>
                <td className="py-4 px-2">{invoice.client?.name || 'N/A'}</td>
                <td className="py-4 px-2 font-semibold">
                  <CurrencyAmount 
                    amount={invoice.amount} 
                    fromCurrency={invoice.currency} 
                    toCurrency={userCurrency}
                  />
                </td>
                <td className="py-4 px-2">
                  <Badge className={getStatusColor(invoice.status)} variant="secondary">
                    {invoice.status}
                  </Badge>
                </td>
                <td className="py-4 px-2 text-muted-foreground hidden sm:table-cell">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => handleDownload(invoice)}>
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => handleSend(invoice)}>
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                          <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(invoice)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleClone(invoice)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Clone
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(invoice)} className="text-destructive">
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 sm:px-6 py-4">
              <SidebarTrigger className="shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Invoices</h1>
                <p className="text-sm text-muted-foreground truncate">Manage all your invoices</p>
              </div>
              <Button onClick={() => navigate('/dashboard/invoices/new')} variant="hero" className="gap-2 w-full sm:w-auto shrink-0">
                <Plus className="w-4 h-4" />
                <span>Create Invoice</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">All Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All ({allInvoicesList.length})</TabsTrigger>
                      <TabsTrigger value="draft">Draft ({draftInvoices.length})</TabsTrigger>
                      <TabsTrigger value="sent">Sent ({sentInvoices.length})</TabsTrigger>
                      <TabsTrigger value="paid">Paid ({paidInvoices.length})</TabsTrigger>
                      <TabsTrigger value="overdue">Overdue ({overdueInvoices.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                      <InvoiceTable invoices={invoices} />
                    </TabsContent>
                    <TabsContent value="draft">
                      <InvoiceTable invoices={draftInvoices} />
                    </TabsContent>
                    <TabsContent value="sent">
                      <InvoiceTable invoices={sentInvoices} />
                    </TabsContent>
                    <TabsContent value="paid">
                      <InvoiceTable invoices={paidInvoices} />
                    </TabsContent>
                    <TabsContent value="overdue">
                      <InvoiceTable invoices={overdueInvoices} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      <CreateInvoiceModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      <ViewInvoiceDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} invoice={selectedInvoice} />
      <DeleteInvoiceDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        invoiceId={selectedInvoice?.id || null}
        invoiceNumber={selectedInvoice?.invoice_number || ""}
      />
      <SendInvoiceModal 
        open={isSendModalOpen} 
        onOpenChange={setIsSendModalOpen} 
        invoiceId={selectedInvoice?.id || 0}
        clientEmail={selectedInvoice?.client?.email}
      />
    </SidebarProvider>
  );
};

export default Invoices;
