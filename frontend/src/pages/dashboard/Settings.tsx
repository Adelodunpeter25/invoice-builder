import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 sm:px-6 py-4">
              <SidebarTrigger className="shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">Settings</h1>
                <p className="text-sm text-muted-foreground truncate">Manage your account and preferences</p>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl space-y-6">
              <motion.div variants={fadeIn}>
                <Card className="shadow-card border-border">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue={user?.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email} />
                    </div>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="shadow-card border-border">
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>Details that appear on your invoices</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" placeholder="Your Company Ltd." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Business St." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="City" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" placeholder="Country" />
                      </div>
                    </div>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="shadow-card border-border">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current">Current Password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new">New Password</Label>
                      <Input id="new" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm Password</Label>
                      <Input id="confirm" type="password" />
                    </div>
                    <Button onClick={handleSave}>Update Password</Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
