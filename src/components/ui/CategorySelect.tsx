import React, { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useMusicQueries';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  label = "Catégorie",
  placeholder = "Sélectionner ou saisir une catégorie",
  required = false,
  className = ""
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isCustom, setIsCustom] = useState(false);
  
  const { data: categories = [], isLoading, error } = useCategories();

  // Filtrer les catégories basé sur la saisie
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Gérer la sélection d'une catégorie
  const handleSelectCategory = (categoryName: string) => {
    setInputValue(categoryName);
    onChange(categoryName);
    setIsCustom(false);
    setIsOpen(false);
  };

  // Gérer la saisie libre
  const handleCustomInput = () => {
    setIsCustom(true);
    setIsOpen(false);
  };

  // Gérer le changement de valeur
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsCustom(true);
  };

  // Gérer le focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Gérer le clic en dehors
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

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
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        <div className="mt-1 text-xs text-gray-500">
          💡 Saisissez librement la catégorie
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        
        {/* Icône de dropdown */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown des catégories */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              Chargement des catégories...
            </div>
          ) : (
            <>
              {/* Catégories filtrées */}
              {filteredCategories.length > 0 && (
                <div className="py-1">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleSelectCategory(category.name)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Option pour saisie libre */}
              {inputValue && (
                <div className="border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCustomInput}
                    className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 focus:bg-green-50 focus:outline-none font-medium"
                  >
                    💡 Utiliser &quot;{inputValue}&quot; comme nouvelle catégorie
                  </button>
                </div>
              )}

              {/* Message si aucune catégorie trouvée */}
              {filteredCategories.length === 0 && !inputValue && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Aucune catégorie trouvée. Saisissez une nouvelle catégorie.
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Indicateur de catégorie personnalisée */}
      {isCustom && inputValue && (
        <div className="mt-1 text-xs text-green-600">
          ✨ Catégorie personnalisée : {inputValue}
        </div>
      )}
    </div>
  );
} 