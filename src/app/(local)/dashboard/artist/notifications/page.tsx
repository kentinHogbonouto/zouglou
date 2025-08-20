'use client';

import { useAuth } from '@/hooks/useAuthQueries';
import {
  useNotifications,
  useUnreadNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead
} from '@/hooks/useNotificationQueries';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ArtistRoute } from '@/components/auth/ProtectedRoute';

export default function ArtistNotificationsPage() {
  const { user } = useAuth();
  const { data: notificationsData, isLoading, error } = useNotifications({ user: user?.id });
  const { data: unreadData } = useUnreadNotifications();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Erreur lors du chargement des notifications</div>;

  const notifications = notificationsData?.results || [];
  const unreadCount = unreadData?.count || 0;

  return (
    <ArtistRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {markAllAsReadMutation.isPending ? 'Marquage...' : 'Tout marquer comme lu'}
            </Button>
          )}
        </div>

        {/* Liste des notifications */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${!notification.is_read ? 'ring-2 ring-blue-200' : ''
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-lg mt-1">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <span>
                        {new Date(notification.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!notification.is_read && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Non lu
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!notification.is_read && (
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={markAsReadMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Marquer comme lu
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">Aucune notification</p>
            <p className="text-gray-400">Vous n&apos;avez pas encore reçu de notifications</p>
          </div>
        )}

        {/* Pagination si nécessaire */}
        {notificationsData && notificationsData.count > notificationsData.results.length && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {notificationsData.previous && (
                <Button
                  onClick={() => {
                    // Implémenter la pagination
                  }}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Précédent
                </Button>
              )}
              <span className="px-4 py-2 text-sm text-gray-600">
                Page 1 sur {Math.ceil(notificationsData.count / 10)}
              </span>
              {notificationsData.next && (
                <Button
                  onClick={() => {
                    // Implémenter la pagination
                  }}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Suivant
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </ArtistRoute>
  );
} 