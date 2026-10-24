import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const folder=new URL('../reading/correspondence/',import.meta.url);

test('correspondence completion keeps blanks separate from private print and email values',async()=>{
 const fields=JSON.parse(await readFile(new URL('source/fields.json',folder),'utf8'));
 const inputs=new Map();
 class Element {
  constructor(){this.textContent='';this.value='';this.children=[];this.listeners={};this.attributes={};this.hidden=true;this.clientHeight=this.scrollHeight=20;this.clientWidth=this.scrollWidth=200;}
  append(child){this.children.push(child);if(child.name)inputs.set(child.name,child);}
  addEventListener(event,fn){this.listeners[event]=fn;}
  setAttribute(k,v){this.attributes[k]=v;}
  removeAttribute(k){delete this.attributes[k];}
 }
 const ids=new Map(['correspondence-form','field-controls','copy-status','email-panel','email-text','print-blank','print-copy','prepare-email'].map(id=>[id,new Element()]));
 ids.set('form-fields',{textContent:JSON.stringify(fields)});
 const form=ids.get('correspondence-form');form.elements={namedItem:name=>inputs.get(name)};
 const targets=[...fields,fields[0]].map(field=>Object.assign(new Element(),{dataset:{field:field.name}}));
 const paragraphs=[{textContent:'You digitally signed the original PDF identified above.'}];
 let printed=[];
 const context=vm.createContext({document:{getElementById:id=>ids.get(id),createElement:()=>new Element(),querySelectorAll:selector=>selector==='[data-field]'?targets:selector==='[data-email-paragraph]'?paragraphs:[]},window:{print(){printed.push(targets.map(x=>x.textContent));}},setTimeout:fn=>fn()});
 // No network, storage, location or remote APIs are supplied to this execution.
 vm.runInContext(await readFile(new URL('source/index.js',folder),'utf8'),context);
 assert.ok(targets.every(x=>x.textContent===''));
 inputs.get('sender1').value='Synthetic <b>literal sender</b>';form.listeners.input();
 assert.equal(targets[0].textContent,inputs.get('sender1').value);
 assert.equal(targets.at(-1).textContent,targets[0].textContent);
 ids.get('print-blank').listeners.click();
 assert.ok(printed[0].every(x=>x===''),'blank printing must remove private text, not merely hide its color');
 assert.equal(targets[0].textContent,inputs.get('sender1').value);
 ids.get('prepare-email').listeners.click();
 assert.equal(ids.get('email-panel').hidden,false);
 assert.match(ids.get('email-text').value,/Synthetic <b>literal sender<\/b>/);
 assert.match(ids.get('email-text').value,/digitally signed the original PDF/);
 inputs.get('issues').value='Revised synthetic issue';form.listeners.input();
 assert.equal(ids.get('email-panel').hidden,true);assert.equal(ids.get('email-text').value,'');
 targets[0].scrollWidth=300;ids.get('print-copy').listeners.click();assert.equal(printed.length,1);
 assert.match(ids.get('copy-status').textContent,/longer than its printed space/);
 targets[0].scrollWidth=200;ids.get('print-copy').listeners.click();assert.equal(printed.length,2);
 assert.equal(printed[1][0],inputs.get('sender1').value);
 for(const input of inputs.values())input.value='';form.listeners.reset();
 assert.ok(targets.every(x=>x.textContent===''));assert.equal(ids.get('email-text').value,'');
});

test('current correspondence edition contains no real party or account defaults',async()=>{
 const html=await readFile(new URL('index.html',folder),'utf8');
 const edition=JSON.parse(await readFile(new URL('edition.json',folder),'utf8'));
 assert.equal(edition.consumer_fields,'blank');
 const fields=JSON.parse(await readFile(new URL('source/fields.json',folder),'utf8'));
 assert.ok(fields.every(field=>!Object.hasOwn(field,'value')&&!Object.hasOwn(field,'default')));
 assert.ok(!/<(?:input|textarea)\b[^>]*\bvalue="[^"]+"/i.test(html));
 assert.equal((html.match(/class="letter-page"/g)||[]).length,2);
 assert.match(html,/You digitally signed the original PDF/);
});
