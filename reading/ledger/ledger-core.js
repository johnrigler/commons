/* Provider-facing Commons Litecoin index parser. Does not trust arbitrary labels as ledger evidence. */
globalThis.CommonsLedger = (() => {
  "use strict";
  const ADDRESS = "LMxCoMMoNSzzzzzzzzzzzzzzzzzzZU8MFW";
  const PREFIX = "sha256:";
  const API = "https://api.blockcypher.com/v1/ltc/main/addrs/" + ADDRESS + "/full";
  function dataString(output) {
    if (!output || typeof output !== "object") return "";
    if (typeof output.data_string === "string") return output.data_string;
    if (typeof output.data_hex !== "string" || !/^(?:[0-9a-f]{2})*$/i.test(output.data_hex)) return "";
    const hex = output.data_hex;
    let ascii = "";
    for (let i=0;i<hex.length;i+=2) {
      const code = parseInt(hex.slice(i,i+2),16);
      if (code < 32 || code > 126) return "";
      ascii += String.fromCharCode(code);
    }
    return ascii;
  }
  function parse(tx) {
    if (!tx || typeof tx !== "object" || !Array.isArray(tx.outputs)) return null;
    if (!/^[0-9a-f]{64}$/i.test(tx.hash || "")) return null;
    const tag = tx.outputs.some(o => Array.isArray(o.addresses) && o.addresses.includes(ADDRESS));
    if (!tag) return null;
    const match = tx.outputs.map(dataString).find(s => /^sha256:[0-9a-f]{64}$/.test(s));
    if (!match) return null;
    return {
      txid: tx.hash.toLowerCase(),
      sha256: match.slice(PREFIX.length),
      confirmations: Number.isInteger(tx.confirmations) && tx.confirmations >= 0 ? tx.confirmations : 0,
      blockHeight: Number.isInteger(tx.block_height) && tx.block_height > 0 ? tx.block_height : null,
      timestamp: typeof tx.confirmed === "string" ? tx.confirmed : typeof tx.received === "string" ? tx.received : null
    };
  }
  return {ADDRESS, API, dataString, parse};
})();
