import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PartnerDashboard from "@/components/partners/PartnerDashboard";
import LeadsManager from "@/components/partners/LeadsManager";
import PerformanceTracker from "@/components/partners/PerformanceTracker";
import MarketingCollateral from "@/components/partners/MarketingCollateral";
import DocumentCenter from "@/components/partners/DocumentCenter";
import GlyphLoader from "@/components/GlyphLoader";
import SEOHead from "@/components/SEOHead";
import { Shield, Users, TrendingUp, Briefcase, FileText } from "lucide-react";

export default function PartnerPortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          await base44.auth.redirectToLogin();
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { data: partner, isLoading: partnerLoading } = useQuery({
    queryKey: ['partner', user?.email],
    queryFn: async () => {
      const partners = await base44.entities.Partner.filter({ email: user.email });
      return partners[0] || null;
    },
    enabled: !!user
  });

  if (loading || partnerLoading) {
    return <GlyphLoader text="Loading Partner Portal..." />;
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Partner Access Required</h1>
          <p className="text-slate-400">You are not registered as a GlyphLock partner. Contact us to apply for partnership.</p>
        </div>
      </div>
    );
  }

  if (partner.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-2xl font-bold mb-2">Partnership Pending</h1>
          <p className="text-slate-400">Your partnership application is under review. Status: {partner.status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-20 pb-16" style={{ background: 'transparent' }}>
      <SEOHead 
        title="Partner Portal - GlyphLock Security"
        description="Partner dashboard for tracking leads, performance, and accessing marketing materials"
        url="/partner-portal"
      />

      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Partner Portal</h1>
          <p className="text-xl text-slate-300">Welcome back, {partner.company_name}</p>
          <div className="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-4 py-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold uppercase tracking-wider">{partner.tier} Partner</span>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
              <Briefcase className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-blue-600">
              <Users className="w-4 h-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="marketing" className="data-[state=active]:bg-blue-600">
              <Briefcase className="w-4 h-4 mr-2" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PartnerDashboard partner={partner} />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsManager partner={partner} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTracker partner={partner} />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingCollateral partner={partner} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentCenter partner={partner} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}