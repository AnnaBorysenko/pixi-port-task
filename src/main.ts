import * as PIXI from 'pixi.js';
import { Game } from './models/Game';
import {constants} from "./constants.ts";

let canvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement;

const app = new PIXI.Application({
    width: constants.CANVAS_WIDTH,
    height: constants.CANVAS_HEIGHT,
    backgroundColor: constants.COLOR_MAIN,

    view: canvasElement
});

const game = new Game(app);
app.ticker.add(game.update, game);

