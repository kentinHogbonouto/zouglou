import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-orange-400">
              Zouglou
            </Link>
            <p className="mt-4 text-gray-200 max-w-md">
              La première plateforme de streaming dédiée à la musique africaine. 
              Découvrez des artistes talentueux et partagez votre passion pour la musique.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Découvrir</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/artists" className="text-gray-200 hover:text-orange-300">
                  Artistes
                </Link>
              </li>
              <li>
                <Link href="/playlists" className="text-gray-200 hover:text-orange-300">
                  Playlists
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-gray-200 hover:text-orange-300">
                  Genres musicaux
                </Link>
              </li>
              <li>
                <Link href="/charts" className="text-gray-200 hover:text-orange-300">
                  Charts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-200 hover:text-orange-300">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-200 hover:text-orange-300">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-200 hover:text-orange-300">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-200 hover:text-orange-300">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">&copy; 2024 Zouglou. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
} 