/* Commons profile: CIDv1, raw (0x55), sha2-256, lowercase base32. */
globalThis.CommonsCID = (() => {
    const MAX_BYTES = 1024 * 1024;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
    const encoder = new TextEncoder();

    function bytes(value) {
        if (value instanceof Uint8Array) return value;
        if (value instanceof ArrayBuffer) return new Uint8Array(value);
        if (typeof value === 'string') return encoder.encode(value);
        throw new TypeError('Expected UTF-8 text or file bytes.');
    }

    function base32(data) {
        let output = '', buffer = 0, bits = 0;
        for (const byte of data) {
            buffer = (buffer << 8) | byte;
            bits += 8;
            while (bits >= 5) {
                bits -= 5;
                output += alphabet[(buffer >>> bits) & 31];
            }
        }
        if (bits) output += alphabet[(buffer << (5 - bits)) & 31];
        return output;
    }

    async function block(value) {
        const data = bytes(value);
        if (data.length > MAX_BYTES) throw new Error('This raw-block profile supports files up to 1 MiB.');
        if (!globalThis.crypto?.subtle) throw new Error('Web Crypto requires HTTPS or localhost.');
        const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
        const id = new Uint8Array(36);
        id.set([1, 0x55, 0x12, 0x20]);
        id.set(digest, 4);
        return { bytes: data, id, cid: 'b' + base32(id) };
    }

    async function cid(value) { return (await block(value)).cid; }

    function filenameCID(name) {
        const stem = name.split(/[\\/]/).pop().split('.')[0];
        return /^bafkrei[a-z2-7]{52}$/.test(stem) ? stem : null;
    }

    async function verify(value, filename) {
        const expected = filenameCID(filename);
        if (!expected) throw new Error('The filename must be a raw CIDv1, optionally followed by an extension.');
        const actual = await cid(value);
        return { expected, actual, valid: expected === actual };
    }

    function varint(number) {
        const output = [];
        do {
            let byte = number & 127;
            number = Math.floor(number / 128);
            if (number) byte |= 128;
            output.push(byte);
        } while (number);
        return new Uint8Array(output);
    }

    function join(...arrays) {
        const output = new Uint8Array(arrays.reduce((size, item) => size + item.length, 0));
        let offset = 0;
        for (const item of arrays) { output.set(item, offset); offset += item.length; }
        return output;
    }

    async function car(value) {
        const item = await block(value);
        // DAG-CBOR { roots: [tag42(bytes(0x00 + CID))], version: 1 }.
        const header = join(
            new Uint8Array([0xa2, 0x65]), encoder.encode('roots'),
            new Uint8Array([0x81, 0xd8, 0x2a, 0x58, 0x25, 0]), item.id,
            new Uint8Array([0x67]), encoder.encode('version'), new Uint8Array([1])
        );
        return { cid: item.cid, bytes: join(varint(header.length), header, varint(36 + item.bytes.length), item.id, item.bytes) };
    }

    return { MAX_BYTES, bytes, cid, filenameCID, verify, car };
})();
