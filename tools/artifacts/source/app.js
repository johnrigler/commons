(() => {
    'use strict';
    const A = CommonsArtifacts, $ = id => document.getElementById(id);
    const state = { original:null, correspondence:null, pair:null, selected:null, anchor:null };
    const revisions = {original:0,correspondence:0}; let generation = 0;
    function download(text, name) {
        const url = URL.createObjectURL(new Blob([text], {type:'application/json'}));
        const link = document.createElement('a'); link.href = url; link.download = name; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function facts(role, record) {
        const holder = $(role+'-facts'); holder.textContent = '';
        if (record) for (const [name,value] of Object.entries({File:record.filename,Bytes:record.bytes,'SHA-256':record.sha256,...(record.pdf ? {'PDF pages':record.pdf.pages ?? 'Unknown','Signature dictionaries':record.pdf.signatures.length,'Signature verification':'Not performed'} : {})})) {
            const dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = name; dd.textContent = value; holder.append(dt,dd);
        }
        $(role+'-details').textContent = record ? JSON.stringify(record,null,2) : 'No inspection yet.';
    }
    function link() {
        const button = $('open-chisel'); button.removeAttribute('href'); button.setAttribute('aria-disabled','true');
        if (!state.anchor) return;
        try {
            const url = new URL($('chisel-url').value, location.href);
            if (!['https:','http:','file:'].includes(url.protocol) || url.username || url.password) throw new Error('Use a static Chisel review page URL.');
            url.search = ''; url.hash = new URLSearchParams({sha256:state.anchor.sha256}).toString();
            button.href = url.href; button.setAttribute('aria-disabled','false');
        } catch (_) { $('intake-status').textContent = 'Enter a valid Chisel review-page URL to enable the handoff.'; }
    }
    async function render() {
        const run = ++generation;
        state.anchor = null; state.selected = null; state.pair = null;
        for (const id of ['download-record','download-inspection','download-anchor']) $(id).disabled = true;
        link(); $('selected-hash').textContent = 'Not prepared.'; $('op-return').textContent = 'Not prepared.'; $('payload-bytes').textContent = '—';
        const select = $('anchor-target');
        select.options[1].disabled = !state.correspondence;
        select.options[2].disabled = !state.original || !state.correspondence;
        if (select.selectedOptions[0].disabled) select.value = 'original';
        if (state.original && state.correspondence) {
            const pair = await A.pair(state.original,state.correspondence);
            if (run !== generation) return;
            state.pair = pair; $('download-record').disabled = false;
        }
        if (run !== generation) return;
        const target = select.value, record = target === 'pair' ? state.pair : state[target];
        if (!record) { $('intake-status').textContent = 'Choose the original PDF to begin, or select an available artifact.'; return; }
        state.selected = record; state.anchor = A.anchor(record.sha256);
        $('selected-hash').textContent = record.sha256; $('op-return').textContent = state.anchor.opReturnAscii;
        $('payload-bytes').textContent = state.anchor.opReturnBytes+' ASCII bytes / 80-byte Chisel profile';
        $('scope-note').textContent = target === 'pair' ? 'This hash identifies the exact downloaded pair record. Keep that record and both source files.' : 'This hash identifies the exact bytes of Document '+(target === 'original'?'1':'2')+'. The other document is not included in this hash.';
        $('download-inspection').disabled = false; $('download-anchor').disabled = false;
        $('intake-status').textContent = 'Ready for Chisel review. No transaction has been funded, signed or broadcast.'; link();
    }
    for (const role of ['original','correspondence']) $(role+'-file').addEventListener('change', async () => {
        const revision = ++revisions[role], file = $(role+'-file').files[0];
        state[role] = null; facts(role,null); render();
        if (!file) { $(role+'-status').textContent = 'No file selected.'; return; }
        $(role+'-status').textContent = 'Hashing and inspecting locally…';
        try {
            const record = await A.inspect(file,role,globalThis.PDFLib);
            if (revision !== revisions[role]) return;
            state[role] = record; facts(role,record);
            $(role+'-status').textContent = record.pdf?.status === 'inspection-unavailable' ? 'SHA-256 ready. PDF inspection unavailable; see details.' : 'SHA-256 and local inspection ready.';
        } catch (error) { if (revision !== revisions[role]) return; $(role+'-status').textContent = error.message; }
        render();
    });
    $('anchor-target').addEventListener('change',render); $('chisel-url').addEventListener('input',link);
    $('download-record').addEventListener('click',()=>{if(state.pair) download(state.pair.text,'artifact-pair-'+state.pair.sha256+'.json');});
    $('download-inspection').addEventListener('click',()=>{if(state.selected) download(state.selected.text || JSON.stringify(state.selected,null,2)+'\n','inspection-'+state.selected.sha256+'.json');});
    $('download-anchor').addEventListener('click',()=>{if(state.anchor) download(JSON.stringify(state.anchor,null,2)+'\n','certledger-'+state.anchor.sha256+'.json');});
    $('clear-files').addEventListener('click',()=>{
        for (const role of ['original','correspondence']) { revisions[role]++; state[role]=null; $(role+'-file').value=''; facts(role,null); $(role+'-status').textContent='No file selected.'; }
        $('anchor-target').value='original'; $('scope-note').textContent='Choose the original PDF to begin. You can add the correspondence later.'; render();
    });
    if (!globalThis.crypto?.subtle) { $('intake-status').textContent='SHA-256 needs Web Crypto. Open this page over HTTPS or localhost.'; for(const role of ['original','correspondence']) $(role+'-file').disabled=true; }
})();
