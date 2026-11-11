# Commons procedural-access observation schema

*Reusable article companion · 10 November 2026 · Author identity: `LcudkPQzLuuqsnzHSmJ7iLREaHStvPKRVb` · AI-assisted, unsigned working draft*

This schema supports [The cost of procedural access](../reading/assistance/court-access-burden.html). It maps the Commons administrative-burden article into a blank research record. It is not a filing, an affidavit or a claim that a particular process is unlawful. Personal identifying values and actual evidence stay in the private case.

## Article → observation fields

| Commons article question | Field identifier | Value and measurement |
| --- | --- | --- |
| What is the contested action or requested review? | `procedure.action`, `procedure.outcome_requested` | Plain description; keep private case names separate |
| Which court and rule apply? | `procedure.jurisdiction`, `procedure.venue_status` | Observed/claimed venue; record why uncertain |
| What did formal access promise? | `formal[].route`, `formal[].source_url`, `formal[].checked_on`, `formal[].conditions` | One record per option; source + version/date |
| What forms and equipment were necessary? | `events[].requirements`, `burden.equipment` | Device, printer, scanner, internet, accessibility and optional alternatives |
| Did a fee waiver address the expense? | `relief.fee_waiver` | not_requested / requested / granted / denied / pending / not_applicable; event and source IDs |
| Was e-filing actually usable? | `relief.efile` | not_tried / accepted / returned / unavailable / pending; event and source IDs |
| Was a remote hearing available? | `relief.remote_hearing` | not_requested / requested / granted / denied / pending / not_applicable |
| What happened at each attempt? | `events[]` | date/time, channel, intended step, actual response, decision-maker, exact evidence ID |
| What did the person spend? | `burden.expenses_usd`, `burden.active_minutes`, `burden.travel_miles`, `burden.repeat_count` | Itemized direct expense; non-overlapping active time; physical distance; repetitions |
| How long did it take? | `burden.elapsed_days` | Start and end events, calendar days; do not add to active minutes |
| Who could decide or correct the matter? | `decision.actor_role`, `decision.route`, `decision.reason` | Observed or quoted, attributed to source; unknown allowed |
| What actually resulted? | `outcome.status`, `outcome.evidence_ids`, `outcome.unanswered` | Accepted, returned, pending, abandoned, granted, denied, or other with context |
| Was friction necessary or avoidable? | `analysis.hypothesis`, `analysis.alternative`, `analysis.limitations` | Interpretations explicitly separate from observations |

## Event minimum

Each `events[]` entry should have: `event_id`, `occurred_at` (local date/time and offset if known), `stage`, `channel`, `action`, `observed_response`, `evidence_ids[]`, `active_minutes`, and `expense_usd` or an explicit unknown. `institution_role`, `stated_reason`, `referral_to`, and `repeat_of` are optional.

Do not replace prior events to incorporate later answers. Preserve an amendment or correction as another dated event with a reference to the earlier event. Separate capture time, archive intake time and any later signed/anchored time.

## Counting rules

- Total **direct expenses** is the sum of documented expense line items, in USD. Do not treat missing data as zero.
- Total **active time** is the sum of distinct, non-overlapping task and travel intervals. Keep travel, waiting and form preparation separately itemized where possible.
- **Elapsed days** is the calendar interval between named events. Do not sum it with active work hours.
- **Repeated steps** count duplicate or redirected actions after their first occurrence, with a `repeat_of` link.
- A **formal access option** is not evidence of actual acceptance; only the recorded attempt establishes what happened.
- An adverse response is an observation. Whether it violated a specific legal duty is a separate legal assessment requiring jurisdiction, actor, trigger, actual requirement and evidence.
- A private case can map particular names, case identifiers, contact details, original audio, scanned forms and response receipts to these generic event IDs. Do not write identifying case values into a public template or repository.

## Source boundaries

For the Texas-related example, consult the current [Commons legal reference index](../entry/legal-reference.html), [court preparation walkthrough](../entry/texas-rental-lawsuit.html), the court's own current instructions and any actual filing receipt. The existence of a published fee waiver form or e-filing route does not resolve individual eligibility, venue, service, hearing mode or outcome. New legal assertions must be checked and added to `legal-references.json` before publication.

**Publication state:** This companion and HTML worksheet are new standalone, versioned repository pages. They are not automatically in the frozen portal edition, signed, pinned or announced on-chain.
