import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";

const templates = [
  { 
    id: 1, 
    name: "Modern Template", 
    description: "Clean and modern design with dark header",
    preview: (
      <div className="border rounded-lg p-4 bg-white text-xs space-y-2">
        <div className="bg-gray-900 text-white p-2 rounded">
          <div className="font-bold">INVOICE</div>
        </div>
        <div className="flex justify-between">
          <div className="space-y-1">
            <div className="font-semibold">Company Name</div>
            <div className="text-gray-500">Client Name</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">#INV-001</div>
            <div className="text-gray-500">Date</div>
          </div>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between font-semibold">
            <span>Item</span>
            <span>Amount</span>
          </div>
          <div className="flex justify-between text-gray-600 mt-1">
            <span>Service</span>
            <span>$100.00</span>
          </div>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>$100.00</span>
        </div>
      </div>
    )
  },
  { 
    id: 2, 
    name: "Professional Template", 
    description: "Professional layout with right-aligned header",
    preview: (
      <div className="border rounded-lg p-4 bg-white text-xs space-y-2">
        <div className="flex justify-between items-start">
          <div className="font-bold text-lg">INVOICE</div>
          <div className="text-right">
            <div className="font-semibold">Company Name</div>
            <div className="text-gray-500 text-[10px]">Address</div>
          </div>
        </div>
        <div className="bg-gray-800 text-white p-2 rounded flex justify-between">
          <span>Invoice #INV-001</span>
          <span>Date</span>
        </div>
        <div className="space-y-1">
          <div className="font-semibold">Bill To:</div>
          <div className="text-gray-600">Client Name</div>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between text-gray-600">
            <span>Service</span>
            <span>$100.00</span>
          </div>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>$100.00</span>
        </div>
      </div>
    )
  },
  { 
    id: 3, 
    name: "Minimal Template", 
    description: "Minimalist design with bold typography",
    preview: (
      <div className="border rounded-lg p-4 bg-white text-xs space-y-2">
        <div className="font-bold text-2xl border-b-4 border-black pb-1">INVOICE</div>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <div className="font-bold uppercase">From</div>
            <div className="text-gray-600">Company Name</div>
          </div>
          <div>
            <div className="font-bold uppercase">To</div>
            <div className="text-gray-600">Client Name</div>
          </div>
        </div>
        <div className="border-t-2 border-black pt-2">
          <div className="flex justify-between font-bold uppercase text-[10px]">
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className="flex justify-between text-gray-600 mt-1">
            <span>Service</span>
            <span>$100.00</span>
          </div>
        </div>
        <div className="border-t-4 border-black pt-2 flex justify-between font-bold text-sm">
          <span>TOTAL</span>
          <span>$100.00</span>
        </div>
      </div>
    )
  },
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
                    <CardContent className="flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          {template.preview}
                        </div>
                      </div>
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
