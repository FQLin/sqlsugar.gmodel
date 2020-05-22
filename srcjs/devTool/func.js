module.exports.isPlainObject = (value)=>{
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.getPrototypeOf({});
}

module.exports.parseToBoolean = (value,defaultVal)=>{
    if(defaultVal !== true && defaultVal !== false){
        throw new Error(`defaultVal must be true or false`);
    }
    return (value === true || value === false) ? value : defaultVal;
}

/*export function isPlainObject(value){
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.getPrototypeOf({});
}*/