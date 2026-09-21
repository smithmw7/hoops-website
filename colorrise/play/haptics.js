// Discrete native feedback, independent of sound. Nothing is queued for later playback.
(() => {
  let enabled = true, active = !document.hidden, selecting = false;
  let lastCue = -Infinity;
  const counts = {};
  enabled = localStorage.getItem('color-stack-haptics') !== 'off';
  function plugin() {
    return window.Capacitor?.isNativePlatform() && window.Capacitor.isPluginAvailable('Haptics')
      ? window.capacitorHaptics?.Haptics : null;
  }
  function invoke(method, options) {
    const native = plugin();
    if (!native) return false;
    try {
      Promise.resolve(native[method](options)).catch(() => {});
      return true;
    } catch { return false; }
  }
  function endDrag() {
    if (selecting) invoke('selectionEnd');
    selecting = false;
  }
  function cue(name) {
    if (!enabled || !active || document.hidden) return false;
    const now = performance.now();
    if (now - lastCue < (name === 'slot' ? 55 : 45)) return false;
    let played;
    if (name === 'slot') played = selecting && invoke('selectionChanged');
    else if (name === 'win' || name === 'fail') played = invoke('notification', {type:name === 'win' ? 'SUCCESS' : 'WARNING'});
    else played = invoke('impact', {style:name === 'drop' || name === 'merge' ? 'MEDIUM' : 'LIGHT'});
    if (played) { lastCue = now; counts[name] = (counts[name] || 0) + 1; }
    return !!played;
  }
  function startDrag() {
    endDrag();
    if (!enabled || !active || document.hidden) return;
    selecting = invoke('selectionStart');
    cue('pickup');
  }
  function stop() { endDrag(); }
  function setEnabled(value) {
    enabled = Boolean(value);
    localStorage.setItem('color-stack-haptics', enabled ? 'on' : 'off');
    if (!enabled) stop();
    else cue('toggle');
    return enabled;
  }
  function background() { active = false; stop(); }
  function activate() { if (!document.hidden) active = true; }
  document.addEventListener('pointerdown', activate, {capture:true, passive:true});
  document.addEventListener('click', activate, {capture:true, passive:true});
  document.addEventListener('keydown', event => { if (!event.repeat) activate(); }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) background(); });
  window.addEventListener('pagehide', background);
  window.GameHaptics = {cue, startDrag, endDrag, stop, setEnabled,
    get enabled() { return enabled; },
    getState:() => ({enabled, active, available:!!plugin(), selecting, counts:{...counts}})};
})();
