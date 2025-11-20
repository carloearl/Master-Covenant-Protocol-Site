import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";

export default function FinalizeModal({ open, onClose, result }) {
  if (!result) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-royal border-cyan-500/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-2xl">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            Image Finalized & Hashed
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-cyan-400 text-sm font-semibold mb-2">Verification Hash</p>
            <div className="flex items-center gap-2">
              <code className="text-white text-xs font-mono flex-1 break-all">
                {result.hash}
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(result.hash)}
                className="text-cyan-400 hover:bg-cyan-500/20 flex-shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm font-semibold mb-2">Image File Hash</p>
            <div className="flex items-center gap-2">
              <code className="text-white text-xs font-mono flex-1 break-all">
                {result.imageFileHash}
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(result.imageFileHash)}
                className="text-blue-400 hover:bg-blue-500/20 flex-shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-black/40 rounded-lg border border-cyan-500/30">
              <p className="text-white/60 text-xs mb-1">Log ID</p>
              <p className="text-white text-sm font-mono">{result.logId}</p>
            </div>
            <div className="p-3 bg-black/40 rounded-lg border border-cyan-500/30">
              <p className="text-white/60 text-xs mb-1">Timestamp</p>
              <p className="text-white text-sm">{new Date(result.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black font-bold"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View in Verify Tab
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-cyan-500/50 text-white hover:bg-cyan-500/20"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}