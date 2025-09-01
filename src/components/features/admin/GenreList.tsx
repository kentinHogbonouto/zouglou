'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/Input';
import { useGenreList, useRealDeleteGenre } from '@/hooks/useGenreQueries';
import { Genre } from '@/shared/types/genre';
import { Edit, Trash2, Plus, Search, Music } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { DeletedStatusBadge } from '@/components/ui/DeletedStatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

interface GenreListProps {
  onEdit?: (genre: Genre) => void;
  onCreate?: () => void;
}

export const GenreList: React.FC<GenreListProps> = ({ onEdit, onCreate }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  
  const { data: genresData, isLoading, error } = useGenreList({
    name: searchTerm || undefined,
    is_active: filterActive !== null ? filterActive : undefined,
    page_size: 100
  });

  const deleteGenreMutation = useRealDeleteGenre();
  const { showDeleteConfirmation } = useDeleteConfirmation();

  const handleDelete = (genre: Genre) => {
    showDeleteConfirmation(
      genre.name,
      'genre',
      () => {
        deleteGenreMutation.mutate(genre.id);
      },
      'Supprimer le genre',
      `Êtes-vous sûr de vouloir supprimer le genre "${genre.name}" ? Cette action est irréversible.`
    );
  };

  const handleEdit = (genre: Genre) => {
    if (onEdit) {
      onEdit(genre);
    } else {
      router.push(`/dashboard/admin/genres/${genre.id}`);
    }
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      router.push('/dashboard/admin/genres/create');
    }
  };

  if (isLoading) {
    return <LoadingState message="Chargement des genres..." />;
  }

  if (error) {
    return <ErrorState message="Erreur lors du chargement des genres" />;
  }

  const genres = genresData?.results || [];

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-gradient-to-r from-white/80 to-orange-50/30 backdrop-blur-sm border border-slate-200/50 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher un genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200/50 focus:border-[#005929] focus:ring-[#005929]/20 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterActive === null ? "default" : "outline"}
                onClick={() => setFilterActive(null)}
                size="sm"
                className={filterActive === null 
                  ? 'bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white shadow-lg' 
                  : 'border-slate-200/50 hover:border-[#005929]/30 hover:bg-[#005929]/5 text-slate-700'
                }
              >
                Tous
              </Button>
              <Button
                variant={filterActive === true ? "default" : "outline"}
                onClick={() => setFilterActive(true)}
                size="sm"
                className={filterActive === true 
                  ? 'bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white shadow-lg' 
                  : 'border-slate-200/50 hover:border-[#005929]/30 hover:bg-[#005929]/5 text-slate-700'
                }
              >
                Actifs
              </Button>
              <Button
                variant={filterActive === false ? "default" : "outline"}
                onClick={() => setFilterActive(false)}
                size="sm"
                className={filterActive === false 
                  ? 'bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white shadow-lg' 
                  : 'border-slate-200/50 hover:border-[#005929]/30 hover:bg-[#005929]/5 text-slate-700'
                }
              >
                Inactifs
              </Button>
            </div>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau genre
          </Button>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map((genre) => (
          <Card key={genre.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm hover:from-white hover:to-orange-50/30">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 group-hover:from-[#005929]/20 group-hover:to-[#FE5200]/20 transition-all duration-300">
                      <Music className="h-5 w-5 text-[#005929] group-hover:text-[#005929]/80" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-[#005929] transition-colors duration-300">
                      {genre.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant={genre.is_active ? "default" : "secondary"}
                      className={`${
                        genre.is_active 
                          ? 'bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white' 
                          : 'bg-slate-200 text-slate-700'
                      } transition-all duration-300`}
                    >
                      {genre.is_active ? "Actif" : "Inactif"}
                    </Badge>
                    <DeletedStatusBadge deleted={genre.deleted} />
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(genre)}
                    className="h-8 w-8 p-0 border-[#005929]/20 hover:border-[#005929] hover:bg-[#005929]/5 text-[#005929] hover:text-[#005929]/80 transition-all duration-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(genre)}
                    className="h-8 w-8 p-0 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-slate-100/50 to-orange-100/30 p-3 rounded-lg border border-slate-200/50">
                  <span className="text-sm font-medium text-slate-700">Slug:</span>
                  <span className="text-sm text-slate-800 ml-2 font-mono bg-white/80 px-2 py-1 rounded border border-slate-200/50">
                    {genre.slug}
                  </span>
                </div>
                {genre.description && (
                  <div className="bg-gradient-to-r from-slate-100/50 to-orange-100/30 p-3 rounded-lg border border-slate-200/50">
                    <span className="text-sm font-medium text-slate-700">Description:</span>
                    <p className="text-sm text-slate-700 mt-1">{genre.description}</p>
                  </div>
                )}
                <div className="text-xs text-slate-500 bg-slate-100/50 px-3 py-2 rounded-lg border border-slate-200/50">
                  <span className="font-medium">Créé le:</span> {new Date(genre.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {genres.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Music className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aucun genre trouvé
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || filterActive !== null
              ? "Essayez de modifier vos critères de recherche"
              : "Commencez par créer votre premier genre"}
          </p>
          {!searchTerm && filterActive === null && (
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un genre
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
