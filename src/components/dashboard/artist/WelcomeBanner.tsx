'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Sparkles, Music, TrendingUp, Heart } from 'lucide-react';

interface WelcomeBannerProps {
  artistName?: string;
  lastLogin?: string;
}

export function WelcomeBanner({ artistName = "Artiste", lastLogin = "aujourd'hui" }: WelcomeBannerProps) {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Bonjour";
    if (currentHour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Votre créativité inspire le monde",
      "Prêt à créer quelque chose d'extraordinaire ?",
      "Votre musique touche des milliers de cœurs",
      "Continuez à briller et à partager votre talent",
      "Chaque note compte, chaque mélodie raconte une histoire"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-[#005929]/5 via-transparent to-[#FE5200]/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#005929]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#FE5200]/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardContent className="relative p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929] to-[#FE5200] shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-800">
                  {getGreeting()}, {artistName}
                </h2>
                <p className="text-slate-500 text-sm">
                  Dernière connexion {lastLogin}
                </p>
              </div>
            </div>
            
            <p className="text-slate-600 max-w-2xl">
              {getMotivationalMessage()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 rounded-lg">
              <Music className="w-4 h-4 text-[#005929]" />
              <span className="text-sm font-medium text-[#005929]">23 titres</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#FE5200]/10 to-[#FE5200]/5 rounded-lg">
              <Heart className="w-4 h-4 text-[#FE5200]" />
              <span className="text-sm font-medium text-[#FE5200]">45.6K fans</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 rounded-lg">
              <TrendingUp className="w-4 h-4 text-[#005929]" />
              <span className="text-sm font-medium text-[#005929]">+12.5%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
