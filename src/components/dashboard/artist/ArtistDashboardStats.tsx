'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, Users, DollarSign, Music } from 'lucide-react';

const stats = [
  {
    title: 'Écoutes totales',
    value: '1,234,567',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: Music,
    color: 'from-[#005929] to-[#005929]/90',
    bgColor: 'bg-gradient-to-br from-[#005929]/5 to-[#005929]/10',
  },
  {
    title: 'Abonnés',
    value: '45,678',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'from-[#FE5200] to-[#FE5200]/90',
    bgColor: 'bg-gradient-to-br from-[#FE5200]/5 to-[#FE5200]/10',
  },
  {
    title: 'Revenus du mois',
    value: '€2,450',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'from-[#005929] to-[#005929]/90',
    bgColor: 'bg-gradient-to-br from-[#005929]/5 to-[#005929]/10',
  },
  {
    title: 'Titres publiés',
    value: '23',
    change: '+2',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: 'from-[#FE5200] to-[#FE5200]/90',
    bgColor: 'bg-gradient-to-br from-[#FE5200]/5 to-[#FE5200]/10',
  },
];

export function ArtistDashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className={`group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105 ${stat.bgColor}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-light text-slate-800 group-hover:text-slate-900 transition-colors">
                {stat.value}
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-[#005929]' : 'bg-red-500'
                }`}></div>
                <p className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-[#005929]' : 'text-red-600'
                }`}>
                  {stat.change} ce mois
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 