import React from 'react';
import { useGenres } from '@/hooks/useMusicQueries';
import { ApiGenre } from '@/shared/types';

interface GenreSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function GenreSelect({
  value,
  onChange,
  label = "Genre",
  placeholder = "Sélectionner un genre",
  required = false,
  className = ""
}: GenreSelectProps) {
  const { data, isLoading, error } = useGenres();

  const genres = data?.results || [];
  // Si l'API n'est pas disponible, utiliser un input simple
  if (error) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
        />
        <div className="mt-1 text-xs text-gray-500">
          💡 Saisissez librement le genre
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="outline-none border-2 w-full rounded-md p-2"
        disabled={isLoading}
        required={required}
      >
        <option value="">{placeholder}</option>
        {genres?.map((genre: ApiGenre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
      {isLoading && <p className="text-sm text-gray-500 mt-1">Chargement des genres...</p>}
    </div>
  );
} 