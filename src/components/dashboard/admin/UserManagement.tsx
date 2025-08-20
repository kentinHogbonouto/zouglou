'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { UserRole, UserStatus } from '@/shared/types/user';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';

export function UserManagement() {
  const {
    users,
    loading,
    error,
    filters,
    pagination,
    fetchUsers,
    setFilters,
    setPagination,
    deleteUser,
    suspendUser,
    activateUser,
    banUser,
    verifyUser,
    bulkAction,
    clearError,
  } = useUserStore();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers(filters);
  }, [filters, fetchUsers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ search: query });
  };

  const handleBulkAction = async (action: 'suspend' | 'activate' | 'delete' | 'verify') => {
    if (selectedUsers.length === 0) return;

    const success = await bulkAction(selectedUsers, action);
    if (success) {
      setSelectedUsers([]);
    }
  };

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    switch (action) {
      case 'delete':
        await deleteUser(userId);
        break;
      case 'suspend':
        await suspendUser(userId, reason || 'Action administrative');
        break;
      case 'activate':
        await activateUser(userId);
        break;
      case 'ban':
        await banUser(userId, reason || 'Violation des conditions');
        break;
      case 'verify':
        await verifyUser(userId);
        break;
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactif' },
      suspended: { color: 'bg-yellow-100 text-yellow-800', label: 'Suspendu' },
      banned: { color: 'bg-red-100 text-red-800', label: 'Banni' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      user: { color: 'bg-blue-100 text-blue-800', label: 'Utilisateur' },
      artist: { color: 'bg-purple-100 text-purple-800', label: 'Artiste' },
      moderator: { color: 'bg-orange-100 text-orange-800', label: 'Modérateur' },
      admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      super_admin: { color: 'bg-green-100 text-green-800', label: 'Super Admin' },
    };

    const config = roleConfig[role as keyof typeof roleConfig];
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  if (loading && users.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
          <p className="text-gray-600">Gérez les utilisateurs de la plateforme</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
          >
            {showFilters ? 'Masquer' : 'Afficher'} les filtres
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            + Nouvel utilisateur
          </Button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <Card className="bg-white/50 backdrop-blur-sm border border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recherche
                </label>
                <Input
                  placeholder="Email, nom, username..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  value={filters.role || ''}
                  onChange={(e) => setFilters({ role: e.target.value as UserRole || undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-400 focus:ring-orange-400"
                >
                  <option value="">Tous les rôles</option>
                  <option value="user">Utilisateur</option>
                  <option value="artist">Artiste</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ status: e.target.value as UserStatus || undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-400 focus:ring-orange-400"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                  <option value="banned">Banni</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vérifié
                </label>
                <select
                  value={filters.isVerified?.toString() || ''}
                  onChange={(e) => setFilters({ isVerified: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-400 focus:ring-orange-400"
                >
                  <option value="">Tous</option>
                  <option value="true">Vérifié</option>
                  <option value="false">Non vérifié</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions en masse */}
      {selectedUsers.length > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-800">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
              </span>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleBulkAction('verify')}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Vérifier
                </Button>
                <Button
                  onClick={() => handleBulkAction('suspend')}
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Suspendre
                </Button>
                <Button
                  onClick={() => handleBulkAction('activate')}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Activer
                </Button>
                <Button
                  onClick={() => handleBulkAction('delete')}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-gray-900">
              Utilisateurs ({pagination.total})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedUsers.length === users.length && users.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-orange-400 focus:ring-orange-400"
              />
              <span className="text-sm text-gray-600">Sélectionner tout</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
              <button
                onClick={clearError}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vérifié
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d&apos;inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="mr-3 rounded border-gray-300 text-orange-400 focus:ring-orange-400"
                        />
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-orange-600 font-medium">
                            {user.full_name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role || 'user')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status || 'active')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {user.isVerified ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUserAction(user.id, 'verify')}
                          className="text-green-600 hover:text-green-900"
                          title="Vérifier"
                        >
                          ✓
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Suspendre"
                          >
                            ⏸
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="text-blue-600 hover:text-blue-900"
                            title="Activer"
                          >
                            ▶
                          </button>
                        )}
                        <button
                          onClick={() => handleUserAction(user.id, 'delete')}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
                {pagination.total} résultats
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setPagination({ page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  variant="outline"
                  size="sm"
                >
                  Précédent
                </Button>
                <Button
                  onClick={() => setPagination({ page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 