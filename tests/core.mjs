import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash, webcrypto } from 'node:crypto';
import vm from 'node:vm';

if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
for (const name of ['verify.js', 'pinata.js', 'thunderwords.js']) {
    vm.runInThisContext(await readFile(new URL('../' + name, import.meta.url), 'utf8'), { filename: name });
}
const CID = globalThis.CommonsCID, Pinata = globalThis.CommonsPinata, TW = globalThis.CommonsThunderwords;
const hello = 'bafkreifzjut3te2nhyekklss27nh3k72ysco7y32koao5eei66wof36n5e';

function readVarint(data, state) {
    let value = 0, scale = 1, byte;
    do { byte = data[state.offset++]; value += (byte & 127) * scale; scale *= 128; } while (byte & 128);
    return value;
}

// A small independent CBOR reader checks the CAR wire format, not its encoder.
function cbor(data, state) {
    const head = data[state.offset++], major = head >> 5;
    let length = head & 31;
    if (length === 24) length = data[state.offset++];
    if (major === 0) return length;
    if (major === 2 || major === 3) {
        const value = data.slice(state.offset, state.offset += length);
        return major === 3 ? new TextDecoder().decode(value) : value;
    }
    if (major === 4) return Array.from({ length }, () => cbor(data, state));
    if (major === 5) {
        const value = {};
        for (let i = 0; i < length; i++) value[cbor(data, state)] = cbor(data, state);
        return value;
    }
    if (major === 6) return { tag: length, value: cbor(data, state) };
    throw new Error('Unexpected CBOR type.');
}

function unpackCAR(data) {
    const state = { offset: 0 }, headerSize = readVarint(data, state), headerEnd = state.offset + headerSize;
    const header = cbor(data, state);
    assert.equal(state.offset, headerEnd);
    assert.equal(header.version, 1);
    assert.equal(header.roots.length, 1);
    assert.equal(header.roots[0].tag, 42);
    assert.equal(header.roots[0].value[0], 0);
    const blockSize = readVarint(data, state), id = data.slice(state.offset, state.offset += 36);
    assert.deepEqual(id, header.roots[0].value.slice(1));
    assert.deepEqual([...id.slice(0, 4)], [1, 0x55, 0x12, 32]);
    const bytes = data.slice(state.offset, state.offset += blockSize - 36);
    assert.equal(state.offset, data.length);
    assert.equal(Buffer.from(id.slice(4)).toString('hex'), createHash('sha256').update(bytes).digest('hex'));
    return { bytes, id };
}

test('CID vector and exact byte identity, including newline and Unicode', async () => {
    assert.equal(await CID.cid('hello world'), hello);
    assert.equal((await CID.verify('hello world', hello + '.md')).valid, true);
    assert.equal((await CID.verify('hello world\n', hello + '.md')).valid, false);
    assert.notEqual(await CID.cid('é'), await CID.cid('e\u0301'));
    await assert.rejects(CID.verify('hello world', 'friendly-name.md'), /filename/);
    await assert.rejects(CID.cid(new Uint8Array(CID.MAX_BYTES + 1)), /1 MiB/);
});

test('CARv1 imports preserve raw bytes at varint boundaries', async () => {
    for (const size of [0, 1, 91, 92, 128, 16384, CID.MAX_BYTES]) {
        const bytes = Uint8Array.from({ length: size }, (_, i) => i % 251);
        const archive = await CID.car(bytes);
        assert.equal(archive.cid, await CID.cid(bytes));
        assert.deepEqual(unpackCAR(archive.bytes).bytes, bytes);
    }
});

test('the source catalog contains real CID-named files', async () => {
    const catalog = JSON.parse(await readFile(new URL('../statements.json', import.meta.url), 'utf8'));
    for (const record of catalog.statements) {
        const bytes = new Uint8Array(await readFile(new URL('../' + record.path, import.meta.url)));
        assert.equal((await CID.verify(bytes, record.path)).valid, true);
        assert.equal(await CID.cid(bytes), record.cid);
    }
});

test('Pinata uses public CAR import and verifies the returned root', async () => {
    const calls = [], bytes = CID.bytes('hello world');
    const send = async (url, options) => {
        calls.push(url);
        assert.equal(options.credentials, 'omit');
        assert.equal(options.headers.Authorization, 'Bearer TEST_ONLY');
        if (calls.length === 1) return Response.json({ data: { files: [] } });
        assert.equal(url, 'https://uploads.pinata.cloud/v3/files');
        assert.equal(options.body.get('network'), 'public');
        assert.equal(options.body.get('car'), 'true');
        assert.deepEqual(unpackCAR(new Uint8Array(await options.body.get('file').arrayBuffer())).bytes, bytes);
        return Response.json({ data: { cid: hello, id: 'test-file-id' } });
    };
    assert.equal((await Pinata.pin('TEST_ONLY', bytes, hello, hello + '.md', send)).status, 'pinned');
    assert.equal(calls.length, 2);
    assert.equal(new URL(calls[0]).searchParams.get('cid'), hello);
});

