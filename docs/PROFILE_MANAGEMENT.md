# Gestion du Profil Utilisateur

Ce document décrit les fonctionnalités de gestion du profil utilisateur et artiste implémentées dans l'application.

## Fonctionnalités Disponibles

### 1. Mise à jour des Informations Personnelles

Les utilisateurs peuvent modifier leurs informations personnelles via l'onglet "Informations Personnelles" :

- **Prénom** (`firstName`)
- **Nom** (`lastName`)
- **Email** (`email`)
- **Téléphone** (`phone`)
- **Ville** (`city`)
- **Pays** (`country`)
- **Code Pays** (`countryCode`)
- **Date de naissance** (`birth_date`)
- **Sexe** (`sexe`)
- **Adresse** (`adress`)

### 2. Mise à jour du Profil Artiste

Les artistes peuvent modifier leur profil artistique via l'onglet "Profil Artiste" :

- **Nom de scène** (`stage_name`)
- **Biographie** (`biography`)
- **Image de profil** (`profile_image`)
- **Image de couverture** (`cover_image`)

### 3. Changement de Mot de Passe

Les utilisateurs peuvent changer leur mot de passe via l'onglet "Changer le Mot de Passe" :

- **Mot de passe actuel** (requis)
- **Nouveau mot de passe** (requis)
- **Confirmation du nouveau mot de passe** (requis)

## Hooks React Query

### useUpdateUserProfile

```typescript
const { updateUserProfile, isUpdatingUserProfile } = useAuth();

const handleUpdate = async (data: UpdateUserProfileData) => {
  try {
    await updateUserProfile(data);
    // Succès
  } catch (error) {
    // Gestion d'erreur
  }
};
```

### useUpdateArtistProfile

```typescript
const { updateArtistProfile, isUpdatingArtistProfile } = useAuth();

const handleUpdate = async (data: UpdateArtistProfileData) => {
  try {
    await updateArtistProfile(data);
    // Succès
  } catch (error) {
    // Gestion d'erreur
  }
};
```

### useChangePassword

```typescript
const { changePassword, isChangingPassword } = useAuth();

const handleChangePassword = async (data: ChangePasswordData) => {
  try {
    await changePassword(data);
    // Succès
  } catch (error) {
    // Gestion d'erreur
  }
};
```

## Types TypeScript

### UpdateUserProfileData

```typescript
interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  birth_date?: string;
  sexe?: string;
  adress?: string;
  countryCode?: string;
}
```

### UpdateArtistProfileData

```typescript
interface UpdateArtistProfileData {
  stage_name?: string;
  biography?: string;
  profile_image?: File;
  cover_image?: File;
}
```

### ChangePasswordData

```typescript
interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

## Endpoints API

### Mise à jour du profil utilisateur
```
PATCH /account/{user_id}
```

### Mise à jour du profil artiste
```
PATCH /account/artist_profile/{user_id}
```

### Changement de mot de passe
```
POST /account/change_password/
```

## Notifications

L'application utilise un système de notifications pour informer l'utilisateur du succès ou de l'échec des opérations :

- **Succès** : Notification verte avec icône ✓
- **Erreur** : Notification rouge avec icône ✕
- **Avertissement** : Notification jaune avec icône ⚠
- **Information** : Notification bleue avec icône ℹ

## Structure des Données Utilisateur

L'interface `User` a été mise à jour pour correspondre à la structure de l'API :

```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  username: string;
  // ... autres champs
  artist_profile?: ArtistProfile;
}

interface ArtistProfile {
  id: string;
  stage_name: string;
  biography?: string | null;
  profile_image?: string | null;
  cover_image?: string | null;
  is_verified: boolean;
  followers_count: number;
  social_links?: any | null;
}
```

## Utilisation

1. Naviguez vers `/dashboard/artist/profile`
2. Sélectionnez l'onglet approprié (Informations Personnelles, Profil Artiste, ou Changer le Mot de Passe)
3. Modifiez les champs souhaités
4. Cliquez sur "Mettre à jour" ou "Changer le mot de passe"
5. Une notification apparaîtra pour confirmer le succès ou l'échec de l'opération

## Gestion des Erreurs

Toutes les opérations incluent une gestion d'erreur appropriée :

- Validation des données côté client
- Messages d'erreur explicites
- Gestion des erreurs réseau
- Notifications utilisateur

## Sécurité

- Les mots de passe sont validés côté client et serveur
- Les tokens d'authentification sont vérifiés pour chaque requête
- Les données sensibles ne sont pas exposées dans les logs

