import React from 'react';
import { InformationDisplay } from '@/components/features';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Zouglouzik',
  description: 'Consultez notre politique de confidentialité pour comprendre comment nous protégeons vos données personnelles.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <InformationDisplay 
          title="Politique de confidentialité"
          description="Découvrez comment nous protégeons et utilisons vos données personnelles"
          showPrivacyPolicy={true}
          showTermsOfUse={false}
          showAboutUs={false}
        />
      </div>
    </div>
  );
}
