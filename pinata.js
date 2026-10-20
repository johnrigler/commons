/* Direct browser API calls. Tokens belong to the caller's session only. */
globalThis.CommonsPinata = (() => {
    async function request(url, token, options = {}, send = fetch) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 60000);
        try {
            const response = await send(url, {
                ...options, signal: controller.signal, credentials: 'omit',
                headers: { Authorization: 'Bearer ' + token }
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Pinata rejected the token. Check its file read/write permissions.');
                }
                throw new Error('Pinata returned HTTP ' + response.status + '.');
            }
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') throw new Error('Pinata request timed out. Check pin status before retrying.');
            if (error instanceof SyntaxError) throw new Error('Pinata returned an unreadable response.');
            // Never display a provider/network error that might echo a credential.
            if (!error.message.startsWith('Pinata ')) throw new Error('Pinata connection failed. Check your network and retry.');
            throw error;
        } finally { clearTimeout(timer); }
    }

    async function list(token, cid = '', send = fetch) {
        const url = new URL('https://api.pinata.cloud/v3/files/public');
        url.searchParams.set('limit', '10');
        if (cid) url.searchParams.set('cid', cid);
        const result = await request(url.href, token, {}, send);
        if (!Array.isArray(result.data?.files)) throw new Error('Pinata returned an unexpected file listing.');
        return result.data.files;
    }

    async function pin(token, value, expected, name = expected, send = fetch) {
        if (!token?.trim()) throw new Error('Connect a Pinata token first.');
        const archive = await CommonsCID.car(value);
        if (archive.cid !== expected) throw new Error('CID mismatch. This file was not uploaded.');
        const existing = (await list(token, expected, send)).find(file => file.cid === expected);
        if (existing) return { cid: expected, id: existing.id, status: 'already-pinned' };
        const form = new FormData();
        form.append('network', 'public');
        form.append('car', 'true');
        form.append('file', new Blob([archive.bytes], { type: 'application/vnd.ipld.car' }), expected + '.car');
        form.append('name', name);
        const result = await request('https://uploads.pinata.cloud/v3/files', token, { method: 'POST', body: form }, send);
        if (result.data?.cid !== expected || !result.data?.id) {
            throw new Error('Pinata returned a different CID or an incomplete receipt. Publication was not confirmed.');
        }
        return { cid: expected, id: result.data.id, status: 'pinned', created_at: result.data.created_at || null };
    }

    return { list, pin };
})();
