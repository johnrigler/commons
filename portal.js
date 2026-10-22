(async () => {
    'use strict';
    const $ = selector => document.querySelector(selector);
    const data = JSON.parse($('#portal-data').textContent);
    let drafts = [], selected = null, kind = '', topic = '';
    const dialog = $('#portal-reader');
    let storageError = '';
    try { drafts = await CommonsPortal.load(); }
    catch { storageError = 'Saved contributions could not be read or verified. You can still browse this collection.'; }
    const all = () => {
        const items = [...drafts.map(CommonsPortal.item), ...data.items];
        for (const item of items.filter(item => item.local)) {
            let parent = item;
            const seen = new Set();
            while (parent && !seen.has(parent.id)) {
                seen.add(parent.id);
                if (parent.topics?.length) { item.topics = parent.topics; break; }
                parent = parent.parent && items.find(candidate => CommonsPortal.sameReference(CommonsPortal.reference(candidate), parent.parent));
            }
        }
        return items;
    };
    const find = id => all().find(item => item.id === id);

    function message(text, error = false) {
        for (const status of [$('#portal-status'), $('#reader-message')]) {
            status.textContent = text;
            status.hidden = !text;
            status.toggleAttribute('data-error', error);
        }
    }

    function link(text, href, className = '') {
        const a = document.createElement('a');
        a.textContent = text; a.href = href; a.className = className;
        return a;
    }

    function meta(item) {
        const p = document.createElement('p'); p.className = 'item-meta';
        p.textContent = item.kind + ' · ' + item.author + (item.local ? ' · ' + item.status : '');
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
        const subjects = document.createElement('div'); subjects.className = 'card-subjects';
        for (const subject of item.topics || []) {
            const label = document.createElement('span'); label.textContent = subject; subjects.append(label);
        }
        bottom.append(count); article.append(meta(item), heading, p, subjects, bottom);
        return article;
    }

    function renderTopics() {
        const container = $('#portal-topics');
        if (!container.children.length) {
            for (const subject of ['', ...new Set(data.items.flatMap(item => item.topics || []))]) {
                const button = document.createElement('button'); button.type = 'button'; button.dataset.topic = subject;
                button.textContent = subject || 'All subjects';
                button.onclick = () => { topic = subject; renderFeed(); };
                container.append(button);
            }
        }
        for (const button of container.children) button.setAttribute('aria-pressed', String(button.dataset.topic === topic));
    }

    function renderFeed() {
        const items = CommonsPortal.visible(all(), kind, $('#portal-search').value).filter(item => !topic || item.topics?.includes(topic));
        $('#portal-cards').replaceChildren(...items.map(card));
        $('#portal-count').textContent = items.length + (items.length === 1 ? ' entry' : ' entries');
        $('#portal-empty').hidden = !!items.length;
        $('#portal-empty').textContent = kind === 'attestation'
            ? 'No attestations in this collection yet. Open a document to add one.'
            : 'No matching entries. Try another term or type.';
        for (const button of document.querySelectorAll('[data-kind]')) button.setAttribute('aria-pressed', String(button.dataset.kind === kind));
        renderTopics();
    }

    async function readArticle(item) {
        $('#document-check').textContent = '';
        $('#reader-content').replaceChildren(); $('#reader-content').hidden = true;
        $('#detail-text').hidden = false;
        $('#reader-loading').hidden = !item.path;
        if (!item.path) return;
        $('#document-check').textContent = 'Checking document bytes…';
        try {
            const article = await CommonsReader.read(item, data.documents || {}, data.items);
            if (selected?.id !== item.id) return;
            $('#reader-content').replaceChildren(article); $('#reader-content').hidden = false;
            $('#detail-text').hidden = true;
            $('#document-check').textContent = 'Document bytes match this edition CID.';
        } catch (error) {
            if (selected?.id === item.id) {
                $('#document-check').textContent = error.message;
                $('#reader-loading').textContent = 'The article could not open here. Use the original document link below.';
                $('#reader-loading').hidden = false;
                return;
            }
        }
        if (selected?.id === item.id) $('#reader-loading').hidden = true;
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
        $('#portal-detail').hidden = !item;
        $('#contribution-form').reset();
        if (!item) {
            if (dialog.open) dialog.close();
            document.body.classList.remove('reader-open');
            return;
        }
        $('#detail-title').textContent = item.title;
        $('#detail-meta').textContent = item.kind + ' · ' + item.status + ' · ' + item.author;
        $('#detail-text').textContent = item.text || item.summary;
        $('#detail-cid').textContent = item.cid + (item.fragment ? '#' + item.fragment : '');
        $('#detail-links').replaceChildren();
        if (item.path) $('#detail-links').append(link('Open original document ↗', item.path + (item.fragment ? '#' + item.fragment : '')));
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
        document.body.classList.add('reader-open');
        if (!dialog.open) dialog.showModal();
        dialog.scrollTop = 0;
        $('#reader-loading').textContent = 'Opening article…';
        readArticle(item);
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
    $('#reader-close').onclick = () => { location.hash = ''; };
    $('#reader-print').onclick = () => window.print();
    dialog.addEventListener('close', () => {
        document.body.classList.remove('reader-open');
        if (new URLSearchParams(location.hash.slice(1)).has('item')) location.hash = '';
    });
    dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) location.hash = '';
    });
    $('#reader-content').addEventListener('click', event => {
        const anchor = event.target.closest('a[data-reader-anchor]');
        if (!anchor) return;
        event.preventDefault();
        document.getElementById(anchor.dataset.readerAnchor)?.scrollIntoView({ block: 'start' });
    });
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
