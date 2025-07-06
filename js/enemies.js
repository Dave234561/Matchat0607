// Classes des ennemis

// Classe de base pour les ennemis
class Enemy extends GameObject {
    constructor(x, y, width, height, game) {
        super(x, y, width, height, game);
        this.health = 1;
        this.speed = 1;
        this.direction = 1; // 1 = droite, -1 = gauche
        this.points = 10;
        this.attackDamage = 1;
        this.patrolDistance = 100;
        this.startX = x;
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 15;
        
        // Forcer l'utilisation du fallback pour éviter les fonds blancs
        this.useFallback = true;
    }
    
    update() {
        this.patrol();
        this.updateAnimation();
        super.update();
        
        // Empêcher de tomber dans le vide
        if (this.y > this.game.height) {
            this.destroyed = true;
        }
    }
    
    patrol() {
        // Mouvement de patrouille stable avec marge de sécurité
        this.vx = this.speed * this.direction;
        
        // Ajouter une marge de sécurité pour éviter les oscillations
        const margin = 10;
        const leftLimit = this.startX - this.patrolDistance + margin;
        const rightLimit = this.startX + this.patrolDistance - margin;
        
        // Changer de direction seulement si on dépasse vraiment les limites
        if (this.direction > 0 && this.x >= rightLimit) {
            this.direction = -1;
        } else if (this.direction < 0 && this.x <= leftLimit) {
            this.direction = 1;
        }
    }
    
    updateAnimation() {
        this.animationTimer++;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 2; // Animation simple 2 frames
        }
    }
    
    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.destroyed = true;
            // Effet de particules (optionnel)
            this.createDeathEffect();
        }
    }
    
    createDeathEffect() {
        // Créer quelques particules pour l'effet de mort
        for (let i = 0; i < 5; i++) {
            this.game.particles.push(new Particle(
                this.x + this.width / 2,
                this.y + this.height / 2,
                this.game
            ));
        }
    }
}

// Souris méchante
class Mouse extends Enemy {
    constructor(x, y, game) {
        super(x, y, 32, 32, game);
        this.health = 1;
        this.speed = 2;
        this.points = 10;
        this.spriteName = 'mouse_final';
    }
    
    render() {
        // Ne pas rendre si l'ennemi est détruit
        if (this.destroyed) return;
        
        const ctx = this.game.ctx;
        const sprite = this.game.sprites[this.spriteName];
        
        if (sprite) {
            if (this.direction < 0) {
                // Utiliser le cache pour le sprite retourné
                const flippedSprite = this.game.getFlippedSprite(this.spriteName);
                if (flippedSprite) {
                    ctx.drawImage(flippedSprite, this.x, this.y, this.width, this.height);
                }
            } else {
                // Dessiner normalement
                ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
        } else {
            // Fallback amélioré pour souris
            ctx.fillStyle = '#888';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Corps de souris
            ctx.fillStyle = '#666';
            ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
            
            // Yeux rouges - ajuster selon la direction
            ctx.fillStyle = '#f00';
            if (this.direction > 0) {
                ctx.fillRect(this.x + 5, this.y + 5, 4, 4);
                ctx.fillRect(this.x + 15, this.y + 5, 4, 4);
                // Queue à droite
                ctx.fillStyle = '#444';
                ctx.fillRect(this.x + this.width - 2, this.y + this.height/2, 8, 2);
            } else {
                ctx.fillRect(this.x + 13, this.y + 5, 4, 4);
                ctx.fillRect(this.x + 23, this.y + 5, 4, 4);
                // Queue à gauche
                ctx.fillStyle = '#444';
                ctx.fillRect(this.x - 6, this.y + this.height/2, 8, 2);
            }
        }
    }
}

// Petit chien
class Dog extends Enemy {
    constructor(x, y, game) {
        super(x, y, 48, 48, game);
        this.health = 2;
        this.speed = 1.5;
        this.points = 20;
        this.spriteName = 'dog_final';
        this.jumpTimer = 0;
        this.jumpCooldown = 120; // 2 secondes à 60fps
    }
    
    update() {
        super.update();
        
        // Saut occasionnel
        this.jumpTimer++;
        if (this.jumpTimer >= this.jumpCooldown && this.onGround && Math.random() < 0.02) {
            this.vy = -8;
            this.onGround = false;
            this.jumpTimer = 0;
        }
    }
    
