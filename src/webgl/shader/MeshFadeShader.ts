import * as THREE from 'three';

export default  {

    vs: `
		
			varying vec2 vUv;
			
			void main(void) {	
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
				vUv = uv;
				
			}
		`,

    fs: `
			uniform sampler2D map;
			uniform float u_alphatest;
			uniform float opacity;
			varying vec2 vUv;
			
			float hash12(vec2 p) {
				vec3 p3  = fract(vec3(p.xyx) * 443.8975);
			    p3 += dot(p3, p3.yzx + 1.5);
			    return fract((p3.x + p3.y) * p3.z);
			}
			
			
			void main(void) {			
				if(u_alphatest < 1. && hash12(vUv) > u_alphatest) {
					discard;
				}
		    	vec4 diffuse = texture2D(map,vUv);    	
		        gl_FragColor = vec4(diffuse.rgb, opacity);
			}
        `,
    uniforms: {
        map: new THREE.Uniform( null ),
        u_alphatest: new THREE.Uniform( 1 ),
        opacity: new THREE.Uniform( 1 )
    }
}