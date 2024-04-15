import { App } from "./app";
import { Arena } from "./arena";
import { Hud } from "./hud";
import { InputManager, JoyAxis, JoyButton, Key } from "../libs/core/input_manager";
import { Pool } from "../libs/core/pool";
import { Text } from "../libs/core/text";
import { TextureGen } from "../libs/core/texture_gen";
import { TextureManager } from "../libs/core/texture_manager";
import { TileSprite } from "../libs/core/tile_sprite";
import { Minion } from "./minion";
import { Pants } from "./pants";
import { Pickup } from "./pickup";
import { Player } from "./player";
import { Ranger } from "./ranger";
import { Bruiser } from "./bruiser";
import { Projectile } from "./projectile";

export const WIDTH = 640;
export const HEIGHT = 360;

export class Globals{
    static inputManager: InputManager;
    static textureManager: TextureManager;
    static arena: Arena;
    static player: Player
    static pantsPool: Pool;
    static projectilesPool: Pool;
    static rangersPool: Pool;
    static bruisersPool: Pool;
    static minionsPool: Pool;
    static pickupsPool: Pool;
    static fontSpr: TileSprite;
    static messageDisplay: Text;
    static app: App;
    static hud: Hud;
    static init(){
        this.inputManager = new InputManager();
        const move = this.inputManager.addAxis2D("move");
        move.xAxis.addKeyNegative(Key.a).addKeyPositive(Key.d).addJoyAxis(0, JoyAxis.lx);
        move.yAxis.addKeyNegative(Key.w).addKeyPositive(Key.s).addJoyAxis(0, JoyAxis.ly);
        this.inputManager.addButton("spawn").addKey(Key.space).addJoyButton(0, JoyButton.a);
        this.inputManager.addButton("pause").addKey(Key.escape).addJoyButton(0, JoyButton.start);
        this.inputManager.addButton("quit").addKey(Key.q).addJoyButton(0, JoyButton.x);
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
        .add("riley_art", "./sprites/riley_art.png")
        .add("pickups", "./sprites/pickups.png")
        .add("grass", "./sprites/grass.png")
        .add("boss", "./sprites/boss.png")
        .add("bruiser", "./sprites/brawler.png")
        .add("helmet", "./sprites/projectile_hat.png")
        .add("projectile", "./sprites/projectile.png")
        .add("spawn_effects", "./sprites/spawn_effects.png")
        .add("font", "./sprites/font.png")
        .add("brawler", "./sprites/brawler.png")
        .add("brawler_attack_energy", "./sprites/brawler_attack_energy.png")
        .add("blue_orb", "./sprites/blue_orb.png")
        .add("red_orb", "./sprites/red_orb.png")
        .add("xp_bar", "./sprites/xp_bar.png")
        .add("xp_bar_back", "./sprites/xp_bar_back.png")
        .add("minimap_outline", "./sprites/minimap_outline.png")
        .addTex("pallet", texGen.getTexture())
        this.fontSpr = new TileSprite(Globals.textureManager.get("font"), 5, 7);
        this.pantsPool = new Pool(()=>new Pants());
        this.projectilesPool = new Pool(()=>new Projectile());
        this.rangersPool = new Pool(()=>new Ranger());
        this.bruisersPool = new Pool(()=>new Bruiser());
        this.minionsPool = new Pool(()=>new Minion());
        this.pickupsPool = new Pool(()=>new Pickup());
    }
}