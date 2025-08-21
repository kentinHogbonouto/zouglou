'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks';
import Image from 'next/image';

// Schéma de validation Yup
const forgotPasswordSchema = yup.object({
  emailOrPhone: yup
    .string()
    .email('Veuillez entrer une adresse email valide')
    .required('L\'email est requis'),
}).required();

type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);

    try {
      await forgotPassword(data.emailOrPhone);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as Error;

      setError('root', {
        type: 'manual',
        message: error.message || 'Erreur lors de l\'envoi de l\'email',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden md:block md:w-1/2 h-screen">
        <Image src="/images/login.jpg" alt="Musique africaine" className="w-full h-full object-cover" width={1000} height={1000} />
      </div>
      <div className="w-full md:w-1/2 bg-green-900 flex justify-center items-center">
        <div className="w-3/5">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="text-4xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
              <Image src="/images/logo_zouglou.png" alt="Musique africaine" width={100} height={100} className="w-[10rem] h-[10rem] mx-auto" />
            </Link>
            <p className="text-gray-300 mt-2">Récupération de mot de passe</p>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Mot de passe oublié</CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center space-y-4">
                  <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg">
                    <p className="font-medium">Email envoyé !</p>
                    <p className="text-sm mt-1">
                      Nous avons envoyé un lien de réinitialisation à votre adresse email.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Retour à la connexion
                  </Link>
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
                      Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                      Email ou numéro de téléphone
                    </label>
                    <Input
                      id="email"
                      type="text"
                      {...register('emailOrPhone')}
                      placeholder="votre@email.com ou votre numéro de téléphone"
                      className={`bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400 ${errors.emailOrPhone ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''
                        }`}
                    />
                    {errors.emailOrPhone && (
                      <p className="text-red-300 text-sm mt-1">{errors.emailOrPhone.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Envoi...' : 'Envoyer le lien'}
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