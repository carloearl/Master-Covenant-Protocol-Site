import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, DollarSign, Mail, Building2, Phone } from "lucide-react";

export default function LeadsManager({ partner }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['partner-leads', partner.id],
    queryFn: () => base44.entities.PartnerLead.filter({ partner_id: partner.id })
  });

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.lead_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.lead_company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      contacted: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
      qualified: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      proposal_sent: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      negotiation: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
      won: 'bg-green-500/20 text-green-300 border-green-500/50',
      lost: 'bg-red-500/20 text-red-300 border-red-500/50'
    };
    return colors[status] || colors.new;
  };

  if (isLoading) {
    return <div className="text-center text-slate-400 py-12">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="glyph-glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-glow-blue"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-950/60 border-slate-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <Card className="glyph-glass-card">
          <CardContent className="py-12 text-center">
            <p className="text-slate-400">No leads found. Start referring clients to see them here!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="glyph-glass-card card-elevated-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">{lead.lead_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${getStatusColor(lead.status)} border`}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                      {lead.estimated_value > 0 && (
                        <Badge className="bg-green-500/20 text-green-300 border border-green-500/50">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${lead.estimated_value.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    {new Date(lead.created_date).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{lead.lead_email}</span>
                    </div>
                    {lead.lead_phone && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{lead.lead_phone}</span>
                      </div>
                    )}
                    {lead.lead_company && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{lead.lead_company}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {lead.service_interest && (
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Service Interest</div>
                        <div className="text-sm text-white">{lead.service_interest}</div>
                      </div>
                    )}
                    {lead.status === 'won' && lead.actual_revenue > 0 && (
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Commission Earned</div>
                        <div className="text-lg font-bold text-green-400">
                          ${lead.commission_paid.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {lead.notes && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Notes</div>
                    <p className="text-sm text-slate-300">{lead.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}