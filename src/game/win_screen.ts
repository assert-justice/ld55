import { Engine, System, Graphics } from "cleo";
import { Globals, WIDTH } from "./globals";
import { Text } from "../libs/core/text";
import { TileSprite } from "../libs/core/tile_sprite";
import { Sprite } from "../libs/core/sprite";

const winLore = `[win lore]`;

export class WinScreen{
    text: Text;
    controls: Text;
    lore: Text;
    delay = 1;
    spr: Sprite;
    constructor(){
        this.spr = new Sprite(Graphics.Texture.fromFile("sprites/title_blank.png"));
        this.text = new Text(Globals.fontSpr, 0, "You Are Victorious!");
        this.lore = new Text(Globals.fontSpr, 0, winLore);
        this.controls = new Text(Globals.fontSpr, 0, "Space or [A] to play again, Q or [X] to quit")
    }
    draw(){
        this.spr.draw(0, 0);
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
        Globals.musicManager.shouldPlay("end");
    }
}