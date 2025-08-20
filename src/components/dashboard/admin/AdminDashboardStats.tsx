'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const stats = [
  {
    title: 'Utilisateurs totaux',
    value: '12,456',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: '👥',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Utilisateurs actifs sur la plateforme'
  },
  {
    title: 'Artistes vérifiés',
    value: '1,234',
    change: '+8.7%',
    changeType: 'positive' as const,
    icon: '🎤',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Artistes avec compte vérifié'
  },
  {
    title: 'Tracks publiés',
    value: '45,678',
    change: '+22.1%',
    changeType: 'positive' as const,
    icon: '🎵',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-100',
    description: 'Tracks disponibles sur la plateforme'
  },
  {
    title: 'Revenus du mois',
    value: '€89,432',
    change: '+18.5%',
    changeType: 'positive' as const,
    icon: '💰',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Revenus générés ce mois'
  },
  {
    title: 'Streams actifs',
    value: '156',
    change: '+12.3%',
    changeType: 'positive' as const,
    icon: '📺',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-100',
    description: 'Streams en direct actuellement'
  },
  {
    title: 'Signalements',
    value: '23',
    change: '-5.2%',
    changeType: 'negative' as const,
    icon: '⚠️',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Contenus signalés ce mois'
  }
];

export function AdminDashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-2xl overflow-hidden group"
        >
          <CardHeader className={`bg-gradient-to-r ${stat.color} text-white rounded-t-2xl`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">
                {stat.title}
              </CardTitle>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="flex items-center mb-3">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">ce mois</span>
            </div>
            <p className="text-xs text-gray-600 mb-4">{stat.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(100, Math.abs(parseFloat(stat.change)) * 8)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 