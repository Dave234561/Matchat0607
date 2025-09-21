# Chat Parisien 🐱🗼

A 2D HTML5 Canvas platformer game featuring an orange cat exploring the rooftops of Paris.

## Quick Start

Simply open `index.html` in your web browser - no build process required!

```bash
open index.html
```

## Game Controls

- **Arrow Keys**: Move left/right
- **Up Arrow / Space**: Jump
- **Left Ctrl**: Front paw attack
- **Right Ctrl**: Back paw attack
- **Escape**: Pause game

## Features

- Smooth 60 FPS gameplay
- 5 levels with increasing difficulty
- Multiple enemy types with unique AI
- Parisian rooftop environments with Eiffel Tower backdrop
- Fluid animations and physics
- Health system (3 hearts)
- Scoring system
- Debug tools for development

## Enemies

1. **Evil Mice** (10 pts) - Fast and numerous
2. **Small Dogs** (20 pts) - Jump occasionally
3. **Big Cats** (50 pts) - Chase the player
4. **Fish** (25 pts) - Undulating movement
5. **Squirrels** (15 pts) - Jump frequently
6. **Bear Boss** (200 pts) - Charging attacks

## Levels

1. **Montmartre Rooftops** - Introduction with mice
2. **Latin Quarter** - Dogs added
3. **Grand Boulevards** - Big cats and challenges
4. **Bois de Boulogne** - All enemies mixed
5. **Bear's Den** - Final boss battle

## Game Versions

- `index.html`: Main game
- `simple-version.html`: Self-contained version for testing
- `diagnostic.html`: Debug and compatibility testing

## Debug Console

Access debug functions in browser console:

```javascript
window.debugGame.skipLevel()     // Skip to next level
window.debugGame.addScore(100)   // Add points
window.debugGame.godMode()       // Enable invincibility
window.debugGame.showInfo()      // Show level info
```

## Technical Specifications

- **Resolution**: 1200x600 pixels
- **FPS**: 60 frames per second
- **Technology**: HTML5 Canvas + JavaScript
- **Sprites**: PNG with transparency
- **Compatible**: All modern browsers

## Scoring System

- Mice: 10 points
- Squirrels: 15 points
- Dogs: 20 points
- Fish: 25 points
- Big cats: 50 points
- Bear boss: 200 points

## Troubleshooting

- **Blue screen**: Use Ctrl+Shift+R to force reload
- **Missing sprites**: Check `sprites/` directory structure
- **Performance issues**: Ensure 60 FPS in browser DevTools

## Architecture

Built with vanilla JavaScript using a modular game engine:

- **Game Engine**: Core physics and rendering (`js/game.js`)
- **Player System**: Cat mechanics and animations (`js/player.js`)
- **Enemy AI**: Various creature behaviors (`js/enemies.js`)
- **Level Management**: Progression and environments (`js/level.js`)

No external dependencies or build tools required!

