# The public ledger as a playground: art, secrecy and independent interpretation

26 November 2026 · Research and philosophical commentary

## A world larger than Chisel

The Chisel Portal began as a way of reading and following records written according to Chisel's own conventions. It is becoming something more general: a window onto the conventions that other people invent independently. Instead of assuming that a transaction is merely a payment, the reader asks what it carries, what the creating application calls it, and how the next person might interpret it.

On 26 November 2026, two neighboring BSV blocks supplied markedly different examples. One contains a three-dimensional collectible with a public description; the other contains a protocol-tagged encrypted envelope. Neither is a Commons publication, and neither was produced by Chisel. That is precisely why they matter. The ecosystem is not an audience waiting for one project to define its rules; it is already a playground of independent experiments.

## Exhibit A: Zoide #0216, an object in a spendable output

Transaction [e8f394c79169cad3f6cbdf9889c1eca2dfde773bf778f6b3e02cb997b4e1c46e](https://whatsonchain.com/tx/e8f394c79169cad3f6cbdf9889c1eca2dfde773bf778f6b3e02cb997b4e1c46e), reported in block 976663, is 1,344,911 bytes. Output 0 carries one satoshi and contains a 1Sat Ordinals inscription after a public-key-hash locking condition. Its content type is model/gltf-binary. This is not an OP_RETURN payload.

The GLB version 2 header declares 1,343,152 bytes; its 7,544-byte JSON chunk identifies Zoide #0216, collection Zoide 1000, and self-described rarity Rare. It describes six meshes and requires Draco geometry decoding and WebP textures. Output 3 separately carries MAP (Magic Attribute Protocol) fields app=Zoide, type=ordinal_mint, Version=v1. The metadata describes the object; it is not independent proof of rarity, authorship or present ownership.

The supplied WhatsOnChain export truncates output 0: only 49,944 bytes of the GLB prefix are available. That is enough to inspect the header and JSON, not to reconstruct the complete model. A renderer needs the missing bytes. The [1Sat Ordinals documentation](https://docs.1satordinals.com/), [MAP metadata guidance](https://docs.1satordinals.com/adding-metadata), and [glTF specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) describe distinct layers of interpretation.

## Exhibit B: Indelible, a public envelope around private material

Transaction [a18479a46e4b4053bc639e2db3dd178ad4e8e26f9a553f85f8bb2a93204d3904](https://whatsonchain.com/tx/a18479a46e4b4053bc639e2db3dd178ad4e8e26f9a553f85f8bb2a93204d3904), reported in block 976662, is 17,569 bytes, with three inputs and two outputs. Its first output carries zero satoshis and is explicitly an OP_FALSE OP_RETURN script. It contains two pushes: the 19-byte ASCII identifier BSVWRAPPER_MERKLE_E and a 17,046-byte UTF-8 JSON object. The export marks this script as not truncated.

The JSON has exactly three fields: protocol, encrypted, and wrap_owner. The protocol value is indelible.claude-code. The encrypted field is three colon-separated Base64 strings: decoding them yields 12 bytes, 16 bytes and 12,559 bytes. The wrap_owner field contains four colon-separated hexadecimal strings decoding to 33, 12, 16 and 32 bytes respectively; the first begins with 02, consistent with a compressed secp256k1 public key.

These sizes are consistent with an authenticated-encryption envelope using a 12-byte nonce, a 16-byte authentication tag and ciphertext, together with a possible recipient key-wrapping mechanism. AES-GCM and elliptic-curve-based key agreement are plausible interpretations, not verified specifications. The marker contains the word MERKLE, but we have not established a Merkle tree structure or proof from the fields observed. The label claude-code suggests an association with a coding workflow; neither the plaintext, its purpose, the identity of the publisher, nor an affiliation with Anthropic has been established.

Unlike Zoide, the public structure is intended, according to its field names, to describe encrypted material rather than make its contents legible to everyone. A reader can examine the shape of the record without a key. We do not need to decrypt it, speculate about its contents, or reproduce the entire ciphertext to explain the design.

## What Chisel can read, and what it still cannot

Chisel's BSV registry now distinguishes B:// files, 1Sat Ordinals inscriptions and MAP metadata. It can identify Zoide's GLB header and attributes, distinguish incomplete data from complete files, and offer retrieval and inspection of supported media. The 2.9.0 and 2.9.1 releases introduced automatic BSV image display on record opening and asynchronous compact thumbnails in the portal, respectively. FireSat's JPEG inscription is a separate example of the image path. The full Zoide model and the live FireSat thumbnail were not independently browser-verified for this note.

The next decoder should recognize BSVWRAPPER_MERKLE_E by the exact first push, parse the second as bounded JSON, validate the encodings, and describe the result as a declared encrypted envelope. It should identify the application label, display byte counts and preserve access to the source script. It should not promise decryption or assert an algorithm without a verified protocol specification. This decoder is a proposal, not an implemented feature as of this note.

The common reader vocabulary should distinguish script structure, application protocol, content format, compression, truncation, encryption and verification. A GLB file can be compressed without being encrypted; an encrypted record can be complete without being intelligible; a public label can be intelligible without being authentic. These distinctions transfer across BSV, other UTXO chains, EVM calldata and IPFS without pretending that the underlying ledger rules are identical.

## The playground for law, belief and public memory

Commons is concerned with the ability of people to articulate arguments, preserve evidence and contest institutional narratives. A related philosophical ambition is a decentralized religious or ethical commons: people may publish interpretations, testimonies, rituals, criticism and declarations of belief, without one institution owning the archive or controlling every reading of it. This is a proposed social use of shared infrastructure, not a description of the beliefs of the Zoide or Indelible developers.

The technical experiments above are the playground of that ambition. One creator makes an object available in a format an independent reader can interpret. Another appears to use a public ledger as the durable transport for material meant to remain private. A legal dossier could use public references to selected documents while keeping sensitive originals off-chain; a voluntary community could publish successive versions of its principles, acknowledge dissent and choose what not to disclose. These are design possibilities, not legal advice or claims that publication on a blockchain confers legal or religious authority.

Decentralization does not mean compulsory transparency. A public ledger may make evidence of a publication visible without making its meaning universally accessible. Nor does an immutable record make an allegation true, a contract enforceable, an identity authentic, a belief authoritative, or an application trustworthy. An encrypted record on a public chain may still disclose metadata, relationships and timing; future exposure of a key can compromise confidentiality. Avoid publishing sensitive personal material merely because encryption is available.

Independent readers and scribes can preserve different accounts of the same record, publish their interpretations and link back to the evidence. They need not share a marketplace, a software vendor, a legal theory or a religious doctrine. What they do need is a way to distinguish the source from the explanation and to challenge both. The shared ledger is a place where conventions meet, not a universal authority that settles their meaning.

## Reproducibility and editorial status

The primary observations are the supplied WhatsOnChain JSON exports identified by the transaction links above. The Zoide analysis is retained in the [earlier technical field note](2026-11-26-bsv-public-data-ecosystem.md). For Indelible, the output-0 script begins with bytes 00 6a 13, followed by the ASCII marker, then OP_PUSHDATA2 (4d) and the little-endian length 96 42. Parsing the remaining 17,046 bytes as JSON and decoding the colon-separated values reproduces the reported field lengths. The second output is a conventional public-key-hash output containing 1,413 satoshis.

Readers can use the [WhatsOnChain transaction API documentation](https://docs.taal.com/core-products/whatsonchain/transaction) to retrieve scripts or full transactions. Neither an API label nor our interpretation substitutes for hashing complete raw transaction bytes against the transaction ID and checking inclusion evidence where necessary. No independent protocol specification for Indelible was verified in this investigation. The public transaction links are source locators, not a claim of independently verified confirmation.

Author identity: LcudkPQzLuuqsnzHSmJ7iLREaHStvPKRVb. 26 November 2026. Unsigned research and philosophical commentary; no IPFS pin, Litecoin announcement or signed edition is claimed. The notes are independent of the third-party projects described.
