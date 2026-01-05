import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Sparkles, TrendingUp, AlertTriangle, Target, 
  Clock, Users, DollarSign, Loader2, RefreshCw, Zap,
  ShoppingCart, Gift, Shield
} from "lucide-react";
import { toast } from "sonner";

export function VoucherAIPanel({ venue, onApplyRecommendation }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeStrategy = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'analyzeVoucherStrategy',
        data: { venue, goal: 'Maximize weekend revenue' }
      });
      setAnalysis(data.analysis);
      toast.success('AI analysis complete');
    } catch (err) {
      toast.error('Analysis failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-base">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Voucher Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={analyzeStrategy} 
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          {loading ? 'Analyzing...' : 'Analyze Sales & Recommend'}
        </Button>

        {analysis && (
          <div className="space-y-4 mt-4">
            {/* Recommended Denominations */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Recommended Denominations</h4>
              <div className="space-y-2">
                {analysis.recommendedDenominations?.map((rec, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400">${rec.value}</Badge>
                      <span className="text-sm text-slate-300">×{rec.quantity}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-cyan-400"
                      onClick={() => onApplyRecommendation?.(rec.value, rec.quantity)}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy */}
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">Strategy</span>
              </div>
              <p className="text-sm text-slate-300">{analysis.promotionStrategy}</p>
            </div>

            {/* Expected ROI */}
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="text-sm text-slate-300">Expected ROI</span>
              <span className="text-green-400 font-bold">{analysis.expectedROI}</span>
            </div>

            {/* Warnings */}
            {analysis.warnings?.length > 0 && (
              <div className="space-y-1">
                {analysis.warnings.map((warn, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    {warn}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function POSRecommendationsPanel({ currentCart, onAddItem }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'getProductRecommendations',
        data: { currentCart }
      });
      setRecommendations(data.recommendations);
    } catch (err) {
      toast.error('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentCart?.length > 0) {
      getRecommendations();
    }
  }, [currentCart?.length]);

  if (!recommendations) return null;

  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-400" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Upsells */}
        {recommendations.upsells?.slice(0, 2).map((up, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
            <div>
              <span className="text-sm text-white">{up.product}</span>
              <p className="text-xs text-slate-400">{up.reason}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-green-400" onClick={() => onAddItem?.(up.product)}>
              +Add
            </Button>
          </div>
        ))}

        {/* Staff Script */}
        {recommendations.staffScript && (
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
            <p className="text-xs text-cyan-300 italic">"{recommendations.staffScript}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FraudAlertPanel({ transaction }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkTransaction = async () => {
    if (!transaction) return;
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'detectSuspiciousTransaction',
        data: { transaction }
      });
      setAnalysis(data.fraudAnalysis);
    } catch (err) {
      console.error('Fraud check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (transaction?.total > 500) {
      checkTransaction();
    }
  }, [transaction?.id]);

  if (!analysis || analysis.riskLevel === 'low') return null;

  const riskColors = {
    medium: 'border-yellow-500/50 bg-yellow-500/10',
    high: 'border-orange-500/50 bg-orange-500/10',
    critical: 'border-red-500/50 bg-red-500/10'
  };

  return (
    <Card className={`${riskColors[analysis.riskLevel]} border`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-red-400" />
          <span className="font-medium text-white">Fraud Alert</span>
          <Badge className={analysis.riskLevel === 'critical' ? 'bg-red-500' : 'bg-orange-500'}>
            {analysis.riskLevel.toUpperCase()}
          </Badge>
        </div>
        <div className="space-y-2">
          {analysis.flags?.map((flag, i) => (
            <p key={i} className="text-sm text-slate-300">• {flag.description}</p>
          ))}
        </div>
        <p className="text-sm text-white mt-3 font-medium">{analysis.recommendation}</p>
      </CardContent>
    </Card>
  );
}

export function VIPGuestInsightsPanel({ guestId, guestName }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadInsights = async () => {
    if (!guestId) return;
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'getGuestInsights',
        data: { guestId }
      });
      setInsights(data.guestInsights);
    } catch (err) {
      console.error('Failed to load guest insights:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-pink-500/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-pink-400" />
            Guest Insights: {guestName}
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={loadInsights} disabled={loading}>
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {insights ? (
          <div className="space-y-3">
            {/* Welcome Script */}
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Welcome Script</p>
              <p className="text-sm text-white italic">"{insights.welcomeScript}"</p>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-800/30 rounded">
                <p className="text-xs text-slate-400">Preferred Drink</p>
                <p className="text-sm text-cyan-400">{insights.preferredDrink}</p>
              </div>
              <div className="p-2 bg-slate-800/30 rounded">
                <p className="text-xs text-slate-400">Status</p>
                <p className="text-sm text-purple-400">{insights.loyaltyStatus}</p>
              </div>
            </div>

            {/* Conversation Starters */}
            <div>
              <p className="text-xs text-slate-400 mb-1">Talk About</p>
              <div className="flex flex-wrap gap-1">
                {insights.conversationStarters?.map((topic, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                ))}
              </div>
            </div>

            {/* Upsell */}
            {insights.upsellOpportunities?.[0] && (
              <div className="p-2 bg-green-500/10 border border-green-500/30 rounded">
                <p className="text-xs text-green-400">💡 {insights.upsellOpportunities[0]}</p>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={loadInsights} variant="outline" className="w-full border-pink-500/50 text-pink-400">
            <Brain className="w-4 h-4 mr-2" />
            Load AI Insights
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function PeakTimePredictor() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'predictPeakTimes',
        data: {}
      });
      setPredictions(data.peakAnalysis);
      toast.success('Peak time analysis loaded');
    } catch (err) {
      toast.error('Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-blue-400" />
          Peak Time Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {predictions ? (
          <div className="space-y-4">
            {/* Peak Hours */}
            <div>
              <p className="text-xs text-slate-400 mb-2">Tonight's Peak Hours</p>
              <div className="space-y-2">
                {predictions.peakHours?.slice(0, 3).map((peak, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-white">{peak.hour}:00</span>
                    <div className="flex items-center gap-2">
                      <Progress value={peak.staffNeeded * 20} className="w-20 h-2" />
                      <span className="text-xs text-cyan-400">{peak.staffNeeded} staff</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Understaffed Alert */}
            {predictions.understaffedPeriods?.length > 0 && (
              <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Understaffed: {predictions.understaffedPeriods.join(', ')}
                </p>
              </div>
            )}

            {/* Revenue Tip */}
            <div className="p-2 bg-green-500/10 border border-green-500/30 rounded">
              <p className="text-xs text-green-400">{predictions.revenueOptimization}</p>
            </div>
          </div>
        ) : (
          <Button onClick={loadPredictions} disabled={loading} variant="outline" className="w-full border-blue-500/50 text-blue-400">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
            Predict Peak Times
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function PopularItemsPredictor({ onHighlight }) {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'predictPopularItems',
        data: {}
      });
      setPredictions(data.predictions);
    } catch (err) {
      toast.error('Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPredictions();
  }, []);

  if (!predictions) return null;

  return (
    <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          Hot Right Now
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {predictions.hotItems?.slice(0, 4).map((item, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-2 bg-slate-800/50 rounded cursor-pointer hover:bg-slate-700/50"
              onClick={() => onHighlight?.(item.product)}
            >
              <div className="flex items-center gap-2">
                <span className={`text-lg ${i === 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {i === 0 ? '🔥' : i === 1 ? '⭐' : '•'}
                </span>
                <span className="text-sm text-white">{item.product}</span>
              </div>
              <Badge className="bg-slate-700 text-xs">{Math.round(item.confidence * 100)}%</Badge>
            </div>
          ))}
        </div>
        
        {predictions.promotionOpportunity && (
          <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded">
            <p className="text-xs text-purple-400">
              <Gift className="w-3 h-3 inline mr-1" />
              {predictions.promotionOpportunity.suggestion}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}