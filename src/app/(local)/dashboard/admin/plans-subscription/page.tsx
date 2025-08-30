"use client";

import { useState } from 'react';
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useRouter } from 'next/navigation';
import { CreditCard, Search, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Star, DollarSign, Users, SquareChartGantt } from 'lucide-react';
import { useAdminSubscriptionPlans, useDeleteSubscriptionPlan, useCreateSubscriptionPlan } from '@/hooks/useAdminQueries';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CreateSubscriptionPlanModal } from '@/components/features/admin/CreateSubscriptionPlanModal';
import { CreateSubscriptionPlanData } from '@/shared/types/api';
import { useDebounce } from '@/hooks';


export default function AdminSubscriptionPlansPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not_featured'>('all');
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; planId: string | null; planName: string }>({
    isOpen: false,
    planId: null,
    planName: ''
  });

  const debouncedSearchTerm = useDebounce(searchTerm)
  // React Query hooks
  const {
    data: plansData,
    isLoading,
    error,
    isError,
    refetch
  } = useAdminSubscriptionPlans({
    page: currentPage,
    page_size: 10,
    name: debouncedSearchTerm|| undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
    is_featured: featuredFilter === 'all' ? undefined : featuredFilter === 'featured',
  });

  const deletePlan = useDeleteSubscriptionPlan();
  const createPlan = useCreateSubscriptionPlan();

  const plans = plansData?.results || [];
  const totalPlans = plansData?.count || 0;
  const totalPages = Math.ceil(totalPlans / 10);

  const handleViewPlan = (planId: string) => {
    router.push(`/dashboard/admin/plans-subscription/${planId}`);
  };

  const handleViewSubscribers = (planId: string) => {
    router.push(`/dashboard/admin/plans-subscription/${planId}/subscribers`);
  };

  const handleEditPlan = (planId: string) => {
    router.push(`/dashboard/admin/plans-subscription/${planId}`);
  };

  const handleCreatePlan = async (data: CreateSubscriptionPlanData) => {
    try {
      await createPlan.mutateAsync(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleDeletePlan = async (planId: string, planName: string) => {
    setDeleteModal({ isOpen: true, planId, planName });
  };

  const confirmDelete = async () => {
    if (deleteModal.planId) {
      try {
        await deletePlan.mutateAsync(deleteModal.planId);
        setDeleteModal({ isOpen: false, planId: null, planName: '' });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, planId: null, planName: '' });
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlans(prev =>
      prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPlans.length === plans.length) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(plans.map(plan => plan.id));
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Actif
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactif
      </span>
    );
  };

  const getFeaturedBadge = (isFeatured: boolean) => {
    return isFeatured ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Star className="w-3 h-3 mr-1" />
        Mis en avant
      </span>
    ) : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(parseFloat(price));
  };

  const filteredPlans = plans.filter(plan => {
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      return (
        plan.name.toLowerCase().includes(searchLower) ||
        plan.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const activePlans = plans.filter(p => p.is_active).length;
  const featuredPlans = plans.filter(p => p.is_featured).length;
  const totalRevenue = plans
    .filter(p => p.is_active)
    .reduce((sum, p) => sum + parseFloat(p.price), 0);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <SquareChartGantt className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      Gestion des Plans d&apos;Abonnement
                    </h1>
                    <p className="text-slate-500 text-base">
                      Créez et gérez les plans d&apos;abonnement de la plateforme
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  className="bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Plan
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
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Plans</p>
                    <p className="text-2xl font-light text-slate-800">{totalPlans}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Plans Actifs</p>
                    <p className="text-2xl font-light text-slate-800">{activePlans}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929] to-[#005929]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Plans Mis en Avant</p>
                    <p className="text-2xl font-light text-slate-800">{featuredPlans}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Valeur Totale</p>
                    <p className="text-2xl font-light text-slate-800">{formatPrice(totalRevenue.toString())}</p>
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
                      placeholder="Rechercher un plan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                  </select>
                  <select
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'featured' | 'not_featured')}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les plans</option>
                    <option value="featured">Mis en avant</option>
                    <option value="not_featured">Non mis en avant</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plans List */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Liste des Plans
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>{filteredPlans.length} plan(s)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <LoadingState message="Chargement des plans..." />
              ) : isError ? (
                <ErrorState
                  title="Erreur lors du chargement des plans"
                  message={error?.message || 'Une erreur inattendue s\'est produite'}
                  onRetry={() => refetch()}
                />
              ) : filteredPlans.length === 0 ? (
                <div className="p-8 text-center">
                  <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Aucun plan trouvé</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedPlans.length === filteredPlans.length}
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Durée
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date de création
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredPlans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedPlans.includes(plan.id)}
                              onChange={() => handleSelectPlan(plan.id)}
                              className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {plan.name}
                              </div>
                              <div className="flex gap-1 mt-1">
                                {getStatusBadge(plan.is_active)}
                                {getFeaturedBadge(plan.is_featured)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">
                              {formatPrice(plan.price)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {plan.free_trial_days > 0 ? `${plan.free_trial_days} jours d'essai` : 'Aucun essai'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              {plan.duration_days} jours
                            </div>
                            <div className="text-xs text-slate-500">
                              {plan.duration_days >= 365 ? 'Annuel' : plan.duration_days >= 30 ? 'Mensuel' : 'Personnalisé'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(plan.is_active)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(plan.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewSubscribers(plan.id)}
                                className="text-slate-600 hover:text-[#005929] hover:bg-[#005929]/10"
                                title="Voir les abonnés"
                              >
                                <Users className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewPlan(plan.id)}
                                className="text-slate-600 hover:text-[#005929] hover:bg-[#005929]/10"
                                title="Voir les détails"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditPlan(plan.id)}
                                className="text-slate-600 hover:text-[#005929] hover:bg-[#005929]/10"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeletePlan(plan.id, plan.name)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deletePlan.isPending}
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={deleteModal.isOpen}
            onClose={cancelDelete}
            onConfirm={confirmDelete}
            message="Cette action est irréversible. Le plan et toutes ses données seront définitivement supprimés."
            itemName={deleteModal.planName}
            isDeleting={deletePlan.isPending}
          />

          {/* Create Plan Modal */}
          <CreateSubscriptionPlanModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreatePlan}
            isSubmitting={createPlan.isPending}
          />
        </div>
      </div>
    </AdminRoute>
  );
}
