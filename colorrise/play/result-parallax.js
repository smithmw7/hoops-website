(() => {
  window.createResultParallax = () => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const maxTravel = {x:8, y:6};
    let circles = [];
    let icon = null;
    let active = false;
    let requested = false;
    let plugin = null;
    let listener = null;
    let frame = 0;
    let epoch = 0;
    let baseline = null;
    let target = {x:0, y:0};
    let current = {x:0, y:0};
    let lastInput = {x:0, y:0};
    let source = 'none';
    let permission = 'unknown';

    const clamp = value => Math.max(-1, Math.min(1, value));
    const available = () => {
      const cap = window.Capacitor;
      if (cap?.isNativePlatform?.() && cap.getPlatform?.() === 'ios' && cap.isPluginAvailable?.('ResultMotionNative')) {
        plugin ||= cap.registerPlugin('ResultMotionNative');
        return 'native';
      }
      return 'none';
    };

    function resetTransforms() {
      if (circles.length) gsap.set(circles, {x:0, y:0});
      if (icon) gsap.set(icon, {x:0, y:0});
    }

    function depthFor(index) {
      if (index === 0 || circles.length < 2) return 1;
      // Rings are ordered from the core outward. The backmost disk barely moves.
      const ringProgress = (index - 1) / Math.max(1, circles.length - 2);
      return .64 - ringProgress * .56;
    }

    function render() {
      frame = 0;
      if (!active || document.hidden || preference.matches || !circles.length) return;
      current.x += (target.x - current.x) * .14;
      current.y += (target.y - current.y) * .14;
      circles.forEach((circle, index) => {
        const depth = depthFor(index);
        gsap.set(circle, {x:current.x * maxTravel.x * depth, y:current.y * maxTravel.y * depth});
      });
      if (icon) gsap.set(icon, {x:current.x * maxTravel.x, y:current.y * maxTravel.y});
      if (Math.abs(target.x - current.x) > .002 || Math.abs(target.y - current.y) > .002) frame = requestAnimationFrame(render);
    }

    function queueRender() {
      if (!frame && active && !document.hidden && !preference.matches) frame = requestAnimationFrame(render);
    }

    function sample(x, y) {
      if (!active || !Number.isFinite(x) || !Number.isFinite(y)) return;
      if (!baseline) {
        baseline = {x, y};
        lastInput = {x, y};
        return;
      }
      lastInput = {x, y};
      // A quarter-g tilt reaches the cap. Filtering keeps hand jitter from buzzing.
      const nextX = clamp((x - baseline.x) / .25);
      const nextY = clamp((y - baseline.y) / .25);
      target.x = target.x * .72 + nextX * .28;
      target.y = target.y * .72 - nextY * .28;
      queueRender();
    }

    function prepare() {
      permission = available() === 'native' ? 'native' : 'unavailable';
    }

    async function connect(version) {
      source = available();
      if (source !== 'native') return;
      permission = 'native';
      try {
        const handle = await plugin.addListener('motion', event => sample(event.x, event.y));
        if (!active || version !== epoch) { await handle.remove(); return; }
        listener = handle;
        await plugin.start();
        if (!active || version !== epoch) await plugin.stop();
      } catch { source = 'none'; }
    }

    function mount(nextCircles, nextIcon) {
      resetTransforms();
      circles = [...nextCircles];
      icon = nextIcon || null;
      resetTransforms();
    }

    function start() {
      stop();
      requested = true;
      if (preference.matches || !circles.length || available() !== 'native') return false;
      active = true;
      const version = ++epoch;
      connect(version);
      return true;
    }

    function stop() {
      active = false;
      requested = false;
      epoch++;
      baseline = null;
      target = {x:0, y:0};
      current = {x:0, y:0};
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      const handle = listener;
      listener = null;
      handle?.remove().catch(() => {});
      plugin?.stop().catch(() => {});
      resetTransforms();
      source = 'none';
    }

    function resume() {
      if (active) {
        const nextCircles = circles, nextIcon = icon;
        stop();
        mount(nextCircles, nextIcon);
        start();
      }
    }

    preference.addEventListener('change', () => {
      const shouldRun = active || requested;
      stop();
      if (!preference.matches && shouldRun) start();
      else requested = shouldRun;
    });
    window.addEventListener('color-stack-active', resume);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        resetTransforms();
      } else if (active) {
        baseline = null;
        target = current = {x:0, y:0};
        queueRender();
      }
    });

    return {
      prepare, mount, start, stop, sample,
      state:() => ({active, requested, source, permission, layers:circles.length, input:{...lastInput}, target:{...target}, offset:{...current}, maxTravel:{...maxTravel}})
    };
  };
})();
