'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, List, BarChart3 } from 'lucide-react';

export const InformationNavigation: React.FC = () => {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/dashboard/admin/information',
      label: 'Liste des informations',
      icon: List,
      description: 'Gérer toutes les informations légales',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Informations légales</h2>
          <p className="text-gray-600">Administrez les documents légaux de votre plateforme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={`
                p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }
              `}>
                <div className="flex items-start gap-3">
                  <div className={`
                    p-2 rounded-lg
                    ${isActive ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Informations rapides */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Vue d&apos;ensemble</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Gérez efficacement vos informations légales pour assurer la conformité de votre plateforme. 
            Incluez la politique de confidentialité, les conditions d&apos;utilisation et les informations À propos.
          </p>
        </div>
      </div>
    </div>
  );
};
