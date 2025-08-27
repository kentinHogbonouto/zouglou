import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { useArtistList } from '@/hooks';
import { ApiArtist } from '@/shared/types/api';

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
  const [artists, setArtists] = useState<ApiArtist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: artistsData } = useArtistList();

useEffect(() => {
  if (artistsData) {
    setIsLoading(false);
    setArtists(artistsData.results as ApiArtist[]);
  }
}, [artistsData]);

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
        {artists.map((artist) => (
          <option key={artist.id} value={artist.id}>
            {artist.stage_name}
          </option>
        ))}
      </select>

      {selectedArtist && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            Artiste sélectionné: {artists.find(a => a.id === selectedArtist)?.stage_name}
          </p>
        </div>
      )}
    </div>
  );
} 