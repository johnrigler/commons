# Rabbit trails and independent evidence preservation

Design note recorded 2026-11-16. Proposal, not an implemented Commons reader or a factual assertion about a particular case.

Commons should be able to refer to Chisel-indexed records from social networks (Bluesky, YouTube, LinkedIn where permitted), original documents, audio, correspondence and chain attestations. Each record should retain its original source locator, exact-byte digest, acquisition/capture timestamp, signer/identity verification status, chain transaction ID when actually confirmed, and typed source/parent/quote/citation relationships. A collection of hashes is an index and integrity record, not a backup; preserve raw files/media separately if independent reconstruction matters.

Separate source assertions, edited transcripts/derivatives, local observation times, cryptographic signature verification and independently anchored times. A timestamp embedded in a captured post is not proof of existence at that date; a blockchain inclusion time is distinct from creation time. Signed crypto-address statements can be associated with DIDs or social accounts where a separate verifiable binding exists, but publishing a DID/handle in OP_RETURN or EVM data alone does not prove account control.

Commons remains a reusable public explanation/evidence interface, not a mandatory identity provider, publisher or judge of the truth of a claim. Public case materials must not expose private correspondence or source evidence. Rabbit-trail exploration should be opt-in and bounded, retaining missing-source markers instead of silently treating an incomplete graph as exhaustive.

Implementation belongs primarily in Chisel and Mogwai/FileProxy. This note records the Commons consumption and provenance requirements; it does not change the public legal case, portal runtime or existing CID-named editions. Related: docs/COMMONS-AND-WEB3.md and docs/SOURCE-LABELS.md.
