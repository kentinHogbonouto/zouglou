import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Modal, ModalButton, ModalActions, ModalHeader, ModalContent } from '@/components/ui/Modal';
import { CreateAlbumData } from '@/shared/types/api';
import { Calendar } from 'lucide-react';

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAlbumData) => Promise<void>;
  isSubmitting: boolean;
  currentArtist: string;
}

export function CreateAlbumModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateAlbumModalProps) {
  const [formData, setFormData] = useState<Partial<CreateAlbumData>>({});
  const [selectedCover, setSelectedCover] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setTimeout(() => {
        setFormData({});
        setSelectedCover(null);
        onClose();
      }, 100);
      await onSubmit({
        ...formData as CreateAlbumData,
        cover_image: selectedCover || undefined,
      });

      // Reset form

    } catch (error) {
      console.error('Erreur lors de la création de l\'album:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalHeader>
        <div className="flex items-center gap-3 p-3">

          <div>
            <h2 className="text-2xl font-medium text-slate-800">Nouvel Album</h2>
            <p className="text-slate-500">Créez votre nouvel album musical</p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Titre de l&apos;album *</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                placeholder="Titre de votre album"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date de sortie
              </label>
              <Input
                type="date"
                value={formData.release_date || ''}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                placeholder="Sélectionner une date de sortie"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#005929] focus:ring-[#005929]/20 resize-none"
              placeholder="Décrivez votre album, son style, son inspiration..."
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Image de couverture (optionnel)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-[#005929]/50 transition-colors">
              <div className="text-center">

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedCover(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#005929] file:to-[#005929]/90 file:text-white hover:file:from-[#005929]/90 hover:file:to-[#005929]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#005929]/5 to-[#005929]/10 rounded-lg border border-[#005929]/20">
            <input
              type="checkbox"
              checked={formData.is_published || false}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
            />
            <span className="text-sm font-medium text-slate-700">Publier immédiatement</span>
          </div>

          <ModalActions className="p-4">
            <ModalButton
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Annuler
            </ModalButton>
            <ModalButton
              type="submit"
              variant="primary"
            >
              Créer l&apos;album
            </ModalButton>
          </ModalActions>
        </form>
      </ModalContent>
    </Modal>
  );
} 