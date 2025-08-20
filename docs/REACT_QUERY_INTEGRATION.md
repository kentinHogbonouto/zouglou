# Intégration de React Query (TanStack Query)

Ce guide explique comment utiliser React Query pour la gestion d'état serveur dans le projet Zouglou.

## Installation

React Query est déjà installé dans le projet :

```json
{
  "@tanstack/react-query": "^5.84.1"
}
```

## Configuration

### 1. QueryClient

Le QueryClient est configuré dans `src/lib/queryClient.ts` :

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: (failureCount, error) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false; // Pas de retry pour les erreurs 4xx
        }
        return failureCount < 3; // Retry jusqu'à 3 fois
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 2. QueryProvider

Le provider est configuré dans `src/components/providers/QueryProvider.tsx` :

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

## Hooks d'authentification

### useAuth

Hook principal pour l'authentification :

```typescript
import { useAuth } from '@/hooks/useAuthQueries';

function MyComponent() {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
  } = useAuth();

  // Utilisation
  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };
}
```

### Hooks individuels

```typescript
import { useUser, useLogin, useRegister, useLogout } from '@/hooks/useAuthQueries';

// Récupérer l'utilisateur connecté
const { data: user, isLoading } = useUser();

// Connexion
const loginMutation = useLogin();
await loginMutation.mutateAsync({ email, password });

// Inscription
const registerMutation = useRegister();
await registerMutation.mutateAsync(userData);

// Déconnexion
const logoutMutation = useLogout();
await logoutMutation.mutateAsync();
```

## Hooks génériques pour l'API

### useApiQuery

Pour les requêtes GET simples :

```typescript
import { useApiQuery } from '@/hooks/useApiQueries';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useApiQuery(
    ['user', userId],
    `/users/${userId}/`
  );

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return <div>{data?.data?.name}</div>;
}
```

### usePaginatedQuery

Pour les requêtes avec pagination :

```typescript
import { usePaginatedQuery } from '@/hooks/useApiQueries';

function UserList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaginatedQuery(
    ['users'],
    '/users/',
    page,
    10
  );

  return (
    <div>
      {data?.data?.items?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={() => setPage(page + 1)}>Suivant</button>
    </div>
  );
}
```

### useApiMutation

Pour les mutations POST :

```typescript
import { useApiMutation } from '@/hooks/useApiQueries';

function CreateUser() {
  const createUserMutation = useApiMutation('/users/', {
    onSuccess: (data) => {
      console.log('Utilisateur créé:', data);
    },
    onError: (error) => {
      console.error('Erreur:', error);
    },
  });

  const handleSubmit = (userData: any) => {
    createUserMutation.mutate(userData);
  };

  return (
    <button 
      onClick={() => handleSubmit({ name: 'John' })}
      disabled={createUserMutation.isPending}
    >
      {createUserMutation.isPending ? 'Création...' : 'Créer'}
    </button>
  );
}
```

## Hooks spécifiques

### Utilisateurs

```typescript
import { useUsers, useUser } from '@/hooks/useApiQueries';

// Liste paginée d'utilisateurs
const { data: usersData, isLoading } = useUsers(page, limit);

// Utilisateur spécifique
const { data: userData } = useUser(userId);
```

### Tracks/Musique

```typescript
import { useTracks, useTrack, usePopularTracks, useRecentTracks } from '@/hooks/useApiQueries';

// Liste de tracks
const { data: tracksData } = useTracks(page, limit);

// Track spécifique
const { data: trackData } = useTrack(trackId);

// Tracks populaires
const { data: popularTracks } = usePopularTracks();

// Tracks récents
const { data: recentTracks } = useRecentTracks();
```

### Artistes

```typescript
import { useArtists, useArtist } from '@/hooks/useApiQueries';

// Liste d'artistes
const { data: artistsData } = useArtists(page, limit);

// Artiste spécifique
const { data: artistData } = useArtist(artistId);
```

### Statistiques

```typescript
import { useDashboardStats, useAnalytics } from '@/hooks/useApiQueries';

// Statistiques du dashboard
const { data: dashboardStats } = useDashboardStats();

// Analytics
const { data: analyticsData } = useAnalytics();
```

## Gestion du cache

### Clés de cache

```typescript
import { queryKeys } from '@/hooks/useApiQueries';

// Clés prédéfinies
queryKeys.users.all           // ['users']
queryKeys.users.list(filters) // ['users', 'list', filters]
queryKeys.users.detail(id)    // ['users', 'detail', id]
queryKeys.tracks.all          // ['tracks']
queryKeys.artists.all         // ['artists']
```

### Invalidation du cache

