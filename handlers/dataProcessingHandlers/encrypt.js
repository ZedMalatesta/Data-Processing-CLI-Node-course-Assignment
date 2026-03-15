import { createReadStream, createWriteStream } from 'fs';
import { createCipheriv, randomBytes, scryptSync } from 'crypto';
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';
import { resolve } from 'path';
import { resolvePath } from '../../utils/index.js';
 
const handleEncrypt = async (dir, input, output, password) => {
    const { state: inputState, path: inputPath } = await resolvePath(dir, input);
    if(inputState) throw new Error("Operation failed");
 
    const outputPath = resolve(dir, output);
 
    const salt = randomBytes(16);
    const iv = randomBytes(12);
    const key = scryptSync(password, salt, 32);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
 
    const appendAuthTag = new Transform({
        transform(chunk, _enc, cb) { cb(null, chunk); },
        flush(cb) { cb(null, cipher.getAuthTag()); }
    });
 
    const writeStream = createWriteStream(outputPath);
    writeStream.write(salt);
    writeStream.write(iv);
 
    await pipeline(
        createReadStream(inputPath),
        cipher,
        appendAuthTag,
        writeStream
    );
};
 
export default handleEncrypt;