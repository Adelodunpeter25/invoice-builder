import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Send, MoreVertical } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CreateInvoiceModal } from "@/components/dashboard/CreateInvoiceModal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { toast } from "sonner";
import { useInvoices, useDeleteInvoice } from "@/hooks/useInvoices";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: invoicesData, isLoading } = useInvoices({ page: 1, page_size: 5 });
  const deleteInvoice = useDeleteInvoice();

  const invoices = invoicesData?.items || [];

  const stats = {
    totalRevenue: invoices.reduce((sum: number, inv: any) => sum + inv.total_amount, 0),
    paidInvoices: invoices.filter((inv: any) => inv.status === "paid").length,
    pendingAmount: invoices
      .filter((inv: any) => inv.status === "pending")
      .reduce((sum: number, inv: any) => sum + inv.total_amount, 0),
    overdueCount: invoices.filter((inv: any) => inv.status === "overdue").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20";
      case "overdue":
        return "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20";
    }
  };

  const handleDownload = async (invoiceId: number, invoiceNumber: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/invoices/${invoiceId}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const handleSend = async (invoiceId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Invoice sent successfully!");
    } catch (error) {
      toast.error("Failed to send invoice");
    }
  };

  const handleView = (invoiceId: number) => {
    toast.info("View invoice details coming soon");
  };

  const handleEdit = (invoiceId: number) => {
    toast.info("Edit invoice coming soon");
  };

  const handleDelete = async (invoiceId: number) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice.mutateAsync(invoiceId);
        toast.success("Invoice deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete invoice");
      }
    }
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 sm:px-6 py-4">
              <SidebarTrigger className="shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Dashboard</h1>
                <p className="text-sm text-muted-foreground truncate">
                  Welcome back, {user?.username}! Here's your invoice overview.
                </p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} variant="hero" className="gap-2 w-full sm:w-auto shrink-0">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Invoice</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              <motion.div variants={fadeIn}>
                <Card className="shadow-card border-border h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">All time earnings</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="shadow-card border-border h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Paid Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold">{stats.paidInvoices}</div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Successfully completed</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="shadow-card border-border h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold">₦{stats.pendingAmount.toLocaleString()}</div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Awaiting payment</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="shadow-card border-border h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-destructive">{stats.overdueCount}</div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Need attention</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="shadow-card border-border">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="text-lg sm:text-xl">Recent Invoices</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/invoices')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No invoices yet. Create your first invoice to get started!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                      <div className="inline-block min-w-full align-middle">
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
                                <td className="py-4 px-2 font-semibold">₦{invoice.total_amount.toLocaleString()}</td>
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
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7 sm:h-8 sm:w-8"
                                      onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                                    >
                                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7 sm:h-8 sm:w-8"
                                      onClick={() => handleSend(invoice.id)}
                                    >
                                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                          <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleView(invoice.id)}>View</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEdit(invoice.id)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(invoice.id)} className="text-destructive">
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
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      <CreateInvoiceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </SidebarProvider>
  );
};

export default Dashboard;
