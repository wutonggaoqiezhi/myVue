import * as THREE from 'three';
import GLManager from '../GLManager';
import Decoder from '../decoder/Decoder';
import MeshFadeShader from '../shader/MeshFadeShader';
import * as TWEEN from '@tweenjs/tween.js'
export default class Build extends THREE.Mesh {

    private manager: GLManager;
    public material: THREE.ShaderMaterial;
    private animFadeIn: TWEEN.Tween;
    private animFadeOut: TWEEN.Tween;
    
    constructor( manager: GLManager, meshData: any ) {

        super( );
        this.manager = manager;
        this.buildGeometry( meshData.model );
        this.buildMaterial( meshData.texture );
        this.manager.scene.add( this);
       
    }
    

    private buildGeometry( modelUrl: string )
    {
        this.manager.loader.addRequest( modelUrl, "arraybuffer", (data) => {
            let buffer = new Uint8Array( data.data )
            let decodedData = Decoder.dam.lookupType("binary_mesh").decode( buffer, buffer.length ) as any;
            let pos = [],
                uvs = [],
                fac = []
            decodedData.chunk.forEach(function(item, index) {
                pos = pos.concat(item.vertices.xyz)
                uvs = uvs.concat(item.vertices.uv)
                fac = fac.concat(item.faces.faces)
            })
            this.geometry = new THREE.BufferGeometry();
            this.geometry.addAttribute("position", new THREE.BufferAttribute( new Float32Array(pos), 3));
            this.geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
            this.geometry.setIndex(fac);
        })

    }
    
    private buildMaterial( textureUrl: string )
    {
        let texture = new THREE.Texture()
            texture.image = new Image();
            texture.image.src = textureUrl;
            texture.magFilter = THREE.NearestFilter;

        this.material = new THREE.ShaderMaterial({
            vertexShader: MeshFadeShader.vs,
            fragmentShader: MeshFadeShader.fs,
            uniforms: THREE.UniformsUtils.clone(  MeshFadeShader.uniforms ),
            skinning: false,
            morphTargets: false,
            side: THREE.DoubleSide
        })

        texture.image.onload = () => {
            texture.needsUpdate = true;
            this.material.uniforms.map.value = texture;
            this.material.needsUpdate = true
        }

        this.animFadeIn = new TWEEN.Tween( this.material.uniforms.u_alphatest )
            .to({ value: 1 }, 500)
            .onStart(() => { this.visible = true })
       

        this.animFadeOut = new TWEEN.Tween( this.material.uniforms.u_alphatest )
            .to({ value: 0 }, 500)
            .onComplete(( property )=> { this.visible = false });
        


    }

    setVisible( visible: boolean, duration?: number, delay?: number ){
  
        if( visible )
        {
            this.manager.transitions.remove( this.animFadeOut );
            this.animFadeIn.to({ value:1 }, duration || 500 ).delay( delay || 0)
            this.manager.transitions.add( this.animFadeIn.start() );
        }
        else
        {
            this.manager.transitions.remove( this.animFadeIn );
            this.animFadeOut.to({value:0}, duration || 500).delay( delay || 0);
            this.manager.transitions.add( this.animFadeOut.start() );
        }

    }
}