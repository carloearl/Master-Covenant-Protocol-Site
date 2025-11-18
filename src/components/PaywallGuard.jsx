import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Crown, Zap } from "lucide-react";

export default function PaywallGuard({ serviceName, children, requirePlan = "professional" }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      
      if (!isAuth) {
        setLoading(false);
        return;
      }

      const userData = await base44.auth.me();
      setUser(userData);

      // Admin bypass
      if (userData.role === 'admin') {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Check if user has active subscription in metadata
      const hasSubscription = userData.subscription_plan && 
                            userData.subscription_status === 'active';
      
      setHasAccess(hasSubscription);
    } catch (error) {
      console.error("Access check error:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planPrice) => {
    try {
      const response = await base44.functions.invoke('stripeCreateCheckout', {
        priceId: planPrice,
        mode: 'subscription',
        successUrl: `${window.location.origin}${createPageUrl('PaymentSuccess')}`,
        cancelUrl: `${window.location.origin}${createPageUrl('Pricing')}`
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card-dark border-blue-500/30">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                
                <h1 className="text-4xl font-bold mb-4 text-white">
                  Premium Feature
                </h1>
                
                <p className="text-xl text-white/80 mb-2">
                  <span className="text-blue-400 font-semibold">{serviceName}</span> requires a subscription
                </p>
                <p className="text-white/60 mb-8">
                  {user ? "Upgrade to access all GlyphLock tools" : "Sign in and subscribe to continue"}
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="glass-card-dark border-blue-500/50">
                    <CardContent className="p-6">
                      <Shield className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                      <h3 className="font-bold text-white mb-2">Professional</h3>
                      <div className="text-3xl font-bold text-white mb-4">$299<span className="text-sm text-gray-400">/mo</span></div>
                      <ul className="text-sm text-left space-y-2 mb-4 text-white/80">
                        <li>✓ All Security Tools</li>
                        <li>✓ Blockchain Suite</li>
                        <li>✓ GlyphBot AI</li>
                        <li>✓ 1,000 QR/month</li>
                      </ul>
                      <Button 
                        onClick={() => handleUpgrade('price_1S1DRYAOe9xXPv0n6sIFWQuk')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="glass-card-dark border-purple-500/50 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">POPULAR</span>
                    </div>
                    <CardContent className="p-6">
                      <Crown className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-bold text-white mb-2">Enterprise</h3>
                      <div className="text-3xl font-bold text-white mb-4">$999<span className="text-sm text-gray-400">/mo</span></div>
                      <ul className="text-sm text-left space-y-2 mb-4 text-white/80">
                        <li>✓ Everything in Pro</li>
                        <li>✓ Unlimited QR</li>
                        <li>✓ N.U.P.S. POS</li>
                        <li>✓ 24/7 Support</li>
                      </ul>
                      <Button 
                        onClick={() => handleUpgrade('price_1S1E4uAOe9xXPv0nByLqrpFg')}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                      >
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  {!user && (
                    <Button 
                      size="lg"
                      onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
                      className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-blue-700"
                    >
                      Sign In to Continue
                    </Button>
                  )}
                  
                  <Link to={createPageUrl("Pricing")}>
                    <Button variant="outline" className="w-full max-w-md border-blue-500/50 text-white hover:bg-blue-500/20">
                      View All Plans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return children;
}