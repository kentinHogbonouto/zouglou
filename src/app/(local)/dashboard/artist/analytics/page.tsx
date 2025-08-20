'use client';

import { ArtistRoute } from '@/components/auth/ProtectedRoute';
import { ModernPageLayout } from '@/components/dashboard/artist/ModernPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  TrendingUp, 
  Users, 
  Play, 
  Heart, 
  Share2, 
  BarChart3,
  Globe,
  Music
} from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    {
      label: 'Écoutes totales',
      value: '1,234,567',
      icon: Play
    },
    {
      label: 'Nouveaux abonnés',
      value: '+2,847',
      icon: Users
    },
    {
      label: 'Likes reçus',
      value: '45,678',
      icon: Heart
    },
    {
      label: 'Partages',
      value: '12,345',
      icon: Share2
    }
  ];

  const topTracks = [
    { title: 'Ma Chanson Hit', plays: '234,567', growth: '+12.5%' },
    { title: 'Nouveau Single', plays: '189,234', growth: '+8.2%' },
    { title: 'Album Favori', plays: '156,789', growth: '+15.3%' },
    { title: 'Collaboration', plays: '123,456', growth: '+5.7%' }
  ];

  const audienceData = [
    { country: 'France', percentage: 35 },
    { country: 'Côte d\'Ivoire', percentage: 28 },
    { country: 'Sénégal', percentage: 18 },
    { country: 'Canada', percentage: 12 },
    { country: 'Autres', percentage: 7 }
  ];

  return (
    <ArtistRoute>
      <ModernPageLayout
        title="Analytics"
        description="Suivez vos performances et comprenez votre audience"
        icon={BarChart3}
        stats={stats}
      >
        {/* Graphiques et données détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Tracks */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                <Music className="w-5 h-5 text-slate-600" />
                Top Tracks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topTracks.map((track, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{track.title}</p>
                        <p className="text-sm text-slate-500">{track.plays} écoutes</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">{track.growth}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audience géographique */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-600" />
                Audience géographique
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {audienceData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700">{item.country}</span>
                      <span className="text-slate-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-slate-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphique de tendances */}
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-600" />
              Tendances des 30 derniers jours
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500">Graphique interactif à venir</p>
                <p className="text-sm text-slate-400">Intégration avec une bibliothèque de graphiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ModernPageLayout>
    </ArtistRoute>
  );
}