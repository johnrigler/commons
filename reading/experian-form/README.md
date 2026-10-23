# Experian correction form

The public edition is a two-page **blank** request. Names, account references,
amounts, facts, evidence and consumer signatures are unfilled. It supports one
consumer or two consumers disputing the same reported item in separate files.
It replaces no private case document and includes no private evidence.

`index.html` selects the self-contained filling interface. Inputs change only
the DOM in the current tab; there is no persistence, URL encoding, submission,
analytics or upload. Print / save PDF makes a separate completed working copy.
The blank PDF download always selects the unchanged canonical file. Signatures
are handwritten on the private copy. Additional identification/address sheets
and supporting copies are separate enclosures.
The print button checks whether entered text fits its fixed space; continue
long explanations on an attachment rather than printing clipped text.

## Edition and intended signing

`Experian-Correction-Blank.pdf` selects the immutable CID-named PDF. `edition.json`
records the exact binary PDF SHA-256, raw CIDv1, supplied author address,
signature status and IPFS pin status. Binary PDF bytes use the same raw CID
profile as ordinary files; they are not UTF-8 text and are not normalized.

**This edition is unsigned and has not been pinned to IPFS.** A calculated
`ipfs://` reference is not a pin receipt or proof of gateway availability.

The requested final Commons record is the **author-signed blank PDF**, not a
completed consumer letter. Use an existing signing identity with the
[Mogwai workbench](https://github.com/johnrigler/mogwai/blob/main/signatures/README.md),
inspect the signature and blank fields, then calculate a new CID from the final
signed PDF bytes. Preserve this unsigned edition. Pin the signed PDF through
the Commons publication workbench, verify the provider-returned CID, and record
the actual receipt and public certificate reference in a new manifest. Private
keys and Pinata tokens never belong in this repository. No ledger transaction
is required or claimed by this template publication.

A printed author address is attribution, not a cryptographic signature. A
consumer's later completion or signature creates a separate derivative and
does not inherit verification of the blank edition's author signature.

## Rebuild

From this directory, with Python 3, ReportLab, DejaVu fonts and PHP 8 available:

```bash
python3 source/build.py
source /absolute/path/to/commons/sb/publish.bash
sb.publish source/page.php
python3 source/record.py
```

`build.py` draws real blank lines and reads fixed text from the numbered HTML
parts. It takes no consumer data or credentials. It is a documented ReportLab
publication, not a browser-print export. After a content change, refresh the
manifest and portal references, render both PDF pages and check printing in the
browser. Preserve historical CID-named artifacts.

Primary sources, checked 23 October 2026:

- https://www.experian.com/help/dispute-credit
- https://uscode.house.gov/us/usc/119-120/t15/s1681i/

Authorship: `LcudkPQzLuuqsnzHSmJ7iLREaHStvPKRVb`. AI-assisted adaptation;
independent legal review is not recorded. CC0.
