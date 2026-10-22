(async () => {
    'use strict';
    const $ = selector => document.querySelector(selector);
    const catalog = JSON.parse($('#commons-data').textContent);
    const records = catalog.statements.map(record => ({ ...record, selected: true, valid: false, pin: 'Not checked' }));
    let token = '', busy = false, local = null, receipt = null, announcement = null, announcementVersion = 0;

    function status(message, error = false) {
        $('#status').textContent = message;
        $('#status').toggleAttribute('data-error', error);
    }

    function download(value, name, type = 'application/octet-stream') {
        const url = URL.createObjectURL(new Blob([value], { type }));
        const link = document.createElement('a');
        link.href = url; link.download = name; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function selected() { return records.filter(record => record.selected); }

    function edition() {
        if (!selected().length) throw new Error('Select at least one statement.');
        return {
            schema: 'commons/edition/1', profile: catalog.profile, repository: catalog.repository,
            statements: selected().map(({ cid, path, title, kind, status, author, jurisdictions, effective, sources }) =>
                ({ cid, path, title, kind, status, author, jurisdictions, effective, sources }))
        };
    }

    function editionBytes() { return CommonsCID.bytes(JSON.stringify(edition(), null, 2) + '\n'); }

    function controls() {
        const count = selected().length;
        $('#selection-count').textContent = count + ' selected';
        $('#download-edition').disabled = busy || !count;
        $('#pin-selected').disabled = busy || !token || !count;
        $('#check-pins').disabled = busy || !token || !count;
        $('#pin-page').disabled = busy || !token;
        $('#pin-file').disabled = busy || !token || !local || local.valid === false;
        $('#connect').disabled = busy || !!token;
        $('#disconnect').disabled = busy || !token;
        $('#pinata-token').disabled = busy || !!token;
        for (const element of document.querySelectorAll('#select-all, #clear-selection, #verify-all, .record > input')) element.disabled = busy;
    }

    async function operation(work) {
        if (busy) return;
        busy = true; controls();
        try { await work(); } catch (error) { status(error.message, true); }
        finally { busy = false; controls(); }
    }

    function badge(text, className = '') {
        const item = document.createElement('span');
        item.className = 'badge ' + className; item.textContent = text;
        return item;
    }

    function updateRecord(record) {
        record.badges.replaceChildren(
            badge(record.status || 'draft'),
            badge(record.valid ? 'CID match' : 'CID unchecked', record.valid ? 'good' : ''),
            badge(record.pin, record.pin === 'Pinned' ? 'good' : record.pin === 'Error' ? 'bad' : '')
        );
    }

    function render() {
        const container = $('#records');
        for (const record of records) {
            const row = document.createElement('article'); row.className = 'record';
            const check = document.createElement('input'); check.type = 'checkbox'; check.checked = record.selected;
            check.setAttribute('aria-label', 'Select ' + record.title);
            check.addEventListener('change', () => { record.selected = check.checked; controls(); });
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            const title = document.createElement('span'); title.className = 'record-title'; title.textContent = record.title;
            record.badges = document.createElement('span'); record.badges.className = 'badges';
            summary.append(title, record.badges);
            const meta = document.createElement('p'); meta.className = 'record-meta';
            meta.textContent = [record.kind, (record.jurisdictions || []).join(' / ') || 'General', record.effective || 'No date restriction'].join(' · ');
            const text = document.createElement('p'); text.className = 'statement-text'; text.textContent = record.text;
            const cid = document.createElement('p'); cid.className = 'cid'; cid.textContent = record.cid;
            const author = document.createElement('p'); author.className = 'fine-print'; author.textContent = record.author;
            const actions = document.createElement('div'); actions.className = 'record-actions';
            const save = document.createElement('button'); save.type = 'button'; save.textContent = 'Download statement';
            save.onclick = () => download(CommonsCID.bytes(record.text), record.cid + '.md', 'text/markdown;charset=utf-8');
            const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = 'Copy CID';
            copy.onclick = async () => {
                try { await navigator.clipboard.writeText(record.cid); status('CID copied.'); }
                catch { status('Clipboard unavailable. The full CID is displayed in the statement.', true); }
            };
            actions.append(save, copy);
            details.append(summary, meta, text, cid, author, actions);
            if (record.sources?.length) {
                const sources = document.createElement('p'); sources.className = 'source-list'; sources.append('Sources: ');
                for (const source of record.sources) {
                    const url = new URL(source);
                    if (url.protocol !== 'https:') continue;
                    const link = document.createElement('a'); link.href = url.href; link.textContent = url.hostname + url.pathname;
                    link.target = '_blank'; link.rel = 'noopener noreferrer'; sources.append(link, ' ');
                }
                details.append(sources);
            }
            row.append(check, details); container.append(row); record.element = row;
            updateRecord(record);
        }
        $('#statement-count').textContent = records.length + ' statements';
        controls();
    }

    async function verifyRecord(record) {
        const result = await CommonsCID.verify(CommonsCID.bytes(record.text), record.path);
        record.valid = result.valid && result.expected === record.cid;
        updateRecord(record);
        if (!record.valid) throw new Error('CID mismatch: ' + record.title + '.');
    }

    async function verifyEdition() {
        let failed = 0;
        for (const record of records) {
            try { await verifyRecord(record); } catch { failed++; }
        }
        status(failed ? failed + ' statement(s) failed verification.' : records.length + ' statement filenames match their bundled bytes. Pinata ' + (token ? 'connected.' : 'disconnected.'), !!failed);
    }

    $('#search').addEventListener('input', event => {
        const query = event.target.value.toLowerCase();
        let count = 0;
        for (const record of records) {
            record.element.hidden = ![record.title, record.text, record.kind, ...(record.jurisdictions || [])].join(' ').toLowerCase().includes(query);
            if (!record.element.hidden) count++;
        }
        $('#statement-count').textContent = count + ' of ' + records.length + ' statements';
    });
    $('#select-all').onclick = () => { for (const record of records) if (!record.element.hidden) { record.selected = true; record.element.firstChild.checked = true; } controls(); };
    $('#clear-selection').onclick = () => { for (const record of records) { record.selected = false; record.element.firstChild.checked = false; } controls(); };
    $('#verify-all').onclick = () => operation(verifyEdition);
    $('#download-edition').onclick = () => operation(async () => {
        for (const record of selected()) await verifyRecord(record);
        const bytes = editionBytes(); download(bytes, await CommonsCID.cid(bytes) + '.json', 'application/json');
        status('Selected edition manifest downloaded.');
    });

    $('#verify-file').onclick = () => operation(async () => {
        local = null; $('#download-file').hidden = true;
        const file = $('#local-file').files[0];
        if (!file) throw new Error('Choose a local file first.');
        if (file.size > CommonsCID.MAX_BYTES) throw new Error('This profile supports files up to 1 MiB.');
        const bytes = new Uint8Array(await file.arrayBuffer());
        const cid = await CommonsCID.cid(bytes);
        const explicit = $('#expected-cid').value.trim();
        const expected = explicit || CommonsCID.filenameCID(file.name);
        if (explicit && CommonsCID.filenameCID(explicit) !== explicit) throw new Error('Expected CID must use the Commons raw CIDv1 profile.');
        const valid = expected ? cid === expected : null;
        $('#file-result').textContent = (valid === true ? 'MATCH' : valid === false ? 'MISMATCH' : 'CID CALCULATED') + '\n' + cid + '\n' + bytes.length + ' bytes' + (expected ? '\nExpected: ' + expected : '\nThe original filename contains no supported CID.');
        const suffix = file.name.match(/\.[a-z0-9]{1,10}$/i)?.[0] || '';
        local = { bytes, cid, suffix, valid, type: file.type || 'application/octet-stream' };
        $('#download-file').hidden = false;
        status(valid === false ? 'The file differs from the expected CID.' : 'Local file processed; no upload was made.', valid === false);
    });
    for (const element of [$('#local-file'), $('#expected-cid')]) element.addEventListener('input', () => { local = null; $('#file-result').textContent = ''; $('#download-file').hidden = true; controls(); });
    $('#download-file').onclick = () => { if (local) download(local.bytes, local.cid + local.suffix, local.type); };
    $('#pin-file').onclick = () => operation(async () => {
        if (!local || local.valid === false) throw new Error('Calculate a matching local file CID first.');
        status('Pinning the local file to public IPFS…');
        const result = await CommonsPinata.pin(token, local.bytes, local.cid, local.cid + local.suffix);
        receipt = { schema: 'commons/pin-receipt/1', checkedAt: new Date().toISOString(), complete: true, files: [result], manifest: null };
        $('#download-receipt').hidden = false; status('Local file stored in Pinata: ' + result.cid);
    });

    $('#pinata-form').addEventListener('submit', event => {
        event.preventDefault();
        operation(async () => {
            const candidate = $('#pinata-token').value.trim(); $('#pinata-token').value = '';
            if (!candidate) throw new Error('Enter a Pinata JWT.');
            status('Checking the Pinata connection…');
            await CommonsPinata.list(candidate);
            token = candidate; $('#connection-state').textContent = 'Connected'; $('#connection-state').className = 'badge good';
            status('Pinata connected. Select statements, then pin the edition.');
        });
    });
    $('#disconnect').onclick = () => {
        token = ''; $('#pinata-token').value = ''; $('#connection-state').textContent = 'Disconnected'; $('#connection-state').className = 'badge';
        for (const record of records) { record.pin = 'Not checked'; updateRecord(record); }
        status('Pinata token cleared from this session.'); controls();
    };
    $('#check-pins').onclick = () => operation(async () => {
        for (const record of selected()) {
            const files = await CommonsPinata.list(token, record.cid);
            record.pin = files.some(file => file.cid === record.cid) ? 'Pinned' : 'Not in account'; updateRecord(record);
        }
        status('Selected pin statuses checked against the connected account.');
    });
    $('#pin-page').onclick = () => operation(async () => {
        if (!/^https?:$/.test(location.protocol)) throw new Error('Serve this page over HTTP/HTTPS, or choose the HTML snapshot under Verify a file.');
        status('Reading the published HTML bytes…');
        const url = new URL(location.href); url.hash = '';
        const response = await fetch(url.href, { cache: 'no-store', credentials: 'omit' });
        if (!response.ok) throw new Error('Could not read the published page.');
        const bytes = new Uint8Array(await response.arrayBuffer()), cid = await CommonsCID.cid(bytes);
        const expected = CommonsCID.filenameCID(url.pathname);
        if (expected && expected !== cid) throw new Error('The page bytes do not match its CID filename.');
        const result = await CommonsPinata.pin(token, bytes, cid, cid + '.html');
        receipt = { schema: 'commons/pin-receipt/1', checkedAt: new Date().toISOString(), complete: true, files: [result], manifest: null };
        $('#download-receipt').hidden = false; status('Self-contained page stored in Pinata: ' + result.cid);
    });
    $('#pin-selected').onclick = () => operation(async () => {
        const chosen = selected();
        receipt = { schema: 'commons/pin-receipt/1', checkedAt: new Date().toISOString(), complete: false, files: [], manifest: null };
        $('#download-receipt').hidden = false;
        for (const record of chosen) {
            try {
                status('Verifying and pinning ' + record.title + '…');
                await verifyRecord(record);
                const result = await CommonsPinata.pin(token, CommonsCID.bytes(record.text), record.cid, record.cid + '.md');
                receipt.files.push(result); record.pin = 'Pinned'; updateRecord(record);
            } catch (error) {
                record.pin = 'Error'; updateRecord(record); throw error;
            }
        }
        const bytes = editionBytes(), cid = await CommonsCID.cid(bytes);
        status('Pinning the edition manifest…');
        receipt.manifest = await CommonsPinata.pin(token, bytes, cid, cid + '.json');
        receipt.complete = true;
        status(chosen.length + ' statements and the edition manifest are in Pinata. Edition: ' + cid);
    });
    $('#download-receipt').onclick = () => { if (receipt) download(JSON.stringify(receipt, null, 2) + '\n', 'commons-pin-receipt.json', 'application/json'); };

    function invalidateAnnouncement() {
        announcementVersion++; announcement = null; $('#download-announcement').disabled = true; $('#announcement-result').hidden = true;
        const size = CommonsCID.bytes($('#announcement-body').value).length;
        $('#message-bytes').textContent = size + ' / 80 bytes';
    }
    $('#announcement-form').addEventListener('input', invalidateAnnouncement);
    $('#use-edition').onclick = () => operation(async () => {
        for (const record of selected()) await verifyRecord(record);
        const cid = await CommonsCID.cid(editionBytes());
        $('#announcement-body').value = 'ipfs://' + cid; invalidateAnnouncement();
        status('Edition CID placed in the announcement body. Pin the edition to make that reference available through IPFS.');
    });
    $('#announcement-form').addEventListener('submit', event => {
        event.preventDefault();
        operation(async () => {
            invalidateAnnouncement(); const version = announcementVersion;
            const result = await CommonsThunderwords.draft({
                name: $('#tag-name').value, transport: $('#tag-transport').value, subject: $('#tag-subject').value,
                prefixes: { name: $('#prefix-name').value, transport: $('#prefix-transport').value, subject: $('#prefix-subject').value },
                message: $('#announcement-body').value, includeCommons: $('#commons-index').checked
            });
            if (version !== announcementVersion) throw new Error('The announcement changed while preparing it. Prepare it again.');
            announcement = result;
            const table = $('#announcement-outputs'); table.replaceChildren();
            for (const output of result.outputs) {
                const row = document.createElement('tr'), role = document.createElement('td'), address = document.createElement('td');
                role.textContent = output.role; address.textContent = output.address || output.scriptPubKey;
                row.append(role, address); table.append(row);
            }
            $('#announcement-result').hidden = false; $('#download-announcement').disabled = false;
            status('Litecoin Thunderwords and OP_RETURN prepared. Output amounts and transaction signing remain in Chisel.');
        });
    });
    $('#download-announcement').onclick = () => { if (announcement) download(JSON.stringify(announcement, null, 2) + '\n', 'commons-litecoin-announcement.json', 'application/json'); };

    window.addEventListener('pagehide', () => { token = ''; $('#pinata-token').value = ''; });
    render(); invalidateAnnouncement();
    await operation(verifyEdition);
    // A portal draft remains local until the operator explicitly pins or announces it.
    const contribution = new URLSearchParams(location.hash.slice(1)).get('contribution');
    if (contribution) await operation(async () => {
        const entry = (await CommonsPortal.load()).find(entry => entry.cid === contribution);
        if (!entry) throw new Error('This contribution is not saved in this browser. Choose its downloaded file under Verify a file.');
        const bytes = CommonsPortal.bytes(entry);
        local = { bytes, cid: entry.cid, suffix: '.json', valid: true, type: 'application/json' };
        $('#file-result').textContent = 'LOCAL CONTRIBUTION / CID MATCH\n' + entry.cid + '\n' + bytes.length + ' bytes';
        $('#download-file').hidden = false;
        $('#tag-name').value = entry.record.author || 'Unstated author';
        $('#tag-transport').value = entry.record.indexed ? 'Commons' : 'IPFS';
        $('#tag-subject').value = entry.record.kind;
        $('#commons-index').checked = entry.record.indexed;
        $('#announcement-body').value = 'ipfs://' + entry.cid;
        invalidateAnnouncement();
        status('Contribution loaded. Connect Pinata to pin its bytes, then prepare the announcement for Chisel. Nothing has been published yet.');
        $('#verify').scrollIntoView();
    });
})().catch(() => {
    const output = document.querySelector('#status');
    if (output) { output.textContent = 'This edition could not be loaded. Check the source catalog and rebuild.'; output.setAttribute('data-error', ''); }
});
