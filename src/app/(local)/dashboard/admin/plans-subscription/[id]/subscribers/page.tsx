"use client";

import { useState } from 'react';
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { useRouter, useParams } from 'next/navigation';
import { 
  Users, 
  Search, 
  XCircle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  CreditCard,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { useAdminSubscriptionPlan, useAdminSubscriptions } from '@/hooks/useAdminQueries';

export default function PlanSubscribersPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelled' | 'expired'>('all');


  // React Query hooks
  const { data: planData, isLoading: planLoading } = useAdminSubscriptionPlan(planId);
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useAdminSubscriptions({
    plan: planId,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page: currentPage,
    page_size: 10
  });



  const plan = planData;
  const subscriptions = subscriptionsData?.results || [];
  const totalSubscriptions = subscriptionsData?.count || 0;
  const totalPages = Math.ceil(totalSubscriptions / 10);


 

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Actif' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Annulé' },
      expired: { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Expiré' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        subscription.user.full_name.toLowerCase().includes(searchLower) ||
        subscription.plan?.name.toLowerCase().includes(searchLower) ||
        subscription.transaction?.reference.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const totalRevenue = plan ? subscriptions.filter(s => s.status === 'active').reduce((sum) => sum + parseFloat(plan.price || '0'), 0) : 0;

  if (planLoading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005929] mx-auto"></div>
            <p className="mt-4 text-slate-600">Chargement du plan...</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (!plan) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <CreditCard className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Plan non trouvé</h2>
            <p className="text-slate-600 mb-4">Le plan demandé n&apos;existe pas ou a été supprimé.</p>
            <Button onClick={() => router.back()}>
              Retour
            </Button>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="p-2 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      Abonnés - {plan.name}
                    </h1>
                    <p className="text-slate-500 text-base">
                      Gestion des abonnements pour ce plan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929] to-[#005929]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Abonnés</p>
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
                    <p className="text-sm font-medium text-slate-600">Abonnés Actifs</p>
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
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher un abonné..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'cancelled' | 'expired')}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actifs</option>
                    <option value="cancelled">Annulés</option>
                    <option value="expired">Expirés</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscribers List */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Liste des Abonnés
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>{filteredSubscriptions.length} abonné(s)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {subscriptionsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005929] mx-auto"></div>
                  <p className="mt-2 text-slate-600">Chargement des abonnés...</p>
                </div>
              ) : filteredSubscriptions.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Aucun abonné trouvé</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Renouvellement
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
                            <div className="text-sm font-medium text-slate-900">
                              {subscription.user.full_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {subscription.plan?.name || 'Plan inconnu'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(subscription.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              <div>Début: {formatDate(subscription.start_date)}</div>
                              <div>Fin: {formatDate(subscription.end_date)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {subscription.auto_renew ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-sm text-slate-600">
                                {subscription.auto_renew ? 'Auto' : 'Manuel'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>router.push(`/dashboard/admin/subscription/${subscription.id}`)}
                                className="text-slate-600 hover:text-[#005929] hover:bg-[#005929]/10"
                                title="Modifier"
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
