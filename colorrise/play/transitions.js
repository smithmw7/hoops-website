(() => {
  const active = new Map();
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => preference.matches;

  function clearStyles(nodes, properties) {
    // Clear in one write batch. A zero-duration GSAP tween initializes each
    // element first, interleaving computed-style reads with these removals.
    nodes.forEach(node => {
      properties.forEach(property => node.style.removeProperty(property));
      if (properties.includes('transform')) gsap.core.getCache(node).uncache = 1;
    });
  }

  function visible(root, selector) {
    const clip = root.getBoundingClientRect();
    return [...root.querySelectorAll(selector)].filter(node => {
      const box = node.getBoundingClientRect();
      return box.width && box.height && box.bottom > Math.max(0, clip.top) && box.top < Math.min(innerHeight, clip.bottom)
        && box.right > Math.max(0, clip.left) && box.left < Math.min(innerWidth, clip.right);
    });
  }

  function stop(root, reset = true) {
    const motion = active.get(root);
    if (!motion) return;
    motion.timeline.kill();
    clearStyles(motion.items, ['transform', 'opacity']);
    if (reset) clearStyles([root], ['transform', 'opacity', '--screen-shade']);
    active.delete(root);
  }

  function run(root, items, entering, options = {}) {
    stop(root, false);
    items = [...items];
    const reduce = reduced();
    const duration = reduce ? .09 : entering ? .23 : .11;
    const amount = reduce || items.length < 2 ? 0 : entering ? .1 : .045;
    const distance = reduce ? 0 : entering ? 10 : -6;
    const opacity = items.map(node => Number(getComputedStyle(node).opacity));
    // Read transforms together before the first tween writes any styles.
    items.forEach(node => gsap.getProperty(node, 'x'));
    const finish = () => {
      if (active.get(root)?.timeline !== timeline) return;
      active.delete(root);
      clearStyles(items, ['transform', 'opacity']);
      gsap.set(root, {autoAlpha:entering ? 1 : 0, clearProps:'transform'});
      options.onComplete?.();
    };
    const timeline = gsap.timeline({paused:true, onComplete:finish});
    active.set(root, {timeline, items});
    // Only native dialogs use this inherited property for their backdrop.
    // Updating it on a whole screen invalidates styles across every descendant.
    const shadeIn = root.tagName === 'DIALOG' ? {'--screen-shade':1} : {};
    const shadeOut = root.tagName === 'DIALOG' ? {'--screen-shade':0} : {};
    if (entering) {
      gsap.set(root, {visibility:'visible', x:0, y:0, scale:1});
      timeline.fromTo(root, {opacity:0, ...shadeOut}, {opacity:1, ...shadeIn, duration:reduce ? .09 : .18, ease:'power2.out'}, 0);
      if (items.length) timeline.fromTo(items, {y:distance, opacity:0}, {y:0, opacity:i => opacity[i], duration, stagger:{amount}, ease:'power3.out'}, reduce ? 0 : .015);
    } else {
      const pressed = items.includes(options.pressed) ? options.pressed : null;
      const clickTime = pressed && !reduce ? .075 : 0;
      const others = pressed && !reduce ? items.filter(node => node !== pressed) : items;
      if (others.length) timeline.to(others, {y:distance, opacity:0, duration, stagger:{amount, from:'end'}, ease:'power2.in'}, clickTime);
      if (pressed && !reduce) timeline.to(pressed, {y:3, scale:.94, duration:.065, ease:'power2.out'}, 0)
        .to(pressed, {y:8, scale:1, opacity:0, duration:.14, ease:'power2.in'}, .065);
      timeline.to(root, {opacity:0, ...shadeOut, duration:reduce ? .09 : .13, ease:'power2.inOut'}, clickTime + (reduce ? 0 : .025));
    }
    timeline.play();
    return timeline;
  }

  // Finish both halves of an interrupted navigation on return from iOS/background.
  function finishAll() {
    for (let pass = 0; active.size && pass < 8; pass++) {
      [...active.values()].forEach(({timeline}) => timeline.totalProgress(1));
    }
  }
  preference.addEventListener('change', finishAll);
  window.ScreenMotion = {visible, reduced, stop, finishAll,
    enter:(root, items, options) => run(root, items, true, options),
    exit:(root, items, options) => run(root, items, false, options)};
})();
