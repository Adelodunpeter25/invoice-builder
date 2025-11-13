import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Send, MoreVertical } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CreateInvoiceModal } from "@/components/dashboard/CreateInvoiceModal";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { toast } from "sonner";

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  date: string;
  dueDate: string;
}

const Invoices = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [invoices] = useState<Invoice[]>([
    { id: "INV-001", clientName: "Acme Corporation", amount: 2500, status: "paid", date: "2025-01-10", dueDate: "2025-02-10" },
    { id: "INV-002", clientName: "Tech Startup Inc", amount: 1750, status: "pending", date: "2025-01-15", dueDate: "2025-02-15" },
    { id: "INV-003", clientName: "Design Studio", amount: 3200, status: "overdue", date: "2024-12-20", dueDate: "2025-01-20" },
    { id: "INV-004", clientName: "Marketing Agency", amount: 4500, status: "paid", date: "2025-01-05", dueDate: "2025-02-05" },
    { id: "INV-005", clientName: "Consulting Firm", amount: 1200, status: "draft", date: "2025-01-20", dueDate: "2025-02-20" },
  ]);

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid": return "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20";
      case "overdue": return "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20";
      case "draft": return "bg-gray-500/10 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20";
    }
  };

  const filterInvoices = (status?: Invoice["status"]) => {
    return status ? invoices.filter(inv => inv.status === status) : invoices;
  };

  const InvoiceTable = ({ invoices }: { invoices: Invoice[] }) => (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
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
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => toast.info(`Download ${invoice.id}`)}>
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => toast.info(`Send ${invoice.id}`)}>
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => toast.info(`More options for ${invoice.id}`)}>
                    <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
              <Button onClick={() => setIsCreateModalOpen(true)} variant="hero" className="gap-2 w-full sm:w-auto shrink-0">
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
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All ({invoices.length})</TabsTrigger>
                      <TabsTrigger value="draft">Draft ({filterInvoices("draft").length})</TabsTrigger>
                      <TabsTrigger value="pending">Pending ({filterInvoices("pending").length})</TabsTrigger>
                      <TabsTrigger value="paid">Paid ({filterInvoices("paid").length})</TabsTrigger>
                      <TabsTrigger value="overdue">Overdue ({filterInvoices("overdue").length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                      <InvoiceTable invoices={invoices} />
                    </TabsContent>
                    <TabsContent value="draft">
                      <InvoiceTable invoices={filterInvoices("draft")} />
                    </TabsContent>
                    <TabsContent value="pending">
                      <InvoiceTable invoices={filterInvoices("pending")} />
                    </TabsContent>
                    <TabsContent value="paid">
                      <InvoiceTable invoices={filterInvoices("paid")} />
                    </TabsContent>
                    <TabsContent value="overdue">
                      <InvoiceTable invoices={filterInvoices("overdue")} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      <CreateInvoiceModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </SidebarProvider>
  );
};

export default Invoices;
