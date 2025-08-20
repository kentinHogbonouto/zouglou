'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LucideIcon } from 'lucide-react';

interface ModernEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function ModernEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: ModernEmptyStateProps) {
  return (
    <Card className="relative overflow-hidden p-12 border-0 shadow-sm bg-white/60 backdrop-blur-sm text-center">
      <div className="absolute inset-0 bg-gradient-to-r from-[#005929]/5 via-transparent to-[#FE5200]/5"></div>
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-xl font-medium text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 mb-6">{description}</p>
        <Button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}
