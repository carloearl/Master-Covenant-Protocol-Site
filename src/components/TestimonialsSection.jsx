import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CISO, TechCorp",
      company: "Fortune 500 Technology Company",
      content: "GlyphLock's quantum-resistant encryption gave us the confidence to future-proof our infrastructure. The AI threat detection is phenomenal.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      name: "Marcus Rodriguez",
      role: "VP Security",
      company: "Global Financial Services",
      content: "We migrated our entire security stack to GlyphLock. The zero-trust architecture and real-time monitoring are game-changers.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of Cybersecurity",
      company: "Healthcare Network",
      content: "HIPAA compliance was seamless with GlyphLock. Their PQC integration means we're ready for the quantum computing era.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=5"
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Trusted by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Security Leaders</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            See what industry professionals say about our security solutions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="glass-royal border-blue-500/30 hover:border-blue-500/60 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-blue-400 text-blue-400" />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-blue-400/30 mb-4" />
                <p className="text-white mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500/50"
                  />
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-blue-400">{testimonial.role}</div>
                    <div className="text-xs text-white/60">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}