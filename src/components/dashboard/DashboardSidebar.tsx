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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChartLineIcon,
  Music,
  User,
  Users,
  Disc3,
  Podcast,
  CreditCard,
  SquareChartGantt,
  HelpCircle,
  Settings,
  Info,
  ChevronDown,
  Megaphone,
  MapPin
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
  icon: React.ReactNode;
  permission?: string;
  roles?: string[];
  defaultOpen?: boolean;
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
    label: 'Titres',
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
    label: 'Paramètres',
    href: '#',
    children: [
      {
        label: 'Informations',
        href: '/dashboard/admin/information',
        icon: <Info size={16} className="h-4 w-4" />,
        permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
      },
      {
        label: 'FAQ',
        href: '/dashboard/admin/faq',
        icon: <HelpCircle size={16} className="h-4 w-4" />,
        permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
      },
      {
        label: 'Publicités',
        href: '/dashboard/admin/advertisements',
        icon: <Megaphone size={16} className="h-4 w-4" />,
        permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
      },
      {
        label: 'Villes',
        href: '/dashboard/admin/cities',
        icon: <MapPin size={16} className="h-4 w-4" />,
        permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
      }
    ],
    icon: <Settings size={16} className="h-4 w-4" />,
    permission: SYSTEM_PERMISSIONS.CONTENT_MODERATE,
    defaultOpen: false,
  },
  {
    label: 'Mon Profil',
    href: '/dashboard/admin/profile',
    icon: <User size={16} className="h-4 w-4" />,
  },
];

// Composant pour gérer les éléments de menu avec sous-menus
function MenuItemWithSubmenu({
  item,
  pathname,
  rbac
}: {
  item: MenuItem;
  pathname: string;
  rbac: RBAC;
}) {
  const [isOpen, setIsOpen] = useState(item.defaultOpen || false);

  // Filtrer les sous-éléments basés sur les permissions
  const filteredChildren = item.children?.filter(child => {
    if (child.permission && !rbac.hasPermission(child.permission)) {
      return false;
    }
    if (child.roles && !rbac.hasAnyRole(child.roles)) {
      return false;
    }
    return true;
  }) || [];

  // Vérifier si l'un des sous-éléments est actif
  const isChildActive = filteredChildren.some(child => pathname === child.href);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.label}
            className="my-2 hover:bg-orange-500 hover:text-white py-3 px-2"
            isActive={isChildActive}
          >
            <span className=" text-xl">{item.icon}</span>
            <span className=" textbs">{item.label}</span>
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {filteredChildren.map((child) => (
              <SidebarMenuSubItem key={child.href}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === child.href}
                  className="hover:bg-orange-400 hover:text-white"
                >
                  <Link href={child.href}>
                    <span className=" text-lg">{child.icon}</span>
                    <span className="">{child.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

// Composant pour les éléments de menu simples
function SimpleMenuItem({
  item,
  pathname
}: {
  item: MenuItem;
  pathname: string;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={pathname === item.href}
        tooltip={item.label}
        className="my-2 hover:bg-orange-500 hover:text-white py-3 px-2"
      >
        <Link href={item.href}>
          <span className="text-xl">{item.icon}</span>
          <span className="">{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const rbac = new RBAC(user);
  const isAdmin = rbac.hasRole('admin') || rbac.hasRole('super-admin');

  const menuItems = isAdmin ? adminMenuItems : artistMenuItems;

  // Filtrer les éléments de menu basés sur les permissions
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
        <div className="flex items-center justify-center space-x-3 mt-6 mb-4">
          <div className="rounded-xl flex items-center justify-center">
            <Image
              src="/images/logo_zouglou.png"
              className="w-32 h-32 object-cover object-center"
              width={128}
              height={128}
              alt="logo zouglou"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                // Si l'élément a des sous-menus
                if (item.children && item.children.length > 0) {
                  return (
                    <MenuItemWithSubmenu
                      key={item.label}
                      item={item}
                      pathname={pathname}
                      rbac={rbac}
                    />
                  );
                }

                // Élément de menu simple
                return (
                  <SimpleMenuItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}