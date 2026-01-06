import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DoorOpen, Video, Clock, DollarSign, User, UserCheck, Sparkles, Loader2, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import VIPContractModal from '@/components/nups/VIPContractModal';

export default function VIPRoomManagement() {
  const queryClient = useQueryClient();
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    entertainer_id: "",
    guest_name: "",
    duration_minutes: 60
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ['vip-rooms'],
    queryFn: () => base44.entities.VIPRoom.list()
  });

  const { data: entertainers = [] } = useQuery({
    queryKey: ['active-shifts'],
    queryFn: async () => {
      const shifts = await base44.entities.EntertainerShift.list('-created_date', 100);
      return shifts.filter(s => !s.check_out_time);
    }
  });

  const { data: guests = [] } = useQuery({
    queryKey: ['vip-guests-all'],
    queryFn: () => base44.entities.VIPGuest.list('-created_date', 100)
  });

  const [upgradeAnalysis, setUpgradeAnalysis] = useState(null);
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [showVIPContractModal, setShowVIPContractModal] = useState(false);
  const [pendingSession, setPendingSession] = useState(null);

  const getUpgradeSuggestion = async (guestId, currentRoom) => {
    if (!guestId) return;
    setLoadingUpgrade(true);
    try {
      const { data } = await base44.functions.invoke('nupsAI', {
        action: 'suggestVIPUpgrade',
        data: { guestId, currentRoom }
      });
      setUpgradeAnalysis(data.upgradeAnalysis);
    } catch (err) {
      console.error('Upgrade suggestion failed:', err);
    } finally {
      setLoadingUpgrade(false);
    }
  };

  const startSession = useMutation({
    mutationFn: (data) => {
      const entertainer = entertainers.find(e => e.entertainer_id === data.entertainer_id);
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + data.duration_minutes * 60000);
      const charge = (data.duration_minutes / 60) * selectedRoom.rate_per_hour;

      return base44.entities.VIPRoom.update(selectedRoom.id, {
        status: 'occupied',
        entertainer_id: data.entertainer_id,
        entertainer_name: entertainer?.stage_name || 'Unknown',
        guest_name: data.guest_name,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration_minutes: data.duration_minutes,
        total_charge: charge
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-rooms'] });
      setShowStartDialog(false);
      setSessionForm({ entertainer_id: "", guest_name: "", duration_minutes: 60 });
    }
  });

  const endSession = useMutation({
    mutationFn: (roomId) =>
      base44.entities.VIPRoom.update(roomId, {
        status: 'available',
        entertainer_id: null,
        entertainer_name: null,
        guest_name: null,
        start_time: null,
        end_time: null
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-rooms'] });
    }
  });

  const getRoomStatusColor = (status) => {
    const colors = {
      available: 'bg-green-500/20 text-green-400 border-green-500/50',
      occupied: 'bg-red-500/20 text-red-400 border-red-500/50',
      cleaning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      maintenance: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };
    return colors[status] || colors.available;
  };

  const getRemainingTime = (endTime) => {
    if (!endTime) return null;
    const remaining = Math.max(0, new Date(endTime) - new Date());
    const minutes = Math.floor(remaining / 60000);
    return minutes > 0 ? `${minutes} mins remaining` : 'Session ending';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <DoorOpen className="w-5 h-5 text-purple-400" />
            VIP Room Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card 
                key={room.id} 
                className={`${
                  room.status === 'available' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        {room.room_name || `Room ${room.room_number}`}
                      </h3>
                      <Badge className={`mt-1 ${getRoomStatusColor(room.status)}`}>
                        {room.status}
                      </Badge>
                    </div>
                    {room.surveillance_camera && (
                      <Video className="w-5 h-5 text-purple-400" />
                    )}
                  </div>

                  {room.status === 'occupied' && (
                    <div className="space-y-2 mb-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <UserCheck className="w-4 h-4" />
                        <span>{room.entertainer_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{room.guest_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{getRemainingTime(room.end_time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-bold">${room.total_charge?.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {room.status === 'available' ? (
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowStartDialog(true);
                      }}
                    >
                      <DoorOpen className="w-4 h-4 mr-2" />
                      Start Session
                    </Button>
                  ) : room.status === 'occupied' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-red-500/50 text-red-400"
                      onClick={() => endSession.mutate(room.id)}
                    >
                      End Session
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start Session Dialog */}
      <Dialog open={showStartDialog} onOpenChange={(open) => {
        setShowStartDialog(open);
        if (!open) setUpgradeAnalysis(null);
      }}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              Start VIP Session - {selectedRoom?.room_name || `Room ${selectedRoom?.room_number}`}
            </DialogTitle>
          </DialogHeader>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const guest = guests.find(g => g.guest_name === sessionForm.guest_name);
              setPendingSession({ ...sessionForm, guestData: guest });
              setShowVIPContractModal(true);
            }} 
            className="space-y-4"
          >
            <div>
              <Label className="text-white">Entertainer *</Label>
              <Select 
                value={sessionForm.entertainer_id || "none"} 
                onValueChange={(value) => setSessionForm({...sessionForm, entertainer_id: value === "none" ? "" : value})}
                required
              >
                <SelectTrigger className="glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="none">Select entertainer...</SelectItem>
                  {(entertainers || []).map(shift => (
                    <SelectItem key={shift.entertainer_id} value={shift.entertainer_id || shift.id}>
                      {shift.stage_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Select Guest</Label>
              <Select 
                value={sessionForm.guest_name || "none"} 
                onValueChange={(value) => {
                  const guestName = value === "none" ? "" : value;
                  setSessionForm({...sessionForm, guest_name: guestName});
                  const guest = (guests || []).find(g => g.guest_name === guestName);
                  if (guest) {
                    getUpgradeSuggestion(guest.id, selectedRoom?.room_name);
                  }
                }}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="none">Select guest...</SelectItem>
                  {(guests || []).filter(g => g.status === 'in_building').map(g => (
                    <SelectItem key={g.id} value={g.guest_name || g.id}>
                      {g.guest_name} {g.vip_tier && `(${g.vip_tier})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={sessionForm.guest_name}
                onChange={(e) => setSessionForm({...sessionForm, guest_name: e.target.value})}
                placeholder="Or type new guest name"
                className="bg-slate-800 border-slate-600 mt-2"
              />
            </div>

            {/* AI Upgrade Suggestion */}
            {loadingUpgrade && (
              <div className="flex items-center gap-2 text-purple-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing guest for upgrades...
              </div>
            )}
            {upgradeAnalysis && upgradeAnalysis.shouldUpgrade && (
              <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">AI Upgrade Suggestion</span>
                </div>
                <p className="text-sm text-purple-300 mb-2">{upgradeAnalysis.suggestedRoom}</p>
                <p className="text-xs text-slate-400 italic">"{upgradeAnalysis.upsellPitch}"</p>
                {upgradeAnalysis.complementaryOffers?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {upgradeAnalysis.complementaryOffers.slice(0, 2).map((offer, i) => (
                      <Badge key={i} className="bg-pink-500/20 text-pink-400 text-xs">{offer}</Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <Label className="text-white">Duration (minutes) *</Label>
              <Select 
                value={String(sessionForm.duration_minutes)} 
                onValueChange={(value) => setSessionForm({...sessionForm, duration_minutes: Number(value)})}
              >
                <SelectTrigger className="glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="30">30 minutes - ${((selectedRoom?.rate_per_hour || 0) * 0.5).toFixed(2)}</SelectItem>
                  <SelectItem value="60">60 minutes - ${(selectedRoom?.rate_per_hour || 0).toFixed(2)}</SelectItem>
                  <SelectItem value="90">90 minutes - ${((selectedRoom?.rate_per_hour || 0) * 1.5).toFixed(2)}</SelectItem>
                  <SelectItem value="120">120 minutes - ${((selectedRoom?.rate_per_hour || 0) * 2).toFixed(2)}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowStartDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={startSession.isPending}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600"
              >
                {startSession.isPending ? "Starting..." : "Start Session"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <VIPContractModal
        open={showVIPContractModal}
        onOpenChange={setShowVIPContractModal}
        client={pendingSession?.guestData || { guest_name: pendingSession?.guest_name }}
        onAccepted={() => {
          if (pendingSession) {
            startSession.mutate(pendingSession);
            setPendingSession(null);
          }
        }}
      />
    </div>
  );
}