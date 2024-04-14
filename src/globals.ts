import { Arena } from "./arena";
import { InputManager, Key } from "./libs/core/input_manager";
import { Pool } from "./libs/core/pool";
import { TextureGen } from "./libs/core/texture_gen";
import { TextureManager } from "./libs/core/texture_manager";
import { Minion } from "./minion";
import { Pants } from "./pants";
import { Player } from "./player";

export const WIDTH = 640;
export const HEIGHT = 360;

export class Globals{
    static inputManager: InputManager;
    static textureManager: TextureManager;
    static arena: Arena;
    static player: Player
    static pantsPool: Pool;
    static minionsPool: Pool;
    static init(){
        this.inputManager = new InputManager();
        const move = this.inputManager.addAxis2D("move");
        move.xAxis.addKeyNegative(Key.a).addKeyPositive(Key.d);
        move.yAxis.addKeyNegative(Key.w).addKeyPositive(Key.s);
        this.inputManager.addButton("spawn").addKey(Key.space);
        const colors: [number, number, number, number][] = [
            [255, 255, 255, 255], // white
            [255, 0, 0, 255], // red
            [0, 255, 0, 255], // green
            [0, 0, 255, 255], // blue
            [0, 0, 0, 255], // black
            [255, 0, 255, 255], // yellow
        ];
        const texGen = new TextureGen(colors.length, 1);
        for(let idx = 0; idx < colors.length; idx++){
            const [r,g,b,a] = colors[idx];
            texGen.setPixel(idx, 0, r, g, b, a);
        }
        this.textureManager = new TextureManager()
        .add("pants", "./sprites/jean_spawns.png")
        .add("minion", "./sprites/minion.png")
        .addTex("pallet", texGen.getTexture())
        this.pantsPool = new Pool(()=>new Pants());
        this.minionsPool = new Pool(()=>new Minion());
    }
}