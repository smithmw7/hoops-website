import{$ as e,B as t,G as n,I as r,K as i,M as a,N as o,Q as s,R as c,Y as l,Z as u,_ as d,a as f,b as p,ct as m,d as h,dt as g,f as ee,i as _,j as v,k as y,l as b,lt as x,m as S,n as te,nt as ne,o as re,ot as ie,q as C,st as ae,t as w,tt as T,u as E,ut as D,w as oe,x as se,y as ce,z as le}from"./three.module-BX77n35w.js";import{t as ue}from"./renderProfile-aO4uU0Jx.js";var de={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},O=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},fe=new r(-1,1,1,-1,0,1),pe=new class extends f{constructor(){super(),this.setAttribute(`position`,new d([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new d([0,2,0,0,2,0],2))}},k=class{constructor(e){this._mesh=new v(pe,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,fe)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},me=class extends O{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof s?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=m.clone(e.uniforms),this.material=new s({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new k(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},he=class extends O{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},ge=class extends O{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},_e=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new x);this._width=n.width,this._height=n.height,t=new g(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:p}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new me(de),this.copyPass.material.blending=0,this.timer=new ie}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}he!==void 0&&(r instanceof he?n=!0:r instanceof ge&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new x);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},A={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},ve=class extends O{constructor(){super(),this.isOutputPass=!0,this.uniforms=m.clone(A.uniforms),this.material=new n({name:A.name,uniforms:this.uniforms,vertexShader:A.vertexShader,fragmentShader:A.fragmentShader}),this._fsQuad=new k(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},E.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},ye=class extends O{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new b}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},j={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new b(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},be=class e extends O{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new x(256,256):new x(e.x,e.y),this.clearColor=new b(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new g(i,o,{type:p}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new g(i,o,{type:p});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new g(i,o,{type:p});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),o=Math.round(o/2)}let c=j;this.highPassUniforms=m.clone(c.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new s({uniforms:this.highPassUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];i=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new x(1/i,1/o),i=Math.round(i/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let u=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=u,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=m.clone(de.uniforms),this.blendMaterial=new s({uniforms:this.copyUniforms,vertexShader:de.vertexShader,fragmentShader:de.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new b,this._oldClearAlpha=1,this._basic=new a,this._fsQuad=new k(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new x(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new s({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new x(.5,.5)},direction:{value:new x(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new s({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};be.BlurDirectionX=new x(1,0),be.BlurDirectionY=new x(0,1);var xe={name:`VignetteShader`,uniforms:{tDiffuse:{value:null},offset:{value:1},darkness:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float offset;
		uniform float darkness;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			// Eskil's vignette

			vec4 texel = texture2D( tDiffuse, vUv );
			vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );
			gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );

		}`},M={id:`soft-serve-swirl`,name:`Soft Serve Swirl`,briefId:`soft-serve-swirl`,status:`graybox`,version:`0.1.0`,versionSequence:1,versionState:`working`,versionBranch:`main`,parentVersion:null,entry:`src/games/soft-serve-swirl/index.ts`,thumbnail:`/assets/games/soft-serve-swirl/thumbnail.png`,presentation:{dimensions:`3D`,camera:`fixed portrait product view with a soft studio backdrop`,orientation:`responsive`},players:{count:`1`,relationship:`single-player craft toy`},controls:[`press and hold anywhere to dispense while the cone eases toward the finger`,`release to stop the flow and set the curled tip`,`Space holds the flow on desktop`,`P pauses`,`R resets`,`F toggles fullscreen`],roundDuration:`approximately fifteen to forty seconds`,capabilities:[`three`,`audio`,`haptics`,`touch`,`keyboard`]},Se=.94,N=2.55;function P(){let e=document.createElement(`canvas`);e.width=512,e.height=512;let t=e.getContext(`2d`);if(!t)return null;t.fillStyle=`#ffd9ac`,t.fillRect(0,0,512,512),t.strokeStyle=`rgba(150, 84, 30, 0.42)`,t.lineWidth=9,t.lineCap=`round`;for(let e=-512;e<1024;e+=58)t.beginPath(),t.moveTo(e,0),t.lineTo(e+512,512),t.stroke(),t.beginPath(),t.moveTo(e+512,0),t.lineTo(e,512),t.stroke();let n=new re(e);return n.colorSpace=l,n.wrapS=C,n.wrapT=C,n.repeat.set(5,2.1),n.anisotropy=4,n}function Ce(){let e=new ce,t=P(),n=[];for(let e=0;e<=26;e+=1){let t=e/26,r=t*N,i=.075+.865*t**.82;n.push(new x(i,r))}let r=new o({side:2,color:`#e69953`,map:t??void 0,roughness:.78,metalness:0,bumpMap:t??void 0,bumpScale:.05,sheen:.18,sheenRoughness:.85,sheenColor:new b(`#ffd9ab`),clearcoat:.05}),i=new v(new oe(n,96),r);i.castShadow=!0,i.receiveShadow=!0,e.add(i);let a=new o({color:`#eda06a`,roughness:.66,metalness:0,sheen:.22,sheenColor:new b(`#ffd9ab`)}),s=new v(new ae(.9199999999999999,.115,16,96),a);s.rotation.x=Math.PI/2,s.position.y=2.53,s.castShadow=!0,s.receiveShadow=!0,e.add(s);let c=a.clone(),l=new v(new ae(Se*.72,.085,14,80),c);l.rotation.x=Math.PI/2,l.position.y=N*.72,l.castShadow=!0,e.add(l);let u=a.clone(),d=new v(new ne(.19,24,16),u);d.scale.set(1,.66,1),d.position.y=.02,d.castShadow=!0,e.add(d);let f=[r,a,c,u];return{group:e,materials:f,setColor(e){let t=new b(e);r.color.copy(t);let n=t.clone().offsetHSL(-.012,.03,-.05);a.color.copy(n),c.color.copy(n),u.color.copy(n)},dispose(){i.geometry.dispose(),s.geometry.dispose(),l.geometry.dispose(),d.geometry.dispose(),f.forEach(e=>e.dispose()),t?.dispose()}}}function we(e){let t=new ce,n=new o({color:`#9fabb2`,roughness:.3,metalness:1,envMapIntensity:.9}),r=new v(new h(.36,.23,.72,40,1,!0),n);r.position.y=e+.36,t.add(r);let i=new v(new ae(.23,.045,12,44),n);return i.rotation.x=Math.PI/2,i.position.y=e,t.add(i),t.traverse(e=>{e instanceof v&&(e.castShadow=!0)}),{group:t,dispose(){r.geometry.dispose(),i.geometry.dispose(),n.dispose()}}}function F(e,t,n){let r=document.createElement(`canvas`);r.width=256,r.height=256;let i=r.getContext(`2d`);if(!i)return r;let a=i.createLinearGradient(0,0,0,256);a.addColorStop(0,e),a.addColorStop(1,t),i.fillStyle=a,i.fillRect(0,0,256,256);let o=i.createRadialGradient(80,60,4,80,60,150);return o.addColorStop(0,n),o.addColorStop(1,`rgba(255,255,255,0)`),i.fillStyle=o,i.fillRect(0,0,256,256),r}function Te(e,t){let n=F(`#f6e6cf`,t,`rgba(255,246,229,0.8)`),r=new re(n);r.mapping=303,r.colorSpace=l;let i=new w(e),a=i.fromEquirectangular(r);return i.dispose(),r.dispose(),a}function Ee(e){let t=document.createElement(`canvas`);t.width=512,t.height=512;let n=t.getContext(`2d`),r=new b(e);if(n){let e=r.clone().offsetHSL(0,.06,-.06),t=r.clone().offsetHSL(0,.02,-.24),i=n.createLinearGradient(0,0,0,512);i.addColorStop(0,`#${e.getHexString()}`),i.addColorStop(1,`#${t.getHexString()}`),n.fillStyle=i,n.fillRect(0,0,512,512);let a=n.createRadialGradient(256,210,12,256,210,300),o=r.clone().offsetHSL(0,.07,.04);a.addColorStop(0,`rgba(${Math.round(o.r*255)}, ${Math.round(o.g*255)}, ${Math.round(o.b*255)}, 0.95)`),a.addColorStop(1,`rgba(0,0,0,0)`),n.fillStyle=a,n.fillRect(0,0,512,512)}let i=new re(t);return i.colorSpace=l,i}function De(e){let t={uTime:{value:0},uJiggle:{value:e.jiggle},uImpulse:{value:new x},uStackTop:{value:1},uSssDirection:{value:new D(0,0,1)},uSssColor:{value:new b(`#ffc487`)},uSssScale:{value:e.translucency},uSssPower:{value:e.translucencyPower},uSssAmbient:{value:e.translucencyAmbient},uSssDistortion:{value:e.distortion},uOcclusion:{value:e.occlusion}},n=new o({color:new b(e.color),roughness:e.roughness,metalness:0,sheen:e.sheen,sheenRoughness:.62,sheenColor:new b(`#fff3e0`),clearcoat:.08,clearcoatRoughness:.5,envMapIntensity:.18,flatShading:!1}),r=new D(0,0,1);return n.onBeforeCompile=e=>{Object.assign(e.uniforms,t),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
        attribute float aThickness;
        varying float vThickness;
        varying float vLocalHeight;
        varying float vUpness;
        uniform float uTime;
        uniform float uJiggle;
        uniform vec2 uImpulse;
        uniform float uStackTop;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
        vThickness = aThickness;
        vLocalHeight = position.y;
        vUpness = normalize(mat3(modelMatrix) * objectNormal).y;
        float wobbleReach = smoothstep(0.0, max(0.35, uStackTop), position.y);
        float wobblePhase = position.y * 3.1 - uTime * 7.5;
        vec2 wobble = uImpulse * uJiggle * wobbleReach * sin(wobblePhase);
        transformed.x += wobble.x;
        transformed.z += wobble.y;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
        varying float vThickness;
        varying float vLocalHeight;
        varying float vUpness;
        uniform float uOcclusion;
        uniform vec3 uSssDirection;
        uniform vec3 uSssColor;
        uniform float uSssScale;
        uniform float uSssPower;
        uniform float uSssAmbient;
        uniform float uSssDistortion;`).replace(`#include <lights_fragment_end>`,`#include <lights_fragment_end>
        // Downward-facing cream sits in the trench between coils. Darkening it
        // gives the stack contact shading that a light rig alone cannot reach,
        // and it is what stops merged coils from reading as hollow shells.
        float crevice = mix(1.0 - uOcclusion, 1.0, smoothstep(-0.95, 0.55, vUpness));
        reflectedLight.directDiffuse *= crevice;
        reflectedLight.indirectDiffuse *= crevice;
        reflectedLight.directSpecular *= crevice;
        reflectedLight.indirectSpecular *= crevice;
        vec3 sssViewDirection = normalize(vViewPosition);
        vec3 sssHalf = normalize(uSssDirection + normal * uSssDistortion);
        float sssTerm = pow(clamp(dot(sssViewDirection, -sssHalf), 0.0, 1.0), uSssPower) * uSssScale;
        float sssThin = mix(0.35, 1.0, clamp(vThickness, 0.0, 1.0));
        reflectedLight.directDiffuse += diffuseColor.rgb * uSssColor * (sssTerm + uSssAmbient) * sssThin * crevice;`)},n.customProgramCacheKey=()=>`soft-serve-sss-2`,{material:n,setLightDirection(e,n){r.copy(e).normalize(),t.uSssDirection.value.copy(r).transformDirection(n.matrixWorldInverse).normalize()},setTime(e){t.uTime.value=e},setWobble(e,n,r){t.uImpulse.value.set(e,n),t.uStackTop.value=Math.max(.35,r)},apply(e){n.color.set(e.color),n.roughness=e.roughness,n.sheen=e.sheen,t.uSssScale.value=e.translucency,t.uSssPower.value=e.translucencyPower,t.uSssAmbient.value=e.translucencyAmbient,t.uSssDistortion.value=e.distortion,t.uOcclusion.value=e.occlusion,t.uJiggle.value=e.jiggle},dispose(){n.dispose()}}}var Oe=new D(0,1,0),ke=new D(1,0,0),Ae=class{mesh;geometry=new f;position;normal;thickness;ringSegments;maxRings;ringCount=0;frameTangent=new D(0,1,0);scratchNormal=new D;scratchBinormal=new D;scratchOffset=new D;constructor(e){this.ringSegments=e.ringSegments,this.maxRings=e.maxRings;let t=this.ringSegments*this.maxRings;this.position=new _(new Float32Array(t*3),3).setUsage(S),this.normal=new _(new Float32Array(t*3),3).setUsage(S),this.thickness=new _(new Float32Array(t),1).setUsage(S),this.geometry.setAttribute(`position`,this.position),this.geometry.setAttribute(`normal`,this.normal),this.geometry.setAttribute(`aThickness`,this.thickness);let n=new Uint32Array(Math.max(0,this.maxRings-1)*this.ringSegments*6),r=0;for(let e=1;e<this.maxRings;e+=1){let t=(e-1)*this.ringSegments,i=e*this.ringSegments;for(let e=0;e<this.ringSegments;e+=1){let a=(e+1)%this.ringSegments;n[r]=t+e,n[r+1]=i+a,n[r+2]=i+e,n[r+3]=t+e,n[r+4]=t+a,n[r+5]=i+a,r+=6}}this.geometry.setIndex(new _(n,1)),this.geometry.setDrawRange(0,0),this.geometry.boundingSphere=new T(new D(0,1.5,0),6),this.mesh=new v(this.geometry,e.material),this.mesh.frustumCulled=!1,this.mesh.castShadow=!0,this.mesh.receiveShadow=!0}get rings(){return this.ringCount}get full(){return this.ringCount>=this.maxRings}clear(){this.ringCount=0,this.frameTangent.set(0,1,0),this.geometry.setDrawRange(0,0)}addRing(e,t,n,r){if(this.full)return;let i=this.ringCount;this.frameTangent.copy(t),this.frameTangent.lengthSq()<1e-8&&this.frameTangent.set(0,1,0),this.frameTangent.normalize();let a=Math.abs(this.frameTangent.y)<.9?Oe:ke;this.scratchNormal.crossVectors(a,this.frameTangent),this.scratchNormal.lengthSq()<1e-8&&this.scratchNormal.set(1,0,0),this.scratchNormal.normalize(),this.scratchBinormal.crossVectors(this.frameTangent,this.scratchNormal).normalize();let o=i*this.ringSegments;for(let t=0;t<this.ringSegments;t+=1){let i=t/this.ringSegments*Math.PI*2,a=Math.cos(i),s=Math.sin(i);this.scratchOffset.copy(this.scratchNormal).multiplyScalar(a).addScaledVector(this.scratchBinormal,s);let c=o+t;this.position.setXYZ(c,e.x+this.scratchOffset.x*n,e.y+this.scratchOffset.y*n,e.z+this.scratchOffset.z*n),this.normal.setXYZ(c,this.scratchOffset.x,this.scratchOffset.y,this.scratchOffset.z),this.thickness.setX(c,r)}this.ringCount=i+1,this.position.addUpdateRange(o*3,this.ringSegments*3),this.normal.addUpdateRange(o*3,this.ringSegments*3),this.thickness.addUpdateRange(o,this.ringSegments),this.position.needsUpdate=!0,this.normal.needsUpdate=!0,this.thickness.needsUpdate=!0,this.geometry.setDrawRange(0,Math.max(0,this.ringCount-1)*this.ringSegments*6)}removeLastRing(){this.ringCount!==0&&(--this.ringCount,this.geometry.setDrawRange(0,Math.max(0,this.ringCount-1)*this.ringSegments*6))}replaceLastRing(e,t,n,r){this.ringCount>0&&--this.ringCount,this.addRing(e,t,n,r)}dispose(){this.geometry.dispose()}},je=M,I={flowRate:.88,ropeRadius:.37,coilRadius:.54,coilTaper:.7,coilOverlap:.36,viscosity:.72,strandGravity:9.4,jiggle:.035,followStiffness:44,followDamping:9.5,flowAttack:.42,translucency:.95,targetHeight:2.15},L=1/60,Me=4.72,Ne=N-.16,Pe=2.85,Fe=.6,Ie=.82,Le=.55,Re=.5,ze=.5,Be=5,Ve=3.25,He=2.05;function R(e,t,n){return Math.min(n,Math.max(t,e))}function Ue(e){let t={...I,...e??{}};return{flowRate:R(Number(t.flowRate)||I.flowRate,.15,1.6),ropeRadius:R(Number(t.ropeRadius)||I.ropeRadius,.14,.7),coilRadius:R(Number(t.coilRadius)||I.coilRadius,.16,.86),coilTaper:R(Number(t.coilTaper),0,.95),coilOverlap:R(Number(t.coilOverlap),0,.85),viscosity:R(Number(t.viscosity),.15,1),strandGravity:R(Number(t.strandGravity)||I.strandGravity,1.5,24),jiggle:R(Number(t.jiggle),0,.14),followStiffness:R(Number(t.followStiffness)||I.followStiffness,6,120),followDamping:R(Number(t.followDamping)||I.followDamping,2,26),flowAttack:R(Number(t.flowAttack)||I.flowAttack,.05,1.6),translucency:R(Number(t.translucency),0,4),targetHeight:R(Number(t.targetHeight)||I.targetHeight,.9,2.7)}}var z=n=>{let r=structuredClone(n.config),a=r,o=Ue(r.gameplay),s=ue(),d=new te({canvas:n.canvas,antialias:s.antialias,powerPreference:`high-performance`});d.outputColorSpace=l,d.toneMapping=4,d.toneMappingExposure=.9,d.shadowMap.enabled=s.dynamicShadows,d.shadowMap.type=s.shadowMapType;let f=new u,p=Ee(a.colors.background);f.background=p;let m=Te(d,a.colors.background);f.environment=m.texture;let h=new c(a.universal.cameraFov,1,4,26),g=new D(0,2.7,0);h.position.set(0,a.universal.cameraHeight,12),h.lookAt(g);let _=new se(16772303,1721416,.26);f.add(_);let b=new ee(16773334,2.6);b.position.set(-4.4,7.8,5.4),b.castShadow=s.dynamicShadows,b.shadow.mapSize.set(s.shadowMapSize,s.shadowMapSize),b.shadow.camera.left=-4,b.shadow.camera.right=4,b.shadow.camera.top=8,b.shadow.camera.bottom=-2,b.shadow.bias=-.0016,b.shadow.radius=3,f.add(b);let S=new ee(10474458,.26);S.position.set(5.2,2.4,3.6),f.add(S);let re=new ee(16767406,.62);re.position.set(2.1,4.4,-6.2),f.add(re);let ie=`#f1dbb2`,C=De({color:ie,translucency:o.translucency,translucencyPower:3.1,translucencyAmbient:.03,distortion:.42,occlusion:.62,roughness:.62,sheen:.2,jiggle:o.jiggle}),ae=Ce(),w=new ce;w.add(ae.group),f.add(w);let T=new Ae({ringSegments:s.constrainedMobile?10:14,maxRings:s.constrainedMobile?560:900,material:C.material});w.add(T.mesh);let E=new Ae({ringSegments:s.constrainedMobile?10:16,maxRings:14,material:C.material});E.mesh.castShadow=!1,f.add(E.mesh);let oe=we(Me);f.add(oe.group);let de=new e({opacity:.22}),O=new v(new t(24,24),de);O.rotation.x=-Math.PI/2,O.position.y=-.02,O.receiveShadow=s.dynamicShadows,f.add(O);let fe=new ne(.11,12,10),pe=Array.from({length:18},()=>{let e=new v(fe,C.material);return e.visible=!1,f.add(e),{mesh:e,life:0,velocity:new D}}),k=s.constrainedMobile?null:new _e(d);if(k){k.addPass(new ye(f,h)),k.addPass(new be(new x(512,512),.16,.7,.92));let e=new me(xe);e.uniforms.offset.value=1.05,e.uniforms.darkness.value=1.18,k.addPass(e),k.addPass(new ve)}let he=new le(new D(0,1,0),0),ge=new i,A=new x,j=new D,M=`ready`,N=null,P=!1,F=0,Oe=0,ke=0,I=0,z=0,B=0,V=0,We=!1,Ge=!0,Ke=!1,H=0,U=0,qe=Re,W=0,G=0,K=null,Je=null,Ye=``,Xe=0,Ze=0,Qe=performance.now(),$e=!1,et=0,q=new D(0,0,0),J=new D,tt=new D(0,0,0),nt=new D,Y=new D,X=new D,Z=new D(0,1,0),rt=new D,it=new D,Q=new D,at=new D,ot=new D(0,Me,0),st=new D,ct=new D(0,-1,0),lt=new D,ut=(e,t,r)=>{n.services.report({type:e,at:n.services.now(),value:t,detail:r})},dt=()=>Math.hypot(H,U),$=()=>{M!==Je&&(Je=M,ut(`game_mode`,M))},ft=()=>{let e=`${M}:${I.toFixed(2)}:${V}:${B}:${dt().toFixed(2)}`;e!==Ye&&(Ye=e,n.services.report({type:`game_hud`,at:n.services.now(),detail:{remaining:Math.max(0,Number((o.targetHeight-I).toFixed(2))),stats:[{label:`height`,value:`${I.toFixed(2)}m`},{label:`target`,value:`${o.targetHeight.toFixed(2)}m`},{label:`coils`,value:B},{label:`balance`,value:`${Math.max(0,Math.round((1-dt()/Fe)*100))}%`},{label:`spill`,value:`${V}/${Be}`}]}}))},pt=()=>{T.clear(),E.clear(),I=0,z=0,B=0,V=0,We=!1,Ge=!0,Ke=!1,H=0,U=0,qe=Re,W=0,G=0,F=0,P=!1,K=null,Oe=0,et=0,N=null,q.set(0,0,0),tt.set(0,0,0),nt.set(0,0,0),J.set(0,0,0),w.position.set(0,0,0),w.rotation.set(0,0,0),X.set(0,Ne,0),Y.copy(X),pe.forEach(e=>{e.life=0,e.mesh.visible=!1})},mt=e=>{let t=pe.find(e=>e.life<=0);t&&(t.life=1.4,t.mesh.position.copy(e),t.mesh.visible=!0,t.velocity.set((Math.random()-.5)*.7,-.4,(Math.random()-.5)*.7))},ht=(e,t=null)=>{if(M===`won`||M===`lost`)return;M=e,N=t,P=!1;let r=Math.max(0,1-dt()/Fe);et=Math.round(e===`won`?I*420+r*260-V*40:I*180),ut(`round_end`,e,{cause:t,height:Number(I.toFixed(3)),spill:V,coils:B,score:et}),n.services.requestHaptic?.(e===`won`?`success`:`failure`)},gt=()=>{P&&(P=!1,ut(`flow_stopped`,Number(I.toFixed(3))))},_t=()=>{M!==`playing`||P||(P=!0,ut(`flow_started`),n.services.requestHaptic?.(`light`))},vt=(e,t)=>{let r=n.canvas.getBoundingClientRect();return r.width<=0||r.height<=0?!1:(A.set((e-r.left)/r.width*2-1,-((t-r.top)/r.height)*2+1),ge.setFromCamera(A,h),ge.ray.intersectPlane(he,j)!==null)},yt=(e,t)=>{vt(e,t)&&nt.set(j.x-q.x,0,j.z-q.z)},bt=(e,t)=>{vt(e,t)&&tt.set(R(j.x-nt.x,-.82,Ie),0,R(j.z-nt.z,-.55,Le))},xt=e=>{if(K===null){if(M===`won`||M===`lost`){pt(),M=`ready`,$();return}K=e.pointerId,n.canvas.setPointerCapture?.(e.pointerId),yt(e.clientX,e.clientY),_t(),e.preventDefault()}},St=e=>{K===e.pointerId&&bt(e.clientX,e.clientY)},Ct=e=>{K===e.pointerId&&(K=null,n.canvas.releasePointerCapture?.(e.pointerId),gt())},wt=e=>{if(!(e.code!==`Space`||e.repeat)){if(e.preventDefault(),M===`won`||M===`lost`){pt(),M=`ready`,$();return}_t()}},Tt=e=>{e.code===`Space`&&gt()},Et=e=>{let t=tt.x-q.x,n=tt.z-q.z;J.x+=t*o.followStiffness*e,J.z+=n*o.followStiffness*e;let r=Math.exp(-o.followDamping*e);J.x*=r,J.z*=r,q.x+=J.x*e,q.z+=J.z*e,w.position.set(q.x,0,q.z);let i=R(U*.34+J.z*.012,-.32,.32),a=R(-H*.34-J.x*.012,-.32,.32);w.rotation.x+=(i-w.rotation.x)*Math.min(1,e*7),w.rotation.z+=(a-w.rotation.z)*Math.min(1,e*7)},Dt=e=>{let t=P&&M===`playing`?1:0,r=t>F?o.flowAttack:o.flowAttack*1.35;if(F+=R(t-F,-e/r,e/r),F=R(F,0,1),F<=.05||T.full){We=!1,!Ge&&T.rings>0&&(Ge=!0,Ke&&=(T.removeLastRing(),!1),Z.subVectors(Y,X),Z.lengthSq()<1e-8&&Z.set(0,1,0),T.addRing(Y,Z,o.ropeRadius*.02,.2));return}Ge=!1;let i=o.ropeRadius*Math.max(.14,F**.55),a=o.flowRate*F,c=Math.min(9,a/(Math.PI*i*i)),l=R(I/Pe,0,1),u=1+(1-o.viscosity)*.55,d=Math.max(.03,o.coilRadius*u*(1-o.coilTaper*l)*F**1.15),f=Se-i*.82,p=R(I/.55,0,1),m=i*1.05,h=Math.max(m,Math.min(d,Math.max(.03,f+(d-f)*p))),g=c/Math.max(.09,h);z+=g*e,B=Math.floor(z/(Math.PI*2));let ee=2*i*(1-o.coilOverlap)*(.45+o.viscosity*.75);I+=g*e/(Math.PI*2)*ee,P||(I+=(1-F)*o.ropeRadius*1.4*e);let _=-q.x,v=-q.z,y=c*.18*e;W=R(W+R(_-W,-y,y),-.5,ze),G=R(G+R(v-G,-y,y),-.5,ze);let b=Math.hypot(_-W,v-G)>h+i*.5;Y.set(W+Math.cos(z)*h,Ne+I,G+Math.sin(z)*h),Q.copy(Y).add(w.position);let x=a*e;qe+=x,H+=(W-H)*x/Math.max(1e-4,qe),U+=(G-U)*x/Math.max(1e-4,qe),We=Math.hypot(Y.x,Y.z)>.94+i*.5&&I<.5||b,We&&Math.random()<e*6&&(mt(b?at.set(_,Ne+I,v).add(w.position):Q),V+=1,n.services.requestHaptic?.(`medium`),ut(`spill`,V),V>=Be&&ht(`lost`,`spilled`));let S=Math.max(.03,i*(s.constrainedMobile?.42:.3)),te=Y.distanceTo(X);if(Ke&&=(T.removeLastRing(),!1),T.rings===0)Z.set(-Math.sin(z),.12,Math.cos(z)).normalize(),rt.copy(Y).addScaledVector(Z,-i*.55),T.addRing(rt,Z,i*.08,1),rt.copy(Y).addScaledVector(Z,-i*.28),T.addRing(rt,Z,i*.72,1),T.addRing(Y,Z,i,1),X.copy(Y);else if(te>=S){let e=Math.min(8,Math.ceil(te/S));Z.subVectors(Y,X),Z.lengthSq()<1e-8&&Z.set(0,1,0);let t=rt.copy(X);for(let n=1;n<=e;n+=1)it.lerpVectors(t,Y,n/e),T.addRing(it,Z,i,R(1-l*.65,.2,1));X.copy(Y)}T.rings>0&&!T.full&&(it.copy(Y).addScaledVector(Z,i*.42),T.addRing(it,Z,i*.34,1),Ke=!0),I>Pe?ht(`lost`,`overflowed`):dt()>Fe&&ht(`lost`,`toppled`)},Ot=()=>{if(F<=.02){E.clear(),E.mesh.visible=!1;return}E.mesh.visible=!0,E.clear();let e=o.ropeRadius*(.34+.66*F)*.42,t=ot.y,n=Math.min(t-.05,Q.y-e*.6),r=Math.max(.05,t-n),i=Math.max(.4,o.flowRate*F/(Math.PI*e*e));for(let n=0;n<12;n+=1){let a=n/11,s=r*a,c=Math.sqrt(i*i+2*o.strandGravity*s),l=Math.max(.02,e*Math.sqrt(i/c));st.set(y.lerp(ot.x,Q.x,a*a),t-s,y.lerp(ot.z,Q.z,a*a)),ct.set((Q.x-ot.x)*.25,-1,(Q.z-ot.z)*.25),E.addRing(st,ct,l,1)}},kt=e=>{pe.forEach(t=>{t.life<=0||(t.life-=e,t.velocity.y-=o.strandGravity*e,t.mesh.position.addScaledVector(t.velocity,e),(t.life<=0||t.mesh.position.y<-.4)&&(t.life=0,t.mesh.visible=!1))})},At=()=>{M!==`paused`&&(Oe+=L,Et(L),M===`playing`?(Dt(L),!P&&F<=.02&&I>=o.targetHeight&&dt()<=Fe*.8&&ht(`won`)):F=Math.max(0,F-L/o.flowAttack),kt(L))},jt=e=>{ke+=e,Ot(),C.setTime(ke),C.setWobble(R(-J.x*.012,-.06,.06),R(-J.z*.012,-.06,.06),I+.4),lt.copy(b.position).normalize(),C.setLightDirection(lt,h),$(),ft()},Mt=()=>{d.domElement.width<=0||d.domElement.height<=0||(k?k.render():d.render(f,h))},Nt=()=>{if($e)return;Xe=requestAnimationFrame(Nt);let e=performance.now(),t=Math.min(.1,(e-Qe)/1e3);if(Qe=e,M!==`paused`){Ze+=t;let e=0;for(;Ze>=L&&e<6;)At(),Ze-=L,e+=1}jt(t),Mt()};n.canvas.style.touchAction=`none`,n.canvas.addEventListener(`pointerdown`,xt),n.canvas.addEventListener(`pointermove`,St),n.canvas.addEventListener(`pointerup`,Ct),n.canvas.addEventListener(`pointercancel`,Ct),addEventListener(`keydown`,wt),addEventListener(`keyup`,Tt);let Pt={start(){(M===`won`||M===`lost`)&&(pt(),M=`ready`),M===`ready`&&(M=`playing`,ut(`round_start`)),$(),ft()},pause(){M===`playing`&&(M=`paused`,P=!1,$())},resume(){M===`paused`&&(M=`playing`,Qe=performance.now(),$())},reset(){pt(),M=`ready`,Ye=``,$(),ft(),Mt()},resize(e,t,n){let r=Math.min(n,s.maxPixelRatio);d.setPixelRatio(r),d.setSize(e,t,!1),k?.setPixelRatio(r),k?.setSize(e,t);let i=e/Math.max(1,t);h.aspect=i,h.fov=a.universal.cameraFov;let o=y.degToRad(h.fov)/2,c=Ve/Math.tan(o),l=He/(Math.tan(o)*Math.max(.2,i)),u=a.universal.cameraDistance/11.6;h.position.set(0,a.universal.cameraHeight,Math.max(c,l)*u),h.lookAt(g),h.updateProjectionMatrix(),Mt()},dispose(){$e||($e=!0,cancelAnimationFrame(Xe),n.canvas.removeEventListener(`pointerdown`,xt),n.canvas.removeEventListener(`pointermove`,St),n.canvas.removeEventListener(`pointerup`,Ct),n.canvas.removeEventListener(`pointercancel`,Ct),removeEventListener(`keydown`,wt),removeEventListener(`keyup`,Tt),T.dispose(),E.dispose(),ae.dispose(),oe.dispose(),fe.dispose(),O.geometry.dispose(),de.dispose(),C.dispose(),m.dispose(),p.dispose(),k?.dispose(),d.dispose())},renderToText(){return JSON.stringify({surface:`mini-game`,game:je.id,version:je.version,versionState:je.versionState,versionBranch:je.versionBranch,mode:M,elapsed:Number(Oe.toFixed(2)),coordinateSystem:`The nozzle is fixed at world origin height 4.72. The cone slides on the X/Z floor plane and the swirl is stored in cone-local space.`,input:{pressed:P,flow:Number(F.toFixed(3)),pointerActive:K!==null},cone:{x:Number(q.x.toFixed(3)),z:Number(q.z.toFixed(3)),velocityX:Number(J.x.toFixed(3)),velocityZ:Number(J.z.toFixed(3)),tiltX:Number(w.rotation.x.toFixed(3)),tiltZ:Number(w.rotation.z.toFixed(3)),topRadius:Se},swirl:{height:Number(I.toFixed(3)),targetHeight:o.targetHeight,maxHeight:Pe,coils:B,rings:T.rings,ringBudget:T.full?`full`:`available`,centerOfMass:{x:Number(H.toFixed(3)),z:Number(U.toFixed(3)),offset:Number(dt().toFixed(3))},toppleLimit:Fe,spilling:We,spill:V,spillLimit:Be},result:{outcome:M===`won`||M===`lost`?M:null,cause:N,score:et},rules:{win:`Release with the swirl at or above the target height while the stack stays balanced.`,lose:`The run ends if the swirl overflows the maximum height, leans past the topple limit, or spills five times.`},tuning:o,controls:`Press and hold anywhere: the cone eases toward your finger and the machine dispenses. Release to stop and set the tip. Space works on desktop.`})},advanceTime(e){let t=Math.max(1,Math.round(e/(L*1e3)));for(let e=0;e<t;e+=1)At();jt(t*L),Mt()},getInspectableScene(){return{kind:`three`,value:f}},getTuningSchema(){return[{key:`flowRate`,label:`Flow rate`,type:`number`,value:o.flowRate,min:.15,max:1.6,step:.01},{key:`ropeRadius`,label:`Rope thickness`,type:`number`,value:o.ropeRadius,min:.14,max:.46,step:.01},{key:`coilRadius`,label:`Coil radius`,type:`number`,value:o.coilRadius,min:.16,max:.86,step:.01},{key:`viscosity`,label:`Viscosity`,type:`number`,value:o.viscosity,min:.15,max:1,step:.01},{key:`translucency`,label:`Translucency`,type:`number`,value:o.translucency,min:0,max:4,step:.05}]},setControl(e,t){(e===`action`||e===`jump`)&&(t?_t():gt())},applyConfig(e){let t=structuredClone(e);a=t,o=Ue(t.gameplay),p.dispose(),p=Ee(a.colors.background),f.background=p,C.apply({color:ie,translucency:o.translucency,translucencyPower:3.1,translucencyAmbient:.03,distortion:.42,occlusion:.62,roughness:.62,sheen:.2,jiggle:o.jiggle}),h.fov=a.universal.cameraFov,h.updateProjectionMatrix(),Mt()}};return pt(),Pt.resize(n.canvas.clientWidth||n.canvas.width||1,n.canvas.clientHeight||n.canvas.height||1,window.devicePixelRatio||1),jt(0),Xe=requestAnimationFrame(Nt),Pt};export{z as create,je as manifest};