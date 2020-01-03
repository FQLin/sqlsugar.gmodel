import { isPlainObject } from "../util/ObjectUtils";

export class NullReferenceException extends Error {
    constructor(err:any,message?:string) {
        let errorMessage:string=message||"";
        if (isPlainObject(err)) {
            errorMessage+=``
        }
        console.log(err);
        super(message);
    }
}