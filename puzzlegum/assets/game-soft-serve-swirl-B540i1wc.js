import{A as e,C as t,D as n,F as r,G as i,H as a,J as o,K as s,L as c,M as l,N as u,O as d,P as f,R as p,T as m,U as h,V as ee,W as g,X as _,Y as te,Z as v,_ as y,a as b,b as x,c as S,d as C,g as ne,i as w,k as re,l as T,m as E,n as ie,q as D,r as O,s as k,t as ae,u as oe,v as se,w as ce,x as le,z as ue}from"./three.module-BoQXxuw1.js";import{a as de,i as fe,t as pe}from"./index-BxwWnovS.js";var A={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`},j=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},me=new n(-1,1,1,-1,0,1),he=new class extends w{constructor(){super(),this.setAttribute(`position`,new E([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new E([0,2,0,0,2,0],2))}},M=class{constructor(e){this._mesh=new t(he,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,me)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},ge=class extends j{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof p?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=i.clone(e.uniforms),this.material=new p({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new M(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},N=class extends j{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},_e=class extends j{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},ve=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new s);this._width=n.width,this._height=n.height,t=new o(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:y}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ge(A),this.copyPass.material.blending=0,this.timer=new h}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}N!==void 0&&(r instanceof N?n=!0:r instanceof _e&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new s);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},P={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`},ye=class extends j{constructor(){super(),this.isOutputPass=!0,this.uniforms=i.clone(P.uniforms),this.material=new l({name:P.name,uniforms:this.uniforms,vertexShader:P.vertexShader,fragmentShader:P.fragmentShader}),this._fsQuad=new M(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},S.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},be=class extends j{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new k}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},F={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new k(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`},xe=class e extends j{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new s(256,256):new s(e.x,e.y),this.clearColor=new k(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);this.renderTargetBright=new o(a,c,{type:y,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new o(a,c,{type:y,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new o(a,c,{type:y,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),a=Math.round(a/2),c=Math.round(c/2)}let l=F;this.highPassUniforms=i.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new p({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];let u=[6,10,14,18,22];a=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(u[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new s(1/a,1/c),a=Math.round(a/2),c=Math.round(c/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let d=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=d,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=i.clone(A.uniforms),this.blendMaterial=new p({uniforms:this.copyUniforms,vertexShader:A.vertexShader,fragmentShader:A.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new k,this._oldClearAlpha=1,this._basic=new ce,this._fsQuad=new M(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new s(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new p({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new s(.5,.5)},direction:{value:new s(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

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
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new p({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};xe.BlurDirectionX=new s(1,0),xe.BlurDirectionY=new s(0,1);var Se={name:`VignetteShader`,uniforms:{tDiffuse:{value:null},offset:{value:1},darkness:{value:1}},vertexShader:`

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

		}`},Ce={universal:{cameraFov:32,cameraHeight:3.6,cameraDistance:11.6,cameraShake:.4},colors:{background:`#79d4cf`,ground:`#50aaa8`,platform:`#f6d5e6`,platformEdge:`#15383b`,player:`#111111`,opponentA:`#f04c98`,opponentB:`#6757d8`,opponentC:`#ff8a3d`,warning:`#ffe36e`,danger:`#e83e70`},physics:{acceleration:14,botAcceleration:11.8,maxSpeed:5.5,drag:1.65,bounciness:.9},players:{aiCount:0},ai:{aggression:.2,hazardAwareness:.72,reactionTime:.42,unpredictability:.2,edgeCaution:.88},haptics:{enabled:!0,intensity:.7},sfx:{enabled:!0,masterVolume:.5},gameplay:{flowRate:.88,ropeRadius:.37,coilRadius:.54,coilTaper:.7,coilOverlap:.36,viscosity:.72,strandGravity:9.4,jiggle:.035,flowAttack:.42,followStiffness:44,followDamping:9.5,translucency:.95,targetHeight:2.15}},we=.94,Te=2.55;function Ee(){let e=document.createElement(`canvas`);e.width=512,e.height=512;let t=e.getContext(`2d`);if(!t)return null;t.fillStyle=`#ffd9ac`,t.fillRect(0,0,512,512),t.strokeStyle=`rgba(150, 84, 30, 0.42)`,t.lineWidth=9,t.lineCap=`round`;for(let e=-512;e<1024;e+=58)t.beginPath(),t.moveTo(e,0),t.lineTo(e+512,512),t.stroke(),t.beginPath(),t.moveTo(e+512,0),t.lineTo(e,512),t.stroke();let n=new b(e);return n.colorSpace=r,n.wrapS=f,n.wrapT=f,n.repeat.set(5,2.1),n.anisotropy=4,n}function De(){let e=new ne,n=Ee(),r=[];for(let e=0;e<=26;e+=1){let t=e/26,n=t*Te,i=.075+.865*t**.82;r.push(new s(i,n))}let i=new m({side:2,color:`#e69953`,map:n??void 0,roughness:.78,metalness:0,bumpMap:n??void 0,bumpScale:.05,sheen:.18,sheenRoughness:.85,sheenColor:new k(`#ffd9ab`),clearcoat:.05}),o=new t(new x(r,96),i);o.castShadow=!0,o.receiveShadow=!0,e.add(o);let c=new m({color:`#eda06a`,roughness:.66,metalness:0,sheen:.22,sheenColor:new k(`#ffd9ab`)}),l=new t(new g(.9199999999999999,.115,16,96),c);l.rotation.x=Math.PI/2,l.position.y=2.53,l.castShadow=!0,l.receiveShadow=!0,e.add(l);let u=c.clone(),d=new t(new g(we*.72,.085,14,80),u);d.rotation.x=Math.PI/2,d.position.y=Te*.72,d.castShadow=!0,e.add(d);let f=c.clone(),p=new t(new a(.19,24,16),f);p.scale.set(1,.66,1),p.position.y=.02,p.castShadow=!0,e.add(p);let h=[i,c,u,f];return{group:e,materials:h,setColor(e){let t=new k(e);i.color.copy(t);let n=t.clone().offsetHSL(-.012,.03,-.05);c.color.copy(n),u.color.copy(n),f.color.copy(n)},dispose(){o.geometry.dispose(),l.geometry.dispose(),d.geometry.dispose(),p.geometry.dispose(),h.forEach(e=>e.dispose()),n?.dispose()}}}function Oe(e){let n=new ne,r=new m({color:`#9fabb2`,roughness:.3,metalness:1,envMapIntensity:.9}),i=new t(new T(.36,.23,.72,40,1,!0),r);i.position.y=e+.36,n.add(i);let a=new t(new g(.23,.045,12,44),r);return a.rotation.x=Math.PI/2,a.position.y=e,n.add(a),n.traverse(e=>{e instanceof t&&(e.castShadow=!0)}),{group:n,dispose(){i.geometry.dispose(),a.geometry.dispose(),r.dispose()}}}function I(e,t,n){let r=document.createElement(`canvas`);r.width=256,r.height=256;let i=r.getContext(`2d`);if(!i)return r;let a=i.createLinearGradient(0,0,0,256);a.addColorStop(0,e),a.addColorStop(1,t),i.fillStyle=a,i.fillRect(0,0,256,256);let o=i.createRadialGradient(80,60,4,80,60,150);return o.addColorStop(0,n),o.addColorStop(1,`rgba(255,255,255,0)`),i.fillStyle=o,i.fillRect(0,0,256,256),r}function ke(e,t){let n=I(`#f6e6cf`,t,`rgba(255,246,229,0.8)`),i=new b(n);i.mapping=303,i.colorSpace=r;let a=new ae(e),o=a.fromEquirectangular(i);return a.dispose(),i.dispose(),o}function Ae(e){let t=document.createElement(`canvas`);t.width=512,t.height=512;let n=t.getContext(`2d`),i=new k(e);if(n){let e=i.clone().offsetHSL(0,.06,-.06),t=i.clone().offsetHSL(0,.02,-.24),r=n.createLinearGradient(0,0,0,512);r.addColorStop(0,`#${e.getHexString()}`),r.addColorStop(1,`#${t.getHexString()}`),n.fillStyle=r,n.fillRect(0,0,512,512);let a=n.createRadialGradient(256,210,12,256,210,300),o=i.clone().offsetHSL(0,.07,.04);a.addColorStop(0,`rgba(${Math.round(o.r*255)}, ${Math.round(o.g*255)}, ${Math.round(o.b*255)}, 0.95)`),a.addColorStop(1,`rgba(0,0,0,0)`),n.fillStyle=a,n.fillRect(0,0,512,512)}let a=new b(t);return a.colorSpace=r,a}function je(e){let t={uTime:{value:0},uJiggle:{value:e.jiggle},uImpulse:{value:new s},uStackTop:{value:1},uSssDirection:{value:new D(0,0,1)},uSssColor:{value:new k(`#ffc487`)},uSssScale:{value:e.translucency},uSssPower:{value:e.translucencyPower},uSssAmbient:{value:e.translucencyAmbient},uSssDistortion:{value:e.distortion},uOcclusion:{value:e.occlusion}},n=new m({color:new k(e.color),roughness:e.roughness,metalness:0,sheen:e.sheen,sheenRoughness:.62,sheenColor:new k(`#fff3e0`),clearcoat:.08,clearcoatRoughness:.5,envMapIntensity:.18,flatShading:!1}),r=new D(0,0,1);return n.onBeforeCompile=e=>{Object.assign(e.uniforms,t),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
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
        reflectedLight.directDiffuse += diffuseColor.rgb * uSssColor * (sssTerm + uSssAmbient) * sssThin * crevice;`)},n.customProgramCacheKey=()=>`soft-serve-sss-2`,{material:n,setLightDirection(e,n){r.copy(e).normalize(),t.uSssDirection.value.copy(r).transformDirection(n.matrixWorldInverse).normalize()},setTime(e){t.uTime.value=e},setWobble(e,n,r){t.uImpulse.value.set(e,n),t.uStackTop.value=Math.max(.35,r)},apply(e){n.color.set(e.color),n.roughness=e.roughness,n.sheen=e.sheen,t.uSssScale.value=e.translucency,t.uSssPower.value=e.translucencyPower,t.uSssAmbient.value=e.translucencyAmbient,t.uSssDistortion.value=e.distortion,t.uOcclusion.value=e.occlusion,t.uJiggle.value=e.jiggle},dispose(){n.dispose()}}}var L=new D(0,1,0),R=new D(1,0,0),Me=class{mesh;geometry=new w;position;normal;thickness;ringSegments;maxRings;ringCount=0;frameTangent=new D(0,1,0);scratchNormal=new D;scratchBinormal=new D;scratchOffset=new D;constructor(e){this.ringSegments=e.ringSegments,this.maxRings=e.maxRings;let n=this.ringSegments*this.maxRings;this.position=new O(new Float32Array(n*3),3).setUsage(C),this.normal=new O(new Float32Array(n*3),3).setUsage(C),this.thickness=new O(new Float32Array(n),1).setUsage(C),this.geometry.setAttribute(`position`,this.position),this.geometry.setAttribute(`normal`,this.normal),this.geometry.setAttribute(`aThickness`,this.thickness);let r=new Uint32Array(Math.max(0,this.maxRings-1)*this.ringSegments*6),i=0;for(let e=1;e<this.maxRings;e+=1){let t=(e-1)*this.ringSegments,n=e*this.ringSegments;for(let e=0;e<this.ringSegments;e+=1){let a=(e+1)%this.ringSegments;r[i]=t+e,r[i+1]=n+a,r[i+2]=n+e,r[i+3]=t+e,r[i+4]=t+a,r[i+5]=n+a,i+=6}}this.geometry.setIndex(new O(r,1)),this.geometry.setDrawRange(0,0),this.geometry.boundingSphere=new ee(new D(0,1.5,0),6),this.mesh=new t(this.geometry,e.material),this.mesh.frustumCulled=!1,this.mesh.castShadow=!0,this.mesh.receiveShadow=!0}get rings(){return this.ringCount}get full(){return this.ringCount>=this.maxRings}clear(){this.ringCount=0,this.frameTangent.set(0,1,0),this.geometry.setDrawRange(0,0)}addRing(e,t,n,r){if(this.full)return;let i=this.ringCount;this.frameTangent.copy(t),this.frameTangent.lengthSq()<1e-8&&this.frameTangent.set(0,1,0),this.frameTangent.normalize();let a=Math.abs(this.frameTangent.y)<.9?L:R;this.scratchNormal.crossVectors(a,this.frameTangent),this.scratchNormal.lengthSq()<1e-8&&this.scratchNormal.set(1,0,0),this.scratchNormal.normalize(),this.scratchBinormal.crossVectors(this.frameTangent,this.scratchNormal).normalize();let o=i*this.ringSegments;for(let t=0;t<this.ringSegments;t+=1){let i=t/this.ringSegments*Math.PI*2,a=Math.cos(i),s=Math.sin(i);this.scratchOffset.copy(this.scratchNormal).multiplyScalar(a).addScaledVector(this.scratchBinormal,s);let c=o+t;this.position.setXYZ(c,e.x+this.scratchOffset.x*n,e.y+this.scratchOffset.y*n,e.z+this.scratchOffset.z*n),this.normal.setXYZ(c,this.scratchOffset.x,this.scratchOffset.y,this.scratchOffset.z),this.thickness.setX(c,r)}this.ringCount=i+1,this.position.addUpdateRange(o*3,this.ringSegments*3),this.normal.addUpdateRange(o*3,this.ringSegments*3),this.thickness.addUpdateRange(o,this.ringSegments),this.position.needsUpdate=!0,this.normal.needsUpdate=!0,this.thickness.needsUpdate=!0,this.geometry.setDrawRange(0,Math.max(0,this.ringCount-1)*this.ringSegments*6)}removeLastRing(){this.ringCount!==0&&(--this.ringCount,this.geometry.setDrawRange(0,Math.max(0,this.ringCount-1)*this.ringSegments*6))}replaceLastRing(e,t,n,r){this.ringCount>0&&--this.ringCount,this.addRing(e,t,n,r)}dispose(){this.geometry.dispose()}},z={flowRate:.88,ropeRadius:.37,coilRadius:.54,coilTaper:.7,coilOverlap:.36,viscosity:.72,strandGravity:9.4,jiggle:.035,followStiffness:44,followDamping:9.5,flowAttack:.42,translucency:.95,targetHeight:2.15},B=1/60,Ne=4.72,Pe=Te-.16,Fe=2.85,Ie=.6,Le=.82,Re=.55,ze=.5,Be=.5,Ve=5,He=3.25,Ue=2.05;function V(e,t,n){return Math.min(n,Math.max(t,e))}function We(e){let t={...z,...e??{}};return{flowRate:V(Number(t.flowRate)||z.flowRate,.15,1.6),ropeRadius:V(Number(t.ropeRadius)||z.ropeRadius,.14,.7),coilRadius:V(Number(t.coilRadius)||z.coilRadius,.16,.86),coilTaper:V(Number(t.coilTaper),0,.95),coilOverlap:V(Number(t.coilOverlap),0,.85),viscosity:V(Number(t.viscosity),.15,1),strandGravity:V(Number(t.strandGravity)||z.strandGravity,1.5,24),jiggle:V(Number(t.jiggle),0,.14),followStiffness:V(Number(t.followStiffness)||z.followStiffness,6,120),followDamping:V(Number(t.followDamping)||z.followDamping,2,26),flowAttack:V(Number(t.flowAttack)||z.flowAttack,.05,1.6),translucency:V(Number(t.translucency),0,4),targetHeight:V(Number(t.targetHeight)||z.targetHeight,.9,2.7)}}function Ge(n){let i=structuredClone(Ce),o=i,l=We(i.gameplay),f=v(),p=new ie({canvas:n.canvas,antialias:f.antialias,powerPreference:`high-performance`});p.outputColorSpace=r,p.toneMapping=4,p.toneMappingExposure=.9,p.shadowMap.enabled=f.dynamicShadows,p.shadowMap.type=f.shadowQuality===`soft`?2:0;let m=new c,h=Ae(o.colors.background);m.background=h;let ee=ke(p,o.colors.background);m.environment=ee.texture;let g=new d(o.universal.cameraFov,1,4,26),_=new D(0,2.7,0);g.position.set(0,o.universal.cameraHeight,12),g.lookAt(_);let te=new se(16772303,1721416,.26);m.add(te);let y=new oe(16773334,2.6);y.position.set(-4.4,7.8,5.4),y.castShadow=f.dynamicShadows,y.shadow.mapSize.set(f.shadowMapSize,f.shadowMapSize),y.shadow.camera.left=-4,y.shadow.camera.right=4,y.shadow.camera.top=8,y.shadow.camera.bottom=-2,y.shadow.bias=-.0016,y.shadow.radius=3,m.add(y);let b=new oe(10474458,.26);b.position.set(5.2,2.4,3.6),m.add(b);let x=new oe(16767406,.62);x.position.set(2.1,4.4,-6.2),m.add(x);let S=`#f1dbb2`,C=je({color:S,translucency:l.translucency,translucencyPower:3.1,translucencyAmbient:.03,distortion:.42,occlusion:.62,roughness:.62,sheen:.2,jiggle:l.jiggle}),w=De(),T=new ne;T.add(w.group),m.add(T);let E=new Me({ringSegments:f.constrainedMobile?10:14,maxRings:f.constrainedMobile?560:900,material:C.material});T.add(E.mesh);let O=new Me({ringSegments:f.constrainedMobile?10:16,maxRings:14,material:C.material});O.mesh.castShadow=!1,m.add(O.mesh);let k=Oe(Ne);m.add(k.group);let ae=new ue({opacity:.22}),ce=new t(new e(24,24),ae);ce.rotation.x=-Math.PI/2,ce.position.y=-.02,ce.receiveShadow=f.dynamicShadows,m.add(ce);let de=new a(.11,12,10),fe=Array.from({length:18},()=>{let e=new t(de,C.material);return e.visible=!1,m.add(e),{mesh:e,life:0,velocity:new D}}),A=f.constrainedMobile?null:new ve(p);if(A){A.addPass(new be(m,g)),A.addPass(new xe(new s(512,512),.16,.7,.92));let e=new ge(Se);e.uniforms.offset.value=1.05,e.uniforms.darkness.value=1.18,A.addPass(e),A.addPass(new ye)}let j=new re(new D(0,1,0),0),me=new u,he=new s,M=new D,N=`ready`,_e=null,P=!1,F=0,Te=0,Ee=0,I=0,L=0,R=0,z=0,Ge=!1,Ke=!0,qe=!1,H=0,U=0,Je=ze,W=0,G=0,K=null,Ye=null,Xe=``,Ze=0,Qe=0,$e=performance.now(),et=!1,tt=0,q=new D(0,0,0),J=new D,nt=new D(0,0,0),rt=new D,Y=new D,X=new D,Z=new D(0,1,0),it=new D,at=new D,Q=new D,ot=new D,st=new D(0,Ne,0),ct=new D,lt=new D(0,-1,0),ut=new D,dt=(e,t,r)=>{n.services.report({type:e,at:n.services.now(),value:t,detail:r})},ft=()=>Math.hypot(H,U),$=()=>{N!==Ye&&(Ye=N,dt(`game_mode`,N))},pt=()=>{let e=`${N}:${I.toFixed(2)}:${z}:${R}:${ft().toFixed(2)}`;e!==Xe&&(Xe=e,n.services.report({type:`game_hud`,at:n.services.now(),detail:{remaining:Math.max(0,Number((l.targetHeight-I).toFixed(2))),stats:[{label:`height`,value:`${I.toFixed(2)}m`},{label:`target`,value:`${l.targetHeight.toFixed(2)}m`},{label:`coils`,value:R},{label:`balance`,value:`${Math.max(0,Math.round((1-ft()/Ie)*100))}%`},{label:`spill`,value:`${z}/${Ve}`}]}}))},mt=()=>{E.clear(),O.clear(),I=0,L=0,R=0,z=0,Ge=!1,Ke=!0,qe=!1,H=0,U=0,Je=ze,W=0,G=0,F=0,P=!1,K=null,Te=0,tt=0,_e=null,q.set(0,0,0),nt.set(0,0,0),rt.set(0,0,0),J.set(0,0,0),T.position.set(0,0,0),T.rotation.set(0,0,0),X.set(0,Pe,0),Y.copy(X),fe.forEach(e=>{e.life=0,e.mesh.visible=!1})},ht=e=>{let t=fe.find(e=>e.life<=0);t&&(t.life=1.4,t.mesh.position.copy(e),t.mesh.visible=!0,t.velocity.set((Math.random()-.5)*.7,-.4,(Math.random()-.5)*.7))},gt=(e,t=null)=>{if(N===`won`||N===`lost`)return;N=e,_e=t,P=!1;let r=Math.max(0,1-ft()/Ie);tt=Math.round(e===`won`?I*420+r*260-z*40:I*180),dt(`round_end`,e,{cause:t,height:Number(I.toFixed(3)),spill:z,coils:R,score:tt}),n.services.requestHaptic?.(e===`won`?`success`:`failure`)},_t=()=>{P&&(P=!1,dt(`flow_stopped`,Number(I.toFixed(3))))},vt=()=>{N!==`playing`||P||(P=!0,dt(`flow_started`),n.services.requestHaptic?.(`light`))},yt=(e,t)=>{let r=n.canvas.getBoundingClientRect();return r.width<=0||r.height<=0?!1:(he.set((e-r.left)/r.width*2-1,-((t-r.top)/r.height)*2+1),me.setFromCamera(he,g),me.ray.intersectPlane(j,M)!==null)},bt=(e,t)=>{yt(e,t)&&rt.set(M.x-q.x,0,M.z-q.z)},xt=(e,t)=>{yt(e,t)&&nt.set(V(M.x-rt.x,-.82,Le),0,V(M.z-rt.z,-.55,Re))},St=e=>{if(K===null){if(N===`won`||N===`lost`){mt(),N=`ready`,$();return}K=e.pointerId,n.canvas.setPointerCapture?.(e.pointerId),bt(e.clientX,e.clientY),vt(),e.preventDefault()}},Ct=e=>{K===e.pointerId&&xt(e.clientX,e.clientY)},wt=e=>{K===e.pointerId&&(K=null,n.canvas.releasePointerCapture?.(e.pointerId),_t())},Tt=e=>{if(!(e.code!==`Space`||e.repeat)){if(e.preventDefault(),N===`won`||N===`lost`){mt(),N=`ready`,$();return}vt()}},Et=e=>{e.code===`Space`&&_t()},Dt=e=>{let t=nt.x-q.x,n=nt.z-q.z;J.x+=t*l.followStiffness*e,J.z+=n*l.followStiffness*e;let r=Math.exp(-l.followDamping*e);J.x*=r,J.z*=r,q.x+=J.x*e,q.z+=J.z*e,T.position.set(q.x,0,q.z);let i=V(U*.34+J.z*.012,-.32,.32),a=V(-H*.34-J.x*.012,-.32,.32);T.rotation.x+=(i-T.rotation.x)*Math.min(1,e*7),T.rotation.z+=(a-T.rotation.z)*Math.min(1,e*7)},Ot=e=>{let t=P&&N===`playing`?1:0,r=t>F?l.flowAttack:l.flowAttack*1.35;if(F+=V(t-F,-e/r,e/r),F=V(F,0,1),F<=.05||E.full){Ge=!1,!Ke&&E.rings>0&&(Ke=!0,qe&&=(E.removeLastRing(),!1),Z.subVectors(Y,X),Z.lengthSq()<1e-8&&Z.set(0,1,0),E.addRing(Y,Z,l.ropeRadius*.02,.2));return}Ke=!1;let i=l.ropeRadius*Math.max(.14,F**.55),a=l.flowRate*F,o=Math.min(9,a/(Math.PI*i*i)),s=V(I/Fe,0,1),c=1+(1-l.viscosity)*.55,u=Math.max(.03,l.coilRadius*c*(1-l.coilTaper*s)*F**1.15),d=we-i*.82,p=V(I/.55,0,1),m=i*1.05,h=Math.max(m,Math.min(u,Math.max(.03,d+(u-d)*p))),ee=o/Math.max(.09,h);L+=ee*e,R=Math.floor(L/(Math.PI*2));let g=2*i*(1-l.coilOverlap)*(.45+l.viscosity*.75);I+=ee*e/(Math.PI*2)*g,P||(I+=(1-F)*l.ropeRadius*1.4*e);let _=-q.x,te=-q.z,v=o*.18*e;W=V(W+V(_-W,-v,v),-.5,Be),G=V(G+V(te-G,-v,v),-.5,Be);let y=Math.hypot(_-W,te-G)>h+i*.5;Y.set(W+Math.cos(L)*h,Pe+I,G+Math.sin(L)*h),Q.copy(Y).add(T.position);let b=a*e;Je+=b,H+=(W-H)*b/Math.max(1e-4,Je),U+=(G-U)*b/Math.max(1e-4,Je),Ge=Math.hypot(Y.x,Y.z)>.94+i*.5&&I<.5||y,Ge&&Math.random()<e*6&&(ht(y?ot.set(_,Pe+I,te).add(T.position):Q),z+=1,n.services.requestHaptic?.(`medium`),dt(`spill`,z),z>=Ve&&gt(`lost`,`spilled`));let x=Math.max(.03,i*(f.constrainedMobile?.42:.3)),S=Y.distanceTo(X);if(qe&&=(E.removeLastRing(),!1),E.rings===0)Z.set(-Math.sin(L),.12,Math.cos(L)).normalize(),it.copy(Y).addScaledVector(Z,-i*.55),E.addRing(it,Z,i*.08,1),it.copy(Y).addScaledVector(Z,-i*.28),E.addRing(it,Z,i*.72,1),E.addRing(Y,Z,i,1),X.copy(Y);else if(S>=x){let e=Math.min(8,Math.ceil(S/x));Z.subVectors(Y,X),Z.lengthSq()<1e-8&&Z.set(0,1,0);let t=it.copy(X);for(let n=1;n<=e;n+=1)at.lerpVectors(t,Y,n/e),E.addRing(at,Z,i,V(1-s*.65,.2,1));X.copy(Y)}E.rings>0&&!E.full&&(at.copy(Y).addScaledVector(Z,i*.42),E.addRing(at,Z,i*.34,1),qe=!0),I>Fe?gt(`lost`,`overflowed`):ft()>Ie&&gt(`lost`,`toppled`)},kt=()=>{if(F<=.02){O.clear(),O.mesh.visible=!1;return}O.mesh.visible=!0,O.clear();let e=l.ropeRadius*(.34+.66*F)*.42,t=st.y,n=Math.min(t-.05,Q.y-e*.6),r=Math.max(.05,t-n),i=Math.max(.4,l.flowRate*F/(Math.PI*e*e));for(let n=0;n<12;n+=1){let a=n/11,o=r*a,s=Math.sqrt(i*i+2*l.strandGravity*o),c=Math.max(.02,e*Math.sqrt(i/s));ct.set(le.lerp(st.x,Q.x,a*a),t-o,le.lerp(st.z,Q.z,a*a)),lt.set((Q.x-st.x)*.25,-1,(Q.z-st.z)*.25),O.addRing(ct,lt,c,1)}},At=e=>{fe.forEach(t=>{t.life<=0||(t.life-=e,t.velocity.y-=l.strandGravity*e,t.mesh.position.addScaledVector(t.velocity,e),(t.life<=0||t.mesh.position.y<-.4)&&(t.life=0,t.mesh.visible=!1))})},jt=()=>{N!==`paused`&&(Te+=B,Dt(B),N===`playing`?(Ot(B),!P&&F<=.02&&I>=l.targetHeight&&ft()<=Ie*.8&&gt(`won`)):F=Math.max(0,F-B/l.flowAttack),At(B))},Mt=e=>{Ee+=e,kt(),C.setTime(Ee),C.setWobble(V(-J.x*.012,-.06,.06),V(-J.z*.012,-.06,.06),I+.4),ut.copy(y.position).normalize(),C.setLightDirection(ut,g),$(),pt()},Nt=()=>{p.domElement.width<=0||p.domElement.height<=0||(A?A.render():p.render(m,g))},Pt=()=>{if(et)return;Ze=requestAnimationFrame(Pt);let e=performance.now(),t=Math.min(.1,(e-$e)/1e3);if($e=e,N!==`paused`){Qe+=t;let e=0;for(;Qe>=B&&e<6;)jt(),Qe-=B,e+=1}Mt(t),Nt()};n.canvas.style.touchAction=`none`,n.canvas.addEventListener(`pointerdown`,St),n.canvas.addEventListener(`pointermove`,Ct),n.canvas.addEventListener(`pointerup`,wt),n.canvas.addEventListener(`pointercancel`,wt),addEventListener(`keydown`,Tt),addEventListener(`keyup`,Et);let Ft={start(){(N===`won`||N===`lost`)&&(mt(),N=`ready`),N===`ready`&&(N=`playing`,dt(`round_start`)),$(),pt()},pause(){N===`playing`&&(N=`paused`,P=!1,$())},resume(){N===`paused`&&(N=`playing`,$e=performance.now(),$())},reset(){mt(),N=`ready`,Xe=``,$(),pt(),Nt()},resize(e,t,n){let r=Math.min(n,f.maxPixelRatio);p.setPixelRatio(r),p.setSize(e,t,!1),A?.setPixelRatio(r),A?.setSize(e,t);let i=e/Math.max(1,t);g.aspect=i,g.fov=o.universal.cameraFov;let a=le.degToRad(g.fov)/2,s=He/Math.tan(a),c=Ue/(Math.tan(a)*Math.max(.2,i)),l=o.universal.cameraDistance/11.6;g.position.set(0,o.universal.cameraHeight,Math.max(s,c)*l),g.lookAt(_),g.updateProjectionMatrix(),Nt()},dispose(){et||(et=!0,cancelAnimationFrame(Ze),n.canvas.removeEventListener(`pointerdown`,St),n.canvas.removeEventListener(`pointermove`,Ct),n.canvas.removeEventListener(`pointerup`,wt),n.canvas.removeEventListener(`pointercancel`,wt),removeEventListener(`keydown`,Tt),removeEventListener(`keyup`,Et),E.dispose(),O.dispose(),w.dispose(),k.dispose(),de.dispose(),ce.geometry.dispose(),ae.dispose(),C.dispose(),ee.dispose(),h.dispose(),A?.dispose(),p.dispose())},renderToText(){return JSON.stringify({surface:`mini-game`,game:pe.id,version:pe.version,mode:N,elapsed:Number(Te.toFixed(2)),coordinateSystem:`The nozzle is fixed at world origin height 4.72. The cone slides on the X/Z floor plane and the swirl is stored in cone-local space.`,input:{pressed:P,flow:Number(F.toFixed(3)),pointerActive:K!==null},cone:{x:Number(q.x.toFixed(3)),z:Number(q.z.toFixed(3)),velocityX:Number(J.x.toFixed(3)),velocityZ:Number(J.z.toFixed(3)),tiltX:Number(T.rotation.x.toFixed(3)),tiltZ:Number(T.rotation.z.toFixed(3)),topRadius:we},swirl:{height:Number(I.toFixed(3)),targetHeight:l.targetHeight,maxHeight:Fe,coils:R,rings:E.rings,ringBudget:E.full?`full`:`available`,centerOfMass:{x:Number(H.toFixed(3)),z:Number(U.toFixed(3)),offset:Number(ft().toFixed(3))},toppleLimit:Ie,spilling:Ge,spill:z,spillLimit:Ve},result:{outcome:N===`won`||N===`lost`?N:null,cause:_e,score:tt},rules:{win:`Release with the swirl at or above the target height while the stack stays balanced.`,lose:`The run ends if the swirl overflows the maximum height, leans past the topple limit, or spills five times.`},tuning:l,controls:`Press and hold anywhere: the cone eases toward your finger and the machine dispenses. Release to stop and set the tip. Space works on desktop.`})},advanceTime(e){let t=Math.max(1,Math.round(e/(B*1e3)));for(let e=0;e<t;e+=1)jt();Mt(t*B),Nt()},getInspectableScene(){return{kind:`three`,value:m}},getTuningSchema(){return[{key:`flowRate`,label:`Flow rate`,type:`number`,value:l.flowRate,min:.15,max:1.6,step:.01},{key:`ropeRadius`,label:`Rope thickness`,type:`number`,value:l.ropeRadius,min:.14,max:.46,step:.01},{key:`coilRadius`,label:`Coil radius`,type:`number`,value:l.coilRadius,min:.16,max:.86,step:.01},{key:`viscosity`,label:`Viscosity`,type:`number`,value:l.viscosity,min:.15,max:1,step:.01},{key:`translucency`,label:`Translucency`,type:`number`,value:l.translucency,min:0,max:4,step:.05}]},setControl(e,t){(e===`action`||e===`jump`)&&(t?vt():_t())},applyConfig(e){let t=structuredClone(e);o=t,l=We(t.gameplay),h.dispose(),h=Ae(o.colors.background),m.background=h,C.apply({color:S,translucency:l.translucency,translucencyPower:3.1,translucencyAmbient:.03,distortion:.42,occlusion:.62,roughness:.62,sheen:.2,jiggle:l.jiggle}),g.fov=o.universal.cameraFov,g.updateProjectionMatrix(),Nt()}};return mt(),Ft.resize(n.canvas.clientWidth||n.canvas.width||1,n.canvas.clientHeight||n.canvas.height||1,window.devicePixelRatio||1),Mt(0),Ze=requestAnimationFrame(Pt),Ft}var Ke=700,qe=`
.ss-ui { position: absolute; inset: 0; pointer-events: none; color: #15383b; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; --ss-ink: #15383b; --ss-primary: #e83e70; --ss-surface: rgba(255, 255, 255, 0.95); }
.ss-ui [hidden] { display: none !important; }
.ss-ui button { pointer-events: auto; font: inherit; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.ss-scrim { position: absolute; inset: 0; background: rgba(21, 56, 59, 0.32); }
.ss-topbar { position: absolute; top: max(10px, env(safe-area-inset-top)); left: 12px; right: 12px; display: grid; grid-template-columns: 44px 1fr 44px; align-items: center; gap: 8px; }
.ss-icon { width: 44px; height: 44px; border: 0; border-radius: 14px; background: rgba(21, 56, 59, 0.82); color: #fff; font-size: 18px; font-weight: 800; line-height: 1; display: grid; place-items: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18); }
.ss-hud { display: flex; justify-content: center; gap: 8px; }
.ss-hud div { min-width: 60px; padding: 6px 10px; border-radius: 12px; background: rgba(255, 255, 255, 0.92); text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); }
.ss-hud strong { display: block; font-size: 20px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums; }
.ss-hud span { display: block; margin-top: 3px; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: #5b6b78; }
.ss-card { position: absolute; left: 50%; bottom: max(24px, env(safe-area-inset-bottom)); transform: translateX(-50%); width: min(360px, calc(100% - 32px)); padding: 24px 22px; border-radius: 26px; background: var(--ss-surface); box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22); text-align: center; display: grid; gap: 12px; pointer-events: auto; animation: ss-fade 240ms ease-out; }
.ss-card h1, .ss-card h2 { margin: 0; font-size: clamp(28px, 7vw, 38px); line-height: 1; letter-spacing: -0.03em; font-weight: 800; }
.ss-card p { margin: 0; font-size: 15px; line-height: 1.45; color: #3b4b58; }
.ss-primary { min-height: 56px; border: 0; border-radius: 18px; background: var(--ss-primary); color: #fff; font-size: 18px; font-weight: 800; box-shadow: 0 8px 18px rgba(232, 62, 112, 0.35); }
.ss-primary:active { transform: translateY(1px); }
.ss-secondary { min-height: 48px; border: 2px solid rgba(21, 56, 59, 0.16); border-radius: 16px; background: transparent; color: inherit; font-size: 15px; font-weight: 700; }
.ss-link { border: 0; background: transparent; color: #5b6b78; font-size: 14px; font-weight: 600; text-decoration: underline; padding: 6px; }
.ss-toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ss-toggles button { min-height: 44px; border: 2px solid rgba(21, 56, 59, 0.16); border-radius: 14px; background: transparent; color: inherit; font-size: 14px; font-weight: 700; }
.ss-toggles button[aria-pressed="true"] { background: var(--ss-ink); border-color: var(--ss-ink); color: #fff; }
@keyframes ss-fade { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .ss-card { animation: none; } }
`,H=`
<div class="ss-scrim" data-el="scrim"></div>
<div class="ss-topbar" data-el="topbar">
  <button type="button" class="ss-icon" data-action="pause" aria-label="Pause">II</button>
  <div class="ss-hud" aria-live="off">
    <div><strong data-hud="height">0.00m</strong><span>height</span></div>
    <div><strong data-hud="coils">0</strong><span>coils</span></div>
    <div><strong data-hud="balance">100%</strong><span>balance</span></div>
  </div>
  <button type="button" class="ss-icon" data-action="exit" aria-label="Leave game">×</button>
</div>
<div class="ss-card" data-el="ready">
  <h1>Soft Serve Swirl</h1>
  <p data-el="instruction"></p>
  <button type="button" class="ss-primary" data-action="start">Play</button>
  <button type="button" class="ss-link" data-action="exit">All games</button>
</div>
<div class="ss-card" data-el="paused">
  <h2>Paused</h2>
  <button type="button" class="ss-primary" data-action="resume">Resume</button>
  <div class="ss-toggles">
    <button type="button" data-action="toggle-sound" aria-pressed="true">Sound</button>
    <button type="button" data-action="toggle-haptics" aria-pressed="true">Vibration</button>
  </div>
  <button type="button" class="ss-secondary" data-action="restart">Restart</button>
  <button type="button" class="ss-link" data-action="exit">All games</button>
</div>
<div class="ss-card" data-el="result">
  <h2 data-el="result-title">You win</h2>
  <p data-el="result-stats"></p>
  <button type="button" class="ss-primary" data-action="start">Play again</button>
  <button type="button" class="ss-link" data-action="exit">All games</button>
</div>
`;function U({host:e,manifest:t,onExit:n,onTap:r}){let i=null,a=`ready`,o=!1,s=0,c=document.createElement(`style`);c.textContent=qe;let l=document.createElement(`div`);l.className=`ss-ui`,l.innerHTML=H,e.append(c,l);let u=e=>l.querySelector(`[data-el="${e}"]`),d=u(`scrim`),f=u(`topbar`),p=u(`ready`),m=u(`paused`),h=u(`result`),ee=u(`result-title`),g=u(`result-stats`),_={height:l.querySelector(`[data-hud="height"]`),coils:l.querySelector(`[data-hud="coils"]`),balance:l.querySelector(`[data-hud="balance"]`)},v=l.querySelector(`[data-action="toggle-sound"]`),y=l.querySelector(`[data-action="toggle-haptics"]`);u(`instruction`).textContent=te()?t.controls.touch:t.controls.keyboard;let b=()=>{let e=fe();v.setAttribute(`aria-pressed`,String(e.sound)),y.setAttribute(`aria-pressed`,String(e.haptics))},x=()=>{let e=(a===`won`||a===`lost`)&&o;f.hidden=a!==`playing`&&a!==`paused`,d.hidden=!(a===`ready`||a===`paused`||e),p.hidden=a!==`ready`,m.hidden=a!==`paused`,h.hidden=!e},S=e=>{a=e,window.clearTimeout(s),o=!1,(e===`won`||e===`lost`)&&(s=window.setTimeout(()=>{o=!0,x()},Ke)),x()},C=e=>{switch(r?.(),e){case`start`:i?.start();break;case`pause`:i?.pause();break;case`resume`:i?.resume();break;case`restart`:i?.restart();break;case`exit`:n();break;case`toggle-sound`:de({sound:!fe().sound}),b();break;case`toggle-haptics`:de({haptics:!fe().haptics}),b()}},ne=e=>{let t=e.target?.closest(`button[data-action]`);t&&(e.preventDefault(),C(t.dataset.action))},w=e=>{e.repeat||((e.code===`Enter`||e.code===`Space`)&&(a===`ready`||(a===`won`||a===`lost`)&&o)&&(e.preventDefault(),C(`start`)),e.code===`Escape`&&(a===`playing`?C(`pause`):a===`paused`&&C(`resume`)))};return l.addEventListener(`click`,ne),window.addEventListener(`keydown`,w),b(),x(),{bind(e){i=e},handle(e){if(e.type===`game_mode`&&typeof e.value==`string`){S(e.value);return}if(e.type===`game_hud`&&e.detail){let t=e.detail;for(let e of t.stats??[])e.label===`height`&&(_.height.textContent=String(e.value)),e.label===`coils`&&(_.coils.textContent=String(e.value)),e.label===`balance`&&(_.balance.textContent=String(e.value));return}if(e.type===`round_end`){let t=e.detail??{},n=e.value===`won`,r=(t.height??0).toFixed(2);ee.textContent=n?`Perfect serve`:t.cause===`spill`?`Too much spill`:`It toppled`,g.textContent=`Score ${(t.score??0).toLocaleString()} · ${r}m tall · ${t.coils??0} coils`}},dispose(){window.clearTimeout(s),l.removeEventListener(`click`,ne),window.removeEventListener(`keydown`,w),l.remove(),c.remove()}}}var Je={"ui-click":new URL(`/puzzlegum/assets/ui-click-Z6DkeGCe.wav`,``+import.meta.url).href,"ui-soft":new URL(`/puzzlegum/assets/ui-soft-Cor9FFw8.wav`,``+import.meta.url).href,"round-start":new URL(`/puzzlegum/assets/round-start-CpqBIxl_.wav`,``+import.meta.url).href,"slice-drop":new URL(`/puzzlegum/assets/slice-drop-ZGVuYF_5.wav`,``+import.meta.url).href,"round-win":new URL(`/puzzlegum/assets/round-win-Dc2pUrHZ.wav`,``+import.meta.url).href,"round-lose":new URL(`/puzzlegum/assets/round-lose-CTbE-OA1.wav`,``+import.meta.url).href};function W(){let e=_(Je,{volume:.6}),t=null;return{ui(){e.play(`ui-click`,.7)},handle(n){switch(n.type){case`game_mode`:n.value===`playing`&&t!==`paused`&&e.play(`round-start`,.6),t=typeof n.value==`string`?n.value:null;break;case`flow_started`:e.play(`ui-soft`,.5);break;case`spill`:e.play(`slice-drop`,.6);break;case`round_end`:e.play(n.value===`won`?`round-win`:`round-lose`)}},dispose(){e.dispose()}}}var G=e=>{let t=W(),n=U({host:e.host,manifest:pe,onExit:()=>e.services.exit(),onTap:()=>t.ui()}),r=Ge({host:e.host,canvas:e.canvas,services:{now:()=>e.services.now(),requestHaptic:t=>e.services.requestHaptic(t),exit:()=>e.services.exit(),report(r){n.handle(r),t.handle(r),e.services.report(r)}}});return n.bind({start:()=>r.start(),pause:()=>r.pause(),resume:()=>r.resume(),restart:()=>{r.reset(),r.start()}}),{start:()=>r.start(),pause:()=>r.pause(),resume:()=>r.resume(),reset:()=>r.reset(),resize:(e,t,n)=>r.resize(e,t,n),renderToText:()=>r.renderToText?.()??`{}`,advanceTime:e=>r.advanceTime?.(e),dispose(){r.dispose(),n.dispose(),t.dispose()}}};export{G as create,pe as manifest};