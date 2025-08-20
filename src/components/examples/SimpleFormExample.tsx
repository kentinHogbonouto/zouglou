'use client';

import { useState } from 'react';
import { useFormWithValidation, yupSchemas, createFormSchema } from '@/hooks/useFormWithValidation';
import { FormField, FormCheckbox } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import * as yup from 'yup';

// Définition du type pour le formulaire
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  newsletter: boolean;
  terms: boolean;
  [key: string]: unknown;
}

// Création du schéma avec nos utilitaires
const contactSchema = createFormSchema<ContactFormData>({
  firstName: yupSchemas.requiredString(2, 50),
  lastName: yupSchemas.requiredString(2, 50),
  email: yupSchemas.email,
  phone: yupSchemas.phone,
  message: yup
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(500, 'Le message ne peut pas dépasser 500 caractères')
    .required('Le message est requis'),
  newsletter: yup.boolean().optional(),
  terms: yupSchemas.requiredCheckbox,
});

export function SimpleFormExample() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useFormWithValidation({
    schema: contactSchema,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      newsletter: false,
      terms: false,
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    reset();
    setLoading(false);
    
    // Masquer le message de succès après 3 secondes
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Formulaire de contact</CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm mb-4">
              Message envoyé avec succès !
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Prénom"
                register={register('firstName')}
                error={errors.firstName}
                placeholder="Prénom"
                required
                autoComplete="given-name"
              />
              
              <FormField
                label="Nom"
                register={register('lastName')}
                error={errors.lastName}
                placeholder="Nom"
                required
                autoComplete="family-name"
              />
            </div>

            <FormField
              label="Email"
              type="email"
              register={register('email')}
              error={errors.email}
              placeholder="votre@email.com"
              required
              autoComplete="email"
            />

            <FormField
              label="Téléphone"
              type="tel"
              register={register('phone')}
              error={errors.phone}
              placeholder="+33 6 12 34 56 78"
              required
              autoComplete="tel"
            />

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-200">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                {...register('message')}
                id="message"
                rows={4}
                placeholder="Votre message..."
                className={`w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:border-orange-400 focus:ring-orange-400 ${
                  errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
              {errors.message && (
                <p className="text-red-400 text-xs">{errors.message.message}</p>
              )}
            </div>

            <FormCheckbox
              label="Je souhaite recevoir la newsletter"
              register={register('newsletter')}
              error={errors.newsletter}
            />

            <FormCheckbox
              label={
                <>
                  J&apos;accepte les{' '}
                  <a href="/terms" className="text-orange-400 hover:text-orange-300">
                    conditions d&apos;utilisation
                  </a>
                </>
              }
              register={register('terms')}
              error={errors.terms}
            />

            <Button
              type="submit"
              disabled={loading || !isValid || !isDirty}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Envoyer le message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 