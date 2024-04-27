import { Engine, System } from "cleo";
import { Globals, WIDTH } from "./globals";
import { Text } from "../libs/core/text";

const ctr = `Esc or [Start] to resume,
Space or [A] to restart, Q or [X] to quit
m to toggle music on/off
n to toggle sfx on/off`

export class PauseScreen{
    text: Text;
    controls: Text;
    // status: Text;
    delay = 0.1;
    constructor(){
        this.text = new Text(Globals.fontSpr, 0, "Paused");
        this.controls = new Text(Globals.fontSpr, 0, ctr);
        // this.status = new Text(Globals.fontSpr, 0, ctr);
    }
    draw(){
        this.text.draw(WIDTH / 2 - this.text.width / 2, 120);
        this.controls.draw(WIDTH / 2 - this.controls.width / 2, 140);
    }
    update(dt: number){
        if(this.delay > 0) this.delay -= dt;
        if(this.delay <= 0 && Globals.inputManager.getButton("pause").isPressed()){
            Globals.app.pause(false);
        }
        if(this.delay <= 0 && Globals.inputManager.getButton("spawn").isPressed()){
            Globals.app.launch();
        }
        if(this.delay <= 0 && Globals.inputManager.getButton("quit").isPressed()){
            Engine.quit();
        }
        if(Globals.inputManager.getButton("mute_music").isPressed()){
            Globals.musicManager.isMuted = !Globals.musicManager.isMuted;
        }
        if(Globals.inputManager.getButton("mute_sfx").isPressed()){
            Globals.soundManager.isMuted = !Globals.soundManager.isMuted;
        }
        // Globals.inputManager.getButton("mute_sfx").isPressed()
    }
}