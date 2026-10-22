/* Public contribution records. No wallet keys, account tokens or network reader. */
globalThis.CommonsPortal = (() => {
    const KEY = 'commons.contributions.v1';
    const INDEX = 'LMxCoMMoNSzzzzzzzzzzzzzzzzzzZU8MFW';
    const KINDS = ['story', 'attestation', 'explanation', 'description'];
    const CID = /^bafkrei[a-z2-7]{52}$/;

    function reference(item) {
        return { cid: item.cid, fragment: item.fragment || '' };
    }

    function sameReference(a, b) {
        return !!a && !!b && a.cid === b.cid && (a.fragment || '') === (b.fragment || '');
    }

    function validate(record) {
        if (!record || record.schema !== 'commons/contribution/1' || !KINDS.includes(record.kind)) throw new Error('Unsupported contribution record.');
        for (const [key, max] of [['title', 160], ['text', 10000], ['author', 160]]) {
            if (typeof record[key] !== 'string' || record[key].length > max || (key !== 'author' && !record[key].trim())) throw new Error('Enter a title and contribution within the displayed limits.');
        }
        if (!record.parent || !CID.test(record.parent.cid) || typeof record.parent.fragment !== 'string' || !/^[a-zA-Z0-9_-]{0,100}$/.test(record.parent.fragment)) throw new Error('The parent reference is invalid.');
        if (typeof record.indexed !== 'boolean' || !Number.isFinite(Date.parse(record.created))) throw new Error('Invalid contribution date or index selection.');
        if (record.indexed && record.transport !== INDEX || !record.indexed && record.transport !== null) throw new Error('The Commons transport tag does not match the index selection.');
        if (typeof record.source !== 'string' || record.source.length > 2000) throw new Error('Use a source reference up to 2000 characters.');
        if (record.source) {
            const url = new URL(record.source);
            if (!['https:', 'ipfs:'].includes(url.protocol) || !url.hostname) throw new Error('Use an https:// or ipfs:// source reference.');
        }
        return record;
    }

    async function create(parent, fields) {
        const record = validate({
            schema: 'commons/contribution/1', kind: fields.kind,
            title: fields.title.trim(), text: fields.text.trim(), author: fields.author.trim(),
            parent: reference(parent), indexed: !!fields.indexed,
            transport: fields.indexed ? INDEX : null, source: fields.source.trim(),
            created: fields.created || new Date().toISOString()
        });
        const text = JSON.stringify(record, null, 2) + '\n';
        return { cid: await CommonsCID.cid(CommonsCID.bytes(text)), record };
    }

    function bytes(entry) {
        return CommonsCID.bytes(JSON.stringify(entry.record, null, 2) + '\n');
    }

    async function verify(entry) {
        if (!entry || !CID.test(entry.cid)) throw new Error('Invalid contribution CID.');
        validate(entry.record);
        if (await CommonsCID.cid(bytes(entry)) !== entry.cid) throw new Error('Contribution bytes do not match their CID.');
        return entry;
    }

    async function load(storage = localStorage) {
        const entries = JSON.parse(storage.getItem(KEY) || '[]');
        if (!Array.isArray(entries)) throw new Error('The saved contribution list is invalid.');
        for (const entry of entries) await verify(entry);
        return entries;
    }

    async function save(entry, storage = localStorage) {
        await verify(entry);
        const entries = await load(storage);
        if (!entries.some(item => item.cid === entry.cid)) entries.unshift(entry);
        storage.setItem(KEY, JSON.stringify(entries));
        return entries;
    }

    function item(entry) {
        return {
            id: entry.cid, cid: entry.cid, fragment: '', kind: entry.record.kind,
            title: entry.record.title, summary: entry.record.text.slice(0, 220),
            text: entry.record.text, author: entry.record.author || 'Unstated author',
            indexed: entry.record.indexed, status: 'Local unsigned draft',
            parent: entry.record.parent, source: entry.record.source, related: [], local: true
        };
    }

    function visible(items, kind = '', query = '') {
        const needle = query.trim().toLowerCase();
        return items.filter(entry => entry.indexed && (!kind || entry.kind === kind)
            && [entry.title, entry.summary, entry.author].join(' ').toLowerCase().includes(needle));
    }

    return { KEY, INDEX, KINDS, reference, sameReference, validate, create, bytes, verify, load, save, item, visible };
})();
