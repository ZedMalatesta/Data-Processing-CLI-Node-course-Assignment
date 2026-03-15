import { 
    parse 
} from 'path';

const handleUp = async (dir) => {
    try{
        const parsed_dir = parse(dir);
        if(parsed_dir['base']){
            return parsed_dir['dir'];
        }
        else return dir;
    }
    catch(err){
        console.log(err);
        throw err;
    }
};

export default handleUp;