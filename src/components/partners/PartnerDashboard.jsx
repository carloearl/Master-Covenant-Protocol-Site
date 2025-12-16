import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, Award, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PartnerDashboard({ partner }) {
  const [copied, setCopied] = React.useState(false);

  const { data: leads = [] } = useQuery({
    queryKey: ['partner-leads', partner.id],
    queryFn: () => base44.entities.PartnerLead.filter({ partner_id: partner.id })
  });

  const stats = {
    totalLeads: leads.length,
    convertedLeads: leads.filter(l => l.status === 'won').length,
    pendingLeads: leads.filter(l => ['new', 'contacted', 'qualified'].includes(l.status)).length,
    totalRevenue: partner.total_revenue_generated,
    totalCommission: partner.total_commission_earned,
    conversionRate: leads.length > 0 ? ((leads.filter(l => l.status === 'won').length / leads.length) * 100).toFixed(1) : 0
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(partner.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Referral Code */}
      <Card className="glyph-glass-card">
        <CardHeader>
          <CardTitle className="text-white">Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-900/60 border-2 border-blue-500/50 rounded-lg px-6 py-4">
              <code className="text-2xl font-black text-blue-400">{partner.referral_code}</code>
            </div>
            <Button
              onClick={copyReferralCode}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Share this code with prospects. All leads using this code are automatically tracked.
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glyph-glass-card card-elevated-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div className="text-right">
                <div className="text-3xl font-black text-white">
                  ${stats.totalCommission.toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glyph-glass-card card-elevated-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <div className="text-right">
                <div className="text-3xl font-black text-white">{stats.totalLeads}</div>
                <div className="text-sm text-slate-400">Total Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glyph-glass-card card-elevated-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div className="text-right">
                <div className="text-3xl font-black text-white">{stats.conversionRate}%</div>
                <div className="text-sm text-slate-400">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glyph-glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Lead Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Pending</span>
              <span className="text-xl font-bold text-white">{stats.pendingLeads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Converted</span>
              <span className="text-xl font-bold text-green-400">{stats.convertedLeads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Total Revenue Generated</span>
              <span className="text-xl font-bold text-blue-400">
                ${stats.totalRevenue.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glyph-glass-card">
          <CardHeader>
            <CardTitle className="text-white">Partnership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Tier</span>
              <span className="text-xl font-bold text-white uppercase">{partner.tier}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Commission Rate</span>
              <span className="text-xl font-bold text-white">
                {(partner.commission_rate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Status</span>
              <span className="text-xl font-bold text-green-400 uppercase">{partner.status}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}