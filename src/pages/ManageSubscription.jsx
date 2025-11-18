import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, Calendar, AlertCircle, CheckCircle2, 
  Download, ExternalLink, Loader2, XCircle, Shield
} from "lucide-react";

export default function ManageSubscription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const userData = await base44.auth.me();
      setUser(userData);

      const response = await base44.functions.invoke('getSubscriptionDetails');
      setSubscriptionData(response.data);
    } catch (err) {
      console.error('Load subscription error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (immediate = false) => {
    if (!confirm(immediate 
      ? 'Are you sure you want to cancel immediately? You will lose access right away.' 
      : 'Cancel subscription at the end of the current billing period?'
    )) return;

    try {
      setCanceling(true);
      setError(null);
      await base44.functions.invoke('cancelSubscription', { immediate });
      await loadSubscriptionData();
    } catch (err) {
      console.error('Cancel error:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setCanceling(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { color: 'bg-green-500/20 text-green-400 border-green-500/50', label: 'Active' },
      canceled: { color: 'bg-red-500/20 text-red-400 border-red-500/50', label: 'Canceled' },
      past_due: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', label: 'Past Due' },
      trialing: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', label: 'Trial' },
    };
    const { color, label } = config[status] || { color: 'bg-gray-500/20 text-gray-400', label: status };
    return <Badge className={color}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!subscriptionData?.hasSubscription) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="glass-card-dark border-blue-500/30">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">No Active Subscription</h2>
              <p className="text-gray-400 mb-8">
                You don't have an active subscription. Choose a plan to get started.
              </p>
              <Button 
                onClick={() => navigate(createPageUrl('Pricing'))}
                className="bg-gradient-to-r from-blue-600 to-blue-700"
              >
                View Pricing Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { subscription, invoices } = subscriptionData;

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">
          Manage <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Subscription</span>
        </h1>

        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        {subscription.cancel_at_period_end && (
          <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/30">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-white">
              <strong>Subscription Ending:</strong> Your subscription will end on{' '}
              {new Date(subscription.current_period_end * 1000).toLocaleDateString()}. 
              You'll retain access until then.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card-dark border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white text-lg">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {subscription.plan_name}
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  ${(subscription.amount / 100).toFixed(2)}
                  <span className="text-sm text-gray-400 font-normal">/{subscription.interval}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card-dark border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Billing Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-400">Current Period Start</div>
                <div className="text-white">
                  {new Date(subscription.current_period_start * 1000).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">
                  {subscription.cancel_at_period_end ? 'Subscription Ends' : 'Next Billing Date'}
                </div>
                <div className="text-white">
                  {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card-dark border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!subscription.cancel_at_period_end ? (
                <>
                  <Button
                    onClick={() => handleCancelSubscription(false)}
                    disabled={canceling}
                    variant="outline"
                    className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    {canceling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel at Period End'}
                  </Button>
                  <Button
                    onClick={() => handleCancelSubscription(true)}
                    disabled={canceling}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Cancel Immediately
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate(createPageUrl('Pricing'))}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
                >
                  Reactivate Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card-dark border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white">Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No billing history available</p>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.id}
                    className="flex items-center justify-between p-4 glass-card-dark rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {invoice.status === 'paid' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <div className="text-white font-medium">
                          ${(invoice.amount_paid / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(invoice.created * 1000).toLocaleDateString()} • {invoice.status}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {invoice.invoice_pdf && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(invoice.invoice_pdf, '_blank')}
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                      )}
                      {invoice.hosted_invoice_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(invoice.hosted_invoice_url, '_blank')}
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Need help? Contact our support team
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl('Consultation'))}
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}