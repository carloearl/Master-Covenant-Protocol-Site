/**
 * NUPS VOUCHER MODE & PRINT PAGE
 * Toggle: 5 vouchers / 4 bills / none
 * Print layouts for each mode
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Printer, Settings, Receipt, DollarSign, History, Scan, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';
import OnlineStatusIndicator from '@/components/nups/OnlineStatusIndicator';
import { ProtectedSection, useAccessControl } from '@/components/nups/ProtectedField';
import InstallPrompt from '@/components/nups/InstallPrompt';

const DENOMINATIONS = [5, 10, 20, 50, 100];
const VENUES = [
  { id: 'MAIN', name: 'Main Floor', color: '#3B82F6' },
  { id: 'VIP', name: 'VIP Lounge', color: '#8B5CF6' },
  { id: 'EXEC', name: 'Executive Suite', color: '#F59E0B' }
];

// CRC-32 for serial validation
function crc32(str) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

function generateSerial(venue, seq, year) {
  const base = `${venue}-${year}-${String(seq).padStart(6, '0')}`;
  return `${base}-${crc32(base).substring(0, 4)}`;
}

// IndexedDB for voucher storage
const DB_NAME = 'NUPS_Vouchers';
const DB_VERSION = 1;

function openVoucherDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('batches')) {
        db.createObjectStore('batches', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('vouchers')) {
        db.createObjectStore('vouchers', { keyPath: 'serialNumber' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
  });
}

async function saveBatch(batch) {
  const db = await openVoucherDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('batches', 'readwrite');
    tx.objectStore('batches').add(batch);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function saveVoucher(voucher) {
  const db = await openVoucherDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('vouchers', 'readwrite');
    tx.objectStore('vouchers').put(voucher);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllBatches() {
  const db = await openVoucherDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('batches', 'readonly');
    const request = tx.objectStore('batches').getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function getVoucher(serial) {
  const db = await openVoucherDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('vouchers', 'readonly');
    const request = tx.objectStore('vouchers').get(serial);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getSetting(key, defaultVal) {
  const db = await openVoucherDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readonly');
    const request = tx.objectStore('settings').get(key);
    request.onsuccess = () => resolve(request.result?.value ?? defaultVal);
    request.onerror = () => reject(request.error);
  });
}

async function setSetting(key, value) {
  const db = await openVoucherDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readwrite');
    tx.objectStore('settings').put({ key, value });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export default function NUPSVoucherPrint() {
  const [mode, setMode] = useState('5-voucher');
  const [venue, setVenue] = useState('MAIN');
  const [denomination, setDenomination] = useState(20);
  const [serialStart, setSerialStart] = useState(1);
  const [batches, setBatches] = useState([]);
  const [scanInput, setScanInput] = useState('');
  const [tab, setTab] = useState('print');
  const { isManager, canExport } = useAccessControl();

  useEffect(() => {
    loadSettings();
    loadBatches();
  }, []);

  const loadSettings = async () => {
    try {
      setMode(await getSetting('voucherMode', '5-voucher'));
      setVenue(await getSetting('voucherVenue', 'MAIN'));
      setDenomination(await getSetting('voucherDenom', 20));
      setSerialStart(await getSetting('serialStart', 1));
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const loadBatches = async () => {
    try {
      const b = await getAllBatches();
      setBatches(b.sort((a, b) => b.printedAt - a.printedAt));
    } catch (err) {
      console.error('Failed to load batches:', err);
    }
  };

  const saveSettings = async () => {
    await setSetting('voucherMode', mode);
    await setSetting('voucherVenue', venue);
    await setSetting('voucherDenom', denomination);
    await setSetting('serialStart', serialStart);
    toast.success('Settings saved');
  };

  const printBatch = async () => {
    if (mode === 'none') {
      toast.error('Voucher printing is disabled');
      return;
    }

    const count = mode === '5-voucher' ? 5 : 4;
    const year = String(new Date().getFullYear()).slice(-2);
    const batchId = crypto.randomUUID();
    const serials = [];

    for (let i = 0; i < count; i++) {
      const serial = generateSerial(venue, serialStart + i, year);
      serials.push(serial);

      await saveVoucher({
        serialNumber: serial,
        batchId,
        denomination,
        venue,
        printedAt: Date.now(),
        redeemedAt: null,
        status: 'active'
      });
    }

    const batch = {
      id: batchId,
      printedAt: Date.now(),
      mode,
      venue,
      denomination,
      quantity: count,
      serials
    };

    await saveBatch(batch);

    // Update serial start
    const newStart = serialStart + count;
    setSerialStart(newStart);
    await setSetting('serialStart', newStart);

    // Open print window
    openPrintWindow(serials, denomination, venue, mode);

    toast.success(`Printed ${count} vouchers`);
    loadBatches();
  };

  const openPrintWindow = (serials, denom, venueId, printMode) => {
    const venueInfo = VENUES.find(v => v.id === venueId);
    const isBill = printMode === '4-bill';

    const voucherHTML = serials.map(serial => `
      <div class="voucher ${isBill ? 'bill' : ''}">
        <div class="header" style="background: ${venueInfo?.color || '#3B82F6'}">
          <span class="venue">${venueInfo?.name || 'VENUE'}</span>
          <span class="amount">$${denom}</span>
        </div>
        <div class="body">
          <div class="serial">${serial}</div>
          <div class="barcode">||||||||||||||||||||||||</div>
          <div class="terms">Valid for entertainment services only. Non-transferable. No cash value.</div>
        </div>
        <div class="footer">
          <span>Printed: ${new Date().toLocaleDateString()}</span>
          <span class="void">VOID IF ALTERED</span>
        </div>
      </div>
    `).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Voucher Print</title>
        <style>
          @page { margin: 0.25in; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 10px; background: #fff; }
          .container {
            display: grid;
            grid-template-columns: ${isBill ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)'};
            gap: 8px;
          }
          .voucher {
            border: 2px solid #000;
            border-radius: 8px;
            overflow: hidden;
            page-break-inside: avoid;
            ${isBill ? 'min-height: 220px;' : 'min-height: 160px;'}
          }
          .bill { border-width: 3px; }
          .header {
            color: white;
            padding: ${isBill ? '12px' : '8px'};
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
          }
          .venue { font-size: ${isBill ? '16pt' : '10pt'}; }
          .amount { font-size: ${isBill ? '28pt' : '18pt'}; }
          .body {
            padding: ${isBill ? '16px' : '10px'};
            text-align: center;
          }
          .serial {
            font-family: monospace;
            font-size: ${isBill ? '11pt' : '8pt'};
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          .barcode {
            font-size: ${isBill ? '40pt' : '28pt'};
            letter-spacing: -3px;
            font-family: monospace;
          }
          .terms {
            font-size: ${isBill ? '7pt' : '6pt'};
            color: #666;
            margin-top: 8px;
          }
          .footer {
            background: #f0f0f0;
            padding: 4px 8px;
            font-size: ${isBill ? '8pt' : '6pt'};
            display: flex;
            justify-content: space-between;
            border-top: 1px dashed #ccc;
          }
          .void { color: red; font-weight: bold; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="container">${voucherHTML}</div>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleRedeem = async () => {
    if (!scanInput.trim()) {
      toast.error('Enter voucher serial');
      return;
    }

    const serial = scanInput.trim().toUpperCase();
    const voucher = await getVoucher(serial);

    if (!voucher) {
      toast.error('Voucher not found');
      return;
    }

    if (voucher.status === 'redeemed') {
      toast.error(`Already redeemed on ${new Date(voucher.redeemedAt).toLocaleString()}`);
      return;
    }

    await saveVoucher({
      ...voucher,
      status: 'redeemed',
      redeemedAt: Date.now()
    });

    toast.success(`Redeemed! Value: $${voucher.denomination}`);
    setScanInput('');
  };

  const previewSerial = generateSerial(venue, serialStart, String(new Date().getFullYear()).slice(-2));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <InstallPrompt variant="banner" />
      
      <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-amber-400" />
            Voucher System
          </h1>
          <p className="text-slate-400 text-sm">Configure, print, and redeem vouchers</p>
        </div>
        <OnlineStatusIndicator />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {['print', 'settings', 'redeem', 'history'].map(t => (
          <Button
            key={t}
            variant={tab === t ? 'default' : 'outline'}
            onClick={() => setTab(t)}
            className={tab === t ? 'bg-amber-600' : 'border-slate-600'}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>

      {/* Print Tab - Manager/Admin Only */}
      {tab === 'print' && (
        <ProtectedSection requireRole="manager" fallbackMessage="Voucher printing requires Manager access">
        <Card className="bg-slate-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-green-400" />
              Print Vouchers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Denomination</p>
                <p className="text-2xl font-bold text-white">${denomination}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Receipt className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Mode</p>
                <p className="text-xl font-bold text-white">
                  {mode === '5-voucher' ? '5 per sheet' : mode === '4-bill' ? '4 per sheet' : 'Disabled'}
                </p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Settings className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Next Serial</p>
                <p className="text-xs font-mono text-white truncate">{previewSerial}</p>
              </div>
            </div>

            {mode !== 'none' ? (
              <Button
                onClick={printBatch}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-cyan-600 text-lg"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print {mode === '5-voucher' ? '5' : '4'} × ${denomination} Vouchers
              </Button>
            ) : (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                <p className="text-amber-400">Voucher printing disabled - enable in Settings</p>
              </div>
            )}
          </CardContent>
        </Card>
        </ProtectedSection>
      )}

      {/* Settings Tab - Manager/Admin Only */}
      {tab === 'settings' && (
        <ProtectedSection requireRole="manager" fallbackMessage="Settings require Manager access">
          <Card className="bg-slate-900/50 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-white mb-3 block">Voucher Mode</Label>
              <RadioGroup value={mode} onValueChange={setMode} className="space-y-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="5-voucher" id="m5" />
                  <Label htmlFor="m5" className="text-slate-300">5 Vouchers per sheet (standard)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="4-bill" id="m4" />
                  <Label htmlFor="m4" className="text-slate-300">4 Bills per sheet (large format)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="none" id="m0" />
                  <Label htmlFor="m0" className="text-slate-300">Disabled</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-white mb-2 block">Venue</Label>
              <Select value={venue} onValueChange={setVenue}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {VENUES.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: v.color }} />
                        {v.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Denomination</Label>
              <Select value={String(denomination)} onValueChange={v => setDenomination(Number(v))}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {DENOMINATIONS.map(d => (
                    <SelectItem key={d} value={String(d)}>${d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Next Serial Number</Label>
              <Input
                type="number"
                value={serialStart}
                onChange={e => setSerialStart(Number(e.target.value))}
                className="bg-slate-800 border-slate-600"
              />
            </div>

            <Button onClick={saveSettings} className="bg-amber-600 hover:bg-amber-700">
              Save Settings
            </Button>
          </CardContent>
          </Card>
        </ProtectedSection>
      )}

      {/* Redeem Tab - All Staff */}
      {tab === 'redeem' && (
        <Card className="bg-slate-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Scan className="w-5 h-5 text-purple-400" />
              Redeem Voucher
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Scan or Enter Serial</Label>
              <div className="flex gap-2">
                <Input
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value.toUpperCase())}
                  placeholder="MAIN-25-000001-XXXX"
                  className="bg-slate-800 border-slate-600 font-mono"
                  onKeyDown={e => e.key === 'Enter' && handleRedeem()}
                />
                <Button onClick={handleRedeem} className="bg-purple-600">
                  Redeem
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Print History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {batches.map(b => (
                <div key={b.id} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Batch {b.id.slice(0, 8)}</span>
                    <Badge className="bg-amber-500/20 text-amber-400">
                      ${b.denomination} × {b.quantity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{new Date(b.printedAt).toLocaleString()}</p>
                  <p className="text-xs text-slate-400 font-mono mt-2">{b.serials.join(', ')}</p>
                </div>
              ))}
              {batches.length === 0 && (
                <p className="text-slate-500 text-center py-8">No batches printed</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}