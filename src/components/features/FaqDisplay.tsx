'use client';

import React, { useState } from 'react';
import { useFaqs } from '@/hooks/useFaqQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqDisplayProps {
  title?: string;
  description?: string;
  maxItems?: number;
}

export const FaqDisplay: React.FC<FaqDisplayProps> = ({
  title = "Questions fréquemment posées",
  description = "Trouvez rapidement les réponses à vos questions",
  maxItems,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const { data: faqs, isLoading, error, refetch } = useFaqs();

  const toggleItem = (faqId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(faqId)) {
      newOpenItems.delete(faqId);
    } else {
      newOpenItems.add(faqId);
    }
    setOpenItems(newOpenItems);
  };

  const displayFaqs = maxItems ? faqs?.slice(0, maxItems) : faqs;

  if (isLoading) {
    return <LoadingState message="Chargement des FAQ..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Erreur lors du chargement des FAQ"
        onRetry={refetch}
      />
    );
  }

  if (!displayFaqs || displayFaqs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune FAQ disponible
            </h3>
            <p className="text-gray-500">
              Les questions fréquemment posées seront bientôt disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Liste des FAQ */}
      <div className="space-y-4">
        {displayFaqs.map((faq) => (
          <Card key={faq.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleItem(faq.id)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-gray-900 pr-4">
                  {faq.question}
                </CardTitle>
                <div className="flex-shrink-0">
                  {openItems.has(faq.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            {openItems.has(faq.id) && (
              <CardContent className="pt-0 pb-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {faq.content}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
