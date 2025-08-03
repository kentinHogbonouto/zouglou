'use client';

import { Card, CardContent } from '@/components/ui/Card';

const mockTracks = [
  {
    id: '1',
    title: 'Nouveau Hit',
    artist: 'Votre Nom',
    duration: '3:45',
    playCount: '12,345',
    coverUrl: '/api/placeholder/60/60',
  },
  {
    id: '2',
    title: 'Summer Vibes',
    artist: 'Votre Nom',
    duration: '4:12',
    playCount: '8,901',
    coverUrl: '/api/placeholder/60/60',
  },
  {
    id: '3',
    title: 'Night Drive',
    artist: 'Votre Nom',
    duration: '3:28',
    playCount: '6,789',
    coverUrl: '/api/placeholder/60/60',
  },
];

export function RecentTracks() {
  return (
    <div className="space-y-4">
      {mockTracks.map((track) => (
        <div key={track.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-600">🎵</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{track.title}</h3>
            <p className="text-sm text-gray-600">{track.artist}</p>
          </div>
          <div className="text-sm text-gray-500">{track.duration}</div>
          <div className="text-sm text-gray-500">{track.playCount} écoutes</div>
          <button className="text-blue-600 hover:text-blue-800">Modifier</button>
        </div>
      ))}
    </div>
  );
} 