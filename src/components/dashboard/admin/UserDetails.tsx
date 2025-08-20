'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/shared/types/user';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';

interface UserDetailsProps {
  userId: string;
  onClose: () => void;
}

export function UserDetails({ userId, onClose }: UserDetailsProps) {
  const {
    selectedUser,
    userActivities,
    loading,
    error,
    fetchUserById,
    fetchUserActivities,
    updateUser,
    clearError,
  } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUserById(userId);
    fetchUserActivities(userId);
  }, [userId, fetchUserById, fetchUserActivities]);

  const handleEdit = () => {
    if (selectedUser) {
      setEditData({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        username: selectedUser.username,
        bio: selectedUser.bio,
        role: selectedUser.role,
        status: selectedUser.status,
        isVerified: selectedUser.isVerified,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (selectedUser) {
      const success = await updateUser(selectedUser.id, editData);
      if (success) {
        setIsEditing(false);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const getStatusBadge = (status: User['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactif' },
      suspended: { color: 'bg-yellow-100 text-yellow-800', label: 'Suspendu' },
      banned: { color: 'bg-red-100 text-red-800', label: 'Banni' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const roleConfig = {
      user: { color: 'bg-blue-100 text-blue-800', label: 'Utilisateur' },
      artist: { color: 'bg-purple-100 text-purple-800', label: 'Artiste' },
      moderator: { color: 'bg-orange-100 text-orange-800', label: 'Modérateur' },
      admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
    };

    const config = roleConfig[role as keyof typeof roleConfig];
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading && !selectedUser) {
    return <Loading />;
  }

  if (!selectedUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Utilisateur non trouvé</p>
        <Button onClick={onClose} className="mt-4">
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Détails de l&apos;utilisateur</h2>
          <p className="text-gray-600">Informations complètes et actions</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
                Sauvegarder
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Annuler
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleEdit} className="bg-orange-500 hover:bg-orange-600 text-white">
                Modifier
              </Button>
              <Button onClick={onClose} variant="outline">
                Fermer
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button onClick={clearError} className="ml-2 text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Informations principales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-16 w-16">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-medium text-xl">
                    {selectedUser.full_name?.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedUser.full_name}
                </h3>
                <p className="text-gray-500">@{selectedUser.username}</p>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName || ''}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-400 focus:ring-orange-400"
                  />
                ) : (
                  <p className="text-gray-900">{selectedUser.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName || ''}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-400 focus:ring-orange-400"
                  />
                ) : (
                  <p className="text-gray-900">{selectedUser.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom d&apos;utilisateur
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.username || ''}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-400 focus:ring-orange-400"
                />
              ) : (
                <p className="text-gray-900">@{selectedUser.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{selectedUser.email}</p>
            </div>

            {selectedUser.bio && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.bio || ''}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-400 focus:ring-orange-400"
                  />
                ) : (
                  <p className="text-gray-900">{selectedUser.bio}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statut et rôles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Statut et rôles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              {isEditing ? (
                <select
                  value={editData.role || selectedUser.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value as User['role'] })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-400 focus:ring-orange-400"
                >
                  <option value="user">Utilisateur</option>
                  <option value="artist">Artiste</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <div className="flex items-center space-x-2">
                  {getRoleBadge(selectedUser.role)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              {isEditing ? (
                <select
                  value={editData.status || selectedUser.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as User['status'] })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-400 focus:ring-orange-400"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                  <option value="banned">Banni</option>
                </select>
              ) : (
                <div className="flex items-center space-x-2">
                  {getStatusBadge(selectedUser.status)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vérifié
              </label>
              {isEditing ? (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editData.isVerified ?? selectedUser.isVerified}
                    onChange={(e) => setEditData({ ...editData, isVerified: e.target.checked })}
                    className="rounded border-gray-300 text-orange-400 focus:ring-orange-400"
                  />
                  <span className="ml-2 text-sm text-gray-700">Compte vérifié</span>
                </label>
              ) : (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedUser.isVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedUser.isVerified ? 'Oui' : 'Non'}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email vérifié
              </label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedUser.isEmailVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedUser.isEmailVerified ? 'Oui' : 'Non'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dernière connexion
              </label>
              <p className="text-gray-900">
                {selectedUser.lastLoginAt 
                  ? new Date(selectedUser.lastLoginAt).toLocaleString('fr-FR')
                  : 'Jamais connecté'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Activités récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {userActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
          ) : (
            <div className="space-y-3">
              {userActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    activity.type === 'login' ? 'bg-green-100 text-green-800' :
                    activity.type === 'logout' ? 'bg-gray-100 text-gray-800' :
                    activity.type === 'profile_update' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations système */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Informations système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID utilisateur
              </label>
              <p className="text-gray-900 font-mono text-sm">{selectedUser.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de création
              </label>
              <p className="text-gray-900">
                {new Date(selectedUser.createdAt || '').toLocaleString('fr-FR')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dernière modification
              </label>
              <p className="text-gray-900">
                {new Date(selectedUser.updatedAt || '').toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 