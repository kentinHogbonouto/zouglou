'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface ReportedContent {
  id: string;
  type: 'track' | 'album' | 'user' | 'comment';
  title: string;
  reason: string;
  reporter: string;
  reportedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
  severity: 'low' | 'medium' | 'high';
}

const mockReportedContent: ReportedContent[] = [
  {
    id: '1',
    type: 'track',
    title: 'Zouglou Dance - John Doe',
    reason: 'Contenu inapproprié',
    reporter: 'user123',
    reportedAt: '2024-01-15T10:30:00Z',
    status: 'pending',
    severity: 'high'
  },
  {
    id: '2',
    type: 'user',
    title: 'Spam User Account',
    reason: 'Compte spam',
    reporter: 'moderator1',
    reportedAt: '2024-01-14T15:45:00Z',
    status: 'reviewed',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'comment',
    title: 'Commentaire offensant',
    reason: 'Harcèlement',
    reporter: 'user456',
    reportedAt: '2024-01-13T09:20:00Z',
    status: 'resolved',
    severity: 'high'
  },
  {
    id: '4',
    type: 'album',
    title: 'Afro Vibes Collection',
    reason: 'Droits d\'auteur',
    reporter: 'rights_holder',
    reportedAt: '2024-01-12T14:15:00Z',
    status: 'pending',
    severity: 'medium'
  }
];

export function ContentModeration() {
  const [reports, setReports] = useState<ReportedContent[]>(mockReportedContent);

  const handleAction = (reportId: string, action: 'approve' | 'reject' | 'delete') => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'approve' ? 'resolved' : 'reviewed' }
        : report
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'track': return '🎵';
      case 'album': return '💿';
      case 'user': return '👤';
      case 'comment': return '💬';
      default: return '📄';
    }
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const highPriorityReports = reports.filter(r => r.severity === 'high' && r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Modération de contenu</h3>
          <p className="text-sm text-gray-600">Gérez les signalements et la modération</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Voir tous les signalements
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{pendingReports.length}</div>
            <div className="text-sm text-orange-800">En attente</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{highPriorityReports.length}</div>
            <div className="text-sm text-red-800">Priorité haute</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
            <div className="text-sm text-green-800">Résolus</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des signalements */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Signalements récents</h4>
        {reports.slice(0, 3).map((report) => (
          <Card key={report.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeIcon(report.type)}</span>
                    <h5 className="font-medium text-gray-900">{report.title}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{report.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Signalé par: {report.reporter}</span>
                    <span>Il y a {Math.floor((Date.now() - new Date(report.reportedAt).getTime()) / (1000 * 60 * 60))}h</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {report.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAction(report.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAction(report.id, 'reject')}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Rejeter
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleAction(report.id, 'delete')}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-3">Actions rapides</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              🔍 Vérifier automatiquement
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              📊 Générer rapport
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 