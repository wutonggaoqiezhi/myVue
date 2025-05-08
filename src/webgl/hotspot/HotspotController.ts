import GLManager from '../GLManager'
import Hotspot from './Hotspot'
import * as THREE from 'three'
import Guidepost from './Guidepost'
// import FlowEnum from '../../flow/FlowEnum'
// import PanoScene from '../panoScene/PanoScene'

export default class HotspotController {
  public manager: GLManager
  public guideposts: Guidepost[]
  public hotspots: Hotspot[]
  private fileLoader: THREE.FileLoader

  constructor(manager: GLManager) {
    this.manager = manager
    this.guideposts = []
    this.hotspots = []
    this.fileLoader = new THREE.FileLoader().setResponseType('json')
  }

  init() {
    this.fileLoader.load(`hotspots/hotspots-${this.manager.app.lang}.json`, (data: any) => {
      data.guideposts.forEach((item, index) => {
        this.addGuidepost(new Guidepost(item))
      })
      data.hotspots.forEach((item) => {
        this.addHotspot(new Hotspot(item))
      })
    })
  }

  update(dt: number) {
    this.hotspots.forEach((item) => {
      item.update(dt)
    })
    this.guideposts.forEach((item) => {
      item.update(dt)
    })
  }

  addGuidepost(guidepost: Guidepost) {
    this.manager.scene.add(guidepost)
    this.guideposts.push(guidepost)
    guidepost.controller = this
  }

  addHotspot(hotspot: Hotspot) {
    this.manager.scene.add(hotspot)
    this.hotspots.push(hotspot)
    hotspot.controller = this
  }

  onHotspotClick(hotpsot: Hotspot) {
    this.manager.app.openHotspot(hotpsot)
  }

  onGuidePostClick(guidepost: Guidepost) {
    const flow = guidepost.targetFlow
    this.manager.app.openFlow(flow)
  }

  openFlow(guidepost: Guidepost) {
    const timer = setTimeout(() => {
      this.guideposts.forEach((item) => {
        item.visible = guidepost.hotspotId == item.hotspotId
      })
      clearTimeout(timer)
    }, 500)
  }

  closeFlow(guidepost: Guidepost) {}

  onEnterScene(guidepost: Guidepost) {
    this.hotspots.forEach((item) => {
      item.visible = item.flow == guidepost.targetFlow
    })
    this.guideposts.forEach((item) => {
      item.visible = false
    })
  }

  reset() {
    this.hotspots.forEach((item) => (item.visible = false))
    this.guideposts.forEach((item) => (item.visible = false))
  }

  showAllGuideposts(visible: boolean) {
    this.guideposts.forEach((item) => {
      item.visible = visible
    })
  }
}
