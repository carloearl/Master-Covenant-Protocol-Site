import React from "react";
import PaywallGuard from "@/components/PaywallGuard";
import HotzoneMapper from "@/components/security/HotzoneMapper";

export default function HotzoneMapperPage() {
  return (
    <PaywallGuard serviceName="Hotzone Mapper" requirePlan="enterprise">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <HotzoneMapper />
        </div>
      </div>
    </PaywallGuard>
  );
}