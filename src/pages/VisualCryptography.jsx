import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Image, QrCode } from "lucide-react";
import QRGeneratorTab from "@/components/crypto/QRGeneratorTab";
import SteganographyTab from "@/components/crypto/SteganographyTab";
import FreeTrialGuard from "@/components/FreeTrialGuard";

export default function VisualCryptography() {
  return (
    <FreeTrialGuard serviceName="VisualCryptography">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Visual <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Cryptography Suite</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Generate secure QR codes and hide encrypted data within images
              </p>
            </div>

            <Tabs defaultValue="qr" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-8">
                <TabsTrigger value="qr" className="text-white data-[state=active]:bg-blue-600">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Generator
                </TabsTrigger>
                <TabsTrigger value="steg" className="text-white data-[state=active]:bg-blue-600">
                  <Image className="w-4 h-4 mr-2" />
                  Steganography
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qr">
                <QRGeneratorTab />
              </TabsContent>

              <TabsContent value="steg">
                <SteganographyTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </FreeTrialGuard>
  );
}