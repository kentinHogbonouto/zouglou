'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AdminLiveStreamList } from '@/components/features/admin/AdminLiveStreamList';
import { AdminRoute } from '@/components/auth/ProtectedRoute';

interface LiveStream {
  id: string;
  title: string;
  artist: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  scheduledAt: string;
  duration?: number;
  viewers?: number;
  is_published: boolean;
  createdAt: string;
  thumbnail?: string;
}

export default function AdminLivePage() {
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        // TODO: Remplacer par un vrai appel API
        const mockLiveStreams: LiveStream[] = [
          {
            id: '1',
            title: 'Concert Live - Afro Vibes',
            artist: 'John Doe',
            description: 'Concert live de musique africaine moderne',
            status: 'scheduled',
            scheduledAt: '2024-02-15T20:00:00Z',
            is_published: true,
            createdAt: '2024-01-15T10:30:00Z',
            thumbnail: '/images/cover_default.jpg'
          },
          {
            id: '2',
            title: 'DJ Session - Coupé Décalé',
            artist: 'Jane Smith',
            description: 'Session DJ avec les meilleurs hits',
            status: 'live',
            scheduledAt: '2024-01-20T22:00:00Z',
            duration: 3600,
            viewers: 1250,
            is_published: true,
            createdAt: '2024-01-14T15:45:00Z'
          },
          {
            id: '3',
            title: 'Interview - Culture Africaine',
            artist: 'Bob Johnson',
            description: 'Interview sur la culture africaine',
            status: 'ended',
            scheduledAt: '2024-01-10T19:00:00Z',
            duration: 1800,
            viewers: 850,
            is_published: false,
            createdAt: '2024-01-13T09:20:00Z'
          }
        ];
        setLiveStreams(mockLiveStreams);
      } catch (error) {
        console.error('Erreur lors du chargement des live streams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveStreams();
  }, []);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                  Gestion des Live Streams
                </h1>
                <p className="text-slate-500 text-base">
                  Créez et gérez les live streams pour tous les artistes
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium">
                  📊 Statistiques
                </button>
                <button className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium">
                  ⚡ Actions rapides
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Stats Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">📺</span>
              Live Streams de la plateforme
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <span className="text-2xl">📺</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Total Live Streams</p>
                      <p className="text-2xl font-bold text-slate-800">{liveStreams.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-full">
                      <span className="text-2xl">🔴</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">En direct</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {liveStreams.filter(l => l.status === 'live').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Programmés</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {liveStreams.filter(l => l.status === 'scheduled').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Spectateurs totaux</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {liveStreams.reduce((sum, stream) => sum + (stream.viewers || 0), 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Live Streams List */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-medium text-slate-800">
                Liste des Live Streams
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AdminLiveStreamList liveStreams={liveStreams} isLoading={isLoading} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              Actions rapides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200">
                <span className="text-2xl mr-3">📺</span>
                Créer un Live Stream
              </button>
              <button className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                <span className="text-2xl mr-3">📊</span>
                Voir les statistiques
              </button>
              <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                <span className="text-2xl mr-3">🔄</span>
                Synchroniser
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 