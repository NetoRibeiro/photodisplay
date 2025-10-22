async function ensurePolyfills() {
  const tasks: Promise<unknown>[] = [];
  if (!('fetch' in window)) {
    tasks.push(import('whatwg-fetch'));
  }
  if (!('Promise' in window)) {
    tasks.push(import('promise-polyfill/src/polyfill'));
  }
  if (!('classList' in document.createElement('div'))) {
    tasks.push(import('classlist-polyfill'));
  }
  await Promise.all(tasks);
}

ensurePolyfills().catch((error) => {
  console.error('Failed to load polyfills', error);
});
