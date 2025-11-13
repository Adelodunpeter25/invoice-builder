import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUser } from "@/hooks/useAuthApi";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { toast } from "sonner";

const Settings = () => {
  const { user, refetchUser } = useAuth();
  const updateUser = useUpdateUser();

  const [email, setEmail] = useState(user?.email || "");
  const [companyName, setCompanyName] = useState(user?.company_name || "");
  const [companyAddress, setCompanyAddress] = useState(user?.company_address || "");
  const [companyCity, setCompanyCity] = useState(user?.company_city || "");
  const [companyCountry, setCompanyCountry] = useState(user?.company_country || "");
  const [companyPhone, setCompanyPhone] = useState(user?.company_phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = async () => {
    try {
      await updateUser.mutateAsync({ 
        email, 
        company_name: companyName,
        company_address: companyAddress,
        company_city: companyCity,
        company_country: companyCountry,
        company_phone: companyPhone
      });
      await refetchUser();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await updateUser.mutateAsync({ current_password: currentPassword, new_password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    }
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
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={user?.username} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={updateUser.isPending}>
                      {updateUser.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="shadow-card border-border">
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Details that appear on your invoices</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Company Ltd." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Company Address</Label>
                      <Input id="address" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="123 Business St." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={companyCity} onChange={(e) => setCompanyCity(e.target.value)} placeholder="City" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={companyCountry} onChange={(e) => setCompanyCountry(e.target.value)} placeholder="Country" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Company Phone</Label>
                      <Input id="phone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="+1234567890" />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={updateUser.isPending}>
                      {updateUser.isPending ? "Saving..." : "Save Changes"}
                    </Button>
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
                      <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new">New Password</Label>
                      <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm Password</Label>
                      <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <Button onClick={handleChangePassword} disabled={updateUser.isPending}>
                      {updateUser.isPending ? "Updating..." : "Update Password"}
                    </Button>
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
