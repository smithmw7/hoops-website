// Keep lifetime progress while comparing Best only within the same puzzle revision.
(() => {
  const validBest = value => Number.isSafeInteger(value) && value >= 0;
  function merge(previous, incoming, revision) {
    const bestByRevision = Object.create(null);
    let tries = 0, firstTryThreeStar = false;
    const add = (key, value) => {
      if (typeof key !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(key) || !validBest(value)) return;
      bestByRevision[key] = Math.min(bestByRevision[key] ?? Infinity, value);
    };
    for (const record of [previous, incoming]) {
      if (!record || typeof record !== 'object' || Array.isArray(record)) continue;
      if (record.bestByRevision && typeof record.bestByRevision === 'object' && !Array.isArray(record.bestByRevision)) {
        for (const [key, value] of Object.entries(record.bestByRevision)) add(key, value);
      }
      add(record.bestRevision || 'legacy-v1', record.best);
      if (Number.isSafeInteger(record.tries) && record.tries >= 0) tries = Math.max(tries, record.tries);
      firstTryThreeStar ||= record.firstTryThreeStar === true;
    }
    return {best:bestByRevision[revision] ?? null, bestRevision:revision, bestByRevision, tries, firstTryThreeStar};
  }
  globalThis.ColorStackRecords = {merge};
})();
