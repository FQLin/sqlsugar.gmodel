export function isPlainObject(value:any):boolean{
    if (Object.prototype.toString.call(value) !== "[object object]") {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.getPrototypeOf({});
}