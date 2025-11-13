import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, Send, MoreVertical } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CreateInvoiceModal } from "@/components/dashboard/CreateInvoiceModal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { toast } from "sonner";

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
}

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      clientName: "Acme Corporation",
      amount: 2500,
      status: "paid",
      date: "2025-01-10",
      dueDate: "2025-02-10",
    },
    {
      id: "INV-002",
      clientName: "Tech Startup Inc",
      amount: 1750,
      status: "pending",
      date: "2025-01-15",
      dueDate: "2025-02-15",
    },
    {
      id: "INV-003",
      clientName: "Design Studio",
      amount: 3200,
      status: "overdue",
      date: "2024-12-20",
      dueDate: "2025-01-20",
    },
    {
      id: "INV-004",
      clientName: "Marketing Agency",
      amount: 4500,
      status: "paid",
      date: "2025-01-05",
      dueDate: "2025-02-05",
    },
  ]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

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

  if (!user) {
    return null;
  }

  const stats = {
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidInvoices: invoices.filter((inv) => inv.status === "paid").length,
    pendingAmount: invoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + inv.amount, 0),
    overdueCount: invoices.filter((inv) => inv.status === "overdue").length,
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20";
      case "overdue":
        return "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20";
    }
  };

  const handleCreateInvoice = (invoiceData: any) => {
    const newInvoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      clientName: invoiceData.clientName,
      amount: invoiceData.total,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };
    setInvoices([newInvoice, ...invoices]);
    toast.success("Invoice created successfully!");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 sm:px-6 py-4">
              <SidebarTrigger className="shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Dashboard</h1>
                <p className="text-sm text-muted-foreground truncate">
                  Welcome back, {user.name}! Here's your invoice overview.
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
            {/* Stats Cards */}
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
                    <div className="text-2xl sm:text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
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
                    <div className="text-2xl sm:text-3xl font-bold">${stats.pendingAmount.toLocaleString()}</div>
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

            {/* Invoices Table */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="shadow-card border-border">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <CardTitle className="text-lg sm:text-xl">Recent Invoices</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 flex-1 sm:flex-initial"
                        onClick={() => toast.info("Search functionality coming soon")}
                      >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Search</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 flex-1 sm:flex-initial"
                        onClick={() => toast.info("Filter functionality coming soon")}
                      >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
                          {invoices.map((invoice) => (
                            <tr key={invoice.id} className="text-xs sm:text-sm">
                              <td className="py-4 px-2 sm:px-0 font-medium">{invoice.id}</td>
                              <td className="py-4 px-2">{invoice.clientName}</td>
                              <td className="py-4 px-2 font-semibold">${invoice.amount.toLocaleString()}</td>
                              <td className="py-4 px-2">
                                <Badge className={getStatusColor(invoice.status)} variant="secondary">
                                  {invoice.status}
                                </Badge>
                              </td>
                              <td className="py-4 px-2 text-muted-foreground hidden sm:table-cell">{invoice.dueDate}</td>
                              <td className="py-4 px-2">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                    onClick={() => toast.info(`Download invoice ${invoice.id}`)}
                                  >
                                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                    onClick={() => toast.info(`Send invoice ${invoice.id}`)}
                                  >
                                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                    onClick={() => toast.info(`More options for ${invoice.id}`)}
                                  >
                                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
