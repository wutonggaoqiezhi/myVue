import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import GLManager from '../GLManager';
import PanoPointCollection from './PanoPointCollection';

export default class PanoPoint extends THREE.Mesh {

    panoId: string;
    panoPosition: THREE.Vector3;
    panoMatrix: THREE.Matrix4;
    score: number;
    visibles: number[];
    manager: GLManager;
    collection: PanoPointCollection

    neighbourMap: Map<string, boolean>

    private animFadeIn: TWEEN.Tween;
    private animFadeOut: TWEEN.Tween;

    constructor( manager: GLManager, collection: PanoPointCollection, data:any ) {

        super();
        this.manager = manager;
        this.collection = collection;

        this.buildGeometry();
        this.buildMaterial();
     
        this.position.set( data.puck.x, data.puck.z, -data.puck.y );
        this.updateMatrix();
        this.updateMatrixWorld(true);
        this.panoId = this.decodeId( data.uuid );
        this.visibles = [].concat(data.visibles);
        this.score = 0;
        this.visible = false;

        this.neighbourMap = new Map<string, boolean>();

        this.panoPosition = new THREE.Vector3( data.pose.translation.x, data.pose.translation.z, -data.pose.translation.y );
        
 
        let q = new THREE.Quaternion()
		    .set( data.pose.rotation.x, data.pose.rotation.z, -data.pose.rotation.y, data.pose.rotation.w )
		    .multiply( new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(0,1,0), THREE.Math.degToRad(90) )  )	
        this.panoMatrix = new THREE.Matrix4().makeRotationFromQuaternion(q);


        this.animFadeIn = new TWEEN.Tween( this.material )
            .to({ opacity: 1}, 500)
            .onStart(() => { this.visible = true });

        this.animFadeOut = new TWEEN.Tween( this.material )
            .to({ opacity: 0}, 500)
            .onComplete(() => { this.visible = false });
        
    
    }


    buildGeometry() {

        this.geometry = new THREE.CircleBufferGeometry( 0.3, 20 );
        this.geometry.rotateX( -Math.PI/2 );
        this.geometry.computeBoundingBox();

    }

    buildMaterial() {

        let texture = new THREE.TextureLoader().load("image/pointBasic.png");
            // texture.magFilter = THREE.NearestFilter;
            // texture.minFilter = THREE.NearestFilter;
            // texture.image = new Image();
            // texture.image.src = "image/pointBasic.png"
            

        this.material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.6, map: texture,  depthWrite:false, depthTest: false });
        this.renderOrder = 101
        //texture.image.onload = () => {  texture.needsUpdate = true };

    }

    decodeId( bytes ) {

        var encoded = "";
        for (var i = 0; i < bytes.length; i++) {
            encoded += '%' + bytes[i].toString(16);
        }
        return decodeURIComponent(encoded).replace(/\-/g,"");
    }


    hoverOn() {

        this.setVisible(true)

    }

    hoverOff()
    {
        this.setVisible(false)
    }

    setVisible( visible: boolean, duration?: number, delay?: number )
    {
        if( visible )
        {
            this.manager.transitions.remove( this.animFadeOut );
            this.animFadeIn.to({ opacity: 1}, duration || 500).delay( delay|| 0);
            this.manager.transitions.add( this.animFadeIn.start() );
        }
        else
        {
            this.manager.transitions.remove( this.animFadeIn );
            this.animFadeOut.to({ opacity: 0}, duration || 500).delay( delay|| 0);
            this.manager.transitions.add( this.animFadeOut.start() );
        }
    }

    findNeighourPanos()
    {
        return this.collection.setNeighbour( this, this, false),
        // this.collection.pointsList.forEach( item  => {
        //     if ( item !== this && (!this.collection.neighbourMap[this.panoId] || void 0 === this.collection.neighbourMap[this.panoId][item.panoId])) {
        //         var t = this.position.distanceTo( item.position);
        //         if (t > 5)       //settings.panoramaNeighbourMaxDistance
        //             return this.collection.setNeighbour(this, item, !1), 
        //             void n.raycastsSkipped++;
        //         var i = item.position.clone().sub(this.position).normalize()
        //             , o = new THREE.Raycaster(this.position,i.clone(),0,t)
        //             , s = o.intersectObjects(this.model.colliders);
        //         n.raycastsDone++,
        //         this.model.panos.setNeighbour(this, item, 0 === s.length),
        //         settings.showNeighbourRaycasts && (s.length ? this.floor.model.add(new THREE.ArrowHelper(i,this.position,s[0].distance,16711680)) : this.floor.model.add(new THREE.ArrowHelper(i,this.position,t,16777215,0,0)))
        //     }
        // }
        // .bind(this)),
        this.collection.neighbourMap[this.panoId];
    };

}