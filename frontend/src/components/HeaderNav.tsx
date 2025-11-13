import { Button } from "@/components/ui/button";
import { FileText, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";

interface HeaderNavProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export const HeaderNav = ({ onLoginClick, onSignupClick }: HeaderNavProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-4 z-50 px-4">
      <div className="container mx-auto">
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Invoicely</span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-full px-2 py-1">
              <a href="#features" className="text-sm font-medium hover:bg-background hover:text-primary transition-all px-4 py-2 rounded-full">
                Features
              </a>
              <a href="#faq" className="text-sm font-medium hover:bg-background hover:text-primary transition-all px-4 py-2 rounded-full">
                FAQ
              </a>
              <a href="#testimonials" className="text-sm font-medium hover:bg-background hover:text-primary transition-all px-4 py-2 rounded-full">
                Testimonials
              </a>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              {user ? (
                <Button onClick={() => navigate("/dashboard")} className="rounded-full">Dashboard</Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={onLoginClick} className="rounded-full">
                    Login
                  </Button>
                  <Button onClick={onSignupClick} className="rounded-full">Sign Up</Button>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 bg-background/95 backdrop-blur-sm border border-border rounded-3xl p-4 flex flex-col gap-3"
          >
            <a
              href="#features"
              className="text-sm font-medium hover:bg-muted hover:text-primary transition-all px-4 py-2 rounded-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#faq"
              className="text-sm font-medium hover:bg-muted hover:text-primary transition-all px-4 py-2 rounded-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium hover:bg-muted hover:text-primary transition-all px-4 py-2 rounded-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            {user ? (
              <Button onClick={() => navigate("/dashboard")} className="w-full rounded-full">
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={onLoginClick} className="w-full rounded-full">
                  Login
                </Button>
                <Button onClick={onSignupClick} className="w-full rounded-full">
                  Sign Up
                </Button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};
