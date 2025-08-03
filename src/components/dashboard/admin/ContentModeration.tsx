'use client';

export function ContentModeration() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contenu signalé</h3>
        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">
          Voir tout
        </button>
      </div>
      
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-red-800">Titre signalé {i}</div>
                <div className="text-sm text-red-600">Signalé pour contenu inapproprié</div>
                <div className="text-xs text-gray-500 mt-1">Il y a 2 heures</div>
              </div>
              <div className="flex space-x-2">
                <button className="text-red-600 hover:text-red-800 text-sm">
                  Supprimer
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm">
                  Ignorer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 