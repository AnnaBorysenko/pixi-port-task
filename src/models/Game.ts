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
    private readonly gateEntranceStart: number;
    private readonly gateEntranceEnd: number;
    private createShipTime: number;
    private unloadingQueue: number | null;
    private loadingQueue: number | null;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.docks = [];
        this.ships = [];
        this.gates = [];
        this.gateEntranceStart = 80;
        this.gateEntranceEnd = 295;
        this.port = new Port();
        this.exit = new Exit();
        this.init();
        this.unloadingQueue = null;
        this.loadingQueue = null;
        this.createShipTime = Date.now();

    }

    private init(): void {
        this.initPort();
        this.initExit();
        this.initDocks();
        this.initGates();
        this.createShip();
    }

    private initPort(): void {
        this.port = new Port();
        this.port.x = 0;
        this.port.y = 0;
        this.app.stage.addChild(this.port);
    }

    private initGates(): void {
        this.gates = [];
        const gatePositions = [{x: 280, y: 660}, {x: 280, y: 0}];

        for (let i = 0; i < gatePositions.length; i++) {
            const gate = new Gate();
            gate.x = gatePositions[i].x;
            gate.y = gatePositions[i].y;
            this.app.stage.addChild(gate);
            this.gates.push(gate);
        }
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
    private initExit(): void {
        this.exit = new Exit();
        this.exit.x = 830;
        this.exit.y = 400;
        this.app.stage.addChild(this.exit);
    }
    public createShip() {
        const type = Math.random() > 0.5 ? "green" : "red";
        let newShip = new Ship(type);
        this.ships.push(newShip);
        this.app.stage.addChild(newShip);
    }

    private getTargetDock(ship: Ship) {
        if (ship.type === "green") {
            const dock = this.docks.find(dock => (!dock.occupied || dock.occupied === ship.ID) && dock.isLoaded);
            if (dock && !ship.isFilled) {
                dock.occupied = ship.ID;
                dock.timer = dock.timer ? dock.timer : Date.now();
                return dock;
            }
        }
        if (ship.type === "red") {
            const freeDock = this.docks.find(dock => !dock.occupied && !dock.isLoaded);
            const currentShipDock = this.docks.find(dock => dock.occupied === ship.ID);

            if (currentShipDock) {
                return currentShipDock
            }
            if (freeDock && ship.isFilled) {
                freeDock.occupied = ship.ID;
                freeDock.timer = freeDock.timer ? freeDock.timer : Date.now();
                return freeDock;
            }

        }
    }

    public moveToExit(ship: Ship) {
        const dock = this.docks.find(dock => (dock.occupied === ship.ID));

        if (dock?.timer && Date.now() - 5000 > dock.timer) {
            if (ship.type === "red") {
                ship.readyToRemove = Date.now();
                ship.isFilled = false;
                dock.isLoaded = true;
                dock.occupied = null;
                dock.timer = null;
                ship.moveTo({x: this.exit.x, y: this.exit.y});
            }
            if (ship.type === "green") {
                ship.readyToRemove = Date.now();
                ship.isFilled = true;
                dock.isLoaded = false;
                dock.occupied = null;
                dock.timer = null;
                ship.moveTo({x: this.exit.x, y: this.exit.y});
            }
        }

    }

    public moveToLine(ship: Ship) {
        const prevShip = this.ships.find(currentShip => currentShip.type === ship.type && currentShip.ID == ship.ID - 1);

        let targetX = 300;
        let targetY = ship.type === "green" ? 200 : 600;

        if (ship.type === "red") {
            if (!this.unloadingQueue || this.unloadingQueue === ship.ID) {
                this.unloadingQueue = ship.ID
            }
            if (prevShip && prevShip.isFilled) {
                targetX = prevShip.x + 120;
                targetY = prevShip.y;
            }

        }
        if (ship.type === "green") {
            if (!this.loadingQueue || this.loadingQueue === ship.ID) {
                this.loadingQueue = ship.ID
            }
            if (prevShip && !prevShip.isFilled && prevShip.x > 290) {
                targetX = prevShip.x + 120;
                targetY = prevShip.y;
            }
        }

        ship.moveTo({x: targetX, y: targetY});
    }

    private isEntranceOccupied(): boolean {
        return this.ships.some(ship => {
            return ship.x >= this.gateEntranceStart && ship.x <= this.gateEntranceEnd;
        });
    }

    public moveShip(ship: Ship) {
        if (this.isEntranceOccupied()) return;
        if (ship.readyToRemove) return;
        const dock = this.getTargetDock(ship);
        if (ship.type === "red") {
            if (dock && ship.isFilled) ship.moveTo({x: dock.position.x + 30, y: dock.position.y + 30});

            if (!dock) this.moveToLine(ship);

            this.moveToExit(ship);
        }
        if (ship.type === "green") {
            if (dock && !ship.isFilled) ship.moveTo({x: dock.position.x + 30, y: dock.position.y + 30});

            if (!dock) this.moveToLine(ship);

            if (dock && dock.occupied === ship.ID) this.moveToExit(ship);
        }
    }

    private animate() {
        requestAnimationFrame(() => this.animate());
        TWEEN.update();
    }

    private removeShip(ship: Ship) {
        this.app.stage.removeChild(ship);
        this.ships.splice(this.ships.indexOf(ship), 1);
    }


    public update() {
        this.docks.forEach(dock => {
            dock.update();
        })
        this.ships.forEach(ship => {
            ship.update();
            this.moveShip(ship);
            if (ship.readyToRemove && Date.now() - ship.readyToRemove > 5000) this.removeShip(ship);

        })
        if (Date.now() - this.createShipTime > 8 * 1000) {
            this.createShip();
            this.createShipTime = Date.now();
        }
        this.animate();
    }
}

