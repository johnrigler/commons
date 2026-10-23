import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {webcrypto} from 'node:crypto';
import vm from 'node:vm';
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', {value:webcrypto});
for (const file of ['verify.js', 'thunderwords.js', 'portal-core.js', 'portal-urls.js']) vm.runInThisContext(await readFile(new URL('../' + file, import.meta.url), 'utf8'));
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
        assert.ok((item.companies || []).every(id=>catalog.items.some(target=>target.id===id && P.recordClass(target)==='company')));
        assert.notEqual(item.kind, 'attestation');
    }
});

test('company and article views filter independently and search company roles and legal names', () => {
    const companies=P.visible(catalog.items,'','','company');
    const articles=P.visible(catalog.items,'','','article');
    assert.equal(companies.length,7);
    assert.ok(articles.some(item=>item.id==='portals-proof' && item.genre==='opinion' && item.author==='John Rigler'));
    assert.ok(articles.some(item=>item.id==='amicus-systems' && item.genre==='opinion'));
    assert.equal(companies.length+articles.length,P.visible(catalog.items).length);
    assert.ok(companies.every(item=>item.kind==='description' && item.legal_name && item.role));
    assert.ok(articles.every(item=>P.recordClass(item)==='article'));
    assert.equal(P.visible(catalog.items,'','NCS','company')[0].id,'company-ncs');
    assert.equal(P.visible(catalog.items,'','Experian Information Solutions','company')[0].id,'company-experian');
    assert.equal(P.visible(catalog.items,'','creditor representation','company')[0].id,'company-rausch-sturm');
    assert.deepEqual(P.visible(catalog.items,'attestation','','company'),[]);
});

test('company references preserve separate entity labels and exact profile sections', async () => {
    const profiles=catalog.items.filter(item=>P.recordClass(item)==='company');
    const manifest=JSON.parse(await readFile(new URL('../reading/companies/edition.json',import.meta.url),'utf8'));
    for (const profile of profiles) {
        const ref=P.companyReference(profile);
        assert.equal(ref.schema,'commons/company-reference/1');
        assert.equal(ref.company.legal_name,profile.legal_name);
        assert.deepEqual(ref.profile,P.reference(profile));
        assert.ok(manifest.profiles.some(item=>item.id===profile.id && item.cid===ref.profile.cid && item.fragment===ref.profile.fragment));
    }
    const funding=P.companyReference(profiles.find(item=>item.id==='company-midland-funding'));
    const servicing=P.companyReference(profiles.find(item=>item.id==='company-midland-credit'));
    assert.notEqual(funding.company.legal_name,servicing.company.legal_name);
    assert.ok(!P.sameReference(funding.profile,servicing.profile));
    assert.throws(()=>P.companyReference(parent),/company profile/);
    assert.throws(()=>P.companyReference({...profiles[0],cid:'invalid'}),/company profile/);
    const reply=await P.create(profiles[0],{...fields,indexed:true,record_class:'company'});
    const item=P.item(reply);
    assert.equal(P.recordClass(item),'article');
    assert.deepEqual(item.parent,P.reference(profiles[0]));
    assert.equal(P.visible([item],'','','company').length,0);
    assert.equal(P.visible([item],'','','article').length,1);
    assert.throws(()=>P.companyReference(item),/company profile/);
});

test('consolidated entry URLs open the current article without duplicating the feed', () => {
    const folded = catalog.items.filter(item=>item.consolidated_into);
    assert.equal(folded.length,4);
    for (const item of folded) {
        const current=catalog.items.find(entry=>entry.id===item.consolidated_into);
        assert.ok(current?.indexed);
        assert.equal(item.indexed,false);
        assert.equal(item.title,current.title);
        assert.deepEqual(P.reference(item),P.reference(current));
        assert.ok(!P.visible(catalog.items).some(entry=>entry.id===item.id));
    }
});

test('the mediation story has a distinct document and direct URL without duplicating the feed', () => {
    const story=catalog.items.find(item=>item.id==='debt-recollection');
    const argument=catalog.items.find(item=>item.id==='debt-default');
    assert.equal(story.kind,'story');
    assert.equal(story.title,'Paying $1,000 to get past the process');
    assert.equal(story.fragment,'debt-recollection');
    assert.notEqual(story.cid,argument.cid);
    assert.ok(argument.related.includes(story.id));
    assert.ok(!P.visible(catalog.items).some(item=>item.id===story.id));
});

test('full entry URLs survive refresh on Pages, IPFS, and a local directory', () => {
    const item={id:'debt-recollection'};
    for (const root of ['https://johnrigler.github.io/commons/','https://example.test/ipfs/bafyexample/','file:///home/user/commons/']) {
        const direct=root+'entry/debt-recollection.html';
        assert.equal(CommonsURLs.entryURL(item,root),direct);
        assert.equal(CommonsURLs.entryURL(item,direct),direct);
        assert.equal(CommonsURLs.entryId(direct),'debt-recollection');
        assert.equal(CommonsURLs.entryId(root+'#item=debt-recollection'),'debt-recollection');
        assert.equal(CommonsURLs.entryId(root+'?item=debt-recollection'),'debt-recollection');
        assert.equal(CommonsURLs.entryId(direct+'#view=companies'),null);
        assert.equal(CommonsURLs.documentURL('reading/debt/index.html',direct),root+'reading/debt/index.html');
        assert.equal(CommonsURLs.entryURL({id:'local-id',local:true},direct),root+'index.html#item=local-id');
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
    assert.equal(P.visible(items).length,P.visible(catalog.items).length+1);
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
