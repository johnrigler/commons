> Current reading: [The cost of challenging a claim](../arguments/index.html).
> This branch's former articles are consolidated into the current research collection.
> The source parts and edition records below preserve earlier publication history.

# Traffic tickets, insurance, and municipal revenue

[Read this branch](index.html). Three connected Commons articles develop a
different subject area from the rent and credit-reporting dispute:

1. **The ticket as a toll** asks why a better routine outcome can require an
   extra payment to an intermediary. It preserves John Rigler's account of an
   additional $50 lawyer fee, court contact, a reduced fine, and removal of an
   insurance consequence. He also identifies Grapevine, Texas, for one ticket.
2. **What the insurer gets to see** distinguishes reporting, dismissal,
   amended charges, license points, and insurance-use restrictions, using
   Grapevine, Austin, California, North Carolina, and Florida primary sources.
3. **When citations fund the town** connects municipal financial dependence
   with enforcement incentives. Henderson's FY2025 General Fund audit supplies
   a concrete financial example; USCCR, DOJ, and Louisiana law supply the
   broader findings and interstate allocation rule.

The final source section identifies sixteen public references. Rules and fees
were checked October 21, 2026. The articles distinguish official source content,
calculation, the author's argument, and attributed recollection. No national
count of cities or conclusion about the safety of an individual driver is made.

Authorship: John Rigler. Research and drafting: AI-assisted from his account,
clarifications, and the listed sources. Status: unsigned editorial research
draft; no independent legal review recorded. The actual ticket, lawyer's bill,
court order, and related private evidence belong in the individual Daisy case.
The current Grapevine rules do not establish the terms of a past unknown case.

## Publication and ledger preparation

`edition.json` records exact artifact bytes, sources, scope, the account's
known and missing fields, and the relationships among the articles. The
CID-named JSON copy freezes that record. The prepared announcement at
[`examples/traffic-tickets.draft.json`](../../examples/traffic-tickets.draft.json)
references the frozen edition record and includes the Commons transport index.

The article and edition CIDs are calculated identifiers. GitHub publication,
an IPFS pin, and a signed blockchain broadcast are distinct events. This
change prepares the Litecoin announcement with unset address amounts. Pin the
edition JSON and the referenced HTML through an operator's publishing account;
use Chisel to fund, sign, and broadcast the announcement. Add the actual
transaction reference in a later receipt. No funded wallet, operator token,
live IPFS pin, or on-chain transaction is claimed here.

## Edit and rebuild

Keep HTML in the numbered `source/1_*.html` parts and JavaScript in
`source/index.js`. The PHP assembler embeds the parts and stylesheet for a
self-contained reading edition. From this directory:

```bash
source ~/commons/sb/publish.bash
sb.publish source/page.php
```

Then refresh the exact hashes, the edition record and announcement, and the
portal catalog references deliberately. Rebuild the portal from the repository
root with `sb.publish`. Preserve every earlier CID-named file. Chrome's print
dialog supplies the print/PDF rendering from the same HTML.
