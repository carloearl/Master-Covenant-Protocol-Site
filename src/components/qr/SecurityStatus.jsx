import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, XCircle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SecurityStatus({ securityResult }) {
  if (!securityResult) return null;

  const getStatusConfig = () => {
    const { final_score, risk_level } = securityResult;
    
    if (final_score >= 80 && risk_level === "safe") {
      return {
        icon: CheckCircle2,
        color: "green",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        textColor: "text-green-400",
        status: "Safe & Verified",
        message: "This QR code passed all security checks and is safe to use."
      };
    } else if (final_score >= 65 && (risk_level === "low" || risk_level === "medium")) {
      return {
        icon: AlertTriangle,
        color: "yellow",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        textColor: "text-yellow-400",
        status: "Suspicious - Allowed",
        message: "This QR code has been flagged for review but is allowed. Proceed with caution."
      };
    } else {
      return {
        icon: XCircle,
        color: "red",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-400",
        status: "Blocked - High Risk",
        message: "This QR code has been blocked due to security concerns."
      };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className={`bg-gray-900 border ${config.borderColor}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`${config.bgColor} p-3 rounded-lg`}>
            <Icon className={`w-6 h-6 ${config.textColor}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-bold text-lg ${config.textColor}`}>{config.status}</h3>
              <Badge variant="outline" className={`${config.textColor} border-current`}>
                Score: {securityResult.final_score}/100
              </Badge>
            </div>
            
            <p className="text-white text-sm mb-4">{config.message}</p>
            
            {/* Detailed Scores */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Domain Trust</div>
                <div className="text-lg font-bold text-white">{securityResult.domain_trust}%</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Sentiment</div>
                <div className="text-lg font-bold text-white">{securityResult.sentiment_score}%</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Entity Check</div>
                <div className="text-lg font-bold text-white">{securityResult.entity_legitimacy}%</div>
              </div>
            </div>

            {/* Threat Indicators */}
            {securityResult.threat_types && securityResult.threat_types.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-2">Detected Threats:</div>
                <div className="flex flex-wrap gap-2">
                  {securityResult.threat_types.map((threat, idx) => (
                    <Badge key={idx} variant="outline" className="border-red-500/50 text-red-400">
                      {threat}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Phishing Indicators */}
            {securityResult.phishing_indicators && securityResult.phishing_indicators.length > 0 && (
              <div>
                <div className="text-xs text-gray-400 mb-2">Security Flags:</div>
                <div className="flex flex-wrap gap-2">
                  {securityResult.phishing_indicators.map((indicator, idx) => (
                    <Badge key={idx} variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* AI Model Version */}
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Scanned by AI Security Engine v{securityResult.ml_version}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}