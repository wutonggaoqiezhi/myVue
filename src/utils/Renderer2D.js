import * as THREE from 'three'
import shaders from './shaders2D'
import TweenMax from 'gsap';

export default class Renderer2D {
    constructor(canvas, shaderName, textures) {
        const shader = shaders[shaderName]
        if (!shader) {
            throw new Error(`${shaderName} is not found`)
        }

        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 500 / 250, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            premultipliedAlpha: true,
        });
        this.renderer.setPixelRatio( window.devicePixelRatio || 1);

        this.planeGeomertry = new THREE.PlaneBufferGeometry(2.0, 2.0);
        this.material = new THREE.RawShaderMaterial({
            uniforms: {
                iResolution: new THREE.Uniform(new THREE.Vector2(this.canvas.width, this.canvas.height)),
                progress: { value: 1 },
            },
            transparent: true,

            vertexShader: shader.vs,
            fragmentShader: shader.fs,
        });
        textures.forEach((element, index) => {
            this.material.uniforms[`iChannel${index}`] = { value: element };
            element.minFilter = THREE.NearestFilter;
        });
        this.renderingObject = new THREE.Mesh(this.planeGeomertry, this.material);

        this.init();
    }
    init() {
        this.scene.add(this.renderingObject);
        this.render();
        return this
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        return this
    }
    resize(width, height) {
        this.setUniformsValue("iResolution", new THREE.Vector2(width, height));
        this.render();
        return this
    }
    setUniformsValue(key, value) {
        this.material.uniforms[key].value = value;
        return this
    }
    getUniformsValue(key) {
        return this.material.uniforms[key].value;
    }
    getUniform(key) {
        return this.material.uniforms[key];
    }
}

