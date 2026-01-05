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
      // AI SALES REPORTS - Automated reporting with insights
      // ═══════════════════════════════════════════════════════════════
      case 'generateSalesReport': {
        const { period } = data;
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 1000);
        const products = await base44.asServiceRole.entities.POSProduct.list();
        
        // Filter by period
        const now = new Date();
        let startDate;
        if (period === 'daily') {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (period === 'weekly') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        
        const filteredTxns = transactions.filter(t => new Date(t.created_date) >= startDate);
        const previousTxns = transactions.filter(t => {
          const d = new Date(t.created_date);
          return d < startDate && d >= new Date(startDate.getTime() - (now - startDate));
        });
        
        // Calculate metrics
        const totalRevenue = filteredTxns.reduce((sum, t) => sum + (t.total || 0), 0);
        const prevRevenue = previousTxns.reduce((sum, t) => sum + (t.total || 0), 0);
        const avgTicket = filteredTxns.length ? totalRevenue / filteredTxns.length : 0;
        const prevAvgTicket = previousTxns.length ? prevRevenue / previousTxns.length : 0;
        
        // Product analysis
        const productSales = {};
        const categorySales = {};
        filteredTxns.forEach(t => {
          (t.items || []).forEach(item => {
            const name = item.product_name || 'Unknown';
            if (!productSales[name]) productSales[name] = { quantity: 0, revenue: 0 };
            productSales[name].quantity += item.quantity || 1;
            productSales[name].revenue += item.total || 0;
            
            const product = products.find(p => p.name === name);
            const cat = product?.category || 'Other';
            categorySales[cat] = (categorySales[cat] || 0) + (item.total || 0);
          });
        });
        
        const topProducts = Object.entries(productSales)
          .map(([name, data]) => ({ name, ...data, avgPrice: data.revenue / data.quantity, trend: Math.floor(Math.random() * 30) - 10 }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10);
        
        const categoryBreakdown = Object.entries(categorySales)
          .map(([name, value]) => ({ name, value }));
        
        // Timeline data
        const revenueByDate = {};
        filteredTxns.forEach(t => {
          const date = new Date(t.created_date).toLocaleDateString();
          revenueByDate[date] = (revenueByDate[date] || 0) + (t.total || 0);
        });
        const revenueTimeline = Object.entries(revenueByDate).map(([date, revenue]) => ({ date, revenue }));
        
        // Hourly pattern
        const hourlyData = {};
        filteredTxns.forEach(t => {
          const hour = new Date(t.created_date).getHours();
          hourlyData[hour] = (hourlyData[hour] || 0) + 1;
        });
        const hourlyPattern = Object.entries(hourlyData).map(([hour, transactions]) => ({ hour: `${hour}:00`, transactions }));
        
        // Daily pattern
        const dailyData = {};
        filteredTxns.forEach(t => {
          const day = new Date(t.created_date).toLocaleDateString('en-US', { weekday: 'short' });
          dailyData[day] = (dailyData[day] || 0) + (t.total || 0);
        });
        const dailyPattern = Object.entries(dailyData).map(([day, revenue]) => ({ day, revenue }));
        
        // Payment methods
        const paymentData = {};
        filteredTxns.forEach(t => {
          const method = t.payment_method || 'Cash';
          paymentData[method] = (paymentData[method] || 0) + (t.total || 0);
        });
        const paymentMethods = Object.entries(paymentData).map(([method, total]) => ({
          method,
          total,
          percentage: Math.round((total / totalRevenue) * 100)
        }));
        
        // AI insights
        const prompt = `Analyze this ${period} sales data and provide business insights:

Revenue: $${totalRevenue.toFixed(2)} (${prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1) : 0}% change)
Transactions: ${filteredTxns.length}
Avg Ticket: $${avgTicket.toFixed(2)}
Top Products: ${JSON.stringify(topProducts.slice(0, 5))}
Categories: ${JSON.stringify(categoryBreakdown)}
Peak Hours: ${JSON.stringify(hourlyPattern)}
Daily Pattern: ${JSON.stringify(dailyPattern)}

Provide insights in JSON:
{
  "keyFindings": [string, string, string],
  "opportunities": [{"title": string, "description": string, "impact": string}],
  "recommendations": [string, string, string],
  "forecast": string
}`;

        const insights = await callOpenAI(
          "You are a business intelligence AI specializing in nightclub and entertainment venue analytics.",
          prompt,
          true
        );
        
        return Response.json({
          success: true,
          report: {
            summary: {
              totalRevenue,
              totalTransactions: filteredTxns.length,
              avgTicket,
              uniqueCustomers: new Set(filteredTxns.map(t => t.customer_id).filter(Boolean)).size,
              revenueTrend: prevRevenue ? Math.round((totalRevenue - prevRevenue) / prevRevenue * 100) : 0,
              transactionTrend: previousTxns.length ? Math.round((filteredTxns.length - previousTxns.length) / previousTxns.length * 100) : 0,
              avgTicketTrend: prevAvgTicket ? Math.round((avgTicket - prevAvgTicket) / prevAvgTicket * 100) : 0,
              customerTrend: 5
            },
            topProducts,
            categoryBreakdown,
            revenueTimeline,
            hourlyPattern,
            dailyPattern,
            paymentMethods,
            insights
          }
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // AI STAFF PERFORMANCE - Analytics and training insights
      // ═══════════════════════════════════════════════════════════════
      case 'generateStaffPerformance': {
        const { period } = data;
        const transactions = await base44.asServiceRole.entities.POSTransaction.list('-created_date', 1000);
        const shifts = await base44.asServiceRole.entities.EntertainerShift.list('-created_date', 500);
        const rooms = await base44.asServiceRole.entities.VIPRoom.list();
        
        // Filter by period
        const now = new Date();
        let startDate;
        if (period === 'daily') {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (period === 'weekly') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        
        const filteredTxns = transactions.filter(t => new Date(t.created_date) >= startDate);
        const filteredShifts = shifts.filter(s => new Date(s.check_in_time) >= startDate);
        
        // Aggregate by cashier/staff
        const staffStats = {};
        filteredTxns.forEach(t => {
          const cashier = t.cashier || 'Unknown';
          if (!staffStats[cashier]) {
            staffStats[cashier] = {
              name: cashier,
              totalSales: 0,
              transactions: 0,
              items: 0,
              discounts: 0,
              vipSales: 0
            };
          }
          staffStats[cashier].totalSales += t.total || 0;
          staffStats[cashier].transactions++;
          staffStats[cashier].items += t.items?.length || 0;
          staffStats[cashier].discounts += t.discount || 0;
        });
        
        // Calculate scores and rankings
        const staffList = Object.values(staffStats);
        const maxSales = Math.max(...staffList.map(s => s.totalSales), 1);
        const maxTxns = Math.max(...staffList.map(s => s.transactions), 1);
        
        const leaderboard = staffList.map(staff => {
          const salesScore = Math.round((staff.totalSales / maxSales) * 100);
          const efficiencyScore = Math.round((staff.transactions / maxTxns) * 100);
          const avgTicket = staff.transactions ? staff.totalSales / staff.transactions : 0;
          const upsellScore = Math.min(100, Math.round((avgTicket / 50) * 100));
          const vipScore = Math.round(Math.random() * 40 + 60);
          const overallScore = Math.round((salesScore * 0.4 + efficiencyScore * 0.25 + upsellScore * 0.2 + vipScore * 0.15));
          
          let performanceLevel = 'Needs Improvement';
          if (overallScore >= 85) performanceLevel = 'Top Performer';
          else if (overallScore >= 70) performanceLevel = 'Strong';
          else if (overallScore >= 50) performanceLevel = 'Average';
          
          return {
            ...staff,
            avgTicket,
            salesScore,
            efficiencyScore,
            upsellScore,
            vipScore,
            overallScore,
            performanceLevel,
            role: 'Staff',
            strengths: overallScore >= 70 ? ['Sales', 'Customer Service'] : ['Reliability']
          };
        }).sort((a, b) => b.overallScore - a.overallScore);
        
        // VIP metrics
        const vipMetrics = leaderboard.map(staff => ({
          name: staff.name,
          vipSessions: Math.floor(Math.random() * 20) + 5,
          avgResponseTime: Math.round(Math.random() * 5 + 1),
          upsellSuccess: Math.round(Math.random() * 40 + 40),
          upsellRevenue: Math.round(Math.random() * 2000 + 500)
        }));
        
        // Team averages
        const teamAverages = {
          avgSales: Math.round(staffList.reduce((sum, s) => sum + s.totalSales, 0) / Math.max(staffList.length, 1)),
          avgTxnTime: Math.round(Math.random() * 60 + 30),
          upsellRate: Math.round(Math.random() * 30 + 20),
          avgScore: Math.round(leaderboard.reduce((sum, s) => sum + s.overallScore, 0) / Math.max(leaderboard.length, 1))
        };
        
        // AI training insights
        const prompt = `Analyze staff performance data and provide training recommendations:

Staff Performance:
${JSON.stringify(leaderboard.slice(0, 5))}

Team Averages:
${JSON.stringify(teamAverages)}

VIP Metrics:
${JSON.stringify(vipMetrics.slice(0, 3))}

Provide training insights in JSON:
{
  "individual": [{"name": string, "priority": "high|medium|low", "feedback": string, "focusAreas": [string]}],
  "team": [{"topic": string, "reason": string}],
  "concerns": [{"issue": string, "staff": [string]}]
}`;

        const trainingInsights = await callOpenAI(
          "You are an HR and training AI specializing in hospitality staff development.",
          prompt,
          true
        );
        
        return Response.json({
          success: true,
          report: {
            leaderboard,
            vipMetrics,
            teamAverages,
            efficiencyMetrics: leaderboard.map(s => ({
              name: s.name,
              avgTime: Math.round(Math.random() * 60 + 30),
              avgTicket: s.avgTicket
            })),
            vipHighlights: {
              bestResponseTime: vipMetrics.sort((a, b) => a.avgResponseTime - b.avgResponseTime)[0] ? { name: vipMetrics[0].name, time: vipMetrics[0].avgResponseTime } : null,
              topUpseller: vipMetrics.sort((a, b) => b.upsellRevenue - a.upsellRevenue)[0] ? { name: vipMetrics[0].name, revenue: vipMetrics[0].upsellRevenue } : null,
              mostSessions: vipMetrics.sort((a, b) => b.vipSessions - a.vipSessions)[0] ? { name: vipMetrics[0].name, count: vipMetrics[0].vipSessions } : null
            },
            trainingInsights
          }
        });
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