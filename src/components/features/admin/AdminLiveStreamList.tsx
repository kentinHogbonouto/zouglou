import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminCreateLiveStreamModal } from './AdminCreateLiveStreamModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';

interface LiveStream {
  id: string;
  title: string;
  description?: string;
  artist: string;
  stream_url: string;
  is_live: boolean;
  viewers_count: number;
  createdAt: string;
}

interface AdminLiveStreamListProps {
  liveStreams?: LiveStream[];
  isLoading?: boolean;
}

export function AdminLiveStreamList({ liveStreams = [], isLoading = false }: AdminLiveStreamListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deleteConfirmation = useDeleteConfirmation();

    const handleCreateLiveStream = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implémenter l'appel API pour créer un live stream
     
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLiveStream = async (liveStreamId: string) => {
    try {
      // TODO: Implémenter l'appel API pour supprimer un live stream
      console.log('Suppression du live stream:', liveStreamId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Live Streams</h3>
          <Button disabled>Créer un Live Stream</Button>
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
        <h3 className="text-lg font-semibold">Live Streams ({liveStreams.length})</h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Créer un Live Stream
        </Button>
      </div>

      {liveStreams.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">Aucun live stream trouvé</p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Créer le premier live stream
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {liveStreams.map((liveStream) => (
            <Card key={liveStream.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{liveStream.title}</h4>
                  <p className="text-sm text-gray-600">
                    Artiste: {liveStream.artist} • {liveStream.viewers_count} spectateurs
                  </p>
                  {liveStream.description && (
                    <p className="text-sm text-gray-500 mt-1">{liveStream.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Créé le {new Date(liveStream.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      liveStream.is_live
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {liveStream.is_live ? 'En direct' : 'Hors ligne'}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {}}
                    className={liveStream.is_live ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}
                  >
                    {liveStream.is_live ? 'Arrêter' : 'Démarrer'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteConfirmation.showDeleteConfirmation(
                      liveStream.title,
                      'live',
                      () => handleDeleteLiveStream(liveStream.id)
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

      <AdminCreateLiveStreamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLiveStream}
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