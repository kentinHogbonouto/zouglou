interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ 
  message = "Chargement en cours...", 
  className = "" 
}: LoadingStateProps) {
  return (
    <div className={`p-8 text-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005929] mx-auto"></div>
      <p className="mt-2 text-slate-600">{message}</p>
    </div>
  );
}
