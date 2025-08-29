"use client";

import { useState } from 'react';
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useRouter, useParams } from 'next/navigation';
import { 
  CreditCard, 
  Edit, 
  Users, 
  CheckCircle, 
  XCircle, 
  Star, 
  DollarSign, 
  Calendar,
  Download,
  Music,
  WifiOff,
  Headphones,
  Play,
  Clock,
  Zap,
  SquareChartGantt,
  Infinity
} from 'lucide-react';
import { useAdminSubscriptionPlan, useUpdateSubscriptionPlan } from '@/hooks/useAdminQueries';
import { useToast } from '@/components/providers/ToastProvider';

export default function PlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;
  const toast = useToast();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: 0,
    max_downloads: 0,
    free_trial_days: 0,
    ads_free: false,
    high_quality: false,
    offline_mode: false,
    podcast_access: false,
    unlimited_playlists: false,
    max_playlists: 0,
    unlimited_streaming: false,
    is_featured: false,
    is_active: true
  });

  const { data: plan, isLoading, error } = useAdminSubscriptionPlan(planId);
  const updatePlan = useUpdateSubscriptionPlan();

  const handleEditClick = () => {
    if (plan) {
      setEditForm({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration_days: plan.duration_days,
        max_downloads: plan.max_downloads,
        free_trial_days: plan.free_trial_days,
        ads_free: plan.ads_free,
        high_quality: plan.high_quality,
        offline_mode: plan.offline_mode,
        podcast_access: plan.podcast_access,
        unlimited_playlists: plan.unlimited_playlists,
        max_playlists: plan.max_playlists || 0,
        unlimited_streaming: plan.unlimited_streaming,
        is_featured: plan.is_featured,
        is_active: plan.is_active
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updatePlan.mutateAsync({ id: planId, data: editForm });
      setShowEditModal(false);
      toast.showSuccess('Succès', 'Plan mis à jour avec succès');
    } catch {
      toast.showError('Erreur', 'Erreur lors de la mise à jour du plan');
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(parseFloat(price));
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

  const getFeatureIcon = (feature: string) => {
    const icons = {
      ads_free: <Zap className="w-4 h-4" />,
      high_quality: <Music className="w-4 h-4" />,
      offline_mode: <WifiOff className="w-4 h-4" />,
      podcast_access: <Headphones className="w-4 h-4" />,
      unlimited_playlists: <Play className="w-4 h-4" />,
      unlimited_streaming: <Infinity className="w-4 h-4" />
    };
    return icons[feature as keyof typeof icons] || <CheckCircle className="w-4 h-4" />;
  };

  const getFeatureName = (feature: string) => {
    const names = {
      ads_free: 'Sans publicités',
      high_quality: 'Haute qualité audio',
      offline_mode: 'Mode hors ligne',
      podcast_access: 'Accès aux podcasts',
      unlimited_playlists: 'Playlists illimitées',
      unlimited_streaming: 'Streaming illimité'
    };
    return names[feature as keyof typeof names] || feature;
  };

  if (isLoading) {
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

  if (error || !plan) {
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
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <CreditCard className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      {plan.name}
                    </h1>
                    <p className="text-slate-500 text-base">
                      Détails et configuration du plan d&apos;abonnement
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/admin/plans-subscription/${planId}/subscribers`)}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Voir les abonnés
                </Button>
                <Button
                  onClick={handleEditClick}
                  className="bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plan Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SquareChartGantt className="w-5 h-5" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{plan.name}</h3>
                    <p className="text-slate-600">{plan.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-slate-500">Prix</p>
                        <p className="font-semibold text-slate-800">{formatPrice(plan.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-slate-500">Durée</p>
                        <p className="font-semibold text-slate-800">{plan.duration_days} jours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-slate-500">Téléchargements max</p>
                        <p className="font-semibold text-slate-800">
                          {plan.max_downloads === -1 ? 'Illimité' : plan.max_downloads}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-slate-500">Essai gratuit</p>
                        <p className="font-semibold text-slate-800">
                          {plan.free_trial_days > 0 ? `${plan.free_trial_days} jours` : 'Aucun'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Fonctionnalités
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries({
                      ads_free: plan.ads_free,
                      high_quality: plan.high_quality,
                      offline_mode: plan.offline_mode,
                      podcast_access: plan.podcast_access,
                      unlimited_playlists: plan.unlimited_playlists,
                      unlimited_streaming: plan.unlimited_streaming
                    }).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                        <div className={`p-2 rounded-lg ${enabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                          {getFeatureIcon(feature)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{getFeatureName(feature)}</p>
                          <p className="text-sm text-slate-500">
                            {enabled ? 'Inclus' : 'Non inclus'}
                          </p>
                        </div>
                        {enabled && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Statut</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {plan.is_active ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${plan.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {plan.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  
                  {plan.is_featured && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-600">Mis en avant</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Métadonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Créé le</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(plan.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Modifier le plan</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Nom du plan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <Input
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Description du plan"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prix (FCFA)</label>
                  <Input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Durée (jours)</label>
                  <Input
                    type="number"
                    value={editForm.duration_days}
                    onChange={(e) => setEditForm({ ...editForm, duration_days: parseInt(e.target.value) })}
                    placeholder="30"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléchargements max</label>
                  <Input
                    type="number"
                    value={editForm.max_downloads}
                    onChange={(e) => setEditForm({ ...editForm, max_downloads: parseInt(e.target.value) })}
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jours d&apos;essai</label>
                  <Input
                    type="number"
                    value={editForm.free_trial_days}
                    onChange={(e) => setEditForm({ ...editForm, free_trial_days: parseInt(e.target.value) })}
                    placeholder="7"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.ads_free}
                    onChange={(e) => setEditForm({ ...editForm, ads_free: e.target.checked })}
                    className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                  />
                  <span className="ml-2 text-sm text-slate-700">Sans publicités</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.high_quality}
                    onChange={(e) => setEditForm({ ...editForm, high_quality: e.target.checked })}
                    className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                  />
                  <span className="ml-2 text-sm text-slate-700">Haute qualité audio</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.offline_mode}
                    onChange={(e) => setEditForm({ ...editForm, offline_mode: e.target.checked })}
                    className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                  />
                  <span className="ml-2 text-sm text-slate-700">Mode hors ligne</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.podcast_access}
                    onChange={(e) => setEditForm({ ...editForm, podcast_access: e.target.checked })}
                    className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                  />
                  <span className="ml-2 text-sm text-slate-700">Accès aux podcasts</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.unlimited_playlists}
                    onChange={(e) => setEditForm({ ...editForm, unlimited_playlists: e.target.checked })}
                    className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                  />
                  <span className="ml-2 text-sm text-slate-700">Playlists illimitées</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.unlimited_streaming}
                    onChange={(e) => setEditForm({ ...editForm, unlimited_streaming: e.target.checked })}
                    className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                  />
                  <span className="ml-2 text-sm text-slate-700">Streaming illimité</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.is_featured}
                    onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.checked })}
                    className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                  />
                  <span className="ml-2 text-sm text-slate-700">Mis en avant</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                  />
                  <span className="ml-2 text-sm text-slate-700">Actif</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={updatePlan.isPending}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updatePlan.isPending}
                className="bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white"
              >
                {updatePlan.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminRoute>
  );
}
