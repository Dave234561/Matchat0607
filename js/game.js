// Moteur de jeu principal
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // État du jeu
        this.gameState = 'playing'; // playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Physique
        this.gravity = 0.8;
        this.friction = 0.85;
        
        // Caméra
        this.camera = {
            x: 0,
            y: 0
        };
        
        // Sprites chargés
        this.sprites = {};
        this.spritesLoaded = 0;
        this.totalSprites = 0;
        
        // Cache pour les sprites retournés (anti-clignotement)
        this.flippedSpritesCache = {};
        
        // Objets du jeu
        this.player = null;
        this.enemies = [];
        this.platforms = [];
        this.collectibles = [];
        this.particles = [];
        
        // Contrôles
        this.keys = {};
        this.setupControls();
        
        // Initialisation
        this.loadSprites();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Empêcher le défilement de la page
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    loadSprites() {
        const spriteList = [
            // Sprites du chat
            'sprites/cat/cat_idle_1.png',
            'sprites/cat/cat_idle_2.png',
            'sprites/cat/cat_idle_3.png',
            'sprites/cat/cat_idle_4.png',
            'sprites/cat/cat_run_1.png',
            'sprites/cat/cat_run_2.png',
            'sprites/cat/cat_jump_up.png',
            'sprites/cat/cat_jump_down.png',
            'sprites/cat/cat_attack_front.png',
            'sprites/cat/cat_attack_back.png',
            'sprites/cat/cat_idle_transparent.png',
            
            // Sprites des ennemis
            'sprites/enemies/mouse_idle.png',
            'sprites/enemies/dog_idle.png',
            'sprites/enemies/big_cat.png',
            'sprites/enemies/bear_boss.png',
            'sprites/enemies/squirrel_idle.png',
            'sprites/enemies/fish_idle.png',
            'sprites/enemies/mouse_transparent.png',
            'sprites/enemies/dog_transparent.png',
            'sprites/enemies/bear_transparent.png',
            'sprites/enemies/mouse_perfect.png',
            'sprites/enemies/dog_perfect.png',
            'sprites/enemies/bear_perfect.png',
            'sprites/cat/cat_new.png',
            'sprites/enemies/mouse_new.png',
            'sprites/enemies/dog_new.png',
            'sprites/enemies/bear_new.png',
            'sprites/cat/cat_final.png',
            'sprites/enemies/mouse_final.png',
            'sprites/enemies/dog_final.png',
            'sprites/enemies/bear_final.png',
            
            // Environnement
            'sprites/environment/paris_rooftop.png',
            'sprites/environment/paris_rooftop_seamless.png',
            'sprites/environment/platform_tile.png'
        ];
        
        this.totalSprites = spriteList.length;
        
        spriteList.forEach(src => {
            const img = new Image();
            img.onload = () => {
                this.spritesLoaded++;
                if (this.spritesLoaded === this.totalSprites) {
                    this.init();
                }
            };
            img.src = src;
            
            // Créer une clé pour le sprite
            const key = src.split('/').pop().replace('.png', '');
            this.sprites[key] = img;
        });
    }
    
    // Méthode pour obtenir un sprite retourné depuis le cache (anti-clignotement)
    getFlippedSprite(spriteName) {
        // Vérifier si le sprite retourné est déjà en cache
        if (this.flippedSpritesCache[spriteName]) {
            return this.flippedSpritesCache[spriteName];
        }
        
        // Obtenir le sprite original
        const originalSprite = this.sprites[spriteName];
        if (!originalSprite || !originalSprite.complete || originalSprite.naturalWidth === 0) {
            return null;
        }
        
        // Utiliser les dimensions naturelles du sprite
        const width = originalSprite.naturalWidth;
        const height = originalSprite.naturalHeight;
        
        // Créer le sprite retourné et le mettre en cache
        const flippedCanvas = document.createElement('canvas');
        flippedCanvas.width = width;
        flippedCanvas.height = height;
        const flippedCtx = flippedCanvas.getContext('2d');
        
        // S'assurer que le canvas est complètement transparent
        flippedCtx.clearRect(0, 0, width, height);
        flippedCtx.globalCompositeOperation = 'source-over';
        
        // Retourner horizontalement
        flippedCtx.scale(-1, 1);
        flippedCtx.drawImage(originalSprite, -width, 0, width, height);
        
        // Mettre en cache
        this.flippedSpritesCache[spriteName] = flippedCanvas;
        
        return flippedCanvas;
    }
    
    init() {
        console.log("Initialisation du jeu - début");
        
        // Créer le joueur
        this.player = new Player(100, 400, this);
        console.log("Joueur créé");
        
        // Créer les plateformes de base
        this.createBasicLevel();
        console.log("Niveau créé - Plateformes:", this.platforms.length, "Ennemis:", this.enemies.length);
        
        // Démarrer la boucle de jeu
        this.gameLoop();
        console.log("Boucle de jeu démarrée");
    }
    
    createBasicLevel() {
        // Sol principal étendu sur 6 largeurs d'écran (environ 112 plateformes)
        for (let i = 0; i < 112; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 64, 64, 64, this));
        }
        
        // Plateformes en hauteur - Section 1
        for (let i = 5; i < 15; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 200, 64, 64, this));
        }
        
        for (let i = 12; i < 22; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 300, 64, 64, this));
        }
        
        // Plateformes en hauteur - Section 2
        for (let i = 25; i < 35; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 180, 64, 64, this));
        }
        
        for (let i = 30; i < 40; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 280, 64, 64, this));
        }
        
        // Plateformes en hauteur - Section 3
        for (let i = 45; i < 55; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 220, 64, 64, this));
        }
        
        for (let i = 50; i < 60; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 320, 64, 64, this));
        }
        
        // Plateformes en hauteur - Section 4
        for (let i = 65; i < 75; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 160, 64, 64, this));
        }
        
        for (let i = 70; i < 80; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 260, 64, 64, this));
        }
        
        // Plateformes en hauteur - Section 5
        for (let i = 85; i < 95; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 200, 64, 64, this));
        }
        
        for (let i = 90; i < 100; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 300, 64, 64, this));
        }
        
        // Plateformes finales - Section 6
        for (let i = 105; i < 112; i++) {
            this.platforms.push(new Platform(i * 64, this.height - 240, 64, 64, this));
        }
        
        // Ajouter beaucoup plus d'ennemis répartis sur tout le niveau avec plus de variété
        // Section 1 (0-1600px) - Introduction
        this.enemies.push(new Mouse(300, this.height - 128, this)); // Sur le sol
        this.enemies.push(new Mouse(500, this.height - 128, this));
        this.enemies.push(new Dog(800, this.height - 128, this));
        this.enemies.push(new Mouse(1200, this.height - 128, this));
        this.enemies.push(new Squirrel(1500, this.height - 128, this));
        
        // Section 2 (1600-3200px) - Difficulté croissante
        this.enemies.push(new Dog(1800, this.height - 128, this));
        this.enemies.push(new Mouse(2100, this.height - 128, this));
        this.enemies.push(new Squirrel(2400, this.height - 128, this));
        this.enemies.push(new Dog(2700, this.height - 128, this));
        this.enemies.push(new BigCat(3000, this.height - 128, this));
        
        // Section 3 (3200-4800px) - Plus de défis
        this.enemies.push(new Mouse(3300, this.height - 128, this));
        this.enemies.push(new Dog(3600, this.height - 128, this));
        this.enemies.push(new Squirrel(3900, this.height - 128, this));
        this.enemies.push(new Mouse(4200, this.height - 128, this));
        this.enemies.push(new BigCat(4500, this.height - 128, this));
        this.enemies.push(new Dog(4800, this.height - 128, this));
        
        // Section 4 (4800-6400px) - Zone difficile
        this.enemies.push(new Squirrel(5100, this.height - 128, this));
        this.enemies.push(new Mouse(5400, this.height - 128, this));
        this.enemies.push(new Dog(5700, this.height - 128, this));
        this.enemies.push(new BigCat(6000, this.height - 128, this));
        this.enemies.push(new Squirrel(6300, this.height - 128, this));
        
        // Section 5 (6400-7200px) - Avant le boss
        this.enemies.push(new Dog(6600, this.height - 128, this));
        this.enemies.push(new BigCat(6900, this.height - 128, this));
        this.enemies.push(new Mouse(7200, this.height - 128, this));
        this.enemies.push(new Squirrel(7500, this.height - 128, this));
        
        // Section finale (7200px+) - Boss et gardes
        this.enemies.push(new Dog(7800, this.height - 128, this));
        this.enemies.push(new BigCat(8100, this.height - 128, this));
        this.enemies.push(new Bear(8400, this.height - 180, this)); // Boss final (plus grand)
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Mettre à jour le joueur
        this.player.update();
        
        // Mettre à jour les ennemis
        this.enemies.forEach(enemy => enemy.update());
        
        // Mettre à jour la caméra
        this.updateCamera();
        
        // Vérifier les collisions
        this.checkCollisions();
        
        // Nettoyer les objets détruits
        this.cleanup();
        
        // Mettre à jour l'interface
        this.updateUI();
    }
    
    updateCamera() {
        // Zone morte pour la caméra - le joueur peut se déplacer dans cette zone sans que la caméra bouge
        const deadZoneWidth = this.width * 0.4; // 40% de la largeur de l'écran
        const deadZoneLeft = this.width * 0.3;  // Commence à 30% de la gauche
        const deadZoneRight = this.width * 0.7; // Finit à 70% de la droite
        
        // Position actuelle du joueur à l'écran
        const playerScreenX = this.player.x - this.camera.x;
        
        let targetX = this.camera.x; // Par défaut, ne pas bouger la caméra
        
        // Si le joueur sort de la zone morte à droite
        if (playerScreenX > deadZoneRight) {
            targetX = this.player.x - deadZoneRight;
        }
        // Si le joueur sort de la zone morte à gauche
        else if (playerScreenX < deadZoneLeft) {
            targetX = this.player.x - deadZoneLeft;
        }
        
        const targetY = this.player.y - this.height * 0.7; // Placer le joueur à 70% de la hauteur au lieu de 50%
        
        // Calculer la largeur totale du niveau (environ 6 largeurs d'écran)
        const levelWidth = this.width * 6;
        
        // Limites de la caméra
        this.camera.x = Math.max(-this.width / 2, Math.min(levelWidth - this.width / 2, targetX));
        this.camera.y = Math.max(-100, Math.min(100, targetY)); // Permettre plus de mouvement vertical
    }
    
    checkCollisions() {
        // Collisions joueur-plateformes
        let playerHasCollision = false;
        this.platforms.forEach(platform => {
            if (this.player.checkCollision(platform)) {
                playerHasCollision = true;
                this.player.handlePlatformCollision(platform);
            }
        });
        
        // Réinitialiser onGround du joueur si pas de collision avec une plateforme
        if (!playerHasCollision && this.player.vy >= 0) {
            this.player.onGround = false;
        }
        
        // Collisions ennemis-plateformes (pour empêcher de tomber)
        this.enemies.forEach(enemy => {
            if (enemy.destroyed) return; // Ignorer les ennemis détruits
            
            let hasCollision = false;
            this.platforms.forEach(platform => {
                if (enemy.checkCollision(platform)) {
                    hasCollision = true;
                    
                    // Collision par le haut (ennemi atterrit sur la plateforme)
                    if (enemy.vy > 0 && enemy.y + enemy.height/2 < platform.y) {
                        enemy.y = platform.y - enemy.height;
                        enemy.vy = 0;
                        enemy.onGround = true;
                    }
                    // Collision par les côtés (ennemi change de direction) - plus stable
                    else if (Math.abs(enemy.vx) > 0) {
                        if (enemy.vx > 0 && enemy.x + enemy.width/2 < platform.x) {
                            enemy.x = platform.x - enemy.width;
                            enemy.direction = -1;
                            enemy.vx = 0; // Arrêter le mouvement momentanément
                        }
                        else if (enemy.vx < 0 && enemy.x + enemy.width/2 > platform.x + platform.width) {
                            enemy.x = platform.x + platform.width;
                            enemy.direction = 1;
                            enemy.vx = 0; // Arrêter le mouvement momentanément
                        }
                    }
                }
            });
            
            // Réinitialiser onGround si pas de collision
            if (!hasCollision && enemy.vy >= 0) {
                enemy.onGround = false;
            }
        });
        
        // Collisions joueur-ennemis
        this.enemies.forEach(enemy => {
            if (this.player.checkCollision(enemy) && !enemy.destroyed) {
                if (this.player.attacking) {
                    enemy.takeDamage();
                    this.score += enemy.points || 10;
                } else {
                    this.player.takeDamage();
                }
            }
        });
    }
    
    cleanup() {
        this.enemies = this.enemies.filter(enemy => !enemy.destroyed);
        this.particles = this.particles.filter(particle => !particle.destroyed);
    }
    
    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('livesValue').textContent = this.lives;
    }
    
    render() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Dessiner l'arrière-plan
        this.drawBackground();
        
        // Sauvegarder le contexte pour la caméra
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Dessiner les plateformes
        this.platforms.forEach(platform => platform.render());
        
        // Dessiner les ennemis
        this.enemies.forEach(enemy => enemy.render());
        
        // Dessiner le joueur
        this.player.render();
        
        // Dessiner les particules
        this.particles.forEach(particle => particle.render());
        
        // Restaurer le contexte
        this.ctx.restore();
    }
    
    drawBackground() {
        const ctx = this.ctx;
        
        // Dessiner l'arrière-plan parisien
        if (this.sprites['paris_rooftop_seamless']) {
            const bgSprite = this.sprites['paris_rooftop_seamless'];
            const bgWidth = bgSprite.naturalWidth || bgSprite.width;
            const bgHeight = bgSprite.naturalHeight || bgSprite.height;
            
            // Calculer la largeur totale du niveau
            const levelWidth = this.width * 6;
            
            // Couvrir toute la largeur du niveau, pas seulement la zone visible
            const startX = Math.floor(-this.width / bgWidth) * bgWidth;
            const endX = levelWidth + bgWidth;
            
            // Le fond doit commencer bien plus haut et descendre bien plus bas
            const bgStartY = this.camera.y - this.height; // Commencer un écran plus haut
            const bgTotalHeight = this.height * 3; // Trois fois la hauteur de l'écran
            
            // Dessiner le fond en répétant l'image sur toute la largeur du niveau
            for (let x = startX; x < endX; x += bgWidth) {
                // Dessiner le fond qui couvre une zone beaucoup plus grande
                ctx.drawImage(bgSprite, x, bgStartY, bgWidth, bgTotalHeight);
            }
        } else if (this.sprites['paris_rooftop']) {
            // Fallback vers l'ancien sprite si le nouveau n'est pas chargé
            const bgSprite = this.sprites['paris_rooftop'];
            const bgWidth = bgSprite.naturalWidth || bgSprite.width;
            const bgHeight = bgSprite.naturalHeight || bgSprite.height;
            
            const levelWidth = this.width * 6;
            const startX = Math.floor(-this.width / bgWidth) * bgWidth;
            const endX = levelWidth + bgWidth;
            const bgStartY = this.camera.y - this.height;
            const bgTotalHeight = this.height * 3;
            
            for (let x = startX; x < endX; x += bgWidth) {
                ctx.drawImage(bgSprite, x, bgStartY, bgWidth, bgTotalHeight);
            }
        } else {
            // Fallback si aucun sprite n'est chargé
            const levelWidth = this.width * 6;
            const gradient = ctx.createLinearGradient(0, 0, 0, this.height * 3);
            gradient.addColorStop(0, '#87CEEB');    // Bleu ciel
            gradient.addColorStop(0.7, '#B0E0E6');  // Bleu plus clair
            gradient.addColorStop(1, '#F0F8FF');    // Blanc cassé
            
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.width, this.camera.y - this.height, levelWidth + this.width * 2, this.height * 3);
        }
    }
    
    drawSimpleParisBackground(ctx) {
        // Nuages
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 8; i++) {
            const cloudX = (i * 200 - this.camera.x * 0.3) % (this.width + 200);
            const cloudY = 50 + (i % 3) * 40;
            
            ctx.beginPath();
            ctx.arc(cloudX, cloudY, 25, 0, Math.PI * 2);
            ctx.arc(cloudX + 20, cloudY, 30, 0, Math.PI * 2);
            ctx.arc(cloudX + 40, cloudY, 25, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Tour Eiffel
        const eiffelX = this.width / 2 - this.camera.x * 0.1;
        const eiffelY = this.height * 0.15;
        const eiffelHeight = this.height * 0.5;
        
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.moveTo(eiffelX, eiffelY + eiffelHeight);
        ctx.lineTo(eiffelX - 25, eiffelY + eiffelHeight);
        ctx.lineTo(eiffelX - 8, eiffelY);
        ctx.lineTo(eiffelX + 8, eiffelY);
        ctx.lineTo(eiffelX + 25, eiffelY + eiffelHeight);
        ctx.closePath();
        ctx.fill();
        
        // Bâtiments parisiens
        ctx.fillStyle = '#D2B48C';
        for (let i = 0; i < 12; i++) {
            const buildingX = (i * 120 - this.camera.x * 0.2) % (this.width + 240) - 120;
            const buildingHeight = 80 + (i % 4) * 30;
            const buildingY = this.height * 0.65 - buildingHeight;
            
            // Bâtiment principal
            ctx.fillRect(buildingX, buildingY, 100, buildingHeight);
            
            // Toit
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(buildingX - 5, buildingY - 15, 110, 20);
            
            // Fenêtres
            ctx.fillStyle = '#4169E1';
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < Math.floor(buildingHeight / 25); k++) {
                    ctx.fillRect(buildingX + 15 + j * 25, buildingY + 15 + k * 25, 12, 15);
                }
            }
            
            ctx.fillStyle = '#D2B48C';
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Classe de base pour les objets du jeu
class GameObject {
    constructor(x, y, width, height, game) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.game = game;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.destroyed = false;
    }
    
    checkCollision(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
    
    applyGravity() {
        if (!this.onGround) {
            this.vy += this.game.gravity;
        }
    }
    
    update() {
        this.applyGravity();
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.game.friction;
    }
    
    render() {
        // Méthode à surcharger dans les classes filles
    }
}

// Classe Platform
class Platform extends GameObject {
    constructor(x, y, width, height, game) {
        super(x, y, width, height, game);
        this.type = 'platform';
    }
    
    render() {
        const ctx = this.game.ctx;
        
        // Utiliser un rendu personnalisé sans fond blanc
        // Créer des tuiles de toit parisien authentiques
        const tileWidth = 40;
        const tileHeight = 40;
        
        // Dessiner tuile par tuile pour couvrir la plateforme
        for (let x = 0; x < this.width; x += tileWidth) {
            for (let y = 0; y < this.height; y += tileHeight) {
                const tileX = this.x + x;
                const tileY = this.y + y;
                const actualTileWidth = Math.min(tileWidth, this.width - x);
                const actualTileHeight = Math.min(tileHeight, this.height - y);
                
                // Tuile de toit parisien - ardoise grise
                ctx.fillStyle = '#4A5568';
                ctx.fillRect(tileX, tileY, actualTileWidth, actualTileHeight);
                
                // Bordure de tuile
                ctx.fillStyle = '#2D3748';
                ctx.fillRect(tileX, tileY, actualTileWidth, 3);
                ctx.fillRect(tileX, tileY, 3, actualTileHeight);
                
                // Effet de relief
                ctx.fillStyle = '#718096';
                ctx.fillRect(tileX + actualTileWidth - 2, tileY, 2, actualTileHeight);
                ctx.fillRect(tileX, tileY + actualTileHeight - 2, actualTileWidth, 2);
                
                // Partie rouge (brique) en bas
                if (y + tileHeight >= this.height - 10) {
                    ctx.fillStyle = '#C53030';
                    ctx.fillRect(tileX, tileY + actualTileHeight - 10, actualTileWidth, 10);
                    
                    // Joints de mortier
                    ctx.fillStyle = '#E2E8F0';
                    ctx.fillRect(tileX, tileY + actualTileHeight - 5, actualTileWidth, 1);
                }
            }
        }
    }
}

