# Request and shared explanations

For the broader model, start with the [new six-page overview and reading order](overview/README.md).
Then use this issue-specific edition as a concrete example.

The [interactive reading draft](bafkreicu3dwh77loihteozbsd4obycblqe24bw3iwdrcyzxkjealctmknq.html) and
[ready-to-use PDF](Commons-Request-and-Explanations.pdf) are the October 21,
2026 edition reviewed in conversation. Download the PDF for printing or email
attachments; no build or browser print step is required to use that copy.

The PDF contains four US Letter pages: the request, unsupported rent
acceleration, deterrence through administrative burden, and About the Commons.
Both terms are bold links. The HTML opening offers Experian, Equifax and
TransUnion, with editable collector and lessor names. Its print control selects
the request alone or all explanatory pages. Changes in the open HTML are not
saved into this prebuilt PDF; print/save a new PDF to retain edited names.

John Rigler is the author. This is an unsigned reading draft. The general
explanations are reusable; the opening's organization names are editable
examples. Private case evidence and identity documents remain outside Commons.
No independent legal review, digital signature, IPFS pin or chain transaction
is claimed. [Edition metadata](edition.json) records hashes, CIDs, scope,
review status and sources; byte verification does not establish the argument's
truth or the PDF's legal effect.

## Walk through the process

The [preparation and assistance directory](assistance/) provides a separate
three-page PDF: a self-service walkthrough, an optional blank credit-correspondence
assistance record, and the shared structure for future traffic-ticket and VA cases.
The original four-page reading edition remains unchanged.

## Sources and future editions

The HTML and PDF above were imported without changing the delivered bytes.
Keep the CID-named HTML immutable. The [authoring directory](source/) contains
numbered page parts, the stylesheet, JavaScript source and a PHP assembler.
Reconstructing those source parts reproduces the imported HTML exactly.
The repository's existing main reader and selected snapshot are retained.

For a future HTML edit, use the existing publisher from this directory:

```bash
source ~/commons/sb/publish.bash
cd ~/commons/reading
sb.publish source/page.php
```

That creates a new CID-named HTML edition and selects it with a local
`reading/index.html` symlink. Update links and metadata deliberately. Print
the selected HTML through Chrome to create a new PDF edition, review its
pages and record the exact resulting hash. The current PDF was independently
typeset from the same four articles and visually checked; it is not claimed
to be a Chrome print export. Preserve completed signed editions unchanged.

