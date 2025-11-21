import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { SEO_DATA } from "@/components/seo/seoData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Map, FileText, Cpu, Lock, Globe, ArrowRight, ExternalLink } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Sitemap() {
  // Group pages for display
  const groups = {
    Core: ["Home", "About", "Contact", "Pricing", "Consultation"],
    Services: ["QRGenerator", "Steganography", "Blockchain", "InteractiveImageStudio", "HotzoneMapper", "NUPSLogin"],
    "AI Tools": ["GlyphBot", "ContentGenerator", "ImageGenerator"],
    Resources: ["SecurityDocs", "Roadmap", "Partners", "MasterCovenant"],
    Legal: ["Privacy", "Terms"]
  };

  const getIcon = (group) => {
    switch(group) {
      case "Core": return Globe;
      case "Services": return Shield;
      case "AI Tools": return Cpu;
      case "Resources": return Map;
      case "Legal": return Lock;
      default: return FileText;
    }
  };

  return (
    <>
      <SEOHead 
        title="Sitemap | GlyphLock Site Structure"
        description="Complete overview of the GlyphLock cybersecurity platform structure, services, and resources. Navigate our AI tools, security services, and documentation."
        url="/sitemap"
        keywords={["site map", "website structure", "GlyphLock navigation", "cybersecurity resources"]}
      />
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-royal-blue/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, #4169e1 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400 bg-cyan-500/10 px-3 py-1">
              Platform Overview
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-blue to-cyan">Site Map</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Navigate the complete GlyphLock ecosystem. From quantum-resistant tools and AI security agents to corporate governance and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groups).map(([groupName, pageKeys]) => {
              const Icon = getIcon(groupName);
              return (
                <Card key={groupName} className="glass-card border-royal-blue/20 bg-gray-900/40 backdrop-blur-md hover:border-royal-blue/40 transition-all duration-300">
                  <CardHeader className="pb-3 border-b border-royal-blue/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-royal-blue/10 text-royal-blue shadow-[0_0_15px_rgba(65,105,225,0.2)]">
                        <Icon size={24} />
                      </div>
                      <CardTitle className="text-xl font-bold text-white">{groupName}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2">
                    {pageKeys.map(key => {
                      const data = SEO_DATA[key];
                      if (!data) return null;
                      return (
                        <Link 
                          key={key} 
                          to={createPageUrl(key)}
                          className="group block p-3 rounded-lg hover:bg-royal-blue/10 transition-colors border border-transparent hover:border-royal-blue/20"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-200 group-hover:text-cyan-400 transition-colors font-medium flex items-center gap-2">
                              {data.title.split("|")[0].trim()}
                              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-cyan-400" />
                            </span>
                            {data.priority >= 0.9 && (
                              <Badge variant="outline" className="text-[10px] border-royal-blue/30 text-royal-blue px-1.5 py-0 h-5 bg-royal-blue/5">
                                Priority
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-400 transition-colors">
                            {data.description}
                          </p>
                        </Link>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="p-8 glass-card border border-royal-blue/20 rounded-xl bg-gradient-to-br from-royal-blue/5 to-transparent">
              <h3 className="text-xl font-bold text-white mb-3">Looking for something specific?</h3>
              <p className="text-gray-400 mb-6">Our AI assistant, GlyphBot, acts as a personalized guide to the platform. Ask it to find tools, explain features, or audit your security.</p>
              <Link to={createPageUrl("GlyphBot")}>
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-royal-blue to-blue-600 text-white hover:shadow-[0_0_20px_rgba(65,105,225,0.4)] transition-all text-sm font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Launch GlyphBot
                </button>
              </Link>
            </div>

            <div className="p-8 glass-card border border-cyan-500/20 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent">
              <h3 className="text-xl font-bold text-white mb-3">Developer Resources</h3>
              <p className="text-gray-400 mb-6">Access our comprehensive API documentation, SDKs, and integration guides to build secure applications with GlyphLock.</p>
              <Link to={createPageUrl("SecurityDocs")}>
                <button className="px-6 py-3 rounded-lg border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Documentation
                </button>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center text-gray-600 text-sm">
            <p>Indexed and Optimized for Global Search Engines</p>
            <div className="flex justify-center gap-4 mt-2">
              <span>Google</span> • <span>Bing</span> • <span>DuckDuckGo</span> • <span>Brave</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}