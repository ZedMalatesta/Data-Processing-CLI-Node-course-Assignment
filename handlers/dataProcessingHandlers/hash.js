import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import { resolvePath } from '../../utils/index.js';
import { SUPPORTED_HASH_ALGS } from './consts.js'

const handleHash = async (dir, input, algorithm = 'sha256', save = false) => {
    if (!SUPPORTED_HASH_ALGS.includes(algorithm)) throw new Error("Operation failed");

    const { state, path: inputPath } = await resolvePath(dir, input);
    if (state) throw new Error();
    const hash = createHash(algorithm);

    const readStream = createReadStream(inputPath);

    for await (const chunk of readStream) {
        hash.update(chunk);
    }

    const hashValue = hash.digest('hex');

    if (save) {
        await writeFile(`${inputPath}.${algorithm}`, hashValue, 'utf8');
    }

    return { algorithm, hashValue };
};

export default handleHash;