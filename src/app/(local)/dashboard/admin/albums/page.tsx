'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { useAlbums, useGenres, useCreateAlbum } from '@/hooks';
import { Pagination } from '@/components/ui/Pagination';
import { Disc3, BarChart3, Music, Clock, Play, Plus, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';

export default function AdminAlbumsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const router = useRouter();
  
  // React Query hook
  const pageSize = 6;
  const { data: albumsData, isLoading, error, refetch } = useAlbums({
    page: currentPage,
    page_size: pageSize,
    genre: genreFilter === 'all' ? undefined : genreFilter,
    is_published: statusFilter === 'all' ? undefined : statusFilter === 'published',
  });

  const { data: genresData } = useGenres();

  const albums = albumsData?.results || [];
  const totalPages = albumsData ? Math.ceil(albumsData.count / pageSize) : 0;
  const totalItems = albumsData?.count || 0;

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, genreFilter, dateFilter]);

  // Filtrer les albums selon la recherche et la date
  const filteredAlbums = albums.filter(album => {
    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        album.title.toLowerCase().includes(searchLower) ||
        album.description?.toLowerCase().includes(searchLower) ||
        album.artist?.stage_name?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtre par date de sortie
    if (dateFilter !== 'all') {
      const albumDate = new Date(album.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return albumDate >= today;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return albumDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return albumDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return albumDate >= yearAgo;
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

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
                  Gestion des Albums de la plateforme
                </h1>
                <p className="text-slate-500 text-base">
                  Gérez les albums pour tous les artistes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Disc3 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Albums</p>
                    <p className="text-2xl font-light text-slate-800">{albums.length}/{totalItems}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <BarChart3 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Publiés</p>
                    <p className="text-2xl font-light text-slate-800">{albums.filter(a => a.is_published).length}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Music className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Tracks</p>
                    <p className="text-2xl font-light text-slate-800">{albums.reduce((acc, album) => acc + (album.songs?.length || 0), 0)}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Durée totale</p>
                    <p className="text-2xl font-light text-slate-800">
                      {formatDuration(albums.reduce((acc, album) => acc + (album.total_duration || 0), 0))}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher un album..."
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
                    {genresData?.results?.map((genre) => (
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
                <p className="text-slate-600">Chargement des albums...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-0 shadow-sm bg-red-50/60 backdrop-blur-sm mb-6">
              <CardContent className="p-6">
                <p className="text-red-600 text-center">
                  Erreur lors du chargement des albums. Veuillez réessayer.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Albums List */}
          {!isLoading && !error && (
            <>
              {filteredAlbums.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAlbums.map((album) => (
                      <Card
                        key={album.id}
                        className="group cursor-pointer border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                        onClick={() => router.push(`/dashboard/admin/albums/${album.id}`)}
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
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-3 rounded-full shadow-lg transition-all duration-300">
                              <Play className="w-5 h-5 text-slate-600" />
                            </div>
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-medium text-slate-800 line-clamp-1">{album.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${album.is_published
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-600'
                              }`}>
                              {album.is_published ? 'Publié' : 'Brouillon'}
                            </span>
                          </div>

                          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{album.description}</p>

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
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="relative overflow-hidden p-12 border-0 shadow-sm bg-white/60 backdrop-blur-sm text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#005929]/5 via-transparent to-[#FE5200]/5"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Disc3 className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-800 mb-2">
                      {searchTerm || statusFilter !== 'all' || genreFilter !== 'all' || dateFilter !== 'all'
                        ? 'Aucun album trouvé'
                        : 'Aucun album'
                      }
                    </h3>
                    <p className="text-slate-500 mb-6">
                      {searchTerm || statusFilter !== 'all' || genreFilter !== 'all' || dateFilter !== 'all'
                        ? 'Essayez de modifier vos critères de recherche.'
                        : 'Aucun album trouvé'
                      }
                    </p>
                  </div>
                </Card>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={albumsData?.count}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </AdminRoute>
  );
} 