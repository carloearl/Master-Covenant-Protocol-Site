import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Printer, Wine, DoorOpen, Clock, DollarSign, 
  User, Calendar, Music, Star, Download
} from "lucide-react";

export default function VIPReceiptCard({ guest, transactions, roomSessions, entertainers, date }) {
  const receiptRef = useRef(null);

  const totalSpend = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalRoomCharges = roomSessions.reduce((sum, r) => sum + (r.total_charge || 0), 0);
  const grandTotal = totalSpend + totalRoomCharges;

  // Get all items from transactions
  const allItems = transactions.flatMap(t => t.items || []);
  const itemSummary = {};
  allItems.forEach(item => {
    if (!itemSummary[item.product_name]) {
      itemSummary[item.product_name] = { quantity: 0, total: 0 };
    }
    itemSummary[item.product_name].quantity += item.quantity || 1;
    itemSummary[item.product_name].total += item.total || 0;
  });

  const handlePrint = () => {
    const printContent = receiptRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>VIP Receipt - ${guest?.guest_name}</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            padding: 20px; 
            max-width: 400px; 
            margin: 0 auto;
            background: #000;
            color: #fff;
          }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #f59e0b; }
          .guest-name { font-size: 18px; margin: 10px 0; }
          .divider { border-top: 1px dashed #444; margin: 15px 0; }
          .line-item { display: flex; justify-content: space-between; padding: 5px 0; }
          .section-title { font-weight: bold; color: #f59e0b; margin: 15px 0 10px; }
          .total { font-size: 18px; font-weight: bold; color: #10b981; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          @media print {
            body { background: #fff; color: #000; }
            .logo, .section-title { color: #000; }
            .total { color: #000; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="bg-slate-900/50 border-amber-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Wine className="w-5 h-5 text-amber-400" />
          Today's Receipt
        </CardTitle>
        <Button onClick={handlePrint} variant="outline" size="sm" className="border-amber-500/50 text-amber-400">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={receiptRef} className="font-mono text-sm">
          {/* Receipt Header */}
          <div className="header text-center mb-4">
            <div className="logo text-xl font-bold text-amber-400">★ VIP RECEIPT ★</div>
            <div className="guest-name text-lg text-white">{guest?.guest_name}</div>
            <div className="text-xs text-slate-400">
              {date?.toLocaleDateString()} • {date?.toLocaleTimeString()}
            </div>
            {guest?.membership_number && (
              <div className="text-xs text-amber-400">Member #{guest.membership_number}</div>
            )}
          </div>

          <div className="divider border-t border-dashed border-slate-600 my-4" />

          {/* Drinks & Bar Items */}
          <div className="section-title text-amber-400 font-bold mb-2">
            <Wine className="w-4 h-4 inline mr-1" /> BAR & DRINKS
          </div>
          {Object.entries(itemSummary).length > 0 ? (
            Object.entries(itemSummary).map(([name, data], i) => (
              <div key={i} className="line-item flex justify-between py-1">
                <span className="text-slate-300">{data.quantity}x {name}</span>
                <span className="text-green-400">${data.total.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-xs">No bar purchases today</div>
          )}
          <div className="line-item flex justify-between py-1 border-t border-slate-700 mt-2">
            <span className="text-white font-medium">Bar Subtotal</span>
            <span className="text-green-400 font-medium">${totalSpend.toFixed(2)}</span>
          </div>

          <div className="divider border-t border-dashed border-slate-600 my-4" />

          {/* VIP Room Sessions */}
          <div className="section-title text-pink-400 font-bold mb-2">
            <DoorOpen className="w-4 h-4 inline mr-1" /> VIP ROOM SESSIONS
          </div>
          {roomSessions.length > 0 ? (
            roomSessions.map((room, i) => {
              const entertainer = entertainers.find(e => e.id === room.entertainer_id);
              return (
                <div key={i} className="mb-3 p-2 bg-slate-800/50 rounded">
                  <div className="flex justify-between">
                    <span className="text-white">{room.room_name || `Room ${room.room_number}`}</span>
                    <span className="text-pink-400">${(room.total_charge || 0).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {room.duration_minutes || 30} min @ ${room.rate_per_hour || 300}/hr
                  </div>
                  {entertainer && (
                    <div className="text-xs text-purple-400 mt-1">
                      <User className="w-3 h-3 inline mr-1" />
                      Host: {entertainer.stage_name}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-slate-500 text-xs">No VIP sessions today</div>
          )}
          <div className="line-item flex justify-between py-1 border-t border-slate-700 mt-2">
            <span className="text-white font-medium">VIP Subtotal</span>
            <span className="text-pink-400 font-medium">${totalRoomCharges.toFixed(2)}</span>
          </div>

          <div className="divider border-t border-dashed border-slate-600 my-4" />

          {/* Grand Total */}
          <div className="line-item flex justify-between py-2">
            <span className="text-xl font-bold text-white">GRAND TOTAL</span>
            <span className="text-xl font-bold text-green-400">${grandTotal.toFixed(2)}</span>
          </div>

          {/* Footer */}
          <div className="divider border-t border-dashed border-slate-600 my-4" />
          <div className="footer text-center text-xs text-slate-500">
            <p>Thank you for being a VIP!</p>
            <p className="mt-1">★ We appreciate your patronage ★</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}