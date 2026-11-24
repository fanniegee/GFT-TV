(() => {
  const script = document.currentScript;
  const app = script?.dataset.app;
  const names = { gft: 'Guvaza Family Trust', tv: 'GFT.TV', library: 'Guvaza Library', clinic: 'GGC Clinic' };
  if (!names[app] || !window.isSecureContext) return;
  const androidEdge = /Android/i.test(navigator.userAgent) && /EdgA\//i.test(navigator.userAgent);
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
  let promptEvent;
  let banner;
  const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const remove = () => { banner?.remove(); banner = null; };
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); if (androidEdge) return; promptEvent = event;
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
    const title = document.createElement('strong'); title.textContent = 'Install ' + names[app];
    const description = document.createElement('p'); description.textContent = androidEdge ? 'For an Android app with its own entry in device settings, install from Chrome. Edge may add a browser-badged shortcut.' : 'Open it from your home screen or desktop. Installation options depend on your browser and device.';
    const hint = document.createElement('p'); hint.hidden = true; hint.setAttribute('role', 'status');
    text.append(title, description, hint);
    const install = document.createElement('button'); install.type = 'button'; install.textContent = androidEdge ? 'Open in Chrome' : (promptEvent ? 'Install app' : 'Installation help');
    install.onclick = async () => {
      if (androidEdge) {
        hint.hidden = false;
        hint.textContent = 'In Chrome, choose Install app and confirm Install. If Chrome does not open, copy this address into Chrome. An existing Edge shortcut will not convert automatically.';
        const target = new URL(location.href);
        if (target.protocol === 'https:') {
          target.hash = '';
          location.href = 'intent://' + target.host + target.pathname + target.search + '#Intent;scheme=https;package=com.android.chrome;end';
        }
        return;
      }
      if (promptEvent) {
        const event = promptEvent; promptEvent = null;
        try { await event.prompt(); const choice = await event.userChoice; if (choice.outcome === 'accepted') remove(); }
        catch { hint.hidden = false; hint.textContent = 'Use the browser menu and choose Install app. If only Create shortcut is offered, that creates a shortcut rather than a full app installation.'; }
        install.textContent = 'How to install';
      } else {
        hint.hidden = false;
        hint.textContent = ios ? 'In Safari, tap Share, then Add to Home Screen. Enable Open as Web App if offered.' : /Android/i.test(navigator.userAgent) ? 'Open this address in Chrome, then choose Install app and confirm Install. Google Play services and device support are required for an Android app installation. Create shortcut only adds a shortcut.' : 'In Chrome or Edge, choose Install app or Install this site as an app. Installed apps can be managed in your browser app settings; desktop shortcuts are separate.';
      }
    };
    const close = document.createElement('button'); close.type = 'button'; close.className = 'gft-app-later'; close.textContent = 'Not now'; close.onclick = remove;
    banner.append(text, install, close); document.body.append(banner);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show, { once: true }); else show();
})();
