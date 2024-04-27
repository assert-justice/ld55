import { Audio, System } from "cleo";

export class SoundManager{
    data: Map<string, Audio.Sound>;
    private _isMuted = false;
    get isMuted(){return this._isMuted;}
    set isMuted(val: boolean){
        // return this._isMuted;
        this._isMuted = val;
        const volume = val?0:1;
        for (const src of this.data.values()) {
            src.volume = volume;
        }
    }
    constructor(){
        this.data = new Map();
    }
    add(name: string, path: string){
        const src = Audio.Sound.fromFile(path);
        this.data.set(name, src);
        return this;
    }
    get(name: string){
        const res = this.data.get(name);
        if(!res) throw `No audio source named '${name}'`;
        return res;
    }
    stop(){
        for (const src of this.data.values()) {
            src.stop();
        }
    }
    shouldPlay(name: string){
        const src = this.get(name);
        if(!src.isPlaying){
            this.stop();
            src.play();
        }
    }
}