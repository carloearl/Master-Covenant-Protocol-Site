import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import GlyphLoader from "@/components/GlyphLoader";
import ConsoleLayout from "@/components/console/ConsoleLayout";
import DashboardHome from "@/components/console/DashboardHome";
import APIKeyVault from "@/components/console/APIKeyVault";
import SDKDownloadCenter from "@/components/console/SDKDownloadCenter";
import AdminUserManagement from "@/components/console/AdminUserManagement";
import LogsPanel from "@/components/console/LogsPanel";
import EdgeFunctionExplorer from "@/components/console/EdgeFunctionExplorer";
import SecuritySettings from "@/components/console/SecuritySettings";
import APIReference from "@/components/console/APIReference";
import BillingAndPayments from "@/components/console/BillingAndPayments";
import AdminBillingOverview from "@/components/console/admin/AdminBillingOverview";
import TeamAndRoles from "@/components/console/TeamAndRoles";
import AuditTimeline from "@/components/console/AuditTimeline";
import OnboardingWizard from "@/components/console/OnboardingWizard";
import SupportCenter from "@/components/console/SupportCenter";
import SessionGuard from "@/components/console/SessionGuard";

export default function EnterpriseConsole() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState("dashboard");
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
    return <GlyphLoader text="Loading GlyphLock Console..." />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardHome user={user} />;
      case "api-keys":
        return <APIKeyVault user={user} />;
      case "sdk":
        return <SDKDownloadCenter />;
      case "users":
        return <AdminUserManagement user={user} />;
      case "logs":
        return <LogsPanel user={user} />;
      case "functions":
        return <EdgeFunctionExplorer />;
      case "security":
        return <SecuritySettings user={user} />;
      case "api-reference":
        return <APIReference />;
      case "billing":
        return <BillingAndPayments user={user} />;
      case "admin-billing":
        return <AdminBillingOverview user={user} />;
      case "team-roles":
        return <TeamAndRoles user={user} />;
      case "audit-timeline":
        return <AuditTimeline user={user} />;
      case "support":
        return <SupportCenter user={user} />;
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <>
      <SEOHead
        title="GlyphLock Enterprise Console - Secure API & Key Management"
        description="Manage API keys, monitor security, deploy edge functions, and control your GlyphLock enterprise infrastructure."
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