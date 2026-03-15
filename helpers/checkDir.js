import { stat } from 'fs/promises';
import { resolve } from 'path';

const checkDir = async (currdir, path) => {
    try{
        const respath = resolve(currdir, path);
        const state = await stat(respath);
        const check = state.isDirectory();
        return {
            state:check,
            path:respath
        };
    }
    catch(err){
        throw err;
    } 
};

export default checkDir;