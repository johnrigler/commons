# Commons

Shared statements, individual cases, verifiable editions.

Commons holds reusable arguments and source references that people can
reuse in their own cases. Country, state, institution and administration period
describe a statement's scope. The individual case adds its evidence, dated
events, correspondence and requested actions. An edition names the exact
versions it selected.

Documents can be as long as their argument needs. HTML/SB Shell is the
authoring and reading path; a PDF can be a signed publication edition.
[The October 20 direction](docs/SIGNED-EDITIONS.md) records the rent/NCS/Experian
cluster, embedded and external signatures, paper QR references and next steps.
This does not change the current reader's CID profile or frozen statements.

The initial entries are **draft descriptions of this design**. They do not make
findings about a debt, company or individual. The NCS / GitHub / rent escalation
fields in the announcement form are editable examples.

## Label sources, then tell the story

The preferred case workflow is to give the sources descriptive labels, then
have an assistant assemble a source-grounded narrative using reusable Commons
documents. Manual attachment placement is optional. See
[Source labels to narrative](docs/SOURCE-LABELS.md). Individual evidence stays
in its intended Daisy record; private identity fields stay in the local home
database used by Mogwai.

## Run it

Open `index.html`, or serve the repository with any static web server:

```bash
cd ~/commons
python3 -m http.server 8000
```

Visit `http://localhost:8000/`. The current HTML snapshot includes its JavaScript,
stylesheet, statement text and catalog. It has no CDN dependencies or reader-side
PHP requirement. Verification and downloads work offline in browsers that expose
Web Crypto to local files. Use HTTPS or localhost for normal browser operation.
Pinata requires a network connection.

## The two components

- `verify.js` calculates CIDs from exact bytes and checks CID filenames.
- `pinata.js` uploads verified bytes to **public IPFS** through the Pinata V3 API.

`index.js` supplies the interface. `thunderwords.js` prepares a Litecoin
announcement for later use in Chisel. These are ordinary browser scripts;
Node.js is used only by the optional development tests.

The interface verifies the statement bytes bundled into this frozen page.
It does not silently fetch a changing GitHub branch. Choose a local file to
check a working-copy file against its name. Rebuild the page after changing
the catalog or source files.

## Content names

The first profile is deliberately small:

| Property | Value |
| --- | --- |
| CID version | 1 |
| Multibase | lowercase base32, no padding |
| Codec | raw (`0x55`) |
| Hash | SHA-256 (`0x12`), 32 bytes |
| Block size limit | 1 MiB |
| Statement filename | `statements/<CID>.md` |

For these files, the CID is base32 of `01 55 12 20` followed by the SHA-256
digest, prefixed with `b`. Spaces, capitalization, BOMs and the final newline
are bytes too. The verifier does not normalize them. `.gitattributes` prevents
Git from changing line endings in CID-named content.

Changing a statement creates a new CID and a new file. Preserve the old file
while historical editions reference it. `statements.json` records titles,
authorship, review status, scope and source links. The paragraph CID covers its
text; the downloaded edition manifest also commits to the selected metadata
and order. Metadata changes therefore produce a different edition CID even
when the paragraph text is unchanged. Verification establishes byte identity;
sources and review support the argument.

## Pinata

1. Create a Pinata token with file read and write access.
2. Enter it under **Pinata** and connect. The input is cleared immediately;
   the token stays in JavaScript memory until disconnect or reload.
3. Select statements and choose **Pin selected edition**. Each statement is
   verified, checked against the connected account and uploaded if missing.
   The edition manifest is uploaded after all selected statements succeed.
4. Download the receipt to retain the returned file IDs and CIDs. A partial
   failure leaves a receipt marked `complete: false`; existing pins remain.

**Pin this page** pins the self-contained HTML served at the current URL.
**Verify a file** can calculate and pin a local file, including a snapshot.
A file that fails its expected CID check cannot be pinned through that control.

Uploads use a one-block CARv1 archive with `network=public` and `car=true`.
This preserves the locally calculated raw root CID instead of depending on
Pinata's UnixFS import profile. The response must contain the expected CID
and a file ID before success is recorded. Account listings supply pin status;
a live independent gateway retrieval is a separate availability check.

No credentials are written to files, localStorage, sessionStorage or receipts.
The public tool uses each operator's own token. A future shared publishing
service can issue restricted presigned upload URLs without embedding its
account token in the public page.

The implementation has API contract tests with mocked responses. A real
account pin is not part of repository setup and needs an operator token.

## SB Shell keeps the publication

The working filesystem provides the structure:

| Path | Meaning |
| --- | --- |
| `index.php` | Relative symlink to `sb/page.php`, the Commons publication assembler |
| `1_*.html` | Ordered page parts; deliberate symlinks work here too |
| `statements/` | Immutable paragraph files |
| `<CID>.html` | Completed self-contained rendering |
| `index.html` | Relative symlink selecting the current rendering |
| `sb/publish.bash` | Inspectable `sb.publish` function |

