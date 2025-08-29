'use client';

import React from 'react';
import { FaqList } from '@/components/features/admin';
import { Button } from '@/components/ui/Button';
import { Plus, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminFaqPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                  <HelpCircle className="h-6 w-6 text-[#005929]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Gestion des FAQ</h1>
                  <p className="text-slate-600">Gérez les questions fréquemment posées de votre plateforme</p>
                </div>
              </div>
            </div>
            <Link href="/dashboard/admin/faq/create">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                <Plus className="h-4 w-4" />
                Nouvelle FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
        <FaqList />
      </div>
    </div>
  );
}