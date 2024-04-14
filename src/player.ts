import { Graphics, System } from "cleo";
import { Entity } from "./libs/core/entity";
import { TileSprite } from "./libs/core/tile_sprite";
import { VAxis2D, VButton } from "./libs/core/input_manager";
import { Globals } from "./globals";
import { Vec2 } from "./libs/core/la";
import { Camera } from "./libs/core/camera";
import { Pants } from "./pants";

export class Player extends Entity{
    spr: TileSprite;
    move: VAxis2D;
    spawn: VButton;
    vel = new Vec2();
    speed = 300;
    width = 48;
    height = 48;
    camera: Camera;
    frame = 0;
    animClock = 0;
    animFps = 10;
    health = 100;
    maxHealth = 100;
    mana = 100;
    maxMana = 100;
    manaRegen = 10;
    xp = 0;
    xpToLevel = 100;
    invClock = 0;
    invTime = 0.5;
    summonCost = 10;
    summonCount = 1;
    constructor(camera: Camera){
        super();
        this.spr = new TileSprite(Graphics.Texture.fromFile("./sprites/player.png"), 48, 48);
        this.move = Globals.inputManager.getAxis2D("move");
        this.spawn = Globals.inputManager.getButton("spawn");
        this.camera = camera;
    }
    update(dt: number): void {
        this.vel = this.move.getValue();
        if(this.vel.length() > 0){
            if(this.animClock > 0) this.animClock-=dt;
            else{
                this.frame++;
                if(this.frame > 3) this.frame = 0;
                this.animClock = 1/this.animFps;
            }
            let offset = 0;
            if(this.vel.y > 0) offset = 0;
            else if(this.vel.y < 0) offset = 4;
            else if(Math.abs(this.vel.x) > 0) offset = 8;
            this.spr.setTile(offset+this.frame);
            if(this.vel.x < 0) this.spr.flipH = true;
            if(this.vel.x > 0) this.spr.flipH = false;
        }
        this.position.addMutate(this.vel.mul(dt * this.speed));
        if(this.position.x < 0) this.position.x = 0;
        if(this.position.x > Globals.arena.width) this.position.x = Globals.arena.width;
        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y > Globals.arena.height) this.position.y = Globals.arena.height;
        this.camera.position = this.position.copy();
        if(this.spawn.isPressed() && this.mana > this.summonCost){
            this.mana -= this.summonCost;
            for(let i = 0; i < this.summonCount; i++){
                const pants = Globals.pantsPool.getNew() as Pants;
                pants.mode = 'clean';
                pants.position = this.position.copy();
            }
        }
        if(this.invClock > 0) this.invClock-=dt;
        if(this.mana < this.maxMana) this.mana += this.manaRegen * dt;
    }
    draw(): void {
        this.spr.draw(this.position.x - this.width/2, this.position.y -this.height/2);
    }
    damage(val: number){
        if(this.invClock > 0) return;
        this.health -= val;
        this.invClock = this.invTime;
    }
}