    render() {
        // Ne pas rendre si l'ennemi est détruit
        if (this.destroyed) return;
        
        const ctx = this.game.ctx;
        const sprite = this.game.sprites[this.spriteName];
        
        if (sprite) {
            // Rendu direct sans transformations pour éviter le clignotement
            if (this.direction < 0) {
                // Utiliser le cache pour le sprite retourné
                const flippedSprite = this.game.getFlippedSprite(this.spriteName);
                if (flippedSprite) {
                    ctx.drawImage(flippedSprite, this.x, this.y, this.width, this.height);
                }
            } else {
                // Dessiner normalement
                ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
        } else {
            // Fallback amélioré pour chien
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Corps plus détaillé
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
            
            // Yeux noirs - ajuster selon la direction
            ctx.fillStyle = '#000';
            if (this.direction > 0) {
                ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
                ctx.fillRect(this.x + 20, this.y + 8, 6, 6);
                // Museau
                ctx.fillStyle = '#654321';
                ctx.fillRect(this.x + 12, this.y + 20, 12, 8);
                // Queue à droite
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x + this.width - 3, this.y + 10, 6, 15);
            } else {
                ctx.fillRect(this.x + 10, this.y + 8, 6, 6);
                ctx.fillRect(this.x + 22, this.y + 8, 6, 6);
                // Museau
                ctx.fillStyle = '#654321';
                ctx.fillRect(this.x + 16, this.y + 20, 12, 8);
                // Queue à gauche
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x - 3, this.y + 10, 6, 15);
            }
        }
    }
}

// Gros chat ennemi
class BigCat extends Enemy {
    constructor(x, y, game) {
        super(x, y, 80, 80, game);
        this.health = 3;
        this.speed = 0.8;
        this.points = 50;
        this.spriteName = 'big_cat';
        this.attackRange = 100;
        this.attackCooldown = 180; // 3 secondes
        this.attackTimer = 0;
    }
    
    update() {
        // Comportement plus agressif - poursuit le joueur
        const player = this.game.player;
        const distanceToPlayer = Math.abs(player.x - this.x);
        
        if (distanceToPlayer < this.attackRange) {
            // Poursuivre le joueur
            this.direction = player.x > this.x ? 1 : -1;
            this.vx = this.speed * this.direction * 1.5; // Plus rapide en poursuite
        } else {
            // Patrouille normale
            this.patrol();
        }
        
        this.updateAnimation();
        super.update();
        
        this.attackTimer++;
    }
    
    render() {
        // Ne pas rendre si l'ennemi est détruit
        if (this.destroyed) return;
        
        const ctx = this.game.ctx;
        const sprite = this.game.sprites[this.spriteName];
        
        if (sprite) {
            // Rendu direct sans transformations pour éviter le clignotement
            if (this.direction < 0) {
                // Utiliser le cache pour le sprite retourné
                const flippedSprite = this.game.getFlippedSprite(this.spriteName);
                if (flippedSprite) {
                    ctx.drawImage(flippedSprite, this.x, this.y, this.width, this.height);
                }
            } else {
                // Dessiner normalement
                ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
        } else {
            // Fallback amélioré pour BigCat
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Corps plus détaillé
            ctx.fillStyle = '#555';
            ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
            
            // Yeux jaunes - ajuster selon la direction
            ctx.fillStyle = '#ff0';
            if (this.direction > 0) {
                ctx.fillRect(this.x + 15, this.y + 15, 8, 8);
                ctx.fillRect(this.x + 35, this.y + 15, 8, 8);
                // Oreilles
                ctx.fillStyle = '#222';
                ctx.fillRect(this.x + 10, this.y + 5, 8, 12);
                ctx.fillRect(this.x + 45, this.y + 5, 8, 12);
            } else {
                ctx.fillRect(this.x + 25, this.y + 15, 8, 8);
                ctx.fillRect(this.x + 45, this.y + 15, 8, 8);
                // Oreilles
                ctx.fillStyle = '#222';
                ctx.fillRect(this.x + 20, this.y + 5, 8, 12);
                ctx.fillRect(this.x + 55, this.y + 5, 8, 12);
            }
        }
    }
}

// Ours boss final
class Bear extends Enemy {
    constructor(x, y, game) {
        super(x, y, 128, 128, game);
        this.health = 10;
        this.speed = 0.5;
        this.points = 200;
        this.spriteName = 'bear_final';
        this.attackRange = 150;
        this.attackCooldown = 120;
        this.attackTimer = 0;
        this.chargeAttack = false;
        this.chargeSpeed = 4;
        this.isBoss = true;
    }
    
