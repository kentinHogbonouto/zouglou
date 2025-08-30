'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/providers/ToastProvider';
import { useAdvertisement, useAdvertisementAudio } from '@/hooks';
import { Loading } from '@/components/ui/Loading';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Megaphone, 
  Calendar, 
  Eye, 
  MousePointer,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useRealDeleteAdvertisement } from '@/hooks';
import Image from 'next/image';
import { CreateAdvertisementModal } from '@/components/features/admin/CreateAdvertisementModal';

export default function AdvertisementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: advertisement, isLoading, isError } = useAdvertisement(
    params.id as string
  );

  // Hook pour la gestion audio des publicités
  const {
    isPlaying,
    isLoading: isAudioLoading,
    error: audioError,
    toggleAudio,
    stopAudio,
  } = useAdvertisementAudio({
    audioUrl: advertisement?.audio_url || null,
    onError: (error) => {
      toast.showError(error);
    },
  });

  const deleteMutation = useRealDeleteAdvertisement();

  // Arrêter l'audio quand on quitte la page
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(params.id as string);
      toast.showSuccess('Publicité supprimée avec succès');
      router.push('/dashboard/admin/advertisements');
    } catch (error) {
      toast.showError('Erreur lors de la suppression de la publicité');
      console.error('Erreur lors de la suppression de la publicité', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.showSuccess('Copié !', 'Le texte a été copié dans le presse-papiers');
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };



  if (isLoading) {
    return <Loading />;
  }

  if (isError || !advertisement) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Publicité non trouvée</h2>
          <p className="text-slate-600 mb-4">La publicité que vous recherchez n&apos;existe pas.</p>
          <Button onClick={() => router.push('/dashboard/admin/advertisements')}>
            Retour aux publicités
          </Button>
        </div>
      </div>
    );
  }

  const getPlacementLabel = (placement: string) => {
    switch (placement) {
      case 'pre_roll': return 'Pré-roll';
      case 'mid_roll': return 'Mid-roll';
      case 'banner': return 'Bannière';
      case 'interstitial': return 'Interstitiel';
      default: return placement;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard/admin/advertisements')}
                  className="p-2 hover:bg-slate-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                  <Megaphone className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                    Détails de la publicité
                  </h1>
                  <p className="text-slate-500 text-base">
                    {advertisement.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Image et détails */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image de la publicité */}
            {advertisement.image_url && (
              <Card className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="relative">
                  <Image
                    width={400}
                    height={400}
                    src={advertisement.image_url}
                    alt={advertisement.title}
                    className="w-full h-64 lg:h-96 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                      {getPlacementLabel(advertisement.placement)}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Informations détaillées */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                  {advertisement.title}
                </h2>
                
                {advertisement.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-slate-700 mb-2">Description</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {advertisement.description}
                    </p>
                  </div>
                )}

                {/* Audio Player */}
                {advertisement.audio_url && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-slate-700 mb-3 flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      Fichier audio
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      {audioError ? (
                        <div className="text-red-600 text-sm mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
                          {audioError}
                        </div>
                      ) : null}
                      
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={toggleAudio}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          disabled={isAudioLoading}
                        >
                          {isAudioLoading ? (
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                          ) : isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          {isAudioLoading ? 'Chargement...' : isPlaying ? 'Pause' : 'Écouter'}
                        </Button>
                        <div className="flex-1">
                          <div className="text-sm text-slate-600">
                            Durée: {formatDuration(advertisement.duration || 0)}
                          </div>
                          {advertisement.audio_url && (
                            <div className="text-xs text-slate-500 mt-1">
                              URL: {advertisement.audio_url}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* URL de redirection */}
                {advertisement.click_url && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      URL de redirection
                    </h3>
                    <div className="flex items-center gap-2">
                      <a
                        href={advertisement.click_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#005929] hover:text-[#005929]/80 underline break-all"
                      >
                        {advertisement.click_url}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(advertisement.click_url as string)}
                        className="p-1"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - Statistiques et métadonnées */}
          <div className="space-y-6">
            {/* Statut et actions rapides */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Statut</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Statut</span>
                    <Badge variant={advertisement.is_active ? 'secondary' : 'destructive'}>
                      {advertisement.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Placement</span>
                    <Badge variant="outline">
                      {getPlacementLabel(advertisement.placement)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Durée</span>
                    <span className="text-slate-800 font-medium">
                      {formatDuration(advertisement.duration || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Statistiques */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <MousePointer className="w-4 h-4" />
                      Clics
                    </span>
                    <span className="text-slate-800 font-medium">
                      {advertisement.clicks || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Impressions
                    </span>
                    <span className="text-slate-800 font-medium">
                      {advertisement.impressions || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Dates */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Période
                </h3>
                <div className="space-y-4">
                  {advertisement.start_date && (
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Date de début</div>
                      <div className="text-slate-800 font-medium">
                        {format(new Date(advertisement.start_date), 'dd MMMM yyyy', { locale: fr })}
                      </div>
                    </div>
                  )}
                  {advertisement.end_date && (
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Date de fin</div>
                      <div className="text-slate-800 font-medium">
                        {format(new Date(advertisement.end_date), 'dd MMMM yyyy', { locale: fr })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        itemName="Publicité"
        message="Êtes-vous sûr de vouloir supprimer cette publicité ? Cette action est irréversible."
      />

      <CreateAdvertisementModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        advertisement={advertisement}
        onSuccess={() => {
          setShowEditModal(false);
          // Optionnel: rafraîchir les données
        }}
      />
    </div>
  );
}
