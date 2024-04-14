import { Engine, Graphics, Window } from "cleo";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Game } from "./game";

Window.setStats("You Reap what you Sew", WIDTH * 3, HEIGHT * 3);

Engine.init = ()=>{
    Globals.init();
    const bg = Graphics.Texture.new(WIDTH, HEIGHT);
    const game = new Game();
    Engine.update = (dt: number)=>{
        Globals.inputManager.poll();
        game.update(dt);
    };
    Engine.draw = ()=>{
        Graphics.pushRenderTarget(bg);
        Graphics.clear();
        game.draw();
        Graphics.popRenderTarget();
        bg.draw(0, 0, {width: Window.width, height: Window.height});
    };
}