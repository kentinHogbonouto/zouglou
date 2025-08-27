import { Trash2, RotateCcw } from 'lucide-react';

interface DeletedStatusBadgeProps {
  deleted: boolean;
  className?: string;
}

export function DeletedStatusBadge({ deleted, className = "" }: DeletedStatusBadgeProps) {
  if (!deleted) {
    return null; // Ne rien afficher si l'élément n'est pas supprimé
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ${className}`}>
      <Trash2 className="w-3 h-3 mr-1" />
      Supprimé
    </span>
  );
}

interface ToggleDeletedButtonProps {
  deleted: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ToggleDeletedButton({ deleted, onToggle, isLoading = false, className = "" }: ToggleDeletedButtonProps) {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
        deleted 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-red-100 text-red-800 hover:bg-red-200'
      } ${className}`}
      title={deleted ? 'Restaurer' : 'Supprimer'}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
      ) : deleted ? (
        <RotateCcw className="w-3 h-3 mr-1" />
      ) : (
        <Trash2 className="w-3 h-3 mr-1" />
      )}
      {deleted ? 'Restaurer' : 'Supprimer'}
    </button>
  );
}

