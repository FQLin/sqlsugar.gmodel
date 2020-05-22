namespace Helper{
    isPlainObject:(obj:any):boolean=>{
        return typeof(obj) === "object";
    }
    export isPlainObject(obj:any):boolean{
        if(typeof(obj) === "objet"){
            return true;
        }else{
            return false;
        }
    }
}