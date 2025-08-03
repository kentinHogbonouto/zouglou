import { Hero } from '@/components/features/Hero'
import { StreamingFeatures } from '@/components/features/StreamingFeatures'

export default function Home() {
  return (
    <div>
      <Hero />
      <StreamingFeatures />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Découvrez la musique africaine
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Zouglou est la première plateforme de streaming dédiée à la musique africaine. 
              Découvrez des artistes talentueux et partagez votre passion pour la musique.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
