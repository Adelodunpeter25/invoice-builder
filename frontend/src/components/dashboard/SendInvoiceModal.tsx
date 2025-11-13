import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SendInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  clientEmail?: string;
}

export function SendInvoiceModal({ open, onOpenChange, invoiceId, clientEmail }: SendInvoiceModalProps) {
  const [email, setEmail] = useState(clientEmail || "");
  const [subject, setSubject] = useState(`Invoice ${invoiceId}`);
  const [message, setMessage] = useState(`Please find attached invoice ${invoiceId}.`);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate sending
    setTimeout(() => {
      toast.success(`Invoice ${invoiceId} sent to ${email}`);
      setIsSending(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Invoice</DialogTitle>
          <DialogDescription>Send invoice {invoiceId} via email</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email *</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
