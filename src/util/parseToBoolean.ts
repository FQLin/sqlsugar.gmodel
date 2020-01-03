export function parseToBoolean(value:any,defaultVal:any):boolean{
    if(defaultVal !== true && defaultVal !== false){
        throw new Error(`defaultVal must be true or false`);
    }
    return (value === true || value === false) ? value : defaultVal;
}