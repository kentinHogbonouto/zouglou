import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';

interface Podcast {
  id: string;
  title: string;
  artist: string;
  description?: string;
}

interface AdminPodcastSelectProps {
  selectedPodcast: string;
  onPodcastChange: (podcastId: string) => void;
  selectedArtist?: string;
  className?: string;
}

export function AdminPodcastSelect({ 
  selectedPodcast, 
  onPodcastChange, 
  selectedArtist,
  className = '' 
}: AdminPodcastSelectProps) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Simuler le chargement des podcasts
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        // TODO: Remplacer par un vrai appel API
        const mockPodcasts: Podcast[] = [
          { id: '1', title: 'Afro Talk Show', artist: 'John Doe', description: 'Discussions sur la culture africaine' },
          { id: '2', title: 'Musique & Culture', artist: 'Jane Smith', description: 'Exploration des musiques africaines' },
          { id: '3', title: 'Stories d\'Afrique', artist: 'Bob Johnson', description: 'Histoires et contes africains' },
          { id: '4', title: 'Tech Africa', artist: 'John Doe', description: 'Technologie en Afrique' },
          { id: '5', title: 'Cuisine Africaine', artist: 'Jane Smith', description: 'Recettes traditionnelles' },
        ];
        setPodcasts(mockPodcasts);
      } catch (error) {
        console.error('Erreur lors du chargement des podcasts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  // Filtrer les podcasts par artiste si un artiste est sélectionné
  let filteredPodcasts = podcasts;
  if (selectedArtist) {
    filteredPodcasts = podcasts.filter(podcast => podcast.artist === selectedArtist);
  }

  // Filtrer par terme de recherche
  filteredPodcasts = filteredPodcasts.filter(podcast =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    podcast.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-slate-700">
          Sélectionner un podcast *
        </label>
        <div className="animate-pulse bg-slate-200 h-10 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-slate-700">
        Sélectionner un podcast *
      </label>
      
      <Input
        type="text"
        placeholder="Rechercher un podcast..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <select
        value={selectedPodcast}
        onChange={(e) => onPodcastChange(e.target.value)}
        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        required
        disabled={!!selectedArtist && filteredPodcasts.length === 0}
      >
        <option value="">
          {selectedArtist && filteredPodcasts.length === 0 
            ? 'Aucun podcast pour cet artiste' 
            : 'Choisir un podcast'}
        </option>
        {filteredPodcasts.map((podcast) => (
          <option key={podcast.id} value={podcast.id}>
            {podcast.title} - {podcast.artist}
          </option>
        ))}
      </select>

      {selectedPodcast && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            Podcast sélectionné: {podcasts.find(p => p.id === selectedPodcast)?.title}
          </p>
          {podcasts.find(p => p.id === selectedPodcast)?.description && (
            <p className="text-xs text-green-600 mt-1">
              {podcasts.find(p => p.id === selectedPodcast)?.description}
            </p>
          )}
        </div>
      )}

      {selectedArtist && filteredPodcasts.length === 0 && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Aucun podcast trouvé pour l&apos;artiste sélectionné. Veuillez d&apos;abord créer un podcast pour cet artiste.
          </p>
        </div>
      )}
    </div>
  );
}
