import {
    handleUp,
    handleCD,
    handleLS,
    handleCSVToJson,
    handleJsonToCSV,
    handleCount
} from "../handlers/index.js"
import { parseArgs } from '../utils/index.js'

const setSuccessStatus = (value = '') => {
    return { 
        status:"success", 
        value
    }
}

const setExitStatus = () => {
    return { 
        status:"exit", 
        value:''
    }
}

const setChangeDirStatus = (newdir) => {
    return { 
        status:"changedir", 
        value:newdir
    }
}

const setErrorStatus = (message) => {
    return { 
        status:"error", 
        value:message
    }
}

const routing = async (line, currentDir) => {
    try{
        const new_line = await parseArgs(line)

        const [
            comm, 
            flags
        ] = new_line;

        let newdir = '';

        switch (comm) {
            case "up":
                newdir = await handleUp(currentDir); 
                return setChangeDirStatus(newdir);
            case "cd":
                if(!flags['path']) return setErrorStatus("Invalid input");
                else {
                    newdir = await handleCD(currentDir, flags['path']); 
                    return setChangeDirStatus(newdir);
                }
            case "ls":
                await handleLS(currentDir);
                return setSuccessStatus();
            case "csv-to-json":
                if(!flags['input']) return setErrorStatus("Operation failed");  
                await handleCSVToJson(currentDir, flags['input'], flags['output'])  
                return setSuccessStatus("Success!");               
            case "json-to-csv":
                if(!flags['input']) return setErrorStatus("Operation failed");  
                await handleJsonToCSV(currentDir, flags['input'], flags['output'])
                return setSuccessStatus("Success!");         
            case "count":
                if(!flags['input']) return setErrorStatus("Operation failed");
                const result = await handleCount(currentDir, flags['input']);
                return setSuccessStatus(`Lines: ${result.lines}\nWords: ${result.words}\nCharacters: ${result.characters}`);           

            case ".exit":
                return setExitStatus();

            default:
                return setErrorStatus("Invalid input");
        }
    }
    catch(err){
        console.error(err);  
        return setErrorStatus("Operation failed");
    }
};

export default routing;