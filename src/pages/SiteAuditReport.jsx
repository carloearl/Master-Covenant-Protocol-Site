import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, CheckCircle2, XCircle, AlertTriangle, 
  Shield, CreditCard, Smartphone, Globe, Zap 
} from "lucide-react";

export default function SiteAuditReport() {
  const criticalIssues = [
    {
      id: 1,
      title: "Stripe Checkout - Subscription Flow",
      status: "NEEDS_TESTING",
      severity: "critical",
      description: "Webhook exists and looks correct. User entity has required fields. Need to test actual checkout flow.",
      blocksRevenue: true,
      fixes: [
        "Test checkout with real Stripe test card",
        "Verify webhook is receiving events from Stripe",
        "Confirm User entity gets updated after purchase",
        "Test ManageSubscription page after successful purchase"
      ]
    },
    {
      id: 2,
      title: "White Backgrounds - UI Components",
      status: "PARTIAL",
      severity: "high",
      description: "Global CSS has rules but some Radix UI components may still show white backgrounds in certain states.",
      blocksRevenue: false,
      fixes: [
        "Audit all dropdown menus (navigation, forms)",
        "Check Select components on all forms",
        "Test modal dialogs and popovers",
        "Verify Card components on Pricing page",
        "Add more specific CSS selectors if needed"
      ]
    },
    {
      id: 3,
      title: "Mobile Responsiveness",
      status: "NEEDS_TESTING",
      severity: "high",
      description: "Site has responsive classes but needs real device testing.",
      blocksRevenue: false,
      fixes: [
        "Test on iPhone (Safari)",
        "Test on Android (Chrome)",
        "Test navigation mobile menu",
        "Test forms on mobile",
        "Test pricing cards on small screens",
        "Verify touch targets are 44px minimum"
      ]
    }
  ];

  const mediumIssues = [
    {
      title: "Error Handling & User Feedback",
      items: [
        "Add ErrorBoundary to critical pages",
        "Improve error messages (less technical)",
        "Add toast notifications",
        "Add retry mechanisms for API failures"
      ]
    },
    {
      title: "Form Validation",
      items: [
        "Verify Consultation form validation",
        "Check Contact form validation",
        "Test all form error states",
        "Ensure helpful error messages"
      ]
    },
    {
      title: "SEO Verification",
      items: [
        "Confirm robots.txt is accessible",
        "Verify sitemap.xml is accessible",
        "Submit to Google Search Console",
        "Test structured data with Google Rich Results"
      ]
    }
  ];

  const testingChecklist = {
    criticalPaths: [
      { path: "User visits homepage", tested: true, status: "pass" },
      { path: "User navigates all pages", tested: true, status: "pass" },
      { path: "User signs up/logs in", tested: false, status: "pending" },
      { path: "User views pricing", tested: true, status: "pass" },
      { path: "User purchases subscription", tested: false, status: "blocked" },
      { path: "User accesses dashboard", tested: true, status: "pass" },
      { path: "User uses security tools", tested: false, status: "pending" },
      { path: "User manages subscription", tested: false, status: "blocked" },
      { path: "User contacts support", tested: true, status: "pass" }
    ],
    pages: [
      { name: "Home", visual: "pass", mobile: "pending", functionality: "pass" },
      { name: "Services", visual: "pass", mobile: "pending", functionality: "pass" },
      { name: "Solutions", visual: "pass", mobile: "pending", functionality: "pass" },
      { name: "About", visual: "pass", mobile: "pending", functionality: "pass" },
      { name: "FAQ", visual: "pass", mobile: "pending", functionality: "pass" },
      { name: "Pricing", visual: "warning", mobile: "pending", functionality: "blocked" },
      { name: "Contact", visual: "pass", mobile: "pending", functionality: "pending" },
      { name: "Dashboard", visual: "pass", mobile: "pending", functionality: "pending" },
      { name: "ManageSubscription", visual: "pass", mobile: "pending", functionality: "blocked" }
    ]
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: "bg-red-500/20 text-red-400 border-red-500/50",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      low: "bg-blue-500/20 text-blue-400 border-blue-500/50"
    };
    return colors[severity] || colors.medium;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pass: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      blocked: <XCircle className="w-5 h-5 text-red-400" />,
      pending: <AlertCircle className="w-5 h-5 text-gray-400" />
    };
    return icons[status] || icons.pending;
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Site <span className="text-blue-400">Audit Report</span>
          </h1>
          <p className="text-xl text-gray-400">
            Complete testing & issue tracking for GlyphLock Security platform
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-sm px-4 py-2">
              {criticalIssues.filter(i => i.severity === 'critical').length} Critical Issues
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 text-sm px-4 py-2">
              {criticalIssues.filter(i => i.severity === 'high').length} High Priority
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-sm px-4 py-2">
              {mediumIssues.length} Medium Priority
            </Badge>
          </div>
        </div>

        {/* Critical Issues */}
        <Card className="glass-card-dark border-red-500/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-6 h-6" />
              Critical & High Priority Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {criticalIssues.map((issue) => (
              <div key={issue.id} className="glass-card-dark border-l-4 border-red-500/50 p-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{issue.title}</h3>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                    {issue.blocksRevenue && (
                      <Badge className="ml-2 bg-red-600/30 text-red-300 border-red-600/50">
                        BLOCKS REVENUE
                      </Badge>
                    )}
                  </div>
                  <Badge className={
                    issue.status === 'NEEDS_TESTING' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                    issue.status === 'PARTIAL' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                    'bg-gray-500/20 text-gray-400 border-gray-500/50'
                  }>
                    {issue.status}
                  </Badge>
                </div>
                <p className="text-gray-300 mb-4">{issue.description}</p>
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">Required Fixes:</h4>
                  <ul className="space-y-2">
                    {issue.fixes.map((fix, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="text-blue-400">→</span>
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medium Priority */}
        <Card className="glass-card-dark border-yellow-500/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-6 h-6" />
              Medium Priority Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mediumIssues.map((issue, idx) => (
              <div key={idx} className="glass-card-dark p-4 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-3">{issue.title}</h3>
                <ul className="space-y-2">
                  {issue.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Testing Checklist */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card-dark border-blue-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Zap className="w-5 h-5" />
                Critical User Paths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {testingChecklist.criticalPaths.map((test, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 glass-card-dark rounded-lg">
                  <span className="text-white text-sm">{test.path}</span>
                  {getStatusIcon(test.status)}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card-dark border-blue-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Globe className="w-5 h-5" />
                Page Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {testingChecklist.pages.map((page, idx) => (
                <div key={idx} className="glass-card-dark p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{page.name}</span>
                    {getStatusIcon(page.functionality)}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Badge className={`${
                      page.visual === 'pass' ? 'bg-green-500/20 text-green-400' :
                      page.visual === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    } border-0`}>
                      Visual: {page.visual}
                    </Badge>
                    <Badge className="bg-gray-500/20 text-gray-400 border-0">
                      Mobile: {page.mobile}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Immediate Action Plan */}
        <Card className="glass-card-dark border-green-500/50 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Shield className="w-6 h-6" />
              Immediate Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="glass-card-dark p-4 rounded-lg">
              <h3 className="font-bold text-white mb-3">🔴 TODAY (Critical):</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">1.</span>
                  <span>Test Stripe checkout with test card (4242 4242 4242 4242)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">2.</span>
                  <span>Verify webhook receives checkout.session.completed event</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">3.</span>
                  <span>Confirm User entity updates with subscription data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">4.</span>
                  <span>Test ManageSubscription page works after purchase</span>
                </li>
              </ul>
            </div>

            <div className="glass-card-dark p-4 rounded-lg">
              <h3 className="font-bold text-white mb-3">🟠 TODAY (High Priority):</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400">5.</span>
                  <span>Audit all dropdowns/selects for white backgrounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400">6.</span>
                  <span>Test Pricing page cards on different browsers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400">7.</span>
                  <span>Fix any remaining white background issues</span>
                </li>
              </ul>
            </div>

            <div className="glass-card-dark p-4 rounded-lg">
              <h3 className="font-bold text-white mb-3">🟡 TOMORROW:</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">8.</span>
                  <span>Mobile device testing (iOS & Android)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">9.</span>
                  <span>Fix responsive issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">10.</span>
                  <span>Test all forms on mobile</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Summary */}
        <div className="mt-12 text-center">
          <div className="glass-card-dark border-blue-500/30 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">Current Status</h2>
            <p className="text-gray-400 mb-6">
              Site infrastructure is solid. Webhook and entity schema look correct. 
              Need real-world testing to verify checkout flow and identify any remaining visual issues.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2">
                ✅ Backend: Ready
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2">
                ✅ Frontend: Ready
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-4 py-2">
                ⚠️ Testing: Required
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-4 py-2">
                ⚠️ Mobile: Needs Testing
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}