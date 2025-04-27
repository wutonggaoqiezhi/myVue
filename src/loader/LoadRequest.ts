export default class LoadRequest {

    url: string;
    responseType: string;

    callBack: Function;
    loaded: boolean;
    requseted:boolean;
    failedTimes: number;
    retryCount: number

    constructor( url: string, responseType: string, callBack: Function, retryCount?: number ) {

        this.url = url;
        this.responseType = responseType;

        this.callBack = callBack;
        this.loaded = false;
        this.requseted = false;
        this.failedTimes = 0;
        this.retryCount = retryCount || 0;
    }


    noNeedForLoad() {

        return this.loaded || this.failedTimes > this.retryCount;
    }
  
}