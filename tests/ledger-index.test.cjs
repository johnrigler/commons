const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const sandbox={globalThis:{}};
vm.runInNewContext(fs.readFileSync("reading/ledger/ledger-core.js","utf8"),sandbox);
const L=sandbox.globalThis.CommonsLedger;
const hex="a".repeat(64);
const tx={hash:"f".repeat(64),confirmations:3,block_height:123,confirmed:"2026-11-10T12:00:00Z",
  outputs:[{addresses:[L.ADDRESS],value:1000},{script_type:"null-data",data_string:"sha256:"+hex}]};
test("only valid Commons-tagged SHA-256 tx is returned",()=>{
 const item=L.parse(tx);
 assert.equal(item.sha256,hex);assert.equal(item.txid,"f".repeat(64));assert.equal(item.blockHeight,123);
 assert.equal(L.parse({...tx,outputs:[{data_string:"sha256:"+hex}]}),null);
 assert.equal(L.parse({...tx,outputs:[{addresses:[L.ADDRESS]},{data_string:"sha256:"+hex.slice(1)}]}),null);
});
test("accept exact ASCII hex data, reject non-ASCII and malformed data",()=>{
 const bytes=Buffer.from("sha256:"+hex,"ascii").toString("hex");
 assert.equal(L.parse({...tx,outputs:[{addresses:[L.ADDRESS]},{data_hex:bytes}]}).sha256,hex);
 assert.equal(L.dataString({data_hex:"01ff"}),"");
 assert.equal(L.dataString({data_hex:"000x"}),"");
 assert.equal(L.parse({...tx,outputs:[{addresses:[L.ADDRESS]},{data_string:"SHA256:"+hex}]}),null);
});
