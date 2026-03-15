const parseArgs = async (line) => {
    const [comm, ...tokens] = line.trim()
        .split("'").join('"')
        .split('"')
        .reduce((arr, curr, index) => {
            return index%2 != 0
                ? [...arr, curr]
                : [...arr, ...curr.split(" ")]
        }, [])
        .filter((elem) => elem);
 
    const flags = tokens.reduce((acc, arg, i, arr) => {
        if(arg.startsWith('--')) {
            const key = arg.slice(2);
            const next = arr[i+1];
            acc[key] = (next && !next.startsWith('--')) ? next : true;
        }
        return acc;
    }, comm === 'cd' ? { path: tokens.find(t => !t.startsWith('--')) } : {});
 
    return [comm, flags];
};
 
export default parseArgs;