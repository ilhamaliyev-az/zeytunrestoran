/* ================================================
   ZEYTUN RESTORAN — PWA App Logic
   ================================================ */

'use strict';

// ===== Category Navigation =====
(function initNav() {
  const buttons = document.querySelectorAll('.cat-btn');
  const sections = document.querySelectorAll('.section');

  function showSection(targetId) {
    sections.forEach(function(sec) {
      sec.classList.add('hidden');
    });
    const target = document.getElementById(targetId);
    if (target) {
      target.classList.remove('hidden');
      // Smooth scroll to top of main content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      buttons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Scroll active button into view in nav
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      showSection(btn.dataset.target);
    });
  });
})();

// ===== Scroll To Top Button =====
(function initScrollTop() {
  var btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Yuxarı qayıt');
  document.body.appendChild(btn);

  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== Offline / Online Banner =====
(function initOffline() {
  var banner = document.createElement('div');
  banner.className = 'offline-banner';
  banner.textContent = '⚠️ İnternet bağlantısı yoxdur — Sayt oflayn işləyir';
  document.body.insertBefore(banner, document.body.firstChild);

  function update() {
    if (!navigator.onLine) {
      banner.classList.add('show');
    } else {
      banner.classList.remove('show');
    }
  }

  window.addEventListener('online',  update);
  window.addEventListener('offline', update);
  update();
})();

// ===== PWA Install Prompt =====
(function initInstall() {
  var deferredPrompt = null;

  var banner = document.createElement('div');
  banner.className = 'install-banner';
  banner.innerHTML = [
  ].join('');
  document.body.insertBefore(banner, document.querySelector('.header').nextSibling);

  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    banner.classList.add('show');
  });

  banner.querySelector('.install-btn').addEventListener('click', function() {
    banner.classList.remove('show');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function() {
        deferredPrompt = null;
      });
    }
  });

  banner.querySelector('.install-dismiss').addEventListener('click', function() {
    banner.classList.remove('show');
  });

  window.addEventListener('appinstalled', function() {
    banner.classList.remove('show');
    deferredPrompt = null;
  });
})();

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
      console.log('[SW] Registered:', reg.scope);
    }).catch(function(err) {
      console.warn('[SW] Registration failed:', err);
    });
  });
}

// ===== Prevent double-tap zoom on buttons (iOS) =====
document.addEventListener('touchend', function(e) {
  var now = Date.now();
  if (this._lastTouchEnd && (now - this._lastTouchEnd) < 300) {
    e.preventDefault();
  }
  this._lastTouchEnd = now;
}, { passive: false });
