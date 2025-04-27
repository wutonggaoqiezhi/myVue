export default {
	
	initial:{
		
		vs:`
			attribute vec3 position;

			void main(void) {
				
				gl_Position = vec4(position.xy,0.0,1.0);
		
			}
		`,
		fs:`
			#ifdef GL_ES
                precision highp float;
            #endif
	
			uniform vec2 iResolution;
				
			void main(void) {
				gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
				vec2 uv = gl_FragCoord.xy / iResolution.xy;	
		
			
				gl_FragColor = vec4( uv, 1.0, 1.0);
						
			}
		`
	},
	background:{
		
		vs:`
			attribute vec3 position;

			void main(void) {
				
				gl_Position = vec4(position.xy,0.0,1.0);
		
			}
		`,
		fs:`
			#ifdef GL_ES
                precision highp float;
            #endif
	
			uniform vec2 iResolution;
			
			uniform highp sampler2D iChannel0;
			uniform highp sampler2D iChannel1;
			uniform float progress;
			
			void main(void) {
				gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
				vec2 uv = gl_FragCoord.xy / iResolution.xy;	
		
				vec4 color = texture2D( iChannel0, uv );	
				float colorGrad = texture2D( iChannel1, uv ).r;

				color.rgb *= color.a;
				gl_FragColor = color * smoothstep( colorGrad - 1.0 / 24.0, colorGrad, (progress * (1.0 + 1.0 / 24.0) - 1.0 / 24.0) );			
			}
		`
	},
	loader:{
		
		vs:`
			attribute vec3 position;

			void main(void) {
				
				gl_Position = vec4(position.xy,0.0,1.0);
		
			}
		`,
		fs:`
			#ifdef GL_ES
                precision highp float;
            #endif
	
			uniform vec2 iResolution;
			
			uniform highp sampler2D iChannel0;
			uniform highp sampler2D iChannel1;
			uniform float progress;
			
			void main(void) {
				
				
				vec2 uv0 = gl_FragCoord.xy / iResolution.xy;		
				
				
				vec2 uv1 = vec2(smoothstep( 0.5 - 0.5 * progress, 0.5 + 0.5 * progress, uv0.x), uv0.y );
				
				vec4 color0 = texture2D(iChannel0, uv0);
				vec4 color1 = texture2D(iChannel1, uv1);		
	
				gl_FragColor = vec4( 0.0, 0.0, 0.0, color1.a * color0.a); //color1.a * color0.a);
						
			}
		`
	},
	logo:{
		
		vs:`
			attribute vec3 position;

			void main(void) {
				
				gl_Position = vec4(position.xy,0.0,1.0);
		
			}
		`,
		fs:`
			#ifdef GL_ES
                precision highp float;
            #endif
	
			uniform vec2 iResolution;
			
			uniform highp sampler2D iChannel0;
			uniform highp sampler2D iChannel1;
			uniform float progress;
			
			void main(void) {
				gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
				
				vec2 uv = gl_FragCoord.xy / iResolution.xy;	
	
				
				vec4 color = texture2D(iChannel0, uv).rgba;
				vec4 colorGrad = texture2D(iChannel1, uv).rgba;

				bool filled = progress >= colorGrad.b;
				bool erased = colorGrad.a >= 0.0 && colorGrad.a <= progress;
					
				//color.rgb *= color.a;
				gl_FragColor = color * (filled && !erased ? 1.0 : 0.0);
				
					
			}
		`
	}
	
	
}
