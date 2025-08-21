'use client';

import { useState, useEffect } from 'react';
import { useAuth, useLogout } from '@/hooks/useAuthQueries';
import { useUserById } from '@/hooks/useAuthQueries';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { Notification } from '@/components/ui/Notification';
import { ArtistRoute } from '@/components/auth/ProtectedRoute';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

interface ProfileFormData {
  full_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  birth_date?: string;
  sexe?: string;
  adress?: string;
  countryCode?: string;
}

interface ArtistProfileFormData {
  stage_name?: string;
  biography?: string;
  profile_image?: File;
  cover_image?: File;
}

interface PasswordFormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export default function ArtistProfilePage() {
  const { user, updateUserProfile, updateArtistProfile, changePassword, isUpdatingUserProfile, isUpdatingArtistProfile, isChangingPassword } = useAuth();
  const logoutMutation = useLogout();
  const [activeTab, setActiveTab] = useState<'user' | 'artist' | 'password'>('user');
  const [userFormData, setUserFormData] = useState<ProfileFormData>({});
  const [artistFormData, setArtistFormData] = useState<ArtistProfileFormData>({});
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const { data: userData, isLoading, error } = useUserById(user?.id || '');

  // Initialiser les formulaires avec les données utilisateur
  useEffect(() => {
    if (userData) {
      setUserFormData({
        full_name: userData.full_name || '',
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        city: userData.city || '',
        country: userData.country || '',
        birth_date: userData.birth_date ? new Date(userData.birth_date).toISOString().split('T')[0] : '',
        sexe: userData.sexe || '',
        adress: userData.adress || '',
        countryCode: userData.countryCode || '',
      });

      if (userData.artist_profile) {
        setArtistFormData({
          stage_name: userData.artist_profile.stage_name || '',
          biography: userData.artist_profile.biography || '',
        });
      }
    }
  }, [userData]);

  const handleUpdateUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateUserProfile(userFormData);
      setNotification({
        message: 'Profil utilisateur mis à jour avec succès !',
        type: 'success',
        isVisible: true
      });