This is a small publication assembler for Commons, using SB Shell's ordered
includes and symlink conventions. SB Shell's live directory viewer, catalog,
clipboard and PHP endpoints remain in `johnrigler/mogwai/sbshell/`; they are not copied
into the public reader.

Rebuild with PHP 8+ and Bash:

```bash
source ~/commons/sb/publish.bash
cd ~/commons
sb.publish
```

Select the local PHP binary when needed:

```bash
SB_PHP=php8.2 sb.publish
```

The function renders `index.php` into a temporary file, computes the exact CID,
saves the snapshot, then atomically moves the `index.html` symlink. An existing
snapshot is checked before reuse. Failed renders leave the current link alone.
Repeated builds with unchanged inputs produce the same name. The function runs
in a subshell and preserves the caller's directory. It can also render another
operator-selected PHP entry point with `sb.publish ./other.php`.
An existing SB Shell save/build hook can invoke it in the background with
`sb.publish &`; this initial version does not install a separate file watcher.

Never run `php index.php > index.html` when `index.html` is a symlink: shell
redirection follows the link and overwrites the old snapshot. The PHP source
may stay in the working tree; readers use the rendered file. If a static host
requires a real entry file, resolve the link into its upload directory with
`cp -L index.html /path/to/export/index.html`; keep the working-tree symlink.

A local link can move. An IPFS directory is a fixed snapshot, so publishing a
changed directory produces a new directory CID. The self-contained HTML can
also be pinned directly as one file.

## Litecoin announcement draft

The announcement form produces checksum-verified Litecoin mainnet P2PKH
addresses and an OP_RETURN script. It includes the general Thunderword:

```text
LLLLLLLLLLLLLLLLLLLLLLLLLLLLXgkk2V
```

The root and 28-character stem / 6-character suffix construction come from
Chisel's `chisel.thunderwords.js` and `chisel.unspendable.js`, inspected at
commit `af1b735e76dee42e546adf0020a08afa53d7e37a`.

Commons makes its default role mapping explicit:

| Role | Default prefix | Example |
| --- | --- | --- |
| Name / person / organization | `LLx` | NCS or John Rigler |
| Transport | `LMx` | GitHub or GitHub.com |
| Subject | `LNx` | Rent escalation |

These are configurable Commons defaults. They do not claim that Chisel's
existing A/B/C semantic parser already recognizes this chain-specific mapping.
Chisel also uses `LLx` plus 16 hexadecimal digits for sticker IDs; that particular
shape should not be used as an entity label without coordinating the reader.
The exported draft records the chosen role profile alongside each address.

The body may be a repository URL, short message or `ipfs://<edition-CID>`.
**Use selected edition CID** prepares that exact reference; pinning it is a
separate explicit action. The current Chisel-compatible OP_RETURN profile is
80 UTF-8 bytes. Oversized bodies and tags are rejected rather than truncated.

The JSON download is a **preparation format**, not a signed transaction or an
existing Chisel importer contract. Address output amounts are `null`; use
Chisel to choose amounts and fees, supply UTXOs, sign and broadcast. Commons
contains no key input, funding selection or broadcast path.

Two generated drafts are included for inspection:
[the Commons announcement](examples/commons-announcement.draft.json) and
[the NCS / rent escalation example](examples/ncs-rent-escalation.draft.json).
Both have unset address-output amounts and have not been broadcast.

## Checks

```bash
node --test tests/core.mjs
SB_PHP=php8.2 node --test tests/publication.mjs
```

The checks cover independent CID/hash vectors, exact byte preservation, CARv1
structure, upload parameters, CID mismatch and authentication failures,
Litecoin Base58Check checksums and announcement boundaries, and PHP snapshot /
symlink behavior. Run browser checks after changing the interface.

## Related projects and specifications

- [Daisy 2026](https://github.com/johnrigler/daisy_2026): chronological records;
  the week 43 design brief provides background for this direction.
- [SB Shell](https://github.com/johnrigler/mogwai/tree/main/sbshell): filesystem organization,
  ordered publication and print layout.
- [Chisel](https://github.com/johnrigler/chisel): transaction tooling and
  Thunderword streams.
- [IPFS content identifiers](https://docs.ipfs.tech/concepts/content-addressing/)
- [CARv1 specification](https://ipld.io/specs/transport/car/carv1/)
- [Pinata public upload API](https://docs.pinata.cloud/api-reference/endpoint/upload-a-file)

The repository retains its existing CC0 1.0 Universal dedication in `LICENSE`.
Record third-party material and its terms separately when adding sources.
