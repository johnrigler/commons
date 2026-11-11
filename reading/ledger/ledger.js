(() => {
  "use strict";
  const C = CommonsLedger;
  const $ = id => document.getElementById(id);
  const entries = new Map();
  let nextBefore = null;
  let loading = false;
  let hasMore = false;
  let pages = 0;
  function status(text) { $("status").textContent = text; }
  function short(s) { return s.slice(0,11) + "…" + s.slice(-9); }
  function render() {
    const q = $("filter").value.trim().toLowerCase();
    const list = [...entries.values()].filter(row => !q || row.sha256.includes(q) || row.txid.includes(q));
    list.sort((a,b)=>(b.blockHeight || Number.MAX_SAFE_INTEGER)-(a.blockHeight || Number.MAX_SAFE_INTEGER));
    const panel = $("results");
    panel.replaceChildren();
    for(const entry of list) {
      const card = document.createElement("article");
      card.className = "entry";
      const top = document.createElement("div");top.className="entry-top";
      const title = document.createElement("strong"); title.textContent = "SHA-256 " + short(entry.sha256);
      const date = document.createElement("span"); date.textContent = entry.timestamp ? entry.timestamp.replace("T"," ").replace("Z"," UTC") : "Date unavailable";
      top.append(title,date);
      const digest = document.createElement("code");digest.className="digest";digest.textContent = entry.sha256;
      const state = document.createElement("p");
      state.className="small";
      state.textContent = entry.confirmations > 0
        ? "Provider reports " + entry.confirmations + " confirmation(s)" + (entry.blockHeight ? " · block " + entry.blockHeight : "")
        : "Unconfirmed or confirmation data unavailable";
      const links=document.createElement("p"); links.className="links";
      const chisel=document.createElement("a");
      chisel.href="https://johnrigler.github.io/chisel/?mode=portal&coin=litecoin&txid="+entry.txid;
      chisel.textContent="Open in Chisel";
      chisel.rel="noopener noreferrer";chisel.target="_blank";
      const provider=document.createElement("a");
      provider.href="https://live.blockcypher.com/ltc/tx/"+entry.txid+"/";
      provider.textContent="Explorer transaction";
      provider.rel="noopener noreferrer";provider.target="_blank";
      links.append(chisel,provider);
      const tx=document.createElement("code");tx.className="small txid";tx.textContent="TXID "+entry.txid;
      card.append(top,digest,state,tx,links);
      panel.append(card);
    }
    $("count").textContent = list.length + " visible commitment(s), " + entries.size + " matching transaction(s) examined from " + pages + " address page(s)";
    if (!list.length) {
      const p=document.createElement("p");p.className="small";
      p.textContent = entries.size ? "No locally loaded record matches this search." : "No qualifying Commons SHA-256 records in the loaded pages.";
      panel.append(p);
    }
    $("older").hidden = !hasMore || !nextBefore;
  }
  async function load(reset=false) {
    if(loading)return;
    loading=true;
    $("refresh").disabled=true;$("older").disabled=true;
    if(reset){entries.clear();nextBefore=null;hasMore=false;pages=0;}
    const url=new URL(C.API);
    url.searchParams.set("limit","50");
    if(nextBefore)url.searchParams.set("before",String(nextBefore));
    status("Reading public Litecoin address history from BlockCypher…");
    try {
      const response=await fetch(url.toString(),{headers:{Accept:"application/json"},cache:"no-store"});
      if(!response.ok)throw new Error("Provider HTTP "+response.status);
      const data=await response.json();
      if(!Array.isArray(data.txs))throw new Error("Provider response has no full transactions");
      let loaded=0;
      for(const tx of data.txs){const entry=C.parse(tx);if(entry){entries.set(entry.txid,entry);loaded++;}}
      pages++;
      hasMore = Boolean(data.hasMore);
      const confirmed = data.txs.filter(tx => Number.isInteger(tx.block_height) && tx.block_height > 0);
      const last = confirmed[confirmed.length-1];
      const cursor = last ? last.block_height : null;
      nextBefore = hasMore && cursor ? cursor : null;
      status("Read " + data.txs.length + " provider transaction(s) on this page; " + loaded + " matched the Commons SHA-256 profile. "+ (hasMore ? "Older transactions may remain." : "No more pages indicated by provider."));
      render();
    } catch(error) {
      status("Could not query the public address: " + error.message + ". This does not establish that there are no records. Retry or inspect the address in another explorer.");
      render();
    } finally {loading=false;$("refresh").disabled=false;$("older").disabled=false;}
  }
  $("refresh").addEventListener("click",()=>load(true));
  $("older").addEventListener("click",()=>load(false));
  $("filter").addEventListener("input",render);
  $("address").textContent=C.ADDRESS;
  $("index-link").href="https://live.blockcypher.com/ltc/address/"+C.ADDRESS+"/";
  load(true);
})();
