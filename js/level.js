// Gestionnaire de niveaux
class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevel = 1;
        this.maxLevel = 5;
        this.levelData = this.createLevelData();
    }
    
    createLevelData() {
        return {
            1: {
                name: "Toits de Montmartre",
                description: "Première aventure sur les toits parisiens",
                platforms: [
                    // Sol principal
                    ...this.createPlatformRow(0, this.game.height - 64, 25),
                    // Plateformes en hauteur
                    ...this.createPlatformRow(5, this.game.height - 200, 5),
                    ...this.createPlatformRow(12, this.game.height - 300, 5),
                    ...this.createPlatformRow(20, this.game.height - 250, 3),
                ],
                enemies: [
                    { type: 'Mouse', x: 300, y: this.game.height - 100 },
                    { type: 'Mouse', x: 500, y: this.game.height - 100 },
                    { type: 'Mouse', x: 800, y: this.game.height - 100 },
                    { type: 'Mouse', x: 1200, y: this.game.height - 100 },
                ],
                collectibles: [],
                background: 'paris_rooftop'
            },
            
            2: {
                name: "Quartier Latin",
                description: "Les chiens gardent leur territoire",
                platforms: [
                    ...this.createPlatformRow(0, this.game.height - 64, 30),
                    ...this.createPlatformRow(3, this.game.height - 180, 4),
                    ...this.createPlatformRow(10, this.game.height - 280, 6),
                    ...this.createPlatformRow(18, this.game.height - 200, 4),
                    ...this.createPlatformRow(25, this.game.height - 320, 5),
                ],
                enemies: [
                    { type: 'Mouse', x: 200, y: this.game.height - 100 },
                    { type: 'Dog', x: 600, y: this.game.height - 100 },
                    { type: 'Mouse', x: 900, y: this.game.height - 100 },
                    { type: 'Dog', x: 1300, y: this.game.height - 100 },
                    { type: 'Mouse', x: 1600, y: this.game.height - 100 },
                ],
                collectibles: [],
                background: 'paris_rooftop'
            },
            
            3: {
                name: "Les Grands Boulevards",
                description: "Les gros chats défendent leur territoire",
                platforms: [
                    ...this.createPlatformRow(0, this.game.height - 64, 35),
                    ...this.createPlatformRow(2, this.game.height - 160, 3),
                    ...this.createPlatformRow(8, this.game.height - 240, 4),
                    ...this.createPlatformRow(15, this.game.height - 320, 5),
                    ...this.createPlatformRow(22, this.game.height - 180, 3),
                    ...this.createPlatformRow(28, this.game.height - 280, 4),
                ],
                enemies: [
                    { type: 'Mouse', x: 150, y: this.game.height - 100 },
                    { type: 'Dog', x: 400, y: this.game.height - 100 },
                    { type: 'BigCat', x: 800, y: this.game.height - 100 },
                    { type: 'Mouse', x: 1100, y: this.game.height - 100 },
                    { type: 'Dog', x: 1400, y: this.game.height - 100 },
                    { type: 'BigCat', x: 1800, y: this.game.height - 100 },
                ],
                collectibles: [],
                background: 'paris_rooftop'
            },
            
            4: {
                name: "Bois de Boulogne",
                description: "Tous les ennemis se rassemblent",
                platforms: [
                    ...this.createPlatformRow(0, this.game.height - 64, 40),
                    ...this.createPlatformRow(1, this.game.height - 140, 2),
                    ...this.createPlatformRow(5, this.game.height - 220, 3),
                    ...this.createPlatformRow(10, this.game.height - 300, 4),
                    ...this.createPlatformRow(16, this.game.height - 180, 3),
                    ...this.createPlatformRow(21, this.game.height - 260, 4),
                    ...this.createPlatformRow(27, this.game.height - 340, 3),
                    ...this.createPlatformRow(32, this.game.height - 200, 4),
                ],
                enemies: [
                    { type: 'Mouse', x: 100, y: this.game.height - 100 },
                    { type: 'Mouse', x: 300, y: this.game.height - 100 },
                    { type: 'Dog', x: 500, y: this.game.height - 100 },
                    { type: 'BigCat', x: 700, y: this.game.height - 100 },
                    { type: 'Mouse', x: 1000, y: this.game.height - 100 },
                    { type: 'Dog', x: 1300, y: this.game.height - 100 },
                    { type: 'BigCat', x: 1600, y: this.game.height - 100 },
                    { type: 'Mouse', x: 1900, y: this.game.height - 100 },
                    { type: 'Dog', x: 2200, y: this.game.height - 100 },
                ],
                collectibles: [],
                background: 'paris_rooftop'
            },
            
            5: {
                name: "Tanière de l'Ours - Boss Final",
                description: "Affrontement final contre l'ours géant",
                platforms: [
                    ...this.createPlatformRow(0, this.game.height - 64, 20),
                    ...this.createPlatformRow(3, this.game.height - 180, 3),
                    ...this.createPlatformRow(8, this.game.height - 280, 4),
                    ...this.createPlatformRow(14, this.game.height - 180, 3),
                ],
                enemies: [
                    { type: 'Bear', x: 800, y: this.game.height - 192 }, // Boss au centre
                ],
                collectibles: [],
                background: 'paris_rooftop'
            }
        };
    }
    
    createPlatformRow(startX, y, count) {
        const platforms = [];
        for (let i = 0; i < count; i++) {
            platforms.push({
                x: (startX + i) * 64,
                y: y,
                width: 64,
                height: 64
            });
        }
        return platforms;
    }
    
    loadLevel(levelNumber) {
        if (levelNumber < 1 || levelNumber > this.maxLevel) {
            console.error(`Niveau ${levelNumber} n'existe pas`);
            return false;
        }
        
        this.currentLevel = levelNumber;
        const level = this.levelData[levelNumber];
        
        // Nettoyer le niveau actuel
        this.game.platforms = [];
        this.game.enemies = [];
        this.game.collectibles = [];
        this.game.particles = [];
        
        // Créer les plateformes
        level.platforms.forEach(platformData => {
            this.game.platforms.push(new Platform(
                platformData.x,
                platformData.y,
                platformData.width,
                platformData.height,
                this.game
            ));
        });
        
        // Créer les ennemis
        level.enemies.forEach(enemyData => {
            let enemy;
            switch (enemyData.type) {
                case 'Mouse':
                    enemy = new Mouse(enemyData.x, enemyData.y, this.game);
                    break;
                case 'Dog':
                    enemy = new Dog(enemyData.x, enemyData.y, this.game);
                    break;
                case 'BigCat':
                    enemy = new BigCat(enemyData.x, enemyData.y, this.game);
                    break;
                case 'Bear':
                    enemy = new Bear(enemyData.x, enemyData.y, this.game);
                    break;
                default:
                    console.warn(`Type d'ennemi inconnu: ${enemyData.type}`);
                    return; // Utiliser return au lieu de continue dans forEach
            }
            this.game.enemies.push(enemy);
        });
        
        // Réinitialiser la position du joueur
        this.game.player.x = 100;
        this.game.player.y = 400;
        this.game.player.vx = 0;
        this.game.player.vy = 0;
        this.game.player.health = this.game.player.maxHealth;
        this.game.lives = this.game.player.health;
        
        // Réinitialiser la caméra
        this.game.camera.x = 0;
        this.game.camera.y = 0;
        
        console.log(`Niveau ${levelNumber} chargé: ${level.name}`);
        return true;
    }
    
    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            return this.loadLevel(this.currentLevel + 1);
        } else {
            // Jeu terminé !
            this.game.gameState = 'victory';
            return false;
        }
    }
    
    checkLevelComplete() {
        // Le niveau est terminé quand tous les ennemis sont vaincus
        const aliveEnemies = this.game.enemies.filter(enemy => !enemy.destroyed);
        return aliveEnemies.length === 0;
    }
    
    getCurrentLevelInfo() {
        const level = this.levelData[this.currentLevel];
        return {
            number: this.currentLevel,
            name: level.name,
            description: level.description,
            totalLevels: this.maxLevel
        };
    }
}

