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
        this.exit.x = 600;
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
        let startPosition = {x: 800, y: type === "green" ? 200 : 600};
        let newShip = new Ship(type);
        this.ships.push(newShip);
        this.app.stage.addChild(newShip);
    }

    private animateShipMovement(ship: Ship, targetPosition: { x: number, y: number }) {
        const coords = {x: ship.x, y: ship.y};
        new TWEEN.Tween(coords)
            .to(targetPosition, 6000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(() => {
                ship.x = coords.x;
                ship.y = coords.y;
            })
            .start();

    }

    private getTargetDock(ship: Ship) {
        if (ship.type === "green") {
            const dock = this.docks.find(dock => (!dock.occupied || dock.occupied === ship.ID) && dock.isLoaded);
            if (dock && !ship.filled) {
                dock.occupied = ship.ID;
                dock.timer = dock.timer ? dock.timer : Date.now();
                return dock;
            }
        }

        if (ship.type === "red") {
            const dock = this.docks.find(dock => (!dock.occupied || dock.occupied === ship.ID) && !dock.isLoaded);
            if (dock && ship.filled) {
                dock.occupied = ship.ID;
                dock.timer = dock.timer ? dock.timer : Date.now();
                return dock;
            }
        }
    }

    private setOccupiedStatus(dock: Dock) {
        dock.occupied = null;
    }

    public moveToExit(ship: Ship) {
        const dock = this.docks.find(dock => (dock.occupied === ship.ID));

        if (dock?.timer && Date.now() - 5000 > dock.timer) {
            if (ship.type === "red") {
                ship.readyToRemove = Date.now();
                ship.filled = false;
                dock.isLoaded = true;
                dock.occupied = null;
                dock.timer = null;
                this.animateShipMovement(ship, {x: this.exit.x, y: this.exit.y});
            }
            if (ship.type === "green") {
                ship.readyToRemove = Date.now();
                ship.filled = true;
                dock.isLoaded = false;
                dock.occupied = null;
                dock.timer = null;
                this.animateShipMovement(ship, {x: this.exit.x, y: this.exit.y});
            }
        }

    }

    public moveToLine(ship: Ship) {
        const prevShip = this.ships.find(currentShip => currentShip.type === ship.type && currentShip.ID == ship.ID - 1);

        let targetX = 300;
        let targetY = ship.type === "green" ? 200 : 600;


        if (ship.type === "red") {
            if (!this.redLine || this.redLine === ship.ID) {
                this.redLine = ship.ID
            }
            if (prevShip && prevShip.filled) {
                targetX = prevShip.x + 120;
                targetY = prevShip.y;
            }

        } else if (ship.type === "green") {
            if (!this.greenLine || this.greenLine === ship.ID) {
                this.greenLine = ship.ID
            } else if (prevShip && !prevShip.filled) {
                targetX = prevShip.x + 120;
                targetY = prevShip.y;
            }
        }

        this.animateShipMovement(ship, {x: targetX, y: targetY});
    }

    public moveShip(ship: Ship) {
        if (ship.readyToRemove) return;
        const dock = this.getTargetDock(ship);
        if (ship.type === "red") {
            if (dock && ship.filled) {
                this.animateShipMovement(ship, {x: dock.position.x + 30, y: dock.position.y + 30});

            }

            if (!dock) {
                this.moveToLine(ship)
            }
        }
        if (ship.type === "green") {
            if (dock && !ship.filled) {
                this.animateShipMovement(ship, {x: dock.position.x + 30, y: dock.position.y + 30});

                // this.moveToExit(ship)
            }

            if (!dock) {
                this.moveToLine(ship)
            }
        }
        this.moveToExit(ship)
    }

    private animate(time?: number) {
        requestAnimationFrame(() => this.animate());
        TWEEN.update(time);
    }

    private removeShip(ship: Ship) {
        this.app.stage.removeChild(ship);
        this.ships.splice(this.ships.indexOf(ship), 1)
    }

    public update() {
        this.docks.forEach(dock => {
            dock.update();
        })
        this.ships.forEach(ship => {
            ship.update();
            this.moveShip(ship);
            if (ship.readyToRemove && Date.now() - ship.readyToRemove > 6000) {
                this.removeShip(ship)
            }
        })
        if (Date.now() - this.createShipTime > 8 * 1000) {
            this.createShip();
            this.createShipTime = Date.now();
        }
        this.animate();
    }
}

