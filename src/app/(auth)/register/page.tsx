'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuthQueries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Image from 'next/image';

// Schéma de validation avec Yup
const registerSchema = yup.object({
  fullName: yup
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .required('Le prénom est requis'),
  email: yup
    .string()
    .email('Veuillez entrer un email valide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    )
    .required('Le mot de passe est requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation')
    .required('Vous devez accepter les conditions d\'utilisation'),
}).required();

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const [error, setError] = useState('');

  const { register: registerUser, isRegistering } = useAuth();
  const router = useRouter();

  // Configuration de React Hook Form avec Yup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange', // Validation en temps réel
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');

    try {
      await registerUser({
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        default_role: 'artist',
      });
      router.push('/login');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la création du compte');
      // Réinitialiser les mots de passe en cas d'erreur
      reset({ password: '', confirmPassword: '', fullName: '', email: '' });
    }
  };

  // Surveiller le mot de passe pour la validation en temps réel
  const password = watch('password');

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden md:block md:w-1/2 h-screen">
        <Image src="/images/register.jpg" alt="Musique africaine" className="w-full h-full object-top object-cover" />
      </div>
      <div className="w-full md:w-1/2 bg-green-900 flex justify-center items-center">
        <div className="w-3/5">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="text-4xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
              Zouglou
            </Link>
            <p className="text-gray-300 mt-2">Rejoignez la communauté musicale</p>
          </div>

          {/* Formulaire d'inscription */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 py-6 px-4">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl text-gray-200 font-bold">Créer un compte</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-4">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">
                    Nom complet
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    {...register('fullName')}
                    placeholder="Nom complet"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400
                      ${errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="votre@email.com"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                    Mot de passe
                  </label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                  />
                  {password && (
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>Le mot de passe doit contenir :</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li className={password.length >= 8 ? 'text-green-400' : 'text-gray-500'}>
                          Au moins 8 caractères
                        </li>
                        <li className={/[a-z]/.test(password) ? 'text-green-400' : 'text-gray-500'}>
                          Au moins une minuscule
                        </li>
                        <li className={/[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-500'}>
                          Au moins une majuscule
                        </li>
                        <li className={/\d/.test(password) ? 'text-green-400' : 'text-gray-500'}>
                          Au moins un chiffre
                        </li>
                      </ul>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-400 text-xs">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                    Confirmer le mot de passe
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="••••••••"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...register('acceptTerms')}
                    className="mt-1 rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-gray-200">
                      J&apos;accepte les{' '}
                      <Link href="/terms" className="text-orange-400 hover:text-orange-300">
                        conditions d&apos;utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link href="/privacy" className="text-orange-400 hover:text-orange-300">
                        politique de confidentialité
                      </Link>
                    </span>
                    {errors.acceptTerms && (
                      <p className="text-red-400 text-xs mt-1">{errors.acceptTerms.message}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isRegistering || !isValid || !isDirty}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isRegistering ? 'Création...' : 'Créer mon compte'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-300 text-sm">
                  Déjà un compte ?{' '}
                  <Link
                    href="/login"
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
} 