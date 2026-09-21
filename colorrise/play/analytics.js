// Native Firebase Analytics for release builds. Browser previews remain offline and untracked.
(() => {
  const eventParams = Object.freeze({
    splash_play: [],
    session_started: [],
    select_content: ['content_type', 'item_id'],
    level_start: ['level_name', 'level_number', 'chapter_id', 'chapter_level', 'layout_revision', 'attempt', 'par_moves', 'start_reason', 'first_try'],
    level_end: ['level_name', 'level_number', 'chapter_id', 'chapter_level', 'layout_revision', 'attempt', 'moves', 'par_moves', 'stars', 'duration_seconds', 'success', 'end_reason', 'first_try', 'first_try_three_star'],
    level_restart: ['level_name', 'level_number', 'chapter_id', 'chapter_level', 'layout_revision', 'attempt', 'moves', 'duration_seconds', 'restart_source'],
    level_exit: ['level_name', 'level_number', 'chapter_id', 'chapter_level', 'layout_revision', 'attempt', 'moves', 'duration_seconds', 'exit_source'],
    tutorial_begin: ['level_name'],
    tutorial_complete: ['level_name', 'moves', 'duration_seconds'],
    unlock_achievement: ['achievement_id', 'level_name'],
    share: ['method', 'content_type', 'item_id'],
    profile_open: [],
    settings_open: [],
    settings_update: ['setting', 'enabled'],
    how_to_play_open: [],
    support_open: [],
  });
  const screens = new Set(['splash', 'chapters', 'chapter', 'gameplay', 'result', 'profile', 'settings', 'how_to_play']);
  const state = {
    initialized:false,
    eligible:false,
    available:false,
    enabled:false,
    platform:'web',
    queued:0,
    observed:{},
    sent:{},
    dropped:{},
    lastEvent:null,
    lastError:'',
  };
  const queue = [];
  let plugin = null;
  let initialization = null;

  function count(bucket, name) {
    bucket[name] = (bucket[name] || 0) + 1;
  }

  function cleanValue(value) {
    if (typeof value === 'string') return value.trim().slice(0, 100);
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    return undefined;
  }

  function cleanEvent(name, parameters = {}) {
    const allowed = eventParams[name];
    if (!allowed) return null;
    const safe = {};
    for (const key of allowed) {
      const value = cleanValue(parameters[key]);
      if (value !== undefined && value !== '') safe[key] = value;
    }
    return {kind:'event', name, parameters:safe};
  }

  function nativePlugin() {
    const capacitor = window.Capacitor;
    state.platform = capacitor?.getPlatform?.() || 'web';
    if (!capacitor?.isNativePlatform?.() || !['ios', 'android'].includes(state.platform)) return null;
    if (!capacitor.isPluginAvailable?.('FirebaseAnalytics')) return null;
    plugin ||= capacitor.registerPlugin('FirebaseAnalytics');
    return plugin;
  }

  function record(record) {
    count(state.observed, record.name);
    state.lastEvent = record.name;
    if (!state.eligible || !state.enabled || !plugin) {
      if (!state.initialized || state.eligible) {
        if (queue.length === 50) queue.shift();
        queue.push(record);
        state.queued = queue.length;
      } else count(state.dropped, 'disabled');
      return;
    }
    send(record);
  }

  function send(record) {
    const operation = record.kind === 'screen'
      ? plugin.setCurrentScreen({screenName:record.screenName, screenClassOverride:'ColorRise'})
      : plugin.logEvent({name:record.name, params:record.parameters});
    Promise.resolve(operation).then(() => count(state.sent, record.name)).catch(error => {
      count(state.dropped, 'native_error');
      state.lastError = String(error?.message || error);
    });
  }

  function flush() {
    if (!state.enabled || !plugin) return;
    while (queue.length) send(queue.shift());
    state.queued = 0;
  }

  async function init() {
    if (initialization) return initialization;
    state.initialized = true;
    initialization = (async () => {
      plugin = nativePlugin();
      state.available = !!plugin;
      const buildInfo = globalThis.ColorRiseBuild;
      state.eligible = !!plugin && buildInfo?.buildConfiguration === 'release';
      if (!plugin) return false;
      try {
        if (!state.eligible) {
          await plugin.setEnabled({enabled:false});
          queue.length = 0;
          state.queued = 0;
          return false;
        }
        for (const type of ['AD_STORAGE', 'AD_USER_DATA', 'AD_PERSONALIZATION']) {
          await plugin.setConsent({type, status:'DENIED'});
        }
        await plugin.setEnabled({enabled:true});
        state.enabled = true;
        if (buildInfo.dataVersion) {
          await plugin.setUserProperty({key:'data_version', value:String(buildInfo.dataVersion).slice(0, 36)});
        }
        flush();
        return true;
      } catch (error) {
        queue.length = 0;
        state.queued = 0;
        state.lastError = String(error?.message || error);
        count(state.dropped, 'initialization_error');
        return false;
      }
    })();
    return initialization;
  }

  function track(name, parameters) {
    const event = cleanEvent(name, parameters);
    if (!event) {
      count(state.dropped, 'unknown_event');
      return false;
    }
    record(event);
    return true;
  }

  function screen(screenName) {
    if (!screens.has(screenName)) {
      count(state.dropped, 'unknown_screen');
      return false;
    }
    record({kind:'screen', name:'screen_view', screenName});
    return true;
  }

  function getState() {
    return {
      initialized:state.initialized,
      eligible:state.eligible,
      available:state.available,
      enabled:state.enabled,
      platform:state.platform,
      queued:state.queued,
      observed:{...state.observed},
      sent:{...state.sent},
      dropped:{...state.dropped},
      lastEvent:state.lastEvent,
      lastError:state.lastError,
    };
  }

  window.ColorRiseAnalytics = Object.freeze({init, ready:init, track, screen, getState});
  void init();
})();
