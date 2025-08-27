import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Modal, ModalButton, ModalActions } from '@/components/ui/Modal';
import { AdminArtistSelect } from './AdminArtistSelect';
import { CreateLiveStreamData } from '@/shared/types/api';

interface AdminCreateLiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLiveStreamData) => Promise<void>;
  isSubmitting: boolean;
}

export function AdminCreateLiveStreamModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: AdminCreateLiveStreamModalProps) {
  const [formData, setFormData] = useState<Partial<CreateLiveStreamData>>({});
  const [selectedArtist, setSelectedArtist] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !selectedArtist || !formData.start_time) {
      alert('Veuillez remplir tous les champs obligatoires et sélectionner un artiste');
      return;
    }

    try {
      await onSubmit({
        ...formData as CreateLiveStreamData,
        artist: selectedArtist,
      });

      // Reset form
      setFormData({});
      setSelectedArtist('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du live stream:', error);
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
          <h2 className="text-2xl font-bold text-slate-800">Créer un nouveau live stream</h2>
          <p className="text-slate-600 mt-2">Remplissez les informations pour créer un nouveau live stream</p>
        </div>

        <AdminArtistSelect
          selectedArtist={selectedArtist}
          onArtistChange={setSelectedArtist}
        />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Titre du live stream *
            </label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Entrez le titre du live stream"
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
              placeholder="Description du live stream (optionnel)"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date et heure programmées *
            </label>
            <Input
              type="datetime-local"
              value={formData.start_time || ''}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              URL du stream (RTMP)
            </label>
            <Input
              value={formData.stream_url || ''}
              onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
              placeholder="rtmp://stream.example.com/live"
            />
            <p className="text-xs text-slate-500 mt-1">
              URL RTMP pour la diffusion en direct (optionnel)
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
            {isSubmitting ? 'Création...' : 'Créer le Live Stream'}
          </ModalButton>
        </ModalActions>
      </form>
    </Modal>
  );
} 