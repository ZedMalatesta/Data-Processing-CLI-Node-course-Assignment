import { createInterface } from 'readline/promises';
import CommandLineState from './cliState/index.js';
import routing from "./repl/index.js";

const responceHandler = async (responce, CLS) => {
    switch (responce['status']) {
        case "exit":
            return true;
        case "changedir":
            CLS.setDir(responce['value']);
            return false;
        case "error":
            console.log(responce['value']);
            return false;
        case "success":
            if (responce['value']) console.log(responce['value']);
            return false;
        default:
            return false;
    }
}

const app = async () => {
    try {
        const CLS = new CommandLineState();

        console.log(
            `Welcome to Data Processing CLI!`
        );

        const rl = createInterface({
            input: process.stdin,
            output: process.stdout,

        });

        rl.setPrompt('> ');
        console.log(`You are currently in ${CLS.getDir()}`)
        rl.prompt();

        rl.on('line', async (line) => {
            const responce = await routing(line, CLS.getDir());
            const status = responce['status'];
            const isExit = await responceHandler(responce, CLS);
            if (isExit) rl.close();
            else {
                if (status === 'success' || status === 'changedir') {
                    console.log(`You are currently in ${CLS.getDir()}`)
                }
                rl.prompt();
            }
        });

        rl.on('SIGINT', async () => {
            rl.close();
        });

        rl.on('close', async () => {
            console.log(`Thank you for using Data Processing CLI!`);
        });
    }
    catch (err) {
        throw err;
    }
};

await app();
