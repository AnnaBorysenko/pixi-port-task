import * as PIXI from "pixi.js";
export class Port extends PIXI.Container{
    private isFreeEnter : boolean
    private isOccupiedDock : boolean;
    private isLoadingShip : boolean;
    constructor() {
        super();
        this.isFreeEnter = false;
        this.isOccupiedDock = false;
        this.isLoadingShip = false;
        this.startPortView();
    }
    startPortView(): void {
        const portGraphics = new PIXI.Graphics();
        portGraphics.beginFill(0x0096FF);
        portGraphics.drawRect(0, 0, 300, 850);
        portGraphics.endFill();
        this.addChild(portGraphics);
    }
}
