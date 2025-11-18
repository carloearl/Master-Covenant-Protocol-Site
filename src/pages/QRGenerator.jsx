import React from "react";
import PaywallGuard from "@/components/PaywallGuard";
import QRGeneratorTab from "@/components/crypto/QRGeneratorTab";

export default function QRGenerator() {
  return (
    <PaywallGuard serviceName="QR Generator" requirePlan="professional">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <QRGeneratorTab />
        </div>
      </div>
    </PaywallGuard>
  );
}