// Pure puzzle rules and exact search. Also loaded by the isolated analysis worker.
(() => {
  const key = state => state.map(group => group.join(',')).join('|');
  function direction(group) {
    if (group.length < 2) return 0;
    const d = group[1] - group[0];
    return Math.abs(d) === 1 && group.every((v, i) => !i || v - group[i - 1] === d) ? d : null;
  }
  function settle(state) {
    state = state.map(group => group.slice());
    for (let i = 0; i < state.length - 1;) {
      const joined = [...state[i], ...state[i + 1]];
      if (direction(joined) !== null) { state.splice(i, 2, joined); i = Math.max(0, i - 1); }
      else i++;
    }
    return state;
  }
  function viable(state) {
    const directions = state.map(direction);
    return !directions.includes(null) && new Set(directions.filter(Boolean)).size < 2;
  }
  function successors(state, mergeOnly = false) {
    const out = new Map(), original = key(state);
    for (let from = 0; from < state.length; from++) for (let to = 0; to < state.length; to++) {
      if (from === to) continue;
      const moved = state.slice(); moved.splice(to, 0, moved.splice(from, 1)[0]);
      const next = settle(moved), id = key(next);
      if (id === original || out.has(id) || (mergeOnly && next.length === state.length) || !viable(next)) continue;
      out.set(id, {from, to, state:next, key:id});
    }
    return [...out.values()].sort((a, b) => a.state.length - b.state.length);
  }
  // From a settled board an insertion changes only three adjacency boundaries.
  // Coalescing a correct edge preserves its two outside endpoints.
  function lowerBound(state) {
    const minima = state.map(group => Math.min(...group)).sort((a, b) => a - b);
    const rank = new Map(minima.map((value, i) => [value, i + 1]));
    const fixed = state.map(direction).find(Boolean);
    function cycleBound(d) {
      const n = state.length;
      const order = state.map(group => d === 1 ? rank.get(Math.min(...group)) : n + 1 - rank.get(Math.min(...group)));
      const next = Array(n + 1); next[0] = order[0];
      order.forEach((value, i) => { next[value] = order[i + 1] ?? 0; });
      const permutation = next.map(value => (value + n) % (n + 1));
      const seen = new Set(); let cycles = 0;
      for (let i = 0; i <= n; i++) if (!seen.has(i)) {
        cycles++;
        for (let j = i; !seen.has(j); j = permutation[j]) seen.add(j);
      }
      return (n + 1 - cycles) / 2;
    }
    // Cut-and-insert changes three successor edges, increasing cycle count by at
    // most two. Merging contracts a correct edge and preserves this lower bound.
    return Math.max(Math.ceil((state.length - 1) / 3), fixed ? cycleBound(fixed) : Math.min(cycleBound(1), cycleBound(-1)));
  }
  function* shortest(initial, stats) {
    if (!viable(initial)) return {status:'impossible', path:[]};
    const path = [], pathKeys = new Set([key(initial)]), bounds = new Map();
    const estimate = (state, id = key(state)) => {
      if (bounds.has(id)) return bounds.get(id);
      const value = lowerBound(state);
      if (bounds.size < 75000) bounds.set(id, value);
      return value;
    };
    for (let bound = estimate(initial); ; bound++) {
      const bestRemaining = new Map(); stats.bound = bound;
      function* visit(state, remaining) {
        if (++stats.nodes % 128 === 0) yield;
        if (state.length === 1) return path.slice();
        if (estimate(state) > remaining) return null;
        const id = key(state);
        if ((bestRemaining.get(id) ?? -1) >= remaining) return null;
        if (bestRemaining.size >= 75000) throw Error('Shortest search reached its memory limit. Try again after a move.');
        bestRemaining.set(id, remaining);
        for (const move of successors(state)) {
          if (estimate(move.state, move.key) > remaining - 1 || pathKeys.has(move.key)) continue;
          path.push(move); pathKeys.add(move.key);
          const found = yield* visit(move.state, remaining - 1);
          if (found) return found;
          path.pop(); pathKeys.delete(move.key);
        }
        return null;
      }
      const found = yield* visit(initial, bound);
      if (found) return {status:'solved', path:found};
    }
  }
  function* countRoutes(initial, mode, stats) {
    const memo = new Map();
    stats.histogram = [];
    const addFound = (histogram, depth) => histogram.forEach((value, i) => {
      if (value) stats.histogram[depth + i] = (stats.histogram[depth + i] || 0n) + value;
    });
    function* visit(state, seen, depth) {
      if (++stats.nodes % 128 === 0) yield;
      if (!viable(state)) return {histogram:[], exact:true};
      if (state.length === 1) {
        addFound([1n], depth);
        return {histogram:[1n], exact:true};
      }
      // A finite memory/stack guard is surfaced as a partial result, never an exact total.
      if (depth >= 128) { stats.depthLimited = true; return {histogram:[], exact:false}; }
      const id = key(state);
      const memoKey = mode === 'merges' ? id : [...seen].sort().join(';');
      // The current node matters even when two paths have visited the same set.
      const cacheKey = id + '/' + memoKey;
      if (memo.has(cacheKey)) {
        const histogram = memo.get(cacheKey); addFound(histogram, depth);
        return {histogram, exact:true};
      }
      const histogram = []; let exact = true;
      for (const move of successors(state, mode === 'merges')) {
        if (seen.has(move.key)) continue;
        // Piece contents never split: after a merge, earlier boards cannot recur.
        const nextSeen = move.state.length < state.length ? new Set([move.key]) : new Set([...seen, move.key]);
        const child = yield* visit(move.state, nextSeen, depth + 1);
        child.histogram.forEach((value, i) => { if (value) histogram[i + 1] = (histogram[i + 1] || 0n) + value; });
        exact &&= child.exact;
      }
      if (exact && memo.size < (mode === 'merges' ? 75000 : 6000)) memo.set(cacheKey, histogram);
      return {histogram, exact};
    }
    const result = yield* visit(initial, new Set([key(initial)]), 0);
    return result;
  }
  globalThis.ColorStackSolver = {key, direction, settle, viable, successors, shortest, countRoutes, lowerBound};
})();
