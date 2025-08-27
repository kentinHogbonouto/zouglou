'use client';

import { useAuth } from '@/hooks/useAuth';
import { RBAC, SYSTEM_PERMISSIONS } from '@/lib/rbac';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ChartLineIcon, Music, User, Users, Disc3, Podcast, CreditCard, SquareChartGantt, HelpCircle, Settings } from 'lucide-react';
import Image from 'next/image';
interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: string;
  roles?: string[];
}

const artistMenuItems: MenuItem[] = [
  {
    label: 'Vue d\'ensemble',
    href: '/dashboard/artist',
    icon: <ChartLineIcon size={16} className="h-4 w-4" />,
  },
  {
    label: 'Mes titres',
    href: '/dashboard/artist/tracks',
    icon: <Music size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.CONTENT_READ,
  },
  {
    label: 'Mes albums',
    href: '/dashboard/artist/albums',
    icon: <Disc3 size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.CONTENT_READ,
  },
  {
    label: 'Podcasts',
    href: '/dashboard/artist/podcasts',
    icon: <Podcast size={16} className="h-4 w-4" />,
  },
  {
    label: 'Analytics',
    href: '/dashboard/artist/analytics',
    icon: <ChartLineIcon size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.ANALYTICS_READ,
  },
  {
    label: 'Revenus',
    href: '/dashboard/artist/revenue',
    icon: <Music size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.REVENUE_READ,
  },
  {
    label: 'Mon Profil',
    href: '/dashboard/artist/profile',
    icon: <User size={16} className="h-4 w-4" />,
  },
];

const adminMenuItems: MenuItem[] = [
  {
    label: 'Vue d\'ensemble',
    href: '/dashboard/admin',
    icon: <ChartLineIcon size={16} className="h-4 w-4" />,
  },
  {
    label: 'Utilisateurs',
    href: '/dashboard/admin/user',
    icon: <Users size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.SYSTEM_MANAGE,
  },
  {
    label: 'Abonnements',
    href: '/dashboard/admin/subscription',
    icon: <CreditCard size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
  },
  {
    label: 'Albums',
    href: '/dashboard/admin/albums',
    icon: <Disc3 size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.ARTIST_MANAGE,
  },
  {
    label: 'Podcasts',
    href: '/dashboard/admin/podcasts',
    icon: <Podcast size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
  },
  {
    label: 'Tracks',
    href: '/dashboard/admin/tracks',
    icon: <Music size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
  },

  {
    label: 'Plans Abonnements',
    href: '/dashboard/admin/plans-subscription',
    icon: <SquareChartGantt size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
  },
  {
    label: 'FAQ',
    href: '/dashboard/admin/faq',
    icon: <HelpCircle size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
  },
  {
    label: 'Paramètres',
    href: '/dashboard/admin/information',
    icon: <Settings size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
  },
  {
    label: 'Mon Profil',
    href: '/dashboard/admin/profile',
    icon: <User size={16} className="h-4 w-4" />,
  },
];

export function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const rbac = new RBAC(user);
  const isAdmin = rbac.hasRole('admin') || rbac.hasRole('super-admin');

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
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-3 mt-10 mb-2">
          <div className="rounded-xl flex items-center justify-center">
            <Image src='/images/logo_zouglou.png' className='w-[8rem] h-[8rem] object-cover object-center' width={400} height={400} alt='logo zouglou' />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="my-2 hover:bg-orange-500 hover:text-white py-3 px-2"
                  >
                    <Link href={item.href}>
                      <span className="text-xl">{item.icon}</span>
                      <span className='text-bse'>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
} 