import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Repeat, Ban, Wallet, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import glyphLockAPI from '@/components/api/glyphLockAPI';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBillingOverview({ user }) {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      if (!user || user.role !== 'admin') {
        setError('Admin access required.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await glyphLockAPI.billing.adminOverview();
        setOverviewData(data);
        toast.success('Billing overview loaded successfully');
      } catch (err) {
        console.error('Failed to fetch admin billing overview:', err);
        setError(err.message || 'Failed to fetch billing overview');
        toast.error('Failed to load admin billing overview');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminOverview();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Admin Billing Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-3/4 bg-white/10" />
                <Skeleton className="h-6 w-6 rounded-full bg-white/10" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2 mb-2 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="glass-card border-red-500/30 p-8 text-center">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h2>
        <p className="text-white/70">{error}</p>
      </Card>
    );
  }

  if (!overviewData) {
    return (
      <Card className="glass-card p-8 text-center">
        <h2 className="text-3xl font-bold text-white">No Billing Data Available</h2>
        <p className="text-white/70">Please check your Stripe integration or data sources.</p>
      </Card>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Admin Billing Overview</h2>
        <span className="text-white/50 text-sm">Real-time Stripe data</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-cyan-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-6 w-6 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(overviewData.mrr || 0)}</div>
            <p className="text-xs text-white/70 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {overviewData.mrrGrowth >= 0 ? '+' : ''}{overviewData.mrrGrowth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Active Subscriptions</CardTitle>
            <Users className="h-6 w-6 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overviewData.activeSubscriptions || 0}</div>
            <p className="text-xs text-white/70">Total active plans</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Trialing Subscriptions</CardTitle>
            <Repeat className="h-6 w-6 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overviewData.trialingSubscriptions || 0}</div>
            <p className="text-xs text-white/70">Currently in trial period</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-orange-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Past Due</CardTitle>
            <Wallet className="h-6 w-6 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overviewData.pastDueSubscriptions || 0}</div>
            <p className="text-xs text-white/70">Payment issues detected</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-red-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Canceled Subscriptions</CardTitle>
            <Ban className="h-6 w-6 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overviewData.canceledSubscriptions || 0}</div>
            <p className="text-xs text-white/70">Recently churned</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Last 30 Days Revenue</CardTitle>
            <TrendingUp className="h-6 w-6 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(overviewData.last30DayRevenue || 0)}</div>
            <p className="text-xs text-white/70">Total income past month</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8 bg-white/10" />

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="text-white/80">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Customers:</span>
              <span className="font-bold">{overviewData.totalCustomers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Revenue Per User:</span>
              <span className="font-bold">{formatCurrency(overviewData.arpu || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Churn Rate:</span>
              <span className="font-bold">{overviewData.churnRate || 0}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}