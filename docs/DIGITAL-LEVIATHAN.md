# The Digital Leviathan
## Chisel, public-ledger archaeology, and conference outreach

Project charter · 26 November 2026 · Working document

Commons is the public editorial and research home for this project. Chisel is the instrument; the Digital Leviathan is the subject of investigation. These are related but independently presentable messages.

## Track A — Chisel: writing into the public record

**Working talk:** Chisel: Writing Without a Platform

Demonstrate how a person can construct, sign and inspect transactions with browser-side software; encode readable language into ledger addresses or payloads; and refer to independently identifiable documents and media. Distinguish the UTXO and Polygon implementations rather than pretending all ledgers have the same semantics.

Security audience: key custody, transaction construction, network-specific verification, dependency boundaries, replay risks, data availability, privacy, and the difference between a valid transaction and a true assertion.

Demo sequence:
1. Construct a small public test message with a clearly identified chain and deliberate fee.
2. Show the payload, outputs and signing boundary before broadcast; use a test fixture or disposable identity for demonstrations.
3. Decode an obviously unspendable word address (Thunderword) and distinguish it from a spendable identity.
4. Retrieve and verify the resulting record independently; link to a content-addressed source where applicable.
5. Show what remains usable if the original application or service disappears.

Never put private keys, personal data, or an involuntary participant's information in the demonstration. Explain that permanent publication, continued retrieval, and consensus finality are separate properties.

## Track B — The Digital Leviathan: reading what is already there

**Working talk:** The Digital Leviathan: Archaeology of a Public Ledger

The working thesis is that Web3 can be understood as an overlapping ecology of public records, identities, protocols, conventions, economic activity and social structures. Applications such as Twetch are windows into this ecology, not its boundaries. Chisel and Commons can investigate what persists, what requires proprietary context, and what cannot be independently reconstructed.

The term Digital Leviathan deliberately invokes the question of authority: who governs, indexes, interprets and presents a shared record? It does not assume that the resulting ecology is decentralized in every respect, or that public ledgers eliminate institutions.

Use concrete artifacts:
- [Twetch after the platform](../reading/commentary/2026-11-26-twetch-after-the-platform.html): B + MAP + AIP, social conventions and reconstructability.
- [The public ledger as a playground](../reading/commentary/2026-11-26-the-public-ledger-as-a-playground.html): 1Sat Ordinals GLB and an encrypted OP_RETURN envelope.
- [Digital wilderness and pools of meaning](DIGITAL-WILDERNESS.md): shared record versus services that interpret it.
- [The address and the scribes](ADDRESS-AND-SCRIBES.md): independent indexing and presentation.

Investigation questions:
- What can be reconstructed from raw transaction bytes alone? What depends on external mappings, media hosts, indexing, or decryption keys?
- Which identities and conventions persist across applications or chains? A matching address is not by itself proof of a person's identity.
- Can a second implementation reproduce the interpretation? Which competing interpretations remain possible?
- Who controls discovery, moderation, context, and practical access even when publication is permissionless?
- What distinguishes evidence of publication from evidence of truth?

Record network, transaction ID, output index or field, raw bytes or hash, parser version, source links, retrieval date, interpretation, and uncertainty for every showcased artifact. Preserve errors and alternative readings. Do not represent encrypted data as readable or all publicly recorded information as permanently retrievable.

## Project architecture

