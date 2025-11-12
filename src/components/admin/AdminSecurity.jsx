import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, QrCode } from "lucide-react";

export default function AdminSecurity({ qrCodes }) {
  const safeQRCodes = qrCodes.filter(q => q.status === 'safe').length;
  const suspiciousQRCodes = qrCodes.filter(q => q.status === 'suspicious').length;
  const blockedQRCodes = qrCodes.filter(q => q.status === 'blocked').length;

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                Safe
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{safeQRCodes}</div>
            <div className="text-sm text-green-400">Verified QR Codes</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-700/10 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                Flagged
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{suspiciousQRCodes}</div>
            <div className="text-sm text-yellow-400">Suspicious Codes</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-700/10 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-red-400" />
              <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                Blocked
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{blockedQRCodes}</div>
            <div className="text-sm text-red-400">Blocked Threats</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Security Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {qrCodes.slice(0, 10).map((qr, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <QrCode className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <div className="text-sm text-white font-mono truncate max-w-[300px]">
                      {qr.payload}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(qr.created_date).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                    {qr.type}
                  </Badge>
                  <Badge className={
                    qr.status === 'safe'
                      ? 'bg-green-500/20 text-green-400 border-green-500/50'
                      : qr.status === 'suspicious'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      : 'bg-red-500/20 text-red-400 border-red-500/50'
                  }>
                    {qr.status}
                  </Badge>
                </div>
              </div>
            ))}

            {qrCodes.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No security scans yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}