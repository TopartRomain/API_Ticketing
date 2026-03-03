# 🎫 API REST Ticketing — Nexora Dynamics

API REST complète pour la gestion centralisée des tickets internes (bugs, demandes d'accès, matériel, incidents).

## 📋 Contexte

Cette API a été développée pour **Nexora Dynamics**, une société de conseil en transformation digitale de 120 collaborateurs. Elle centralise et structure les demandes internes, actuellement dispersées entre emails et Slack.

## ✨ Fonctionnalités

- **Gestion des utilisateurs** : inscription, connexion, profils avec rôles (Collaborateur, Support, Manager)
- **Gestion des tickets** : création, consultation, filtrage, assignation, suivi
- **Contrôle d'accès par rôle** : visibilité et actions adaptées selon le rôle
- **Système de commentaires** : commentaires publics et internes (support uniquement)
- **Règles métier strictes** : transitions de statut, priorités, permissions

---

## 🚀 Installation

### Prérequis

- **Node.js** >= 16
- **MongoDB** en local ou distant (Atlas, etc.)

### Étapes

1. **Cloner le projet**
```bash
git clone https://github.com/TopartRomain/API_Ticketing.git
cd API_Ticketing
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Modifier le fichier `.env` :
```env
PORT=3000
NODE_ENV=development

# MongoDB (adapter selon votre installation)
DB_URI=mongodb://localhost:27017/api_ticketing

# JWT (IMPORTANT : changer en production !)
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi_en_production
JWT_EXPIRES_IN=7d
```

4. **Lancer MongoDB** (si en local)
```bash
# macOS avec Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows : démarrer le service MongoDB
```

5. **Démarrer l'API**
```bash
# Mode production
npm start

# Mode développement (avec nodemon)
npm run dev
```

L'API sera disponible sur **http://localhost:3000**

---

## 📁 Architecture du projet

```
API_Ticketing/
├── src/
│   ├── config/
│   │   └── db.js                    # Connexion MongoDB
│   ├── controllers/
│   │   ├── authController.js        # Authentification
│   │   ├── ticketController.js      # CRUD tickets
│   │   └── commentController.js     # Commentaires
│   ├── middlewares/
│   │   ├── auth.js                  # Vérification JWT
│   │   ├── roleGuard.js             # Contrôle d'accès par rôle
│   │   ├── errorHandler.js          # Gestion globale des erreurs
│   │   └── notFound.js              # Route 404
│   ├── models/
│   │   ├── User.js                  # Modèle utilisateur
│   │   ├── Ticket.js                # Modèle ticket
│   │   └── Comment.js               # Modèle commentaire
│   ├── routes/
│   │   ├── authRoutes.js            # Routes auth
│   │   └── ticketRoutes.js          # Routes tickets + commentaires
│   ├── services/
│   │   ├── authService.js           # Logique authentification
│   │   ├── ticketService.js         # Logique métier tickets
│   │   └── commentService.js        # Logique commentaires
│   ├── utils/
│   │   └── statusTransitions.js     # Règles de transition de statut
│   └── app.js                       # Configuration Express
├── index.js                         # Point d'entrée
├── .env                             # Variables d'environnement
├── .gitignore
├── package.json
└── README.md
```

---

## 🎭 Rôles et permissions

### 👤 Collaborateur
- ✅ Créer des tickets
- ✅ Consulter **ses propres tickets**
- ✅ Commenter ses tickets
- ✅ Annuler un ticket (si statut = `open`)
- ✅ Clôturer un ticket (si statut = `resolved`)
- ❌ Ne peut **pas** créer un ticket en priorité `critical`

### 🛠️ Support
- ✅ Voir **tous les tickets**
- ✅ Assigner un ticket à un membre du support
- ✅ Changer le statut des tickets (selon transitions autorisées)
- ✅ Ajouter des commentaires (publics ou **internes**)
- ❌ Ne peut **pas** modifier la priorité

### 👔 Manager
- ✅ Voir les tickets **de son équipe** (même `team`)
- ✅ **Modifier la priorité** des tickets de son équipe
- ❌ Ne peut **pas** traiter techniquement un ticket

---

## 📊 Structure des données

### Ticket
| Champ         | Type     | Valeurs possibles                                      |
|---------------|----------|--------------------------------------------------------|
| `title`       | String   | —                                                      |
| `description` | String   | —                                                      |
| `category`    | String   | `bug`, `access`, `materiel`, `autre`                   |
| `priority`    | String   | `low`, `medium`, `high`, `critical`                    |
| `status`      | String   | `open`, `assigned`, `in_progress`, `resolved`, `closed`, `cancelled` |
| `author`      | ObjectId | Ref → User                                             |
| `assignedTo`  | ObjectId | Ref → User (support uniquement)                        |

### User
| Champ      | Type   | Valeurs possibles                   |
|------------|--------|-------------------------------------|
| `name`     | String | —                                   |
| `email`    | String | —                                   |
| `password` | String | (hashé avec bcrypt)                 |
| `role`     | String | `collaborateur`, `support`, `manager` |
| `team`     | String | Nom de l'équipe (ex: "Engineering") |

### Comment
| Champ      | Type     | Description                                  |
|------------|----------|----------------------------------------------|
| `ticket`   | ObjectId | Ref → Ticket                                 |
| `author`   | ObjectId | Ref → User                                   |
| `content`  | String   | Contenu du commentaire                       |
| `internal` | Boolean  | `true` = visible uniquement par le support   |

---

## 🔄 Règles métier

### Transitions de statut autorisées

| De           | Vers          | Rôles autorisés                   | Restriction              |
|--------------|---------------|-----------------------------------|--------------------------|
| `open`       | `assigned`    | `support`                         | —                        |
| `open`       | `cancelled`   | `collaborateur`, `support`, `manager` | **Auteur uniquement**    |
| `assigned`   | `in_progress` | `support`                         | —                        |
| `in_progress`| `resolved`    | `support`                         | —                        |
| `resolved`   | `closed`      | `support`, `collaborateur`        | —                        |

**Toute autre transition est refusée.**

### Priorités
- Un **collaborateur** ne peut pas créer de ticket `critical`
- Seul un **manager** peut modifier la priorité
- Le **support** ne peut **pas** modifier la priorité

### Commentaires
- Tout utilisateur avec accès au ticket peut commenter
- Seul le **support** peut marquer un commentaire comme `internal`
- Les commentaires internes ne sont **visibles que par le support**

---

## 🔗 Documentation API

### Base URL
```
http://localhost:3000/api
```

---

### 🔐 Authentification

#### **POST** `/auth/register`
Créer un nouvel utilisateur.

**Body** :
```json
{
  "name": "Alice Dupont",
  "email": "alice@nexora.com",
  "password": "motdepasse123",
  "role": "collaborateur",
  "team": "Engineering"
}
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Alice Dupont",
      "email": "alice@nexora.com",
      "role": "collaborateur",
      "team": "Engineering"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### **POST** `/auth/login`
Se connecter.

**Body** :
```json
{
  "email": "alice@nexora.com",
  "password": "motdepasse123"
}
```

**Réponse** : Identique à `/register`

---

#### **GET** `/auth/me`
Obtenir le profil de l'utilisateur connecté.

**Headers** :
```
Authorization: Bearer <token>
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Alice Dupont",
    "email": "alice@nexora.com",
    "role": "collaborateur",
    "team": "Engineering"
  }
}
```

---

### 🎫 Tickets

> **Toutes les routes tickets nécessitent un JWT** (`Authorization: Bearer <token>`)

#### **POST** `/tickets`
Créer un ticket.

**Body** :
```json
{
  "title": "Mon PC ne démarre plus",
  "description": "Écran noir au démarrage depuis ce matin",
  "category": "materiel",
  "priority": "high"
}
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Mon PC ne démarre plus",
    "description": "Écran noir au démarrage depuis ce matin",
    "category": "materiel",
    "priority": "high",
    "status": "open",
    "author": { "_id": "...", "name": "Alice Dupont", "email": "alice@nexora.com" },
    "assignedTo": null,
    "createdAt": "2026-03-03T10:30:00.000Z",
    "updatedAt": "2026-03-03T10:30:00.000Z"
  }
}
```

---

#### **GET** `/tickets`
Lister les tickets (selon le rôle de l'utilisateur).

**Query params** (optionnels) :
- `status` : `open`, `assigned`, `in_progress`, `resolved`, `closed`, `cancelled`
- `priority` : `low`, `medium`, `high`, `critical`
- `category` : `bug`, `access`, `materiel`, `autre`

**Exemple** :
```
GET /tickets?status=open&priority=high
```

**Réponse** :
```json
{
  "success": true,
  "count": 5,
  "data": [ /* tableau de tickets */ ]
}
```

---

#### **GET** `/tickets/:id`
Consulter un ticket.

**Réponse** : Objet ticket avec auteur et assigné peuplés.

---

#### **PATCH** `/tickets/:id/status`
Modifier le statut d'un ticket (selon règles de transition).

**Body** :
```json
{
  "status": "assigned"
}
```

**Réponse** : Ticket mis à jour.

---

#### **PATCH** `/tickets/:id/priority`
Modifier la priorité (réservé aux **managers**).

**Body** :
```json
{
  "priority": "critical"
}
```

**Réponse** : Ticket mis à jour.

---

#### **PATCH** `/tickets/:id/assign`
Assigner un ticket à un membre du support (réservé au **support**).

**Body** :
```json
{
  "assignedTo": "64abc123..." 
}
```

**Réponse** : Ticket mis à jour (statut passe automatiquement à `assigned` si `open`).

---

### 💬 Commentaires

#### **POST** `/tickets/:id/comments`
Ajouter un commentaire.

**Body** :
```json
{
  "content": "J'ai redémarré le PC mais le problème persiste",
  "internal": false
}
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "ticket": "...",
    "author": { "_id": "...", "name": "Alice Dupont" },
    "content": "J'ai redémarré le PC mais le problème persiste",
    "internal": false,
    "createdAt": "2026-03-03T11:00:00.000Z"
  }
}
```

---

#### **GET** `/tickets/:id/comments`
Lister les commentaires d'un ticket.

**Réponse** :
```json
{
  "success": true,
  "count": 3,
  "data": [ /* tableau de commentaires */ ]
}
```

---

## 🧪 Scénario de test complet

### 1. Créer 3 utilisateurs

**Collaborateur** :
```bash
POST /api/auth/register
{
  "name": "Alice Dupont",
  "email": "alice@nexora.com",
  "password": "password123",
  "role": "collaborateur",
  "team": "Engineering"
}
```

**Manager** :
```bash
POST /api/auth/register
{
  "name": "Bob Martin",
  "email": "bob@nexora.com",
  "password": "password123",
  "role": "manager",
  "team": "Engineering"
}
```

**Support** :
```bash
POST /api/auth/register
{
  "name": "Clara Support",
  "email": "clara@nexora.com",
  "password": "password123",
  "role": "support"
}
```

### 2. Alice crée un ticket

```bash
POST /api/tickets
Authorization: Bearer <token_alice>
{
  "title": "Accès refusé au serveur Git",
  "description": "Je ne peux plus push mes commits",
  "category": "access",
  "priority": "high"
}
```

### 3. Clara (support) assigne le ticket

```bash
PATCH /api/tickets/<ticket_id>/assign
Authorization: Bearer <token_clara>
{
  "assignedTo": "<id_clara>"
}
```

### 4. Clara passe le ticket en traitement

```bash
PATCH /api/tickets/<ticket_id>/status
Authorization: Bearer <token_clara>
{
  "status": "in_progress"
}
```

### 5. Clara ajoute un commentaire interne

```bash
POST /api/tickets/<ticket_id>/comments
Authorization: Bearer <token_clara>
{
  "content": "Problème de droits SSH, en cours de correction",
  "internal": true
}
```

### 6. Bob (manager) augmente la priorité

```bash
PATCH /api/tickets/<ticket_id>/priority
Authorization: Bearer <token_bob>
{
  "priority": "critical"
}
```

### 7. Clara résout le ticket

```bash
PATCH /api/tickets/<ticket_id>/status
Authorization: Bearer <token_clara>
{
  "status": "resolved"
}
```

### 8. Alice clôture le ticket

```bash
PATCH /api/tickets/<ticket_id>/status
Authorization: Bearer <token_alice>
{
  "status": "closed"
}
```

---

## 🧑‍💻 Emplacements des règles métier

| Règle                                          | Fichier                          | Fonction/Section       |
|------------------------------------------------|-----------------------------------|------------------------|
| Transitions de statut autorisées              | `src/utils/statusTransitions.js` | `canTransition()`      |
| Collaborateur ne peut pas créer `critical`    | `src/services/ticketService.js`  | `create()`             |
| Manager peut modifier priorité                | `src/services/ticketService.js`  | `updatePriority()`     |
| Support peut assigner                         | `src/services/ticketService.js`  | `assign()`             |
| Visibilité par rôle                           | `src/services/ticketService.js`  | `list()`, `_checkVisibility()` |
| Commentaires internes (support uniquement)    | `src/services/commentService.js` | `add()`, `listByTicket()` |

---

## 📦 Dépendances principales

- **express** : framework web
- **mongoose** : ODM MongoDB
- **bcryptjs** : hashage des mots de passe
- **jsonwebtoken** : authentification JWT
- **dotenv** : variables d'environnement
- **cors** : gestion CORS
- **morgan** : logs HTTP

---

## 🔒 Sécurité

- ✅ Mots de passe hashés avec **bcrypt** (12 rounds)
- ✅ Authentification par **JWT**
- ✅ Validation des données avec Mongoose
- ⚠️ **IMPORTANT** : Changer `JWT_SECRET` en production !

---

## 🛠️ Commandes NPM

```bash
npm start        # Lance le serveur en mode production
npm run dev      # Lance le serveur avec nodemon (auto-reload)
```

---

## 📝 Auteur

Développé pour **Nexora Dynamics** dans le cadre du mini-projet API REST Ticketing.

---

## 📄 Licence

ISC
