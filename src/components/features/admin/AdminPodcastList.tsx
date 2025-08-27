import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminCreatePodcastModal } from './AdminCreatePodcastModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { useCreatePodcast, useUpdatePodcast, useDeletePodcast } from '@/hooks';
import { ApiPodcast, CreatePodcastData } from '@/shared/types';
import Image from 'next/image';

interface AdminPodcastListProps {
  podcasts?: ApiPodcast[];
  isLoading?: boolean;
}

export function AdminPodcastList({ podcasts = [], isLoading = false }: AdminPodcastListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // React Query mutations
  const createPodcastMutation = useCreatePodcast();
  const updatePodcastMutation = useUpdatePodcast();
  const deletePodcastMutation = useDeletePodcast();
  
  const deleteConfirmation = useDeleteConfirmation();

  const handleCreatePodcast = async (data: CreatePodcastData) => {
    try {
      await createPodcastMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleTogglePublish = async (podcast: ApiPodcast) => {
    try {
      await updatePodcastMutation.mutateAsync({
        id: podcast.id,
        data: { is_published: !podcast.is_published }
      });
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  const handleDeletePodcast = async (podcastId: string) => {
    try {
      await deletePodcastMutation.mutateAsync(podcastId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Podcasts</h3>
          <Button disabled>Créer un Podcast</Button>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Podcasts ({podcasts.length})</h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Créer un Podcast
        </Button>
      </div>

      {podcasts.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-slate-500">Aucun podcast trouvé</p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Créer le premier podcast
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {podcasts.map((podcast) => (
            <Card key={podcast.id} className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                    {podcast.cover ? (
                      <Image
                        src={podcast.cover}
                        alt={podcast.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <span className="text-2xl">🎙️</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{podcast.title}</h4>
                  <p className="text-sm text-slate-600">
                    Artiste: {podcast?.artist?.stage_name} • {podcast.episodes_count || 0} épisodes
                  </p>
                  {podcast.description && (
                    <p className="text-sm text-slate-500 truncate">{podcast.description}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    Créé le {new Date(podcast.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      podcast.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {podcast.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleTogglePublish(podcast)}
                    disabled={updatePodcastMutation.isPending}
                    className={podcast.is_published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {updatePodcastMutation.isPending ? '...' : (podcast.is_published ? 'Dépublier' : 'Publier')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteConfirmation.showDeleteConfirmation(
                      podcast.title,
                      'podcast',
                      () => handleDeletePodcast(podcast.id)
                    )}
                    disabled={deletePodcastMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deletePodcastMutation.isPending ? '...' : 'Supprimer'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AdminCreatePodcastModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePodcast}
        isSubmitting={createPodcastMutation.isPending}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={deleteConfirmation.hideDeleteConfirmation}
        onConfirm={deleteConfirmation.handleConfirm}
        message={deleteConfirmation.message}
        itemName={deleteConfirmation.itemName}
        isDeleting={deletePodcastMutation.isPending}
      />
    </div>
  );
}
