import {NullReferenceException} from "./../../src/Error/NullReferenceException";

let obj:Object={name:"zs",age:30};
throw new NullReferenceException(obj);