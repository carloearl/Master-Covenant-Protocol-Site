import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle2, Globe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SEOHead from "@/components/SEOHead";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const sendEmail = useMutation({
    mutationFn: async (data) => {
      await base44.integrations.Core.SendEmail({
        to: "glyphlock@gmail.com",
        subject: `Contact Form: ${data.subject}`,
        body: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendEmail.mutate(formData);
  };

  return (
    <>
      <SEOHead 
        title="Contact GlyphLock - Security Consultation & Partnership Inquiries"
        description="Contact GlyphLock Security for cybersecurity solutions, partnership opportunities, licensing inquiries, and enterprise security consultations. El Mirage, AZ | (424) 246-6499 | glyphlock@gmail.com"
        keywords="contact GlyphLock, cybersecurity consultation, partnership inquiry, licensing request, enterprise security contact, GlyphLock email, security consultation, El Mirage Arizona, technology partnership"
        url="/contact"
      />
      <div className="min-h-screen bg-black text-white pt-32 pb-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00E4FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#8C4BFF]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter font-space">
              GET IN <span className="text-transparent bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF] bg-clip-text">TOUCH</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Secure your digital sovereignty. Initiate a secure channel with GlyphLock.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Mail, title: "Email", content: "glyphlock@gmail.com", href: "mailto:glyphlock@gmail.com", color: "text-[#00E4FF]" },
              { icon: Phone, title: "Phone", content: "(424) 246-6499", href: "tel:+14242466499", color: "text-[#8C4BFF]" },
              { icon: MapPin, title: "Location", content: "El Mirage, Arizona", color: "text-white" }
            ].map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl p-8 border border-white/10 text-center hover:border-[#00E4FF]/30 transition-all group">
                <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:bg-[#00E4FF]/10 group-hover:border-[#00E4FF]/30 transition-all`}>
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-space">{item.title}</h3>
                {item.href ? (
                  <a href={item.href} className="text-gray-400 hover:text-[#00E4FF] transition-colors text-lg">
                    {item.content}
                  </a>
                ) : (
                  <p className="text-gray-400 text-lg">{item.content}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-12">
            {/* Contact Form */}
            <div className="glass-card rounded-2xl p-8 md:p-10 border border-[#00E4FF]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E4FF] to-[#8C4BFF]"></div>
              
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 font-space">
                <Send className="w-6 h-6 text-[#00E4FF]" />
                Secure Messaging
              </h2>

              {submitted ? (
                <Alert className="bg-green-500/10 border-green-500/30 neon-border-cyan mb-8">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <AlertDescription className="text-green-100 ml-2">
                    Transmission received. We will respond within 24 hours.
                  </AlertDescription>
                </Alert>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 text-sm uppercase tracking-wider font-bold">Identity</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-black/40 border-white/10 text-white focus:border-[#00E4FF] h-12"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 text-sm uppercase tracking-wider font-bold">Contact Point</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-black/40 border-white/10 text-white focus:border-[#00E4FF] h-12"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-300 text-sm uppercase tracking-wider font-bold">Subject Protocol</Label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="bg-black/40 border-white/10 text-white focus:border-[#00E4FF] h-12"
                    placeholder="Consultation / Partnership / Support"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-300 text-sm uppercase tracking-wider font-bold">Transmission</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="bg-black/40 border-white/10 text-white focus:border-[#00E4FF] resize-none"
                    placeholder="Describe your security requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={sendEmail.isPending}
                  className="w-full bg-gradient-to-r from-[#00E4FF] to-[#0099FF] hover:to-[#00E4FF] text-black font-bold uppercase tracking-wide h-14 text-lg shadow-[0_0_20px_rgba(0,228,255,0.3)] border-none transition-all"
                >
                  {sendEmail.isPending ? "Encrypting & Sending..." : "Initiate Transmission"}
                </Button>
              </form>
            </div>

            {/* Side Info */}
            <div className="space-y-8">
              <div className="glass-card rounded-2xl p-8 border border-[#8C4BFF]/20">
                <h3 className="text-2xl font-bold text-white mb-4 font-space">Global Operations</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  GlyphLock operates globally with Arizona as our primary jurisdiction and legal enforcement zone. 
                  Our systems are deployed across enterprise networks, hospitality venues, and secure facilities worldwide.
                </p>
                <div className="flex items-center gap-3 text-[#8C4BFF] font-bold uppercase tracking-wide text-sm">
                  <Globe className="w-5 h-5" />
                  <span>Operating in 12 Time Zones</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <h3 className="text-2xl font-bold text-white mb-4 font-space">Partnership Inquiries</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  For enterprise licensing, white-label solutions, or strategic integration requests, please use the contact form with subject "Partnership".
                </p>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00E4FF]" />
                    <span>Enterprise volume licensing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00E4FF]" />
                    <span>Custom API integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00E4FF]" />
                    <span>Dedicated support channels</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}