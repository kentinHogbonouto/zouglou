import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'Zouglou - Votre plateforme de santé en ligne',
    template: '%s | Zouglou',
  },
  description: 'Accédez à des services médicaux de qualité depuis chez vous. Consultations, analyses et suivi médical en ligne.',
  keywords: ['santé', 'médecine', 'consultation', 'analyse', 'plateforme médicale', 'Côte d\'Ivoire'],
  authors: [{ name: 'Zouglou Team' }],
  creator: 'Zouglou',
  publisher: 'Zouglou',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zouglou.ci'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://zouglou.ci',
    title: 'Zouglou - Votre plateforme de santé en ligne',
    description: 'Accédez à des services médicaux de qualité depuis chez vous.',
    siteName: 'Zouglou',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zouglou - Votre plateforme de santé en ligne',
    description: 'Accédez à des services médicaux de qualité depuis chez vous.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}; 