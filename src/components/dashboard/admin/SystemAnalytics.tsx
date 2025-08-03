'use client';

export function SystemAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">99.9%</div>
          <div className="text-sm text-blue-800">Uptime</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">2.3s</div>
          <div className="text-sm text-green-800">Temps de réponse</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">45</div>
          <div className="text-sm text-yellow-800">Streams actifs</div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-3">Utilisation des ressources</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>CPU</span>
            <span className="font-medium">65%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          
          <div className="flex justify-between">
            <span>Mémoire</span>
            <span className="font-medium">78%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
          </div>
          
          <div className="flex justify-between">
            <span>Stockage</span>
            <span className="font-medium">45%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 