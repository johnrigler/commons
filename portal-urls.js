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

    // Base58 is case-sensitive; preserve every character in the author identity.
    // This is link recognition, not proof of address ownership or a signature.
    function chiselLitecoinURL(address) {
        if (typeof address !== 'string') return null;
        const base58 = /^[LM3][1-9A-HJ-NP-Za-km-z]{25,39}$/;
        const bech32 = /^(?:ltc1[ac-hj-np-z02-9]{6,87}|LTC1[AC-HJ-NP-Z02-9]{6,87})$/;
        if (!base58.test(address) && !bech32.test(address)) return null;
        const url = new URL('https://johnrigler.github.io/chisel/');
        url.searchParams.set('mode', 'portal');
        url.searchParams.set('coin', 'litecoin');
        url.searchParams.set('address', address);
        return url.href;
    }

    return { base, entryId, entryURL, documentURL, chiselLitecoinURL };
})();