test('tampered files never reach Pinata; wrong receipts and denied tokens fail', async () => {
    let calls = 0;
    await assert.rejects(Pinata.pin('TEST_ONLY', 'tampered', hello, hello, async () => { calls++; }), /CID mismatch/);
    assert.equal(calls, 0);
    await assert.rejects(Pinata.pin('TEST_ONLY', 'hello world', hello, hello, async () => {
        calls++;
        return Response.json(calls === 1 ? { data: { files: [] } } : { data: { cid: 'wrong', id: 'bad-id' } });
    }), /different CID/);
    await assert.rejects(Pinata.list('SECRET_TEST_TOKEN', '', async () => new Response('SECRET_TEST_TOKEN', { status: 401 })), error => {
        assert.match(error.message, /rejected the token/); assert.ok(!error.message.includes('SECRET_TEST_TOKEN')); return true;
    });
});

test('an existing pin is reused without another upload', async () => {
    let calls = 0;
    const result = await Pinata.pin('TEST_ONLY', 'hello world', hello, hello, async () => {
        calls++; return Response.json({ data: { files: [{ cid: hello, id: 'existing' }] } });
    });
    assert.equal(calls, 1); assert.equal(result.status, 'already-pinned');
});

test('Litecoin root and readable tags have independently checked version/checksums', async () => {
    const expected = ['LLxNCSzzzzzzzzzzzzzzzzzzzzzzd6Kx4V', 'LMxGiTHUBzzzzzzzzzzzzzzzzzzzTEK6sA', 'LNxRENTxESCALATioNzzzzzzzzzzaSZbWd'];
    const draft = await TW.draft({ name: 'NCS', transport: 'GitHub', subject: 'Rent escalation', message: 'https://github.com/johnrigler/commons' });
    assert.deepEqual(draft.tags.map(tag => tag.address), expected);
    assert.equal(draft.mainThunderword.address, 'LLLLLLLLLLLLLLLLLLLLLLLLLLLLXgkk2V');
    for (const address of [TW.ROOT, ...expected]) {
        // Independent byte-array Base58 decoder and Node's hash API.
        const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const bytes = [0];
        for (const char of address) {
            let carry = alphabet.indexOf(char);
            for (let i = bytes.length - 1; i >= 0; i--) { const n = bytes[i] * 58 + carry; bytes[i] = n & 255; carry = n >>> 8; }
            while (carry) { bytes.unshift(carry & 255); carry >>>= 8; }
        }
        assert.equal(bytes[0], 0x30); assert.equal(bytes.length, 25);
        const payload = Buffer.from(bytes.slice(0, 21));
        const check = createHash('sha256').update(createHash('sha256').update(payload).digest()).digest().subarray(0, 4);
        assert.deepEqual(Buffer.from(bytes.slice(21)), check);
    }
    assert.ok(draft.outputs.slice(0, 4).every(output => output.amountLitoshis === null));
    await assert.rejects(TW.inspect(TW.ROOT.slice(0, -1) + 'W'), /checksum/);
    await assert.rejects(TW.generate('LAx', 'NCS'), /outside Litecoin/);
    await assert.rejects(TW.generate('LLx', 'A'.repeat(26)), /25 encoded/);
});

test('OP_RETURN handles the 75/76 boundary and counts UTF-8 bytes', async () => {
    const fields = { name: 'John Rigler', transport: 'GitHub.com', subject: 'Commons' };
    for (const [message, prefix] of [['a'.repeat(75), '6a4b'], ['a'.repeat(76), '6a4c4c'], ['é'.repeat(40), '6a4c50']]) {
        const draft = await TW.draft({ ...fields, message });
        assert.ok(draft.outputs.at(-1).scriptPubKey.startsWith(prefix));
        assert.equal(draft.message.bytes, Buffer.byteLength(message));
    }
    await assert.rejects(TW.draft({ ...fields, message: 'é'.repeat(41) }), /80-byte/);
});

test('included announcement files match the actual generator', async () => {
    for (const name of ['commons-announcement.draft.json', 'ncs-rent-escalation.draft.json']) {
        const value = JSON.parse(await readFile(new URL('../examples/' + name, import.meta.url), 'utf8'));
        const tags = Object.fromEntries(value.tags.map(tag => [tag.role, tag.phrase]));
        assert.deepEqual(await TW.draft({ ...tags, message: value.message.text, prefixes: value.roleProfile }), value);
    }
});
