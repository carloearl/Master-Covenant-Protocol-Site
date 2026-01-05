import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

async function callOpenAI(systemPrompt, userPrompt, jsonSchema = null) {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  const body = {
    model: "gpt-4o-mini",
    messages,
    temperature: 0.7,
    max_tokens: 2000
  };

  if (jsonSchema) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (jsonSchema) {
    try {
      return JSON.parse(content);
    } catch {
      return { error: "Failed to parse AI response" };
    }
  }
  return content;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    switch (action) {
      // ═══════════════════════════════════════════════════════════════
      // VOUCHER AI - Analyze sales for optimal voucher recommendations
      // ═══════════════════════════════════════════════════════════════
      case 'analyzeVoucherStrategy': {
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 200);
        const products = await base44.asServiceRole.entities.POSProduct.list();
        
        // Analyze transaction patterns
        const avgTransaction = transactions.length > 0 
          ? transactions.reduce((sum, t) => sum + (t.total || 0), 0) / transactions.length 
          : 50;
        
        const hourlyDistribution = {};
        const dayDistribution = {};
        const categoryBreakdown = {};
        
        transactions.forEach(t => {
          const date = new Date(t.created_date);
          const hour = date.getHours();
          const day = date.toLocaleDateString('en-US', { weekday: 'long' });
          
          hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
          dayDistribution[day] = (dayDistribution[day] || 0) + (t.total || 0);
          
          (t.items || []).forEach(item => {
            const product = products.find(p => p.id === item.product_id);
            const cat = product?.category || 'Other';
            categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + (item.total || 0);
          });
        });

        const prompt = `Analyze this nightclub/entertainment venue sales data and recommend optimal voucher denominations and quantities for an upcoming promotion.

Sales Data:
- Average transaction: $${avgTransaction.toFixed(2)}
- Total transactions analyzed: ${transactions.length}
- Busiest hours: ${JSON.stringify(hourlyDistribution)}
- Revenue by day: ${JSON.stringify(dayDistribution)}
- Category breakdown: ${JSON.stringify(categoryBreakdown)}

Current venue: ${data.venue || 'Generic'}
Promotion goal: ${data.goal || 'Increase weekend traffic'}

Provide recommendations in JSON format with:
{
  "recommendedDenominations": [{"value": number, "quantity": number, "reasoning": string}],
  "optimalDistributionTime": string,
  "targetAudience": string,
  "expectedROI": string,
  "promotionStrategy": string,
  "warnings": [string]
}`;

        const result = await callOpenAI(
          "You are an expert in nightclub and entertainment venue promotions, specializing in voucher-based marketing strategies.",
          prompt,
          true
        );

        return Response.json({ success: true, analysis: result });
      }

      // ═══════════════════════════════════════════════════════════════
      // VOUCHER DESIGN AI - Optimize layout based on image
      // ═══════════════════════════════════════════════════════════════
      case 'optimizeVoucherDesign': {
        const { imageUrl, venue, denomination, theme } = data;
        
        const prompt = `Design an optimal voucher layout for a ${venue || 'nightclub'} with denomination $${denomination || 20}.

Theme/Style: ${theme || 'premium dark'}
Background image provided: ${imageUrl ? 'Yes' : 'No'}

Provide layout recommendations in JSON:
{
  "layout": {
    "denominationPosition": {"x": "left|center|right", "y": "top|center|bottom", "size": "small|medium|large"},
    "serialPosition": {"x": "left|center|right", "y": "top|center|bottom"},
    "venueTagPosition": {"x": "left|center|right", "y": "top|center|bottom"},
    "qrPosition": {"x": "left|center|right", "y": "top|center|bottom", "size": number}
  },
  "colorScheme": {
    "denominationColor": "hex",
    "serialColor": "hex",
    "venueBadgeColor": "hex",
    "venueBadgeBg": "hex",
    "overlayGradient": string
  },
  "typography": {
    "denominationFont": string,
    "serialFont": string
  },
  "effects": {
    "shadow": boolean,
    "glow": boolean,
    "glowColor": "hex"
  },
  "reasoning": string
}`;

        const result = await callOpenAI(
          "You are a professional graphic designer specializing in currency-style vouchers and promotional materials for nightclubs.",
          prompt,
          true
        );

        return Response.json({ success: true, design: result });
      }

      // ═══════════════════════════════════════════════════════════════
      // VOUCHER REDEMPTION ANALYSIS
      // ═══════════════════════════════════════════════════════════════
      case 'analyzeRedemptionPatterns': {
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 500);
        
        // Simulate redemption data from transactions with discounts
        const redemptions = transactions.filter(t => t.discount > 0);
        const totalRedemptions = redemptions.length;
        const avgRedemptionValue = redemptions.length > 0
          ? redemptions.reduce((sum, t) => sum + (t.discount || 0), 0) / redemptions.length
          : 0;
        
        const redemptionByHour = {};
        const redemptionByDay = {};
        
        redemptions.forEach(t => {
          const date = new Date(t.created_date);
          const hour = date.getHours();
          const day = date.toLocaleDateString('en-US', { weekday: 'long' });
          redemptionByHour[hour] = (redemptionByHour[hour] || 0) + 1;
          redemptionByDay[day] = (redemptionByDay[day] || 0) + 1;
        });

        const prompt = `Analyze voucher redemption patterns for this entertainment venue:

Redemption Data:
- Total redemptions: ${totalRedemptions}
- Average redemption value: $${avgRedemptionValue.toFixed(2)}
- Redemptions by hour: ${JSON.stringify(redemptionByHour)}
- Redemptions by day: ${JSON.stringify(redemptionByDay)}
- Total transactions: ${transactions.length}
- Redemption rate: ${((totalRedemptions / Math.max(transactions.length, 1)) * 100).toFixed(1)}%

Provide insights in JSON:
{
  "effectiveness": {"score": number, "rating": string},
  "peakRedemptionTimes": [string],
  "underperformingPeriods": [string],
  "recommendations": [string],
  "projectedImpact": string,
  "suggestedAdjustments": [{"change": string, "expectedResult": string}]
}`;

        const result = await callOpenAI(
          "You are a marketing analytics expert specializing in promotional campaign effectiveness for entertainment venues.",
          prompt,
          true
        );

        return Response.json({ success: true, insights: result });
      }

      // ═══════════════════════════════════════════════════════════════
      // POS AI - Real-time product recommendations
      // ═══════════════════════════════════════════════════════════════
      case 'getProductRecommendations': {
        const { currentCart, customerType } = data;
        const products = await base44.asServiceRole.entities.POSProduct.list();
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 100);
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        
        // Analyze what sells together
        const pairings = {};
        transactions.forEach(t => {
          const items = t.items || [];
          items.forEach((item, i) => {
            items.slice(i + 1).forEach(other => {
              const key = [item.product_name, other.product_name].sort().join('|');
              pairings[key] = (pairings[key] || 0) + 1;
            });
          });
        });

        const prompt = `Recommend products for a nightclub POS transaction.

Current cart: ${JSON.stringify(currentCart || [])}
Customer type: ${customerType || 'general'}
Current time: ${currentHour}:00 (${currentDay})
Available products: ${JSON.stringify(products.map(p => ({ name: p.name, price: p.price, category: p.category })))}
Popular pairings: ${JSON.stringify(Object.entries(pairings).sort((a, b) => b[1] - a[1]).slice(0, 10))}

Provide recommendations in JSON:
{
  "upsells": [{"product": string, "reason": string, "priority": number}],
  "crossSells": [{"product": string, "reason": string}],
  "timeBasedSuggestion": {"product": string, "reason": string},
  "vipUpgrade": {"available": boolean, "suggestion": string},
  "staffScript": string
}`;

        const result = await callOpenAI(
          "You are a sales optimization AI for nightclub POS systems, focused on increasing average transaction value through strategic recommendations.",
          prompt,
          true
        );

        return Response.json({ success: true, recommendations: result });
      }

      // ═══════════════════════════════════════════════════════════════
      // POS AI - Predict popular items
      // ═══════════════════════════════════════════════════════════════
      case 'predictPopularItems': {
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 300);
        const products = await base44.asServiceRole.entities.POSProduct.list();
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        
        // Analyze sales patterns by time
        const salesByHourAndProduct = {};
        const salesByDayAndProduct = {};
        
        transactions.forEach(t => {
          const date = new Date(t.created_date);
          const hour = date.getHours();
          const day = date.toLocaleDateString('en-US', { weekday: 'long' });
          
          (t.items || []).forEach(item => {
            const hourKey = `${hour}:${item.product_name}`;
            const dayKey = `${day}:${item.product_name}`;
            salesByHourAndProduct[hourKey] = (salesByHourAndProduct[hourKey] || 0) + item.quantity;
            salesByDayAndProduct[dayKey] = (salesByDayAndProduct[dayKey] || 0) + item.quantity;
          });
        });

        const prompt = `Predict what items will be popular at this nightclub right now.

Current time: ${currentHour}:00 on ${currentDay}
Sales patterns by hour and product: ${JSON.stringify(salesByHourAndProduct)}
Sales patterns by day and product: ${JSON.stringify(salesByDayAndProduct)}
Product catalog: ${JSON.stringify(products.map(p => ({ name: p.name, category: p.category, price: p.price })))}

Provide predictions in JSON:
{
  "hotItems": [{"product": string, "confidence": number, "reason": string}],
  "emergingTrends": [{"trend": string, "products": [string]}],
  "stockAlerts": [{"product": string, "expectedDemand": string}],
  "staffFocus": string,
  "promotionOpportunity": {"product": string, "suggestion": string}
}`;

        const result = await callOpenAI(
          "You are a predictive analytics AI for nightclub inventory and sales, using historical patterns to forecast demand.",
          prompt,
          true
        );

        return Response.json({ success: true, predictions: result });
      }

      // ═══════════════════════════════════════════════════════════════
      // POS AI - Fraud detection
      // ═══════════════════════════════════════════════════════════════
      case 'detectSuspiciousTransaction': {
        const { transaction } = data;
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 200);
        
        // Calculate baseline metrics
        const avgTotal = transactions.reduce((sum, t) => sum + (t.total || 0), 0) / Math.max(transactions.length, 1);
        const maxTotal = Math.max(...transactions.map(t => t.total || 0));
        const avgItems = transactions.reduce((sum, t) => sum + (t.items?.length || 0), 0) / Math.max(transactions.length, 1);
        
        // Analyze cashier patterns
        const cashierStats = {};
        transactions.forEach(t => {
          const cashier = t.cashier || 'unknown';
          if (!cashierStats[cashier]) {
            cashierStats[cashier] = { count: 0, total: 0, voids: 0, discounts: 0 };
          }
          cashierStats[cashier].count++;
          cashierStats[cashier].total += t.total || 0;
          if (t.status === 'refunded') cashierStats[cashier].voids++;
          cashierStats[cashier].discounts += t.discount || 0;
        });

        const prompt = `Analyze this transaction for potential fraud or irregularities:

Transaction under review:
${JSON.stringify(transaction)}

Baseline metrics:
- Average transaction: $${avgTotal.toFixed(2)}
- Maximum transaction: $${maxTotal.toFixed(2)}
- Average items per transaction: ${avgItems.toFixed(1)}
- Cashier statistics: ${JSON.stringify(cashierStats)}

Provide fraud analysis in JSON:
{
  "riskScore": number,
  "riskLevel": "low|medium|high|critical",
  "flags": [{"type": string, "description": string, "severity": number}],
  "recommendation": string,
  "requiresReview": boolean,
  "similarPatterns": [string]
}`;

        const result = await callOpenAI(
          "You are a fraud detection AI for POS systems, trained to identify unusual transaction patterns, employee theft indicators, and payment irregularities.",
          prompt,
          true
        );

        return Response.json({ success: true, fraudAnalysis: result });
      }

      // ═══════════════════════════════════════════════════════════════
      // VIP AI - Room upgrade suggestions
      // ═══════════════════════════════════════════════════════════════
      case 'suggestVIPUpgrade': {
        const { guestId, currentRoom } = data;
        const guests = await base44.asServiceRole.entities.VIPGuest.list();
        const rooms = await base44.asServiceRole.entities.VIPRoom.list();
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 200);
        
        const guest = guests.find(g => g.id === guestId);
        const availableRooms = rooms.filter(r => r.status === 'available');
        
        // Calculate guest spending history
        const guestTransactions = transactions.filter(t => 
          t.customer_id === guestId || t.notes?.includes(guest?.name)
        );
        const totalSpent = guestTransactions.reduce((sum, t) => sum + (t.total || 0), 0);
        const visitCount = guestTransactions.length;

        const prompt = `Suggest VIP room upgrades for this guest:

Guest profile:
- Name: ${guest?.name || 'Unknown'}
- Current room: ${currentRoom || 'None'}
- Total spent: $${totalSpent.toFixed(2)}
- Visit count: ${visitCount}
- Preferences: ${guest?.preferences || 'None recorded'}
- VIP tier: ${guest?.vip_tier || 'Standard'}

Available rooms: ${JSON.stringify(availableRooms.map(r => ({ name: r.room_name, rate: r.rate_per_hour, features: r.notes })))}

Provide upgrade suggestions in JSON:
{
  "shouldUpgrade": boolean,
  "suggestedRoom": string,
  "reasoning": string,
  "expectedRevenue": number,
  "upsellPitch": string,
  "complementaryOffers": [string],
  "personalizedTouches": [string]
}`;

        const result = await callOpenAI(
          "You are a VIP guest experience AI for high-end entertainment venues, focused on maximizing guest satisfaction and revenue through personalized service.",
          prompt,
          true
        );

        return Response.json({ success: true, upgradeAnalysis: result });
      }

      // ═══════════════════════════════════════════════════════════════
      // VIP AI - Guest preferences for personalized welcome
      // ═══════════════════════════════════════════════════════════════
      case 'getGuestInsights': {
        const { guestId } = data;
        const guests = await base44.asServiceRole.entities.VIPGuest.list();
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 500);
        const rooms = await base44.asServiceRole.entities.VIPRoom.list();
        
        const guest = guests.find(g => g.id === guestId);
        if (!guest) {
          return Response.json({ success: false, error: 'Guest not found' });
        }
        
        // Analyze guest history
        const guestTransactions = transactions.filter(t => 
          t.customer_id === guestId || t.notes?.toLowerCase().includes(guest.name?.toLowerCase())
        );
        
        const preferredItems = {};
        guestTransactions.forEach(t => {
          (t.items || []).forEach(item => {
            preferredItems[item.product_name] = (preferredItems[item.product_name] || 0) + item.quantity;
          });
        });

        const prompt = `Generate personalized insights for welcoming this VIP guest:

Guest: ${guest.name}
Phone: ${guest.phone || 'Not provided'}
Visit history: ${guestTransactions.length} visits
Total lifetime spend: $${guestTransactions.reduce((sum, t) => sum + (t.total || 0), 0).toFixed(2)}
Preferred items: ${JSON.stringify(Object.entries(preferredItems).sort((a, b) => b[1] - a[1]).slice(0, 5))}
Notes: ${guest.notes || 'None'}
Last visit: ${guestTransactions[0]?.created_date || 'Unknown'}

Provide personalized welcome insights in JSON:
{
  "welcomeScript": string,
  "preferredDrink": string,
  "preferredRoom": string,
  "specialConsiderations": [string],
  "conversationStarters": [string],
  "upsellOpportunities": [string],
  "loyaltyStatus": string,
  "recommendedEntertainer": string
}`;

        const result = await callOpenAI(
          "You are a VIP concierge AI that creates personalized guest experiences. Be warm, professional, and attentive to details.",
          prompt,
          true
        );

        return Response.json({ success: true, guestInsights: result });
      }

      // ═══════════════════════════════════════════════════════════════
      // VIP AI - Peak time prediction and staff scheduling
      // ═══════════════════════════════════════════════════════════════
      case 'predictPeakTimes': {
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 500);
        const shifts = await base44.asServiceRole.entities.EntertainerShift.list('-created_date', 200);
        const rooms = await base44.asServiceRole.entities.VIPRoom.list();
        
        // Analyze traffic patterns
        const hourlyTraffic = {};
        const dayTraffic = {};
        
        transactions.forEach(t => {
          const date = new Date(t.created_date);
          const hour = date.getHours();
          const day = date.toLocaleDateString('en-US', { weekday: 'long' });
          
          hourlyTraffic[hour] = (hourlyTraffic[hour] || 0) + 1;
          dayTraffic[day] = (dayTraffic[day] || 0) + 1;
        });
        
        // Analyze shift coverage
        const shiftCoverage = {};
        shifts.forEach(s => {
          const date = new Date(s.check_in_time);
          const hour = date.getHours();
          shiftCoverage[hour] = (shiftCoverage[hour] || 0) + 1;
        });

        const prompt = `Predict peak times and optimize staff scheduling for this VIP venue:

Traffic by hour: ${JSON.stringify(hourlyTraffic)}
Traffic by day: ${JSON.stringify(dayTraffic)}
Current shift coverage by hour: ${JSON.stringify(shiftCoverage)}
Total VIP rooms: ${rooms.length}
Average room utilization: ${((rooms.filter(r => r.status === 'occupied').length / Math.max(rooms.length, 1)) * 100).toFixed(0)}%

Provide scheduling insights in JSON:
{
  "peakHours": [{"hour": number, "expectedTraffic": string, "staffNeeded": number}],
  "slowPeriods": [{"hour": number, "suggestion": string}],
  "weekdayRecommendations": [{"day": string, "staffLevel": string, "focus": string}],
  "understaffedPeriods": [string],
  "overstaffedPeriods": [string],
  "optimalSchedule": [{"shift": string, "staff": number, "reasoning": string}],
  "revenueOptimization": string
}`;

        const result = await callOpenAI(
          "You are a workforce optimization AI for entertainment venues, balancing staff costs with guest experience quality.",
          prompt,
          true
        );

        return Response.json({ success: true, peakAnalysis: result });
      }

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('NUPS AI Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});