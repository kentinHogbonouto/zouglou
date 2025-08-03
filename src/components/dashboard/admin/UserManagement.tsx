'use client';

export function UserManagement() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Utilisateurs récents</h3>
        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
          Voir tout
        </button>
      </div>
      
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-medium">Utilisateur {i}</div>
                <div className="text-sm text-gray-600">user{i}@example.com</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Actif
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 