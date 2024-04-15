import { Game } from "./game";
import { Globals } from "./globals";
import { LoseScreen } from "./lose_screen";
import { PauseScreen } from "./pause_menu";
import { SplashScreen } from "./splash_screen";
import { TextScroll } from "./text_scroll";
import { WinScreen } from "./win_screen";

export class App{
    mode: 'splash' | 'scroll' | 'game' | 'pause' | 'win' | 'lose' = 'splash';
    splashScreen: SplashScreen;
    scrollScreen: TextScroll;
    winScreen: WinScreen;
    loseScreen: LoseScreen;
    pauseScreen: PauseScreen;
    game: Game;
    isPaused = true;
    constructor(){
        this.splashScreen = new SplashScreen();
        this.scrollScreen = new TextScroll();
        this.pauseScreen = new PauseScreen();
        this.winScreen = new WinScreen();
        this.loseScreen = new LoseScreen();
        this.game = new Game();
        Globals.app = this;
    }
    update(dt: number){
        switch (this.mode) {
            case 'splash':
                this.splashScreen.update(dt);
                break;
            case 'scroll':
                this.scrollScreen.update(dt);
                break;
            case 'game':
                this.game.update(dt);
                break;
            case 'pause':
                this.pauseScreen.update(dt);
                break;
            case 'win':
                this.winScreen.update(dt);
                break;
            case 'lose':
                this.loseScreen.update(dt);
                break;
            default:
                break;
        }
    }
    draw(){
        switch (this.mode) {
            case 'splash':
                this.splashScreen.draw();
                break;
            case 'scroll':
                this.scrollScreen.draw();
                break;
            case 'game':
                this.game.draw();
                break;
            case 'pause':
                this.pauseScreen.draw();
                break;
            case 'win':
                this.winScreen.draw();
                break;
            case 'lose':
                this.loseScreen.draw();
                break;
            default:
                break;
        }
    }
    pause(state: boolean){
        if(state){
            this.mode = 'pause';
            this.pauseScreen.delay = 0.1;
        }
        else{
            this.mode = 'game';
        }
    }
    win(){
        this.mode = 'win';
    }
    lose(){
        this.mode = 'lose';
    }
    scroll(){
        this.mode = 'scroll';
    }
    launch(){
        this.mode = 'game';
        this.game = new Game();
    }
}