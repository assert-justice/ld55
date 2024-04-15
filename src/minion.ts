import { System } from "cleo";
import { Globals } from "./globals";
import { HealthBar } from "./health_bar";
import { Entity } from "./libs/core/entity";
import { Vec2 } from "./libs/core/la";
import { TileSprite } from "./libs/core/tile_sprite";
import { Pickup } from "./pickup";

export class Minion extends Entity{
    spr: TileSprite;
    width = 32;
    height = 32;
    purity = 0; // 1 is pure, -1 is corrupted, otherwise normal
    animClock = 0;
    animFps = 10;
    frame = 0;
    seekRange = 500;
    wanderRange = 300;
    playerRange = 300;
    bossRange = 500;
    speed = 130;
    state: 'wandering' | 'seeking' | 'idle' = 'wandering';
    dest = new Vec2();
    target?: Entity;
    healthBar: HealthBar;
    health = 10;
    invClock = 0;
    invTime = 0.3;
    flickerClock = 0;
    flickerFps = 30;
    visible = true;
    damageValue = 8;
    constructor(){
        super();
        this.spr = new TileSprite(Globals.textureManager.get("minion"), this.width, this.height);
        this.healthBar = new HealthBar(30, 4, 1, 1);
    }
    getClosestMinion(){
        let distance = Infinity;
        let ent: Entity | undefined = undefined;
        for (const m of Globals.minionsPool.values()) {
            if(m === this) continue;
            const min = m as Minion;
            const dis = this.position.distance(min.position);
            if(dis < distance){
                distance = dis;
                ent = m;
            }
        }
        return ent;
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
                if(distance < this.bossRange) return distance;
            }
            for (const m of Globals.minionsPool.values()) {
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
            if(distance < this.playerRange) return distance;
            for (const m of Globals.minionsPool.values()) {
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
        //
        this.animClock -= dt;
        if(this.invClock > 0) {
            this.invClock -= dt;
            if(this.flickerClock > 0) this.flickerClock -= dt;
            else{
                this.flickerClock = 1/this.flickerFps;
                this.visible = !this.visible;
            }
        }
        else this.visible = true;
        if(this.animClock <= 0){
            this.animClock += 1/this.animFps;
            let offset = 0;
            if(this.purity === 1) offset = 0;
            else if(this.purity === -1) offset = 4;
            else offset = 8;
            this.frame += 1;
            if(this.frame >= 4) this.frame = 0;
            this.spr.setTile(offset + this.frame);
        }
        let velocity = new Vec2();
        const lastState = this.state;
        // state transitions
        if(this.state === 'wandering'){
            if(this.getClosestTarget() < this.seekRange){this.state = 'seeking'}
        }
        else if(this.state === 'seeking'){
            if(this.getClosestTarget() > this.seekRange){this.state = 'wandering'}
        }
        // state business logic
        if(this.state === 'wandering'){
            if(lastState !== 'wandering'){
                this.randomDest();
            }
            else if(this.position.distance(this.dest) < 10){
                this.randomDest();
            }
            velocity = this.dest.sub(this.position).normalize().mul(this.speed);
        }
        else if(this.state === 'seeking'){
            if(this.target) {
                velocity = this.target.position.sub(this.position).normalize().mul(this.speed);
                if(this.position.distance(this.target.position) < 10){
                    const m = this.target as Minion;
                    m.damage(this.damageValue);
                    if(this.target === Globals.arena.boss) this.cleanup();
                }
            }
        }
        // avoid
        const ent = this.getClosestMinion();
        if(ent){
            const dis = this.position.distance(ent.position);
            if(dis < 10){
                if(dis === 0){
                    this.position.x += Math.random() * 2 - 1;
                    this.position.y += Math.random() * 2 - 1;
                }
                velocity = ent.position.sub(this.position).normalize().mul(-this.speed)
            }
        }
        this.position.addMutate(velocity.mul(dt));
        if(this.position.x < 0) this.position.x = 0;
        if(this.position.x > Globals.arena.width) this.position.x = Globals.arena.width;
        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y > Globals.arena.height) this.position.y = Globals.arena.height;
    }
    changePurity(val: number){
        this.purity += val;
        if(this.purity > 1) this.purity = 1;
        if(this.purity < -1) this.purity = -1;
    }
    draw(): void {
        const x = this.position.x - this.width/2;
        const y = this.position.y - this.height/2;
        this.spr.draw(x, y);
        this.healthBar.draw(x,y);
    }
    init(): void {
        this.purity = 0;
        this.speed = 130 + Math.random() * 50;
    }
    damage(val: number){
        if(this.invClock > 0) return;
        this.invClock = this.invTime;
        this.health -= val;
        this.healthBar.value = this.health/10;
        if(this.health < 0){
            this.cleanup();
            // spawn drops
            const dropChance = 0.3;
            // if(Math.random() > dropChance) return;
            const dropTries = 5;
            let angle = 0;
            const distance = 16;
            for(let idx = 0; idx < dropTries; idx++){
                if(Math.random() > dropChance) continue;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const pickup = Globals.pickupsPool.getNew() as Pickup;
                pickup.position.x = x; pickup.position.y = y;
                pickup.position.addMutate(this.position);
                const types: typeof pickup.type[] = ['health', 'mana', 'xp'];
                const type = types[Math.floor(Math.random() * 3)];
                pickup.type = type;
                angle += Math.PI * 2 / dropTries;
            }
        }
    }
}