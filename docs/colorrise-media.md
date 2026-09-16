# Color Rise website media

The homepage and `/colorrise/` share `web/src/components/ColorRiseSection.tsx`.
The current gallery uses the Color Rise app project's `appstore/cfg-002/config.json`
iPhone media list, captured September 15, 2026 (PDT). Keep its configured order:

1. Northern Lights preview video
2. Northern Lights Level 11 gameplay
3. Perfect three-star finish
4. Locations
5. Fall Colors Level 8 gameplay
6. Northern Lights puzzle collection

Files in `assets/images/colorrise/cfg-002/` are web exports of that set. Screenshots
are 660 × 1434 WebP at quality 88; the matching poster keeps its 886 × 1920 size.
The full 27.07-second preview keeps its 886 × 1920 dimensions and 30 fps, encoded
as H.264 CRF 22 with AAC 128 kbps audio and MP4 fast start. The versioned asset
directory prevents browsers from reusing the previous gallery media.

These are prepared App Store media. Publishing them on the website does not
upload, submit, or release the app in App Store Connect.
