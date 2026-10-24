import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root = new URL('../', import.meta.url);
const registryBytes = await readFile(new URL('legal-references.json', root));
const registry = JSON.parse(registryBytes);
const catalog = JSON.parse(await readFile(new URL('portal.json', root)));
const edition = JSON.parse(await readFile(new URL('reading/law/edition.json', root)));

test('legal rules retain distinct jurisdiction, actor, trigger, duty, deadline and limits', () => {
    assert.equal(registry.schema, 'commons/legal-references/1');
    const ids = new Set();
    for (const rule of registry.rules) {
        assert.ok(!ids.has(rule.id), 'duplicate legal reference: '+rule.id);
        ids.add(rule.id);
        for (const key of ['citation','jurisdiction','applies_to','trigger','deadline','required_action','consequence','limits','checked','review_status']) {
            assert.equal(typeof rule[key], 'string', rule.id+': '+key);
            assert.ok(rule[key].trim(), rule.id+': '+key+' is empty');
        }
        for (const url of [rule.source_url, ...(rule.additional_sources||[])]) assert.equal(new URL(url).protocol, 'https:');
    }
    for (const record of registry.existing_legal_sources) {
        assert.ok(record.review_status.startsWith('Imported'));
        assert.ok(record.cited_by.length);
    }
});

test('published legal edition freezes the exact registry and resolves all of its law anchors', async () => {
    const jsonArtifact = edition.artifacts.find(item=>item.media_type==='application/json');
    const frozen = await readFile(new URL('reading/law/'+jsonArtifact.path, root));
    assert.deepEqual(frozen, registryBytes);
    assert.equal(createHash('sha256').update(frozen).digest('hex'), jsonArtifact.sha256);
    const htmlArtifact = edition.artifacts.find(item=>item.media_type==='text/html');
    const html = await readFile(new URL('reading/law/'+htmlArtifact.path, root), 'utf8');
    assert.equal(createHash('sha256').update(html).digest('hex'), htmlArtifact.sha256);
    const anchors = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(anchors.has(match[1]), 'missing law target: '+match[1]);
    for (const record of registry.rules) assert.ok(anchors.has('law-'+record.id));
    for (const id of ['legal-reference','dispute-deadlines','debt-remedies']) {
        const item = catalog.items.find(item=>item.id===id);
        assert.equal(item.cid, htmlArtifact.cid);
        assert.ok(anchors.has(item.fragment));
    }
    const rent = catalog.items.find(item=>item.id==='rent-acceleration');
    for (const id of ['legal-reference','dispute-deadlines','debt-remedies']) assert.ok(rent.related.includes(id));
});
