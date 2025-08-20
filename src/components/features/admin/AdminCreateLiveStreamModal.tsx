import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Modal, ModalButton, ModalActions } from '@/components/ui/Modal';
import { AdminArtistSelect } from './AdminArtistSelect';
import { CreateLiveStreamData } from '@/shared/types/api';

interface AdminCreateLiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLiveStreamData & { artist: string }) => Promise<void>;
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
    if (!formData.title || !formData.stream_url || !selectedArtist) {
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
        <AdminArtistSelect
          selectedArtist={selectedArtist}
          onArtistChange={setSelectedArtist}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            value={formData.stream_url || ''}
            onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
            placeholder="rtmp://..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            placeholder="Description du live stream..."
          />
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