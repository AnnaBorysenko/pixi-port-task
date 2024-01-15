import * as PIXI from 'pixi.js';
import {constants} from "../constants.ts";


export class Dock extends PIXI.Container {
    private readonly dockGraphics: PIXI.Graphics;
    public occupied: number | null;
    public isLoaded: boolean;
    public id: number;
    public timer: number | null;

    constructor(id: number) {
        super();
        this.dockGraphics = new PIXI.Graphics();
        this.occupied = null;
        this.isLoaded = false;
        this.id = id;
        this.timer = null;
        this.draw();
    }

    public draw(): void {
        let lineColor = constants.COLOR_DOCK;
        let fillColor = this.isLoaded ? lineColor : constants.COLOR_MAIN;
        this.dockGraphics.beginFill(lineColor);
        this.dockGraphics.lineStyle(constants.DOCK_OUTLINE_WIDTH, lineColor);
        this.dockGraphics.beginFill(fillColor);
        this.dockGraphics.drawRect(0, 0, constants.DOCK_WIDTH, constants.DOCK_HEIGHT);
        this.dockGraphics.endFill();
        this.addChild(this.dockGraphics);
    }

    public update(): void {
        this.draw();
    }
}