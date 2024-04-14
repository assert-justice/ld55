import { Graphics } from "cleo";
import { TileSprite } from "./libs/core/tile_sprite";
import { TextureGen } from "./libs/core/texture_gen";
import { Globals } from "./globals";

export class Minimap{
    tex: Graphics.Texture;
    pallet: TileSprite;
    width: number;
    height: number;
    areaWidth: number;
    areaHeight: number;
    drawFn: ()=>void = ()=>{};
    constructor(width: number, height: number, areaWidth: number, areaHeight: number){
        this.width = width; this.height = height;
        this.areaWidth = areaWidth; this.areaHeight = areaHeight;
        this.tex = Graphics.Texture.new(width, height);
        this.pallet = new TileSprite(Globals.textureManager.get("pallet"), 1, 1);
    }
    markPoint(x: number, y: number, idx: number){
        this.pallet.setTile(idx);
        this.pallet.setProps({width: 2, height: 2})
        this.pallet.draw(x/this.areaWidth*this.width, y/this.areaHeight*this.height);
    }
    draw(x: number, y: number){
        Graphics.pushRenderTarget(this.tex);
        Graphics.setClearColor(256, 256, 256);
        Graphics.clear();
        Graphics.setClearColor(0, 0, 0);
        this.drawFn();
        Graphics.popRenderTarget();
        this.tex.draw(x, y);
    }
}