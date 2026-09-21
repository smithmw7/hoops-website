importScripts('solver-core.js');
let job, iterator, phase, shortestResult, running = false;
let stats;
const encodeHistogram = values => Array.from({length:values.length}, (_, i) => String(values[i] || 0n));
function send(status) {
  const histogram = encodeHistogram(stats.histogram || []);
  postMessage({job:job.id, boardKey:job.boardKey, mode:job.mode, phase, status,
    shortest:shortestResult, histogram,
    total:histogram.reduce((total, value) => total + BigInt(value), 0n).toString(),
    nodes:stats.nodes, bound:stats.bound, depthLimited:!!stats.depthLimited});
}
function run() {
  if (running || !iterator) return;
  running = true;
  const deadline = performance.now() + 2500;
  let lastUpdate = performance.now();
  while (performance.now() < deadline) {
    const step = iterator.next();
    if (step.done) {
      if (phase === 'shortest') {
        shortestResult = step.value;
        phase = 'counts'; stats.nodes = 0;
        iterator = ColorStackSolver.countRoutes(job.board, job.mode, stats);
        send('running');
      } else {
        stats.histogram = step.value.histogram;
        iterator = null; running = false;
        send(step.value.exact ? 'complete' : 'limited');
        return;
      }
    }
    if (performance.now() - lastUpdate > 200) { send('running'); lastUpdate = performance.now(); }
  }
  running = false;
  send('paused');
}
onmessage = event => {
  try {
    if (event.data.type === 'start') {
      job = event.data; stats = {nodes:0, histogram:[]}; phase = 'shortest'; shortestResult = null;
      if (!Array.isArray(job.board) || !job.board.length || job.board.some(group => !Array.isArray(group) || !group.length)) throw Error('The board contains an empty or invalid stack.');
      const flat = job.board.flat();
      if (flat.length > 13 || [...flat].sort((a, b) => a - b).some((value, i) => value !== i)) throw Error('The board must contain every color exactly once.');
      if (!flat.length || new Set(flat).size !== flat.length || !flat.every(Number.isInteger) || ColorStackSolver.key(ColorStackSolver.settle(job.board)) !== ColorStackSolver.key(job.board)) throw Error('Analyze a settled board.');
      iterator = ColorStackSolver.shortest(job.board, stats);
    }
    if (event.data.type === 'start' || event.data.type === 'continue') run();
  } catch (error) {
    iterator = null; running = false;
    postMessage({job:job?.id, status:'error', message:error.message});
  }
};
