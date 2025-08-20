import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Modal, ModalButton, ModalActions } from '@/components/ui/Modal';
import { AdminArtistSelect } from './AdminArtistSelect';
import { CreateAlbumData } from '@/shared/types/api';

interface AdminCreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAlbumData & { artist: string }) => Promise<void>;
  isSubmitting: boolean;
}

export function AdminCreateAlbumModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting 
}: AdminCreateAlbumModalProps) {
  const [formData, setFormData] = useState<Partial<CreateAlbumData>>({});
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [selectedArtist, setSelectedArtist] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !selectedArtist) {
      alert('Veuillez remplir tous les champs obligatoires et sélectionner un artiste');
      return;
    }

    try {
      await onSubmit({
        ...formData as CreateAlbumData,
        artist: selectedArtist,
        cover_image: selectedCover || undefined,
      });
      
      // Reset form
      setFormData({});
      setSelectedCover(null);
      setSelectedArtist('');
      onClose();
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminArtistSelect
          selectedArtist={selectedArtist}
          onArtistChange={setSelectedArtist}
        />

        <div className="space-y-4">
          <Input
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            type="date"
            value={formData.release_date || ''}
            onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
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
            placeholder="Description de l'album..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de couverture (optionnel)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedCover(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-zouglou-green-700 hover:file:bg-orange-100"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_published || false}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded border-gray-300 text-zouglou-green-600 shadow-sm focus:border-zouglou-green-300 focus:ring focus:ring-zouglou-green-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Publier immédiatement</span>
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
            {isSubmitting ? 'Création...' : 'Créer l\'Album'}
          </ModalButton>
        </ModalActions>
      </form>
    </Modal>
  );
} 