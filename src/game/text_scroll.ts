import { Graphics, System } from "cleo";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Text } from "../libs/core/text";
import { TileSprite } from "../libs/core/tile_sprite";
import { Sprite } from "../libs/core/sprite";

const lore = `In the waning light of the fifth age
a desperate struggle breaks out.`;

export class TextScroll{
    text: Text;
    scrollY = HEIGHT;
    scrollSpeed = 100;
    delay = 0.1;
    spr: Sprite;
    constructor(){
        this.spr = new Sprite(Graphics.Texture.fromFile("sprites/title_blank.png"));
        this.text = new Text(Globals.fontSpr, 0, "Sample text!");
    }
    draw(){
        this.spr.draw(0, 0);
        this.text.draw(WIDTH / 2 - this.text.width / 2, this.scrollY);
        // this is a really ugly hack, you're supposed to be able to render to a render target outside of the draw loop
        if(this.delay <= 0 && (this.scrollY < -this.text.height || Globals.inputManager.getButton("spawn").isPressed())){
            Globals.app.launch();
        }
    }
    update(dt: number){
        if(this.delay > 0) {
            this.delay -= dt;
            return;
        }
        this.scrollY -= dt * this.scrollSpeed;
        // if(this.scrollY < -this.text.height || Globals.inputManager.getButton("spawn").isPressed()){
        //     Globals.app.launch();
        // }
    }
}