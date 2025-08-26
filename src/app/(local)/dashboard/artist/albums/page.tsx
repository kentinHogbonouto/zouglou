'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthQueries';
import { useAlbums, useCreateAlbum } from '@/hooks/useMusicQueries';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { CreateAlbumData } from '@/shared/types/api';
import { ArtistRoute } from '@/components/auth/ProtectedRoute';
import { CreateAlbumModal } from '@/components/features/artist/CreateAlbumModal';
import { Pagination } from '@/components/ui/Pagination';
import { Disc3, Plus, BarChart3, Clock, Music, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ArtistAlbumsPage() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const router = useRouter();
  const { data: albumsData, isLoading, error } = useAlbums({
    artist: user?.artist_profile?.id || '',
    page: currentPage,
    page_size: pageSize,
  });
  const createAlbumMutation = useCreateAlbum();

  const handleCreateAlbum = async (data: CreateAlbumData) => {
    try {
      await createAlbumMutation.mutateAsync({
        ...data,
        artist: user?.artist_profile?.id || ''
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'album:', error);
    }
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  if (error) return <div>Erreur lors du chargement des albums</div>;

  const albums = albumsData?.results || [];
  const totalItems = albumsData?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ArtistRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Disc3 className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      Mes Albums
                    </h1>
                    <p className="text-slate-500 text-base">
                      Gérez votre discographie et partagez votre musique
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Nouvel Album
              </Button>
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
                    <p className="text-2xl font-light text-slate-800">{albums.length}</p>
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

          {/* Modal de création */}
          <CreateAlbumModal
            currentArtist={user?.artist_profile?.id || ''}
            isOpen={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateAlbum}
            isSubmitting={createAlbumMutation.isPending}
          />

          {/* Liste des albums */}
          {isLoading ? <Loading /> : (
            <div>
              {albums.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {albums.map((album) => (
                      <Card
                        key={album.id}
                        className="group cursor-pointer border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300 overflow-hidden"
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
                <Card className="relative overflow-hidden p-12 border-0 shadow-sm bg-white/60 backdrop-blur-sm text-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#005929]/5 via-transparent to-[#FE5200]/5"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Disc3 className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-800 mb-2">Aucun album</h3>
                    <p className="text-slate-500 mb-6">Commencez par créer votre premier album</p>
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-4 h-4" />
                      Créer votre premier album
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </ArtistRoute>
  );
}