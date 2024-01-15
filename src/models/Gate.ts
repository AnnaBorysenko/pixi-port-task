import * as PIXI from "pixi.js";
import {constants} from "../constants.ts";

export class Gate extends PIXI.Container {
    constructor() {
        super();
        const gateGraphics = new PIXI.Graphics();
        gateGraphics.lineStyle(constants.GATE_OUTLINE_WIDTH, constants.COLOR_GATE);
        gateGraphics.drawRect(0, 0, constants.GATE_WIDTH, constants.GATE_HEIGHT);
        this.addChild(gateGraphics);
    }
}
