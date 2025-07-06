// Classe Player (Chat orange)
class Player extends GameObject {
    constructor(x, y, game) {
        super(x, y, 64, 64, game);
        
        // Propriétés du joueur
        this.speed = 12; // Accéléré de 3 à 12 (x4) pour un gameplay plus rapide
        this.jumpPower = 15;
        this.health = 3;
        this.maxHealth = 3;
        
        // Animation
        this.currentAnimation = 'idle';
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 30; // 2 sprites par seconde (60 FPS / 2 = 30 frames par sprite)
        this.facingRight = true;
        
        // États
        this.attacking = false;
        this.attackTimer = 0;
        this.attackDuration = 20;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.invulnerabilityDuration = 60;
        
        // Animations disponibles
        this.animations = {
            idle: ['cat_idle_1', 'cat_idle_2', 'cat_idle_3', 'cat_idle_4'],
            run: ['cat_run_1', 'cat_run_2'],
            jump_up: ['cat_jump_up'],
            jump_down: ['cat_jump_down'],
            attack_front: ['cat_attack_front'],
            attack_back: ['cat_attack_back']
        };
    }
    
    update() {
        this.handleInput();
        this.updateAnimation();
        this.updateTimers();
        
        // Appliquer la physique
        super.update();
        
        // Limites du monde
        if (this.x < 0) this.x = 0;
        if (this.y > this.game.height) {
            this.takeDamage();
            this.x = 100;
            this.y = 400;
            this.vx = 0;
            this.vy = 0;
        }
    }
    
    handleInput() {
        const keys = this.game.keys;
        
        // Déplacement horizontal
        if (keys['ArrowLeft']) {
            this.vx = -this.speed;
            this.facingRight = false;
            if (this.onGround && !this.attacking) {
                this.currentAnimation = 'run';
            }
        } else if (keys['ArrowRight']) {
            this.vx = this.speed;
            this.facingRight = true;
            if (this.onGround && !this.attacking) {
                this.currentAnimation = 'run';
            }
        } else {
            if (this.onGround && !this.attacking) {
                this.currentAnimation = 'idle';
            }
        }
        
        // Saut
        if ((keys['ArrowUp'] || keys['Space']) && this.onGround) {
            this.vy = -this.jumpPower;
            this.onGround = false;
        }
        
        // Attaques
        if (keys['ControlLeft'] && !this.attacking) {
            this.attack('front');
        } else if (keys['ControlRight'] && !this.attacking) {
            this.attack('back');
        }
        
        // Animation de saut
        if (!this.onGround && !this.attacking) {
            if (this.vy < 0) {
                this.currentAnimation = 'jump_up';
            } else {
                this.currentAnimation = 'jump_down';
            }
        }
    }
    
    attack(type) {
        this.attacking = true;
        this.attackTimer = this.attackDuration;
        this.currentAnimation = `attack_${type}`;
        this.animationFrame = 0;
    }
    
    updateAnimation() {
        this.animationTimer++;
        
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            
            const animation = this.animations[this.currentAnimation];
            if (animation) {
                this.animationFrame = (this.animationFrame + 1) % animation.length;
            }
        }
    }
    
    updateTimers() {
        // Timer d'attaque
        if (this.attacking) {
            this.attackTimer--;
            if (this.attackTimer <= 0) {
                this.attacking = false;
            }
        }
        
        // Timer d'invulnérabilité
        if (this.invulnerable) {
            this.invulnerabilityTimer--;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
    }
    
    handlePlatformCollision(platform) {
        // Collision par le haut (atterrissage)
        if (this.vy > 0 && this.y < platform.y) {
            this.y = platform.y - this.height;
            this.vy = 0;
            this.onGround = true;
        }
        // Collision par le bas (tête contre plateforme)
        else if (this.vy < 0 && this.y > platform.y) {
            this.y = platform.y + platform.height;
            this.vy = 0;
        }
        // Collision latérale
        else if (this.vx > 0 && this.x < platform.x) {
            this.x = platform.x - this.width;
            this.vx = 0;
        } else if (this.vx < 0 && this.x > platform.x) {
            this.x = platform.x + platform.width;
            this.vx = 0;
        }
    }
    
    takeDamage() {
        if (this.invulnerable) return;
        
        this.health--;
        this.game.lives = this.health;
        this.invulnerable = true;
        this.invulnerabilityTimer = this.invulnerabilityDuration;
        
        if (this.health <= 0) {
            this.game.gameState = 'gameOver';
        }
    }
    
    getCurrentSprite() {
        const animation = this.animations[this.currentAnimation];
        if (animation && animation.length > 0) {
            return animation[this.animationFrame];
        }
        return 'cat_final'; // Sprite final à la bonne taille
    }
    
    render() {
        const ctx = this.game.ctx;
        const spriteName = this.getCurrentSprite();
        const sprite = this.game.sprites[spriteName];
        
        // Effet de clignotement très lent si invulnérable (divisé par 10)
        if (this.invulnerable && Math.floor(this.invulnerabilityTimer / 100) % 2) {
            return; // Ne pas dessiner pour créer l'effet de clignotement très lent
        }
        
        if (sprite) {
            if (!this.facingRight) {
                // Utiliser le cache pour les sprites retournés
                const flippedSprite = this.game.getFlippedSprite(spriteName);
                if (flippedSprite && flippedSprite.width > 0 && flippedSprite.height > 0) {
                    ctx.drawImage(flippedSprite, this.x, this.y, this.width, this.height);
                }
                // Pas de fallback - ne rien dessiner si le sprite retourné échoue
            } else {
                // Dessiner normalement si le joueur regarde à droite
                ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
        } 
        // Pas de fallback - ne rien dessiner si le sprite n'est pas chargé
        
        // Dessiner la barre de vie
        this.drawHealthBar();
    }
    
    drawHealthBar() {
        const ctx = this.game.ctx;
        const barWidth = 60;
        const barHeight = 8;
        const barX = this.x + (this.width - barWidth) / 2;
        const barY = this.y - 15;
        
        // Fond de la barre
        ctx.fillStyle = '#000';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        // Barre de vie
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Vie actuelle
        ctx.fillStyle = '#2ecc71';
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillRect(barX, barY, healthWidth, barHeight);
    }
}

