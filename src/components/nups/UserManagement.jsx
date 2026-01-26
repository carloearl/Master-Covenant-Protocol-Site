import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, Lock, Unlock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    role: 'staff',
    pin: '',
    employee_id: ''
  });

  const { data: nupsUsers = [], isLoading } = useQuery({
    queryKey: ['nupsUsers'],
    queryFn: () => base44.entities.NUPSUser.list('-created_date', 500)
  });

  const createUser = useMutation({
    mutationFn: async (data) => {
      // Encrypt PIN before storing
      const encrypted = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.pin));
      const pinHash = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
      
      return base44.entities.NUPSUser.create({
        ...data,
        pin: pinHash,
        last_login: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nupsUsers'] });
      setFormData({ username: '', full_name: '', role: 'staff', pin: '', employee_id: '' });
      toast.success('User created successfully');
    },
    onError: () => toast.error('Failed to create user')
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.NUPSUser.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nupsUsers'] });
      toast.success('Status updated');
    }
  });

  const deleteUser = useMutation({
    mutationFn: (id) => base44.entities.NUPSUser.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nupsUsers'] });
      toast.success('User deleted');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.pin || !formData.full_name) {
      toast.error('Username, PIN, and Name are required');
      return;
    }
    if (formData.pin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }
    createUser.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            Create NUPS User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Username</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="john_doe"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Full Name</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="John Doe"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300">PIN (4+ digits)</Label>
                <Input
                  type="password"
                  value={formData.pin}
                  onChange={(e) => setFormData({...formData, pin: e.target.value})}
                  placeholder="****"
                  maxLength="8"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Role</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="entertainer">Entertainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Employee ID</Label>
                <Input
                  value={formData.employee_id}
                  onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                  placeholder="EMP-001"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
            <Button type="submit" disabled={createUser.isPending} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600">
              {createUser.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Create User
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">NUPS Users ({nupsUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>
          ) : nupsUsers.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No users created yet</p>
          ) : (
            <div className="space-y-2">
              {nupsUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-semibold">{u.username}</p>
                      <Badge className={
                        u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        u.role === 'manager' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }>
                        {u.role}
                      </Badge>
                      <Badge className={u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}>
                        {u.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{u.full_name} {u.employee_id && `• ${u.employee_id}`}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateStatus.mutate({ id: u.id, status: u.status === 'active' ? 'suspended' : 'active' })}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      {u.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete ${u.username}?`)) deleteUser.mutate(u.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
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