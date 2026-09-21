// One shared Web Audio graph. Original cues preload silently and expire if activation is late.
(() => {
  const cues = window.COLOR_STACK_SFX.cues;
  const buffers = new Map(), downloads = new Map(), decodes = new Map();
  const voices = new Set(), lastPlayed = new Map(), counts = {}, dropped = {};
  let context, decoder, master, compressor, limiter, epoch = 0, maxVoices = 0;
  let gestureAt = -Infinity, resume = Promise.resolve();
  let active = !document.hidden, enabled = true, resumeAttempt = 0, warming = false;
  enabled = localStorage.getItem('color-stack-sound') !== 'off';
  const drop = reason => { dropped[reason] = (dropped[reason] || 0) + 1; return false; };
  const native = window.createNativeAudioDriver(cues, () => enabled, drop, counts);

  function fetchCue(name) {
    if (!downloads.has(name)) {
      const pending = fetch(`audio/${cues[name].file}`).then(response => {
        if (!response.ok) throw Error(`Audio asset ${response.status}`);
        return response.arrayBuffer();
      }).catch(() => { downloads.delete(name); return null; });
      downloads.set(name, pending);
    }
    return downloads.get(name);
  }
  function decode(name) {
    if (buffers.has(name)) return Promise.resolve(buffers.get(name));
    if (!decodes.has(name)) {
      const pending = fetchCue(name).then(bytes => bytes && (decoder || context).decodeAudioData(bytes.slice(0)))
        .then(buffer => { if (buffer) buffers.set(name, buffer); return buffer; })
        .catch(() => null).finally(() => decodes.delete(name));
      decodes.set(name, pending);
    }
    return decodes.get(name);
  }
  function configureSession() {
    try {
      // WebKit owns the web view's audio session. Ambient mode follows the
      // iPhone Silent switch even when Web Audio reports a running context.
      if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback';
    } catch { /* Older browsers can still use their normal Web Audio route. */ }
  }
  function unlock() {
    if (!enabled || document.hidden) return;
    active = true;
    gestureAt = performance.now();
    if (native.required()) {
      if (!native.available()) drop('native-unavailable');
      else if (warming) native.unlock();
      return;
    }
    configureSession();
    if (context?.state === 'closed') {
      stop(undefined, true);
      context = null;
      master = compressor = limiter = undefined;
      lastPlayed.clear();
    }
    if (!context) {
      const AudioContext = window.AudioContext;
      if (!AudioContext) return;
      try {
        context = new AudioContext({latencyHint:'interactive'});
        const createdContext = context;
        master = context.createGain(); master.gain.value = .8;
        compressor = context.createDynamicsCompressor();
        compressor.threshold.value = -12; compressor.knee.value = 12;
        compressor.ratio.value = 8; compressor.attack.value = .002; compressor.release.value = .09;
        // A final soft ceiling also protects against unusually dense interaction bursts.
        limiter = context.createWaveShaper();
        limiter.curve = Float32Array.from({length:4097}, (_, i) => .85 * Math.tanh((i / 2048 - 1) / .85));
        limiter.oversample = '2x';
        master.connect(compressor).connect(limiter).connect(context.destination);
        context.addEventListener('statechange', () => {
          if (context === createdContext && createdContext.state !== 'running') stop(undefined, true);
        });
        if (warming) Object.keys(cues).forEach(decode);
      } catch { context = null; return; }
    }
    // Call synchronously in the gesture, including Safari's interrupted state. A hung
    // resume promise cannot block a later gesture from making a fresh attempt.
    if (context.state !== 'running' && context.state !== 'closed') {
      resumeAttempt++;
      resume = context.resume().catch(() => {});
    }
  }
  function remove(voice) {
    voices.delete(voice);
    voice.source.disconnect(); voice.gain.disconnect();
  }
  function stop(scope, immediate = false) {
    native.stop(scope, immediate || !enabled);
    if (!scope) epoch++;
    for (const voice of voices) {
      if (scope && voice.scope !== scope) continue;
      if (immediate || context.state !== 'running') {
        try { voice.source.stop(); } catch { /* Already finished. */ }
        remove(voice);
        continue;
      }
      const now = context.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
      voice.gain.gain.linearRampToValueAtTime(0, now + .008);
      try { voice.source.stop(now + .009); } catch { /* Already finished. */ }
    }
    // Invalidates fresh-but-still-decoding cues for the canceled view as well.
    if (scope) scopeVersions[scope] = (scopeVersions[scope] || 0) + 1;
  }
  const scopeVersions = {};
  function start(name, buffer, options) {
    if (!enabled || !active || document.hidden || context?.state !== 'running') return drop('inactive');
    const now = performance.now(), cue = cues[name];
    if (now - (lastPlayed.get(name) ?? -Infinity) < cue.cooldownMs) return drop('cooldown');
    if (voices.size >= 8) {
      // Repeated slider/reorder ticks yield to meaningful state changes.
      if (name === 'tick') return drop('polyphony');
      const oldest = [...voices].find(v => v.name === 'tick') || voices.values().next().value;
      try { oldest.source.stop(); } catch { /* Already finished. */ }
      remove(oldest);
    }
    const source = context.createBufferSource(), gain = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = Math.max(.75, Math.min(1.4, options.rate || 1));
    gain.gain.value = cue.mix * Math.max(0, Math.min(1, options.volume ?? 1));
    source.connect(gain).connect(master);
    const voice = {source, gain, name, scope:options.scope || 'ui'};
    source.onended = () => remove(voice);
    voices.add(voice); maxVoices = Math.max(maxVoices, voices.size);
    lastPlayed.set(name, now); counts[name] = (counts[name] || 0) + 1;
    source.start();
    return true;
  }
  function play(name, options = {}) {
    if (!cues[name]) return drop('unknown');
    if (native.required()) return native.available() && enabled && active && !document.hidden ? native.play(name, options) : drop(native.available() ? 'inactive' : 'native-unavailable');
    if (!enabled || !active || document.hidden || !context) return drop('inactive');
    // Only the current gesture can wait briefly for asynchronous iOS activation.
    // Animation callbacks during interruption are discarded, never queued on the clock.
    const waitingForResume = context.state !== 'running';
    if (waitingForResume && performance.now() - gestureAt > 50) return drop('suspended');
    if (!waitingForResume && buffers.has(name)) return start(name, buffers.get(name), options);
    const requested = performance.now(), version = epoch, scope = options.scope || 'ui', scopeVersion = scopeVersions[scope] || 0;
    let expired = false;
    const timeout = setTimeout(() => { expired = true; drop('stale'); }, 120);
    Promise.all([decode(name), waitingForResume ? resume : Promise.resolve()]).then(([buffer]) => {
      clearTimeout(timeout);
      if (expired) return;
      if (!buffer || version !== epoch || scopeVersion !== (scopeVersions[scope] || 0) || performance.now() - requested > 120) return drop('stale');
      start(name, buffer, options);
    });
    return false;
  }
  function setEnabled(value) {
    enabled = Boolean(value);
    localStorage.setItem('color-stack-sound', enabled ? 'on' : 'off');
    if (!enabled) stop();
    else { unlock(); play('confirm'); }
    return enabled;
  }
  function background() {
    active = false;
    stop(undefined, true);
    if (context && context.state !== 'closed') context.suspend().catch(() => {});
  }
  async function startSplash() {
    if (!enabled) return true;
    if (document.hidden) return false;
    if (native.required()) {
      if (!await native.prepareSplash()) return false;
      return native.play('splash', {scope:'splash'});
    }
    // Attempt autoplay where allowed; a browser gesture retries this same sequence.
    unlock();
    const buffer = await decode('splash');
    if (!buffer) throw new Error('Splash audio could not be decoded');
    if (context?.state !== 'running') {
      await Promise.race([resume, new Promise(resolve => setTimeout(resolve, 120))]);
    }
    if (context?.state !== 'running') return false;
    return start('splash', buffer, {scope:'splash'});
  }
  function warm() {
    if (warming) return;
    warming = true;
    if (native.required()) native.unlock();
    else Object.keys(cues).forEach(name => decoder ? decode(name) : fetchCue(name));
  }
  // Offline decoding warms the pack without activating speakers or an audio session.
  try {
    const OfflineContext = window.OfflineAudioContext;
    if (!native.required() && OfflineContext) decoder = new OfflineContext(1, 1, 48000);
  } catch { /* Gesture-time decoding remains available. */ }
  if (!native.required()) decoder ? decode('splash') : fetchCue('splash');
  document.addEventListener('pointerdown', unlock, {capture:true, passive:true});
  document.addEventListener('pointerup', unlock, {capture:true, passive:true});
  document.addEventListener('touchend', unlock, {capture:true, passive:true});
  document.addEventListener('click', unlock, {capture:true, passive:true});
  document.addEventListener('keydown', event => { if (!event.repeat) unlock(); }, true);
  function warmForeground() {
    if (native.required()) {
      active = !document.hidden;
      if (native.available()) native.refresh();
      else drop('native-unavailable');
      return;
    }
    // Warm an already-unlocked session ahead of the next tap, while keeping all
    // playback gated until that gesture. If iOS requires a gesture, unlock retries.
    if (!document.hidden && enabled && context && context.state !== 'running' && context.state !== 'closed') {
      configureSession();
      resume = context.resume().catch(() => {});
    }
  }
  document.addEventListener('visibilitychange', () => document.hidden ? background() : warmForeground());
  window.addEventListener('pageshow', warmForeground);
  window.addEventListener('pagehide', background);
  window.addEventListener('color-stack-inactive', background);
  window.addEventListener('color-stack-active', warmForeground);
  window.GameAudio = {
    play, stop, setEnabled, startSplash, warm,
    prepareSplash:() => native.required() ? native.prepareSplash() : Promise.resolve(false),
    get enabled() { return enabled; },
    getState:() => ({enabled, active, context:context?.state || 'uninitialized', ready:buffers.size,
      engine:native.required() ? 'native-ios' : 'web-audio', native:native.required() ? native.state() : null,
      total:Object.keys(cues).length, voices:voices.size, maxVoices, counts:{...counts}, dropped:{...dropped}, resumeAttempt,
      sessionType:navigator.audioSession?.type || 'unavailable'})
  };
})();
