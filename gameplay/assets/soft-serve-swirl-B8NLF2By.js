import{A as e,D as t,F as n,G as r,H as i,I as a,J as o,L as s,N as c,O as l,Q as ee,S as u,U as d,V as f,Y as p,Z as m,a as h,at as g,b as te,d as ne,f as _,g as v,i as y,it as b,j as re,k as x,l as S,m as ie,n as ae,nt as oe,o as C,ot as w,q as se,rt as T,st as E,t as D,u as O,v as ce,y as le}from"./three.module-C7NdOkzQ.js";import{t as ue}from"./renderProfile-aO4uU0Jx.js";var k={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`},A=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},de=new c(-1,1,1,-1,0,1),fe=new class extends h{constructor(){super(),this.setAttribute(`position`,new v([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new v([0,2,0,0,2,0],2))}},pe=class{constructor(e){this._mesh=new l(fe,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,de)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},me=class extends A{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof o?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=b.clone(e.uniforms),this.material=new o({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new pe(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},j=class extends A{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},he=class extends A{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},ge=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new g);this._width=n.width,this._height=n.height,t=new E(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:le}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new me(k),this.copyPass.material.blending=0,this.timer=new oe}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}j!==void 0&&(r instanceof j?n=!0:r instanceof he&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new g);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},M={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`},_e=class extends A{constructor(){super(),this.isOutputPass=!0,this.uniforms=b.clone(M.uniforms),this.material=new f({name:M.name,uniforms:this.uniforms,vertexShader:M.vertexShader,fragmentShader:M.fragmentShader}),this._fsQuad=new pe(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},O.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},ve=class extends A{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new S}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},ye={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new S(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`},be=class e extends A{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new g(256,256):new g(e.x,e.y),this.clearColor=new S(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new E(i,a,{type:le}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new E(i,a,{type:le});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new E(i,a,{type:le});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let s=ye;this.highPassUniforms=b.clone(s.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new o({uniforms:this.highPassUniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),this.separableBlurMaterials=[];let c=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new g(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=b.clone(k.uniforms),this.blendMaterial=new o({uniforms:this.copyUniforms,vertexShader:k.vertexShader,fragmentShader:k.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new S,this._oldClearAlpha=1,this._basic=new x,this._fsQuad=new pe(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new g(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new o({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new g(.5,.5)},direction:{value:new g(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new o({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};be.BlurDirectionX=new g(1,0),be.BlurDirectionY=new g(0,1);var xe={name:`VignetteShader`,uniforms:{tDiffuse:{value:null},offset:{value:1},darkness:{value:1}},vertexShader:`

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

		}`},Se={id:`soft-serve-swirl`,name:`Soft Serve Swirl`,briefId:`soft-serve-swirl`,status:`graybox`,version:`0.1.0`,versionSequence:1,versionState:`working`,versionBranch:`main`,parentVersion:null,entry:`src/games/soft-serve-swirl/index.ts`,thumbnail:`/assets/games/soft-serve-swirl/thumbnail.png`,presentation:{dimensions:`3D`,camera:`fixed portrait product view with a soft studio backdrop`,orientation:`responsive`},players:{count:`1`,relationship:`single-player craft toy`},controls:[`press and hold anywhere to dispense while the cone eases toward the finger`,`release to stop the flow and set the curled tip`,`Space holds the flow on desktop`,`P pauses`,`R resets`,`F toggles fullscreen`],roundDuration:`approximately fifteen to forty seconds`,capabilities:[`three`,`audio`,`haptics`,`touch`,`keyboard`]},Ce=.94,N=2.55;function P(){let e=document.createElement(`canvas`);e.width=512,e.height=512;let t=e.getContext(`2d`);if(!t)return null;t.fillStyle=`#ffd9ac`,t.fillRect(0,0,512,512),t.strokeStyle=`rgba(150, 84, 30, 0.42)`,t.lineWidth=9,t.lineCap=`round`;for(let e=-512;e<1024;e+=58)t.beginPath(),t.moveTo(e,0),t.lineTo(e+512,512),t.stroke(),t.beginPath(),t.moveTo(e+512,0),t.lineTo(e,512),t.stroke();let n=new C(e);return n.colorSpace=r,n.wrapS=d,n.wrapT=d,n.repeat.set(5,2.1),n.anisotropy=4,n}function we(){let t=new ce,n=P(),r=[];for(let e=0;e<=26;e+=1){let t=e/26,n=t*N,i=.075+.865*t**.82;r.push(new g(i,n))}let i=new e({side:2,color:`#e69953`,map:n??void 0,roughness:.78,metalness:0,bumpMap:n??void 0,bumpScale:.05,sheen:.18,sheenRoughness:.85,sheenColor:new S(`#ffd9ab`),clearcoat:.05}),a=new l(new u(r,96),i);a.castShadow=!0,a.receiveShadow=!0,t.add(a);let o=new e({color:`#eda06a`,roughness:.66,metalness:0,sheen:.22,sheenColor:new S(`#ffd9ab`)}),s=new l(new T(.9199999999999999,.115,16,96),o);s.rotation.x=Math.PI/2,s.position.y=2.53,s.castShadow=!0,s.receiveShadow=!0,t.add(s);let c=o.clone(),d=new l(new T(Ce*.72,.085,14,80),c);d.rotation.x=Math.PI/2,d.position.y=N*.72,d.castShadow=!0,t.add(d);let f=o.clone(),p=new l(new ee(.19,24,16),f);p.scale.set(1,.66,1),p.position.y=.02,p.castShadow=!0,t.add(p);let m=[i,o,c,f];return{group:t,materials:m,setColor(e){let t=new S(e);i.color.copy(t);let n=t.clone().offsetHSL(-.012,.03,-.05);o.color.copy(n),c.color.copy(n),f.color.copy(n)},dispose(){a.geometry.dispose(),s.geometry.dispose(),d.geometry.dispose(),p.geometry.dispose(),m.forEach(e=>e.dispose()),n?.dispose()}}}function Te(t){let n=new ce,r=new e({color:`#9fabb2`,roughness:.3,metalness:1,envMapIntensity:.9}),i=new l(new ne(.36,.23,.72,40,1,!0),r);i.position.y=t+.36,n.add(i);let a=new l(new T(.23,.045,12,44),r);return a.rotation.x=Math.PI/2,a.position.y=t,n.add(a),n.traverse(e=>{e instanceof l&&(e.castShadow=!0)}),{group:n,dispose(){i.geometry.dispose(),a.geometry.dispose(),r.dispose()}}}function Ee(e,t,n){let r=document.createElement(`canvas`);r.width=256,r.height=256;let i=r.getContext(`2d`);if(!i)return r;let a=i.createLinearGradient(0,0,0,256);a.addColorStop(0,e),a.addColorStop(1,t),i.fillStyle=a,i.fillRect(0,0,256,256);let o=i.createRadialGradient(80,60,4,80,60,150);return o.addColorStop(0,n),o.addColorStop(1,`rgba(255,255,255,0)`),i.fillStyle=o,i.fillRect(0,0,256,256),r}function De(e,t){let n=Ee(`#f6e6cf`,t,`rgba(255,246,229,0.8)`),i=new C(n);i.mapping=303,i.colorSpace=r;let a=new D(e),o=a.fromEquirectangular(i);return a.dispose(),i.dispose(),o}function Oe(e){let t=document.createElement(`canvas`);t.width=512,t.height=512;let n=t.getContext(`2d`),i=new S(e);if(n){let e=i.clone().offsetHSL(0,.06,-.06),t=i.clone().offsetHSL(0,.02,-.24),r=n.createLinearGradient(0,0,0,512);r.addColorStop(0,`#${e.getHexString()}`),r.addColorStop(1,`#${t.getHexString()}`),n.fillStyle=r,n.fillRect(0,0,512,512);let a=n.createRadialGradient(256,210,12,256,210,300),o=i.clone().offsetHSL(0,.07,.04);a.addColorStop(0,`rgba(${Math.round(o.r*255)}, ${Math.round(o.g*255)}, ${Math.round(o.b*255)}, 0.95)`),a.addColorStop(1,`rgba(0,0,0,0)`),n.fillStyle=a,n.fillRect(0,0,512,512)}let a=new C(t);return a.colorSpace=r,a}function ke(t){let n={uTime:{value:0},uJiggle:{value:t.jiggle},uImpulse:{value:new g},uStackTop:{value:1},uSssDirection:{value:new w(0,0,1)},uSssColor:{value:new S(`#ffc487`)},uSssScale:{value:t.translucency},uSssPower:{value:t.translucencyPower},uSssAmbient:{value:t.translucencyAmbient},uSssDistortion:{value:t.distortion},uOcclusion:{value:t.occlusion}},r=new e({color:new S(t.color),roughness:t.roughness,metalness:0,sheen:t.sheen,sheenRoughness:.62,sheenColor:new S(`#fff3e0`),clearcoat:.08,clearcoatRoughness:.5,envMapIntensity:.18,flatShading:!1}),i=new w(0,0,1);return r.onBeforeCompile=e=>{Object.assign(e.uniforms,n),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
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
        reflectedLight.directDiffuse += diffuseColor.rgb * uSssColor * (sssTerm + uSssAmbient) * sssThin * crevice;`)},r.customProgramCacheKey=()=>`soft-serve-sss-2`,{material:r,setLightDirection(e,t){i.copy(e).normalize(),n.uSssDirection.value.copy(i).transformDirection(t.matrixWorldInverse).normalize()},setTime(e){n.uTime.value=e},setWobble(e,t,r){n.uImpulse.value.set(e,t),n.uStackTop.value=Math.max(.35,r)},apply(e){r.color.set(e.color),r.roughness=e.roughness,r.sheen=e.sheen,n.uSssScale.value=e.translucency,n.uSssPower.value=e.translucencyPower,n.uSssAmbient.value=e.translucencyAmbient,n.uSssDistortion.value=e.distortion,n.uOcclusion.value=e.occlusion,n.uJiggle.value=e.jiggle},dispose(){r.dispose()}}}var Ae=new w(0,1,0),je=new w(1,0,0),Me=class{mesh;geometry=new h;position;normal;thickness;ringSegments;maxRings;ringCount=0;frameTangent=new w(0,1,0);scratchNormal=new w;scratchBinormal=new w;scratchOffset=new w;constructor(e){this.ringSegments=e.ringSegments,this.maxRings=e.maxRings;let t=this.ringSegments*this.maxRings;this.position=new y(new Float32Array(t*3),3).setUsage(ie),this.normal=new y(new Float32Array(t*3),3).setUsage(ie),this.thickness=new y(new Float32Array(t),1).setUsage(ie),this.geometry.setAttribute(`position`,this.position),this.geometry.setAttribute(`normal`,this.normal),this.geometry.setAttribute(`aThickness`,this.thickness);let n=new Uint32Array(Math.max(0,this.maxRings-1)*this.ringSegments*6),r=0;for(let e=1;e<this.maxRings;e+=1){let t=(e-1)*this.ringSegments,i=e*this.ringSegments;for(let e=0;e<this.ringSegments;e+=1){let a=(e+1)%this.ringSegments;n[r]=t+e,n[r+1]=i+e,n[r+2]=i+a,n[r+3]=t+e,n[r+4]=i+a,n[r+5]=t+a,r+=6}}this.geometry.setIndex(new y(n,1)),this.geometry.setDrawRange(0,0),this.geometry.boundingSphere=new m(new w(0,1.5,0),6),this.mesh=new l(this.geometry,e.material),this.mesh.frustumCulled=!1,this.mesh.castShadow=!0,this.mesh.receiveShadow=!0}get rings(){return this.ringCount}get full(){return this.ringCount>=this.maxRings}clear(){this.ringCount=0,this.frameTangent.set(0,1,0),this.geometry.setDrawRange(0,0)}addRing(e,t,n,r){if(this.full)return;let i=this.ringCount;this.frameTangent.copy(t),this.frameTangent.lengthSq()<1e-8&&this.frameTangent.set(0,1,0),this.frameTangent.normalize();let a=Math.abs(this.frameTangent.y)<.9?Ae:je;this.scratchNormal.crossVectors(a,this.frameTangent),this.scratchNormal.lengthSq()<1e-8&&this.scratchNormal.set(1,0,0),this.scratchNormal.normalize(),this.scratchBinormal.crossVectors(this.frameTangent,this.scratchNormal).normalize();let o=i*this.ringSegments;for(let t=0;t<this.ringSegments;t+=1){let i=t/this.ringSegments*Math.PI*2,a=Math.cos(i),s=Math.sin(i);this.scratchOffset.copy(this.scratchNormal).multiplyScalar(a).addScaledVector(this.scratchBinormal,s);let c=o+t;this.position.setXYZ(c,e.x+this.scratchOffset.x*n,e.y+this.scratchOffset.y*n,e.z+this.scratchOffset.z*n),this.normal.setXYZ(c,this.scratchOffset.x,this.scratchOffset.y,this.scratchOffset.z),this.thickness.setX(c,r)}this.ringCount=i+1,this.position.addUpdateRange(o*3,this.ringSegments*3),this.normal.addUpdateRange(o*3,this.ringSegments*3),this.thickness.addUpdateRange(o,this.ringSegments),this.position.needsUpdate=!0,this.normal.needsUpdate=!0,this.thickness.needsUpdate=!0,this.geometry.setDrawRange(0,Math.max(0,this.ringCount-1)*this.ringSegments*6)}removeLastRing(){this.ringCount!==0&&(--this.ringCount,this.geometry.setDrawRange(0,Math.max(0,this.ringCount-1)*this.ringSegments*6))}replaceLastRing(e,t,n,r){this.ringCount>0&&--this.ringCount,this.addRing(e,t,n,r)}dispose(){this.geometry.dispose()}},Ne=Se,F={flowRate:.88,ropeRadius:.37,coilRadius:.54,coilTaper:.7,coilOverlap:.52,viscosity:.72,strandGravity:9.4,jiggle:.035,followStiffness:44,followDamping:9.5,flowAttack:.42,translucency:.95,targetHeight:2.15},I=1/60,Pe=4.72,Fe=N-.16,Ie=2.85,Le=.6,Re=.82,ze=.55,Be=.5,Ve=.07,He=.5,Ue=5,We=3.25,Ge=2.05;function L(e,t,n){return Math.min(n,Math.max(t,e))}function Ke(e){let t={...F,...e??{}};return{flowRate:L(Number(t.flowRate)||F.flowRate,.15,1.6),ropeRadius:L(Number(t.ropeRadius)||F.ropeRadius,.14,.7),coilRadius:L(Number(t.coilRadius)||F.coilRadius,.16,.86),coilTaper:L(Number(t.coilTaper),0,.95),coilOverlap:L(Number(t.coilOverlap),0,.85),viscosity:L(Number(t.viscosity),.15,1),strandGravity:L(Number(t.strandGravity)||F.strandGravity,1.5,24),jiggle:L(Number(t.jiggle),0,.14),followStiffness:L(Number(t.followStiffness)||F.followStiffness,6,120),followDamping:L(Number(t.followDamping)||F.followDamping,2,26),flowAttack:L(Number(t.flowAttack)||F.flowAttack,.05,1.6),translucency:L(Number(t.translucency),0,4),targetHeight:L(Number(t.targetHeight)||F.targetHeight,.9,2.7)}}var R=e=>{let o=structuredClone(e.config),c=o,u=Ke(o.gameplay),d=ue(),f=new ae({canvas:e.canvas,antialias:d.antialias,powerPreference:`high-performance`});f.outputColorSpace=r,f.toneMapping=4,f.toneMappingExposure=.9,f.shadowMap.enabled=d.dynamicShadows,f.shadowMap.type=d.shadowMapType;let m=new se,h=Oe(c.colors.background);m.background=h;let ne=De(f,c.colors.background);m.environment=ne.texture;let v=new n(c.universal.cameraFov,1,4,26),y=new w(0,2.7,0);v.position.set(0,c.universal.cameraHeight,12),v.lookAt(y);let b=new te(16772303,1721416,.26);m.add(b);let x=new _(16773334,2.6);x.position.set(-4.4,7.8,5.4),x.castShadow=d.dynamicShadows,x.shadow.mapSize.set(d.shadowMapSize,d.shadowMapSize),x.shadow.camera.left=-4,x.shadow.camera.right=4,x.shadow.camera.top=8,x.shadow.camera.bottom=-2,x.shadow.bias=-.0016,x.shadow.radius=3,m.add(x);let ie=new _(10474458,.26);ie.position.set(5.2,2.4,3.6),m.add(ie);let oe=new _(16767406,.62);oe.position.set(2.1,4.4,-6.2),m.add(oe);let C=`#f1dbb2`,T=ke({color:C,translucency:u.translucency,translucencyPower:3.1,translucencyAmbient:.03,distortion:.42,occlusion:.62,roughness:.62,sheen:.2,jiggle:u.jiggle}),E=we(),D=new ce;D.add(E.group),m.add(D);let O=new Me({ringSegments:d.constrainedMobile?10:14,maxRings:d.constrainedMobile?560:900,material:T.material});D.add(O.mesh);let le=new re({color:new S(C).multiplyScalar(.8),roughness:.9,metalness:0,envMapIntensity:.15}),k=new Me({ringSegments:d.constrainedMobile?10:14,maxRings:64,material:le});k.mesh.castShadow=!1,k.mesh.receiveShadow=!1,k.mesh.renderOrder=1,D.add(k.mesh);let A=[],de=new w,fe=new w(0,1,0),pe=(e,t)=>{let n=A[e],r=A[Math.max(0,e-1)];fe.set(n.x-r.x,Math.max(.01,n.y-r.y),n.z-r.z),de.set(n.x,n.y,n.z),t?k.replaceLastRing(de,fe,n.radius,1):k.addRing(de,fe,n.radius,1)},j=new Me({ringSegments:d.constrainedMobile?10:16,maxRings:14,material:T.material});j.mesh.castShadow=!1,m.add(j.mesh);let he=Te(Pe);m.add(he.group);let M=new p({opacity:.22}),ye=new l(new s(24,24),M);ye.rotation.x=-Math.PI/2,ye.position.y=-.02,ye.receiveShadow=d.dynamicShadows,m.add(ye);let Se=new ee(.11,12,10),N=Array.from({length:18},()=>{let e=new l(Se,T.material);return e.visible=!1,m.add(e),{mesh:e,life:0,velocity:new w}}),P=d.constrainedMobile?null:new ge(f);if(P){P.addPass(new ve(m,v)),P.addPass(new be(new g(512,512),.16,.7,.92));let e=new me(xe);e.uniforms.offset.value=1.05,e.uniforms.darkness.value=1.18,P.addPass(e),P.addPass(new _e)}let Ee=new a(new w(0,1,0),0),Ae=new i,je=new g,F=new w,R=`ready`,qe=null,z=!1,B=0,Je=0,Ye=0,V=0,H=0,Xe=0,U=0,Ze=!1,Qe=!0,$e=!1,et=0,tt=0,nt=Be,W=0,G=0,K=null,rt=null,it=``,at=0,ot=0,st=performance.now(),ct=!1,lt=0,q=new w(0,0,0),J=new w,ut=new w(0,0,0),dt=new w,Y=new w,X=new w,Z=new w(0,1,0),ft=new w,pt=new w,Q=new w,mt=new w,ht=new w(0,Pe,0),gt=new w,_t=new w(0,-1,0),vt=new w,yt=(t,n,r)=>{e.services.report({type:t,at:e.services.now(),value:n,detail:r})},bt=()=>Math.hypot(et,tt),$=()=>{R!==rt&&(rt=R,yt(`game_mode`,R))},xt=()=>{let t=`${R}:${V.toFixed(2)}:${U}:${Xe}:${bt().toFixed(2)}`;t!==it&&(it=t,e.services.report({type:`game_hud`,at:e.services.now(),detail:{remaining:Math.max(0,Number((u.targetHeight-V).toFixed(2))),stats:[{label:`height`,value:`${V.toFixed(2)}m`},{label:`target`,value:`${u.targetHeight.toFixed(2)}m`},{label:`coils`,value:Xe},{label:`balance`,value:`${Math.max(0,Math.round((1-bt()/Le)*100))}%`},{label:`spill`,value:`${U}/${Ue}`}]}}))},St=()=>{O.clear(),j.clear(),k.clear(),A.length=0,V=0,H=0,Xe=0,U=0,Ze=!1,Qe=!0,$e=!1,et=0,tt=0,nt=Be,W=0,G=0,B=0,z=!1,K=null,Je=0,lt=0,qe=null,q.set(0,0,0),ut.set(0,0,0),dt.set(0,0,0),J.set(0,0,0),D.position.set(0,0,0),D.rotation.set(0,0,0),X.set(0,Fe,0),Y.copy(X),N.forEach(e=>{e.life=0,e.mesh.visible=!1})},Ct=e=>{let t=N.find(e=>e.life<=0);t&&(t.life=1.4,t.mesh.position.copy(e),t.mesh.visible=!0,t.velocity.set((Math.random()-.5)*.7,-.4,(Math.random()-.5)*.7))},wt=(t,n=null)=>{if(R===`won`||R===`lost`)return;R=t,qe=n,z=!1;let r=Math.max(0,1-bt()/Le);lt=Math.round(t===`won`?V*420+r*260-U*40:V*180),yt(`round_end`,t,{cause:n,height:Number(V.toFixed(3)),spill:U,coils:Xe,score:lt}),e.services.requestHaptic?.(t===`won`?`success`:`failure`)},Tt=()=>{z&&(z=!1,yt(`flow_stopped`,Number(V.toFixed(3))))},Et=()=>{R!==`playing`||z||(z=!0,yt(`flow_started`),e.services.requestHaptic?.(`light`))},Dt=(t,n)=>{let r=e.canvas.getBoundingClientRect();return r.width<=0||r.height<=0?!1:(je.set((t-r.left)/r.width*2-1,-((n-r.top)/r.height)*2+1),Ae.setFromCamera(je,v),Ae.ray.intersectPlane(Ee,F)!==null)},Ot=(e,t)=>{Dt(e,t)&&dt.set(F.x-q.x,0,F.z-q.z)},kt=(e,t)=>{Dt(e,t)&&ut.set(L(F.x-dt.x,-.82,Re),0,L(F.z-dt.z,-.55,ze))},At=t=>{if(K===null){if(R===`won`||R===`lost`){St(),R=`ready`,$();return}K=t.pointerId,e.canvas.setPointerCapture?.(t.pointerId),Ot(t.clientX,t.clientY),Et(),t.preventDefault()}},jt=e=>{K===e.pointerId&&kt(e.clientX,e.clientY)},Mt=t=>{K===t.pointerId&&(K=null,e.canvas.releasePointerCapture?.(t.pointerId),Tt())},Nt=e=>{if(!(e.code!==`Space`||e.repeat)){if(e.preventDefault(),R===`won`||R===`lost`){St(),R=`ready`,$();return}Et()}},Pt=e=>{e.code===`Space`&&Tt()},Ft=e=>{let t=ut.x-q.x,n=ut.z-q.z;J.x+=t*u.followStiffness*e,J.z+=n*u.followStiffness*e;let r=Math.exp(-u.followDamping*e);J.x*=r,J.z*=r,q.x+=J.x*e,q.z+=J.z*e,D.position.set(q.x,0,q.z);let i=L(tt*.34+J.z*.012,-.32,.32),a=L(-et*.34-J.x*.012,-.32,.32);D.rotation.x+=(i-D.rotation.x)*Math.min(1,e*7),D.rotation.z+=(a-D.rotation.z)*Math.min(1,e*7)},It=t=>{let n=z&&R===`playing`?1:0,r=n>B?u.flowAttack:u.flowAttack*1.35;if(B+=L(n-B,-t/r,t/r),B=L(B,0,1),B<=.05||O.full){Ze=!1,!Qe&&O.rings>0&&(Qe=!0,$e&&=(O.removeLastRing(),!1),Z.subVectors(Y,X),Z.lengthSq()<1e-8&&Z.set(0,1,0),O.addRing(Y,Z,u.ropeRadius*.02,.2));return}Qe=!1;let i=u.ropeRadius*Math.max(.14,B**.55),a=u.flowRate*B,o=Math.min(9,a/(Math.PI*i*i)),s=L(V/Ie,0,1),c=1+(1-u.viscosity)*.55,l=Math.max(.03,u.coilRadius*c*(1-u.coilTaper*s)*B**1.15),ee=Ce-i*.82,f=L(V/.55,0,1),p=i*1.05,m=Math.max(p,Math.min(l,Math.max(.03,ee+(l-ee)*f))),h=o/Math.max(.09,m);H+=h*t,Xe=Math.floor(H/(Math.PI*2));let g=2*i*(1-u.coilOverlap)*(.45+u.viscosity*.75);V+=h*t/(Math.PI*2)*g,z||(V+=(1-B)*u.ropeRadius*1.4*t);let te=-q.x,ne=-q.z,_=o*.18*t;W=L(W+L(te-W,-_,_),-.5,He),G=L(G+L(ne-G,-_,_),-.5,He);let v=Math.hypot(te-W,ne-G)>m+i*.5;Y.set(W+Math.cos(H)*m,Fe+V,G+Math.sin(H)*m),Q.copy(Y).add(D.position);let y=a*t;nt+=y,et+=(W-et)*y/Math.max(1e-4,nt),tt+=(G-tt)*y/Math.max(1e-4,nt),Ze=Math.hypot(Y.x,Y.z)>.94+i*.5&&V<.5||v,Ze&&Math.random()<t*6&&(Ct(v?mt.set(te,Fe+V,ne).add(D.position):Q),U+=1,e.services.requestHaptic?.(`medium`),yt(`spill`,U),U>=Ue&&wt(`lost`,`spilled`));let b=Math.max(.03,i*(d.constrainedMobile?.42:.3)),re=Y.distanceTo(X);if($e&&=(O.removeLastRing(),!1),O.rings===0)Z.set(-Math.sin(H),.12,Math.cos(H)).normalize(),ft.copy(Y).addScaledVector(Z,-i*.55),O.addRing(ft,Z,i*.08,1),ft.copy(Y).addScaledVector(Z,-i*.28),O.addRing(ft,Z,i*.72,1),O.addRing(Y,Z,i,1),X.copy(Y);else if(re>=b){let e=Math.min(8,Math.ceil(re/b));Z.subVectors(Y,X),Z.lengthSq()<1e-8&&Z.set(0,1,0);let t=ft.copy(X);for(let n=1;n<=e;n+=1)pt.lerpVectors(t,Y,n/e),O.addRing(pt,Z,i,L(1-s*.65,.2,1));X.copy(Y)}O.rings>0&&!O.full&&(pt.copy(Y).addScaledVector(Z,i*.42),O.addRing(pt,Z,i*.34,1),$e=!0);let x=Math.max(.02,m-i*1.02),S=Fe+V;if(A.length===0)A.push({x:W,y:Fe-i*.6,z:G,radius:x*.92}),A.push({x:W,y:S,z:G,radius:x}),k.addRing(de.set(W,A[0].y,G),fe.set(0,1,0),A[0].radius,1),pe(1,!1);else{let e=A[A.length-2];if(e&&S-e.y>=Ve)A.push({x:W,y:S,z:G,radius:x}),pe(A.length-1,!1);else{let e=A[A.length-1];e.x=W,e.y=S,e.z=G,e.radius=x,pe(A.length-1,!0)}}V>Ie?wt(`lost`,`overflowed`):bt()>Le&&wt(`lost`,`toppled`)},Lt=()=>{if(B<=.02){j.clear(),j.mesh.visible=!1;return}j.mesh.visible=!0,j.clear();let e=u.ropeRadius*(.34+.66*B)*.42,n=ht.y,r=Math.min(n-.05,Q.y-e*.6),i=Math.max(.05,n-r),a=Math.max(.4,u.flowRate*B/(Math.PI*e*e));for(let r=0;r<12;r+=1){let o=r/11,s=i*o,c=Math.sqrt(a*a+2*u.strandGravity*s),l=Math.max(.02,e*Math.sqrt(a/c));gt.set(t.lerp(ht.x,Q.x,o*o),n-s,t.lerp(ht.z,Q.z,o*o)),_t.set((Q.x-ht.x)*.25,-1,(Q.z-ht.z)*.25),j.addRing(gt,_t,l,1)}},Rt=e=>{N.forEach(t=>{t.life<=0||(t.life-=e,t.velocity.y-=u.strandGravity*e,t.mesh.position.addScaledVector(t.velocity,e),(t.life<=0||t.mesh.position.y<-.4)&&(t.life=0,t.mesh.visible=!1))})},zt=()=>{R!==`paused`&&(Je+=I,Ft(I),R===`playing`?(It(I),!z&&B<=.02&&V>=u.targetHeight&&bt()<=Le*.8&&wt(`won`)):B=Math.max(0,B-I/u.flowAttack),Rt(I))},Bt=e=>{Ye+=e,Lt(),T.setTime(Ye),T.setWobble(L(-J.x*.012,-.06,.06),L(-J.z*.012,-.06,.06),V+.4),vt.copy(x.position).normalize(),T.setLightDirection(vt,v),$(),xt()},Vt=()=>{f.domElement.width<=0||f.domElement.height<=0||(P?P.render():f.render(m,v))},Ht=()=>{if(ct)return;at=requestAnimationFrame(Ht);let e=performance.now(),t=Math.min(.1,(e-st)/1e3);if(st=e,R!==`paused`){ot+=t;let e=0;for(;ot>=I&&e<6;)zt(),ot-=I,e+=1}Bt(t),Vt()};e.canvas.style.touchAction=`none`,e.canvas.addEventListener(`pointerdown`,At),e.canvas.addEventListener(`pointermove`,jt),e.canvas.addEventListener(`pointerup`,Mt),e.canvas.addEventListener(`pointercancel`,Mt),addEventListener(`keydown`,Nt),addEventListener(`keyup`,Pt);let Ut={start(){(R===`won`||R===`lost`)&&(St(),R=`ready`),R===`ready`&&(R=`playing`,yt(`round_start`)),$(),xt()},pause(){R===`playing`&&(R=`paused`,z=!1,$())},resume(){R===`paused`&&(R=`playing`,st=performance.now(),$())},reset(){St(),R=`ready`,it=``,$(),xt(),Vt()},resize(e,n,r){let i=Math.min(r,d.maxPixelRatio);f.setPixelRatio(i),f.setSize(e,n,!1),P?.setPixelRatio(i),P?.setSize(e,n);let a=e/Math.max(1,n);v.aspect=a,v.fov=c.universal.cameraFov;let o=t.degToRad(v.fov)/2,s=We/Math.tan(o),l=Ge/(Math.tan(o)*Math.max(.2,a)),ee=c.universal.cameraDistance/11.6;v.position.set(0,c.universal.cameraHeight,Math.max(s,l)*ee),v.lookAt(y),v.updateProjectionMatrix(),Vt()},dispose(){ct||(ct=!0,cancelAnimationFrame(at),e.canvas.removeEventListener(`pointerdown`,At),e.canvas.removeEventListener(`pointermove`,jt),e.canvas.removeEventListener(`pointerup`,Mt),e.canvas.removeEventListener(`pointercancel`,Mt),removeEventListener(`keydown`,Nt),removeEventListener(`keyup`,Pt),O.dispose(),j.dispose(),k.dispose(),E.dispose(),he.dispose(),Se.dispose(),ye.geometry.dispose(),M.dispose(),T.dispose(),le.dispose(),ne.dispose(),h.dispose(),P?.dispose(),f.dispose())},renderToText(){return JSON.stringify({surface:`mini-game`,game:Ne.id,version:Ne.version,versionState:Ne.versionState,versionBranch:Ne.versionBranch,mode:R,elapsed:Number(Je.toFixed(2)),coordinateSystem:`The nozzle is fixed at world origin height 4.72. The cone slides on the X/Z floor plane and the swirl is stored in cone-local space.`,input:{pressed:z,flow:Number(B.toFixed(3)),pointerActive:K!==null},cone:{x:Number(q.x.toFixed(3)),z:Number(q.z.toFixed(3)),velocityX:Number(J.x.toFixed(3)),velocityZ:Number(J.z.toFixed(3)),tiltX:Number(D.rotation.x.toFixed(3)),tiltZ:Number(D.rotation.z.toFixed(3)),topRadius:Ce},swirl:{height:Number(V.toFixed(3)),targetHeight:u.targetHeight,maxHeight:Ie,coils:Xe,rings:O.rings,ringBudget:O.full?`full`:`available`,centerOfMass:{x:Number(et.toFixed(3)),z:Number(tt.toFixed(3)),offset:Number(bt().toFixed(3))},toppleLimit:Le,spilling:Ze,spill:U,spillLimit:Ue},result:{outcome:R===`won`||R===`lost`?R:null,cause:qe,score:lt},rules:{win:`Release with the swirl at or above the target height while the stack stays balanced.`,lose:`The run ends if the swirl overflows the maximum height, leans past the topple limit, or spills five times.`},tuning:u,controls:`Press and hold anywhere: the cone eases toward your finger and the machine dispenses. Release to stop and set the tip. Space works on desktop.`})},advanceTime(e){let t=Math.max(1,Math.round(e/(I*1e3)));for(let e=0;e<t;e+=1)zt();Bt(t*I),Vt()},getInspectableScene(){return{kind:`three`,value:m}},getTuningSchema(){return[{key:`flowRate`,label:`Flow rate`,type:`number`,value:u.flowRate,min:.15,max:1.6,step:.01},{key:`ropeRadius`,label:`Rope thickness`,type:`number`,value:u.ropeRadius,min:.14,max:.46,step:.01},{key:`coilRadius`,label:`Coil radius`,type:`number`,value:u.coilRadius,min:.16,max:.86,step:.01},{key:`viscosity`,label:`Viscosity`,type:`number`,value:u.viscosity,min:.15,max:1,step:.01},{key:`translucency`,label:`Translucency`,type:`number`,value:u.translucency,min:0,max:4,step:.05}]},setControl(e,t){(e===`action`||e===`jump`)&&(t?Et():Tt())},applyConfig(e){let t=structuredClone(e);c=t,u=Ke(t.gameplay),h.dispose(),h=Oe(c.colors.background),m.background=h,T.apply({color:C,translucency:u.translucency,translucencyPower:3.1,translucencyAmbient:.03,distortion:.42,occlusion:.62,roughness:.62,sheen:.2,jiggle:u.jiggle}),v.fov=c.universal.cameraFov,v.updateProjectionMatrix(),Vt()}};return St(),Ut.resize(e.canvas.clientWidth||e.canvas.width||1,e.canvas.clientHeight||e.canvas.height||1,window.devicePixelRatio||1),Bt(0),at=requestAnimationFrame(Ht),Ut};export{R as create,Ne as manifest};