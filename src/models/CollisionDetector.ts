interface Entity {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default class CollisionDetector {
    static isColliding(entityA: Entity, entityB: Entity): boolean {
        return (
            entityA.x < entityB.x + entityB.width &&
            entityA.x + entityA.width > entityB.x &&
            entityA.y < entityB.y + entityB.height &&
            entityA.y + entityA.height > entityB.y
        );
    }
}