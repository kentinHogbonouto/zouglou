import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArtistDashboardStats } from '@/components/dashboard/artist/ArtistDashboardStats';
import { RecentTracks } from '@/components/dashboard/artist/RecentTracks';
import { RevenueChart } from '@/components/dashboard/artist/RevenueChart';
import { AnalyticsOverview } from '@/components/dashboard/artist/AnalyticsOverview';
import { ArtistRoute } from '@/components/auth/ProtectedRoute';

export default function ArtistDashboard() {
  return (
    <ArtistRoute>
      <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Artiste</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Uploader un titre
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Nouveau live
          </button>
        </div>
      </div>

      <ArtistDashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus des 30 derniers jours</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsOverview />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Titres récents</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTracks />
        </CardContent>
      </Card>
      </div>
    </ArtistRoute>
  );
} 