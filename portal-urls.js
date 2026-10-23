/* Resolve entry links relative to the current Pages, IPFS, or local copy. */
globalThis.CommonsURLs = (() => {
    const entryPath = /\/entry\/([^/]+)\.html$/;

    function base(href) {
        const url = new URL(href);
        return new URL(entryPath.test(url.pathname) ? '../' : './', url);
    }

    function entryId(href) {
        const url = new URL(href);
        const hash = new URLSearchParams(url.hash.slice(1));
        if (hash.has('item')) return hash.get('item');
        if (hash.has('view')) return null;
        if (url.searchParams.has('item')) return url.searchParams.get('item');
        if (url.searchParams.has('view')) return null;
        const match = url.pathname.match(entryPath);
        try { return match ? decodeURIComponent(match[1]) : null; }
        catch { return null; }
    }

    function entryURL(item, href) {
        const root = base(href);
        if (item.local) {
            const url = new URL('index.html', root);
            url.hash = 'item=' + encodeURIComponent(item.id);
            return url.href;
        }
        return new URL('entry/' + encodeURIComponent(item.id) + '.html', root).href;
    }

    const documentURL = (path, href) => new URL(path, base(href)).href;
    return { base, entryId, entryURL, documentURL };
})();
