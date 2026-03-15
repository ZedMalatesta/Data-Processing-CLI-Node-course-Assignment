import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { createHash } from 'crypto';
import { resolvePath } from '../../utils/index.js';
import { SUPPORTED_HASH_ALGS } from './consts.js'

const handleHashCompare = async (dir, input, hashFile, algorithm = 'sha256') => {
    if (!SUPPORTED_HASH_ALGS.includes(algorithm)) throw new Error();

    const { state: inputState, path: inputPath } = await resolvePath(dir, input);
    if (inputState) throw new Error();

    const { state: hashState, path: hashPath } = await resolvePath(dir, hashFile);
    if (hashState) throw new Error();

    const hash = createHash(algorithm);
    const readStream = createReadStream(inputPath);

    for await (const chunk of readStream) {
        hash.update(chunk);
    }

    const actualHash = hash.digest('hex');
    const expectedHash = (await readFile(hashPath, 'utf8')).trim().toLowerCase();

    return actualHash.toLowerCase() === expectedHash ? 'OK' : 'MISMATCH';
};

export default handleHashCompare;
