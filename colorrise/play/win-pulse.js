(() => {
  // One small, reusable GPU surface. It only draws while a win timeline advances.
  const vertex = `attribute vec2 aPosition;
    varying vec2 vUV;
    void main() { vUV = aPosition * .5 + .5; gl_Position = vec4(aPosition, 0., 1.); }`;
  const fragment = `precision highp float;
    varying vec2 vUV;
    uniform sampler2D uPalette;
    uniform sampler2D uShape;
    uniform vec2 uSize;
    uniform vec2 uOrigin;
    uniform float uTime;
    uniform float uStripe;
    const float PAD = 48.;
    vec3 palette(float y) { return texture2D(uPalette, vec2(.5, clamp(y / uSize.y, 0., 1.))).rgb; }
    void main() {
      vec2 p = vec2(vUV.x, 1. - vUV.y) * (uSize + PAD * 2.) - PAD;
      vec2 delta = p - uOrigin;
      float distance = length(delta);
      float reach = length(vec2(uSize.x * .5, max(uOrigin.y, uSize.y - uOrigin.y)));
      // Gather toward the final seam, then release one broad refractive wave.
      float charge = pow(clamp(uTime / .16, 0., 1.), 2.) * (1. - smoothstep(.16, .23, uTime));
      float travel = clamp((uTime - .16) / .30, 0., 1.);
      travel = 1. - (1. - travel) * (1. - travel);
      float radius = travel * (reach + 32.);
      float band = (distance - radius) / 28.;
      float envelope = smoothstep(.16, .20, uTime) * (1. - smoothstep(.40, .52, uTime));
      float wave = exp(-band * band) * envelope;
      // Displacement is in CSS pixels, so the stronger bend is consistent on phones.
      float gather = exp(-distance / max(reach * .55, 1.)) * charge;
      vec2 refracted = p - delta / max(distance, 1.) * (sin(band * 2.1) * wave * 20. + gather * 10.);
      vec3 color = palette(refracted.y);
      float diagonal = clamp((refracted.x + refracted.y) / (uSize.x + uSize.y), 0., 1.);
      color = mix(color, vec3(1.), .13 * (1. - smoothstep(0., .38, diagonal)));
      color *= 1. - .13 * smoothstep(.38, 1., diagonal);
      if (uStripe > 0. && p.x > 10. && p.x < uSize.x - 10. && p.y > 5. && p.y < uSize.y - 5.) {
        float stripe = step(uStripe, mod(refracted.x - 10., uStripe + 2.));
        color = mix(color, 1. - 2. * (1. - color) * .4, stripe * .25);
      }
      color = mix(color, vec3(1.), wave * .40 + gather * .10);
      vec2 shape = texture2D(uShape, vec2(vUV.x, 1. - vUV.y)).rg;
      float mask = shape.r;
      // The halo samples each edge's own gradient color, rather than one averaged tint.
      float burst = smoothstep(.16, .20, uTime) * (1. - smoothstep(.24, .46, uTime));
      float glow = shape.g * 2. * (.46 * burst + .22 * wave + .07 * charge);
      float alpha = mask + glow * (1. - mask);
      vec3 rgb = color * mask + palette(p.y) * glow * (1. - mask);
      gl_FragColor = vec4(rgb, alpha);
    }`;

  window.createWinPulse = () => {
    let canvas, gl, program, texture, shapeTexture, locations, active = null, attempted = false;
    let last = {active:false, renderer:'uninitialized'};
    function prepare() {
      if (attempted) return !!program;
      attempted = true;
      canvas = document.createElement('canvas');
      canvas.className = 'win-pulse';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.hidden = true;
      canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        program = null;
        // An unavailable GPU must never keep a won level behind an input lock.
        active?.timeline.progress(1);
      });
      canvas.addEventListener('webglcontextrestored', () => {
        canvas.remove();
        attempted = false;
        prepare();
      });
      try {
        // Keep the short-lived frame available until WKWebView's compositor
        // presents it, including the first frame after unhiding the canvas.
        gl = canvas.getContext('webgl', {alpha:true, antialias:false, depth:false, stencil:false, preserveDrawingBuffer:true});
        if (!gl) throw new Error('WebGL context unavailable');
        program = gl.createProgram();
        for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
          const shader = gl.createShader(type);
          gl.shaderSource(shader, source); gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const message = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(message || 'Win shader compile failed');
          }
          gl.attachShader(program, shader); gl.deleteShader(shader);
        }
        gl.bindAttribLocation(program, 0, 'aPosition');
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Win shader unavailable');
        gl.useProgram(program);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        shapeTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, shapeTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.activeTexture(gl.TEXTURE0);
        locations = Object.fromEntries(['uPalette','uShape','uSize','uOrigin','uTime','uStripe'].map(key => [key, gl.getUniformLocation(program, key)]));
        gl.uniform1i(locations.uPalette, 0);
        gl.uniform1i(locations.uShape, 1);
        document.body.appendChild(canvas);
        last.renderer = 'webgl';
        return true;
      } catch (error) {
        if (program) gl.deleteProgram(program);
        program = null;
        last.renderer = 'error';
        last.error = String(error.message || error);
        console.error('Completion shader initialization failed:', last.error);
        return false;
      }
    }
    function cancel() {
      if (!active) return;
      const {el, timeline} = active;
      active = null;
      timeline.kill();
      el.classList.remove('win-shader-source');
      gsap.set(el, {scale:1});
      if (canvas) { canvas.hidden = true; canvas.style.transform = ''; }
      last.active = false;
    }
    function play(el, colors, seam, onComplete) {
      cancel();
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prepare()) throw new Error(`Completion shader unavailable: ${last.error || 'WebGL initialization failed'}`);
      const rect = el.getBoundingClientRect();
      const size = {width:rect.width, height:rect.height};
      const origin = {x:rect.width / 2, y:rect.height * seam};
      const playBounds = el.closest('.play-area').getBoundingClientRect();
      function clipToPlayArea(layer, pad, scale = 1) {
        // Keep long, scrolling puzzles behind the HUD/footer while allowing the
        // colored halo to escape horizontally beyond the board's side edges.
        const centerY = rect.top + rect.height / 2;
        const halfHeight = rect.height / 2 + pad;
        const top = Math.max(-48, (playBounds.top - centerY) / scale + halfHeight);
        const bottom = Math.max(-48, (centerY - playBounds.bottom) / scale + halfHeight);
        layer.style.clipPath = `inset(${top}px -48px ${bottom}px -48px)`;
      }
      {
        const strip = document.createElement('canvas');
        strip.width = 1; strip.height = 1024;
        const ctx = strip.getContext('2d');
        const ramp = ctx.createLinearGradient(0, 0, 0, strip.height);
        colors.forEach((color, i) => ramp.addColorStop(i / (colors.length - 1), color));
        ctx.fillStyle = ramp; ctx.fillRect(0, 0, 1, strip.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, strip);
        const dpr = Math.min(devicePixelRatio || 1, 2);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, shapeTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
          ColorStackShape.pulseTexture(rect.width, rect.height, dpr));
        gl.activeTexture(gl.TEXTURE0);
        canvas.width = Math.ceil((rect.width + 96) * dpr);
        canvas.height = Math.ceil((rect.height + 96) * dpr);
        Object.assign(canvas.style, {left:`${rect.left - 48}px`, top:`${rect.top - 48}px`, width:`${rect.width + 96}px`, height:`${rect.height + 96}px`});
        clipToPlayArea(canvas, 48);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(locations.uSize, rect.width, rect.height);
        gl.uniform2f(locations.uOrigin, origin.x, origin.y);
        gl.uniform1f(locations.uStripe, el.classList.contains('patterned') ? parseFloat(el.style.getPropertyValue('--stripe')) : 0);
        canvas.hidden = false;
        gl.uniform1f(locations.uTime, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        const pixel = new Uint8Array(4);
        gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        if (gl.getError() !== gl.NO_ERROR || pixel[3] < 200 || !pixel.slice(0, 3).some(value => value > 0)) {
          canvas.hidden = true;
          last.renderer = 'error';
          last.error = 'Win shader produced no visible first frame';
          throw new Error(last.error);
        }
        el.classList.add('win-shader-source');
      }
      const clock = {time:0, scale:1};
      // GSAP 3.13 quickSetter expands "scale" to the comma-separated alias
      // "scaleX,scaleY", which becomes an invalid DOM attribute on WKWebView.
      // Use concrete transform properties so every update reaches the GPU draw.
      const scaleX = gsap.quickSetter(el, 'scaleX');
      const scaleY = gsap.quickSetter(el, 'scaleY');
      const timeline = gsap.timeline({paused:true, onUpdate:() => {
        if (!active) return;
        last.time = clock.time;
        scaleX(clock.scale);
        scaleY(clock.scale);
        if (program) {
          gl.uniform1f(locations.uTime, clock.time);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          gl.flush();
          canvas.style.transform = `translateZ(0) scale(${clock.scale})`;
          clipToPlayArea(canvas, 48, clock.scale);
        }
      }, onComplete:() => { cancel(); onComplete(); }});
      active = {timeline, el};
      last = {active:true, renderer:'webgl', error:null, reduced, origin, size, seam, colors:[...colors], time:0, duration:reduced ? .12 : .52};
      timeline.addLabel('burst', reduced ? .04 : .16);
      timeline.to(clock, {time:reduced ? 0 : .52, duration:reduced ? .12 : .52, ease:'none'}, 0);
      if (!reduced) {
        timeline.to(clock, {scale:.975, duration:.16, ease:'power2.in'}, 0)
          .to(clock, {scale:1.055, duration:.075, ease:'power3.out'}, 'burst')
          .to(clock, {scale:.992, duration:.09, ease:'power2.inOut'}, .235)
          .to(clock, {scale:1, duration:.195, ease:'power2.out'}, .325);
      }
      timeline.play();
      return timeline;
    }
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => active?.timeline.progress(1));
    return {prepare, play, cancel, state:() => ({...last})};
  };
})();
