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

export default function Consultation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    company: "",
    phone: "",
    service_interest: "",
    message: "",
    preferred_date: ""
  });

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
      // First create the consultation record
      const consultation = await base44.entities.Consultation.create(data);
      
      // Then create Stripe checkout for the $200 consultation fee
      const response = await base44.functions.invoke('stripeCreateCheckout', {
        priceId: null,
        mode: 'payment',
        lineItems: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'GlyphLock Security Consultation',
              description: '60-minute expert cybersecurity analysis session',
            },
            unit_amount: 20000, // $200.00 in cents
          },
          quantity: 1,
        }],
        successUrl: `${window.location.origin}${createPageUrl('ConsultationSuccess')}?consultation_id=${consultation.id}&session_id={CHECKOUT_SESSION_ID}`,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    createConsultation.mutate(formData);
  };

  const serviceOptions = [
    "Enterprise Security Audit",
    "Quantum-Ready System Integration",
    "Website/Application Hardening",
    "Visual Authentication Deployment",
    "Risk Analysis & Threat Modeling",
    "Custom Engagement"
  ];

  const whatYouReceive = [
    "60-minute expert analysis with a GlyphLock cybersecurity architect",
    "Immediate threat & vulnerability overview",
    "Customized solution roadmap",
    "Cost and timeline estimates tailored to your infrastructure",
    "Priority access to the GlyphLock build queue"
  ];

  const whyGlyphLock = [
    "Post-quantum encryption readiness",
    "AI-powered threat detection",
    "Autonomous system auditing",
    "Zero-forge visual authentication",
    "Enterprise-grade architecture"
  ];

  if (createConsultation.isPending) {
    return <GlyphLoader text="Securing Appointment..." />;
  }

  return (
    <div className="min-h-screen text-white pt-20 pb-16" style={{ background: 'transparent' }}>
      <SEOHead 
        title="Book Security Consultation - $200 | GlyphLock"
        description="Schedule a tactical cybersecurity assessment with GlyphLock specialists. 60-minute expert analysis, threat overview, and custom solution roadmap."
        url="/consultation"
      />
      
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glyph-glass border-2 border-[#3B82F6]/40 rounded-full px-6 py-2 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Shield className="w-5 h-5 text-[#3B82F6]" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Tactical Security Assessment</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              Book Your <span className="bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">Consultation</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-6 max-w-3xl mx-auto font-medium">
              Tactical Security Assessment by GlyphLock Specialists
            </p>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1E40AF]/20 to-[#3B82F6]/20 border-2 border-[#3B82F6]/50 rounded-xl px-8 py-4">
              <Target className="w-6 h-6 text-[#3B82F6]" />
              <span className="text-2xl font-black text-white">$200 Consultation Fee</span>
              <span className="text-slate-400">•</span>
              <span className="text-lg text-[#3B82F6] font-semibold">Credited Toward Your Final Project</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card className="glyph-glass-card card-elevated-hover">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Consultation Request Form</CardTitle>
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
                          placeholder="John Smith"
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
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company" className="text-white font-semibold">Company <span className="text-slate-400">(Optional)</span></Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="input-glow-blue"
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-white font-semibold">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="input-glow-blue"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="service_interest" className="text-white font-semibold">Service Interest *</Label>
                        <Select
                          required
                          value={formData.service_interest}
                          onValueChange={(value) => setFormData({...formData, service_interest: value})}
                        >
                          <SelectTrigger className="bg-slate-950/60 border-2 border-slate-700/50 text-white focus:border-[#3B82F6]">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-2 border-slate-700">
                            {serviceOptions.map((service) => (
                              <SelectItem key={service} value={service} className="text-white hover:bg-slate-800">
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="preferred_date" className="text-white font-semibold">Preferred Date & Time *</Label>
                        <Input
                          id="preferred_date"
                          type="datetime-local"
                          required
                          value={formData.preferred_date}
                          onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                          className="input-glow-blue"
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white font-semibold">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="What are your security priorities? The more detail you share, the faster we can help."
                        className="bg-slate-950/60 border-2 border-slate-700/50 text-white focus:border-[#3B82F6] transition-colors resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={createConsultation.isPending}
                      className="w-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#2563EB] hover:to-[#60A5FA] text-white font-black text-lg py-6 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(30,64,175,0.6)] transition-all"
                    >
                      {createConsultation.isPending ? "Processing..." : "Continue to Payment →"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What You Receive */}
              <Card className="glyph-glass-card card-elevated-hover">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#3B82F6]" />
                    What You Receive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4 text-sm font-medium">
                    A GlyphLock consultation isn't a "sales call." It's a full tactical assessment, engineered to give you clarity, direction, and actionable intelligence.
                  </p>
                  <div className="space-y-3">
                    {whatYouReceive.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#3B82F6] mt-0.5 flex-shrink-0" />
                        <span className="text-white text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Consultation Details */}
              <Card className="glyph-glass-card card-elevated-hover">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#3B82F6]" />
                    Consultation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400 font-medium">Consultation Fee:</span>
                    <span className="font-bold text-[#3B82F6] text-lg">$200</span>
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    Credited toward your final project cost if you move forward.
                  </p>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400 font-medium">Response Time:</span>
                    <span className="font-bold text-white">Under 24 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400 font-medium">Duration:</span>
                    <span className="font-bold text-white">60 minutes</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400 font-medium">Format:</span>
                    <span className="font-bold text-white">Secure video/audio</span>
                  </div>
                  <p className="text-xs text-slate-400 italic mt-2">
                    Your choice. No software installs required.
                  </p>
                </CardContent>
              </Card>

              {/* Satisfaction Guarantee */}
              <Card className="glyph-glass-card border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <h3 className="font-black text-white text-lg mb-3">Satisfaction Guarantee</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    If you aren't satisfied with the strategic value provided in your session, GlyphLock issues a <span className="font-bold text-emerald-400">full refund within 48 hours</span> — no questions asked.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Why GlyphLock Section */}
          <Card className="glyph-glass-card card-elevated-hover mb-16">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-white flex items-center gap-3">
                <Lock className="w-8 h-8 text-[#3B82F6]" />
                Why GlyphLock?
              </CardTitle>
              <p className="text-lg text-slate-300 mt-2 font-medium">
                Because attackers evolve daily. Most security solutions don't.
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6 text-lg font-medium">
                GlyphLock delivers:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {whyGlyphLock.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-slate-950/40 border border-[#3B82F6]/20 rounded-lg p-4">
                    <CheckCircle2 className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-slate-950/60 border-2 border-[#3B82F6]/40 rounded-xl text-center">
                <p className="text-xl font-black text-white mb-2">
                  We don't sell "consultations."
                </p>
                <p className="text-lg text-[#3B82F6] font-bold">
                  We sell clarity, strategy, and survival.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Optional Add-Ons Notice */}
          <Card className="glyph-glass-card border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Optional Add-Ons (Shown After Payment)</h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Full Enterprise Audit (Business / People / Agency)</li>
                    <li>• Deep Technical Breakdown</li>
                    <li>• Red-Team Simulation Package</li>
                    <li>• Infrastructure Diagramming & Roadmapping</li>
                    <li>• Compliance Preparation (SOC2, HIPAA, PCI, etc.)</li>
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