'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthQueries';
import { useArtistSongs, useCreateSong, useDeleteSong } from '@/hooks/useMusicQueries';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { CreateTrackModal } from '@/components/features/artist';
import { MusicList } from '@/components/features/MusicList';
import { ApiSong, CreateSongData } from '@/shared/types/api';
import { ArtistRoute } from '@/components/auth/ProtectedRoute';
import { useUnifiedMusicPlayer } from '@/hooks/useUnifiedMusicPlayer';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { useRouter } from 'next/navigation';
import { Music, Heart, Plus, BarChart3, Clock } from 'lucide-react';

export default function ArtistTracksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: songsData, isLoading, error } = useArtistSongs(user?.artist_profile?.id || '');
  const createSongMutation = useCreateSong();
  const deleteSongMutation = useDeleteSong();

  const { playTrackQueue, currentTrack, isPlaying } = useUnifiedMusicPlayer();
  const deleteConfirmation = useDeleteConfirmation();

  const handleCreateSong = async (data: CreateSongData) => {
    setShowCreateForm(false);
    await createSongMutation.mutateAsync(data);
  };

  

  

  const handlePlayAllTracks = (track: ApiSong) => {
    // Jouer toutes les pistes de la page
    const trackIndex = songs.findIndex(song => song.id === track.id);
    playTrackQueue(songs, trackIndex);
  };

  const handleViewTrack = (track: ApiSong) => {
    router.push(`/dashboard/artist/tracks/${track.id}`);
  };


  if (isLoading) return <Loading />;
  if (error) return <div>Erreur lors du chargement des tracks</div>;

  const songs = songsData?.results || [];

  return (
    <ArtistRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Music className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      Mes Tracks
                    </h1>
                    <p className="text-slate-500 text-base">
                      Gérez votre bibliothèque musicale et partagez vos créations
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Nouveau Track
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Music className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Tracks</p>
                    <p className="text-2xl font-light text-slate-800">{songs.length}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Publiés</p>
                    <p className="text-2xl font-light text-slate-800">{songs.filter(s => s.is_published).length}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Durée totale</p>
                    <p className="text-2xl font-light text-slate-800">
                      {Math.floor(songs.reduce((acc, song) => acc + song.duration, 0) / 60)}:{(songs.reduce((acc, song) => acc + song.duration, 0) % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Heart className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Likes totaux</p>
                    <p className="text-2xl font-light text-slate-800">
                      {songs.reduce((acc, song) => acc + (song.count_likes || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Modal de création */}
          <CreateTrackModal
            isOpen={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateSong}
            isSubmitting={createSongMutation.isPending}
            currentArtist={user?.artist_profile?.id || ''}
          />

          {/* Liste des tracks */}
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
            <Card className="relative overflow-hidden p-12 border-0 shadow-sm bg-white/60 backdrop-blur-sm text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#005929]/5 via-transparent to-[#FE5200]/5"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Music className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">Aucun track</h3>
                <p className="text-slate-500 mb-6">Commencez par ajouter votre premier track musical</p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  Créer votre premier track
                </Button>
              </div>
            </Card>
          )}

          {/* Modal de confirmation de suppression */}
          <DeleteConfirmationModal
            isOpen={deleteConfirmation.isOpen}
            onClose={deleteConfirmation.hideDeleteConfirmation}
            onConfirm={deleteConfirmation.handleConfirm}
            message={deleteConfirmation.message}
            itemName={deleteConfirmation.itemName}
            isDeleting={deleteSongMutation.isPending}
          />
        </div>
      </div>
    </ArtistRoute>
  );
}