
import { ApiAlbum } from "@/shared/types";
import { useArtistAlbums } from "@/hooks/useMusicQueries";
import { useAuth } from "@/hooks/useAuthQueries";

interface AlbumSelectProps {
    value: string;
    onChange: (value: string) => void;
}

export function AlbumSelect({ value, onChange }: AlbumSelectProps) {
    const { user } = useAuth();
    const { data: albumsData, isLoading, error } = useArtistAlbums(user?.artist_profile?.id || ''); 

    const albums = albumsData?.results || [];

    return (
        <div>
           <select 
             value={value} 
             onChange={(e) => onChange(e.target.value)} 
             className="outline-none border-2 w-full rounded-md p-2"
             disabled={isLoading}
           >
             <option value="">Sélectionner un album</option>
             {albums?.map((album: ApiAlbum) => (
                 <option key={album.id} value={album.id}>
                     {album.title}
                 </option>
             ))}
           </select>
           {isLoading && <p className="text-sm text-gray-500 mt-1">Chargement des albums...</p>}
           {error && <p className="text-sm text-red-500 mt-1">Erreur lors du chargement</p>}
        </div>
    )
}