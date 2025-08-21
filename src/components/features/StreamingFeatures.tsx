import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Star, Music, Globe, Users, List, Video } from 'lucide-react';
import Image from 'next/image';
export function StreamingFeatures() {

  const features = [
    {
      id: 1,
      title: 'Écoutez en streaming',
      description: 'Accédez à des millions de titres africains en streaming haute qualité.',
      icon: <Music className="w-4 h-4 text-white" />,
    },
    {
      id: 2,
      title: 'Découvrez de nouveaux artistes',
      description: 'Explorez la scène musicale africaine et découvrez des talents émergents.',
      icon: <Users className="w-4 h-4 text-white" />,
    },
    {
      id: 3,
      title: 'Créez vos playlists',
      description: 'Organisez votre musique avec des playlists personnalisées.',
      icon: <List className="w-4 h-4 text-white" />,
    },
    {
      id: 4,
      title: 'Streams en direct',
      description: 'Regardez vos artistes préférés en direct et en exclusivité.',
      icon: <Video className="w-4 h-4 text-white" />,
    },
    {
      id: 5,
      title: 'Qualité Audio',
      description: 'Écoutez en haute qualité audio',
      icon: <Music className="w-4 h-4 text-white" />,
    },
    {
      id: 6,
      title: 'Disponible Partout',
      description: 'Accédez à votre musique depuis n&apos;importe où',
      icon: <Globe className="w-4 h-4 text-white" />,
    }
  ];

  return (
    <section className="w-full relative">
      <div className="absolute bottom-0 left-0 w-full h-full bg-slate-900 -z-10">
        <Image src="/images/dancing2.jpg" alt="Musique africaine" className="w-full h-full object-cover opacity-5" width={400} height={400} />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10 py-10">
        {/* Header de la section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Star className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Fonctionnalités</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-light text-white mb-6">
            Pourquoi choisir{' '}
            <span className="text-white font-medium">
              Zouglou ?
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            La première plateforme de streaming dédiée à la musique africaine
          </p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-white/5 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">{feature.icon}</div>
                </div>
                <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
} 