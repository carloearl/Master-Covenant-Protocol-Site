import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, ChevronDown, User, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
      logo: "https://cdn.prod.website-files.com/62902d243ad8eab83fa8a8a7/62e5c7fbd98e7764a89daec3_soc2-badge.svg"
    },
    { 
      name: "GDPR", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/GDPR_logo.svg/512px-GDPR_logo.svg.png"
    },
    { 
      name: "ISO 27001", 
      logo: "https://cdn.prod.website-files.com/62902d243ad8eab83fa8a8a7/62e5c7fb84b97c1b76e7fa1c_iso27001-badge.svg"
    },
    { 
      name: "PCI DSS", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/PCI_DSS_Logo.svg/512px-PCI_DSS_Logo.svg.png"
    },
    { 
      name: "HIPAA", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/HIPAA_Logo.svg/512px-HIPAA_Logo.svg.png"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      <InteractiveNebula />
      
      {/* Navigation with blue glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-[100] glass-royal border-b border-blue-500/50 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {canGoBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="glass-royal border border-blue-500/30 text-white hover:text-blue-400 hover:bg-blue-500/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
                  alt="GlyphLock"
                  className="h-8 w-auto transform group-hover:scale-110 transition-transform"
                />
                <h1 className="text-lg font-bold text-white">
                  GlyphLock
                </h1>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {navigationConfig.main.map((item) => {
                if (item.dropdown) {
                  return (
                    <DropdownMenu key={item.label}>
                      <DropdownMenuTrigger asChild>
                        <Button className="bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-9 px-3">
                          {item.label} <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-royal border-blue-500/50 shadow-2xl z-[110]">
                        {item.dropdown.map((subItem) => (
                          <DropdownMenuItem key={subItem.page} asChild className="text-white hover:text-blue-400 hover:bg-blue-500/30 focus:text-blue-400 focus:bg-blue-500/30 cursor-pointer text-sm">
                            <Link to={createPageUrl(subItem.page)}>{subItem.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                return (
                  <Link key={item.page} to={createPageUrl(item.page)}>
                    <Button className={isActive(item.page) ? "bg-blue-500/30 border-none text-blue-400 text-sm h-9 px-3" : "bg-transparent border-none text-white hover:text-blue-400 hover:bg-blue-500/20 text-sm h-9 px-3"}>
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              {!isConsultationPage && (
                <Link to={createPageUrl("Consultation")} className="ml-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white glow-royal shadow-xl text-sm h-9 px-4">
                    Contact Sales
                  </Button>
                </Link>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-2 glass-royal border border-blue-500/30 text-white hover:bg-blue-500/30 text-sm h-9 px-3">
                      <User className="w-3 h-3 mr-2" />
                      {user.full_name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-royal border-blue-500/50 shadow-2xl z-[110]">
                    <DropdownMenuItem asChild className="text-white hover:text-blue-400 hover:bg-blue-500/30 focus:text-blue-400 focus:bg-blue-500/30 cursor-pointer text-sm">
                      <Link to={createPageUrl("Dashboard")}>
                        <User className="w-3 h-3 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white/70 focus:bg-blue-500/20 text-xs">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-blue-500/30" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 focus:text-red-300 focus:bg-red-500/20 cursor-pointer text-sm"
                    >
                      <LogOut className="w-3 h-3 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={handleLogin}
                  className="ml-2 glass-royal border border-blue-500/50 text-white hover:bg-blue-500/30 text-sm h-9 px-3"
                >
                  Sign In
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2 glass-royal border border-blue-500/30 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-blue-500/30 glass-royal max-h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="flex flex-col gap-2">
                {navigationConfig.main.map((item) => {
                  if (item.dropdown) {
                    return (
                      <React.Fragment key={item.label}>
                        <div className="px-2 py-1 font-semibold text-blue-400 text-sm">
                          {item.label}
                        </div>
                        {item.dropdown.map((subItem) => (
                          <Link key={subItem.page} to={createPageUrl(subItem.page)} onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full justify-start pl-6 bg-transparent border-none text-white hover:bg-blue-500/30 text-sm">
                              {subItem.label}
                            </Button>
                          </Link>
                        ))}
                      </React.Fragment>
                    );
                  }
                  return (
                    <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-sm">
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                {user && (
                  <Link to={createPageUrl("Dashboard")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-transparent border-none text-white hover:bg-blue-500/30 text-sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                {!isConsultationPage && (
                  <Link to={createPageUrl("Consultation")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white mt-2 shadow-xl text-sm">
                      Contact Sales
                    </Button>
                  </Link>
                )}
                {user ? (
                  <Button 
                    onClick={handleLogout}
                    className="w-full mt-2 glass-royal border border-red-500/50 text-red-400 hover:bg-red-500/20 text-sm"
                  >
                    <LogOut className="w-3 h-3 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Button 
                    onClick={handleLogin}
                    className="w-full mt-2 glass-royal border border-blue-500/50 text-white hover:bg-blue-500/30 text-sm"
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

      {/* Footer with glassmorphism */}
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
                    <img 
                      src={cert.logo} 
                      alt={cert.name}
                      className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                      loading="lazy"
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
    </div>
  );
}