import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, DollarSign } from "lucide-react";

export default function AdminAnalytics({ consultations, users, qrCodes }) {
  // Calculate growth metrics
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const consultationsLast30Days = consultations.filter(c => 
    new Date(c.created_date) > last30Days
  ).length;

  const consultationsLast7Days = consultations.filter(c => 
    new Date(c.created_date) > last7Days
  ).length;

  const usersLast30Days = users.filter(u => 
    new Date(u.created_date) > last30Days
  ).length;

  const qrCodesLast30Days = qrCodes.filter(q => 
    new Date(q.created_date) > last30Days
  ).length;

  const revenueLast30Days = consultations.filter(c => 
    c.payment_status === 'paid' && new Date(c.payment_date || c.created_date) > last30Days
  ).length * 299;

  // Service breakdown
  const serviceBreakdown = consultations.reduce((acc, c) => {
    acc[c.service_interest] = (acc[c.service_interest] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Growth Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{consultationsLast30Days}</div>
            <div className="text-sm text-gray-400">Bookings (30d)</div>
            <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
              {consultationsLast7Days} this week
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-purple-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{usersLast30Days}</div>
            <div className="text-sm text-gray-400">New Users (30d)</div>
            <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">
              {users.length} total
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">${revenueLast30Days.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Revenue (30d)</div>
            <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/50 text-xs">
              {Math.round(revenueLast30Days / 30)}/day avg
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-orange-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{qrCodesLast30Days}</div>
            <div className="text-sm text-gray-400">QR Codes (30d)</div>
            <Badge className="mt-2 bg-orange-500/20 text-orange-400 border-orange-500/50 text-xs">
              {qrCodes.length} total
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Service Breakdown */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Service Interest Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(serviceBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([service, count], index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{service}</div>
                      <div className="text-sm text-gray-400">
                        {((count / consultations.length) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{count}</div>
                    <div className="text-xs text-gray-500">bookings</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Metrics */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Conversion Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Consultation → Payment</div>
              <div className="text-3xl font-bold text-white">
                {consultations.length > 0 
                  ? Math.round((consultations.filter(c => c.payment_status === 'paid').length / consultations.length) * 100)
                  : 0}%
              </div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Pending → Confirmed</div>
              <div className="text-3xl font-bold text-white">
                {consultations.filter(c => c.status === 'pending').length > 0
                  ? Math.round((consultations.filter(c => c.status === 'confirmed').length / consultations.length) * 100)
                  : 0}%
              </div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Avg. Booking Value</div>
              <div className="text-3xl font-bold text-white">$299</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}