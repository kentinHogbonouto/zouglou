import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNavigation() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/dashboard/admin',
      label: 'Dashboard',
      icon: '📊',
      description: 'Vue d\'ensemble'
    },
    {
      href: '/dashboard/admin/tracks',
      label: 'Tracks',
      icon: '🎵',
      description: 'Gérer les tracks'
    },
    {
      href: '/dashboard/admin/albums',
      label: 'Albums',
      icon: '💿',
      description: 'Gérer les albums'
    },
    {
      href: '/dashboard/admin/live',
      label: 'Live Streams',
      icon: '📺',
      description: 'Gérer les live streams'
    }
  ];

  return (
    <nav className="bg-white rounded-2xl shadow-lg p-4 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-2xl mr-3">🧭</span>
        Navigation Admin
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{item.icon}</span>
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-sm ${isActive ? 'text-green-100' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 