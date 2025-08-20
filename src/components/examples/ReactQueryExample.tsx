'use client';

import { useState } from 'react';
import { useTracks, usePopularTracks, useApiMutation } from '@/hooks/useApiQueries';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { toast } from 'sonner';
import { PaginatedResponse } from '@/shared/types';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  releaseDate: string;
}

export function ReactQueryExample() {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  // Récupération des tracks avec pagination
  const {
    data: tracksData,
    isLoading: tracksLoading,
    error: tracksError,
    isFetching: tracksFetching,
  } = useTracks(page, limit) as { data: PaginatedResponse<Track> | undefined; isLoading: boolean; error: Error | null; isFetching: boolean };

  // Récupération des tracks populaires
  const {
    data: popularTracksData,
    isLoading: popularLoading,
    error: popularError,
  } = usePopularTracks() as { data: Track[] | undefined; isLoading: boolean; error: Error | null };

  // Mutation pour créer un nouveau track
  const createTrackMutation = useApiMutation<Track, Partial<Track>>('/tracks/', {
    onSuccess: () => {
      toast.success('Track créé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création du track');
    },
  });

  const handleCreateTrack = () => {
    const newTrack = {
      title: 'Nouveau Track',
      artist: 'Artiste Test',
      duration: 180,
      genre: 'Zouglou',
      releaseDate: new Date().toISOString(),
    };

    createTrackMutation.mutate(newTrack);
  };

  if (tracksLoading || popularLoading) {
    return <Loading />;
  }

  if (tracksError || popularError) {
    return (
      <div className="text-red-500 p-4">
        Erreur lors du chargement des données: {tracksError?.message || popularError?.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Section Tracks avec pagination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Tracks (Page {page})
            {tracksFetching && <span className="text-sm text-gray-500">Actualisation...</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tracksData?.data?.length ? (
            <div className="space-y-4">
              {tracksData.data.map((track: Track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{track.title}</h4>
                    <p className="text-sm text-gray-600">{track.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{track.genre}</p>
                    <p className="text-xs text-gray-400">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  Précédent
                </Button>
                
                <span className="text-sm text-gray-600">
                  Page {page} sur {Math.ceil((tracksData?.total || 0) / limit)}
                </span>
                
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil((tracksData?.total || 0) / limit)}
                  variant="outline"
                  size="sm"
                >
                  Suivant
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucun track trouvé</p>
          )}
        </CardContent>
      </Card>

      {/* Section Tracks populaires */}
      <Card>
        <CardHeader>
          <CardTitle>Tracks populaires</CardTitle>
        </CardHeader>
        <CardContent>
          {popularTracksData?.length ? (
            <div className="space-y-3">
              {popularTracksData.slice(0, 3).map((track: Track) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold">🔥</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{track.title}</h4>
                    <p className="text-sm text-gray-600">{track.artist}</p>
                  </div>
                  <span className="text-xs text-gray-400">{track.genre}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucun track populaire</p>
          )}
        </CardContent>
      </Card>

      {/* Section Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={handleCreateTrack}
              disabled={createTrackMutation.isPending}
              className="w-full"
            >
              {createTrackMutation.isPending ? 'Création...' : 'Créer un nouveau track'}
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Recharger la page
            </Button>
          </div>
          
          {/* Statistiques de cache */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Statistiques</h4>
            <div className="text-sm space-y-1">
              <p>Total tracks: {tracksData?.total || 0}</p>
              <p>Tracks par page: {limit}</p>
              <p>Page actuelle: {page}</p>
              <p>En cours de chargement: {tracksFetching ? 'Oui' : 'Non'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 