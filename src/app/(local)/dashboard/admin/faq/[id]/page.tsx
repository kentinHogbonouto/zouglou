'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaqForm } from '@/components/features/admin';
import { useFaqById, useUpdateFaq } from '@/hooks/useFaqQueries';
import { UpdateFaqRequest } from '@/shared/types';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/components/providers/ToastProvider';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminFaqEditPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const faqId = params.id as string;

  const { data: faq, isLoading, error, refetch } = useFaqById(faqId);
  const updateFaqMutation = useUpdateFaq();

  const handleUpdateFaq = async (data: UpdateFaqRequest) => {
    try {
      await updateFaqMutation.mutateAsync({ id: faqId, data });
      showToast({
        title: 'Succès',
        message: 'FAQ mise à jour avec succès',
        type: 'success',
      });
      router.push('/dashboard/admin/faq');
    } catch {
      showToast({
        title: 'Erreur',
        message: 'Erreur lors de la mise à jour de la FAQ',
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return <LoadingState message="Chargement de la FAQ..." />;
  }

  if (error || !faq) {
    return (
      <ErrorState 
        message="Erreur lors du chargement de la FAQ"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                  <HelpCircle className="h-6 w-6 text-[#005929]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Modifier la FAQ</h1>
                  <p className="text-slate-600">Modifiez les détails de cette question fréquemment posée</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/admin/faq">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="p-8">
              <FaqForm
                mode="edit"
                initialData={faq}
                onSubmit={handleUpdateFaq}
                isLoading={updateFaqMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}