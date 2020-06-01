import { IBaseConnectionOptions } from "./connection/IBaseConnectionOptions";
import { Driver } from "./driver/driver";

export class Gmodel{
    private readonly options:Driver;

    constructor(options:Driver){
        this.options=options;
    }
    public create():void{

    }


}