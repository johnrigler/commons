/* Values belong only to the private working copy in this tab. */
(() => {
    'use strict';
    const fields = JSON.parse(document.getElementById('form-fields').textContent);
    const form = document.getElementById('correspondence-form');
    const controls = document.getElementById('field-controls');
    const status = document.getElementById('copy-status');
    const targets = [...document.querySelectorAll('[data-field]')];
    const emailPanel = document.getElementById('email-panel');
    const emailText = document.getElementById('email-text');
    let group;
    for (const field of fields) {
        if (field.group) {
            group = document.createElement('fieldset');
            const legend = document.createElement('legend'); legend.textContent = field.group;
            group.append(legend); controls.append(group);
        }
        const label = document.createElement('label'); label.textContent = field.label;
        const input = document.createElement(field.multiline ? 'textarea' : 'input');
        input.name = field.name; input.maxLength = field.max; input.autocomplete = 'off'; input.spellcheck = false;
        if (field.multiline) { input.rows = 3; label.className = 'wide'; } else input.type = 'text';
        label.append(input); group.append(label);
    }
    const value = name => form.elements.namedItem(name).value.trim();
    function update() {
        for (const target of targets) target.textContent = value(target.dataset.field);
        status.removeAttribute('data-error');
        status.textContent = fields.some(field => value(field.name)) ? 'Private working copy updated in this tab.' : 'All fields are blank.';
        emailPanel.hidden = true; emailText.value = '';
    }
    function overflow() {
        return targets.some(target => target.scrollHeight > target.clientHeight + 2 || target.scrollWidth > target.clientWidth + 2) ||
            [...document.querySelectorAll('.letter-page')].some(page => {
                const footer = page.querySelector('footer').getBoundingClientRect();
                const content = [...page.children].filter(child => child.tagName !== 'FOOTER');
                return content.some(child => child.getBoundingClientRect().bottom > footer.top - 5);
            });
    }
    form.addEventListener('input', update);
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', () => setTimeout(update, 0));
    document.getElementById('print-blank').addEventListener('click', () => {
        for (const target of targets) target.textContent = '';
        try { window.print(); } finally { update(); }
    });
    document.getElementById('print-copy').addEventListener('click', () => {
        update();
        if (overflow()) {
            status.textContent = 'Some text is longer than its printed space. Shorten it or continue on an attachment before printing.';
            status.setAttribute('data-error', 'true'); return;
        }
        window.print();
    });
    document.getElementById('prepare-email').addEventListener('click', () => {
        update();
        const lines = ['Subject: Signed document, company policy and disputed charges', ''];
        for (const field of fields.filter(field => !field.name.startsWith('signature_date'))) lines.push(field.label + ': ' + (value(field.name) || '[' + field.label + ']'));
        lines.push('', ...[...document.querySelectorAll('[data-email-paragraph]')].map(node => node.textContent.trim()), '', value('sender1') || '[Sender 1]');
        if (value('sender2')) lines.push(value('sender2'));
        emailText.value = lines.join('\n\n'); emailPanel.hidden = false;
        status.textContent = 'Email text prepared for your review. Nothing has been sent.';
    });
    update();
})();
