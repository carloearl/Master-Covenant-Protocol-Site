import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIInsightsPanel({ qrType, qrData, design }) {
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState(null);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const { data } = await base44.functions.invoke('analyzeQrInsights', {
                qrType,
                qrData,
                design
            });
            setInsights(data);
        } catch (error) {
            console.error("Failed to analyze QR:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!insights && !loading) {
        return (
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">AI-Driven Insights</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        Optimize your QR code for better scan rates and enhanced security using our AI engine.
                    </p>
                    <Button 
                        onClick={handleAnalyze}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze Configuration
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
            <CardHeader className="border-b border-slate-800/50 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        AI Analysis Results
                    </CardTitle>
                    {loading ? (
                        <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analyzing...
                        </Badge>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Score:</span>
                            <Badge className={`
                                ${insights?.overallScore >= 80 ? 'bg-green-500/20 text-green-400' : 
                                  insights?.overallScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 
                                  'bg-red-500/20 text-red-400'}
                            `}>
                                {insights?.overallScore}/100
                            </Badge>
                            <Button variant="ghost" size="icon" onClick={handleAnalyze} className="h-6 w-6 ml-2">
                                <Sparkles className="w-3 h-3 text-slate-400" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 flex flex-col items-center justify-center space-y-4"
                    >
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="text-sm text-slate-400 animate-pulse">Analyzing payload and design...</p>
                    </motion.div>
                ) : insights && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-0"
                    >
                        <div className="divide-y divide-slate-800/50">
                            {/* Payload Optimization */}
                            {insights.payloadOptimization?.length > 0 && (
                                <div className="p-4">
                                    <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
                                        <Zap className="w-4 h-4" /> Payload Optimization
                                    </h4>
                                    <ul className="space-y-3">
                                        {insights.payloadOptimization.map((item, i) => (
                                            <li key={i} className="text-sm">
                                                <p className="text-white font-medium text-xs mb-0.5">{item.title}</p>
                                                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Scan Rate Improvement */}
                            {insights.scanRateImprovement?.length > 0 && (
                                <div className="p-4">
                                    <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" /> Scan Rate Potential
                                    </h4>
                                    <ul className="space-y-3">
                                        {insights.scanRateImprovement.map((item, i) => (
                                            <li key={i} className="text-sm">
                                                <p className="text-white font-medium text-xs mb-0.5">{item.title}</p>
                                                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Security Enhancements */}
                            {insights.securityEnhancements?.length > 0 && (
                                <div className="p-4">
                                    <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Security Analysis
                                    </h4>
                                    <ul className="space-y-3">
                                        {insights.securityEnhancements.map((item, i) => (
                                            <li key={i} className="text-sm">
                                                <p className="text-white font-medium text-xs mb-0.5">{item.title}</p>
                                                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}