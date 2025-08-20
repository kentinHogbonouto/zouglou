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

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Veuillez entrer un email valide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
  rememberMe: yup.boolean().default(false),
}).required();

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const [error, setError] = useState('');

  const { login, isLoggingIn, logout } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');

    try {
      const response = await login({ email: data.email, password: data.password });
      if (response.user.default_role === 'super-admin' || response.user.default_role === 'admin') {
        router.push('/dashboard/admin');

      } else if (response.user.default_role === 'artist') {
        router.push('/dashboard/artist');
      } else {
        await logout();
        setError('Vous n\'avez pas les permissions pour accéder à cette application');
        reset({ password: '', email: '' });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Email ou mot de passe incorrect');
      reset({ password: '' });
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden md:block md:w-1/2 h-screen" >
        <Image src="/images/login.jpg" alt="Musique africaine" className="w-full h-full object-cover" />
      </div>
      <div className="w-1/2 bg-green-900 flex justify-center items-center">
        <div className=" w-3/5">
          <div className="text-center mb-8">
            <Link href="/" className="text-4xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
              Zouglou
            </Link>
            <p className="text-gray-200 mt-2">Connectez-vous à votre compte</p>
          </div>
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 py-6 px-4">
            <CardHeader className="text-center mb-6">
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl text-gray-200 font-bold">Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

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
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
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
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('rememberMe')}
                      className="rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400"
                    />
                    <span className="ml-2 text-sm text-gray-200">Se souvenir de moi</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn || !isValid}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoggingIn ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-300 text-sm">
                  Pas encore de compte ?{' '}
                  <Link
                    href="/register"
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Créer un compte
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