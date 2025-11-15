
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, ChevronDown, User, LogOut, Sun, Moon, ArrowLeft } from "lucide-react";
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

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    const savedTheme = localStorage.getItem('glyphlock_theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
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
    base44.auth.logout();
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('glyphlock_theme', newMode ? 'dark' : 'light');
  };

  const isActive = (pageName) => location.pathname === createPageUrl(pageName);

  const canGoBack = window.history.length > 1 && location.pathname !== createPageUrl("Home");

  const certifications = [
    { name: "SOC 2", logo: "https://logos-world.net/wp-content/uploads/2021/02/SOC-2-Logo.png" },
    { name: "GDPR", logo: "https://gdpr.eu/wp-content/uploads/2019/01/gdpr-logo.png" },
    { name: "ISO 27001", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/ISO_27001_logo.svg" },
    { name: "PCI DSS", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/PCI_DSS_Logo.svg" },
    { name: "HIPAA", logo: "https://www.hhs.gov/sites/default/files/hhs-logo.svg" }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} relative`}>
      {/* Navigation - Fixed with higher z-index */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] ${darkMode ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl border-b ${darkMode ? 'border-blue-500/20' : 'border-blue-500/30'} shadow-lg`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              {canGoBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className={`${darkMode ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'}`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/d92107808_glyphlock-3d-logo.png"
                  alt="GlyphLock"
                  className="h-12 w-auto transform group-hover:scale-110 transition-transform"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
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
                        <Button variant="ghost" className={`${darkMode ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}>
                          {item.label} <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={`${darkMode ? 'bg-gray-900/95 border-blue-500/20' : 'bg-white/95 border-blue-500/30'} backdrop-blur-xl z-[110]`}>
                        {item.dropdown.map((subItem) => (
                          <DropdownMenuItem key={subItem.page} asChild className={`${darkMode ? 'text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20' : 'text-gray-900 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-500/10'} cursor-pointer`}>
                            <Link to={createPageUrl(subItem.page)}>{subItem.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                return (
                  <Link key={item.page} to={createPageUrl(item.page)}>
                    <Button variant="ghost" className={isActive(item.page) ? "text-blue-400" : `${darkMode ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}>
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Link to={createPageUrl("Consultation")} className="ml-4">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Book Consultation
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-2">
                      <User className="w-4 h-4 mr-2" />
                      {user.full_name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={`${darkMode ? 'bg-gray-900/95 border-blue-500/20' : 'bg-white/95 border-blue-500/30'} backdrop-blur-xl z-[110]`}>
                    <DropdownMenuItem asChild className={`${darkMode ? 'text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20' : 'text-gray-900 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-500/10'} cursor-pointer`}>
                      <Link to={createPageUrl("Dashboard")}>
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className={`${darkMode ? 'text-white focus:bg-blue-500/20' : 'text-gray-900 focus:bg-blue-500/10'}`}>
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className={darkMode ? 'bg-gray-700' : 'bg-gray-300'} />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/20 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to={createPageUrl("Login")} className="ml-2">
                  <Button variant="outline" className={`${darkMode ? 'border-blue-500/50 text-white hover:bg-blue-500/10' : 'border-blue-500/70 text-gray-900 hover:bg-blue-500/10'}`}>
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`${darkMode ? 'text-white' : 'text-gray-900'} p-2`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`lg:hidden py-4 border-t ${darkMode ? 'border-blue-500/20 bg-black/95' : 'border-blue-500/30 bg-white/95'} backdrop-blur-xl max-h-[calc(100vh-5rem)] overflow-y-auto`}>
              <div className="flex flex-col gap-2">
                {navigationConfig.main.map((item) => {
                  if (item.dropdown) {
                    return (
                      <React.Fragment key={item.label}>
                        <div className={`px-2 py-1 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.label}
                        </div>
                        {item.dropdown.map((subItem) => (
                          <Link key={subItem.page} to={createPageUrl(subItem.page)} onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className={`w-full justify-start pl-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {subItem.label}
                            </Button>
                          </Link>
                        ))}
                      </React.Fragment>
                    );
                  }
                  return (
                    <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                {user && (
                  <Link to={createPageUrl("Dashboard")} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link to={createPageUrl("Consultation")} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white mt-2">
                    Book Consultation
                  </Button>
                </Link>
                {user ? (
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline" 
                    className="w-full mt-2 border-red-500/50 text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Link to={createPageUrl("Login")} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className={`w-full mt-2 ${darkMode ? 'border-blue-500/50 text-white' : 'border-blue-500/70 text-gray-900'}`}>
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-8 relative z-10">
        {children}
      </main>

      <GlyphBotJr darkMode={darkMode} />

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl border-t ${darkMode ? 'border-blue-500/20' : 'border-blue-500/30'} py-12 relative z-10`}>
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
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Next-generation cybersecurity platform with quantum-resistant encryption and AI integration.
              </p>
            </div>
            
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Services</h3>
              <div className="flex flex-col gap-2 text-sm">
                {navigationConfig.footer.services.map((item) => (
                  <Link key={item.page} to={createPageUrl(item.page)} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-400 transition-colors`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Company</h3>
              <div className="flex flex-col gap-2 text-sm">
                {navigationConfig.footer.company.map((item) => (
                  <Link key={item.page} to={createPageUrl(item.page)} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-400 transition-colors`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal</h3>
              <div className="flex flex-col gap-2 text-sm">
                {navigationConfig.footer.legal.map((item) => (
                  <Link key={item.page} to={createPageUrl(item.page)} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-400 transition-colors`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className={`pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-300'}`}>
            <div className="mb-8">
              <h4 className={`text-center text-sm font-semibold mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>© 2025 GlyphLock Security LLC. All rights reserved.</p>
              </div>
              <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
