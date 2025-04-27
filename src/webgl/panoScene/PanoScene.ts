import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import Build from '../object/Build';
import PanoSceneController from './PanoSceneController';
import PanoPointCollection from './PanoPointCollection';
import PanoViewbox from './PanoViewbox';
import PanoAssetLoader from './PanoAssetLoader';
import PanoPoint from './PanoPoint';
import PanoMatchingRules from './PanoMatchingRules'


export default class PanoScene extends THREE.Object3D {

    public contoller: PanoSceneController;

    public sceneId: number;
    mesh?: Build; 
    public points: PanoPointCollection;
    private viewbox: PanoViewbox;
    floor: THREE.Plane;
    beginIndex: number;
    flow: number;

    constructor( contoller: PanoSceneController, data: any ) {

        super();
        
        this.contoller = contoller;
        this.sceneId = data.id;
        this.flow = data.flow;
        data.mesh && this.createMesh( data.mesh );
        this.points = new PanoPointCollection( contoller, this, data.pano );
        this.beginIndex = data.begin;
       
       


        this.position.copy( data.transform.translation );
        this.rotation.set( THREE.Math.degToRad( data.transform.rotation.x ),
                           THREE.Math.degToRad( data.transform.rotation.y ),
                           THREE.Math.degToRad( data.transform.rotation.z ));
        this.scale.copy( data.transform.scale );
        this.updateMatrix()
        this.updateWorldMatrix( true, true );
        this.viewbox = new PanoViewbox( this, data.pano.viewbox );

        this.contoller.manager.scene.add(this);
        this.floor = new THREE.Plane( new THREE.Vector3(0,1,0), 0);

        //this.add( new THREE.AxesHelper(5))
 
    }

    update( dt: number )
    {
        if(this.visible)
        {
            
        }
    }

    /**
     * 
     * @param meshData { model: url, texture: url }
     */
    createMesh( meshData ) {
        
        
        this.mesh = new Build( this.contoller.manager, meshData );
        this.mesh.setVisible( false );

    }


    onEnter( texture: THREE.CubeTexture, point: PanoPoint ) {

        this.visible = true;
        this.mesh.setVisible(true)
        this.viewbox.setView0( point, texture );
        this.viewbox.setView1( point, texture );
        this.viewbox.setVisible( true, 1000, 750 );
        this.points.pointsList.forEach(item=>{ item.setVisible(false, 0, 0) })
    }

    onExit() {

        this.mesh && this.mesh.setVisible( false );
        this.points.pointsList.forEach(item=>{ item.setVisible(false) })
        this.viewbox.setVisible( false, 100 );

    }

    onMoveToPoint( texture: THREE.CubeTexture, point: PanoPoint, duration?: number )
    {
        this.viewbox.setView1( point, texture );
        this.contoller.manager.transitions.add( 
            new TWEEN.Tween( this.viewbox.material.uniforms.progress )
            .onComplete(()=>{ 
                this.viewbox.material.uniforms.progress.value = 0;
                this.viewbox.setView0( point, texture );
            })
            .easing( TWEEN.Easing.Quadratic.InOut )
            .to({ value: 1 }, duration || 1000).start() 
        )

    }

    directionWorldToLocal( worldDirection: THREE.Vector3 ) {

        this.worldToLocal( worldDirection.clone())
        return worldDirection.normalize();
    }

    updatePointsVisible( activePoint: PanoPoint )
    {
 
        this.points.pointsList.forEach(item=>{

            item.setVisible(false);
            //item.setVisible(activePoint.neighbourMap.get(item.panoId), 100);  
        })
    }

    getEntryPoint( ): PanoPoint
    {
        return this.points.pointsList[this.beginIndex]
    }
    
}


