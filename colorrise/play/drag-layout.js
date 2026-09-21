// Compare possible placements of the held stack, independent of its height or animated neighbors.
(() => {
  function insertionPositions(heights, from, gap) {
    const positions = [0];
    heights.forEach((height, index) => {
      if (index !== from) positions.push(positions.at(-1) + height + gap);
    });
    return positions;
  }
  function closestInsertion(top, positions, current, hysteresis = 6) {
    let closest = current;
    positions.forEach((position, index) => {
      if (Math.abs(position - top) < Math.abs(positions[closest] - top)) closest = index;
    });
    // A small dead band stops tiny finger tremors from repeatedly switching neighboring slots.
    return Math.abs(positions[closest] - top) + hysteresis < Math.abs(positions[current] - top) ? closest : current;
  }
  function horizontalOffset(delta, range) {
    if (!Number.isFinite(delta) || !Number.isFinite(range) || range <= 0) return 0;
    // Follow small sideways motion closely, then soften into the configured travel limit.
    return range * Math.tanh(delta / range);
  }
  globalThis.ColorStackDrag = {insertionPositions, closestInsertion, horizontalOffset};
})();
