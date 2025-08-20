import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { features } from '@/shared/ressources/features.ressources';
import { Star, Music, Headphones, Globe } from 'lucide-react';
import Image from 'next/image'; 
export function StreamingFeatures() {
  return (
    <section className="w-full relative">
      <div className="absolute bottom-0 left-0 w-full h-full bg-slate-900 -z-10">
        <Image src="/images/dancing2.jpg" alt="Musique africaine" className="w-full h-full object-cover opacity-20" width={400} height={400} />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header de la section */}
        <div className="text-center mb-16">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005929]/20 to-[#FE5200]/20 backdrop-blur-sm rounded-full border border-white/20 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/20 to-[#FE5200]/20 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Section supplémentaire */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-[#005929]/20 to-[#005929]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Qualité Audio</h3>
            <p className="text-slate-300">Écoutez en haute qualité audio</p>
          </div>

          <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FE5200]/20 to-[#FE5200]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Écoute Offline</h3>
            <p className="text-slate-300">Téléchargez et écoutez hors ligne</p>
          </div>

          <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-[#005929]/20 to-[#FE5200]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Disponible Partout</h3>
            <p className="text-slate-300">Accédez à votre musique depuis n&apos;importe où</p>
          </div>
        </div>
      </div>
    </section>
  );
} 