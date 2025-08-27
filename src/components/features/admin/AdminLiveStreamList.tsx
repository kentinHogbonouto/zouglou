import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminCreateLiveStreamModal } from './AdminCreateLiveStreamModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import Image from 'next/image';

interface LiveStream {
  id: string;
  title: string;
  artist: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  scheduledAt: string;
  duration?: number;
  viewers?: number;
  is_published: boolean;
  createdAt: string;
  thumbnail?: string;
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


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'En direct';
      case 'scheduled':
        return 'Programmé';
      case 'ended':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
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
          <h3 className="text-lg font-semibold text-slate-800">Live Streams</h3>
          <Button disabled>Créer un Live Stream</Button>
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
        <h3 className="text-lg font-semibold text-slate-800">Live Streams ({liveStreams.length})</h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Créer un Live Stream
        </Button>
      </div>

      {liveStreams.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-slate-500">Aucun live stream trouvé</p>
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
            <Card key={liveStream.id} className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                    {liveStream.thumbnail ? (
                      <Image
                        src={liveStream.thumbnail}
                        alt={liveStream.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <span className="text-2xl">📺</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{liveStream.title}</h4>
                  <p className="text-sm text-slate-600">
                    Artiste: {liveStream.artist} • Programmé le: {new Date(liveStream.scheduledAt).toLocaleDateString('fr-FR')}
                  </p>
                  {liveStream.description && (
                    <p className="text-sm text-slate-500 truncate">{liveStream.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(liveStream.status)}`}>
                      {getStatusText(liveStream.status)}
                    </span>
                    {liveStream.viewers && (
                      <span className="text-xs text-slate-500">
                        👥 {liveStream.viewers} spectateurs
                      </span>
                    )}
                    {liveStream.duration && (
                      <span className="text-xs text-slate-500">
                        ⏱️ {formatDuration(liveStream.duration)}
                      </span>
                    )}
                  </div>
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