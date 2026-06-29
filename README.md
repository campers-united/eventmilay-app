# EventMilay

Application web de gestion d'événements et de conférences. Permet de créer des événements, planifier des sessions, gérer des intervenants, poser des questions en direct et mettre en favoris des sessions.

---

## Stack technique

| Couche      | Technologie                                     |
| ----------- | ----------------------------------------------- |
| **Frontend** | Next.js 15 (App Router) + React 19 + TypeScript |
| **Backend**  | Express.js + Prisma ORM                         |
| **Base de données** | PostgreSQL                                |
| **Auth**     | JWT (JSON Web Token) + bcrypt                   |

---

## Structure du projet

```
eventmilay-app/
├── Backend/
│   ├── prisma/
│   │   └── schema.prisma        # Modèle de données
│   ├── src/
│   │   ├── server.js            # Point d'entrée Express
│   │   ├── seed-admin.js        # Script de création du premier admin
│   │   ├── routes/              # Routes API REST
│   │   ├── controllers/         # Logique métier
│   │   ├── middleware/
│   │   │   ├── auth.js          # Middleware JWT
│   │   │   └── upload.js        # Upload d'images (multer)
│   │   └── lib/
│   │       └── prisma.js        # Client Prisma
│   └── uploads/                 # Fichiers uploadés
├── Frontend/
│   └── src/
│       ├── app/                 # Pages App Router (Next.js)
│       │   ├── speakers/
│       │   ├── events/[eventId]/
│       │   ├── sessions/[sessionId]/
│       │   ├── live/
│       │   └── favorites/
│       ├── pages/               # Composants pages (logique métier)
│       ├── components/          # Composants réutilisables (ui/, SessionCard, LiveBadge)
│       ├── hooks/               # Hooks React (useFavorites, useNow)
│       └── lib/
│           ├── apiClient.ts     # Client HTTP typé pour l'API
│           └── userToken.ts     # Gestion du token utilisateur
└── README.md
```

---

## Modèle de données

- **Admin** — authentification (email, password hashé)
- **Event** — événement (titre, dates, lieu, couleur)
- **Session** — session / conférence (liée à un événement, une salle, des speakers)
- **Speaker** — intervenant (nom, photo, bio, liens sociaux)
- **SessionSpeaker** — table de liaison many-to-many (session + speaker)
- **Room** — salle (nom, capacité)
- **Question** — question posée pendant une session (avec upvotes)
- **Favorite** — favoris utilisateur (userToken + session)

---

## Installation et démarrage

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd eventmilay-app
```

### 2. Backend

```bash
cd Backend
cp .env.example .env       # Modifier les variables si nécessaire
npm install
npx prisma generate
npx prisma db push         # Créer les tables en base
npm run seed:admin         # Créer le compte admin (voir .env)
npm run dev                # Lance le serveur sur http://localhost:5000
```

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev                # Lance l'app sur http://localhost:3000
```

> Par défaut, le frontend appelle l'API sur `http://localhost:5000`.  
> Ce comportement est configurable via la variable d'environnement `NEXT_PUBLIC_API_URL`.

---

## Scripts disponibles

### Backend

| Commande              | Description                            |
| --------------------- | -------------------------------------- |
| `npm run dev`         | Démarre avec nodemon (auto-reload)    |
| `npm start`           | Démarre en production                  |
| `npm run db:generate` | Génère le client Prisma                |
| `npm run db:migrate`  | Applique une migration Prisma          |
| `npm run db:push`     | Synchronise le schéma avec la base     |
| `npm run db:studio`   | Ouvre Prisma Studio (UI base de données) |
| `npm run seed:admin`  | Crée le compte administrateur          |

### Frontend

| Commande          | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Démarre le serveur de développement  |
| `npm run build`   | Compile l'application pour production |
| `npm start`       | Démarre la version production         |
| `npm run lint`    | Vérifie le code avec ESLint          |

---

## API REST

| Méthode | Endpoint                         | Auth | Description              |
| ------- | ------------------------------- | ---- | ------------------------ |
| GET     | `/api/events`                   | -    | Liste des événements     |
| GET     | `/api/events/:id`               | -    | Détail d'un événement    |
| POST    | `/api/events`                   | JWT  | Créer un événement       |
| PUT     | `/api/events/:id`               | JWT  | Modifier un événement    |
| DELETE  | `/api/events/:id`               | JWT  | Supprimer un événement   |
| GET     | `/api/speakers`                 | -    | Liste des intervenants   |
| GET     | `/api/speakers/:id`             | -    | Détail d'un intervenant  |
| POST    | `/api/speakers`                 | JWT  | Créer un intervenant     |
| PUT     | `/api/speakers/:id`             | JWT  | Modifier un intervenant  |
| DELETE  | `/api/speakers/:id`             | JWT  | Supprimer un intervenant |
| GET     | `/api/sessions/:id`             | -    | Détail d'une session     |
| GET     | `/api/sessions/live`            | -    | Sessions en cours        |
| GET     | `/api/rooms`                    | -    | Liste des salles         |
| POST    | `/api/auth/login`               | -    | Connexion admin          |
| POST    | `/api/upload`                   | JWT  | Upload d'image           |
| POST    | `/api/sessions/:id/questions`   | -    | Poser une question       |
| PATCH   | `/api/questions/:id/upvote`     | -    | Upvoter une question     |
| GET     | `/api/favorites`                | -    | Liste des favoris        |
| POST    | `/api/favorites`                | -    | Ajouter un favori        |
| DELETE  | `/api/favorites/:sessionId`     | -    | Supprimer un favori      |

> Les routes protégées par JWT nécessitent un header `Authorization: Bearer <token>`.

---

## Pages de l'application

| Route                          | Description                          |
| ------------------------------ | ------------------------------------ |
| `/`                            | Accueil                              |
| `/events/[eventId]`            | Détail d'un événement                |
| `/events/[eventId]/planning`   | Planning des sessions                |
| `/sessions/[sessionId]`        | Détail d'une session                 |
| `/speakers`                    | Liste des intervenants               |
| `/speakers/[speakerId]`        | Profil d'un intervenant              |
| `/live`                        | Sessions en direct                   |
| `/favorites`                   | Sessions favorites                   |

---

## Variables d'environnement

### Backend — `.env`

```
DATABASE_URL="postgresql://user:password@localhost:5432/event_milay_db"
JWT_SECRET="change-in-production"
PORT=5000
ADMIN_EMAIL="admin@eventmilay.mg"
ADMIN_PASSWORD="Admin1234!"
ADMIN_NAME="Monsieur Admin EventMilay Bogosy"
```

### Frontend — `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
