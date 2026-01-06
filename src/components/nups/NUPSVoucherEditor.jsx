/**
 * NUPS 5-Voucher Visual Editor
 * Full-featured drag-drop editor with color mode, image fit, element toggles
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Upload, Palette, Move, Save, Printer, QrCode, Barcode, Type, Image, Hash, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const DB_NAME = 'NUPS_VoucherEditor';
const DB_VERSION = 1;

function openEditorDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('templates')) db.createObjectStore('templates', { keyPath: 'id' });
    };
  });
}

async function saveTemplate(template) {
  const db = await openEditorDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('templates', 'readwrite');
    tx.objectStore('templates').put(template);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadTemplate(id) {
  const db = await openEditorDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('templates', 'readonly');
    const request = tx.objectStore('templates').get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function generateBarcodeCanvas(text, width = 200, height = 50) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000000';
  const barWidth = width / (text.length * 11 + 35);
  let x = barWidth * 10;
  [2, 1, 1, 2, 3, 2].forEach((w, i) => {
    if (i % 2 === 0) ctx.fillRect(x, 5, w * barWidth, height - 10);
    x += w * barWidth;
  });
  for (let char of text) {
    const code = char.charCodeAt(0);
    for (let i = 0; i < 6; i++) {
      const w = ((code >> i) & 1) ? 2 : 1;
      if (i % 2 === 0) ctx.fillRect(x, 5, w * barWidth, height - 10);
      x += w * barWidth;
    }
  }
  [2, 3, 3, 1, 1, 1, 2].forEach((w, i) => {
    if (i % 2 === 0) ctx.fillRect(x, 5, w * barWidth, height - 10);
    x += w * barWidth;
  });
  return canvas;
}

function generateQRCanvas(text, size = 80) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#000000';
  const cellSize = size / 25;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        ctx.fillRect((size - 7 * cellSize) + i * cellSize, j * cellSize, cellSize, cellSize);
        ctx.fillRect(i * cellSize, (size - 7 * cellSize) + j * cellSize, cellSize, cellSize);
      }
    }
  }
  const hash = text.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  for (let i = 8; i < 17; i++) {
    for (let j = 8; j < 17; j++) {
      if ((hash + i * j) % 3 === 0) {
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
  return canvas;
}

const DEFAULT_ELEMENTS = {
  barcode: { enabled: true, x: 50, y: 80, width: 180, height: 50, format: 'CODE128' },
  serial: { enabled: true, x: 50, y: 150, fontSize: 14, fontFamily: 'monospace', fontWeight: 'bold', color: '#000000' },
  denomination: { enabled: true, x: 50, y: 40, fontSize: 28, fontFamily: 'Arial', fontWeight: 'bold', color: '#000000' },
  qrCode: { enabled: false, x: 250, y: 60, size: 70 },
  customImage: { enabled: false, x: 300, y: 20, width: 80, height: 80, imageData: null }
};

export default function NUPSVoucherEditor() {
  const canvasRef = useRef(null);
  const [templateImage, setTemplateImage] = useState(null);
  const [colorMode, setColorMode] = useState('color');
  const [imageFit, setImageFit] = useState('stretch');
  const [elements, setElements] = useState(DEFAULT_ELEMENTS);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [sampleSerial, setSampleSerial] = useState('DP-00001-A1B2');
  const [sampleDenom, setSampleDenom] = useState('$20');

  const CANVAS_WIDTH = 340;
  const CANVAS_HEIGHT = 220;

  useEffect(() => {
    loadSavedTemplate();
  }, []);

  useEffect(() => {
    renderPreview();
  }, [templateImage, colorMode, imageFit, elements, selectedElement, sampleSerial, sampleDenom]);

  const loadSavedTemplate = async () => {
    try {
      const saved = await loadTemplate('voucher5');
      if (saved) {
        setColorMode(saved.colorMode || 'color');
        setImageFit(saved.imageFit || 'stretch');
        setElements(saved.elements || DEFAULT_ELEMENTS);
        if (saved.templateImageData) {
          const img = new window.Image();
          img.onload = () => setTemplateImage(img);
          img.src = saved.templateImageData;
        }
      }
    } catch (err) {
      console.error('Failed to load template:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => setTemplateImage(img);
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCustomImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        setElements(prev => ({
          ...prev,
          customImage: { ...prev.customImage, imageData: event.target.result, image: img, enabled: true }
        }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const applyFilter = (fn) => {
      if (colorMode === 'monochrome') {
        ctx.save();
        ctx.filter = 'grayscale(100%)';
        fn();
        ctx.restore();
      } else {
        fn();
      }
    };

    if (templateImage) {
      applyFilter(() => {
        if (imageFit === 'stretch') {
          ctx.drawImage(templateImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else if (imageFit === 'fit') {
          const scale = Math.min(CANVAS_WIDTH / templateImage.width, CANVAS_HEIGHT / templateImage.height);
          const x = (CANVAS_WIDTH - templateImage.width * scale) / 2;
          const y = (CANVAS_HEIGHT - templateImage.height * scale) / 2;
          ctx.drawImage(templateImage, x, y, templateImage.width * scale, templateImage.height * scale);
        } else if (imageFit === 'fill') {
          const scale = Math.max(CANVAS_WIDTH / templateImage.width, CANVAS_HEIGHT / templateImage.height);
          const x = (CANVAS_WIDTH - templateImage.width * scale) / 2;
          const y = (CANVAS_HEIGHT - templateImage.height * scale) / 2;
          ctx.drawImage(templateImage, x, y, templateImage.width * scale, templateImage.height * scale);
        }
      });
    }

    if (elements.barcode.enabled) {
      const bc = generateBarcodeCanvas(sampleSerial, elements.barcode.width, elements.barcode.height);
      applyFilter(() => ctx.drawImage(bc, elements.barcode.x, elements.barcode.y));
      if (selectedElement === 'barcode') drawSelection(ctx, elements.barcode.x, elements.barcode.y, elements.barcode.width, elements.barcode.height);
    }

    if (elements.serial.enabled) {
      applyFilter(() => {
        ctx.fillStyle = colorMode === 'monochrome' ? '#000' : elements.serial.color;
        ctx.font = `${elements.serial.fontWeight} ${elements.serial.fontSize}px ${elements.serial.fontFamily}`;
        ctx.fillText(sampleSerial, elements.serial.x, elements.serial.y);
      });
      if (selectedElement === 'serial') {
        const m = ctx.measureText(sampleSerial);
        drawSelection(ctx, elements.serial.x - 2, elements.serial.y - elements.serial.fontSize, m.width + 4, elements.serial.fontSize + 4, false);
      }
    }

    if (elements.denomination.enabled) {
      applyFilter(() => {
        ctx.fillStyle = colorMode === 'monochrome' ? '#000' : elements.denomination.color;
        ctx.font = `${elements.denomination.fontWeight} ${elements.denomination.fontSize}px ${elements.denomination.fontFamily}`;
        ctx.fillText(sampleDenom, elements.denomination.x, elements.denomination.y);
      });
      if (selectedElement === 'denomination') {
        const m = ctx.measureText(sampleDenom);
        drawSelection(ctx, elements.denomination.x - 2, elements.denomination.y - elements.denomination.fontSize, m.width + 4, elements.denomination.fontSize + 4, false);
      }
    }

    if (elements.qrCode.enabled) {
      const qr = generateQRCanvas(sampleSerial, elements.qrCode.size);
      applyFilter(() => ctx.drawImage(qr, elements.qrCode.x, elements.qrCode.y));
      if (selectedElement === 'qrCode') drawSelection(ctx, elements.qrCode.x, elements.qrCode.y, elements.qrCode.size, elements.qrCode.size);
    }

    if (elements.customImage.enabled && elements.customImage.image) {
      applyFilter(() => ctx.drawImage(elements.customImage.image, elements.customImage.x, elements.customImage.y, elements.customImage.width, elements.customImage.height));
      if (selectedElement === 'customImage') drawSelection(ctx, elements.customImage.x, elements.customImage.y, elements.customImage.width, elements.customImage.height);
    }
  }, [templateImage, colorMode, imageFit, elements, selectedElement, sampleSerial, sampleDenom]);

  const drawSelection = (ctx, x, y, w, h, showHandle = true) => {
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    if (showHandle) {
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(x + w - 6, y + h - 6, 12, 12);
    }
  };

  const getElementAtPoint = (x, y) => {
    if (elements.customImage.enabled && elements.customImage.image && x >= elements.customImage.x && x <= elements.customImage.x + elements.customImage.width && y >= elements.customImage.y && y <= elements.customImage.y + elements.customImage.height) return 'customImage';
    if (elements.qrCode.enabled && x >= elements.qrCode.x && x <= elements.qrCode.x + elements.qrCode.size && y >= elements.qrCode.y && y <= elements.qrCode.y + elements.qrCode.size) return 'qrCode';
    if (elements.barcode.enabled && x >= elements.barcode.x && x <= elements.barcode.x + elements.barcode.width && y >= elements.barcode.y && y <= elements.barcode.y + elements.barcode.height) return 'barcode';
    if (elements.denomination.enabled && x >= elements.denomination.x - 5 && x <= elements.denomination.x + 100 && y >= elements.denomination.y - elements.denomination.fontSize && y <= elements.denomination.y + 5) return 'denomination';
    if (elements.serial.enabled && x >= elements.serial.x - 5 && x <= elements.serial.x + 200 && y >= elements.serial.y - elements.serial.fontSize && y <= elements.serial.y + 5) return 'serial';
    return null;
  };

  const isInResizeHandle = (x, y, el) => {
    if (!el) return false;
    const e = elements[el];
    if (!e) return false;
    const w = e.width || e.size || 100;
    const h = e.height || e.size || 20;
    return x >= e.x + w - 8 && x <= e.x + w + 8 && y >= e.y + h - 8 && y <= e.y + h + 8;
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (selectedElement && isInResizeHandle(x, y, selectedElement)) {
      setIsResizing(true);
      return;
    }
    const el = getElementAtPoint(x, y);
    setSelectedElement(el);
    if (el) {
      setIsDragging(true);
      setDragOffset({ x: x - elements[el].x, y: y - elements[el].y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;
    if (!selectedElement) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (isResizing) {
      setElements(prev => {
        const el = prev[selectedElement];
        if (el.size !== undefined) {
          return { ...prev, [selectedElement]: { ...el, size: Math.max(30, Math.min(x - el.x, y - el.y)) } };
        } else if (el.width !== undefined) {
          return { ...prev, [selectedElement]: { ...el, width: Math.max(30, x - el.x), height: Math.max(20, y - el.y) } };
        }
        return prev;
      });
    } else {
      setElements(prev => ({
        ...prev,
        [selectedElement]: { ...prev[selectedElement], x: Math.max(0, x - dragOffset.x), y: Math.max(10, y - dragOffset.y) }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleSave = async () => {
    const templateImageData = templateImage ? canvasRef.current.toDataURL() : null;
    await saveTemplate({
      id: 'voucher5',
      colorMode,
      imageFit,
      elements,
      templateImageData: templateImage?.src || null,
      savedAt: Date.now()
    });
    toast.success('Template saved');
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Voucher Print</title><style>@page{margin:0.25in}body{margin:0;display:flex;flex-wrap:wrap;gap:8px;justify-content:center}img{width:340px;height:220px;${colorMode === 'monochrome' ? 'filter:grayscale(100%);' : ''}}@media print{*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${Array(5).fill(`<img src="${dataUrl}"/>`).join('')}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const resetElements = () => {
    setElements(DEFAULT_ELEMENTS);
    setSelectedElement(null);
    toast.success('Elements reset');
  };

  const updateElement = (key, field, value) => {
    setElements(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Controls Panel */}
        <Card className="bg-slate-900/50 border-purple-500/30 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2"><Palette className="w-4 h-4 text-purple-400" />Editor Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {/* Upload */}
            <div>
              <Label className="text-slate-400 text-xs">Background Template</Label>
              <label className="flex items-center gap-2 mt-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded cursor-pointer text-white text-xs">
                <Upload className="w-3 h-3" />Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Color Mode */}
            <div>
              <Label className="text-slate-400 text-xs">Color Mode</Label>
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant={colorMode === 'color' ? 'default' : 'outline'} onClick={() => setColorMode('color')} className={colorMode === 'color' ? 'bg-cyan-600' : 'border-slate-600'}>🎨 Color</Button>
                <Button size="sm" variant={colorMode === 'monochrome' ? 'default' : 'outline'} onClick={() => setColorMode('monochrome')} className={colorMode === 'monochrome' ? 'bg-slate-600' : 'border-slate-600'}>⚫ Mono</Button>
              </div>
            </div>

            {/* Image Fit */}
            <div>
              <Label className="text-slate-400 text-xs">Image Fit</Label>
              <Select value={imageFit} onValueChange={setImageFit}>
                <SelectTrigger className="bg-slate-800 border-slate-600 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="stretch">Stretch</SelectItem>
                  <SelectItem value="fit">Fit</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Element Toggles */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Elements</Label>
              {[
                { key: 'barcode', icon: Barcode, label: 'Barcode' },
                { key: 'serial', icon: Hash, label: 'Serial' },
                { key: 'denomination', icon: Type, label: 'Denomination' },
                { key: 'qrCode', icon: QrCode, label: 'QR Code' },
                { key: 'customImage', icon: Image, label: 'Custom Image' }
              ].map(({ key, icon: Icon, label }) => (
                <div key={key} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3 h-3 text-slate-400" />
                    <span className="text-white text-xs">{label}</span>
                  </div>
                  <Switch checked={elements[key].enabled} onCheckedChange={(c) => updateElement(key, 'enabled', c)} />
                </div>
              ))}
            </div>

            {/* Custom Image Upload */}
            {elements.customImage.enabled && (
              <div>
                <Label className="text-slate-400 text-xs">Custom Overlay</Label>
                <label className="flex items-center gap-2 mt-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded cursor-pointer text-white text-xs">
                  <Image className="w-3 h-3" />Upload
                  <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
                </label>
              </div>
            )}

            {/* Selected Element Controls */}
            {selectedElement && (
              <div className="p-3 bg-slate-800 rounded space-y-2">
                <Label className="text-cyan-400 text-xs font-bold">Selected: {selectedElement}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-slate-500 text-[10px]">X</Label>
                    <Input type="number" value={elements[selectedElement].x} onChange={(e) => updateElement(selectedElement, 'x', Number(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-600" />
                  </div>
                  <div>
                    <Label className="text-slate-500 text-[10px]">Y</Label>
                    <Input type="number" value={elements[selectedElement].y} onChange={(e) => updateElement(selectedElement, 'y', Number(e.target.value))} className="h-7 text-xs bg-slate-900 border-slate-600" />
                  </div>
                </div>
                {elements[selectedElement].fontSize !== undefined && (
                  <div>
                    <Label className="text-slate-500 text-[10px]">Font Size: {elements[selectedElement].fontSize}px</Label>
                    <Slider value={[elements[selectedElement].fontSize]} onValueChange={([v]) => updateElement(selectedElement, 'fontSize', v)} min={8} max={48} className="mt-1" />
                  </div>
                )}
                {colorMode === 'color' && elements[selectedElement].color !== undefined && (
                  <div>
                    <Label className="text-slate-500 text-[10px]">Color</Label>
                    <input type="color" value={elements[selectedElement].color} onChange={(e) => updateElement(selectedElement, 'color', e.target.value)} className="w-full h-7 rounded cursor-pointer" />
                  </div>
                )}
              </div>
            )}

            {/* Sample Data */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs">Sample Data</Label>
              <Input value={sampleSerial} onChange={(e) => setSampleSerial(e.target.value)} placeholder="Serial" className="h-7 text-xs bg-slate-800 border-slate-600" />
              <Input value={sampleDenom} onChange={(e) => setSampleDenom(e.target.value)} placeholder="Denomination" className="h-7 text-xs bg-slate-800 border-slate-600" />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" onClick={resetElements} variant="outline" className="border-slate-600 flex-1"><RotateCcw className="w-3 h-3 mr-1" />Reset</Button>
              <Button size="sm" onClick={handleSave} className="bg-green-600 flex-1"><Save className="w-3 h-3 mr-1" />Save</Button>
            </div>
            <Button size="sm" onClick={handlePrint} className="w-full bg-cyan-600"><Printer className="w-3 h-3 mr-1" />Print 5 Vouchers</Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="bg-slate-900/50 border-cyan-500/30 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" />Live Preview</CardTitle>
              <Badge className={colorMode === 'color' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-500/20 text-slate-400'}>{colorMode === 'color' ? '🎨 Color' : '⚫ Mono'}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Single Voucher Editor */}
            <div className="bg-slate-800 rounded-lg p-4 flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="border-2 border-slate-600 rounded cursor-crosshair bg-white"
                style={{ maxWidth: '100%' }}
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              {selectedElement ? `Selected: ${selectedElement} — Drag to move, corner to resize` : 'Click an element to select'}
            </p>

            {/* 5-Voucher Stacked Print Preview */}
            <div className="border-t border-slate-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-semibold flex items-center gap-2">
                  <Printer className="w-4 h-4 text-green-400" />
                  Print Preview (5-Voucher Sheet)
                </h3>
                <Badge className="bg-green-500/20 text-green-400">1×5 Layout</Badge>
              </div>
              <div 
                className="bg-white rounded-lg p-3 mx-auto overflow-auto"
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '450px'
                }}
              >
                <div 
                  className="flex flex-col gap-2 items-center"
                  style={{ minWidth: '340px' }}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div 
                      key={num} 
                      className="relative border border-gray-300 rounded overflow-hidden bg-white flex-shrink-0"
                      style={{ 
                        width: `${CANVAS_WIDTH}px`,
                        height: `${CANVAS_HEIGHT}px`,
                        filter: colorMode === 'monochrome' ? 'grayscale(100%)' : 'none'
                      }}
                    >
                      {canvasRef.current && (
                        <img 
                          src={canvasRef.current.toDataURL('image/png')} 
                          alt={`Voucher ${num}`}
                          className="w-full h-full object-contain"
                        />
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded">
                        #{num}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                This is how your 5 vouchers will appear stacked on a printed page
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}