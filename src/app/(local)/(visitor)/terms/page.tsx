import React from 'react';
import { InformationDisplay } from '@/components/features';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation | Zouglouzik',
  description: 'Consultez nos conditions d\'utilisation pour comprendre les règles d\'usage de notre plateforme.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <InformationDisplay 
          title="Conditions d'utilisation"
          description="Consultez les règles et conditions d'utilisation de notre plateforme"
          showPrivacyPolicy={false}
          showTermsOfUse={true}
          showAboutUs={false}
        />
      </div>
    </div>
  );
}
