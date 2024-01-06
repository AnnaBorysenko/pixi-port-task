import * as PIXI from 'pixi.js';
import { Game } from './models/Game';

let canvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;

const app = new PIXI.Application({
    width: 1000,
    height: 1000,
    backgroundColor: 0xf8f8d9,
    view: canvasElement
});

const game = new Game(app);
app.ticker.add(game.update, game)

