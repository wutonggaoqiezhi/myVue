import * as THREE from 'three';
import HotspotController from './HotspotController';
import FlowEnum from '../../flow/FlowEnum'
export default class Guidepost extends THREE.Object3D 
{
    private dom: HTMLElement;
    private position2D: THREE.Vector3;

    controller?: HotspotController
    
    hotspotId: number;
    title: string;
    sign: string;
    cameraGuidePoisition: THREE.Vector3;
    cameraGuidePivot: THREE.Vector3;
    targetFlow: FlowEnum;
    sceneId: number
    audioIndex: number;

    constructor( data: any ) {
        super();

        this.hotspotId = data.id;
        this.title = data.title;
        this.sign = data.sign;
        this.targetFlow = data.targetFlow;

        this.initDom();
        this.position2D  = new THREE.Vector3();
        this.position.copy( data.position );
        this.cameraGuidePoisition = new THREE.Vector3().copy( data.cameraGuide.posture.pos )
        this.cameraGuidePivot = new THREE.Vector3().copy( data.cameraGuide.posture.pivot );
        this.visible = false;
    }

    initDom() {

        let root = document.createElement("div");
            root.className = "guidepost";
            
            root.style.opacity = "0";

        let sign = document.createElement("img");
            sign.addEventListener("click", this.onClick.bind(this), false );
            sign.className = "img"
            sign.setAttribute("src", this.sign)
            
        root.appendChild(sign);
        document.body.appendChild( root );
        this.dom = root;
    }

    update( dt: number) 
    {

        if( this.controller )
        {
            let camera = this.controller.manager.camera;
            let frustum = this.controller.manager.cameraController.frustum;
    
            this.position2D.copy(this.position).project(camera);
            this.dom.style.transform = `translate( ${0.5 * (document.body.offsetWidth * this.position2D.x - this.dom.offsetWidth)}px, 
                                                  ${-0.5 * (document.body.offsetHeight * this.position2D.y + this.dom.offsetHeight)}px )`;
            this.setVisible( this.visible && frustum.containsPoint(this.position) );

        }

    }


    setVisible( visible: boolean ) 
    {

        this.dom.style.opacity = visible ? "1" : "0";
        this.dom.style.pointerEvents = visible ? "auto" : "none";
    }


    onClick( event: MouseEvent )
    {
        this.controller && this.controller.onGuidePostClick(this);
    }

}

enum HotspotTypeEnum {
    Image = 0
}

