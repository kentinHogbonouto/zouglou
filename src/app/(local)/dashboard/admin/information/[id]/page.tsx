'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InformationForm } from '@/components/features/admin';
import { useInformationById, useUpdateInformation } from '@/hooks/useInformationQueries';
import { UpdateInformationRequest } from '@/shared/types';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/components/providers/ToastProvider';

export default function AdminInformationEditPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const informationId = params.id as string;

  const { data: information, isLoading, error, refetch } = useInformationById(informationId);
  const updateInformationMutation = useUpdateInformation();

  const handleUpdateInformation = async (data: UpdateInformationRequest) => {
    try {
      await updateInformationMutation.mutateAsync({ id: informationId, data });
      showToast({
        title: 'Succès',
        message: 'Informations mises à jour avec succès',
        type: 'success',
      });
      router.push('/dashboard/admin/information');
    } catch {
      showToast({
        title: 'Erreur',
        message: 'Erreur lors de la mise à jour des informations',
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return <LoadingState message="Chargement des informations..." />;
  }

  if (error || !information) {
    return (
      <ErrorState 
        message="Erreur lors du chargement des informations"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Modifier les informations</h1>
        <p className="text-gray-600 mt-1">
          Modifiez la politique de confidentialité, les conditions d&apos;utilisation et les informations À propos
        </p>
      </div>

      {/* Formulaire de modification */}
      <InformationForm
        mode="edit"
        initialData={information}
        onSubmit={handleUpdateInformation}
        isLoading={updateInformationMutation.isPending}
      />
    </div>
  );
}