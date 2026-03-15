import { stat } from 'fs/promises';
import { resolve } from 'path';

const pathResolver = async (currdir, path) => {
    try {
        const respath = resolve(currdir, path);
        const state = await stat(respath);
        const check = state.isDirectory();
        return {
            state: check,
            path: respath
        };
    }
    catch (err) {
        throw err;
    }
};

export default pathResolver;