'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Modal, ModalButton, ModalActions, ModalHeader, ModalContent } from '@/components/ui/Modal';
import { CreateLiveStreamData } from '@/shared/types/api';
import { Radio, Link, Calendar, Save, X } from 'lucide-react';

interface CreateLiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLiveStreamData) => Promise<void>;
  isSubmitting: boolean;
  currentArtist: string;
}

export function CreateLiveStreamModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting, 
  currentArtist 
}: CreateLiveStreamModalProps) {
  const [formData, setFormData] = useState<Partial<CreateLiveStreamData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.stream_url) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await onSubmit({
        ...formData as CreateLiveStreamData,
        artist: currentArtist,
      });
      
      // Reset form
      setFormData({});
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du live stream:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
            <Radio className="w-6 h-6 text-[#FE5200]" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-slate-800">Nouveau Live Stream</h2>
            <p className="text-slate-500">Démarrez votre diffusion en direct</p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Titre du live *</label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border-slate-200 focus:border-[#FE5200] focus:ring-[#FE5200]/20"
                placeholder="Titre de votre live stream"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Link className="w-4 h-4" />
                URL du Stream *
              </label>
              <Input
                value={formData.stream_url || ''}
                onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                className="w-full border-slate-200 focus:border-[#FE5200] focus:ring-[#FE5200]/20"
                placeholder="rtmp://..."
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:border-[#FE5200] focus:ring-[#FE5200]/20 resize-none"
              placeholder="Décrivez votre live stream, ce que vous allez jouer..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date de début
              </label>
              <Input
                type="datetime-local"
                value={formData.start_time || ''}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full border-slate-200 focus:border-[#FE5200] focus:ring-[#FE5200]/20"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Durée estimée (minutes)</label>
              <Input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full border-slate-200 focus:border-[#FE5200] focus:ring-[#FE5200]/20"
                placeholder="60"
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#FE5200]/5 to-[#FE5200]/10 rounded-lg border border-[#FE5200]/20">
            <input
              type="checkbox"
              checked={formData.is_published || false}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded border-slate-300 text-[#FE5200] focus:ring-[#FE5200]/20"
            />
            <span className="text-sm font-medium text-slate-700">Publier immédiatement</span>
          </div>

          <ModalActions>
            <ModalButton
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
              Annuler
            </ModalButton>
            <ModalButton
              type="submit"
              variant="success"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Création...' : 'Créer le Live Stream'}
            </ModalButton>
          </ModalActions>
        </form>
      </ModalContent>
    </Modal>
  );
} 