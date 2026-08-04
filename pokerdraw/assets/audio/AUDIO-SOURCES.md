# Poker Draw audio sources

These files were copied from Marshall Smith's recent local game projects at the user's request.

- `music/music-gameplay-loop-01.mp3` (the game's single looping music track)
  - Source: `/Users/marshallsmith/Game Skate/public/audio/`
- `sfx/card-woosh.wav`, `sfx/correct.wav`, `sfx/incorrect.wav`, `sfx/ui-click-heavy.wav`, and `sfx/jackpot.m4a`
  - Source: `/Users/marshallsmith/Documents/GitHub/Hoops/Hoops/Hoops/three-port/public/assets/audio/sfx/`

The current files under `cues/` are short temporary derivatives of those five source sounds. The current `ambience/ambience-poker-room-loop.mp3` is a generated low-level placeholder bed. Replace the cue, music, and ambience files according to `AUDIO-CLIP-REQUEST.md`; none of these placeholders are final production audio.

The repository is private. Confirm the original production/license records before redistributing these tracks publicly.

## Hold'em production cues

The files under `holdem/` were supplied and named by Marshall for their exact in-game actions.

- Source: `/Users/marshallsmith/Game Poker/Audio/Raw/`
- Card 1–6 are randomized without immediately repeating the same variation.
- Bet 1–5 and Win 1–4 are intensity ladders selected by the amount in big-blind units.
- `Button.mp3` is used while changing a wager and for UI controls. Bet cues play only after the table accepts a bet or raise.
