import Hotspot from '../hotspot/Hotspot';
import * as THREE from 'three';


const UP = new THREE.Vector3(0,1,0);
const RIGHT = new THREE.Vector3(1,0,0);

export default class GreeteControls {

    camera: THREE.Camera;
    domElement: HTMLElement;
    enabled: boolean;

    rotateSpeed: THREE.Vector2;
    rotation: THREE.Vector2;
    lookAtTarget: THREE.Vector3
    screenX: THREE.Vector2;
    screenPosition: THREE.Vector2;



    constructor( camera: THREE.Camera, domElement: HTMLElement )
    {

        this.camera = camera;
        this.domElement = domElement;
        this.enabled = true;


        this.rotation = new THREE.Vector2();
        this.screenPosition = new THREE.Vector2();

        this.lookAtTarget = new THREE.Vector3();

        this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));

        
        
      
    }




    update( dt: number ) 
    {
        if(this.enabled)
        {

            this.rotation.lerp( this.screenPosition, 0.03);
            this.camera.rotation.y = -this.rotation.x * 0.05;
            this.camera.rotation.x = this.rotation.y * 0.02 - 0.5;

        }
        
    }

    onMouseMove( event: MouseEvent ) 
    {
        this.screenPosition.set( (event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
    }

}