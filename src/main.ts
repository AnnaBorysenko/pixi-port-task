import * as PIXI from 'pixi.js';
import { Game } from './models/Game';

let canvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;

const app = new PIXI.Application({
    width: 850,
    height: 850,
    backgroundColor: 0x0096FF,

    view: canvasElement
});

const game = new Game(app);
app.ticker.add(game.update, game)

