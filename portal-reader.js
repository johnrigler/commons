/* Read an exact bundled edition without running its scripts or styles. */
globalThis.CommonsReader = (() => {
    const cache = new Map();
    const allowed = new Set('ARTICLE SECTION HEADER DIV SPAN P H1 H2 H3 H4 H5 H6 A STRONG B EM I SMALL CODE PRE BLOCKQUOTE UL OL LI TABLE THEAD TBODY TFOOT TR TH TD BR HR SUP SUB DL DT DD TIME DETAILS SUMMARY'.split(' '));
    const blocked = new Set('SCRIPT STYLE LINK BASE IFRAME OBJECT EMBED SVG MATH TEMPLATE FORM INPUT BUTTON SELECT TEXTAREA FOOTER'.split(' '));

    async function edition(item, bundled) {
        if (!cache.has(item.cid)) {
            cache.set(item.cid, (async () => {
                let bytes;
                if (bundled[item.cid]) bytes = Uint8Array.from(atob(bundled[item.cid]), c => c.charCodeAt(0));
                else {
                    const response = await fetch(CommonsURLs.documentURL(item.path, location.href), { credentials: 'omit', cache: 'no-store' });
                    if (!response.ok) throw new Error('The original document is unavailable.');
                    bytes = new Uint8Array(await response.arrayBuffer());
                }
                if (await CommonsCID.cid(bytes) !== item.cid) throw new Error('The document differs from its edition reference.');
                const template = document.createElement('template');
                template.innerHTML = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
                return template.content;
            })().catch(error => { cache.delete(item.cid); throw error; }));
        }
        return cache.get(item.cid);
    }

    async function read(item, bundled, catalog) {
        const source = await edition(item, bundled);
        const article = source.getElementById(item.fragment);
        if (!article) throw new Error('This article is missing from its edition.');
        const prefix = 'reader-' + item.cid.slice(-10) + '-';
        const root = document.createElement('div');
        const present = new Set();
        const cited = new Set();
        const base = new URL(CommonsURLs.documentURL(item.path, location.href));

        function clean(node) {
            if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
            if (node.nodeType !== Node.ELEMENT_NODE || blocked.has(node.tagName)) return null;
            if (node.matches('.masthead,.reading-links,.return-link') || node.tagName === 'H1') return null;
            const copy = allowed.has(node.tagName) ? document.createElement(node.tagName.toLowerCase()) : document.createDocumentFragment();
            if (copy.nodeType === Node.ELEMENT_NODE) {
                if (node.id) { copy.id = prefix + node.id; present.add(node.id); }
                if (node.className) copy.className = node.className;
                for (const key of ['scope', 'colspan', 'rowspan', 'value', 'datetime', 'title']) {
                    if (node.hasAttribute(key)) copy.setAttribute(key, node.getAttribute(key));
                }
                if (node.tagName === 'A') {
                    const href = node.getAttribute('href') || '';
                    try {
                        const url = new URL(href, base);
                        if (href.startsWith('#')) {
                            const id = decodeURIComponent(url.hash.slice(1));
                            const connected = catalog.find(entry => entry.cid === item.cid && entry.fragment === id);
                            if (connected) copy.href = '#item=' + encodeURIComponent(connected.id);
                            else {
                                copy.href = '#'; copy.dataset.readerAnchor = prefix + id;
                                if (source.getElementById(id)?.tagName === 'LI') cited.add(id);
                            }
                        } else {
                            const connected = CommonsURLs.entryId(url.href);
                            if (CommonsURLs.base(url.href).href === CommonsURLs.base(location.href).href && catalog.some(entry => entry.id === connected)) copy.href = '#item=' + encodeURIComponent(connected);
                            else if (['https:', 'http:', 'ipfs:'].includes(url.protocol) || (!/^[a-z][a-z0-9+.-]*:/i.test(href) && url.protocol === 'file:')) {
                                copy.href = url.href; copy.target = '_blank'; copy.rel = 'noopener noreferrer';
                            }
                        }
                    } catch { /* Keep an invalid reference as plain, inert text. */ }
                }
            }
            for (const child of node.childNodes) { const safe = clean(child); if (safe) copy.append(safe); }
            return copy;
        }

        root.append(clean(article));
        const references = [...cited].filter(id => !present.has(id));
        if (references.length) {
            const section = document.createElement('section'); section.className = 'reader-sources';
            const heading = document.createElement('h2'); heading.textContent = 'Sources cited in this article';
            const list = document.createElement('ol');
            for (const id of references) {
                const original = source.getElementById(id);
                const safe = clean(original);
                if (original.parentElement?.tagName === 'OL') safe.value = [...original.parentElement.children].indexOf(original) + 1;
                list.append(safe);
            }
            section.append(heading, list); root.append(section);
        }
        for (const anchor of root.querySelectorAll('[data-reader-anchor]')) {
            const target = anchor.dataset.readerAnchor;
            if (![...root.querySelectorAll('[id]')].some(node => node.id === target)) {
                anchor.href = base.href + '#' + target.slice(prefix.length);
                anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
                delete anchor.dataset.readerAnchor;
            }
        }
        return root;
    }

    return { read };
})();
