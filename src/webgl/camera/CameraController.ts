import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import GLManager from '../GLManager'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import PanomaControls from './PanomaControls'
// import Hotspot from '../hotspot/Hotspot'
import Guidepost from '../hotspot/Guidepost'
import GreeteControls from './GreeteControls'

// enum CameraMode {
//   Pano,
// }

export default class CameraController {
  camera: THREE.PerspectiveCamera
  frustum: THREE.Frustum
  manager: GLManager

  private frustumMatrix: THREE.Matrix4

  worldDirection: THREE.Vector3
  worldPosition: THREE.Vector3

  animPosition: TWEEN.Tween<{ value: number }>
  animPositionDutation: number

  animRotation: TWEEN.Tween<{ value: number }>
  animRotationDutation: number

  activeControls?: any
  public orbitControls: OrbitControls
  public panoControls: PanomaControls
  greetControls: any

  constructor(camera: THREE.PerspectiveCamera, glManager: GLManager) {
    this.camera = camera
    this.manager = glManager

    this.frustum = new THREE.Frustum()
    this.frustumMatrix = new THREE.Matrix4()

    this.orbitControls = new OrbitControls(this.camera, this.manager.renderer.domElement)
    this.panoControls = new PanomaControls(this.camera, this.manager.renderer.domElement)
    this.greetControls = new GreeteControls(this.camera, this.manager.renderer.domElement)
    ;(window as any)['cameraController'] = this

    this.worldDirection = new THREE.Vector3(0, 0, -1)
    this.worldPosition = new THREE.Vector3(0, 0, 0)

    this.animPositionDutation = 7000
    this.animPosition = new TWEEN.Tween({ value: 0 }).delay(700).easing(TWEEN.Easing.Sinusoidal.Out)

    this.animRotationDutation = 6500
    this.animRotation = new TWEEN.Tween({ value: 0 }).delay(800).easing(TWEEN.Easing.Sinusoidal.Out)
  }

  init() {
    this.camera.position.set(0, 20, 50)
    this.orbitControls.enabled = false
    this.panoControls.enabled = false
    this.panoControls.bindEvents()
    this.greetControls.enabled = false
    this.reset()
  }

  reset() {
    this.camera.position.set(24.99624072843848, 40.48893850255398, 96.79653019074968)
    this.camera.quaternion.set(
      -0.2728312078206973,
      0.018713127203850374,
      0.005307942093589542,
      0.9618652590982184,
    )
    this.tabMode(3)
  }

  update(dt: number) {
    this.frustumMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse,
    )
    this.frustum.setFromProjectionMatrix(this.frustumMatrix)
    this.camera.getWorldDirection(this.worldDirection)
    this.camera.getWorldPosition(this.worldPosition)

    this.panoControls.update(dt)
    this.greetControls.update(dt)
  }

  tabMode(mode: number) {
    switch (mode) {
      case 0:
        this.orbitControls.enabled = true
        this.panoControls.enabled = false
        this.greetControls.enabled = false
        break
      case 1:
        this.orbitControls.enabled = false
        this.greetControls.enabled = false
        this.panoControls.enabled = true
        this.camera.getWorldDirection(this.worldDirection)
        this.camera.getWorldPosition(this.worldPosition)
        //this.panoControls.updateFromPosture( this.worldPosition, this.worldDirection );
        this.panoControls.lookAt(this.worldPosition.clone().add(this.worldDirection))

        break
      case 3:
        this.orbitControls.enabled = false
        this.panoControls.enabled = false
        this.greetControls.enabled = true
        break
      default:
        this.orbitControls.enabled = false
        this.panoControls.enabled = false
        break
    }
  }

  moveToGuidepost(guidepost: Guidepost): Promise<any> {
    this.panoControls.enabled = false
    this.greetControls.enabled = false

    const position = guidepost.cameraGuidePoisition,
      rotateMatrix = new THREE.Matrix4().lookAt(
        guidepost.cameraGuidePoisition,
        guidepost.cameraGuidePivot,
        new THREE.Vector3(0, 1, 0),
      ),
      quaternion = new THREE.Quaternion().setFromRotationMatrix(rotateMatrix)

    const beginPosition = this.camera.position.clone(),
      beginQuaterion = this.camera.quaternion.clone()

    const tranlatePromise = new Promise((resolve) => {
      this.animPosition
        .to({ value: 1 }, this.animPositionDutation)
        .start()
        .onUpdate((obj) => {
          this.camera.position.lerpVectors(beginPosition, position, obj.value)
        })
        .onComplete((obj) => {
          obj.value = 0
          resolve('complete')
        })
      this.manager.transitions.add(this.animPosition)
    })

    const rotatePromise = new Promise((resolve) => {
      this.animRotation
        .to({ value: 1 }, this.animRotationDutation)
        .start()
        .onUpdate((obj) => {
          new THREE.Quaternion().slerpQuaternions(beginQuaterion, quaternion, obj.value)
        })
        .onComplete((obj) => {
          obj.value = 0
          resolve('complete')
        })
      this.manager.transitions.add(this.animRotation)
    })

    return Promise.all([tranlatePromise, rotatePromise])
  }
}
