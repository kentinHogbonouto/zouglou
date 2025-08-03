# Zouglou Frontend

## 🚀 Fonctionnalités

- **Interface moderne et responsive** : Design adaptatif pour tous les appareils
- **Composants réutilisables** : Architecture modulaire avec des composants UI personnalisés
- **TypeScript** : Typage statique pour une meilleure maintenabilité
- **Tailwind CSS** : Framework CSS utilitaire pour un styling rapide et cohérent
- **Pages statiques** : Performance optimisée avec le rendu côté serveur

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── features/          # Composants spécifiques aux fonctionnalités
│   │   ├── Hero.tsx       # Section d'accueil
│   │   └── ServicesSection.tsx
│   ├── layout/            # Composants de mise en page
│   │   ├── Header.tsx     # Navigation principale
│   │   └── Footer.tsx     # Pied de page
│   └── ui/                # Composants UI réutilisables
│       ├── Button.tsx     # Boutons
│       ├── Card.tsx       # Cartes
│       └── Input.tsx      # Champs de saisie
├── hooks/                 # Hooks personnalisés
│   └── useApi.ts          # Hook pour les appels API
├── lib/                   # Utilitaires et configurations
│   └── utils.ts           # Fonctions utilitaires
└── shared/                # Types et ressources partagées
    └── types/             # Types TypeScript
        └── index.ts       # Types de base
```

## 🛠️ Technologies utilisées

- **Next.js 15** : Framework React avec App Router
- **React 19** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **clsx** : Utilitaire pour les classes CSS conditionnelles
- **tailwind-merge** : Fusion intelligente des classes Tailwind

## 🚀 Installation et démarrage

1. **Installer les dépendances** :
   ```bash
   yarn install
   ```

2. **Démarrer le serveur de développement** :
   ```bash
   yarn dev
   ```

3. **Ouvrir dans le navigateur** :
   ```
   http://localhost:3000
   ```

## 📝 Scripts disponibles

- `yarn dev` : Démarre le serveur de développement
- `yarn build` : Construit l'application pour la production
- `yarn start` : Démarre le serveur de production
- `yarn lint` : Lance le linter ESLint

## 🎨 Design System

Le projet utilise un système de design cohérent avec :

- **Variables CSS** : Couleurs et espacements standardisés
- **Composants UI** : Boutons, cartes, inputs réutilisables
- **Responsive Design** : Adaptation mobile-first
- **Accessibilité** : Support des lecteurs d'écran et navigation clavier

## 🔧 Configuration

### Tailwind CSS
Le fichier `tailwind.config.ts` contient la configuration personnalisée avec :
- Variables CSS pour les couleurs
- Extensions de thème
- Configuration des plugins

### TypeScript
Configuration dans `tsconfig.json` avec :
- Path mapping pour les imports
- Configuration stricte
- Support des fonctionnalités modernes

## 📱 Pages disponibles

- **Accueil** (`/`) : Page principale avec hero et services
- **Services** (`/services`) : Liste des services médicaux
- **Packs** (`/packs`) : Packs de santé disponibles
- **Contact** (`/contact`) : Formulaire de contact et informations

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
