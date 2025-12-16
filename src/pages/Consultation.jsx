import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Target, Zap, Clock, CheckCircle2, Lock, AlertTriangle } from "lucide-react";
import GlyphLoader from "@/components/GlyphLoader";
import SEOHead from "@/components/SEOHead";
import { injectServiceSchema } from "@/components/utils/seoHelpers";
import DOMPurify from "dompurify";
import VerificationGate from "@/components/security/VerificationGate";

export default function Consultation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    organization: "",
    email: "",
    system_type: "",
    description: ""
  });
  const [verificationToken, setVerificationToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: decodeURIComponent(emailParam) }));
    }
  }, []);

  useEffect(() => {
    const cleanup = injectServiceSchema(
      'Security Consultation',
      '60-minute expert cybersecurity analysis with GlyphLock specialists - vulnerability assessment, architecture planning, and custom security solutions',
      '/consultation'
    );
    return cleanup;
  }, []);

  const createConsultation = useMutation({
    mutationFn: async (data) => {
      // Sanitize all inputs
      const sanitizedData = {
        full_name: DOMPurify.sanitize(data.full_name, { ALLOWED_TAGS: [] }),
        organization: DOMPurify.sanitize(data.organization || '', { ALLOWED_TAGS: [] }),
        email: DOMPurify.sanitize(data.email, { ALLOWED_TAGS: [] }),
        system_type: DOMPurify.sanitize(data.system_type, { ALLOWED_TAGS: [] }),
        description: DOMPurify.sanitize(data.description || '', { ALLOWED_TAGS: [] }),
        service_interest: "Protocol Verification",
        status: "pending",
        payment_status: "pending"
      };

      // First create the consultation record
      const consultation = await base44.entities.Consultation.create(sanitizedData);
      
      // Then create Stripe checkout for the $200 consultation fee
      const response = await base44.functions.invoke('stripeCreateCheckout', {
        priceId: null,
        mode: 'payment',
        lineItems: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'GlyphLock Protocol Verification',
              description: 'Controlled protocol verification engagement under Master Covenant governance',
            },
            unit_amount: 1200000, // $12,000.00 in cents
          },
          quantity: 1,
        }],
        successUrl: `${window.location.origin}${createPageUrl('ConsultationSuccess')}?verification_id=${consultation.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}${createPageUrl('Consultation')}?cancelled=true`
      });
      
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response.data?.error || "Failed to create checkout session");
      }
      
      return consultation;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationToken) {
      alert('Verification required');
      return;
    }

    // Validate token server-side before submission
    try {
      const validation = await base44.functions.invoke('validateVerificationToken', {
        token: verificationToken
      });

      if (!validation.data?.valid) {
        alert('Verification failed. Submission rejected.');
        setVerificationToken(null);
        return;
      }

      // Proceed with submission
      createConsultation.mutate(formData);
    } catch (error) {
      alert('Verification failed. Submission rejected.');
      setVerificationToken(null);
    }
  };

  const systemTypes = [
    "Enterprise Infrastructure",
    "Cloud Native Architecture",
    "Hybrid Deployment",
    "Legacy System Integration",
    "Government/Defense System",
    "Financial Services Platform",
    "Healthcare System",
    "Custom Environment"
  ];

  const verificationScope = [
    "System integrity and threat exposure analysis",
    "Enforceability assessment under Covenant governance",
    "Visual, QR, and protocol authenticity validation",
    "Credential eligibility determination",
    "Definitive enforcement roadmap"
  ];

  const protocolCapabilities = [
    "Zero forge visual authentication",
    "AI driven protocol verification",
    "Autonomous audit pathways",
    "Post quantum readiness",
    "Enforcement grade architecture"
  ];

  if (createConsultation.isPending) {
    return <GlyphLoader text="Processing Credential Request..." />;
  }

  return (
    <div className="min-h-screen text-white pt-20 pb-16" style={{ background: 'transparent' }}>
      <SEOHead 
        title="Protocol Verification | GlyphLock"
        description="GlyphLock protocol verification engagement - credentialed enforcement eligibility under Master Covenant governance."
        url="/consultation"
      />
      
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 tracking-tight leading-tight">
              GlyphLock Protocol Verification
            </h1>
            <p className="text-base md:text-lg text-slate-400 tracking-wide mb-8 md:mb-12">
              Governed by the Master Covenant
            </p>
            
            <div className="max-w-3xl mx-auto space-y-3 md:space-y-4 text-left mb-8 md:mb-12 px-4">
              <p className="text-lg md:text-xl text-white leading-relaxed">This is not a SaaS product.</p>
              <p className="text-lg md:text-xl text-white leading-relaxed">This is not a consultation.</p>
              <p className="text-lg md:text-xl text-white leading-relaxed">This is not a sales call.</p>

              <p className="text-lg md:text-xl text-white leading-relaxed mt-6 md:mt-8">GlyphLock operates as a protocol authority.</p>

              <p className="text-base md:text-lg text-slate-300 leading-relaxed mt-6 md:mt-8">
                This engagement exists to determine whether your system qualifies for credentialed enforcement under the Master Covenant.
              </p>
            </div>

            <div className="inline-block border-2 border-slate-700 bg-slate-950/80 px-6 md:px-12 py-6 w-full md:w-auto">
              <div className="text-sm text-slate-400 tracking-[0.2em] mb-2">ENGAGEMENT FEE</div>
              <div className="text-4xl font-black text-white mb-4">$12,000 USD</div>
              <div className="text-slate-400 space-y-1">
                <div>One protocol.</div>
                <div>One engagement.</div>
                <div>One determination.</div>
              </div>
              <div className="text-slate-500 text-sm mt-6 space-y-1">
                <div>No trials.</div>
                <div>No demos.</div>
                <div>No exploratory pricing.</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card className="glyph-glass-card card-elevated-hover">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white tracking-wide">Credential Review Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="full_name" className="text-white font-semibold">Full Name *</Label>
                        <Input
                          id="full_name"
                          required
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          className="input-glow-blue"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white font-semibold">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="input-glow-blue"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="organization" className="text-white font-semibold">Organization *</Label>
                        <Input
                          id="organization"
                          required
                          value={formData.organization}
                          onChange={(e) => setFormData({...formData, organization: e.target.value})}
                          className="input-glow-blue"
                        />
                      </div>
                      <div>
                        <Label htmlFor="system_type" className="text-white font-semibold">System Type *</Label>
                        <Select
                          required
                          value={formData.system_type}
                          onValueChange={(value) => setFormData({...formData, system_type: value})}
                        >
                          <SelectTrigger className="bg-slate-950/60 border-2 border-slate-700/50 text-white focus:border-[#3B82F6]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-2 border-slate-700">
                            {systemTypes.map((type) => (
                              <SelectItem key={type} value={type} className="text-white hover:bg-slate-800">
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-white font-semibold">What Needs Verification *</Label>
                      <Textarea
                        id="description"
                        rows={5}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="bg-slate-950/60 border-2 border-slate-700/50 text-white focus:border-[#3B82F6] transition-colors resize-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <VerificationGate 
                        onVerified={(token) => setVerificationToken(token)}
                        disabled={createConsultation.isPending}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        disabled={createConsultation.isPending || !verificationToken}
                        className="w-full bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 text-white font-bold text-lg py-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {createConsultation.isPending ? "Processing Request" : "Request Credential Review"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What This Engagement Is */}
              <Card className="glyph-glass-card">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">What This Engagement Is</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4 text-sm">
                    A controlled protocol verification conducted to:
                  </p>
                  <div className="space-y-2">
                    {verificationScope.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-slate-600 mt-2 flex-shrink-0"></div>
                        <span className="text-white text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <p className="text-white font-semibold text-sm">This engagement produces proof, not opinions.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Format */}
              <Card className="glyph-glass-card">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Engagement Format</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-bold text-white">Up to 90 minutes</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Format:</span>
                    <span className="font-bold text-white">Secure video or audio</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Recording:</span>
                    <span className="font-bold text-white">Mutual authorization only</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Software:</span>
                    <span className="font-bold text-white">No installs required</span>
                  </div>
                </CardContent>
              </Card>

              {/* Credentialing Policy */}
              <Card className="glyph-glass-card border-red-900/40">
                <CardContent className="p-6">
                  <h3 className="font-black text-white text-lg mb-4">Credentialing Policy</h3>
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>GlyphLock does not provision access arbitrarily.</p>
                    <p>Passing verification does not guarantee deployment.</p>
                    <p>Failure halts progression immediately.</p>
                    <p>Enforcement proceeds only upon credential approval.</p>
                    <p className="pt-3 border-t border-slate-700/50 text-white font-semibold">
                      All determinations are governed by the Master Covenant.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Why GlyphLock Section */}
          <Card className="glyph-glass-card mb-16">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-white">Why GlyphLock</CardTitle>
              <p className="text-slate-300 mt-4 text-lg leading-relaxed">
                Threats adapt.<br />
                Protocols enforce.
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6 font-medium">GlyphLock delivers:</p>
              <div className="space-y-2">
                {protocolCapabilities.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border-l-2 border-slate-700">
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-8 border-2 border-slate-700 bg-slate-950/80 text-center">
                <p className="text-lg text-white mb-4">We do not sell security theater.</p>
                <div className="space-y-2 text-slate-300">
                  <p>We verify.</p>
                  <p>We credential.</p>
                  <p>We enforce.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What This Engagement Is Not */}
          <Card className="glyph-glass-card border-red-900/40 mb-16">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-white">What This Engagement Is Not</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-slate-300">
                <p>Not SaaS onboarding</p>
                <p>Not consulting hours</p>
                <p>Not advisory services</p>
                <p>Not a discovery call</p>
                <p>Not a refundable experiment</p>
              </div>
              <p className="mt-6 text-white font-semibold">
                If the reader is shopping, this page should repel them.
              </p>
            </CardContent>
          </Card>

          {/* Post Verification Pathways */}
          <Card className="glyph-glass-card border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-slate-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Post Verification Pathways</h3>
                  <p className="text-xs text-slate-500 mb-4">(Visible only after credential approval)</p>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Protocol enforcement deployment</li>
                    <li>• Red team simulation</li>
                    <li>• Infrastructure diagramming</li>
                    <li>• Compliance preparation</li>
                    <li>• Long term protocol governance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}