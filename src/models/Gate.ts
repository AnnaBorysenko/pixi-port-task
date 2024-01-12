
import * as PIXI from "pixi.js";
export class  Gate extends PIXI.Container {
    constructor() {
        super();
        const gateGraphics = new PIXI.Graphics();
        gateGraphics.lineStyle(6, 0xffff00);
        gateGraphics.drawRect(0, 0, 3, 200);
        this.addChild(gateGraphics);
    }
}
