import { Graphics, System } from "cleo";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { HealthBar } from "./health_bar";
import { Player } from "./player";
import { Sprite } from "../libs/core/sprite";
import { HealthOrb } from "./health_orb";
import { Text } from "../libs/core/text";

export class Hud{
    player: Player;
    // healthSphere: HealthBar;
    // manaSphere: HealthBar;
    healthOrb: HealthOrb;
    manaOrb: HealthOrb;
    xpBar: HealthBar;
    tex: Graphics.Texture;
    barTex: Graphics.Texture;
    messageDisplay: Text;
    messageClock = 0;
    messageDuration = 3;
    messageQueue: string[] = [];
    constructor(){
        this.player = Globals.player;
        // this.healthSphere = new HealthBar(46, 46, 1, 1);
        // this.manaSphere = new HealthBar(46, 46, 1, 2);
        this.healthOrb = new HealthOrb(Globals.textureManager.get("red_orb"))
        this.manaOrb = new HealthOrb(Globals.textureManager.get("blue_orb"))
        this.xpBar = new HealthBar(212, 14, 0, 5);
        this.xpBar.drawBackground = false;
        this.tex = Globals.textureManager.get("xp_bar");
        this.barTex = Globals.textureManager.get("xp_bar_back");
        this.messageDisplay = new Text(Globals.fontSpr, 0, "");
        // this.blueSpr = new Sprite(Globals.textureManager.get("blue_orb"));
        // this.redSpr = new Sprite(Globals.textureManager.get("blue_orb"));
    }
    setMessage(message: string){
        this.messageQueue.push(message);
        // this.messageClock = this.messageDuration;
        // this.messageDisplay.text = message;
    }
    draw(){
        this.healthOrb.value = Math.min(1, this.player.health / this.player.maxHealth);
        // stupid workaround for mana overflow
        this.manaOrb.value = Math.min(1, this.player.mana / this.player.maxMana);
        this.xpBar.value = this.player.xp / this.player.xpToLevel;
        this.barTex.draw(WIDTH/2 - this.tex.width/2, HEIGHT-this.tex.height);
        this.healthOrb.draw(126, HEIGHT-48);
        this.manaOrb.draw(466, HEIGHT-48);
        this.xpBar.draw(214, HEIGHT-24-7);
        this.tex.draw(WIDTH/2 - this.tex.width/2, HEIGHT-this.tex.height);
        if(this.messageClock > 0)this.messageDisplay.draw(WIDTH/2-this.messageDisplay.width/2, HEIGHT/2-this.messageDisplay.height/2);
    }
    update(dt: number){
        if(this.messageClock > 0) this.messageClock -= dt;
        else if(this.messageQueue.length > 0){
            this.messageClock = this.messageDuration;
            this.messageDisplay.text = this.messageQueue.shift() ?? "";
        }
    }
}