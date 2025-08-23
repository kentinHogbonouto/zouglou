import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Modal, ModalButton, ModalActions, ModalHeader, ModalContent } from '@/components/ui/Modal';
import { GenreSelect } from '@/components/ui/GenreSelect';
import { CreateSongData } from '@/shared/types/api';
import { AlbumSelect } from '@/components/features/artist/AlbumSelect';
import { Mic, Disc3, Hash } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSongData) => Promise<void>;
  isSubmitting: boolean;
  currentArtist: string;
  preSelectedAlbum?: string;
}

export function CreateTrackModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  currentArtist,
  preSelectedAlbum
}: CreateTrackModalProps) {
  const toast = useToast();
  const [formData, setFormData] = useState<Partial<CreateSongData>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialiser l'album pré-sélectionné quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && preSelectedAlbum) {
      setFormData(prev => ({ ...prev, album: preSelectedAlbum }));
    }
  }, [isOpen, preSelectedAlbum]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.title) {
      toast.showError('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

      try {
      await onSubmit({
        ...formData as CreateSongData,
        artist: currentArtist,
        audio_file: selectedFile,
      });

      // Reset form
      setFormData({});
      setSelectedFile(null);
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
      <ModalHeader>
        <div className="flex items-center gap-3 py-4 px-8">
          
          <div>
            <h2 className="text-2xl font-medium text-slate-800">Nouveau Track</h2>
            <p className="text-slate-500">Ajoutez votre nouvelle chanson</p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Titre du track *</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                placeholder="Titre de votre chanson"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Numéro de piste
              </label>
              <Input
                type="number"
                value={formData.track_number || ''}
                onChange={(e) => setFormData({ ...formData, track_number: parseInt(e.target.value) })}
                className="w-full border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preSelectedAlbum ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Disc3 className="w-4 h-4" />
                  Album (pré-sélectionné)
                </label>
                <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-200">
                  <span className="text-sm text-slate-600">Album actuel</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Disc3 className="w-4 h-4" />
                  Album
                </label>
                <AlbumSelect
                  value={formData.album || ''}
                  onChange={(e) => setFormData({ ...formData, album: e })}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Genre</label>
              <GenreSelect
                value={formData.genre || ''}
                onChange={(e) => setFormData({ ...formData, genre: e })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Fichier audio * (MP3, WAV, etc.)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-[#005929]/50 transition-colors">
                <div className="text-center">
                  
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        // Calculer la durée si possible (approximative)
                        const audio = new Audio();
                        audio.src = URL.createObjectURL(file);
                        audio.addEventListener('loadedmetadata', () => {
                          setFormData(prev => ({ ...prev, duration: Math.round(audio.duration) }));
                        });
                      }
                    }}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#005929] file:to-[#005929]/90 file:text-white hover:file:from-[#005929]/90 hover:file:to-[#005929]"
                    required
                  /> 
                </div>
              </div>
            </div>
            <div className="space-y-4">
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#005929]/5 to-[#005929]/10 rounded-lg border border-[#005929]/20">
              <input
                type="checkbox"
                checked={formData.is_published || false}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
              />
              <span className="text-sm font-medium text-slate-700">Publier immédiatement</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={formData.is_explicit || false}
                onChange={(e) => setFormData({ ...formData, is_explicit: e.target.checked })}
                className="rounded border-slate-300 text-slate-600 focus:ring-slate-500/20"
              />
              <span className="text-sm font-medium text-slate-700">Contenu explicite</span>
            </div>
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
      </ModalContent>
    </Modal>
  );
} 