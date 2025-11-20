import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, ExternalLink, Copy, Upload } from "lucide-react";
import { useStudio } from "./state/StudioContext";
import { selectFinalizeResult } from "./state/selectors";

export default function VerifyTab() {
  const { state, dispatch } = useStudio();
  const finalizeResult = selectFinalizeResult(state);
  const [logId, setLogId] = useState('');
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    loadRecentLogs();
    if (finalizeResult.logId) {
      setLogId(finalizeResult.logId);
      handleVerify(finalizeResult.logId);
    }
  }, [finalizeResult.logId]);

  const loadRecentLogs = async () => {
    try {
      const logs = await base44.entities.ImageHashLog.list('-created_date', 10);
      setRecentLogs(logs);
    } catch (error) {
      console.error("Failed to load logs:", error);
    }
  };

  const handleVerify = async (id = logId) => {
    if (!id) return;

    try {
      dispatch({ type: "VERIFY_START", logId: id });

      const response = await base44.functions.invoke('getImageHashLog', { logId: id });

      if (response.data.success) {
        dispatch({ type: "VERIFY_SUCCESS", result: response.data.log });
      }
    } catch (error) {
      console.error("Verification error:", error);
      dispatch({ type: "VERIFY_ERROR", error: error.message });
      alert("Failed to verify log: " + error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="glass-royal border-cyan-500/30" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
        <CardHeader className="border-b border-purple-500/30" style={{background: 'transparent'}}>
          <CardTitle className="text-white text-xl">Verify by Log ID</CardTitle>
        </CardHeader>
        <CardContent className="pt-6" style={{background: 'transparent'}}>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="logId" className="text-white/80 text-sm">Log ID</Label>
              <Input
                id="logId"
                value={logId}
                onChange={(e) => setLogId(e.target.value)}
                placeholder="Enter log ID to verify"
                className="glass-card-dark border-purple-500/30 text-white mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => handleVerify()}
                disabled={state.verifyLoading || !logId}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black font-bold"
              >
                <Search className="w-4 h-4 mr-2" />
                {state.verifyLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {state.verifyResult && (
        <Card className="glass-royal border-cyan-500/50 shadow-xl shadow-cyan-500/20" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
          <CardHeader className="border-b border-cyan-500/30" style={{background: 'transparent'}}>
            <CardTitle className="text-white flex items-center gap-2 text-xl">
              <CheckCircle2 className="w-6 h-6 text-cyan-400" />
              Verification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4" style={{background: 'transparent'}}>
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <Label className="text-cyan-400 text-sm font-semibold">Verification Hash</Label>
              <div className="flex items-center gap-2 mt-2">
                <code className="text-white text-xs font-mono flex-1 break-all bg-black/40 p-3 rounded">
                  {state.verifyResult.hash}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(state.verifyResult.hash)}
                  className="text-cyan-400 hover:bg-cyan-500/20 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Label className="text-purple-400 text-sm font-semibold">Image File Hash</Label>
              <div className="flex items-center gap-2 mt-2">
                <code className="text-white text-xs font-mono flex-1 break-all bg-black/40 p-3 rounded">
                  {state.verifyResult.imageFileHash}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(state.verifyResult.imageFileHash)}
                  className="text-purple-400 hover:bg-purple-500/20 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/40 rounded-lg border border-purple-500/30">
                <Label className="text-white/60 text-xs">Created At</Label>
                <p className="text-white mt-1">{new Date(state.verifyResult.created_date).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-purple-500/30">
                <Label className="text-white/60 text-xs">Image ID</Label>
                <p className="text-white font-mono text-sm mt-1 truncate">{state.verifyResult.imageId}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-purple-500/30">
                <Label className="text-white/60 text-xs">Hotspots</Label>
                <p className="text-white mt-1">{state.verifyResult.hotspotsSnapshot.length} regions</p>
              </div>
            </div>

            {state.verifyResult.imageUrl && (
              <div>
                <Label className="text-white/80 text-sm">Verified Image</Label>
                <img
                  src={state.verifyResult.imageUrl}
                  alt={state.verifyResult.imageName}
                  className="w-full max-w-2xl rounded-lg border-2 border-cyan-500/30 mt-3 shadow-lg"
                />
              </div>
            )}

            {state.verifyResult.hotspotsSnapshot.length > 0 && (
              <div>
                <Label className="text-white/80 text-sm">Hotspots Snapshot</Label>
                <div className="space-y-2 mt-3">
                  {state.verifyResult.hotspotsSnapshot.map((hotspot, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-black/40 rounded-lg border border-purple-500/30"
                    >
                      <h4 className="font-semibold text-white">{hotspot.label}</h4>
                      {hotspot.description && (
                        <p className="text-sm text-white/70 mt-1">{hotspot.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                          {hotspot.actionType}
                        </span>
                        {(hotspot.actionType === 'link' || hotspot.actionType === 'redirect') && hotspot.actionValue && (
                          <a
                            href={hotspot.actionValue}
                            target={hotspot.actionType === 'link' ? '_blank' : '_self'}
                            rel={hotspot.actionType === 'link' ? 'noopener noreferrer' : undefined}
                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {hotspot.actionType === 'link' ? 'Open Link' : 'Navigate'}
                          </a>
                        )}
                        {hotspot.actionValue && hotspot.actionType !== 'none' && (
                          <code className="text-xs text-white/60 bg-black/40 px-2 py-1 rounded">
                            {hotspot.actionValue.length > 50 
                              ? hotspot.actionValue.substring(0, 50) + '...' 
                              : hotspot.actionValue}
                          </code>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="glass-royal border-purple-500/30" style={{background: 'rgba(30, 58, 138, 0.2)', backdropFilter: 'blur(16px)'}}>
        <CardHeader className="border-b border-purple-500/30" style={{background: 'transparent'}}>
          <CardTitle className="text-white text-xl">Recent Interactive Image Hashes</CardTitle>
        </CardHeader>
        <CardContent className="pt-6" style={{background: 'transparent'}}>
          {recentLogs.length === 0 ? (
            <p className="text-white/40 text-center py-8">No verification logs yet</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30 hover:border-cyan-500/50 transition-all cursor-pointer"
                  onClick={() => {
                    setLogId(log.id);
                    handleVerify(log.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <code className="text-cyan-400 text-sm">
                        {log.hash.substring(0, 16)}...
                      </code>
                      <p className="text-white/60 text-xs mt-1">
                        {new Date(log.created_date).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-cyan-400 hover:bg-cyan-500/20"
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}