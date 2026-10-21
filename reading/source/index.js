
(() => {
  const defaults = { bureau: 'Experian', collector: 'National Credit Systems', lessor: 'Firmus' };
  function update() {
    Object.keys(defaults).forEach(key => {
      const value = document.getElementById(key).value.trim() || '[' + key + ']';
      document.querySelectorAll('[data-party="' + key + '"]').forEach(node => { node.textContent = value; });
    });
  }
  Object.keys(defaults).forEach(key => { document.getElementById(key).addEventListener('input', update); });
  document.querySelectorAll('[data-edit]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.getElementById('request-fields').open = true;
      document.getElementById(link.dataset.edit).focus();
    });
  });
  document.getElementById('print-scope').addEventListener('change', event => { document.body.dataset.print = event.target.value; });
  document.getElementById('print-button').addEventListener('click', () => { window.print(); });
  document.getElementById('reset-button').addEventListener('click', () => {
    Object.keys(defaults).forEach(key => { document.getElementById(key).value = defaults[key]; });
    update();
  });
  update();
})();
