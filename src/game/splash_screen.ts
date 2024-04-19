import { Audio, Graphics, System } from "cleo";
import { Globals, WIDTH } from "./globals";
import { Text } from "../libs/core/text";
import { TileSprite } from "../libs/core/tile_sprite";
import { Sprite } from "../libs/core/sprite";

export class SplashScreen{
    // text: Text;
    // controls: Text;
    spr: Sprite;
    delay = 0.1;
    music: Audio.Sound;
    constructor(){
        this.spr = new Sprite(Graphics.Texture.fromFile("sprites/title.png"));
        this.music = Audio.Sound.fromFile("music/boss.mp3");
        // this.text = new Text(Globals.fontSpr, 0, "Denimancers: You Reap what you Sew");
        // this.controls = new Text(Globals.fontSpr, 0, "Press Space or [A] to begin...")
    }
    draw(){
        this.spr.draw(0, 0);
        // this.text.draw(WIDTH / 2 - this.text.width / 2, 120);
        // this.controls.draw(WIDTH / 2 - this.controls.width / 2, 140);
    }
    update(dt: number){
        // if(!this.music.isPlaying) this.music.play();
        while(this.delay > 0) {
            this.delay -= dt;
            return;
        }
        if(Globals.inputManager.getButton("spawn").isPressed()){
            Globals.app.scroll();
        }
    }
}