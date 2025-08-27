'use client';

import React from 'react';
import { InformationList } from '@/components/features/admin';
import { Button } from '@/components/ui/Button';
import { Plus, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminInformationPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                  <FileText className="h-6 w-6 text-[#005929]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Informations légales</h1>
                  <p className="text-slate-600">Gérez la politique de confidentialité, les conditions d&apos;utilisation et les informations À propos</p>
                </div>
              </div>
            </div>
            <Link href="/dashboard/admin/information/create">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                <Plus className="h-4 w-4" />
                Nouvelles informations
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <InformationList />
      </div>
    </div>
  );
}