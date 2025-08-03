'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const stats = [
  {
    title: 'Écoutes totales',
    value: '1,234,567',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: '🎵',
  },
  {
    title: 'Abonnés',
    value: '45,678',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: '👥',
  },
  {
    title: 'Revenus du mois',
    value: '€2,450',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: '💰',
  },
  {
    title: 'Titres publiés',
    value: '23',
    change: '+2',
    changeType: 'positive' as const,
    icon: '📀',
  },
];

export function ArtistDashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <span className="text-2xl">{stat.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className={`text-xs ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} ce mois
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 