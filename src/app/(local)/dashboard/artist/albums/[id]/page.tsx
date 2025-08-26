'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAlbum, useUpdateAlbum, useDeleteAlbum, useCreateSong } from '@/hooks/useMusicQueries';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { ApiSong, CreateSongData, UpdateAlbumData } from '@/shared/types/api';
import { ArtistRoute } from '@/components/auth/ProtectedRoute';
import { useUnifiedMusicPlayer } from '@/hooks/useUnifiedMusicPlayer';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { Eye, Edit, Trash2, Music, Plus, Calendar, User, Tag, Clock, Play, Pause, MoreVertical, ArrowLeft } from 'lucide-react';
import { CreateTrackModal } from '@/components/features/artist/CreateTrackModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GenreSelect } from '@/components/ui/GenreSelect';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function AlbumDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const albumId = params.id as string;
  const isEditMode = searchParams.get('edit') === 'true';

  const [formData, setFormData] = useState<Partial<UpdateAlbumData>>({});
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [showCreateTrackModal, setShowCreateTrackModal] = useState(false);

  const { data: album, isLoading, error } = useAlbum(albumId);
  const { user } = useAuth();
  const updateAlbumMutation = useUpdateAlbum();
  const deleteAlbumMutation = useDeleteAlbum();
  const createSongMutation = useCreateSong();

  const { playTrack, playTrackQueue, currentTrack, isPlaying } = useUnifiedMusicPlayer();
  const deleteConfirmation = useDeleteConfirmation();

  // Initialiser le formulaire avec les données de l'album
  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title,
        category: album.category,
        genre: album.genre,
        description: album.description,
        is_published: album.is_published,
        cover_image: undefined,
      });
    }
  }, [album]);

  const handleUpdateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!album) return;

    try {
      const updateData: UpdateAlbumData = { ...formData };
      if (selectedCover) updateData.cover_image = selectedCover;

      await updateAlbumMutation.mutateAsync({
        id: albumId,
        data: updateData,
      });

      // Retourner au mode affichage
      router.push(`/dashboard/artist/albums/${albumId}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'album:', error);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!album) return;
    try {
      await deleteAlbumMutation.mutateAsync(albumId).then(() => {
        router.back();
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleTogglePublish = async () => {
    if (!album) return;

    try {
      await updateAlbumMutation.mutateAsync({
        id: albumId,
        data: { is_published: !album.is_published },
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
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
    router.push(`/dashboard/artist/tracks/${track.id}`);
  };

  const handleAddTrack = () => {
    setShowCreateTrackModal(true);
  };

  const handleCreateTrack = async (data: CreateSongData) => {
    try {
      setTimeout(() => {
        setShowCreateTrackModal(false);
      }, 2000);
      await createSongMutation.mutateAsync({
        ...data,
        album: albumId,
      });

    } catch (error) {
      console.error('Erreur lors de la création du track:', error);
    }
  };

  if (error) return <div>Erreur lors du chargement de l&apos;album</div>;
  if (!album) return <div></div>;

  return (
    <ArtistRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push('/dashboard/artist/albums')}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Music className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      {isEditMode ? 'Modifier Album' : album.title}
                    </h1>
                    <p className="text-slate-500 text-base">
                      Gérez votre album musical
                    </p>
                  </div>
                </div>
              </div>

              {!isEditMode && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAddTrack}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un Track
                  </Button>
                  <Button
                    onClick={() => router.push(`/dashboard/artist/albums/${albumId}?edit=true`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 text-white font-medium rounded-lg hover:from-[#FE5200]/90 hover:to-[#FE5200] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    onClick={handleTogglePublish}
                    disabled={updateAlbumMutation.isPending}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${album.is_published
                      ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800'
                      : 'bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white hover:from-[#005929]/90 hover:to-[#005929]'
                      }`}
                  >
                    {album.is_published ? 'Dépublier' : 'Publier'}
                  </Button>
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
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? <Loading /> : (
        <div className="max-w-7xl mx-auto px-8 py-8">
          {isEditMode ? (
            // Mode édition
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100 pb-6">
                <CardTitle className="text-2xl font-medium text-slate-800 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-[#005929]" />
                  Modifier l&apos;Album
                </CardTitle>
                <p className="text-slate-500">Mettez à jour les informations de votre album</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleUpdateAlbum} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Titre de l&apos;album</label>
                      <Input
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                        placeholder="Titre de l&apos;album"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date de sortie
                      </label>
                      <Input
                        type="date"
                        value={formData.release_date || ''}
                        onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                        className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Genre</label>
                      <GenreSelect
                        value={formData.genre || ''}
                        onChange={(value) => setFormData({ ...formData, genre: value })}
                        placeholder="Sélectionner un genre"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#005929] focus:ring-[#005929]/20 resize-none"
                      placeholder="Description de l&apos;album..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Nouvelle image de couverture (optionnel)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-[#005929]/50 transition-colors">
                      <div className="text-center">

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedCover(e.target.files?.[0] || null)}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#005929] file:to-[#005929]/90 file:text-white hover:file:from-[#005929]/90 hover:file:to-[#005929]"
                        />
                      </div>
                    </div>
                    {album.cover && (
                      <div className="flex items-center gap-2 p-3 bg-slate-50/50 rounded-lg">
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          Image actuelle: {album.cover.split('/').pop()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#005929]/5 to-[#005929]/10 rounded-lg border border-[#005929]/20">
                    <input
                      type="checkbox"
                      checked={formData.is_published || false}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                    />
                    <span className="text-sm font-medium text-slate-700">Publier cet album</span>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                    <Button
                      type="button"
                      onClick={() => router.push(`/dashboard/artist/albums/${albumId}`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-200"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateAlbumMutation.isPending}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {updateAlbumMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            // Mode affichage
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
                              <span className="text-slate-700">Catégorie: <span className="font-medium">{album.category}</span></span>
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
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs text-center font-medium bg-slate-100 text-slate-600">
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
                        <p className="text-slate-500 mb-6">Commencez par ajouter votre premier morceau !</p>
                        <Button
                          onClick={handleAddTrack}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter votre premier track
                        </Button>
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
          )}
        </div>
        )}
      </div>

      {/* Modal de création de track */}
      <CreateTrackModal
        isOpen={showCreateTrackModal}
        onClose={() => setShowCreateTrackModal(false)}
        onSubmit={handleCreateTrack}
        isSubmitting={createSongMutation.isPending}
        currentArtist={user?.artist_profile?.id || ''}
        preSelectedAlbum={albumId}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={deleteConfirmation.hideDeleteConfirmation}
        onConfirm={deleteConfirmation.handleConfirm}
        message={deleteConfirmation.message}
        itemName={deleteConfirmation.itemName}
        isDeleting={deleteAlbumMutation.isPending}
      />
    </ArtistRoute>
  );
}