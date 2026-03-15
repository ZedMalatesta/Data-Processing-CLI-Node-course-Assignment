import { createReadStream, createWriteStream } from 'fs';
import { createDecipheriv, scryptSync } from 'crypto';
import { pipeline } from 'stream/promises';
import { resolve } from 'path';
import { open } from 'fs/promises';
import { resolvePath } from '../../utils/index.js';
 
const HEADER_SIZE = 28;
const AUTH_TAG_SIZE = 16;
 
const handleDecrypt = async (dir, input, output, password) => {
    const { state: inputState, path: inputPath } = await resolvePath(dir, input);
    if(inputState) throw new Error("Operation failed");
 
    const outputPath = resolve(dir, output);
 
    const fd = await open(inputPath, 'r');
    const stat = await fd.stat();
    const fileSize = stat.size;
 
    const header = Buffer.allocUnsafe(HEADER_SIZE);
    await fd.read(header, 0, HEADER_SIZE, 0);
 
    const authTag = Buffer.allocUnsafe(AUTH_TAG_SIZE);
    await fd.read(authTag, 0, AUTH_TAG_SIZE, fileSize - AUTH_TAG_SIZE);
 
    await fd.close();
 
    const salt = header.subarray(0, 16);
    const iv = header.subarray(16, 28);
    const key = scryptSync(password, salt, 32);
 
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
 
    await pipeline(
        createReadStream(inputPath, { start: HEADER_SIZE, end: fileSize - AUTH_TAG_SIZE - 1 }),
        decipher,
        createWriteStream(outputPath)
    );
};
 
export default handleDecrypt;