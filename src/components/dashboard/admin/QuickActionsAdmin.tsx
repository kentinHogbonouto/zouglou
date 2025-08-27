'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { 
  Music, 
  Users, 
  Mic,
  Disc3,
  User,
  CreditCard
} from 'lucide-react';

const quickActions = [
  {
    title: 'Nouveau titre',
    description: 'Uploader une nouvelle chanson',
    icon: Music,
    color: 'from-[#005929] to-[#005929]/90',
    bgColor: 'bg-gradient-to-br from-[#005929]/5 to-[#005929]/10',
    href: '/dashboard/admin/tracks'
  },
  {
    title: 'Gestion des utilisateurs',
    description: 'Gérer les utilisateurs',
    icon: Users,
    color: 'from-[#FE5200] to-[#FE5200]/90',
    bgColor: 'bg-gradient-to-br from-[#FE5200]/5 to-[#FE5200]/10',
    href: '/dashboard/admin/user'
  },
  {
    title: 'Podcast',
    description: 'Créer un épisode',
    icon: Mic,
    color: 'from-[#005929] to-[#005929]/90',
    bgColor: 'bg-gradient-to-br from-[#005929]/5 to-[#005929]/10',
    href: '/dashboard/admin/podcasts'
  },
  {
    title: 'Gestion des albums',
    description: 'Gérer les albums',
    icon: Disc3,
    color: 'from-[#FE5200] to-[#FE5200]/90',
    bgColor: 'bg-gradient-to-br from-[#FE5200]/5 to-[#FE5200]/10',
    href: '/dashboard/admin/albums'
  },
  {
    title: 'Subscriptions',
    description: 'Gérer les abonnements',
    icon: CreditCard,
    color: 'from-[#005929] to-[#005929]/90',
    bgColor: 'bg-gradient-to-br from-[#005929]/5 to-[#005929]/10',
    href: '/dashboard/admin/subscription'
  },
  {
    title: 'Profil',
    description: 'Voir le profil',
    icon: User,
    color: 'from-[#FE5200] to-[#FE5200]/90',
    bgColor: 'bg-gradient-to-br from-[#FE5200]/5 to-[#FE5200]/10',
    href: '/dashboard/admin/profile'
  }
];

export function QuickActionsAdmin() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-0.5 h-6 bg-gradient-to-b from-[#005929] to-[#FE5200] rounded-full"></div>
        <h3 className="text-lg font-medium text-slate-800">Actions rapides</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card 
              key={index}
              className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105 ${action.bgColor}`}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-slate-800 text-sm group-hover:text-slate-900 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
