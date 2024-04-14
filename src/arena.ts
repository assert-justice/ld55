import { Graphics } from "cleo";
import { Sprite } from "./libs/core/sprite";
import { Globals } from "./globals";
import { Minion } from "./minion";

export class Arena{
    spr: Sprite;
    width = 2048;
    height = 2048;
    spawnClock = 0;
    spawnDelay = 3;
    spawnSize = 3;
    constructor(){
        this.spr = new Sprite(Graphics.Texture.fromFile("./sprites/ground.png"));
        this.spr.setProps({width: this.width, height: this.height, sw: this.width, sh: this.height});
    }
    draw(){
        this.spr.draw(0, 0);
    }
    isInBounds(x: number, y: number){
        if(x < 0 || x >= this.width) return false;
        if(y < 0 || y >= this.height) return false;
        return true;
    }
    update(dt: number){
        // spawn monsters
        if(this.spawnClock > 0){
            this.spawnClock -= dt;
        }
        else{
            this.spawnClock = this.spawnDelay;
            // pick position
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            for(let idx = 0; idx < this.spawnSize; idx++){
                const minion = Globals.minionsPool.getNew() as Minion;
                minion.position.x = x;
                minion.position.y = y;
            }
        }
    }
}