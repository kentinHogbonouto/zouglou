'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const systemMetrics: SystemMetric[] = [
  {
    name: 'Uptime',
    value: 99.9,
    unit: '%',
    status: 'good',
    trend: 'up',
    change: 0.1
  },
  {
    name: 'Temps de réponse',
    value: 2.3,
    unit: 's',
    status: 'good',
    trend: 'down',
    change: -0.5
  },
  {
    name: 'Streams actifs',
    value: 156,
    unit: '',
    status: 'good',
    trend: 'up',
    change: 12
  },
  {
    name: 'Utilisation CPU',
    value: 65,
    unit: '%',
    status: 'warning',
    trend: 'up',
    change: 5
  },
  {
    name: 'Utilisation mémoire',
    value: 78,
    unit: '%',
    status: 'warning',
    trend: 'up',
    change: 8
  },
  {
    name: 'Utilisation stockage',
    value: 45,
    unit: '%',
    status: 'good',
    trend: 'stable',
    change: 0
  }
];

export function SystemAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analytics système</h3>
          <p className="text-sm text-gray-600">Surveillance des performances et ressources</p>
        </div>
        <div className="flex space-x-2">
          {(['1h', '24h', '7d', '30d'] as const).map((period) => (
            <Button
              key={period}
              size="sm"
              variant={selectedPeriod === period ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {systemMetrics.map((metric, index) => (
          <Card key={index} className={`${getBackgroundColor(metric.status)} border`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                <span className={`text-lg ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                </span>
              </div>
              <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                {metric.value}{metric.unit}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {metric.change > 0 ? '+' : ''}{metric.change}% ce mois
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilisation des ressources */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Utilisation des ressources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.slice(3).map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                    <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                      {metric.value}{metric.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                        metric.status === 'good' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, metric.value)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: 'Il y a 2 min', event: 'Nouveau stream démarré', type: 'success' },
                { time: 'Il y a 5 min', event: 'Utilisateur banni', type: 'warning' },
                { time: 'Il y a 10 min', event: 'Track publié', type: 'info' },
                { time: 'Il y a 15 min', event: 'Signalement reçu', type: 'error' },
                { time: 'Il y a 20 min', event: 'Sauvegarde automatique', type: 'success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.event}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions système */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-medium text-blue-900 mb-4">Actions système</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              🔄 Redémarrer
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              💾 Sauvegarder
            </Button>
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
              ⚙️ Maintenance
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              📊 Rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 