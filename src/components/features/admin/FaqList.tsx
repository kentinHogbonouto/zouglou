'use client';

import React, { useState } from 'react';
import { useFaqs, useDeleteFaq } from '@/hooks/useFaqQueries';
import { Faq, FaqFilters } from '@/shared/types';
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
  HelpCircle,
  Calendar,
  Hash,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const FaqList: React.FC = () => {
  const [filters, setFilters] = useState<FaqFilters>({});

  const { data: faqs, isLoading, error, refetch } = useFaqs(filters);
  const deleteFaqMutation = useDeleteFaq();
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


  const handleDelete = async (faq: Faq) => {
    showDeleteConfirmation(
      faq.id, 
      'account', 
      async () => {
        await deleteFaqMutation.mutateAsync(faq.id);
      },
      'Supprimer la FAQ',
      `Êtes-vous sûr de vouloir supprimer la FAQ "${faq.question}" ? Cette action est irréversible.`
    );
  };

  const sortedFaqs = React.useMemo(() => {
    if (!faqs) return [];
    
    return [...faqs].sort((a, b) => {
      const aValue: number = a.position;
      const bValue: number = b.position;
      
      return aValue > bValue ? 1 : -1;
    });
  }, [faqs]);

  if (isLoading) {
    return <LoadingState message="Chargement des FAQ..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Erreur lors du chargement des FAQ"
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
                placeholder="Rechercher une FAQ..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Hash className="h-4 w-4" />
            <span>Trié par: Position</span>
          </div>
        </div>
      </div>

      {/* FAQ Cards */}
      <div className="space-y-6">
        {sortedFaqs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mb-4">
                <HelpCircle className="h-8 w-8 text-[#005929]" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Aucune FAQ trouvée
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {filters.search 
                  ? "Aucune FAQ ne correspond à votre recherche."
                  : "Commencez par créer votre première FAQ pour aider vos utilisateurs."
                }
              </p>
              {!filters.search && (
                <div className="flex justify-center mt-4 mb-4">
                <Link href="/dashboard/admin/faq/create">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                    <Plus className="h-4 w-4" />
                    Créer une FAQ
                  </Button>
                </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          sortedFaqs.map((faq) => (
            <Card key={faq.id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <Hash className="h-3 w-3 mr-1" />
                          Position: {faq.position}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(faq.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-slate-600 leading-relaxed line-clamp-3">
                            {faq.content}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <Link href={`/dashboard/admin/faq/${faq.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-200 hover:border-[#005929] hover:bg-[#005929]/5">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(faq)}
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
