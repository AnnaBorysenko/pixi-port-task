import * as PIXI from 'pixi.js';


export class Dock extends PIXI.Container {
    private dockGraphics: PIXI.Graphics;
    public occupied: number | null;
    public isLoaded: boolean;
    public id : number;

    constructor(id: number) {
        super();
        this.dockGraphics = new PIXI.Graphics();
        this.occupied = null;
        this.isLoaded = false;
        this.id = id;
        this.draw();
    }

    public draw(): void {
        if (!this.isLoaded) {
            this.dockGraphics.lineStyle(5, 0xffff00);

        } else {
            this.dockGraphics.beginFill(0xffff00);
        }
        this.dockGraphics.drawRect(0, 0, 30, 100);
        this.addChild(this.dockGraphics);
    }

    public update(): void {
        this.draw();
    }
}