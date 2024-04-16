import { Globals } from "./globals";
import { HealthBar } from "./health_bar";
import { Entity } from "../libs/core/entity";
import { Vec2 } from "../libs/core/la";
import { TileSprite } from "../libs/core/tile_sprite";
import { Minion } from "./minion";
import { Pants } from "./pants";

export class Boss extends Entity{
    spr: TileSprite;
    timeAlive = 0;
    dest = new Vec2();
    wanderRange = 100;
    speed = 50;
    pantsClock = 0;
    pantsCooldown = 10;
    pantsSpawnCount = 10;
    minionsClock = 5;
    minionsCooldown = 20;
    minionsSpawnCount = 5;
    bruisersSpawnCount = 3;
    healthBar: HealthBar;
    health = 500;
    maxHealth = 500;
    animClock = 0;
    animFps = 5;
    frame = 4;
    constructor(){
        super();
        this.spr = new TileSprite(Globals.textureManager.get("boss"), 128, 64);
        this.spr.setTile(4);
        this.healthBar = new HealthBar(126, 4, 1, 1);
    }
    randomDest(){
        while(true){
            this.dest.x = Math.random() * 2 - 1;
            this.dest.y = Math.random() * 2 - 1;
            this.dest.mulMutate(this.wanderRange);
            this.dest.addMutate(this.position);
            if(Globals.arena.isInBounds(this.dest.x, this.dest.y)) break;
        }
    }
    update(dt: number): void {
        this.animClock -= dt;
        if(this.animClock <= 0){
            this.animClock = 1/this.animFps;
            this.frame++;
            if(this.frame >= 8) this.frame = 4;
            this.spr.setTile(this.frame);
        }
        this.timeAlive += dt;
        if(this.pantsClock > 0) this.pantsClock -= dt;
        else{
            this.pantsClock = this.pantsCooldown;
            for(let idx = 0; idx < this.pantsSpawnCount; idx++){
                const pants = Globals.pantsPool.getNew() as Pants;
                pants.mode = 'dirty';
                const offset = new Vec2(Math.random()*2-1,Math.random()*2-1);
                pants.position = this.position.add(offset.mul(100));
            }
        }
        if(this.minionsClock > 0) this.minionsClock -= dt;
        else{
            this.minionsClock = this.minionsCooldown;
            for(let idx = 0; idx < this.minionsSpawnCount; idx++){
                const minion = Globals.minionsPool.getNew();
                const offset = new Vec2(Math.random()*2-1,Math.random()*2-1);
                minion.position = this.position.add(offset.mul(100));
            }
            for(let idx = 0; idx < this.bruisersSpawnCount; idx++){
                const minion = Globals.bruisersPool.getNew();
                const offset = new Vec2(Math.random()*2-1,Math.random()*2-1);
                minion.position = this.position.add(offset.mul(100));
            }
        }
        if(this.position.distance(this.dest) < 10){
            this.randomDest();
        }
        const velocity = this.dest.sub(this.position).normalize().mul(this.speed);
        this.position.addMutate(velocity.mul(dt));
    }
    draw(): void {
        const yOffset = 8 * Math.cos(this.timeAlive*3)
        this.spr.draw(this.position.x - this.spr.sheet.frameWidth/2, this.position.y + yOffset - this.spr.sheet.frameHeight/2);
        this.healthBar.draw(this.position.x - 64, this.position.y + yOffset - 48);
    }
    damage(val: number){
        this.health -= val;
        this.healthBar.value = this.health/this.maxHealth;
        if(this.health <= 0) Globals.app.win();
        // should kill anything that does damage to it
    }
}