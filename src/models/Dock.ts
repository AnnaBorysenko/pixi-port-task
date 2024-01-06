// Представляє окремий док у порту.
//     Відслідковує, чи зайнята вона кораблем.
//     Керує завантаженням та розвантаженням вантажу.
import * as PIXI from 'pixi.js';
export class Dock extends PIXI.Container {
    private dockGraphics: PIXI.Graphics;
    public occupied : number | null;
    public isLoaded : boolean;

    constructor() {
        super();
        this.dockGraphics = new PIXI.Graphics();
        this.occupied = null;
        this.isLoaded = false;
        this.startDockView();
    }
    startDockView(): void {
        this.dockGraphics = new PIXI.Graphics();
        this.dockGraphics.lineStyle(5, 0xffff00);
        this.dockGraphics.drawRect(0, 0, 30, 80);
        this.addChild(this.dockGraphics);
    }
    private updateDockView(): void {
        this.dockGraphics.clear();
        this.dockGraphics.lineStyle(5, (0xffff00));
        if (!this.isLoaded) {
            this.dockGraphics.beginFill((0xffff00));
        }
        this.dockGraphics.drawRect(0, 0, 30, 80);
        this.dockGraphics.endFill();
    }
}