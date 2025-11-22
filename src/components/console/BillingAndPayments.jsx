import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Eye, FileCode, Brain, Lock, Shield, Zap, Check, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import glyphLockAPI from '@/components/api/glyphLockAPI';

const productCatalog = [
  {
    product: {
      id: "prod_TRecvO5HfpAWvl",
      name: "Pro",
      description: "All Visual Cryptography Tools, Blockchain Security Suite, GlyphBot AI Assistant, Up to 1,000 QR codes/month, Standard Support, Data Dashboard Access"
    },
    prices: [{
      id: "price_1SUlImAOe9xXPv0na5BmMKKY",
      type: "recurring",
      unit_amount: 20000,
      currency: "usd",
      recurring: { interval: "month" }
    }]
  },
  {
    product: {
      id: "prod_TRekwPtbRKWuMl",
      name: "Enterprise",
      description: "Everything in Pro, Unlimited QR Generation, Priority AI Processing, Security Operations Center, N.U.P.S. POS System, 24/7 Premium Support, Custom Integrations, Dedicated Account Manager"
    },
    prices: [{
      id: "price_1SUlRKAOe9xXPv0nW0uH1IQl",
      type: "recurring",
      unit_amount: 200000,
      currency: "usd",
      recurring: { interval: "month" }
    }]
  },
  {
    product: {
      id: "prod_Sx7YM5pcBfBwPW",
      name: "GlyphLock Voucher",
      description: "Secure digital voucher, Fraud-proof cryptographic protection, Redeemable at partner locations, Available in multiple denominations"
    },
    prices: [{
      id: "price_1S1DIvAOe9xXPv0nQ9Twkqar",
      type: "one_time",
      unit_amount: 100,
      currency: "usd"
    }]
  },
  {
    product: {
      id: "prod_Sx7bODyLES1aqB",
      name: "Vouchers Bundle",
      description: "Bulk secure vouchers, Enterprise fraud prevention, Instant traceability, Partner network access"
    },
    prices: [{
      id: "price_1S1DLyAOe9xXPv0nuUfZTu9S",
      type: "one_time",
      unit_amount: 100,
      currency: "usd"
    }]
  },
  {
    product: {
      id: "prod_Sx7g6cB08UxB3D",
      name: "Enterprise Vouchers",
      description: "Enterprise-grade voucher package, Ongoing authentication, Advanced reporting, Continuous monitoring, Bulk management"
    },
    prices: [{
      id: "price_1S1E4uAOe9xXPv0nByLqrpFg",
      type: "one_time",
      unit_amount: 200000,
      currency: "usd"
    }]
  }
];

const featureIcons = {
  "Visual Cryptography": <Eye className="h-4 w-4 mr-2 text-cyan-400" />,
  "Blockchain": <Lock className="h-4 w-4 mr-2 text-purple-400" />,
  "GlyphBot": <Brain className="h-4 w-4 mr-2 text-blue-400" />,
  "QR": <FileCode className="h-4 w-4 mr-2 text-green-400" />,
  "Security": <Shield className="h-4 w-4 mr-2 text-red-400" />,
  "AI": <Zap className="h-4 w-4 mr-2 text-yellow-400" />
};

const getFeaturesList = (description) => {
  return description.split(',').map(f => f.trim()).filter(Boolean);
};

