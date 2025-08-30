'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface ModernPageLayoutProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  actionButton?: ReactNode;
  stats?: Array<{
    label: string;
    value: string | number;
    icon: LucideIcon;
  }>;
}

export function ModernPageLayout({
  title,
  description,
  icon: Icon,
  children,
  actionButton,
  stats
}: ModernPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
                  <Icon className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-slate-500 text-base">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {actionButton && (
              <div className="flex-shrink-0">
                {actionButton}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 lg:px-8 py-8">
        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              const colors = [
                { color: 'from-[#005929] to-[#005929]/90', bgColor: 'bg-gradient-to-br from-[#005929]/5 to-[#005929]/10' },
                { color: 'from-[#FE5200] to-[#FE5200]/90', bgColor: 'bg-gradient-to-br from-[#FE5200]/5 to-[#FE5200]/10' },
                { color: 'from-[#005929] to-[#005929]/90', bgColor: 'bg-gradient-to-br from-[#005929]/5 to-[#005929]/10' },
                { color: 'from-[#FE5200] to-[#FE5200]/90', bgColor: 'bg-gradient-to-br from-[#FE5200]/5 to-[#FE5200]/10' }
              ];
              const { color, bgColor } = colors[index % colors.length];
              
              return (
                <Card 
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-500 border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:scale-105 ${bgColor}`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <StatIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                        <p className="text-2xl font-light text-slate-800">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