- **[Chisel](https://github.com/johnrigler/chisel):** reader, writer, transaction tools and identity interface.
- **[Commons](https://johnrigler.github.io/commons/):** readable research, arguments, case studies, presentation materials, and references.
- **[Mogwai](https://github.com/johnrigler/mogwai):** local integration and workflows.
- **Daisy:** private research and source material where appropriate. Publish only reviewed derivatives.

The publication model separates an artifact from an interpretation of it. A ledger commitment or CID identifies bytes, not factual accuracy. Maintain reproducible examples and preserve exact publication versions.

## World 3.0 — Collective agency and bargaining

The social purpose of Commons is not merely publishing or preserving information. It is to explore whether durable, portable shared records can reduce the cost of organizing people around common interests and negotiating with institutions. "World 3.0" is a working name for the social and institutional dimension of Web3, not a claim that a new social order already exists.

A measurable historical backdrop is the U.S. union membership rate among wage and salary workers: 20.1% in 1983 and 10.0% in 2025 ([BLS, Union Members](https://www.bls.gov/news.release/union2.htm)). The 2025 annual estimate excludes October because of the federal shutdown and is not strictly comparable to full-year estimates. Membership is one indicator, not a complete measure of bargaining power or evidence of why it changed.

The proposed system should complement existing unions and other associations rather than presume to replace them. It also explores analogous coordination among consumers, tenants and other groups. Formal labor bargaining rights and duties are not created by software; protected concerted activity under the NLRA applies to covered employees, with statutory exclusions ([NLRB, Employee Rights](https://www.nlrb.gov/about-nlrb/rights-we-protect/your-rights/employee-rights)). Other groups require their own legal and organizational analysis.

A practical coordination workflow:

1. People independently document experiences, with private originals and consent-controlled disclosure.
2. Commons publishes reusable, source-grounded explanations and carefully reviewed, de-identified findings.
3. Independent readers and indexers discover patterns, distinguish separate cases from duplicates, and allow corrections and replies.
4. Participants explicitly opt into a common issue, authorize a representative if desired, and pool resources or professional expertise under transparent rules.
5. A representative can present a defined request, evidence, and mandate to an institution; participants can evaluate the response and choose next steps.

Technical requirements include portable records, selective disclosure, pseudonymous participation where suitable, explicit and revocable delegation, independent verification, duplicate and fabricated-claim controls, and accountable governance of shared resources. Never place sensitive grievances, membership lists, or private evidence directly on an immutable public ledger. Hash commitments are not automatically anonymous or proof that an allegation is true.

**Research hypothesis:** a shared evidence and coordination layer could reduce duplicated effort and make collective action more feasible without requiring everyone to belong to a single platform. Measure coordination costs, independent participation, evidence quality, representative accountability and actual negotiated outcomes before claiming success. Technology cannot by itself supply legal recognition, bargaining leverage, trust or collective solidarity.

This is the bridge from the Digital Leviathan investigation to Commons' existing work on administrative burden and shared accountability. Chisel provides the means to write and independently inspect records; the Digital Leviathan explores the environment; Commons tests whether those records can support collective agency in World 3.0.

## The monetary and documentary elements of World 3.0

A close reading of the [Bitcoin white paper](https://nakamotoinstitute.org/library/bitcoin/) (31 October 2008), especially sections 1–3 and 10, supplies the conceptual bridge. Section 1 describes mediation costs, reversible payments and spreading demands for trust and customer information. Section 2 describes dependence on a central mint. Section 3 describes a timestamp server for data. Section 10 addresses privacy by separating public transactions from identity, with explicit limitations on linkability.

Rigler's extension is that the data element of World 3.0 mirrors the monetary element: publication, authentication, chronological evidence and discovery need not depend on an indispensable publishing intermediary. This is an interpretation, not a claim that Nakamoto explicitly proposed Commons, collective bargaining or avoidance of KYC/AML requirements. Money and information have different semantics: information is copyable and may require confidentiality, correction, deletion or contextual interpretation; transaction inclusion does not establish the truth of a statement.

### The instrument maker is not necessarily the intermediary

Chisel's objective is to make its maintainer dispensable to activities carried out with the software. A maintainer can control a repository, deployment or index without being the mandatory custodian of keys, funds or public records. Demonstrate this distinction by testing whether a user can:

- run a reviewed local or independently hosted copy without developer-controlled login or permission;
- retain keys locally and construct, inspect and sign transactions without developer infrastructure;
- choose independent retrieval, broadcasting and indexing providers, including a compatible node;
- reproduce artifact interpretation using published formats and fixtures;
- export records and migrate to another implementation if the original maintainer disappears.

Inventory actual dependencies, including GitHub Pages, rigler.org/FileProxy, RPC providers, third-party APIs, gateways, libraries and update trust. Distinguish local signing from independent verification, availability and broadcast. Operators can still decline service; independent alternatives and portable records are the goal.

The U.S. regulatory analogy is limited: [FinCEN FIN-2019-G001](https://www.fincen.gov/system/files/2019-05/FinCEN%20Guidance%20CVC%20FINAL%20508.pdf) (May 2019) distinguishes software development itself from using or deploying software to engage in money transmission. Applicable obligations depend on actual activities and jurisdiction, not a project's terminology or noncustodial design alone. This is not a legal determination for Chisel or associated services, nor a proposal to evade applicable compliance obligations.

### Intermediation as a regulatory surface

The monetary analogy extends beyond finance. Institutions that administer environments for interaction may possess both the practical means and the legal duties to identify participants, investigate complaints, enforce conduct rules, preserve records or restrict access. The regulatory surface is the set of activities, powers and responsibilities attached to a particular institutional role. This is an architectural analogy, not a claim that financial KYC/AML rules literally govern ordinary speech.

Examples include educational institutions' duties under [Title VI and First Amendment constraints](https://www.ed.gov/laws-and-policy/civil-rights-laws/race-color-and-national-origin-discrimination/frequently-asked-questions-race-color-and-national-origin-discrimination), employers' [workplace harassment obligations](https://www.eeoc.gov/small-business-fact-sheet-harassment-workplace), and online intermediaries' differentiated duties under the [EU Digital Services Act](https://eur-lex.europa.eu/eli/reg/2022/2065), including notice-and-action procedures for covered hosting services and trader traceability for covered marketplaces. These rules have different purposes, territorial scope and exceptions. Public and private institutions also differ in their constitutional duties. Institutional policies, contractual authority, statutory obligations and voluntary editorial decisions must not be conflated. Protective regulations can reduce harm and restrain institutional abuse.

World 3.0 asks whether legitimate activities such as publishing, association and documenting grievances can remain portable across institutions. A participant need not depend on an exclusive account issuer, archive or indexer. A provider may curate its own presentation and apply applicable law without becoming the universal administrator of the underlying record. Multiple independent readers can make different lawful editorial choices. Individual speakers, service operators and other actors retain their own legal responsibilities; decentralization neither eliminates harm nor creates immunity from law.

The research hypothesis is that reducing mandatory intermediation can reduce dependency on a particular administrator while preserving legitimate safety, privacy, correction and accountability mechanisms. Test the distinction by identifying which actual actor can deny publication, revoke identity, suppress discovery, or withhold access, and whether a participant has a viable alternative. Do not confuse an available alternative in theory with practical access. Commons should support lawful collective agency, not evasion of applicable obligations or publication of private grievances without consent.

### Commons as an application of the documentary element

Debt collection is a concrete test domain. Individual consumers often reconstruct similar institutional processes independently. Commons can publish reusable questions, evidence schemas, dated explanations and reviewed aggregate observations, while sensitive originals remain private. Independent scribes and indexers can present competing collections; Commons need not be the exclusive gatekeeper.

A group can identify a shared problem, request evidence of accounting or dispute-handling processes, appoint representatives with consent, seek professional assistance and propose specific changes. Preserve responses, corrections, differences between cases and unresolved issues. Formal remedies and collective bargaining authority depend on applicable law and organizational arrangements; independent publication alone does not compel changes.

**Design principle:** the person who supplies an instrument should not have to authorize every legitimate use of that instrument. The social purpose is independent inquiry, shared institutional memory and lawful collective agency rather than another indispensable administrator.

## Outreach pipeline

Use the existing Security and BSV Conference Watch and ETHDenver watch as discovery channels. This document is the project backlog, not a live event calendar. Check organizer pages before recording dates or deadlines.

| Target | Preferred track | Submission route |
| --- | --- | --- |
| [DEF CON](https://defcon.org/) | A / B | Demo Labs, relevant villages or talks |
| [Black Hat](https://www.blackhat.com/) | A | Arsenal open-source tool demonstration |
| [BSides Albuquerque](https://www.bsidesabq.org/) | A / B | Local talk or demonstration |
| [CactusCon](https://www.cactuscon.com/) | A / B | Talk or workshop |
| [Wild West Hackin' Fest](https://wildwesthackinfest.com/) | A / B | Technical talk or workshop |
| [ETHDenver](https://ethdenver.com/) | A | Developer talk or demonstration |
| [BSV Hackathon](https://bsvhackathon.com/) and BSV developer gatherings | A / B | Developer demo or research presentation |

These are prospective targets, not accepted talks or confirmed open calls. For each opportunity record official URL, city, event dates, submission deadline, format, cost, travel requirements, track, status, and next action. Keep the same core evidence while adapting the pitch to the audience.

## Deliverables

- [ ] Two independent one-page abstracts, one for each track.
- [ ] A five-minute Chisel demo and a longer technical demo with offline fixtures.
- [ ] A Digital Leviathan reading index with at least three reproducible artifact case studies.
- [ ] A threat model and limitations page for Chisel.
- [ ] An event and submission register with verified dates and application URLs.
- [ ] A short slide deck for each track, plus public reproducibility links.
- [ ] A Commons standalone project landing page and eventually a reviewed, signed/content-addressed edition.

No submission, conference booking, signature, pin or ledger announcement is implied by this working charter. Commons remains the repository name for now; the Digital Leviathan is a project within it, not a decision to rename the whole publication.
