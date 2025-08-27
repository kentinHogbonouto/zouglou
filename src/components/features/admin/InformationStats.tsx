'use client';

import React from 'react';
import { useInformations } from '@/hooks/useInformationQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, TrendingUp, Clock, Shield, BookOpen, Info } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const InformationStats: React.FC = () => {
  const { data: informations, isLoading } = useInformations();

  if (isLoading || !informations) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chargement...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalInformations = informations.length;
  const recentInformations = informations.filter(info => {
    const infoDate = new Date(info.updatedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return infoDate > thirtyDaysAgo;
  }).length;

  const latestInformation = informations.length > 0 ? informations[0] : null;

  const stats = [
    {
      title: 'Total Informations',
      value: totalInformations.toString(),
      description: 'Nombre total de documents',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Mises à jour récentes',
      value: recentInformations.toString(),
      description: 'Modifiées ce mois',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Dernière mise à jour',
      value: latestInformation 
        ? format(new Date(latestInformation.updatedAt), 'dd/MM/yyyy', { locale: fr })
        : 'Aucune',
      description: 'Date de la dernière modification',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vue d'ensemble des sections */}
      {latestInformation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Vue d&apos;ensemble des sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Politique de confidentialité</p>
                  <p className="text-sm text-blue-600">
                    {latestInformation.privacy_policy.length} caractères
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Conditions d&apos;utilisation</p>
                  <p className="text-sm text-green-600">
                    {latestInformation.terms_of_use.length} caractères
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Info className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">À propos</p>
                  <p className="text-sm text-purple-600">
                    {latestInformation.about_us.length} caractères
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
