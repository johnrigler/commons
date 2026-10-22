import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {webcrypto} from 'node:crypto';
import vm from 'node:vm';
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', {value:webcrypto});
for (const file of ['verify.js', 'thunderwords.js', 'portal-core.js']) vm.runInThisContext(await readFile(new URL('../' + file, import.meta.url), 'utf8'));
const P = CommonsPortal;
const catalog = JSON.parse(await readFile(new URL('../portal.json', import.meta.url), 'utf8'));
const parent = catalog.items.find(item => item.id === 'request');
const fields = {kind:'explanation',title:'An additional observation',text:'Synthetic text <b>kept as text</b>.',author:'Synthetic',source:'https://example.invalid/source',indexed:false,created:'2026-10-21T00:00:00Z'};
const storage = () => {const map = new Map(); return {getItem:key=>map.get(key)||null,setItem:(key,value)=>map.set(key,value)};};

test('portal references existing frozen documents and valid fragments without invented attestations', async () => {
    assert.equal((await CommonsThunderwords.generate('LMx','Commons')).address, catalog.index.address);
    assert.equal(catalog.index.address, P.INDEX);
    const ids = new Set(catalog.items.map(item=>item.id));
    for (const item of catalog.items) {
        const text = await readFile(new URL('../' + item.path, import.meta.url), 'utf8');
        assert.equal(await CommonsCID.cid(text), item.cid);
        assert.ok(text.includes('id="' + item.fragment + '"'));
        assert.ok(item.related.every(id=>ids.has(id)));
        assert.notEqual(item.kind, 'attestation');
    }
});

test('responses name exact parent editions and preserve bytes through local save and load', async () => {
    const entry = await P.create(parent, fields);
    assert.deepEqual(entry.record.parent, {cid:parent.cid,fragment:'request'});
    const saved = storage();
    await P.save(entry,saved); await P.save(entry,saved);
    const loaded = await P.load(saved);
    assert.equal(loaded.length,1);
    assert.deepEqual(loaded[0],entry);
    assert.equal(P.item(entry).text,fields.text);
    assert.equal(await CommonsCID.cid(P.bytes(entry)), entry.cid);
    const tampered = structuredClone(entry); tampered.record.text += '!';
    await assert.rejects(P.verify(tampered), /CID/);
});

test('unindexed branches remain reachable by exact reference and stay out of the main view', async () => {
    const unindexed = await P.create(parent,fields);
    const indexed = await P.create(parent,{...fields,indexed:true,title:'Indexed contribution'});
    const items = [P.item(unindexed),P.item(indexed),...catalog.items];
    assert.ok(P.sameReference(items[0].parent,P.reference(parent)));
    assert.equal(P.visible(items).length,catalog.items.length+1);
    assert.ok(!P.visible(items).some(item=>item.id===unindexed.cid));
    assert.equal(P.visible(items,'explanation','Indexed contribution').length,1);
    const reply = await P.create(items[0],fields);
    assert.equal(reply.record.parent.cid,unindexed.cid);
    assert.equal(reply.record.parent.fragment,'');
});

test('index choice controls prepared Commons output and rejects inconsistent records', async () => {
    const unindexed = await P.create(parent,fields);
    const tagged = await P.create(parent,{...fields,indexed:true});
    const base = {name:'Synthetic',subject:'Explanation',message:'ipfs://'+unindexed.cid};
    const excluded = await CommonsThunderwords.draft({...base,transport:'IPFS',includeCommons:false});
    const included = await CommonsThunderwords.draft({...base,transport:'Commons',includeCommons:true});
    assert.ok(!excluded.outputs.some(output=>output.address===P.INDEX));
    assert.equal(included.outputs.filter(output=>output.address===P.INDEX).length,1);
    assert.equal(tagged.record.transport,P.INDEX);
    assert.equal(unindexed.record.transport,null);
    await assert.rejects(P.create(parent,{...fields,source:'javascript:alert(1)'}));
    assert.throws(()=>P.validate({...tagged.record,transport:null}),/transport/);
});
