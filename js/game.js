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
        this.lives = 6;
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
        
        // État de la boucle de jeu
        this.gameLoopStarted = false;
        
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
            'sprites/environment/platform_tile.png',
            'sprites/environment/plateforme_pierre_haussmannienne.png',
            'sprites/environment/plateforme_2D_toit_incline.png',
            'sprites/environment/plateforme_2D_pierre_simple.png',
            'sprites/environment/plateforme_2D_balcon_etroit.png'
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
        
        // Vérifier si le joueur existe déjà
        if (this.player) {
            console.log("Le joueur existe déjà, ne pas créer une nouvelle instance");
            return;
        }
        
        // Créer le joueur (descendu de 50 pixels supplémentaires pour plateforme du bas)
        this.player = new Player(100, this.height - 128 - 64 + 8 + 50, this); // Même offset que les souris (8px) + 50px plus bas
        this.player.onGround = true; // Start on ground
        this.player.invulnerable = false; // Make sure not invulnerable
        this.player.invulnerabilityTimer = 0;
        console.log("Joueur créé");
        
        // Vider les tableaux existants
        this.platforms = [];
        this.enemies = [];
        this.particles = [];
        
        // Créer les plateformes de base
        this.createBasicLevel();
        console.log("Niveau créé - Plateformes:", this.platforms.length, "Ennemis:", this.enemies.length);
        
        // Démarrer la boucle de jeu seulement si elle n'est pas déjà en cours
        if (!this.gameLoopStarted) {
            this.gameLoopStarted = true;
            this.gameLoop();
            console.log("Boucle de jeu démarrée");
        }
    }
    
    createBasicLevel() {
        // Sol principal étendu sur 6 largeurs d'écran - sprites se touchent sur les côtés
        for (let i = 0; i < 56; i++) { // Plateformes qui se touchent
            this.platforms.push(new Platform(i * 128, this.height - 128, 128, 128, this, 'pierre'));
        }
        
        // Section 1 - Plateformes qui se touchent parfaitement (128x128 côte à côte)
        for (let i = 3; i < 8; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 256, 128, 128, this, 'pierre'));
        }
        
        // Section 1 - Balcons étroits qui se touchent
        for (let i = 6; i < 11; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 384, 128, 128, this, 'balcon'));
        }
        
        // Section 2 - Toits inclinés qui se touchent
        for (let i = 12; i < 17; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 208, 128, 128, this, 'toit'));
        }
        
        for (let i = 15; i < 20; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 336, 128, 128, this, 'pierre'));
        }
        
        // Section 3 - Balcons qui se touchent
        for (let i = 22; i < 27; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 288, 128, 128, this, 'balcon'));
        }
        
        for (let i = 25; i < 30; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 416, 128, 128, this, 'toit'));
        }
        
        // Section 4 - Toits qui se touchent
        for (let i = 32; i < 37; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 240, 128, 128, this, 'toit'));
        }
        
        for (let i = 35; i < 40; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 368, 128, 128, this, 'balcon'));
        }
        
        // Section 5 - Pierre qui se touche
        for (let i = 42; i < 47; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 272, 128, 128, this, 'pierre'));
        }
        
        for (let i = 45; i < 50; i++) {
            this.platforms.push(new Platform(i * 128, this.height - 400, 128, 128, this, 'toit'));
        }
        
        // Section finale - Plateformes qui se touchent
        for (let i = 52; i < 56; i++) {
            // Alterner entre balcons et pierre
            const type = i % 2 === 0 ? 'balcon' : 'pierre';
            this.platforms.push(new Platform(i * 128, this.height - 304, 128, 128, this, type));
        }
        
        // Ajouter beaucoup plus d'ennemis répartis sur tout le niveau avec plus de variété
        // Platform surface is at this.height - 128, so enemies should be positioned at surface - enemy.height
        const groundY = this.height - 128; // Platform surface
        
        // Section 1 (0-1600px) - Introduction (remontés de 50px par rapport à avant)
        this.enemies.push(new Mouse(300, groundY - 32 + 8 + 50, this)); // Mouse: 8px overlap + 50px down
        this.enemies.push(new Mouse(500, groundY - 32 + 8 + 50, this));
        this.enemies.push(new Dog(800, groundY - 48 + 10 + 50, this)); // Dog: overlap by 10px + 50px down
        this.enemies.push(new Mouse(1200, groundY - 32 + 8 + 50, this));
        this.enemies.push(new Squirrel(1500, groundY - 40 + 7 + 50, this)); // Squirrel: 7px overlap + 50px down
        
        // Section 2 (1600-3200px) - Difficulté croissante (remontés de 50px)
        this.enemies.push(new Dog(1800, groundY - 48 + 10 + 50, this));
        this.enemies.push(new Mouse(2100, groundY - 32 + 8 + 50, this));
        this.enemies.push(new Squirrel(2400, groundY - 40 + 7 + 50, this));
        this.enemies.push(new Dog(2700, groundY - 48 + 10 + 50, this));
        this.enemies.push(new BigCat(3000, groundY - 80 + 10 + 50, this)); // BigCat: 80px high + 50px down
        
        // Section 3 (3200-4800px) - Plus de défis (remontés de 50px)
        this.enemies.push(new Mouse(3300, groundY - 32 + 8 + 50, this));
        this.enemies.push(new Dog(3600, groundY - 48 + 10 + 50, this));
        this.enemies.push(new Squirrel(3900, groundY - 40 + 7 + 50, this));
        this.enemies.push(new Mouse(4200, groundY - 32 + 8 + 50, this));
        this.enemies.push(new BigCat(4500, groundY - 80 + 10 + 50, this));
        this.enemies.push(new Dog(4800, groundY - 48 + 10 + 50, this));
        
        // Section 4 (4800-6400px) - Zone difficile (remontés de 50px)
        this.enemies.push(new Squirrel(5100, groundY - 40 + 7 + 50, this));
        this.enemies.push(new Mouse(5400, groundY - 32 + 8 + 50, this));
        this.enemies.push(new Dog(5700, groundY - 48 + 10 + 50, this));
        this.enemies.push(new BigCat(6000, groundY - 80 + 10 + 50, this));
        this.enemies.push(new Squirrel(6300, groundY - 40 + 7 + 50, this));
        
        // Section 5 (6400-7200px) - Avant le boss (remontés de 50px)
        this.enemies.push(new Dog(6600, groundY - 48 + 10 + 50, this));
        this.enemies.push(new BigCat(6900, groundY - 80 + 10 + 50, this));
        this.enemies.push(new Mouse(7200, groundY - 32 + 8 + 50, this));
        this.enemies.push(new Squirrel(7500, groundY - 40 + 7 + 50, this));
        
        // Section finale (7200px+) - Boss et gardes (remontés de 50px)
        this.enemies.push(new Dog(7800, groundY - 48 + 10 + 50, this));
        this.enemies.push(new BigCat(8100, groundY - 80 + 10 + 50, this));
        this.enemies.push(new Bear(8400, groundY - 128 + 10 + 50, this)); // Boss final (Bear: 128px high) + 50px down
        
        // Ennemis sur les plateformes en hauteur - ajustés pour être à la hauteur du chat
        // Section 1 upper platforms (écureuil à la hauteur du chat)
        this.enemies.push(new Mouse(4 * 128, this.height - 256 - 32 + 8 + 100, this)); // Mouse sur plateforme pierre + 100px down
        this.enemies.push(new Squirrel(8 * 128, this.height - 384 - 40 + 7 + 100 + 100, this)); // Squirrel à la hauteur du chat (+ 200px total)
        
        // Section 2 upper platforms (descendus de 100px)
        this.enemies.push(new Mouse(14 * 128, this.height - 208 - 32 + 8 + 100, this)); // Mouse sur toit incliné + 100px down
        this.enemies.push(new Dog(17 * 128, this.height - 336 - 48 + 10 + 100, this)); // Dog sur pierre haute + 100px down
        
        // Section 3 upper platforms (descendus de 100px)
        this.enemies.push(new Squirrel(24 * 128, this.height - 288 - 40 + 7 + 100, this)); // Squirrel sur balcon + 100px down
        this.enemies.push(new Mouse(27 * 128, this.height - 416 - 32 + 8 + 100, this)); // Mouse sur toit très haut + 100px down
        
        // Section 4 upper platforms (descendus de 100px)
        this.enemies.push(new Dog(34 * 128, this.height - 240 - 48 + 10 + 100, this)); // Dog sur toit bas + 100px down
        this.enemies.push(new Mouse(37 * 128, this.height - 368 - 32 + 8 + 100, this)); // Mouse sur balcon haut + 100px down
        
        // Section 5 upper platforms (descendus de 100px)
        this.enemies.push(new Squirrel(44 * 128, this.height - 272 - 40 + 7 + 100, this)); // Squirrel sur pierre + 100px down
        this.enemies.push(new Dog(47 * 128, this.height - 400 - 48 + 10 + 100, this)); // Dog sur toit très haut + 100px down
        
        // Section 6 upper platforms (descendus de 100px)
        this.enemies.push(new Mouse(54 * 128, this.height - 304 - 32 + 8 + 100, this)); // Mouse sur plateforme finale + 100px down
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
        
        // Fixer la caméra verticalement - pas de mouvement vertical
        const targetY = 0; // Caméra fixe en Y
        
        // Calculer la largeur totale du niveau (environ 6 largeurs d'écran)
        const levelWidth = this.width * 6;
        
        // Limites de la caméra
        this.camera.x = Math.max(-this.width / 2, Math.min(levelWidth - this.width / 2, targetX));
        this.camera.y = targetY; // Caméra fixe verticalement
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
                    // Vérifier si cet ennemi n'a pas déjà été attaqué dans cette attaque
                    if (!this.player.attackedEnemies.includes(enemy)) {
                        enemy.takeDamage();
                        this.score += enemy.points || 10;
                        this.player.attackedEnemies.push(enemy); // Marquer comme attaqué
                    }
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
        this.platforms.forEach(platform => {
            // Forcer l'appel de render avec un try-catch pour débugger
            try {
                platform.render();
            } catch (error) {
                console.error('Erreur lors du rendu de la plateforme:', error, platform);
            }
        });
        
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
            const cloudX = (i * 200 - this.camera.x * 0.3) % (this.width + 100);
            const cloudY = 50 + (i % 3) * 40;
            
            ctx.beginPath();
            ctx.arc(cloudX, cloudY, 25, 0, Math.PI * 2);
            ctx.arc(cloudX + 10, cloudY, 30, 0, Math.PI * 2);
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
    constructor(x, y, width, height, game, platformType = 'ground') {
        super(x, y, width, height, game);
        this.type = 'platform';
        this.platformType = platformType; // 'ground', 'upper', 'inclined', 'balcony'
    }
    
    render() {
        const ctx = this.game.ctx;
        
        // Plateformes maintenant visibles avec les vrais sprites
        
        // Choisir le sprite en fonction du type de plateforme
        let spriteName;
        switch (this.platformType) {
            case 'pierre':
                spriteName = 'plateforme_2D_pierre_simple';
                break;
            case 'toit':
                spriteName = 'plateforme_2D_toit_incline';
                break;
            case 'balcon':
                spriteName = 'plateforme_2D_balcon_etroit';
                break;
            default:
                spriteName = 'plateforme_2D_pierre_simple';
        }
        
        const sprite = this.game.sprites[spriteName];
        
        // Debug complet du sprite une seule fois
        if (!this.debugDone) {
            console.log('=== SPRITES PLATEFORMES DISPONIBLES ===');
            console.log('spriteName demandé:', spriteName, 'trouvé:', !!sprite);
            console.log('Sprites de plateformes chargés:');
            Object.keys(this.game.sprites).filter(key => key.includes('plateforme')).forEach(key => {
                const s = this.game.sprites[key];
                console.log(`  ${key}: ${s.naturalWidth}x${s.naturalHeight} (complete: ${s.complete})`);
            });
            console.log('===================');
            this.debugDone = true;
        }
        
        if (sprite && sprite.complete && sprite.naturalWidth > 0) { // Utiliser les vrais sprites
            // Élargir les sprites, avec des élargissements spéciaux
            let extraWidth = 60; // Par défaut +60 pixels
            if (spriteName === 'plateforme_2D_balcon_etroit') {
                extraWidth = 110; // +110 pixels pour les balcons (+30 de plus)
            } else if (spriteName === 'plateforme_2D_toit_incline') {
                extraWidth = 170; // +170 pixels pour les toits inclinés (+20 de plus)
            }
            
            ctx.drawImage(
                sprite,
                this.x, this.y, this.width + extraWidth, this.height
            );
        } else {
            // Fallback - ancien rendu avec couleurs différenciées
            const tileWidth = 40;
            const tileHeight = 40;
            
            for (let x = 0; x < this.width; x += tileWidth) {
                for (let y = 0; y < this.height; y += tileHeight) {
                    const tileX = this.x + x;
                    const tileY = this.y + y;
                    const actualTileWidth = Math.min(tileWidth, this.width - x);
                    const actualTileHeight = Math.min(tileHeight, this.height - y);
                    
                    // Couleurs de fallback normales
                    switch (this.platformType) {
                        case 'pierre':
                            ctx.fillStyle = '#D2B48C'; // Beige pour pierre simple
                            break;
                        case 'toit':
                            ctx.fillStyle = '#708090'; // Gris ardoise pour toits
                            break;
                        case 'balcon':
                            ctx.fillStyle = '#F5DEB3'; // Wheat pour balcons
                            break;
                        default:
                            ctx.fillStyle = '#D2B48C';
                    }
                    ctx.fillRect(tileX, tileY, actualTileWidth, actualTileHeight);
                    
                    // Bordure noire épaisse pour bien voir les plateformes
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(tileX, tileY, actualTileWidth, actualTileHeight);
                    
                    // Ombres pour donner du relief
                    ctx.fillStyle = '#2D3748';
                    ctx.fillRect(tileX, tileY, actualTileWidth, 3);
                    ctx.fillRect(tileX, tileY, 3, actualTileHeight);
                    
                    ctx.fillStyle = '#718096';
                    ctx.fillRect(tileX + actualTileWidth - 2, tileY, 2, actualTileHeight);
                    ctx.fillRect(tileX, tileY + actualTileHeight - 2, actualTileWidth, 2);
                    
                    if (y + tileHeight >= this.height - 10) {
                        ctx.fillStyle = '#C53030';
                        ctx.fillRect(tileX, tileY + actualTileHeight - 10, actualTileWidth, 10);
                        
                        ctx.fillStyle = '#E2E8F0';
                        ctx.fillRect(tileX, tileY + actualTileHeight - 5, actualTileWidth, 1);
                    }
                }
            }
        }
    }
}

