import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import GLManager from '../GLManager';
import PanoScene from './PanoScene';
import PanoPoint from './PanoPoint';
import PanoAssetLoader from './PanoAssetLoader';
import PanoMatchingRules from './PanoMatchingRules';
import IAppMouseEvent from '../event/IAppMouseEvent';
import PanoPointer from '../object/PanoPointer';
import { resolve } from 'dns';
import FlowEnum from 'src/flow/FlowEnum';



export default class PanoSceneController extends THREE.EventDispatcher {

    public manager: GLManager;
    private scenes: PanoScene[];
    private fileLoader: THREE.FileLoader;
    private textureLoader: PanoAssetLoader;

    pointer: PanoPointer;

    activeScene: PanoScene | null;
    activePoint: PanoPoint | null;
    cameraWorldPosition: THREE.Vector3;
    cameraWorldDirection: THREE.Vector3;

    isMoving: boolean;
    isMouseDown: boolean;
    raycaster: THREE.Raycaster;
    intersection: THREE.Vector3;
    mouseMove: boolean;


    constructor( manager: GLManager ) 
    {
        super();
        
        this.manager = manager;
        this.scenes = [];
        this.fileLoader = new THREE.FileLoader().setResponseType("json");
        this.textureLoader = new PanoAssetLoader();
        this.pointer = new PanoPointer( this );

        this.activeScene = null;
        this.activePoint = null;
        this.cameraWorldPosition = this.manager.cameraController.worldPosition;
        this.cameraWorldDirection = this.manager.cameraController.worldDirection;

        this.isMoving = false;
        this.raycaster = new THREE.Raycaster();
        this.intersection = new THREE.Vector3();
  

    }

    init() {

        this.fileLoader.load("panoramas/panoScenes.json", ( data: any ) => {

            data.panoScenes.forEach( item => {
                let panoscene = new PanoScene( this, item );
                panoscene.visible = false;
                this.addPanoScene( panoscene );
            })
        });
        this.pointer.visible = false;
        
    }

    reset() 
    {
        this.activeScene && this.outScene();
    }

    update( dt: number )
    {
       
        if( this.activeScene )
        {
            this.manager.raycaster.ray.intersectPlane( this.activeScene.floor, this.intersection );
            this.pointer.position.copy( this.intersection );

            if(this.cameraWorldDirection.x === NaN) debugger
            this.updateMinimap(this.cameraWorldPosition,this.cameraWorldDirection);
           
        }

    }


    updateMinimap( position: THREE.Vector3, direction: THREE.Vector3)
    {
        this.manager.app.dispatchEvent({type:"minimap.update", data: { position: position, direction: direction }})
    }

    addPanoScene( panoScene: PanoScene )
    {
        this.scenes.push( panoScene );
    }

    findSceneByFlow( flow: FlowEnum ): PanoScene | null
    {
        return this.scenes.find( item => item.flow == flow );
    }

    active() {

        this.manager.cameraController.panoControls.controller = this;
    }

    dormant() {

        this.manager.cameraController.panoControls.controller = null;

    }

    enterScene( scene: PanoScene ) :Promise<any>
    {
        return new Promise((resolve,reject)=>{
            
            this.textureLoader.setPath(`${scene.points.imagesFolderUrl}high/` )

            this.activeScene = scene;
            let entryPoint = scene.getEntryPoint();
            this.textureLoader.getTextureForPoint( entryPoint )
            .then( (texure) => {
                this.activeScene.onEnter( texure, entryPoint );

                let position = entryPoint.panoPosition.clone();
                this.activeScene.localToWorld( position );
                this.manager.transitions.add( new TWEEN.Tween( this.manager.camera.position )
                .to({ x: position.x, y: position.y, z: position.z }, 1000)
                .delay(100)
                .easing( TWEEN.Easing.Quadratic.InOut )
                .start()
                .onComplete(() => { 
                    this.activePoint = entryPoint;
                    this.pointer.setVisible( true );
                    this.activeScene.updatePointsVisible( this.activePoint );
                    this.active();
                    resolve();
                })
                );
            })
            
        })
    }


    outScene( ) {

        this.dormant();
        this.activeScene.onExit();
        this.activeScene = null;
        this.activePoint = null;
        this.textureLoader.disposeAllTexture();

    }

    
    getPointerDirection(): THREE.Vector3 {

        let direction = new THREE.Vector3(0,0,1);
        direction.unproject(this.manager.camera).sub(this.manager.camera.position).normalize()
        return direction;
    }

    moveToDirection( direction?: THREE.Vector3 )
    {

        direction = direction || this.getPointerDirection()

        if( this.activeScene && !this.isMoving )
        {
            let targetPoint = this.findClosestTargetInDirection( direction );

            if( targetPoint )
            {
                this.moveToPoint( targetPoint );
            }
            else
            {
                this.collide( direction );
            }
        }
        

    }

    

    findClosestTargetInDirection( direction: THREE.Vector3 ): PanoPoint | null
    {
        let point: PanoPoint = null;
        if( this.activeScene && this.activePoint )
        {
            
           
            point = this.activeScene.points.findRankedByScore(0, 
                [
                    PanoMatchingRules.filterFunctions.inPanoDirection( this.cameraWorldPosition, direction ),
                    PanoMatchingRules.filterFunctions.isNeighbourPanoTo( this.activePoint ),
                    PanoMatchingRules.filterFunctions.not( this.activePoint )
                ],
                [
                    PanoMatchingRules.scoreJudges.distanceSquared( this.activePoint ),
                    PanoMatchingRules.scoreJudges.direction( this.cameraWorldPosition, direction )
                ], 
                point);
        }
        return point;         
    }


    moveToPoint( point: PanoPoint )
    {
        if( !this.isMoving )
        {
            this.isMoving = true;
            this.textureLoader.getTextureForPoint( point )
            .then( (texture) => {

                let position = point.panoPosition.clone();
                this.activeScene.localToWorld( position );
                let duration = 750 + 150 *  Math.min( this.manager.camera.position.distanceTo( position ), 5)
                
                this.activeScene.onMoveToPoint( texture, point, duration );

                this.manager.transitions.add( new TWEEN.Tween( this.manager.camera.position )
                    .to({ x: position.x, y: position.y, z: position.z }, duration)
                    .easing( TWEEN.Easing.Quadratic.InOut )
                    .start() 
                    .onComplete( () => { 
                        this.activePoint = point;
                        this.isMoving = false;
                        this.activeScene.updatePointsVisible( this.activePoint );
                    })
                );
    
            })
        }  
    }

    
    collide( direction: THREE.Vector3 ) 
    {

    }


    onMove( event: THREE.Event ) 
    {
        let raycaster = event.data as THREE.Raycaster;  
        let position = new THREE.Vector3();
        raycaster.ray.intersectPlane( this.activeScene.floor, position );
        this.activeScene.worldToLocal( position );
        let direction = position.sub(this.activePoint.panoPosition).normalize();    
        this.moveToDirection( direction );
    }

    
}