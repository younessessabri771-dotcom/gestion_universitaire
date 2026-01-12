# Guide: Publier sur GitHub 🚀

## Étape 1: Créer un dépôt sur GitHub

1. Allez sur https://github.com
2. Cliquez sur le bouton **"New"** (ou **"+"** en haut à droite → New repository)
3. Remplissez:
   - **Repository name**: `gestion-universitaire` (ou le nom de votre choix)
   - **Description**: "Système de gestion universitaire avec Node.js et MySQL"
   - **Public** ou **Private** (selon votre préférence)
   - ⚠️ **Ne cochez PAS** "Add a README file" (vous en avez déjà un)
4. Cliquez sur **"Create repository"**

---

## Étape 2: Initialiser Git localement

Ouvrez un terminal PowerShell dans le dossier du projet:

```powershell
cd "c:\Users\PC\OneDrive\Desktop\gestion scolairev8"
```

### Initialiser Git

```bash
git init
```

### Ajouter tous les fichiers

```bash
git add .
```

### Créer le premier commit

```bash
git commit -m "Initial commit: Système de gestion universitaire complet"
```

---

## Étape 3: Lier au dépôt GitHub

Remplacez `VOTRE-USERNAME` par votre nom d'utilisateur GitHub:

```bash
git remote add origin https://github.com/VOTRE-USERNAME/gestion-universitaire.git
```

### Définir la branche principale

```bash
git branch -M main
```

### Pousser vers GitHub

```bash
git push -u origin main
```

---

## Étape 4: Vérifier

1. Retournez sur votre dépôt GitHub
2. Rafraîchissez la page
3. Vous devriez voir tous vos fichiers! 🎉

---

## 🔐 Important: Fichiers sensibles

Le fichier `.env` est déjà dans `.gitignore`, donc vos identifiants MySQL et JWT_SECRET **ne seront PAS** publiés sur GitHub. ✅

**Sur le dépôt GitHub, ajoutez un fichier `.env.example`:**

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=gestion_universitaire
JWT_SECRET=votre_secret_securise
```

---

## 📝 Commandes utiles pour la suite

### Ajouter des modifications

```bash
git add .
git commit -m "Description des changements"
git push
```

### Voir l'état

```bash
git status
```

### Historique des commits

```bash
git log
```

---

## 🎨 Améliorer votre README

Ajoutez des badges, captures d'écran, et GIFs pour rendre votre projet plus attractif!

Visitez: https://shields.io pour créer des badges personnalisés.

---

**Bon courage! 🚀**
