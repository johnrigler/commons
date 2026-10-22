# Portal, connected records and the Commons index

The entry page is a feed across subjects. Readers filter by subject or type,
search, and open full articles in a reading window over the feed. Connected
articles open in the same window; Escape or **Back to the feed** returns to the
collection. The original frozen document remains available from each article.
Goals, structure and the broader project argument live in the README and
`about.html`. Verification, Pinata and Litecoin preparation live in
`publish.html`. These are self-contained static editions; PHP builds them,
but readers do not run PHP.

## This view and the public stream

`portal.json` supplies this repository's initial collection. It names real
frozen HTML editions, their section fragments, companion PDFs, authorship,
review status and direct connections. It does not pretend the examples are
already ledger publications. The initial assistance record is a blank template,
not a signed attestation. The portal has an honest empty state for attestations.

The portal currently reads the bundled collection and locally saved additions.
The collection includes traffic enforcement, housing and credit reporting,
technology, and Commons practice. Subject labels describe the current view;
they are not requirements for publishing to Commons. The feed embeds the exact
original HTML bytes for each edition, verifies their CIDs before reading, and
copies only allowed article markup into the window. Sources stay with the
article. Reading the bundled collection works offline without fetching a
gateway or executing the original document's scripts.

It makes no live chain request and claims no complete address history.
Independent publishers do not need this catalog's approval to publish to the
shared address. Later readers and scribes can retrieve those records and build
their own views, as described in [the address and scribes](ADDRESS-AND-SCRIBES.md).

## B form: Commons as transport

The intended meeting point is the Commons **transport tag**, the B / second
semantic form. Chisel's cross-chain semantic parser calls `*Bx` transport.
Its address generator also checks the actual network version byte. A literal
`LBx` stem falls outside Litecoin mainnet P2PKH, so this repository already
uses `LMx` as its explicit Litecoin transport-role encoding. Do not present
this as a change to Chisel's literal B parser.

The canonical mapping in this view is:

| Property | Value |
| --- | --- |
| Chain | Litecoin mainnet |
| Semantic form | B / transport |
| Encoded prefix | `LMx` |
| Readable body | `CoMMoNS` |
| Full address | `LMxCoMMoNSzzzzzzzzzzzzzzzzzzZU8MFW` |

The address is calculated with the existing 28-character stem plus checksum
profile and tested independently for Litecoin version/checksum correctness.
`thunderwords.js`, `portal-core.js` and `portal.json` must agree on it.
The all-L address remains the broader Chisel index; it is not the Commons-only
filter. The earlier LLx/LMx/LNx draft examples remain unchanged.

## Add below, preserve the parent, choose discoverability

Open an entry, choose **Add below**, enter the contribution and choose its type.
**Go** saves an unsigned record in this browser's localStorage. Every record
has its own exact-byte raw CID and points to its parent's document CID plus
section fragment. Replies to replies point to the previous contribution CID.
Display aliases and titles are not the parent identity.

The format is `commons/contribution/1`:

```text
kind, title, text, author
parent: { cid, fragment }
indexed: true or false
transport: Commons index address or null
source: optional https:// or ipfs:// reference
created: local ISO date/time
```

The author field is a supplied label. An attestation type is a statement of
intent, not evidence of a cryptographic signature. A local timestamp is not a
trusted timestamp. Byte checks, sources, signatures, chain receipts and editorial
review are separate observations.

The main view includes only indexed additions. An unindexed addition remains
reachable through its parent and direct local link, but does not enter that
main list. The portal opens one relationship at a time; it does not recursively
fetch every reference or expand every possible branch. A different reader can
choose broader traversal later.

LocalStorage belongs to the browser origin. A GitHub Pages copy, an IPFS copy
and a localhost copy have different stores. A local link does not publish the
record to someone else's browser. Download the contribution to retain its exact
bytes before changing browser/origin or clearing site data. No remote save,
identity verification or transaction is implied by pressing Go.

## Publication path

From a saved contribution, **Download contribution** retains its exact JSON
bytes. **Publish / announce** opens the publishing workbench in the same origin.
It verifies and loads that local record, prepares `ipfs://<CID>` as the message,
and carries over the Commons-index choice. An unindexed record uses the IPFS
transport tag instead of accidentally selecting the Commons address.

Connect an operator's Pinata account and explicitly pin the loaded file if a
public IPFS copy is wanted. Preparing an announcement is another explicit step.
The resulting draft includes the shared Commons output when selected, without
duplicating an already-present transport address. Amounts remain unset and
Chisel supplies transaction funding, fees, signing and broadcast.

A ledger announcement can make a record discoverable through the shared tag.
An untagged record can still exist at another CID or ledger reference; the
default Commons view need not follow it. No live pin or broadcast was performed
as part of this repository change.

## Build and checks

The public website is served by the existing GitHub Pages deployment from
`portal-first`. Development on `main` does not update that website by itself.
After the reader checks pass, fast-forward `portal-first` to the tested commit;
the existing Pages build and deployment publishes that branch. The reader
workflow checks both branches. Preserve the configured publication branch and
its environment rules.

Numbered HTML parts, ordinary source scripts and deliberate symlinks remain
the publication mechanism. Historical CID-named HTML files are retained.

```bash
source ~/commons/sb/publish.bash
cd ~/commons
sb.publish
sb.publish ./sb/about.php about.html
sb.publish ./sb/page.php publish.html
node --test tests/core.mjs tests/portal.mjs tests/publication.mjs
```

Set `SB_PHP` to a PHP 8+ CLI binary when needed. `sb.publish` accepts the optional
entry name `index.html`, `about.html` or `publish.html`, and changes only that
entry symlink. Never redirect output through one of those links.

The browser development check uses Playwright (`node tests/browser.cjs` with
Playwright installed, or `COMMONS_PLAYWRIGHT` set to its module path). It tests
connected reading, safe text rendering, saved replies, index filtering, reload,
offline article windows, subject filters, publishing handoff, About navigation
and a phone viewport. The static reader
has no dependency on Playwright, Node, a framework or a CDN.
