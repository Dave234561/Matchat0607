# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chat Parisien is a 2D HTML5 Canvas platformer game featuring an orange cat protagonist exploring Parisian rooftops. The game uses vanilla JavaScript with a modular architecture and no build system - all files can be run directly in a browser.

## Development Commands

### Running the Game
```bash
# Simply open in browser - no build process required
open index.html
# or for testing
open simple-version.html  # Self-contained version for troubleshooting
open diagnostic.html      # Debug/diagnostic page
```

### Debugging
Access debug functions via browser console:
```javascript
window.debugGame.skipLevel()     // Skip to next level
window.debugGame.addScore(100)   // Add points to score
window.debugGame.godMode()       // Enable invincibility
window.debugGame.showInfo()      // Show current level info
```

## Architecture Overview

### Core Game Loop
The game follows a standard game engine pattern with initialization, update, and render cycles:
- **Game class** (`js/game.js`): Main engine, handles canvas, sprites, physics, camera
- **GameObject base class**: Shared physics and collision system for all game entities
- **60 FPS** target with requestAnimationFrame

### Module Structure
- `js/main.js`: Entry point, game initialization, UI state management (pause, game over screens)
- `js/game.js`: Core engine, sprite loading, physics constants (gravity: 0.8, friction: 0.85)
- `js/player.js`: Cat player class with movement, jumping, attacks, animations
- `js/enemies.js`: Enemy AI classes (mice, dogs, cats, bears, fish, squirrels)
- `js/level.js`: Level management and progression system

### Key Game Mechanics
- **Physics**: Custom gravity/friction system, collision detection
- **Animation**: Frame-based sprite animations with timing controls
- **Camera**: Follows player with smooth tracking
- **Controls**: Arrow keys (movement), Space (jump), Ctrl (attacks), Escape (pause)

### Sprite System
- All sprites in `sprites/` directory organized by category (cat/, enemies/, environment/)
- Dynamic loading with fallback handling
- Flipped sprite caching for directional animations
- Supported formats: PNG with transparency

## Code Conventions

### JavaScript Style
- ES6 classes for game objects
- Prototype extensions for adding functionality to existing classes
- Event-driven input handling
- Constructor dependency injection (game instance passed to all objects)

### Game Object Structure
All game entities extend GameObject base class with:
- Position (x, y), velocity (vx, vy), dimensions (width, height)
- Collision detection and physics integration
- Reference to main game instance

### Animation System
Animations defined as arrays of sprite names with configurable timing:
```javascript
this.animations = {
    idle: ['cat_idle_1', 'cat_idle_2', 'cat_idle_3', 'cat_idle_4'],
    run: ['cat_run_1', 'cat_run_2']
};
```

## Troubleshooting

### Common Issues
- **Blue screen**: Browser cache problem - use Ctrl+Shift+R to force reload
- **Missing sprites**: Check sprites/ directory structure and file paths
- **Performance**: Game targets 60 FPS, verify requestAnimationFrame is working

### Debug Tools
- Browser DevTools for JavaScript debugging
- `diagnostic.html` for system compatibility testing
- `simple-version.html` as self-contained fallback
- Console debug functions available via `window.debugGame`

### Game States
- `playing`: Normal gameplay
- `paused`: Game paused (Escape key)
- `gameOver`: Player death screen
- `levelComplete`: Level finished screen
- `victory`: Game completed

## File Dependencies

### Required Files for Full Game
- All JS files in `js/` directory must be loaded in sequence (see index.html script tags)
- Sprite files organized in `sprites/cat/`, `sprites/enemies/`, `sprites/environment/`
- No external libraries or build dependencies

### Alternative Versions
- `simple-version.html`: Complete standalone version with embedded assets
- `diagnostic.html`: System testing and debugging page