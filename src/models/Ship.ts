import * as PIXI from 'pixi.js';

type ShipType = "green" | "red";
type Position = {
    x: number,
    y: number
}

let gID = 1;
let rID = 1;

export class Ship extends PIXI.Container {
    private shipGraphics: PIXI.Graphics;
    public type: ShipType;
    public filled: boolean;
    private positionTarget: Position | null;
    public ID: number;

    constructor(type: ShipType, position: Position) {
        super();
        this.shipGraphics = new PIXI.Graphics();
        this.type = type;
        this.filled = false;
        this.positionTarget = null // рефактор
        this.position =  {x: 950, y: type === "green" ? 200 : 600}
        if (type === "green") {
            this.ID = gID;
            gID++;
        } else  {
            this.ID = rID;
            rID++;
        }
        this.filled = type === "red";
        this.draw();
    }

    public setPositionTarget(position: Position,) {
        this.positionTarget = position // тут будет приходить позиция доки
    }

    private changeFilled() {
//     Керує анімаціями та "tweening" за допомогою Pixi.js та TweenJS.
    }

    public draw(): void {
        let lineColor = this.type === "green" ? 0x00ff00 : 0xff0000;
        let fillColor = this.filled ? lineColor : 0x0096FF;
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