import { homedir } from 'os';
import { resolve } from 'path';

export default class CommandLineState{
    constructor(){
        this.dir = homedir();
    }

    getDir = () => {
        return this.dir;
    }

    setDir = (dir) => {
        this.dir = resolve(dir);
    }
}