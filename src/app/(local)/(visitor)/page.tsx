import { Hero } from '@/components/features/Hero'
import { StreamingFeatures } from '@/components/features/StreamingFeatures'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import {
  Music,
  Mail,
  Phone,
  User,
  MessageSquare,
  Send,
  Heart,
  Play,
  Users,
  Globe,
  Star,
  Headphones,
  Mic,
  Disc3,
  Radio
} from 'lucide-react'
import Image from 'next/image';
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Section Fonctionnalités */}
      <StreamingFeatures />

      {/* Section Statistiques */}
      <section className="py-20 bg-white/80 backdrop-blur-sm border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[#005929]" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">500+</h3>
              <p className="text-slate-600 font-medium">Artistes</p>
            </div>

            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FE5200]/10 to-[#FE5200]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="w-8 h-8 text-[#FE5200]" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">10K+</h3>
              <p className="text-slate-600 font-medium">Titres</p>
            </div>

            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-16 h-16 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">50K+</h3>
              <p className="text-slate-600 font-medium">Écoutes</p>
            </div>

            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FE5200]/10 to-[#005929]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">25+</h3>
              <p className="text-slate-600 font-medium">Pays</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Découverte */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50/50" id="decouvrir">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contenu texte */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-full border border-[#005929]/20">
                  <Star className="w-4 h-4 text-[#005929]" />
                  <span className="text-sm font-medium text-slate-700">Plateforme Premium</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-light text-slate-800 leading-tight">
                  Découvrez la richesse de la{' '}
                  <span className="text-slate-900 font-medium">
                    musique africaine
                  </span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Zouglou est la première plateforme de streaming dédiée à la musique africaine.
                  Découvrez des artistes talentueux, des rythmes authentiques et partagez votre passion pour la musique.
                </p>
              </div>

              {/* Fonctionnalités clés */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#005929]/10 to-[#005929]/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-[#005929]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Écoute illimitée</h4>
                    <p className="text-sm text-slate-600">Profitez de millions de titres sans interruption</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FE5200]/10 to-[#FE5200]/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic className="w-5 h-5 text-[#FE5200]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Artistes émergents</h4>
                    <p className="text-sm text-slate-600">Découvrez de nouveaux talents africains</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Disc3 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Qualité HD</h4>
                    <p className="text-sm text-slate-600">Écoutez en haute qualité audio</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FE5200]/10 to-[#005929]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Radio className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">Playlists personnalisées</h4>
                    <p className="text-sm text-slate-600">Des recommandations adaptées à vos goûts</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Image/Illustration */}
            <div className="relative">
              <div className="relative z-10">
                <div className="w-full h-96 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                      <Music className="w-12 h-12 text-slate-600" />
                    </div>
                    <p className="text-slate-600 font-medium">Musique africaine authentique</p>
                  </div>
                </div>
              </div>

              {/* Éléments décoratifs */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-slate-200 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-slate-200 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section className="relative py-24 bg-slate-900 overflow-hidden" id="contact">
        {/* Background avec overlay */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-slate-900 -z-10">
          <Image
            src="/images/contact.jpg"
            alt="Musique africaine"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Mail className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Contact</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-6">
              Parlons de votre{' '}
              <span className="text-white font-medium">
                projet musical
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Une question ? Une suggestion ? Un projet de collaboration ?
              Notre équipe est là pour vous accompagner.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Informations de contact */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Email</h3>
                <p className="text-slate-300">contact@zouglou.com</p>
                <p className="text-sm text-slate-400 mt-1">Réponse sous 24h</p>
              </div>

              <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Téléphone</h3>
                <p className="text-slate-300">+225 27 22 49 89 00</p>
                <p className="text-sm text-slate-400 mt-1">Lun-Ven, 9h-18h</p>
              </div>

              <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Support</h3>
                <p className="text-slate-300">Assistance 24h/24</p>
                <p className="text-sm text-slate-400 mt-1">Support technique disponible</p>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="border-b border-slate-100 pb-6">
                  <CardTitle className="text-2xl font-medium text-slate-800 flex items-center gap-3">
                    Envoyez-nous un message
                  </CardTitle>
                  <p className="text-slate-500">Nous vous répondrons dans les plus brefs délais</p>
                </CardHeader>
                <CardContent className="p-8">
                  <form className="space-y-6">
                    {/* Nom et Prénom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-600" />
                          Prénom *
                        </label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          className="w-full border-slate-200 focus:border-slate-600 focus:ring-slate-600/20 rounded-xl"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-600" />
                          Nom *
                        </label>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          className="w-full border-slate-200 focus:border-slate-600 focus:ring-slate-600/20 rounded-xl"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    {/* Email et Téléphone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-600" />
                          Email *
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full border-slate-200 focus:border-slate-600 focus:ring-slate-600/20 rounded-xl"
                          placeholder="votre.email@exemple.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-600" />
                          Téléphone
                        </label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full border-slate-200 focus:border-slate-600 focus:ring-slate-600/20 rounded-xl"
                          placeholder="Votre numéro de téléphone"
                        />
                      </div>
                    </div>

                    {/* Sujet */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-600" />
                        Sujet *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-slate-600 focus:ring-slate-600/20 bg-white"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="general">Question générale</option>
                        <option value="support">Support technique</option>
                        <option value="partnership">Partenariat</option>
                        <option value="feedback">Retour d&apos;expérience</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-600" />
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-slate-600 focus:ring-slate-600/20 resize-none"
                        placeholder="Votre message..."
                      ></textarea>
                    </div>

                    {/* Checkbox de confidentialité */}
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        id="privacy"
                        name="privacy"
                        required
                        className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-600/20 border-slate-300 rounded"
                      />
                      <label htmlFor="privacy" className="text-sm text-slate-700">
                        J&apos;accepte que mes données soient traitées conformément à la{' '}
                        <a href="#" className="text-slate-600 hover:text-slate-800 underline font-medium">
                          politique de confidentialité
                        </a>
                      </label>
                    </div>

                    {/* Bouton d'envoi */}
                    <Button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
                    >
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
