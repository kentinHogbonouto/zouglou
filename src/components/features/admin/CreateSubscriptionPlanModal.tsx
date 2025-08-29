import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download, 
  Music, 
  Wifi, 
  Play, 
  Star,
  CheckCircle,
  Infinity,
} from 'lucide-react';

interface CreateSubscriptionPlanData {
  name: string;
  description: string;
  price: string;
  duration_days: number;
  features: Record<string, unknown>;
  max_downloads: number;
  ads_free: boolean;
  high_quality: boolean;
  offline_mode: boolean;
  podcast_access: boolean;
  unlimited_playlists: boolean;
  max_playlists: number | null;
  unlimited_streaming: boolean;
  free_trial_days: number;
  is_featured: boolean;
  is_active: boolean;
}

interface CreateSubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubscriptionPlanData) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateSubscriptionPlanModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: CreateSubscriptionPlanModalProps) {
  const [formData, setFormData] = useState<Partial<CreateSubscriptionPlanData>>({
    name: '',
    description: '',
    price: '',
    duration_days: 30,
    max_downloads: 10,
    ads_free: false,
    high_quality: false,
    offline_mode: false,
    podcast_access: false,
    unlimited_playlists: false,
    max_playlists: 5,
    unlimited_streaming: false,
    free_trial_days: 0,
    is_featured: false,
    is_active: true,
    features: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration_days) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await onSubmit(formData as CreateSubscriptionPlanData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        duration_days: 30,
        max_downloads: 10,
        ads_free: false,
        high_quality: false,
        offline_mode: false,
        podcast_access: false,
        unlimited_playlists: false,
        max_playlists: 5,
        unlimited_streaming: false,
        free_trial_days: 0,
        is_featured: false,
        is_active: true,
        features: {}
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
    }
  };

  const handleFeatureChange = (feature: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [feature]: value,
      features: {
        ...prev.features,
        [feature]: value
      }
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
            <CreditCard className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Nouveau Plan d&apos; Abonnement</h2>
            <p className="text-slate-500">Créez un nouveau plan d&apos; abonnement pour la plateforme</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Nom du plan *
              </label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Premium Mensuel"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Prix (FCFA) *
              </label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="5000"
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée du plan..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005929]/20 focus:border-[#005929]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Durée (jours) *
              </label>
              <Input
                type="number"
                value={formData.duration_days || 30}
                onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Téléchargements max
              </label>
              <Input
                type="number"
                value={formData.max_downloads || 10}
                onChange={(e) => setFormData({ ...formData, max_downloads: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Jours d&apos; essai gratuit
              </label>
              <Input
                type="number"
                value={formData.free_trial_days || 0}
                onChange={(e) => setFormData({ ...formData, free_trial_days: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Fonctionnalités */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Fonctionnalités
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Sans publicités</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.ads_free || false}
                  onChange={(e) => handleFeatureChange('ads_free', e.target.checked)}
                  className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Qualité haute définition</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.high_quality || false}
                  onChange={(e) => handleFeatureChange('high_quality', e.target.checked)}
                  className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Mode hors ligne</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.offline_mode || false}
                  onChange={(e) => handleFeatureChange('offline_mode', e.target.checked)}
                  className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Accès aux podcasts</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.podcast_access || false}
                  onChange={(e) => handleFeatureChange('podcast_access', e.target.checked)}
                  className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium">Playlists illimitées</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.unlimited_playlists || false}
                  onChange={(e) => handleFeatureChange('unlimited_playlists', e.target.checked)}
                  className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Infinity className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Streaming illimité</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.unlimited_streaming || false}
                  onChange={(e) => handleFeatureChange('unlimited_streaming', e.target.checked)}
                  className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                />
              </div>
            </div>

            {!formData.unlimited_playlists && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Nombre maximum de playlists
                </label>
                <Input
                  type="number"
                  value={formData.max_playlists || 5}
                  onChange={(e) => setFormData({ ...formData, max_playlists: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Options du plan */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Options du plan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Plan actif</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_active || false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Mis en avant</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_featured || false}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-6 py-2"
            >
              {isSubmitting ? 'Création...' : 'Créer le plan'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
