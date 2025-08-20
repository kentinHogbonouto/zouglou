import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminCreateTrackModal } from './AdminCreateTrackModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration: number;
  is_published: boolean;
  createdAt: string;
}

interface AdminTrackListProps {
  tracks?: Track[];
  isLoading?: boolean;
}

export function AdminTrackList({ tracks = [], isLoading = false }: AdminTrackListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deleteConfirmation = useDeleteConfirmation();

  const handleCreateTrack = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implémenter l'appel API pour créer un track
     
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      // TODO: Implémenter l'appel API pour supprimer un track
      console.log('Suppression du track:', trackId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Tracks</h3>
          <Button disabled>Créer un Track</Button>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tracks ({tracks.length})</h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Créer un Track
        </Button>
      </div>

      {tracks.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">Aucun track trouvé</p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Créer le premier track
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tracks.map((track) => (
            <Card key={track.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{track.title}</h4>
                  <p className="text-sm text-gray-600">
                    Artiste: {track.artist} • Album: {track.album || 'Aucun'} • Genre: {track.genre || 'Non défini'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Créé le {new Date(track.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      track.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {track.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {}}
                    className={track.is_published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {track.is_published ? 'Dépublier' : 'Publier'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteConfirmation.showDeleteConfirmation(
                      track.title,
                      'track',
                      () => handleDeleteTrack(track.id)
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

      <AdminCreateTrackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTrack}
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