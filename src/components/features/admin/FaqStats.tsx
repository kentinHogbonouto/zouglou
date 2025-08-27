'use client';

import React from 'react';
import { useFaqs } from '@/hooks/useFaqQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { HelpCircle, TrendingUp, Hash } from 'lucide-react';

export const FaqStats: React.FC = () => {
  const { data: faqs, isLoading } = useFaqs();

  if (isLoading || !faqs) {
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

  const totalFaqs = faqs.length;
  const recentFaqs = faqs.filter(faq => {
    const faqDate = new Date(faq.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return faqDate > thirtyDaysAgo;
  }).length;

  const averagePosition = faqs.length > 0 
    ? Math.round(faqs.reduce((sum, faq) => sum + faq.position, 0) / faqs.length)
    : 0;

  const stats = [
    {
      title: 'Total FAQ',
      value: totalFaqs.toString(),
      description: 'Nombre total de questions',
      icon: HelpCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Nouvelles FAQ',
      value: recentFaqs.toString(),
      description: 'Ajoutées ce mois',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Position moyenne',
      value: averagePosition.toString(),
      description: 'Ordre d\'affichage moyen',
      icon: Hash,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
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
  );
};
