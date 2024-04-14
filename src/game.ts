import { System } from "cleo";
import { Arena } from "./arena";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Camera } from "./libs/core/camera";
import { Vec2 } from "./libs/core/la";
import { Minimap } from "./minimap";
import { Player } from "./player";
import { Hud } from "./hud";

export class Game{
    camera: Camera;
    player: Player;
    minimap: Minimap;
    hud: Hud;
    constructor(){
        this.camera = new Camera(WIDTH, HEIGHT);
        this.player = new Player(this.camera);
        Globals.player = this.player;
        Globals.arena = new Arena();
        this.minimap = new Minimap(48, 48, Globals.arena.width, Globals.arena.height);
        this.minimap.drawFn = ()=>{
            this.minimap.markPoint(this.player.position.x, this.player.position.y, 2);
            for (const minion of Globals.minionsPool.values()) {
                this.minimap.markPoint(minion.position.x, minion.position.y, 1);
            }
            // this.minimap.markPoint(0, 0, 0);
        }
        this.hud = new Hud();
        // const minion = Globals.minionsPool.getNew();
        // minion.position = new Vec2(100, 100);
    }
    update(dt: number){
        this.player.update(dt);
        Globals.pantsPool.update(dt);
        Globals.minionsPool.update(dt);
        Globals.arena.update(dt);
    }
    draw(){
        this.camera.draw(0,0,()=>{
            Globals.arena.draw();
            this.player.draw();
            for (const minion of Globals.minionsPool.values()) {
                minion.draw();
            }
            for (const pants of Globals.pantsPool.values()) {
                pants.draw();
            }
        });
        this.minimap.draw(0, 0);
        this.hud.draw();
    }
}