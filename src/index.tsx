import { App } from 'app';
import { createRoot } from 'react-dom/client';
import 'index.css';

const appContainer: HTMLElement = document.createElement('div');
appContainer.className = 'app-container';
document.body.append(appContainer);
const root = createRoot(appContainer);
root.render(<App />);
