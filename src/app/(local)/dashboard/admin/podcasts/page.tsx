'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { useGenres, usePodcastList } from '@/hooks';
import { Pagination } from '@/components/ui/Pagination';
import { ApiGenre, ApiPodcast } from '@/shared/types/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mic, Headphones, FileText, Users, BarChart3, Search, Loader2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function AdminPodcastsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const router = useRouter();
  
  // React Query hooks
  const { data: podcastsData, isLoading, error } = usePodcastList({
    page: currentPage,
    page_size: pageSize,
    genre: genreFilter === 'all' ? undefined : genreFilter,
    is_published: statusFilter === 'all' ? undefined : statusFilter === 'published',
  });

  const { data: podcastGenres } = useGenres();

  const podcasts = podcastsData?.results || [];
  const totalPages = podcastsData ? Math.ceil(podcastsData.count / pageSize) : 0;

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, genreFilter, dateFilter]);

  // Filtrer les podcasts selon la recherche et la date
  const filteredPodcasts = podcasts.filter(podcast => {
    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        podcast.title.toLowerCase().includes(searchLower) ||
        podcast.description?.toLowerCase().includes(searchLower) ||
        podcast.genre?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtre par date de sortie
    if (dateFilter !== 'all') {
      const podcastDate = new Date(podcast.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return podcastDate >= today;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return podcastDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return podcastDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return podcastDate >= yearAgo;
        default:
          return true;
      }
    }
    
    return true;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                  Gestion des Podcasts
                </h1>
                <p className="text-slate-500 text-base">
                  Créez et gérez les podcasts pour tous les artistes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Stats Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#005929]/5">
                      <Mic className="w-6 h-6 text-[#005929]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Total Podcasts</p>
                      <p className="text-2xl font-bold text-slate-800">{podcastsData?.count || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200]/10 to-[#FE5200]/5">
                      <BarChart3 className="w-6 h-6 text-[#FE5200]" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Publiés</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {podcasts.filter(p => p.is_published).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                      <FileText className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Total Épisodes</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {podcasts.reduce((sum, podcast) => sum + (podcast.episodes_count || 0), 0)}
                      </p>
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
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher un podcast..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="published">Publiés</option>
                    <option value="draft">Brouillons</option>
                  </select>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les genres</option>
                    {podcastGenres?.results?.map((genre: ApiGenre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Toutes les dates</option>
                    <option value="today">Aujourd&apos;hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm mb-6">
              <CardContent className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#005929] mx-auto mb-4" />
                <p className="text-slate-600">Chargement des podcasts...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-0 shadow-sm bg-red-50/60 backdrop-blur-sm mb-6">
              <CardContent className="p-6">
                <p className="text-red-600 text-center">
                  Erreur lors du chargement des podcasts. Veuillez réessayer.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Podcasts List */}
          {!isLoading && !error && (
            <>
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg font-medium text-slate-800">
                    Liste des Podcasts
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPodcasts.map((podcast: ApiPodcast) => (
                    <Card key={podcast.id} className="group cursor-pointer border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden">
                      {/* Couverture */}
                      <div className="aspect-video bg-slate-100 relative group/cover cursor-pointer" onClick={() => router.push(`/dashboard/admin/podcasts/${podcast.id}`)}>
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

                          <h3 className="text-lg font-medium text-slate-800 line-clamp-1 group-hover:text-slate-900 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/admin/podcasts/${podcast.id}`)}>{podcast.title}</h3>
                          <span className={`px-3 py-1 text-xs rounded-full flex-shrink-0 ${podcast.is_published
                            ? 'bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 text-[#005929] border border-[#005929]/20'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                            {podcast.is_published ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>

                        <div>
                          {podcast.deleted && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 text-center line-clamp-1">
                              Supprimé
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{podcast?.description? podcast.description : ''}</p>

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
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={podcastsData?.count}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              {/* No Results */}
              {filteredPodcasts.length === 0 && !isLoading && (
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm mt-6">
                  <CardContent className="p-12 text-center">
                    <Mic className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">Aucun podcast trouvé</h3>
                    <p className="text-slate-600">
                      {searchTerm || statusFilter !== 'all' || genreFilter !== 'all' || dateFilter !== 'all'
                        ? 'Essayez de modifier vos critères de recherche.'
                        : 'Aucun podcast n\'est disponible pour le moment.'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </AdminRoute>
  );
} 