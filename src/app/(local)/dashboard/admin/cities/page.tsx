'use client';

import React, { useState } from 'react';
import { CityList } from '@/components/features/admin/CityList';
import { CityModal } from '@/components/features/admin/CityModal';
import { AdminCity } from '@/shared/types/city';
import { MapPin } from 'lucide-react';

export default function AdminCitiesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState<AdminCity | null>(null);

  const handleCreate = () => {
    setEditingCity(null);
    setShowModal(true);
  };

  const handleEdit = (city: AdminCity) => {
    setEditingCity(city);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingCity(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCity(null);
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
                  <MapPin className="h-6 w-6 text-[#005929]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Gestion des villes</h1>
                  <p className="text-slate-600">Organisez vos villes avec leurs informations géographiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
        <CityList
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
      </div>

      {/* City Modal */}
      <CityModal
        isOpen={showModal}
        onClose={handleModalClose}
        cityId={editingCity?.id}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
