# Utilisation de React Hook Form avec Yup

Ce guide explique comment utiliser React Hook Form avec Yup pour la validation des formulaires dans le projet Zouglou.

## Installation

Les dépendances sont déjà installées dans le projet :

```json
{
  "react-hook-form": "^7.62.0",
  "@hookform/resolvers": "^5.2.1",
  "yup": "^1.7.0"
}
```

## Concepts de base

### 1. React Hook Form
- Gestion d'état des formulaires sans re-renders inutiles
- Validation en temps réel
- Gestion des erreurs
- Performance optimisée

### 2. Yup
- Bibliothèque de validation de schémas
- Validation synchrone et asynchrone
- Messages d'erreur personnalisables
- Transformation des données

### 3. @hookform/resolvers
- Bridge entre React Hook Form et Yup
- Intégration transparente

## Utilisation de base

### 1. Import des dépendances

```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
```

### 2. Définition du schéma Yup

```typescript
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Veuillez entrer un email valide')
    .required('L\'email est requis'),
  password: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
}).required();
```

### 3. Configuration du formulaire

```typescript
const {
  register,
  handleSubmit,
  formState: { errors, isValid },
  reset,
} = useForm({
  resolver: yupResolver(loginSchema),
  mode: 'onChange', // Validation en temps réel
  defaultValues: {
    email: '',
    password: '',
  },
});
```

### 4. Gestion de la soumission

```typescript
const onSubmit = async (data: any) => {
  try {
    // Traitement des données
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

### 5. Rendu du formulaire

```typescript
<form onSubmit={handleSubmit(onSubmit)}>
  <input
    {...register('email')}
    type="email"
    placeholder="Email"
  />
  {errors.email && <p>{errors.email.message}</p>}
  
  <input
    {...register('password')}
    type="password"
    placeholder="Mot de passe"
  />
  {errors.password && <p>{errors.password.message}</p>}
  
  <button type="submit" disabled={!isValid}>
    Se connecter
  </button>
</form>
```

## Composants réutilisables

### FormField

Composant pour les champs de saisie avec validation :

```typescript
import { FormField } from '@/components/ui/FormField';

<FormField
  label="Email"
  type="email"
  register={register('email')}
  error={errors.email}
  placeholder="votre@email.com"
  required
  autoComplete="email"
/>
```

### FormCheckbox

Composant pour les cases à cocher :

```typescript
import { FormCheckbox } from '@/components/ui/FormField';

<FormCheckbox
  label="J'accepte les conditions d'utilisation"
  register={register('terms')}
  error={errors.terms}
/>
```

## Hook personnalisé

### useFormWithValidation

Hook simplifié pour l'utilisation avec Yup :

```typescript
import { useFormWithValidation } from '@/hooks/useFormWithValidation';

const {
  register,
  handleSubmit,
  formState: { errors, isValid },
} = useFormWithValidation({
  schema: mySchema,
  defaultValues: { /* ... */ },
  mode: 'onChange',
});
```

## Schémas Yup prédéfinis

### yupSchemas

Utilitaires pour créer des schémas courants :

```typescript
import { yupSchemas } from '@/hooks/useFormWithValidation';

const schema = yup.object({
  email: yupSchemas.email,
  password: yupSchemas.password,
  confirmPassword: yupSchemas.confirmPassword('password'),
  firstName: yupSchemas.requiredString(2, 50),
  username: yupSchemas.username,
  phone: yupSchemas.phone,
  terms: yupSchemas.requiredCheckbox,
});
```

## Exemples pratiques

### 1. Formulaire de connexion

```typescript
// Schéma
const loginSchema = yup.object({
  email: yupSchemas.email,
  password: yupSchemas.password,
  rememberMe: yup.boolean().optional(),
});

// Utilisation
const {
  register,
  handleSubmit,
  formState: { errors, isValid },
} = useForm({
  resolver: yupResolver(loginSchema),
  mode: 'onChange',
  defaultValues: {
    email: '',
    password: '',
    rememberMe: false,
  },
});
```

### 2. Formulaire d'inscription

```typescript
// Schéma
const registerSchema = yup.object({
  firstName: yupSchemas.requiredString(2, 50),
  lastName: yupSchemas.requiredString(2, 50),
  email: yupSchemas.email,
  username: yupSchemas.username,
  password: yupSchemas.password,
  confirmPassword: yupSchemas.confirmPassword('password'),
  acceptTerms: yupSchemas.requiredCheckbox,
});

// Validation en temps réel du mot de passe
const password = watch('password');
```

### 3. Formulaire de contact

```typescript
// Schéma
const contactSchema = yup.object({
  firstName: yupSchemas.requiredString(2, 50),
  lastName: yupSchemas.requiredString(2, 50),
  email: yupSchemas.email,
  phone: yupSchemas.phone,
  message: yup
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(500, 'Le message ne peut pas dépasser 500 caractères')
    .required('Le message est requis'),
  newsletter: yup.boolean().optional(),
  terms: yupSchemas.requiredCheckbox,
});
```

## Modes de validation

- `onChange` : Validation à chaque changement (recommandé)
- `onBlur` : Validation lors de la perte de focus
- `onSubmit` : Validation uniquement à la soumission
- `onTouched` : Validation après la première interaction
- `all` : Validation à chaque événement

## Gestion des erreurs

### Affichage des erreurs

```typescript
{errors.fieldName && (
  <p className="text-red-400 text-xs">{errors.fieldName.message}</p>
)}
```

### Styles conditionnels

```typescript
<input
  {...register('email')}
  className={`base-class ${
    errors.email ? 'border-red-500' : 'border-gray-300'
  }`}
/>
```

### Validation personnalisée

```typescript
const customSchema = yup.object({
  email: yup
    .string()
    .email('Email invalide')
    .test('unique-email', 'Cet email est déjà utilisé', async (value) => {
      // Validation asynchrone
      const isUnique = await checkEmailUniqueness(value);
      return isUnique;
    }),
});
```

## Bonnes pratiques

1. **Utilisez les composants réutilisables** : `FormField` et `FormCheckbox`
2. **Définissez des types TypeScript** pour vos données de formulaire
3. **Utilisez les schémas prédéfinis** quand possible
4. **Gérez les états de chargement** avec `disabled={loading || !isValid}`
5. **Réinitialisez les formulaires** après soumission réussie
6. **Utilisez `watch()`** pour la validation en temps réel
7. **Gérez les erreurs API** séparément des erreurs de validation

## Exemples complets

Voir les fichiers suivants pour des exemples complets :
- `src/app/login/page.tsx` - Formulaire de connexion
- `src/app/register/page.tsx` - Formulaire d'inscription
- `src/components/examples/SimpleFormExample.tsx` - Exemple simple

## Ressources

- [Documentation React Hook Form](https://react-hook-form.com/)
- [Documentation Yup](https://github.com/jquense/yup)
- [Documentation @hookform/resolvers](https://github.com/react-hook-form/resolvers) 