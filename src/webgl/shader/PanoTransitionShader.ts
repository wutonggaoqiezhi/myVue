import * as THREE from 'three';

export default  {

    vertexShader:  `

        uniform vec3 pano0Position;
        uniform mat4 pano0Matrix;
        uniform vec3 pano1Position;
        uniform mat4 pano1Matrix;

        varying vec2 vUv;
        varying vec3 vWorldPosition0;
        varying vec3 vWorldPosition1;

        void main() {

            vec4 worldPosition = modelMatrix * vec4(position.xyz, 1.0);
            vec3 positionLocalToPanoCenter0 = position.xyz - pano0Position;
            vWorldPosition0 = (vec4(positionLocalToPanoCenter0, 1.0) * pano0Matrix).xyz;
            vWorldPosition0.x *= -1.0;

            vec3 positionLocalToPanoCenter1 = position.xyz - pano1Position;
            vWorldPosition1 = (vec4(positionLocalToPanoCenter1, 1.0) * pano1Matrix).xyz;
            vWorldPosition1.x *= -1.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
    `,
    fragmentShader:`

        uniform float opacity;
        uniform float progress;
        uniform vec3 pano0Position;
        uniform samplerCube pano0Map;
        uniform vec3 pano1Position;
        uniform samplerCube pano1Map;

        varying vec2 vUv;
        varying vec3 vWorldPosition0;
        varying vec3 vWorldPosition1;

        void main() {
            vec4 colorFromPano0 = textureCube( pano0Map, vWorldPosition0.xyz );
            vec4 colorFromPano1 = textureCube( pano1Map, vWorldPosition1.xyz );

            vec4 colorFromPanos = mix(colorFromPano0, colorFromPano1, progress);
            float whiteness = 1.0 - smoothstep(0.1, 0.2, opacity);
            colorFromPanos = mix(colorFromPanos, vec4(0.5, 0.5, 0.5, 1.0), whiteness);

            gl_FragColor = vec4(colorFromPanos.rgb, opacity);
        }
    `,
    uniforms: {

		"opacity": {
			type: "f",
			value: 0
		},
		"progress": {
			type: "f",
			value: 0
        },	
        
		"pano0Map": {
			type: "t",
			value: null 
		},
		"pano0Position": {
			type: "v3",
			value: new THREE.Vector3
		},
		"pano0Matrix": {
			type: "m4",
			value: new THREE.Matrix4
        },
        
		"pano1Map": {
			type: "t",
			value: null 
		},
		"pano1Position": {
			type: "v3",
			value: new THREE.Vector3
		},
		"pano1Matrix": {
			type: "m4",
			value: new THREE.Matrix4
		}
	},
}