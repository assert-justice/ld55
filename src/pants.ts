import { System } from "cleo";
import { Globals } from "./globals";
import { Entity } from "./libs/core/entity";
import { Vec2 } from "./libs/core/la";
import { TileSprite } from "./libs/core/tile_sprite";
import { Minion } from "./minion";

export class Pants extends Entity{
    spr: TileSprite;
    width = 32;
    height = 32;
    mode: 'clean' | 'dirty' = "clean";
    animClock = 0;
    animFps = 10;
    frame = 0;
    seekRange = 500;
    wanderRange = 300;
    speed = 100;
    state: 'wander' | 'seek' | 'idle' = 'wander';
    lastState: 'wander' | 'seek' | 'idle' = 'idle';
    velocity = new Vec2();
    dest = new Vec2();
    target?: Entity;
    constructor(){
        super();
        this.spr = new TileSprite(Globals.textureManager.get("pants"), this.width, this.height);
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
    getClosestTarget(){
        let leastDis = Infinity;
        this.target = undefined;
        for (const m of Globals.minionsPool.values()) {
            const minion = m as Minion;
            if(this.mode === 'clean' && minion.purity >= 1) continue;
            if(this.mode === 'dirty' && minion.purity <= -1) continue;
            const dis = this.position.distance(m.position);
            if(dis < this.seekRange && dis < leastDis){
                this.target = m;
                leastDis = dis;
            }
        }
    }
    getClosestPants(){
        let leastDis = Infinity;
        let pants: Pants | undefined;
        for (const p of Globals.pantsPool.values()) {
            if(p === this) continue;
            const dis = this.position.distance(p.position);
            if(dis < leastDis){
                leastDis = dis;
                pants = p as Pants;
            }
        }
        return pants;
    }
    update(dt: number): void {
        this.animClock -= dt;
        if(this.animClock <= 0){
            this.animClock += 1/this.animFps;
            let offset = 0;
            if(this.mode === "dirty") offset = 4;
            this.frame += 1;
            if(this.frame >= 4) this.frame = 0;
            this.spr.setTile(offset + this.frame);
        }
        // state transitions
        if(this.state === 'wander'){
            this.getClosestTarget();
            if(this.target && this.target.position.distance(this.position) < this.seekRange){
                this.state = 'seek';
            }
        }
        else if(this.state === 'seek'){
            if(!this.target) this.state = 'wander';
            else if(this.position.distance(this.target.position) > this.seekRange) this.state = 'wander';
            else{
                const t = this.target as Minion;
                if(Math.abs(t.purity) >= 1) this.getClosestTarget();
            }
        }
        if(this.state === 'wander'){
            if(this.lastState !== 'wander') this.randomDest();
            if(this.position.distance(this.dest) < 10){
                // add oob check
                this.randomDest();
            }
            this.velocity = this.dest.sub(this.position).normalize().mulMutate(this.speed);
        }
        else if(this.state === 'seek'){
            if(this.target){
                if(this.position.distance(this.target.position) < 10){
                    const mob = this.target as Minion;
                    mob.changePurity(this.mode === 'clean' ? 1 : -1);
                    this.cleanup();
                }
                this.velocity = this.target.position.sub(this.position).normalize().mulMutate(this.speed);
            }
        }
        this.position.addMutate(this.velocity.mul(dt));
        if(this.position.x < 0) this.position.x = 0;
        if(this.position.x > Globals.arena.width) this.position.x = Globals.arena.width;
        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y > Globals.arena.height) this.position.y = Globals.arena.height;
        this.lastState = this.state;
    }
    draw(): void {
        this.spr.draw(this.position.x - this.width/2, this.position.y - this.height/2);
    }
    init(): void {
        // this.randomDest();
        this.state = 'wander';
        // this.position.x += (Math.random() * 2 - 1)*10
        // this.position.y += (Math.random() * 2 - 1)*10
        // System.println(this.position)
    }
}