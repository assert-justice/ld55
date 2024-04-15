import { Graphics } from "cleo";
import { Sprite } from "./libs/core/sprite";

export class HealthOrb{
    spr: Sprite;
    value = 1;
    constructor(tex: Graphics.Texture){
        this.spr = new Sprite(tex);
    }
    draw(x: number, y: number){
        const height = this.spr.texture.height * this.value;
        const sy = this.spr.texture.height - height;
        this.spr.setProps({height, sy, sh: height});
        this.spr.draw(x, y + sy);
    }
}