// Classe pour gérer les collectibles (bonus)
class Collectible extends GameObject {
    constructor(x, y, type, game) {
        super(x, y, 32, 32, game);
        this.type = type; // 'fish', 'heart', 'coin'
        this.value = this.getValueByType(type);
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.collected = false;
    }
    
    getValueByType(type) {
        switch (type) {
            case 'fish': return { health: 1, score: 50 };
            case 'heart': return { health: 1, score: 0 };
            case 'coin': return { health: 0, score: 100 };
            default: return { health: 0, score: 10 };
        }
    }
    
    update() {
        // Animation flottante
        this.animationTimer++;
        this.y += Math.sin(this.animationTimer * 0.1) * 0.5;
        
        // Vérifier la collision avec le joueur
        if (this.checkCollision(this.game.player) && !this.collected) {
            this.collect();
        }
    }
    
    collect() {
        this.collected = true;
        this.destroyed = true;
        
        // Appliquer les effets
        if (this.value.health > 0) {
            this.game.player.health = Math.min(
                this.game.player.health + this.value.health,
                this.game.player.maxHealth
            );
            this.game.lives = this.game.player.health;
        }
        
        if (this.value.score > 0) {
            this.game.score += this.value.score;
        }
        
        // Effet visuel
        for (let i = 0; i < 3; i++) {
            this.game.particles.push(new Particle(
                this.x + this.width / 2,
                this.y + this.height / 2,
                this.game
            ));
        }
    }
    
    render() {
        if (this.collected) return;
        
        const ctx = this.game.ctx;
        
        // Dessiner selon le type
        ctx.fillStyle = this.getColorByType();
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Contour
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    getColorByType() {
        switch (this.type) {
            case 'fish': return '#FF69B4';
            case 'heart': return '#FF69B4'; // Rose au lieu de rouge
            case 'coin': return '#FFD700';
            default: return '#00FF00';
        }
    }
}

