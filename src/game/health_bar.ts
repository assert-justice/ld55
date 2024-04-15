import { Globals } from "./globals";
import { TileSprite } from "../libs/core/tile_sprite";

export class HealthBar{
    width: number;
    height: number;
    border: number;
    color: number;
    pallet: TileSprite;
    value = 1;
    drawBackground = true;
    constructor(width: number, height: number, border: number, color: number){
        this.width = width; this.height = height; this.border = border; this.color = color;
        this.pallet = new TileSprite(Globals.textureManager.get("pallet"), 1, 1);
    }
    draw(x: number, y: number){
        this.pallet.setTile(4);
        this.pallet.setProps({width: this.width + this.border*2, height: this.height + this.border*2});
        if(this.drawBackground) this.pallet.draw(x, y);
        this.pallet.setTile(this.color);
        this.pallet.setProps({width: this.width * this.value, height: this.height});
        this.pallet.draw(x + this.border, y + this.border);
    }
    drawOrb(x: number, y: number){
        this.pallet.setTile(4);
        this.pallet.setProps({width: this.width + this.border*2, height: this.height + this.border*2});
        this.pallet.draw(x, y);
        this.pallet.setTile(this.color);
        this.pallet.setProps({width: this.width, height: this.height * this.value});
        this.pallet.draw(x + this.border, y + this.border + this.height * (1-this.value));
    }
}