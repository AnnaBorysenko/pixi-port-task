import * as PIXI from 'pixi.js';
import * as TWEEN from "@tweenjs/tween.js";
import {constants} from "../constants.ts";

let gID = 1;
let rID = 2;

export class Ship extends PIXI.Container {
    public shipGraphics: PIXI.Graphics;
    public readonly type: string;
    public isFilled: boolean;
    public readonly ID: number;
    public readyToRemove: number | null;

    constructor(type: string) {
        super();
        this.readyToRemove = null;
        this.shipGraphics = new PIXI.Graphics();
        this.type = type;
        this.isFilled = false;
        this.position = {
            x: constants.SHIP_START_X,
            y: type === constants.SHIP_TYPE_EMPTY ? constants.SHIP_START_TYPE_EMPTY_Y : constants.SHIP_START_TYPE_LOADED_Y
        }
        if (type === constants.SHIP_TYPE_EMPTY) {
            this.ID = gID;
            gID++;
        } else {
            this.ID = rID;
            rID++;
        }
        this.isFilled = type === constants.SHIP_TYPE_LOADED;
        this.draw();
    }

    public moveTo(targetPosition: { x: number, y: number }) {
        const coords = {x: this.x, y: this.y};
        new TWEEN.Tween(coords)
            .to(targetPosition, constants.TIME_TWEEN_ANIMATION_DURATION)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(() => {
                this.x = coords.x;
                this.y = coords.y;
            })
            .start();
    }

    public draw(): void {
        let lineColor = this.type === constants.SHIP_TYPE_EMPTY ? constants.COLOR_SHIP_TYPE_EMPTY : constants.COLOR_SHIP_TYPE_LOADED;
        let fillColor = this.isFilled ? lineColor : constants.COLOR_MAIN;
        this.shipGraphics.beginFill(lineColor);
        this.shipGraphics.lineStyle(constants.SHIP_OUTLINE_WIDTH, lineColor);
        this.shipGraphics.beginFill(fillColor);
        this.shipGraphics.drawRect(0, 0, constants.SHIP_WIDTH, constants.SHIP_HEIGHT);
        this.shipGraphics.endFill();
        this.addChild(this.shipGraphics);
    }

    public update(): void {
        this.draw();
    }


}