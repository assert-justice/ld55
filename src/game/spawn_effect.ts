import { Entity } from "../libs/core/entity";
import { TileSprite } from "../libs/core/tile_sprite";
import { Globals } from "./globals";

export class SpawnEffect extends Entity{
    spr: TileSprite;
    frame = -1;
    animClock = 0;
    animFps = 10;
    constructor(){
        super();
        this.spr = new TileSprite(Globals.textureManager.get("spawn_effects"), 32, 64);
    }
    update(dt: number): void {
        this.animClock -= dt;
        if(this.animClock <= 0){
            this.frame++;
            this.animClock = 1/this.animFps;
            if(this.frame >= 4) this.cleanup();
            else this.spr.setTile(this.frame);
        }
    }
    draw(): void {
        this.spr.draw(this.position.x-16, this.position.y-32)
    }
}