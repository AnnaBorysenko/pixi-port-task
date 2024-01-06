import * as PIXI from 'pixi.js';


export class Game {
    private app: PIXI.Application;


    constructor(app: PIXI.Application) {
        this.app = app;
        console.log("test")
    }


    public update(): void {
        console.log("update")
    }

}


