'use client';

import { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useSong, useRealDeleteSong } from '@/hooks/useMusicQueries';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { useUnifiedMusicPlayer } from '@/hooks/useUnifiedMusicPlayer';

import { Trash2, Play, Pause, Music, Calendar, Clock, User, Tag, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
export default function TrackDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const trackId = params.id as string;
  const isEditMode = searchParams.get('edit') === 'true';
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  const { data: song, isLoading, error } = useSong(trackId);
  const deleteSongMutation = useRealDeleteSong();
  const { playTrack, currentTrack, isPlaying } = useUnifiedMusicPlayer();



  const handleDeleteSong = async () => {
    if (!song) return;

    try {
      await deleteSongMutation.mutateAsync(trackId);
      router.push('/dashboard/admin/tracks');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = () => {
    if (song) {
      playTrack(song);
    }
  };


  if (error) return <div>Erreur lors du chargement du track</div>;
  if (!song) return <div>Track non trouvé</div>;

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push('/dashboard/admin/tracks')}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Music className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      {isEditMode ? 'Modifier le Track' : song.title}
                    </h1>
                    <p className="text-slate-500 text-base">
                      Gérez les tracks musical de la plateforme
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handlePlayTrack}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-4 h-4" />
                  Écouter
                </Button>
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={deleteSongMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? <Loading /> : (

          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Informations principales */}
              <div className="lg:col-span-2 space-y-6">
                {/* Carte principale avec couverture et infos */}
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm overflow-hidden">
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Couverture */}
                      <div className="md:w-1/2">
                        <div className="relative group">
                          <Image
                            src={song.album?.cover || '/images/cover_default.jpg'}
                            alt={song.title}
                            className="w-full h-80 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
                            width={400}
                            height={400}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                            <button
                              onClick={handlePlayTrack}
                              className="opacity-0 group-hover:opacity-100 bg-white/90 p-4 rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110"
                            >
                              {currentTrack?.id === song.id && isPlaying ? (
                                <Pause className="w-8 h-8 text-[#005929]" />
                              ) : (
                                <Play className="w-8 h-8 text-[#005929] ml-1" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="md:w-1/2 space-y-6">
                        <div>
                          <h2 className="text-3xl font-light text-slate-800 mb-2">{song.title}</h2>
                          <p className="text-xl text-slate-600">{song.artist.stage_name}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                            <User className="w-5 h-5 text-[#005929]" />
                            <span className="text-slate-700">Artiste: <span className="font-medium">{song.artist.stage_name}</span></span>
                          </div>

                          {song.album && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                              <Music className="w-5 h-5 text-[#005929]" />
                              <span className="text-slate-700">Album: <span className="font-medium">{song.album.title}</span></span>
                            </div>
                          )}

                          {song.genre && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                              <Tag className="w-5 h-5 text-[#005929]" />
                              <span className="text-slate-700">Genre: <span className="font-medium">{song.genre.name}</span></span>
                            </div>
                          )}

                          <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                            <Clock className="w-5 h-5 text-[#005929]" />
                            <span className="text-slate-700">Durée: <span className="font-medium">{formatDuration(song.duration)}</span></span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${song.is_published
                            ? 'bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 text-[#005929] border border-[#005929]/20'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                            {song.is_published ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar avec métadonnées */}
              <div className="space-y-6">
                {/* Métadonnées */}
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#005929]" />
                      Métadonnées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                        <span className="text-sm text-slate-600">Créé le</span>
                        <span className="text-sm font-medium text-slate-800">
                          {new Date(song.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteSong}
          message={`Supprimer le titre "${song.title}" ? Cette action est irréversible.`}
          itemName={song.title}
        />
      </div>
    </AdminRoute>
  );
}