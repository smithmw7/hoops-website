(() => {
  const buildInfo = globalThis.ColorRiseBuild;
  if (!buildInfo?.appVersion || !buildInfo?.buildNumber || !['development', 'release'].includes(buildInfo.buildConfiguration)
      || buildInfo.debugOptionsEnabled !== (buildInfo.buildConfiguration === 'development')) {
    throw new Error('Generated Color Rise build metadata is missing or inconsistent. Run the build pipeline.');
  }
  const debugOptionsEnabled = buildInfo.debugOptionsEnabled;
  const developmentPuzzles = debugOptionsEnabled ? (globalThis.ColorRiseDevelopmentPuzzles || []) : [];
  const developmentLocation = {id:'development', name:'Development'};

  // Suppress browser edit/drag menus without canceling pointer, scroll, or form-control events.
  ['selectstart', 'contextmenu', 'dragstart'].forEach(type => {
    document.addEventListener(type, event => event.preventDefault(), {capture:true});
  });

  const board = document.querySelector('#board');
  const progress = document.querySelector('#progress');
  const count = document.querySelector('#count');
  const progressToggle = document.querySelector('#progressToggle');
  const unlockAllToggle = document.querySelector('#unlockAllToggle');
  // Session-only access override; earned completion and scores stay separate.
  let unlockAll = debugOptionsEnabled;
  // Debug display is intentionally session-only, including first-launch onboarding.
  let showProgress = false;
  const result = document.querySelector('#result');
  const levelEl = document.querySelector('#level');
  const resultEmblem = document.querySelector('#resultEmblem');
  const resultLayers = document.querySelector('#resultLayers');
  const resultShape = document.querySelector('#resultShape');
  const resultMark = document.querySelector('.result-mark');
  let resultCircles = [];
  const icon = document.querySelector('#resultIcon');
  const resultButton = document.querySelector('#resultButton');
  const resultReplay = document.querySelector('#resultReplay');
  const resultShare = document.querySelector('#resultShare');
  const lossTries = document.querySelector('#lossTries');
  const lossTriesCount = document.querySelector('#lossTriesCount');
  const shareStatus = document.querySelector('#shareStatus');
  const resultStars = document.querySelector('#resultStars');
  const resultLevelIdentity = document.querySelector('#resultLevelIdentity');
  const resultChapterName = document.querySelector('#resultChapterName');
  const resultLevelName = document.querySelector('#resultLevelName');
  const firstTryCallout = document.querySelector('#firstTryCallout');
  const firstTryMessage = document.querySelector('#firstTryMessage');
  const menu = document.querySelector('#menu');
  const splash = document.querySelector('#splash');
  const splashPlay = document.querySelector('#splashPlay');
  const game = document.querySelector('#game');
  const puzzleGrid = document.querySelector('#puzzleGrid');
  const lab = document.querySelector('#lab');
  lab.hidden = !debugOptionsEnabled;
  lab.inert = !debugOptionsEnabled;
  const labPreview = document.querySelector('#labPreview');
  const validation = document.querySelector('#validation');
  const playArea = document.querySelector('.play-area');
  const gameHeader = game.querySelector('header');
  const gameStats = document.querySelector('#puzzleStats');

  const chapters = window.ColorStackCampaign.chapters;
  let selectedChapter = null;
  let lastChapter = chapters[0].id;
  let homeScrollTop = 0;
  let level = 1;
  let ftueRules = ColorStackFTUE.rules(null);
  let ftueBoard = ColorStackFTUE.mountBoard(board, ftueRules);
  let resultMessageLabel = "";
  const audio = window.GameAudio;
  const haptics = window.GameHaptics;
  const analytics = window.ColorRiseAnalytics;
  const settings = document.querySelector('#settings');
  const labOpen = document.querySelector('#labOpen');
  labOpen.hidden = !debugOptionsEnabled;
  document.querySelector('#appVersion').textContent = buildInfo.appVersion;
  const motion = window.ScreenMotion;
  const winPulse = window.createWinPulse();
  const mergePlaybackRate = 1.1;
  let winTimeline = null;
  let winPulseConsumed = false;
  let finalMergeSeam = .5;
  let navigationBusy = false;
  let settingsOpener = null;
  let pausedMotions = [];
  const settingValues = new WeakMap();
  let groups = [];
  let dragging = null;
  let pointerStart = {x:0, y:0};
  let yStart = 0;
  // Player-feel tuning: maximum visual travel to either side while a stack is held.
  const dragHorizontalRange = 100;
  let dragStartIndex = 0;
  let moves = 0;
  let parMoves = 0;
  let levelStartedAt = 0;
  let failed = false;
  let currentPalette = [];
  let activeConfig = null;
  const puzzleCount = window.ColorStackCampaign.levels.length;
  let playerData = readPlayerData();
  let hasPriorAttempt = false;
  let firstTryThreeStarEligible = false;
  let baseHeight = 68;
  let rowGap = 14;
  let merging = null;
  let mergeTimeline = null;
  let settleTween = null;
  let resolveTimer = null;
  let dragPointerId = null;
  let entranceTween = null;
  let winPreparation = null;
  let fittedBoard = '';
  let fittedElements = [];
  let cascadeTimer = null;
  let recoveryTimer = null;
  let motionVersion = 0;
  const mergeSettings = readMergeSettings();
  const mergeSoundInput = document.querySelector('#mergeSoundInput');
  const mergeSoundStatus = document.querySelector('#mergeSoundStatus');
  let mergeSound = readMergeSound();
  let lastMergeSound = null;
  let mergeCueCount = 0;
  let resultTimeline = null;
  let resultScore = 0;
  let resultFirstTryThreeStar = false;
  let resultFirstTryMessage = '';
  let resultVersion = 0;
  let sharing = false;
  let labOpener = null;
  const cheat = window.createCheatController({
    snapshot:() => ({board:groups.map(group => [...group.steps]), colors:currentPalette,
      busy:boardPhase() !== 'idle' || !!resolveTimer,
      active:game.getAttribute('aria-hidden') === 'false' && result.getAttribute('aria-hidden') === 'true' && !settings.open && !document.querySelector('#profile').open}),
    fit:() => fitBoard(), showBoard:() => closeLab(true), openDetails:() => openLab(),
    sound:name => feedback(name)
  });
  const profile = window.createProfileController({
    feedback,
    canOpen:() => !navigationBusy && !settings.open && lab.getAttribute('aria-hidden') !== 'false' && (menu.getAttribute('aria-hidden') !== 'true' || (game.getAttribute('aria-hidden') === 'false' && result.getAttribute('aria-hidden') === 'true')),
    summary:profileSummary,
    onOpen:() => {
      pauseForPanel();
      analytics.track('profile_open');
      analytics.screen('profile');
      cheat.sync();
    },
    onClose:() => {resumeFromPanel(); trackVisibleScreen(); cheat.sync();}
  });

  function feedback(name, options) {
    audio.play(name, options);
    // Gameplay cues share the animation clock, while preferences remain independent.
    if (name === 'grab' || name === 'land' || (name === 'tick' && options?.scope === 'board')) return;
    const cue = {drop:'drop', tap:'tap', merge:'merge', pop:'ring', score:'star', win:'win', fail:'fail', error:'fail'}[name] || 'ui';
    haptics.cue(cue);
  }

  function readPlayerData() {
    const raw = localStorage.getItem('color-stack-player-v3');
    if (raw === null) return {version:3, scores:{}, stats:{}};
    const saved = JSON.parse(raw);
    if (saved?.version !== 3 || !saved.scores || typeof saved.scores !== 'object' || Array.isArray(saved.scores)
      || !saved.stats || typeof saved.stats !== 'object' || Array.isArray(saved.stats)) {
      throw new Error('Invalid color-stack-player-v3 record.');
    }
    return saved;
  }

  function persistPlayer(next) {
    localStorage.setItem('color-stack-player-v3', JSON.stringify(next));
    playerData = next;
  }

  function readMergeSettings() {
    const raw = localStorage.getItem('color-stack-merge-settings');
    if (raw === null) return {mode:'cascade', delay:0};
    const saved = JSON.parse(raw);
    if (!['cascade', 'together'].includes(saved?.mode) || !Number.isFinite(saved.delay)) {
      throw new Error('Invalid color-stack-merge-settings record.');
    }
    return {mode:saved.mode, delay:Math.max(0, Math.min(1000, Math.round(saved.delay / 50) * 50))};
  }

  function readMergeSound() {
    const saved = localStorage.getItem('color-rise-merge-sound');
    return saved === 'random' || /^pop-(0[1-9]|1[0-9]|20)$/.test(saved || '') ? saved : 'pop-01';
  }

  function playMergeSound(options) {
    const number = mergeSound === 'random' ? Math.floor(Math.random() * 20) + 1 : Number(mergeSound.slice(4));
    lastMergeSound = `pop-${String(number).padStart(2, '0')}`;
    mergeSoundStatus.textContent = `Last played: Pop sound ${number}`;
    feedback(lastMergeSound, options);
  }

  function boardPhase() {
    return dragging ? 'dragging' : entranceTween ? 'entering' : settleTween ? 'settling' : merging ? 'merging' : winTimeline ? 'winning' : cascadeTimer ? 'cascade-wait' : 'idle';
  }

  function updateBoardBusy() {
    const phase = boardPhase();
    board.setAttribute('aria-busy', String(phase !== 'idle'));
    board.dataset.phase = phase;
    cheat.sync();
  }

  function clearRecovery() {
    clearTimeout(recoveryTimer);
    recoveryTimer = null;
  }

  function watchMotion(seconds) {
    clearRecovery();
    const version = motionVersion;
    // A missing/interrupted animation callback must not leave input locked forever.
    recoveryTimer = setTimeout(() => {
      recoveryTimer = null;
      if (version === motionVersion && !document.hidden) recoverBoardMotion();
    }, seconds * 1000 + 1500);
  }

  function releaseDrag() {
    const el = dragging;
    const pointerId = dragPointerId;
    dragging = dragPointerId = null;
    haptics.endDrag();
    if (!el) return;
    el.removeEventListener('pointermove', moveDrag);
    el.removeEventListener('pointerup', endDrag);
    el.removeEventListener('pointercancel', endDrag);
    el.removeEventListener('lostpointercapture', endDrag);
    if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
  }

  function finishMergeRun(run) {
    run.top.steps = run.combined;
    updatePiece(run.top);
    run.top.el.classList.remove('absorbing');
    delete run.top.el.dataset.mergeRun;
    run.swallowed.forEach(({group}) => { ColorStackShape.release(group.el); group.el.remove(); });
  }

  function fitBoard() {
    if (!currentPalette.length || dragging || merging || entranceTween || settleTween || winTimeline) return;
    const config = activeConfig || campaignConfig(level);
    const style = getComputedStyle(playArea);
    const occupied = [progress.parentElement, count, document.querySelector('#cheatGuide')].filter(el => !el.hidden).reduce((sum, el) => {
      const css = getComputedStyle(el);
      return sum + el.offsetHeight + parseFloat(css.marginTop) + parseFloat(css.marginBottom);
    }, parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
    const available = playArea.clientHeight - occupied;
    const initialStacks = config.initialGroups?.length || currentPalette.length;
    const inset = config.introTarget ? 1 : 0;
    const fitted = (available - (initialStacks - 1 + inset) * rowGap + 6 * (currentPalette.length - initialStacks)) / (currentPalette.length + inset);
    // Keep a usable touch target; smaller screens scroll inside the play area.
    baseHeight = Math.max(44, Math.min(config.height, Math.floor(fitted)));
    const signature = `${baseHeight}/${rowGap}/${groups.map(group => group.steps.length).join(',')}`;
    if (signature === fittedBoard && groups.every((group, i) => fittedElements[i] === group.el)) return;
    fittedBoard = signature;
    fittedElements = groups.map(group => group.el);
    layout(false);
  }

  function cancelBoardMotion() {
    winPreparation?.kill();
    winPreparation = null;
    cheat.cancel();
    audio.stop('board');
    haptics.stop();
    motionVersion++;
    clearRecovery();
    winPulse.cancel();
    winTimeline = null;
    resolveTimer?.kill();
    cascadeTimer?.kill();
    entranceTween?.kill();
    settleTween?.kill();
    mergeTimeline?.kill();
    resolveTimer = cascadeTimer = entranceTween = settleTween = mergeTimeline = null;
    releaseDrag();
    gsap.killTweensOf(groups.map(group => group.el));
    if (merging) {
      merging.forEach(run => {
        gsap.killTweensOf(run.swallowed.map(({group}) => group.el));
        finishMergeRun(run);
      });
    }
    merging = null;
    gsap.set(groups.map(group => group.el), {
      x:0, scale:1, opacity:1, zIndex:0, filter:'none',
      '--shadow-y':'15px', '--shadow-blur':'14px', '--shadow-alpha':.53
    });
    updateBoardBusy();
  }

  function recoverBoardMotion() {
    if (settings.open || profile.state().open) return;
    if (dragging) endDrag({type:'pointercancel', pointerId:dragPointerId});
    if (boardPhase() === 'idle') return;
    // Commit stored merge contents before removing swallowed elements, even before the color-swap frame.
    cancelBoardMotion();
    fittedBoard = '';
    fitBoard();
    resolveBoard();
  }

  const presets = {
    gentle:{pieces:5,height:64,hue:22,value:7,sat:76,assist:'value'},
    core:{pieces:7,height:52,hue:14,value:4,sat:86,assist:'none'},
    expert:{pieces:10,height:46,hue:9,value:3,sat:84,assist:'none'},
    limit:{pieces:13,height:44,hue:6,value:2,sat:80,assist:'pattern'}
  };
  let labConfig = {...presets.core};

  function chapterFor(number) {
    return chapters.find(chapter => number >= chapter.startLevel && number < chapter.startLevel + chapter.levelCount);
  }

  function chapterProgress(chapter, scores = puzzleScores()) {
    const completed = Array.from({length:chapter.levelCount}, (_,i) => scores[chapter.startLevel+i]).filter(Boolean).length;
    return {id:chapter.id, name:chapter.name, completed, total:chapter.levelCount,
      unlocked:chapter.startLevel <= campaignProgress(scores).unlockedThrough};
  }

  function campaignConfig(number) {
    return window.ColorStackCampaign.get(number);
  }

  function paletteFromConfig(config) {
    if (Array.isArray(config.palette)) return config.palette.slice();
    const start = config.seed ?? 326;
    return Array.from({length:config.pieces}, (_, i) => {
      if (config.assist === 'mono') {
        return `hsl(0 0% ${24 + i * (60 / (config.pieces - 1))}%)`;
      }
      const hue = (start + i * config.hue) % 360;
      const light = config.assist === 'value'
        ? 27 + i * (58 / (config.pieces - 1))
        : Math.max(26, Math.min(76, 52 + (i - (config.pieces - 1) / 2) * config.value));
      return `hsl(${hue} ${config.sat}% ${light}%)`;
    });
  }

  function puzzleScores() {
    const scores = {};
    const merge = saved => {
      Object.entries(saved).forEach(([key, stars]) => {
        const number = Number(key);
        if (Number.isInteger(number) && number >= 1 && number <= puzzleCount && Number.isInteger(stars) && stars >= 1 && stars <= 3) {
          scores[number] = Math.max(scores[number] || 0, stars);
        }
      });
    };
    merge(playerData.scores);
    return {...scores};
  }

  function campaignProgress(scores = puzzleScores()) {
    let next = 1;
    while (next <= puzzleCount && scores[next]) next++;
    return {current:Math.min(next, puzzleCount), unlockedThrough:unlockAll ? puzzleCount : Math.min(puzzleCount, Math.max(next, ...Object.keys(scores).map(n=>Number(n)+1))),
      completed:Object.keys(scores).length, finished:next > puzzleCount};
  }

  function saveCompletion(number, stars) {
    if (activeConfig || !Number.isInteger(number) || number < 1 || number > puzzleCount || !Number.isInteger(stars) || stars < 1 || stars > 3) return;
    const scores = puzzleScores();
    scores[number] = Math.max(scores[number] || 0, stars);
    persistPlayer({...playerData, scores});
  }

  function puzzleStats() {
    const stats = {};
    const merge = saved => {
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return;
      for (const [key, value] of Object.entries(saved)) {
        const number = Number(key);
        if (!Number.isInteger(number) || number < 1 || number > puzzleCount || !value || typeof value !== 'object' || Array.isArray(value)) continue;
        stats[number] = window.ColorStackRecords.merge(stats[number], value, campaignConfig(number).revision);
      }
    };
    merge(playerData.stats);
    return stats;
  }

  function statsFor(number = level) {
    return {...(puzzleStats()[number] || {best:null, tries:0, firstTryThreeStar:false})};
  }

  function levelAnalytics(parameters = {}) {
    if (activeConfig || !Number.isInteger(level) || level < 1 || level > puzzleCount) return null;
    const location = chapterFor(level);
    const campaign = campaignConfig(level);
    return {
      level_name:`${location.id}_${campaign.chapterLevel}`,
      level_number:level,
      chapter_id:location.id,
      chapter_level:campaign.chapterLevel,
      layout_revision:campaign.revision,
      attempt:statsFor().tries,
      ...parameters,
    };
  }

  function trackLevel(name, parameters = {}) {
    const payload = levelAnalytics(parameters);
    if (payload) analytics.track(name, payload);
  }

  function levelDuration() {
    return levelStartedAt ? Math.max(0, Math.round((performance.now() - levelStartedAt) / 1000)) : 0;
  }

  function trackRestart(source) {
    trackLevel('level_restart', {moves, duration_seconds:levelDuration(), restart_source:source});
  }

  function trackVisibleScreen() {
    if (!splash.hidden) analytics.screen('splash');
    else if (result.getAttribute('aria-hidden') === 'false') analytics.screen('result');
    else if (menu.getAttribute('aria-hidden') === 'false') analytics.screen(selectedChapter ? 'chapter' : 'chapters');
    else analytics.screen('gameplay');
  }

  function profileSummary() {
    const scores = puzzleScores();
    const stats = puzzleStats();
    return {
      completed:Object.keys(scores).length,
      stars:Object.values(scores).reduce((sum, stars) => sum + stars, 0),
      tries:Object.values(stats).reduce((sum, record) => sum + record.tries, 0),
      firstTryThreeStarWins:Object.values(stats).filter(record => record.firstTryThreeStar === true).length
    };
  }

  function updatePuzzleStats() {
    const footer = document.querySelector('#puzzleStats');
    const visible = !activeConfig && result.getAttribute('aria-hidden') === 'false' && result.dataset.success === 'true';
    footer.hidden = !visible;
    footer.setAttribute('aria-hidden', String(!visible));
    if (activeConfig) return;
    const {best, tries} = statsFor();
    const bestLabel = document.querySelector('#bestStat');
    bestLabel.hidden = best === null;
    bestLabel.textContent = best === null ? '' : `Best ${best}`;
    if (best === null) bestLabel.removeAttribute('aria-label');
    else bestLabel.setAttribute('aria-label', `Best ${best} ${best === 1 ? 'move' : 'moves'}`);
    const triesLabel = document.querySelector('#triesStat');
    triesLabel.hidden = false;
    triesLabel.textContent = `Tries ${tries}`;
    triesLabel.setAttribute('aria-label', `${tries} total ${tries === 1 ? 'try' : 'tries'}`);
  }

  function recordPuzzleStat(kind, firstTryThreeStar = false) {
    if (activeConfig || !Number.isInteger(level) || level < 1 || level > puzzleCount) return;
    const stats = puzzleStats();
    const record = stats[level] || window.ColorStackRecords.merge(null, null, campaignConfig(level).revision);
    if (kind === 'attempt') record.tries = Math.min(Number.MAX_SAFE_INTEGER, record.tries + 1);
    else if (kind === 'win') {
      record.best = record.best === null ? moves : Math.min(record.best, moves);
      record.bestByRevision[record.bestRevision] = record.best;
      record.firstTryThreeStar = record.firstTryThreeStar === true || firstTryThreeStar === true;
    }
    stats[level] = record;
    persistPlayer({...playerData, stats});
  }

  function shuffledWithoutMatches(length) {
    const source = Array.from({length}, (_, i) => i);
    while (true) {
      const a = [...source];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      if (a.every((value, i) => i === 0 || Math.abs(value - a[i - 1]) !== 1)) return a;
    }
  }

  function challengeLayout(length, number) {
    const order = campaignConfig(number).order;
    if (order.length !== length) throw new Error('Campaign piece count does not match its layout.');
    return order.slice();
  }

  function pieceHeight(group) {
    return group.steps.length * baseHeight - (group.steps.length - 1) * 6;
  }

  function positions() {
    const ys = [];
    const intro = introActive();
    const pending = intro && groups[1].steps.length===1 && groups[1].steps[0]===ftueRules.target.rank;
    const inset = intro ? baseHeight + rowGap : 0;
    let y = pending ? inset : 0;
    groups.forEach((group, i) => {
      ys[i] = y;
      y += pieceHeight(group) + rowGap;
    });
    return {ys, height: Math.max(baseHeight, y - rowGap + (intro && !pending ? inset : 0))};
  }

  function introActive() {
    return !!ftueRules.target && groups.length===2;
  }

  function updateIntroTarget() {
    const slot=board.querySelector('.ftue-drop-target');
    if(!slot)return;
    const active=introActive();
    slot.hidden=!active;
    slot.style.height=`${baseHeight}px`;
  }

  function gradient(group) {
    const colors = group.steps.map(step => currentPalette[step]);
    const fill = colors.length === 1 ? colors[0] : `linear-gradient(to bottom, ${colors.join(',')})`;
    const flow = direction(group.steps);
    const layers = [];
    for (const edge of ['top', 'bottom']) {
      const rank = edge === 'top' ? group.steps[0] : group.steps.at(-1);
      // Loose colors can join in either direction. Joined stacks have one
      // continuation per end, determined by their actual internal order.
      const neighbors = (flow === 0 ? [rank - 1, rank + 1]
        : [rank + (edge === 'top' ? -flow : flow)])
        .filter(step => step >= 0 && step < currentPalette.length);
      neighbors.forEach((step, index) => {
        const tint = `color-mix(in srgb, ${currentPalette[step]} 46%, transparent)`;
        if (neighbors.length === 1) {
          layers.push(`linear-gradient(to ${edge === 'top' ? 'bottom' : 'top'}, ${tint} 0%, transparent min(34px, 44%))`);
        } else {
          // Keep both possible connecting hues distinct across each edge.
          layers.push(`radial-gradient(ellipse 70% 34px at ${index === 0 ? '15%' : '85%'} ${edge}, ${tint} 0%, transparent 100%)`);
        }
      });
    }
    return [...layers, fill].join(',');
  }

  function updatePiece(group) {
    group.face.style.background = gradient(group);
    group.el.classList.toggle('ftue-yellow', !!ftueRules.target && group.steps.length===1 && group.steps[0]===ftueRules.target.rank);
    const patterned = activeConfig?.assist === 'pattern';
    group.el.classList.toggle('patterned', patterned);
    if (patterned) {
      const average = group.steps.reduce((sum, step) => sum + step, 0) / group.steps.length;
      group.el.style.setProperty('--stripe', `${8 + average * 2.5}px`);
    }
    group.el.dataset.pieceLabel = `Color piece ${group.steps.join(', ')}`;
    group.el.setAttribute('aria-label', group.el.dataset.pieceLabel);
  }

  function makeGroup(step) {
    const el = document.createElement('button');
    el.className = 'piece';
    el.setAttribute('role', 'listitem');
    board.appendChild(el);
    el.addEventListener('pointerdown', startDrag);
    const group = {steps:Array.isArray(step)?step.slice():[step], el, face:ColorStackShape.attach(el)};
    updatePiece(group);
    return group;
  }

  function indexOf(el) { return groups.findIndex(group => group.el === el); }

  function layout(animate = true, exclude = null) {
    const {ys, height} = positions();
    board.style.height = `${height}px`;
    updateIntroTarget();
    groups.forEach((group, i) => {
      group.el.dataset.index = i;
      // CSS scale also scales GSAP's layout translation; the idle pulse cancels that offset.
      group.el.style.setProperty('--pulse-layout-y', `${ys[i]}px`);
      const label = group.el.querySelector('.cheat-row');
      if (label) label.textContent = i + 1;
      if (group.el !== dragging && group.el !== exclude) {
        gsap.to(group.el, {
          y: ys[i],
          height: pieceHeight(group),
          duration: animate ? (matchMedia('(prefers-reduced-motion: reduce)').matches ? .12 : .28) : 0,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    });
  }

  function direction(steps) {
    if (steps.length < 2) return 0;
    const d = steps[1] - steps[0];
    return steps.every((v, i) => i === 0 || v - steps[i - 1] === d) && Math.abs(d) === 1 ? d : null;
  }

  function canJoin(a, b) {
    return direction([...a.steps, ...b.steps]) !== null;
  }

  function anyJoinRemains() {
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        if (canJoin(groups[i], groups[j]) || canJoin(groups[j], groups[i])) return true;
      }
    }
    return false;
  }

  function startDrag(e) {
    if (boardPhase() !== 'idle' || failed || game.inert || playArea.inert || game.getAttribute('aria-hidden') === 'true' || e.isPrimary === false || e.button !== 0) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); }
    catch { return; }
    resolveTimer?.kill();
    resolveTimer = null;
    dragging = e.currentTarget;
    ftueBoard.begin(e, dragging);
    dragging.classList.add('has-been-picked-up');
    dragPointerId = e.pointerId;
    // Request pickup feedback before updating its visual state.
    feedback('grab', {scope:'board'});
    gsap.killTweensOf(dragging);
    gsap.set(dragging, {x:0, opacity:1, scale:1});
    pointerStart = {x:e.clientX, y:e.clientY};
    yStart = Number(gsap.getProperty(dragging, 'y'));
    dragStartIndex = indexOf(dragging);
    gsap.to(dragging, {
      scale: 1.035,
      zIndex: 5,
      '--shadow-y':'25px', '--shadow-blur':'22.5px', '--shadow-alpha':.8,
      duration: .2,
      ease: 'power2.out'
    });
    dragging.addEventListener('pointermove', moveDrag);
    dragging.addEventListener('pointerup', endDrag);
    dragging.addEventListener('pointercancel', endDrag);
    dragging.addEventListener('lostpointercapture', endDrag);
    updateBoardBusy();
    haptics.startDrag();
  }

  function elasticPosition(value, min, max) {
    const edge = value < min ? min : value > max ? max : value;
    const distance = value - edge;
    const limit = 32;
    // Continuous at the boundary, with progressively less travel as the finger pulls farther.
    return edge + distance / (1 + Math.abs(distance) / limit);
  }

  function moveDrag(e) {
    if (!dragging || e.pointerId !== dragPointerId) return;
    ftueBoard.move(e);
    const old = indexOf(dragging);
    const slots = ColorStackDrag.insertionPositions(groups.map(pieceHeight), old, rowGap);
    if(introActive())slots[1]+=baseHeight+rowGap;
    const y = elasticPosition(yStart + e.clientY - pointerStart.y, slots[0], slots.at(-1));
    const x = ColorStackDrag.horizontalOffset(e.clientX - pointerStart.x, dragHorizontalRange);
    gsap.set(dragging, {x, y});
    const next = ColorStackDrag.closestInsertion(y, slots, old);
    if (next !== old) {
      const [moved] = groups.splice(old, 1);
      groups.splice(next, 0, moved);
      layout(true);
      feedback('tick', {scope:'board', rate:1 + next * .025});
      haptics.cue('slot');
    }
  }

  function endDrag(e) {
    const el = dragging;
    if (!el || e?.pointerId !== dragPointerId) return;
    const cancelled = e.type !== 'pointerup';
    const moved = indexOf(el) !== dragStartIndex;
    // Release is the interaction: the visual settle continues after its feedback.
    if (!cancelled) feedback(moved ? 'drop' : 'tap', {scope:'board'});
    releaseDrag();
    if (cancelled) {
      const [group] = groups.splice(indexOf(el), 1);
      groups.splice(dragStartIndex, 0, group);
    }
    const endIndex = indexOf(el);
    ftueBoard.end({ solved: !cancelled && groups[0].steps[0] === ftueRules.target?.rank, cancelled });
    if (!cancelled && moved) moves++;
    const targetY = positions().ys[endIndex];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const overshoot = reduce || cancelled ? 0 : Math.max(-3, Math.min(3, (targetY - Number(gsap.getProperty(el, 'y'))) * .08));
    gsap.killTweensOf(el);
    layout(true, el);
    settleTween = gsap.timeline({onComplete:() => {
      gsap.set(el, {zIndex:0});
      settleTween = null;
      clearRecovery();
      updateBoardBusy();
      resolveBoard();
    }}).to(el, {
      x:0,
      duration:reduce ? .12 : .48,
      ease:reduce ? 'power2.out' : 'elastic.out(1,.45)'
    }, 0).to(el, {
      y:targetY + overshoot, scaleX:reduce || cancelled ? 1 : 1.012, scaleY:reduce || cancelled ? 1 : .985,
      '--shadow-y':'15px', '--shadow-blur':'14px', '--shadow-alpha':.53,
      duration:reduce ? .08 : .2, ease:'power3.out'
    }, 0).to(el, {y:targetY, scaleX:1, scaleY:1, duration:reduce ? .04 : .1, ease:'power2.out'}, reduce ? .08 : .2);
    updateBoardBusy();
    watchMotion(settleTween.duration());
  }

  function visibleBounds(group, offset = 0) {
    const height = Number(gsap.getProperty(group.el, 'height'));
    const scale = Number(gsap.getProperty(group.el, 'scaleY'));
    return {min:offset + height * (1 - scale) / 2, max:offset + height * (1 + scale) / 2};
  }

  function renderMerge() {
    if (!merging) return;
    updateIntroTarget();
    const runs = new Map(merging.map(run => [run.top, run]));
    let y = 0;
    groups.forEach((group, index) => {
      let bounds = visibleBounds(group);
      const run = runs.get(group);
      if (run) {
        run.swallowed.forEach(member => {
          const other = visibleBounds(member.group, member.offset);
          bounds = {min:Math.min(bounds.min, other.min), max:Math.max(bounds.max, other.max)};
        });
        run.swallowed.forEach(member => gsap.set(member.group.el, {y:y - bounds.min + member.offset}));
      }
      gsap.set(group.el, {y:y - bounds.min});
      group.el.dataset.index = index;
      y += bounds.max - bounds.min + rowGap;
    });
    board.style.height = `${Math.max(0, y - rowGap)}px`;
  }

  function findMergeRuns() {
    const runs = [];
    for (let i = 0; i < groups.length - 1; i++) {
      if (!canJoin(groups[i], groups[i + 1])) continue;
      const members = [groups[i], groups[++i]];
      let combined = members.flatMap(group => group.steps);
      if (mergeSettings.mode === 'together') {
        while (i + 1 < groups.length && direction([...combined, ...groups[i + 1].steps]) !== null) {
          members.push(groups[++i]);
          combined = members.flatMap(group => group.steps);
        }
      }
      runs.push({members, combined});
      if (mergeSettings.mode === 'cascade') break;
    }
    return runs;
  }

  function mergeRuns(candidates) {
    // A single layout pass reserves each run's full animated bounds, including every swallowed piece.
    gsap.killTweensOf(groups.map(group => group.el));
    gsap.set(groups.map(group => group.el), {scale:1, x:0, opacity:1});
    layout(false);
    const version = motionVersion;
    merging = candidates.map(({members, combined}, index) => {
      const top = members[0];
      if (combined.length === currentPalette.length) {
        // Keep the original joining boundary before absorption changes top.steps.
        // Together mode uses the last boundary in the simultaneously connected run.
        const prefix = combined.length - members[members.length - 1].steps.length;
        finalMergeSeam = (prefix * (baseHeight - 6) + 3) / (combined.length * (baseHeight - 6) + 6);
      }
      let offset = pieceHeight(top) + rowGap;
      const swallowed = members.slice(1).map(group => {
        const member = {group, offset};
        offset += pieceHeight(group) + rowGap;
        return member;
      });
      members.forEach(group => {
        group.el.classList.add('absorbing');
        group.el.dataset.mergeRun = `${version}-${index}`;
      });
      return {top, swallowed, combined};
    });
    const absorbed = new Set(merging.flatMap(run => run.swallowed.map(({group}) => group)));
    groups = groups.filter(group => !absorbed.has(group));
    updateBoardBusy();
    updateProgress();

    const tl = mergeTimeline = gsap.timeline({
      onUpdate: renderMerge,
      onComplete: () => {
        if (version !== motionVersion) return;
        merging.forEach(finishMergeRun);
        merging = mergeTimeline = null;
        clearRecovery();
        updateBoardBusy();
        fitBoard();
        resolveBoard(true);
      }
    });
    merging.forEach(run => {
      const targetHeight = run.combined.length * baseHeight - (run.combined.length - 1) * 6;
      tl.to(run.top.el, {
        scaleX:1.025, scaleY:.97,
        duration:.24, ease:'power2.inOut'
      }, 0);
      run.swallowed.forEach((member, i) => {
        tl.to(member.group.el, {
          scaleX:1.045, scaleY:.76,
          duration:.3, ease:'power3.in'
        }, 0)
          .to(member, {offset:member.offset - rowGap * (i + 1) - 13, duration:.3, ease:'power3.in'}, 0)
          .to(member.group.el, {scaleX:.9, scaleY:.35, opacity:0, duration:.28, ease:'power2.in'}, .3)
          .to(member, {offset:member.offset * .65, duration:.28, ease:'power2.in'}, .3);
      });
      tl.call(() => {
        if (version !== motionVersion) return;
        run.top.steps = run.combined;
        updatePiece(run.top);
        // Reveal the joined colors at their final spacing as the piece grows.
        // A percentage-sized background squeezes the entire new gradient into
        // the old piece for the first expansion frames.
        run.top.face.style.backgroundSize = `100% ${targetHeight}px`;
        run.top.face.style.backgroundRepeat = 'no-repeat';
      }, null, .3)
        .to(run.top.el, {
          height:targetHeight, scaleX:1.018, scaleY:1.015,
          duration:.46, ease:'expo.inOut'
        }, .3)
        .to(run.top.el, {
          keyframes:[
            {scaleX:.985, scaleY:1.018, duration:.12, ease:'power2.out'},
            {scaleX:1.012, scaleY:.992, duration:.15, ease:'power2.inOut'},
            {scaleX:.996, scaleY:1.004, duration:.16, ease:'power2.inOut'},
            {scaleX:1, scaleY:1, duration:.3, ease:'elastic.out(1,.42)'}
          ]
        }, .76);
    });
    // One cue per batch, synchronized to absorption even when cascade speed changes.
    tl.call(() => {
      if (version !== motionVersion) return;
      playMergeSound({scope:'board', rate:1 + mergeCueCount * .025});
      mergeCueCount++;
    }, null, .3);
    // Faster cascade cadence, while still finishing each merge before starting the next.
    tl.timeScale((mergeSettings.mode === 'cascade' ? 2 : 1) * mergePlaybackRate);
    watchMotion(tl.duration() / tl.timeScale());
  }

  function updateProgress() {
    const total = currentPalette.length - 1;
    const done = total - (groups.length - 1);
    gsap.to(progress, {width:`${(done / total) * 100}%`, duration:.45, ease:'power2.out', overwrite:true});
    count.textContent = `${done}/${total}`;
  }

  function resolveBoard(afterMerge = false) {
    if (boardPhase() !== 'idle' || game.getAttribute('aria-hidden') === 'true') return;
    resolveTimer?.kill();
    resolveTimer = null;
    const candidates = findMergeRuns();
    updateProgress();
    if (candidates.length) {
      if (afterMerge && mergeSettings.mode === 'cascade' && mergeSettings.delay > 0) {
        const version = motionVersion;
        cascadeTimer = gsap.delayedCall(mergeSettings.delay / 1000, () => {
          if (version !== motionVersion) return;
          cascadeTimer = null;
          clearRecovery();
          updateBoardBusy();
          resolveBoard();
        });
        updateBoardBusy();
        watchMotion(mergeSettings.delay / 1000);
      } else {
        mergeRuns(candidates);
      }
      return;
    }
    if (groups.length === 1) {
      if (winPulseConsumed) showResult(true);
      else {
        winPulseConsumed = true;
        const version = motionVersion;
        const group = groups[0];
        winTimeline = winPulse.play(group.el, group.steps.map(step => currentPalette[step]), finalMergeSeam, () => {
          winTimeline = null;
          clearRecovery();
          updateBoardBusy();
          if (version === motionVersion && game.getAttribute('aria-hidden') === 'false') showResult(true);
        });
        winTimeline.call(() => {
          if (version === motionVersion) haptics.cue('ring');
        }, null, 'burst');
        winTimeline.timeScale(mergePlaybackRate);
        updateBoardBusy();
        watchMotion(winTimeline.duration() / winTimeline.timeScale());
      }
    } else if (!anyJoinRemains()) {
      resolveTimer = gsap.delayedCall(.3, () => {
        resolveTimer = null;
        if (boardPhase() === 'idle' && game.getAttribute('aria-hidden') === 'false') showResult(false);
      });
    }
  }

  const starPath = 'M26.60 6.31Q28.00 4.00 29.40 6.31L35.05 15.62Q35.94 17.08 37.59 17.47L48.20 19.96Q50.83 20.58 49.06 22.63L41.95 30.88Q40.84 32.17 40.98 33.87L41.88 44.73Q42.11 47.42 39.62 46.37L29.57 42.16Q28.00 41.50 26.43 42.16L16.38 46.37Q13.89 47.42 14.12 44.73L15.02 33.87Q15.16 32.17 14.05 30.88L6.94 22.63Q5.17 20.58 7.80 19.96L18.41 17.47Q20.06 17.08 20.95 15.62Z';
  const firstTryMessages = ['First try!', 'Amazing!', 'Perfect game!', 'Flawless!', 'Nailed it!'];
  function starMarkup(className, earned) {
    return `<svg class="rating-star ${className}" viewBox="0 0 56 56" aria-hidden="true"><path class="star-slot" d="${starPath}"/>${earned ? `<g class="star-earned"><path class="star-fill" d="${starPath}"/></g>` : ''}</svg>`;
  }

  function revealFirstTryAccolade() {
    if (!resultFirstTryMessage || result.getAttribute('aria-hidden') === 'true') return;
    firstTryMessage.textContent = resultFirstTryMessage;
    firstTryCallout.setAttribute('aria-label', resultMessageLabel);
  }

  function prepareResultLayers(success) {
    // A solved stack can run in either direction. Preserve that order, center out.
    const steps = success && groups.length === 1 ? groups[0].steps : currentPalette.map((_, i) => i);
    const colors = success ? steps.map(step => currentPalette[step]) : ['#ff5068', '#ff5068', '#ff5068'];
    const radius = 34 + colors.length * 7;
    const extent = success ? (radius + 14) * 2 : 120;
    resultMark.setAttribute('viewBox', `${60 - extent / 2} ${60 - extent / 2} ${extent} ${extent}`);
    resultMark.style.setProperty('--result-size', `${success ? extent * 1.23 : 144}px`);
    resultShape.style.fill = success ? '#f0eee7' : '#ff5068';
    resultLayers.replaceChildren();
    const rings = colors.map((color, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '60'); circle.setAttribute('cy', '60'); circle.setAttribute('r', 34 + (i + 1) * 7);
      circle.setAttribute('class', `result-circle ${success ? 'result-gradient-ring' : 'result-failure-ring'}`);
      circle.dataset.step = success ? steps[i] : '';
      circle.style.fill = color;
      if (!success) circle.style.fillOpacity = [.32, .18, .1][i];
      return circle;
    });
    // Larger disks sit behind smaller ones, leaving an even band for every color.
    [...rings].reverse().forEach(circle => resultLayers.appendChild(circle));
    resultCircles = [resultShape, ...rings];
    return rings;
  }

  function showResult(success) {
    if (result.getAttribute('aria-hidden') === 'false') return;
    cheat.sync();
    audio.stop('result');
    resultTimeline?.kill();
    resultVersion++;
    failed = !success;
    const stars = success ? (moves === parMoves ? 3 : moves === parMoves + 1 ? 2 : 1) : 0;
    const firstCompletion = !activeConfig && success && !puzzleScores()[level];
    resultScore = stars;
    resultFirstTryThreeStar = success && stars === 3 && firstTryThreeStarEligible;
    if (success) { saveCompletion(level, stars); recordPuzzleStat('win', resultFirstTryThreeStar); }
    trackLevel('level_end', {
      moves,
      par_moves:parMoves,
      stars,
      duration_seconds:levelDuration(),
      success:success ? 1 : 0,
      end_reason:success ? 'complete' : 'dead_end',
      first_try:!hasPriorAttempt,
      first_try_three_star:resultFirstTryThreeStar,
    });
    if (firstCompletion && ftueRules.target) {
      trackLevel('tutorial_complete', {moves, duration_seconds:levelDuration()});
    }
    if (resultFirstTryThreeStar) {
      trackLevel('unlock_achievement', {achievement_id:'first_try_three_star'});
    }
    analytics.screen('result');
    resultFirstTryMessage = resultFirstTryThreeStar ? firstTryMessages[(profileSummary().firstTryThreeStarWins - 1) % firstTryMessages.length] : '';
    const completion = ColorStackFTUE.completion(ftueRules, success, resultFirstTryMessage);
    resultFirstTryMessage = completion.text;
    resultMessageLabel = completion.label;
    ColorStackFTUE.applyResult(result, ftueRules, success);
    gsap.set(firstTryCallout, {clearProps:'opacity,transform'});
    firstTryMessage.textContent = '';
    firstTryCallout.removeAttribute('aria-label');
    firstTryCallout.hidden = !resultFirstTryMessage;
    resultStars.innerHTML = Array.from({length:3}, (_, i) => starMarkup('result-star', i < stars)).join('');
    resultStars.setAttribute('aria-label', `${stars} of 3 stars`);
    const location = activeConfig ? null : chapterFor(level);
    const resultLevelNumber = activeConfig ? null : campaignConfig(level).chapterLevel;
    resultChapterName.textContent = activeConfig?.development ? 'DEVELOPMENT' : activeConfig ? 'COLOR LAB' : location.name;
    resultLevelName.textContent = activeConfig?.development ? activeConfig.name.toUpperCase() : activeConfig ? 'CUSTOM LEVEL' : `LEVEL ${resultLevelNumber}`;
    groups.forEach(group => group.el.classList.add('locked'));
    icon.setAttribute('d', 'm42 61 12 12 25-28');
    const hasNext = activeConfig?.development ? activeConfig.number < developmentPuzzles.length : !activeConfig && level < puzzleCount;
    resultButton.hidden = !success;
    resultButton.setAttribute('aria-label', activeConfig?.development ? (hasNext ? 'Next experiment' : 'Back to Development') : hasNext ? (level % 20 === 0 ? `Explore ${chapterFor(level + 1).name}` : 'Next level') : 'Back to chapters');
    document.querySelector('#resultTitle').textContent = success ? 'Level complete' : 'Try again';
    result.dataset.success = success ? 'true' : 'false';
    result.setAttribute('aria-hidden', 'false');
    result.inert = true;
    gameHeader.inert = playArea.inert = true;
    updatePuzzleStats();
    lossTries.hidden = success || !!activeConfig;
    resultShare.hidden = !success;
    if (success) dismissGameplay();
    else {
      showLossBanner();
      return;
    }
    shareStatus.textContent = '';
    resultShare.disabled = sharing;

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rings = prepareResultLayers(success);
    const slots = resultStars.querySelectorAll('.result-star');
    const earned = resultStars.querySelectorAll('.star-earned');
    const ringStagger = success ? .16 : .14;
    const lastRingStart = .12 + (rings.length - 1) * ringStagger;
    const landing = success ? lastRingStart + .66 : .94;
    const starsAt = reduceMotion ? 0 : landing + .38;
    const starStagger = .22;
    const starDuration = reduceMotion ? .1 : .44;
    const identityAt = reduceMotion ? 0 : Math.max(.12, landing - .38);
    result.dataset.rings = success ? rings.length : 0;
    motion.enter(result, resultActions(), {onComplete:() => {
      result.inert = false;
      (success ? resultButton : resultReplay).focus({preventScroll:true});
    }});
    gsap.set(resultEmblem, {y:0});
    gsap.set(resultCircles, {svgOrigin:'60 60', scale:1, opacity:1});
    gsap.set(resultLevelIdentity, {y:reduceMotion ? 0 : 6, opacity:0});
    resultTimeline = gsap.timeline()
      .fromTo('.result-card', {opacity:0}, {opacity:1, duration:reduceMotion ? .1 : .18, ease:'power2.out'}, 0)
      .fromTo(resultLevelIdentity, {y:reduceMotion ? 0 : 6, opacity:0}, {y:0, opacity:1, duration:reduceMotion ? .1 : .38, ease:'power2.out'}, identityAt);
    if (!reduceMotion) {
      resultTimeline
        .fromTo(resultShape, {scale:.4, opacity:0}, {scale:1.08, opacity:1, duration:.28, ease:'power3.out'}, 0)
        .to(resultShape, {scale:1, duration:.2, ease:'power2.inOut'}, .28)
        .call(() => feedback('pop', {scope:'result', rate:.82, volume:.75}), null, 0);
      rings.forEach((circle, i) => {
        const start = .12 + i * ringStagger;
        resultTimeline
          .fromTo(circle, {scale:.7, opacity:0}, {scale:1.045, opacity:1, duration:.32, ease:'power3.out'}, start)
          .to(circle, {scale:1, duration:.2, ease:'power2.inOut'}, start + .32)
          .call(() => feedback('pop', {scope:'result', rate:.9 + .4 * i / Math.max(1, rings.length - 1), volume:.75}), null, start);
      });
      resultTimeline
        .fromTo(resultEmblem, {y:12}, {y:-10, duration:.3, ease:'power3.out'}, 0)
        .to(resultEmblem, {y:-18, duration:.22, ease:'power2.out'}, success ? Math.max(.32, lastRingStart * .5) : .32)
        .to(resultEmblem, {y:4, duration:.3, ease:'power2.in'}, landing - .3)
        .to(resultEmblem, {y:-2, duration:.1, ease:'power2.out'}, landing)
        .to(resultEmblem, {y:0, duration:.18, ease:'power2.inOut'}, landing + .1)
        .call(() => feedback('land', {scope:'result'}), null, landing);
    }
    resultTimeline
      .fromTo(icon, {strokeDasharray:80, strokeDashoffset:80}, {strokeDashoffset:0, duration:reduceMotion ? 0 : .3}, reduceMotion ? 0 : landing)
      .fromTo(slots, {opacity:0}, {opacity:1, duration:reduceMotion ? 0 : .18}, reduceMotion ? 0 : starsAt - .14);
    if (earned.length) resultTimeline.fromTo(earned, {svgOrigin:'28 28', scale:reduceMotion ? 1 : .35, rotation:reduceMotion ? 0 : -10, opacity:0}, {scale:1, rotation:0, opacity:1, duration:starDuration, stagger:starStagger, ease:reduceMotion ? 'none' : 'back.out(1.8)'}, starsAt);
    earned.forEach((star, i) => {
      resultTimeline.call(() => feedback('score', {scope:'result', rate:1 + i * .12}), null, starsAt + i * starStagger);
    });
    if (resultFirstTryMessage) {
      // Let the final star settle and its complete cue finish before the badge.
      const lastStar = Math.max(0, earned.length - 1);
      const scoreDuration = window.COLOR_STACK_SFX.cues.score.duration / (1 + lastStar * .12);
      const calloutAt = starsAt + lastStar * starStagger + Math.max(starDuration, scoreDuration) + .08;
      resultTimeline.call(() => {
        revealFirstTryAccolade();
        if (resultFirstTryThreeStar) feedback('game-perfect-2', {scope:'result'});
      }, null, calloutAt);
      resultTimeline.fromTo(firstTryCallout, {y:reduceMotion ? 0 : 5, opacity:0}, {y:0, opacity:1, duration:reduceMotion ? .1 : .25, ease:'power2.out'}, calloutAt);
    }
    if (!resultFirstTryThreeStar) resultTimeline.call(() => feedback(success ? 'win' : 'fail', {scope:'result'}), null, reduceMotion ? 0 : landing + .04);
    result.dataset.revealDuration = resultTimeline.duration();
    result.scrollTop = 0;
  }

  function showLossBanner() {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tries = activeConfig ? 0 : statsFor().tries;
    // Attempts are recorded when opened, preserving first-try achievement history.
    // Reveal that attempt here with one visible increment, never on Replay.
    lossTriesCount.textContent = String(Math.max(0, tries - 1));
    lossTries.removeAttribute('aria-label');
    result.dataset.rings = '0';
    motion.stop(result);
    gsap.set(result, {autoAlpha:1, clearProps:'transform'});
    gsap.set(result.querySelector('.result-card'), {opacity:1});
    resultTimeline = gsap.timeline({onComplete:() => {
      result.inert = false;
      resultReplay.focus({preventScroll:true});
    }})
      .fromTo(result, {yPercent:reduceMotion ? 0 : 100, opacity:reduceMotion ? 0 : 1},
        {yPercent:0, opacity:1, duration:reduceMotion ? .1 : .38, ease:'power3.out'})
      .call(() => {
        lossTriesCount.textContent = String(tries);
        lossTries.setAttribute('aria-label', `${tries} total ${tries === 1 ? 'try' : 'tries'}`);
        feedback('fail', {scope:'result'});
      }, null, reduceMotion ? 0 : .18)
      .fromTo(lossTriesCount, {y:reduceMotion ? 0 : 7, opacity:0},
        {y:0, opacity:1, duration:reduceMotion ? .1 : .2, ease:'power2.out'}, reduceMotion ? 0 : .18);
    result.dataset.revealDuration = resultTimeline.duration();
    result.scrollTop = 0;
  }

  function resultActions() {
    return motion.visible(result, '.result-action, .result-button');
  }

  function dismissGameplay() {
    // The result lives inside #game, so hide its siblings independently and keep
    // them hidden even while the result overlay fades out for Next/Replay/Home.
    document.querySelector('#settingsOpen').hidden = true;
    gameHeader.setAttribute('aria-hidden', 'true');
    playArea.setAttribute('aria-hidden', 'true');
    motion.exit(gameHeader, [...gameHeader.children]);
    motion.exit(playArea, [board, ...playArea.querySelectorAll('.meter, .count')]);
  }

  function restoreGameplay() {
    document.querySelector('#settingsOpen').hidden = false;
    const sections = [gameHeader, playArea];
    sections.forEach(section => motion.stop(section));
    // Called only after the replacement board is ready. Clearing visibility
    // also preserves the CSS that hides stats on a puzzle's first attempt.
    gsap.set(sections, {clearProps:'opacity,visibility,transform,--screen-shade'});
    gameHeader.removeAttribute('aria-hidden');
    playArea.removeAttribute('aria-hidden');
  }

  function hideResult() {
    motion.stop(result);
    result.inert = true;
    audio.stop('result');
    resultVersion++;
    resultTimeline?.kill();
    resultTimeline = null;
    result.setAttribute('aria-hidden', 'true');
    gsap.set(result, {autoAlpha:0, clearProps:'transform'});
    updatePuzzleStats();
    gameHeader.inert = playArea.inert = false;
    shareStatus.textContent = '';
    resultFirstTryThreeStar = false;
    resultFirstTryMessage = '';
    firstTryMessage.textContent = '';
    firstTryCallout.removeAttribute('aria-label');
    firstTryCallout.hidden = true;
    gsap.set(firstTryCallout, {clearProps:'opacity,transform'});
  }

  async function shareResult() {
    if (sharing || result.getAttribute('aria-hidden') === 'true') return;
    feedback('share', {scope:'result'});
    const version = resultVersion;
    const label = activeConfig?.development ? `Development: ${activeConfig.name}` : activeConfig ? 'a custom level' : `${chapterFor(level).name}, level ${campaignConfig(level).chapterLevel}`;
    const won = result.dataset.success === 'true';
    const text = won
      ? `Color Rise\nI completed ${label} in ${moves} ${moves === 1 ? 'move' : 'moves'}!\n${'★'.repeat(resultScore)}${'☆'.repeat(3 - resultScore)}`
      : `Color Rise\nI'm working on ${label}. Can you complete the gradient?`;
    const payload = {title:'Color Rise', text};
    sharing = true;
    resultShare.disabled = true;
    shareStatus.textContent = '';
    try {
      let method = null;
      if (window.Capacitor?.isNativePlatform()) {
        await window.capacitorShare.Share.share(payload);
        method = 'native';
      } else if (navigator.share) {
        await navigator.share(payload);
        method = 'web_share';
      } else {
        if (version === resultVersion) {
          shareStatus.textContent = 'Sharing is unavailable in this browser';
          feedback('error', {scope:'result'});
        }
      }
      const trackedLevel = levelAnalytics();
      if (method && trackedLevel) analytics.track('share', {method, content_type:'level_result', item_id:trackedLevel.level_name});
    } catch (error) {
      if (version === resultVersion && error?.name !== 'AbortError' && !/cancel|abort/i.test(error?.message || '')) {
        shareStatus.textContent = 'Couldn’t share. Please try again.';
        feedback('error', {scope:'result'});
      }
    } finally {
      sharing = false;
      resultShare.disabled = false;
    }
  }

  function newLevel(startReason = 'select') {
    cancelBoardMotion();
    mergeCueCount = 0;
    winPulseConsumed = false;
    finalMergeSeam = .5;
    // Tries includes the attempt being opened, so check history before counting it.
    const history = activeConfig ? null : statsFor();
    hasPriorAttempt = !!history && (history.tries > 0 || history.best !== null || Object.keys(history.bestByRevision || {}).length > 0 || history.firstTryThreeStar === true || !!puzzleScores()[level]);
    firstTryThreeStarEligible = !activeConfig && !hasPriorAttempt;
    recordPuzzleStat('attempt');
    updatePuzzleStats();
    failed = false;
    hideResult();
    feedback('level-in', {scope:'board'});
    const location = chapterFor(level);
    levelEl.textContent = activeConfig?.development ? activeConfig.name : activeConfig ? 'Custom' : `Level ${campaignConfig(level).chapterLevel}`;
    document.querySelector('#gameChapterTitle').textContent = activeConfig?.development ? 'Development' : activeConfig ? 'Color Lab' : location.name;
    if (!activeConfig) lastChapter = location.id;
    const levelLabel = activeConfig?.development ? `Development, ${activeConfig.name}` : activeConfig ? 'custom level' : `${location.name}, level ${campaignConfig(level).chapterLevel}`;
    levelEl.setAttribute('aria-label', levelLabel);
    ColorStackShape.reset();
    board.innerHTML = '';
    const campaign = activeConfig ? null : campaignConfig(level);
    ftueRules = ColorStackFTUE.rules(campaign);
    ColorStackFTUE.applyGame(game, ftueRules);
    currentPalette = activeConfig ? paletteFromConfig(activeConfig) : paletteFromConfig(campaign);
    const colors = currentPalette;
    baseHeight = activeConfig ? activeConfig.height : campaign.height;
    rowGap = colors.length >= 10 ? 8 : colors.length >= 8 ? 10 : 14;
    moves = 0;
    parMoves = activeConfig ? (activeConfig.par ?? Math.floor((colors.length - 1) / 2)) : campaign.par;
    levelStartedAt = performance.now();
    trackLevel('level_start', {par_moves:parMoves, start_reason:startReason, first_try:!hasPriorAttempt});
    if (ftueRules.target && !hasPriorAttempt) trackLevel('tutorial_begin');
    analytics.screen('gameplay');
    const order = activeConfig ? (activeConfig.order?.slice() || shuffledWithoutMatches(colors.length)) : challengeLayout(colors.length, level);
    groups = (campaign?.initialGroups || order.map(step=>[step])).map(makeGroup);
    ftueBoard = ColorStackFTUE.mountBoard(board, ftueRules);
    fittedBoard = '';
    fitBoard();
    gsap.killTweensOf(progress);
    progress.style.width = `${100*(colors.length-groups.length)/(colors.length-1)}%`;
    count.textContent = `${colors.length-groups.length}/${colors.length-1}`;
    restoreGameplay();
    const reduce = motion.reduced();
    entranceTween = gsap.fromTo(groups.map(group => group.el), {x:reduce ? 0 : i=>i%2?-20:20, opacity:0, scale:reduce ? 1 : .98}, {
      x:0, opacity:1, scale:1, duration:reduce ? .09 : .34, stagger:reduce ? 0 : {amount:.14}, ease:'power3.out',
      onComplete: () => {
        entranceTween = null;
        fitBoard();
        clearRecovery();
        updateBoardBusy();
        prepareWinWhenIdle();
      }
    });
    updateBoardBusy();
    watchMotion(entranceTween.duration());
  }

  function prepareWinWhenIdle() {
    winPreparation?.kill();
    // Let the final entrance frame present before synchronous WebGL setup.
    // Warm it on the initial menu too, when the player has not started a level.
    winPreparation = gsap.delayedCall(.25, () => {
      winPreparation = null;
      if (!document.hidden && !navigationBusy && boardPhase() === 'idle' && !motion.reduced()) winPulse.prepare();
    });
  }

  function renderMenu() {
    const scores = puzzleScores();
    const campaign = campaignProgress(scores);
    const isDevelopment = debugOptionsEnabled && selectedChapter === developmentLocation.id;
    const chapter = isDevelopment ? developmentLocation : chapters.find(c => c.id === selectedChapter);
    menu.querySelector('.chapter-top').hidden = !chapter;
    document.querySelector('#chapterStatus').hidden = !chapter || isDevelopment;
    puzzleGrid.classList.toggle('chapter-list', !chapter);
    puzzleGrid.classList.toggle('development-list', isDevelopment);
    menu.setAttribute('aria-label', chapter ? `${chapter.name} levels` : 'Chapters');
    puzzleGrid.innerHTML = '';
    if (!chapter) {
      for (const location of chapters) {
        const status = chapterProgress(location, scores);
        const button = document.createElement('button');
        button.className = 'chapter-card';
        button.dataset.chapter = location.id;
        button.style.setProperty('--chapter-gradient', `linear-gradient(180deg, ${location.colors.join(',')})`);
        button.setAttribute('aria-label', `${location.name}, ${status.completed} of ${status.total} levels completed${status.unlocked ? '' : ', levels locked'}`);
        if (location.id === lastChapter) button.setAttribute('aria-current', 'location');
        button.innerHTML = `<span class="chapter-card-heading"><span class="chapter-index" aria-hidden="true">${String(chapters.indexOf(location)+1).padStart(2,'0')}</span><span class="chapter-name">${location.name}</span><span class="chapter-counter">${status.completed}/${status.total}</span></span>
          <span class="chapter-key" aria-hidden="true"></span>`;
        button.addEventListener('click', () => { feedback('click-location'); showChapter(location.id, button); });
        puzzleGrid.appendChild(button);
      }
      if (developmentPuzzles.length) {
        const button = document.createElement('button');
        button.className = 'chapter-card development-location';
        button.dataset.chapter = developmentLocation.id;
        button.style.setProperty('--chapter-gradient', `linear-gradient(180deg, ${developmentPuzzles[0].palette.join(',')})`);
        button.setAttribute('aria-label', `Development, ${developmentPuzzles.length} experimental puzzles`);
        button.innerHTML = `<span class="chapter-card-heading"><span class="chapter-index">DEV</span><span class="chapter-name">Development</span><span class="chapter-counter">${developmentPuzzles.length}</span></span><span class="chapter-key" aria-hidden="true"></span>`;
        button.addEventListener('click', () => { feedback('click-location'); showChapter(developmentLocation.id, button); });
        puzzleGrid.appendChild(button);
      }
      return;
    }
    if (isDevelopment) {
      document.querySelector('#chapterTitle').textContent = 'Development';
      const counter = document.querySelector('#chapterCounter');
      counter.textContent = String(developmentPuzzles.length);
      counter.setAttribute('aria-label', `${developmentPuzzles.length} experiments`);
      for (const puzzle of developmentPuzzles) {
        const button = document.createElement('button');
        button.className = 'puzzle-card development-puzzle';
        button.dataset.developmentPuzzle = puzzle.id;
        button.setAttribute('aria-label', `${puzzle.name}, ${puzzle.description}`);
        button.style.setProperty('--experiment-gradient', `linear-gradient(90deg, ${puzzle.palette.join(',')})`);
        const number = document.createElement('span');
        number.className = 'chapter-index';
        number.textContent = String(puzzle.number).padStart(2,'0');
        const copy = document.createElement('span');
        const name = document.createElement('strong');
        name.textContent = puzzle.name;
        const description = document.createElement('small');
        description.textContent = puzzle.description;
        copy.append(name, description);
        const preview = document.createElement('span');
        preview.className = 'development-swatch';
        preview.setAttribute('aria-hidden','true');
        button.append(number, copy, preview);
        button.addEventListener('click', () => startDevelopmentPuzzle(puzzle.id, button));
        puzzleGrid.appendChild(button);
      }
      updatePuzzleGridMask();
      return;
    }
    const status = chapterProgress(chapter, scores);
    document.querySelector('#chapterTitle').textContent = chapter.name;
    const counter = document.querySelector('#chapterCounter');
    counter.textContent = `${status.completed}/${status.total}`;
    counter.setAttribute('aria-label', `${status.completed} of ${status.total} levels completed`);
    const meter = document.querySelector('#chapterStatus .chapter-meter');
    meter.style.setProperty('--chapter-gradient', `linear-gradient(90deg, ${chapter.colors.join(',')})`);
    meter.setAttribute('aria-valuenow', status.completed);
    meter.firstElementChild.style.width = `${status.completed/status.total*100}%`;
    const hint = document.querySelector('#chapterHint');
    hint.hidden = status.unlocked;
    hint.textContent = status.unlocked ? '' : `Complete ${chapters[chapters.indexOf(chapter)-1].name} to unlock.`;
    for (let number = chapter.startLevel; number < chapter.startLevel + chapter.levelCount; number++) {
      const button = document.createElement('button');
      const stars = scores[number] || 0;
      const locked = number > campaign.unlockedThrough;
      const current = number === campaign.current;
      button.className = 'puzzle-card';
      button.dataset.level = number;
      button.classList.toggle('complete', !!stars);
      button.classList.toggle('locked', locked);
      button.classList.toggle('current', current);
      button.disabled = locked;
      button.setAttribute('aria-label', `${chapter.name}, level ${number-chapter.startLevel+1}${current ? ', current puzzle' : ''}${stars ? `, completed, ${stars} of 3 stars` : ''}${locked ? ', locked' : ''}`);
      if (current) button.setAttribute('aria-current', 'step');
      const label = document.createElement('span');
      label.className = 'puzzle-number';
      label.textContent = number - chapter.startLevel + 1;
      button.appendChild(label);
      if (stars) {
        const rating = document.createElement('span');
        rating.className = 'puzzle-stars';
        rating.setAttribute('aria-hidden', 'true');
        rating.innerHTML = Array.from({length:3}, (_, i) => starMarkup('puzzle-star', i < stars)).join('');
        button.appendChild(rating);
        const colors = paletteFromConfig(campaignConfig(number));
        const stops = colors.map((color, i) => `<stop offset="${i / (colors.length - 1)}" stop-color="${color}"/>`).join('');
        button.insertAdjacentHTML('beforeend', `<svg class="puzzle-check" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="puzzle-gradient-${number}" x1="0" y1="1" x2="0" y2="0">${stops}</linearGradient></defs><path d="m5 12 4.5 4.5L19 7" stroke="url(#puzzle-gradient-${number})"/></svg>`);
      }
      if (!locked) button.addEventListener('click', () => { feedback('click-puzzle'); startPuzzle(number); });
      puzzleGrid.appendChild(button);
    }
    updatePuzzleGridMask();
  }

  function updatePuzzleGridMask() {
    const maxScrollTop = Math.max(0, puzzleGrid.scrollHeight - puzzleGrid.clientHeight);
    const style = getComputedStyle(puzzleGrid);
    const startInset = Number.parseFloat(style.paddingTop) || 0;
    const endInset = Number.parseFloat(style.paddingBottom) || 0;
    puzzleGrid.classList.toggle('can-scroll-up', puzzleGrid.scrollTop > startInset + 1);
    puzzleGrid.classList.toggle('at-scroll-end', maxScrollTop <= 1 || puzzleGrid.scrollTop >= maxScrollTop - endInset - 1);
  }

  function revealCurrentPuzzle() {
    if (selectedChapter) {
      puzzleGrid.scrollTop = 0;
      puzzleGrid.querySelector('[aria-current="step"]')?.scrollIntoView({block:'nearest', inline:'nearest', behavior:'instant'});
    } else puzzleGrid.scrollTo({top:homeScrollTop, behavior:'instant'});
    updatePuzzleGridMask();
  }

  function screenItems(screen) {
    if (screen === menu) return [...menu.querySelector('.menu-top').children, ...(selectedChapter ? [...menu.querySelector('.chapter-top').children] : []), ...motion.visible(puzzleGrid, selectedChapter ? '.puzzle-card' : '.chapter-card')];
    if (screen === result) return result.dataset.success === 'false' ? resultActions() : [resultLevelIdentity, gameStats, ...resultActions()];
    return [...game.querySelectorAll('header .gameplay-identity, header .settings-open'), ...game.querySelectorAll('.meter, .count')];
  }

  function changeScreen(target, prepare, initial = false, pressed = null) {
    if (navigationBusy || settings.open || profile.state().open || lab.getAttribute('aria-hidden') === 'false') return false;
    navigationBusy = true;
    menu.inert = game.inert = true;
    cancelBoardMotion();
    const outgoing = result.getAttribute('aria-hidden') === 'false' ? result : menu.getAttribute('aria-hidden') !== 'true' ? menu : game;
    if (outgoing === result) {
      result.inert = true;
      resultTimeline?.kill();
      resultVersion++;
      audio.stop('result');
    }
    const arrive = () => {
      hideResult();
      prepare?.();
      menu.setAttribute('aria-hidden', String(target !== menu));
      game.setAttribute('aria-hidden', String(target !== game));
      gsap.set(target === menu ? game : menu, {autoAlpha:0, clearProps:'transform'});
      gsap.set(target, {visibility:'visible', clearProps:'transform'});
      if (target === menu) revealCurrentPuzzle();
      motion.enter(target, screenItems(target), {onComplete:() => {
        navigationBusy = false;
        menu.inert = target !== menu;
        game.inert = target !== game;
        if (!initial) (target === menu ? (puzzleGrid.querySelector('[aria-current]') || menu.querySelector('#chaptersBack:not([hidden])')) : document.querySelector('#settingsOpen'))?.focus({preventScroll:true});
        cheat.sync();
        prepareWinWhenIdle();
      }});
    };
    if (initial) arrive();
    else motion.exit(outgoing, screenItems(outgoing), {onComplete:arrive, pressed});
    return true;
  }

  function showMenu(initial = false, pressed = null) {
    if (changeScreen(menu, () => {selectedChapter = null; renderMenu(); analytics.screen('chapters');}, initial, pressed) && !initial) feedback(pressed ? 'click-primary' : 'click-back');
  }

  function showChapter(id, pressed = null) {
    if (!chapters.some(chapter => chapter.id === id) && !(debugOptionsEnabled && developmentPuzzles.length && id === developmentLocation.id)) return false;
    if (menu.getAttribute('aria-hidden') === 'false' && !selectedChapter) homeScrollTop = puzzleGrid.scrollTop;
    const changed = changeScreen(menu, () => {selectedChapter = id; if (id !== developmentLocation.id) lastChapter = id; renderMenu(); analytics.screen('chapter');}, false, pressed);
    if (changed && pressed) analytics.track('select_content', {content_type:'chapter', item_id:id});
    return changed;
  }

  function startPuzzle(number, pressed = null, startReason = 'select') {
    if (!Number.isInteger(number) || number < 1 || number > campaignProgress().unlockedThrough) return false;
    const changed = changeScreen(game, () => {
      activeConfig = null;
      level = number;
      newLevel(startReason);
    }, false, pressed);
    if (changed && pressed) feedback('click-primary');
    return changed;
  }

  function startDevelopmentPuzzle(id, pressed = null) {
    if (!debugOptionsEnabled) return false;
    const puzzle = developmentPuzzles.find(p => p.id === id);
    if (!puzzle) return false;
    const changed = changeScreen(game, () => {
      activeConfig = puzzle;
      newLevel('development');
    }, false, pressed);
    if (changed) feedback('click-puzzle');
    return changed;
  }

  function readLabConfig() {
    return {
      pieces:+document.querySelector('#piecesInput').value,
      height:+document.querySelector('#heightInput').value,
      hue:+document.querySelector('#hueInput').value,
      value:+document.querySelector('#valueInput').value,
      sat:+document.querySelector('#satInput').value,
      assist:document.querySelector('#assistInput').value
    };
  }

  function writeLabConfig(config, tier='CUSTOM') {
    labConfig = {...config};
    const fields = {pieces:'piecesInput',height:'heightInput',hue:'hueInput',value:'valueInput',sat:'satInput',assist:'assistInput'};
    Object.entries(fields).forEach(([key,id]) => { document.querySelector('#'+id).value = config[key]; });
    document.querySelector('#tierLabel').textContent = tier.toUpperCase();
    updateLab();
  }

  function updateLab() {
    labConfig = readLabConfig();
    document.querySelector('#piecesOut').textContent = labConfig.pieces;
    document.querySelector('#heightOut').textContent = labConfig.height + ' px';
    document.querySelector('#hueOut').textContent = labConfig.hue + '°';
    document.querySelector('#valueOut').textContent = labConfig.value + '%';
    document.querySelector('#satOut').textContent = labConfig.sat + '%';
    const colors = paletteFromConfig(labConfig);
    labPreview.style.background = `linear-gradient(90deg, ${colors.join(',')})`;
    const gap = labConfig.pieces >= 10 ? 8 : 10;
    const required = labConfig.pieces * labConfig.height + (labConfig.pieces - 1) * gap;
    const available = Math.min(680, window.innerHeight - 165);
    const checks = [
      ['SCREEN ' + required + '/' + Math.round(available), required <= available ? 'ok' : required <= available + 60 ? 'warn' : 'fail'],
      ['START CLEAN', 'ok'],
      ['HUE ' + labConfig.hue + '°', labConfig.hue >= 8 ? 'ok' : 'warn'],
      ['VALUE ' + labConfig.value + '%', labConfig.assist !== 'none' || labConfig.value >= 4 ? 'ok' : 'warn'],
      ['DEAD-ENDS ON', 'ok'],
      ['CVD CUE', labConfig.assist === 'none' ? 'warn' : 'ok']
    ];
    validation.innerHTML = checks.map(([label,state]) => `<div class="${state}"><span>${label}</span><i></i></div>`).join('');
    document.querySelector('#tierLabel').textContent = Object.entries(presets).find(([,p]) => JSON.stringify(p) === JSON.stringify(labConfig))?.[0].toUpperCase() || 'CUSTOM';
  }

  function labItems() {
    return [...motion.visible(lab, '.lab-head, #presets button, .lab-preview, .play-test'), ...motion.visible(lab.querySelector('.lab-scroll'), '.ftue-tools, #unlockAllToggle, #unlockAllToggleHelp, #progressToggle, #progressToggleHelp, .debug-actions > button, .merge-settings, .lab-scroll > label, #validation')];
  }

  function openLab() {
    if (!debugOptionsEnabled || navigationBusy || settings.open || profile.state().open || lab.getAttribute('aria-hidden') === 'false' || boardPhase() !== 'idle' || resolveTimer) return;
    feedback('click-primary');
    labOpener = document.activeElement;
    const inLevel = game.getAttribute('aria-hidden') === 'false';
    document.querySelector('#restart').disabled = !inLevel;
    document.querySelector('#hint').disabled = !inLevel || failed || groups.length < 2;
    document.querySelector('#debugHelp').textContent = inLevel ? 'Hints count as two moves.' : 'Open a level to use these tools.';
    menu.inert = game.inert = true;
    lab.setAttribute('aria-hidden','false');
    lab.inert = false;
    updateLab();
    motion.enter(lab, labItems());
    document.querySelector('#labClose').focus({preventScroll:true});
    cheat.sync();
  }

  function closeLab(silent = false, afterClose) {
    if (lab.getAttribute('aria-hidden') === 'true' || lab.dataset.closing) return;
    lab.dataset.closing = 'true';
    lab.inert = true;
    if (!silent) feedback('click-back');
    motion.exit(lab, labItems(), {onComplete:() => {
      lab.setAttribute('aria-hidden','true');
      delete lab.dataset.closing;
      menu.inert = menu.getAttribute('aria-hidden') === 'true';
      game.inert = game.getAttribute('aria-hidden') === 'true';
      labOpener?.focus({preventScroll:true});
      afterClose?.();
    }});
  }

  function playCustom() {
    if (!debugOptionsEnabled) return;
    closeLab(true, () => changeScreen(game, () => {
      activeConfig = {...labConfig};
      level = 99;
      newLevel('custom');
    }));
  }

  document.querySelector('#restart').addEventListener('click', () => {
    if (!debugOptionsEnabled) return;
    trackRestart('debug');
    closeLab(true, () => changeScreen(game, () => newLevel('debug_restart')));
  });
  document.querySelector('#resetFTUE').addEventListener('click', () => {
    if (!debugOptionsEnabled) return;
    const button = document.querySelector('#resetFTUE');
    if (button.disabled || lab.dataset.closing) return;
    button.disabled = true;
    const status = document.querySelector('#ftueResetStatus');
    status.hidden = true;
    try {
      // Keep unrelated tools on this origin intact, including the design studio.
      const keys = ['color-stack-profile', 'color-stack-sound', 'color-stack-haptics',
        'color-stack-merge-settings', 'color-stack-ftue-started', 'color-stack-player-v3'];
      keys.forEach(key => localStorage.removeItem(key));
    } catch {
      button.disabled = false;
      status.textContent = 'Couldn’t clear local data. Please try again.';
      status.hidden = false;
      return;
    }
    // A full boot also disposes workers, timers, cached records and profile photos.
    closeLab(true, () => {
      audio.stop();
      haptics.stop();
      window.location.reload();
    });
  });
  function endLevel() {
    trackLevel('level_exit', {moves, duration_seconds:levelDuration(), exit_source:'settings'});
    if (activeConfig?.development) showChapter(developmentLocation.id);
    else if (activeConfig) showMenu(false);
    else { feedback('click-back'); showChapter(chapterFor(level).id); }
  }
  document.querySelector('#chaptersBack').addEventListener('click', () => showMenu(false));
  function updateSettingsUI() {
    document.querySelector('#soundsToggle').setAttribute('aria-checked', String(audio.enabled));
    document.querySelector('#hapticsToggle').setAttribute('aria-checked', String(haptics.enabled));
  }
  function pauseForPanel() {
    if (dragging) endDrag({type:'pointercancel', pointerId:dragPointerId});
    const layoutMotions = gsap.getTweensOf([...board.querySelectorAll('.piece'), progress]).filter(t => t.parent === gsap.globalTimeline);
    pausedMotions = [...new Set([entranceTween, settleTween, mergeTimeline, winTimeline, cascadeTimer, resolveTimer, ...layoutMotions])].filter(t => t && !t.paused());
    pausedMotions.forEach(t => t.pause());
    clearRecovery();
    audio.stop('board'); audio.stop('result'); haptics.stop();
    menu.inert = game.inert = true;
  }

  function resumeFromPanel() {
    menu.inert = menu.getAttribute('aria-hidden') === 'true';
    game.inert = game.getAttribute('aria-hidden') === 'true';
    const remaining = Math.max(0, ...pausedMotions.map(t => (t.totalDuration() - t.totalTime()) / t.timeScale()));
    pausedMotions.forEach(t => t.resume());
    pausedMotions = [];
    if (boardPhase() !== 'idle') watchMotion(remaining);
  }

  function openSettings(e) {
    if (navigationBusy || settings.open || profile.state().open || lab.getAttribute('aria-hidden') === 'false') return;
    settingsOpener = e?.currentTarget || document.activeElement;
    pauseForPanel();
    updateSettingsUI();
    const inLevel = game.getAttribute('aria-hidden') === 'false' && result.getAttribute('aria-hidden') === 'true';
    document.querySelector('#endLevel').hidden = !inLevel;
    document.querySelector('#restartLevel').hidden = !inLevel;
    showSettingsHelp(false);
    labOpen.disabled = !debugOptionsEnabled || boardPhase() !== 'idle' || !!resolveTimer;
    settings.inert = false;
    settings.showModal();
    settings.scrollTop = 0;
    settings.querySelector('.settings-panel').scrollTop = 0;
    document.querySelectorAll('.settings-open').forEach(button => button.setAttribute('aria-expanded', 'true'));
    motion.enter(settings, settingsItems());
    const settingsClose = document.querySelector('#settingsClose');
    settingsClose.classList.add('initial-focus');
    settingsClose.addEventListener('blur', () => settingsClose.classList.remove('initial-focus'), {once:true});
    settingsClose.focus({preventScroll:true});
    feedback('click-primary');
    analytics.track('settings_open');
    analytics.screen('settings');
    cheat.sync();
  }
  function settingsItems() {
    return motion.visible(settings, '.settings-brand, .settings-heading, .settings-toggle, .settings-action, .settings-support, .settings-footer, .settings-help h2, .settings-help p, .settings-debug-link');
  }
  function closeSettings(silent = false, afterClose) {
    if (!settings.open || settings.dataset.closing) return;
    settings.dataset.closing = 'true';
    settings.inert = true;
    if (!silent) feedback('click-back');
    motion.exit(settings, settingsItems(), {onComplete:() => {
      settings.close();
      delete settings.dataset.closing;
      document.querySelectorAll('.settings-open').forEach(button => button.setAttribute('aria-expanded', 'false'));
      resumeFromPanel();
      trackVisibleScreen();
      settingsOpener?.focus({preventScroll:true});
      cheat.sync();
      afterClose?.();
    }});
  }
  function showSettingsHelp(show) {
    document.querySelector('#settingsMain').hidden = show;
    document.querySelector('#settingsHelp').hidden = !show;
    settings.setAttribute('aria-labelledby', show ? 'settingsHelpTitle' : 'settingsTitle');
    settings.querySelector('.settings-panel').scrollTop = 0;
  }
  document.querySelector('#endLevel').addEventListener('click', () => closeSettings(true, endLevel));
  document.querySelector('#restartLevel').addEventListener('click', () => closeSettings(true, () => {
    feedback('click-primary');
    trackRestart('settings');
    changeScreen(game, () => newLevel('settings_restart'));
  }));
  document.querySelector('#howToPlay').addEventListener('click', () => {
    showSettingsHelp(true);
    document.querySelector('#settingsHelpTitle').focus({preventScroll:true});
    feedback('click-primary');
    analytics.track('how_to_play_open');
    analytics.screen('how_to_play');
  });
  document.querySelector('#howToPlayBack').addEventListener('click', () => {
    showSettingsHelp(false);
    document.querySelector('#howToPlay').focus({preventScroll:true});
    feedback('click-back');
    analytics.screen('settings');
  });
  document.querySelectorAll('.settings-open').forEach(button => button.addEventListener('click', openSettings));
  document.querySelector('#settingsClose').addEventListener('click', () => closeSettings());
  settings.addEventListener('cancel', event => {event.preventDefault(); closeSettings();});
  settings.addEventListener('click', event => {
    if (event.target !== settings) return;
    const box = settings.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeSettings();
  });
  document.querySelector('#soundsToggle').addEventListener('click', () => {
    const enabling = !audio.enabled; audio.setEnabled(enabling); if (enabling) audio.play('click-toggle'); haptics.cue('toggle'); updateSettingsUI();
    analytics.track('settings_update', {setting:'sounds', enabled:audio.enabled});
  });
  document.querySelector('#hapticsToggle').addEventListener('click', () => {
    haptics.setEnabled(!haptics.enabled); audio.play('click-toggle'); updateSettingsUI();
    analytics.track('settings_update', {setting:'haptics', enabled:haptics.enabled});
  });
  document.querySelector('.settings-support').addEventListener('click', () => analytics.track('support_open'));
  if (debugOptionsEnabled) {
    labOpen.addEventListener('click', () => closeSettings(true, openLab));
  }
  unlockAllToggle.addEventListener('click', () => {
    if (!debugOptionsEnabled) return;
    unlockAll = !unlockAll;
    unlockAllToggle.setAttribute('aria-checked', String(unlockAll));
    renderMenu();
    updatePuzzleGridMask();
    feedback('select');
  });
  progressToggle.addEventListener('click', () => {
    if (!debugOptionsEnabled) return;
    showProgress = !showProgress;
    progressToggle.setAttribute('aria-checked', String(showProgress));
    progress.parentElement.hidden = count.hidden = !showProgress;
    feedback('select');
    fitBoard();
  });
  document.querySelector('#labClose').addEventListener('click', () => closeLab());
  document.querySelector('#playTest').addEventListener('click', playCustom);
  document.querySelectorAll('#lab input, #lab select').forEach(input => {
    if (!input.closest('.merge-settings, .cheat-panel')) input.addEventListener('input', () => {
      if (!debugOptionsEnabled) return;
      settingSound(input);
      updateLab();
    });
  });
  function rememberSettings() {
    document.querySelectorAll('#lab input, #lab select').forEach(input => settingValues.set(input, input.value));
  }
  function settingSound(input) {
    if (input.value !== settingValues.get(input)) feedback(input.type === 'range' ? 'tick' : 'select');
    settingValues.set(input, input.value);
  }
  function updateMergeSettingsUI() {
    document.querySelector('#mergeModeInput').value = mergeSettings.mode;
    document.querySelector('#mergeDelayInput').value = mergeSettings.delay;
    document.querySelector('#mergeDelayInput').disabled = mergeSettings.mode === 'together';
    document.querySelector('#mergeDelayOut').textContent = `${mergeSettings.delay} ms`;
    document.querySelector('#mergeDelayHelp').textContent = mergeSettings.mode === 'together'
      ? 'Compatible adjacent runs merge together. No cascade pause.'
      : 'Pause after one merge finishes, before the next begins.';
  }
  document.querySelectorAll('.merge-settings input, .merge-settings select').forEach(input => input.addEventListener('input', () => {
    if (input.closest('.audio-settings')) return;
    if (!debugOptionsEnabled) return;
    settingSound(input);
    mergeSettings.mode = document.querySelector('#mergeModeInput').value === 'together' ? 'together' : 'cascade';
    mergeSettings.delay = Math.max(0, Math.min(1000, Number(document.querySelector('#mergeDelayInput').value) || 0));
    updateMergeSettingsUI();
    localStorage.setItem('color-stack-merge-settings', JSON.stringify(mergeSettings));
  }));
  mergeSoundInput.value = mergeSound;
  mergeSoundInput.addEventListener('change', () => {
    if (!debugOptionsEnabled) return;
    mergeSound = mergeSoundInput.value;
    localStorage.setItem('color-rise-merge-sound', mergeSound);
    playMergeSound({scope:'ui'});
  });
  document.querySelectorAll('#presets button').forEach(button => button.addEventListener('click', () => {
    if (!debugOptionsEnabled) return;
    document.querySelectorAll('#presets button').forEach(b => b.classList.toggle('active', b === button));
    feedback('select');
    writeLabConfig(presets[button.dataset.preset], button.dataset.preset);
    rememberSettings();
  }));
  document.querySelector('#hint').addEventListener('click', () => {
    if (!debugOptionsEnabled) return;
    if (failed || boardPhase() !== 'idle' || groups.length < 2) return;
    let pair = null;
    for (let i = 0; i < groups.length && !pair; i++) {
      for (let j = 0; j < groups.length; j++) {
        if (i !== j && canJoin(groups[i], groups[j])) { pair = [i,j]; break; }
      }
    }
    if (!pair) return;
    moves += 2;
    feedback('hint', {scope:'board'});
    closeLab(true);
    pair.forEach(i => gsap.fromTo(groups[i].el, {filter:'brightness(1.7)'}, {filter:'brightness(1)', delay:.28, duration:.85, ease:'power2.out'}));
  });
  document.querySelector('#resultHome').addEventListener('click', () => activeConfig?.development ? showChapter(developmentLocation.id) : showMenu(false));
  resultReplay.addEventListener('click', () => {
    feedback('click-primary');
    trackRestart('result');
    changeScreen(game, () => newLevel('result_replay'));
  });
  resultShare.addEventListener('click', shareResult);
  resultButton.addEventListener('click', () => {
    if (result.dataset.success === 'true') {
      if (activeConfig?.development) {
        const next = developmentPuzzles[activeConfig.number];
        if (next) startDevelopmentPuzzle(next.id, resultButton);
        else showChapter(developmentLocation.id, resultButton);
      } else if (!activeConfig && level < puzzleCount) {
        if (level % 20 === 0) { feedback('click-primary'); showChapter(chapterFor(level + 1).id, resultButton); }
        else startPuzzle(level + 1, resultButton, 'next');
      }
      else showMenu(false, resultButton);
    }
  });

  puzzleGrid.addEventListener('scroll', updatePuzzleGridMask, {passive:true});
  new ResizeObserver(fitBoard).observe(playArea);
  window.addEventListener('resize', () => {
    // Finish a viewport-sized pulse before relaying out its source piece.
    if (winTimeline) winTimeline.progress(1);
    updatePuzzleGridMask();
  });
  window.addEventListener('color-stack-active', () => {
    if (winTimeline) recoverBoardMotion();
  });
  window.addEventListener('blur', () => {
    if (dragging) endDrag({type:'pointercancel', pointerId:dragPointerId});
  });
  document.addEventListener('visibilitychange', () => {
    document.documentElement.classList.toggle('app-background', document.hidden);
    if (document.hidden) {
      if (dragging) endDrag({type:'pointercancel', pointerId:dragPointerId});
    } else {
      motion.finishAll();
      recoverBoardMotion();
    }
  });
  window.render_game_to_text = () => JSON.stringify({
    mode:!splash.hidden ? 'splash' : profile.state().open ? 'profile' : menu.getAttribute('aria-hidden') === 'false' ? (selectedChapter ? 'chapter' : 'chapters') : 'game',
    level, moves, parMoves, layoutRevision:activeConfig ? null : campaignConfig(level).revision, transitioning:navigationBusy,
    campaign:campaignProgress(),
    chapter:activeConfig ? null : chapterProgress(chapterFor(level)),
    selectedChapter,
    developmentPuzzle:activeConfig?.development ? {id:activeConfig.id, name:activeConfig.name, profile:activeConfig.profile, number:activeConfig.number} : null,
    chapters:chapters.map(chapter => chapterProgress(chapter)),
    stats:activeConfig ? null : statsFor(),
    result:result.getAttribute('aria-hidden') === 'false' ? {success:result.dataset.success === 'true', presentation:result.dataset.success === 'true' ? 'full' : 'banner', tries:activeConfig ? null : statsFor().tries, chapter:resultChapterName.textContent, levelLabel:resultLevelName.textContent, stars:resultScore, rings:Number(result.dataset.rings), revealDuration:Number(result.dataset.revealDuration), sharing, firstTryThreeStar:resultFirstTryThreeStar, accolade:resultFirstTryMessage} : null,
    profileSummary:profileSummary(),
    debugOptionsEnabled,
    debugOpen:debugOptionsEnabled && lab.getAttribute('aria-hidden') === 'false',
    unlockAll,
    showProgress,
    settingsOpen:settings.open,
    settingsView:settings.open ? (document.querySelector('#settingsHelp').hidden ? 'menu' : 'how-to-play') : null,
    hud:{location:document.querySelector('#gameChapterTitle').textContent, level:levelEl.textContent},
    buildInfo:{...buildInfo},
    profile:profile.state(),
    phase:boardPhase(),
    winPulse:winPulse.state(),
    mergeSettings:{...mergeSettings},
    mergeSound:{selection:mergeSound,lastPlayed:lastMergeSound},
    audio:audio.getState(),
    haptics:haptics.getState(),
    analytics:analytics.getState(),
    cheat:cheat.state(),
    mergeRuns:merging ? merging.map(run => ({steps:run.combined, members:run.swallowed.length + 1})) : [],
    rowGap,
    pieces:groups.map(group => {
      const rect = group.el.getBoundingClientRect();
      return {steps:group.steps, x:rect.x, y:rect.y, width:rect.width, height:rect.height};
    }),
    coordinates:'CSS pixels, viewport origin at top left, x right, y down'
  });
  writeLabConfig(presets.core, 'core');
  updateMergeSettingsUI();
  rememberSettings();
  updateSettingsUI();
  splashPlay.addEventListener('click', () => {
    // Do not record a first launch or puzzle attempt until the player presses Play.
    if (splash.hidden) return;
    splashPlay.blur();
    splash.hidden = true;
    audio.stop('splash');
    feedback('click-primary');
    analytics.track('splash_play');
    analytics.track('session_started');
    showMenu(true);
  });
  analytics.screen('splash');
})();
