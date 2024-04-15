import { Engine, System } from "cleo";
import { Globals, WIDTH } from "./globals";
import { Text } from "./libs/core/text";
import { TileSprite } from "./libs/core/tile_sprite";

export class LoseScreen{
    text: Text;
    controls: Text;
    delay = 0.1;
    constructor(){
        this.text = new Text(Globals.fontSpr, 0, "You Are Slain");
        this.controls = new Text(Globals.fontSpr, 0, "Space or [A] to retry, Q or [X] to quit")
    }
    draw(){
        this.text.draw(WIDTH / 2 - this.text.width / 2, 120);
        this.controls.draw(WIDTH / 2 - this.controls.width / 2, 140);
        if(this.delay <= 0 && Globals.inputManager.getButton("spawn").isPressed()) Globals.app.launch();
        if(this.delay <= 0 && Globals.inputManager.getButton("quit").isPressed()) Engine.quit();
    }
    update(dt: number){
        if(this.delay > 0){
            this.delay -= dt;
            return;
        }
    }
}