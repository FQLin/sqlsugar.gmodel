namespace Helper{
    export const isPlainObject = (obj:any):boolean=>{
        return typeof(obj) === "object";
    };

    export const hide=(...el:HTMLElement[]):void=>[...el].forEach(e=>(e.style.display="none"));

    export const hasClass=(el:HTMLElement,className:string):boolean=>el.classList.contains(className);

    export const toggleClass=(el:HTMLElement,className:string):boolean=>el.classList.toggle(className);

    export const getScrollPosition=(el:Window)=>({
        x:el.pageXOffset!==undefined?el.pageXOffset:el.document.documentElement.scrollLeft,// el.scrollLeft
        y:el.pageYOffset!==undefined?el.pageYOffset:el.document.documentElement.scrollTop
    });

    export const scrollToTop=():void=>{
        const c=document.documentElement.scrollTop || document.body.scrollTop;
        if(c>0){
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0,c-c/8);
        }
    };

    export const elementContains=(parent:HTMLElement,child:HTMLElement):boolean=>parent!==child &&parent.contains(child);

    export const elementIsVisibleInViewport=(el:HTMLElement,partiallyVisible:boolean=false):boolean=>{
        const {top,left,bottom,right}=el.getBoundingClientRect();
        const {innerHeight,innerWidth} = window;
        return partiallyVisible
        ?((top>0&&top<innerHeight)||(bottom>0&&bottom<innerHeight))&&
        ((left>0&&left<innerWidth)||(right>0&&right<innerWidth))
        :top>=0 && left>=0&&bottom<=innerHeight && right<=innerWidth;
    };

    export const getImages=(el:HTMLElement,includeDuplicates:boolean=false)=>{
        const images=[...el.getElementsByTagName("img")].map(img=>img.getAttribute("src"));
        return includeDuplicates?images:[...new Set(images)];
    };

    export const detectDevicelype=():string=>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ?"Mobile":"Desktop";

    export const currentURL=():string=>window.location.href;

    export const getURLParameters=(url:string):object=>
    (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
        (a,v)=>((a[v.slice(0,v.indexOf("="))]=v.slice(v.indexOf("=")+1)),a),
        {}
    );

    export const formToObject=(form:HTMLFormElement):object=>
    Array.from(new FormData(form)).reduce(
        (acc,[key,value])=>({
            ...acc,
            [key]:value
        }),
        {}
    );

    export const get =(from:any,...selectors:string[]):string[]=>
    [...selectors].map(s=>
        s
            .replace(/\[([^\[\]]*)\]/g,".$1.")
            .split(".")
            .filter(t=>t!=="")
            .reduce((prev,cur)=>prev&&prev[cur],from)
    );

    export const triggerEvent=(el:HTMLElement,eventType:string,detail:object):boolean=>
    el.dispatchEvent(new CustomEvent(eventType,{detail}));

    export const off=
        (el:HTMLElement,evt:string,fn:()=>{},opts:boolean=false):void=>el.removeEventListener(evt,fn,opts);

    export const formatDuration=(ms:number):string=>{
        if(ms<0)ms=-ms;
        const time={
            day:Math.floor(ms/86400000),
            hour:Math.floor(ms/3600000)%24,
            minute:Math.floor(ms/60000)%60,
            second:Math.floor(ms/1000)%60,
            millisecond:Math.floor(ms)%1000
        };
        return Object.entries(time)
        .filter(val=>val[1]!==0)
        .map(([key,val])=>`${val} ${key}${val !== 1 ? "s" : ""}`)
        .join(", ");
    };

    export const getDaysDiffBetweenDates=(dateInitial:Date,dateFinal:Date):number=>
    (dateFinal.getTime() - dateInitial.getTime())/(1000*3600*24);

    export const httpGet=(url:string,callback:(r:string)=>{},err:(r:XMLHttpRequest)=>void=console.error):void=>{
        const request=new XMLHttpRequest();
        request.open("GET",url,true);
        request.onload=()=>callback(request.responseText);
        request.onerror=()=>err(request);
        request.send();
    };

    export const httpPost=(url:string,data:string,callback:(rt:string)=>{},err:(r:XMLHttpRequest)=>void =console.error):void=>{
        const request=new XMLHttpRequest();
        request.open("POST",url,true);
        request.setRequestHeader("Content-type","application/json;charset=utf-8");
        request.onload=()=>callback(request.responseText);
        request.onerror=()=>err(request);
        request.send(data);
    };

    // 21.如何为指定选择器创建具有指定范围，步长和持续时间的计数器？
    export const counter=(selector:string,start:number,end:number,step:number=1,duration:number=2000):NodeJS.Timeout=>{
        let current=start;
        const _step=(end-start)*step<0?-step:step;
        const timer=setInterval(()=>{
            current+=_step;
            const el=document.querySelector(selector);
            if(el===null){
                throw new ReferenceError(selector);
            }else{
                el.innerHTML=current.toString();
                if(current>=end)el.innerHTML=end.toString();
                if(current>=end)clearInterval(timer);
            }
        },Math.abs(Math.floor(duration/(end-start))));
        return timer;
    };

    export const copyToClipboard=(str:string):void=>{
        const el=document.createElement("textarea");
        el.value=str;
        el.setAttribute("readonly","");
        el.style.position="absolute";
        el.style.left="-9999px";
        document.body.appendChild(el);
        const selection:Selection | null=document.getSelection();
        let selected:boolean=false;
        let range:Range|null=null;
        if(selection&&selection.rangeCount>0){
            selected=true;
            range=selection.getRangeAt(0);
        }
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        if(selected&&range!==null){
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    };

    export const isBrowserTabFocused=():boolean=>!document.hidden;

    const fs=require("fs");
    export const createDirIfNotExists=(dir:string):void=>(!fs.existsSync(dir)?fs.mkdirSync(dir):undefined);
}