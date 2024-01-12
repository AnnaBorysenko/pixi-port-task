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
    private filled: boolean;
    private speed: number;

    private positionTarget: Position | null;
    public ID: number;

    constructor(type: ShipType, position: Position) {
        super();
        this.shipGraphics = new PIXI.Graphics();
        this.type = type;
        this.filled = false;
        this.speed = 1;
        this.positionTarget = null // рефактор
        this.x = position.x;
        this.y = position.y;
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

    move(cb: () => void): void {
        if (this.positionTarget === null) {
            return
        }
        // Розрахунок вектора напрямку від поточної позиції до цільової
        const directionX = this.positionTarget.x - this.x + 33;
        const directionY = (this.positionTarget.y - this.y ) + 30;

        // Нормалізація вектора напрямку (щоб отримати одиничний вектор)
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedDirectionX = directionX / length;
        const normalizedDirectionY = directionY / length;

        // Розрахунок наступної позиції з урахуванням швидкості
        const nextX = this.x + normalizedDirectionX * this.speed;
        const nextY = this.y + normalizedDirectionY * this.speed;

        // Переміщення корабля
        this.x = nextX;
        this.y = nextY;


        // Перевірка, чи корабель досягнув цільової позиції
        if (Math.abs(this.positionTarget.x - this.x) < this.speed && Math.abs(this.positionTarget.y - this.y) < this.speed) {
            // Корабель досягнув цільової позиції, можливо зупинити рух або виконати інші дії
            this.positionTarget = null;
            cb();      // Додаткові дії після досягнення цільової позиції... ( доплила в доку , уплим)
        }


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
        this.shipGraphics.drawRect(0, 0, 80, 20);
        this.shipGraphics.endFill();
        this.addChild(this.shipGraphics);
    }

    public update(): void {
        this.draw();
        this.move(() => console.log("get to ..."));
    }

}