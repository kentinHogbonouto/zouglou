'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateFaqRequest, UpdateFaqRequest, Faq } from '@/shared/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2 } from 'lucide-react';

// Schéma de validation pour la création
const createFaqSchema = z.object({
  question: z.string()
    .min(1, 'La question est requise')
    .max(255, 'La question ne peut pas dépasser 255 caractères'),
  content: z.string()
    .min(1, 'Le contenu est requis')
    .max(10000, 'Le contenu ne peut pas dépasser 10000 caractères'),
  position: z.number()
    .min(0, 'La position doit être positive')
    .max(9223372036854776000, 'La position est trop élevée')
    .optional(),
});

// Schéma de validation pour la modification
const updateFaqSchema = z.object({
  question: z.string()
    .min(1, 'La question est requise')
    .max(255, 'La question ne peut pas dépasser 255 caractères')
    .optional(),
  content: z.string()
    .min(1, 'Le contenu est requis')
    .max(10000, 'Le contenu ne peut pas dépasser 10000 caractères')
    .optional(),
  position: z.number()
    .min(0, 'La position doit être positive')
    .max(9223372036854776000, 'La position est trop élevée')
    .optional(),
});

type CreateFaqFormData = z.infer<typeof createFaqSchema>;
type UpdateFaqFormData = z.infer<typeof updateFaqSchema>;

interface FaqFormProps {
  mode: 'create' | 'edit';
  initialData?: Faq;
  onSubmit: (data: CreateFaqRequest | UpdateFaqRequest) => Promise<void>;
  isLoading?: boolean;
}

export const FaqForm: React.FC<FaqFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const isEditMode = mode === 'edit';
  const schema = isEditMode ? updateFaqSchema : createFaqSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateFaqFormData | UpdateFaqFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      question: initialData.question,
      content: initialData.content,
      position: initialData.position,
    } : {
      question: '',
      content: '',
      position: 0,
    },
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: CreateFaqFormData | UpdateFaqFormData) => {
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Question */}
        <div className="space-y-3">
          <label htmlFor="question" className="block text-sm font-semibold text-slate-900">
            Question *
          </label>
          <Input
            id="question"
            {...register('question')}
            placeholder="Entrez la question..."
            className={`border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20 ${errors.question ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
            disabled={isLoading}
          />
          {errors.question && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.question.message}
            </p>
          )}
        </div>

        {/* Contenu */}
        <div className="space-y-3">
          <label htmlFor="content" className="block text-sm font-semibold text-slate-900">
            Réponse *
          </label>
          <Textarea
            id="content"
            {...register('content')}
            placeholder="Entrez la réponse..."
            rows={8}
            className={`border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20 resize-none ${errors.content ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
            disabled={isLoading}
          />
          {errors.content && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Position */}
        <div className="space-y-3">
          <label htmlFor="position" className="block text-sm font-semibold text-slate-900">
            Position
          </label>
          <Input
            id="position"
            type="number"
            {...register('position', { valueAsNumber: true })}
            placeholder="0"
            min={0}
            className={`border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20 ${errors.position ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
            disabled={isLoading}
          />
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
            La position détermine l&apos;ordre d&apos;affichage des FAQ (0 = premier)
          </p>
          {errors.position && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.position.message}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end pt-8 border-t border-slate-200">
          <Button 
            type="submit" 
            disabled={isLoading || !isValid}
            className="flex items-center gap-2 bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
