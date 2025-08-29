"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { WelcomeBanner } from '@/components/dashboard/artist/WelcomeBanner';
import { QuickActionsAdmin } from '@/components/dashboard/admin/QuickActionsAdmin';
import { useSongs, useAlbums } from '@/hooks';
import { useRouter } from 'next/navigation';
import { ApiArtist } from '@/shared/types';
import { MusicList } from '@/components/features';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  // React Query hooks - avec gestion d'erreur pour les endpoints inexistants
  const { data: songsData } = useSongs({ page_size: 5 });
  const { data: albumsData } = useAlbums({ page_size: 5 });

  // Données récentes
  const recentSongs = songsData?.results?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];
  const recentAlbums = albumsData?.results?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];

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


  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
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
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          {/* Welcome Banner */}
          <div className="mb-8">
            <WelcomeBanner artistName={user?.full_name} lastLogin="il y a 2 heures" />
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <QuickActionsAdmin />
          </div>

          {/* Recent Content Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Recent Tracks */}
            {recentSongs.length > 0 ? (
              <div className="space-y-3">
                <MusicList
                  tracks={recentSongs}
                  title="Titres récents de la plateforme"
                  onPlay={(track) => handleViewTrack(track.id)}
                  onView={(track) => handleViewTrack(track.id)}
                />
              </div>
            ) : (
              <div className="text-center text-slate-500">
                Aucun titre récent
              </div>
            )}

            {/* Recent Albums */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Albums récents de la plateforme
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {recentAlbums.length > 0 ? (
                  <div className="space-y-3">
                    {recentAlbums.map((album) => (
                      <div key={album.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                            <Image src={album.cover || '/images/cover_default.jpg'} alt={album.title} width={40} height={40} className='w-10 h-10 object-cover rounded-full' />
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