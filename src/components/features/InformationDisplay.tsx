'use client';

import React, { useState } from 'react';
import { useInformations } from '@/hooks/useInformationQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Shield, BookOpen, Info, FileText } from 'lucide-react';

interface InformationDisplayProps {
  title?: string;
  description?: string;
  showPrivacyPolicy?: boolean;
  showTermsOfUse?: boolean;
  showAboutUs?: boolean;
}

export const InformationDisplay: React.FC<InformationDisplayProps> = ({
  title = "Informations légales",
  description = "Consultez nos informations légales et notre politique",
  showPrivacyPolicy = true,
  showTermsOfUse = true,
  showAboutUs = true,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'about'>('privacy');
  const { data: informations, isLoading, error, refetch } = useInformations();

  if (isLoading) {
    return <LoadingState message="Chargement des informations..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Erreur lors du chargement des informations"
        onRetry={refetch}
      />
    );
  }

  if (!informations || informations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune information disponible
            </h3>
            <p className="text-gray-500">
              Les informations légales seront bientôt disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prendre la première information (normalement il n'y en a qu'une)
  const information = informations[0];

  const tabs = [
    {
      id: 'privacy' as const,
      label: 'Politique de confidentialité',
      icon: Shield,
      content: information.privacy_policy,
      show: showPrivacyPolicy,
    },
    {
      id: 'terms' as const,
      label: 'Conditions d\'utilisation',
      icon: BookOpen,
      content: information.terms_of_use,
      show: showTermsOfUse,
    },
    {
      id: 'about' as const,
      label: 'À propos',
      icon: Info,
      content: information.about_us,
      show: showAboutUs,
    },
  ].filter(tab => tab.show);

  // Si aucun onglet n'est visible, afficher le premier par défaut
  if (tabs.length === 0) {
    return null;
  }

  // Si l'onglet actif n'est pas visible, passer au premier visible
  if (!tabs.find(tab => tab.id === activeTab)) {
    setActiveTab(tabs[0].id);
  }

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu de l'onglet actif */}
      {activeTabData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(activeTabData.icon, { className: "h-5 w-5" })}
              {activeTabData.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: activeTabData.content }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
