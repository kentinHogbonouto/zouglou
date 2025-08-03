'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      router.push('/dashboard');
    } catch (err) {
      setError('Erreur lors de la création du compte');
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
          <p className="text-gray-300 mt-2">Rejoignez la communauté musicale</p>
        </div>

        {/* Formulaire d'inscription */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Créer un compte</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-200">
                    Prénom
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Prénom"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-200">
                    Nom
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Nom"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="nom_utilisateur"
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                />
                <p className="text-xs text-gray-400">Au moins 8 caractères</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                  Confirmer le mot de passe
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="rounded border-white/20 bg-white/10 text-orange-400 focus:ring-orange-400"
                />
                <span className="ml-2 text-sm text-gray-200">
                  J'accepte les{' '}
                  <Link href="/terms" className="text-orange-400 hover:text-orange-300">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link href="/privacy" className="text-orange-400 hover:text-orange-300">
                    politique de confidentialité
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer mon compte'}
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

        {/* Liens sociaux */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">Ou inscrivez-vous avec</p>
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