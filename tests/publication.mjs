import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, readlink, readdir, rm } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const php = process.env.SB_PHP || 'php';
const available = spawnSync(php, ['-n', '-v']).status === 0;
const options = available ? {} : { skip: 'Set SB_PHP to an installed PHP 8+ CLI binary.' };

test('committed snapshot matches a fresh PHP render and its CID filename', options, async () => {
    const html = execFileSync(php, ['-n', join(root, 'index.php')]);
    const target = await readlink(join(root, 'index.html'));
    assert.deepEqual(await readFile(join(root, target)), html);
    const cid = execFileSync(php, ['-n', join(root, 'sb/cid.php'), join(root, target)], { encoding: 'utf8' }).trim();
    assert.equal(target, cid + '.html');
    const text = html.toString('utf8');
    assert.ok(text.includes('id="commons-data"'));
    assert.ok(!/<script[^>]+src=/.test(text));
    assert.ok(!/<link[^>]+rel="stylesheet"/.test(text));
});

test('publishing moves the symlink while preserving old bytes and failed renders', options, async () => {
    const folder = await mkdtemp(join(tmpdir(), 'commons-publish-'));
    const publish = () => execFileSync('bash', ['-c', 'source "$1"; cd "$2"; sb.publish', 'test', join(root, 'sb/publish.bash'), folder], { encoding: 'utf8', env: { ...process.env, SB_PHP: php }, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    try {
        await writeFile(join(folder, 'index.php'), '<?php echo "<h1>first</h1>\\n";');
        const first = publish(), original = await readFile(join(folder, first));
        assert.equal(await readlink(join(folder, 'index.html')), first);
        assert.equal(publish(), first);
        await writeFile(join(folder, 'index.php'), '<?php echo "<h1>second</h1>\\n";');
        const second = publish(); assert.notEqual(first, second);
        assert.equal(await readlink(join(folder, 'index.html')), second);
        assert.deepEqual(await readFile(join(folder, first)), original);
        await writeFile(join(folder, 'index.php'), '<?php echo "partial output"; exit(7);');
        assert.throws(publish);
        assert.equal(await readlink(join(folder, 'index.html')), second);
        assert.ok(!(await readdir(folder)).some(name => name.startsWith('.commons-')));
    } finally { await rm(folder, { recursive: true, force: true }); }
});
