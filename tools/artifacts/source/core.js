/* Exact-byte artifact inspection. No persistence, network, PDF rewriting or signing. */
globalThis.CommonsArtifacts = (() => {
    'use strict';
    const MAX_BYTES = 64 * 1024 * 1024;
    const CERTLEDGER = 'LMxCERTLEDGERzzzzzzzzzzzzzzzWTMCKs';
    const ROOT = 'LLLLLLLLLLLLLLLLLLLLLLLLLLLLXgkk2V';
    const utf8 = new TextEncoder();
    const hex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    async function sha256(bytes) { return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))); }
    function canonical(value) {
        if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
        if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
        return JSON.stringify(value);
    }
    function anchor(digest) {
        if (!/^[0-9a-f]{64}$/.test(digest)) throw new Error('Expected a full lowercase SHA-256 digest.');
        const ascii = 'sha256:' + digest;
        const payload = utf8.encode(ascii);
        return {
            schema: 'chisel-certledger-anchor-v1', currency: 'litecoin', network: 'mainnet',
            sha256: digest, namespace: { label: 'CertLedger', prefix: 'LMx', address: CERTLEDGER },
            opReturnAscii: ascii, opReturnBytes: payload.length, opReturnHex: hex(payload),
            scriptPubKey: '6a' + payload.length.toString(16) + hex(payload),
            state: 'unfunded-unsigned-unbroadcast',
            tagAddresses: [ROOT, CERTLEDGER]
        };
    }
    function der(bytes, offset = 0, limit = bytes.length) {
        if (offset + 2 > limit) throw new Error('Truncated DER value.');
        const start = offset, tag = bytes[offset++];
        if ((tag & 31) === 31) throw new Error('Unsupported DER high tag.');
        let length = bytes[offset++];
        if (length & 128) {
            const count = length & 127;
            if (!count || count > 4 || offset + count > limit) throw new Error('Invalid DER length.');
            length = 0;
            for (let i = 0; i < count; i++) length = length * 256 + bytes[offset++];
        }
        if (offset + length > limit) throw new Error('DER value exceeds its container.');
        return { tag, start, valueStart: offset, end: offset + length };
    }
    function children(bytes, node) {
        const result = [];
        for (let p = node.valueStart; p < node.end;) {
            if (result.length > 4096) throw new Error('DER container too large.');
            const next = der(bytes, p, node.end); result.push(next); p = next.end;
        }
        return result;
    }
    function oid(bytes, node) {
        const parts = []; let n = 0;
        for (const b of bytes.slice(node.valueStart, node.end)) {
            n = n * 128 + (b & 127);
            if (!Number.isSafeInteger(n)) throw new Error('Oversized OID.');
            if (!(b & 128)) { parts.push(n); n = 0; }
        }
        if (!parts.length) return '';
        const first = parts.shift(), a = first < 40 ? 0 : first < 80 ? 1 : 2;
        return [a, first - a * 40, ...parts].join('.');
    }
    function derText(bytes, node) {
        const b = bytes.slice(node.valueStart, node.end);
        if (node.tag === 30) {
            let s = ''; for (let i = 0; i + 1 < b.length; i += 2) s += String.fromCharCode(b[i] * 256 + b[i + 1]);
            return s;
        }
        return new TextDecoder(node.tag === 12 ? 'utf-8' : 'windows-1252').decode(b);
    }
    function distinguishedName(bytes, node) {
        const labels = { '2.5.4.3':'CN', '2.5.4.6':'C', '2.5.4.7':'L', '2.5.4.8':'ST', '2.5.4.10':'O', '2.5.4.11':'OU', '1.2.840.113549.1.9.1':'emailAddress' };
        const result = [];
        for (const set of children(bytes, node)) for (const entry of children(bytes, set)) {
            const pair = children(bytes, entry);
            if (pair.length >= 2) { const id = oid(bytes, pair[0]); result.push({ oid: id, attribute: labels[id] || id, value: derText(bytes, pair[1]) }); }
        }
        return result;
    }
    async function certificate(bytes, node) {
        const outer = children(bytes, node), body = children(bytes, outer[0]);
        const offset = body[0].tag === 160 ? 1 : 0;
        const validity = children(bytes, body[offset + 3]);
        return {
            sha256: await sha256(bytes.slice(node.start, node.end)),
            serial_hex: hex(bytes.slice(body[offset].valueStart, body[offset].end)),
            issuer: distinguishedName(bytes, body[offset + 2]), subject: distinguishedName(bytes, body[offset + 4]),
            not_before_asn1: derText(bytes, validity[0]), not_after_asn1: derText(bytes, validity[1]),
            trust: 'not-checked', role: 'embedded certificate; signer association not verified'
        };
    }
    async function inspectCMS(bytes) {
        if (bytes.length > 2 * 1024 * 1024) throw new Error('Signature container exceeds inspection limit.');
        const root = der(bytes), info = children(bytes, root);
        if (oid(bytes, info[0]) !== '1.2.840.113549.1.7.2') throw new Error('Signature is not CMS SignedData.');
        const signedData = children(bytes, children(bytes, info[1])[0]);
        const algorithms = children(bytes, signedData[1]).map(n => oid(bytes, children(bytes, n)[0]));
        const certificates = [];
        const certSet = signedData.find((n, i) => i > 2 && n.tag === 160);
        if (certSet) for (const n of children(bytes, certSet).slice(0, 16)) if (n.tag === 48) {
            try { certificates.push(await certificate(bytes, n)); } catch (_) { certificates.push({ error: 'Embedded certificate could not be decoded.' }); }
        }
        const names = {'1.3.14.3.2.26':'SHA-1','2.16.840.1.101.3.4.2.1':'SHA-256','2.16.840.1.101.3.4.2.2':'SHA-384','2.16.840.1.101.3.4.2.3':'SHA-512'};
        return { content_type: 'CMS SignedData', der_bytes: root.end, digest_algorithm_oids: algorithms, digest_algorithms: algorithms.map(id=>names[id]||id), certificates };
    }
    function rangeInfo(bytes, ranges, contents) {
        const valid = ranges.length === 4 && ranges.every(Number.isSafeInteger) && ranges.every(n => n >= 0) && ranges[0] === 0 && ranges[1] <= ranges[2] && ranges[2] + ranges[3] <= bytes.length;
        let gapMatches = false;
        if (valid && ranges[2] - ranges[1] <= 4 * 1024 * 1024) {
            const gap = new TextDecoder('windows-1252').decode(bytes.slice(ranges[1], ranges[2])).trim();
            gapMatches = /^<[0-9a-f\s]*>$/i.test(gap) && gap.slice(1, -1).replace(/\s/g, '').toLowerCase() === hex(contents);
        }
        return { byte_range: ranges, structurally_valid: valid, excluded_gap_matches_contents: gapMatches,
            ends_at_file_length: valid && ranges[2] + ranges[3] === bytes.length,
            later_bytes: valid ? bytes.length - ranges[2] - ranges[3] : null };
    }
    async function pdfInfo(bytes, PDFLib) {
        const report = { status: 'not-inspected', cryptographic_signature_verification: 'not-performed', certificate_trust_and_revocation: 'not-checked', signatures: [] };
        try {
            if (!PDFLib) throw new Error('PDF parser unavailable.');
            const doc = await PDFLib.PDFDocument.load(bytes.slice(), { updateMetadata: false, throwOnInvalidObject: true });
            const {PDFName, PDFDict, PDFArray, PDFString, PDFHexString} = PDFLib;
            const read = (dict, name) => dict.lookup(PDFName.of(name));
            const text = value => value instanceof PDFString || value instanceof PDFHexString ? value.decodeText() : value ? value.toString() : null;
            report.status = 'parsed'; report.pages = doc.getPageCount(); report.metadata = {};
            for (const [key, method] of Object.entries({title:'getTitle',author:'getAuthor',subject:'getSubject',keywords:'getKeywords',creator:'getCreator',producer:'getProducer',created:'getCreationDate',modified:'getModificationDate'})) {
                try { const v = doc[method](); report.metadata[key] = v instanceof Date ? v.toISOString() : v ?? null; } catch (_) { report.metadata[key] = null; }
            }
            const visited = new Set();
            async function visit(value, reference, depth = 0) {
                if (!(value instanceof PDFDict) || depth > 12 || visited.has(value)) return;
                visited.add(value);
                const type = text(read(value, 'Type')), br = read(value, 'ByteRange'), contents = read(value, 'Contents');
                if (type === '/Sig' || br instanceof PDFArray) {
                    const signature = { object_reference: reference, filter: text(read(value,'Filter')), subfilter: text(read(value,'SubFilter')),
                        declared_name: text(read(value,'Name')), declared_signing_time: text(read(value,'M')), reason: text(read(value,'Reason')), location: text(read(value,'Location')),
                        cryptographic_verification: 'not-performed', cms: null };
                    if (br instanceof PDFArray && contents && typeof contents.asBytes === 'function') {
                        const signatureBytes = contents.asBytes();
                        const ranges = Array.from({length:br.size()}, (_, i) => Number(br.lookup(i).toString()));
                        Object.assign(signature, rangeInfo(bytes, ranges, signatureBytes));
                        signature.contents_sha256 = await sha256(signatureBytes);
                        if (signatureBytes.some(b => b)) try { signature.cms = await inspectCMS(signatureBytes); }
                        catch (_) { signature.cms_error = 'CMS not decoded; format may be unsupported or malformed.'; }
                    } else signature.inspection_note = 'Signature dictionary lacks a readable ByteRange/Contents pair.';
                    report.signatures.push(signature);
                }
                for (const [, child] of value.entries()) {
                    if (child instanceof PDFDict) await visit(child, reference + ' direct', depth + 1);
                    else if (child instanceof PDFArray) for (let i = 0; i < child.size(); i++) if (child.get(i) instanceof PDFDict) await visit(child.get(i), reference + ' direct', depth + 1);
                }
            }
            for (const [ref, obj] of doc.context.enumerateIndirectObjects()) await visit(obj, ref.toString());
            report.signature_scope = 'Signature dictionaries available in the current parsed object graph; historical revisions and visible signature artwork are not exhaustively audited.';
        } catch (_) { report.status = 'inspection-unavailable'; report.error = 'PDF metadata could not be read. It may be encrypted, malformed or unsupported. Exact-byte hashing still succeeded.'; }
        return report;
    }
    function emailInfo(bytes) {
        const source = new TextDecoder().decode(bytes.slice(0, 256 * 1024));
        const boundary = /\r?\n\r?\n/.exec(source);
        const header = source.slice(0, boundary ? boundary.index : source.length).replace(/\r?\n[ \t]+/g, ' ');
        const names = new Set(['from','to','cc','bcc','date','subject','message-id','in-reply-to','content-type']);
        const headers = {};
        for (const line of header.split(/\r?\n/)) {
            const m = /^([\w-]+):[ \t]*(.*)$/.exec(line);
            if (m && names.has(m[1].toLowerCase())) (headers[m[1].toLowerCase()] ||= []).push(m[2]);
        }
        return { status: 'headers-extracted', headers, header_encoding: 'raw unfolded values; encoded words retained', delivery_verification: 'not-performed', dkim_verification: 'not-performed' };
    }
    async function inspect(file, role, PDFLib) {
        if (!file || !file.size) throw new Error('Choose a nonempty file.');
        if (file.size > MAX_BYTES) throw new Error('This local intake accepts files up to 64 MiB.');
        const bytes = new Uint8Array(await file.arrayBuffer());
        const isPDF = /%PDF-\d\.\d/.test(new TextDecoder().decode(bytes.slice(0, 1024)));
        if (role === 'original' && !isPDF) throw new Error('Document 1 must be the original PDF bytes.');
        const result = { role, filename: file.name, bytes: bytes.length, sha256: await sha256(bytes), media_type: isPDF ? 'application/pdf' : file.type || 'application/octet-stream',
            browser_last_modified_ms: file.lastModified || null, source_date_verified: false };
        if (isPDF) result.pdf = await pdfInfo(bytes, PDFLib);
        else if (/\.eml$/i.test(file.name) || file.type === 'message/rfc822') result.email = emailInfo(bytes);
        else result.inspection = 'Exact bytes hashed. Detailed metadata extraction supports PDF and .eml files.';
        return result;
    }
    async function pair(original, correspondence) {
        if (!original || !correspondence) throw new Error('Choose both documents to make the pair record.');
        const manifest = { schema:'commons/artifact-pair/1', artifacts:[original, correspondence],
            relationship:'Operator-selected original PDF and related correspondence; the relation and any dispatch are not independently verified.',
            signature_verification:'not-performed', chain_receipt:null };
        const text = canonical(manifest) + '\n';
        return { manifest, text, sha256:await sha256(utf8.encode(text)), bytes:utf8.encode(text).length, canonicalization:'commons/sorted-json-v1: recursively sorted object keys, preserved array order, JSON primitives, UTF-8, one final LF' };
    }
    return { MAX_BYTES, CERTLEDGER, ROOT, sha256, canonical, anchor, inspect, pair, pdfInfo, inspectCMS, rangeInfo };
})();
