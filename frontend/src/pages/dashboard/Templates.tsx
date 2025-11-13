import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";

const templates = [
  { id: 1, name: "Modern Template", description: "Clean and modern design with dark header" },
  { id: 2, name: "Professional Template", description: "Professional layout with right-aligned header" },
  { id: 3, name: "Minimal Template", description: "Minimalist design with bold typography" },
];

export default function Templates() {
  const navigate = useNavigate();

  const handleUseTemplate = (templateId: number) => {
    navigate(`/dashboard/invoices/new?template=${templateId}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-4 px-4 sm:px-6 py-4">
              <SidebarTrigger className="shrink-0" />
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold">Invoice Templates</h1>
                <p className="text-sm text-muted-foreground">Choose a template for your invoices</p>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {templates.map((template) => (
                <motion.div key={template.id} variants={fadeIn}>
                  <Card className="shadow-card border-border h-full flex flex-col">
                    <CardHeader>
                      <CardTitle>{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      <Button onClick={() => handleUseTemplate(template.id)} className="w-full">
                        Use Template
                      </Button>
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
}
