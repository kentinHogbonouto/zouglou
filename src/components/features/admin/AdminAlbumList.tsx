import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminCreateAlbumModal } from './AdminCreateAlbumModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { useCreateAlbum, useUpdateAlbum, useDeleteAlbum } from '@/hooks';
import { ApiAlbum, ApiArtist, CreateAlbumData } from '@/shared/types';
import Image from 'next/image';

interface AdminAlbumListProps {
  albums?: ApiAlbum[];
  isLoading?: boolean;
}

export function AdminAlbumList({ albums = [], isLoading = false }: AdminAlbumListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // React Query mutations
  const createAlbumMutation = useCreateAlbum();
  const updateAlbumMutation = useUpdateAlbum();
  const deleteAlbumMutation = useDeleteAlbum();
  
  const deleteConfirmation = useDeleteConfirmation();

  const handleCreateAlbum = async (data: CreateAlbumData) => {
    try {
      await createAlbumMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleTogglePublish = async (album: ApiAlbum) => {
    try {
      await updateAlbumMutation.mutateAsync({
        id: album.id,
        data: { is_published: !album.is_published }
      });
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    try {
      await deleteAlbumMutation.mutateAsync(albumId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getArtistName = (artist: ApiArtist) => {
    if (artist && typeof artist === 'object' && 'stage_name' in artist) return artist.stage_name;
    return 'Artiste inconnu';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Albums</h3>
          <Button disabled>Créer un Album</Button>
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
        <h3 className="text-lg font-semibold text-slate-800">Albums ({albums.length})</h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Créer un Album
        </Button>
      </div>

      {albums.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-slate-500">Aucun album trouvé</p>
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
            <Card key={album.id} className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                    {album.cover ? (
                      <Image
                        src={album.cover}
                        alt={album.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <span className="text-2xl">💿</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{album.title}</h4>
                  <p className="text-sm text-slate-600">
                    Artiste: {getArtistName(album.artist)} • {album.total_tracks || 0} tracks
                  </p>
                  {album.description && (
                    <p className="text-sm text-slate-500 truncate">{album.description}</p>
                  )}
                  <p className="text-xs text-slate-500">
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
                    onClick={() => handleTogglePublish(album)}
                    disabled={updateAlbumMutation.isPending}
                    className={album.is_published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {updateAlbumMutation.isPending ? '...' : (album.is_published ? 'Dépublier' : 'Publier')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteConfirmation.showDeleteConfirmation(
                      album.title,
                      'album',
                      () => handleDeleteAlbum(album.id)
                    )}
                    disabled={deleteAlbumMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {deleteAlbumMutation.isPending ? '...' : 'Supprimer'}
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
        isSubmitting={createAlbumMutation.isPending}
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
    </div>
  );
} 