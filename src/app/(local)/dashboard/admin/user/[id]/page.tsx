"use client";

import { useState, useEffect } from 'react';
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useAdminUser, useUpdateUser, useToggleUserStatus, useRealDeleteUser  } from '@/hooks/useAdminQueries';
import { useRouter, useParams } from 'next/navigation';
import {
  User,
  ArrowLeft,
  Save,
  X,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Crown,
  Music,
  Users,
  Mail,
  Calendar,
  Camera,
  Settings,
  Activity,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import Image from 'next/image';
import { UserRole, UpdateUserRequest } from '@/shared/types';
import { ApiUser } from '@/hooks/useAdminQueries';


export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ApiUser>>({});
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean }>({ isOpen: false });

  // React Query hooks
  const { data: user, isLoading, error } = useAdminUser(userId);
  const updateUser = useUpdateUser();
  const toggleUserStatus = useToggleUserStatus();
  const deleteUser = useRealDeleteUser();

  useEffect(() => {
    if (user) {
      setEditData({
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        sexe: user.sexe,
        default_role: user.default_role as UserRole,
        is_active: user.is_active,
        phone: user.phone,
        city: user.city,
        country: user.country,
        adress: user.adress,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUser.mutateAsync({ id: userId, data: editData as UpdateUserRequest });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        sexe: user.sexe || '',
        default_role: user.default_role as UserRole,
        is_active: user.is_active,
      });
    }
    setIsEditing(false);
  };

  const handleToggleStatus = async () => {
    if (!user) return;

    try {
      await toggleUserStatus.mutateAsync({ id: userId, is_active: !user.is_active });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    setDeleteModal({ isOpen: true });
  };

  const confirmDelete = async () => {
    if (!user) return;

    try {
      await deleteUser.mutateAsync(userId);
      setDeleteModal({ isOpen: false });
      router.push('/dashboard/admin/user');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false });
  };

  const getRoleBadge = (user: ApiUser) => {
    if (user.default_role === 'super-admin') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <Crown className="w-4 h-4 mr-2" />
          Super Admin
        </span>
      );
    }
    if (user.default_role === 'admin') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
          <Shield className="w-4 h-4 mr-2" />
          Admin
        </span>
      );
    }
    if (user.default_role === 'artist') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          <Music className="w-4 h-4 mr-2" />
          Artiste
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        <Users className="w-4 h-4 mr-2" />
        Utilisateur
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <UserCheck className="w-4 h-4 mr-2" />
        Actif
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <UserX className="w-4 h-4 mr-2" />
        Inactif
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(parseFloat(price));
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005929] mx-auto"></div>
            <p className="mt-4 text-slate-600">Chargement des détails de l&apos;utilisateur...</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (error || !user) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Utilisateur non trouvé</h2>
            <p className="text-slate-600 mb-4">L&apos;utilisateur que vous recherchez n&apos;existe pas.</p>
            <Button
              onClick={() => router.push('/dashboard/admin/user')}
              className="bg-[#005929] hover:bg-[#005929]/90 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </Button>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
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
                      Détails de l&apos;utilisateur
                    </h1>
                    <p className="text-slate-500 text-base">
                      Gérez les informations de {user.full_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleCancel}
                      className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={updateUser.isPending}
                      className="bg-[#005929] hover:bg-[#005929]/90 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleToggleStatus}
                      disabled={toggleUserStatus.isPending}
                      className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${user.is_active
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                      {user.is_active ? (
                        <>
                          <UserX className="w-4 h-4 mr-2" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Activer
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDeleteUser}
                      disabled={deleteUser.isPending}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      {user.profil_image ?
                        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#005929] to-[#FE5200] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                          <Image src={user.profil_image} alt="Profil" width={100} height={100} className="w-full h-full object-cover rounded-full" />
                        </div>
                        :
                        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#005929] to-[#FE5200] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                          {user.full_name?.charAt(0)}
                        </div>}
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                          <Camera className="w-4 h-4 text-slate-600" />
                        </button>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold text-slate-800 mb-2">
                      {isEditing ? (
                        <div className="flex gap-2 justify-center">

                          <Input
                            value={editData.full_name || ''}
                            onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                            className="text-center font-semibold border-0 bg-transparent p-0 w-20"
                            placeholder="Nom complet"
                          />
                        </div>
                      ) : (
                        user.full_name
                      )}
                    </h2>

                    <p className="text-slate-500 mb-4">
                      {isEditing ? (
                        <Input
                          value={editData.username || ''}
                          onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                          className="text-center border-0 bg-transparent p-0 text-slate-500"
                        />
                      ) : (
                        `@${user.username}`
                      )}
                    </p>

                    <div className="flex justify-center gap-2 mb-6">
                      {getRoleBadge(user)}
                      {getStatusBadge(user.is_active)}
                    </div>

                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">
                          {isEditing ? (
                            <Input
                              value={editData.email || ''}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              className="border-0 bg-transparent p-0 text-slate-600"
                            />
                          ) : (
                            user.email
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">
                          Inscrit le {formatDate(user.createdAt || '')}
                        </span>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Details */}
            <div className="lg:col-span-2 space-y-6">
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
                        Nom complet
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.full_name || ''}
                          onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                          className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                        />
                      ) : (
                        <p className="text-slate-900">{user.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom d&apos;utilisateur
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.username || ''}
                          onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                          className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                        />
                      ) : (
                        <p className="text-slate-900">{user.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.email || ''}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                        />
                      ) : (
                        <p className="text-slate-900">{user.email}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 text-sm">
                      <label htmlFor="sexe" className="block text-sm font-medium text-slate-700 mb-2">
                        Sexe
                      </label>
                      {isEditing ? (
                        <select value={editData.sexe || ''} onChange={(e) => setEditData({ ...editData, sexe: e.target.value })} className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20">
                          <option value="m">Masculin</option>
                          <option value="f">Féminin</option>
                        </select>
                      ) : (
                        <p className="text-slate-900">{user.sexe === 'M' ? 'Masculin' : user.sexe === 'F' ? 'Féminin' : 'Autre'}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 text-sm">
                      <label htmlFor="default_role" className="block text-sm font-medium text-slate-700 mb-2">
                        Rôle par défaut
                      </label>
                      {isEditing ? (
                        <select value={editData.default_role || ''} onChange={(e) => setEditData({ ...editData, default_role: e.target.value as UserRole })} className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20">
                          <option value="user">Utilisateur</option>
                          <option value="artist">Artiste</option>
                          <option value="admin">Administrateur</option>
                          <option value="super-admin">Super Admin</option>
                        </select>
                      ) : (
                        <p className="text-slate-900">{user.default_role}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact and Location Information */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Informations de contact et localisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Téléphone
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                        />
                      ) : (
                        <p className="text-slate-900">{user.phone || 'Non renseigné'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ville
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.city || ''}
                          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                          className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                        />
                      ) : (
                        <p className="text-slate-900">{user.city || 'Non renseigné'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pays
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.country || ''}
                          onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                          className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                        />
                      ) : (
                        <p className="text-slate-900">{user.country_name || user.country || 'Non renseigné'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Adresse
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.adress || ''}
                          onChange={(e) => setEditData({ ...editData, adress: e.target.value })}
                          className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                        />
                      ) : (
                        <p className="text-slate-900">{user.adress || 'Non renseigné'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Plateforme
                      </label>
                      <p className="text-slate-900 capitalize">{user.plateform || 'Non renseigné'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type d&apos;authentification
                      </label>
                      <p className="text-slate-900 capitalize">{user.type_auth || 'Non renseigné'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions and Status */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Permissions et statut
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Statut du compte
                      </label>
                      {isEditing ? (
                        <select
                          value={editData.is_active ? 'true' : 'false'}
                          onChange={(e) => setEditData({ ...editData, is_active: e.target.value === 'true' })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                        >
                          <option value="true">Actif</option>
                          <option value="false">Inactif</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getStatusBadge(user.is_active)}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Rôle utilisateur
                      </label>
                      {isEditing ? (
                        <select value={editData.default_role || ''} onChange={(e) => setEditData({ ...editData, default_role: e.target.value as UserRole })} className="border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20">
                          <option value="user">Utilisateur</option>
                          <option value="artist">Artiste</option>
                          <option value="admin">Administrateur</option>
                          <option value="super-admin">Super Admin</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Artist Profile (if applicable) */}
              {user.artist_profile && (
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Profil Artiste
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nom d&apos;artiste
                        </label>
                        <p className="text-slate-900">{user.artist_profile.stage_name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Bio
                        </label>
                        <p className="text-slate-900">
                          {user.artist_profile.biography || 'Aucune bio disponible'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Profil image
                        </label>
                        {user.artist_profile?.profile_image ? (
                          <Image
                            src={user.artist_profile?.profile_image}
                            alt="Profil image de l'artiste"
                            width={100}
                            height={100}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <p className="text-slate-500">Aucun profil image</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Current Subscription */}
              {user.last_subscription && (
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Abonnement actuel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Plan
                        </label>
                        <p className="text-slate-900 font-medium">{user.last_subscription.plan.name}</p>
                        <p className="text-slate-500 text-sm">{user.last_subscription.plan.description}</p>
                        <p className="text-slate-600 text-sm font-medium">{formatPrice(user.last_subscription.plan.price)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Statut
                        </label>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(user.last_subscription.status === 'active')}
                          <span className="text-sm text-slate-500">
                            {user.last_subscription.auto_renew ? 'Auto-renouvellement' : 'Sans auto-renouvellement'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Période
                        </label>
                        <p className="text-slate-900">
                          Du {formatDate(user.last_subscription.start_date)} au {formatDate(user.last_subscription.end_date)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Transaction
                        </label>
                        <p className="text-slate-900 text-sm">Réf: {user.last_subscription.transaction.reference}</p>
                        <p className="text-slate-500 text-sm">{user.last_subscription.transaction.payment_service_name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Interested Artists */}
              {user.interested_artists && user.interested_artists.length > 0 && (
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Artistes suivis ({user.interested_artists.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {user.interested_artists.map((artist) => (
                        <div key={artist.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          {artist.profile_image ? (
                            <Image
                              src={artist.profile_image}
                              alt={artist.stage_name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#005929] to-[#FE5200] flex items-center justify-center text-white text-sm font-bold">
                              {artist.stage_name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{artist.stage_name}</p>
                            <p className="text-xs text-slate-500">{artist.followers_count} abonnés</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Activity Summary */}
              <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Résumé d&apos;activité
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#005929] mb-1">{user.interested_artists?.length || 0}</div>
                      <div className="text-sm text-slate-600">Artistes suivis</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#FE5200] mb-1">{user.user_count_notifcation || 0}</div>
                      <div className="text-sm text-slate-600">Notifications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{user.has_active_subscription ? 1 : 0}</div>
                      <div className="text-sm text-slate-600">Abonnements actifs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          message="Cette action est irréversible. L'utilisateur et toutes ses données seront définitivement supprimés."
          itemName={user?.full_name || ''}
          isDeleting={deleteUser.isPending}
        />
      </div>
    </AdminRoute>
  );
}