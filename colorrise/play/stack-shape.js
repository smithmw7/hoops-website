/* Uniform-corner geometry adapted from figma-squircle (MIT, Tien Pham).
 * https://github.com/phamfoo/figma-squircle — see licenses/figma-squircle.txt.
 * Matches cornerRadius:25, cornerSmoothing:.6, preserveSmoothing:true.
 */
window.ColorStackShape = (() => {
  const radius = 25, smoothing = .6, cache = new Map(), surfaces = new WeakMap();
  let updates = 0;
  function path(width, height, requestedRadius = radius) {
    const w = Math.max(0, width), h = Math.max(0, height);
    const budget = Math.min(w, h) / 2, r = Math.min(requestedRadius, budget);
    const key = `${w}/${h}/${r}`;
    if (cache.has(key)) return cache.get(key);
    let result;
    if (!r) result = `M0 0H${w}V${h}H0Z`;
    else {
      let p = (1 + smoothing) * r;
      const arc = Math.sin(Math.PI / 4 * (1 - smoothing)) * r * Math.SQRT2;
      const c = r * Math.tan(Math.PI / 8 * smoothing) * Math.cos(Math.PI / 4 * smoothing);
      const d = c * Math.tan(Math.PI / 4 * smoothing);
      let b = (p - arc - c - d) / 3, a = 2 * b;
      if (p > budget) {
        const available = budget - d - arc - c;
        b = Math.min(b, available * 5 / 6);
        a = available - b;
        p = budget;
      }
      result = `M${w-p} 0
        c${a} 0 ${a+b} 0 ${a+b+c} ${d} a${r} ${r} 0 0 1 ${arc} ${arc}
        c${d} ${c} ${d} ${b+c} ${d} ${a+b+c} L${w} ${h-p}
        c0 ${a} 0 ${a+b} ${-d} ${a+b+c} a${r} ${r} 0 0 1 ${-arc} ${arc}
        c${-c} ${d} ${-b-c} ${d} ${-a-b-c} ${d} L${p} ${h}
        c${-a} 0 ${-a-b} 0 ${-a-b-c} ${-d} a${r} ${r} 0 0 1 ${-arc} ${-arc}
        c${-d} ${-c} ${-d} ${-b-c} ${-d} ${-a-b-c} L0 ${p}
        c0 ${-a} 0 ${-a-b} ${d} ${-a-b-c} a${r} ${r} 0 0 1 ${arc} ${-arc}
        c${c} ${-d} ${b+c} ${-d} ${a+b+c} ${-d} Z`;
      result = result.replace(/-?\d*\.?\d+(?:e[+-]?\d+)?/g, n => String(+Number(n).toFixed(4))).replace(/\s+/g, ' ').trim();
    }
    // Bound memory during animated resizes; stationary drags do no geometry work.
    if (cache.size >= 96) cache.delete(cache.keys().next().value);
    cache.set(key, result);
    return result;
  }
  function update(el, width, height) {
    const surface = surfaces.get(el);
    if (!surface || width <= 0 || height <= 0) return;
    const key = `${width}/${height}`;
    if (surface.key === key) return;
    surface.key = key;
    const outline = path(width, height);
    if (surface.face) surface.face.style.clipPath = `path('${outline}')`;
    surface.outline.setAttribute('d', outline);
    if (surface.target) {
      surface.outline.setAttribute('d', path(Math.max(0, width - 2), Math.max(0, height - 2), radius - 1));
    }
    updates++;
  }
  const observer = new ResizeObserver(entries => {
    for (const {target, contentRect} of entries) update(target, contentRect.width, contentRect.height);
  });
  function svg(className) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.setAttribute('class', className);
    el.setAttribute('aria-hidden', 'true');
    const outline = document.createElementNS(el.namespaceURI, 'path');
    el.append(outline);
    return {el, outline};
  }
  function attach(el) {
    const shadow = svg('piece-shadow');
    const face = document.createElement('span');
    face.className = 'piece-face';
    face.setAttribute('aria-hidden', 'true');
    el.append(shadow.el, face);
    surfaces.set(el, {face, outline:shadow.outline});
    observer.observe(el);
    return face;
  }
  function attachTarget(el) {
    const target = svg('ftue-target-shape');
    target.outline.setAttribute('transform', 'translate(1 1)');
    el.prepend(target.el);
    surfaces.set(el, {outline:target.outline, target:true});
    observer.observe(el);
  }
  function release(el) { observer.unobserve(el); surfaces.delete(el); }
  function reset() { observer.disconnect(); }
  // Upload once per completion. R holds coverage; G holds a soft exterior halo.
  // The GPU reuses this texture throughout the pulse, with no path work per frame.
  function pulseTexture(width, height, dpr, pad = 48) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil((width + pad * 2) * dpr);
    canvas.height = Math.ceil((height + pad * 2) * dpr);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(canvas.width / (width + pad * 2), canvas.height / (height + pad * 2));
    ctx.translate(pad, pad);
    ctx.shadowColor = '#00ff00'; ctx.shadowBlur = 32 * dpr;
    ctx.fillStyle = '#ff0000'; ctx.fill(new Path2D(path(width, height)));
    return canvas;
  }
  return Object.freeze({radius, smoothing, path, attach, attachTarget, release, reset, pulseTexture,
    stats:() => ({radius, smoothing, updates, cachedPaths:cache.size})});
})();
