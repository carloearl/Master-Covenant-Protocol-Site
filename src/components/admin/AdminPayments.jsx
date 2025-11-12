import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Download, Calendar } from "lucide-react";

export default function AdminPayments({ consultations }) {
  const paidConsultations = consultations.filter(c => c.payment_status === 'paid');
  const totalRevenue = paidConsultations.length * 299;
  const pendingPayments = consultations.filter(c => c.payment_status === 'pending').length;
  const failedPayments = consultations.filter(c => c.payment_status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Revenue Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-700/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-400">Total Revenue</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-white mb-1">{paidConsultations.length}</div>
            <div className="text-sm text-gray-400">Paid Consultations</div>
            <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/50">
              $299 each
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-white mb-1">{pendingPayments}</div>
            <div className="text-sm text-gray-400">Pending Payments</div>
            <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
              ${pendingPayments * 299} potential
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paidConsultations.slice(0, 10).map((consultation, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-white">{consultation.full_name}</div>
                  <div className="text-sm text-gray-400">{consultation.email}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">
                      {consultation.service_interest}
                    </Badge>
                    {consultation.transaction_id && (
                      <span className="text-xs text-gray-500">TX: {consultation.transaction_id}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-400">$299.00</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(consultation.payment_date || consultation.created_date).toLocaleDateString()}
                  </div>
                  <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/50">
                    Paid
                  </Badge>
                </div>
              </div>
            ))}

            {paidConsultations.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}