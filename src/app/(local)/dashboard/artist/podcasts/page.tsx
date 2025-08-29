'use client';

import { useState } from "react";
import { ArtistRoute } from "@/components/auth/ProtectedRoute";
import { usePodcastList } from "@/hooks/usePodcastQuery";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ApiPodcast } from "@/shared/types/api";
import { CreatePodcastModal } from "@/components/features/podcast/CreatePodcastModal";
import { Pagination } from "@/components/ui/Pagination";
import { Mic, Plus, BarChart3, FileText, Users, Headphones } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ArtistPodcastsPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const { data: podcastsData, refetch } = usePodcastList({
    artist: user?.artist_profile?.id,
    page: currentPage,
    page_size: pageSize,
  });
  const podcasts = podcastsData?.results || [];
  const totalItems = podcastsData?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <ArtistRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Mic className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">Mes Podcasts</h1>
                    <p className="text-slate-500 text-base">Gérez vos podcasts et épisodes</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  Créer un podcast
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm group hover:shadow-xl transition-all duration-500 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#005929]/5">
                    <Mic className="w-6 h-6 text-[#005929]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Podcasts</p>
                    <p className="text-2xl font-light text-slate-800">{podcasts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm group hover:shadow-xl transition-all duration-500 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200]/10 to-[#FE5200]/5">
                    <BarChart3 className="w-6 h-6 text-[#FE5200]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Publiés</p>
                    <p className="text-2xl font-light text-slate-800">{podcasts.filter(p => p.is_published).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm group hover:shadow-xl transition-all duration-500 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Épisodes</p>
                    <p className="text-2xl font-light text-slate-800">{podcasts.reduce((acc, podcast) => acc + (podcast.episodes_count || 0), 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm group hover:shadow-xl transition-all duration-500 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Abonnés</p>
                    <p className="text-2xl font-light text-slate-800">{podcasts.reduce((acc, podcast) => acc + (podcast.subscribers_count || 0), 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des podcasts */}
          {podcasts.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {podcasts.map((podcast: ApiPodcast) => (
                <Card key={podcast.id} className="group cursor-pointer border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden">
                  {/* Couverture */}
                  <div className="aspect-video bg-slate-100 relative group/cover cursor-pointer" onClick={() => router.push(`/dashboard/artist/podcasts/${podcast.id}`)}>
                    {podcast.cover ? (
                      <Image
                        src={podcast.cover || '/images/default-album.jpg'}
                        alt={podcast.title}
                        className="w-full h-[30vh] object-cover group-hover/cover:scale-105 transition-transform duration-500"
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <Mic className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover/cover:opacity-100 bg-white/90 p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110">
                        <Headphones className="w-6 h-6 text-[#005929]" />
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3" >
                    
                      <h3 className="text-lg font-medium text-slate-800 line-clamp-1 group-hover:text-slate-900 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/artist/podcasts/${podcast.id}`)}>{podcast.title}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full flex-shrink-0 ${podcast.is_published
                        ? 'bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 text-[#005929] border border-[#005929]/20'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                        {podcast.is_published ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{podcast.description}</p>

                    {/* Statistiques */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FileText className="w-4 h-4 text-[#005929]" />
                        <span>{podcast.episodes_count || 0} épisodes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Users className="w-4 h-4 text-[#FE5200]" />
                        <span>{podcast.subscribers_count || 0} abonnés</span>
                      </div>
                    </div>

                  
                  </CardContent>
                </Card>
              ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  className="mt-6"
                />
              )}
            </div>
          ) : (
            <Card className="p-12 border-0 shadow-sm bg-white/60 backdrop-blur-sm text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-2">Aucun podcast</h3>
              <p className="text-slate-500 mb-6">Commencez par créer votre premier podcast</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Créer un podcast
              </Button>
            </Card>
          )}

          <CreatePodcastModal
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
  );
} 