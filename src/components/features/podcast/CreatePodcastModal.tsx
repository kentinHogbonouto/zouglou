"use client";

import { useState } from 'react';
import { Modal, ModalHeader, ModalContent, ModalActions, ModalButton } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useCreatePodcast } from '@/hooks/usePodcastQuery';
import { CreatePodcastData } from '@/shared/types/api';
import { GenreSelect } from '@/components/ui/GenreSelect';
import { Mic, Upload, FileText, Hash } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface CreatePodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreatePodcastModal({ isOpen, onClose, onSuccess }: CreatePodcastModalProps) {
  const createPodcast = useCreatePodcast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreatePodcastData>({
    title: '',
    description: '',
    artist: '',
    genre: '',
    is_published: false
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setTimeout(() => {
        handleClose();
      }, 100);
      const data: CreatePodcastData = {
        ...formData,
        artist: user?.artist_profile?.id || '',
        cover: coverFile || undefined
      };
      await createPodcast.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création du podcast:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      artist: '',
      genre: '',
      is_published: false
    });
    setCoverFile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader>
        <div className="flex items-center gap-3 p-4">
          
          <div>
            <h2 className="text-2xl font-medium text-slate-800">Créer un nouveau podcast</h2>
            <p className="text-slate-500">Ajoutez un nouveau podcast à votre collection</p>
          </div>
        </div>
      </ModalHeader>
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#005929]" />
              Titre du podcast *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Entrez le titre du podcast"
              className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#005929]" />
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre podcast"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#005929] focus:ring-[#005929]/20 resize-none"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#005929]" />
              Genre *
            </label>
            <GenreSelect
              value={formData.genre}
              onChange={(value) => setFormData({ ...formData, genre: value })}
              placeholder="Sélectionnez un genre"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#005929]" />
              Image de couverture
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-[#005929]/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                id="cover-file"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#005929] file:to-[#005929]/90 file:text-white hover:file:from-[#005929]/90 hover:file:to-[#005929]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#005929]/5 to-[#005929]/10 rounded-lg border border-[#005929]/20">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-slate-700">
              Publier immédiatement
            </label>
          </div>
        </form>
      </ModalContent>
      <ModalActions className="p-4">
        <ModalButton
          onClick={handleClose}
          variant="secondary"
        >
          Annuler
        </ModalButton>
        <ModalButton
          type="submit"
          variant="primary"
          onClick={handleSubmit}
        >
          Créer le podcast
        </ModalButton>
      </ModalActions>
    </Modal>
  );
} 