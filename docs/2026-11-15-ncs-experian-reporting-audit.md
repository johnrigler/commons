# Credit-reporting data lineage: a furnisher, a bureau, and a changed balance

*Commons research and action plan · 15 November 2026 · Author identity: LcudkPQzLuuqsnzHSmJ7iLREaHStvPKRVb · Unsigned AI-assisted analysis; no independent legal review*

## The model to test

An original creditor or account owner maintains source transactions and contractual records. A collector may receive those records, calculate or adopt a collection balance, and furnish collection data to a consumer reporting agency. A bureau such as **Experian** stores and processes the furnished information, runs its own rules and dispute procedures, and produces a consumer-facing report.

**National Credit Systems (NCS)** and **Experian** are a concrete example of these distinct roles. Naming those companies identifies the reporting chain to investigate; it is **not** a finding that either entity broke the law or that every report field is passed through unchanged.

A consumer report is **not an immutable ledger of raw transmissions**. Its display can combine reported fields, calculated or formatted values, historical monthly snapshots, and bureau-specific removal estimates. A balance change visible in a report does not by itself establish who initiated the change, which Metro 2 fields were sent, or which prior values were overwritten. Likewise, saying that the bureau merely records a collector's assertion understates the bureau's separate accuracy and reinvestigation duties.

A useful four-layer audit distinguishes:

1. **Source accounting:** original agreement, charges, periods, payments, fees, mitigation, offsets, adjustments and authorization.
2. **Furnisher reporting:** dated NCS account records; any furnished balance, original amount, collection status, dispute notation, first-delinquency date, reporting changes and recipients.
3. **Bureau processing:** the actual data Experian received or maintains, its dispute investigations, any corrections, derived display fields and expected removal date.
4. **Consumer view:** dated report copies and screenshots. Screenshots show what was displayed; they do not prove the exact furnished transaction or its cause.

The known reporting industry often uses the **Metro 2** standard for structured periodic furnishing. Whether a particular NCS record followed a particular Metro 2 field mapping must be established from actual records rather than inferred from the Experian screen.

## Why balance-history discrepancies matter

When historical monthly values remain large but a current report displays a lower **balance** and the same lower **original balance**, the combination deserves explanation. Possible mechanisms include corrected source accounting, refreshed reporting, bureau edits during a dispute, a field-definition difference, or an account-record replacement. **Do not select one mechanism without evidence.**

A useful record is a before/after matrix, with *separate columns* for: report retrieval timestamp, historical displayed balance by month, current balance, original-balance field, status date, opened date, reported/updated date, date of first delinquency, expected removal date, dispute status and exact source screenshot identifier. Do not silently equate an integer display rounded to dollars with the source ledger's cents.

A reduction does not establish discharge, settlement, waiver, lawful accounting, or acceptance of the remaining demand. Conversely, a later correction does not automatically cure earlier actionable conduct. The evidence questions are what changed, when, who decided, what records were considered, and what each entity did after receiving prior disputes.

## The date problem: correction is not a new delinquency

**Date opened**, **last balance update**, **last status update**, **monthly collection marks**, **date of first delinquency (DOFD)**, and **estimated removal date** are different fields. An update to a collection balance does **not** lawfully restart the federal exclusion period. Under **15 U.S.C. §1681c(c)(1)**, the applicable collection-account reporting period is tied to the delinquency that preceded collection, generally with an outside framework of seven years plus 180 days from that delinquency; consumer bureaus may apply earlier deletion policies.

A projected removal date alone does not reveal the actual DOFD, nor whether that date was changed. **Re-aging should be framed as a testable hypothesis, not a conclusion.** To test it, obtain the DOFD and its source evidence, compare earlier and later reported removal dates, and ask both the furnisher and bureau to account for any difference. An *earlier* projected date can also reflect bureau policy rather than a furnished DOFD.

## Practical game plan

### Phase A: preserve a before/after record, before submitting something new

- Download or print dated full Experian reports, including the full account, balance-history and dispute sections, plus any earlier copies. Keep exact original screenshots and files unedited; optionally hash them separately and record each capture time.
- Build a table from each source **without replacing its historic value with the newest value**. Mark which fields are unknown, especially the original delinquency date and reporting history. If copies of Equifax or TransUnion reports exist, index them separately rather than assuming their values match Experian.
- Reconcile amounts to the source creditor's line-item ledger. Quantify any discrepancy between a removed balance amount and an individual accelerated-rent charge; a net change need not equal a single line item.

### Phase B: ask the furnisher (NCS in this example) for a traceable explanation

Use NCS's accepted written dispute/communications route; confirm whether its portal is intended for collector disputes and/or direct furnisher disputes and preserve its exact receipt. Ask:

