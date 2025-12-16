import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, Target, Award } from "lucide-react";

export default function PerformanceTracker({ partner }) {
  const { data: leads = [] } = useQuery({
    queryKey: ['partner-leads', partner.id],
    queryFn: () => base44.entities.PartnerLead.filter({ partner_id: partner.id })
  });

  // Monthly performance data
  const monthlyData = React.useMemo(() => {
    const months = {};
    leads.forEach(lead => {
      const month = new Date(lead.created_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!months[month]) {
        months[month] = { month, leads: 0, revenue: 0, commission: 0 };
      }
      months[month].leads++;
      if (lead.status === 'won') {
        months[month].revenue += lead.actual_revenue || 0;
        months[month].commission += lead.commission_paid || 0;
      }
    });
    return Object.values(months).slice(-6); // Last 6 months
  }, [leads]);

  // Status distribution
  const statusData = React.useMemo(() => {
    const statuses = {};
    leads.forEach(lead => {
      statuses[lead.status] = (statuses[lead.status] || 0) + 1;
    });
    return Object.entries(statuses).map(([status, count]) => ({
      status: status.replace('_', ' '),
      count
    }));
  }, [leads]);

  const totalCommissionPending = leads
    .filter(l => l.status === 'won' && l.commission_status === 'pending')
    .reduce((sum, l) => sum + (l.commission_paid || 0), 0);

  const avgDealSize = leads.filter(l => l.status === 'won' && l.actual_revenue > 0).length > 0
    ? leads.filter(l => l.status === 'won').reduce((sum, l) => sum + (l.actual_revenue || 0), 0) / 
      leads.filter(l => l.status === 'won').length
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glyph-glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-slate-400">Conversion</span>
            </div>
            <div className="text-2xl font-black text-white">
              {leads.length > 0 
                ? ((leads.filter(l => l.status === 'won').length / leads.length) * 100).toFixed(1)
                : 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="glyph-glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <span className="text-sm text-slate-400">Avg Deal</span>
            </div>
            <div className="text-2xl font-black text-white">
              ${avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card className="glyph-glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-slate-400">Pending</span>
            </div>
            <div className="text-2xl font-black text-white">
              ${totalCommissionPending.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="glyph-glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-sm text-slate-400">Tier</span>
            </div>
            <div className="text-2xl font-black text-white uppercase">
              {partner.tier}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Chart */}
      <Card className="glyph-glass-card">
        <CardHeader>
          <CardTitle className="text-white">Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} name="Leads" />
              <Line type="monotone" dataKey="commission" stroke="#10b981" strokeWidth={2} name="Commission ($)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lead Status Distribution */}
      <Card className="glyph-glass-card">
        <CardHeader>
          <CardTitle className="text-white">Lead Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}