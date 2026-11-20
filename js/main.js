
// ==========================================
// ZOMBIE ASSAULT
// MAIN ENTRY POINT
// ==========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

ctx.imageSmoothingEnabled = false;

// Import game engine
const game = new Game(canvas, ctx);

window.game = game;

// Start game
game.start();
