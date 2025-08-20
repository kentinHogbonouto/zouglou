"use client";

import { Modal, ModalHeader, ModalContent, ModalActions, ModalButton } from './Modal';
import { Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  itemName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  itemName,
  isDeleting = false
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'>
      <ModalHeader>
        <div className="flex items-center gap-3 p-1">
          <div>
            <p className="text-slate-500">Confirmer la suppression</p>
          </div>
        </div>
      </ModalHeader>
      <ModalContent>
          <div className="flex items-start gap-4">
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Supprimer &quot;{itemName}&quot; ?
              </h3>
              <p className="text-slate-600 mb-4">{message}</p>
              
              
            </div>
          </div>
      </ModalContent>
      <ModalActions className='p-4'>
        <ModalButton
          onClick={onClose}
          variant="secondary"
          disabled={isDeleting}
        >
          <X className="w-4 h-4" />
          Annuler
        </ModalButton>
        <ModalButton
          onClick={onConfirm}
          variant="danger"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Suppression...' : 'Supprimer'}
        </ModalButton>
      </ModalActions>
    </Modal>
  );
}
