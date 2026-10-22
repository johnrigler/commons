# Commons and the internet of value

John Rigler's project direction. Editorial draft, October 21, 2026.

## The starting point: Satoshi's payment system

Rigler starts his definition of Web3 with Satoshi Nakamoto's
[Bitcoin white paper](https://bitcoin.org/bitcoin.pdf). Its abstract and introduction
propose direct electronic payments without a trusted financial intermediary and
describe mediation costs as a limitation of the existing model. The central
technical problem is double-spending. [1]

Bitcoin's response combines a public transaction history with proof-of-work.
This is the practical consensus breakthrough Rigler connects to the Byzantine
Generals Problem: participants coordinate on a history without appointing a
central record keeper. Its guarantees are probabilistic and depend on assumptions
about honest hash power. Section 6 also allows transaction fees; removing a
mandatory financial intermediary does not mean that every transaction is free. [1]

Rigler's broader institutional argument is that a gatekeeper's role can arise
from its responsibilities, costs and incentives, regardless of the intentions
of the people operating it. His discussion of banks includes KYC and
anti-money-laundering obligations as part of that institutional setting.
That is his extension of the argument; the paper's stated introductory
emphasis is trusted mediation and its costs.

## The ledger was already carrying language

The financial record also contains bytes that people can read as language.
Bitcoin's genesis transaction carries the newspaper headline:

> The Times 03/Jan/2009 Chancellor on brink of second bailout for banks

Bitcoin Core's genesis construction records that text in the coinbase input.
It is a concrete example of human-readable non-payment information in the
ledger from its beginning. [2]

Rigler's Web3 argument extends that observation: the transaction system can be
repurposed as a data and language medium. People can publish readable marks,
labels, statements and references in the shared record, then build independent
readers around them. This is the engineering sense in which the financial
system can be hacked into a data system.

## Carry the removal of gatekeepers into the data layer

For Rigler, the same principle has to survive that extension. If one required
publisher, identity provider, indexer or interpreter controls participation,
the architecture recreates the dependency he was trying to remove.

Tools and services can contribute work. The design requirement is that no
single one becomes the mandatory authority over the shared record or its
interpretation. Publishing and reading must remain possible through independent
tools, subject to the underlying network's actual rules and resource costs.

Commons is the legal and procedural application of this wider model. People can
publish reusable reasoning, reference exact editions, connect their own evidence,
and retain their own resulting records. Its broader subject scope remains open.
The ambition is infrastructure that different people can use on their own terms,
rather than a claim that one procedure or argument resolves every person's case.

## An address people can publish into

The Commons is an address-based meeting point in that public record. People
can publish articles, advertisements, cases, service offers or other material
associated with it. The repository's documents are one collection within the
Commons; the repository is not an approval desk for the underlying stream.

Independent servers can preserve and index records and provide different
readers. Rigler's tentative term is **Byzantine scribes**: keepers of the record
whose views people can compare. The ledger's consensus and each scribe's
interpretation are distinct. The language connects the published records to
the people and tools reading them.

Lawyers can charge for their ordinary work while developing this additional
skill. Rigler can charge for teaching. Operators can charge for hosting,
preservation, indexing and retrieval. The shared record remains independent
of any one service. [The address and the scribes](ADDRESS-AND-SCRIBES.md)
sets out this model and the naming discussion.

## Participation without owning a domain

Rigler owns Rigler.org, the .org domain matching his surname, while arguing that
such ownership should not be a prerequisite for anybody else. A domain can offer
a convenient route to his services. The record and the participant's identity
should remain usable through another reader, another server or local tools.

This extends the removal of mandatory gatekeepers to naming. People should not
have to compete for globally exclusive DNS names to publish, be identified or
offer work. Readable labels can coexist; explicit record and identity references
supply the context needed to distinguish them. This is a design principle, not
a claim that a new naming protocol has already been deployed.

## A pool of meaning in the digital wilderness

Rigler calls the public medium the digital wilderness. Commons is one pool of
meaning within it, alongside possible game worlds, news feeds, commerce and
payment memos. It is one project among others. Its common record can exist
independently of a business providing particular services around it.

His economic concern is that providers can acquire duties, costs and exposure
that push them toward charging. That concern is distinct from a claim that
forming a business or charging fees authorizes legal practice. The
[digital-wilderness note](DIGITAL-WILDERNESS.md) preserves the comparison with
Satoshi, separates necessary requirements from sludge, and supplies bounded
Texas statutory context for his recollection.

The wider architecture is left for later. The point here is the independence
of the common space and the services people provide within it.

## From public memory to reusable understanding

Commons begins with a practical question: why should each person have to
reconstruct an explanation that other people have already needed?

A dispute may require someone to understand a distinction between a claim and
its supporting evidence, a demand and its calculation, or a procedural response
and a substantive answer. Those distinctions can be explained in public. An
article can preserve the reasoning, identify its sources and scope, and become
available for another person to examine, challenge or use.

That is how Commons aims to make nuanced understanding accessible. A shared
article does not decide every individual case. It gives people a clearer
starting point from which to identify what matters in their own record.

## Reuse changes the economics

Rigler's hypothesis is that reusable public understanding can reduce dependence
on paid explanations of recurring issues. If a useful explanation can be
written once, improved in public and reused across many cases, less of that
explanatory work needs to be purchased anew by every person encountering it.

This can put pressure on revenue derived from repetition and unequal access
to knowledge. It does not establish that every lawyer benefits from confusion
or deliberately maintains it. The criticism concerns an incentive structure:
when difficulty creates demand for a paid interpreter, making the process
understandable changes the conditions under which that service is purchased.

Professional judgment, individual investigation and representation remain
distinct contributions. Commons makes reusable reasoning inspectable and
portable so that the same basic understanding need not remain a recurring
barrier to participation.

## Professional participation within Commons

Rigler also sees Commons as an opportunity for professional development and paid
expertise. Lawyers can review articles, apply them to a client's facts, examine
records with technical specialists, prepare evidence, negotiate and advocate.
Shared explanations and compensated professional judgment can coexist.

Relevant technological competence is already a professional-conduct concern.
That creates a possible entry point for Commons, while the claim that courts
must adopt a particular system goes beyond the rules reviewed here. The
[professional-participation note](PROFESSIONAL-PARTICIPATION.md) distinguishes
competence, court understanding, authentication, admissibility and paid work,
with links to the primary authorities.

## Value that can be carried forward

This is part of what Rigler calls Web3, or the internet of value. Value includes
a useful explanation, a documented contribution, an agreement, a record of an
action, and the ability to carry those things forward without surrendering
control to one account provider or publisher.

An article can travel with its sources, declared authorship, scope and exact
edition. Other people can copy it, connect it to another subject, improve it,
or cite it in a case. A new edition can preserve the connection to the earlier
one. The work can accumulate instead of being recreated inside separate,
incompatible transactions between a service and each customer.

Real Estate and Religion may be separate foundations. A Parsonage Exemption
article can connect both. Deterrence through administrative burden can inform
articles about credit reporting, traffic tickets or healthcare. The value lies
in the reasoning and the relationships people can inspect and reuse.

## Public memory under the user's control

In this model, public ledger data supplies a shared publication and reference
layer. Chisel can place human-readable marks or references in transactions.
Content-addressed files can hold the longer material. An exact file identifier
lets independent readers compare the bytes they received with the edition
being referenced. A signature can bind a statement to a signing key; establishing
the person's identity and assessing the statement remain further questions.

The intended result is a record that can be read through different interfaces,
rather than existing only inside one service's interpretation of it. Readers
retain choices about organization, filtering and use. A popular interface
should not become the sole authority over what the underlying record means.

Commons supplies the reusable public articles. Daisy retains chronological
records within their access boundaries. SB Shell assembles readable and
printable publications. Mogwai supplies tools, CertLedger presents selected
case products and verification records, and Chisel handles ledger operations.

Private evidence and identity material retain their separate audiences.
Document hashes and references are useful only alongside preservation of the
actual files. A ledger record does not make an argument correct, establish
every identity claim, or demonstrate that a recipient received a packet.

## The story Commons tells

A person encounters a problem, finds reasoning someone else has made available,
connects it to their own evidence, and produces a record they can retain.
Their improvements can become useful to the next person.

The proposed change is economic as well as technical: more of the value of
understanding remains available to the people using and extending it. The
internet of value becomes a medium for shared knowledge, public memory and
independent action.

This narrative explains the direction. It does not claim that Commons already
has automatic contribution tracking, wallet-bound authorship, universal ledger
verification or a ranking system. Existing unsigned reading drafts remain
unsigned unless an actual signing step is completed.

## Primary references and interpretation

1. Satoshi Nakamoto, [Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf),
   especially the abstract and sections 1, 4, 6 and 11.
2. Bitcoin Core, [genesis construction in src/kernel/chainparams.cpp](https://github.com/bitcoin/bitcoin/blob/master/src/kernel/chainparams.cpp),
   including the timestamp text and its placement in the coinbase input.

Sources checked October 21, 2026. The genesis example establishes the presence
of readable text, not the later Commons architecture. The language-medium,
institutional-gatekeeper and Commons connections are Rigler's interpretation
and project direction. This note does not claim that Bitcoin alone supplies
unlimited data capacity, universal availability or the truth of published claims.
