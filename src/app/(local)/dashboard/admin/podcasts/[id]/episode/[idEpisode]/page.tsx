"use client";

import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { usePodcastEpisode, useUpdatePodcastEpisode, useDeletePodcastEpisode } from "@/hooks/usePodcastQuery";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal, ModalHeader, ModalContent, ModalActions, ModalButton } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { UpdatePodcastEpisodeData } from "@/shared/types/api";
import { useUnifiedEpisodePlayer } from '@/hooks/useUnifiedEpisodePlayer';
import { Play, Pause, Headphones, Edit, Trash2, Calendar, Clock, Heart, Users, ArrowLeft, Save, X, BarChart3 } from 'lucide-react';
import Image from 'next/image';

export default function ArtistPodcastEpisodeDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const episodeId = params.idEpisode as string;
  const podcastId = params.id as string;
  const isEditMode = searchParams.get('edit') === 'true';

  const { data: episode, isLoading, error } = usePodcastEpisode(episodeId);
  const updateEpisode = useUpdatePodcastEpisode();
  const deleteEpisode = useDeletePodcastEpisode();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<UpdatePodcastEpisodeData>({
    title: '',
    description: '',
    duration: 0,
    is_published: false
  });

  const { playEpisode, currentEpisode, isPlaying } = useUnifiedEpisodePlayer();

  // Initialiser le formulaire avec les données de l'épisode
  useEffect(() => {
    if (episode) {
      setFormData({
        title: episode.title,
        description: episode.description,
        is_published: episode.is_published,
        duration: episode.duration,
      });
    }
  }, [episode]);

  const handleUpdateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!episode) return;

    try {
      await updateEpisode.mutateAsync({
        id: episodeId,
        data: {
          ...formData,
          file: audioFile || undefined,
        }
      });
      router.push(`/dashboard/admin/podcasts/${podcastId}/episode/${episodeId}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEpisode.mutateAsync(episodeId);
      router.push(`/dashboard/admin/podcasts/${podcastId}/episode`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleTogglePublish = async () => {
    if (!episode) return;

    try {
      await updateEpisode.mutateAsync({
        id: episodeId,
        data: { is_published: !episode.is_published },
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <Loading />
        </div>
      </AdminRoute>
    );
  }

  if (error || !episode) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-slate-600" />
            </div>
            <h1 className="text-2xl font-light text-slate-800 mb-4">Épisode non trouvé</h1>
            <p className="text-slate-500 mb-6">L&lsquo;épisode que vous recherchez n&lsquo;existe pas ou a été supprimé.</p>
            <Button
              onClick={() => router.push(`/dashboard/admin/podcasts/${podcastId}/episode`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux épisodes
            </Button>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/dashboard/admin/podcasts/${podcastId}/episode`)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Headphones className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      {isEditMode ? 'Modifier l\'Épisode' : episode.title}
                    </h1>
                    <p className="text-slate-500 text-base">Gérez votre épisode de podcast</p>
                  </div>
                </div>
              </div>

              {!isEditMode && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => router.push(`/dashboard/admin/podcasts/${podcastId}/episode/${episodeId}?edit=true`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 text-white font-medium rounded-lg hover:from-[#FE5200]/90 hover:to-[#FE5200] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    onClick={handleTogglePublish}
                    disabled={updateEpisode.isPending}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${episode.is_published
                      ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800'
                      : 'bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white hover:from-[#005929]/90 hover:to-[#005929]'
                      }`}
                  >
                    {episode.is_published ? 'Dépublier' : 'Publier'}
                  </Button>
                  <Button
                    onClick={() => setIsDeleteModalOpen(true)}
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
        <div className="max-w-7xl mx-auto px-8 py-8">
          {isEditMode ? (
            // Mode édition
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              
              <CardContent className="p-8">
                <form onSubmit={handleUpdateEpisode} className="space-y-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">Titre de l&apos;épisode</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border-slate-200 focus:border-[#FE5200] focus:ring-[#FE5200]/20 transition-all duration-200"
                      placeholder="Titre de l'épisode"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description de l'épisode"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:border-[#FE5200] focus:ring-[#FE5200]/20 resize-none transition-all duration-200"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Audio</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        setAudioFile(e.target.files?.[0] || null);
                        if (e.target.files?.[0]) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setFormData({ ...formData, duration: e.target?.result as unknown as number });
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#FE5200] file:to-[#FE5200]/90 file:text-white hover:file:from-[#FE5200]/90 hover:file:to-[#FE5200]"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#FE5200]/5 to-[#FE5200]/10 rounded-xl border border-[#FE5200]/20">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="rounded border-slate-300 text-[#FE5200] focus:ring-[#FE5200]/20"
                    />
                    <label htmlFor="is_published" className="text-sm font-medium text-slate-700">
                      Publier cet épisode
                    </label>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/50">
                    <Button
                      type="button"
                      onClick={() => router.push(`/dashboard/admin/podcasts/${podcastId}/episode/${episodeId}`)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateEpisode.isPending}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 text-white font-medium rounded-lg hover:from-[#FE5200]/90 hover:to-[#FE5200] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Save className="w-4 h-4" />
                      {updateEpisode.isPending ? 'Mise à jour...' : 'Mettre à jour'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            // Mode affichage
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Informations principales */}
              <div className="lg:col-span-3 space-y-6">
                {/* Carte principale avec couverture et infos */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Couverture */}
                      <div className="lg:w-2/5">
                        <div className="relative group">
                          <Image
                            src={episode?.cover || '/images/cover_default.jpg'}
                            alt={episode.title}
                            className="w-full h-96 rounded-2xl object-cover shadow-xl group-hover:scale-105 transition-transform duration-500"
                            width={400}
                            height={400}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center">
                            <button
                              onClick={() => playEpisode(episode)}
                              className="opacity-0 group-hover:opacity-100 bg-white/95 p-5 rounded-full shadow-2xl transition-all duration-300 hover:bg-white hover:scale-110"
                            >
                              {currentEpisode?.id === episode.id && isPlaying ? (
                                <Pause className="w-10 h-10 text-[#FE5200]" />
                              ) : (
                                <Play className="w-10 h-10 text-[#FE5200] ml-1" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="lg:w-3/5 space-y-6">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${episode.is_published
                              ? 'bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 text-[#005929] border border-[#005929]/20'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                              {episode.is_published ? 'Publié' : 'Brouillon'}
                            </span>
                            <span className="text-sm text-slate-500">Épisode #{episode.episode_number}</span>
                          </div>
                          <h2 className="text-4xl font-light text-slate-800 mb-4 leading-tight">{episode.title}</h2>
                          <p className="text-lg text-slate-600 leading-relaxed">{episode.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-xl border border-slate-200/50">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#005929]/5">
                              <Clock className="w-5 h-5 text-[#005929]" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Durée</p>
                              <p className="font-medium text-slate-800">{formatDuration(episode.duration)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-xl border border-slate-200/50">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200]/10 to-[#FE5200]/5">
                              <Calendar className="w-5 h-5 text-[#FE5200]" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Date de sortie</p>
                              <p className="font-medium text-slate-800">{new Date(episode.release_date).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bouton d'écoute principal */}
                        {episode.file && (
                          <div className="pt-4">
                            <Button
                              onClick={() => playEpisode(episode)}
                              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-xl hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                              {currentEpisode?.id === episode.id && isPlaying ? (
                                <Pause className="w-6 h-6" />
                              ) : (
                                <Play className="w-6 h-6" />
                              )}
                              {currentEpisode?.id === episode.id && isPlaying ? 'Mettre en pause' : 'Écouter l\'épisode'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Statistiques */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-100/50 pb-4 bg-gradient-to-r from-slate-50/50 to-white/50">
                    <CardTitle className="text-xl font-medium text-slate-800 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#005929]/5">
                        <BarChart3 className="w-6 h-6 text-[#005929]" />
                      </div>
                      Statistiques de Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-xl border border-slate-200/50">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#005929]/5">
                            <Play className="w-8 h-8 text-[#005929]" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Lectures</p>
                            <p className="text-2xl font-light text-slate-800">{episode.play_count || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-xl border border-slate-200/50">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-[#FE5200]/10 to-[#FE5200]/5">
                            <Heart className="w-8 h-8 text-[#FE5200]" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Likes</p>
                            <p className="text-2xl font-light text-slate-800">{episode.count_likes || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-xl border border-slate-200/50">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-slate-600/10 to-slate-600/5">
                            <Users className="w-8 h-8 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 font-medium">Auditeurs</p>
                            <p className="text-2xl font-light text-slate-800">{episode.unique_listeners || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar avec métadonnées et actions */}
              <div className="space-y-6">
                {/* Métadonnées */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-100/50 pb-4 bg-gradient-to-r from-slate-50/50 to-white/50">
                    <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#005929]/5">
                        <Calendar className="w-5 h-5 text-[#005929]" />
                      </div>
                      Métadonnées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-lg border border-slate-200/50">
                        <span className="text-sm text-slate-600">Créé le</span>
                        <span className="text-sm font-medium text-slate-800">
                          {new Date(episode.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-lg border border-slate-200/50">
                        <span className="text-sm text-slate-600">Modifié le</span>
                        <span className="text-sm font-medium text-slate-800">
                          {new Date(episode.updatedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Modal de confirmation de suppression */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          >
            <ModalHeader>
              <div className="flex items-center gap-3 p-4">
                <div>
                  <h2 className="text-2xl font-medium text-slate-800">Confirmer la suppression</h2>
                  <p className="text-slate-500">Supprimer l&apos;épisode &quot;{episode.title}&quot;</p>
                </div>
              </div>
            </ModalHeader>
            <ModalContent>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer cet épisode ? Cette action est irréversible.
                </p>
                <ModalActions>
                  <ModalButton
                    onClick={() => setIsDeleteModalOpen(false)}
                    variant="secondary"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </ModalButton>
                  <ModalButton
                    onClick={handleDelete}
                    variant="danger"
                    disabled={deleteEpisode.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteEpisode.isPending ? 'Suppression...' : 'Supprimer'}
                  </ModalButton>
                </ModalActions>
              </div>
            </ModalContent>
          </Modal>
        </div>


      </div>
    </AdminRoute>
  );
}