import { Audio, Graphics, System } from "cleo";
import { Entity } from "../libs/core/entity";
import { TileSprite } from "../libs/core/tile_sprite";
import { VAxis2D, VButton } from "../libs/core/input_manager";
import { Globals } from "./globals";
import { Vec2 } from "../libs/core/la";
import { Camera } from "../libs/core/camera";
import { Pants } from "./pants";
import { Pickup } from "./pickup";

export class Player extends Entity{
    spr: TileSprite;
    move: VAxis2D;
    spawn: VButton;
    vel = new Vec2();
    speed = 150;
    width = 48;
    height = 48;
    camera: Camera;
    frame = 0;
    animClock = 0;
    animFps = 10;
    health = 40;
    maxHealth = 40;
    healthRegen = 0.3;
    mana = 100;
    maxMana = 100;
    manaRegen = 10;
    xp = 0;
    xpToLevel = 4;
    xpLevelFactor = 1.2;
    level = 1;
    invClock = 0;
    invTime = 0.5;
    flickerClock = 0;
    flickerFps = 30;
    visible = true;
    summonCost = 30;
    summonCount = 1;
    pickupRange = 32;
    healthPickupPower = 20;
    manaPickupPower = 100;
    xpPickupPower = 1;
    // walkSound: Audio.Sound;
    summonSound: Audio.Sound;
    // levelUpSound: Audio.Sound;
    // damageSound: Audio.Sound;
    // pickupSound: Audio.Sound;
    constructor(camera: Camera){
        super();
        this.spr = new TileSprite(Graphics.Texture.fromFile("./sprites/player.png"), 48, 48);
        this.move = Globals.inputManager.getAxis2D("move");
        this.spawn = Globals.inputManager.getButton("spawn");
        this.camera = camera;
        this.summonSound = Globals.soundManager.get("summon");
        // this.walkSound = Audio.Sound.fromFile("sfx/walk.wav");
        // this.summonSound = Audio.Sound.fromFile("sfx/summon.wav");
        // this.levelUpSound = Audio.Sound.fromFile("sfx/level_up.wav");
        // this.damageSound = Audio.Sound.fromFile("sfx/damage.wav");
        // this.pickupSound = Audio.Sound.fromFile("sfx/pickup.wav");
        // Globals.setMessage("MESSAGE HERE");
    }
    closestPickup(){
        let pickup: Pickup | undefined;
        let dist = Infinity;
        for (const p of Globals.pickupsPool.values()) {
            const pi = p as Pickup;
            if(this.health >= this.maxHealth && pi.type === 'health') continue;
            if(this.mana >= this.maxMana && pi.type === 'mana') continue;
            const d = this.position.distance(p.position);
            if(d > this.pickupRange) continue;
            if(d < dist){
                pickup = pi;
                dist = d;
            }
        }
        return pickup;
    }
    levelUp(){
        // this.levelUpSound.play();
        interface LevelReward{name: string, fn: ()=>void};
        // level rewards
        // max health+, max mana+
        // health regen+, mana regen+
        // summon+
        // speed+
        const rewards: LevelReward[] = [
            {name: "Max Health Up", fn: ()=>{this.maxHealth += 10;}},
            {name: "Max Mana Up", fn: ()=>{this.maxMana += 20;}},
            {name: "Health Regen Up", fn: ()=>{this.healthRegen += 1;}},
            {name: "Mana Regen Up", fn: ()=>{this.manaRegen += 3;}},
            {name: "Speed Up", fn: ()=>{this.speed += 20;}},
            {name: "Summon Up", fn: ()=>{this.summonCount += 1;}},
        ];
        this.level++;
        // every nth level up should give summon up
        let idx = 0;
        if(this.level % 4 === 0) idx = 5;
        else Math.floor(Math.random() * 5);
        const reward = rewards[idx];
        // System.println(reward.name);
        Globals.hud.setMessage(reward.name);
        reward.fn();
        // fill health and mana
        this.health = this.maxHealth; this.mana = this.maxMana;
    }
    update(dt: number): void {
        if(this.xp >= this.xpToLevel){
            this.levelUp();
            this.xp -= this.xpToLevel;
            this.xpToLevel *= this.xpLevelFactor;
        }
        this.vel = this.move.getValue();
        if(this.vel.length() > 0){
            // if(!this.walkSound.isPlaying) this.walkSound.play();
            if(this.animClock > 0) this.animClock-=dt;
            else{
                this.frame++;
                if(this.frame > 3) this.frame = 0;
                this.animClock = 1/this.animFps;
            }
            let offset = 0;
            if(Math.abs(this.vel.x) + 0.1 > Math.abs(this.vel.y)){
                offset = 8;
            }
            else{
                if(this.vel.y > 0) offset = 0;
                else if(this.vel.y < 0) offset = 4;
            }
            // else if(Math.abs(this.vel.x) > 0) offset = 8;
            this.spr.setTile(offset+this.frame);
            if(this.vel.x < 0) this.spr.flipH = true;
            else if(this.vel.x > 0) this.spr.flipH = false;
        }
        this.position.addMutate(this.vel.mul(dt * this.speed));
        if(this.position.x < 0) this.position.x = 0;
        if(this.position.x > Globals.arena.width) this.position.x = Globals.arena.width;
        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y > Globals.arena.height) this.position.y = Globals.arena.height;
        this.camera.position = this.position.copy();
        if(this.spawn.isPressed() && this.mana > this.summonCost){
            this.mana -= this.summonCost;
            this.summonSound.play();
            for(let i = 0; i < this.summonCount; i++){
                const pants = Globals.pantsPool.getNew() as Pants;
                pants.mode = 'clean';
                pants.position = this.position.copy();
            }
        }
        const pickup = this.closestPickup();
        if(pickup){
            // this.pickupSound.play();
            if(pickup.type === 'health') this.health = Math.min(this.health+this.healthPickupPower, this.maxHealth);
            else if(pickup.type === 'mana') this.mana = Math.min(this.mana+this.manaPickupPower, this.maxMana);
            else if(pickup.type === 'xp'){
                this.xp += this.xpPickupPower;
            }
            pickup.cleanup();
        }
        if(this.invClock > 0) {
            this.invClock-=dt;
            if(this.flickerClock > 0) this.flickerClock -= dt;
            else{
                this.flickerClock = 1/this.flickerFps;
                this.visible = !this.visible;
            }
        }
        else{
            this.visible = true;
        }
        if(this.mana < this.maxMana) this.mana += this.manaRegen * dt;
        if(Globals.inputManager.getButton("pause").isPressed()) Globals.app.pause(true);
    }
    draw(): void {
        if(this.visible)this.spr.draw(this.position.x - this.width/2, this.position.y -this.height/2);
    }
    damage(val: number){
        if(this.invClock > 0) return;
        this.health -= val;
        this.invClock = this.invTime;
        // this.damageSound.play();
        if(this.health <= 0) Globals.app.lose();
    }
}