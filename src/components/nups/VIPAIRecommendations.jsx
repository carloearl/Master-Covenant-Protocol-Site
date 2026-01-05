import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Gift, TrendingUp, Wine, DoorOpen, 
  Heart, Star, Loader2, MessageSquare, Clock,
  DollarSign, User, RefreshCw
} from "lucide-react";

export default function VIPAIRecommendations({ guest, todaySpend, lifetimeSpend, roomSessions, fullView = false }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRecommendations = async () => {
    if (!guest) return;
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'getVIPRecommendations',
        data: {
          guestId: guest.id,
          guestName: guest.guest_name,
          todaySpend,
          lifetimeSpend,
          vipTier: guest.vip_tier,
          roomSessionsToday: roomSessions?.length || 0,
          preferences: guest.preferences,
          notes: guest.notes
        }
      });
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (guest) {
      loadRecommendations();
    }
  }, [guest?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        <span className="ml-2 text-slate-400">Analyzing guest profile...</span>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="text-center py-8">
        <Button onClick={loadRecommendations} className="bg-purple-600 hover:bg-purple-500">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate AI Recommendations
        </Button>
      </div>
    );
  }

  if (!fullView) {
    // Compact view for sidebar
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">AI-Powered Actions</span>
          <Button size="sm" variant="ghost" onClick={loadRecommendations} className="h-6 px-2">
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>

        {/* Quick Actions */}
        {recommendations.immediateActions?.slice(0, 3).map((action, i) => (
          <div 
            key={i} 
            className={`p-3 rounded-lg border ${
              action.priority === 'high' 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-slate-800/50 border-slate-700'
            }`}
          >
            <div className="flex items-start gap-2">
              {action.type === 'drink' && <Wine className="w-4 h-4 text-amber-400 mt-0.5" />}
              {action.type === 'upgrade' && <DoorOpen className="w-4 h-4 text-pink-400 mt-0.5" />}
              {action.type === 'service' && <Star className="w-4 h-4 text-purple-400 mt-0.5" />}
              {action.type === 'gift' && <Gift className="w-4 h-4 text-green-400 mt-0.5" />}
              <div className="flex-1">
                <p className="text-sm text-white">{action.action}</p>
                <p className="text-xs text-slate-400 mt-1">{action.reason}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Welcome Script Preview */}
        {recommendations.welcomeScript && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-400 font-medium">Greeting Script</span>
            </div>
            <p className="text-sm text-slate-300 italic">"{recommendations.welcomeScript}"</p>
          </div>
        )}
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          AI-Powered Guest Recommendations
        </h3>
        <Button size="sm" variant="outline" onClick={loadRecommendations} className="border-purple-500/50">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Guest Profile Summary */}
      <Card className="bg-gradient-to-r from-amber-900/30 to-pink-900/30 border-amber-500/30">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-amber-400 mb-3">Guest Profile Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-400">Loyalty Level</div>
              <div className="text-lg font-bold text-amber-400">{recommendations.loyaltyLevel || guest?.vip_tier || 'Standard'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Engagement Score</div>
              <div className="text-lg font-bold text-green-400">{recommendations.engagementScore || 85}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Preferred Category</div>
              <div className="text-lg font-bold text-pink-400">{recommendations.preferredCategory || 'Premium'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Upsell Likelihood</div>
              <div className="text-lg font-bold text-purple-400">{recommendations.upsellLikelihood || 'High'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Script */}
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-400 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Personalized Welcome Script
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white italic text-lg">"{recommendations.welcomeScript}"</p>
          {recommendations.conversationStarters?.length > 0 && (
            <div className="mt-4">
              <div className="text-xs text-slate-400 mb-2">Conversation Starters:</div>
              <div className="flex flex-wrap gap-2">
                {recommendations.conversationStarters.map((starter, i) => (
                  <Badge key={i} className="bg-purple-500/20 text-purple-300">{starter}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Immediate Actions */}
      <Card className="bg-slate-800/50 border-amber-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-amber-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Immediate Staff Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.immediateActions?.map((action, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg border ${
                  action.priority === 'high' 
                    ? 'bg-amber-500/10 border-amber-500/30' 
                    : action.priority === 'medium'
                    ? 'bg-slate-700/50 border-slate-600'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    action.type === 'drink' ? 'bg-amber-500/20' :
                    action.type === 'upgrade' ? 'bg-pink-500/20' :
                    action.type === 'service' ? 'bg-purple-500/20' :
                    'bg-green-500/20'
                  }`}>
                    {action.type === 'drink' && <Wine className="w-4 h-4 text-amber-400" />}
                    {action.type === 'upgrade' && <DoorOpen className="w-4 h-4 text-pink-400" />}
                    {action.type === 'service' && <Star className="w-4 h-4 text-purple-400" />}
                    {action.type === 'gift' && <Gift className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">{action.action}</p>
                      <Badge className={
                        action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-600 text-slate-300'
                      }>
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{action.reason}</p>
                    {action.expectedRevenue && (
                      <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                        <DollarSign className="w-3 h-3" />
                        Expected: ${action.expectedRevenue}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upsell Opportunities */}
      <Card className="bg-slate-800/50 border-green-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Upsell Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {recommendations.upsellOpportunities?.map((opp, i) => (
              <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{opp.product}</span>
                  <span className="text-green-400 font-bold">${opp.price}</span>
                </div>
                <p className="text-xs text-slate-400">{opp.pitch}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${opp.confidence || 75}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{opp.confidence || 75}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special Considerations */}
      {recommendations.specialConsiderations?.length > 0 && (
        <Card className="bg-slate-800/50 border-pink-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-pink-400 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Special Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.specialConsiderations.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-pink-400">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}