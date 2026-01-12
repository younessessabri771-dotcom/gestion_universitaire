# 🎓 Système de Gestion Universitaire

Application web complète de gestion universitaire avec Node.js, MySQL et design moderne glassmorphism.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Fonctionnalités

### 👨‍💼 Interface Administrateur
- ✅ Inscription et connexion sécurisée
- ✅ Gestion complète des classes (CRUD)
- ✅ Gestion des étudiants (créer, modifier, supprimer)
- ✅ Gestion des matières
- ✅ **Système de notes dual:**
  - Mode Simple: note globale (ex: "15/20")
  - Mode Contrôles: notes multiples par matière avec calcul automatique de moyenne
- ✅ Dashboard interactif avec interface à onglets

### 👨‍🎓 Interface Étudiant
- ✅ Connexion sécurisée
- ✅ Visualisation des informations personnelles
- ✅ Consultation des notes par matière
- ✅ Affichage intelligent selon le type de notes
- ✅ Calcul automatique des moyennes pour les contrôles

## 🎨 Design

- **Glassmorphism** moderne avec effets de transparence
- **Gradients animés** pour un look dynamique
- **Palette vibrante** (Violet, Rose, Turquoise)
- **Animations fluides** et transitions élégantes
- **100% Responsive** (Mobile, Tablette, Desktop)

## 🛠️ Technologies

- **Backend:** Node.js, Express.js
- **Base de données:** MySQL
- **Authentification:** JWT, bcrypt
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript ES6+
- **Design:** CSS personnalisé avec glassmorphism

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/gestion-universitaire.git
cd gestion-universitaire
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=gestion_universitaire
JWT_SECRET=votre_secret_jwt_tres_securise
```

### 4. Initialiser la base de données

Exécutez le script SQL:

```bash
mysql -u root -p < config/init-db.sql
```

Ou importez `config/init-db.sql` via phpMyAdmin/MySQL Workbench.

### 5. Exécuter la migration (système de notes dual)

```bash
mysql -u root -p gestion_universitaire < config/migration-dual-grades.sql
```

### 6. Lancer l'application

```bash
npm start
```

L'application sera accessible sur **http://localhost:3000** 🎉

## 📁 Structure du Projet

```
gestion-universitaire/
├── config/
│   ├── database.js              # Configuration MySQL
│   ├── init-db.sql              # Initialisation DB
│   └── migration-dual-grades.sql # Migration notes dual
├── middleware/
│   └── auth.js                  # Authentification JWT
├── models/
│   ├── Admin.js                 # Modèle Admin
│   ├── Classe.js                # Modèle Classe
│   ├── Etudiant.js              # Modèle Étudiant
│   ├── Matiere.js               # Modèle Matière
│   └── Grade.js                 # Modèle Note
├── routes/
│   ├── admin.js                 # Routes admin
│   ├── classes.js               # Routes classes
│   ├── matieres.js              # Routes matières
│   ├── students.js              # Routes étudiants
│   └── grades.js                # Routes notes
├── public/
│   ├── css/style.css            # Design system
│   ├── admin/                   # Interface admin
│   ├── student/                 # Interface étudiant
│   └── index.html               # Page d'accueil
├── server.js                    # Serveur Express
├── package.json
└── .env                         # Variables d'environnement
```

## 🔐 Sécurité

- ✅ Mots de passe hashés avec **bcrypt** (10 rounds)
- ✅ Authentification par **JSON Web Tokens (JWT)**
- ✅ Protection des routes par rôle (admin/student)
- ✅ Requêtes préparées MySQL (protection contre injections SQL)
- ✅ Variables sensibles dans fichier `.env`
- ✅ CORS configuré

## 📊 Base de Données

### Modèle de données (MCD)

- **admin**: Administrateurs
- **classe**: Classes universitaires
- **matiere**: Matières enseignées
- **etudiant**: Étudiants
- **etudier_dans**: Relation étudiant-classe (1:1)
- **etudier**: Notes des étudiants (supporte notes simples et contrôles multiples)

## 🎯 Utilisation

### Première connexion Admin

1. Accédez à http://localhost:3000
2. Cliquez sur **"Administrateur"**
3. Créez un compte via **"S'inscrire"**
4. Connectez-vous avec vos identifiants

### Gestion des Notes

**Mode Simple:**
- Sélectionnez "Mode Simple" dans l'onglet Notes
- Ajoutez une note globale (ex: "15/20")

**Mode Contrôles:**
- Sélectionnez "Mode Contrôles"
- Choisissez le type (Premier contrôle, Deuxième contrôle, etc.)
- Entrez la note numérique (0-20)
- La moyenne est calculée automatiquement

### Connexion Étudiant

1. L'admin doit d'abord créer votre compte
2. Connectez-vous avec les identifiants fournis
3. Consultez vos informations et notes

## 🎨 Captures d'écran

*(Ajoutez vos captures d'écran ici)*

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Créé avec ❤️ par [Votre Nom]

## 🙏 Remerciements

- Design inspiré par les tendances modernes de glassmorphism
- Merci à la communauté Node.js et MySQL

---

⭐ **N'oubliez pas de mettre une étoile si ce projet vous a aidé!** ⭐
