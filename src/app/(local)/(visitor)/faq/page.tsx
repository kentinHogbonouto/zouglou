import React from 'react';
import { FaqDisplay } from '@/components/features';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Questions fréquemment posées | Zouglouzik',
  description: 'Trouvez rapidement les réponses à vos questions sur Zouglouzik. Consultez notre FAQ pour tout savoir sur notre plateforme de musique.',
};

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <FaqDisplay 
          title="Questions fréquemment posées"
          description="Trouvez rapidement les réponses à vos questions sur Zouglouzik. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter."
        />
      </div>
    </div>
  );
}
