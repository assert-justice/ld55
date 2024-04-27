import { Audio, Graphics, System } from "cleo";
import { Globals } from "./globals";
import { Sprite } from "../libs/core/sprite";

export class SplashScreen{
    // text: Text;
    // controls: Text;
    spr: Sprite;
    delay = 0.1;
    music: Audio.Sound;
    constructor(){
        this.spr = new Sprite(Graphics.Texture.fromFile("sprites/title.png"));
        this.music = Globals.musicManager.get("title");
    }
    draw(){
        this.spr.draw(0, 0);
    }
    update(dt: number){
        if(!this.music.isPlaying) this.music.play();
        while(this.delay > 0) {
            this.delay -= dt;
            return;
        }
        if(Globals.inputManager.getButton("spawn").isPressed()){
            Globals.app.scroll();
            // this.music.stop();
        }
        Globals.musicManager.shouldPlay("title");
    }
}