import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Zap, Users, Check, ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion";
import dashboardPreview from "@/assets/dashboard-preview.png";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { useTheme } from "@/hooks/useTheme";

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  const handleCreateInvoice = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setSignupModalOpen(true);
    }
  };

  const handleTryDemo = () => {
    navigate("/dashboard");
  };

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Smart Templates",
      description: "Professional invoice templates ready to use. Customize with your brand colors and logo.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quick Payments",
      description: "Get paid faster with integrated payment links and automated reminders.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Client Management",
      description: "Keep all your client information organized in one secure place.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content: "Invoicely simplified my billing process. I can create and send invoices in minutes!",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Marketing Consultant",
      content: "The best invoicing tool I've used. Clean, fast, and professional.",
      avatar: "MC",
    },
    {
      name: "Emma Davis",
      role: "Web Developer",
      content: "Love the automated reminders. My clients pay on time now.",
      avatar: "ED",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
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
                    <Button variant="ghost" onClick={() => setLoginModalOpen(true)} className="rounded-full">
                      Login
                    </Button>
                    <Button onClick={() => setSignupModalOpen(true)} className="rounded-full">Sign Up</Button>
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
                  <Button variant="ghost" onClick={() => setLoginModalOpen(true)} className="w-full rounded-full">
                    Login
                  </Button>
                  <Button onClick={() => setSignupModalOpen(true)} className="w-full rounded-full">
                    Sign Up
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="container mx-auto px-4 py-16 sm:py-24 lg:py-32"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp} className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Create. Send.
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">Get Paid.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Professional invoicing made simple. Create beautiful invoices in seconds and get paid faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" variant="hero" className="gap-2" onClick={handleCreateInvoice}>
                Create Free Invoice
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleTryDemo}>
                Try Demo
              </Button>
            </div>
          </motion.div>
          <motion.div variants={fadeIn} className="relative">
            <div className="rounded-2xl overflow-hidden shadow-soft border border-border">
              <img src={dashboardPreview} alt="Dashboard Preview" className="w-full" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="container mx-auto px-4 py-16 sm:py-24"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features to streamline your invoicing workflow
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className="h-full shadow-card border-border hover:shadow-soft transition-shadow">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        id="testimonials"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="container mx-auto px-4 py-16 sm:py-24"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by Professionals</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of freelancers and businesses who trust Invoicely
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className="shadow-card border-border">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="container mx-auto px-4 py-16 sm:py-24"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Invoice Generator
          </p>
        </motion.div>
        <motion.div variants={fadeIn} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create my first invoice?</AccordionTrigger>
              <AccordionContent>
                Simply sign up for a free account, add your client details, and use our intuitive invoice builder to create professional invoices in minutes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I customize invoice templates?</AccordionTrigger>
              <AccordionContent>
                Yes! You can customize templates with your brand colors, logo, and payment terms. Premium users get access to advanced customization options.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I get paid?</AccordionTrigger>
              <AccordionContent>
                Add payment links to your invoices and clients can pay directly. We support multiple payment methods including bank transfers and online payments.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                Absolutely. We use industry-standard encryption to protect your data. All information is stored securely and backed up regularly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Can I send invoices via email?</AccordionTrigger>
              <AccordionContent>
                Yes! You can send invoices directly to your clients via email with PDF attachments. Track when they're opened and viewed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>What currencies are supported?</AccordionTrigger>
              <AccordionContent>
                We support multiple currencies including USD, EUR, GBP, and NGN. You can set your preferred currency in your account settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Templates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-semibold">Invoicely</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Invoicely. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setLoginModalOpen(false);
          setSignupModalOpen(true);
        }}
        onSwitchToForgotPassword={() => {
          setLoginModalOpen(false);
          setForgotPasswordModalOpen(true);
        }}
      />
      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setSignupModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
      <ForgotPasswordModal
        isOpen={forgotPasswordModalOpen}
        onClose={() => setForgotPasswordModalOpen(false)}
        onBackToLogin={() => {
          setForgotPasswordModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
    </div>
  );
};

export default Landing;
