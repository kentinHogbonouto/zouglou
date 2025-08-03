'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function AdminDashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className={`bg-gradient-to-r ${stat.color} text-white rounded-t-xl`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">ce mois</span>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                style={{ width: `${Math.min(100, Math.abs(parseFloat(stat.change)) * 10)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 