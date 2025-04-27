import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import PanoScene from './PanoScene';
import PanoPoint from './PanoPoint';
import PanoTransitionShader from '../shader/PanoTransitionShader';

export default class PanoViewbox extends THREE.Mesh {

    private scene: PanoScene;
    material: THREE.ShaderMaterial;

    private animFadeIn: TWEEN.Tween;
    private animFadeOut: TWEEN.Tween;

    constructor( scene: PanoScene, viewbox: { size: THREE.Vector3, offset: THREE.Vector3 } ) {
        super();
        this.scene = scene;
        this.buildGeometry( viewbox );
        this.buildMaterial();
        this.updateMatrix();
        this.updateMatrixWorld();
        this.scene.add( this );

        this.animFadeIn = new TWEEN.Tween( this.material.uniforms.opacity )
            .to({ value: 1 }, 1000)
            .delay(600)
            .onStart(() => { this.visible = true })
       

        this.animFadeOut = new TWEEN.Tween( this.material.uniforms.opacity )
            .to({ value: 0 }, 1000)
            .delay(600)
            .onComplete(( property )=> { this.visible = false });
    }


    private buildGeometry( viewbox: { size: THREE.Vector3, offset: THREE.Vector3 } ) {

        this.geometry = new THREE.BoxBufferGeometry( viewbox.size.x, viewbox.size.y, viewbox.size.z );
        this.geometry.translate( viewbox.offset.x, viewbox.offset.y, viewbox.offset.z, )
        this.geometry.computeBoundingBox();

    }

    private buildMaterial() {

        this.material = new THREE.ShaderMaterial({
            vertexShader: PanoTransitionShader.vertexShader,
            fragmentShader: PanoTransitionShader.fragmentShader,
            uniforms: THREE.UniformsUtils.clone( PanoTransitionShader.uniforms ),
            transparent: true,
            side: THREE.BackSide,
            depthTest: false,
            depthWrite: false,
        })
        this.renderOrder = 100;
    }

    setView0( point: PanoPoint, texture: THREE.CubeTexture ) {

        this.material.uniforms["pano0Map"].value = texture;
        this.material.uniforms["pano0Position"].value = point.panoPosition.clone();
        this.material.uniforms["pano0Matrix"].value = point.panoMatrix.clone();

    }

    setView1( point: PanoPoint, texture: THREE.CubeTexture ) {

        this.material.uniforms["pano1Map"].value = texture;
        this.material.uniforms["pano1Position"].value = point.panoPosition.clone();
        this.material.uniforms["pano1Matrix"].value = point.panoMatrix.clone();

    }

    setVisible( visible: boolean, duration?: number, delay?: number ) {

        if( visible )
        {
            this.scene.contoller.manager.transitions.remove( this.animFadeOut );
            this.animFadeIn.to({value: 1}, duration || 600).delay( delay || 0);
            this.scene.contoller.manager.transitions.add( this.animFadeIn.start() );
        }
        else
        {
            this.scene.contoller.manager.transitions.remove( this.animFadeIn );
            this.animFadeOut.to({value: 0}, duration || 600).delay( delay || 0);
            this.scene.contoller.manager.transitions.add( this.animFadeOut.start() );
        }

    }

}