import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import GLManager from '../GLManager';

import PointCloudSource from '../pointCloud/PointCloudNodeNames'
import MapPointSource from '../map/MapPointSource'
import MapPointNode from './MapPointNode';
import IAppMouseEvent from '../event/IAppMouseEvent';
import MapPointShader from './MapPointShader';

const POINT_GROUND = "point_dimian.json";

export default class MapPoint extends THREE.Points {

    manager: GLManager;
    material: THREE.ShaderMaterial;
    aabb: THREE.Box3;

    ground: MapPointNode | null;
    manualInteraction: boolean;
    animFadeIn: TWEEN.Tween;
    animFadeOut: TWEEN.Tween;

  
    constructor( manager: GLManager )
    {
        super();
        this.manager = manager;
        this.manager.scene.add( this );
        this.aabb = new THREE.Box3();
        this.material = new THREE.ShaderMaterial({ 
            uniforms: THREE.UniformsUtils.clone(MapPointShader.uniforms),
            vertexShader: MapPointShader.vs,
            fragmentShader: MapPointShader.fs,
            skinning: false,
            morphTargets: false,
            morphNormals: false
        });

        this.ground = null;
        this.build();

     
        this.animFadeIn = new TWEEN.Tween(this.material.uniforms["density"])
            .to({value:1}, 1000)
            .onStart(()=>{ this.visible = true })
            .onUpdate((density)=>{
                this.children.forEach(item => {
                    let node = item as MapPointNode;
                    node.material.uniforms["density"].value = density.value;
                })
                this.ground.material.uniforms["density"].value = density.value;
            })

        this.animFadeOut = new TWEEN.Tween(this.material.uniforms["density"])
            .to({value:0}, 1000)
            .onComplete(()=>{ this.visible = false })
            .onUpdate((density)=>{

                this.children.forEach(item => {
                    let node = item as MapPointNode;
                    node.material.uniforms["density"].value = density.value;
                })

                this.ground.material.uniforms["density"].value = density.value;
            })
        this.manualInteraction = false;
    }

    

    build() {

        MapPointSource.forEach(item => {
            this.manager.loader.addRequest( `
            minimap/normal/${item}`, "json", (event)=>{
                

                let positionNormal = new Float32Array(event.data.aPos);

                let count = positionNormal.length;
                let rankBuffer = new Float32Array( count );
                for(let i = 0; i < count; i++)
                {
                    rankBuffer[i] = i / count;
                }
    
                let geometry = new THREE.BufferGeometry();
                    geometry.addAttribute("position", new THREE.BufferAttribute(positionNormal, 3));
                    geometry.addAttribute("aRanking", new THREE.BufferAttribute(rankBuffer, 1));
                    geometry.computeBoundingBox();
                this.aabb.union( geometry.boundingBox );

                let material = this.material.clone();

                if( item == POINT_GROUND )
                {
                    this.buildGround( geometry, material);
                }
                else
                {
                    let node = new MapPointNode( this.manager );
                    node.build( geometry, material );
                    node.updateMatrix();
                    geometry.boundingBox.applyMatrix4(node.matrix)
                    this.add( node );
                }   
                
            })
        })



    }


    buildGround( geometry: THREE.BufferGeometry, material: THREE.ShaderMaterial )
    {

        material.uniforms["initAmplitude"].value = 16.34;
        material.uniforms["progress"].value = 0;
        material.uniforms["density"].value = 0.14;
        material.uniforms["initHeight"].value = 0;
        material.uniforms["hoverHeight"].value = 0;

        this.ground = new MapPointNode(this.manager)
        this.ground.build( geometry, material );
        this.manager.scene.add( this.ground );

    }


    update( dt: number )
    {

        if( this.ground ){

            this.ground.material.uniforms.time.value = this.manager.clock.getElapsedTime()
  
        } 

         this.children.forEach( item => {
            let node = item as MapPointNode;
            let ins = this.manager.raycaster.ray.intersectsBox( node.geometry.boundingBox )
            if(ins != node.hovering && this.manualInteraction)
            {          
                if(ins)
                {
                    node.hoverOn();
                    node.hovering = true;
                }
                else
                {
                    node.hoverOff();
                    node.hovering = false;
                }
            }
            node.material.uniforms.time.value = this.manager.clock.getElapsedTime();
           
        })
    }

    setVisible( visible: boolean, duration?: number, delay?: number ) {

        this.manualInteraction = false;

        if(visible)
        {
            this.manager.transitions.remove( this.animFadeOut )
            this.animFadeOut.to({value:1}, duration || 1000).delay(delay||0);
            this.manager.transitions.add( this.animFadeIn.start() )
        }
        else
        {
            this.manager.transitions.remove( this.animFadeIn )
            this.animFadeOut.to({value:0}, duration || 1000).delay(delay||0);
            this.manager.transitions.add( this.animFadeOut.start() )
        }
    }


    onTraveling() {

        this.manualInteraction = false;
        this.children.forEach(item=>{

            let node = item as MapPointNode;
            node.hoverOn();

        })

    }

    reset() {

        this.setVisible(true);
        this.manualInteraction = false;
        this.children.forEach(item=>{

            let node = item as MapPointNode;
            node.material.uniforms["progress"].value = 0;
            node.material.uniforms["initAmplitude"].value = 30;
            node.material.uniforms["initHeight"].value = 0;
            node.hoverOff(true);
        })

    }

    playGreete() {

        this.children.forEach(item=>{

            let node = item as MapPointNode;
            node.material.uniforms["initAmplitude"].value = 30;
            node.material.uniforms["initHeight"].value = 0;

            node.hoverOn();
        })

        let timer = setTimeout(()=>{

            this.children.forEach(item=>{

                let node = item as MapPointNode;
                node.material.uniforms["initAmplitude"].value = 0.23;
                node.material.uniforms["initHeight"].value = 1;
    
                node.hoverOff(true);
            })
            clearTimeout(timer)

        }, 2500)

    }
}