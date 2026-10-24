import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, readlink, readdir, rm } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const php = process.env.SB_PHP || 'php';
const available = spawnSync(php, ['-n', '-v']).status === 0;
const options = available ? {} : { skip: 'Set SB_PHP to an installed PHP 8+ CLI binary.' };

test('every published entry has a static path selecting the current portal', async () => {
    const catalog=JSON.parse(await readFile(join(root,'portal.json'),'utf8'));
    const portal=await readFile(join(root,'index.html'));
    for (const item of catalog.items) {
        const route=join(root,'entry',item.id+'.html');
        assert.equal(await readlink(route),'../index.html');
        assert.deepEqual(await readFile(route),portal);
    }
});

test('portal, about and publishing snapshots match their PHP sources and CID filenames', options, async () => {
    for (const [entry, source, marker] of [['index.html', 'index.php', 'id="portal-data"'], ['about.html', 'sb/about.php', 'About Commons'], ['publish.html', 'sb/page.php', 'id="commons-data"'], ['tools/artifacts/index.html','tools/artifacts/source/page.php','id="original-file"'], ['reading/artifact-intake/index.html','reading/artifact-intake/source/page.php','id="artifact-intake"']]) {
        const html = execFileSync(php, ['-n', join(root, source)]);
        const target = await readlink(join(root, entry));
        const snapshot = resolve(root, dirname(entry), target);
        assert.deepEqual(await readFile(snapshot), html);
        const cid = execFileSync(php, ['-n', join(root, 'sb/cid.php'), snapshot], { encoding: 'utf8' }).trim();
        assert.equal(target, cid + '.html');
        const text = html.toString('utf8');
        assert.ok(text.includes(marker));
        assert.ok(!/<script[^>]+src=/.test(text));
        assert.ok(!/<link[^>]+rel="stylesheet"/.test(text));
    }
});

test('named publication does not replace the portal entry link', options, async () => {
    const folder = await mkdtemp(join(tmpdir(), 'commons-named-'));
    try {
        await writeFile(join(folder, 'index.php'), '<?php echo "portal";');
        const run = entry => execFileSync('bash', ['-c', 'source "$1"; cd "$2"; sb.publish index.php "$3"', 'test', join(root, 'sb/publish.bash'), folder, entry], {env:{...process.env, SB_PHP:php}, encoding:'utf8', stdio:['ignore','pipe','pipe']}).trim();
        const portal = run('index.html');
        await writeFile(join(folder, 'index.php'), '<?php echo "about";');
        const about = run('about.html');
        assert.equal(await readlink(join(folder, 'index.html')), portal);
        assert.equal(await readlink(join(folder, 'about.html')), about);
        assert.throws(() => run('../outside.html'));
    } finally { await rm(folder, {recursive:true, force:true}); }
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
