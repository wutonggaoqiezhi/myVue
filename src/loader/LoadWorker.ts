import LoadRequest from "./LoadRequest";

export default class LoadWorker {

    used:boolean
    
    private worker: Worker;
    private timeOutMillisecond = 5000;
    private timeOutHandle: number;
    private callBack?: Function;

    constructor() {
       
        this.worker = new Worker("worker/worker.js");
        this.worker.addEventListener("message", ( event ) => {
            
            if(this.timeOutHandle && (clearTimeout(this.timeOutHandle),this.timeOutHandle = 0) && event.data.msg && event.data.msg == "error")
            {    
                this.callBack && this.callBack( event.data );
                this.used = false;
                return;
            }
            this.used = false;
            this.callBack && this.callBack( event.data );

        },false);
        this.used = false;
        this.timeOutHandle = 0;
    }



    private createWorker() {
       
        this.worker = new Worker("worker/worker.js");
        this.worker.addEventListener("message", ( event ) => {
            
            if(this.timeOutHandle && (clearTimeout(this.timeOutHandle),this.timeOutHandle = 0) && event.data.msg && event.data.msg == "error")
            {    
                this.callBack && this.callBack( event.data );
                this.used = false;
                return;
            }
            this.used = false;
            this.callBack( event.data );

        },false);
    }

    runRequest( request: LoadRequest, callBack: Function ) {
        
        if(!this.used)
        {
            
            this.callBack = callBack
            this.timeOutHandle = window.setTimeout( () => {

                this.worker.terminate(), 
                this.callBack && this.callBack({ msg: "error", data:"noData" }),
                this.used = false,
                this.createWorker();
            }, this.timeOutMillisecond)

            this.worker.postMessage({
                cmd: "loadData",
                url: request.url,
                responseType: request.responseType
            });
            this.used = true;
        }

    }
}