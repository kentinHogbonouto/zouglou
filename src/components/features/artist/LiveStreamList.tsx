import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ApiLiveStream } from '@/shared/types/api';

interface LiveStreamListProps {
  liveStreams: ApiLiveStream[];
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
  onEnd: (id: string) => void;
  isDeleting: boolean;
  isStarting: boolean;
  isEnding: boolean;
}

export function LiveStreamList({ 
  liveStreams, 
  onDelete, 
  onStart, 
  onEnd, 
  isDeleting, 
  isStarting, 
  isEnding 
}: LiveStreamListProps) {
  if (liveStreams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun live stream trouvé</p>
        <p className="text-gray-400">Commencez par créer votre premier live stream !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {liveStreams.map((liveStream) => (
        <Card key={liveStream.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{liveStream.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{liveStream.artist}</p>
              {liveStream.description && (
                <p className="text-xs text-gray-500 mb-2">{liveStream.description}</p>
              )}
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  liveStream.is_live 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {liveStream.is_live ? '🔴 En direct' : '⏸️ En pause'}
                </span>
                <span className="text-xs text-gray-500">
                  {liveStream.viewers_count || 0} spectateurs
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {liveStream.is_live ? (
                <Button
                  size="sm"
                  onClick={() => onEnd(liveStream.id)}
                  disabled={isEnding}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Arrêter
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onStart(liveStream.id)}
                  disabled={isStarting}
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
              onClick={() => onDelete(liveStream.id)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? '...' : 'Supprimer'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
} 