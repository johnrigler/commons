# Reusable documents and signed editions — October 20, 2026

## Documents can be as long as the argument needs

Commons is not restricted to one-paragraph statements. A reusable unit can be
a paragraph, a full argument or a cluster of linked documents. Author in HTML
or SB Shell's numbered parts for browser reading and Chrome PDF output.
PDF is a published/signable edition, not a mandatory authoring format or the
only format that can have an external signature or ledger commitment.

This is the editorial direction, not a change to the current reader's file
profile. Existing CID-named Markdown statements and HTML snapshots remain
immutable. The current raw-CID profile retains its 1 MiB limit; larger objects
need an explicit supported profile or edition structure, never silent
truncation or an invented CID. The current interface is not a PDF-signing UI.

## First issue: unsupported rent escalation

The first substantive document to develop is **Unsupported rent escalation**.
Its working argument is that a rent charge needs the contractual/legal basis
and required steps applicable to that charge, and that forwarding a disputed
balance into collection or credit reporting does not itself establish that
basis. The proposed "legal friction" explanation concerns the cost, delay and
complexity of contesting charges. Treat its prevalence and causal effect as
claims to substantiate, not findings already proved by this discussion.

Start by distinguishing a rent increase from accelerated future rent,
concession recapture, fees and mitigation/reletting calculations. Do not
silently substitute one for another. Identify the jurisdiction and applicable
lease/addenda, dates, notices, calculations and legal sources for each claim.
One case's missing document does not establish an industry-wide violation.

The intended cluster is:

1. **Unsupported rent escalation** — the underlying issue, terminology,
   relevant requirements, supporting sources and open questions.
2. **NCS** — collection practices and the asserted balance, referencing the
   exact version of the first document and NCS-specific sources.
3. **Experian** — reporting and dispute handling, referencing the relevant
   earlier versions and its own evidence.

The operator recalls an NCS-authored publication about the low chance of
collecting a roughly $10,000 balance. Locating its original, exact wording,
date, context and relevance is pending. This note is not a quotation or a
finding that it concerns this particular balance. Do not invent its source.

## Source labels and case boundaries

Continue the [label-first workflow](SOURCE-LABELS.md): the operator labels
original sources; an assistant drafts the narrative with references; the
operator reviews the resulting edition. Keep quotations, observations,
arguments and unresolved questions identifiable. Signing a statement is an
attestation to a particular version, not independent confirmation of its truth.

Commons holds public reusable material. Daisy keeps a case's working pieces
and chronology. CertLedger is intended to present finished case PDF work
products, as exact copies or references to fixed Daisy editions. Keep case
and customer access boundaries intact. Mogwai's private home profiles and
signing keystores are not public Commons content. No automatic repository
migration was requested.

## Source, PDF edition and external commitment

Preserve exact source versions, their metadata and selected order. Build the
HTML edition, print it to PDF in Chrome, then apply any PDF signature and
inspect the resulting file. Hash the **completed signed PDF** before making
an external wallet signature or blockchain commitment to it. Preserve the
relationship between the source edition and that PDF; their hashes differ.

An embedded PDF signature and an external signature/transaction cover different
objects. Both may be useful. Record who attests to what, which certificate or
wallet key was used, and the precise bytes/references involved. The chain need
not be Litecoin. A commitment alone does not establish authorship, truth,
proper delivery, authority or legal admissibility.

The signature appearance can include both a name and a public wallet address.
A wallet-signed binding to the certificate can demonstrate address control;
merely printing the address cannot. Actual binding/verifier support remains
future work in Mogwai, along with any common-secret PDF key-generation UI.

For paper, use clearly labeled QR references to the signed digital edition,
identity record or ledger receipt as needed. A QR retrieves evidence; it does
not itself validate the surrounding printout. Do not embed a PDF's own final
CID/hash into itself. Use a preassigned reference before signing, or put the
final commitment on an external manifest/registration sheet afterward.

## Next session

Read [Daisy week 43's first block](https://github.com/johnrigler/daisy_2026/blob/main/43/1_01.html)
before starting another feature. Expand Unsupported rent escalation into a
source-grounded HTML document, allowing the length it needs. No signed PDF,
new canonical statement CID or chain transaction was produced by these notes.

[Mogwai's implementation plan](https://github.com/johnrigler/mogwai/blob/main/docs/SIGNED-EDITIONS.md)
covers key/certificate formats and automatic PDF signature disclosure.
