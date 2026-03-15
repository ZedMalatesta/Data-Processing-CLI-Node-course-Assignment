import { handleUp } from './index.js';
import { pathResolver } from '../../utils/index.js';

const handleCD = async (currdir, newdir) => {
    try {
        let resdir = '';
        if(newdir==".."){
            resdir = handleUp(currdir);
        }
        else{
            let result = await pathResolver(currdir, newdir);  
            if(!result['state']) throw new Error();
            resdir=result['path'];
        }
        return resdir;
    }
    catch(err){
        throw err;
    }
};

export default handleCD;