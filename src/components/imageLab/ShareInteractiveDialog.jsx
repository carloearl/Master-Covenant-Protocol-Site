import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { 
  Copy, Check, Share2, Link2, Eye, EyeOff, MousePointer, 
  Fingerprint, ExternalLink, Code, QrCode 
} from 'lucide-react';

const BUTTON_STYLES = [
  {
    id: 'visible-button',
    name: 'Visible Button',
    description: 'Clear CTA buttons on each hotspot',
    icon: MousePointer,
    preview: 'bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg'
  },
  {
    id: 'glow-outline',
    name: 'Glow Outline',
    description: 'Subtle glowing borders around zones',
    icon: Eye,
    preview: 'border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
  },
  {
    id: 'invisible-stego',
    name: 'Invisible (Steganographic)',
    description: 'Hidden clickable zones - no visual indicator',
    icon: EyeOff,
    preview: 'opacity-0 hover:opacity-10 bg-white'
  },
  {
    id: 'hover-reveal',
    name: 'Hover Reveal',
    description: 'Hidden until mouse hovers over zone',
    icon: Fingerprint,
    preview: 'opacity-0 hover:opacity-100 hover:bg-cyan-500/30 hover:border-cyan-400 hover:border-2'
  }
];

export default function ShareInteractiveDialog({ 
  open, 
  onOpenChange, 
  imageAsset, 
  hotspots 
}) {
  const [buttonStyle, setButtonStyle] = useState('visible-button');
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  if (!imageAsset) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://glyphlock.io';
  const shareUrl = `${baseUrl}/view-interactive/${imageAsset.id}?style=${buttonStyle}`;
  
  const embedCode = `<iframe 
  src="${shareUrl}&embed=true" 
  width="100%" 
  height="600" 
  frameborder="0" 
  allow="fullscreen"
  style="border-radius: 12px; box-shadow: 0 0 30px rgba(6,182,212,0.3);"
></iframe>`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Share link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    toast.success('Embed code copied!');
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const handleOpenPreview = () => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-950 border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            Share Interactive Image
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose how hotspots appear when others view your image
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Button Style Selection */}
          <div>
            <Label className="text-sm font-semibold text-gray-300 mb-3 block">
              Hotspot Display Style
            </Label>
            <RadioGroup value={buttonStyle} onValueChange={setButtonStyle} className="space-y-3">
              {BUTTON_STYLES.map((style) => {
                const Icon = style.icon;
                return (
                  <label
                    key={style.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      buttonStyle === style.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                    }`}
                  >
                    <RadioGroupItem value={style.id} className="sr-only" />
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      buttonStyle === style.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{style.name}</p>
                      <p className="text-sm text-gray-400">{style.description}</p>
                    </div>
                    {/* Mini preview */}
                    <div className="w-16 h-10 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                      <div className={`w-8 h-6 rounded ${style.preview}`} />
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          {/* Share Link */}
          <div>
            <Label className="text-sm font-semibold text-gray-300 mb-2 block">
              <Link2 className="w-4 h-4 inline mr-2" />
              Share Link
            </Label>
            <div className="flex gap-2">
              <Input 
                value={shareUrl} 
                readOnly 
                className="bg-slate-900 border-slate-700 text-gray-300 font-mono text-sm"
              />
              <Button 
                onClick={handleCopyLink}
                className={`${copied ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-700'} text-white min-w-[100px]`}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <Label className="text-sm font-semibold text-gray-300 mb-2 block">
              <Code className="w-4 h-4 inline mr-2" />
              Embed Code
            </Label>
            <div className="relative">
              <pre className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-gray-400 font-mono overflow-x-auto max-h-24">
                {embedCode}
              </pre>
              <Button 
                onClick={handleCopyEmbed}
                size="sm"
                className={`absolute top-2 right-2 ${embedCopied ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'}`}
              >
                {embedCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{hotspots?.length || 0}</p>
              <p className="text-xs text-gray-500">Hotspots</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                {hotspots?.filter(h => h.actionValue).length || 0}
              </p>
              <p className="text-xs text-gray-500">With Actions</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-green-400">
                {imageAsset.status === 'active' ? '🔒 Secured' : '📝 Draft'}
              </p>
              <p className="text-xs text-gray-500">Status</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={handleOpenPreview}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview Live
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-600 text-gray-300 hover:bg-slate-800"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}