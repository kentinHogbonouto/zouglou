"use client"

import '../../globals.css'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { UnifiedPlayerProvider } from '@/components/providers/UnifiedPlayerProvider';
import { UnifiedPlayer } from '@/components/layout/UnifiedPlayer';
import { Button } from '@/components/ui';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDownIcon } from 'lucide-react';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/providers/ToastProvider';

const inter = Inter({ subsets: ['latin'] })

// Separate component for the header that uses auth hooks
function DashboardHeader() {
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12  w-full">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger />
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 w-full justify-between">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="my-auto">
              <Bell size={16} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent my-auto">
                  <Avatar>
                    <AvatarImage src={ user?.artist_profile?.profile_image || "/images/avatar.jpg"} alt="Profile image" />
                  </Avatar>
                  <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${user?.default_role}/profile`)}>
                    Profile
                  </DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
            <UnifiedPlayerProvider>
              <SidebarProvider>
                <div className="flex min-h-screen w-full">
                  <DashboardSidebar />
                  <SidebarInset className="w-full">
                    <DashboardHeader />
                    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6 w-full pb-20">
                      {children}
                    </div>
                  </SidebarInset>
                </div>
                <UnifiedPlayer />
              </SidebarProvider>
            </UnifiedPlayerProvider>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
} 