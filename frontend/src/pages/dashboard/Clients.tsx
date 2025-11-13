import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mail, Phone, Edit, Trash } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { toast } from "sonner";
import { useClients, useDeleteClient } from "@/hooks/useClients";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Clients = () => {
  const { data: clientsData, isLoading } = useClients({ page: 1, page_size: 100 });
  const deleteClient = useDeleteClient();

  const clients = clientsData?.items || [];

  const handleEdit = (clientId: number) => {
    toast.info("Edit client functionality coming soon");
  };

  const handleDelete = async (clientId: number) => {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient.mutateAsync(clientId);
        toast.success("Client deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete client");
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
            {clients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No clients yet. Add your first client to get started!</p>
                <Button onClick={() => toast.info("Add client modal coming soon")} variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </div>
            ) : (
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {clients.map((client: any) => (
                  <motion.div key={client.id} variants={fadeIn}>
                    <Card className="shadow-card border-border h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(client.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(client.id)} className="text-destructive">
                                <Trash className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="text-sm text-muted-foreground">
                            <p className="truncate">{client.address}</p>
                            {client.city && client.country && (
                              <p className="truncate">{client.city}, {client.country}</p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Clients;
