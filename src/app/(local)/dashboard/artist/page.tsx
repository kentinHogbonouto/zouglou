import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArtistDashboardStats } from '@/components/dashboard/artist/ArtistDashboardStats';
import { RecentTracks } from '@/components/dashboard/artist/RecentTracks';
import { RevenueChart } from '@/components/dashboard/artist/RevenueChart';
import { AnalyticsOverview } from '@/components/dashboard/artist/AnalyticsOverview';
import { QuickActions } from '@/components/dashboard/artist/QuickActions';
import { WelcomeBanner } from '@/components/dashboard/artist/WelcomeBanner';
import { ArtistRoute } from '@/components/auth/ProtectedRoute';
import { Radio, Upload } from 'lucide-react';

export default function ArtistDashboard() {
  return (
    <ArtistRoute>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header Section */}
        <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-light text-slate-800">
                  Dashboard Artiste
                </h1>
                <p className="text-slate-500 text-base">
                  Gérez votre musique et suivez vos performances
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#005929] to-[#005929]/90 text-white font-medium rounded-lg hover:from-[#005929]/90 hover:to-[#005929] transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Upload className="w-4 h-4" />
                  Uploader un titre
                </button>
                <button className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FE5200] to-[#FE5200]/90 text-white font-medium rounded-lg hover:from-[#FE5200]/90 hover:to-[#FE5200] transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Radio className="w-4 h-4" />
                  Nouveau live
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Welcome Banner */}
          <div className="mb-8">
            <WelcomeBanner artistName="John Doe" lastLogin="il y a 2 heures" />
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <ArtistDashboardStats />
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Revenus des 30 derniers jours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RevenueChart />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-medium text-slate-800">
                  Vue d&apos;ensemble
                </CardTitle>
              </CardHeader> 
              <CardContent className="p-6">
                <AnalyticsOverview />
              </CardContent>
            </Card>
          </div>

          {/* Recent Tracks Section */}
          <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-medium text-slate-800">
                Titres récents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RecentTracks />
            </CardContent>
          </Card>
        </div>
      </div>
    </ArtistRoute>
  );
} 