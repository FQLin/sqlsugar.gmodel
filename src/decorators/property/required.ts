export function required(target: any, propertyKey: string) {
    const propertyValue=Reflect.get(target,propertyKey);
    if(propertyValue===null||propertyValue===undefined){
        throw new ReferenceError(`${target} ${propertyKey} property can not be null or undefined.`);
    }
}