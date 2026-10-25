# Commons Tech

Three connected articles: the Tech introduction, F-Droid, and Shizuku call recording.
Numbered HTML parts and `source/page.php` assemble the standalone edition.
`edition.json` records exact bytes and separate signature/pin/transaction status.
The portal bundles the frozen edition and exposes each article under `entry/`.

Sources were checked on 2026-10-25. The Galaxy A15 setup has not yet passed a
recording test. The Termux/Mogwai intake is a proposed workflow, not implemented
integration. This edition contains no jurisdiction-specific recording-law advice.

Rebuild the standalone edition by rendering `source/page.php` to a temporary file,
calculating its raw CID with `sb/cid.php`, saving a new CID-named HTML file, and
moving `index.html` to that filename. Update the manifest and portal references,
then source the absolute `sb/publish.bash` path and run `sb.publish` at repository
root. Never overwrite a historical CID file or render through an index symlink.
