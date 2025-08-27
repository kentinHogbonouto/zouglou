'use client';

import React, { useState } from 'react';
import { useInformations, useDeleteInformation } from '@/hooks/useInformationQueries';
import { Information, InformationFilters } from '@/shared/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useDeleteConfirmation } from '@/hooks/useDeleteConfirmation';
import { 
  Search, 
  Edit, 
  Trash2, 
  FileText,
  Calendar,
  Shield,
  BookOpen,
  Info,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const InformationList: React.FC = () => {
  const [filters, setFilters] = useState<InformationFilters>({});

  const { data: informations, isLoading, error, refetch } = useInformations(filters);
  const deleteInformationMutation = useDeleteInformation();
  const { 
    isOpen, 
    message, 
    itemName, 
    showDeleteConfirmation, 
    hideDeleteConfirmation, 
    handleConfirm 
  } = useDeleteConfirmation();

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };



  const handleDelete = async (information: Information) => {
    showDeleteConfirmation(
      information.id, 
      'account', 
      async () => {
        await deleteInformationMutation.mutateAsync(information.id);
      },
      'Supprimer les informations',
      'Êtes-vous sûr de vouloir supprimer ces informations légales ? Cette action est irréversible.'
    );
  };

  const sortedInformations = React.useMemo(() => {
    if (!informations) return [];
    
    return [...informations].sort((a, b) => {
      const aValue: number = new Date(a.updatedAt).getTime();
      const bValue: number = new Date(b.updatedAt).getTime();
      
      return aValue > bValue ? 1 : -1;
    });
  }, [informations]);

  if (isLoading) {
    return <LoadingState message="Chargement des informations..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Erreur lors du chargement des informations"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Rechercher dans les informations..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            <span>Trié par: Dernière mise à jour</span>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="space-y-6">
        {sortedInformations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-[#005929]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Aucune information trouvée
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {filters.search 
                  ? "Aucune information ne correspond à votre recherche."
                  : "Commencez par créer vos premières informations légales pour votre plateforme."
                }
              </p>
              {!filters.search && (
                <Link href="/dashboard/admin/information/create">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                    <Plus className="h-4 w-4" />
                    Créer des informations
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          sortedInformations.map((information) => (
            <Card key={information.id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      
                      <div className="grid grid-cols-1 gap-6 mb-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            Politique de confidentialité
                          </h4>
                          <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed">
                            {information.privacy_policy.replace(/<[^>]*>/g, '').substring(0, 500)}...
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-green-600" />
                            Conditions d&apos;utilisation
                          </h4>
                          <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed">
                            {information.terms_of_use.replace(/<[^>]*>/g, '').substring(0, 500)}...
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Info className="h-4 w-4 text-purple-600" />
                            À propos
                          </h4>
                          <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed">
                            {information.about_us.replace(/<[^>]*>/g, '').substring(0, 500)}...
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>Dernière mise à jour : {format(new Date(information.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <Link href={`/dashboard/admin/information/${information.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-200 hover:border-[#005929] hover:bg-[#005929]/5">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(information)}
                        className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={hideDeleteConfirmation}
        onConfirm={handleConfirm}
        message={message}
        itemName={itemName}
      />
    </div>
  );
};
