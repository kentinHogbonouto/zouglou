'use client';

import React, { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateGenre, useUpdateGenre, useGenre } from '@/hooks/useGenreQueries';
import { GenreUpdateRequest, GenreCreateRequest } from '@/shared/types/genre';
import { Save, Loader2, Music } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface GenreModalProps {
  isOpen: boolean;
  onClose: () => void;
  genreId?: string;
  onSuccess?: () => void;
}

export const GenreModal: React.FC<GenreModalProps> = ({ 
  isOpen, 
  onClose, 
  genreId, 
  onSuccess 
}) => {
  const isEditing = !!genreId;
  
  // Récupérer le genre existant si on est en mode édition
  const { data: existingGenre, isLoading: isLoadingGenre } = useGenre(genreId || '');
  
  const createGenreMutation = useCreateGenre();
  const updateGenreMutation = useUpdateGenre();

  const schema = yup.object({
    name: yup.string().required('Le nom est requis'),
    slug: yup.string().required('Le slug est requis'),
    description: yup.string(),
    is_active: yup.boolean()
  });

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      is_active: true
    }
  });

  // Remplir le formulaire avec les données existantes
  useEffect(() => {
    if (existingGenre) {
      setValue('name', existingGenre.name);
      setValue('slug', existingGenre.slug);
      setValue('description', existingGenre.description);
      setValue('is_active', existingGenre.is_active);
    }
  }, [existingGenre, setValue]);

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && !isEditing) {
      reset();
    }
  }, [isOpen, isEditing, reset]);

  // Générer automatiquement le slug à partir du nom
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    setValue('slug', generateSlug(name));
  };

  const onSubmit = async (data: GenreCreateRequest | GenreUpdateRequest) => {
    try {
      if (isEditing && genreId) {
        await updateGenreMutation.mutateAsync({
          id: genreId,
          data: data as GenreUpdateRequest
        });
      } else {
        await createGenreMutation.mutateAsync(data as GenreCreateRequest);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (isLoadingGenre) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </Modal>
    );
  }

  const isLoading = createGenreMutation.isPending || updateGenreMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
            <Music className="h-6 w-6 text-[#005929]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isEditing ? 'Modifier le genre' : 'Nouveau genre'}
            </h2>
            <p className="text-slate-600 text-sm">
              {isEditing 
                ? 'Modifiez les informations du genre'
                : 'Créez un nouveau genre musical'
              }
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom du genre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Nom du genre *
            </label>
            <Input
              {...register('name')}
              placeholder="Ex: Zouglou, Coupé-décalé, Afrobeat..."
              className={errors.name ? 'border-red-300 focus:border-red-500' : ''}
              disabled={isLoading}
              onChange={handleNameChange}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
              Slug *
            </label>
            <Input
              {...register('slug')}
              placeholder="zouglou, coupe-decale, afrobeat..."
              className={errors.slug ? 'border-red-300 focus:border-red-500' : ''}
              disabled={isLoading}
            />
            <p className="text-slate-500 text-xs mt-1">
              Le slug est généré automatiquement à partir du nom. Vous pouvez le modifier si nécessaire.
            </p>
            {errors.slug && (
              <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <Textarea
              {...register('description')}
              placeholder="Description optionnelle du genre musical..."
              rows={3}
              className={errors.description ? 'border-red-300 focus:border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Statut actif */}
          <div className="flex items-center space-x-3">
            <input
              {...register('is_active')}
              type="checkbox"
              className="h-4 w-4 text-[#005929] focus:ring-[#005929] border-slate-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
              Genre actif
            </label>
          </div>
          <p className="text-slate-500 text-xs">
            Un genre inactif ne sera pas visible pour les utilisateurs
          </p>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
