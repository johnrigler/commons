# Twetch after the platform: reconstructing a social network from the ledger

Unsigned field note, 26 November 2026. Not pinned, ledger-announced or incorporated into the CID feed.

## A return, not merely an archive

Twetch shut down in June 2024. Treechat subsequently reported reconstructing its historical public posts using Bitcoin Schema and JungleBus. Reporting dated July 2026 describes a Twetch invitation-only beta reopening on July 21. Twetch's present website advertises feeds, search, meme archives and a market; its GitHub organization describes public read access and identity-based writes. Those are publisher claims, not an independent audit. The supplied transaction export reports a block time on November 22, 2026, after the reopening. It is evidence of new Twetch-labelled data, not proof that a particular official client or operator generated it.

## Exhibit: a post with an embedded image

The supplied WhatsOnChain JSON for 82630acc3c5d284ba07520a6dad3d749be32c67acee2ea308c438614c509837c reports block 976662 and a transaction size of 247,767 bytes, one input and three outputs. Output 0 is a complete zero-value OP_FALSE OP_RETURN with B content 'wen moon ?', media type text/markdown, encoding UTF-8, then pipe-delimited MAP SET app=twetch type=post and AIP BITCOIN_ECDSA with asserted signing address 17XpWPyj7j1W4yPAXcyUquWcn5i5xn7q7g and a Base64 compact-signature-shaped field. Output 1 is a separate zero-value B payload: its push declares 247,193 bytes and the available 49,958-byte prefix has a PNG signature and IHDR dimensions 500 × 414. The export is truncated, so the full image and any following metadata are not verified. Output 2 is a P2PKH output of 124.41760659 BSV; its purpose is not established. The AIP signature is present but not verified; its exact coverage, including whether it binds the separate image output, is unknown.

## What is on chain?

This example contains the actual post text and an image payload, not merely a hash or image URL. Bitcoin Schema documents the B + MAP + AIP composition; it is shared by independent applications. An older Twetch version may have used other layouts and identifiers, including 19nknDdM3ueaAt7nFLFQ3aS3PVHVnJoMmU. No formal version number is established by the sample. The return of the service is distinct from the evolution of its wire format. The independent Peck index displayed 1,486,216 Twetch-labelled records in a November 22 feed snapshot; this is an index-specific count, not a verified count of unique posts, users, or current activity. No exhaustive chain count has been made.

## Rabbit trails for an independent reader

Separate four kinds of relationship: application labels and action types; signed author assertions and verified identity transitions; explicit reply/repost/follow references; and ordinary UTXO funding/change edges. The last does not establish social authorship. Index both old markers and MAP app=twetch, group by block time and observed schema, and report counts by action, payload completeness, signer, and before/after shutdown and return. Sample each action to determine what is actually recorded: posts, replies, reactions, follows, profiles, media, payments, and any encrypted messaging. Do not infer coverage from the product's marketing or from a single record. Compare independently indexed results with the official read API, keeping its off-chain account and ranking functions distinct. A recent example indexed by BananaBlocks includes a twdata_json field with X-origin metadata, suggesting a separate cross-posting trail to investigate rather than a universal property of Twetch.

## Why Commons is interested

A social application can disappear while its publicly readable expressions survive. Independent reconstruction, reported in the 2024 Treechat case, is a practical test of the premise that a community need not have one permanent publisher. For legal argument or decentralized ethical and religious expression, the same distinction matters: a record can remain available for dissenting interpretation without conferring truth, legal authority or compulsory transparency. Chisel should preserve the source and expose the protocol without requiring the original website. Private records and key material need separate protection. This is a research direction, not a claim that the Twetch community shares Commons' aims.

## Sources

- [Transaction explorer (supplied JSON is primary evidence; explorer retrieval not independently verified)](https://whatsonchain.com/tx/82630acc3c5d284ba07520a6dad3d749be32c67acee2ea308c438614c509837c)
- [June 2024 shutdown](https://coingeek.com/much-loved-social-network-twetch-shuts-down-after-6-year-attempt-to-dent-twitter/)
- [October 2024 independent archive reconstruction](https://coingeek.com/treechat-resurrects-archives-from-twetch-and-hodlocker/)
- [July 2026 reopening report](https://theblockdrop.com/posts/twetch-relaunches-bsv-full-chain-archive-restored/)
- [Twetch current site](https://twetch.com/)
- [Twetch developer profile](https://github.com/twetch-inc)
- [Bitcoin Schema publishing format](https://bitcoinschema.org/docs/schemas/content)
- [Legacy marker reference](https://bitblocks.app/protocols)
- [Peck index snapshot](https://peck.to/?before_ts=2026-11-22T20%3A48%3A33Z&before_txid=5e5ddd9a426044871db8de2e45d65b0c1928342059ded1764023fda530554cd5)
- [Example cross-post metadata](https://bananablocks.com/tx/7e280b810c1585fb685d627210cce884506d6e5568f5276cc508a294d763aec5)
