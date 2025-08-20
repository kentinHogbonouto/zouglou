'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Headphones, Save, X, Upload, Eye, Clock, Mic } from 'lucide-react';
import { UpdatePodcastEpisodeData } from '@/shared/types/api';
interface ModernEditEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdatePodcastEpisodeData) => Promise<void>;
  isSubmitting: boolean;
  episode?: {
    id: string;
    title: string;
    description?: string;
    cover?: string;
    audio_file?: string;
    duration?: number;
    is_published: boolean;
  };
}

export function ModernEditEpisodeModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  episode
}: ModernEditEpisodeModalProps) {
  const [formData, setFormData] = useState<UpdatePodcastEpisodeData>({
    title: episode?.title || '',
    description: episode?.description || '',
    is_published: episode?.is_published || false,
  });
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!episode) return;

    try {
      const updateData = { ...formData };
      if (selectedCover) updateData.cover_image = selectedCover;
      if (selectedAudio) updateData.audio_file = selectedAudio;

      await onSubmit(updateData);
      onClose();
      setFormData({});
      setSelectedCover(null);
      setSelectedAudio(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'épisode:', error);
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm max-w-2xl w-full mx-4">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-2xl font-medium text-slate-800 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-[#005929]" />
            Modifier l&apos;Épisode
          </CardTitle>
          <p className="text-slate-500">Mettez à jour les informations de votre épisode</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Titre de l&apos;épisode</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                  placeholder="Titre de l&apos;épisode"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#005929] focus:ring-[#005929]/20 resize-none"
                  rows={4}
                  placeholder="Description de l&apos;épisode"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Nouveau fichier audio (optionnel)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-[#005929]/50 transition-colors">
                  <div className="text-center">
                    <Mic className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 mb-2">Fichier audio</p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setSelectedAudio(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#005929] file:to-[#005929]/90 file:text-white hover:file:from-[#005929]/90 hover:file:to-[#005929]"
                    />
                  </div>
                </div>
                {episode?.audio_file && (
                  <div className="flex items-center gap-2 p-3 bg-slate-50/50 rounded-lg">
                    <Headphones className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      Fichier actuel: {episode.audio_file.split('/').pop()}
                    </span>
                  </div>
                )}
                {episode?.duration && (
                  <div className="flex items-center gap-2 p-3 bg-slate-50/50 rounded-lg">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      Durée: {formatDuration(episode.duration)}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Nouvelle image de couverture (optionnel)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-[#005929]/50 transition-colors">
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 mb-2">Image de couverture</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedCover(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#005929] file:to-[#005929]/90 file:text-white hover:file:from-[#005929]/90 hover:file:to-[#005929]"
                    />
                  </div>
                </div>
                {episode?.cover && (
                  <div className="flex items-center gap-2 p-3 bg-slate-50/50 rounded-lg">
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      Image actuelle: {episode.cover.split('/').pop()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#005929]/5 to-[#005929]/10 rounded-lg border border-[#005929]/20">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
              />
                <span className="text-sm font-medium text-slate-700">Publier cet épisode</span>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Modal>
  );
}

