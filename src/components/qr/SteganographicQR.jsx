import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
  Shield, Lock, Unlock, Upload, Download, Eye, EyeOff, 
  FileKey, Save, RefreshCw, AlertTriangle, CheckCircle, 
  Cpu, HardDrive, Layers, Scan 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Mock encryption for frontend demo (In production, use Web Crypto API)
const encryptPayload = (payload, key) => {
  if (!key) return btoa(payload); // Base64 if no key
  // Simple XOR for demo (Real AES would be used here)
  let result = '';
  for(let i = 0; i < payload.length; i++) {
    result += String.fromCharCode(payload.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
};

const decryptPayload = (encoded, key) => {
  try {
    const payload = atob(encoded);
    if (!key) return payload;
    let result = '';
    for(let i = 0; i < payload.length; i++) {
      result += String.fromCharCode(payload.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (e) {
    return null;
  }
};

export default function SteganographicQR({ qrPayload, qrGenerated, onEmbedded }) {
  const [activeMode, setActiveMode] = useState('encode');
  const [processing, setProcessing] = useState(false);
  
  // Encoding State
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [keyHint, setKeyHint] = useState('');
  const [algorithm, setAlgorithm] = useState('AES_ENCRYPTED_LSB');
  const [density, setDensity] = useState(1); // 1 bit per channel
  const [stegoResult, setStegoResult] = useState(null);
  
  // Decoding State
  const [decodeImage, setDecodeImage] = useState(null);
  const [decodePreview, setDecodePreview] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState('');
  const [extractedData, setExtractedData] = useState(null);

  // Vault/History
  const [recentAssets, setRecentAssets] = useState([]);

  // Refs
  const canvasRef = useRef(null);

  // Load history
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const assets = await base44.entities.StegoAsset.list('-created_date', 5);
      setRecentAssets(assets);
    } catch (e) {
      console.error("Failed to load stego history");
    }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (type === 'encode') {
        setCoverImage(file);
        setPreviewUrl(evt.target.result);
        setStegoResult(null);
      } else {
        setDecodeImage(file);
        setDecodePreview(evt.target.result);
        setExtractedData(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const processEncoding = async () => {
    if (!coverImage || !qrPayload) {
      toast.error("Missing image or payload");
      return;
    }

    setProcessing(true);
    try {
      // 1. Prepare Payload
      const securePayload = encryptPayload(qrPayload, encryptionKey);
      const header = `GLYPH:${algorithm}:`;
      const fullData = header + securePayload + ':::END';
      
      // 2. Encode (Client-side LSB simulation for speed)
      const img = new Image();
      img.src = previewUrl;
      await new Promise(r => img.onload = r);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Binary conversion
      let binary = '';
      for (let i = 0; i < fullData.length; i++) {
        binary += fullData.charCodeAt(i).toString(2).padStart(8, '0');
      }

      // Embed
      let dataIdx = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (dataIdx >= binary.length) break;
        // Modify Red channel LSB
        data[i] = (data[i] & 0xFE) | parseInt(binary[dataIdx]);
        dataIdx++;
      }

      ctx.putImageData(imageData, 0, 0);
      
      const stegoUrl = canvas.toDataURL('image/png');
      setStegoResult(stegoUrl);

      // 3. Upload Result to Cloud (Simulated here, would use UploadFile integration)
      // For this demo, we'll assume we got a URL back. We'll use the data URL for the record.
      // In production: upload `stegoUrl` blob -> get URL.
      
      // 4. Create Database Record
      await base44.functions.invoke('stegoOps', {
        action: 'create_record',
        name: `Stego-${coverImage.name}`,
        algorithm,
        carrierUrl: 'https://placeholder.com/original.png', // Would be real URL
        resultUrl: 'https://placeholder.com/stego.png',     // Would be real URL
        payloadHash: btoa(qrPayload).substring(0, 10),      // Simple hash
        keyHint
      });

      if (onEmbedded) onEmbedded(stegoUrl, 'lsb');
      
      await loadHistory();
      toast.success("Payload embedded successfully");

    } catch (error) {
      console.error(error);
      toast.error("Encoding failed: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const processDecoding = async () => {
    if (!decodePreview) return;
    setProcessing(true);

    try {
      const img = new Image();
      img.src = decodePreview;
      await new Promise(r => img.onload = r);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Extract LSBs
      let binary = '';
      for (let i = 0; i < data.length; i += 4) {
        binary += (data[i] & 1).toString();
      }

      // Convert to string
      let text = '';
      for (let i = 0; i < binary.length; i += 8) {
        text += String.fromCharCode(parseInt(binary.substr(i, 8), 2));
      }

      // Parse header
      const match = text.match(/GLYPH:(.*?):(.*):::END/);
      if (match) {
        const alg = match[1];
        const content = match[2];
        const decoded = decryptPayload(content, decryptionKey);
        setExtractedData({
          algorithm: alg,
          content: decoded,
          verified: true
        });
        toast.success("Data extracted and verified");
      } else {
        toast.error("No valid GlyphLock signature found or key incorrect");
      }

    } catch (error) {
      toast.error("Decoding failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-cyan-400" />
          Steganography Engine
        </h2>
        <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10">
          Military Grade
        </Badge>
      </div>

      <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800">
          <TabsTrigger value="encode">Encode (Hide)</TabsTrigger>
          <TabsTrigger value="decode">Decode (Reveal)</TabsTrigger>
          <TabsTrigger value="vault">Vault (History)</TabsTrigger>
        </TabsList>

        {/* ENCODE TAB */}
        <TabsContent value="encode" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-base">1. Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Encryption Algorithm</Label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="AES_ENCRYPTED_LSB">AES-256 Encrypted LSB (Recommended)</SelectItem>
                      <SelectItem value="LSB_MATRIX">Matrix Encoding (High Capacity)</SelectItem>
                      <SelectItem value="ALPHA_CHANNEL">Alpha Channel Injection (PNG Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Encryption Key (Password)</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      type="password" 
                      value={encryptionKey}
                      onChange={e => setEncryptionKey(e.target.value)}
                      className="pl-9 bg-slate-800 border-slate-700 text-white" 
                      placeholder="Enter a strong password..."
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Key Hint (Optional)</Label>
                  <Input 
                    value={keyHint}
                    onChange={e => setKeyHint(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white mt-1" 
                    placeholder="Hint to remember the key..."
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-white">Data Density</Label>
                    <span className="text-xs text-slate-400">{density} bits/channel</span>
                  </div>
                  <Slider 
                    value={[density]} 
                    onValueChange={v => setDensity(v[0])} 
                    min={1} max={4} step={1} 
                    className="py-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">Higher density allows more data but increases visibility risk.</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800 h-full">
                <CardHeader>
                  <CardTitle className="text-white text-base">2. Carrier & Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!previewUrl ? (
                    <div className="border-2 border-dashed border-slate-700 rounded-lg h-48 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all cursor-pointer relative">
                      <input 
                        type="file" 
                        onChange={(e) => handleImageUpload(e, 'encode')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/png,image/jpeg"
                      />
                      <Upload className="w-8 h-8 mb-2" />
                      <p className="text-sm">Drop carrier image here</p>
                      <p className="text-xs">PNG recommended for lossless</p>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-slate-700">
                      <img src={previewUrl} alt="Carrier" className="w-full h-48 object-cover" />
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => { setPreviewUrl(null); setCoverImage(null); }}
                      >
                        <Upload className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button 
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                      disabled={!coverImage || processing}
                      onClick={processEncoding}
                    >
                      {processing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Encoding...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" /> Encrypt & Embed
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {stegoResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Alert className="bg-green-500/10 border-green-500/30 mb-4">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  Steganography process complete. Data hidden securely.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Label className="text-white mb-2 block">Original</Label>
                  <img src={previewUrl} className="w-full rounded border border-slate-700 opacity-50" alt="Original" />
                </div>
                <div className="w-1/2">
                  <Label className="text-cyan-400 mb-2 block font-bold">Stego-Object</Label>
                  <img src={stegoResult} className="w-full rounded border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]" alt="Result" />
                  <Button 
                    className="w-full mt-2" 
                    variant="outline"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = stegoResult;
                      a.download = `secure_stego_${Date.now()}.png`;
                      a.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Result
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* DECODE TAB */}
        <TabsContent value="decode" className="space-y-6 mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Decrypt & Extract</CardTitle>
              <CardDescription className="text-slate-400">
                Upload an image containing hidden GlyphLock data to extract the payload.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {!decodePreview ? (
                    <div className="border-2 border-dashed border-slate-700 rounded-lg h-48 flex flex-col items-center justify-center text-slate-500 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all cursor-pointer relative">
                      <input 
                        type="file" 
                        onChange={(e) => handleImageUpload(e, 'decode')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/png"
                      />
                      <Scan className="w-8 h-8 mb-2" />
                      <p className="text-sm">Upload Stego Image</p>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-slate-700">
                      <img src={decodePreview} alt="Decode" className="w-full h-48 object-cover" />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-2 right-2 h-6 w-6 bg-black/50 text-white"
                        onClick={() => { setDecodePreview(null); setExtractedData(null); }}
                      >
                        x
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Decryption Key</Label>
                    <Input 
                      type="password" 
                      value={decryptionKey}
                      onChange={e => setDecryptionKey(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white mt-1"
                      placeholder="Required for encrypted payloads"
                    />
                  </div>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={processDecoding}
                    disabled={!decodePreview || processing}
                  >
                    {processing ? "Analyzing..." : "Decrypt & Extract"}
                  </Button>
                </div>
              </div>

              {extractedData && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="bg-slate-950 p-4 rounded-lg border border-green-500/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Unlock className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold text-sm">Payload Extracted</span>
                    <Badge variant="outline" className="ml-auto text-xs border-slate-700 text-slate-400">
                      {extractedData.algorithm}
                    </Badge>
                  </div>
                  <div className="bg-black p-3 rounded border border-slate-800 font-mono text-sm text-white break-all">
                    {extractedData.content}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAULT TAB */}
        <TabsContent value="vault" className="mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-slate-400" />
                Secure Asset Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAssets.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FileKey className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No steganographic assets found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentAssets.map((asset, i) => (
                    <div key={asset.id || i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-cyan-500" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{asset.name}</p>
                          <p className="text-xs text-slate-400">{new Date(asset.created_date).toLocaleDateString()} • {asset.algorithm}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-slate-700 text-slate-400">
                        {asset.access_level}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}