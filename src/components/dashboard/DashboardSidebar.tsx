'use client';

import { useAuth } from '@/hooks/useAuth';
import { RBAC, SYSTEM_PERMISSIONS } from '@/lib/rbac';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  href: string;
  icon: string;
  permission?: string;
  roles?: string[];
}

const artistMenuItems: MenuItem[] = [
  {
    label: 'Vue d\'ensemble',
    href: '/dashboard/artist',
    icon: '📊',
  },
  {
    label: 'Mes titres',
    href: '/dashboard/artist/tracks',
    icon: '🎵',
    permission: SYSTEM_PERMISSIONS.CONTENT_READ,
  },
  {
    label: 'Mes albums',
    href: '/dashboard/artist/albums',
    icon: '📀',
    permission: SYSTEM_PERMISSIONS.CONTENT_READ,
  },
  {
    label: 'Analytics',
    href: '/dashboard/artist/analytics',
    icon: '📈',
    permission: SYSTEM_PERMISSIONS.ANALYTICS_READ,
  },
  {
    label: 'Revenus',
    href: '/dashboard/artist/revenue',
    icon: '💰',
    permission: SYSTEM_PERMISSIONS.REVENUE_READ,
  },
  {
    label: 'Streams en direct',
    href: '/dashboard/artist/live',
    icon: '📺',
    permission: SYSTEM_PERMISSIONS.CONTENT_CREATE,
  },
];

const adminMenuItems: MenuItem[] = [
  {
    label: 'Vue d\'ensemble',
    href: '/dashboard/admin',
    icon: '📊',
  },
  {
    label: 'Utilisateurs',
    href: '/dashboard/admin/users',
    icon: '👥',
    permission: SYSTEM_PERMISSIONS.USER_MANAGE,
  },
  {
    label: 'Artistes',
    href: '/dashboard/admin/artists',
    icon: '🎤',
    permission: SYSTEM_PERMISSIONS.ARTIST_MANAGE,
  },
  {
    label: 'Modération',
    href: '/dashboard/admin/moderation',
    icon: '🛡️',
    permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
  },
  {
    label: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: '📈',
    permission: SYSTEM_PERMISSIONS.ANALYTICS_MANAGE,
  },
  {
    label: 'Système',
    href: '/dashboard/admin/system',
    icon: '⚙️',
    permission: SYSTEM_PERMISSIONS.SYSTEM_MANAGE,
  },
];

export function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  if (!user) return null;

  const rbac = new RBAC(user);
  const isArtist = rbac.hasRole('artist');
  const isAdmin = rbac.hasRole('admin') || rbac.hasRole('super_admin');
  
  const menuItems = isAdmin ? adminMenuItems : artistMenuItems;

  const filteredMenuItems = menuItems.filter(item => {
    if (item.permission && !rbac.hasPermission(item.permission)) {
      return false;
    }
    if (item.roles && !rbac.hasAnyRole(item.roles)) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-6 shadow-2xl">
      {/* Logo et branding */}
      <div className="mb-10">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Zouglou
          </h2>
        </div>
        <p className="text-gray-400 text-sm font-medium">
          {isAdmin ? 'Administration' : 'Dashboard Artiste'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-3">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
              pathname === item.href
                ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            )}
          >
            <span className={cn(
              'text-xl transition-transform duration-200',
              pathname === item.href ? 'scale-110' : 'group-hover:scale-110'
            )}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Profil utilisateur */}
      <div className="mt-auto pt-8 border-t border-gray-700">
        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user.firstName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-gray-400 text-sm capitalize">
              {user.role}
            </p>
          </div>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-lg">⚙️</span>
          </button>
        </div>
      </div>
    </div>
  );
} 