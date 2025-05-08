import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import PanoSceneController from '../panoScene/PanoSceneController'

export default class PanoPointer extends THREE.Mesh {
  controller: PanoSceneController

  textureBasic: THREE.Texture = new THREE.Texture()
  textureNormal: THREE.Texture = new THREE.Texture()
  textureActive: THREE.Texture = new THREE.Texture()

  animFadeIn: TWEEN.Tween<THREE.Material | THREE.Material[]>
  animFadeOut: TWEEN.Tween<THREE.Material | THREE.Material[]>

  constructor(controller: PanoSceneController) {
    super()
    this.controller = controller

    this.buildTextures()
    this.buildGeometry()
    this.buildMaterial()

    this.controller.manager.scene.add(this)

    this.animFadeIn = new TWEEN.Tween(this.material).to({ opacity: 1 }, 500).onStart(() => {
      this.visible = true
    })

    this.animFadeOut = new TWEEN.Tween(this.material).to({ opacity: 0 }, 500).onComplete(() => {
      this.visible = false
    })
  }

  buildTextures() {
    this.textureBasic.image = new Image()
    this.textureBasic.image.src = 'image/reticule.png'
    this.textureBasic.image.onload = () => {
      this.textureBasic.needsUpdate = true
    }

    this.textureNormal.image = new Image()
    this.textureNormal.image.src = 'image/pointBasic.png'
    this.textureNormal.image.onload = () => {
      this.textureBasic.needsUpdate = true
    }

    this.textureActive.image = new Image()
    this.textureActive.image.src = 'image/pointActive.png'
    this.textureActive.image.onload = () => {
      this.textureBasic.needsUpdate = true
    }
  }

  buildGeometry() {
    this.geometry = new THREE.CircleGeometry(0.3, 20)
    this.geometry.rotateX(-Math.PI / 2)
  }

  buildMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      transparent: true,
      color: 0xffffff,
      map: this.textureNormal,
    })
  }

  setVisible(visible: boolean) {
    if (visible) {
      this.controller.manager.transitions.remove(this.animFadeOut)
      this.controller.manager.transitions.add(this.animFadeIn.start())
    } else {
      this.controller.manager.transitions.remove(this.animFadeIn)
      this.controller.manager.transitions.add(this.animFadeOut.start())
    }
  }
}
