import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = "Une erreur s'est produite", 
  message = "Impossible de charger les données. Veuillez réessayer.",
  onRetry,
  className = ""
}: ErrorStateProps) {
  return (
    <div className={`p-8 text-center ${className}`}>
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-red-600 font-medium mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-4">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </Button>
      )}
    </div>
  );
}
