"use client";

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalContent, ModalActions, ModalButton } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useCreatePodcast, useUpdatePodcast } from '@/hooks/usePodcastQuery';
import { CreatePodcastData, UpdatePodcastData, ApiPodcast } from '@/shared/types/api';
import { GenreSelect } from '@/components/ui/GenreSelect';
import { Mic, Upload, FileText, Save, X, Hash, Edit } from 'lucide-react';

interface PodcastManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  podcastToEdit?: ApiPodcast | null;
  mode: 'create' | 'edit';
}

export function PodcastManagementModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  podcastToEdit, 
  mode 
}: PodcastManagementModalProps) {
  const createPodcast = useCreatePodcast();
  const updatePodcast = useUpdatePodcast();
  
  const [formData, setFormData] = useState<CreatePodcastData>({
    title: '',
    description: '',
    artist: '',
    genre: '',
    is_published: false
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Initialiser les données du formulaire quand on passe en mode édition
  useEffect(() => {
    if (mode === 'edit' && podcastToEdit) {
      setFormData({
        title: podcastToEdit.title,
        description: podcastToEdit.description,
        artist: podcastToEdit.artist,
        genre: podcastToEdit.genre,
        is_published: podcastToEdit.is_published
      });
    } else {
      resetFormData();
    }
  }, [mode, podcastToEdit]);

  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      artist: '',
      genre: '',
      is_published: false
    });
    setCoverFile(null);
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        await handleCreatePodcast();
      } else {
        await handleUpdatePodcast();
      }
      
      handleModalClose();
      onSuccess?.();
    } catch (error) {
      console.error(`Erreur lors de la ${mode === 'create' ? 'création' : 'modification'} du podcast:`, error);
    }
  };

  const handleCreatePodcast = async () => {
    const podcastData: CreatePodcastData = {
      ...formData,
      cover: coverFile || undefined
    };
    await createPodcast.mutateAsync(podcastData);
  };

  const handleUpdatePodcast = async () => {
    if (!podcastToEdit) return;
    
    const updateData: UpdatePodcastData = {
      ...formData,
      cover: coverFile || undefined
    };
    await updatePodcast.mutateAsync({ 
      id: podcastToEdit.id, 
      data: updateData 
    });
  };

  const handleModalClose = () => {
    resetFormData();
    onClose();
  };

  const isFormSubmitting = createPodcast.isPending || updatePodcast.isPending;
  const modalTitle = mode === 'create' ? 'Créer un nouveau podcast' : 'Modifier le podcast';
  const submitButtonText = isFormSubmitting 
    ? (mode === 'create' ? 'Création...' : 'Modification...') 
    : (mode === 'create' ? 'Créer le podcast' : 'Sauvegarder');

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
            {mode === 'create' ? (
              <Mic className="w-6 h-6 text-slate-600" />
            ) : (
              <Edit className="w-6 h-6 text-slate-600" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-medium text-slate-800">{modalTitle}</h2>
            <p className="text-slate-500">
              {mode === 'create' 
                ? 'Ajoutez un nouveau podcast à votre collection' 
                : 'Modifiez les informations de votre podcast'
              }
            </p>
          </div>
        </div>
      </ModalHeader>
      <ModalContent>
        <form onSubmit={handleFormSubmission} className="space-y-6">
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
                className="hidden"
                id="cover-file"
              />
              <label htmlFor="cover-file" className="cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Cliquez pour sélectionner une image</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, GIF acceptés</p>
              </label>
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
      <ModalActions>
        <ModalButton
          onClick={handleModalClose}
          variant="secondary"
        >
          <X className="w-4 h-4" />
          Annuler
        </ModalButton>
        <ModalButton
          type="submit"
          variant="primary"
          disabled={isFormSubmitting}
          onClick={handleFormSubmission}
        >
          <Save className="w-4 h-4" />
          {submitButtonText}
        </ModalButton>
      </ModalActions>
    </Modal>
  );
} 