import { Engine, Graphics, Window } from "cleo";
import { Globals, HEIGHT, WIDTH } from "./globals";
import { Game } from "./game";
import { SplashScreen } from "./splash_screen";
import { App } from "./app";

Window.setStats("Denimancers", WIDTH * 2, HEIGHT * 2);

Engine.init = ()=>{
    Globals.init();
    const app = new App();
    const bg = Graphics.Texture.new(WIDTH, HEIGHT);
    // const game = new Game();
    // const splash = new SplashScreen();
    Engine.update = (dt: number)=>{
        Globals.inputManager.poll();
        app.update(dt);
        // game.update(dt);
    };
    Engine.draw = ()=>{
        Graphics.pushRenderTarget(bg);
        Graphics.clear();
        // game.draw();
        app.draw();
        // splash.draw();
        Graphics.popRenderTarget();
        bg.draw(0, 0, {width: Window.width, height: Window.height});
    };
}