import { Graphics, System } from "cleo";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Text } from "../libs/core/text";
import { TileSprite } from "../libs/core/tile_sprite";
import { Sprite } from "../libs/core/sprite";

const lore = `In the waning light of the fifth age
a desperate struggle breaks out.

In this ruined world only the sacred denim of the
long long ago carries value. Mages of the weave, the
so-called "Denimancers", rule with an iron fist.
Who could stand against them? Only one of their own.

Wielder of the ancient textiles, acolyte of the
needle and dye, will you take on the grand magus
of your order and restore justice to the realm?
`;

export class TextScroll{
    text: Text;
    scrollY = HEIGHT;
    scrollSpeed = 30;
    delay = 0.1;
    spr: Sprite;
    constructor(){
        this.spr = new Sprite(Graphics.Texture.fromFile("sprites/title_blank.png"));
        this.text = new Text(Globals.fontSpr, 0, lore);
    }
    draw(){
        this.spr.draw(0, 0);
        this.text.draw(WIDTH / 2 - this.text.width / 2, this.scrollY);
    }
    update(dt: number){
        if(this.delay > 0) {
            this.delay -= dt;
            return;
        }
        this.scrollY -= dt * this.scrollSpeed;
        if(this.delay <= 0 && (this.scrollY < -this.text.height || Globals.inputManager.getButton("spawn").isPressed())){
            Globals.musicManager.get("title").stop();
            Globals.app.launch();
        }
        Globals.musicManager.shouldPlay("title");
    }
}