export default function BillingAndPayments({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [billingStatus, setBillingStatus] = useState(null);
  const [billingHistory, setBillingHistory] = useState(null);
  const [loadingBillingData, setLoadingBillingData] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      setLoadingBillingData(true);
      try {
        const [statusData, historyData] = await Promise.all([
          glyphLockAPI.billing.getStatus(),
          glyphLockAPI.billing.getHistory()
        ]);
        setBillingStatus(statusData);
        setBillingHistory(historyData);
        toast.success('Billing data loaded');
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
        toast.error('Failed to load billing data');
      } finally {
        setLoadingBillingData(false);
      }
    };
    if (user) {
      fetchBillingData();
    }
  }, [user]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    if (sessionId) {
      setLoading(true);
      glyphLockAPI.stripe.pollPaymentStatus(sessionId)
        .then(response => {
          setPaymentStatus(response.status);
          toast.success(`Payment ${response.status}`);
        })
        .catch(error => {
          console.error("Error polling Stripe session:", error);
          toast.error("Failed to retrieve payment status");
        })
        .finally(() => {
          setLoading(false);
          navigate(location.pathname, { replace: true });
        });
    }
  }, [location.search, navigate, location.pathname]);

  const handleCheckout = async (productId, priceId, mode) => {
    setLoading(true);
    try {
      const response = await glyphLockAPI.stripe.startCheckout(productId, priceId, mode);
      
      if (response?.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        toast.error("Failed to get checkout URL");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const response = await glyphLockAPI.billing.downloadInvoice(invoiceId);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Invoice downloaded');
    } catch (error) {
      console.error('Failed to download invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center text-white mb-4">Billing & Payments</h1>
      <p className="text-xl text-center text-white/70 mb-12">Manage your subscriptions and purchases</p>

      {loading && (
        <div className="flex justify-center items-center mb-8">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <span className="ml-3 text-white">Processing...</span>
        </div>
      )}

      {paymentStatus && (
        <div className="mb-8 p-4 rounded-lg glass-card border-cyan-500/30 flex items-center justify-center">
          {paymentStatus === 'complete' ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <span className="text-white">Payment successful!</span>
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6 text-red-500 mr-3" />
              <span className="text-white">Payment {paymentStatus}</span>
            </>
          )}
        </div>
      )}

      {loadingBillingData ? (
        <div className="space-y-6 mb-12">
          <Skeleton className="h-32 w-full glass-card bg-white/5" />
          <Skeleton className="h-48 w-full glass-card bg-white/5" />
        </div>
      ) : (
        <>
          {/* Past Due Recovery Panel */}
          {billingStatus && (billingStatus.status === 'past_due' || billingStatus.status === 'payment_failed') && (
            <Card className="glass-card border-red-500/30 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Payment Action Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-white/80">
                  <p className="mb-2">Your last payment failed. Please update your payment method or retry the payment.</p>
                  {billingStatus.gracePeriodEnd && (
                    <p className="text-yellow-400 text-sm">
                      Grace period ends: {formatDate(billingStatus.gracePeriodEnd)}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpdatePaymentMethod}
                    disabled={updatingPayment}
                    className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {updatingPayment ? 'Opening...' : 'Update Payment Method'}
                  </Button>
                  <Button
                    onClick={handleRetryPayment}
                    disabled={retryingPayment}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {retryingPayment ? 'Retrying...' : 'Retry Payment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
          {billingStatus && (
            <Card className="glass-card border-purple-500/30 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-400">Current Plan & License Tier</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
                <div className="space-y-2">
                  <p><span className="font-semibold text-white">Plan:</span> {billingStatus.planName}</p>
                  <p><span className="font-semibold text-white">Status:</span> <span className={`${billingStatus.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>{billingStatus.status}</span></p>
                  <p><span className="font-semibold text-white">Renews:</span> {formatDate(billingStatus.renewalDate)}</p>
                  {billingStatus.trialEndDate && <p><span className="font-semibold text-white">Trial Ends:</span> {formatDate(billingStatus.trialEndDate)}</p>}
                  <div className="pt-2">
                    <p className="font-semibold text-white mb-1">License Tier:</p>
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] text-white font-bold">
                      {billingStatus.licenseTier || 'Starter'}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><span className="font-semibold text-white">Price:</span> {formatCurrency(billingStatus.currentPrice)} / {billingStatus.interval}</p>
                  <div>
                    <p className="font-semibold text-white mb-2">Active Entitlements:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      {billingStatus.entitlements && Object.entries(billingStatus.entitlements).map(([key, value]) => (
                        <li key={key} className={value ? 'text-green-400' : 'text-white/40'}>
                          {key}: {value ? 'Enabled' : 'Disabled'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {billingHistory && billingHistory.length > 0 && (
            <Card className="glass-card border-cyan-500/30 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-cyan-400">Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-white/90">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingHistory.map((item, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4">{formatDate(item.date)}</td>
                          <td className="py-3 px-4 font-semibold">{formatCurrency(item.amount)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${item.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {item.invoiceId && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDownloadInvoice(item.invoiceId)} 
                                className="text-cyan-400 hover:text-cyan-300"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <h2 className="text-3xl font-bold text-white mb-6 text-center">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productCatalog.map((item) => (
          <Card key={item.product.id} className="glass-card border-cyan-500/30 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-cyan-400 mb-2">{item.product.name}</CardTitle>
              <CardDescription className="text-white/70 min-h-[80px]">{item.product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {item.prices.map(price => (
                <div key={price.id} className="mb-4">
                  <p className="text-4xl font-extrabold text-white">
                    ${(price.unit_amount / 100).toFixed(2)}
                    {price.recurring && <span className="text-lg font-normal text-white/60"> / {price.recurring.interval}</span>}
                  </p>
                  <p className="text-sm text-white/50 mb-4">
                    {price.type === "recurring" ? "Recurring subscription" : "One-time purchase"}
                  </p>
                  <ul className="space-y-2 text-white/80">
                    {getFeaturesList(item.product.description).slice(0, 4).map((feature, idx) => {
                      const iconKey = Object.keys(featureIcons).find(key => feature.includes(key));
                      return (
                        <li key={idx} className="flex items-center text-sm">
                          {iconKey ? featureIcons[iconKey] : <Check className="h-4 w-4 mr-2 text-purple-400" />}
                          <span>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {item.prices.map(price => (
                <Button
                  key={price.id}
                  onClick={() => handleCheckout(item.product.id, price.id, price.type === "recurring" ? "subscription" : "payment")}
                  className="w-full bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90 text-white font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    price.type === "recurring" ? "Subscribe Now" : "Purchase"
                  )}
                </Button>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}