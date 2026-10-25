# Telephone calls as Commons artifacts

*Design note · 25 October 2026 · proposed functionality, not yet implemented.*

A call record begins when the author decides to contact a debt collector. Capture the operator/IVR, receptionist, transfers, collection representative, and any later callback as separate segments. A multi-call compilation can tell the complete procedural history, including whom the caller was attempting to reach and what was requested.

## Identity and derivation

Each byte-exact artifact has its own digital identity. The original is never overwritten.

- **Source audio:** privately retained bytes, SHA-256 digest, format, duration, capture time and provenance. Do not upload unreviewed original audio to public IPFS.
- **Redacted audio:** new output bytes with specified ranges replaced by a beep or silence. Give this derivative its own SHA-256 and CID; document its relation to the source without publishing secret ranges or values.
- **Compiled audio:** one or more source or redacted segments assembled in an explicit order with each segment's source identifier, source-time range, output-time range, and transformations. The compilation has its own digest/CID.
- **Text edition:** transcription, optional speaker labels, and commentary. Identify missing, uncertain, or inaudible speech instead of inventing it.
- **Signature envelope:** Litecoin signing address, exact target hash, digest algorithm, signed message bytes, signature format and verified signature, plus optional on-chain txid, height and confirmation state. Fields stay null/pending until actually produced.

For a masked excerpt, preserve a private machine-readable edit list (start/end in samples or milliseconds, channel, replacement method). The public derivative can disclose that redactions exist, but should not publish the original sensitive values or metadata sufficient to reconstruct them. A waveform beep is not cryptographic erasure; publish only rendered redacted media, never source tracks or undo data.

## Publication boundaries

A source can be private while its derivative and signed manifest are public. Keep account numbers, verification answers, telephone numbers when not required, and personally identifying details out of published artifacts. Review transcripts separately because automatic speech recognition may reveal what the audio masks. Verify consent and privacy rules for the jurisdictions and people involved before recording or publishing a real call. In an interstate call, do not assume the caller's home-state rule alone controls.

A public signature attests to the edition signed and the signer's control of the key; it does not establish the truth of the statements, legality of recording, or authenticity of each voice. An IPFS CID identifies bytes; a Litecoin transaction can anchor a digest or CID, but neither creates consent.

## User interface concept

The interface should expose a call timeline and a transcript side by side. Selecting an audio range offers **Beep**, **Silence** or **Keep** as nondestructive edit decisions. The operator previews and exports the redacted derivative, checks that both channels and transcripts were masked, then chooses whether to append it to a longer compilation. The final screen displays source/derivative/compilation digests separately, followed by explicit **Sign**, **Publish** and **Announce** actions. There are no silent public uploads or signatures.

Related public recollection: [Calling the collector](../reading/recollections/2026-10-25-collector-call.html).
