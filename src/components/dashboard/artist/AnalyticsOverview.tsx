'use client';

export function AnalyticsOverview() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">45.2K</div>
          <div className="text-sm text-blue-800">Écoutes ce mois</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">+12.5%</div>
          <div className="text-sm text-green-800">Croissance</div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">Top pays d&apos;écoute</div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Côte d&apos;Ivoire</span>
            <span className="font-medium">65%</span>
          </div>
          <div className="flex justify-between">
            <span>France</span>
            <span className="font-medium">20%</span>
          </div>
          <div className="flex justify-between">
            <span>Canada</span>
            <span className="font-medium">15%</span>
          </div>
        </div>
      </div>
    </div>
  );
} 