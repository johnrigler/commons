import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readlink } from 'node:fs/promises';
import { createHash, webcrypto } from 'node:crypto';
import vm from 'node:vm';
if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
vm.runInThisContext(await readFile(new URL('../verify.js', import.meta.url), 'utf8'));
const folder = new URL('../reading/experian-form/', import.meta.url);

test('Commons records exact blank PDF bytes with signature and pin status separate', async () => {
    const edition = JSON.parse(await readFile(new URL('edition.json', folder), 'utf8'));
    const pdf = edition.artifacts.find(file => file.media_type === 'application/pdf');
    const bytes = await readFile(new URL(pdf.path, folder));
    assert.equal(await CommonsCID.cid(new Uint8Array(bytes)), pdf.cid);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), pdf.sha256);
    assert.equal(await readlink(new URL('Experian-Correction-Blank.pdf', folder)), pdf.path);
    assert.equal(edition.consumer_fields, 'blank');
    assert.equal(edition.author_signature.verified, false);
    assert.equal(edition.ipfs.status, 'not-pinned');
    assert.equal(edition.ipfs.receipt, null);
    const html = await readFile(new URL('index.html', folder), 'utf8');
    assert.ok(html.includes('href="' + pdf.path + '"'));
    for (const personal of ['6067494', 'C-319', '10,365.56', 'Shannon', 'John Rigler']) assert.ok(!html.includes(personal));
});

test('private fill updates text only, repeats names, clears fields and leaves the blank reference unchanged', async () => {
    const fields = JSON.parse(await readFile(new URL('source/fields.json', folder), 'utf8'));
    const reference = JSON.parse(await readFile(new URL('source/pdf-reference.json', folder), 'utf8'));
    const before = JSON.stringify(reference);
    class Element {
        constructor() { this.textContent = ''; this.value = ''; this.checked = false; this.children = []; this.listeners = {}; this.attributes = {}; this.clientHeight = 20; this.scrollHeight = 20; this.clientWidth = 100; this.scrollWidth = 100; }
        append(child) { this.children.push(child); if (child.name) inputs.set(child.name, child); }
        addEventListener(event, action) { this.listeners[event] = action; }
        setAttribute(key, value) { this.attributes[key] = value; }
        removeAttribute(key) { delete this.attributes[key]; }
    }
    const inputs = new Map([['fraud_referral', new Element()]]);
    const ids = new Map(['private-form', 'field-controls', 'copy-status', 'print-private', 'fraud-mark', 'blank-ipfs-reference', 'blank-sha256', 'private-copy'].map(id => [id, new Element()]));
    ids.set('form-fields', { textContent: JSON.stringify(fields) });
    ids.set('blank-reference', { textContent: before });
    ids.get('private-form').elements = { namedItem: name => inputs.get(name) };
    const targets = [...fields, fields[0]].map(field => Object.assign(new Element(), { dataset: { field: field.name } }));
    let printed = 0;
    const context = vm.createContext({
        document: { getElementById: id => ids.get(id), createElement: () => new Element(), querySelectorAll: () => targets, body: { classList: { toggle() {} } } },
        window: { print() { printed++; } }, setTimeout: action => action(),
        // No network or storage APIs: an attempted read/write fails this run.
    });
    vm.runInContext(await readFile(new URL('source/index.js', folder), 'utf8'), context);
    const form = ids.get('private-form');
    inputs.get('consumer1').value = 'Synthetic <b>literal name</b>';
    inputs.get('facts').value = 'Synthetic dispute facts';
    inputs.get('fraud_referral').checked = true;
    form.listeners.input();
    assert.equal(targets[0].textContent, 'Synthetic <b>literal name</b>');
    assert.equal(targets.at(-1).textContent, targets[0].textContent);
    assert.equal(ids.get('fraud-mark').textContent, '☑');
    assert.equal(ids.get('blank-reference').textContent, before);
    assert.equal(JSON.stringify(reference), before);
    targets[0].scrollHeight = 45;
    ids.get('print-private').listeners.click();
    assert.equal(printed, 0);
    assert.match(ids.get('copy-status').textContent, /longer than its space/);
    targets[0].scrollHeight = 20;
    targets[0].scrollWidth = 120;
    ids.get('print-private').listeners.click();
    assert.equal(printed, 0);
    targets[0].scrollWidth = 100;
    ids.get('print-private').listeners.click();
    assert.equal(printed, 1);
    for (const input of inputs.values()) { input.value = ''; input.checked = false; }
    form.listeners.reset();
    assert.ok(targets.every(target => target.textContent === ''));
    assert.equal(ids.get('fraud-mark').textContent, '☐');
    assert.equal(ids.get('copy-status').textContent, 'All fields are blank.');
});
