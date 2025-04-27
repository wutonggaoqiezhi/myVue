import * as THREE from 'three'
import PanoScene from './PanoScene';
import PanoSceneController from './PanoSceneController';
import GLManager from '../GLManager';
import Decoder from '../decoder/Decoder';
import PanoPoint from './PanoPoint';
import Build from '../object/Build';

export default class PanoPointCollection {

    private scene: PanoScene;
    private controller: PanoSceneController;

     pointsList: PanoPoint[];
     pointsMap: Map<string, PanoPoint>;
     neighbourMap: Map<string, Map<string, boolean>>;

    private descriptorUrl: string;
    public imagesFolderUrl: string;

    constructor( controller: PanoSceneController, scene: PanoScene, panoData: any ) {

        this.controller = controller;
        this.scene = scene;

        this.pointsList =  [];
        this.pointsMap = new Map<string, PanoPoint>();
        this.neighbourMap = new Map<string, Map<string, boolean>>();

        this.descriptorUrl = panoData.descriptor;
        this.imagesFolderUrl = panoData.images;

        this.controller.manager.loader.addRequest( this.descriptorUrl, "arraybuffer", (data) => {

            let decodedData = Decoder.modeldata.lookupType("NavigationInfo").decode( new Uint8Array( data.data ) ) as any;
            decodedData.sweepLocations.forEach( item => {
                this.addPanoPoint( new PanoPoint( this.controller.manager, this, item) );       
            });

            this.buildPointsNeighbouring(this.scene.mesh);
           
        })


    
    }

    

    
    addPanoPoint( panoPoint: PanoPoint )
    {
        this.scene.add( panoPoint );
        this.pointsMap.set( panoPoint.panoId, panoPoint );
        this.pointsList.push( panoPoint );
    }


    buildPointsNeighbouring( build: Build ) 
    {

        let raycaster = new THREE.Raycaster();
            raycaster.far = 50;
        
        this.pointsList.forEach( item => {

            this.neighbourMap.set(item.panoId, item.neighbourMap);
            item.visibles.forEach( neighbourIndex => {
                item.neighbourMap.set(this.pointsList[neighbourIndex].panoId, true);
            })
        
        })
    }


    findRankedByScore( rank: number, filters: Function[], scoreJudges: Array< ( point: PanoPoint ) => number > , result: PanoPoint ): PanoPoint | null
    {
        
        let rankedList = this.sortByScore( filters, scoreJudges );
        return !rankedList || rankedList.length === 0 || rank >= rankedList.length ? null : ( result = rankedList[rank] , rankedList[rank]);
    }


    sortByScore( filters: Function[], scoreJudges: Array< ( point: PanoPoint ) => number > ): PanoPoint[]
    {
        let alternativeList = this.fliterAll( this.pointsList, filters);
    
        return alternativeList.length == 0 ? null : alternativeList = alternativeList.map( (item) => {

            item.score = scoreJudges.reduce( ( total, scoreJudge) => {
                return total += scoreJudge( item );
            },0)
            return item;

        }).sort( (current, next) => {

            return next.score - current.score;
        });
        
    }

    fliterAll( list: PanoPoint[],filters: Function[] ): PanoPoint[] {
        
        return list.filter(function( listItem ) {
            return filters.every(function( filterItem ) {
                return filterItem(listItem);
            })
        })

    }

    setNeighbour ( point: PanoPoint, neighbourPano: PanoPoint, isNeighbour: boolean ): Map<string, boolean>
    {
        this.neighbourMap[point.panoId][neighbourPano.panoId] || (this.neighbourMap[point.panoId] = {});
        this.neighbourMap[neighbourPano.panoId] || (this.neighbourMap[neighbourPano.panoId] = {});
        this.neighbourMap[point.panoId][point.panoId] = true;
        this.neighbourMap[neighbourPano.panoId][neighbourPano.panoId] = true;
        this.neighbourMap[point.panoId][neighbourPano.panoId] = isNeighbour;
        this.neighbourMap[neighbourPano.panoId][point.panoId] = isNeighbour;
        return this.neighbourMap[point.panoId];
    };

}