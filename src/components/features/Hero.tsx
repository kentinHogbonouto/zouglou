import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
export function Hero() {
  return (
    <section className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center text-center">
          <div className="md:col-span-2 flex flex-col items-center justify-center py-24">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              La musique africaine,{' '}
              <span className="text-orange-400">votre passion</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Découvrez la première plateforme de streaming dédiée à la musique africaine.
              Des millions de titres, des artistes talentueux, une expérience unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="border-orange-400 bg-white text-orange-400 hover:bg-orange-400 hover:text-white cursor-pointer">
                Télécharger l&apos;application
              </Button>
              <Button variant="outline" size="lg" className="border-orange-400 bg-orange-400 text-white hover:text-orange-400 hover:bg-white cursor-pointer">
                <Link href="/artists">
                  Découvrir les artistes
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image src="/images/humainhome.png" alt="Musique africaine" className="w-full h-full object-cover" width={400} height={400} />
          </div>
        </div>
      </div>
    </section>
  );
} 