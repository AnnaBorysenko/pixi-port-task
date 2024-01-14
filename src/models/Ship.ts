import * as PIXI from 'pixi.js';

type ShipType = "green" | "red";


let gID = 1;
let rID = 2;

export class Ship extends PIXI.Container {
    private shipGraphics: PIXI.Graphics;
    public type: ShipType;
    public isFilled: boolean;
    public ID: number;
    public readyToRemove : number | null;


    constructor(type: ShipType) {
        super();
        this.readyToRemove = null;
        this.shipGraphics = new PIXI.Graphics();
        this.type = type;
        this.isFilled = false;
        this.position =  {x: 950, y: type === "green" ? 200 : 600}
        if (type === "green") {
            this.ID = gID;
            gID++;
        } else  {
            this.ID = rID;
            rID++;
        }
        this.isFilled = type === "red";
        this.draw();
    }



    public draw(): void {
        let lineColor = this.type === "green" ? 0x00ff00 : 0xff0000;
        let fillColor = this.isFilled ? lineColor : 0x0096FF;
        this.shipGraphics.beginFill(lineColor);
        this.shipGraphics.lineStyle(5, lineColor);
        this.shipGraphics.beginFill(fillColor);
        this.shipGraphics.drawRect(0, 0, 100, 30);
        this.shipGraphics.endFill();
        this.addChild(this.shipGraphics);
    }

    public update(): void {
        this.draw();
    }


}