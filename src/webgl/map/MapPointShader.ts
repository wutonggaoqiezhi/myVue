import * as THREE from 'three';


export default {

    vs: `
        #define PI2 6.2831
                    
        uniform float time; 
        uniform float progress;

        uniform float initAmplitude;
        uniform float hoverAmplitude;

        uniform float initHeight;
        uniform float hoverHeight;

        uniform float density;

        uniform float pointSize;
        uniform float densityMinDistance;
        uniform float densityMaxDistance;
                
        uniform vec3 pointColor;
        uniform vec3 fogColor;
        uniform float fogBaseStrength;
        uniform float fogHeightStrength;

        attribute float aRanking;

        varying highp vec3 vColor;


        // vec3 hash33(vec3 p3) {
        //     p3 = fract(p3 * vec3(.1031, .1030, .0973));
        //     p3 += dot(p3, p3.yxz+19.19);
        //     return fract((p3.xxy + p3.yxx)*p3.zyx);
        // }
        
        // const mat4 m = mat4( 0.00,  0.80,  0.60, -0.4,
        //                     -0.80,  0.36, -0.48, -0.5,
        //                     -0.60, -0.48,  0.64,  0.2,
        //                      0.40,  0.30,  0.20,  0.4);
        
        // vec3 octaves(vec4 p) {
        //     vec4 q = m * p;
        //     vec4 f  = 0.5000*sin( q );
        //     q = m*q*2.01;
        //     f += 0.2500*sin( q );
        //     q = m*q*2.02;
        //     f += 0.1250*sin( q );
        //     q = m*q*2.03;
        //     f += 0.0625*sin( q );
        //     return f.xyz;
        // }


        vec3 hash33(vec3 p3) {
            p3 = fract(p3 * vec3(.1031, .1030, .0973));
            p3 += dot(p3, p3.yxz+19.19);
            return fract((p3.xxy + p3.yxx)*p3.zyx);
        }

        const mat4 m = mat4( 0.00,  0.80,  0.60, -0.4,
                -0.80,  0.36, -0.48, -0.5,
                -0.60, -0.48,  0.64,  0.2,
                0.40,  0.30,  0.20,  0.4);

        vec3 octaves(vec4 p) {
            vec4 q = m * p;
            vec4 f  = 0.5000*sin( q );
            q = m*q*2.01;
            f += 0.2500*sin( q );
            q = m*q*2.02;
            f += 0.1250*sin( q );
            q = m*q*2.03;
            f += 0.0625*sin( q );
            return f.xyz;
        }
           

    
  
        void introEffect( inout vec3 position, float random )
        {
            vec3 noise = octaves( vec4( vec3(random * 40.-20.), time * .2 + random * PI2 * 10.) );
            float height = smoothstep( 0.0, 10.0, position.y);
            
            vec3 positionStart = position + noise * initAmplitude;

            float progressNoise = smoothstep( 0.2, 0.8, progress );
            position = mix( positionStart, position, progressNoise ) + noise * hoverAmplitude;

            float progressY = smoothstep( height , 1.0, progress );
            position.y = mix( positionStart.y * initHeight, position.y * hoverHeight, progressY );

            
        }
       

        

        void main(void) {
            
            vec4 pos = vec4(position, 1.0);
            vec4 worldPosition = modelMatrix  * pos;
                
            introEffect(worldPosition.xyz, aRanking);
            

            float show = 1.0;
            show = 1.0 - clamp( 1.0, 0.0,pow( smoothstep( densityMinDistance, densityMaxDistance, length(worldPosition.xyz - cameraPosition) ), 0.6 ) );
            show *= density;
            
            vec3 rayDirection = worldPosition.xyz - cameraPosition;
            float distance = length(rayDirection) ;
            rayDirection *= ( 1. / distance);
            float fog = fogBaseStrength * (1.0 - exp( -distance * rayDirection.y * fogHeightStrength)) / rayDirection.y;
            vColor.xyz =  mix(pointColor/255., fogColor/255., min( fog, 1.));
            
            
            if( aRanking > show )
            {
                gl_Position = vec4(100.,0.,0.,1.0);
            }
            else
            {
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
            }
            gl_PointSize = pointSize / gl_Position.w ;
            
            
            
            
            
        }`,

    fs: `
        #ifdef GL_ES
            precision mediump float;
        #endif
        

        varying highp vec3 vColor;
        
        void main(void) {
            gl_FragColor = vec4(vColor, 1.);
        }
    `,
    uniforms: {
                
        time: { value:0 },
        progress: { value: 0 },

        initAmplitude: { value: 30 },
        hoverAmplitude: { value: 0 },
        initHeight: { value: 0 },
        hoverHeight: { value: 0.9 },

        density: { value: 0.1 },
     
        pointSize: { value: 16.17 },
       
        densityMinDistance: { value: 80 },
        densityMaxDistance: { value: 200 },
        
        pointColor : { value: new THREE.Color(12, 28, 35) },
        fogColor: { value: new THREE.Color(215, 243, 247) },
        fogBaseStrength: { value: 0.05 },
        fogHeightStrength: { value: 0.038 },

    }

}