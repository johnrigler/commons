import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash,webcrypto} from 'node:crypto';
import {createRequire} from 'node:module';
import vm from 'node:vm';
if(!globalThis.crypto)Object.defineProperty(globalThis,'crypto',{value:webcrypto});
const require=createRequire(import.meta.url);
const PDFLib=require('../vendor/pdf-lib/pdf-lib-1.17.1.min.js');
vm.runInThisContext(await readFile(new URL('../tools/artifacts/source/core.js',import.meta.url),'utf8'));
const A=CommonsArtifacts;
const file=(bytes,name,type='application/pdf')=>({size:bytes.length,name,type,lastModified:0,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)});

test('artifact intake hashes the original bytes and distinguishes source digests from the pair record',async()=>{
 const doc=await PDFLib.PDFDocument.create();doc.addPage();doc.setTitle('Synthetic source');doc.setAuthor('Synthetic author');
 const bytes=await doc.save(),before=Buffer.from(bytes);
 const original=await A.inspect(file(bytes,'synthetic.pdf'),'original',PDFLib);
 assert.equal(original.sha256,createHash('sha256').update(bytes).digest('hex'));
 assert.deepEqual(Buffer.from(bytes),before);assert.equal(original.pdf.pages,1);assert.equal(original.pdf.metadata.title,'Synthetic source');
 assert.equal(original.pdf.cryptographic_signature_verification,'not-performed');assert.equal(original.pdf.signatures.length,0);
 const eml=new TextEncoder().encode('From: sender@example.invalid\r\nTo: recipient@example.invalid\r\nSubject: Synthetic message\r\n continued\r\nMessage-ID: <synthetic@example.invalid>\r\n\r\nExact body\r\n');
 const correspondence=await A.inspect(file(eml,'message.eml','message/rfc822'),'correspondence',PDFLib);
 assert.equal(correspondence.email.headers.subject[0],'Synthetic message continued');
 assert.equal(correspondence.email.delivery_verification,'not-performed');
 const pair=await A.pair(original,correspondence);
 assert.equal(pair.sha256,createHash('sha256').update(pair.text).digest('hex'));
 assert.notEqual(pair.sha256,original.sha256);assert.notEqual(pair.sha256,correspondence.sha256);
 assert.equal((await A.pair(original,correspondence)).text,pair.text);
 assert.equal(JSON.parse(pair.text).artifacts[0].sha256,original.sha256);
 assert.notEqual((await A.inspect(file(new Uint8Array([...eml,10]),'message.eml','message/rfc822'),'correspondence',PDFLib)).sha256,correspondence.sha256);
 await assert.rejects(()=>A.inspect(file(eml,'renamed.pdf'),'original',PDFLib),/original PDF bytes/);
});

test('signature extraction handles PDF object streams and embedded CMS certificates without inventing validation',async()=>{
 const cms=Uint8Array.from(Buffer.from((await readFile(new URL('fixtures/synthetic-cms.der.base64',import.meta.url),'utf8')).trim(),'base64'));
 const doc=await PDFLib.PDFDocument.create();doc.addPage();
 const signature=doc.context.obj({Type:'Sig',Filter:'Adobe.PPKLite',SubFilter:'adbe.pkcs7.detached',Name:PDFLib.PDFString.of('Synthetic Signer'),ByteRange:[0,0,0,0],Contents:PDFLib.PDFHexString.of(Buffer.from(cms).toString('hex'))});
 const ref=doc.context.register(signature);doc.catalog.set(PDFLib.PDFName.of('Perms'),doc.context.obj({DocMDP:ref}));
 const bytes=await doc.save({useObjectStreams:true});
 const r=await A.inspect(file(bytes,'synthetic-signature.pdf'),'original',PDFLib);
 assert.equal(r.pdf.status,'parsed');assert.equal(r.pdf.signatures.length,1);
 const s=r.pdf.signatures[0];assert.equal(s.declared_name,'Synthetic Signer');assert.equal(s.subfilter,'/adbe.pkcs7.detached');
 assert.equal(s.cryptographic_verification,'not-performed');assert.equal(s.cms.content_type,'CMS SignedData');
 assert.ok(s.cms.certificates.some(c=>c.subject.some(v=>v.attribute==='CN'&&v.value==='Synthetic Signer')));
 assert.equal(s.cms.certificates[0].trust,'not-checked');
 assert.equal(s.ends_at_file_length,false);
 const rangeBytes=new TextEncoder().encode('prefix<0102>suffix');
 const range=A.rangeInfo(rangeBytes,[0,6,12,6],new Uint8Array([1,2]));
 assert.equal(range.structurally_valid,true);assert.equal(range.excluded_gap_matches_contents,true);assert.equal(range.ends_at_file_length,true);
 assert.equal(A.rangeInfo(rangeBytes,[0,99,12,6],new Uint8Array([1,2])).structurally_valid,false);
 assert.equal(A.rangeInfo(new Uint8Array([...rangeBytes,0]),[0,6,12,6],new Uint8Array([1,2])).later_bytes,1);
});

test('the hash-only Chisel handoff preserves readable 71-byte ASCII and omits private metadata',async()=>{
 const hash='0123456789abcdef'.repeat(4),draft=A.anchor(hash);
 assert.equal(draft.opReturnAscii,'sha256:'+hash);assert.equal(draft.opReturnBytes,71);
 assert.equal(Buffer.from(draft.opReturnHex,'hex').toString('ascii'),draft.opReturnAscii);
 assert.equal(draft.scriptPubKey,'6a47'+Buffer.from(draft.opReturnAscii).toString('hex'));
 assert.equal(draft.namespace.address,await CommonsThunderwords.generate('LMx','CertLedger').then(x=>x.address));
 assert.ok(!Object.hasOwn(draft,'filename'));assert.ok(!Object.hasOwn(draft,'artifacts'));
 assert.throws(()=>A.anchor(hash.slice(1)));assert.throws(()=>A.anchor(hash.toUpperCase()));
 const malformed=await A.inspect(file(new TextEncoder().encode('%PDF-1.7\nnot a parsed document'),'broken.pdf'),'original',PDFLib);
 assert.equal(malformed.pdf.status,'inspection-unavailable');assert.match(malformed.sha256,/^[a-f0-9]{64}$/);
});
