'use client';

import React, { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCategory, useUpdateCategory, useCategory } from '@/hooks/useCategoryQueries';
import { CategoryCreateRequest, CategoryUpdateRequest } from '@/shared/types/category';
import { Save, Loader2, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
  onSuccess?: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  categoryId, 
  onSuccess 
}) => {
  const isEditing = !!categoryId;
  
  // Récupérer la catégorie existante si on est en mode édition
  const { data: existingCategory, isLoading: isLoadingCategory } = useCategory(categoryId || '');
  
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();

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
    if (existingCategory) {
      setValue('name', existingCategory.name);
      setValue('slug', existingCategory.slug);
      setValue('description', existingCategory.description);
      setValue('is_active', existingCategory.is_active);
    }
  }, [existingCategory, setValue]);

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

  const onSubmit = async (data: CategoryCreateRequest | CategoryUpdateRequest) => {
    try {
      if (isEditing && categoryId) {
        await updateCategoryMutation.mutateAsync({
          id: categoryId,
          data: data as CategoryUpdateRequest
        });
      } else {
        await createCategoryMutation.mutateAsync(data as CategoryCreateRequest);
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

  if (isLoadingCategory) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </Modal>
    );
  }

  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
            <Tag className="h-6 w-6 text-[#005929]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <p className="text-slate-600 text-sm">
              {isEditing 
                ? 'Modifiez les informations de la catégorie'
                : 'Créez une nouvelle catégorie pour organiser votre contenu'
              }
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom de la catégorie */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Nom de la catégorie *
            </label>
            <Input
              {...register('name')}
              placeholder="Ex: Festif, Politique, Religieux..."
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
              placeholder="festif, politique, religieux..."
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
              placeholder="Description optionnelle de la catégorie..."
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
              Catégorie active
            </label>
          </div>
          <p className="text-slate-500 text-xs">
            Une catégorie inactive ne sera pas visible pour les utilisateurs
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
