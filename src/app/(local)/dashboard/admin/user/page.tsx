"use client";

import { useState } from 'react';
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useAdminUsers, useRealDeleteUser, useToggleUserDeleted } from '@/hooks/useAdminQueries';
import { useRouter } from 'next/navigation';
import { Users, Plus, UserCheck, UserX, Shield, Crown, Music, CreditCard, Search, Eye, Trash2 } from 'lucide-react';
import { ToggleDeletedButton } from '@/components/ui/DeletedStatusBadge';
import Image from 'next/image';
import { ApiUser } from '@/hooks/useAdminQueries';


export default function AdminUserPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'artist' | 'admin' | 'super-admin'>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'subscribed' | 'not_subscribed'>('all');
  const [deletedFilter, setDeletedFilter] = useState<'all' | 'deleted' | 'not_deleted'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Réinitialiser la pagination quand les filtres changent
  const handleFilterChange = <T extends string>(
    newFilter: T, 
    setFilter: React.Dispatch<React.SetStateAction<T>>
  ) => {
    setFilter(newFilter);
    setCurrentPage(1); // Retour à la première page
  };

  // Obtenir le résumé des filtres actifs
  const getActiveFiltersSummary = () => {
    const filters = [];
    if (searchTerm) filters.push(`Recherche: "${searchTerm}"`);
    if (statusFilter !== 'all') filters.push(`Statut: ${statusFilter === 'active' ? 'Actifs' : 'Inactifs'}`);
    if (roleFilter !== 'all') filters.push(`Rôle: ${roleFilter === 'super-admin' ? 'Super Admin' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}`);
    if (subscriptionFilter !== 'all') filters.push(`Abonnement: ${subscriptionFilter === 'subscribed' ? 'Abonnés' : 'Non abonnés'}`);
    if (deletedFilter !== 'all') filters.push(`Suppression: ${deletedFilter === 'deleted' ? 'Supprimés' : 'Actifs'}`);
    return filters;
  };

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null; userName: string }>({
    isOpen: false,
    userId: null,
    userName: ''
  });

  // React Query hooks
  const { data: usersData, isLoading } = useAdminUsers({
    page: currentPage,
    page_size: 10,
    search: searchTerm || undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
    default_role: roleFilter === 'all' ? undefined : roleFilter,
    has_active_subscription: subscriptionFilter === 'all' ? undefined : subscriptionFilter === 'subscribed' ? true : false,
    deleted: deletedFilter === 'all' ? undefined : deletedFilter === 'deleted' ? true : false,
  });

  const deleteUser = useRealDeleteUser();
  const toggleUserDeleted = useToggleUserDeleted();

  const users = usersData?.results || [];
  const totalUsers = usersData?.count || 0;
  const totalPages = Math.ceil(totalUsers / 10);

  const handleViewUser = (userId: string) => {
    router.push(`/dashboard/admin/user/${userId}`);
  };
  
  const handleDeleteUser = async (userId: string, userName: string) => {
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const handleToggleUserDeleted = async (userId: string, currentDeleted: boolean) => {
    try {
      await toggleUserDeleted.mutateAsync({ id: userId, deleted: !currentDeleted });
    } catch (error) {
      console.error('Erreur lors du changement de statut de suppression:', error);
    }
  };

  const confirmDelete = async () => {
    if (deleteModal.userId) {
      try {
        await deleteUser.mutateAsync(deleteModal.userId);
        setDeleteModal({ isOpen: false, userId: null, userName: '' });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: '' });
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

  const getRoleBadge = (user: ApiUser) => {
    if (user.default_role === 'super-admin') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Crown className="w-3 h-3 mr-1" />
          Super Admin
        </span>
      );
    }
    if (user.default_role === 'admin') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </span>
      );
    }
    if (user.default_role === 'artist') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Music className="w-3 h-3 mr-1" />
          Artiste
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Users className="w-3 h-3 mr-1" />
        Utilisateur
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <UserCheck className="w-3 h-3 mr-1" />
        Actif
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <UserX className="w-3 h-3 mr-1" />
        Inactif
      </span>
    );
  };

  const getSubscriptionBadge = (hasSubscription: boolean) => {
    return hasSubscription ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CreditCard className="w-3 h-3 mr-1" />
        Abonné
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <CreditCard className="w-3 h-3 mr-1" />
        Non abonné
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Les données sont déjà filtrées par la requête API
  const filteredUsers = users;

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                      Gestion des Utilisateurs
                    </h1>
                    <p className="text-slate-500 text-base">
                      Gérez tous les utilisateurs de la plateforme
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  className="bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => router.push('/dashboard/admin/user/create')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929] to-[#005929]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Utilisateurs</p>
                    <p className="text-2xl font-light text-slate-800">{totalUsers}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Utilisateurs Actifs</p>
                    <p className="text-2xl font-light text-slate-800">
                      {filteredUsers.filter(u => u.is_active).length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929] to-[#005929]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Abonnés</p>
                    <p className="text-2xl font-light text-slate-800">
                      {filteredUsers.filter(u => u.has_active_subscription).length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Admins</p>
                    <p className="text-2xl font-light text-slate-800">
                      {filteredUsers.filter(u => u.is_superuser || u.default_role === 'admin').length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Retour à la première page lors de la recherche
                      }}
                      className="pl-10 border-slate-200 focus:border-[#005929] focus:ring-[#005929]/20"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => handleFilterChange(e.target.value as 'all' | 'active' | 'inactive', setStatusFilter)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                  </select>
                  <select
                    value={subscriptionFilter}
                    onChange={(e) => handleFilterChange(e.target.value as 'all' | 'subscribed' | 'not_subscribed', setSubscriptionFilter)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les abonnements</option>
                    <option value="subscribed">Abonnés</option>
                    <option value="not_subscribed">Non abonnés</option>
                  </select>
                  <select
                    value={deletedFilter}
                    onChange={(e) => handleFilterChange(e.target.value as 'all' | 'deleted' | 'not_deleted', setDeletedFilter)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-[#005929] focus:ring-[#005929]/20 bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="not_deleted">Actifs</option>
                    <option value="deleted">Supprimés</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
                              <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-slate-800">
                    Liste des Utilisateurs
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>
                      {filteredUsers.length} utilisateur(s)
                      {(statusFilter !== 'all' || roleFilter !== 'all' || subscriptionFilter !== 'all' || deletedFilter !== 'all' || searchTerm) && 
                        totalUsers !== filteredUsers.length && (
                        <span className="text-slate-400"> sur {totalUsers}</span>
                      )}
                    </span>
                    {(statusFilter !== 'all' || roleFilter !== 'all' || subscriptionFilter !== 'all' || deletedFilter !== 'all' || searchTerm) && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Filtres actifs
                        </span>
                        <div className="text-xs text-slate-500">
                          {getActiveFiltersSummary().join(' • ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005929] mx-auto"></div>
                  <p className="mt-2 text-slate-600">Chargement des utilisateurs...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">
                    {searchTerm || statusFilter !== 'all' || roleFilter !== 'all' || subscriptionFilter !== 'all' || deletedFilter !== 'all'
                      ? 'Aucun utilisateur trouvé avec les filtres actuels' 
                      : 'Aucun utilisateur trouvé'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length}
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Abonnement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date d&apos;inscription
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                              className="rounded border-slate-300 text-[#005929] focus:ring-[#005929]/20"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {user.profil_image ? (
                                  <Image
                                    width={100}
                                    height={100}
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={user.profil_image}
                                    alt={user.full_name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#005929] to-[#FE5200] flex items-center justify-center text-white font-medium">
                                    {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">
                                  {user.full_name || 'Nom non renseigné'}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {user.email}
                                </div>
                                <div className="text-xs text-slate-400">
                                  @{user.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRoleBadge(user)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(user.is_active)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getSubscriptionBadge(user.has_active_subscription)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewUser(user.id)}
                                title="Voir le profil"
                                className="text-slate-600 hover:text-[#005929] hover:bg-[#005929]/10"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                             {user.deleted && <ToggleDeletedButton
                                deleted={user.deleted}
                                onToggle={() => handleToggleUserDeleted(user.id, user.deleted)}
                                isLoading={false}
                                className="text-xs"
                              />}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteUser(user.id, user.full_name || user.username)}
                                title="Supprimer définitivement l'utilisateur"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deleteUser.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={deleteModal.isOpen}
            onClose={cancelDelete}
            onConfirm={confirmDelete}
            message="Cette action est irréversible. L'utilisateur et toutes ses données seront définitivement supprimés."
            itemName={deleteModal.userName}
            isDeleting={deleteUser.isPending}
          />
        </div>
      </div>
    </AdminRoute>
  );
}