```typescript
import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();

  // Invalider toutes les requêtes utilisateurs
  queryClient.invalidateQueries({ queryKey: queryKeys.users.all });

  // Invalider une requête spécifique
  queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });

  // Vider tout le cache
  queryClient.clear();
}
```

### Mise à jour optimiste

```typescript
import { useQueryClient } from '@tanstack/react-query';

const updateUserMutation = useApiUpdate('/users/1/', {
  onMutate: async (newUserData) => {
    // Annuler les requêtes en cours
    await queryClient.cancelQueries({ queryKey: queryKeys.users.detail('1') });

    // Sauvegarder l'ancienne valeur
    const previousUser = queryClient.getQueryData(queryKeys.users.detail('1'));

    // Mise à jour optimiste
    queryClient.setQueryData(queryKeys.users.detail('1'), newUserData);

    return { previousUser };
  },
  onError: (err, newUserData, context) => {
    // Restaurer l'ancienne valeur en cas d'erreur
    queryClient.setQueryData(queryKeys.users.detail('1'), context?.previousUser);
  },
  onSettled: () => {
    // Toujours refetch après mutation
    queryClient.invalidateQueries({ queryKey: queryKeys.users.detail('1') });
  },
});
```

## États de chargement et d'erreur

### États disponibles

```typescript
const {
  data,           // Données de la requête
  isLoading,      // Premier chargement
  isFetching,     // Chargement en cours (refetch)
  isError,        // Erreur
  error,          // Détails de l'erreur
  isSuccess,      // Succès
  isIdle,         // Inactif
} = useQuery(...);
```

### Gestion des états

```typescript
function MyComponent() {
  const { data, isLoading, isError, error, isFetching } = useQuery(...);

  if (isLoading) {
    return <div>Chargement initial...</div>;
  }

  if (isError) {
    return <div>Erreur: {error.message}</div>;
  }

  return (
    <div>
      {data && <div>{data.name}</div>}
      {isFetching && <div>Actualisation...</div>}
    </div>
  );
}
```

## Optimisations

### Refetch automatique

```typescript
// Refetch quand la fenêtre reprend le focus
refetchOnWindowFocus: true,

// Refetch quand la connexion reprend
refetchOnReconnect: true,

// Refetch à intervalle régulier
refetchInterval: 30000, // 30 secondes
```

### Cache intelligent

```typescript
// Temps avant que les données soient considérées comme périmées
staleTime: 5 * 60 * 1000, // 5 minutes

// Temps de conservation en mémoire
gcTime: 10 * 60 * 1000, // 10 minutes
```

### Requêtes conditionnelles

```typescript
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId, // Ne s'exécute que si userId existe
});
```

## Exemples pratiques

### Formulaire avec React Query

```typescript
function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const createUserMutation = useApiMutation('/users/');

  const onSubmit = async (data: any) => {
    try {
      await createUserMutation.mutateAsync(data);
      // Le cache sera automatiquement invalidé
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <button type="submit" disabled={createUserMutation.isPending}>
        {createUserMutation.isPending ? 'Création...' : 'Créer'}
      </button>
    </form>
  );
}
```

### Liste avec pagination et recherche

```typescript
function UserList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = usePaginatedQuery(
    ['users', { search }],
    `/users/?search=${search}`,
    page,
    10
  );

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher..."
      />
      
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        data?.data?.items?.map(user => (
          <div key={user.id}>{user.name}</div>
        ))
      )}
      
      <div>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Précédent
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={!data?.data?.hasNext}>
          Suivant
        </button>
      </div>
    </div>
  );
}
```

## DevTools

En développement, les React Query DevTools sont automatiquement inclus :

- Ouvrir les DevTools : `Ctrl+Shift+J` (ou `Cmd+Shift+J` sur Mac)
- Inspecter les requêtes en cours
- Voir le cache
- Déclencher des refetch manuels
- Tester les erreurs

## Bonnes pratiques

1. **Utilisez des clés de cache cohérentes** : Suivez la structure définie dans `queryKeys`
2. **Gérez les états de chargement** : Affichez des indicateurs appropriés
3. **Invalidez le cache intelligemment** : Après les mutations, invalidez seulement les requêtes concernées
4. **Utilisez les mutations optimistes** : Pour une meilleure UX
5. **Gérez les erreurs** : Affichez des messages d'erreur appropriés
6. **Optimisez les requêtes** : Utilisez `enabled`, `staleTime`, etc.
7. **Évitez les requêtes inutiles** : Utilisez des requêtes conditionnelles

## Ressources

- [Documentation officielle React Query](https://tanstack.com/query/latest)
- [Guide de migration v4 vers v5](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)
- [Exemples d'utilisation](https://tanstack.com/query/latest/docs/react/examples/react/basic) 