# Commons

- This repository is public. Publish reusable statements and public source references; keep personal case evidence in its intended Daisy record.
- The browser runtime is vanilla JavaScript. No framework, build service, CDN or Node runtime is required by readers.
- Preserve the existing CC0 license. Record authorship, sources, scope, date and review status independently of byte verification.
- The content profile is lowercase base32 CIDv1, raw codec, SHA-256, at most 1 MiB. Exact UTF-8 bytes include whitespace and the final newline.
- Never edit a CID-named file in place. Create a new filename and update the catalog or symlink. Keep historical snapshots.
- SB Shell's filesystem composition applies: numbered parts, includes, relative paths and deliberate symlinks are primary mechanisms. index.php points to sb/portal.php; index.html points to the completed portal snapshot. about.html and publish.html select separate snapshots from sb/about.php and sb/page.php.
- Never write rendered output through index.html. Source sb/publish.bash by absolute path and use sb.publish to create an edition and atomically move the link.
- Keep JavaScript in its source files. The PHP assembler embeds those files, the stylesheet and statement bytes into a self-contained static page.
- Pinata tokens stay in memory only. Never commit, log, persist or embed them. Public uploads use CAR imports so the declared raw CID survives provider import settings. Verify the returned CID before recording success.
- Check CID vectors, tamper rejection, CAR structure, Pinata error/mismatch handling and snapshot/link behavior. Use a browser check for changes to the interface. Real account pinning requires an operator token; mock results must never be reported as live pins.
- Read docs/PORTAL.md for exact-parent contributions and index filtering. Go saves a local unsigned draft; pinning and ledger announcement are separate explicit steps. Keep user-supplied labels distinct from verified signatures. The B / transport semantic form maps to the repository's existing LMx encoding on Litecoin; literal LBx is outside mainnet. Do not claim Chisel's B parser already recognizes LMx. Never turn the main view into automatic recursive traversal of every untagged branch.
