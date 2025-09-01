'use client';

import React, { useState } from 'react';
import { GenreList } from '@/components/features/admin/GenreList';
import { GenreModal } from '@/components/features/admin/GenreModal';
import { Genre } from '@/shared/types/genre';
import { Music } from 'lucide-react';

export default function AdminGenresPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  const handleCreate = () => {
    setEditingGenre(null);
    setShowModal(true);
  };

  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingGenre(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingGenre(null);
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
                  <Music className="h-6 w-6 text-[#005929]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Gestion des genres</h1>
                  <p className="text-slate-600">Organisez votre musique avec des genres personnalisés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
        <GenreList
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
      </div>

      {/* Genre Modal */}
      <GenreModal
        isOpen={showModal}
        onClose={handleModalClose}
        genreId={editingGenre?.id}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