    update() {
        const player = this.game.player;
        const distanceToPlayer = Math.abs(player.x - this.x);
        
        this.attackTimer++;
        
        if (distanceToPlayer < this.attackRange && this.attackTimer >= this.attackCooldown) {
            // Attaque de charge
            this.chargeAttack = true;
            this.direction = player.x > this.x ? 1 : -1;
            this.attackTimer = 0;
        }
        
        if (this.chargeAttack) {
            this.vx = this.chargeSpeed * this.direction;
            // Arrêter la charge après un certain temps
            if (this.attackTimer > 60) {
                this.chargeAttack = false;
            }
        } else {
            // Mouvement normal
            this.vx = this.speed * this.direction;
        }
        
        this.updateAnimation();
        super.update();
    }
    
    render() {
        // Ne pas rendre si l'ennemi est détruit
        if (this.destroyed) return;
        
        const ctx = this.game.ctx;
        const sprite = this.game.sprites[this.spriteName];
        
        if (sprite) {
            // Rendu direct sans transformations pour éviter le clignotement
            if (this.direction < 0) {
                // Utiliser le cache pour le sprite retourné
                const flippedSprite = this.game.getFlippedSprite(this.spriteName);
                if (flippedSprite) {
                    ctx.drawImage(flippedSprite, this.x, this.y, this.width, this.height);
                }
            } else {
                // Dessiner normalement
                ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
        } else {
            // Fallback amélioré pour Bear
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Corps plus détaillé
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(this.x + 8, this.y + 8, this.width - 16, this.height - 16);
            
            // Yeux rouges - ajuster selon la direction
            ctx.fillStyle = '#f00';
            if (this.direction > 0) {
                ctx.fillRect(this.x + 25, this.y + 25, 12, 12);
                ctx.fillRect(this.x + 55, this.y + 25, 12, 12);
                // Museau
                ctx.fillStyle = '#654321';
                ctx.fillRect(this.x + 35, this.y + 50, 20, 15);
                // Oreilles
                ctx.fillStyle = '#654321';
                ctx.fillRect(this.x + 20, this.y + 10, 15, 20);
                ctx.fillRect(this.x + 75, this.y + 10, 15, 20);
            } else {
                ctx.fillRect(this.x + 35, this.y + 25, 12, 12);
                ctx.fillRect(this.x + 65, this.y + 25, 12, 12);
                // Museau
                ctx.fillStyle = '#654321';
                ctx.fillRect(this.x + 45, this.y + 50, 20, 15);
                // Oreilles
                ctx.fillStyle = '#654321';
                ctx.fillRect(this.x + 30, this.y + 10, 15, 20);
                ctx.fillRect(this.x + 85, this.y + 10, 15, 20);
            }
        }
        
        // Barre de vie pour le boss
        if (this.isBoss) {
            this.drawBossHealthBar();
        }
    }
    
    drawBossHealthBar() {
        const ctx = this.game.ctx;
        const barWidth = 200;
        const barHeight = 20;
        const barX = this.game.width / 2 - barWidth / 2;
        const barY = 30;
        
        // Fond de la barre
        ctx.fillStyle = '#000';
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        // Barre de vie
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Vie actuelle
        ctx.fillStyle = '#f39c12';
        const healthWidth = (this.health / 10) * barWidth;
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Texte
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS OURS', this.game.width / 2, barY - 10);
    }
}

// Classe Particle pour les effets
class Particle extends GameObject {
    constructor(x, y, game) {
        super(x, y, 4, 4, game);
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10 - 5;
        this.life = 30;
        this.maxLife = 30;
        this.color = `hsl(${Math.random() * 60 + 15}, 100%, 50%)`; // Couleurs chaudes
    }
    
    update() {
        super.update();
        this.life--;
        if (this.life <= 0) {
            this.destroyed = true;
        }
    }
    
    render() {
        const ctx = this.game.ctx;
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}


// Écureuil ennemi
class Squirrel extends Enemy {
    constructor(x, y, game) {
        super(x, y, 40, 40, game);
        this.health = 1;
        this.speed = 2.5;
        this.points = 15;
        this.spriteName = 'squirrel_idle';
        this.jumpTimer = 0;
        this.jumpCooldown = 80; // Saute plus souvent que le chien
    }
    
