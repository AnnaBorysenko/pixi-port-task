import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js'
import {Dock} from "./Dock";
import {Ship} from "./Ship";
import {Port} from "./Port";
import {Exit} from "./Exit";
import {Gate} from "./Gate";

export class Game {
    private app: PIXI.Application;
    private ships: Ship[] = [];
    private docks: Dock[] = [];
    private gates: Gate[] = [];
    private port: Port;
    private exit: Exit;

    private createShipTime: number;
    private redLine: number | null;
    private greenLine: number | null;


    constructor(app: PIXI.Application) {
        this.app = app;
        this.docks = [];
        this.ships = [];
        this.gates = [];
        this.port = new Port();
        this.exit = new Exit();
        this.initPort();
        this.initExit();
        this.initDocks();
        this.initGates();
        this.createShip();
        this.redLine = null;
        this.greenLine = null;
        this.createShipTime = Date.now();

    }

    private initPort(): void {
        this.port = new Port();
        this.port.x = 0;
        this.port.y = 0;
        this.app.stage.addChild(this.port);
    }

    private initGates(): void {

        const gate_one = new Gate();
        gate_one.x = 280;
        gate_one.y = 660;
        this.app.stage.addChild(gate_one);

        const gate_two = new Gate();
        gate_two.x = 280;
        gate_two.y = 0;
        this.app.stage.addChild(gate_two);


        this.gates.push(gate_one);
        this.gates.push(gate_two);
    }


    private initExit(): void {
        this.exit = new Exit();
        this.exit.x = 1000;
        this.exit.y = 400;
        this.app.stage.addChild(this.exit);
    }

    private initDocks(): void {
        this.docks = [];

        const numberOfDocks = 4;
        const startX = 20;
        const startY = 150;
        const deltaY = 150;
        let id = 1;

        for (let i = 0; i < numberOfDocks; i++) {
            const dock = new Dock(id);
            dock.id = id + i
            dock.x = startX;
            dock.y = startY + deltaY * i;
            this.app.stage.addChild(dock);
            this.docks.push(dock);
        }
    }

    public createShip() {
        const type = Math.random() > 0.5 ? "green" : "red";
        let startPosition = {x: 950, y: type === "green" ? 200 : 600};
        let newShip = new Ship(type, startPosition);
        this.ships.push(newShip);
        this.app.stage.addChild(newShip);
    }

    private animateShipMovement(ship: Ship, targetPosition: { x: number, y: number }) {
        let tween
        const coords = {x: ship.x, y: ship.y};
        tween = new TWEEN.Tween(coords)
            .to(targetPosition, 3000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(() => {
                ship.position.x = coords.x;
                ship.position.y = coords.y;
            })
        tween.start(undefined, true);
        this.animate();
    }

    public moveFromDock(currentShip: Ship, dock: Dock, exit: Exit) {
        let targetPosition = {x: exit.x, y: exit.y};
        dock.update();
        new TWEEN.Tween({x: currentShip.position.x, y: currentShip.position.y})
            .to(targetPosition, 3000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(coords => {
                currentShip.position.x = coords.x;
                currentShip.position.y = coords.y;
            })
            .onComplete(() => {
                this.removeShip(currentShip);
            })
            .start();
    }

    private removeShip(currentShip: Ship) {
        this.app.stage.removeChild(currentShip);
        this.ships.splice(this.ships.indexOf(currentShip), 1)
    }


    private moveToFreeDock(ship: Ship) {
        if (ship.type === "green") {
            let currentShip = ship;
            const dock = this.docks.find(dock => (dock.occupied || dock.occupied === ship.ID) && dock.isLoaded);
            if (dock && !currentShip.filled) {
                let currentShip = ship;
                this.animateShipMovement(currentShip, {x: dock.position.x + 30, y: dock.position.y + 30});
                setTimeout(() => {
                    dock.isLoaded = false;
                    dock.update();
                    ship.filled = true;
                    this.moveFromDock(currentShip, dock, this.exit)
                }, 5000);
                return true;
            }

        } else if (ship.type === "red") {
            const dock = this.docks.find(dock => (!dock.occupied || dock.occupied === ship.ID) && !dock.isLoaded);
            let currentShip = ship;
            if (dock && currentShip.filled) {
                let expectedDockId = dock.id
                this.animateShipMovement(ship, {x: dock.position.x + 30, y: dock.position.y + 30});
                dock.occupied = ship.ID;
                setTimeout(() => {
                    dock.isLoaded = true;
                    dock.update();
                    ship.filled = false;
                    this.moveFromDock(currentShip, dock, this.exit)
                }, 5000);
                return true;
            }

        }
    }

    public moveToLine(ship: Ship) {
        const prevShip = this.ships.find(currentShip => currentShip.type === ship.type && currentShip.ID == ship.ID - 1);

        let targetX = 300;
        let targetY = ship.type === "green" ? 200 : 600;


        if (ship.type === "red") {
            if (!this.redLine || this.redLine === ship.ID) {
                targetX;
                targetY;
                this.redLine = ship.ID
            }
            if (prevShip) {
                targetX = prevShip.x + 120;
                targetY = prevShip.y;
            }

        } else if (ship.type === "green") {
            if (!this.greenLine || this.greenLine === ship.ID) {
                targetX;
                targetY;
                this.greenLine = ship.ID
            } else if (prevShip) {
                targetX = prevShip.x + 120;
                targetY = prevShip.y;
            }
        }

        this.animateShipMovement(ship, {x: targetX, y: targetY});
    }

    public moveShip(ship: Ship) {
        const isMoveToDock = this.moveToFreeDock(ship);
        if (!isMoveToDock) {
            this.moveToLine(ship);
        }

    }

    private animate() {
        requestAnimationFrame(() => this.animate());
        TWEEN.update();
    }

    public update() {
        this.ships.forEach(ship => {
            ship.update();
            this.moveShip(ship);

        })
        if (Date.now() - this.createShipTime > 8 * 1000) {
            this.createShip();
            this.createShipTime = Date.now();
        }


    }
}

