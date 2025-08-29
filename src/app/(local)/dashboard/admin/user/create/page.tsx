"use client";

import { useState } from 'react';
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateUser } from '@/hooks/useAdminQueries';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ArrowLeft, 
  Save, 
  Shield, 
  Crown, 
  Music, 
  AlertTriangle,
} from 'lucide-react';

interface CreateUserData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active: boolean;
  default_role: string;
}

export default function AdminCreateUserPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    default_role: 'admin',
    is_active: true,
  });

  const [errors, setErrors] = useState<Partial<CreateUserData>>({});

  // React Query hooks
  const createUser = useCreateUser();

  const handleInputChange = (field: keyof CreateUserData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createUser.mutateAsync(formData);
      router.push('/dashboard/admin/user');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const getRoleDescription = () => {
    if (formData.default_role === 'super-admin') {
      return 'Accès complet à toutes les fonctionnalités de la plateforme';
    }
    if (formData.default_role === 'admin') {
      return 'Accès aux fonctionnalités d\'administration';
    }
    return 'Utilisateur standard de la plateforme';
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard/admin/user')}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </Button>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      Créer un nouvel utilisateur
                    </h1>
                    <p className="text-slate-500 text-base">
                      Ajoutez un nouvel utilisateur à la plateforme
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations de base
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Prénom *
                    </label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Prénom de l'utilisateur"
                      className={`border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20 ${
                        errors.first_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.first_name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nom *
                    </label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Nom de l'utilisateur"
                      className={`border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20 ${
                        errors.last_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="utilisateur@exemple.com"
                      className={`border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20 ${
                        errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mot de passe *
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Mot de passe sécurisé"
                      className={`border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20 ${
                        errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      Le mot de passe doit contenir au moins 8 caractères
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions and Status */}
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Permissions et statut
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                      />
                      <span className="ml-2 text-sm font-medium text-slate-700">Compte actif</span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500 ml-6">
                      L&apos;utilisateur pourra se connecter immédiatement
                    </p>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.default_role === 'artist'}
                        onChange={(e) => handleInputChange('default_role', e.target.checked ? 'artist' : 'user')}
                        className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                      />
                      <span className="ml-2 text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Music className="w-4 h-4" />
                        Artiste
                      </span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500 ml-6">
                      Accès aux fonctionnalités d&apos;artiste
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.default_role === 'admin'}
                        onChange={(e) => handleInputChange('default_role', e.target.checked ? 'admin' : 'user')}
                        className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                      />
                      <span className="ml-2 text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        Administrateur
                      </span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500 ml-6">
                      Accès aux fonctionnalités d&apos;administration
                    </p>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.default_role === 'super-admin'}
                        onChange={(e) => handleInputChange('default_role', e.target.checked ? 'super-admin' : 'user')}
                        className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                      />
                      <span className="ml-2 text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Crown className="w-4 h-4" />
                        Super administrateur
                      </span>
                    </label>
                    <p className="mt-1 text-xs text-slate-500 ml-6">
                      Accès complet à toutes les fonctionnalités
                    </p>
                  </div>
                  
                  {/* Role Summary */}
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Résumé des permissions</h4>
                    <p className="text-sm text-slate-600">{getRoleDescription()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => router.push('/dashboard/admin/user')}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-6 py-3 rounded-xl transition-all duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createUser.isPending}
                className="bg-[#005929] hover:bg-[#005929]/90 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium"
              >
                {createUser.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Créer l&apos;utilisateur
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminRoute>
  );
}
