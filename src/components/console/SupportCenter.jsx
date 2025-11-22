import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import glyphLockAPI from '@/components/api/glyphLockAPI';

const STATUS_COLORS = {
  open: 'text-blue-400 bg-blue-400/20',
  in_progress: 'text-yellow-400 bg-yellow-400/20',
  resolved: 'text-green-400 bg-green-400/20',
  closed: 'text-white/40 bg-white/10'
};

const PRIORITY_COLORS = {
  low: 'text-cyan-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400'
};

export default function SupportCenter({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'technical'
  });
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await glyphLockAPI.support.listTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await glyphLockAPI.support.createTicket(newTicket);
      toast.success('Support ticket created');
      setNewTicket({ subject: '', description: '', priority: 'medium', category: 'technical' });
      setShowNewTicket(false);
      fetchTickets();
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error('Failed to create ticket');
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) return;

    try {
      await glyphLockAPI.support.replyToTicket(ticketId, replyText);
      toast.success('Reply sent');
      setReplyText('');
      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        const updated = await glyphLockAPI.support.getTicket(ticketId);
        setSelectedTicket(updated);
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Support Center</h2>
        <Skeleton className="h-64 w-full bg-white/5 glass-card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Support Center</h2>
        <Button
          onClick={() => setShowNewTicket(!showNewTicket)}
          className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* New Ticket Form */}
      {showNewTicket && (
        <Card className="glass-card border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Create Support Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Subject"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
              className="glass-card border-white/10 text-white"
            />
            
            <Textarea
              placeholder="Describe your issue..."
              value={newTicket.description}
              onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
              className="glass-card border-white/10 text-white h-32"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select value={newTicket.priority} onValueChange={(v) => setNewTicket({...newTicket, priority: v})}>
                <SelectTrigger className="glass-card border-white/10 text-white">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={newTicket.category} onValueChange={(v) => setNewTicket({...newTicket, category: v})}>
                <SelectTrigger className="glass-card border-white/10 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowNewTicket(false)}
                variant="outline"
                className="flex-1 border-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTicket}
                className="flex-1 bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
              >
                Submit Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tickets List */}
      <Card className="glass-card border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            Your Tickets ({tickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                No support tickets yet
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                  className="p-4 rounded-lg glass-card border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{ticket.subject}</h4>
                      <p className="text-white/60 text-sm mt-1">{ticket.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[ticket.status]}`}>
                      {ticket.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className={PRIORITY_COLORS[ticket.priority]}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <span>•</span>
                    <span>{ticket.category}</span>
                    <span>•</span>
                    <span><Clock className="h-3 w-3 inline mr-1" />{formatTimestamp(ticket.created_date)}</span>
                  </div>

                  {/* Ticket Details (expanded) */}
                  {selectedTicket?.id === ticket.id && ticket.replies && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      {ticket.replies.map((reply, idx) => (
                        <div key={idx} className="bg-white/5 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-semibold text-white">
                              {reply.from === user.email ? 'You' : 'Support Team'}
                            </span>
                            <span className="text-xs text-white/50">{formatTimestamp(reply.timestamp)}</span>
                          </div>
                          <p className="text-white/80 text-sm">{reply.message}</p>
                        </div>
                      ))}

                      {ticket.status !== 'closed' && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="glass-card border-white/10 text-white"
                          />
                          <Button
                            onClick={() => handleReply(ticket.id)}
                            size="sm"
                            className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}