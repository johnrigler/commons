# Laws, duties, deadlines and remedies

This is the common legal-reference edition for unsupported rent acceleration
and its collection, reporting, recording and litigation questions. It also
inventories legal/administrative sources already cited in other Commons subjects,
including disability and traffic. Imported references preserve the previous
edition's scope and date; inclusion is not a fresh substantive review.

| Entry | Purpose |
| --- | --- |
| `../../entry/legal-reference.html` | Shared statutory, regulatory and procedural reference |
| `../../entry/dispute-deadlines.html` | Actor, triggering notice, deadline, duty and consequence |
| `../../entry/debt-remedies.html` | Separate claims, damages, parties and discovery |

`../../legal-references.json` is the editable common source. Each detailed rule
has a stable ID, citation, covered actor, trigger, deadline, required action,
consequence, limits, primary-text URL and check date. The jurisdiction is recorded
with each rule. Judicial applications are separate from statutes and regulations.
Private case evidence and individual deadline calculations remain in Daisy.

The article parts in `source/` assemble with PHP into a self-contained HTML
edition; readers require no PHP, Node, CDN or live API. The registry bytes are
also saved under their own raw CID, recorded in `edition.json`. The main portal
embeds the frozen HTML, so reading the common reference works offline.

To revise, edit the registry and numbered source parts. Source `sb/publish.bash`
by absolute path and run `sb.publish ./source/page.php index.html` from this
directory. Record the new HTML and registry CIDs and metadata in `edition.json`,
freeze that manifest under its raw CID, update the affected portal references,
then run `sb.publish` at the repo root. Keep historical CID files unchanged.

Read `../../docs/RENT-ACCELERATION-CONTEXT.md` before interpreting a case-specific
deadline. Do not turn the author's overdue-answer position into a finding that
the debt was extinguished. This edition records no independent legal review,
signature, public IPFS pin, ledger announcement or court acceptance.
