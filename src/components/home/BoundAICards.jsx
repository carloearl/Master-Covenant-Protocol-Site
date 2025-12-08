// LEGACY / FEATURE COMPONENT
// Do not use on Home page Dream Team section.
// Canonical Dream Team is HomeDreamTeam + DreamTeamFlipCard + components/data/dreamTeam

import React from "react";
import { motion } from "framer-motion";
import { Brain, Shield, Zap, Code, Eye, Lock } from "lucide-react";

const AICard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="glass-card-dark border-blue-500/30 p-6 rounded-xl group cursor-pointer"
    >
      <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
};

export default function BoundAICards() {
  const cards = [
    {
      icon: Brain,
      title: "AI Threat Detection",
      description: "Machine learning models identify anomalies in real-time"
    },
    {
      icon: Shield,
      title: "Zero-Day Protection",
      description: "Proactive defense against unknown vulnerabilities"
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Automated threat neutralization in milliseconds"
    },
    {
      icon: Code,
      title: "Smart Contracts",
      description: "Blockchain-verified security agreements"
    },
    {
      icon: Eye,
      title: "24/7 Monitoring",
      description: "Continuous surveillance across all endpoints"
    },
    {
      icon: Lock,
      title: "Quantum Encryption",
      description: "Future-proof cryptographic protection"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          AI-Powered Security Intelligence
        </h2>
        <p className="text-lg text-white/70">
          Next-generation protection powered by artificial intelligence
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <AICard key={idx} {...card} delay={idx * 0.1} />
        ))}
      </div>
    </div>
  );
}