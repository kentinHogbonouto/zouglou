'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mic, Save, X, Upload, Eye } from 'lucide-react';
import { UpdatePodcastData } from '@/shared/types/api';

interface ModernEditPodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdatePodcastData) => Promise<void>;
  isSubmitting: boolean;
  podcast?: {
    id: string;
    title: string;
    description?: string;
    cover?: string;
    category?: string;
    is_published: boolean;
  };
}

export function ModernEditPodcastModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  podcast
}: ModernEditPodcastModalProps) {
  const [formData, setFormData] = useState({
    title: podcast?.title || '',
    description: podcast?.description || '',
    category: podcast?.category || '',
    is_published: podcast?.is_published || false,
  });
  const [selectedCover, setSelectedCover] = useState<File | null>(null);

  const categories = [
    'Musique',
    'Interview',
    'Discussion',
    'Éducation',
    'Divertissement',
    'Actualités',
    'Lifestyle',
    'Autre'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podcast) return;

    try {
      const updateData: UpdatePodcastData = { ...formData };
      if (selectedCover) updateData.cover = selectedCover;

      await onSubmit(updateData);
      onClose();
      setFormData({
        title: '',
        description: '',
        category: '',
        is_published: false,
      });
      setSelectedCover(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du podcast:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm max-w-2xl w-full mx-4">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-2xl font-medium text-slate-800 flex items-center gap-2">
            <Mic className="w-6 h-6 text-[#FE5200]" />
            Modifier le Podcast
          </CardTitle>
          <p className="text-slate-500">Mettez à jour les informations de votre podcast</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Titre du podcast</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border-slate-200 focus:border-[#FE5200] focus:ring-[#FE5200]/20"
                  placeholder="Titre du podcast"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#FE5200] focus:ring-[#FE5200]/20 resize-none"
                  rows={4}
                  placeholder="Description du podcast"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#FE5200] focus:ring-[#FE5200]/20 bg-white"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Nouvelle image de couverture (optionnel)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-[#FE5200]/50 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 mb-2">
                    Glissez-déposez une image ou cliquez pour sélectionner
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedCover(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#FE5200] file:to-[#FE5200]/90 file:text-white hover:file:from-[#FE5200]/90 hover:file:to-[#FE5200]"
                  />
                </div>
              </div>
              {podcast?.cover && (
                <div className="flex items-center gap-2 p-3 bg-slate-50/50 rounded-lg">
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    Image actuelle: {podcast.cover.split('/').pop()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#FE5200]/5 to-[#FE5200]/10 rounded-lg border border-[#FE5200]/20">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded border-slate-300 text-[#FE5200] focus:ring-[#FE5200]/20"
              />
              <span className="text-sm font-medium text-slate-700">Publier ce podcast</span>
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
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 text-white font-medium rounded-lg hover:from-[#FE5200]/90 hover:to-[#FE5200] transition-all duration-200 shadow-lg hover:shadow-xl"
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

