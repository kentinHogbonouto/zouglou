import React from 'react';
import { useCities } from '@/hooks/useApiQueries';

interface City {
  id: string;
  name: string;
  status: boolean;
  logo: string | null;
  longitude: string | null;
  latitude: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function CitySelect({
  value,
  onChange,
  label = "Ville",
  placeholder = "Sélectionner une ville",
  required = false,
  className = ""
}: CitySelectProps) {
  const { data: cities = [] as City[], isLoading, error } = useCities();

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
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zouglou-green-500 focus:ring-zouglou-green-500 text-sm p-3"
        />
        <div className="mt-1 text-xs text-gray-500">
          Saisissez librement la ville
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zouglou-green-500 focus:ring-zouglou-green-500 text-sm p-2 px-3"
        disabled={isLoading}
        required={required}
      >
        <option value="">{placeholder}</option>
        {cities.map((city: City) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      {isLoading && <p className="text-sm text-gray-500 mt-1">Chargement des villes...</p>}
    </div>
  );
}
