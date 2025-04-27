import PanoPoint from './PanoPoint';
import * as THREE from 'three';
import PanoScene from './PanoScene';

export default class PanoAssetLoader {


    private textures: THREE.CubeTexture[];
    private textureLoader = new THREE.CubeTextureLoader;

    constructor(  ) {

        this.textures = [];
        this.textureLoader = new THREE.CubeTextureLoader();

    }

    setPath( basePath: string ) {

        this.textureLoader.setPath(basePath);
    }

    getTextureForPoint( point: PanoPoint ) : Promise< THREE.CubeTexture >
    {
       
        return new Promise((resolve, reject) => {

            this.textureLoader.load( this.getUrls( point.panoId ),( texture) => {
                resolve( texture );
                this.textures.push( texture );
            })
            
        })
    }

    disposeAllTexture() {

        this.textures.forEach( item => { item.dispose() })

    }

    private getUrls( panoId: string ): string[] {

        let urls:string[] = [];
							
        urls.push( `${panoId}_skybox${2}.jpg` );
        urls.push( `${panoId}_skybox${4}.jpg` );
        urls.push( `${panoId}_skybox${0}.jpg` );
        urls.push( `${panoId}_skybox${5}.jpg` );
        urls.push( `${panoId}_skybox${1}.jpg` );
        urls.push( `${panoId}_skybox${3}.jpg` );
        
        return urls;
    }
}