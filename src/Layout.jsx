
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (pageName) => location.pathname === createPageUrl(pageName);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  GlyphLock
                </h1>
                <p className="text-xs text-gray-400">Quantum Security</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to={createPageUrl("Home")}>
                <Button variant="ghost" className={isActive("Home") ? "text-cyan-400" : "text-gray-300 hover:text-white"}>
                  Home
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Services <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-cyan-500/20">
                  <DropdownMenuItem asChild className="text-gray-300 hover:text-white focus:text-white focus:bg-cyan-500/20">
                    <Link to={createPageUrl("MasterCovenant")}>Master Covenant</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-300 hover:text-white focus:text-white focus:bg-cyan-500/20">
                    <Link to={createPageUrl("SecurityTools")}>Security Tools</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-300 hover:text-white focus:text-white focus:bg-cyan-500/20">
                    <Link to={createPageUrl("QRGenerator")}>QR Generator</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-300 hover:text-white focus:text-white focus:bg-cyan-500/20">
                    <Link to={createPageUrl("Steganography")}>Steganography</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-300 hover:text-white focus:text-white focus:bg-cyan-500/20">
                    <Link to={createPageUrl("Blockchain")}>Blockchain Security</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-300 hover:text-white focus:text-white focus:bg-cyan-500/20">
                    <Link to={createPageUrl("GlyphBot")}>GlyphBot AI</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to={createPageUrl("Pricing")}>
                <Button variant="ghost" className={isActive("Pricing") ? "text-cyan-400" : "text-gray-300 hover:text-white"}>
                  Pricing
                </Button>
              </Link>

              <Link to={createPageUrl("Contact")}>
                <Button variant="ghost" className={isActive("Contact") ? "text-cyan-400" : "text-gray-300 hover:text-white"}>
                  Contact
                </Button>
              </Link>

              <Link to={createPageUrl("Consultation")} className="ml-4">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Book Consultation
                </Button>
              </Link>
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
            <div className="lg:hidden py-4 border-t border-cyan-500/20">
              <div className="flex flex-col gap-2">
                <Link to={createPageUrl("Home")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-300">
                    Home
                  </Button>
                </Link>
                <Link to={createPageUrl("MasterCovenant")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-300">
                    Master Covenant
                  </Button>
                </Link>
                <Link to={createPageUrl("SecurityTools")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-300">
                    Security Tools
                  </Button>
                </Link>
                <Link to={createPageUrl("GlyphBot")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-300">
                    GlyphBot AI
                  </Button>
                </Link>
                <Link to={createPageUrl("Pricing")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-300">
                    Pricing
                  </Button>
                </Link>
                <Link to={createPageUrl("Contact")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-300">
                    Contact
                  </Button>
                </Link>
                <Link to={createPageUrl("Consultation")} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 mt-2">
                    Book Consultation
                  </Button>
                </Link>
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
      <footer className="bg-gray-900 border-t border-cyan-500/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
                <span className="text-xl font-bold">GlyphLock</span>
              </div>
              <p className="text-gray-400 text-sm">
                Next-generation cybersecurity platform with quantum-resistant encryption and AI integration.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to={createPageUrl("MasterCovenant")} className="text-gray-400 hover:text-cyan-400">Master Covenant</Link>
                <Link to={createPageUrl("SecurityTools")} className="text-gray-400 hover:text-cyan-400">Security Tools</Link>
                <Link to={createPageUrl("QRGenerator")} className="text-gray-400 hover:text-cyan-400">QR Generator</Link>
                <Link to={createPageUrl("Blockchain")} className="text-gray-400 hover:text-cyan-400">Blockchain</Link>
                <Link to={createPageUrl("GlyphBot")} className="text-gray-400 hover:text-cyan-400">GlyphBot AI</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to={createPageUrl("Home")} className="text-gray-400 hover:text-cyan-400">About Us</Link>
                <Link to={createPageUrl("Pricing")} className="text-gray-400 hover:text-cyan-400">Pricing</Link>
                <Link to={createPageUrl("Contact")} className="text-gray-400 hover:text-cyan-400">Contact</Link>
                <Link to={createPageUrl("Consultation")} className="text-gray-400 hover:text-cyan-400">Book Consultation</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#" className="text-gray-400 hover:text-cyan-400">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400">Security</a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 GlyphLock. All rights reserved. Quantum-resistant security for the future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
