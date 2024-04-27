import { Audio, System } from "cleo";
import { Arena } from "./arena";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Camera } from "../libs/core/camera";
import { Vec2 } from "../libs/core/la";
import { Minimap } from "./minimap";
import { Player } from "./player";
import { Hud } from "./hud";
import { Pickup } from "./pickup";
import { Boss } from "./boss";
import { Text } from "../libs/core/text";

export class Game{
    camera: Camera;
    player: Player;
    minimap: Minimap;
    hud: Hud;
    fightMusic: Audio.Sound;
    constructor(){
        // this.messageDisplay = new Text(Globals.fontSpr, 0, "");
        // Globals.setMessage = (str: string)=>{this.setMessage(str)}
        Globals.pantsPool.clear();
        Globals.rangersPool.clear();
        Globals.bruisersPool.clear();
        Globals.minionsPool.clear();
        Globals.pickupsPool.clear();
        Globals.spawnEffectsPool.clear();
        Globals.projectilesPool.clear();
        this.camera = new Camera(WIDTH, HEIGHT);
        this.player = new Player(this.camera);
        Globals.player = this.player;
        Globals.arena = new Arena();
        this.player.position.x = Globals.arena.width/2;
        this.player.position.y = Globals.arena.height/2;
        this.minimap = new Minimap(48, 48, Globals.arena.width, Globals.arena.height);
        this.hud = new Hud();
        Globals.hud = this.hud;
        this.fightMusic = Globals.musicManager.get("fight");
    }
    update(dt: number){
        this.player.update(dt);
        Globals.pantsPool.update(dt);
        Globals.minionsPool.update(dt);
        Globals.rangersPool.update(dt);
        Globals.bruisersPool.update(dt);
        Globals.pickupsPool.update(dt);
        Globals.projectilesPool.update(dt);
        Globals.spawnEffectsPool.update(dt);
        Globals.arena.update(dt);
        this.hud.update(dt);
        if(!this.fightMusic.isPlaying) this.fightMusic.play();
    }
    draw(){
        this.camera.draw(0,0,()=>{
            Globals.arena.draw();
            Globals.pantsPool.draw();
            Globals.pickupsPool.draw();
            Globals.minionsPool.draw();
            Globals.rangersPool.draw();
            Globals.bruisersPool.draw();
            this.player.draw();
            Globals.projectilesPool.draw();
            Globals.spawnEffectsPool.draw();
        });
        this.minimap.draw(0, 0);
        this.hud.draw();
    }
}