import { Graphics } from "cleo";
import { Sprite } from "../libs/core/sprite";
import { Globals, WIDTH } from "./globals";
import { Minion } from "./minion";
import { Vec2 } from "../libs/core/la";
import { Boss } from "./boss";
import { TileSprite } from "../libs/core/tile_sprite";
import { Text } from "../libs/core/text";

const tutorial = `
Move with WASD or Left Stick
Summon pants with Space or [A]
Your pants will purify your foes
and turn them to your side.
Use the map to survey the battle.
Watch your health and mana pools.
Grab gems to level up!
Beware! Another denimancer is on
the way...
`

export class Arena{
    spr: Sprite;
    width = 2048;
    height = 2048;
    spawnClock = 10;
    spawnDelay = 3;
    spawnSize = 3;
    bossClock = 60;
    boss?: Boss;
    tutorialText: Text;
    constructor(){
        // this.spr = new Sprite(Graphics.Texture.fromFile("./sprites/ground.png"));
        const tex = Graphics.Texture.new(512, 512);
        const grass = new TileSprite(Globals.textureManager.get("grass"), 32, 32);
        Graphics.pushRenderTarget(tex);
        for(let y = 0; y < 16; y++){
            for(let x = 0; x < 16; x++){
                grass.setTile(Math.floor(Math.random() * 3));
                grass.draw(x * 32, y * 32);
            }
        }
        Graphics.popRenderTarget();
        this.spr = new Sprite(tex);
        this.spr.setProps({width: this.width, height: this.height, sw: this.width, sh: this.height});
        this.tutorialText = new Text(Globals.fontSpr, 0, tutorial);
    }
    draw(){
        this.spr.draw(0, 0);
        this.tutorialText.draw(this.width/2-this.tutorialText.width/2, this.height/2-this.tutorialText.height)
        this.boss?.draw();
    }
    isInBounds(x: number, y: number){
        if(x < 0 || x >= this.width) return false;
        if(y < 0 || y >= this.height) return false;
        return true;
    }
    spawnMinions(){
        while(true){
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            if(Globals.player.position.distance(new Vec2(x,y)) < 500) continue;
            for(let idx = 0; idx < this.spawnSize; idx++){
                const minion = Globals.minionsPool.getNew() as Minion;
                minion.position.x = x;
                minion.position.y = y;
            }    
            break;
        }
    }
    spawnBoss(){
        if(this.boss) return;
        Globals.hud.setMessage("A FEARSOME ENEMY APPROACHES!")
        this.boss = new Boss();
        this.boss.position.x = this.width/2;
        this.boss.position.y = this.height/2;
    }
    update(dt: number){
        if(this.bossClock > 0){
            this.bossClock -= dt;
        }
        else{
            this.spawnBoss();
            this.bossClock = Infinity;
        }
        this.boss?.update(dt);
        // spawn monsters
        if(this.spawnClock > 0){
            this.spawnClock -= dt;
        }
        else{
            this.spawnClock = this.spawnDelay;
            this.spawnMinions();
        }
    }
}