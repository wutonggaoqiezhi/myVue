import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js';
import GLManager from "../GLManager";

export default class MapPointNode extends THREE.Points {
    
    manager: GLManager;
    material: THREE.ShaderMaterial;
    
    progress: number;
    duration: number;

    animHoveOn?: TWEEN.Tween;
    animHoverOff?:TWEEN.Tween;

    hovering: boolean;
    initDensity: number;
    hoverDensity: number;
    animHoverOnDensity: TWEEN.Tween;
    animHoverOffDensity: TWEEN.Tween;
    hoverStay: number;



    constructor( manager: GLManager ) {
        
        super();
        this.manager = manager;
        this.matrixAutoUpdate = false;
        this.hovering = false;
    
        this.progress = 0;
        this.duration = 2000;

        this.initDensity = 0.2
        this.hoverDensity = 0.84;

        this.hoverStay = 2000;
    }

    build( geometry: THREE.BufferGeometry, material: THREE.ShaderMaterial) {

        this.geometry = geometry;
        this.material = material;

        this.animHoveOn = new TWEEN.Tween(  this.material.uniforms["progress"] )
                            .easing( TWEEN.Easing.Quadratic.Out )
                            .to({value:1}, this.duration)
        this.animHoverOnDensity = new TWEEN.Tween( this.material.uniforms["density"] )
                            .to({value:this.hoverDensity}, this.duration)

        
        this.animHoverOff = new TWEEN.Tween(  this.material.uniforms["progress"] )
                            .easing( TWEEN.Easing.Quadratic.Out )
                            .to({value:0}, this.duration)

        this.animHoverOffDensity = new TWEEN.Tween( this.material.uniforms["density"] )
                            .to({value:this.initDensity}, this.duration)
    }

    dispose() {

        this.geometry.dispose(), this.geometry = null;
        this.material.dispose(), this.material = null;
        this.parent && this.parent.remove( this );

    }

    hoverOn()
    {
        if(this.animHoveOn)
        {
            this.animHoverOff && this.manager.transitions.remove(this.animHoverOff), this.manager.transitions.remove(this.animHoverOffDensity);
            
            this.animHoveOn = new TWEEN.Tween(  this.material.uniforms["progress"] )
                .easing( TWEEN.Easing.Quadratic.Out )
                .to({value:1}, this.duration)
                .start()
            this.animHoverOnDensity = new TWEEN.Tween( this.material.uniforms["density"] )
                .easing( TWEEN.Easing.Quadratic.Out )
                .to({value:this.hoverDensity}, this.duration)
                .start()
            
            this.manager.transitions.add(this.animHoveOn)
            this.manager.transitions.add(this.animHoverOnDensity)
        }
    }

    hoverOff( immediately? :boolean) 
    {
        if(this.animHoverOff)
        {
            //this.animHoveOn && this.manager.transitions.remove(this.animHoveOn), this.manager.transitions.remove(this.animHoverOnDensity)       
            let timer = setTimeout(()=> {
                this.animHoverOff = new TWEEN.Tween(  this.material.uniforms["progress"] )
                            .easing( TWEEN.Easing.Quadratic.Out )
                            .to({value:0}, this.duration)
                            .start()
                this.animHoverOffDensity = new TWEEN.Tween( this.material.uniforms["density"] )
                                .easing( TWEEN.Easing.Quadratic.Out )
                                .to({value:this.initDensity}, this.duration)
                                .start()
                this.manager.transitions.add(this.animHoverOff)     
                this.manager.transitions.add(this.animHoverOffDensity);
                clearTimeout(timer);
            }, immediately ? 0 : this.hoverStay)
        }
    }
}