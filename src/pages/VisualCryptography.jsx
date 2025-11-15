import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Image, QrCode } from "lucide-react";
import QRGeneratorTab from "@/components/crypto/QRGeneratorTab";
import SteganographyTab from "@/components/crypto/SteganographyTab";
import FreeTrialGuard from "@/components/FreeTrialGuard";

export default function VisualCryptography() {
  return (
    <FreeTrialGuard serviceName="QRGenerator">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Visual Cryptography</span> Suite
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Enterprise-grade QR code generation with AI security scanning and steganographic image encoding
              </p>
            </div>

            <Tabs defaultValue="qr" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900 max-w-md mx-auto">
                <TabsTrigger value="qr" className="text-white data-[state=active]:bg-blue-600">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Generator
                </TabsTrigger>
                <TabsTrigger value="stego" className="text-white data-[state=active]:bg-blue-600">
                  <Image className="w-4 h-4 mr-2" />
                  Steganography
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qr">
                <QRGeneratorTab />
              </TabsContent>

              <TabsContent value="stego">
                <SteganographyTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </FreeTrialGuard>
  );
}