import { render } from 'preact';
import { App } from './routes/App';
import './styles/index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch((err) => console.error('SW registration failed', err));
  });
}

render(<App />, document.getElementById('app') as HTMLElement);
