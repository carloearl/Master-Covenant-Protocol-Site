import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import GlyphLoader from "@/components/GlyphLoader";
import ConsoleLayout from "@/components/console/ConsoleLayout";
import APIKeyVault from "@/components/console/APIKeyVault";
import SDKDownloadCenter from "@/components/console/SDKDownloadCenter";
import LogsPanel from "@/components/console/LogsPanel";
import EdgeFunctionExplorer from "@/components/console/EdgeFunctionExplorer";
import SecuritySettings from "@/components/console/SecuritySettings";
import APIReference from "@/components/console/APIReference";
import BillingAndPayments from "@/components/console/BillingAndPayments";
import AdminBillingOverview from "@/components/console/admin/AdminBillingOverview";
import TeamAndRoles from "@/components/console/TeamAndRoles";
import AuditTimeline from "@/components/console/AuditTimeline";
import OnboardingWizard from "@/components/console/OnboardingWizard";
import SessionGuard from "@/components/console/SessionGuard";
import UsagePanel from "@/components/console/UsagePanel";

export default function CommandCenter() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState("api-keys");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [billingStatus, setBillingStatus] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          navigate("/");
          return;
        }
        const userData = await base44.auth.me();
        setUser(userData);

        // Check onboarding status
        try {
          const status = await base44.functions.invoke('getBillingStatus');
          setBillingStatus(status.data);
          if (status.data && !status.data.onboardingComplete) {
            setShowOnboarding(true);
          }
        } catch (e) {
          console.error('Failed to check onboarding status:', e);
        }
        } catch (err) {
        console.error("Auth error:", err);
        navigate("/");
        } finally {
        setLoading(false);
        }
    })();
  }, [navigate]);

  if (loading) {
    return <GlyphLoader text="Initializing Command Center..." />;
  }

  const renderModule = () => {
    // Developer Mode Modules
    if (activeModule === "api-keys") return <APIKeyVault user={user} />;
    if (activeModule === "sdk") return <SDKDownloadCenter />;
    if (activeModule === "functions") return <EdgeFunctionExplorer />;
    if (activeModule === "api-reference") return <APIReference />;
    if (activeModule === "logs") return <LogsPanel user={user} />;

    // Enterprise Mode Modules
    if (activeModule === "billing") return <BillingAndPayments user={user} />;
    if (activeModule === "usage") return <UsagePanel user={user} />;
    if (activeModule === "team-roles") return <TeamAndRoles user={user} />;
    if (activeModule === "audit-timeline") return <AuditTimeline user={user} />;
    if (activeModule === "security") return <SecuritySettings user={user} />;

    // Admin Only Modules
    if (activeModule === "admin-billing") {
      if (user?.role !== 'admin') {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-white/60">This section requires admin privileges.</p>
            </div>
          </div>
        );
      }
      return <AdminBillingOverview user={user} />;
    }

    // Default: redirect to API Keys (first developer tab)
    return <APIKeyVault user={user} />;
  };

  return (
    <>
      <SEOHead
        title="GlyphLock Command Center - Security Operations & API Management"
        description="Unified command center for GlyphLock operations: manage API keys, monitor security, deploy functions, control infrastructure, and access enterprise tools."
      />

      {showOnboarding && (
        <OnboardingWizard 
          onClose={() => setShowOnboarding(false)}
          onNavigate={setActiveModule}
          completedSteps={billingStatus?.completedOnboardingSteps || []}
        />
      )}

      <SessionGuard>
        <ConsoleLayout user={user} activeModule={activeModule} setActiveModule={setActiveModule}>
          <div className="p-8">
            {renderModule()}
          </div>
        </ConsoleLayout>
      </SessionGuard>
    </>
  );
}