1. What is the **complete dated balance adjustment log**, identifying each charge removed, added, credited, or reclassified? Is the remaining amount claimed to be collectible, and why?
2. Who authorized the accounting change: the original creditor/manager, NCS, or another role? Which documents did the reviewer actually examine?
3. What are the **original and current collection amounts** in NCS's account, and what precisely was reported to Experian for each month or correction event?
4. What **DOFD** was furnished, what source document supports it, and has it ever changed? Separate the debt's first delinquency from the collector's account-open and update dates.
5. Was the account flagged as **disputed** in communications to the bureaus? On which dates and with what result?
6. Which prior dispute IDs, receipts, written statements and determinations address the **particular underlying objection**, rather than simply repeating that the original creditor confirmed the account?

Save the exact submission, attachments and confirmation. A **follow-up phone call** can check receipt, routing and status, but preserve what is said and comply with applicable recording-consent law. **Certified mail** directly to the collector adds independent receipt evidence where helpful. A phone call is not a replacement for a legally required written dispute. Sending a new copy does not establish that an older dispute was never acknowledged or that it restarts a legal clock.

### Phase C: ask Experian about *its* record and investigation

- Request the consumer report and dispute outcome records available to the consumer, including **DOFD used to determine the scheduled removal**, field definitions for original balance and status date, and whether Experian changed or received corrected data after a prior dispute.
- Make a specific dispute if a demonstrably incorrect field remains, giving the exact field, comparison evidence and requested correction. Do not describe an *unproven* re-aging claim as fact.
- For a qualifying bureau dispute, ask for the reinvestigation results and, when appropriate, the **description of the procedure used** under 15 U.S.C. §1681i(a)(7). Ask which material was conveyed to NCS and how the correction was verified.
- Keep NCS portal communications, Experian bureau disputes, and correspondence to the original creditor **separate by recipient and triggering duty**.

### Phase D: reconcile what happened, not merely what appears now

For each communication, record **submission date**, delivery/receipt evidence, recipient, unique case ID, exact objection, response date, written result, records examined, correction furnished, and effect visible on each bureau. Distinguish:

- source charge correction versus collection-account correction;
- balance accuracy versus reporting completeness and dispute notation;
- corrected present value versus historical past reporting;
- the date a bureau *received* a notice versus the date a person sent something to the property manager;
- a response that exists but may be inadequate versus **no response**.

The working question is whether the source calculation was supported, whether the collector and bureau reasonably investigated their respective disputes, and whether the same account is now being described consistently across systems.

### Phase E: decision points

**If the DOFD and removal date are unchanged and supported:** document that the visible update did not establish re-aging; continue reviewing amount, investigation and furnishing accuracy.

**If the removal estimate has shifted:** obtain the old and new full reports and the underlying DOFD before attributing the change to any party. Dispute a proven erroneous DOFD or improper reporting age using the applicable channel.

**If the amount was corrected but no itemized basis was supplied:** preserve the change as evidence, request the accounting rationale and previous investigation files, and do not concede the residual balance.

**If the answer is incomplete or inconsistent:** escalate with the accumulated chronology, disputed field and copies of receipts through appropriate consumer complaint, legal review or court process. Do not claim a statutory violation or specific damages merely from silence, delay or a revised number.

## Applicable law and boundaries

Existing Commons legal references distinguish the applicable actor and trigger: **15 U.S.C. §1681e(b)** (bureau accuracy procedures), **§1681i(a)** (bureau reinvestigation), **§1681s–2** (furnisher duties and limits on private enforcement), **12 CFR §1022.43** (qualifying direct furnisher disputes), **Texas Finance Code §392.202** (covered third-party collector's written inaccuracy process), and **15 U.S.C. §1692g / 12 CFR §1006.38** (the separate federal validation-period and collection-pause rules). See [Commons law registry](../legal-references.json).

The collection reporting period follows **15 U.S.C. §1681c(c)** and the report-obsolescence rules of **§1681c(a)(4)**, not the latest date on which a collector refreshed a balance. The detailed scope and procedural implications require review of the underlying records; a consumer-facing screen is not enough for a legal conclusion.

**Primary legal text:** [15 U.S.C. §1681c](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title15-section1681c&num=0&edition=prelim); [15 U.S.C. §1681i](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title15-section1681i&num=0&edition=prelim); [15 U.S.C. §1681s-2](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title15-section1681s-2&num=0&edition=prelim); [12 CFR §1022.43](https://www.consumerfinance.gov/rules-policy/regulations/1022/43/). Citations and links are research leads, not a legal opinion.

## Publication / privacy boundary

This article names NCS and Experian as specific organizations whose functions can be tested. It intentionally **does not publish any individual's account number, co-consumer identity, screenshot, precise debt adjustment, call transcript, mailing address, or private case dates**. Actual evidence, consent decisions and completed correspondence remain in the designated private case record. A public company profile with independently sourced company facts is separate from a reusable letter template.

This is a research and action-plan source document in Commons, **not a signed edition, completed complaint, verified creditor admission, or on-chain attestation**.
