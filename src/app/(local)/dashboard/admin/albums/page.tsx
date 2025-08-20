'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AdminAlbumList } from '@/components/features/admin/AdminAlbumList';
import { AdminNavigation } from '@/components/dashboard/admin/AdminNavigation';
import { AdminRoute } from '@/components/auth/ProtectedRoute';

interface Album {
  id: string;
  title: string;
  artist: string;
  description?: string;
  total_tracks: number;
  total_duration: number;
  is_published: boolean;
  createdAt: string;
}

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        // TODO: Remplacer par un vrai appel API
        const mockAlbums: Album[] = [
          {
            id: '1',
            title: 'Afro Vibes',
            artist: 'John Doe',
            description: 'Une collection de rythmes africains modernes',
            total_tracks: 12,
            total_duration: 3600,
            is_published: true,
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            title: 'Ivoire Sound',
            artist: 'Jane Smith',
            description: 'Les meilleurs sons de Côte d\'Ivoire',
            total_tracks: 8,
            total_duration: 2400,
            is_published: false,
            createdAt: '2024-01-14T15:45:00Z'
          },
          {
            id: '3',
            title: 'Modern African',
            artist: 'Bob Johnson',
            description: 'Fusion de sons traditionnels et modernes',
            total_tracks: 15,
            total_duration: 4500,
            is_published: true,
            createdAt: '2024-01-13T09:20:00Z'
          }
        ];
        setAlbums(mockAlbums);
      } catch (error) {
        console.error('Erreur lors du chargement des albums:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Gestion des Albums</h1>
                <p className="text-green-100">Créez et gérez les albums pour tous les artistes</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 font-medium">
                  📊 Statistiques
                </button>
                <button className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium">
                  ⚡ Actions rapides
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8">
          <AdminNavigation />
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">💿</span>
              Albums de la plateforme
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <span className="text-2xl">💿</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Albums</p>
                      <p className="text-2xl font-bold text-gray-900">{albums.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Publiés</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {albums.filter(a => a.is_published).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Brouillons</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {albums.filter(a => !a.is_published).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Tracks</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {albums.reduce((sum, album) => sum + album.total_tracks, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle className="flex items-center text-xl">
                <span className="mr-3">💿</span>
                Liste des Albums
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AdminAlbumList albums={albums} isLoading={isLoading} />
            </CardContent>
          </Card>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              Actions rapides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                <span className="text-2xl mr-3">💿</span>
                Créer un Album
              </button>
              <button className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200">
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