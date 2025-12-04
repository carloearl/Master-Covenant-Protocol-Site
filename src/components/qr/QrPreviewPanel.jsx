import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Shield, Clock, FileImage, FileCode, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import QrSecurityBadge from './QrSecurityBadge';

/**
 * QrPreviewPanel - Final Preview Tab Component
 * This is the SINGLE SOURCE OF TRUTH for displaying the final QR code
 * with all customizations applied.
 * 
 * NO customization tools appear here.
 * NO payload forms appear here.
 * This is a CLEAN final stage.
 */
export default function QrPreviewPanel({
  qrAssetDraft,
  customization,
  qrImageUrl,
  securityResult,
  size,
  errorCorrectionLevel,
  qrType,
  codeId,
  logoPreviewUrl,
  onRegenerate
}) {
  if (!qrAssetDraft && !qrImageUrl) {
    return (
      <Card className="bg-gray-900/80 border-purple-500/30 p-12 text-center">
        <Eye className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-bold text-white mb-2">No QR Code Generated</h3>
        <p className="text-gray-400">
          Go to the Create tab to generate a QR code, then customize it in the Customize tab.
        </p>
      </Card>
    );
  }

  const displayUrl = qrAssetDraft?.safeQrImageUrl || qrImageUrl;
  const riskScore = qrAssetDraft?.riskScore || securityResult?.final_score || 100;
  const riskFlags = qrAssetDraft?.riskFlags || securityResult?.phishing_indicators || [];

  const handleDownload = (format) => {
    if (!displayUrl) {
      toast.error('No QR code to download');
      return;
    }
    
    const link = document.createElement('a');
    link.href = displayUrl;
    link.download = `glyphlock-qr-${qrType || 'code'}-${codeId || Date.now()}.${format}`;
    link.click();
    toast.success(`QR code downloaded as ${format.toUpperCase()}`);
  };

  const timestamp = new Date().toISOString();

  return (
    <div className="space-y-6 relative z-10">
      {/* Main Preview Card */}
      <Card className="bg-gray-900/80 border-purple-500/30 shadow-2xl">
        <CardHeader className="border-b border-purple-500/20">
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              Final QR Preview
            </span>
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: QR Display */}
            <div className="space-y-4">
              <div 
                className="p-8 rounded-xl flex items-center justify-center relative shadow-inner"
                style={{
                  background: customization?.background?.type === 'gradient'
                    ? `linear-gradient(135deg, ${customization.background?.gradientColor1 || '#FFFFFF'}, ${customization.background?.gradientColor2 || '#E5E7EB'})`
                    : customization?.background?.type === 'image' && customization?.background?.imageUrl
                      ? `url(${customization.background.imageUrl}) center/cover`
                      : customization?.background?.color || '#FFFFFF'
                }}
              >
                {displayUrl ? (
                  <>
                    <img 
                      src={displayUrl} 
                      alt="Final QR Code" 
                      className="max-w-full max-h-[400px]"
                      style={{
                        filter: customization?.gradient?.enabled 
                          ? `hue-rotate(${customization.gradient.angle || 0}deg)` 
                          : 'none'
                      }}
                    />
                    {(logoPreviewUrl || customization?.logo?.url) && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ opacity: (customization?.logo?.opacity || 100) / 100 }}
                      >
                        <img 
                          src={logoPreviewUrl || customization?.logo?.url} 
                          alt="Logo" 
                          className={`bg-white p-1 ${
                            customization?.logo?.shape === 'circle' ? 'rounded-full' :
                            customization?.logo?.shape === 'rounded' ? 'rounded-xl' : 'rounded-lg'
                          } ${customization?.logo?.border ? 'border-2 border-gray-300' : ''} ${
                            customization?.logo?.dropShadow ? 'shadow-lg' : ''
                          }`}
                          style={{ 
                            width: `${customization?.logo?.size || 20}%`,
                            height: 'auto',
                            transform: `rotate(${customization?.logo?.rotation || 0}deg)`
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-64 h-64 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">No QR Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Metadata & Downloads */}
            <div className="space-y-6">
              {/* Security Score */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Security Score</h4>
                <QrSecurityBadge riskScore={riskScore} riskFlags={riskFlags} />
              </div>

              {/* Metadata Summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Metadata</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-xs text-gray-500">Payload Type</p>
                    <p className="text-sm font-medium text-white capitalize">{qrType || 'URL'}</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="text-sm font-medium text-white">{size || 512}px</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-xs text-gray-500">Error Correction</p>
                    <p className="text-sm font-medium text-white">{errorCorrectionLevel || 'H'} ({
                      errorCorrectionLevel === 'L' ? '7%' :
                      errorCorrectionLevel === 'M' ? '15%' :
                      errorCorrectionLevel === 'Q' ? '25%' : '30%'
                    })</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-xs text-gray-500">Generated</p>
                    <p className="text-sm font-medium text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customization Summary */}
              {customization && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Customization</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      Dot: {customization.dotStyle || 'square'}
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      Eye: {customization.eyeStyle || 'square'}
                    </Badge>
                    {customization.gradient?.enabled && (
                      <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                        Gradient
                      </Badge>
                    )}
                    {(logoPreviewUrl || customization.logo?.url) && (
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                        Logo
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Download Buttons */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Download</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => handleDownload('png')}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                  >
                    <FileImage className="w-4 h-4 mr-1" />
                    PNG
                  </Button>
                  <Button
                    onClick={() => handleDownload('svg')}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <FileCode className="w-4 h-4 mr-1" />
                    SVG
                  </Button>
                  <Button
                    onClick={() => handleDownload('pdf')}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hash & Integrity */}
      {qrAssetDraft?.immutableHash && (
        <Card className="bg-gray-900/60 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Immutable Hash (SHA-256)</p>
                <p className="text-xs font-mono text-gray-400 break-all">{qrAssetDraft.immutableHash}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}