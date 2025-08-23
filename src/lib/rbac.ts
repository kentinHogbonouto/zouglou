import { User } from "@/shared/types/user";

// Permissions système prédéfinies
export const SYSTEM_PERMISSIONS = {
  // Gestion des utilisateurs
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',

  // Gestion des artistes
  ARTIST_CREATE: 'artist:create',
  ARTIST_READ: 'artist:read',
  ARTIST_UPDATE: 'artist:update',
  ARTIST_DELETE: 'artist:delete',
  ARTIST_MANAGE: 'artist:manage',

  // Gestion du contenu
  CONTENT_CREATE: 'content:create',
  CONTENT_READ: 'content:read',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',
  CONTENT_MODERATE: 'content:moderate',

  // Gestion des revenus
  REVENUE_READ: 'revenue:read',
  REVENUE_MANAGE: 'revenue:manage',

  // Analytics
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_MANAGE: 'analytics:manage',

  // Système
  SYSTEM_MANAGE: 'system:manage',
  SYSTEM_CONFIG: 'system:config',
} as const;

// Rôles système prédéfinis
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  ARTIST: 'artist',
  USER: 'user',
} as const;

// Configuration des rôles avec leurs permissions
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [SYSTEM_ROLES.SUPER_ADMIN]: [
    SYSTEM_PERMISSIONS.USER_MANAGE,
    SYSTEM_PERMISSIONS.ARTIST_MANAGE,
    SYSTEM_PERMISSIONS.CONTENT_MODERATE,
    SYSTEM_PERMISSIONS.REVENUE_MANAGE,
    SYSTEM_PERMISSIONS.ANALYTICS_MANAGE,
    SYSTEM_PERMISSIONS.SYSTEM_MANAGE,
    SYSTEM_PERMISSIONS.SYSTEM_CONFIG,
  ],
  [SYSTEM_ROLES.ADMIN]: [
    SYSTEM_PERMISSIONS.USER_READ,
    SYSTEM_PERMISSIONS.USER_UPDATE,
    SYSTEM_PERMISSIONS.ARTIST_READ,
    SYSTEM_PERMISSIONS.ARTIST_UPDATE,
    SYSTEM_PERMISSIONS.CONTENT_MODERATE,
    SYSTEM_PERMISSIONS.REVENUE_READ,
    SYSTEM_PERMISSIONS.ANALYTICS_READ,
  ],
  [SYSTEM_ROLES.MODERATOR]: [
    SYSTEM_PERMISSIONS.USER_READ,
    SYSTEM_PERMISSIONS.CONTENT_MODERATE,
    SYSTEM_PERMISSIONS.ANALYTICS_READ,
  ],
  [SYSTEM_ROLES.ARTIST]: [
    SYSTEM_PERMISSIONS.CONTENT_CREATE,
    SYSTEM_PERMISSIONS.CONTENT_READ,
    SYSTEM_PERMISSIONS.CONTENT_UPDATE,
    SYSTEM_PERMISSIONS.REVENUE_READ,
    SYSTEM_PERMISSIONS.ANALYTICS_READ,
  ],
  [SYSTEM_ROLES.USER]: [
    SYSTEM_PERMISSIONS.CONTENT_READ,
  ],
};

// Classe RBAC pour la gestion des droits
export class RBAC {
  private user: User | null = null;
  private userPermissions: string[] = [];

  constructor(user?: User) {
    if (user) {
      this.setUser(user);
    }
  }

  setUser(user: User) {
    this.user = user;
    this.userPermissions = this.getUserPermissions(user);
  }

  private getUserPermissions(user: User): string[] {
    const rolePermissions = ROLE_PERMISSIONS[user.default_role || ''] || [];
    return rolePermissions;
  }

  // Vérifier si l'utilisateur a une permission spécifique
  hasPermission(permission: string): boolean {
    if (!this.user) return false;
    return this.userPermissions.includes(permission);
  }

  // Vérifier si l'utilisateur a au moins une des permissions
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  // Vérifier si l'utilisateur a toutes les permissions
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    if (!this.user) return false;
    return this.user.default_role === role;
  }

  // Vérifier si l'utilisateur a au moins un des rôles
  hasAnyRole(roles: string[]): boolean {
    if (!this.user) return false;
    return roles.includes(this.user.default_role || '');
  }

  // Obtenir toutes les permissions de l'utilisateur
  getUserAllPermissions(): string[] {
    return [...this.userPermissions];
  }

  // Vérifier si l'utilisateur peut accéder à une route
  canAccessRoute(route: string): boolean {
    const routePermissions: Record<string, string[]> = {
      '/dashboard/admin': [SYSTEM_PERMISSIONS.SYSTEM_MANAGE],
      '/dashboard/artist': [SYSTEM_PERMISSIONS.CONTENT_CREATE],
      '/admin/users': [SYSTEM_PERMISSIONS.USER_MANAGE],
      '/admin/content': [SYSTEM_PERMISSIONS.CONTENT_MODERATE],
      '/admin/analytics': [SYSTEM_PERMISSIONS.ANALYTICS_MANAGE],
    };

    const requiredPermissions = routePermissions[route] || [];
    return this.hasAnyPermission(requiredPermissions);
  }
}

export function useRBAC() {
  return {
    hasPermission: () => false,
    hasRole: () => false,
    canAccessRoute: () => false,
    getUserAllPermissions: () => [],
  };
} 