      setTimeout(() => {
        logoutMutation.mutate();
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
      setNotification({
        message: 'Erreur lors de la mise à jour du profil utilisateur',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleUpdateArtistProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (!userData?.artist_profile?.id) {
        setNotification({
          message: 'ID du profil artiste non trouvé',
          type: 'error',
          isVisible: true
        });
        return;
      }

      const formData = {
        ...artistFormData,
        profile_image: selectedProfileImage || undefined,
        cover_image: selectedCoverImage || undefined,
        id: userData.artist_profile.id,
      };

      await updateArtistProfile(formData);
      setNotification({
        message: 'Profil artiste mis à jour avec succès !',
        type: 'success',
        isVisible: true
      });
      setSelectedProfileImage(null);
      setSelectedCoverImage(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil artiste:', error);
      setNotification({
        message: 'Erreur lors de la mise à jour du profil artiste',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      setNotification({
        message: 'Les mots de passe ne correspondent pas',
        type: 'error',
        isVisible: true
      });
      return;
    }

    try {
      await changePassword(passwordFormData);
      setNotification({
        message: 'Mot de passe changé avec succès !',
        type: 'success',
        isVisible: true
      });
      setPasswordFormData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setNotification({
        message: 'Erreur lors du changement de mot de passe',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // Appeler l'API de suppression de compte
      // await deleteAccountMutation.mutateAsync(user.id);
      alert('Fonctionnalité de suppression de compte à implémenter');
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Erreur lors du chargement du profil</div>;
  if (!userData) return <div>Profil non trouvé</div>;

  return (
    <ArtistRoute>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white hidden"
          >
            Supprimer le Compte
          </Button>
        </div>

        {/* Onglets */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'user'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Informations Personnelles
          </button>
          <button
            onClick={() => setActiveTab('artist')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'artist'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Profil Artiste
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'password'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Changer le Mot de Passe
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'user' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Informations Personnelles</h2>
            <form onSubmit={handleUpdateUserProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
                    Nom complet
                  </label>
                  <Input
                  value={userFormData.full_name || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
                    Nom d&apos;utilisateur
                  </label>
                  <Input
                  value={userFormData.username || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
                    Email
                  </label>
                  <Input
                  type="email"
                  value={userFormData.email || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
                    Téléphone
                  </label>
                <Input
                  value={userFormData.phone || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
                    Ville
                  </label>
                <Input
                  value={userFormData.city || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, city: e.target.value })}
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
                    Pays
                  </label>
                <Input
                  value={userFormData.country || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, country: e.target.value })}
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
                    Code pays
                  </label>
                <Input
                  value={userFormData.countryCode || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, countryCode: e.target.value })}
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
                    Date de naissance
                  </label>
                <Input
                  type="date"
                  value={userFormData.birth_date || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, birth_date: e.target.value })}
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 p-3 mb-2">
                    Sexe
                  </label>
                  <select
                    value={userFormData.sexe || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, sexe: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zouglou-green-500 focus:ring-zouglou-green-500 p-3"
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                    <option value="O">Autre</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <textarea
                  value={userFormData.adress || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, adress: e.target.value })}
                  rows={3}
                  className="p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-zouglou-green-500 focus:ring-zouglou-green-500"
                  placeholder="Votre adresse complète..."
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingUserProfile}
                  className="bg-[#005929] hover:bg-[#005929]/80 text-white"
                >
                  {isUpdatingUserProfile ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'artist' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Profil Artiste</h2>
            <form onSubmit={handleUpdateArtistProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d&apos;artiste
                  </label>
                <Input
                  value={artistFormData.stage_name || ''}
                  onChange={(e) => setArtistFormData({ ...artistFormData, stage_name: e.target.value })}
                />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biographie
                </label>
                <textarea
                  value={artistFormData.biography || ''}
                  onChange={(e) => setArtistFormData({ ...artistFormData, biography: e.target.value })}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-zouglou-green-500 focus:ring-zouglou-green-500 p-3 "
                  placeholder="Parlez-nous de votre parcours artistique..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image de profil (optionnel)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedProfileImage(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-zouglou-green-700 hover:file:bg-green-100"
                  />
                  {userData.artist_profile?.profile_image && (
                    <p className="text-xs text-gray-500 mt-1">
                      Image actuelle: {userData.artist_profile.profile_image.split('/').pop()}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image de couverture (optionnel)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedCoverImage(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-zouglou-green-700 hover:file:bg-green-100"
                  />
                  {userData.artist_profile?.cover_image && (
                    <p className="text-xs text-gray-500 mt-1">
                      Image actuelle: {userData.artist_profile.cover_image.split('/').pop()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingArtistProfile}
                  className="bg-[#005929] hover:bg-[#005929]/80 text-white"
                >
                  {isUpdatingArtistProfile ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'password' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Changer le Mot de Passe</h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <Input
                  type="password"
                  value={passwordFormData.old_password}
                  placeholder='********'
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, old_password: e.target.value })}
                  required
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                <Input
                  type="password"
                  value={passwordFormData.new_password}
                  placeholder='********'
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, new_password: e.target.value })}
                  required
                />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                <Input
                  type="password"
                  value={passwordFormData.confirm_password}
                  placeholder='********'
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, confirm_password: e.target.value })}
                  required
                />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-[#005929] hover:bg-[#005929]/80 text-white"
                >
                  {isChangingPassword ? 'Changement...' : 'Changer le mot de passe'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Modal de confirmation de suppression */}
        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
          itemName="Compte"
          message="Cette action est irréversible. Toutes vos données, tracks, albums et autres contenus seront définitivement supprimées."
        />
      
      </div>
    </ArtistRoute>
  );
} 