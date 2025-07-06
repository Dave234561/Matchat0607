# Chat Parisien - Jeu de Plateforme 🐱🗼

Un jeu de plateforme 2D mettant en scène un chat orange aventurier qui explore les toits de Paris et combat différents ennemis pour sauver la ville !

## 🎮 Description du Jeu

Incarnez un chat orange courageux qui parcourt les toits parisiens emblématiques. Votre mission : traverser 5 niveaux remplis d'ennemis et affronter l'ours boss final pour sauver Paris !

### 🏙️ Univers
- **Décor** : Toits de Paris avec la Tour Eiffel en arrière-plan
- **Style** : Pixel art coloré et cartoon
- **Ambiance** : Aventure urbaine parisienne

### 🐾 Personnage Principal
- **Chat orange** avec rayures foncées et ventre blanc
- **Yeux verts** expressifs
- **Animations complètes** : repos, course, saut, attaques

## 🎯 Gameplay

### Contrôles
- **Flèches Gauche/Droite** : Déplacement
- **Flèche Haut / Espace** : Saut
- **Ctrl Gauche** : Attaque pattes avant
- **Ctrl Droit** : Attaque pattes arrière
- **Échap** : Pause

### Mécaniques
- **Physique réaliste** : Gravité, collisions, friction
- **Système de vie** : 3 cœurs par défaut
- **Score** : Points pour chaque ennemi vaincu
- **Progression** : 5 niveaux avec difficulté croissante

## 👾 Ennemis

1. **Souris méchantes** (10 pts) - Rapides et nombreuses
2. **Petits chiens** (20 pts) - Sautent occasionnellement
3. **Gros chats** (50 pts) - Poursuivent le joueur
4. **Poissons** (25 pts) - Mouvement ondulant
5. **Écureuils** (15 pts) - Sautent fréquemment
6. **Ours Boss** (200 pts) - Attaques de charge

## 🗺️ Niveaux

1. **Toits de Montmartre** - Introduction avec souris
2. **Quartier Latin** - Ajout des chiens
3. **Les Grands Boulevards** - Gros chats et défis
4. **Bois de Boulogne** - Tous les ennemis mélangés
5. **Tanière de l'Ours** - Combat final contre le boss

## 🚀 Installation et Lancement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Aucune installation requise !

### Lancement
1. Ouvrez le fichier `index.html` dans votre navigateur
2. Le jeu se charge automatiquement
3. Utilisez les contrôles pour jouer

### Structure des Fichiers
```
cat-platformer/
├── index.html              # Page principale
├── js/
│   ├── game.js             # Moteur de jeu
│   ├── player.js           # Logique du joueur
│   ├── enemies.js          # Classes d'ennemis
│   ├── level.js            # Gestionnaire de niveaux
│   └── main.js             # Initialisation
├── sprites/
│   ├── cat/                # Animations du chat
│   ├── enemies/            # Sprites des ennemis
│   └── environment/        # Décors parisiens
└── specifications.md       # Documentation technique
```

## 🎨 Caractéristiques Techniques

- **Résolution** : 1200x600 pixels
- **FPS** : 60 images par seconde
- **Technologie** : HTML5 Canvas + JavaScript
- **Sprites** : PNG avec transparence
- **Compatible** : Tous navigateurs modernes

## 🏆 Objectifs et Scoring

- **Objectif principal** : Terminer tous les niveaux
- **Objectif secondaire** : Obtenir le meilleur score
- **Bonus** : Finir sans perdre de vie

### Système de Points
- Souris : 10 points
- Écureuils : 15 points
- Chiens : 20 points
- Poissons : 25 points
- Gros chats : 50 points
- Ours boss : 200 points

## 🛠️ Fonctionnalités Avancées

### Système d'Animation
- **Animations fluides** pour tous les personnages
- **Transitions naturelles** entre les états
- **Effets visuels** pour les attaques et destructions

### Intelligence Artificielle
- **Patrouilles** pour les ennemis de base
- **Poursuite** pour les gros chats
- **Comportements spéciaux** pour chaque type d'ennemi

### Interface Utilisateur
- **Score en temps réel**
- **Indicateur de vie**
- **Écrans de pause, victoire et défaite**
- **Instructions intégrées**

## 🎵 Améliorations Futures

- Effets sonores et musique
- Niveaux supplémentaires
- Nouveaux types d'ennemis
- Power-ups et collectibles
- Mode multijoueur local

## 🐛 Debug et Développement

### Fonctions Debug (Console)
```javascript
window.debugGame.skipLevel()    // Passer au niveau suivant
window.debugGame.addScore(100)  // Ajouter des points
window.debugGame.godMode()      // Mode invincible
window.debugGame.showInfo()     // Infos du niveau actuel
```

## 👨‍💻 Crédits

- **Développement** : Manus AI
- **Concept** : Jeu de plateforme parisien
- **Art Style** : Pixel art cartoon
- **Inspiration** : Toits de Paris et culture française

## 📝 Licence

Ce jeu est créé à des fins éducatives et de divertissement. Tous les assets visuels sont générés spécifiquement pour ce projet.

---

**Amusez-vous bien en explorant les toits de Paris avec notre chat orange ! 🐱🇫🇷**

