import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminCreateEpisodeModal } from './AdminCreateEpisodeModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';

interface Episode {
  id: string;
  title: string;
  podcast: string;
  artist: string;
  description?: string;
  duration: number;
  is_published: boolean;
  createdAt: string;
  audio_file?: string;
}

interface AdminEpisodeListProps {
  episodes?: Episode[];
  isLoading?: boolean;
}

export function AdminEpisodeList({ episodes = [], isLoading = false }: AdminEpisodeListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deleteConfirmation = useDeleteConfirmation();

  const handleCreateEpisode = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implémenter l'appel API pour créer un épisode
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    try {
      // TODO: Implémenter l'appel API pour supprimer un épisode
      console.log('Suppression de l\'épisode:', episodeId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Épisodes</h3>
          <Button disabled>Créer un Épisode</Button>
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
        <h3 className="text-lg font-semibold text-slate-800">Épisodes ({episodes.length})</h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Créer un Épisode
        </Button>
      </div>

      {episodes.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-slate-500">Aucun épisode trouvé</p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Créer le premier épisode
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {episodes.map((episode) => (
            <Card key={episode.id} className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    <span className="text-2xl">🎧</span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{episode.title}</h4>
                  <p className="text-sm text-slate-600">
                    Podcast: {episode.podcast} • Artiste: {episode.artist} • Durée: {formatDuration(episode.duration)}
                  </p>
                  {episode.description && (
                    <p className="text-sm text-slate-500 truncate">{episode.description}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    Créé le {new Date(episode.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      episode.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {episode.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {}}
                    className={episode.is_published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {episode.is_published ? 'Dépublier' : 'Publier'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteConfirmation.showDeleteConfirmation(
                      episode.title,
                      'episode',
                      () => handleDeleteEpisode(episode.id)
                    )}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AdminCreateEpisodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEpisode}
        isSubmitting={isSubmitting}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={deleteConfirmation.hideDeleteConfirmation}
        onConfirm={deleteConfirmation.handleConfirm}
        message={deleteConfirmation.message}
        itemName={deleteConfirmation.itemName}
        isDeleting={false}
      />
    </div>
  );
}
