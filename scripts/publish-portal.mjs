// Optional authoring tool. The published reader is self-contained static HTML.
import {readFile, writeFile, readdir, mkdir, lstat, readlink, symlink, rename, unlink} from "node:fs/promises";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = name => readFile(path.join(root, name), "utf8");
const escape = text => text.replace(/[&<>"']/g, char => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"})[char]);
const cid = bytes => {
  if (bytes.length > 1024 * 1024) throw Error("Raw content exceeds the Commons 1 MiB profile.");
  const data = Buffer.concat([Buffer.from([1, 0x55, 0x12, 0x20]), createHash("sha256").update(bytes).digest()]);
  const alphabet = "abcdefghijklmnopqrstuvwxyz234567"; let value = 0, bits = 0, result = "b";
  for (const byte of data) {
    value = (value << 8) | byte; bits += 8;
    while (bits >= 5) { bits -= 5; result += alphabet[(value >>> bits) & 31]; }
  }
  if (bits) result += alphabet[(value << (5 - bits)) & 31];
  return result;
};
async function frozen(bytes, folder = "") {
  const name = cid(bytes) + ".html", target = path.join(root, folder, name);
  try { await writeFile(target, bytes, {flag: "wx"}); }
  catch (error) {
    if (error.code !== "EEXIST" || (await lstat(target)).isSymbolicLink() || !(await readFile(target)).equals(bytes)) throw error;
  }
  return {name, cid: name.slice(0, -5)};
}
async function link(entry, target) {
  const destination = path.join(root, entry);
  try {
    const info = await lstat(destination);
    const old = info.isSymbolicLink() ? await readlink(destination) : await readFile(destination, "utf8");
    if (old === target && info.isSymbolicLink()) return;
    // Accept materialized Git symlinks; reject overwriting an ordinary page.
    if (!info.isSymbolicLink() && !/^(?:\.\.\/)?(?:bafk[a-z2-7]+|index)\.html$/.test(old)) throw Error("Entry contains an ordinary file: " + entry);
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  const temporary = destination + ".next";
  await unlink(temporary).catch(error => { if (error.code !== "ENOENT") throw error; });
  await symlink(target, temporary); await rename(temporary, destination);
}

const catalog = JSON.parse(await read("portal.json")), ids = new Set(), documents = {};
for (const item of catalog.items) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || ids.has(item.id)) throw Error("Invalid or duplicate entry ID.");
  ids.add(item.id);
  const filename = path.resolve(root, item.path);
  if (!filename.startsWith(root)) throw Error("Document outside the repository.");
  const bytes = await readFile(filename);
  if (cid(bytes) !== item.cid || !bytes.includes(Buffer.from('id="' + item.fragment + '"'))) throw Error("Invalid frozen document: " + item.id);
  documents[item.cid] = bytes.toString("base64");
}
for (const item of catalog.items) {
  if (!item.related.every(id => ids.has(id))) throw Error("Unknown related entry.");
  for (const id of item.companies || []) if (!catalog.items.some(other => other.id === id && other.record_class === "company")) throw Error("Invalid company link.");
}
catalog.documents = documents;
const parts = (await readdir(path.join(root, "portal"))).filter(name => /^1_.*\.html$/.test(name)).sort();
let body = (await Promise.all(parts.map(name => read("portal/" + name)))).join("");
body = body.replaceAll("{{COMMONS_VERSION}}", escape((await read("VERSION")).trim()));
if (body.includes("<?")) throw Error("Portal parts must be static HTML.");
const json = JSON.stringify(catalog).replace(/[<>&]/g, char => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
const scripts = await Promise.all(["verify.js", "portal-core.js", "portal-urls.js", "portal-reader.js", "portal.js"].map(async name =>
  "<script>" + (await read(name)).replace(/<\/script/gi, "<\\/script") + "</script>"));
const html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n' +
  '<meta name="description" content="Turn individual experiences into shared, checkable records. Explore Commons arguments, source-preservation workflows, and connected reading across subjects.">\n' +
  '<title>Commons — Portal</title><style>' + await read("portal.css") + '</style></head><body>\n' + body +
  '<script id="portal-data" type="application/json">' + json + '</script>\n' + scripts.join("\n") + '\n</body></html>\n';
const edition = await frozen(Buffer.from(html));
await mkdir(path.join(root, "entry"), {recursive: true});
for (const item of catalog.items) await link("entry/" + item.id + ".html", "../index.html");
await link("index.html", edition.name);
console.log(edition.name);
