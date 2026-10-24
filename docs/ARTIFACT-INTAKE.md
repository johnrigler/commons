# Exact-byte artifact intake and CertLedger handoff

The user-facing intake is `tools/artifacts/index.html`, linked from the portal's
**Artifacts** navigation and `entry/artifact-intake.html`. The frozen page embeds
its scripts, stylesheet and MIT-licensed pdf-lib 1.17.1. Readers need no CDN,
server-side parser or Node runtime. The CSP prevents network connections.
Web Crypto must be available (normally HTTPS or localhost).

## Artifacts and private record

Document 1 is the original digitally signed PDF. Do not scan, print, optimize,
resave or normalize it before hashing. Document 2 is related correspondence,
including an email export or a letter written and sent by the person themselves.
Preserve that artifact's own wording and bytes, including an existing typo.
Do not imply an assistant authored or sent it.

Each original file is hashed independently. Metadata extraction is read-only;
the tool never calls a PDF save routine. Unsupported/encrypted PDFs can still
be hashed; their metadata inspection reports unavailable. The local file-size
bound is 64 MiB. Source file timestamps reported by a browser are observations,
not verified document issue or dispatch times.

PDF inspection records page count, available Info properties, signature
dictionaries, declared signer/time/reason/location, ByteRange structure and
whether its excluded hex gap matches Contents, CMS digest algorithm identifiers
and readable embedded X.509 certificate subjects, issuers, serials, dates and
SHA-256 fingerprints. It does not validate the signature or signed attributes,
associate a certificate with a verified signer, check revocation/trust, or
exhaustively reconstruct historical revisions. Visible signature artwork is
not OCRed. No document scripts or links are executed.

Email `.eml` inspection extracts selected unfolded headers locally, retaining
encoded header words. It does not verify DKIM, delivery, recipient receipt or
MIME attachments. Other correspondence files receive exact-byte hashes even
where detailed parsing is unsupported.

The optional `commons/artifact-pair/1` manifest preserves the two inspection
records and the operator-asserted relation. Deterministic serialization is
`commons/sorted-json-v1`: recursively lexicographically sorted object keys,
preserved array order, JSON primitives, UTF-8 and a final LF. The downloaded
record's hash is over exactly those bytes. Save it with the two originals in
private Daisy; it does not embed the source files or replace retaining them.
No automatic save to GitHub, IPFS or browser storage occurs.

## Public commitment and actual handoff

The default target is Document 1. The selector also supports Document 2 or the
pair record. Each selection shows precisely what the digest identifies. Two
source digests do not fit this 80-byte Chisel profile as readable hex; use
separate transactions or the pair record, rather than truncate a digest.

Payload: `sha256:` plus 64 lowercase hexadecimal digits = **71 ASCII bytes**.
Script: `6a47` followed by the ASCII payload's hexadecimal encoding. This is
readable text in OP_RETURN, not the 32-byte binary digest. The transaction uses
Litecoin mainnet and the explicit **LMx / CertLedger** transport convention:
`LMxCERTLEDGERzzzzzzzzzzzzzzzWTMCKs`. This names the current intake convention;
older CertLedger design notes had not fixed an address. The general Litecoin
index is `LLLLLLLLLLLLLLLLLLLLLLLLLLLLXgkk2V`.

The downloaded `chisel-certledger-anchor-v1` draft is hash-only: no original
bytes, filenames, email headers or PDF metadata. **Review in Chisel** opens
`tools/certLedger/index.html#sha256=<full digest>` on the selected Chisel mirror.
The fragment is not an HTTP request path/query; it is read by the destination
page. That page can also read the hash-only draft file. It shows the digest,
ASCII payload, fixed indices and tag amounts. Explicit **Load into Send** writes
the existing pending artifact payload and opens Send. The existing loader
consumes it, clears pending storage, replaces recipient rows and sets ASCII.
Funding, fee checks, key use, output review, signing and broadcast stay in Send.
No real transaction receipt is manufactured by Commons or the review page.

## Publication and checks

Use `sb.publish ./source/page.php index.html` from `tools/artifacts/` to freeze
the tool, then the same command in `reading/artifact-intake/` for its compact
overview. Only the overview is embedded in the portal to keep the portal's
raw-CID page under 1 MiB. Each tool edition separately freezes the large
self-contained HTML and records the vendor version/hash and signature status.
Never change earlier CID-named pages in place.

Tests execute actual inspection against synthetic PDF object streams and CMS
certificate fixtures, independent source and manifest SHA-256 calculations,
email headers, the 71-byte payload and the existing Chisel artifact loader.
The browser check covers two file selections, hash-only handoff, downloads,
target changes and clearing. Test certificates are synthetic, untrusted fixtures;
no signing key is committed.

Primary references: [PDFDocument](https://pdf-lib.js.org/docs/api/classes/pdfdocument),
[PDFSignature limitations](https://pdf-lib.js.org/docs/api/classes/pdfsignature),
[CMS SignedData, RFC 5652](https://www.rfc-editor.org/rfc/rfc5652),
[X.509 certificates, RFC 5280](https://www.rfc-editor.org/rfc/rfc5280).
