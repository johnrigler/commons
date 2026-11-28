import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp, mkdir, cp, readFile, writeFile, readlink, rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
async function fixture(run) {
  const folder = await mkdtemp(path.join(tmpdir(), "commons-static-"));
  try {
    for (const file of ["scripts", "portal", "portal.json", "portal.css", "VERSION", "verify.js", "portal-core.js", "portal-urls.js", "portal-reader.js", "portal.js"]) {
      await cp(path.join(root, file), path.join(folder, file), {recursive: true});
    }
    const catalog = JSON.parse(await readFile(path.join(folder, "portal.json"), "utf8"));
    for (const file of new Set(catalog.items.map(item => item.path))) {
      await mkdir(path.dirname(path.join(folder, file)), {recursive: true});
      await cp(path.join(root, file), path.join(folder, file));
    }
    await run(folder, catalog);
  } finally { await rm(folder, {recursive: true, force: true}); }
}
const build = folder => spawnSync(process.execPath, ["scripts/publish-portal.mjs"], {cwd: folder, encoding: "utf8"});

test("static publication is reproducible, creates working entry links and preserves frozen bytes", async () => {
  await fixture(async (folder, catalog) => {
    const first = build(folder); assert.equal(first.status, 0, first.stderr);
    const link = await readlink(path.join(folder, "index.html")), snapshot = await readFile(path.join(folder, link));
    assert.match(link, /^bafk[a-z2-7]+\.html$/);
    for (const item of catalog.items) assert.equal(await readlink(path.join(folder, "entry", item.id + ".html")), "../index.html");
    assert.ok(snapshot.includes(Buffer.from("BSV section feed")));
    assert.equal(snapshot.includes(Buffer.from("{{COMMONS_VERSION}}")), false);
    const second = build(folder); assert.equal(second.status, 0, second.stderr);
    assert.equal(await readlink(path.join(folder, "index.html")), link);
    assert.deepEqual(await readFile(path.join(folder, link)), snapshot);
  });
});

test("a tampered source or unknown connection stops publication before replacing the portal", async () => {
  await fixture(async (folder, catalog) => {
    assert.equal(build(folder).status, 0);
    const link = await readlink(path.join(folder, "index.html"));
    const source = path.join(folder, catalog.items[0].path), original = await readFile(source);
    await writeFile(source, Buffer.concat([original, Buffer.from("tampered")]));
    assert.notEqual(build(folder).status, 0); assert.equal(await readlink(path.join(folder, "index.html")), link);
    await writeFile(source, original);
    catalog.items[0].related.push("missing-entry"); await writeFile(path.join(folder, "portal.json"), JSON.stringify(catalog));
    assert.notEqual(build(folder).status, 0); assert.equal(await readlink(path.join(folder, "index.html")), link);
  });
});
