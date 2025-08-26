'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ApiUser } from '@/hooks/useAdminQueries';

interface UserManagementProps {
  recentUsers?: ApiUser[];
  onViewUser?: (userId: string) => void;
}

export function UserManagement({ recentUsers = [], onViewUser }: UserManagementProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === recentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(recentUsers.map(user => user.id));
    }
  };

  const getRoleBadge = (user: ApiUser) => {
    if (user.is_superuser) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Super Admin</span>;
    }
    if (user.default_role === 'admin') {
      return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Admin</span>;
    }
    if (user.artist_profile) {
      return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Artiste</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Utilisateur</span>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Actif</span>
    ) : (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactif</span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Utilisateurs récents</h3>
          <p className="text-sm text-slate-600">Gérez les utilisateurs de la plateforme</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          + Nouvel utilisateur
        </Button>
      </div>

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
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Activer
                </Button>
                <Button
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Suspendre
                </Button>
                <Button
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
      <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium text-slate-800">
              Utilisateurs ({recentUsers.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedUsers.length === recentUsers.length && recentUsers.length > 0}
                onChange={handleSelectAll}
                className="rounded border-slate-300 text-green-600 focus:ring-green-400"
              />
              <span className="text-sm text-slate-600">Sélectionner tout</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recentUsers.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Aucun utilisateur récent
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-slate-300 text-green-600 focus:ring-green-400"
                    />
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-600 font-medium">
                          {user.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{user.full_name}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <p className="text-xs text-slate-500">@{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getRoleBadge(user)}
                    {getStatusBadge(user.is_active)}
                    <button
                      onClick={() => onViewUser?.(user.id)}
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Voir →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 