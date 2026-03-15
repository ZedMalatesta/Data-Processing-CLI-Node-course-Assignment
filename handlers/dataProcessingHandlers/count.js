import { createReadStream } from 'fs';
import { resolvePath } from '../../utils/index.js';

const handleCount = async (dir, input) => {
    const { state, path: inputPath } = await resolvePath(dir, input);
    if (state) throw new Error();

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

    if (remainder) {
        lines += 1;
        words += remainder.trim().split(/\s+/).filter(w => w).length;
    }

    return { lines, words, characters };
};

export default handleCount;