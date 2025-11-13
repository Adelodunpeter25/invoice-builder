import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Mail, Phone, MoreVertical } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { toast } from "sonner";

const Clients = () => {
  const { user } = useAuth();
  const [clients] = useState([
    { id: "1", name: "Acme Corporation", email: "contact@acme.com", phone: "+1234567890", invoices: 5 },
    { id: "2", name: "Tech Startup Inc", email: "hello@techstartup.com", phone: "+1234567891", invoices: 3 },
    { id: "3", name: "Design Studio", email: "info@designstudio.com", phone: "+1234567892", invoices: 7 },
    { id: "4", name: "Marketing Agency", email: "team@marketing.com", phone: "+1234567893", invoices: 2 },
  ]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 sm:px-6 py-4">
              <SidebarTrigger className="shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Clients</h1>
                <p className="text-sm text-muted-foreground truncate">Manage your client relationships</p>
              </div>
              <Button onClick={() => toast.info("Add client modal coming soon")} variant="hero" className="gap-2 w-full sm:w-auto shrink-0">
                <Plus className="w-4 h-4" />
                <span>Add Client</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {clients.map((client) => (
                <motion.div key={client.id} variants={fadeIn}>
                  <Card className="shadow-card border-border h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className="text-sm font-medium">{client.invoices} invoices</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Clients;
