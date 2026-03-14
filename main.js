import { createInterface } from 'readline/promises';
import argParser from './utils/argParser.js'

const app = async () => {
    try{
        const args = await argParser();
        console.log(args)

        console.log(
            `Welcome to Data Processing CLI!`
        );

        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log(`You are currently in workspace`)
    
        rl.on('line', async (line) => {
            console.log(line)
            console.log(`You are currently in workspace`) 
        });
        
        rl.on('SIGINT', async () => {
            rl.close();
        });

        rl.on('close', async () => {
            console.log(`Thank you for using Data Processing CLI!`);
        });
    }
    catch(err){
        throw err;
    }
};

await app();
