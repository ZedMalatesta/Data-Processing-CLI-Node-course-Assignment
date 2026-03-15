import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';
import { basename, extname } from 'path';
import { resolvePath } from '../../utils/index.js';
import { resolve } from 'path';

const handleCSVToJson = async (dir, input, output) => {
    const inputFile = input;
    const outputFile = output || basename(inputFile, extname(inputFile)) + '.json';

    const { state, path: inputPath } = await resolvePath(dir, inputFile);
    if (state) throw new Error();
    const outputPath = resolve(dir, outputFile);

    let headers = null;
    let first = true;
    let outputStarted = false;
    let buffer = '';

    const transform = new Transform({
        transform(chunk, _enc, cb) {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const rawLine of lines) {
                const line = rawLine.replace(/\r$/, '');
                if (!line.trim()) continue;

                if (!headers) {
                    headers = line.split(',');
                    continue;
                }

                const values = line.split(',');
                const obj = {};
                headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });

                if (!outputStarted) {
                    this.push('[\n');
                    outputStarted = true;
                    first = true;
                }

                this.push((first ? '  ' : ',\n  ') + JSON.stringify(obj));
                first = false;
            }
            cb();
        },
        flush(cb) {
            if (buffer.trim() && headers) {
                const line = buffer.replace(/\r$/, '');
                const values = line.split(',');
                const obj = {};
                headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });

                if (!outputStarted) { this.push('[\n'); outputStarted = true; first = true; }
                this.push((first ? '  ' : ',\n  ') + JSON.stringify(obj));
            }
            this.push(outputStarted ? '\n]' : '[]');
            cb();
        }
    });

    await pipeline(createReadStream(inputPath), transform, createWriteStream(outputPath));
};

export default handleCSVToJson;