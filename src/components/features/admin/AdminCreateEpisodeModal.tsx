import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Modal, ModalButton, ModalActions } from '@/components/ui/Modal';
import { AdminArtistSelect } from './AdminArtistSelect';
import { AdminPodcastSelect } from './AdminPodcastSelect';
import { CreatePodcastEpisodeData } from '@/shared/types';

interface AdminCreateEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePodcastEpisodeData) => Promise<void>;
  isSubmitting: boolean;
}

export function AdminCreateEpisodeModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: AdminCreateEpisodeModalProps) {
  const [formData, setFormData] = useState<Partial<CreatePodcastEpisodeData>>({});
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedPodcast, setSelectedPodcast] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !selectedArtist || !selectedPodcast || !selectedAudio) {
      alert('Veuillez remplir tous les champs obligatoires et sélectionner un artiste, un podcast et un fichier audio');
      return;
    }

    try {
      await onSubmit({
        ...formData as CreatePodcastEpisodeData,
        podcast: selectedPodcast,
        file: selectedAudio,
      });

      // Reset form
      setFormData({});
      setSelectedAudio(null);
      setSelectedArtist('');
      setSelectedPodcast('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de l\'épisode:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Créer un nouvel épisode</h2>
          <p className="text-slate-600 mt-2">Remplissez les informations pour créer un nouvel épisode</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminArtistSelect
            selectedArtist={selectedArtist}
            onArtistChange={setSelectedArtist}
          />

          <AdminPodcastSelect
            selectedPodcast={selectedPodcast}
            onPodcastChange={setSelectedPodcast}
            selectedArtist={selectedArtist}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Titre de l&apos;épisode *
            </label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Entrez le titre de l'épisode"
              className="outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description de l'épisode (optionnel)"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Numéro d&apos;épisode
            </label>
            <Input
              type="number"
              value={formData.episode_number || ''}
              onChange={(e) => setFormData({ ...formData, episode_number: parseInt(e.target.value) })}
              placeholder="Numéro d'épisode"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fichier audio * (MP3, WAV, etc.)
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setSelectedAudio(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-green-700 hover:file:bg-orange-100"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Formats acceptés: MP3, WAV, M4A. Taille max: 100MB
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_published || false}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded border-slate-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-slate-700">Publier immédiatement</span>
          </label>
        </div>

        <ModalActions>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Création...' : 'Créer l\'Épisode'}
          </ModalButton>
        </ModalActions>
      </form>
    </Modal>
  );
}
