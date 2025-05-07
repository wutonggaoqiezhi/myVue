import LoadWorker from './LoadWorker'
import LoadRequest from './LoadRequest'
import * as THREE from 'three'

const BASE_URL = '../'

export default class LoadManager extends THREE.EventDispatcher {
  MAX_SIMULTANEOUS_REQUEST = 1

  private loadQueue: LoadRequest[] = []
  private loadWorkers: LoadWorker[] = []
  private numOfTotal: number
  private numOfDone: number

  constructor() {
    super()

    for (let i = 0; i < this.MAX_SIMULTANEOUS_REQUEST; i++) {
      this.loadWorkers.push(new LoadWorker())
    }
    this.numOfTotal = 0
    this.numOfDone = 0
  }

  addRequest(url: string, responseType: string, callBack: Function) {
    this.loadQueue.push(new LoadRequest(`${BASE_URL.trim()}${url.trim()}`, responseType, callBack))
    this.numOfTotal++
  }

  start() {
    this.handleRequests()
    // setInterval(()=>{
    //     this.loadQueue = this.loadQueue.filter( item => !item.loaded);
    //     this.handleRequests();
    // }, 200)
    this.dispatchEvent({ type: 'start' })
  }

  handleRequests() {
    if (this.loadQueue.length == 0) return

    for (let i = 0; i < this.loadQueue.length; i++) {
      this.loadQueue[i].noNeedForLoad() ||
        this.handleRequest(this.loadQueue[i], (message) => {
          this.loadQueue[i].callBack && this.loadQueue[i].callBack(message)
          if (message.msg == 'success') {
            this.loadQueue[i].loaded = true
            this.numOfDone++
          } else {
            this.loadQueue[i].failedTimes++
            console.warn(`retry load ${this.loadQueue[i].url}`)
          }

          this.handleRequests()
          this.dispatchEvent({
            type: 'progress',
            data: { loaded: this.numOfDone, total: this.numOfTotal },
          })
          this.numOfDone == this.numOfTotal && this.dispatchEvent({ type: 'complete' })
        })
    }
  }

  private handleRequest(requset: LoadRequest, callBack: Function) {
    const numOfNeedRequset = Math.min(this.loadQueue.length, this.loadWorkers.length)

    for (let i = 0; i < numOfNeedRequset; i++) {
      const loadWorker = this.loadWorkers[i]
      if (!loadWorker.used) {
        loadWorker.runRequest(requset, callBack)
        break
      }
    }
  }
}
