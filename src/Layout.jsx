import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    checkUser();
  }, []);

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

  const isActive = (pageName) => location.pathname === createPageUrl(pageName);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-blue-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
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
                <p className="text-xs text-white">Quantum Security</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to={createPageUrl("Home")}>
                <Button variant="ghost" className={isActive("Home") ? "text-blue-400" : "text-white hover:text-blue-400"}>
                  Home
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-blue-400">
                    Services <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-blue-500/20">
                  <DropdownMenuItem asChild className="text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20 cursor-pointer">
                    <Link to={createPageUrl("MasterCovenant")}>Master Covenant</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20 cursor-pointer">
                    <Link to={createPageUrl("SecurityTools")}>Security Tools</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20 cursor-pointer">
                    <Link to={createPageUrl("QRGenerator")}>QR Generator</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20 cursor-pointer">
                    <Link to={createPageUrl("Steganography")}>Steganography</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20 cursor-pointer">
                    <Link to={createPageUrl("Blockchain")}>Blockchain Security</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20 cursor-pointer">
                    <Link to={createPageUrl("HSSS")}>HSSS Surveillance</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-white hover:text-blue-400 focus:text-blue-400 focus:bg-blue-500/20 cursor-pointer">
                    <Link to={createPageUrl("GlyphBot")}>GlyphBot AI</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to={createPageUrl("Pricing")}>
                <Button variant="ghost" className={isActive("Pricing") ? "text-blue-400" : "text-white hover:text-blue-400"}>
                  Pricing
                </Button>
              </Link>

              <Link to={createPageUrl("SecurityDocs")}>
                <Button variant="ghost" className={isActive("SecurityDocs") ? "text-blue-400" : "text-white hover:text-blue-400"}>
                  Security
                </Button>
              </Link>

              <Link to={createPageUrl("Contact")}>
                <Button variant="ghost" className={isActive("Contact") ? "text-blue-400" : "text-white hover:text-blue-400"}>
                  Contact
                </Button>
              </Link>

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
                  <DropdownMenuContent className="bg-gray-900 border-blue-500/20">
                    <DropdownMenuItem className="text-white focus:bg-blue-500/20">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
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
                  <Button variant="outline" className="border-blue-500/50 text-white hover:bg-blue-500/10">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-blue-500/20">
              <div className="flex flex-col gap-2">
                <Link to={createPageUrl("Home")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    Home
                  </Button>
                </Link>
                <Link to={createPageUrl("MasterCovenant")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    Master Covenant
                  </Button>
                </Link>
                <Link to={createPageUrl("SecurityTools")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    Security Tools
                  </Button>
                </Link>
                <Link to={createPageUrl("HSSS")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    HSSS Surveillance
                  </Button>
                </Link>
                <Link to={createPageUrl("GlyphBot")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    GlyphBot AI
                  </Button>
                </Link>
                <Link to={createPageUrl("Pricing")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    Pricing
                  </Button>
                </Link>
                <Link to={createPageUrl("SecurityDocs")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    Security
                  </Button>
                </Link>
                <Link to={createPageUrl("Contact")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-white">
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
                    <Button variant="outline" className="w-full mt-2 border-blue-500/50 text-white">
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
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-blue-500/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6902128ac3c5c94a82446585/08025b614_gl-logo.png"
                  alt="GlyphLock"
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-white text-sm">
                Next-generation cybersecurity platform with quantum-resistant encryption and AI integration.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Services</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to={createPageUrl("MasterCovenant")} className="text-white hover:text-blue-400 transition-colors">Master Covenant</Link>
                <Link to={createPageUrl("SecurityTools")} className="text-white hover:text-blue-400 transition-colors">Security Tools</Link>
                <Link to={createPageUrl("QRGenerator")} className="text-white hover:text-blue-400 transition-colors">QR Generator</Link>
                <Link to={createPageUrl("Blockchain")} className="text-white hover:text-blue-400 transition-colors">Blockchain</Link>
                <Link to={createPageUrl("GlyphBot")} className="text-white hover:text-blue-400 transition-colors">GlyphBot AI</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to={createPageUrl("Home")} className="text-white hover:text-blue-400 transition-colors">About Us</Link>
                <Link to={createPageUrl("Pricing")} className="text-white hover:text-blue-400 transition-colors">Pricing</Link>
                <Link to={createPageUrl("SecurityDocs")} className="text-white hover:text-blue-400 transition-colors">Security</Link>
                <Link to={createPageUrl("Contact")} className="text-white hover:text-blue-400 transition-colors">Contact</Link>
                <Link to={createPageUrl("Consultation")} className="text-white hover:text-blue-400 transition-colors">Book Consultation</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to={createPageUrl("Privacy")} className="text-white hover:text-blue-400 transition-colors">Privacy Policy</Link>
                <Link to={createPageUrl("Terms")} className="text-white hover:text-blue-400 transition-colors">Terms of Service</Link>
                <Link to={createPageUrl("SecurityDocs")} className="text-white hover:text-blue-400 transition-colors">Security Documentation</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-white">
            <p>© 2025 GlyphLock. All rights reserved. Quantum-resistant security for the future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}