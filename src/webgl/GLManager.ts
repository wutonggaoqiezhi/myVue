import * as THREE from 'three'

// import Input from './input/MouseInput'
import MapPoint from './map/MapPointGroup'
import * as TWEEN from '@tweenjs/tween.js'
import LoaderManager from '../loader/LoadManager'
import CameraController from './camera/CameraController'
import HotspotController from './hotspot/HotspotController'
import PanoSceneController from './panoScene/PanoSceneController'
import Hotspot from './hotspot/Hotspot'
import Guidepost from './hotspot/Guidepost'
import WuHouCiApp from '@/WuHouCiApp'

interface MyEventMap extends MouseEvent {
  update: { message: number }
}

class GLManager extends THREE.EventDispatcher<MyEventMap> {
  app: WuHouCiApp

  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  loader: LoaderManager

  private _pause: boolean
  clock: THREE.Clock
  raycaster: THREE.Raycaster
  transitions: TWEEN.Group
  cameraController: CameraController
  pointCloud: MapPoint
  hotspotController: HotspotController
  panoSceneController: PanoSceneController

  ndc: THREE.Vector2
  mousePosition: THREE.Vector2

  constructor(app: WuHouCiApp, canvas: HTMLCanvasElement, assetLoader: LoaderManager) {
    super()

    this.app = app
    // Extend the Window interface to include a THREE property
    ;(window as { THREE?: typeof THREE }).THREE = THREE

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio || 1)
    this.camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000)
    this.scene = new THREE.Scene()
    this.loader = assetLoader

    this._pause = true
    this.clock = new THREE.Clock()
    this.raycaster = new THREE.Raycaster()

    this.transitions = new TWEEN.Group()
    this.pointCloud = new MapPoint(this)
    this.cameraController = new CameraController(this.camera, this)
    this.hotspotController = new HotspotController(this)
    this.panoSceneController = new PanoSceneController(this)

    this.ndc = new THREE.Vector2()
    this.mousePosition = new THREE.Vector2()
  }

  init() {
    //THREE.Object3D.DefaultMatrixAutoUpdate = false;
    //this.scene.background =
    // let cubeTexture = new THREE.CubeTextureLoader().setPath("skybox/")
    // .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

    const materials: THREE.Material[] = []
    const textureLoader = new THREE.TextureLoader().setPath('skybox/')

    ;['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'].forEach((item) => {
      materials.push(
        new THREE.MeshBasicMaterial({ map: textureLoader.load(item), side: THREE.BackSide }),
      )
    })

    const skybox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), materials)
    skybox.scale.set(1, 1, -1)
    skybox.rotateY(Math.PI / 2)
    this.scene.add(skybox)

    this.cameraController.init()
    this.hotspotController.init()
    this.panoSceneController.init()

    this.onWindowResize()
    this.bindEvents()
  }

  /***流程相关 */

  findGuidpostById(id: number): Guidepost | null {
    return this.hotspotController.guideposts.find((item) => item.hotspotId == id)!
  }

  openFlow(guidepost: Guidepost): Promise<void> {
    const scene = this.panoSceneController.findSceneByFlow(guidepost.targetFlow)
    this.pointCloud.onTraveling()
    this.hotspotController.openFlow(guidepost)

    return new Promise((resolve) => {
      if (scene) {
        this.pointCloud.setVisible(false, 1000, 5000)
        if (scene.mesh) scene.mesh.setVisible(true, 1000, 5000)
        this.cameraController.moveToGuidepost(guidepost).then(() => {
          this.cameraController.tabMode(1)
          this.panoSceneController.enterScene(scene).then(() => {
            this.hotspotController.onEnterScene(guidepost)
            this.app.onEnterPanoScene(guidepost.targetFlow)
          })

          resolve()
        })
      } else {
        this.cameraController.moveToGuidepost(guidepost).then(() => {
          resolve()
        })
      }
    })
  }

  closeFlow(guidepost: Guidepost) {
    const panoScene = this.panoSceneController.findSceneByFlow(guidepost.targetFlow)
    if (panoScene) this.panoSceneController.outScene()
    this.cameraController.reset()
    this.panoSceneController.reset()
    this.hotspotController.hotspots.forEach((item) => (item.visible = false))
    this.hotspotController.guideposts.forEach((item) => (item.visible = true))
    this.pointCloud.setVisible(true)
    this.pointCloud.manualInteraction = true
  }

  /**热点相关 */

  findHotspotById(hotspotId: number): Hotspot {
    return this.hotspotController.hotspots.find((item: Hotspot) => item.hotspotId == hotspotId)!
  }

  reset() {
    this.pointCloud.reset()
    this.cameraController.reset()
    this.hotspotController.reset()
    this.panoSceneController.reset()
  }

  beginTravel() {
    console.log('beginTravel')
    const timer = setTimeout(() => {
      this.pointCloud.manualInteraction = true
      this.pointCloud.playGreete()
      this.hotspotController.showAllGuideposts(true)
      clearTimeout(timer)
    }, 1000)
  }

  start() {
    this.render(0)
    this._pause = false
  }

  render(time: number) {
    if (!this._pause) {
      const dt = this.clock.getDelta()

      this.transitions.update(time)
      this.pointCloud.update(dt)
      this.cameraController.update(dt)
      this.hotspotController.update(dt)
      this.panoSceneController.update(dt)

      this.dispatchEvent({ type: 'update', message: time })

      this.renderer.render(this.scene, this.camera)
    }

    window.requestAnimationFrame(this.render.bind(this))
  }

  private bindEvents() {
    //this.renderer.domElement.addEventListener("click", this.dispatchMouseEvent.bind(this), false);
    //this.renderer.domElement.addEventListener("mousedown", this.dispatchMouseEvent.bind(this), false);
    //this.renderer.domElement.addEventListener("mousemove", this.dispatchMouseEvent.bind(this), false);
    //this.renderer.domElement.addEventListener("mouseup", this.dispatchMouseEvent.bind(this), false);

    //this.renderer.domElement.addEventListener("touchstart", this.dispatchTouchEvent.bind(this), false);
    //this.renderer.domElement.addEventListener("touchmove", this.dispatchTouchEvent.bind(this), false);
    // this.renderer.domElement.addEventListener("touchend", this.dispatchTouchEvent.bind(this), false);

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  private dispatchMouseEvent(event: MouseEvent) {
    const ndc = this.ndc
    const mouseScreenPosition = this.mousePosition

    ndc.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    )
    mouseScreenPosition.set(event.clientX, event.clientY)
    this.raycaster.setFromCamera(ndc, this.camera)
    ;(this.scene as any).dispatchEvent({
      type: event.type,
      data: {
        screenPosition: mouseScreenPosition,
        activeCamera: this.camera,
        raycaster: this.raycaster,
        ndc: ndc,
      },
    })
  }

  private dispatchTouchEvent(event: TouchEvent) {
    const ndc = this.ndc
    const mouseScreenPosition = this.mousePosition

    ndc.set(
      (event.touches[0].clientX / window.innerWidth) * 2 - 1,
      -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1,
    )
    mouseScreenPosition.set(event.touches[0].clientX, event.changedTouches[0].clientY)
    this.raycaster.setFromCamera(ndc, this.camera)
    ;(this.scene as any).dispatchEvent({
      type: event.type,
      data: {
        screenPosition: mouseScreenPosition,
        activeCamera: this.camera,
        raycaster: this.raycaster,
        ndc: ndc,
      },
    })
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
export default GLManager
