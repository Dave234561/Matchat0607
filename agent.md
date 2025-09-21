# Agent Instructions for Chat Parisien

## Project Context
Chat Parisien is a 2D HTML5 Canvas platformer game featuring an orange cat protagonist exploring Parisian rooftops. Built with vanilla JavaScript, no build system required.

## Key Development Guidelines

### Architecture
- Vanilla JavaScript with ES6 classes
- Modular structure: Game engine, Player, Enemies, Levels
- 60 FPS target with requestAnimationFrame
- Custom physics system (gravity: 0.8, friction: 0.85)

### File Structure
- `js/main.js`: Entry point, UI state management
- `js/game.js`: Core engine, sprite loading, physics
- `js/player.js`: Cat player mechanics and animations
- `js/enemies.js`: AI for various enemy types
- `sprites/`: Organized by category (cat/, enemies/, environment/)

### Game Mechanics
- Controls: Arrow keys (movement), Space (jump), Ctrl (attack), Escape (pause)
- Animation system using sprite arrays with timing
- Camera follows player with smooth tracking
- GameObject base class for all entities

### Debug Tools
- Browser console debug functions via `window.debugGame`
- `diagnostic.html` for system testing
- `simple-version.html` for standalone testing

### Common Tasks
- Sprite management in organized directories
- Enemy AI implementation extending GameObject
- Level design and progression
- Animation frame sequencing
- Collision detection optimization

### Performance Notes
- No external dependencies
- Direct browser execution
- Sprite caching for performance
- Fallback handling for missing assets