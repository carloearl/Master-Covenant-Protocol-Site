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
import { Calendar, CheckCircle2, Clock, Shield, Award } from "lucide-react";

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

  const createConsultation = useMutation({
    mutationFn: (data) => base44.entities.Consultation.create(data),
    onSuccess: (result) => {
      navigate(createPageUrl("Payment") + `?consultation_id=${result.id}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createConsultation.mutate(formData);
  };

  const benefits = [
    { icon: Shield, text: "Free 60-minute consultation" },
    { icon: Award, text: "Expert cybersecurity analysis" },
    { icon: Clock, text: "Custom solution recommendations" },
    { icon: CheckCircle2, text: "Detailed proposal document" }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Book Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Consultation</span>
            </h1>
            <p className="text-xl text-white/70">
              Schedule a consultation with our cybersecurity experts
            </p>
            <p className="text-blue-400 mt-2">$299 consultation fee • Applied to final project cost</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Consultation Request Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="full_name" className="text-white">Full Name *</Label>
                        <Input
                          id="full_name"
                          required
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          className="glass-card-dark border-blue-500/30 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="glass-card-dark border-blue-500/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company" className="text-white">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="glass-card-dark border-blue-500/30 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-white">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="glass-card-dark border-blue-500/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="service_interest" className="text-white">Service Interest *</Label>
                        <Select
                          value={formData.service_interest}
                          onValueChange={(value) => setFormData({...formData, service_interest: value})}
                        >
                          <SelectTrigger className="glass-card-dark border-blue-500/30 text-white">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent className="glass-card-dark border-blue-500/30">
                            <SelectItem value="Master Covenant">Master Covenant</SelectItem>
                            <SelectItem value="Security Tools">Security Tools</SelectItem>
                            <SelectItem value="NUPS POS">NUPS POS</SelectItem>
                            <SelectItem value="AI Tools">AI Tools</SelectItem>
                            <SelectItem value="Custom Solution">Custom Solution</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="preferred_date" className="text-white">Preferred Date</Label>
                        <Input
                          id="preferred_date"
                          type="date"
                          value={formData.preferred_date}
                          onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                          className="glass-card-dark border-blue-500/30 text-white"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us about your security needs..."
                        className="glass-card-dark border-blue-500/30 text-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={createConsultation.isPending}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      {createConsultation.isPending ? "Processing..." : "Continue to Payment"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <benefit.icon className="w-5 h-5 text-blue-400 mt-1" />
                      <span className="text-white">{benefit.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card-dark border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Consultation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Consultation Fee:</span>
                    <span className="font-semibold text-white">$299</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Response Time:</span>
                    <span className="font-semibold text-white">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Duration:</span>
                    <span className="font-semibold text-white">60 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Format:</span>
                    <span className="font-semibold text-white">Video Call</span>
                  </div>
                  <div className="pt-3 border-t border-blue-500/30">
                    <p className="text-white/70 text-xs">
                      * Consultation fee is fully credited toward your final project cost if you proceed with our services.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="font-bold text-white mb-2">100% Satisfaction Guarantee</h3>
                  <p className="text-sm text-white">
                    If you're not satisfied, we'll refund your consultation fee within 48 hours.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}