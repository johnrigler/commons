(async () => {
    'use strict';
    const $ = selector => document.querySelector(selector);
    const data = JSON.parse($('#portal-data').textContent);
    const siteBase = CommonsURLs.base(location.href);
    for (const anchor of document.querySelectorAll('a[href]')) {
        const href = anchor.getAttribute('href');
        if (href && !href.startsWith('#')) anchor.href = new URL(href, siteBase).href;
    }
    let drafts = [], selected = null, kind = '', topic = '', view = 'article';
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
    const isCompany = item => CommonsPortal.recordClass(item) === 'company';
    const entryLabel = item => item.genre === 'opinion' ? 'Opinion' : item.kind;
    const closeReader = () => {
        const hash = view === 'company' ? 'view=companies' : '';
        if (/\/entry\/[^/]+\.html$/.test(location.pathname) || new URLSearchParams(location.search).has('item')) {
            const url = new URL(siteBase); url.hash = hash;
            history.pushState(null, '', url); route();
        } else location.hash = hash;
    };

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
        p.textContent = (isCompany(item) ? 'Company profile · ' + item.role : entryLabel(item) + ' · ' + item.author) + (item.local ? ' · ' + item.status : '');
        return p;
    }

    function card(item) {
        const article = document.createElement('article'); article.className = 'portal-card' + (isCompany(item) ? ' company-card' : '');
        const heading = document.createElement('h2');
        heading.append(link(item.title, '#item=' + encodeURIComponent(item.id)));
        const p = document.createElement('p'); p.textContent = item.summary;
        const bottom = document.createElement('div'); bottom.className = 'card-bottom';
        bottom.append(link('Open →', '#item=' + encodeURIComponent(item.id)));
        const count = document.createElement('span');
        count.textContent = item.parent ? 'Response' : (item.related?.length || 0) + (isCompany(item) ? ' related articles' : ' connections');
        const subjects = document.createElement('div'); subjects.className = 'card-subjects';
        for (const subject of item.topics || []) {
            const label = document.createElement('span'); label.textContent = subject; subjects.append(label);
        }
        bottom.append(count); article.append(meta(item), heading, p, subjects, bottom);
        return article;
    }

    function renderTopics() {
        const container = $('#portal-topics');
        if (container.dataset.view !== view) {
            container.replaceChildren(); container.dataset.view = view;
            for (const subject of ['', ...new Set(data.items.filter(item => CommonsPortal.recordClass(item) === view).flatMap(item => item.topics || []))]) {
                const button = document.createElement('button'); button.type = 'button'; button.dataset.topic = subject;
                button.textContent = subject || 'All subjects';
                button.onclick = () => { topic = subject; renderFeed(); };
                container.append(button);
            }
        }
        for (const button of container.children) button.setAttribute('aria-pressed', String(button.dataset.topic === topic));
    }

    function renderFeed() {
        const items = CommonsPortal.visible(all(), kind, $('#portal-search').value, view).filter(item => !topic || item.topics?.includes(topic));
        $('#portal-cards').replaceChildren(...items.map(card));
        $('#portal-count').textContent = items.length + (view === 'company' ? (items.length === 1 ? ' company profile' : ' company profiles') : (items.length === 1 ? ' entry' : ' entries'));
        $('#entry-types').hidden = view === 'company';
        $('#view-title').textContent = view === 'company' ? 'Company profiles' : 'Articles';
        $('#view-description').textContent = view === 'company'
            ? 'Legal identities, business roles, official records, and connections to the broader arguments. Each company can be referenced separately.'
            : 'Reusable arguments, attributed opinions, explanations, stories, and contributions across subjects.';
        $('#portal-search').placeholder = view === 'company' ? 'Experian, NCS, debt buyer…' : 'Disability, New Mexico, Grapevine…';
        for (const button of document.querySelectorAll('[data-view]')) button.setAttribute('aria-pressed', String((button.dataset.view === 'companies') === (view === 'company')));
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

    function downloadCompanyReference() {
        if (!selected || !isCompany(selected)) return;
        const text = JSON.stringify(CommonsPortal.companyReference(selected), null, 2) + '\n';
        const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
        const a = link('Download', url); a.download = selected.id + '-reference.json'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    async function copyEntryURL() {
        if (!selected) return;
        const url = CommonsURLs.entryURL(selected, location.href);
        try {
            try {
                if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable.');
                await navigator.clipboard.writeText(url);
            } catch {
                const field = document.createElement('textarea'); field.value = url;
                field.style.cssText = 'position:fixed;opacity:0;width:1px;height:1px';
                dialog.append(field); field.select();
                try { if (!document.execCommand('copy')) throw new Error('Copy unavailable.'); }
                finally { field.remove(); $('#copy-entry-url').focus(); }
            }
            message('Link copied.');
        } catch { message('Select and copy the full URL shown above.', true); }
    }

    function show(item) {
        selected = item;
        document.title = item ? item.title + ' — Commons' : 'Commons — Portal';
        $('#portal-detail').hidden = !item;
        $('#contribution-form').reset();
        if (!item) {
            if (dialog.open) dialog.close();
            document.body.classList.remove('reader-open');
            return;
        }
        $('#detail-title').textContent = item.title;
        $('#detail-meta').textContent = (isCompany(item) ? 'Company profile · ' + item.role : entryLabel(item)) + ' · ' + item.status + ' · ' + item.author;
        $('#reader-print').textContent = isCompany(item) ? 'Print profile' : 'Print article';
        $('#detail-text').textContent = item.text || item.summary;
        $('#detail-cid').textContent = item.cid + (item.fragment ? '#' + item.fragment : '');
        $('#detail-links').replaceChildren();
        $('#entry-url').href = CommonsURLs.entryURL(item, location.href);
        $('#entry-url').textContent = $('#entry-url').href;
        if (item.path) $('#detail-links').append(link('Open original document ↗', CommonsURLs.documentURL(item.path, location.href) + (item.fragment ? '#' + item.fragment : '')));
        if (item.pdf) $('#detail-links').append(link('PDF for printing or email', CommonsURLs.documentURL(item.pdf, location.href)));
        if (item.source) $('#detail-links').append(link('Source reference', CommonsURLs.documentURL(item.source, location.href)));
        if (item.local) {
            const save = document.createElement('button'); save.type = 'button'; save.textContent = 'Download contribution';
            save.onclick = () => download(item);
            $('#detail-links').append(save, link('Publish / announce', new URL('publish.html#contribution=' + item.id, siteBase).href));
        }
        $('#company-reference').hidden = !isCompany(item);
        $('#company-reference-json').textContent = isCompany(item) ? JSON.stringify(CommonsPortal.companyReference(item), null, 2) : '';
        const companies = (item.companies || []).map(find).filter(entry => entry && isCompany(entry));
        $('#company-items').replaceChildren(...companies.map(card));
        $('#companies-section').hidden = !companies.length;
        $('#companies-title').textContent = isCompany(item) ? 'Related companies' : 'Company profiles';
        $('#companies-description').textContent = isCompany(item) ? 'Keep each legal entity and its role identifiable.' : 'Organizational background connected to this subject.';
        const related = (item.related || []).map(find).filter(Boolean);
        const parent = item.parent && all().find(candidate => CommonsPortal.sameReference(CommonsPortal.reference(candidate), item.parent));
        if (parent && !related.includes(parent)) related.unshift(parent);
        $('#related-items').replaceChildren(...related.map(card));
        $('#related-section').hidden = !related.length;
        $('#related-title').textContent = isCompany(item) ? 'Related articles' : 'Connected material';
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
        const id = CommonsURLs.entryId(location.href);
        const item = id && find(id);
        const nextView = item ? CommonsPortal.recordClass(item) : (hash.get('view') || new URLSearchParams(location.search).get('view')) === 'companies' ? 'company' : 'article';
        if (nextView !== view) {
            view = nextView; kind = ''; topic = ''; $('#portal-search').value = '';
        }
        renderFeed();
        show(item || null);
        if (id && !item) message('That entry is not in this collection or your saved contributions.', true);
        else if (!storageError) message('');
    }

    $('#portal-search').addEventListener('input', renderFeed);
    $('#reader-close').onclick = closeReader;
    $('#reader-print').onclick = () => window.print();
    $('#copy-entry-url').onclick = copyEntryURL;
    $('#download-company-reference').onclick = downloadCompanyReference;
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeReader(); });
    dialog.addEventListener('close', () => {
        if (dialog.open) return;
        document.body.classList.remove('reader-open');
        if (selected && CommonsURLs.entryId(location.href)) closeReader();
    });
    dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeReader();
    });
    $('#reader-content').addEventListener('click', event => {
        const anchor = event.target.closest('a[data-reader-anchor]');
        if (!anchor) return;
        event.preventDefault();
        document.getElementById(anchor.dataset.readerAnchor)?.scrollIntoView({ block: 'start' });
    });
    for (const button of document.querySelectorAll('[data-kind]')) button.onclick = () => { kind = button.dataset.kind; renderFeed(); };
    for (const button of document.querySelectorAll('[data-view]')) button.onclick = () => { location.hash = button.dataset.view === 'companies' ? 'view=companies' : ''; };
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
    window.addEventListener('popstate', route);
    renderFeed(); route();
    if (storageError) message(storageError, true);
})().catch(error => {
    const status = document.querySelector('#portal-status');
    if (status) { status.hidden = false; status.textContent = 'The portal could not load: ' + error.message; status.setAttribute('data-error', ''); }
});
