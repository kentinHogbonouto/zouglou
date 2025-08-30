'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { InformationForm } from '@/components/features/admin';
import { useCreateInformation } from '@/hooks/useInformationQueries';
import { CreateInformationRequest, UpdateInformationRequest } from '@/shared/types';
import { useToast } from '@/components/providers/ToastProvider';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminInformationCreatePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const createInformationMutation = useCreateInformation();

  const handleCreateInformation = async (data: CreateInformationRequest | UpdateInformationRequest) => {
    try {
      await createInformationMutation.mutateAsync(data as CreateInformationRequest);
        showToast({
          title: 'Succès',
          message: 'Informations créées avec succès',
          type: 'success',
        });
        router.push('/dashboard/admin/information');
    } catch {
      showToast({
        title: 'Erreur',
        message: 'Erreur lors de la création des informations',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                  <FileText className="h-6 w-6 text-[#005929]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Créer des informations légales</h1>
                  <p className="text-slate-600">Ajoutez de nouvelles informations légales à votre plateforme</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/admin/information">
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="p-8">
              <InformationForm
                mode="create"
                onSubmit={handleCreateInformation}
                isLoading={createInformationMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
