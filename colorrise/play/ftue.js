/* All campaign-specific onboarding presentation rules live here. */
window.ColorStackFTUE = (() => {
  const normal = Object.freeze({ target: null, hideHUD: false, completionText: '', nextOnly: false });
  function rules(campaign) {
    if (!campaign?.introTarget) return normal;
    return { target: campaign.introTarget, hideHUD: false, completionText: 'Perfect Color Stack!', nextOnly: true };
  }
  function applyGame(game, rule) {
    game.classList.toggle('ftue-first-game', rule.hideHUD);
    game.querySelector('header').inert = rule.hideHUD;
  }
  function applyResult(result, rule, success) {
    result.classList.toggle('ftue-completion', success && rule.nextOnly);
  }
  function completion(rule, success, earnedMessage) {
    const custom = success && rule.completionText;
    const text = custom || earnedMessage;
    return { text, label: custom || (text ? `First-try three-star win. ${text}` : '') };
  }
  function mountBoard(board, rule) {
    let gesture = null;
    if (!rule.target) return { begin() {}, move() {}, end() {} };
    const slot = document.createElement('div');
    slot.className = 'ftue-drop-target';
    ColorStackShape.attachTarget(slot);
    const help = document.createElement('span');
    help.className = 'ftue-placement-help';
    help.setAttribute('role', 'img');
    help.setAttribute('aria-label', 'Drop here');
    help.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5v22M8 19l8 8 8-8"/></svg>';
    help.setAttribute('aria-hidden', 'true');
    slot.append(help);
    board.prepend(slot);
    const reveal = visible => {
      help.classList.toggle('is-visible', visible);
      help.setAttribute('aria-hidden', String(!visible));
    };
    return {
      begin(event, piece) {
        gesture = { x: event.clientX, y: event.clientY, dragged: false, purple: !piece.classList.contains('ftue-yellow') };
        reveal(false);
      },
      move(event) {
        if (!gesture) return;
        if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 6) {
          gesture.dragged = true;
          reveal(false);
        }
      },
      end({ solved, cancelled }) {
        if (!gesture) return;
        reveal(!solved && (gesture.dragged || (!cancelled && gesture.purple)));
        gesture = null;
      },
    };
  }
  return Object.freeze({ rules, applyGame, applyResult, completion, mountBoard });
})();
