import { Graphics } from "cleo";
import { TileSprite } from "../libs/core/tile_sprite";
import { TextureGen } from "../libs/core/texture_gen";
import { Globals } from "./globals";
import { Minion } from "./minion";

export class Minimap{
    tex: Graphics.Texture;
    border: Graphics.Texture;
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
        this.border = Globals.textureManager.get("minimap_outline");
    }
    markPoint(x: number, y: number, idx: number){
        this.pallet.setTile(idx);
        this.pallet.setProps({width: 2, height: 2})
        this.pallet.draw(x/this.areaWidth*this.width, y/this.areaHeight*this.height);
    }
    draw(x: number, y: number){
        Graphics.pushRenderTarget(this.tex);
        // Graphics.setClearColor(256, 256, 256);
        Graphics.clear();
        // Graphics.setClearColor(0, 0, 0);
        this.markPoint(Globals.player.position.x, Globals.player.position.y, 2);
        for (const minion of Globals.minionsPool.values()) {
            const m = minion as Minion;
            this.markPoint(minion.position.x, minion.position.y, m.purity>=1?3:1);
        }
        Graphics.popRenderTarget();
        this.tex.draw(x, y);
        this.border.draw(x, y);
    }
}