> Current articles: [The cost of challenging a claim](arguments/index.html).
> Linked PDFs below preserve earlier editions; the live feed uses the revised HTML.

# Request and shared explanations

For the broader model, start with the [new six-page overview and reading order](overview/README.md).
Then use this issue-specific edition as a concrete example.

The [current HTML request](index.html) leaves the bureau, collector and lessor
fields blank. It accepts private completion in the browser. The new
[two-page signed-document inquiry](correspondence/index.html) also provides
handwriting space, two sender signatures and reviewable email text.

## Historical October 21 edition

The [frozen reading draft](bafkreicu3dwh77loihteozbsd4obycblqe24bw3iwdrcyzxkjealctmknq.html)
and [four-page PDF](Commons-Request-and-Explanations.pdf) preserve the original
October 21 edition. They contain editable example organizations and earlier
attribution. They are retained historical records, not the current generic
correspondence. Editing the current HTML does not change this PDF.

[Edition metadata](edition.json) records the current HTML separately from the
historical PDF. Byte verification does not establish the argument's truth or
legal effect. No author signature, IPFS pin, dispatch or chain transaction is
claimed for the current generic edition.

## Walk through the process

The [traffic-ticket branch](traffic/) is a separate set of connected articles:
the ticket as a toll, what reaches an insurer, and municipal dependence on
citation revenue. It connects to the administrative-burden explanation while
preserving the original rent-dispute edition and its scope.

The [preparation and assistance directory](assistance/) provides a separate
three-page PDF: a self-service walkthrough, an optional blank credit-correspondence
assistance record, and the shared structure for future traffic-ticket and VA cases.
The original four-page reading edition remains unchanged.

## Sources and future editions

The HTML and PDF above were imported without changing the delivered bytes.
Keep the CID-named HTML immutable. The [authoring directory](source/) contains
numbered page parts, the stylesheet, JavaScript source and a PHP assembler.
Reconstructing those source parts reproduces the current HTML exactly.
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

