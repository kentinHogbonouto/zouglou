import React from 'react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            La musique africaine,{' '}
            <span className="text-yellow-300">votre passion</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
            Découvrez la première plateforme de streaming dédiée à la musique africaine. 
            Des millions de titres, des artistes talentueux, une expérience unique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Commencer l'écoute
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Découvrir les artistes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 