"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArtistDashboardStats } from '@/components/dashboard/artist/ArtistDashboardStats';
import { RevenueChart } from '@/components/dashboard/artist/RevenueChart';
import { AnalyticsOverview } from '@/components/dashboard/artist/AnalyticsOverview';
import { QuickActions } from '@/components/dashboard/artist/QuickActions';
import { WelcomeBanner } from '@/components/dashboard/artist/WelcomeBanner';
import { ArtistRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { ApiSong } from '@/shared/types/api';
import { useArtistSongs } from '@/hooks';
import { useUnifiedMusicPlayer } from '@/hooks/useUnifiedMusicPlayer';
import { MusicList } from '@/components/features/MusicList';
import { useRouter } from 'next/navigation';

export default function ArtistDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: songsData } = useArtistSongs(user?.artist_profile?.id || '');

  const { playTrackQueue, currentTrack, isPlaying } = useUnifiedMusicPlayer();


  const songs = songsData?.results?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];
  
  const handlePlayAllTracks = (track: ApiSong) => {
    // Jouer toutes les pistes de la page
    const trackIndex = songs.findIndex(song => song.id === track.id);
    playTrackQueue(songs, trackIndex);
  };

  const handleViewTrack = (track: ApiSong) => {
    router.push(`/dashboard/artist/tracks/${track.id}`);
  };

  return (
    <ArtistRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                  Dashboard Artiste
                </h1>
                <p className="text-slate-500 text-base">
                  Gérez votre musique et suivez vos performances
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          {/* Welcome Banner */}
          <div className="mb-8">
            <WelcomeBanner artistName={user?.full_name} />
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <ArtistDashboardStats />
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Revenus des 30 derniers jours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RevenueChart />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Vue d&apos;ensemble
                </CardTitle>
              </CardHeader> 
              <CardContent className="p-6">
                <AnalyticsOverview />
              </CardContent>
            </Card>
          </div>

          {/* Recent Tracks Section */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-medium text-slate-800">
                Titres récents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
            {songs.length > 0 ? (
            <div className="space-y-4">
              <MusicList
                tracks={songs}
                title="Mes Tracks"
                onPlay={handlePlayAllTracks}
                onView={handleViewTrack}            
                isPlaying={isPlaying}
                currentTrackId={currentTrack?.id}
              />
            </div>
            ) : (
              <div className="text-center text-slate-500">
                Aucun titre trouvé
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ArtistRoute>
  );
} 