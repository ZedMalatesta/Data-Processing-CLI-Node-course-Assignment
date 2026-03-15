import { createReadStream } from 'fs';
import { resolve } from 'path';
 
const handleCount = async (dir, input) => {
    const inputPath = resolve(dir, input);

    let lines = 0;
    let words = 0;
    let characters = 0;
    let remainder = '';
 
    const readStream = createReadStream(inputPath, { encoding: 'utf8' });
 
    for await (const chunk of readStream) {
        characters += chunk.length;
        const parts = (remainder + chunk).split('\n');
        remainder = parts.pop();
        lines += parts.length;
        for (const part of parts) {
            words += part.trim().split(/\s+/).filter(w => w).length;
        }
    }
 
    if(remainder) {
        lines += 1;
        words += remainder.trim().split(/\s+/).filter(w => w).length;
    }
 
    return { lines, words, characters };
};
 
export default handleCount;