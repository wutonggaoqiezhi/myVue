import LoadWorker from './LoadWorker'
import LoadRequest from './LoadRequest'
import * as THREE from 'three'

const BASE_URL = '../'

interface MyEventMap {
  start: unknown
  progress: { data: { loaded: number; total: number } }
  complete: unknown
}

export default class LoadManager extends THREE.EventDispatcher<MyEventMap> {
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

  addRequest(url: string, responseType: string, callBack: (message: unknown) => void) {
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
      const item = this.loadQueue[i]
      if (item.noNeedForLoad()) continue

      this.handleRequest(item, (message) => {
        item.callBack?.(message)

        if ((message as { msg: string }).msg == 'success') {
          item.loaded = true
          this.numOfDone++
        } else {
          item.failedTimes++
          console.warn(`retry load ${this.loadQueue[i].url}`)
        }

        this.handleRequests()
        this.dispatchEvent({
          type: 'progress',
          data: { loaded: this.numOfDone, total: this.numOfTotal },
        })
        if (this.numOfDone == this.numOfTotal) this.dispatchEvent({ type: 'complete' })
      })
    }
  }

  private handleRequest(requset: LoadRequest, callBack: (data: unknown) => void) {
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
