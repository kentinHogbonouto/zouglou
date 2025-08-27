import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminCreateTrackModal } from './AdminCreateTrackModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { useCreateSong, useUpdateSong, useRealDeleteSong } from '@/hooks';
import { ApiSong, CreateSongData } from '@/shared/types/api';
import Image from 'next/image';

interface AdminTrackListProps {
  tracks?: ApiSong[];
  isLoading?: boolean;
}

export function AdminTrackList({ tracks = [], isLoading = false }: AdminTrackListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // React Query mutations
  const createSongMutation = useCreateSong();
  const updateSongMutation = useUpdateSong();
  const deleteSongMutation = useRealDeleteSong();
  
  const deleteConfirmation = useDeleteConfirmation();

  const handleCreateTrack = async (data: CreateSongData) => {
    try {
      await createSongMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleTogglePublish = async (track: ApiSong) => {
    try {
      await updateSongMutation.mutateAsync({
        id: track.id,
        data: { is_published: !track.is_published }
      });
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    try {
      await deleteSongMutation.mutateAsync(trackId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Tracks</h3>
          <Button disabled>Créer un Track</Button>
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
        <h3 className="text-lg font-semibold text-slate-800">Tracks ({tracks.length})</h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Créer un Track
        </Button>
      </div>

      {tracks.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-slate-500">Aucun track trouvé</p>
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
            <Card key={track.id} className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    {track.cover ? (
                      <Image
                        width={100}
                        height={100}
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🎵</span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{track.title}</h4>
                  <p className="text-sm text-slate-600">
                    Artiste: {track?.artist?.stage_name} • Album: {track?.album?.title} • Genre: {track?.genre?.name} • Durée: {formatDuration(track.duration)}
                  </p>
                  <p className="text-xs text-slate-500">
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
                    onClick={() => handleTogglePublish(track)}
                    disabled={updateSongMutation.isPending}
                    className={track.is_published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {updateSongMutation.isPending ? '...' : (track.is_published ? 'Dépublier' : 'Publier')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteConfirmation.showDeleteConfirmation(
                      track.title,
                      'track',
                      () => handleDeleteTrack(track.id)
                    )}
                    disabled={deleteSongMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleteSongMutation.isPending ? '...' : 'Supprimer'}
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
        isSubmitting={createSongMutation.isPending}
      />

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
  );
} 