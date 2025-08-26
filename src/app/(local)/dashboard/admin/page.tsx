"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AdminDashboardStats } from '@/components/dashboard/admin/AdminDashboardStats';
import { UserManagement } from '@/components/dashboard/admin/UserManagement';
import { ContentModeration } from '@/components/dashboard/admin/ContentModeration';
import { SystemAnalytics } from '@/components/dashboard/admin/SystemAnalytics';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { WelcomeBanner } from '@/components/dashboard/artist/WelcomeBanner';
import { QuickActions } from '@/components/dashboard/artist/QuickActions';
import { useSongs, useAlbums, useAdminUsers } from '@/hooks';
import { useRouter } from 'next/navigation';
import { ApiArtist } from '@/shared/types';
import { ApiUser } from '@/hooks/useAdminQueries';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  // React Query hooks - avec gestion d'erreur pour les endpoints inexistants
  const { data: songsData } = useSongs({ page_size: 5 });
  const { data: albumsData } = useAlbums({ page_size: 5 });
  const { data: usersData } = useAdminUsers({ page_size: 5 });

  // Données récentes
  const recentSongs = songsData?.results?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];
  const recentAlbums = albumsData?.results?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];
  const recentUsers = usersData?.results?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];

  // Fonctions utilitaires pour extraire les noms d'artistes
  const getArtistName = (artist: ApiArtist) => {
    if (artist && typeof artist === 'object' && 'stage_name' in artist) return artist.stage_name;
    return 'Artiste inconnu';
  };

  const handleViewTrack = (trackId: string) => {
    router.push(`/dashboard/admin/tracks/${trackId}`);
  };

  const handleViewAlbum = (albumId: string) => {
    router.push(`/dashboard/admin/albums/${albumId}`);
  };


  const handleViewUser = (userId: string) => {
    router.push(`/dashboard/admin/user/${userId}`);
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                  Dashboard Administrateur
                </h1>
                <p className="text-slate-500 text-base">
                  Gérez votre plateforme de streaming africain
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Welcome Banner */}
          <div className="mb-8">
            <WelcomeBanner artistName={user?.full_name} lastLogin="il y a 2 heures" />
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <AdminDashboardStats />
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Management Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Gestion des utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <UserManagement recentUsers={recentUsers} onViewUser={handleViewUser} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Modération de contenu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ContentModeration />
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-medium text-slate-800">
                Analytics système
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <SystemAnalytics />
            </CardContent>
          </Card>

          {/* Recent Content Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Recent Tracks */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Tracks récents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {recentSongs.length > 0 ? (
                  <div className="space-y-3">
                    {recentSongs.map((song) => (
                      <div key={song.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🎵</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{song.title}</p>
                            <p className="text-sm text-slate-600">{getArtistName(song.artist)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewTrack(song.id)}
                          className="text-sm text-slate-500 hover:text-slate-700"
                        >
                          Voir →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    Aucun track récent
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Albums */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Albums récents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {recentAlbums.length > 0 ? (
                  <div className="space-y-3">
                    {recentAlbums.map((album) => (
                      <div key={album.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                            <span className="text-lg">💿</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{album.title}</p>
                            <p className="text-sm text-slate-600">{getArtistName(album.artist)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewAlbum(album.id)}
                          className="text-sm text-slate-500 hover:text-slate-700"
                        >
                          Voir →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    Aucun album récent
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </AdminRoute>
  );
} 