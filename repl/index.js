import {
    handleUp,
    handleCD,
    handleLS,
    handleCSVToJson,
    handleJsonToCSV,
    handleCount,
    handleHash,
    handleHashCompare,
    handleEncrypt,
    handleDecrypt
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
        let result = '';

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
                if(!flags['input'] || !flags['output']) return setErrorStatus("Invalid input");  
                await handleCSVToJson(currentDir, flags['input'], flags['output'])  
                return setSuccessStatus();               
            case "json-to-csv":
                if(!flags['input'] || !flags['output']) return setErrorStatus("Invalid input");  
                await handleJsonToCSV(currentDir, flags['input'], flags['output'])
                return setSuccessStatus();         
            case "count":
                if(!flags['input']) return setErrorStatus("Invalid input");
                result = await handleCount(currentDir, flags['input']);
                return setSuccessStatus(`Lines: ${result.lines}\nWords: ${result.words}\nCharacters: ${result.characters}`);
            case 'hash': 
                if(!flags['input']) return setErrorStatus("Invalid input");
                result = await handleHash(currentDir, flags['input'], flags['algorithm'], flags['save']);
                return setSuccessStatus(`${result.algorithm}: ${result.hashValue}`);                   
            case 'hash-compare': 
                if(!flags['input']||!flags['hash']) return setErrorStatus("Invalid input");
                result = await handleHashCompare(currentDir, flags['input'], flags['hash'], flags['algorithm']);
                return setSuccessStatus(result);
            case "encrypt":
                if(!flags['input'] || !flags['output'] || !flags['password']) return setErrorStatus("Invalid input");
                await handleEncrypt(currentDir, flags['input'], flags['output'], flags['password']);
                return setSuccessStatus();    
            case "decrypt":
                if(!flags['input'] || !flags['output'] || !flags['password']) return setErrorStatus("Invalid input");
                await handleDecrypt(currentDir, flags['input'], flags['output'], flags['password']);
                return setSuccessStatus();    

            case ".exit":
                return setExitStatus();

            default:
                return setErrorStatus("Invalid input");
        }
    }
    catch(err){
        return setErrorStatus("Operation failed");
    }
};

export default routing;