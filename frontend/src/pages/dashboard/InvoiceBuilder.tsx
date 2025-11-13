import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrencySymbol } from "@/lib/currency";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export default function InvoiceBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: clientsData } = useClients(1, 100);
  const clients = clientsData?.items || [];
  const currencySymbol = getCurrencySymbol(user?.preferred_currency || 'NGN');

  const [clientId, setClientId] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unit_price: 0 }
  ]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);

  const selectedClient = clients.find(c => c.id === parseInt(clientId));

  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const total = subtotal - discountAmount + taxAmount;

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unit_price: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const handleSave = async () => {
    if (!clientId || !issueDate || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/invoices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: parseInt(clientId),
          issue_date: issueDate,
          due_date: dueDate,
          currency: user?.preferred_currency || 'NGN',
          notes: notes || undefined,
          discount_amount: discountAmount,
          tax_amount: taxAmount,
          template_id: templateId ? parseInt(templateId) : undefined,
          line_items: lineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax_rate: 0
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      toast.success("Invoice created successfully!");
      navigate("/dashboard/invoices");
    } catch (error: any) {
      toast.error(error.message || "Failed to create invoice");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-4 px-4 sm:px-6 py-4">
              <SidebarTrigger className="shrink-0" />
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">Create Invoice</h1>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>Cancel</Button>
                <Button onClick={handleSave}>Save Invoice</Button>
              </div>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* Preview - Left Side */}
            <div className="w-1/2 p-6 bg-muted/30 overflow-auto">
              <Card className="max-w-2xl mx-auto p-8 bg-white">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                  <p className="text-sm text-muted-foreground">Invoice #{new Date().getTime()}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground mb-2">BILL TO</h3>
                    <p className="font-semibold">{selectedClient?.name || "Select a client"}</p>
                    {selectedClient?.email && <p className="text-sm">{selectedClient.email}</p>}
                    {selectedClient?.address && <p className="text-sm">{selectedClient.address}</p>}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground mb-2">FROM</h3>
                    <p className="font-semibold">{user?.company_name || user?.username}</p>
                    {user?.email && <p className="text-sm">{user.email}</p>}
                    {user?.company_address && <p className="text-sm">{user.company_address}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                  <div>
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span className="ml-2 font-medium">{issueDate || "Not set"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="ml-2 font-medium">{dueDate || "Not set"}</span>
                  </div>
                </div>

                <table className="w-full mb-8">
                  <thead className="border-b-2 border-border">
                    <tr className="text-left text-xs font-bold text-muted-foreground">
                      <th className="pb-2">DESCRIPTION</th>
                      <th className="pb-2 text-center">QTY</th>
                      <th className="pb-2 text-right">PRICE</th>
                      <th className="pb-2 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-3">{item.description || "Item description"}</td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right">{currencySymbol}{item.unit_price.toFixed(2)}</td>
                        <td className="py-3 text-right">{currencySymbol}{(item.quantity * item.unit_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-8">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t-2 border-border pt-2">
                      <span>Total:</span>
                      <span>{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {notes && (
                  <div className="border-t border-border pt-4">
                    <h3 className="text-xs font-bold text-muted-foreground mb-2">NOTES</h3>
                    <p className="text-sm">{notes}</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Form - Right Side */}
            <div className="w-1/2 p-6 overflow-auto">
              <div className="max-w-2xl space-y-6">
                <div className="space-y-2">
                  <Label>Client *</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client: any) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={templateId} onValueChange={setTemplateId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Modern Template</SelectItem>
                      <SelectItem value="2">Professional Template</SelectItem>
                      <SelectItem value="3">Minimal Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issue Date *</Label>
                    <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Line Items</Label>
                    <Button type="button" size="sm" onClick={addLineItem}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>

                  {lineItems.map((item, index) => (
                    <Card key={index} className="p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              placeholder="Quantity"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                            <Input
                              type="number"
                              placeholder="Price"
                              value={item.unit_price}
                              onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        {lineItems.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeLineItem(index)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Discount</Label>
                    <Input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax</Label>
                    <Input
                      type="number"
                      value={taxAmount}
                      onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Additional notes or payment terms..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
