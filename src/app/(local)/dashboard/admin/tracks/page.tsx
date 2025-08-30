'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { useSongs, useUnifiedMusicPlayer, useGenres } from '@/hooks';
import { Pagination } from '@/components/ui/Pagination';
import { MusicList } from '@/components/features';
import { ApiSong } from '@/shared/types/api';
import { useRouter } from 'next/navigation';
import { BarChart3, Clock, Music, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function AdminTracksPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // React Query hooks
  const { data: tracksData, isLoading, error } = useSongs({
    page: currentPage,
    page_size: pageSize,
    genre: genreFilter === 'all' ? undefined : genreFilter,
    is_published: statusFilter === 'all' ? undefined : statusFilter === 'published',
  });

  const { data: genresData } = useGenres();

  const tracks = tracksData?.results || [];
  const totalPages = tracksData ? Math.ceil(tracksData.count / pageSize) : 0;
  const { playTrackQueue, currentTrack, isPlaying } = useUnifiedMusicPlayer();

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, genreFilter, dateFilter]);

  // Filtrer les tracks selon la recherche et la date
  const filteredTracks = tracks.filter(track => {
    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        track.title.toLowerCase().includes(searchLower) ||
        track.artist?.stage_name?.toLowerCase().includes(searchLower) ||
        track.album?.title?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtre par date de sortie
    if (dateFilter !== 'all') {
      const trackDate = new Date(track.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return trackDate >= today;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return trackDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return trackDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return trackDate >= yearAgo;
        default:
          return true;
      }
    }
    
    return true;
  });

  const handlePlayAllTracks = (track: ApiSong) => {
    // Jouer toutes les pistes de la page
    const trackIndex = tracks.findIndex(song => song.id === track.id);
    playTrackQueue(tracks, trackIndex);
  };

  const handleViewTrack = (track: ApiSong) => {
    router.push(`/dashboard/admin/tracks/${track.id}`);
  };

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
          <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                  Gestion des Tracks
                </h1>
                <p className="text-slate-500 text-base">
                  Créez et gérez les tracks pour tous les artistes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          {/* Stats Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Music className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Total Tracks</p>
                      <p className="text-2xl font-bold text-slate-800">{tracksData?.count || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <BarChart3 className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Publiés</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {tracks.filter(t => t.is_published).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Clock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Brouillons</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {tracks.filter(t => !t.is_published).length}
                      </p>
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
                      placeholder="Rechercher une track..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
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
                <p className="text-slate-600">Chargement des tracks...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-0 shadow-sm bg-red-50/60 backdrop-blur-sm mb-6">
              <CardContent className="p-6">
                <p className="text-red-600 text-center">
                  Erreur lors du chargement des tracks. Veuillez réessayer.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tracks List */}
          {!isLoading && !error && (
            <>
              <MusicList
                tracks={filteredTracks}
                title="Tracks de la plateforme"
                onPlay={handlePlayAllTracks}
                onView={handleViewTrack}
                isPlaying={isPlaying}
                currentTrackId={currentTrack?.id}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={tracksData?.count}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              {/* No Results */}
              {filteredTracks.length === 0 && !isLoading && (
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm mt-6">
                  <CardContent className="p-12 text-center">
                    <Music className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">Aucune track trouvée</h3>
                    <p className="text-slate-600">
                      {searchTerm || statusFilter !== 'all' || genreFilter !== 'all' || dateFilter !== 'all'
                        ? 'Essayez de modifier vos critères de recherche.'
                        : 'Aucune track n\'est disponible pour le moment.'
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