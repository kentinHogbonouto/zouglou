import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
export function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50/50 h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center text-center h-full">
          <div className="md:col-span-2 flex flex-col items-center justify-center py-24">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              La musique africaine,{' '}
              <span className="text-[#FE5200]">votre passion</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Découvrez la première plateforme de streaming dédiée à la musique africaine.
              Des millions de titres, des artistes talentueux, une expérience unique.
            </p>
            <div className="flex lg:hidden items-center justify-center w-full">
            <Image src="/images/humainhome.png" alt="Musique africaine" className="w-full h-[40vh] object-top object-cover" width={400} height={400} />
          </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="border-[#FE5200] bg-white text-[#FE5200] hover:bg-[#FE5200] hover:text-white cursor-pointer">
                Télécharger l&apos;application
              </Button>
              <Button variant="outline" size="lg" className="border-[#FE5200] bg-[#FE5200] text-white hover:text-[#FE5200] hover:bg-white cursor-pointer">
                <Link href="#">
                  Découvrir les artistes
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center w-full">
            <Image src="/images/humainhome.png" alt="Musique africaine" className="w-full h-full object-cover" width={400} height={400} />
          </div>
        </div>
      </div>
    </section>
  );
} 