// Capacitor's iOS bridge owns playback; browsers own their Web Audio graph.
(() => {
  window.createNativeAudioDriver = (cues, enabled, drop, counts) => {
    let plugin, pending, prepared = false, epoch = 0;
    const scopeVersions = {}, lastPlayed = new Map();
    let snapshot = {ready:0, active:false, counts:{}, voices:0, lastError:''};
    function required() {
      const cap = window.Capacitor;
      return Boolean(cap?.isNativePlatform() && cap.getPlatform() === 'ios');
    }
    function available() {
      const cap = window.Capacitor;
      if (!required() || !cap.isPluginAvailable('GameAudioNative')) return false;
      plugin ||= cap.registerPlugin('GameAudioNative');
      return true;
    }
    function refresh() {
      if (plugin) plugin.getState().then(state => { snapshot = state; }).catch(error => {snapshot.lastError = String(error);});
    }
    function unlock() {
      if (!available() || !enabled() || document.hidden) return;
      if (!prepared && !pending) {
        const version = epoch;
        pending = plugin.prepare().then(state => {
          snapshot = state;
          if (version === epoch) prepared = state.active;
        }).catch(error => {snapshot.lastError = String(error); drop('native-prepare');})
          .finally(() => {pending = null;});
      }
    }
    async function prepareSplash() {
      if (!enabled() || document.hidden) return false;
      const version = epoch, scopeVersion = scopeVersions.splash || 0, started = performance.now();
      const current = () => enabled() && !document.hidden && version === epoch && scopeVersion === (scopeVersions.splash || 0);
      try {
        // Prepare only the launch cue, and wait for iOS foreground activation.
        // The rest of the pack must not delay the logo or its sound.
        while (current() && performance.now() - started < 5000) {
          // Registration may follow the first web-view frame on a cold launch.
          if (!available()) { await new Promise(resolve => setTimeout(resolve, 32)); continue; }
          snapshot = await plugin.prepare({names:['splash']});
          if (!current()) return false;
          if (snapshot.active) return true;
          await new Promise(resolve => setTimeout(resolve, 32));
        }
        if (!current()) return false;
        throw new Error('Splash audio did not become ready');
      } catch (error) {
        snapshot.lastError = String(error);
        drop('splash-not-ready');
        throw error;
      }
    }
    function play(name, options = {}) {
      if (!available() || !enabled() || document.hidden) return drop('inactive');
      const now = performance.now(), cue = cues[name];
      if (now - (lastPlayed.get(name) ?? -Infinity) < cue.cooldownMs) return drop('cooldown');
      lastPlayed.set(name, now);
      if (name !== 'splash') unlock();
      const version = epoch, scope = options.scope || 'ui', scopeVersion = scopeVersions[scope] || 0;
      const dispatch = () => {
        const maxDelay = 120;
        if (!enabled() || document.hidden || version !== epoch || scopeVersion !== (scopeVersions[scope] || 0) || performance.now() - now > maxDelay) return drop('stale');
        return plugin.play({name, scope, volume:.8 * cue.mix * Math.max(0, Math.min(1, options.volume ?? 1)),
          peak:Math.pow(10, cue.peakDb / 20), rate:Math.max(.75, Math.min(1.4, options.rate || 1))})
          .then(result => { if (result.played) counts[name] = (counts[name] || 0) + 1; else drop('polyphony'); refresh(); return Boolean(result.played); })
          .catch(error => {snapshot.lastError = String(error); return drop('native-play');});
      };
      // Hand warm cues to Capacitor without another preparation-promise hop.
      // Only first activation needs to wait here; the bridge owns transport.
      if (name === 'splash') return dispatch();
      else if (prepared && !pending) dispatch();
      else Promise.resolve(pending).then(dispatch);
      return false;
    }
    function stop(scope, deactivate = false) {
      if (scope) scopeVersions[scope] = (scopeVersions[scope] || 0) + 1;
      else epoch++;
      if (deactivate) prepared = false;
      if (available()) plugin.stop({scope, deactivate}).then(refresh).catch(error => {snapshot.lastError = String(error);});
    }
    return {required, available, unlock, prepareSplash, play, stop, refresh, state:() => ({...snapshot})};
  };
})();
