'use client';

import React from 'react';
import { ApiPodcastEpisode } from '@/shared/types/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MoreVertical, Eye, Heart, Play, Pause, Headphones, Clock, Users, FileText } from 'lucide-react';
import Image from 'next/image';
interface EpisodeListProps {
  episodes: ApiPodcastEpisode[];
  title?: string;
  onPlay: (episode: ApiPodcastEpisode) => void;
  onView: (episode: ApiPodcastEpisode) => void;
  onEdit?: (episode: ApiPodcastEpisode) => void;
  onLike?: (episode: ApiPodcastEpisode) => void;
  isPlaying?: boolean;
  currentEpisodeId?: string;
}

export function EpisodeList({
  episodes,
  title = "Mes Épisodes",
  onPlay,
  onView,
  onLike,
  isPlaying = false,
  currentEpisodeId
}: EpisodeListProps) {
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

  if (episodes.length === 0) {
    return (
      <Card className="p-12 border-0 shadow-sm bg-white/60 backdrop-blur-sm text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Headphones className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-600 text-lg font-medium mb-2">Aucun épisode trouvé</p>
        <p className="text-slate-500 text-sm">Commencez par ajouter votre premier épisode !</p>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
            <FileText className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">{title}</h3>
          <span className="text-sm text-slate-500">({episodes.length} épisodes)</span>
        </div>
      </div>

      {/* Liste des épisodes */}
      <div className="divide-y divide-slate-100/50">
        {episodes.map((episode, index) => (
          <div
            key={episode.id}
            className={`group px-6 py-4 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer ${currentEpisodeId === episode.id ? 'bg-slate-50/80' : ''
              }`}
            onClick={() => onPlay(episode)}
          >
            <div className="flex items-center gap-4">
              {/* Numéro et couverture */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-sm font-medium text-slate-600">
                  {index + 1}
                </div>

                <div className="relative group/cover">
                  <Image
                    src={episode.cover || '/images/cover_default.jpg'}
                    alt={episode.title}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover/cover:shadow-md transition-all duration-300"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/20 rounded-lg transition-all duration-300 flex items-center justify-center">
                    {currentEpisodeId === episode.id && isPlaying ? (
                      <Pause className="w-4 h-4 text-white opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300" />
                    ) : (
                      <Play className="w-4 h-4 text-white opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300" />
                    )}
                  </div>
                </div>

                {/* Informations de l'épisode */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate group-hover:text-slate-900 transition-colors duration-200">
                    {episode.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    Épisode #{episode.episode_number}
                  </div>
                </div>
              </div>

              {/* Podcast */}
              <div className="hidden md:block w-32">
                <div className="text-sm text-slate-600 truncate">
                  {episode.title}
                </div>
              </div>

              {/* Écoutes */}
              <div className="hidden lg:flex items-center gap-1 text-sm text-slate-500">
                <Users className="w-4 h-4" />
                <span>{formatPlayCount(episode.play_count || 0)}</span>
              </div>

              {/* Statut */}
              <div className="hidden xl:block">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  episode.is_published 
                    ? 'bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 text-[#005929] border border-[#005929]/20'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {episode.is_published ? 'Publié' : 'Brouillon'}
                </span>
              </div>

              {/* Durée */}
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(episode.duration)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Bouton Play/Pause */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(episode);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 rounded-lg"
                >
                  {currentEpisodeId === episode.id && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                {/* Bouton Like */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike?.(episode);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-lg"
                >
                  <Heart className="w-4 h-4" />
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
                        onView(episode);
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
