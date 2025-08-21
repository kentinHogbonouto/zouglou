"use client";

import { useState } from "react";
import { ArtistRoute } from "@/components/auth/ProtectedRoute";
import { usePodcastEpisodeList } from "@/hooks/usePodcastQuery";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link"
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CreateEpisodeModal } from "@/components/features/podcast/CreateEpisodeModal";
import { EpisodeList } from "@/components/features/podcast/EpisodeList";
import { useUnifiedEpisodePlayer } from '@/hooks/useUnifiedEpisodePlayer';
import { Headphones, Plus, ArrowLeft } from 'lucide-react';

export default function ArtistPodcastEpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { data: episodesData, refetch } = usePodcastEpisodeList({podcast: params.id as string});
  const episodes = episodesData?.results || [];
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { playEpisodeQueue, currentEpisode, isPlaying } = useUnifiedEpisodePlayer();

  return (
    <ArtistRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Link href="/dashboard/artist/podcasts">
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                      <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                  </Link>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Headphones className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">Mes Épisodes de Podcast</h1>
                    <p className="text-slate-500 text-base">Gérez vos épisodes de podcast</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Créer un épisode
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {episodes.length > 0 ? (
            <div className="space-y-4">
              <EpisodeList
                episodes={episodes}
                title="Mes Épisodes"
                onPlay={(episode) => {
                  // Jouer tous les épisodes en commençant par celui-ci
                  const episodeIndex = episodes.findIndex(ep => ep.id === episode.id);
                  playEpisodeQueue(episodes, episodeIndex);
                }}
                onView={(episode) => router.push(`/dashboard/artist/podcasts/${params.id}/episode/${episode.id}`)}
                onEdit={(episode) => router.push(`/dashboard/artist/podcasts/${params.id}/episode/${episode.id}?edit=true`)}
                isPlaying={isPlaying}
                currentEpisodeId={currentEpisode?.id}
              />
            </div>
          ) : (
            <Card className="p-12 border-0 shadow-sm bg-white/60 backdrop-blur-sm text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-2">Aucun épisode</h3>
              <p className="text-slate-500 mb-6">Commencez par créer votre premier épisode</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Créer un épisode
              </Button>
            </Card>
          )}

          <CreateEpisodeModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
              refetch();
              setIsCreateModalOpen(false);
            }}
          />
        </div>
      </div>
    </ArtistRoute>
  )
}