import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, TrendingUp, DollarSign, Package, Calendar, 
  Loader2, Download, Brain, ArrowUp, ArrowDown, Minus,
  Clock, Users, ShoppingCart
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function AISalesReports() {
  const [reportPeriod, setReportPeriod] = useState('weekly');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'generateSalesReport',
        data: { period: reportPeriod }
      });
      setReport(data.report);
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${reportPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-slate-900/50 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Report Period</label>
                <Select value={reportPeriod || "weekly"} onValueChange={setReportPeriod}>
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={generateReport} 
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-cyan-600"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
                {loading ? 'Generating...' : 'Generate AI Report'}
              </Button>
              {report && (
                <Button variant="outline" onClick={exportReport} className="border-slate-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {report && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    {getTrendIcon(report.summary?.revenueTrend)}
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    ${(report.summary?.totalRevenue || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">Total Revenue</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {report.summary?.revenueTrend > 0 ? '+' : ''}{report.summary?.revenueTrend}% vs last period
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingCart className="w-5 h-5 text-cyan-400" />
                    {getTrendIcon(report.summary?.transactionTrend)}
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {report.summary?.totalTransactions || 0}
                  </div>
                  <div className="text-sm text-slate-400">Transactions</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {report.summary?.transactionTrend > 0 ? '+' : ''}{report.summary?.transactionTrend}% vs last period
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    {getTrendIcon(report.summary?.avgTicketTrend)}
                  </div>
                  <div className="text-3xl font-bold text-purple-400">
                    ${(report.summary?.avgTicket || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-400">Avg Ticket</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {report.summary?.avgTicketTrend > 0 ? '+' : ''}{report.summary?.avgTicketTrend}% vs last period
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    {getTrendIcon(report.summary?.customerTrend)}
                  </div>
                  <div className="text-3xl font-bold text-amber-400">
                    {report.summary?.uniqueCustomers || 0}
                  </div>
                  <div className="text-sm text-slate-400">Unique Customers</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {report.summary?.customerTrend > 0 ? '+' : ''}{report.summary?.customerTrend}% vs last period
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="bg-slate-800/50 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={report.revenueTimeline || []}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${v}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Products Bar Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.topProducts || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={100} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="revenue" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={report.categoryBreakdown || []}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(report.categoryBreakdown || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Product Performance Table */}
              <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Product Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-3 text-slate-400">Product</th>
                          <th className="text-right p-3 text-slate-400">Quantity</th>
                          <th className="text-right p-3 text-slate-400">Revenue</th>
                          <th className="text-right p-3 text-slate-400">Avg Price</th>
                          <th className="text-right p-3 text-slate-400">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(report.topProducts || []).slice(0, 10).map((product, i) => (
                          <tr key={i} className="border-b border-slate-800">
                            <td className="p-3 text-white">{product.name}</td>
                            <td className="p-3 text-right text-slate-300">{product.quantity}</td>
                            <td className="p-3 text-right text-green-400">${product.revenue?.toFixed(2)}</td>
                            <td className="p-3 text-right text-slate-300">${product.avgPrice?.toFixed(2)}</td>
                            <td className="p-3 text-right">{getTrendIcon(product.trend)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Hourly Sales Pattern */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Sales by Hour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.hourlyPattern || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hour" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        />
                        <Bar dataKey="transactions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Day of Week Pattern */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Sales by Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.dailyPattern || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        />
                        <Bar dataKey="revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {(report.paymentMethods || []).map((method, i) => (
                      <div key={i} className="flex-1 min-w-[150px] p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="text-sm text-slate-400">{method.method}</div>
                        <div className="text-2xl font-bold text-white">${method.total?.toFixed(0)}</div>
                        <div className="text-xs text-slate-500">{method.percentage}% of sales</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights">
            <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Findings */}
                <div>
                  <h4 className="text-sm font-medium text-purple-400 mb-3">Key Findings</h4>
                  <ul className="space-y-2">
                    {(report.insights?.keyFindings || []).map((finding, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-purple-400 mt-1">•</span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div>
                  <h4 className="text-sm font-medium text-cyan-400 mb-3">Growth Opportunities</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {(report.insights?.opportunities || []).map((opp, i) => (
                      <div key={i} className="p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                        <div className="text-sm text-white font-medium">{opp.title}</div>
                        <div className="text-xs text-slate-400 mt-1">{opp.description}</div>
                        <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 text-xs">
                          Potential: {opp.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {(report.insights?.recommendations || []).map((rec, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-green-400 text-lg">{i + 1}</span>
                        <span className="text-sm text-slate-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forecast */}
                {report.insights?.forecast && (
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <h4 className="text-sm font-medium text-purple-400 mb-2">Next Period Forecast</h4>
                    <p className="text-sm text-slate-300">{report.insights.forecast}</p>
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
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-medium text-white mb-2">Generate Your AI Sales Report</h3>
            <p className="text-sm text-slate-400 mb-4">
              Select a time period and click "Generate AI Report" to get comprehensive sales analytics with AI-powered insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}