import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Mail, Shield, Trash2, Building2, Crown, UserPlus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import glyphLockAPI from '@/components/api/glyphLockAPI';
import RoleGate from './RoleGate';
import SharedSeatGate, { SeatWarningBanner } from './SharedSeatGate';
import RoleRules from './SharedRoleRules';
import { ReauthModal } from './SessionGuard';

const ROLE_BADGES = {
  'owner': { color: 'text-yellow-400 bg-yellow-400/20', icon: Crown },
  'admin': { color: 'text-purple-400 bg-purple-400/20', icon: Shield },
  'member': { color: 'text-cyan-400 bg-cyan-400/20', icon: Users },
  'viewer': { color: 'text-white/40 bg-white/10', icon: Users }
};

export default function TeamAndRoles({ user }) {
  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [billingStatus, setBillingStatus] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [reauthAction, setReauthAction] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orgData, membersData, statusData] = await Promise.all([
        glyphLockAPI.team.getOrganization(),
        glyphLockAPI.team.listMembers(),
        glyphLockAPI.billing.getStatus()
      ]);
      setOrganization(orgData);
      setMembers(membersData);
      setBillingStatus(statusData);
      toast.success('Team data loaded');
    } catch (error) {
      console.error('Failed to fetch team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check seat limit
    const maxSeats = billingStatus?.seatLimit || 5;
    if (members.length >= maxSeats) {
      setShowUpgradeModal(true);
      return;
    }

    setSendingInvite(true);
    try {
      await glyphLockAPI.billing.sendInvite(inviteEmail, inviteRole);
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail('');
      fetchData();
    } catch (error) {
      console.error('Failed to send invite:', error);
      toast.error('Failed to send invite');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleUpdateRole = async (memberId, newRole, currentRole) => {
    // Check role escalation rules
    if (!RoleRules.canChangeRole(user.role, currentRole, newRole)) {
      toast.error('You do not have permission to perform this role change');
      return;
    }

    // Require re-authentication for sensitive action
    if (RoleRules.requiresReauth('change_role')) {
      setReauthAction('change role for this user');
      setPendingAction(() => async () => {
        try {
          await glyphLockAPI.team.updateMemberRole(memberId, newRole);
          toast.success('Role updated successfully');
          fetchData();
        } catch (error) {
          console.error('Failed to update role:', error);
          toast.error('Failed to update role');
        }
      });
      return;
    }

    try {
      await glyphLockAPI.team.updateMemberRole(memberId, newRole);
      toast.success('Role updated successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId, memberRole) => {
    // Check if user can remove this member
    if (!RoleRules.canRemoveMember(user.role, memberRole, user.id, memberId)) {
      toast.error('You cannot remove this member');
      return;
    }

    if (!confirm('Are you sure you want to remove this member?')) return;

    // Require re-authentication
    if (RoleRules.requiresReauth('remove_member')) {
      setReauthAction('remove this team member');
      setPendingAction(() => async () => {
        try {
          await glyphLockAPI.team.removeMember(memberId);
          toast.success('Member removed');
          fetchData();
        } catch (error) {
          console.error('Failed to remove member:', error);
          toast.error('Failed to remove member');
        }
      });
      return;
    }

    try {
      await glyphLockAPI.team.removeMember(memberId);
      toast.success('Member removed');
      fetchData();
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Team & Roles</h2>
        <Skeleton className="h-32 w-full bg-white/5 glass-card" />
        <Skeleton className="h-64 w-full bg-white/5 glass-card" />
      </div>
    );
  }

  return (
    <RoleGate userRole={user?.role} requiredRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Team & Roles</h2>
          <span className="text-white/50 text-sm">Organization Management</span>
        </div>

        {/* Organization Info */}
        {organization && (
          <Card className="glass-card border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Building2 className="h-5 w-5" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
              <div>
                <p className="text-sm text-white/50">Organization Name</p>
                <p className="text-lg font-bold text-white">{organization.name}</p>
              </div>
              <div>
                <p className="text-sm text-white/50">Organization ID</p>
                <p className="text-lg font-mono text-cyan-400">{organization.id}</p>
              </div>
              <div>
                <p className="text-sm text-white/50">Owner</p>
                <p className="text-lg font-semibold text-white">{organization.owner}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seat Warning */}
        {billingStatus && (
          <SeatWarningBanner 
            currentSeats={members.length} 
            maxSeats={billingStatus.seatLimit || 5} 
          />
        )}

        {/* Invite Member */}
        {showUpgradeModal && billingStatus ? (
          <SharedSeatGate
            currentSeats={members.length}
            maxSeats={billingStatus.seatLimit || 5}
            planName={billingStatus.planName || 'Current'}
            onUpgrade={() => {
              setShowUpgradeModal(false);
              window.location.href = '/enterprise-console?module=billing';
            }}
          >
            <div />
          </SharedSeatGate>
        ) : (
          <Card className="glass-card border-cyan-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <UserPlus className="h-5 w-5" />
              Invite Team Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="member@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="glass-card border-cyan-500/30 text-white"
                />
              </div>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-full md:w-40 glass-card border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSendInvite}
                disabled={sendingInvite}
                className="bg-gradient-to-r from-[#8C4BFF] to-[#00E4FF] hover:opacity-90 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                {sendingInvite ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Team Members List */}
        <Card className="glass-card border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Users className="h-5 w-5" />
              Team Members ({members.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => {
                const RoleIcon = ROLE_BADGES[member.role]?.icon || Users;
                const roleColor = ROLE_BADGES[member.role]?.color || 'text-white/40 bg-white/10';
                
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg glass-card border border-white/10 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-400">
                          {member.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{member.name || member.email}</p>
                        <p className="text-white/60 text-sm">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${roleColor}`}>
                        <RoleIcon className="h-4 w-4" />
                        <span className="text-sm font-semibold capitalize">{member.role}</span>
                      </div>

                      {member.role !== 'owner' && RoleRules.canPerformAdminAction(user?.role) && (
                        <>
                          <Select
                            value={member.role}
                            onValueChange={(newRole) => handleUpdateRole(member.id, newRole, member.role)}
                          >
                            <SelectTrigger className="w-32 glass-card border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {RoleRules.getAssignableRoles(user.role).map(role => (
                                <SelectItem key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.id, member.role)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Organization Deletion - Owner Only */}
        {RoleRules.isOwner(user?.role) && (
          <Card className="glass-card border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white/80">
                <p className="mb-2">Permanently delete this organization and all associated data.</p>
                <p className="text-red-400 text-sm">This action cannot be undone.</p>
              </div>
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Organization
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Delete Organization Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="glass-card border-red-500/30 max-w-md w-full">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Organization Deletion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-white/90 text-sm mb-3">
                    <strong>WARNING:</strong> This will permanently delete:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-white/70 text-sm ml-2">
                    <li>All team members and access</li>
                    <li>All API keys and credentials</li>
                    <li>All billing history</li>
                    <li>All audit logs</li>
                    <li>All support tickets</li>
                  </ul>
                </div>

                <div>
                  <p className="text-white/80 text-sm mb-2">
                    Type <span className="font-bold text-red-400">DELETE {organization?.name || 'ORGANIZATION'}</span> to confirm:
                  </p>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder={`DELETE ${organization?.name || 'ORGANIZATION'}`}
                    className="glass-card border-red-500/30 text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmText('');
                    }}
                    variant="outline"
                    className="flex-1 border-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      if (deleteConfirmText === `DELETE ${organization?.name || 'ORGANIZATION'}`) {
                        try {
                          await glyphLockAPI.org.requestDeletion(deleteConfirmText);
                          toast.success('Organization deletion requested');
                          setShowDeleteModal(false);
                        } catch (error) {
                          toast.error('Failed to delete organization');
                        }
                      } else {
                        toast.error('Confirmation text does not match');
                      }
                    }}
                    disabled={deleteConfirmText !== `DELETE ${organization?.name || 'ORGANIZATION'}`}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Delete Forever
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Re-auth Modal */}
        <ReauthModal
          isOpen={!!reauthAction}
          onClose={() => {
            setReauthAction(null);
            setPendingAction(null);
          }}
          onConfirm={() => {
            if (pendingAction) pendingAction();
            setPendingAction(null);
          }}
          action={reauthAction}
        />
      </div>
    </RoleGate>
  );
}