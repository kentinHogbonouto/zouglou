'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAlbum, useDeleteAlbum } from '@/hooks/useMusicQueries';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ApiSong } from '@/shared/types/api';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { useUnifiedMusicPlayer } from '@/hooks/useUnifiedMusicPlayer';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { Eye, Trash2, Music, Calendar, User, Tag, Clock, Play, Pause, MoreVertical, ArrowLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;

  const { data: album, isLoading, error } = useAlbum(albumId);
  const deleteAlbumMutation = useDeleteAlbum();

  const { playTrack, playTrackQueue, currentTrack, isPlaying } = useUnifiedMusicPlayer();
  const deleteConfirmation = useDeleteConfirmation();

  const handleDeleteAlbum = async () => {
    if (!album) return;

    try {
      await deleteAlbumMutation.mutateAsync(albumId);
      router.push('/dashboard/admin/albums');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatDuration = (duration: number) => {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: ApiSong) => {
    // Jouer l'album entier en commençant par cette piste
    if (album && album.songs && album.songs.length > 0) {
      const trackIndex = album.songs.findIndex(song => song.id === track.id);
      playTrackQueue(album.songs, trackIndex);
    } else {
      playTrack(track);
    }
  };

  const handleViewTrack = (track: ApiSong) => {
    router.push(`/dashboard/admin/tracks/${track.id}`);
  };

  if (error) return <div>Erreur lors du chargement de l&apos;album</div>;
  if (!album) return <div>Album non trouvé</div>;

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
                    onClick={() => router.push('/dashboard/admin/albums')}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Music className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      {album.title}
                    </h1>
                    <p className="text-slate-500 text-base">
                      Gérez votre album musical
                    </p>
                  </div>
                </div>
              </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => deleteConfirmation.showDeleteConfirmation(
                      album.title,
                      'album',
                      handleDeleteAlbum
                    )}
                    disabled={deleteAlbumMutation.isPending}
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
                            src={album.cover || '/images/cover_default.jpg'}
                            alt={album.title}
                            className="w-full h-80 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
                            width={400}
                            height={400}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                            <button
                              onClick={() => album.songs.length > 0 && handlePlayTrack(album.songs[0])}
                              className="opacity-0 group-hover:opacity-100 bg-white/90 p-4 rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110"
                            >
                              <Play className="w-8 h-8 text-[#005929] ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="md:w-1/2 space-y-6">
                        <div>
                          <h2 className="text-3xl font-light text-slate-800 mb-2">{album.title}</h2>
                          <p className="text-xl text-slate-600">{album.artist.stage_name}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                            <User className="w-5 h-5 text-[#005929]" />
                            <span className="text-slate-700">Artiste: <span className="font-medium">{album.artist.stage_name}</span></span>
                          </div>

                          {album.category && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                              <Tag className="w-5 h-5 text-[#005929]" />
                              <span className="text-slate-700">Catégorie: <span className="font-medium">{album.category?.name}</span></span>
                            </div>
                          )}

                           {album.genre && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                              <Tag className="w-5 h-5 text-[#005929]" />
                              <span className="text-slate-700">Genre: <span className="font-medium">{album.genre?.name}</span></span>
                            </div>
                          )}

                          <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                            <Clock className="w-5 h-5 text-[#005929]" />
                            <span className="text-slate-700">Durée totale: <span className="font-medium">{formatDuration(album.total_duration)}</span></span>
                          </div>
                        </div>

                        {album.description && (
                          <div className="bg-slate-50/50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Description</h4>
                            <p className="text-slate-600 leading-relaxed">{album.description}</p>
                          </div>
                        )}

                        <div className="pt-4 border-t border-slate-200">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${album.is_published
                            ? 'bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 text-[#005929] border border-[#005929]/20'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                            {album.is_published ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Liste des tracks */}
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                          <Music className="w-5 h-5 text-[#005929]" />
                          {album.songs && album.songs.length > 0 ? `Tracks (${album.songs.length})` : 'Track'}
                        </CardTitle>
                        <p className="text-slate-500 text-sm mt-1">
                          {album.songs && album.songs.length === 1 ? 'morceau' : 'morceaux'} dans cet album
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {album.songs && album.songs.length > 0 ? (
                      <div className="space-y-3">
                        {album.songs.map((song, index) => (
                          <div
                            key={song.id}
                            className={`group flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50/50 transition-all duration-200 cursor-pointer ${currentTrack?.id === song.id ? 'bg-slate-50/80' : ''
                              }`}
                            onClick={() => handlePlayTrack(song)}
                          >
                            {/* Numéro */}
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-sm font-medium text-slate-600">
                              {index + 1}
                            </div>

                            {/* Couverture */}
                            <div className="relative group/cover">
                              <Image
                                src={album.cover || '/images/cover_default.jpg'}
                                alt={song.title}
                                className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover/cover:shadow-md transition-all duration-300"
                                width={48}
                                height={48}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/20 rounded-lg transition-all duration-300 flex items-center justify-center">
                                {currentTrack?.id === song.id && isPlaying ? (
                                  <Pause className="w-4 h-4 text-white opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300" />
                                ) : (
                                  <Play className="w-4 h-4 text-white opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300" />
                                )}
                              </div>
                            </div>

                            {/* Informations */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-800 truncate group-hover:text-slate-900 transition-colors duration-200">
                                {song.title}
                              </div>
                              <div className="text-xs text-slate-500 truncate">
                                {song.artist.stage_name}
                              </div>
                            </div>

                            {/* Genre */}
                            <div className="hidden md:block w-32">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                {song.genre?.name || 'Pop'}
                              </span>
                            </div>

                            {/* Durée */}
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(song.duration)}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayTrack(song);
                                }}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 rounded-lg"
                              >
                                {currentTrack?.id === song.id && isPlaying ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-slate-100 transition-all duration-200 rounded-lg"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewTrack(song);
                                    }}
                                    className="cursor-pointer hover:bg-slate-50 transition-colors duration-200"
                                  >
                                    <Eye className="w-4 h-4 mr-3 text-slate-600" />
                                    <span className="text-slate-700">Voir les détails</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Music className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">Aucun track dans cet album</h3>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar avec métadonnées */}
              <div className="space-y-6">
                {/* Statistiques */}
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                      <Music className="w-5 h-5 text-[#005929]" />
                      Statistiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                        <span className="text-sm text-slate-600">Nombre de tracks</span>
                        <span className="text-lg font-medium text-slate-800">{album.songs ? album.songs.length : 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                        <span className="text-sm text-slate-600">Durée totale</span>
                        <span className="text-lg font-medium text-slate-800">{formatDuration(album.total_duration)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                          {new Date(album.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                        <span className="text-sm text-slate-600">Modifié le</span>
                        <span className="text-sm font-medium text-slate-800">
                          {new Date(album.updatedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={deleteConfirmation.hideDeleteConfirmation}
        onConfirm={deleteConfirmation.handleConfirm}
        message={deleteConfirmation.message}
        itemName={deleteConfirmation.itemName}
        isDeleting={deleteAlbumMutation.isPending}
      />
    </AdminRoute>
  );
}