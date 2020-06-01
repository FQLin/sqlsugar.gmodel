export function requiredParam(target: any, propertyKey: string, index: number):void{
    const propertyValue = Reflect.get(target,propertyKey);
    if(propertyValue===null||propertyValue===undefined){
        throw new ReferenceError(`${target} ${propertyKey} property can not be null or undefined.`);
    }
    if(propertyValue instanceof Array && propertyValue.length === 0){
        throw new ReferenceError(`the array ${target} ${propertyKey} param do not contain data`);
    }
}