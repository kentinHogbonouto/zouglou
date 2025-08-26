"use client";

import { useState } from 'react';
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { useRouter } from 'next/navigation';
import { CreditCard, Search, Plus, Eye, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAdminSubscriptions } from '@/hooks/useAdminQueries';


export default function AdminSubscriptionPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelled' | 'expired' | 'pending'>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'all' | 'fedapay' | 'paydunia'>('all');
  const [autoRenewFilter, setAutoRenewFilter] = useState<'all' | 'true' | 'false'>('all');

  // React Query hooks
  const { data: subscriptionsData, isLoading,  } = useAdminSubscriptions({
    page: currentPage,
    page_size: 10,
    status: statusFilter === 'all' ? undefined : statusFilter,
    payment_method: paymentMethodFilter === 'all' ? undefined : paymentMethodFilter,
    auto_renew: autoRenewFilter === 'all' ? undefined : autoRenewFilter === 'true',
  });

  const subscriptions = subscriptionsData?.results || [];
  const totalSubscriptions = subscriptionsData?.count || 0;
  const totalPages = Math.ceil(totalSubscriptions / 10);

  const handleViewSubscription = (subscriptionId: string) => {
    router.push(`/dashboard/admin/subscription/${subscriptionId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Actif
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Annulé
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            Expiré
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            En attente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getPaymentMethodBadge = (method: string | null) => {
    if (!method) return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Non défini
      </span>
    );

    switch (method) {
      case 'fedapay':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            FedaPay
          </span>
        );
      case 'paydunia':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            PayDunia
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {method}
          </span>
        );
    }
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

  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        subscription.plan.name.toLowerCase().includes(searchLower) ||
        subscription.transaction.reference.toLowerCase().includes(searchLower) ||
        subscription.id.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalRevenue = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + parseFloat(s.plan.price), 0);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const pendingSubscriptions = subscriptions.filter(s => s.status === 'pending').length;

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <CreditCard className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      Gestion des Abonnements
                    </h1>
                    <p className="text-slate-500 text-base">
                      Gérez tous les abonnements de la plateforme
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  className="bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => router.push('/dashboard/admin/subscription/plans')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Gérer les Plans
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929] to-[#005929]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Abonnements</p>
                    <p className="text-2xl font-light text-slate-800">{totalSubscriptions}</p>
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
                    <p className="text-sm font-medium text-slate-600">Abonnements Actifs</p>
                    <p className="text-2xl font-light text-slate-800">{activeSubscriptions}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929] to-[#005929]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Revenus Totaux</p>
                    <p className="text-2xl font-light text-slate-800">{formatPrice(totalRevenue.toString())}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">En Attente</p>
                    <p className="text-2xl font-light text-slate-800">{pendingSubscriptions}</p>
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
                      placeholder="Rechercher un abonnement..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'cancelled' | 'expired' | 'pending')}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actifs</option>
                    <option value="cancelled">Annulés</option>
                    <option value="expired">Expirés</option>
                    <option value="pending">En attente</option>
                  </select>
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value as 'all' | 'fedapay' | 'paydunia')}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Toutes les méthodes</option>
                    <option value="fedapay">FedaPay</option>
                    <option value="paydunia">PayDunia</option>
                  </select>
                  <select
                    value={autoRenewFilter}
                    onChange={(e) => setAutoRenewFilter(e.target.value as 'all' | 'true' | 'false')}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les renouvellements</option>
                    <option value="true">Auto-renouvellement</option>
                    <option value="false">Sans auto-renouvellement</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions List */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Liste des Abonnements
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>{filteredSubscriptions.length} abonnement(s)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005929] mx-auto"></div>
                  <p className="mt-2 text-slate-600">Chargement des abonnements...</p>
                </div>
              ) : filteredSubscriptions.length === 0 ? (
                <div className="p-8 text-center">
                  <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Aucun abonnement trouvé</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Paiement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Période
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
                      {filteredSubscriptions.map((subscription) => (
                        <tr key={subscription.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {subscription.plan.name}
                              </div>
                              <div className="text-sm text-slate-500">
                                {subscription.plan.description}
                              </div>
                              <div className="text-xs text-slate-400">
                                {subscription.plan.duration_days} jours
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              ID: {subscription.user.substring(0, 8)}...
                            </div>
                            <div className="text-xs text-slate-500">
                              Réf: {subscription.transaction.reference}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(subscription.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getPaymentMethodBadge(subscription.payment_method)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">
                              {formatPrice(subscription.plan.price)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {subscription.auto_renew ? 'Auto-renouvellement' : 'Sans auto-renouvellement'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              Du {formatDate(subscription.start_date)}
                            </div>
                            <div className="text-sm text-slate-500">
                              Au {formatDate(subscription.end_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(subscription.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewSubscription(subscription.id)}
                                className="text-slate-600 hover:text-[#005929] hover:bg-[#005929]/10"
                              >
                                <Eye className="w-4 h-4" />
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
        </div>
      </div>
    </AdminRoute>
  );
}
