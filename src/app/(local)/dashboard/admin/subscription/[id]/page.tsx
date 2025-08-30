"use client";

import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CreditCard, Calendar, DollarSign, User, CheckCircle, XCircle, AlertCircle, Clock, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { useAdminSubscription } from '@/hooks/useAdminQueries';


export default function AdminSubscriptionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const subscriptionId = params.id as string;

  const { data: subscription, isLoading, error } = useAdminSubscription(subscriptionId);

  const getStatusBadge = (status: 'active' | 'cancelled' | 'expired' | 'pending') => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            Actif
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-2" />
            Annulé
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <Clock className="w-4 h-4 mr-2" />
            Expiré
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-4 h-4 mr-2" />
            En attente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getPaymentMethodBadge = (method: string | null) => {
    if (!method) return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        Non défini
      </span>
    );

    switch (method) {
      case 'fedapay':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            FedaPay
          </span>
        );
      case 'paydunia':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            PayDunia
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {method}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(parseFloat(price));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.showSuccess('Copié !', 'Le texte a été copié dans le presse-papiers');
  };

  const handleViewUser = () => {
    router.push(`/dashboard/admin/user/${subscription?.user.id}`);
  };

  const handleViewPlan = () => {
    router.push(`/dashboard/admin/plans-subscription/${subscription?.plan.id}`);
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005929] mx-auto"></div>
            <p className="mt-4 text-slate-600">Chargement de l&apos;abonnement...</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (error || !subscription) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <CreditCard className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-slate-800 mb-2">Abonnement non trouvé</h2>
            <p className="text-slate-600 mb-4">L&apos;abonnement que vous recherchez n&apos;existe pas ou a été supprimé.</p>
            <Button onClick={() => router.push('/dashboard/admin/subscription')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux abonnements
            </Button>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard/admin/subscription')}
                    className="p-2 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </Button>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <CreditCard className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      Détails de l&apos;Abonnement
                    </h1>
                    <p className="text-slate-500 text-base">
                      ID: {subscription.id}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                {getStatusBadge(subscription.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Plan Information */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#005929]" />
                    Informations du Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Nom du Plan</label>
                      <p className="text-lg font-medium text-slate-900">{subscription.plan.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Prix</label>
                      <p className="text-lg font-medium text-slate-900">{formatPrice(subscription.plan.price)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Durée</label>
                      <p className="text-lg font-medium text-slate-900">{subscription.plan.duration_days} jours</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Auto-renouvellement</label>
                      <p className="text-lg font-medium text-slate-900">
                        {subscription.auto_renew ? 'Activé' : 'Désactivé'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Description</label>
                    <p className="text-slate-700 mt-1">{subscription.plan.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleViewPlan}
                      className="border-[#005929] text-[#005929] hover:bg-[#005929] hover:text-white"
                    >
                      Voir le Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Period */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#005929]" />
                    Période d&apos;Abonnement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Date de début</label>
                      <p className="text-lg font-medium text-slate-900">{formatDate(subscription.start_date)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Date de fin</label>
                      <p className="text-lg font-medium text-slate-900">{formatDate(subscription.end_date)}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">
                      <strong>Statut:</strong> {getStatusBadge(subscription.status)}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      <strong>Méthode de paiement:</strong> {getPaymentMethodBadge(subscription.payment_method)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Details */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#005929]" />
                    Détails de la Transaction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Référence</label>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-medium text-slate-900 font-mono">{subscription.transaction.reference}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(subscription.transaction.reference)}
                          className="p-1"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Montant</label>
                      <p className="text-lg font-medium text-slate-900">{formatPrice(subscription.transaction.amount.toString())}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Service de paiement</label>
                      <p className="text-lg font-medium text-slate-900">{subscription.transaction.payment_service_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Statut de la transaction</label>
                      <p className="text-lg font-medium text-slate-900">{subscription.transaction.status}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">ID Transaction</label>
                      <p className="text-lg font-medium text-slate-900">{subscription.transaction.id_transaction}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Customer ID</label>
                      <p className="text-lg font-medium text-slate-900">{subscription.transaction.customer_id}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Description</label>
                    <p className="text-slate-700 mt-1">{subscription.transaction.description}</p>
                  </div>
                  {subscription.transaction.url && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => window.open(subscription.transaction.url, '_blank')}
                        className="border-[#005929] text-[#005929] hover:bg-[#005929] hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir la Transaction
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Information */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#005929]" />
                    Utilisateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Nom Complet</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">{subscription.user.full_name}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleViewUser}
                    className="w-full border-[#005929] text-[#005929] hover:bg-[#005929] hover:text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Voir l&apos;Utilisateur
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Features */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#005929]" />
                    Fonctionnalités du Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Téléchargements max</span>
                    <span className="text-sm font-medium text-slate-900">
                      {subscription.plan.max_downloads === -1 ? 'Illimité' : subscription.plan.max_downloads}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Sans publicité</span>
                    <span className="text-sm font-medium text-slate-900">
                      {subscription.plan.ads_free ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Haute qualité</span>
                    <span className="text-sm font-medium text-slate-900">
                      {subscription.plan.high_quality ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Mode hors ligne</span>
                    <span className="text-sm font-medium text-slate-900">
                      {subscription.plan.offline_mode ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Accès podcasts</span>
                    <span className="text-sm font-medium text-slate-900">
                      {subscription.plan.podcast_access ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Playlists illimitées</span>
                    <span className="text-sm font-medium text-slate-900">
                      {subscription.plan.unlimited_playlists ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Streaming illimité</span>
                    <span className="text-sm font-medium text-slate-900">
                      {subscription.plan.unlimited_streaming ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Jours d&apos;essai</span>
                    <span className="text-sm font-medium text-slate-900">
                      {subscription.plan.free_trial_days} jours
                    </span>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
