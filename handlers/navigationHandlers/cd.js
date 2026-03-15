import { handleUp } from './index.js';
import { resolvePath } from '../../utils/index.js';

const handleCD = async (currdir, newdir) => {
    try {
        let resdir = '';
        if(newdir==".."){
            resdir = handleUp(currdir);
        }
        else{
            const result = await resolvePath(currdir, newdir);  
            if(!result['state']) throw new Error("Operation failed");
            resdir=result['path'];
        }
        return resdir;
    }
    catch(err){
        throw err;
    }
};

export default handleCD;