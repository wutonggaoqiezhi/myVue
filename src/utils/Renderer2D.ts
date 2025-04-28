import * as THREE from 'three'
import shaders from './shaders2D'
// import TweenMax from 'gsap'

export default class Renderer2D {
  canvas: HTMLElement
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera

  planeGeomertry: THREE.PlaneGeometry
  material: THREE.RawShaderMaterial

  renderingObject: THREE.Mesh

  constructor(canvas: HTMLElement, shaderName: string, textures: THREE.Texture[]) {
    const shader = shaders[shaderName as keyof typeof shaders]
    if (!shader) {
      throw new Error(`${shaderName} is not found`)
    }

    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, 500 / 250, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      premultipliedAlpha: true,
    })
    this.renderer.setPixelRatio(window.devicePixelRatio || 1)

    this.planeGeomertry = new THREE.PlaneGeometry(2.0, 2.0)
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        // iResolution: new THREE.Uniform(new THREE.Vector2(this.canvas.width, this.canvas.height)),
        iResolution: new THREE.Uniform(
          new THREE.Vector2(this.canvas.offsetWidth, this.canvas.offsetHeight),
        ),
        progress: { value: 1 },
      },
      transparent: true,

      vertexShader: shader.vs,
      fragmentShader: shader.fs,
    })
    textures.forEach((element: THREE.Texture, index: number) => {
      this.material.uniforms[`iChannel${index}`] = { value: element }
      element.minFilter = THREE.NearestFilter
    })
    this.renderingObject = new THREE.Mesh(this.planeGeomertry, this.material)

    this.init()
  }

  init() {
    this.scene.add(this.renderingObject)
    this.render()
    return this
  }

  render() {
    this.renderer.render(this.scene, this.camera)
    return this
  }

  resize(width: number, height: number) {
    this.setUniformsValue('iResolution', new THREE.Vector2(width, height))
    this.render()
    return this
  }

  setUniformsValue(key: string, value: THREE.Vector2 | THREE.Texture | number) {
    this.material.uniforms[key].value = value
    return this
  }

  getUniformsValue(key: string): THREE.Vector2 | THREE.Texture | number | undefined {
    return this.material.uniforms[key]?.value
  }

  getUniform(key: string): THREE.IUniform | undefined {
    return this.material.uniforms[key]
  }
}
