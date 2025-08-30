import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-gray-300 mb-4">
            404
          </CardTitle>
          <CardTitle className="text-2xl">
            Page non trouvée
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col gap-6">
            <div>
              <Link href="/">
                <Button className="w-full">
                  Retour à l&apos;accueil
                </Button>
              </Link>
            </div>
            <div>
              <Link href="/#contact">
                <Button variant="outline" className="w-full">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 