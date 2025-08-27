'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ApiSong } from '@/shared/types/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
interface TrackListProps {
  tracks: ApiSong[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function TrackList({ tracks, onDelete, isDeleting }: TrackListProps) {
  const router = useRouter();
  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun track trouvé</p>
        <p className="text-gray-400">Commencez par ajouter votre premier track !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <Card key={track.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            {track.cover && (
              <Image
                src={track.cover}
                alt={track.title}
                className="w-16 h-16 rounded-lg object-cover mr-4"
                width={400}
                height={400}
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{track.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{track.artist.stage_name}</p>
              {track.album && (
                <p className="text-xs text-gray-500 mb-2">Album: {track.album.title}</p>
              )}
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  track.is_published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {track.is_published ? 'Publié' : 'Brouillon'}
                </span>
                <span className="text-xs text-gray-500">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/artist/tracks/${track.id}`)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Voir
              </Button>
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/artist/tracks/${track.id}?edit=true`)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Modifier
              </Button>
            </div>
            <Button
              size="sm"
              onClick={() => onDelete(track.id)}
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