# Poker Draw final audio request

The files in `cues/`, `music/`, and `ambience/` are temporary placeholders. Replace them using the exact names below; the game timing and playback pools are already wired to these paths. Hand-reveal-specific VFX audio is intentionally excluded from this request.

## Delivery format

- One-shots: WAV, 44.1 or 48 kHz, 24-bit preferred. Mono is fine for focused UI/card sounds; use stereo only when width or movement is part of the design.
- Music/ambience: high-quality MP3 or AAC using the exact extensions below.
- Remove accidental leading silence; keep intentional tails. Avoid hard limiting and leave roughly 3 dB of peak headroom.
- Do not bake long reverb into rapid repeated cues such as card, score, progress, or chip sounds.
- Loops must be sample-clean and seamless.

## Priority A — core play feel

| Exact filename | Target sound and timing |
| --- | --- |
| `game-start-confirm.wav` | Confident casino UI confirm, 250–450 ms; starts the camera push and first deal. |
| `round-deal-whoosh.wav` | One broad deck/dealer sweep, 350–600 ms; opens every deal. |
| `card-slide.wav` | Soft felt slide, 90–180 ms; repeats rapidly for each card. Dry, light, no heavy impact. |
| `card-flip.wav` | Crisp paper snap/flick, 70–140 ms; repeats rapidly as faces turn up. |
| `card-land.wav` | Short card-on-felt contact, 70–130 ms; subtle enough for nine-card bursts. |
| `hand-hover.wav` | Very light focus shimmer or felt lift, 60–110 ms; never brighter than selection. |
| `hand-select.wav` | Firm two-card selection lock, 120–220 ms; neutral before the answer result. |
| `answer-correct.wav` | Premium positive answer stinger, 350–600 ms; bright but smaller than final results. |
| `answer-wrong.wav` | Clear negative answer impact, 400–700 ms; weight without harsh buzzer comedy. |
| `timer-warning-tick.wav` | Urgent clock tick, 60–110 ms; plays once at 5, 4, 3, 2, and 1 seconds with rising pitch. |
| `timer-expired.wav` | Distinct time-out sting, 450–750 ms; should not sound identical to a wrong click. |
| `round-progress-step.wav` | Tiny clean meter chase tick, 60–110 ms; designed for rapid left-to-right repeats. |
| `round-progress-complete.wav` | Brighter meter cell lock/pop, 180–350 ms; marks the newly won round. |
| `round-transition.wav` | Short upward card-clear/next-round sweep, 220–400 ms. |

## Priority B — final score and chip collection

| Exact filename | Target sound and timing |
| --- | --- |
| `results-build-whoosh.wav` | Low-to-high buildup sweep, 450–750 ms; score and meter move forward. |
| `score-count-tick.wav` | Slot-like bell/tick, 40–80 ms; must tolerate up to 32 fast repeats and pitch variation. |
| `results-round-step.wav` | Reward meter light, 90–160 ms; musical and stackable across 11 steps. |
| `results-impact.wav` | Large black-and-gold result hit, 500–900 ms; supports NICE START through AMAZING. |
| `results-jackpot-impact.m4a` | Largest GRAND JACKPOT fanfare/impact, roughly 1.2–2.2 s; must clearly exceed the normal result hit. |
| `collect-confirm.wav` | Premium Collect-button lock, 140–260 ms. |
| `chips-burst.wav` | Dense initial pile/burst of poker chips, 250–500 ms. |
| `chip-fly.wav` | Tiny fast airy chip pass, 80–160 ms; several overlap during the upward stream. |
| `chip-wallet-hit.wav` | Single chip landing into the HUD, 60–120 ms; designed for many overlapping arrivals. |
| `wallet-total-settle.wav` | Final chip balance lock with short gold resonance, 250–500 ms. |
| `return-to-title.wav` | Clean resolving down-sweep, 250–450 ms; closes collection and returns to the start screen. |

## Priority C — UI completeness

| Exact filename | Target sound and timing |
| --- | --- |
| `ui-menu-open.wav` | Small upward leather/gold UI reveal, 100–180 ms. |
| `ui-menu-close.wav` | Matching downward close, 90–160 ms. |
| `ui-panel-open.wav` | Slightly broader modal reveal for How to Play and Debug, 180–300 ms. |
| `ui-panel-close.wav` | Matching modal close, 150–250 ms. |
| `ui-toggle-on.wav` | Bright positive switch click, 80–150 ms. |
| `ui-toggle-off.wav` | Muted downward switch click, 80–150 ms. |
| `ui-select-change.wav` | Neutral compact selection tick for the debug hand dropdown, 60–120 ms. |

## Music and ambience replacements

| Exact filename | Target sound and timing |
| --- | --- |
| `music-gameplay-loop-01.mp3` | Main premium poker/casino gameplay loop, seamless, approximately 90–180 s. Energetic but leaves space for rapid SFX. |
| `music-gameplay-loop-02.mp3` | Compatible alternate loop with the same loudness and tonal world, seamless, approximately 90–180 s. |
| `ambience-poker-room-loop.mp3` | Very subtle premium card-room bed: soft room air, distant chips/cards, no clear voices, seamless, approximately 30–90 s. |

## Replacement folders

- SFX: `public/assets/audio/cues/`
- Music: `public/assets/audio/music/`
- Ambience: `public/assets/audio/ambience/`

The final delivery can be one folder containing those three subfolders. No source-code changes should be required when every filename matches exactly.
