(() => {
  const script = document.currentScript;
  const app = script?.dataset.app;
  const names = { tv: 'GFT.TV', library: 'Guvaza Library', clinic: 'GGC Clinic' };
  if (!names[app] || !window.isSecureContext) return;
  let promptEvent;
  let banner;
  const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const remove = () => { banner?.remove(); banner = null; };
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); promptEvent = event;
    if (banner) banner.querySelector('button').textContent = 'Install app';
  });
  window.addEventListener('appinstalled', () => { promptEvent = null; remove(); });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/app-worker.js').catch(() => {});
  function show() {
    if (installed()) return;
    banner = document.createElement('aside');
    banner.className = 'gft-app-install';
    banner.setAttribute('aria-label', names[app] + ' app installation');
    const text = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = 'Add ' + names[app] + ' to your device';
    const description = document.createElement('p'); description.textContent = 'Open it directly from your home screen or desktop next time.';
    const hint = document.createElement('p'); hint.hidden = true; hint.setAttribute('role', 'status');
    text.append(title, description, hint);
    const install = document.createElement('button'); install.type = 'button'; install.textContent = promptEvent ? 'Install app' : 'How to install';
    install.onclick = async () => {
      if (promptEvent) {
        const event = promptEvent; promptEvent = null;
        try { await event.prompt(); const choice = await event.userChoice; if (choice.outcome === 'accepted') remove(); }
        catch { hint.hidden = false; hint.textContent = 'Use your browser menu to install or add this app to your home screen.'; }
        install.textContent = 'How to install';
      } else {
        hint.hidden = false;
        hint.textContent = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 'In Safari, tap Share, then Add to Home Screen.' : 'In Chrome or Edge, open the browser menu and choose Install app or Add to Home screen. The wording depends on your device.';
      }
    };
    const close = document.createElement('button'); close.type = 'button'; close.className = 'gft-app-later'; close.textContent = 'Not now'; close.onclick = remove;
    banner.append(text, install, close); document.body.append(banner);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show, { once: true }); else show();
})();
