import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminCreateAlbumModal } from './AdminCreateAlbumModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';

interface Album {
  id: string;
  title: string;
  artist: string;
  description?: string;
  total_tracks: number;
  total_duration: number;
  is_published: boolean;
  createdAt: string;
}

interface AdminAlbumListProps {
  albums?: Album[];
  isLoading?: boolean;
}

export function AdminAlbumList({ albums = [], isLoading = false }: AdminAlbumListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deleteConfirmation = useDeleteConfirmation();

  const handleCreateAlbum = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implémenter l'appel API pour créer un album
    
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    try {
      // TODO: Implémenter l'appel API pour supprimer un album
      console.log('Suppression de l\'album:', albumId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleTogglePublish = async () => {
    try {
      // TODO: Implémenter l'appel API pour modifier le statut de publication
     
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Albums</h3>
          <Button disabled>Créer un Album</Button>
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
        <h3 className="text-lg font-semibold">Albums ({albums.length})</h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Créer un Album
        </Button>
      </div>

      {albums.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">Aucun album trouvé</p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Créer le premier album
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {albums.map((album) => (
            <Card key={album.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{album.title}</h4>
                  <p className="text-sm text-gray-600">
                    Artiste: {album.artist} • {album.total_tracks} pistes • {Math.round(album.total_duration / 60)} min
                  </p>
                  {album.description && (
                    <p className="text-sm text-gray-500 mt-1">{album.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Créé le {new Date(album.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      album.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {album.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleTogglePublish()}
                    className={album.is_published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {album.is_published ? 'Dépublier' : 'Publier'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteConfirmation.showDeleteConfirmation(
                      album.title,
                      'album',
                      () => handleDeleteAlbum(album.id)
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

      <AdminCreateAlbumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAlbum}
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