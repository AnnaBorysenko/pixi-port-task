import * as PIXI from 'pixi.js';
import {Dock} from "./Dock";
import {Ship} from "./Ship";
import {Port} from "./Port"


//     Головний клас гри:
//     Вам слід мати головний клас гри, який керує загальним станом гри та циклом.
//     Цей клас буде відповідати за створення кораблів, портів та їх взаємодію.

export class Game {
    private app: PIXI.Application;
    private docks: Dock[] = [];
    private ships: Ship[] = [];
    private port: Port;
    private createShipTime: number;
    private redLine: number | null;
    private greenLine: number | null;


    constructor(app: PIXI.Application) {
        this.app = app;
        this.docks = [];
        this.ships = [];
        this.port = new Port();
        this.initPort();
        this.initDocks();
        this.createShipTime = Date.now();
        this.redLine = null;
        this.greenLine = null;
    }

    private initPort(): void {
        this.port = new Port();
        this.port.x = 0;
        this.port.y = 0;
        this.app.stage.addChild(this.port);
    }
    private initDocks(): void {
        this.docks = [];

        const numberOfDocks = 4;
        const startX = 20;
        const startY = 150;
        const deltaY = 150;

        for (let i = 0; i < numberOfDocks; i++) {
            const dock = new Dock();
            dock.x = startX;
            dock.y = startY + deltaY * i;
            this.app.stage.addChild(dock);
            this.docks.push(dock);
        }
    }


    public createShip() {
        // Випадково призначайте кожному кораблю колір (червоний або зелений).
        // Переконайтеся, що рух та поведінка кораблів відповідають правилам вашої гри.
        const type = Math.random() > 0.5 ? "green" : "red";
        // if gren if red start move
        const startPosition = {x: 950, y: 110}

        let newShip = new Ship(type, startPosition);
        this.ships.push(newShip);
        this.app.stage.addChild(newShip);
    }

    public moveToLine(ship: Ship) {
        // тут
        const prevShip = this.ships.find(currentShip => currentShip.type === ship.type && currentShip.ID == ship.ID - 1) as Ship;
        if (ship.type === "red") {
            if (!this.redLine || this.redLine === ship.ID) {
                ship.setPositionTarget({x: 280, y: 200});
                this.redLine = ship.ID
            } else {
                ship.setPositionTarget({x: prevShip.x + 80, y: prevShip.y -30})
            }

        } else if (ship.type === "green") {
            if (!this.greenLine || this.greenLine === ship.ID) {
                ship.setPositionTarget({x: 280, y: 600})
                this.greenLine = ship.ID

            } else {
                ship.setPositionTarget({x: prevShip.x + 80, y: prevShip.y - 30})
            }
        }


    }

    public moveToFreeDock(ship: Ship) {
        if (ship.type === "green") {
            const dock = this.docks.find(dock => (!dock.occupied || dock.occupied === ship.ID) && dock.isLoaded);
            if (dock) {

                ship.setPositionTarget({x: dock.position.x, y: dock.position.y})
                dock.occupied = ship.ID;
                return true;
            }

        } else if (ship.type === "red") {
            const dock = this.docks.find(dock => (!dock.occupied || dock.occupied === ship.ID) && !dock.isLoaded);
            if (dock) {
                ship.setPositionTarget({x: dock.position.x, y: dock.position.y})
                dock.occupied = ship.ID;
                return true;

            }

        }
    }

    public moveShip(ship: Ship) {
        const isMoveToDock = this.moveToFreeDock(ship);
        if (!isMoveToDock) {
            this.moveToLine(ship);
        }

    }

    public cargoHandling() {
        // Реалізуйте логіку завантаження та розвантаження вантажу з кораблів у порт і навпаки.
        //     Переконайтеся, що дотримується місткість кораблів і пристаней.
    }

    public moveFromDock() {
        // Використовуйте Pixi.js та TweenJS для створення анімацій руху кораблів та обробки вантажу.
        //     Анімуйте перехід кораблів з моря до порту і назад.
    }


    public update(): void {
        this.ships.forEach(ship => {
            ship.update();
            this.moveShip(ship);
        })
        // Використовуйте таймер для генерації кораблів з випадковими інтервалами (1 корабель кожні 8 секунд, як ви зазначили).
        if (Date.now() - this.createShipTime > 3 * 1000) {
            this.createShip();
            console.log("createShip")
            this.createShipTime = Date.now();
        }
        // тут регулировка

        // Створіть анімаційний цикл за допомогою Pixi.js для постійного оновлення стану гри.
        //     На кожному кадрі перевіряйте прибуття кораблів, їх відбуття, завантаження та розвантаження вантажу.
        //     Керуйте часом та розкладом для прибуття та відбуття кораблів.
    }

}


