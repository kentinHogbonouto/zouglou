'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Advertisement } from '@/shared/types/advertisement';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/components/providers/ToastProvider';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useAdvertisements, useRealDeleteAdvertisement } from '@/hooks';
import { CheckCircle, Copy, Edit, ExternalLink, Eye, Megaphone, Plus, Trash2 } from 'lucide-react';
import { LoadingPage } from '@/components/ui/Loading';
import { CreateAdvertisementModal } from '@/components/features/admin/CreateAdvertisementModal';
import { Pagination } from '@/components/ui/Pagination';

export default function AdvertisementsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState<Advertisement | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const toast = useToast();
  const { data, isLoading } = useAdvertisements(page, pageSize);
  const deleteMutation = useRealDeleteAdvertisement();

  const handleDelete = async () => {
    if (!selectedId) return;

    await deleteMutation.mutateAsync(selectedId);
  };

  const handleEdit = (advertisement: Advertisement) => {
    setSelectedAdvertisement(advertisement);
    setShowEditModal(true);
  };

  const columns = [
    {
      header: 'Titre',
      accessorKey: 'title',
    },
    {
      header: 'Placement',
      accessorKey: 'placement',
      cell: ({ row }: { row: { original: Advertisement } }) => (
        <Badge variant="outline">
          {row.original.placement === 'pre_roll' ? 'Pré-roll' :
            row.original.placement === 'mid_roll' ? 'Mid-roll' :
              row.original.placement === 'banner' ? 'Bannière' : 'Interstitiel'}
        </Badge>
      ),
    },
    {
      header: 'Statut',
      accessorKey: 'is_active',
      cell: ({ row }: { row: { original: Advertisement } }) => (
        <Badge variant={row.original.is_active ? 'secondary' : 'destructive'}>
          {row.original.is_active ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      header: 'Clics',
      accessorKey: 'clicks',
    },
    {
      header: 'Impressions',
      accessorKey: 'impressions',
    },
    {
      header: 'Date de début',
      accessorKey: 'start_date',
      cell: ({ row }: { row: { original: Advertisement } }) => (
        row.original.start_date ?
          format(new Date(row.original.start_date), 'dd MMMM yyyy', { locale: fr }) :
          '—'
      ),
    },
    {
      header: 'Date de fin',
      accessorKey: 'end_date',
      cell: ({ row }: { row: { original: Advertisement } }) => (
        row.original.end_date ?
          format(new Date(row.original.end_date), 'dd MMMM yyyy', { locale: fr }) :
          '—'
      ),
    },
    {
      header: 'Actions',
      cell: ({ row }: { row: { original: Advertisement } }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/admin/advertisements/\${row.original.id}`)}
          >
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setSelectedId(row.original.id);
              setShowDeleteDialog(true);
            }}
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.showSuccess('Copié !', 'Le texte a été copié dans le presse-papiers');
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                  <Megaphone className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                    Gestion des publicités
                  </h1>
                  <p className="text-slate-500 text-base">
                    Gérez tous les publicités de la plateforme
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle publicité
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929] to-[#005929]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Publicités</p>
                  <p className="text-2xl font-light text-slate-800">{data?.count || 0}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Clics</p>
                  <p className="text-2xl font-light text-slate-800">{data?.results?.reduce((sum, ad) => sum + (ad.clicks || 0), 0) || 0}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929] to-[#005929]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Publicités Actives</p>
                  <p className="text-2xl font-light text-slate-800">{data?.results?.filter(ad => ad.is_active).length || 0}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Impressions</p>
                  <p className="text-2xl font-light text-slate-800">{data?.results?.filter(ad => ad.impressions).length || 0}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg border border-slate-200/60 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 flex justify-center">
              <LoadingPage />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {data?.results.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{ad.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {ad.placement === 'pre_roll' ? 'Pré-roll' :
                        ad.placement === 'mid_roll' ? 'Mid-roll' :
                          ad.placement === 'banner' ? 'Bannière' : 'Interstitiel'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {ad.is_active ? (
                        <Badge variant="secondary">Actif</Badge>
                      ) : (
                        <Badge variant="destructive">Inactif</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{ad.clicks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{ad.impressions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {ad.start_date ?
                        format(new Date(ad.start_date), 'dd MMMM yyyy', { locale: fr }) :
                        '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {ad.end_date ?
                        format(new Date(ad.end_date), 'dd MMMM yyyy', { locale: fr }) :
                        '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title='Voir les détails'
                          onClick={() => router.push(`/dashboard/admin/advertisements/${ad.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                        </Button>
                        {ad.click_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title='Voir la destination'
                            onClick={() => {
                               window.open(ad.click_url, '_blank');
                            }}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                          </Button>
                        )}
                        {ad.click_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Copier l'URL"
                            onClick={() => {
                                copyToClipboard(`${ad.click_url}`);
                            }}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          title='Modifier la publicité'
                          onClick={() => handleEdit(ad)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedId(ad.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && data?.results.length === 0 && (
            <div className="p-6 text-center text-slate-500">
              Aucune publicité trouvée.
            </div>
          )}
        </div>
        {data?.results && data?.results.length && data?.results.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={data?.total_pages || 0}
              onPageChange={setPage}
              totalItems={data?.count}
              pageSize={pageSize}   
              />
            </div>
          )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        itemName="Publicité"
        message="Êtes-vous sûr de vouloir supprimer cette publicité ? Cette action est réversible."
      />

      <CreateAdvertisementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          // Optionnel: rafraîchir les données
        }}
      />

      <CreateAdvertisementModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAdvertisement(undefined);
        }}
        advertisement={selectedAdvertisement}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedAdvertisement(undefined);
          // Optionnel: rafraîchir les données
        }}
      />
    </div>
  );
}
