import { readdir } from 'fs/promises';
import { checkDir, localSort } from '../../helpers/index.js';

const handleLS = async (dir) => {
    try{
        const all_files = await readdir(dir);
        let new_files = [];
        let new_dirs = [];
        for await (let file of all_files) {
            let isDir = await checkDir(dir, file);
            if(isDir['state']) new_dirs.push({
                Name: file,
                Type:"directory" 
            })
            else new_files.push({
                Name: file,
                Type:"file"
            })
        }
        console.table([...new_dirs.sort(localSort), ...new_files.sort(localSort)]);
    }
    catch(err){
        console.log(err)
        throw err;
    }
};

export default handleLS;