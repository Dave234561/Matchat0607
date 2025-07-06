// Fichier principal pour initialiser le jeu
let game;

// Attendre que la page soit chargée
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du jeu Chat Parisien...');
    
    // Créer l'instance du jeu
    game = new Game();
    
    // Ajouter des événements supplémentaires
    setupGameEvents();
});

function setupGameEvents() {
    // Gestion de la pause
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Escape') {
            togglePause();
        }
        
        // Redémarrer le jeu si game over
        if (e.code === 'Enter' && game.gameState === 'gameOver') {
            restartGame();
        }
        
        // Niveau suivant si victoire
        if (e.code === 'Enter' && game.gameState === 'levelComplete') {
            nextLevel();
        }
    });
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Le canvas garde sa taille fixe pour la cohérence du gameplay
        console.log('Fenêtre redimensionnée');
    });
}

function togglePause() {
    if (game.gameState === 'playing') {
        game.gameState = 'paused';
        showPauseScreen();
    } else if (game.gameState === 'paused') {
        game.gameState = 'playing';
        hidePauseScreen();
    }
}

function showPauseScreen() {
    const ctx = game.ctx;
    
    // Overlay semi-transparent
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, game.width, game.height);
    
    // Texte de pause
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSE', game.width / 2, game.height / 2);
    
    ctx.font = '24px Arial';
    ctx.fillText('Appuyez sur Échap pour continuer', game.width / 2, game.height / 2 + 60);
}

function hidePauseScreen() {
    // Le rendu normal reprendra automatiquement
}

function restartGame() {
    console.log('Redémarrage du jeu...');
    
    // Réinitialiser l'état du jeu
    game.gameState = 'playing';
    game.score = 0;
    game.lives = 3;
    game.level = 1;
    
    // Réinitialiser le joueur
    game.player.health = game.player.maxHealth;
    game.player.x = 100;
    game.player.y = 400;
    game.player.vx = 0;
    game.player.vy = 0;
    game.player.invulnerable = false;
    
    // Recharger le niveau 1
    if (game.levelManager) {
        game.levelManager.loadLevel(1);
    } else {
        // Fallback si le gestionnaire de niveaux n'est pas encore implémenté
        game.createBasicLevel();
    }
    
    // Réinitialiser la caméra
    game.camera.x = 0;
    game.camera.y = 0;
    
    console.log('Jeu redémarré !');
}

function nextLevel() {
    if (game.levelManager) {
        const success = game.levelManager.nextLevel();
        if (success) {
            game.gameState = 'playing';
        } else {
            // Jeu terminé
            showVictoryScreen();
        }
    }
}

function showGameOverScreen() {
    const ctx = game.ctx;
    
    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, game.width, game.height);
    
    // Texte Game Over
    ctx.fillStyle = '#ff0000';
    ctx.font = '64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', game.width / 2, game.height / 2 - 50);
    
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score Final: ${game.score}`, game.width / 2, game.height / 2 + 20);
    ctx.fillText('Appuyez sur Entrée pour recommencer', game.width / 2, game.height / 2 + 60);
}

function showLevelCompleteScreen() {
    const ctx = game.ctx;
    
    // Overlay
    ctx.fillStyle = 'rgba(0, 100, 0, 0.8)';
    ctx.fillRect(0, 0, game.width, game.height);
    
    // Texte Level Complete
    ctx.fillStyle = '#00ff00';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NIVEAU TERMINÉ !', game.width / 2, game.height / 2 - 50);
    
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    if (game.levelManager) {
        const levelInfo = game.levelManager.getCurrentLevelInfo();
        ctx.fillText(`${levelInfo.name} terminé !`, game.width / 2, game.height / 2 + 20);
    }
    ctx.fillText('Appuyez sur Entrée pour le niveau suivant', game.width / 2, game.height / 2 + 60);
}

function showVictoryScreen() {
    const ctx = game.ctx;
    
    // Overlay doré
    ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.fillRect(0, 0, game.width, game.height);
    
    // Texte Victory
    ctx.fillStyle = '#ff6600';
    ctx.font = '64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VICTOIRE !', game.width / 2, game.height / 2 - 100);
    
    ctx.fillStyle = '#000';
    ctx.font = '32px Arial';
    ctx.fillText('Félicitations !', game.width / 2, game.height / 2 - 40);
    ctx.fillText('Vous avez sauvé Paris !', game.width / 2, game.height / 2);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Score Final: ${game.score}`, game.width / 2, game.height / 2 + 50);
    ctx.fillText('Appuyez sur Entrée pour recommencer', game.width / 2, game.height / 2 + 90);
}

// Étendre la classe Game pour inclure les écrans de fin
Game.prototype.originalRender = Game.prototype.render;
Game.prototype.render = function() {
    // Rendu normal
    this.originalRender();
    
    // Écrans spéciaux selon l'état
    switch (this.gameState) {
        case 'paused':
            showPauseScreen();
            break;
        case 'gameOver':
            showGameOverScreen();
            break;
        case 'levelComplete':
            showLevelCompleteScreen();
            break;
        case 'victory':
            showVictoryScreen();
            break;
    }
};

// Étendre la classe Game pour inclure le gestionnaire de niveaux
Game.prototype.originalInit = Game.prototype.init;
Game.prototype.init = function() {
    // Initialisation originale
    this.originalInit();
    
    // Gestionnaire de niveaux temporairement désactivé pour éviter les erreurs
    // this.levelManager = new LevelManager(this);
    // this.levelManager.loadLevel(1);
};

// Étendre la méthode update pour vérifier la fin de niveau
Game.prototype.originalUpdate = Game.prototype.update;
Game.prototype.update = function() {
    if (this.gameState !== 'playing') return;
    
    // Update original
    this.originalUpdate();
    
    // Vérifier si le niveau est terminé
    if (this.levelManager && this.levelManager.checkLevelComplete()) {
        this.gameState = 'levelComplete';
    }
};

// Fonctions utilitaires
function formatScore(score) {
    return score.toString().padStart(6, '0');
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Debug - fonctions accessibles depuis la console
window.debugGame = {
    skipLevel: () => {
        if (game && game.levelManager) {
            game.levelManager.nextLevel();
        }
    },
    addScore: (points) => {
        if (game) {
            game.score += points;
        }
    },
    godMode: () => {
        if (game && game.player) {
            game.player.health = 999;
            game.player.maxHealth = 999;
            game.lives = 999;
        }
    },
    showInfo: () => {
        if (game && game.levelManager) {
            console.log(game.levelManager.getCurrentLevelInfo());
        }
    }
};

console.log('Jeu Chat Parisien initialisé !');
console.log('Fonctions debug disponibles dans window.debugGame');
console.log('Contrôles: Flèches = Déplacement, Espace = Saut, Ctrl = Attaque, Échap = Pause');

