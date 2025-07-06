# Spécifications Techniques - Jeu de Plateforme Chat Orange

## Vue d'ensemble
Jeu de plateforme 2D en scrolling horizontal avec un chat orange comme personnage principal. Le joueur doit traverser plusieurs niveaux en combattant différents ennemis pour atteindre le boss final (ours).

## Caractéristiques du Chat Principal
- **Apparence**: Chat orange avec rayures, ventre blanc, yeux verts expressifs
- **Taille sprite**: 64x64 pixels pour compatibilité et fluidité
- **Animations requises**:
  - Idle (repos): 4 frames
  - Course: 6 frames
  - Saut: 3 phases (montée, apogée, descente)
  - Atterrissage: 2 frames
  - Attaque pattes avant: 4 frames
  - Attaque pattes arrière: 4 frames
  - Dégâts/recul: 2 frames

## Ennemis et Leurs Comportements
1. **Souris méchantes**: Petites, rapides, se déplacent au sol
2. **Petits chiens**: Taille moyenne, sautent parfois
3. **Gros chats**: Plus lents mais plus résistants
4. **Poissons**: Dans les zones aquatiques, mouvement ondulant
5. **Écureuils**: Sautent d'arbre en arbre, attaquent depuis le haut
6. **Ours (Boss)**: Grand, puissant, plusieurs attaques spéciales

## Contrôles
- **Flèches gauche/droite**: Déplacement
- **Flèche haut / Espace**: Saut
- **Ctrl gauche**: Attaque pattes avant
- **Ctrl droit**: Attaque pattes arrière
- **Échap**: Pause

## Mécaniques de Jeu
- **Vie**: 3 cœurs par défaut
- **Score**: Points pour ennemis vaincus
- **Collectibles**: Poissons pour récupérer de la vie
- **Plateformes**: Statiques et mobiles
- **Checkpoints**: Sauvegarde automatique

## Niveaux
1. **Toits de Paris**: Introduction, souris
2. **Parc urbain**: Chiens et écureuils
3. **Aquarium**: Poissons et gros chats
4. **Forêt**: Tous les ennemis mélangés
5. **Tanière de l'ours**: Boss final

## Spécifications Techniques
- **Résolution**: 1200x600 pixels
- **FPS**: 60 images par seconde
- **Format sprites**: PNG avec transparence
- **Moteur**: HTML5 Canvas + JavaScript
- **Compatibilité**: Navigateurs modernes

