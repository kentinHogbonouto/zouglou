'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'email');
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="text-center">
                  <p className="text-gray-300 text-sm">
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>

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
  );
} 