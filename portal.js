(async () => {
    'use strict';
    const $ = selector => document.querySelector(selector);
    const data = JSON.parse($('#portal-data').textContent);
    let drafts = [], selected = null, kind = '';
    let storageError = '';
    try { drafts = await CommonsPortal.load(); }
    catch { storageError = 'Saved contributions could not be read or verified. You can still browse this collection.'; }
    const all = () => [...drafts.map(CommonsPortal.item), ...data.items];
    const find = id => all().find(item => item.id === id);

    function message(text, error = false) {
        $('#portal-status').textContent = text;
        $('#portal-status').hidden = !text;
        $('#portal-status').toggleAttribute('data-error', error);
    }

    function link(text, href, className = '') {
        const a = document.createElement('a');
        a.textContent = text; a.href = href; a.className = className;
        return a;
    }

    function meta(item) {
        const p = document.createElement('p'); p.className = 'item-meta';
        p.textContent = item.kind + ' · ' + item.status;
        return p;
    }

    function card(item) {
        const article = document.createElement('article'); article.className = 'portal-card';
        const heading = document.createElement('h2');
        heading.append(link(item.title, '#item=' + encodeURIComponent(item.id)));
        const p = document.createElement('p'); p.textContent = item.summary;
        const bottom = document.createElement('div'); bottom.className = 'card-bottom';
        bottom.append(link('Open →', '#item=' + encodeURIComponent(item.id)));
        const count = document.createElement('span');
        count.textContent = item.parent ? 'Response' : (item.related?.length || 0) + ' connections';
        bottom.append(count); article.append(meta(item), heading, p, bottom);
        return article;
    }

    function renderFeed() {
        const items = CommonsPortal.visible(all(), kind, $('#portal-search').value);
        $('#portal-cards').replaceChildren(...items.map(card));
        $('#portal-count').textContent = items.length + (items.length === 1 ? ' entry' : ' entries');
        $('#portal-empty').hidden = !!items.length;
        $('#portal-empty').textContent = kind === 'attestation'
            ? 'No attestations in this collection yet. Open a document to add one.'
            : 'No matching entries. Try another term or type.';
        for (const button of document.querySelectorAll('[data-kind]')) button.setAttribute('aria-pressed', String(button.dataset.kind === kind));
    }

    async function checkDocument(item) {
        $('#document-check').textContent = '';
        if (!item.path) return;
        if (!/^https?:$/.test(location.protocol)) {
            $('#document-check').textContent = 'Open the document to read this edition; serve the portal on localhost or HTTPS to check its bytes.';
            return;
        }
        $('#document-check').textContent = 'Checking document bytes…';
        try {
            const response = await fetch(item.path, { credentials: 'omit', cache: 'no-store' });
            if (!response.ok) throw new Error('Document unavailable.');
            const bytes = new Uint8Array(await response.arrayBuffer());
            if (await CommonsCID.cid(bytes) !== item.cid) throw new Error('Document bytes differ from this edition reference.');
            if (selected?.id === item.id) $('#document-check').textContent = 'Document bytes match this edition CID.';
        } catch (error) {
            if (selected?.id === item.id) $('#document-check').textContent = error.message;
        }
    }

    function download(item) {
        const entry = drafts.find(entry => entry.cid === item.id);
        if (!entry) return;
        const url = URL.createObjectURL(new Blob([CommonsPortal.bytes(entry)], { type: 'application/json' }));
        const a = link('Download', url); a.download = entry.cid + '.json'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function show(item) {
        selected = item;
        $('#portal-feed').hidden = !!item; $('#portal-detail').hidden = !item;
        $('#contribution-form').reset();
        if (!item) return;
        $('#detail-title').textContent = item.title;
        $('#detail-meta').textContent = item.kind + ' · ' + item.status + ' · ' + item.author;
        $('#detail-text').textContent = item.text || item.summary;
        $('#detail-cid').textContent = item.cid + (item.fragment ? '#' + item.fragment : '');
        $('#detail-links').replaceChildren();
        if (item.path) $('#detail-links').append(link('Read document ↗', item.path + (item.fragment ? '#' + item.fragment : ''), 'primary-link'));
        if (item.pdf) $('#detail-links').append(link('PDF for printing or email', item.pdf));
        if (item.source) $('#detail-links').append(link('Source reference', item.source));
        if (item.local) {
            const save = document.createElement('button'); save.type = 'button'; save.textContent = 'Download contribution';
            save.onclick = () => download(item);
            $('#detail-links').append(save, link('Publish / announce', 'publish.html#contribution=' + item.id));
        }
        const related = (item.related || []).map(find).filter(Boolean);
        const parent = item.parent && all().find(candidate => CommonsPortal.sameReference(CommonsPortal.reference(candidate), item.parent));
        if (parent && !related.includes(parent)) related.unshift(parent);
        $('#related-items').replaceChildren(...related.map(card));
        $('#related-section').hidden = !related.length;
        const children = all().filter(child => child.parent && CommonsPortal.sameReference(child.parent, CommonsPortal.reference(item)));
        $('#response-items').replaceChildren(...children.map(card));
        $('#responses-empty').hidden = !!children.length;
        $('#contribution-parent').textContent = item.title;
        checkDocument(item);
    }

    function route() {
        const hash = new URLSearchParams(location.hash.slice(1));
        const id = hash.get('item');
        const item = id && find(id);
        show(item || null);
        if (id && !item) message('That entry is not in this collection or your saved contributions.', true);
        else if (!storageError) message('');
    }

    $('#portal-search').addEventListener('input', renderFeed);
    for (const button of document.querySelectorAll('[data-kind]')) button.onclick = () => { kind = button.dataset.kind; renderFeed(); };
    $('#add-below').onclick = () => { $('#contribution-form').scrollIntoView({ behavior: 'smooth' }); $('#contribution-title').focus(); };
    $('#contribution-form').addEventListener('submit', async event => {
        event.preventDefault();
        if (!selected) return;
        const button = $('#contribution-go'); button.disabled = true;
        try {
            const entry = await CommonsPortal.create(selected, {
                kind: $('#contribution-kind').value, title: $('#contribution-title').value,
                text: $('#contribution-text').value, author: $('#contribution-author').value,
                source: $('#contribution-source').value, indexed: $('#contribution-indexed').checked
            });
            drafts = await CommonsPortal.save(entry);
            renderFeed(); show(selected);
            message('Saved in this browser. Open your contribution to download it or prepare publication.');
            $('#response-items').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (error) { message(error.message || 'Could not save the contribution.', true); }
        finally { button.disabled = false; }
    });
    window.addEventListener('hashchange', route);
    renderFeed(); route();
    if (storageError) message(storageError, true);
})().catch(error => {
    const status = document.querySelector('#portal-status');
    if (status) { status.hidden = false; status.textContent = 'The portal could not load: ' + error.message; status.setAttribute('data-error', ''); }
});
