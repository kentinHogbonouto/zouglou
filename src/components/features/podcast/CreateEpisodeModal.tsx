"use client";

import { useState } from 'react';
import { Modal, ModalHeader, ModalContent, ModalActions, ModalButton } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useCreatePodcastEpisode, usePodcastList } from '@/hooks/usePodcastQuery';
import { CreatePodcastEpisodeData } from '@/shared/types/api';
import { Headphones, Upload, Calendar, Hash, FileText, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface CreateEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateEpisodeModal({ isOpen, onClose, onSuccess }: CreateEpisodeModalProps) {
  const { user } = useAuth();
  const createEpisode = useCreatePodcastEpisode();
  const { data: podcastsData } = usePodcastList({artist: user?.artist_profile?.id || ''});
  const podcasts = podcastsData?.results || [];
  const [formData, setFormData] = useState<CreatePodcastEpisodeData>({
    title: '',
    description: '',
    file: null as unknown as File,
    duration: 0,
    podcast: '',
    episode_number: 1,
    release_date: new Date().toISOString().split('T')[0],
    is_published: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEpisode.mutateAsync(formData);
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création de l&apos;épisode:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      file: null as unknown as File,
      duration: 0,
      podcast: '',
      episode_number: 1,
      release_date: new Date().toISOString().split('T')[0],
      is_published: false
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader>
        <div className="flex items-center gap-3 p-4">

          <div>
            <h2 className="text-2xl font-medium text-slate-800">Créer un nouvel épisode</h2>
            <p className="text-slate-500">Ajoutez un nouvel épisode à votre podcast</p>
          </div>
        </div>
      </ModalHeader>
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#005929]" />
                Podcast *
              </label>
              <select
                value={formData.podcast}
                onChange={(e) => setFormData({ ...formData, podcast: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                required
              >
                <option value="">Sélectionnez un podcast</option>
                {podcasts.map((podcast) => (
                  <option key={podcast.id} value={podcast.id}>
                    {podcast.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#005929]" />
                Titre de l&apos;épisode *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Entrez le titre de l&apos;épisode"
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
              placeholder="Décrivez cet épisode"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#005929] focus:ring-[#005929]/20 resize-none"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#005929]" />
                Numéro d&apos;épisode *
              </label>
              <Input
                type="number"
                value={formData.episode_number}
                onChange={(e) => setFormData({ ...formData, episode_number: parseInt(e.target.value) })}
                min="1"
                className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#005929]" />
                Date de sortie *
              </label>
              <Input
                type="date"
                value={formData.release_date}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                required
              />
            </div>
          </div>

    
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#005929]" />
              Fichier audio *
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-[#005929]/50 transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, file });
                    // Calculer la durée si possible (approximative)
                    const audio = new Audio();
                    audio.src = URL.createObjectURL(file);
                    audio.addEventListener('loadedmetadata', () => {
                      setFormData(prev => ({ ...prev, duration: Math.round(audio.duration) }));
                    });
                  }
                }}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#005929] file:to-[#005929]/90 file:text-white hover:file:from-[#005929]/90 hover:file:to-[#005929]"
                id="audio-file"
                required
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
          <X className="w-4 h-4" />
          Annuler
        </ModalButton>
        <ModalButton
          type="submit"
          variant="primary"
          disabled={createEpisode.isPending}
          onClick={handleSubmit}
        >
          <Save className="w-4 h-4" />
          {createEpisode.isPending ? 'Création...' : 'Créer l&apos;épisode'}
        </ModalButton>
      </ModalActions>
    </Modal>
  );
}
