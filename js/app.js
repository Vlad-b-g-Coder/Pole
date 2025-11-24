// app.js
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game(10, 10);
    game.init();
    window.game = game;
});