# Reading BSV as a public data ecosystem

26 November 2026 · Research essay / field note

A blockchain explorer usually presents a transaction as a movement of money. That presentation is necessary but incomplete. A transaction can simultaneously move money, carry an application record, and preserve an object that independent software can reconstruct. The BSV ecosystem supplies a concrete example of this distinction.

## A three-dimensional object inside a transaction

The BSV transaction [e8f394c79169cad3f6cbdf9889c1eca2dfde773bf778f6b3e02cb997b4e1c46e](https://whatsonchain.com/tx/e8f394c79169cad3f6cbdf9889c1eca2dfde773bf778f6b3e02cb997b4e1c46e) is the starting point. The supplied WhatsOnChain JSON identifies a 1,344,911-byte transaction in block 976663, containing one input and five outputs.

Output 0 carries one satoshi and a locking script with an ordinary public-key-hash condition followed by a 1Sat Ordinals inscription envelope. Reading the script bytes reveals the marker `ord`, a content-type field of `model/gltf-binary`, and a data push beginning with the GLB magic bytes `glTF`.

The GLB header declares version 2 and a total file size of 1,343,152 bytes. Its 7,544-byte JSON chunk is present in the exported fragment and can be parsed without the rest of the model. It identifies the object as **Zoide #0216**, in the **Zoide 1000** collection, with a self-described rarity of Rare. It describes six meshes and requires Draco geometry decoding and WebP texture support. This is structured, compressed media, not evidence of encryption. The claimed collection and rarity are embedded metadata, not independently authenticated assertions.

Output 3 contains a separate data-carrier script using the Magic Attribute Protocol (MAP). Its pushed strings identify the application as Zoide, the type as ordinal_mint and Version as v1. Outputs 1, 2 and 4 are conventional public-key-hash outputs. Their economic roles are not established by this examination.

The export is not the complete transaction: output 0 explicitly has isTruncated set to true. Its hex field is 100,000 characters, providing 50,000 script bytes, of which 49,944 are the available GLB prefix. The model itself has not been fully retrieved, independently verified against the transaction ID, or rendered in this investigation.

## The protocols are separate from the service

The [1Sat Ordinals specification](https://docs.1satordinals.com/) describes how BSV output scripts can carry typed inscriptions. [Its metadata documentation](https://docs.1satordinals.com/adding-metadata) describes interoperability with earlier tagging conventions such as MAP. The [Khronos glTF specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) defines the content format independently of BSV.

WhatsOnChain is one retrieval and indexing service, not the definition of these protocols. Its [transaction API documentation](https://docs.taal.com/core-products/whatsonchain/transaction) describes the following routes for mainnet:

- Transaction summary: `https://api.whatsonchain.com/v1/bsv/main/tx/hash/{txid}`
- Complete output script in hex: `https://api.whatsonchain.com/v1/bsv/main/tx/{txid}/out/{index}/hex`

For the example, index 0 is the inscription output. These routes are documented, not live-tested in this investigation. An output response by itself does not prove inclusion in the named transaction. A complete raw transaction can be hashed and checked against its transaction ID; a suitable inclusion proof and trusted or independently validated headers can supply further evidence of confirmation.

An independent reader need not rely on a particular marketplace to interpret the asset. It does need a source of the bytes, correct parsing rules, and sufficient data to verify the claims it makes. Ordinal ownership and transfer history require additional indexing and validation beyond recognizing an inscription envelope.

## How Chisel could participate

Chisel should treat BSV as a ledger support library, not as a special-purpose 3D viewer. The proposed organization is a shared UTXO foundation, BSV-specific network and provider adapters, and a BSV protocol registry with independently testable decoders. 1Sat Ordinals and MAP are initial entries. Unknown scripts remain available for examination instead of being silently discarded.

Other UTXO ledgers can reuse appropriate low-level code while defining their own network rules and application conventions. EVM networks have a different shared foundation: ABI interpretation, calldata, logs and contract interfaces. The same ABI may describe deployments on several chains, but each deployment and its state must be identified separately by chain ID and address; proxy implementations may require further resolution.

The extracted content should pass to a shared media layer. A GLB renderer need not know whether the bytes originated in BSV, Polygon or IPFS. Content is untrusted: validate declared sizes and formats, avoid executing arbitrary scripts, isolate active content, and load expensive decoders only on demand.

A useful first implementation would identify Zoide from the available header, display its source outpoint and partial-data status, and let the reader explicitly retrieve, verify, inspect or save the complete artifact. A reusable cache can preserve small metadata separately from large blobs. FileProxy may improve retrieval but should not be essential to the reader. These are proposed capabilities, not a claim that Chisel already implements them.

## Why this belongs in Commons

The value of this investigation is not limited to a code change. A developer, artist, researcher or reader can begin with an opaque-looking transaction, identify its conventions, locate the published specifications, and reconstruct a meaningful object without needing permission from the application that created it.

That process is a practical example of public memory and independent interpretation. Commons can retain explanations of technical ecosystems alongside its existing investigations of legal procedures and institutional records. The same editorial method can extend to the documented practices, publications, governance and history of religious organizations, without requiring either adherence to or rejection of their beliefs.

Across these subjects the method is consistent: identify the source, explain the relevant conventions, distinguish observation from interpretation, and provide a route for the next reader to reproduce or challenge the finding. A ledger commitment can establish a relationship to specific bytes; it cannot by itself establish the truth, legitimacy or authority of what those bytes say.

Chisel is an instrument for examining records. Commons is a place to preserve the understanding gained from that examination. Neither project needs to be confined to the domain of the other.

## Source and publication status

- Primary observation: supplied WhatsOnChain JSON export of the BSV transaction linked above; the GLB header and complete JSON chunk were decoded from output 0's partial script hex. MAP strings were identified in output 3.
- Protocol and service references: 1Sat Ordinals, its metadata documentation, Khronos glTF 2.0, and WhatsOnChain transaction API documentation, linked above.
- This is a dated research note, not a verified ownership report, signed edition, IPFS publication or ledger announcement. No Chisel code changes are implied.

## Follow-up: two different kinds of publication

[The public ledger as a playground](./2026-11-26-the-public-ledger-as-a-playground.md) extends this note with the Indelible encrypted envelope in block 976662, Chisel's subsequent media support, and the philosophical distinction between public storage and public intelligibility. [Printable reading page](../reading/commentary/2026-11-26-the-public-ledger-as-a-playground.html).
