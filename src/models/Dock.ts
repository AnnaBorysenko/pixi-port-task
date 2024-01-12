import * as PIXI from 'pixi.js';


export class Dock extends PIXI.Container {
    private dockGraphics: PIXI.Graphics;
    public occupied: number | null;
    public isLoaded: boolean;
    public id: number;

    constructor(id: number) {
        super();
        this.dockGraphics = new PIXI.Graphics();
        this.occupied = null;
        this.isLoaded = false;
        this.id = id;
        this.draw();
    }



    public draw(): void {
        let lineColor = 0xffff00;
        let fillColor = this.isLoaded ? lineColor : 0x0096FF;
        this.dockGraphics.beginFill(lineColor);
        this.dockGraphics.lineStyle(5, lineColor);
        this.dockGraphics.beginFill(fillColor);
        this.dockGraphics.drawRect(0, 0, 30, 100);
        this.dockGraphics.endFill();
        this.addChild(this.dockGraphics);
    }

    public update(): void {
        this.draw();
    }
}