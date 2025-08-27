import React from 'react';
import { Card } from '@/components/ui/Card';
import { ApiAlbum } from '@/shared/types/api';

import Link from 'next/link';
import Image from 'next/image';
interface AlbumListProps {
  albums: ApiAlbum[];
}

export function AlbumList({ albums }: AlbumListProps) {

  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun album trouvé</p>
        <p className="text-gray-400">Commencez par ajouter votre premier album !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <Card key={album.id} className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="w-full h-[20vh]">
          <Link href={`/dashboard/artist/albums/${album.id}`} className='cursor-pointer'>
            <Image
                src={album.cover || '/images/cover_default.jpg'}
                alt={album.title}
                className="w-full h-full rounded-lg object-cover mr-4"
                width={400}
                height={400}
              />
            </Link>
          </div>

          <div className="flex items-start justify-between mb-1">
           
            <div className="flex-1">
              <Link href={`/dashboard/artist/albums/${album.id}`} className='cursor-pointer'>
                <h3 className=" text-md md:text-xl font-semibold text-gray-900 my-2">{album.title}</h3>
              </Link>
              
              <p className=" text-gray-500 mb-1">{album.description}</p>
              
                
              <p className=" text-gray-500 mb-1">Date de sortie: {album.release_date || ''}</p>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  album.is_published 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {album.is_published ? 'Publié' : 'Brouillon'}
                </span>
                  
                {album.deleted && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 text-center line-clamp-1">
                    Supprimé
                  </span>
                )}
                  
                <span className="text-xs text-gray-500">
                  {album.songs?.length || 0} tracks
                </span>
              </div>
              <div>
              </div>
            </div>
          </div>

          {/* <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/artist/albums/${album.id}`)}
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-2"
              >
                Voir
              </Button>
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/artist/albums/${album.id}?edit=true`)}
                className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
              >
                Modifier
              </Button>
            </div>
           
          </div> */}
        </Card>
      ))}
    </div>
  );
} 