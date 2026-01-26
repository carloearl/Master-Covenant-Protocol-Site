import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, Minus, Users, DollarSign, 
  Clock, Trophy, Brain, Loader2, Download
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { toast } from "sonner";

export default function StaffPerformanceAnalytics() {
  const [period, setPeriod] = useState('week');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);

  const { data: shifts = [] } = useQuery({
    queryKey: ['shifts-analytics', period],
    queryFn: async () => {
      const all = await base44.entities.EntertainerShift.list('-created_date', 500);
      const cutoff = new Date();
      if (period === 'week') cutoff.setDate(cutoff.getDate() - 7);
      if (period === 'month') cutoff.setMonth(cutoff.getMonth() - 1);
      if (period === 'quarter') cutoff.setMonth(cutoff.getMonth() - 3);
      return all.filter(s => new Date(s.check_in_time) >= cutoff);
    }
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions-analytics', period],
    queryFn: async () => {
      const all = await base44.entities.POSTransaction.list('-created_date', 1000);
      const cutoff = new Date();
      if (period === 'week') cutoff.setDate(cutoff.getDate() - 7);
      if (period === 'month') cutoff.setMonth(cutoff.getMonth() - 1);
      if (period === 'quarter') cutoff.setMonth(cutoff.getMonth() - 3);
      return all.filter(t => new Date(t.created_date) >= cutoff);
    }
  });

  // Calculate staff metrics
  const staffMetrics = {};
  shifts.forEach(shift => {
    if (!staffMetrics[shift.stage_name]) {
      staffMetrics[shift.stage_name] = {
        name: shift.stage_name,
        totalShifts: 0,
        totalHours: 0,
        revenue: 0,
        vipSessions: 0
      };
    }
    staffMetrics[shift.stage_name].totalShifts++;
    
    if (shift.check_out_time) {
      const hours = (new Date(shift.check_out_time) - new Date(shift.check_in_time)) / 3600000;
      staffMetrics[shift.stage_name].totalHours += hours;
    }
    
    staffMetrics[shift.stage_name].revenue += shift.shift_earnings || 0;
    staffMetrics[shift.stage_name].vipSessions += shift.vip_sessions || 0;
  });

  const staffList = Object.values(staffMetrics).sort((a, b) => b.revenue - a.revenue);
  const topPerformers = staffList.slice(0, 5);

  // Performance trends by day
  const dailyPerformance = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayShifts = shifts.filter(s => 
      new Date(s.check_in_time).toDateString() === date.toDateString()
    );
    
    return {
      day: dayName,
      shifts: dayShifts.length,
      hours: dayShifts.reduce((sum, s) => {
        if (s.check_out_time) {
          return sum + (new Date(s.check_out_time) - new Date(s.check_in_time)) / 3600000;
        }
        return sum;
      }, 0),
      revenue: dayShifts.reduce((sum, s) => sum + (s.shift_earnings || 0), 0)
    };
  });

  const generateAIInsights = async () => {
    setAiLoading(true);
    try {
      const staffSummary = staffList.slice(0, 10).map(s => 
        `${s.name}: ${s.totalShifts} shifts, ${s.totalHours.toFixed(1)}h, $${s.revenue.toFixed(0)} revenue`
      ).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this staff performance data and provide actionable insights:

Period: ${period}
Total Staff: ${staffList.length}
Total Shifts: ${shifts.length}
Total Revenue: $${staffList.reduce((s, staff) => s + staff.revenue, 0).toFixed(2)}

Staff Performance:
${staffSummary}

Daily Trends:
${dailyPerformance.map(d => `${d.day}: ${d.shifts} shifts, ${d.hours.toFixed(1)}h, $${d.revenue.toFixed(0)}`).join('\n')}

Provide: top 3 performers analysis, underperformance alerts, scheduling recommendations, training needs, and retention strategies.`,
        response_json_schema: {
          type: "object",
          properties: {
            top_performers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  strengths: { type: "array", items: { type: "string" } }
                }
              }
            },
            alerts: { type: "array", items: { type: "string" } },
            scheduling_recommendations: { type: "array", items: { type: "string" } },
            training_needs: { type: "array", items: { type: "string" } },
            retention_strategies: { type: "array", items: { type: "string" } }
          }
        }
      });
      setAiInsights(response);
      toast.success('AI analysis complete');
    } catch (err) {
      toast.error('AI analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  const exportData = () => {
    const data = { staffMetrics: staffList, dailyPerformance, aiInsights, period };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff-performance-${period}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-slate-900/50 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={generateAIInsights} disabled={aiLoading} className="bg-gradient-to-r from-purple-600 to-cyan-600">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Brain className="w-4 h-4 mr-2" />}
                AI Insights
              </Button>
              <Button onClick={exportData} variant="outline" className="border-slate-600">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-cyan-500/30">
          <CardContent className="p-4">
            <Users className="w-5 h-5 text-cyan-400 mb-2" />
            <div className="text-3xl font-bold text-white">{staffList.length}</div>
            <div className="text-sm text-slate-400">Active Staff</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-green-500/30">
          <CardContent className="p-4">
            <DollarSign className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-3xl font-bold text-white">
              ${staffList.reduce((s, staff) => s + staff.revenue, 0).toFixed(0)}
            </div>
            <div className="text-sm text-slate-400">Total Revenue</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardContent className="p-4">
            <Clock className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-3xl font-bold text-white">
              {staffList.reduce((s, staff) => s + staff.totalHours, 0).toFixed(0)}h
            </div>
            <div className="text-sm text-slate-400">Total Hours</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-amber-500/30">
          <CardContent className="p-4">
            <Trophy className="w-5 h-5 text-amber-400 mb-2" />
            <div className="text-3xl font-bold text-white">{shifts.length}</div>
            <div className="text-sm text-slate-400">Total Shifts</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Top 5 Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topPerformers.map((staff, i) => (
              <div key={staff.name} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{staff.name}</p>
                    <p className="text-xs text-slate-400">{staff.totalShifts} shifts • {staff.totalHours.toFixed(1)}h</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">${staff.revenue.toFixed(0)}</p>
                  <p className="text-xs text-slate-400">{staff.vipSessions} VIP sessions</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends Chart */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Daily Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="shifts" stroke="#8b5cf6" strokeWidth={2} name="Shifts" />
                <Line yAxisId="left" type="monotone" dataKey="hours" stroke="#06b6d4" strokeWidth={2} name="Hours" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {aiInsights && (
        <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              AI Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Top Performers */}
            {aiInsights.top_performers?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-3">🏆 Top Performers</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {aiInsights.top_performers.map((perf, i) => (
                    <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                      <p className="text-white font-semibold mb-2">{perf.name}</p>
                      <ul className="space-y-1">
                        {perf.strengths.map((s, j) => (
                          <li key={j} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-cyan-400">✓</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts */}
            {aiInsights.alerts?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-yellow-400 mb-3">⚠️ Performance Alerts</h4>
                <div className="space-y-2">
                  {aiInsights.alerts.map((alert, i) => (
                    <div key={i} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30 text-sm text-slate-300">
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduling Recommendations */}
            {aiInsights.scheduling_recommendations?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-purple-400 mb-3">📅 Scheduling Recommendations</h4>
                <div className="space-y-2">
                  {aiInsights.scheduling_recommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-slate-800/50 rounded-lg text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-purple-400">{i + 1}.</span>{rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training Needs */}
            {aiInsights.training_needs?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-3">📚 Training Recommendations</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {aiInsights.training_needs.map((need, i) => (
                    <Badge key={i} className="bg-blue-500/20 text-blue-400 p-2 text-xs">{need}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Retention Strategies */}
            {aiInsights.retention_strategies?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-3">💎 Retention Strategies</h4>
                <div className="space-y-2">
                  {aiInsights.retention_strategies.map((strat, i) => (
                    <div key={i} className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-sm text-slate-300">
                      {strat}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}