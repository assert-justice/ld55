import { Engine, Graphics, Window } from "cleo";
import { Globals, HEIGHT, WIDTH } from "./game/globals";
import { App } from "./game/app";
import { WindowDisplay } from "./game/window_display";

Window.setStats("Denimancers", WIDTH * 2, HEIGHT * 2, "borderless");

Engine.init = ()=>{
    Globals.init();
    const app = new App();
    const bg = Graphics.Texture.new(WIDTH, HEIGHT);
    const wd = new WindowDisplay(bg);
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
        wd.draw();
        // bg.draw(0, 0, {width: Window.width, height: Window.height});
    };
}