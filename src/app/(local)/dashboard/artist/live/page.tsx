'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthQueries';
import {
  useArtistLiveStreams,
  useCreateLiveStream,
  useDeleteLiveStream,
  useStartLiveStream,
  useEndLiveStream
} from '@/hooks/useNotificationQueries';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { Modal, ModalButton, ModalActions } from '@/components/ui/Modal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { CreateLiveStreamData } from '@/shared/types/api';
import { ArtistRoute } from '@/components/auth/ProtectedRoute';

export default function ArtistLivePage() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateLiveStreamData>>({});

  const { data: liveStreamsData, isLoading, error } = useArtistLiveStreams(user?.id || '');
  const createLiveStreamMutation = useCreateLiveStream();
  const deleteLiveStreamMutation = useDeleteLiveStream();
  const startLiveStreamMutation = useStartLiveStream();
  const endLiveStreamMutation = useEndLiveStream();
  const deleteConfirmation = useDeleteConfirmation();

  const handleCreateLiveStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.stream_url) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await createLiveStreamMutation.mutateAsync({
        ...formData as CreateLiveStreamData,
      });
      setShowCreateForm(false);
      setFormData({});
    } catch (error) {
      console.error('Erreur lors de la création du live stream:', error);
    }
  };

  const handleDeleteLiveStream = async (id: string) => {
    try {
      await deleteLiveStreamMutation.mutateAsync(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleStartLiveStream = async (id: string) => {
    try {
      await startLiveStreamMutation.mutateAsync(id);
    } catch (error) {
      console.error('Erreur lors du démarrage du live:', error);
    }
  };

  const handleEndLiveStream = async (id: string) => {
    try {
      await endLiveStreamMutation.mutateAsync(id);
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du live:', error);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Erreur lors du chargement des live streams</div>;

  const liveStreams = liveStreamsData?.results || [];

  return (
    <ArtistRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Live Streams</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Créer un Live Stream
          </Button>
        </div>

        {/* Modal de création */}
        <Modal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          size="lg"
        >
          <form onSubmit={handleCreateLiveStream} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
                <Input
                value={formData.stream_url || ''}
                onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                placeholder="rtmp://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zouglou-green-500 focus:ring-zouglou-green-500"
                placeholder="Description du live stream..."
              />
            </div>

            <ModalActions>
              <ModalButton
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Annuler
              </ModalButton>
              <ModalButton
                type="submit"
                variant="primary"
                disabled={createLiveStreamMutation.isPending}
              >
                {createLiveStreamMutation.isPending ? 'Création...' : 'Créer le Live Stream'}
              </ModalButton>
            </ModalActions>
          </form>
        </Modal>

        {/* Liste des live streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveStreams.map((liveStream) => (
            <Card key={liveStream.id} className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{liveStream.title}</h3>
                {liveStream.description && (
                  <p className="text-sm text-gray-600 mb-2">{liveStream.description}</p>
                )}
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${liveStream.is_live
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {liveStream.is_live ? 'EN DIRECT' : 'Hors ligne'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {liveStream.viewers_count} spectateurs
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-500">
                  <strong>URL:</strong> {liveStream.stream_url}
                </div>
                {liveStream.started_at && (
                  <div className="text-xs text-gray-500">
                    <strong>Démarré:</strong> {new Date(liveStream.started_at).toLocaleString('fr-FR')}
                  </div>
                )}
                {liveStream.ended_at && (
                  <div className="text-xs text-gray-500">
                    <strong>Terminé:</strong> {new Date(liveStream.ended_at).toLocaleString('fr-FR')}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {liveStream.is_live ? (
                    <Button
                      size="sm"
                      onClick={() => handleEndLiveStream(liveStream.id)}
                      disabled={endLiveStreamMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Arrêter
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleStartLiveStream(liveStream.id)}
                      disabled={startLiveStreamMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Démarrer
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => window.open(`/dashboard/artist/live/${liveStream.id}`, '_blank')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Voir
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={() => deleteConfirmation.showDeleteConfirmation(
                  liveStream.title,
                  'live',
                  () => handleDeleteLiveStream(liveStream.id)
                )}
                  disabled={deleteLiveStreamMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteLiveStreamMutation.isPending ? '...' : 'Supprimer'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {liveStreams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun live stream trouvé</p>
            <p className="text-gray-400">Commencez par créer votre premier live stream !</p>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        <DeleteConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={deleteConfirmation.hideDeleteConfirmation}
          onConfirm={deleteConfirmation.handleConfirm}
          message={deleteConfirmation.message}
          itemName={deleteConfirmation.itemName}
          isDeleting={deleteLiveStreamMutation.isPending}
        />
      </div>
    </ArtistRoute>
  );
}