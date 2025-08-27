'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateInformationRequest, UpdateInformationRequest, Information } from '@/shared/types';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2 } from 'lucide-react';

// Schéma de validation pour la création
const createInformationSchema = z.object({
  privacy_policy: z.string()
    .min(1, 'La politique de confidentialité est requise')
    .max(50000, 'La politique de confidentialité ne peut pas dépasser 50000 caractères'),
  terms_of_use: z.string()
    .min(1, 'Les conditions d\'utilisation sont requises')
    .max(50000, 'Les conditions d\'utilisation ne peuvent pas dépasser 50000 caractères'),
  about_us: z.string()
    .min(1, 'La section À propos est requise')
    .max(50000, 'La section À propos ne peut pas dépasser 50000 caractères'),
});

// Schéma de validation pour la modification
const updateInformationSchema = z.object({
  privacy_policy: z.string()
    .min(1, 'La politique de confidentialité est requise')
    .max(50000, 'La politique de confidentialité ne peut pas dépasser 50000 caractères')
    .optional(),
  terms_of_use: z.string()
    .min(1, 'Les conditions d\'utilisation sont requises')
    .max(50000, 'Les conditions d\'utilisation ne peuvent pas dépasser 50000 caractères')
    .optional(),
  about_us: z.string()
    .min(1, 'La section À propos est requise')
    .max(50000, 'La section À propos ne peut pas dépasser 50000 caractères')
    .optional(),
});

type CreateInformationFormData = z.infer<typeof createInformationSchema>;
type UpdateInformationFormData = z.infer<typeof updateInformationSchema>;

interface InformationFormProps {
  mode: 'create' | 'edit';
  initialData?: Information;
  onSubmit: (data: CreateInformationRequest | UpdateInformationRequest) => Promise<void>;
  isLoading?: boolean;
}

export const InformationForm: React.FC<InformationFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const isEditMode = mode === 'edit';
  const schema = isEditMode ? updateInformationSchema : createInformationSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateInformationFormData | UpdateInformationFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      privacy_policy: initialData.privacy_policy,
      terms_of_use: initialData.terms_of_use,
      about_us: initialData.about_us,
    } : {
      privacy_policy: '',
      terms_of_use: '',
      about_us: '',
    },
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: CreateInformationFormData | UpdateInformationFormData) => {
    try {
      await onSubmit(data);
      if (!isEditMode) {
        reset();
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Politique de confidentialité */}
        <div className="space-y-2">
          <label htmlFor="privacy_policy" className="block text-sm font-medium text-gray-700">
            Politique de confidentialité *
          </label>
          <Textarea
            id="privacy_policy"
            {...register('privacy_policy')}
            placeholder="Entrez votre politique de confidentialité..."
            rows={12}
            className={errors.privacy_policy ? 'border-red-500' : ' border-input'}
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500">
            Décrivez comment vous collectez, utilisez et protégez les données des utilisateurs.
          </p>
          {errors.privacy_policy && (
            <p className="text-sm text-red-600">{errors.privacy_policy.message}</p>
          )}
        </div>

        {/* Conditions d'utilisation */}
        <div className="space-y-2">
          <label htmlFor="terms_of_use" className="block text-sm font-medium text-gray-700">
            Conditions d&apos;utilisation *
          </label>
          <Textarea
            id="terms_of_use"
            {...register('terms_of_use')}
            placeholder="Entrez vos conditions d'utilisation..."
            rows={12}
            className={errors.terms_of_use ? 'border-red-500' : ' border-input'}
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500">
            Définissez les règles et conditions d&apos;utilisation de votre plateforme.
          </p>
          {errors.terms_of_use && (
            <p className="text-sm text-red-600">{errors.terms_of_use.message}</p>
          )}
        </div>

        {/* À propos */}
        <div className="space-y-2">
          <label htmlFor="about_us" className="block text-sm font-medium text-gray-700">
            À propos *
          </label>
          <Textarea
            id="about_us"
            {...register('about_us')}
            placeholder="Présentez votre plateforme..."
            rows={12}
            className={errors.about_us ? 'border-red-500' : ' border-input'}
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500">
            Présentez votre plateforme, sa mission et ses valeurs.
          </p>
          {errors.about_us && (
            <p className="text-sm text-red-600">{errors.about_us.message}</p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button 
            type="submit" 
            disabled={isLoading || !isValid}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditMode ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </div>
  );
};
