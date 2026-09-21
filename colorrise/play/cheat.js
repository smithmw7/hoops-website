// Optional debug UI; all expensive search lives in a disposable worker.
window.createCheatController = ({snapshot, fit, showBoard, openDetails, sound}) => {
  const $ = id => document.getElementById(id);
  const board = $('board'), panel = $('cheatPanel'), guide = $('cheatGuide');
  const format = value => BigInt(value).toLocaleString();
  const cache = new Map();
  let enabled = false, mode = 'all', worker = null, generation = 0, currentKey = '', data = null;
  let scheduled = false, autoSlices = 0;
  const instruction = move => `Drag row ${move.from + 1} ${move.to > move.from ? 'below' : 'above'} row ${move.to + 1}`;
  function stop() {
    generation++;
    worker?.terminate(); worker = null;
  }
  function render() {
    const view = snapshot(), path = data?.shortest?.path;
    const solved = data?.shortest?.status === 'solved', impossible = data?.shortest?.status === 'impossible';
    const exact = data?.status === 'complete';
    $('cheatToggle').disabled = !view.active && !enabled;
    $('cheatToggle').setAttribute('aria-pressed', String(enabled));
    $('cheatToggleLabel').textContent = enabled ? 'Cheat on · turn off' : 'Cheat · shortest solution';
    panel.hidden = !enabled;
    $('lab').classList.toggle('cheat-inspecting', enabled);
    guide.hidden = !enabled || !view.active;
    board.classList.toggle('cheat-active', enabled && view.active);
    [...board.children].forEach(el => {
      const i = Number(el.dataset.index);
      let label = el.querySelector('.cheat-row');
      if (!label) { label = document.createElement('span'); label.className = 'cheat-row'; label.setAttribute('aria-hidden', 'true'); el.appendChild(label); }
      label.textContent = i + 1;
      el.setAttribute('aria-label', `${enabled && view.active && !view.busy ? `Row ${i + 1}. ` : ''}${el.dataset.pieceLabel || ''}`);
      el.classList.toggle('cheat-source', enabled && !view.busy && solved && path[0]?.from === i);
      el.classList.toggle('cheat-target', enabled && !view.busy && solved && path[0]?.to === i);
    });
    $('cheatDetails').disabled = view.busy;
    $('cheatRemaining').textContent = view.busy ? 'CHEAT · WAIT FOR THE BOARD' : solved ? `CHEAT · ${path.length} ${path.length === 1 ? 'MOVE' : 'MOVES'} LEFT` : 'CHEAT';
    $('cheatInstruction').textContent = view.busy ? 'Guidance updates after the pieces settle' : solved && path.length ? instruction(path[0]) : impossible ? 'No solution from here. Restart the level.' : data?.status === 'paused' ? 'Open details to continue the search' : 'Finding a shortest route…';
    $('cheatTotal').textContent = data ? `${exact ? '' : '≥ '}${format(data.total || '0')}` : '…';
    $('cheatBadge').textContent = exact ? 'Exact' : data?.status === 'error' ? 'Stopped' : data?.status === 'paused' || data?.status === 'limited' ? 'Partial' : 'Working';
    $('cheatDefinition').textContent = mode === 'all'
      ? 'From this board. A route cannot revisit a settled board. Drags that produce the same next board count once.'
      : 'From this board. Every move must cause a merge. Drags that produce the same next board count once.';
    $('cheatStatus').textContent = view.busy ? 'Waiting for the board to settle.'
      : !view.active ? 'Open a level to inspect its solutions.'
      : data?.status === 'error' ? data.message
      : impossible ? 'The stack directions conflict. No sequence of moves can finish this board.'
      : !solved ? data?.status === 'paused' ? 'Shortest-route search paused. Continue when ready.' : 'Finding a shortest route…'
      : exact ? `Longest solution: ${Math.max(0, data.histogram.length - 1)} moves from here.`
      : data?.status === 'limited' ? 'The depth limit was reached. These are minimum counts, not a complete total.'
      : data?.status === 'paused' ? 'Counting paused. Total and rows show minimum counts. Continue, or select “Every move merges” for a smaller search.'
      : 'Counting routes. Total and rows show minimum counts until the search finishes.';
    const rows = (data?.histogram || []).map((value, moves) => ({value, moves})).filter(row => row.value !== '0');
    $('cheatCounts').replaceChildren(...rows.map(({value, moves}) => {
      const tr = document.createElement('tr'); tr.classList.toggle('shortest', solved && moves === path.length);
      const moveCell = document.createElement('td'), valueCell = document.createElement('td');
      moveCell.textContent = moves; valueCell.textContent = `${exact ? '' : '≥ '}${format(value)}`;
      tr.append(moveCell, valueCell); return tr;
    }));
    $('cheatContinue').hidden = !view.active || view.busy || !['paused','error'].includes(data?.status);
    $('cheatContinue').textContent = data?.status === 'error' ? 'Retry analysis' : solved ? 'Keep counting' : 'Continue search';
    $('cheatRouteTitle').textContent = impossible ? 'No winning route' : solved ? `Shortest route · ${path.length} ${path.length === 1 ? 'move' : 'moves'}` : 'Shortest route';
    $('cheatShow').disabled = !view.active || view.busy || !solved || !path.length;
    let before = view.board;
    $('cheatRoute').replaceChildren(...(solved ? path : []).map(move => {
      const li = document.createElement('li'), swatch = document.createElement('span');
      swatch.className = 'cheat-route-swatch'; swatch.setAttribute('aria-hidden', 'true');
      const colors = before[move.from].map(step => view.colors[step]);
      swatch.style.background = colors.length === 1 ? colors[0] : `linear-gradient(to bottom, ${colors.join(',')})`;
      li.append(swatch, document.createTextNode(instruction(move))); before = move.state; return li;
    }));
    fit();
  }
  function begin(view, fresh = false) {
    const boardKey = ColorStackSolver.key(view.board), key = `${boardKey}/${mode}`;
    if (!fresh && currentKey === key) return;
    stop(); currentKey = key; data = null; autoSlices = 0;
    if (!fresh && cache.has(key)) { data = cache.get(key); render(); return; }
    const id = generation;
    try {
      worker = new Worker('solver-worker.js');
      worker.onmessage = event => {
        if (event.data.job !== generation || currentKey !== key || !enabled) return;
        data = event.data;
        // Give finite counts and shortest-route proofs several responsive slices.
        // The much larger all-route enumeration pauses promptly for user control.
        if (data.status === 'paused' && (data.phase === 'shortest' || mode === 'merges') && autoSlices++ < 5) {
          data.status = 'running';
          worker.postMessage({type:'continue'});
        }
        if (data.status === 'complete') {
          cache.set(key, data);
          if (cache.size > 20) cache.delete(cache.keys().next().value);
          worker?.terminate(); worker = null;
        } else if (data.status === 'limited' || data.status === 'error') {
          worker?.terminate(); worker = null;
        }
        render();
      };
      worker.onerror = event => { event.preventDefault(); if (generation !== id) return; data = {status:'error', message:'Analysis could not finish. Please retry.', total:'0'}; stop(); render(); };
      worker.postMessage({type:'start', id, board:view.board, boardKey, mode});
    } catch {
      data = {status:'error', message:'Solution analysis is unavailable. Please retry.', total:'0'};
    }
    render();
  }
  function syncNow() {
    scheduled = false;
    const view = snapshot();
    if (!enabled || !view.active || view.busy || document.hidden) {
      if (currentKey || worker) { stop(); currentKey = ''; data = null; }
      render(); return;
    }
    begin(view); render();
  }
  function sync() {
    if (!scheduled) { scheduled = true; queueMicrotask(syncNow); }
  }
  function setEnabled(value) {
    enabled = value;
    if (!enabled) { stop(); currentKey = ''; data = null; }
    syncNow();
  }
  $('cheatToggle').addEventListener('click', () => {
    if (!snapshot().active && !enabled) return;
    sound(enabled ? 'panel-close' : 'confirm'); setEnabled(!enabled);
    if (enabled) panel.scrollIntoView({block:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  });
  $('cheatOff').addEventListener('click', () => { sound('panel-close'); setEnabled(false); });
  $('cheatDetails').addEventListener('click', () => { openDetails(); panel.scrollIntoView({block:'start'}); });
  $('cheatShow').addEventListener('click', () => { sound('hint'); showBoard(); });
  $('cheatCountMode').addEventListener('change', event => {
    mode = event.target.value === 'merges' ? 'merges' : 'all'; sound('select'); currentKey = ''; syncNow();
  });
  $('cheatContinue').addEventListener('click', () => {
    sound('tap');
    if (worker && data?.status === 'paused') { data.status = 'running'; render(); worker.postMessage({type:'continue'}); }
    else begin(snapshot(), true);
  });
  document.addEventListener('visibilitychange', sync);
  return {sync, cancel:() => { stop(); currentKey = ''; data = null; },
    state:() => ({enabled, mode, status:data?.status || 'idle', phase:data?.phase || null,
      shortest:data?.shortest || null, total:data?.total || null, histogram:data?.histogram || [], nodes:data?.nodes || 0})};
};
