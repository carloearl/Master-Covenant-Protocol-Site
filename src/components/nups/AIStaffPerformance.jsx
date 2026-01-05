import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, Trophy, TrendingUp, Clock, DollarSign, 
  Loader2, Download, Brain, Star, Target, Award,
  MessageSquare, AlertTriangle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export default function AIStaffPerformance() {
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'generateStaffPerformance',
        data: { period }
      });
      setReport(data.report);
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-cyan-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceBadge = (level) => {
    const badges = {
      'Top Performer': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Strong': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Average': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Needs Improvement': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return badges[level] || badges['Average'];
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-slate-900/50 border-cyan-500/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Analysis Period</label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="daily">Today</SelectItem>
                    <SelectItem value="weekly">This Week</SelectItem>
                    <SelectItem value="monthly">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={generateReport} 
              disabled={loading}
              className="bg-gradient-to-r from-cyan-600 to-purple-600"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
              {loading ? 'Analyzing...' : 'Analyze Performance'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {report && (
        <Tabs defaultValue="leaderboard" className="space-y-4">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="vip">VIP Service</TabsTrigger>
            <TabsTrigger value="training">Training Insights</TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Top 3 Performers */}
              <Card className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-500/30 md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {(report.leaderboard || []).slice(0, 3).map((staff, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-lg border ${
                          i === 0 ? 'bg-amber-500/10 border-amber-500/30' :
                          i === 1 ? 'bg-slate-400/10 border-slate-400/30' :
                          'bg-amber-700/10 border-amber-700/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`text-3xl font-bold ${
                            i === 0 ? 'text-amber-400' :
                            i === 1 ? 'text-slate-300' :
                            'text-amber-600'
                          }`}>
                            #{i + 1}
                          </div>
                          <div>
                            <div className="text-white font-medium">{staff.name}</div>
                            <Badge className={getPerformanceBadge(staff.performanceLevel)}>
                              {staff.performanceLevel}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-slate-400">Sales</div>
                            <div className="text-green-400 font-medium">${staff.totalSales?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Transactions</div>
                            <div className="text-cyan-400 font-medium">{staff.transactions}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Avg Ticket</div>
                            <div className="text-purple-400 font-medium">${staff.avgTicket?.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Score</div>
                            <div className={`font-bold ${getPerformanceColor(staff.overallScore)}`}>
                              {staff.overallScore}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Full Leaderboard */}
              <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Complete Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {(report.leaderboard || []).map((staff, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedStaff?.name === staff.name 
                            ? 'bg-purple-500/20 border border-purple-500/30' 
                            : 'bg-slate-900/50 hover:bg-slate-800/50'
                        }`}
                        onClick={() => setSelectedStaff(staff)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-slate-500 w-8">#{i + 1}</span>
                          <div>
                            <div className="text-white font-medium">{staff.name}</div>
                            <div className="text-xs text-slate-400">{staff.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-green-400 font-medium">${staff.totalSales?.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">{staff.transactions} txns</div>
                          </div>
                          <div className={`text-xl font-bold ${getPerformanceColor(staff.overallScore)}`}>
                            {staff.overallScore}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Staff Details */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Staff Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStaff ? (
                    <div className="space-y-4">
                      <div className="text-center pb-4 border-b border-slate-700">
                        <div className="text-xl font-bold text-white">{selectedStaff.name}</div>
                        <Badge className={getPerformanceBadge(selectedStaff.performanceLevel)}>
                          {selectedStaff.performanceLevel}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Sales Performance</span>
                            <span className="text-cyan-400">{selectedStaff.salesScore}%</span>
                          </div>
                          <Progress value={selectedStaff.salesScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Efficiency</span>
                            <span className="text-purple-400">{selectedStaff.efficiencyScore}%</span>
                          </div>
                          <Progress value={selectedStaff.efficiencyScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">VIP Service</span>
                            <span className="text-pink-400">{selectedStaff.vipScore}%</span>
                          </div>
                          <Progress value={selectedStaff.vipScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Upsell Success</span>
                            <span className="text-green-400">{selectedStaff.upsellScore}%</span>
                          </div>
                          <Progress value={selectedStaff.upsellScore} className="h-2" />
                        </div>
                      </div>

                      {selectedStaff.strengths && (
                        <div className="pt-3 border-t border-slate-700">
                          <div className="text-xs text-slate-400 mb-2">Strengths</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedStaff.strengths.map((s, i) => (
                              <Badge key={i} className="bg-green-500/20 text-green-400 text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Select a staff member to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sales Comparison */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Sales by Staff</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.leaderboard || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `$${v}`} />
                        <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={80} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                          formatter={(v) => `$${v.toLocaleString()}`}
                        />
                        <Bar dataKey="totalSales" fill="#10b981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Efficiency */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Transaction Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.efficiencyMetrics || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        />
                        <Bar dataKey="avgTime" name="Avg Time (sec)" fill="#8b5cf6" />
                        <Bar dataKey="avgTicket" name="Avg Ticket ($)" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Team Averages */}
              <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Team Performance Averages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                      <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-400" />
                      <div className="text-2xl font-bold text-green-400">
                        ${report.teamAverages?.avgSales?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-slate-400">Avg Sales/Staff</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                      <div className="text-2xl font-bold text-cyan-400">
                        {report.teamAverages?.avgTxnTime || 0}s
                      </div>
                      <div className="text-xs text-slate-400">Avg Txn Time</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                      <Target className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                      <div className="text-2xl font-bold text-purple-400">
                        {report.teamAverages?.upsellRate || 0}%
                      </div>
                      <div className="text-xs text-slate-400">Upsell Rate</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                      <Star className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                      <div className="text-2xl font-bold text-amber-400">
                        {report.teamAverages?.avgScore || 0}%
                      </div>
                      <div className="text-xs text-slate-400">Avg Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* VIP Service Tab */}
          <TabsContent value="vip">
            <div className="grid md:grid-cols-2 gap-6">
              {/* VIP Response Times */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">VIP Response Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(report.vipMetrics || []).map((staff, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{staff.name}</div>
                          <div className="text-xs text-slate-400">{staff.vipSessions} VIP sessions</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            staff.avgResponseTime < 2 ? 'text-green-400' :
                            staff.avgResponseTime < 5 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {staff.avgResponseTime}min
                          </div>
                          <div className="text-xs text-slate-500">avg response</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upsell Success */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">VIP Upsell Success</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(report.vipMetrics || []).map((staff, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-white">{staff.name}</span>
                          <span className="text-green-400">{staff.upsellSuccess}%</span>
                        </div>
                        <Progress value={staff.upsellSuccess} className="h-2" />
                        <div className="text-xs text-slate-500">
                          ${staff.upsellRevenue?.toLocaleString()} additional revenue
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* VIP Highlights */}
              <Card className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-500/30 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-pink-400" />
                    VIP Service Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {report.vipHighlights?.bestResponseTime && (
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-xs text-pink-400 mb-1">Fastest Response</div>
                        <div className="text-lg font-bold text-white">{report.vipHighlights.bestResponseTime.name}</div>
                        <div className="text-sm text-slate-400">{report.vipHighlights.bestResponseTime.time}min avg</div>
                      </div>
                    )}
                    {report.vipHighlights?.topUpseller && (
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-xs text-green-400 mb-1">Top Upseller</div>
                        <div className="text-lg font-bold text-white">{report.vipHighlights.topUpseller.name}</div>
                        <div className="text-sm text-slate-400">${report.vipHighlights.topUpseller.revenue} revenue</div>
                      </div>
                    )}
                    {report.vipHighlights?.mostSessions && (
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-xs text-purple-400 mb-1">Most VIP Sessions</div>
                        <div className="text-lg font-bold text-white">{report.vipHighlights.mostSessions.name}</div>
                        <div className="text-sm text-slate-400">{report.vipHighlights.mostSessions.count} sessions</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Training Insights Tab */}
          <TabsContent value="training">
            <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  AI Training Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Individual Feedback */}
                <div>
                  <h4 className="text-sm font-medium text-cyan-400 mb-3">Individual Development Plans</h4>
                  <div className="space-y-3">
                    {(report.trainingInsights?.individual || []).map((item, i) => (
                      <div key={i} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{item.name}</span>
                          <Badge className={
                            item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }>
                            {item.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{item.feedback}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.focusAreas?.map((area, j) => (
                            <Badge key={j} className="bg-cyan-500/20 text-cyan-400 text-xs">{area}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Training */}
                <div>
                  <h4 className="text-sm font-medium text-purple-400 mb-3">Team-Wide Training Opportunities</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {(report.trainingInsights?.team || []).map((item, i) => (
                      <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-purple-500/20">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-purple-400 mt-1" />
                          <div>
                            <div className="text-sm text-white font-medium">{item.topic}</div>
                            <div className="text-xs text-slate-400 mt-1">{item.reason}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Concerns */}
                {report.trainingInsights?.concerns?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Areas of Concern
                    </h4>
                    <div className="space-y-2">
                      {report.trainingInsights.concerns.map((concern, i) => (
                        <div key={i} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div className="text-sm text-white">{concern.issue}</div>
                          <div className="text-xs text-slate-400 mt-1">Affected: {concern.staff?.join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!report && !loading && (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-medium text-white mb-2">Analyze Staff Performance</h3>
            <p className="text-sm text-slate-400 mb-4">
              Generate AI-powered performance reports to identify top performers, training needs, and growth opportunities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}