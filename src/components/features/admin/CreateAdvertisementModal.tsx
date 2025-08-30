'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalHeader, ModalContent, ModalActions, ModalButton } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { AdvertisementFormData, PlacementEnum, Advertisement } from '@/shared/types/advertisement';
import { useToast } from '@/components/providers/ToastProvider';
import { useCreateAdvertisement, useUpdateAdvertisement } from '@/hooks';
import { Loading } from '@/components/ui/Loading';
import { Mic, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const placementOptions = [
  { value: 'pre_roll', label: 'Pré-roll' },
  { value: 'mid_roll', label: 'Mid-roll' },
  { value: 'banner', label: 'Bannière' },
  { value: 'interstitial', label: 'Interstitiel' },
];

interface CreateAdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  advertisement?: Advertisement; // Pour l'édition
  onSuccess?: () => void;
}

export function CreateAdvertisementModal({
  isOpen,
  onClose,
  advertisement,
  onSuccess
}: CreateAdvertisementModalProps) {
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createMutation = useCreateAdvertisement();
  const updateMutation = useUpdateAdvertisement();
  const isEditing = !!advertisement;

  const form = useForm<AdvertisementFormData>({
    defaultValues: {
      is_active: false,
      placement: 'pre_roll' as PlacementEnum,
      title: '',
      description: '',
      image_url: null,
      audio_url: null,
      click_url: '',
      duration: 0,
      start_date: '',
      end_date: '',
    },
  });

  useEffect(() => {
    if (advertisement && isEditing) {
      const formattedData = {
        ...advertisement,
        is_active: advertisement.is_active,
        start_date: advertisement.start_date ? new Date(advertisement.start_date).toISOString().split('T')[0] : '',
        end_date: advertisement.end_date ? new Date(advertisement.end_date).toISOString().split('T')[0] : '',
        image_url: null,
        audio_url: null,
      };
      form.reset(formattedData);
      
      if (advertisement.image_url) {
        setImagePreview(advertisement.image_url);
      }
    } else {
      form.reset({
        is_active: false,
        placement: 'pre_roll' as PlacementEnum,
        title: '',
        description: '',
        image_url: null,
        audio_url: null,
        click_url: '',
        duration: 0,
        start_date: '',
        end_date: '',
      });
      setImagePreview(null);
      setSelectedImage(null);
      setSelectedAudio(null);
    }
  }, [advertisement, form, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: AdvertisementFormData) => {
    try {
      if (data.start_date && data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
        toast.showError('Erreur', 'La date de début ne peut pas être postérieure à la date de fin');
        return;
      }

      const formattedData = {
        ...data,
        is_active: data.is_active || false, 
        image_url: selectedImage,
        audio_url: selectedAudio,
        duration: data.duration || 0,
      };
      
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: advertisement.id,
          data: formattedData,
        });
      } else {
        await createMutation.mutateAsync(formattedData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.showError('Erreur', 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader className="p-3">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-medium text-slate-800">
              {isEditing ? 'Modifier la publicité' : 'Nouvelle publicité'}
            </h2>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Titre de la publicité *
                </label>
                <Input
                  id="title"
                  placeholder="Entrez le titre de votre publicité"
                  {...form.register('title', { required: 'Le titre est requis' })}
                  className="w-full"
                />
                {form.formState.errors.title && (
                  <span className="text-red-500 text-sm">{form.formState.errors.title.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre publicité..."
                  {...form.register('description')}
                  className="w-full min-h-[100px]"
                />
              </div>

              <div>
                <label htmlFor="placement" className="block text-sm font-medium text-slate-700 mb-2">
                  Type de placement *
                </label>
                <select
                  id="placement"
                  value={form.watch('placement')}
                  onChange={(e) => form.setValue('placement', e.target.value as PlacementEnum)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005929]/50 focus:border-[#005929] transition-colors"
                >
                  {placementOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="click_url" className="block text-sm font-medium text-slate-700 mb-2">
                  URL de redirection
                </label>
                <Input
                  id="click_url"
                  placeholder="https://votre-site.com"
                  {...form.register('click_url')}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#005929]/5 to-[#005929]/10 rounded-lg border border-[#005929]/20">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.watch('is_active')}
                  onChange={(e) => form.setValue('is_active', e.target.checked)}
                  className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Publicité active
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image de la publicité
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-[#005929]/50 transition-colors">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <Image
                        width={400}
                        height={400}
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedImage(null);
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Supprimer l&apos;image
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#005929] file:to-[#005929]/90 file:text-white hover:file:from-[#005929]/90 hover:file:to-[#005929]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
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
                          setSelectedAudio(file);
                          const audio = new Audio();
                          audio.src = URL.createObjectURL(file);
                          audio.addEventListener('loadedmetadata', () => {
                            form.setValue('duration', Math.round(audio.duration));
                          });
                        }
                      }}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#005929] file:to-[#005929]/90 file:text-white hover:file:from-[#005929]/90 hover:file:to-[#005929]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
                  Durée (secondes)
                </label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...form.register('duration')}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-slate-700 mb-2">
                    Date de début
                  </label>
                  <Input
                    id="start_date"
                    type="date"
                    {...form.register('start_date')}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-slate-700 mb-2">
                    Date de fin
                  </label>
                  <Input
                    id="end_date"
                    type="date"
                    {...form.register('end_date')}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </ModalContent>

      <ModalActions className="p-3">
        <ModalButton
          onClick={onClose}
          variant="secondary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          Annuler
        </ModalButton>
        <ModalButton
          onClick={form.handleSubmit(onSubmit)}
          variant="primary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <Loading className="w-4 h-4" />
          ) : null}
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </ModalButton>
      </ModalActions>
    </Modal>
  );
}
