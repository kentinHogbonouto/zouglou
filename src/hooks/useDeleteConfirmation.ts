'use client';

import { useState } from 'react';

interface DeleteConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  itemType: 'podcast' | 'episode' | 'track' | 'album' | 'live' | 'account';
  onConfirm: (() => void) | null;
}

export function useDeleteConfirmation() {
  const [state, setState] = useState<DeleteConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    itemType: 'track',
    onConfirm: null,
  });

  const showDeleteConfirmation = (
    itemName: string,
    itemType: 'podcast' | 'episode' | 'track' | 'album' | 'live' | 'account',
    onConfirm: () => void,
    title?: string,
    message?: string
  ) => {
    const defaultTitles = {
      podcast: 'Supprimer le podcast',
      episode: 'Supprimer l\'épisode',
      track: 'Supprimer le track',
      album: 'Supprimer l\'album',
      live: 'Supprimer le live stream',
      account: 'Supprimer le compte',
    };

    const defaultMessages = {
      podcast: 'Êtes-vous sûr de vouloir supprimer ce podcast ? Cette action est irréversible.',
      episode: 'Êtes-vous sûr de vouloir supprimer cet épisode ? Cette action est irréversible.',
      track: 'Êtes-vous sûr de vouloir supprimer ce track ? Cette action est irréversible.',
      album: 'Êtes-vous sûr de vouloir supprimer cet album ? Cette action est irréversible.',
      live: 'Êtes-vous sûr de vouloir supprimer ce live stream ? Cette action est irréversible.',
      account: 'Êtes-vous ABSOLUMENT sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera définitivement toutes vos données.',
    };

    setState({
      isOpen: true,
      title: title || defaultTitles[itemType],
      message: message || defaultMessages[itemType],
      itemName,
      itemType,
      onConfirm,
    });
  };

  const hideDeleteConfirmation = () => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
    }));
  };

  const handleConfirm = () => {
    if (state.onConfirm) {
      state.onConfirm();
    }
    hideDeleteConfirmation();
  };

  return {
    isOpen: state.isOpen,
    title: state.title,
    message: state.message,
    itemName: state.itemName,
    itemType: state.itemType,
    showDeleteConfirmation,
    hideDeleteConfirmation,
    handleConfirm,
  };
}
