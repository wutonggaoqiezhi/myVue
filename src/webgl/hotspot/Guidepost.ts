import * as THREE from 'three'
import HotspotController from './HotspotController'
import FlowEnum from '../../flow/FlowEnum'

// enum HotspotTypeEnum {
//   Image = 0,
// }

export default class Guidepost extends THREE.Object3D {
  private dom: HTMLElement
  private position2D: THREE.Vector3

  controller?: HotspotController

  hotspotId: number
  title: string
  sign: string
  cameraGuidePoisition: THREE.Vector3
  cameraGuidePivot: THREE.Vector3
  targetFlow: FlowEnum
  sceneId: number = -1
  audioIndex: number = -1

  constructor(data: any) {
    super()

    this.hotspotId = data.id
    this.title = data.title
    this.sign = data.sign
    this.targetFlow = data.targetFlow
    const root = document.createElement('div')
    this.dom = root
    this.initDom(root)
    this.position2D = new THREE.Vector3()
    this.position.copy(data.position)
    this.cameraGuidePoisition = new THREE.Vector3().copy(data.cameraGuide.posture.pos)
    this.cameraGuidePivot = new THREE.Vector3().copy(data.cameraGuide.posture.pivot)
    this.visible = false
  }

  initDom(root: HTMLElement) {
    root.className = 'guidepost'

    root.style.opacity = '0'

    const sign = document.createElement('img')
    sign.addEventListener('click', this.onClick.bind(this), false)
    sign.className = 'img'
    sign.setAttribute('src', this.sign)

    root.appendChild(sign)
    document.body.appendChild(root)
  }

  update(dt: number) {
    console.log('dt ', dt)
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
    console.log('event ', event)
    if (this.controller) this.controller.onGuidePostClick(this)
  }
}
