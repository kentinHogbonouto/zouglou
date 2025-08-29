'use client';

import React from 'react';
import { ApiSong } from '@/shared/types/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MoreVertical, Eye, Play, Pause, Music, Clock, Users, Disc3 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

interface MusicListProps {
  tracks: ApiSong[];
  title?: string;
  onPlay: (track: ApiSong) => void;
  onView: (track: ApiSong) => void;
  isPlaying?: boolean;
  currentTrackId?: string;
}

export function MusicList({
  tracks,
  title = "Mes Tracks",
  onPlay,
  onView,
  isPlaying = false,
  currentTrackId
}: MusicListProps) {

  const user = useAuth();
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };
  
  if (tracks.length === 0) {
    return (
      <Card className="p-12 border-0 shadow-sm bg-white/60 backdrop-blur-sm text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Music className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-600 text-lg font-medium mb-2">Aucune musique trouvée</p>
        <p className="text-slate-500 text-sm">Commencez par ajouter votre première musique !</p>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
            <Disc3 className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">{title}</h3>
          <span className="text-sm text-slate-500">({tracks.length} tracks)</span>
        </div>
      </div>

      {/* Liste des tracks */}
      <div className="divide-y divide-slate-100/50">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`group px-6 py-4 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer ${currentTrackId === track.id ? 'bg-slate-50/80' : ''
              }`}
            onClick={() => onPlay(track)}
          >
            <div className="flex items-center gap-4">
              {/* Numéro et couverture */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-sm font-medium text-slate-600">
                  {index + 1}
                </div>

                <div className="hidden lg:flex relative group/cover">
                  <Image
                    src={track.album?.cover || '/images/cover_default.jpg'}
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover/cover:shadow-md transition-all duration-300"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/20 rounded-lg transition-all duration-300 flex items-center justify-center">
                    {currentTrackId === track.id && isPlaying ? (
                      <Pause className="w-4 h-4 text-white opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300" />
                    ) : (
                      <Play className="w-4 h-4 text-white opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300" />
                    )}
                  </div>
                </div>

                {/* Informations du track */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate group-hover:text-slate-900 transition-colors duration-200">
                    {track.title}
                  </div>
                  {track.album && (
                    <div className="text-xs text-slate-500 truncate">
                      {track.album.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Artiste */}
              <div className="hidden md:block w-32">
                <div className="text-sm text-slate-600 truncate">
                  {track.artist.stage_name}
                </div>
              </div>

              {/* Écoutes */}
              <div className="hidden lg:flex items-center gap-1 text-sm text-slate-500">
                <Users className="w-4 h-4" />
                <span>{formatPlayCount(track.play_count || 0)}</span>
              </div>

              {/* Genre */}
             {user.user?.default_role === 'artist' && <div className="hidden xl:block w-32">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 text-center line-clamp-1">
                  {track.genre?.name || 'Pop'}
                </span>
              </div>}

              <div>
                {track.deleted && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 text-center line-clamp-1">
                    Supprimé
                  </span>
                )}
              </div>

              {/* Durée */}
              <div className="hidden lg:flex items-center gap-1 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(track.duration)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-80 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Bouton Play/Pause */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(track);
                  }}
                  className="p-2 text-slate-600 lg:text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 rounded-lg"
                >
                  {currentTrackId === track.id && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                {/* Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-slate-100 transition-all duration-200 rounded-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg rounded-lg">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(track);
                      }}
                      className="cursor-pointer hover:bg-slate-50 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4 mr-3 text-slate-600" />
                      <span className="text-slate-700">Voir les détails</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
