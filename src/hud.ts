import { Globals, HEIGHT } from "./globals";
import { HealthBar } from "./health_bar";
import { Player } from "./player";

export class Hud{
    player: Player;
    healthSphere: HealthBar;
    manaSphere: HealthBar;
    xpBar: HealthBar;
    constructor(){
        this.player = Globals.player;
        this.healthSphere = new HealthBar(46, 46, 1, 1);
        this.manaSphere = new HealthBar(46, 46, 1, 2);
        this.xpBar = new HealthBar(286, 14, 1, 5);
    }
    draw(){
        this.healthSphere.value = this.player.health / this.player.maxHealth;
        this.manaSphere.value = this.player.mana / this.player.maxMana;
        this.xpBar.value = this.player.xp / this.player.xpToLevel;
        this.healthSphere.drawOrb(128, HEIGHT-48);
        this.xpBar.draw(176, HEIGHT-16);
        this.manaSphere.drawOrb(464, HEIGHT-48);
    }
}