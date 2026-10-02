'use strict';
const dialog = document.querySelector('#preview');
const stage = document.querySelector('#preview-stage');
const title = document.querySelector('#preview-title');
const standalone = document.querySelector('#standalone');
const names = { 'form-field': 'Form / Field', 'the-pass': 'The Pass' };
let openedBy;

if (typeof dialog.showModal === 'function') {
  for (const link of document.querySelectorAll('[data-preview]')) {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const name = names[link.dataset.preview];
      if (!name) return;
      event.preventDefault();
      openedBy = link;
      title.textContent = name;
      standalone.href = link.href;
      const frame = document.createElement('iframe');
      frame.title = name + ' interactive study';
      frame.src = link.href;
      stage.replaceChildren(frame);
      document.body.classList.add('preview-open');
      dialog.showModal();
    });
  }
  document.querySelector('#close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    stage.replaceChildren();
    document.body.classList.remove('preview-open');
    openedBy?.focus();
  });
}
