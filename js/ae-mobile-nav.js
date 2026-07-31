/* Anshuman Enterprises - Global Mobile Navigation Drawer Controller */

window.aeToggleMobileMenu = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  var drawer = document.getElementById('ae-mobile-drawer');
  if (!drawer) return;

  var isActive = drawer.classList.contains('is-active') || drawer.style.display === 'block';

  if (isActive) {
    drawer.classList.remove('is-active');
    document.body.style.overflow = '';
    setTimeout(function() {
      drawer.style.display = 'none';
    }, 250);
  } else {
    drawer.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      drawer.classList.add('is-active');
    }, 15);
  }
};

window.aeCloseMobileMenu = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  var drawer = document.getElementById('ae-mobile-drawer');
  if (!drawer) return;
  drawer.classList.remove('is-active');
  document.body.style.overflow = '';
  setTimeout(function() {
    drawer.style.display = 'none';
  }, 250);
};

// Bind events safely after load
(function() {
  function bindNavEvents() {
    var toggleBtn = document.getElementById('ae-mobile-toggle');
    var closeBtn = document.getElementById('ae-mobile-close');
    var backdrop = document.getElementById('ae-mobile-backdrop');

    if (toggleBtn) {
      toggleBtn.onclick = window.aeToggleMobileMenu;
    }

    if (closeBtn) {
      closeBtn.onclick = window.aeCloseMobileMenu;
    }

    if (backdrop) {
      backdrop.onclick = window.aeCloseMobileMenu;
    }

    var links = document.querySelectorAll('#ae-mobile-panel a');
    links.forEach(function(link) {
      link.addEventListener('click', window.aeCloseMobileMenu);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindNavEvents);
  } else {
    bindNavEvents();
  }
})();
