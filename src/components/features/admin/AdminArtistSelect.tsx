import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';

interface Artist {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface AdminArtistSelectProps {
  selectedArtist: string;
  onArtistChange: (artistId: string) => void;
  className?: string;
}

export function AdminArtistSelect({ 
  selectedArtist, 
  onArtistChange, 
  className = '' 
}: AdminArtistSelectProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Simuler le chargement des artistes
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        // TODO: Remplacer par un vrai appel API
        const mockArtists: Artist[] = [
          { id: '1', firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com' },
          { id: '2', firstName: 'Jane', lastName: 'Smith', username: 'janesmith', email: 'jane@example.com' },
          { id: '3', firstName: 'Bob', lastName: 'Johnson', username: 'bobjohnson', email: 'bob@example.com' },
        ];
        setArtists(mockArtists);
      } catch (error) {
        console.error('Erreur lors du chargement des artistes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const filteredArtists = artists.filter(artist =>
    artist.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          Sélectionner un artiste *
        </label>
        <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Sélectionner un artiste *
      </label>
      
      <Input
        type="text"
        placeholder="Rechercher un artiste..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <select
        value={selectedArtist}
        onChange={(e) => onArtistChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        required
      >
        <option value="">Choisir un artiste</option>
        {filteredArtists.map((artist) => (
          <option key={artist.id} value={artist.id}>
            {artist.firstName} {artist.lastName} (@{artist.username})
          </option>
        ))}
      </select>

      {selectedArtist && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            Artiste sélectionné: {artists.find(a => a.id === selectedArtist)?.firstName} {artists.find(a => a.id === selectedArtist)?.lastName}
          </p>
        </div>
      )}
    </div>
  );
} 