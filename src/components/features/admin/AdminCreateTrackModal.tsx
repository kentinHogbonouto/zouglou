import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Modal, ModalButton, ModalActions } from '@/components/ui/Modal';
import { AdminArtistSelect } from './AdminArtistSelect';
import { CreateSongData } from '@/shared/types/api';
import { GenreSelect } from '@/components/ui/GenreSelect';

interface AdminCreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSongData) => Promise<void>;
  isSubmitting: boolean;
}

export function AdminCreateTrackModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: AdminCreateTrackModalProps) {
  const [formData, setFormData] = useState<Partial<CreateSongData>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [selectedArtist, setSelectedArtist] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.title || !selectedArtist) {
      alert('Veuillez remplir tous les champs obligatoires et sélectionner un artiste');
      return;
    }

    try {
      await onSubmit({
        ...formData as CreateSongData,
        artist: selectedArtist,
        audio_file: selectedFile,
        cover_image: selectedCover || undefined,
      });

      // Reset form
      setFormData({});
      setSelectedFile(null);
      setSelectedCover(null);
      setSelectedArtist('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du track:', error);
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
          <h2 className="text-2xl font-bold text-slate-800">Créer un nouveau track</h2>
          <p className="text-slate-600 mt-2">Remplissez les informations pour créer un nouveau track</p>
        </div>

        <AdminArtistSelect
          selectedArtist={selectedArtist}
          onArtistChange={setSelectedArtist}
        />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Titre du track *
            </label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Entrez le titre du track"
              className="outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Album
            </label>
            <Input
              value={formData.album || ''}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
              placeholder="Nom de l'album (optionnel)"
            />
          </div>

          
          <GenreSelect
            value={formData.genre || ''}
            onChange={(e) => setFormData({ ...formData, genre: e })}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Numéro de piste
            </label>
            <Input
              type="number"
              value={formData.track_number || ''}
              onChange={(e) => setFormData({ ...formData, track_number: parseInt(e.target.value) })}
              placeholder="Numéro de piste dans l'album"
              min="1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Fichier audio * (MP3, WAV, etc.)
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-green-700 hover:file:bg-orange-100"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Formats acceptés: MP3, WAV, M4A. Taille max: 50MB
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image de couverture (optionnel)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedCover(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-green-700 hover:file:bg-orange-100"
            />
            <p className="text-xs text-slate-500 mt-1">
              Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
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
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_explicit || false}
              onChange={(e) => setFormData({ ...formData, is_explicit: e.target.checked })}
              className="rounded border-slate-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-slate-700">Explicit</span>
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
            {isSubmitting ? 'Création...' : 'Créer le Track'}
          </ModalButton>
        </ModalActions>
      </form>
    </Modal>
  );
} 