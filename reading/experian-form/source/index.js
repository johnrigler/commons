/* Private working copy: no storage, query-string data, submissions or network writes. */
(() => {
    'use strict';
    const fields = JSON.parse(document.getElementById('form-fields').textContent);
    const reference = JSON.parse(document.getElementById('blank-reference').textContent);
    const form = document.getElementById('private-form');
    const controls = document.getElementById('field-controls');
    const status = document.getElementById('copy-status');
    let group;
    for (const field of fields) {
        if (field.group) {
            group = document.createElement('fieldset');
            const legend = document.createElement('legend'); legend.textContent = field.group;
            group.append(legend); controls.append(group);
        }
        const label = document.createElement('label');
        label.textContent = field.label;
        const input = document.createElement(field.multiline ? 'textarea' : 'input');
        input.name = field.name; input.maxLength = field.max;
        input.autocomplete = 'off'; input.spellcheck = false;
        if (field.multiline) { input.rows = 3; label.className = 'wide'; }
        else input.type = 'text';
        label.append(input); group.append(label);
    }
    const targets = [...document.querySelectorAll('[data-field]')];
    function update() {
        status.removeAttribute('data-error');
        let filled = false;
        for (const target of targets) {
            const value = form.elements.namedItem(target.dataset.field).value.trim();
            target.textContent = value; filled ||= !!value;
        }
        const checked = form.elements.namedItem('fraud_referral').checked;
        const mark = document.getElementById('fraud-mark');
        mark.textContent = checked ? '☑' : '☐';
        mark.setAttribute('aria-label', checked ? 'Checked' : 'Unchecked');
        document.body.classList.toggle('private-copy', filled || checked);
        status.textContent = filled || checked ? 'Private preview updated. The downloadable blank PDF is unchanged.' : 'All fields are blank.';
    }
    form.addEventListener('input', update);
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', () => { setTimeout(update, 0); });
    document.getElementById('print-private').addEventListener('click', () => {
        update();
        const overflow = targets.some(target => target.scrollHeight > target.clientHeight + 2 || target.scrollWidth > target.clientWidth + 2);
        if (overflow) {
            status.textContent = 'Some text is longer than its space. Shorten it or continue on an attachment before printing.';
            status.setAttribute('data-error', 'true');
            return;
        }
        status.removeAttribute('data-error');
        window.print();
    });
    document.getElementById('blank-ipfs-reference').textContent = 'ipfs://' + reference.cid;
    document.getElementById('blank-sha256').textContent = reference.sha256;
    document.getElementById('private-copy').hidden = false;
    update();
})();
