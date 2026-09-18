import { createUI } from './ui.js';

const root = document.getElementById('app');
if (!root) {
  throw new Error('#app missing');
}
createUI(root);
