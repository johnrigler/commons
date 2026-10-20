/* Litecoin announcement preparation, compatible with Chisel's 28+6 grammar. */
globalThis.CommonsThunderwords = (() => {
    const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const ROOT = 'LLLLLLLLLLLLLLLLLLLLLLLLLLLLXgkk2V';
    // Explicit Commons role profile; these are configurable, not a change to Chisel's parser.
    const PREFIXES = Object.freeze({ name: 'LLx', transport: 'LMx', subject: 'LNx' });

    function encode(text) {
        return Array.from(String(text).trim().toUpperCase()).map(character => {
            if (/\s/.test(character)) return 'x';
            if (character === 'I') return 'i';
            if (character === 'O' || character === '0') return 'o';
            if (character === '-') return 'y';
            if (character === '.') return 'v';
            if (character === "'") return 't';
            if (!B58.includes(character)) throw new Error('Cannot encode this Thunderword character: ' + character);
            return character;
        }).join('');
    }

    function decode58(text) {
        let number = 0n;
        for (const character of text) {
            const digit = B58.indexOf(character);
            if (digit < 0) throw new Error('Invalid Base58 character.');
            number = number * 58n + BigInt(digit);
        }
        const output = new Uint8Array(25);
        for (let i = 24; i >= 0; i--) { output[i] = Number(number & 255n); number >>= 8n; }
        if (number) throw new Error('Address exceeds 25 bytes.');
        return output;
    }

    function encode58(bytes) {
        let number = 0n, output = '';
        for (const byte of bytes) number = (number << 8n) + BigInt(byte);
        while (number) { output = B58[Number(number % 58n)] + output; number /= 58n; }
        return output;
    }

    async function checksum(bytes) {
        const first = await crypto.subtle.digest('SHA-256', bytes);
        return new Uint8Array(await crypto.subtle.digest('SHA-256', first)).slice(0, 4);
    }

    async function inspect(address) {
        if (!/^L[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) throw new Error('Expected a 34-character Litecoin address.');
        const bytes = decode58(address);
        const check = await checksum(bytes.slice(0, 21));
        if (bytes[0] !== 0x30 || !check.every((byte, index) => byte === bytes[21 + index])) {
            throw new Error('Invalid Litecoin version or Base58Check checksum.');
        }
        return { address, version: bytes[0], valid: true };
    }

    async function generate(prefix, phrase) {
        if (!/^L[1-9A-HJ-NP-Za-km-z]x$/.test(prefix)) throw new Error('Use an L, a Base58 modifier, and x as the prefix.');
        const encoded = encode(phrase);
        if (!encoded) throw new Error('Enter a name, transport or subject.');
        if (prefix.length + encoded.length > 28) throw new Error('A Thunderword body can use at most 25 encoded characters; shorten this tag.');
        const stem = (prefix + encoded).padEnd(28, 'z');
        const bytes = decode58(stem + 'XXXXXX');
        if (bytes[0] !== 0x30) throw new Error('This prefix is outside Litecoin mainnet P2PKH; use LLx, LMx or LNx.');
        bytes.set(await checksum(bytes.slice(0, 21)), 21);
        const address = encode58(bytes);
        if (!address.startsWith(stem)) throw new Error('The checksum changed the requested stem. Choose a different tag or prefix.');
        await inspect(address);
        return { prefix, phrase: String(phrase).trim(), encoded, address };
    }

    async function draft({ name, transport, subject, message, prefixes = PREFIXES }) {
        await inspect(ROOT);
        const tags = [];
        for (const [role, text] of Object.entries({ name, transport, subject })) {
            tags.push({ role, ...await generate(prefixes[role], text) });
        }
        const payload = new TextEncoder().encode(message);
        if (payload.length > 80) throw new Error('The announcement body exceeds the Chisel 80-byte OP_RETURN profile.');
        const hex = Array.from(payload, byte => byte.toString(16).padStart(2, '0')).join('');
        const push = payload.length <= 75 ? payload.length.toString(16).padStart(2, '0') : '4c' + payload.length.toString(16);
        return {
            schema: 'commons/litecoin-announcement/1', state: 'draft', coin: 'litecoin', network: 'mainnet',
            roleProfile: { name: prefixes.name, transport: prefixes.transport, subject: prefixes.subject },
            mainThunderword: { address: ROOT, label: 'Litecoin general Thunderword' }, tags,
            message: { text: message, encoding: 'utf-8', hex, bytes: payload.length },
            outputs: [
                { role: 'general-index', address: ROOT, amountLitoshis: null },
                ...tags.map(tag => ({ role: tag.role, address: tag.address, amountLitoshis: null })),
                { role: 'op-return', amountLitoshis: 0, scriptPubKey: '6a' + push + hex }
            ]
        };
    }

    return { ROOT, PREFIXES, encode, generate, inspect, draft };
})();
