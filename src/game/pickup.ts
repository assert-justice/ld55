import { Globals } from "./globals";
import { Entity } from "../libs/core/entity";
import { TileSprite } from "../libs/core/tile_sprite";

export class Pickup extends Entity{
    private _type: 'health' | 'mana' | 'xp' = 'health'
    get type(){return this._type;}
    set type(v: typeof this._type){
        this._type = v;
        if(v === 'health') this.spr.setTile(6);
        else if(v === 'mana') this.spr.setTile(4);
        else if(v === 'xp') this.spr.setTile(10);
    }
    spr: TileSprite;
    sparkleClock = 0;
    sparkleTime = 3;
    frame = 0;
    animClock = 0;
    animFps = 10;
    constructor(){
        super();
        this.spr = new TileSprite(Globals.textureManager.get('pickups'), 16, 16);
        this.setFrame(0);
    }
    setFrame(f: number){
        let offset = 0;
        if(this.type === 'mana') offset = 4;
        else if(this.type === 'health') offset = 8;
        this.spr.setTile(f + offset);
    }
    update(dt: number): void {
        if(this.sparkleClock > 0){
            this.sparkleClock -= dt;
            return;
        }
        if(this.animClock > 0){
            this.animClock -= dt;
            return;
        }
        this.frame += 1;
        if(this.frame > 3){
            this.frame = 0;
            this.sparkleClock = this.sparkleTime;
        }
        this.setFrame(this.frame);
    }
    draw(): void {
        this.spr.draw(this.position.x, this.position.y);
    }
}