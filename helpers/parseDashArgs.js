const parseDashArgs = async () => {
    let all_args = process.argv.slice(2).reduce((lines, arg)=>{
        let parsed_arg=arg.split("--")[1];
        if(parsed_arg&&parsed_arg.split("=").length>1){
            lines[`${parsed_arg.split("=")[0]}`] = parsed_arg.split("=")[1];
        }
        return lines;
    }, {})
    return all_args;
};

export default parseDashArgs;