    update() {
        super.update();
        
        // Saut fréquent
        this.jumpTimer++;
        if (this.jumpTimer >= this.jumpCooldown && this.onGround && Math.random() < 0.05) {
            this.vy = -10; // Saut plus haut
            this.onGround = false;
            this.jumpTimer = 0;
        }
    }
    
    render() {
        // Ne pas rendre si l'ennemi est détruit
        if (this.destroyed) return;
        
        const ctx = this.game.ctx;
        const sprite = this.game.sprites[this.spriteName];
        
        if (sprite) {
            // Rendu direct sans transformations pour éviter le clignotement
            if (this.direction < 0) {
                // Utiliser le cache pour le sprite retourné
                const flippedSprite = this.game.getFlippedSprite(this.spriteName);
                if (flippedSprite) {
                    ctx.drawImage(flippedSprite, this.x, this.y, this.width, this.height);
                }
            } else {
                // Dessiner normalement
                ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
        } else {
            // Fallback amélioré pour Squirrel
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Corps plus détaillé
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
            
            // Yeux noirs - ajuster selon la direction
            ctx.fillStyle = '#000';
            if (this.direction > 0) {
                ctx.fillRect(this.x + 8, this.y + 8, 4, 4);
                ctx.fillRect(this.x + 18, this.y + 8, 4, 4);
                // Queue touffue à droite
                ctx.fillStyle = '#654321';
                ctx.fillRect(this.x + this.width - 2, this.y + 5, 12, 20);
                ctx.fillRect(this.x + this.width + 2, this.y + 2, 8, 26);
            } else {
                ctx.fillRect(this.x + 10, this.y + 8, 4, 4);
                ctx.fillRect(this.x + 20, this.y + 8, 4, 4);
                // Queue touffue à gauche
                ctx.fillStyle = '#654321';
                ctx.fillRect(this.x - 10, this.y + 5, 12, 20);
                ctx.fillRect(this.x - 6, this.y + 2, 8, 26);
            }
        }
    }
}

// Poisson ennemi
class Fish extends Enemy {
    constructor(x, y, game) {
        super(x, y, 48, 32, game);
        this.health = 1;
        this.speed = 1;
        this.points = 25;
        this.spriteName = 'fish_idle';
        this.floatOffset = 0;
        this.floatSpeed = 0.1;
        this.startY = y;
    }
    
    update() {
        // Mouvement ondulant
        this.floatOffset += this.floatSpeed;
        this.y = this.startY + Math.sin(this.floatOffset) * 20;
        
        // Mouvement horizontal
        this.vx = this.speed * this.direction;
        
        // Changer de direction aux limites
        if (this.x > this.startX + this.patrolDistance || this.x < this.startX - this.patrolDistance) {
            this.direction *= -1;
        }
        
        this.x += this.vx;
        this.updateAnimation();
        
        // Ne pas appliquer la gravité aux poissons
        if (this.y > this.game.height) {
            this.destroyed = true;
        }
    }
    
    render() {
        // Ne pas rendre si l'ennemi est détruit
        if (this.destroyed) return;
        
        const ctx = this.game.ctx;
        const sprite = this.game.sprites[this.spriteName];
        
        if (sprite) {
            // Rendu direct sans transformations pour éviter le clignotement
            if (this.direction < 0) {
                // Utiliser le cache pour le sprite retourné
                const flippedSprite = this.game.getFlippedSprite(this.spriteName);
                if (flippedSprite) {
                    ctx.drawImage(flippedSprite, this.x, this.y, this.width, this.height);
                }
            } else {
                // Dessiner normalement
                ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
        } else {
            // Fallback amélioré pour Fish
            ctx.fillStyle = '#FF8C00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Corps plus détaillé
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
            
            // Œil noir - ajuster selon la direction
            ctx.fillStyle = '#000';
            if (this.direction > 0) {
                ctx.fillRect(this.x + 8, this.y + 8, 4, 4);
                // Nageoires
                ctx.fillStyle = '#FF6347';
                ctx.fillRect(this.x + this.width - 8, this.y + 4, 6, 8);
                ctx.fillRect(this.x + this.width - 8, this.y + 16, 6, 8);
            } else {
                ctx.fillRect(this.x + this.width - 12, this.y + 8, 4, 4);
                // Nageoires
                ctx.fillStyle = '#FF6347';
                ctx.fillRect(this.x + 2, this.y + 4, 6, 8);
                ctx.fillRect(this.x + 2, this.y + 16, 6, 8);
            }
        }
    }
}

