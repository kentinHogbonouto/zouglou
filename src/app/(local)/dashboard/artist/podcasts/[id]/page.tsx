"use client";

import { ArtistRoute } from "@/components/auth/ProtectedRoute";
import { usePodcast, useUpdatePodcast, useDeletePodcast } from "@/hooks/usePodcastQuery";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { UpdatePodcastData } from "@/shared/types/api";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { Mic, Edit, Trash2, Users, Calendar, FileText, Plus, ArrowLeft, Save, X } from 'lucide-react';
import { EpisodeList } from '@/components/features/podcast/EpisodeList';
import { useUnifiedEpisodePlayer } from '@/hooks/useUnifiedEpisodePlayer';
import Image from "next/image";

export default function ArtistPodcastDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const podcastId = params.id as string;
  const isEditMode = searchParams.get('edit') === 'true';

  const { data: podcast, isLoading, error } = usePodcast(podcastId);
  const updatePodcast = useUpdatePodcast();
  const deletePodcast = useDeletePodcast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<UpdatePodcastData>({
    title: '',
    description: '',
    is_published: false
  });

  const { playEpisode, currentEpisode, isPlaying } = useUnifiedEpisodePlayer();

  // Initialiser le formulaire avec les données du podcast
  useEffect(() => {
    if (podcast) {
      setFormData({
        title: podcast.title,
        description: podcast.description,
        is_published: podcast.is_published
      });
    }
  }, [podcast]);

  const handleUpdatePodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podcast) return;

    try {
      await updatePodcast.mutateAsync({ id: podcastId, data: formData });
      router.push(`/dashboard/artist/podcasts/${podcastId}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePodcast.mutateAsync(podcastId);
      router.push('/dashboard/artist/podcasts');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleTogglePublish = async () => {
    if (!podcast) return;

    try {
      await updatePodcast.mutateAsync({
        id: podcastId,
        data: { is_published: !podcast.is_published },
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  if (isLoading) {
    return (
      <ArtistRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <Loading />
        </div>
      </ArtistRoute>
    );
  }

  if (error || !podcast) {
    return (
      <ArtistRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-slate-600" />
            </div>
            <h1 className="text-2xl font-light text-slate-800 mb-4">Podcast non trouvé</h1>
            <p className="text-slate-500 mb-6">Le podcast que vous recherchez n&apos;existe pas ou a été supprimé.</p>
            <Button
              onClick={() => router.push('/dashboard/artist/podcasts')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux podcasts
            </Button>
          </div>
        </div>
      </ArtistRoute>
    );
  }

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
                    onClick={() => router.push('/dashboard/artist/podcasts')}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Mic className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      {isEditMode ? 'Modifier le Podcast' : podcast.title}
                    </h1>
                    <p className="text-slate-500 text-base">Gérez votre podcast et ses épisodes</p>
                  </div>
                </div>
              </div>

              {!isEditMode && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => router.push(`/dashboard/artist/podcasts/${podcastId}/episode`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-200 border border-slate-200"
                  >
                    <FileText className="w-4 h-4" />
                    Gérer les épisodes
                  </Button>
                  <Button
                    onClick={() => router.push(`/dashboard/artist/podcasts/${podcastId}?edit=true`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 text-white font-medium rounded-lg hover:from-[#FE5200]/90 hover:to-[#FE5200] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    onClick={handleTogglePublish}
                    disabled={updatePodcast.isPending}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${podcast.is_published
                      ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800'
                      : 'bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white hover:from-[#005929]/90 hover:to-[#005929]'
                      }`}
                  >
                    {podcast.is_published ? 'Dépublier' : 'Publier'}
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
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100 pb-6">
                <CardTitle className="text-2xl font-medium text-slate-800 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-[#FE5200]" />
                  Modifier le Podcast
                </CardTitle>
                <p className="text-slate-500">Mettez à jour les informations de votre podcast</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleUpdatePodcast} className="space-y-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Titre du podcast</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border-slate-200 focus:border-[#FE5200] focus:ring-[#FE5200]/20"
                      placeholder="Titre du podcast"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description du podcast"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#FE5200] focus:ring-[#FE5200]/20 resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#FE5200]/5 to-[#FE5200]/10 rounded-lg border border-[#FE5200]/20">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="rounded border-slate-300 text-[#FE5200] focus:ring-[#FE5200]/20"
                    />
                    <label htmlFor="is_published" className="text-sm font-medium text-slate-700">
                      Publier ce podcast
                    </label>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                    <Button
                      type="button"
                      onClick={() => router.push(`/dashboard/artist/podcasts/${podcastId}`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={updatePodcast.isPending}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 text-white font-medium rounded-lg hover:from-[#FE5200]/90 hover:to-[#FE5200] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Save className="w-4 h-4" />
                      {updatePodcast.isPending ? 'Mise à jour...' : 'Mettre à jour'}
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
                            src={podcast.cover || '/images/podcast_default.jpg'}
                            alt={podcast.title}
                            className="w-full h-80 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
                            width={400}
                            height={400}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-4 rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110">
                              <Mic className="w-8 h-8 text-[#FE5200]" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="md:w-1/2 space-y-6">
                        <div>
                          <h2 className="text-3xl font-light text-slate-800 mb-2">{podcast.title}</h2>
                          <p className="text-lg text-slate-600 leading-relaxed">{podcast.description}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                            <Users className="w-5 h-5 text-[#005929]" />
                            <span className="text-slate-700">Abonnés: <span className="font-medium">{podcast.subscribers_count || 0}</span></span>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg">
                            <FileText className="w-5 h-5 text-[#005929]" />
                            <span className="text-slate-700">Épisodes: <span className="font-medium">{podcast.episodes_count || 0}</span></span>
                          </div>

                        </div>

                        <div className="pt-4 border-t border-slate-200">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${podcast.is_published
                            ? 'bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 text-[#005929] border border-[#005929]/20'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                            {podcast.is_published ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Liste des épisodes */}
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#005929]" />
                        Épisodes ({podcast.episodes?.length || 0})
                      </CardTitle>
                      <Button
                        onClick={() => router.push(`/dashboard/artist/podcasts/${podcastId}/episode`)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un épisode
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {podcast.episodes && podcast.episodes.length > 0 ? (
                      <div className="space-y-4">
                        <EpisodeList
                          episodes={podcast.episodes}
                          title="Épisodes du Podcast"
                          onPlay={playEpisode}
                          onView={(episode) => router.push(`/dashboard/artist/podcasts/${podcastId}/episode/${episode.id}`)}
                          onEdit={(episode) => router.push(`/dashboard/artist/podcasts/${podcastId}/episode/${episode.id}?edit=true`)}
                          isPlaying={isPlaying}
                          currentEpisodeId={currentEpisode?.id}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">Aucun épisode</h3>
                        <p className="text-slate-500 mb-4">Commencez par créer votre premier épisode</p>
                        <Button
                          onClick={() => router.push(`/dashboard/artist/podcasts/${podcastId}/episode`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200"
                        >
                          <Plus className="w-4 h-4" />
                          Créer un épisode
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
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
                          {new Date(podcast.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                        <span className="text-sm text-slate-600">Modifié le</span>
                        <span className="text-sm font-medium text-slate-800">
                          {new Date(podcast.updatedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            message={`Supprimer le podcast "${podcast.title}" ? Cette action est irréversible et supprimera également tous les épisodes associés.`}
            itemName={podcast.title}
          />


        </div>
      </div>
    </ArtistRoute>
  );
}