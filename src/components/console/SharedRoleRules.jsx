/**
 * GlyphLock Enterprise Role Escalation Rules
 * Enforces role hierarchy and prevents unauthorized actions
 */

const ROLE_HIERARCHY = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1
};

export const RoleRules = {
  /**
   * Check if user can change another user's role
   */
  canChangeRole: (actorRole, targetRole, newRole) => {
    const actorLevel = ROLE_HIERARCHY[actorRole] || 0;
    const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
    const newLevel = ROLE_HIERARCHY[newRole] || 0;

    // Owner cannot be demoted
    if (targetRole === 'owner') return false;

    // Cannot assign owner role
    if (newRole === 'owner') return false;

    // Actor must have higher role than target
    if (actorLevel <= targetLevel) return false;

    // Actor must have higher role than new role being assigned
    if (actorLevel <= newLevel) return false;

    return true;
  },

  /**
   * Check if user can remove a member
   */
  canRemoveMember: (actorRole, targetRole, actorId, targetId) => {
    // Cannot remove yourself
    if (actorId === targetId) return false;

    // Cannot remove owner
    if (targetRole === 'owner') return false;

    const actorLevel = ROLE_HIERARCHY[actorRole] || 0;
    const targetLevel = ROLE_HIERARCHY[targetRole] || 0;

    // Must have higher role
    return actorLevel > targetLevel;
  },

  /**
   * Check if user can perform admin action
   */
  canPerformAdminAction: (userRole) => {
    return userRole === 'admin' || userRole === 'owner';
  },

  /**
   * Check if user is owner
   */
  isOwner: (userRole) => {
    return userRole === 'owner';
  },

  /**
   * Get available roles user can assign
   */
  getAssignableRoles: (userRole) => {
    const level = ROLE_HIERARCHY[userRole] || 0;
    const roles = [];

    if (level > ROLE_HIERARCHY.viewer) roles.push('viewer');
    if (level > ROLE_HIERARCHY.member) roles.push('member');
    if (level > ROLE_HIERARCHY.admin) roles.push('admin');
    // Never allow owner assignment
    
    return roles;
  },

  /**
   * Check if action requires re-authentication
   */
  requiresReauth: (action) => {
    const sensitiveActions = [
      'change_role',
      'remove_member',
      'delete_organization',
      'update_payment',
      'revoke_api_key'
    ];
    return sensitiveActions.includes(action);
  }
};

export default RoleRules;