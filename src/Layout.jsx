import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, User, LogOut, ArrowLeft, HelpCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import SecurityMonitor from "@/components/SecurityMonitor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GlyphBotJr from "@/components/GlyphBotJr";
import { navigationConfig } from "@/components/NavigationConfig";
import InteractiveNebula from "@/components/InteractiveNebula";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const checkUser = async () => {
    try {
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (isAuthenticated) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    } catch (err) {
      console.error("Failed to get user:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMobileMenuOpen(false);
    base44.auth.logout();
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    base44.auth.redirectToLogin();
  };

  const isActive = (pageName) => location.pathname === createPageUrl(pageName);
  const canGoBack = window.history.length > 1 && location.pathname !== createPageUrl("Home");
  const isConsultationPage = location.pathname === createPageUrl("Consultation");

  const certifications = [
    { 
      name: "SOC 2", 
      svg: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" rx="8" fill="#1E3A8A" fill-opacity="0.2"/>
        <rect x="1" y="1" width="78" height="78" rx="7" stroke="#3B82F6" stroke-width="2"/>
        <path d="M40 15L52 25V45C52 52 46 57 40 65C34 57 28 52 28 45V25L40 15Z" fill="#3B82F6" fill-opacity="0.3" stroke="#3B82F6" stroke-width="2"/>
        <text x="40" y="48" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#3B82F6" text-anchor="middle">SOC 2</text>
        <text x="40" y="62" font-family="Arial, sans-serif" font-size="8" fill="#93C5FD" text-anchor="middle">TYPE II</text>
      </svg>`
    },
    { 
      name: "GDPR", 
      svg: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" rx="8" fill="#1E3A8A" fill-opacity="0.2"/>
        <rect x="1" y="1" width="78" height="78" rx="7" stroke="#3B82F6" stroke-width="2"/>
        <circle cx="40" cy="35" r="18" fill="#3B82F6" fill-opacity="0.3" stroke="#3B82F6" stroke-width="2"/>
        <text x="40" y="40" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#3B82F6" text-anchor="middle">GDPR</text>
        <text x="40" y="62" font-family="Arial, sans-serif" font-size="7" fill="#93C5FD" text-anchor="middle">COMPLIANT</text>
      </svg>`
    },
    { 
      name: "ISO 27001", 
      svg: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" rx="8" fill="#1E3A8A" fill-opacity="0.2"/>
        <rect x="1" y="1" width="78" height="78" rx="7" stroke="#3B82F6" stroke-width="2"/>
        <circle cx="40" cy="32" r="16" fill="none" stroke="#3B82F6" stroke-width="2"/>
        <text x="40" y="36" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#3B82F6" text-anchor="middle">ISO</text>
        <text x="40" y="55" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#3B82F6" text-anchor="middle">27001</text>
        <text x="40" y="66" font-family="Arial, sans-serif" font-size="7" fill="#93C5FD" text-anchor="middle">CERTIFIED</text>
      </svg>`
    },
    { 
      name: "PCI DSS", 
      svg: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" rx="8" fill="#1E3A8A" fill-opacity="0.2"/>
        <rect x="1" y="1" width="78" height="78" rx="7" stroke="#3B82F6" stroke-width="2"/>
        <rect x="25" y="22" width="30" height="20" rx="2" fill="#3B82F6" fill-opacity="0.3" stroke="#3B82F6" stroke-width="2"/>
        <rect x="28" y="28" width="7" height="5" rx="1" fill="#3B82F6"/>
        <line x1="25" y1="36" x2="55" y2="36" stroke="#3B82F6" stroke-width="2"/>
        <text x="40" y="56" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#3B82F6" text-anchor="middle">PCI DSS</text>
        <text x="40" y="66" font-family="Arial, sans-serif" font-size="7" fill="#93C5FD" text-anchor="middle">COMPLIANT</text>
      </svg>`
    },
    { 
      name: "HIPAA", 
      svg: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" rx="8" fill="#1E3A8A" fill-opacity="0.2"/>
        <rect x="1" y="1" width="78" height="78" rx="7" stroke="#3B82F6" stroke-width="2"/>
        <path d="M40 25C35 25 30 28 30 35V45C30 48 32 50 35 50H45C48 50 50 48 50 45V35C50 28 45 25 40 25Z" fill="#3B82F6" fill-opacity="0.3" stroke="#3B82F6" stroke-width="2"/>
        <path d="M35 35H38V42H35V35ZM42 35H45V42H42V35Z" fill="#3B82F6"/>
        <text x="40" y="62" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#3B82F6" text-anchor="middle">HIPAA</text>
      </svg>`
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <SecurityMonitor />
      <InteractiveNebula />
      
      <TooltipProvider>
        {/* Enhanced Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-[100] glass-royal border-b border-blue-500/50 shadow-xl">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                {canGoBack && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="glass-royal border border-blue-500/30 text-white hover:text-blue-400 hover:bg-blue-500/30 h-10 w-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
                    alt="GlyphLock"
                    className="h-10 w-auto transform group-hover:scale-110 transition-transform"
                    style={{ marginTop: '2px', marginRight: '2px' }}
                  />
                  <h1 className="text-xl font-bold text-white hidden sm:block">
                    GlyphLock
                  </h1>
                </Link>
              </div>

              <div className="hidden lg:flex items-center gap-2">
                <Link to={createPageUrl("Home")}>
                  <Button className={isActive("Home") ? "bg-blue-500/30 border-none text-blue-400 text-sm h-10 px-4" : "bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4"}>
                    Home
                  </Button>
                </Link>
                
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4">
                      Company
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="glass-royal border-blue-500/50 bg-black/95 backdrop-blur-xl shadow-2xl"
                    align="start"
                    sideOffset={5}
                  >
                    {navigationConfig.main.find(item => item.label === "Company")?.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.page} asChild className="text-white hover:text-blue-400 hover:bg-blue-500/30 focus:text-blue-400 focus:bg-blue-500/30 cursor-pointer text-sm">
                        <Link to={createPageUrl(subItem.page)}>{subItem.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4">
                      Security
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="glass-royal border-blue-500/50 bg-black/95 backdrop-blur-xl shadow-2xl"
                    align="start"
                    sideOffset={5}
                  >
                    {navigationConfig.main.find(item => item.label === "Security")?.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.page} asChild className="text-white hover:text-blue-400 hover:bg-blue-500/30 focus:text-blue-400 focus:bg-blue-500/30 cursor-pointer text-sm">
                        <Link to={createPageUrl(subItem.page)}>{subItem.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Link to={createPageUrl("GlyphBot")}>
                        <Button className={isActive("GlyphBot") ? "bg-blue-500/30 border-none text-blue-400 text-sm h-10 px-4" : "bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4"}>
                          AI
                        </Button>
                      </Link>
                      <HelpCircle className="w-3 h-3 text-blue-400/70 hover:text-blue-400 cursor-help" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="glass-royal border-blue-500/50 bg-black/90 backdrop-blur-xl text-white">
                    <p>GlyphBot - AI-powered cybersecurity assistant</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Link to={createPageUrl("Pricing")}>
                        <Button className={isActive("Pricing") ? "bg-blue-500/30 border-none text-blue-400 text-sm h-10 px-4" : "bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-10 px-4"}>
                          Pricing
                        </Button>
                      </Link>
                      <HelpCircle className="w-3 h-3 text-blue-400/70 hover:text-blue-400 cursor-help" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="glass-royal border-blue-500/50 bg-black/90 backdrop-blur-xl text-white">
                    <p>View pricing plans and packages</p>
                  </TooltipContent>
                </Tooltip>

                {!isConsultationPage && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 ml-2">
                        <Link to={createPageUrl("Consultation")}>
                          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white glow-royal shadow-xl text-sm h-10 px-4">
                            Contact
                          </Button>
                        </Link>
                        <HelpCircle className="w-3 h-3 text-blue-400/70 hover:text-blue-400 cursor-help" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="glass-royal border-blue-500/50 bg-black/90 backdrop-blur-xl text-white">
                      <p>Schedule a consultation with our experts</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {user ? (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button className="ml-2 glass-royal border border-blue-500/30 text-white hover:bg-blue-500/30 text-sm h-10 px-4">
                        <User className="w-4 h-4 mr-2" />
                        {user.full_name?.split(' ')[0] || 'User'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="glass-royal border-blue-500/50 bg-black/95 backdrop-blur-xl shadow-2xl"
                      align="end"
                      sideOffset={5}
                    >
                      <DropdownMenuItem asChild className="text-white hover:text-blue-400 hover:bg-blue-500/30 focus:text-blue-400 focus:bg-blue-500/30 cursor-pointer text-sm">
                          <Link to={createPageUrl("Dashboard")}>
                            <User className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-white hover:text-blue-400 hover:bg-blue-500/30 focus:text-blue-400 focus:bg-blue-500/30 cursor-pointer text-sm">
                          <Link to={createPageUrl("ManageSubscription")}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Manage Subscription
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-blue-500/30" />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 focus:text-red-300 focus:bg-red-500/20 cursor-pointer text-sm"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    onClick={handleLogin}
                    className="ml-2 glass-royal border border-blue-500/50 text-white hover:bg-blue-500/30 text-sm h-10 px-4"
                  >
                    Sign In
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white p-2 glass-royal border border-blue-500/30 rounded-lg h-10 w-10 flex items-center justify-center"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="lg:hidden py-4 border-t border-blue-500/30 bg-black/95 backdrop-blur-xl max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <Link to={createPageUrl("Home")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                      Home
                    </Button>
                  </Link>

                  <div className="px-3 py-2 text-xs font-semibold text-blue-400">Company</div>
                  {navigationConfig.main.find(item => item.label === "Company")?.dropdown.map((subItem) => (
                    <Link key={subItem.page} to={createPageUrl(subItem.page)} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full justify-start pl-6 bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                        {subItem.label}
                      </Button>
                    </Link>
                  ))}

                  <div className="px-3 py-2 text-xs font-semibold text-blue-400 mt-2">Security</div>
                  {navigationConfig.main.find(item => item.label === "Security")?.dropdown.map((subItem) => (
                    <Link key={subItem.page} to={createPageUrl(subItem.page)} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full justify-start pl-6 bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                        {subItem.label}
                      </Button>
                    </Link>
                  ))}

                  <Link to={createPageUrl("GlyphBot")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11 mt-2">
                      GlyphBot AI
                    </Button>
                  </Link>

                  <Link to={createPageUrl("Pricing")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                      Pricing
                    </Button>
                  </Link>

                  {user && (
                    <>
                      <Link to={createPageUrl("Dashboard")} onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                          Dashboard
                        </Button>
                      </Link>
                      <Link to={createPageUrl("ManageSubscription")} onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-base h-11">
                          Manage Subscription
                        </Button>
                      </Link>
                    </>
                  )}

                  {!isConsultationPage && (
                    <Link to={createPageUrl("Consultation")} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white mt-2 shadow-xl text-base h-11">
                        Contact Sales
                      </Button>
                    </Link>
                  )}

                  {user ? (
                    <Button 
                      onClick={handleLogout}
                      className="w-full mt-2 glass-royal border border-red-500/50 text-red-400 hover:bg-red-500/20 text-base h-11"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleLogin}
                      className="w-full mt-2 glass-royal border border-blue-500/50 text-white hover:bg-blue-500/30 text-base h-11"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        <main className="pt-20 pb-8 relative z-10">
          {children}
        </main>

        <GlyphBotJr />

        {/* Footer */}
        <footer className="glass-royal border-t border-blue-500/50 py-12 relative z-10 shadow-2xl">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
                    alt="GlyphLock"
                    className="h-8 w-auto"
                  />
                </div>
                <p className="text-sm text-white/70">
                  Next-generation cybersecurity platform with quantum-resistant encryption and AI integration.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-white">Services</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {navigationConfig.footer.services.map((item) => (
                    <Link key={item.page} to={createPageUrl(item.page)} className="text-white/70 hover:text-blue-400 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-white">Company</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {navigationConfig.footer.company.map((item) => (
                    <Link key={item.page} to={createPageUrl(item.page)} className="text-white/70 hover:text-blue-400 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-white">Legal</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {navigationConfig.footer.legal.map((item) => (
                    <Link key={item.page} to={createPageUrl(item.page)} className="text-white/70 hover:text-blue-400 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-blue-500/30">
              <div className="mb-8">
                <h4 className="text-center text-sm font-semibold mb-6 text-white/70">
                  Security & Compliance
                </h4>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div 
                        dangerouslySetInnerHTML={{ __html: cert.svg }}
                        className="opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                <div className="text-sm text-white/70">
                  <p>© 2025 GlyphLock Security LLC. All rights reserved.</p>
                </div>
                <div className="text-sm space-y-1 text-white/70">
                  <p>El Mirage, Arizona • Established May 2025</p>
                  <p>
                    <a href="mailto:glyphlock@gmail.com" className="hover:text-blue-400 transition-colors">glyphlock@gmail.com</a>
                    {" • "}
                    <a href="tel:+14242466499" className="hover:text-blue-400 transition-colors">(424) 246-6499</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </TooltipProvider>
    </div>
  );
}