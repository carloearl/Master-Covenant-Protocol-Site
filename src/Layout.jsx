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

  const techCompanies = [
    { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
    { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
    { name: "Microsoft Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" },
    { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
    { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
    { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg" },
    { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
    { name: "Supabase", logo: "https://supabase.com/favicon/favicon-32x32.png" },
    { name: "MongoDB", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" },
    { name: "PostgreSQL", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
    { name: "Docker", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" },
    { name: "Kubernetes", logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" },
    { name: "GitHub", logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" },
    { name: "GitLab", logo: "https://about.gitlab.com/images/press/logo/svg/gitlab-icon-rgb.svg" },
    { name: "Cloudflare", logo: "https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png" },
    { name: "Twilio", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg" },
    { name: "SendGrid", logo: "https://sendgrid.com/wp-content/themes/sgdotcom/pages/resource/brand/2016/SendGrid-Logomark.png" },
    { name: "Redis", logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Logo-redis.svg" },
    { name: "Nginx", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Nginx_logo.svg" },
    { name: "Node.js", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
    { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
    { name: "TensorFlow", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg" },
    { name: "PyTorch", logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/PyTorch_logo_icon.svg" }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} relative`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-xl border-b ${darkMode ? 'border-blue-500/20' : 'border-blue-500/30'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Back Arrow + Logo */}
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
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    GlyphLock
                  </h1>
                  <p className={`text-xs ${darkMode ? 'text-white' : 'text-gray-600'}`}>Quantum Security</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to={createPageUrl("Home")}>
                <Button variant="ghost" className={isActive("Home") ? "text-blue-400" : `${darkMode ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}>
                  Home
                </Button>
              </Link>

              <Link to={createPageUrl("NUPSLogin")}>
                <Button variant="ghost" className={isActive("NUPSLogin") ? "text-blue-400" : `${darkMode ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}>
                  N.U.P.S. POS
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`${darkMode ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}>
                    Services <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`${darkMode ? 'bg-gray-900/90 border-blue-500/20' : 'bg-white/90 border-blue-500/30'} backdrop-blur-xl`}>
                  <DropdownMenuItem asChild className={`${darkMode ? 'text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20' : 'text-gray-900 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-500/10'} cursor-pointer`}>
                    <Link to={createPageUrl("SecurityTools")}>Security Tools</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className={`${darkMode ? 'text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20' : 'text-gray-900 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-500/10'} cursor-pointer`}>
                    <Link to={createPageUrl("QRGenerator")}>QR Generator</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className={`${darkMode ? 'text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20' : 'text-gray-900 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-500/10'} cursor-pointer`}>
                    <Link to={createPageUrl("Steganography")}>Steganography</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className={`${darkMode ? 'text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20' : 'text-gray-900 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-500/10'} cursor-pointer`}>
                    <Link to={createPageUrl("Blockchain")}>Blockchain Security</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className={`${darkMode ? 'text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20' : 'text-gray-900 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-500/10'} cursor-pointer`}>
                    <Link to={createPageUrl("HSSS")}>HSSS Surveillance</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className={`${darkMode ? 'text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20' : 'text-gray-900 hover:text-blue-600 focus:text-blue-600 focus:bg-blue-500/10'} cursor-pointer`}>
                    <Link to={createPageUrl("GlyphBot")}>GlyphBot AI</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to={createPageUrl("Pricing")}>
                <Button variant="ghost" className={isActive("Pricing") ? "text-blue-400" : `${darkMode ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}>
                  Pricing
                </Button>
              </Link>

              <Link to={createPageUrl("SecurityDocs")}>
                <Button variant="ghost" className={isActive("SecurityDocs") ? "text-blue-400" : `${darkMode ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}>
                  Security
                </Button>
              </Link>

              <Link to={createPageUrl("Contact")}>
                <Button variant="ghost" className={isActive("Contact") ? "text-blue-400" : `${darkMode ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}>
                  Contact
                </Button>
              </Link>

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
                  <DropdownMenuContent className={`${darkMode ? 'bg-gray-900/90 border-blue-500/20' : 'bg-white/90 border-blue-500/30'} backdrop-blur-xl`}>
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

            {/* Mobile Menu Button */}
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

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`lg:hidden py-4 border-t ${darkMode ? 'border-blue-500/20' : 'border-blue-500/30'}`}>
              <div className="flex flex-col gap-2">
                <Link to={createPageUrl("Home")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Home
                  </Button>
                </Link>
                <Link to={createPageUrl("NUPSLogin")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    N.U.P.S. POS
                  </Button>
                </Link>
                {user && (
                  <Link to={createPageUrl("Dashboard")} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link to={createPageUrl("SecurityTools")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Security Tools
                  </Button>
                </Link>
                <Link to={createPageUrl("HSSS")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    HSSS Surveillance
                  </Button>
                </Link>
                <Link to={createPageUrl("GlyphBot")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    GlyphBot AI
                  </Button>
                </Link>
                <Link to={createPageUrl("Pricing")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Pricing
                  </Button>
                </Link>
                <Link to={createPageUrl("SecurityDocs")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Security
                  </Button>
                </Link>
                <Link to={createPageUrl("Contact")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className={`w-full justify-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Contact
                  </Button>
                </Link>
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

      {/* Main Content */}
      <main className="pt-20 relative z-10">
        {children}
      </main>

      {/* GlyphBot Jr. Assistant */}
      <GlyphBotJr darkMode={darkMode} />

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900/60' : 'bg-white/60'} backdrop-blur-xl border-t ${darkMode ? 'border-blue-500/20' : 'border-blue-500/30'} py-12 relative z-10`}>
        <div className="container mx-auto px-4">
          {/* Technology Partners Marquee */}
          <div className="mb-12 overflow-hidden">
            <h3 className={`text-center text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Powered by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h3>
            <div className="relative">
              <div className="flex animate-marquee">
                {[...techCompanies, ...techCompanies].map((company, idx) => (
                  <div key={idx} className="flex-shrink-0 mx-6 flex items-center justify-center">
                    <div className={`${darkMode ? 'bg-white/5' : 'bg-gray-100/50'} backdrop-blur-sm rounded-lg p-4 h-20 w-32 flex items-center justify-center`}>
                      <img 
                        src={company.logo} 
                        alt={company.name}
                        className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <span className={`text-sm font-bold hidden ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {company.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
                  alt="GlyphLock"
                  className="h-8 w-auto"
                />
              </div>
              <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Next-generation cybersecurity platform with quantum-resistant encryption and AI integration.
              </p>
            </div>
            
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Services</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to={createPageUrl("NUPSLogin")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>N.U.P.S. POS</Link>
                <Link to={createPageUrl("SecurityTools")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Security Tools</Link>
                <Link to={createPageUrl("QRGenerator")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>QR Generator</Link>
                <Link to={createPageUrl("Blockchain")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Blockchain</Link>
                <Link to={createPageUrl("GlyphBot")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>GlyphBot AI</Link>
              </div>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Company</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to={createPageUrl("About")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>About Us</Link>
                <Link to={createPageUrl("Roadmap")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Roadmap</Link>
                <Link to={createPageUrl("Pricing")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Pricing</Link>
                <Link to={createPageUrl("SecurityDocs")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Security</Link>
                <Link to={createPageUrl("Contact")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Contact</Link>
                <Link to={createPageUrl("Consultation")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Book Consultation</Link>
              </div>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to={createPageUrl("Privacy")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Privacy Policy</Link>
                <Link to={createPageUrl("Terms")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Terms of Service</Link>
                <Link to={createPageUrl("SecurityDocs")} className={`${darkMode ? 'text-white' : 'text-gray-700'} hover:text-blue-400 transition-colors`}>Security Documentation</Link>
              </div>
            </div>
          </div>
          
          <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-300'}`}>
            {/* Compliance Badges */}
            <div className="mb-8">
              <h4 className={`text-center text-sm font-semibold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Compliance & Certifications
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <img src="https://logos-world.net/wp-content/uploads/2021/02/SOC-2-Logo.png" alt="SOC 2" className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                  <span className="text-xs text-gray-500">SOC 2 Type II</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/85/GDPR_logo.png" alt="GDPR" className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                  <span className="text-xs text-gray-500">GDPR Compliant</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src="https://oag.ca.gov/sites/default/files/CCPA%20logo.png" alt="CCPA" className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                  <span className="text-xs text-gray-500">CCPA Compliant</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/ISO_IEC_27001_logo.svg" alt="ISO 27001" className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                  <span className="text-xs text-gray-500">ISO 27001</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src="https://www.pcisecuritystandards.org/wp-content/uploads/2022/03/pci-logo.png" alt="PCI DSS" className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                  <span className="text-xs text-gray-500">PCI DSS</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src="https://companieslogo.com/img/orig/hipaa-b4e2d5d3.png" alt="HIPAA" className="h-12 object-contain opacity-70 hover:opacity-100 transition-opacity" />
                  <span className="text-xs text-gray-500">HIPAA Ready</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 text-center">
              <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <p>© 2025 GlyphLock Security LLC. All rights reserved.</p>
              </div>
              <div className={`text-sm space-y-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <p>El Mirage, Arizona • Established May 2025</p>
                <p>
                  <a href="https://www.glyphlock.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                    www.glyphlock.com
                  </a>
                </p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <a href="mailto:glyphlock@gmail.com" className="hover:text-blue-400 transition-colors">glyphlock@gmail.com</a>
                  {" • "}
                  <a href="tel:+14242466499" className="hover:text-blue-400 transition-colors">(424) 246-6499</a>
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              $340K D&B Verified Revenue • $14M Liability Coverage
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}