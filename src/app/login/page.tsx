'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
            Zouglou
          </Link>
          <p className="text-gray-300 mt-2">Connectez-vous à votre compte</p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
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
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
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

        {/* Liens sociaux */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">Ou connectez-vous avec</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-colors">
              Google
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-colors">
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 