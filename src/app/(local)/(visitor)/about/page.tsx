import React from 'react';
import { InformationDisplay } from '@/components/features';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos | Zouglouzik',
  description: 'Découvrez Zouglouzik, votre plateforme de streaming de musique zouglou de Côte d\'Ivoire.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <InformationDisplay 
          title="À propos de Zouglouzik"
          description="Découvrez notre mission et notre passion pour la musique zouglou"
          showPrivacyPolicy={false}
          showTermsOfUse={false}
          showAboutUs={true}
        />
      </div>
    </div>
  );
}
