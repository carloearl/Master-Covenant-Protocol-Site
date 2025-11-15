import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Get in <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-400">
              We're here to help secure your digital future
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Email</h3>
                <a href="mailto:glyphlock@gmail.com" className="text-blue-400 hover:text-blue-300">
                  glyphlock@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Phone</h3>
                <a href="tel:+14242466499" className="text-blue-400 hover:text-blue-300">
                  (424) 246-6499
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Location</h3>
                <p className="text-gray-400">El Mirage, Arizona</p>
              </CardContent>
            </Card>
          </div>

          {submitted && (
            <Alert className="mb-8 bg-green-500/10 border-green-500/30">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-white">
                Thank you! We'll get back to you within 24 hours.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
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
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-white">Subject *</Label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-white">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={sendEmail.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendEmail.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}