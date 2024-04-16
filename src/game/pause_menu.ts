import { Engine, System } from "cleo";
import { Globals, WIDTH } from "./globals";
import { Text } from "../libs/core/text";

export class PauseScreen{
    text: Text;
    controls: Text;
    delay = 0.1;
    constructor(){
        this.text = new Text(Globals.fontSpr, 0, "Paused");
        this.controls = new Text(Globals.fontSpr, 0, "Esc or [Start] to resume,\nSpace or [A] to restart, Q or [X] to quit");
    }
    draw(){
        this.text.draw(WIDTH / 2 - this.text.width / 2, 120);
        this.controls.draw(WIDTH / 2 - this.controls.width / 2, 140);
        if(this.delay <= 0 && Globals.inputManager.getButton("pause").isPressed()){
            Globals.app.pause(false);
        }
        if(this.delay <= 0 && Globals.inputManager.getButton("spawn").isPressed()){
            Globals.app.launch();
        }
        if(this.delay <= 0 && Globals.inputManager.getButton("quit").isPressed()){
            Engine.quit();
        }
    }
    update(dt: number){
        if(this.delay > 0) this.delay -= 1;
    }
}