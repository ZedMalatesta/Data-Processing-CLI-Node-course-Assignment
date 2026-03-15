import { createReadStream, createWriteStream } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { basename, extname } from 'path';
import { resolve } from 'path';
 
const escapeValue = (value) => {
    const str = String(value ?? '');
    return (str.includes(',') || str.includes('"') || str.includes('\n'))
        ? '"' + str.replace(/"/g, '""') + '"'
        : str;
};
 
const handleJsonToCSV = async (dir, input, output) => {
 
    const inputFile = input;
    const outputFile = output || basename(inputFile, extname(inputFile)) + '.csv';

    const inputPath = resolve(dir, inputFile);
    const outputPath = resolve(dir, outputFile);

    let rawJson = '';
    const readStream = createReadStream(inputPath, { encoding: 'utf8' });

    for await (const chunk of readStream) {
        rawJson += chunk;
    }

    const data = JSON.parse(rawJson);
    if (!Array.isArray(data) || data.length === 0) throw new Error();

    const headers = Object.keys(data[0]);

    const rows = [
        headers.join(','),
        ...data.map(obj => headers.map(h => escapeValue(obj[h])).join(','))
    ].map(row => row + '\n');

    await pipeline(Readable.from(rows), createWriteStream(outputPath));
};

export default handleJsonToCSV;