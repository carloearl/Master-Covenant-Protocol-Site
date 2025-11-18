import React from "react";
import PaywallGuard from "@/components/PaywallGuard";
import SteganographyTab from "@/components/crypto/SteganographyTab";

export default function Steganography() {
  return (
    <PaywallGuard serviceName="Steganography" requirePlan="professional">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <SteganographyTab />
        </div>
      </div>
    </PaywallGuard>
  );
}