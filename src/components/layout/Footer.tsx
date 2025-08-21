import React from 'react';
import Link from 'next/link';
import { Users, HelpCircle, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <Image src="/images/logo_zouglou.png" alt="Zouglou" width={100} height={100} className="w-[6rem] h-[6rem] object-bottom object-contain" />
            </Link>
            <p className="text-slate-300 leading-relaxed max-w-md mb-6">
              La première plateforme de streaming dédiée à la musique africaine. 
              Découvrez des artistes talentueux et partagez votre passion pour la musique.
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 group">
                <Instagram className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 group">
                <Twitter className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 group">
                <Facebook className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 group">
                <Youtube className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Découvrir */}
          <div>
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#005929]" />
              Découvrir
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/artists" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#005929] rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  Artistes
                </Link>
              </li>
              <li>
                <Link href="/playlists" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#005929] rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  Playlists
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#005929] rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  Genres musicaux
                </Link>
              </li>
              <li>
                <Link href="/charts" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#005929] rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  Charts
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#FE5200]" />
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#FE5200] rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  Centre d&apos;aide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#FE5200] rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#FE5200] rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#FE5200] rounded-full group-hover:scale-150 transition-transform duration-200"></div>
                  Conditions d&apos;utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-around items-center gap-4">
            <p className="text-slate-400 text-sm">
              &copy; 2024 Zouglou. Tous droits réservés.
            </p>
           
          </div>
        </div>
      </div>
    </footer>
  );
} 