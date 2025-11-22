import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Activity, BarChart3 } from "lucide-react";
import ThreatMonitor from "@/components/security/ThreatMonitor";
import SecurityAnalytics from "@/components/security/SecurityAnalytics";
import FreeTrialGuard from "@/components/FreeTrialGuard";

export default function SecurityOperationsCenter() {
  return (
    <FreeTrialGuard serviceName="HSSS">
      <div className="min-h-screen bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Security <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Operations Center</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Real-time threat monitoring, interactive mapping, and security analytics
              </p>
            </div>

            <Tabs defaultValue="monitor" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-8">
                <TabsTrigger value="monitor" className="text-white data-[state=active]:bg-red-600">
                  <Activity className="w-4 h-4 mr-2" />
                  Live Monitor
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-red-600">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="monitor">
                <ThreatMonitor />
              </TabsContent>

              <TabsContent value="analytics">
                <SecurityAnalytics />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </FreeTrialGuard>
  );
}