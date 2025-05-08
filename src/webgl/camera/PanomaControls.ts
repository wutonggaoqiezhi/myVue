import * as THREE from 'three'
import PanoSceneController from '../panoScene/PanoSceneController'

class PanoramaControls extends THREE.EventDispatcher {
  // scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  domElement: HTMLCanvasElement

  enabled: boolean
  target: THREE.Vector3
  aimFrom: THREE.Vector3
  lookVector: THREE.Vector3

  lookSpeed: number
  rotationAcc: THREE.Vector2
  rotationSpeed: THREE.Vector2
  lat: number
  latMin: number
  latMax: number
  lon: number
  phi: number
  theta: number

  pointer: THREE.Vector3
  rotationHistory: THREE.Vector2[]
  rotationDifference: THREE.Vector2
  pointerDragOn: boolean
  pointerDragStart: THREE.Vector3

  pointerDown: boolean
  pointerDownPosition: THREE.Vector2
  couldBeClickToMove: boolean

  controller: PanoSceneController | null

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLCanvasElement) {
    super()
    //this.scene = scene;
    this.camera = camera
    this.domElement = domElement

    this.enabled = true

    this.target = new THREE.Vector3(0, 0, 0)
    this.lookVector = new THREE.Vector3()
    this.aimFrom = this.camera.position

    this.lat = 0
    this.latMin = -40
    this.latMax = 40
    this.lon = 0
    this.phi = 0
    this.theta = 0
    this.lookSpeed = 0.05
    this.rotationAcc = new THREE.Vector2()
    this.rotationSpeed = new THREE.Vector2()
    this.rotationHistory = []
    this.rotationDifference = new THREE.Vector2()

    this.pointerDragOn = !1
    this.pointer = new THREE.Vector3(0, 0, -1)
    this.pointerDragStart = new THREE.Vector3(0, 0, -1)

    this.pointerDown = false
    this.pointerDownPosition = new THREE.Vector2()
    this.couldBeClickToMove = false

    this.controller = null
  }

  public bindEvents() {
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.domElement.addEventListener(
      'mouseover',
      (event: MouseEvent) => this.pointerDragOn && 0 === event.which && this.onMouseUp(event),
    )

    this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this))
    this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this))
    this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this))

    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this))
    this.domElement.addEventListener('contextmenu', (event: MouseEvent) => event.preventDefault())

    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  public lookAt(point: THREE.Vector3) {
    const directionNegative = this.camera.position.clone().sub(point)
    let theta = Math.atan(directionNegative.z / directionNegative.x)

    theta += directionNegative.x < 0 ? Math.PI : 0
    theta += directionNegative.x > 0 && directionNegative.z < 0 ? 2 * Math.PI : 0
    this.lon = THREE.MathUtils.radToDeg(theta) + 180

    const projectorR = Math.sqrt(
        directionNegative.x * directionNegative.x + directionNegative.z * directionNegative.z,
      ),
      phi = Math.atan(directionNegative.y / projectorR)

    this.lat = -THREE.MathUtils.radToDeg(phi)
  }

  public startRotationFrom(screenX: number, screenY: number) {
    this.updatePointer(screenX, screenY)
    this.pointerDragOn = true
    this.pointerDragStart.copy(this.pointer)
    //TODO
    //this.pointerDragStartIntersect = this.player.getMouseIntersect(this.pointer.clone(), [this.scene.skybox]).point;
    this.rotationHistory = []
    this.rotationSpeed.set(0, 0)
  }

  public onTouchStart(event: TouchEvent) {
    if (this.enabled) {
      event.preventDefault()
      event.stopPropagation()
      this.couldBeClickToMove = true
      this.pointerDown = true
      this.pointerDownPosition.set(event.touches[0].clientX, event.touches[0].clientY)
      this.startRotationFrom(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
    }
  }

  public onMouseDown(event: MouseEvent) {
    if (this.enabled) {
      event.preventDefault()
      event.stopPropagation()

      switch (event.button) {
        case 0:
          this.startRotationFrom(event.clientX, event.clientY)
          this.couldBeClickToMove = true
          this.pointerDown = true
          this.pointerDownPosition.set(event.clientX, event.clientY)
          break
        case 2:
      }
    }
  }

  public updateRotation() {
    if (this.enabled && this.pointerDragOn) {
      const pointerDragStart3D = new THREE.Vector3(
          this.pointerDragStart.x,
          this.pointerDragStart.y,
          1,
        ).unproject(this.camera),
        pointer3D = new THREE.Vector3(this.pointer.x, this.pointer.y, 1).unproject(this.camera),
        //两交互点分别到原点的长度
        pointerDragStart3DLength = Math.sqrt(
          pointerDragStart3D.x * pointerDragStart3D.x + pointerDragStart3D.z * pointerDragStart3D.z,
        ),
        pointer3DLength = Math.sqrt(pointer3D.x * pointer3D.x + pointer3D.z * pointer3D.z),
        //通过Math.atan2计算在XY面上与X轴的夹角弧度。
        //注：因为 z = -1，所以两者到原点的长度近似为x分量（数值的大小也不需要绝对对应）
        anglePointerDragStart3DToX = Math.atan2(pointerDragStart3D.y, pointerDragStart3DLength), //近似为 anglePointerDragStart3DToX = Math.atan2( pointerDragStart3D.y, pointerDragStart3D.x )
        anglePointer3DToX = Math.atan2(pointer3D.y, pointer3DLength) //近似为 anglePointer3DToX = Math.atan2( pointer3D.y, pointer3D.x )

      //算出两者角度差，作为竖直方向角度差值（rotationDifference.y）
      this.rotationDifference.y = THREE.MathUtils.radToDeg(
        anglePointerDragStart3DToX - anglePointer3DToX,
      )

      //y分量清零，原向量等价于在XZ轴上的投影向量
      pointerDragStart3D.y = 0
      pointer3D.y = 0

      //归一化（/length），求两者夹角作为
      //判断方向，最后记为水平方向角度差值（rotationDifference.x）
      const anglePointerDragStart3DToPointer3D = Math.acos(
        pointerDragStart3D.dot(pointer3D) / pointerDragStart3D.length() / pointer3D.length(),
      )

      if (!isNaN(anglePointerDragStart3DToPointer3D)) {
        this.rotationDifference.x = THREE.MathUtils.radToDeg(anglePointerDragStart3DToPointer3D)
        if (this.pointerDragStart.x < this.pointer.x) {
          this.rotationDifference.x *= -1
        }
      }

      //更新pointerDragStart记录当前帧坐标，用于下一帧求帧差值
      this.pointerDragStart.copy(this.pointer)
    }
  }

  public onMouseMove(event: MouseEvent) {
    this.updatePointer(event.clientX, event.clientY)

    if (
      Math.abs(event.clientX - this.pointerDownPosition.x) +
        Math.abs(event.clientY - this.pointerDownPosition.y) >
      10
    ) {
      this.couldBeClickToMove = false
    }
  }

  public onTouchMove(event: TouchEvent) {
    this.updatePointer(event.touches[0].clientX, event.touches[0].clientY)

    if (
      Math.abs(event.touches[0].clientX - this.pointerDownPosition.x) +
        Math.abs(event.touches[0].clientY - this.pointerDownPosition.y) >
      10
    ) {
      this.couldBeClickToMove = false
    }
  }

  public updatePointer(screenX: number, screenY: number) {
    this.pointer.x = (screenX / window.innerWidth) * 2 - 1
    this.pointer.y = 2 * -(screenY / window.innerHeight) + 1
  }

  public endRotation() {
    this.pointerDragOn = false

    if (!(this.controller && this.controller.isMoving)) {
      const historyLength = this.rotationHistory.length
      const rotationHistoryAverage = this.rotationHistory
        .reduce((total, item) => total.add(item), new THREE.Vector2(0))
        .divideScalar(historyLength)

      this.rotationSpeed.set(rotationHistoryAverage.x * 30, rotationHistoryAverage.y * 30)
    }
  }

  public onTouchEnd(event: TouchEvent) {
    if (this.enabled) {
      event.preventDefault()
      event.stopPropagation()
      this.endRotation()

      this.pointerDown = false

      if (this.couldBeClickToMove) {
        this.controller!.moveToDirection()
      }
    }
  }

  public onMouseUp(event: MouseEvent) {
    if (this.enabled) {
      event.preventDefault()
      event.stopPropagation()
      this.endRotation()

      this.pointerDown = false

      if (this.couldBeClickToMove) {
        this.controller!.moveToDirection()
      }
    }
  }

  public update(deltaTime: number) {
    if (this.enabled) {
      this.updateRotation()

      for (
        this.rotationHistory.push(this.rotationDifference.clone());
        this.rotationHistory.length > 5;

      ) {
        this.rotationHistory.shift()
      }

      this.lon += this.rotationDifference.x
      this.lat += this.rotationDifference.y
      this.rotationDifference.set(0, 0)
      this.rotationSpeed.x = this.rotationSpeed.x * (1 - 0.09) + this.rotationAcc.x * 4.5
      this.rotationSpeed.y = this.rotationSpeed.y * (1 - 0.09) + this.rotationAcc.y * 4.5

      this.lon += this.rotationSpeed.x * deltaTime
      this.lat += this.rotationSpeed.y * deltaTime
      this.lat = Math.max(this.latMin, Math.min(this.latMax, this.lat))

      this.phi = THREE.MathUtils.degToRad(90 - this.lat)
      this.theta = THREE.MathUtils.degToRad(this.lon)

      this.lookVector.x = Math.sin(this.phi) * Math.cos(this.theta)
      this.lookVector.y = Math.cos(this.phi)
      this.lookVector.z = Math.sin(this.phi) * Math.sin(this.theta)

      this.target.copy(this.lookVector).add(this.aimFrom)
      this.camera.lookAt(this.target)
    }
  }

  public onMouseWheel(event: WheelEvent) {
    if (this.enabled) {
      const z =
        event.deltaY !== undefined ? -event.deltaY : void 0 !== event.detail && -event.detail
      this.flyDirection(new THREE.Vector3(0, 0, -z).normalize())
    }
  }

  public onKeyDown(event: KeyboardEvent) {
    if (this.enabled && !event.metaKey && !event.ctrlKey) {
      event.preventDefault()
      this.handleKeyDown(event.which)
    }
  }

  public handleKeyDown(keycode: number) {
    switch (keycode) {
      case 38:
      case 87:
        this.flyDirection(new THREE.Vector3(0, 0, -1))
        break
      case 40:
      case 83:
        this.flyDirection(new THREE.Vector3(0, 0, 1))
        break
      case 65:
        this.flyDirection(new THREE.Vector3(-1, 0, 0))
        break
      case 68:
        this.flyDirection(new THREE.Vector3(1, 0, 0))
        break
      case 37:
      case 74:
        this.rotationAcc.x = -1
        break
      case 39:
      case 76:
        this.rotationAcc.x = 1
        break
      case 73:
        this.rotationAcc.y = 1
        break
      case 75:
        this.rotationAcc.y = -1
        break
    }
  }

  public onKeyUp(event: KeyboardEvent) {
    if (this.enabled) {
      event.preventDefault()
      event.stopPropagation()
      this.handleKeyUp(event.which)
    }
  }

  public handleKeyUp(keycode: number) {
    switch (keycode) {
      case 37:
      case 74:
        this.rotationAcc.x = 0
        break
      case 39:
      case 76:
        this.rotationAcc.x = 0
        break
      case 73:
        this.rotationAcc.y = 0
        break
      case 75:
        this.rotationAcc.y = 0
    }
  }

  public reset() {
    this.stop()
  }

  public stop() {
    this.rotationAcc.set(0, 0)
    this.rotationSpeed.set(0, 0)
  }

  public flyDirection(direction: THREE.Vector3) {
    if (this.controller && !this.controller.isMoving) {
      //direction = this.player.getDirection(direction)
      //let cosine = 1 === direction.z ? 0.4 : 0.75;

      const d = new THREE.Vector3()
      this.camera.getWorldDirection(d)

      if (direction.x == 1) {
        d.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2).normalize()
      }
      if (direction.x == -1) {
        d.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2).normalize()
      }
      if (direction.z == 1) {
        d.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI).normalize()
      }

      this.controller.moveToDirection(d)
    }
  }
}

export default PanoramaControls
