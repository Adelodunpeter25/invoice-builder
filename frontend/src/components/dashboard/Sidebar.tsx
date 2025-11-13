import { FileText, LayoutDashboard, Users, Settings, Moon, Sun, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sidebar as SidebarBase,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Clients", url: "/dashboard/clients", icon: Users },
  { title: "Invoices", url: "/dashboard/invoices", icon: FileText },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const { state } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <SidebarBase className={`${isCollapsed ? "w-14" : "w-56"} transition-all duration-300`}>
      <SidebarContent>
        {/* Logo */}
        <div className={`p-6 border-b border-sidebar-border ${isCollapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary flex-shrink-0" />
            {!isCollapsed && <span className="text-lg font-bold">Invoicely</span>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span className="text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info & Actions */}
        <div className="mt-auto border-t border-sidebar-border">
          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              onClick={toggleTheme}
              className="w-full justify-start"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {!isCollapsed && <span className="ml-2">Toggle Theme</span>}
            </Button>
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "sm"}
              onClick={handleLogout}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </SidebarBase>
  );
}
