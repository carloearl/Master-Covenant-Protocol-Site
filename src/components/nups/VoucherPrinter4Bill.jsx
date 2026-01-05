import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Download, Upload, RotateCcw, Eye, Settings, DollarSign, Hash, Brain } from "lucide-react";
import { toast } from "sonner";
import { VoucherAIPanel } from "./AIInsightsPanel";

const VENUES = [
  { id: 'SK', name: 'Skin Cabaret', color: '#EC4899' },
  { id: 'BN', name: 'Bones Cabaret', color: '#DC2626' },
  { id: 'DP', name: 'Dream Palace', color: '#8B5CF6' },
  { id: 'EV', name: 'Eve\'s Teas', color: '#10B981' },
  { id: 'GL', name: 'GlyphLock', color: '#3B82F6' },
];

const DENOMINATIONS = [5, 10, 20, 50, 100, 200, 500];

export default function VoucherPrinter4Bill() {
  const [venue, setVenue] = useState('SK');
  const [denomination, setDenomination] = useState(20);
  const [serialStart, setSerialStart] = useState(1);
  const [bgImage, setBgImage] = useState(null);
  const [totalPrinted, setTotalPrinted] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('nups_voucher_4bill');
    if (saved) {
      const data = JSON.parse(saved);
      setSerialStart(data.serialStart || 1);
      setTotalPrinted(data.totalPrinted || 0);
      if (data.venue) setVenue(data.venue);
      if (data.denomination) setDenomination(data.denomination);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nups_voucher_4bill', JSON.stringify({
      serialStart, totalPrinted, venue, denomination
    }));
  }, [serialStart, totalPrinted, venue, denomination]);

  const venueData = VENUES.find(v => v.id === venue);
  const year = new Date().getFullYear().toString().slice(-2);

  const getSerial = (offset = 0) => {
    return `${venue}${String(serialStart + offset).padStart(4, '0')}-${year}`;
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBgImage(ev.target.result);
      toast.success('Background uploaded');
    };
    reader.readAsDataURL(file);
  };

  const printSheet = () => {
    setIsPrinting(true);
    const serials = [0, 1, 2, 3].map(i => getSerial(i));
    
    const win = window.open('', '_blank', 'width=900,height=1100');
    win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Voucher Sheet - ${venue}</title>
  <style>
    @page { size: letter; margin: 0.5in; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #fff; }
    .sheet { 
      width: 7.5in; 
      display: flex; 
      flex-direction: column; 
      gap: 0.25in;
      padding-top: 0.25in;
    }
    .voucher {
      width: 6.14in;
      height: 2.61in;
      margin: 0 auto;
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .voucher-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: ${bgImage ? '0.85' : '0'};
    }
    .voucher-content {
      position: absolute;
      inset: 0;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .venue-tag {
      background: ${venueData?.color};
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .amount {
      font-size: 42px;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(255,215,0,0.3);
      font-family: 'Georgia', serif;
    }
    .amount::before { content: '$'; font-size: 24px; vertical-align: top; margin-right: 2px; }
    .bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .serial-box {
      background: rgba(0,0,0,0.7);
      border: 1px solid rgba(0,255,136,0.3);
      padding: 6px 12px;
      border-radius: 4px;
    }
    .serial {
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #00FF88;
      letter-spacing: 1px;
      font-weight: bold;
    }
    .qr-box {
      width: 56px;
      height: 56px;
      background: white;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .qr-inner {
      width: 48px;
      height: 48px;
      background: 
        linear-gradient(90deg, #000 25%, transparent 25%, transparent 75%, #000 75%),
        linear-gradient(#000 25%, transparent 25%, transparent 75%, #000 75%);
      background-size: 8px 8px;
      opacity: 0.8;
    }
    .watermark {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 7px;
      color: rgba(255,255,255,0.25);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .cut-line {
      border-bottom: 1px dashed #ccc;
      margin: 0 auto;
      width: 6.5in;
    }
  </style>
</head>
<body>
  <div class="sheet">
    ${serials.map((serial, i) => `
      <div class="voucher">
        ${bgImage ? `<img src="${bgImage}" class="voucher-bg" />` : ''}
        <div class="voucher-content">
          <div class="top-row">
            <div class="venue-tag">${venueData?.name}</div>
            <div class="amount">${denomination}</div>
          </div>
          <div class="bottom-row">
            <div class="serial-box">
              <div class="serial">${serial}</div>
            </div>
            <div class="qr-box">
              <div class="qr-inner"></div>
            </div>
          </div>
        </div>
        <div class="watermark">GlyphLock Secure Voucher • ${new Date().toLocaleDateString()}</div>
      </div>
      ${i < 3 ? '<div class="cut-line"></div>' : ''}
    `).join('')}
  </div>
  <script>
    window.onload = () => { setTimeout(() => window.print(), 300); };
  </script>
</body>
</html>
    `);
    win.document.close();

    setTimeout(() => {
      setSerialStart(prev => prev + 4);
      setTotalPrinted(prev => prev + 4);
      setIsPrinting(false);
      toast.success(`Printed: ${serials[0]} → ${serials[3]}`);
    }, 1000);
  };

  const resetCounter = () => {
    if (confirm('Reset serial counter to 0001?')) {
      setSerialStart(1);
      toast.success('Counter reset');
    }
  };

  const applyAIRecommendation = (value, quantity) => {
    setDenomination(value);
    toast.success(`Applied $${value} denomination`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Hash className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalPrinted}</p>
                <p className="text-xs text-slate-400">Bills Printed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">${totalPrinted * denomination}</p>
                <p className="text-xs text-slate-400">Face Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${venueData?.color}20` }}>
                <Settings className="w-5 h-5" style={{ color: venueData?.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{venue}</p>
                <p className="text-xs text-slate-400">{venueData?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-purple-400">{getSerial()}</p>
                <p className="text-xs text-slate-400">Next Serial</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Panel */}
      <VoucherAIPanel venue={venueData?.name} onApplyRecommendation={applyAIRecommendation} />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Config Panel */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-300 text-sm">Venue</Label>
              <Select value={venue} onValueChange={setVenue}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {VENUES.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                        {v.id} - {v.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300 text-sm">Denomination</Label>
              <Select value={String(denomination)} onValueChange={v => setDenomination(Number(v))}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {DENOMINATIONS.map(d => (
                    <SelectItem key={d} value={String(d)}>${d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300 text-sm">Background Image</Label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <Button
                onClick={() => fileRef.current?.click()}
                variant="outline"
                className="w-full mt-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Upload className="w-4 h-4 mr-2" />
                {bgImage ? 'Change Image' : 'Upload Image'}
              </Button>
              <p className="text-xs text-slate-500 mt-1">6.14" × 2.61" recommended</p>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-slate-300 text-sm">Serial Start</Label>
                <Input
                  type="number"
                  min="1"
                  value={serialStart}
                  onChange={e => setSerialStart(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-slate-800 border-slate-600 text-white mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={resetCounter} variant="outline" size="icon" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={printSheet}
              disabled={isPrinting}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 mt-4"
            >
              <Printer className="w-4 h-4 mr-2" />
              {isPrinting ? 'Generating...' : 'Print Sheet (4 Bills)'}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="lg:col-span-3 bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="relative mx-auto rounded-lg overflow-hidden"
              style={{
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '6.14 / 2.61',
                background: bgImage 
                  ? `url(${bgImage}) center/cover` 
                  : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
              }}
            >
              {bgImage && <div className="absolute inset-0 bg-black/15" />}
              
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span 
                    className="px-3 py-1 rounded text-xs font-bold text-white uppercase tracking-wide"
                    style={{ backgroundColor: venueData?.color }}
                  >
                    {venueData?.name}
                  </span>
                  <span className="text-4xl font-black text-yellow-400 drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                    ${denomination}
                  </span>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="bg-black/70 border border-green-500/30 px-3 py-1.5 rounded">
                    <span className="font-mono text-sm text-green-400 tracking-wider font-bold">
                      {getSerial()}
                    </span>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-11 h-11 bg-gradient-to-br from-slate-200 to-slate-400 rounded opacity-60" />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[7px] text-white/20 uppercase tracking-widest">
                GlyphLock Secure Voucher
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Print Dimensions</p>
                <p className="text-white font-medium">6.14" × 2.61"</p>
                <p className="text-slate-500 text-xs">US Currency Size</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Bills Per Sheet</p>
                <p className="text-white font-medium">4 Vouchers</p>
                <p className="text-slate-500 text-xs">Letter size paper</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
              <p className="text-slate-400 text-xs mb-2">Next 4 Serials:</p>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map(i => (
                  <span key={i} className="font-mono text-xs bg-slate-700 text-green-400 px-2 py-1 rounded">
                    {getSerial(i)}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}