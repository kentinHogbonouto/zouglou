'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks';
import Image from 'next/image';
// Schéma de validation Yup
const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    )
    .required('Le nouveau mot de passe est requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
}).required();

type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string>('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setTokenValid(true); // En production, vous devriez valider le token côté serveur
    } else {
      setTokenValid(false);
    }
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('root', {
        type: 'manual',
        message: 'Token de réinitialisation manquant',
      });
      return;
    }

    setLoading(true);
    
    try {
      await resetPassword({ token, newPassword: data.newPassword });
      setSuccess(true);
      // Redirection automatique vers login après 3 secondes
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      const error = err as Error;
      setError('root', {
        type: 'manual',
        message: error.message || 'Erreur lors de la réinitialisation du mot de passe',
      });
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
            <p className="text-gray-300 mt-4">Vérification du token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="text-4xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
              Zouglou
            </Link>
            <p className="text-gray-300 mt-2">Réinitialisation de mot de passe</p>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardContent className="text-center py-8">
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
                <p className="font-medium">Token invalide ou expiré</p>
                <p className="text-sm mt-1">
                  Le lien de réinitialisation est invalide ou a expiré.
                </p>
              </div>
              <Link
                href="/forgot-password"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Demander un nouveau lien
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden md:block md:w-1/2 h-screen">
        <Image src="/images/reset-password.jpg" alt="Musique africaine" className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="w-full md:w-1/2 bg-green-900 flex justify-center items-center">
        <div className="w-3/5">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
            Zouglou
          </Link>
          <p className="text-gray-300 mt-2">Réinitialisation de mot de passe</p>
        </div>

        {/* Formulaire */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Nouveau mot de passe</CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg">
                  <p className="font-medium">Mot de passe mis à jour !</p>
                  <p className="text-sm mt-1">
                    Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
                  </p>
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {errors.root && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {errors.root.message}
                  </div>
                )}

                <div className="text-center">
                  <p className="text-gray-300 text-sm">
                    Entrez votre nouveau mot de passe ci-dessous.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200">
                    Nouveau mot de passe
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...register('newPassword')}
                    placeholder="Votre nouveau mot de passe"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.newPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                    }`}
                  />
                  {errors.newPassword && (
                    <p className="text-red-300 text-sm mt-1">{errors.newPassword.message}</p>
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
                    placeholder="Confirmez votre nouveau mot de passe"
                    className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400 ${
                      errors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-300 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                <Link
                  href="/login"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  ← Retour à la connexion
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
            <p className="text-gray-300 mt-4">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
} 