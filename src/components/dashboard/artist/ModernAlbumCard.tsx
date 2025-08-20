'use client';

import { Card } from '@/components/ui/Card';
import { Play, Music, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ApiSong } from '@/shared/types/api';
interface ModernAlbumCardProps {
  album: {
    id: string;
    title: string;
    description?: string;
    cover?: string;
    is_published: boolean;
    songs?: Array<ApiSong>;
    total_duration?: number;
  };
}

export function ModernAlbumCard({ album }: ModernAlbumCardProps) {
  const router = useRouter();

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      className="group cursor-pointer border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden"
      onClick={() => router.push(`/dashboard/artist/albums/${album.id}`)}
    >
      {/* Couverture */}
      <div className="aspect-square bg-slate-100 relative overflow-hidden">
        <Image 
          src={album.cover || '/images/cover_default.jpg'} 
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={400}
          height={400}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-3 rounded-full shadow-lg transition-all duration-300">
            <Play className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>
      
      {/* Contenu */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-medium text-slate-800 line-clamp-1">{album.title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
            album.is_published 
              ? 'bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 text-[#005929]' 
              : 'bg-slate-100 text-slate-600'
          }`}>
            {album.is_published ? 'Publié' : 'Brouillon'}
          </span>
        </div>
        
        {album.description && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{album.description}</p>
        )}
        
        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Music className="w-4 h-4" />
            <span>{album.songs?.length || 0} Titres</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(album.total_duration || 0)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
