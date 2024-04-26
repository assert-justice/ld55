import { Audio } from "cleo";

export class SoundManager{
    data: Map<string, Audio.Sound>;
    constructor(){
        this.data = new Map();
    }
    add(name: string, path: string){
        this.data.set(name, Audio.Sound.fromFile(path));
        return this;
    }
    get(name: string){
        const res = this.data.get(name);
        if(!res) throw `No audio source named '${name}'`;
        return res;
    }
}