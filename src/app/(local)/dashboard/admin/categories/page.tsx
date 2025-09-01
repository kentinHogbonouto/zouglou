'use client';

import React, { useState } from 'react';
import { CategoryList } from '@/components/features/admin/CategoryList';
import { CategoryModal } from '@/components/features/admin/CategoryModal';
import { Category } from '@/shared/types/category';
import { Tag } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCategory(null);
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
                  <Tag className="h-6 w-6 text-[#005929]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Gestion des catégories</h1>
                  <p className="text-slate-600">Organisez votre contenu avec des catégories personnalisées</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
        <CategoryList
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={handleModalClose}
        categoryId={editingCategory?.id}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
