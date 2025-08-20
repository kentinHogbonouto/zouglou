import React from 'react';
import { Card } from '@/components/ui/Card';
import { ApiNotification } from '@/shared/types/api';

interface NotificationListProps {
  notifications: ApiNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
  isMarkingAsRead: boolean;
}

export function NotificationList({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  unreadCount, 
  isMarkingAsRead 
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucune notification trouvée</p>
        <p className="text-gray-400">Vous n&apos;avez pas encore de notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header avec actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unreadCount} non lues
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            disabled={isMarkingAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {isMarkingAsRead ? 'Marquage...' : 'Tout marquer comme lu'}
          </button>
        )}
      </div>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`p-4 transition-colors ${
              !notification.is_read ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  {!notification.is_read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {!notification.is_read && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      disabled={isMarkingAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 