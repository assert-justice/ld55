import { Entity } from "../libs/core/entity";
import { Vec2 } from "../libs/core/la";
import { TileSprite } from "../libs/core/tile_sprite";
import { Globals } from "./globals";
import { Minion } from "./minion";

export class Projectile extends Entity{
    spr: TileSprite;
    animClock = 0;
    animFps = 10;
    target?: Entity;
    purity = 0;
    lifetime = 3;
    frame = 0;
    damageValue = 8;
    velocity = new Vec2();
    constructor(){
        super();
        this.spr = new TileSprite(Globals.textureManager.get("projectile"), 32, 32);
    }
    getClosestTarget(){
        // if pure, targets include non pure minions and boss
        // otherwise targets are players and pure minions
        let distance = Infinity;
        this.target = undefined;
        if(this.purity >= 1){
            this.target = Globals.arena.boss;
            if(this.target){
                distance = this.position.distance(this.target.position);
                // if(distance < this.bossRange) return distance;
            }
            for (const m of Globals.minionsPool.values()) {
                const min = m as Minion;
                const dis = this.position.distance(min.position);
                if(min.purity < 1 && dis < distance){
                    distance = dis;
                    this.target = m;
                }
            }
            for (const m of Globals.rangersPool.values()) {
                const min = m as Minion;
                const dis = this.position.distance(min.position);
                if(min.purity < 1 && dis < distance){
                    distance = dis;
                    this.target = m;
                }
            }
            for (const m of Globals.bruisersPool.values()) {
                const min = m as Minion;
                const dis = this.position.distance(min.position);
                if(min.purity < 1 && dis < distance){
                    distance = dis;
                    this.target = m;
                }
            }

        }
        else{
            this.target = Globals.player;
            distance = this.position.distance(Globals.player.position);
            for (const m of Globals.minionsPool.values()) {
                const min = m as Minion;
                const dis = this.position.distance(min.position);
                if(min.purity >= 1 && dis < distance){
                    distance = dis;
                    this.target = m;
                }
            }
            for (const m of Globals.rangersPool.values()) {
                const min = m as Minion;
                const dis = this.position.distance(min.position);
                if(min.purity >= 1 && dis < distance){
                    distance = dis;
                    this.target = m;
                }
            }
            for (const m of Globals.bruisersPool.values()) {
                const min = m as Minion;
                const dis = this.position.distance(min.position);
                if(min.purity >= 1 && dis < distance){
                    distance = dis;
                    this.target = m;
                }
            }
        }
        return distance;
    }
    update(dt: number): void {
        this.animClock -= dt;
        if(this.animClock <= 0){
            this.frame++;
            if(this.frame >= 3) this.frame = 0;
            this.spr.setTile(this.frame);
            this.animClock = 1/this.animFps;
        }
        this.lifetime -= dt;
        if(this.lifetime <= 0) {
            this.cleanup();
            return;
        }
        const dis = this.getClosestTarget();
        if(this.target && dis < 16){
            const t = this.target as Minion;
            t.damage(this.damageValue);
            this.cleanup();
        }
        this.position.addMutate(this.velocity.mul(dt));
    }
    draw(): void {
        this.spr.draw(this.position.x - 16, this.position.y - 16);
    }
}