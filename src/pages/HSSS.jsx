import React, { useState } from "react";
import PaywallGuard from "@/components/PaywallGuard";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Upload, Download, Key } from "lucide-react";

export default function HSSS() {
  return (
    <PaywallGuard serviceName="HSSS Protocol" requirePlan="professional">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                HSSS Protocol
              </span>
            </h1>
            <p className="text-xl text-white/70">
              Hybrid Steganographic Secret Sharing System
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="glass-card-dark border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Create Secret Shares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Secret Message</Label>
                  <Textarea 
                    placeholder="Enter your secret message..."
                    className="glass-card-dark border-blue-500/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Number of Shares</Label>
                  <Input 
                    type="number" 
                    defaultValue={3}
                    className="glass-card-dark border-blue-500/30 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Threshold</Label>
                  <Input 
                    type="number" 
                    defaultValue={2}
                    className="glass-card-dark border-blue-500/30 text-white"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-700">
                  <Key className="w-4 h-4 mr-2" />
                  Generate Shares
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400" />
                  Reconstruct Secret
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Upload Shares</Label>
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-white/70">Drop files or click to upload</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Reconstruct Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PaywallGuard>
  );
}