import * as PIXI from "pixi.js";
import {constants} from "../constants.ts";

export class Exit extends PIXI.Container {
    constructor() {
        super();
        this.startExitView();
    }

    startExitView(): void {
        const exitGraphics = new PIXI.Graphics();
        exitGraphics.beginFill(constants.COLOR_MAIN);
        exitGraphics.drawRect(0, 0, constants.EXIT_WIDTH, constants.EXIT_HEIGHT);
        exitGraphics.endFill();
        this.addChild(exitGraphics);
    }
}