# Hooks de Récupération d'Utilisateur par ID

Ce document explique comment utiliser les hooks pour récupérer l'utilisateur connecté par son ID enregistré après la connexion.

## Vue d'ensemble

Après la connexion d'un utilisateur, son ID est automatiquement sauvegardé dans le `localStorage` sous la clé `current_user_id`. Cela permet de récupérer facilement les informations de l'utilisateur connecté sans avoir à refaire un appel API pour obtenir ses données complètes.

## Hooks Disponibles

### 1. `useUserById(id: string)`

Récupère un utilisateur spécifique par son ID.

```typescript
import { useUserById } from '@/hooks/useAuthQueries';

function MyComponent() {
  const { data: user, isLoading, error } = useUserById('user-123');
  
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  if (!user) return <div>Aucun utilisateur trouvé</div>;
  
  return (
    <div>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Email: {user.email}</p>
      <p>Rôle: {user.role}</p>
    </div>
  );
}
```

### 2. `useCurrentUserById()`

Récupère automatiquement l'utilisateur connecté en utilisant son ID stocké dans le `localStorage`.

```typescript
import { useCurrentUserById } from '@/hooks/useAuthQueries';

function MyComponent() {
  const { data: user, isLoading, error, refetch } = useCurrentUserById();
  
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  if (!user) return <div>Aucun utilisateur connecté</div>;
  
  return (
    <div>
      <h2>Profil de {user.firstName} {user.lastName}</h2>
      <p>Email: {user.email}</p>
      <p>Rôle: {user.role}</p>
      <button onClick={() => refetch()}>Actualiser</button>
    </div>
  );
}
```

### 3. `useAuth()` avec fonctions utilitaires

Le hook `useAuth` principal inclut maintenant des fonctions utilitaires pour gérer l'ID utilisateur.

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    getCurrentUserId, 
    setCurrentUserId, 
    clearCurrentUserId,
    isUserAuthenticated 
  } = useAuth();
  
  const currentUserId = getCurrentUserId();
  
  return (
    <div>
      <p>Utilisateur connecté: {isAuthenticated ? 'Oui' : 'Non'}</p>
      <p>ID utilisateur: {currentUserId || 'Non défini'}</p>
      <p>Authentification vérifiée: {isUserAuthenticated() ? 'Oui' : 'Non'}</p>
    </div>
  );
}
```

## Fonctions Utilitaires

### `getCurrentUserId(): string | null`
Retourne l'ID de l'utilisateur connecté depuis le `localStorage`.

### `setCurrentUserId(userId: string): void`
Définit l'ID de l'utilisateur connecté dans le `localStorage`.

### `clearCurrentUserId(): void`
Supprime l'ID de l'utilisateur connecté du `localStorage`.

### `isUserAuthenticated(): boolean`
Vérifie si un utilisateur est authentifié en contrôlant la présence du token et de l'ID utilisateur.

## Gestion Automatique

### Après la Connexion

Lorsqu'un utilisateur se connecte avec succès :

1. Le token d'accès est sauvegardé dans `localStorage` sous `auth_token`
2. Le token de rafraîchissement est sauvegardé sous `refresh_token`
3. **L'ID de l'utilisateur est automatiquement sauvegardé sous `current_user_id`**
4. Les données utilisateur sont mises en cache avec React Query

### Après la Déconnexion

Lorsqu'un utilisateur se déconnecte :

1. Tous les tokens sont supprimés du `localStorage`
2. **L'ID utilisateur est supprimé du `localStorage`**
3. Le cache React Query est vidé

## Exemple Complet

```typescript
import React, { useState } from 'react';
import { useUserById, useCurrentUserById, useAuth } from '@/hooks/useAuthQueries';

export function UserProfile() {
  const [searchId, setSearchId] = useState('');
  const { user: currentUser, isAuthenticated } = useAuth();
  
  // Récupérer l'utilisateur connecté par son ID
  const { data: currentUserById, isLoading: isLoadingCurrent } = useCurrentUserById();
  
  // Récupérer un utilisateur spécifique par ID
  const { data: searchedUser, isLoading: isLoadingSearched } = useUserById(searchId);
  
  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }
  
  return (
    <div>
      <h1>Profil Utilisateur</h1>
      
      {/* Utilisateur connecté via useAuth */}
      <section>
        <h2>Utilisateur connecté (useAuth)</h2>
        <p>ID: {currentUser?.id}</p>
        <p>Email: {currentUser?.email}</p>
      </section>
      
      {/* Utilisateur connecté via useCurrentUserById */}
      <section>
        <h2>Utilisateur connecté (useCurrentUserById)</h2>
        {isLoadingCurrent ? (
          <p>Chargement...</p>
        ) : (
          <div>
            <p>ID: {currentUserById?.id}</p>
            <p>Email: {currentUserById?.email}</p>
            <p>Nom: {currentUserById?.firstName} {currentUserById?.lastName}</p>
          </div>
        )}
      </section>
      
      {/* Recherche d'utilisateur par ID */}
      <section>
        <h2>Rechercher un utilisateur</h2>
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Entrez un ID utilisateur"
        />
        {isLoadingSearched ? (
          <p>Recherche...</p>
        ) : searchedUser ? (
          <div>
            <p>ID: {searchedUser.id}</p>
            <p>Email: {searchedUser.email}</p>
            <p>Nom: {searchedUser.firstName} {searchedUser.lastName}</p>
          </div>
        ) : searchId && (
          <p>Aucun utilisateur trouvé</p>
        )}
      </section>
    </div>
  );
}
```

## Avantages

1. **Performance** : Évite les appels API inutiles en utilisant l'ID stocké
2. **Simplicité** : Accès facile à l'utilisateur connecté sans gestion complexe
3. **Cohérence** : Gestion automatique de l'ID lors de la connexion/déconnexion
4. **Cache** : Utilisation de React Query pour la mise en cache et la synchronisation
5. **Flexibilité** : Possibilité de récupérer n'importe quel utilisateur par ID

## Page de Test

Une page de test est disponible à `/dashboard/test-auth` pour tester tous les hooks d'authentification et de récupération d'utilisateur. 