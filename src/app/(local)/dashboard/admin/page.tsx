import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AdminDashboardStats } from '@/components/dashboard/admin/AdminDashboardStats';
import { UserManagement } from '@/components/dashboard/admin/UserManagement';
import { ContentModeration } from '@/components/dashboard/admin/ContentModeration';
import { SystemAnalytics } from '@/components/dashboard/admin/SystemAnalytics';
import { AdminRoute } from '@/components/auth/ProtectedRoute';

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard Administrateur</h1>
                <p className="text-green-100">Gérez votre plateforme de streaming africain</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 font-medium">
                  📊 Rapports
                </button>
                <button className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium">
                  ⚡ Actions rapides
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">📈</span>
              Vue d&apos;ensemble
            </h2>
            <AdminDashboardStats />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center text-xl">
                  <span className="mr-3">👥</span>
                  Gestion des utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <UserManagement />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <span className="mr-3">🛡️</span>
                  Modération de contenu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ContentModeration />
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="flex items-center text-xl">
                <span className="mr-3">📊</span>
                Analytics système
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <SystemAnalytics />
            </CardContent>
          </Card>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              Actions rapides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <a href="/dashboard/admin/tracks" className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200">
                <span className="text-2xl mr-3">🎵</span>
                Gérer les Tracks
              </a>
              <a href="/dashboard/admin/albums" className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                <span className="text-2xl mr-3">💿</span>
                Gérer les Albums
              </a>
              <a href="/dashboard/admin/live" className="flex items-center justify-center p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200">
                <span className="text-2xl mr-3">📺</span>
                Gérer les Live Streams
              </a>
              <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                <span className="text-2xl mr-3">📊</span>
                Générer rapport
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 