import * as PIXI from "pixi.js";
export class Exit extends PIXI.Container{

    constructor() {
        super();
        this.startExitView();
    }
    startExitView(): void {
        const exitGraphics = new PIXI.Graphics();
        exitGraphics.beginFill(0x009966FF);
        exitGraphics.drawRect(0, 0, 100, 100);
        exitGraphics.endFill();
        this.addChild(exitGraphics);
    }
}