// Classe Player (Chat orange)
class Player extends GameObject {
    constructor(x, y, game) {
        super(x, y, 64, 64, game);
        
        // Propriétés du joueur
        this.speed = 12; // Accéléré de 3 à 12 (x4) pour un gameplay plus rapide
        this.jumpPower = 20; // Augmenté de 15 à 20 pour un saut plus haut
        this.health = 6;
        this.maxHealth = 6;
        
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
        this.attackedEnemies = []; // Liste des ennemis déjà attaqués dans cette attaque
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.invulnerabilityDuration = 60;
        
        // Animations disponibles - sprites inversés pour corriger la direction
        this.animations = {
            idle: ['cat_idle_2', 'cat_idle_1', 'cat_idle_4', 'cat_idle_3'], // Inversé
            run: ['cat_run_2', 'cat_run_1'], // Inversé
            jump_up: ['cat_jump_up'],
            jump_down: ['cat_jump_down'],
            attack_front: ['cat_attack_back'], // Inversé
            attack_back: ['cat_attack_front']  // Inversé
        };
    }
    
    update() {
        const oldX = this.x;
        
        this.handleInput();
        this.updateAnimation();
        this.updateTimers();
        
        // Appliquer la physique personnalisée pour le joueur
        this.applyGravity();
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Appliquer la friction seulement en l'air (pour conserver le momentum du saut)
        if (!this.onGround) {
            this.vx *= this.game.friction;
        }
        
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
            if (this.onGround) {
                this.vx = 0;
            }
            if (this.onGround && !this.attacking) {
                this.currentAnimation = 'idle';
            }
        }
        
        // Saut
        if ((keys['ArrowUp'] || keys['Space']) && this.onGround) {
            this.vy = -this.jumpPower;
            this.onGround = false;
        }
        
        // Attaques - Configuration optimisée
        if ((keys['KeyQ'] || keys['q'] || keys['Q']) && !this.attacking) {
            this.attack('front');
        } else if ((keys['KeyA'] || keys['a'] || keys['A']) && !this.attacking) {
            this.attack('back');
        } else if (keys['Enter'] && !this.attacking) {
            this.attack('front');
        } else if ((keys['ShiftLeft'] || keys['Shift']) && !this.attacking) {
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
        this.attackedEnemies = []; // Reset la liste des ennemis attaqués
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
        // Détecter le type de collision plus précisément
        const overlapLeft = (this.x + this.width) - platform.x;
        const overlapRight = (platform.x + platform.width) - this.x;
        const overlapTop = (this.y + this.height) - platform.y;
        const overlapBottom = (platform.y + platform.height) - this.y;
        
        // Trouver la plus petite overlap pour déterminer la direction de collision
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        // Collision par le haut (atterrissage) - aligner correctement avec les plateformes
        if (minOverlap === overlapTop && this.vy >= 0) {
            // Faire atterrir le chat exactement sur la plateforme comme les autres animaux
            // Ajuster selon la hauteur de la plateforme
            let yOffset = 8; // 8px d'overlap comme les souris
            
            // Plateformes du bas (sol) : y >= 472 (600-128)
            // Plateformes du milieu : y entre 216 et 471
            // Plateformes du haut : y < 216
            if (platform.y >= 216) { // Plateformes du bas et du milieu
                yOffset += 50; // Descendre de 50px supplémentaires
            }
            
            this.y = platform.y - this.height + yOffset;
            this.vy = 0;
            this.onGround = true;
        }
        // Collision par le bas (tête contre plateforme)
        else if (minOverlap === overlapBottom && this.vy <= 0) {
            this.y = platform.y + platform.height;
            this.vy = 0;
        }
        // Collisions latérales SEULEMENT si on n'est pas sur le dessus de la plateforme
        else if (minOverlap === overlapLeft && this.vx > 0 && !this.onGround) {
            this.x = platform.x - this.width;
            this.vx = 0;
        } else if (minOverlap === overlapRight && this.vx < 0 && !this.onGround) {
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
        
        // Effet de clignotement si invulnérable 
        if (this.invulnerable && Math.floor(this.invulnerabilityTimer / 10) % 2) {
            return; // Ne pas dessiner pour créer l'effet de clignotement
        }
        
        // Utiliser le bon sprite selon l'animation actuelle
        const animation = this.animations[this.currentAnimation];
        let spriteName = 'cat_idle_1'; // fallback
        
        if (animation && animation.length > 0) {
            spriteName = animation[this.animationFrame % animation.length];
        }
        
        const sprite = this.game.sprites[spriteName];
        
        if (sprite && sprite.complete && sprite.width > 0 && sprite.height > 0) {
            ctx.save();
            if (this.facingRight) {
                // Flip horizontally pour regarder à droite
                ctx.scale(-1, 1);
                ctx.drawImage(sprite, -this.x - this.width, this.y, this.width, this.height);
            } else {
                // Draw normally pour regarder à gauche
                ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        }
        
        // Draw health bar
        this.drawHealthBar();
    }
    
    drawHealthBar() {
        // Afficher la barre de vie seulement si le chat est blessé
        if (this.health < this.maxHealth && this.health > 0) {
            const ctx = this.game.ctx;
            const barWidth = 60;
            const barHeight = 8;
            const barX = this.x + (this.width - barWidth) / 2;
            const barY = this.y - 15;
            
            // Fond de la barre (noir)
            ctx.fillStyle = '#000';
            ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
            
            // Barre de vie perdue (rouge)
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Vie actuelle (vert)
            ctx.fillStyle = '#2ecc71';
            const healthWidth = (this.health / this.maxHealth) * barWidth;
            ctx.fillRect(barX, barY, healthWidth, barHeight);
            
            // Bordure blanche pour la visibilité
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
    }
}

