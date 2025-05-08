import * as THREE from 'three'
import HotspotController from './HotspotController'
import FlowEnum from '../../flow/FlowEnum'

enum HotspotTypeEnum {
  Image = 0,
  Model = 1,
}

interface HotspotContent {
  type: HotspotTypeEnum
  title: string
  preview: string
  description: string
  imageList: HotspotImage[]
  modelUrl: string
}

interface HotspotImage {
  title: string
  url: string
}

export default class Hotspot extends THREE.Object3D {
  private dom: HTMLElement
  private position2D: THREE.Vector3

  controller?: HotspotController

  hotspotId: number
  flow: FlowEnum
  title: string
  contents: HotspotContent
  sceneId: number
  viewIntesects: THREE.Intersection[] = []

  constructor(data: any) {
    super()

    this.hotspotId = data.id
    this.flow = data.flow
    this.title = data.title
    this.sceneId = data.sceneId

    const root = document.createElement('div')
    this.dom = root

    this.initDom(root)
    this.position2D = new THREE.Vector3()
    this.position.copy(data.position)
    this.contents = data.contents
  }

  initDom(root: HTMLElement) {
    root.className = 'hotspot'
    root.addEventListener('click', this.onClick.bind(this), false)
    root.style.opacity = '0'

    const svg = document.createElement('div')
    svg.className = 'img'
    svg.innerHTML = `
            <svg viewBox="0 0 100 100"><circle fill="#820000" cx="50" cy="50" r="50"/><g><path fill="#FFFFFF" d="M64.5,30.5H36c-3.3,0-6,2.7-6,6v28.5c0,3.3,2.7,6,6,6h28.5c3.3,0,6-2.7,6-6V36.4 C70.4,33.1,67.8,30.5,64.5,30.5z M67.2,45.1l-0.4,19.8c0,1.3-1,2.3-2.3,2.3H45.8c0.2-5.9,2.5-11.3,6.7-15.5 C56.4,47.7,61.6,45.4,67.2,45.1z M42.8,62.2c-0.3,1.6-0.5,3.3-0.6,5l-6.2,0c-1.3,0-2.3-1-2.3-2.3v-5.6c0.1,0,0.1-0.1,0.2-0.1
                        c2.8-2.3,7-2.3,9.8,0c-0.3,0.8-0.5,1.6-0.7,2.5L42.8,62.2L42.8,62.2z M66.8,41.5c-6.4,0.4-12.3,3.1-16.9,7.7
                        c-1.9,1.9-3.6,4.2-4.8,6.6c-1.9-1.3-4.1-2-6.4-2c-1.8,0-3.5,0.4-5,1.2V36.4c0-1.3,1-2.3,2.3-2.3h28.5c1.3,0,2.3,1,2.3,2.3V41.5z"/>
                    <path fill="#FFFFFF" d="M41.6,36.2L41.6,36.2c-3,0-5.5,2.5-5.5,5.5c0,3,2.5,5.5,5.5,5.5c3,0,5.5-2.5,5.5-5.5
                        C47.1,38.6,44.6,36.2,41.6,36.2z M43.8,41.6c0,1.2-1,2.2-2.2,2.2c-1.2,0-2.2-1-2.2-2.2c0-1.2,0.9-2.2,2.1-2.2h0.1
                        C42.8,39.4,43.8,40.4,43.8,41.6z"/>
                </g>
            <svg>
            `

    const text = document.createElement('span')
    text.className = 'text'
    text.innerText = this.title

    root.appendChild(text)
    root.appendChild(svg)
    document.body.appendChild(root)

    this.visible = false
  }

  update(dt: number) {
    console.log('Hotspot update dt ', dt)
    if (this.controller) {
      const camera = this.controller.manager.camera
      const frustum = this.controller.manager.cameraController.frustum

      this.position2D.copy(this.position).project(camera)
      this.dom.style.transform = `translate( ${0.5 * (document.body.offsetWidth * this.position2D.x - this.dom.offsetWidth)}px,
                                                  ${-0.5 * (document.body.offsetHeight * this.position2D.y + this.dom.offsetHeight)}px )`
      this.setVisible(this.visible && frustum.containsPoint(this.position))
    }
  }

  setVisible(visible: boolean) {
    this.dom.style.opacity = visible ? '1' : '0'
    this.dom.style.pointerEvents = visible ? 'auto' : 'none'
  }

  onClick(event: MouseEvent) {
    console.log('Hotspot onClick event ', event)
    if (this.controller) this.controller.onHotspotClick(this)
  }
}
