import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, Settings, Webhook, TestTube, 
  CheckCircle, Copy, ExternalLink, Shield, Info, AlertTriangle, XCircle 
} from "lucide-react";

export default function StripeSetupGuide() {
  const [copiedText, setCopiedText] = useState(null);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const steps = [
    {
      id: "keys",
      title: "Get API Keys",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <Alert className="bg-red-500/20 border-red-500/50 shadow-lg">
            <XCircle className="h-5 w-5 text-red-400" />
            <AlertDescription className="text-white">
              <strong className="text-red-400 text-lg">🚨 CRITICAL ERROR DETECTED</strong>
              <div className="mt-3 space-y-2">
                <p className="font-semibold">Current Issue:</p>
                <code className="block bg-black/50 p-3 rounded text-yellow-400 text-sm">
                  STRIPE_SECRET_KEY = "=pk_test_..." ❌
                </code>
                <p className="text-red-300">
                  You're using a <strong>PUBLISHABLE key (pk_test_)</strong> in STRIPE_SECRET_KEY. 
                  This will NOT work for backend payment processing!
                </p>
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded">
                  <p className="text-green-400 font-semibold">✅ What you need:</p>
                  <code className="block mt-2 text-green-400">
                    STRIPE_SECRET_KEY = "sk_test_51QsFJ3..."
                  </code>
                  <p className="text-sm text-gray-300 mt-2">
                    Use your <strong>SECRET key</strong> that starts with <code className="text-green-400">sk_test_</code>
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Alert className="bg-blue-500/10 border-blue-500/30">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-white">
              Go to your Stripe Dashboard to get your <strong>SECRET</strong> API key
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-white mb-2">Step 1: Get Your Secret Key</h4>
              <a 
                href="https://dashboard.stripe.com/test/apikeys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-lg font-semibold"
              >
                Open Stripe API Keys Dashboard →
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <div className="glass-card-dark p-6 rounded-lg space-y-6 border-2 border-blue-500/30">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-red-400 mb-2">WRONG - Publishable Key (for frontend only)</div>
                    <div className="bg-red-900/20 border border-red-500/30 p-3 rounded">
                      <code className="text-yellow-400 text-sm break-all">
                        pk_test_51QsFJ3Lz7... ← This is what you have now (WRONG!)
                      </code>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">❌ This key is safe to expose in frontend but CANNOT process payments on backend</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-green-400 mb-2">CORRECT - Secret Key (for backend - REQUIRED)</div>
                    <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
                      <code className="text-green-400 text-sm break-all">
                        sk_test_51QsFJ3Lz7... ← Use this one!
                      </code>
                    </div>
                    <p className="text-xs text-red-400 mt-2 font-semibold">⚠️ Copy this SECRET key and update STRIPE_SECRET_KEY in Environment Variables!</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-yellow-500/10 border-yellow-500/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Key Differences:</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• <strong className="text-green-400">sk_test_</strong> = Secret Key (backend, processes payments) ✅</li>
                      <li>• <strong className="text-yellow-400">pk_test_</strong> = Publishable Key (frontend, creates payment UI) 🎨</li>
                      <li>• <strong className="text-purple-400">whsec_</strong> = Webhook Secret (validates webhook events) 🔔</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-white mb-2">For Production (Live):</h4>
            <a 
              href="https://dashboard.stripe.com/apikeys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              https://dashboard.stripe.com/apikeys
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-sm text-gray-400 mt-2">
              Replace sk_test_ with sk_live_ when ready for production
            </p>
          </div>
        </div>
      )
    },
    {
      id: "secrets",
      title: "Configure Secrets",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <Alert className="bg-green-500/10 border-green-500/30">
            <Shield className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-white">
              Go to: <strong>Dashboard → Settings → Environment Variables</strong>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Card className="glass-card-dark border-red-500/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <code className="text-red-400 font-mono text-base font-bold">STRIPE_SECRET_KEY</code>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/50">URGENT FIX</Badge>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Your Stripe <strong>SECRET</strong> key (must start with sk_test_ or sk_live_)
                </p>
                <div className="space-y-3">
                  <div className="glass-dark p-4 rounded border-l-4 border-red-500">
                    <p className="text-xs text-gray-400 mb-1">Current (WRONG):</p>
                    <code className="text-xs text-red-400">STRIPE_SECRET_KEY = "=pk_test_..."</code>
                  </div>
                  <div className="glass-dark p-4 rounded border-l-4 border-green-500">
                    <p className="text-xs text-gray-400 mb-1">Should be:</p>
                    <code className="text-xs text-green-400">STRIPE_SECRET_KEY = "sk_test_51QsFJ3..."</code>
                  </div>
                </div>
                <Alert className="mt-4 bg-blue-500/10 border-blue-500/30">
                  <Info className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-white text-sm">
                    After updating, your functions will automatically redeploy and the error will be fixed.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-blue-400 font-mono text-sm">STRIPE_PUBLISHABLE_KEY</code>
                  <Badge className="bg-blue-500/20 text-blue-400">Optional</Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  Your Stripe PUBLISHABLE key (starts with pk_test_ or pk_live_) - Only needed for custom payment forms
                </p>
                <code className="text-xs text-gray-500">Example: pk_test_51QsFJ3Lz...</code>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-purple-400 font-mono text-sm">STRIPE_WEBHOOK_SECRET</code>
                  <Badge className="bg-purple-500/20 text-purple-400">Required for webhooks</Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  Webhook signing secret (get from Stripe webhooks page after creating endpoint)
                </p>
                <code className="text-xs text-gray-500">Example: whsec_...</code>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "webhooks",
      title: "Setup Webhooks",
      icon: Webhook,
      content: (
        <div className="space-y-4">
          <Alert className="bg-purple-500/10 border-purple-500/30">
            <Webhook className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-white">
              Webhooks notify your app when payments succeed or fail - required for production!
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Card className="glass-card-dark">
              <CardHeader>
                <CardTitle className="text-white text-base">Step 1: Open Webhooks Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="https://dashboard.stripe.com/test/webhooks" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-lg font-semibold"
                >
                  Open Stripe Webhooks →
                  <ExternalLink className="w-5 h-5" />
                </a>
              </CardContent>
            </Card>

            <Card className="glass-card-dark">
              <CardHeader>
                <CardTitle className="text-white text-base">Step 2: Create Webhook Endpoint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Click "Add endpoint" and use this URL:</p>
                  <div className="glass-dark p-3 rounded-lg flex items-center justify-between">
                    <code className="text-green-400 text-sm break-all flex-1">
                      https://[your-app].base44.app/functions/stripeWebhook
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard('https://[your-app].base44.app/functions/stripeWebhook', 'webhook-url')}
                    >
                      {copiedText === 'webhook-url' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-yellow-400 mt-2">
                    ⚠️ Replace [your-app] with your actual app subdomain
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark">
              <CardHeader>
                <CardTitle className="text-white text-base">Step 3: Select Events to Listen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="glass-dark p-4 rounded-lg space-y-2">
                  {[
                    { event: 'checkout.session.completed', desc: 'Checkout session finished' },
                    { event: 'payment_intent.succeeded', desc: 'Payment succeeded' },
                    { event: 'payment_intent.payment_failed', desc: 'Payment failed' },
                    { event: 'charge.succeeded', desc: 'Charge completed' },
                    { event: 'charge.failed', desc: 'Charge failed' },
                    { event: 'charge.refunded', desc: 'Refund processed' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded hover:bg-white/5">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <code className="text-blue-400 text-sm">{item.event}</code>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark">
              <CardHeader>
                <CardTitle className="text-white text-base">Step 4: Copy Webhook Secret</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-3">
                  After creating the endpoint, click "Reveal" on the signing secret
                </p>
                <div className="glass-dark p-4 rounded border-l-4 border-purple-500">
                  <p className="text-xs text-gray-400 mb-2">Copy the secret that starts with:</p>
                  <code className="text-purple-400">whsec_...</code>
                  <p className="text-xs text-gray-400 mt-3">
                    Then add it to <code className="text-purple-400">STRIPE_WEBHOOK_SECRET</code> in Environment Variables
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "test",
      title: "Test Payments",
      icon: TestTube,
      content: (
        <div className="space-y-4">
          <Alert className="bg-green-500/10 border-green-500/30">
            <TestTube className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-white">
              Use these test cards after fixing your API keys
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Card className="glass-card-dark border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Successful Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Card Number:</div>
                    <div className="flex items-center gap-2">
                      <code className="text-green-400 font-mono">4242 4242 4242 4242</code>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard('4242424242424242', 'card-success')}
                      >
                        {copiedText === 'card-success' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Expiry:</div>
                    <code className="text-white font-mono">12/34</code>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">CVC:</div>
                    <code className="text-white font-mono">123</code>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">ZIP:</div>
                    <code className="text-white font-mono">12345</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Payment Declined
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="text-gray-400 text-xs mb-1">Card Number:</div>
                  <div className="flex items-center gap-2">
                    <code className="text-red-400 font-mono">4000 0000 0000 0002</code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard('4000000000000002', 'card-fail')}
                    >
                      {copiedText === 'card-fail' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  3D Secure Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="text-gray-400 text-xs mb-1">Card Number:</div>
                  <div className="flex items-center gap-2">
                    <code className="text-blue-400 font-mono">4000 0025 0000 3155</code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard('4000002500003155', 'card-3ds')}
                    >
                      {copiedText === 'card-3ds' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Requires additional authentication step</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <a 
              href="https://stripe.com/docs/testing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm font-semibold"
            >
              View all test cards on Stripe Docs
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="border-red-500/50 bg-red-500/20 text-red-400 mb-4 text-sm py-1">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Configuration Error Detected
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Stripe Integration <span className="bg-gradient-to-r from-red-400 to-orange-600 bg-clip-text text-transparent">Setup Required</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Fix the API key error to enable payment processing
            </p>
          </div>

          <Tabs defaultValue="keys" className="space-y-6">
            <TabsList className="glass-dark grid grid-cols-4 p-1">
              {steps.map((step) => (
                <TabsTrigger 
                  key={step.id} 
                  value={step.id}
                  className="text-white data-[state=active]:text-blue-400 data-[state=active]:bg-blue-500/20 text-xs sm:text-sm"
                >
                  <step.icon className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{step.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {steps.map((step) => (
              <TabsContent key={step.id} value={step.id}>
                <Card className="glass-card-dark border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 text-xl">
                      <step.icon className="w-5 h-5" />
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {step.content}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="glass-card-dark border-green-500/30 mt-8">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Quick Links</h3>
              <div className="flex gap-3 justify-center flex-wrap mt-4">
                <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Get API Keys
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="https://dashboard.stripe.com/test/webhooks" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="glass-dark">
                    <Webhook className="w-4 h-4 mr-2" />
                    Setup Webhooks
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}