import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import LoadManager from './loader/LoadManager'
import GLManager from './webgl/GLManager'
import Hotspot from './webgl/hotspot/Hotspot'
import AudioManager from './audio/AudioManger'
// import Guidepost from './webgl/hotspot/Guidepost'
import FlowEnum from './flow/FlowEnum'

interface MyAppEvents {
  'hotspot.open': (event: unknown) => void
  'audio.play': () => void
  'panoScene.enter': (event: unknown) => void
  'minimap.update': (event: unknown) => void
  'flow.open': (event: unknown) => void
  'flow.close': (event: unknown) => void
}

export default class WuHouCiApp extends THREE.EventDispatcher<MyAppEvents> {
  public lang: string
  public tweens: TWEEN.Group
  public loader: LoadManager
  public glManager: GLManager
  public audioManager: AudioManager

  constructor(canvas3d: HTMLCanvasElement) {
    super()

    this.lang = localStorage.getItem('wuhouci-lang') || 'zh'
    this.tweens = new TWEEN.Group()
    this.loader = new LoadManager()
    this.glManager = new GLManager(this, canvas3d, this.loader)
    this.audioManager = new AudioManager(this)
  }

  init() {
    this.glManager.init()
    this.audioManager.init()

    this.bindEvents()
    this.mainLoop(0)
  }

  bindEvents() {}

  mainLoop(time: number) {
    this.tweens.update(time)
    window.requestAnimationFrame(this.mainLoop.bind(this))
  }

  beginTravel() {
    this.glManager.beginTravel()
    const timer = setTimeout(() => {
      this.audioManager.playFlowAudio(FlowEnum.Intro)
      clearTimeout(timer)
    }, 1000)
  }

  reset() {
    this.glManager.reset()
    this.audioManager.reset()
    console.log('reset')
  }

  openFlow(flow: FlowEnum) {
    const guidepost = this.glManager.hotspotController.guideposts.find(
      (item) => item.targetFlow == flow,
    )

    this.audioManager.stopAudio()
    this.audioManager.playFlowAudio(guidepost.targetFlow)
    this.glManager.openFlow(guidepost).then(() => {
      if (flow != FlowEnum.HanZhaoLieMiao && flow != FlowEnum.WuHouCi) {
        const hotspot = this.glManager.hotspotController.hotspots.find((item) => item.flow == flow)
        this.openHotspot(hotspot)
      }
    })

    this.dispatchEvent({ type: 'flow.open', data: flow })
    this.dispatchEvent({ type: 'guidepost.open', guidepost })
    console.log('openFlow' + flow)
  }

  closeFlow(flow: FlowEnum) {
    const guidepost = this.glManager.hotspotController.guideposts.find(
      (item) => item.targetFlow == flow,
    )

    this.glManager.closeFlow(guidepost)
    this.audioManager.stopAudio()

    this.dispatchEvent({ type: 'flow.close' })
    this.dispatchEvent({ type: 'guidepost.close', guidepost })
  }

  openHotspot(hotspot: Hotspot) {
    this.dispatchEvent({ type: 'hotspot.open', data: hotspot })
    console.log('openHotspot:' + hotspot.title)
  }

  closeHotspot(id: number) {
    const hotspot = this.glManager.findHotspotById(id)

    //TODO: 缺一个流程描述，来关闭对应流程(5:刘备殿，6:诸葛亮殿)
    if (hotspot.flow == FlowEnum.HanZhaoLieMiao || hotspot.flow == FlowEnum.WuHouCi) {
      //Dd nothing
    } else {
      const guidpost = this.glManager.hotspotController.guideposts.find(
        (item) => item.targetFlow == hotspot.flow,
      )
      this.closeFlow(guidpost.hotspotId)
    }
  }

  onEnterPanoScene(flow: FlowEnum) {
    this.dispatchEvent({ type: 'panoScene.enter', data: flow })
  }

  onExsitPanoScene() {
    this.dispatchEvent({ type: 'panoScene.exsit' })
  }
}
