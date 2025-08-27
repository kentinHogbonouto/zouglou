'use client';

import React from 'react';
import { FaqForm } from './FaqForm';
import { useCreateFaq } from '@/hooks/useFaqQueries';
import { CreateFaqRequest, UpdateFaqRequest } from '@/shared/types';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/providers/ToastProvider';

interface CreateFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFaqModal: React.FC<CreateFaqModalProps> = ({
  isOpen,
  onClose,
}) => {
  const createFaqMutation = useCreateFaq();
  const { showToast } = useToast();

  const handleCreateFaq = async (data: CreateFaqRequest | UpdateFaqRequest) => {
    try {
      await createFaqMutation.mutateAsync(data as CreateFaqRequest);
        showToast({
          title: 'Succès',
          message: 'FAQ créée avec succès',
          type: 'success',
        });
        onClose();
    } catch {
      showToast({
        title: 'Erreur',
        message: 'Erreur lors de la création de la FAQ',
        type: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Créer une nouvelle FAQ
          </h2>
        </div>
        
        <FaqForm
          mode="create"
          onSubmit={handleCreateFaq}
          isLoading={createFaqMutation.isPending}
        />
      </div>
    </Modal>
  );
};
