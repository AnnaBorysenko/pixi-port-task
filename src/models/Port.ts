import * as PIXI from "pixi.js";
import {constants} from "../constants.ts";

export class Port extends PIXI.Container {
    private isFreeEnter: boolean
    private isOccupiedDock: boolean;
    private isLoadingShip: boolean;

    constructor() {
        super();
        this.isFreeEnter = false;
        this.isOccupiedDock = false;
        this.isLoadingShip = false;
        this.startPortView();
    }

    startPortView(): void {
        const portGraphics = new PIXI.Graphics();
        portGraphics.beginFill(constants.COLOR_MAIN);
        portGraphics.drawRect(0, 0, constants.PORT_WIDTH, constants.PORT_HEIGHT);
        portGraphics.endFill();
        this.addChild(portGraphics);
    }
}
