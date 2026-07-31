/* Anshuman Enterprises - Responsive UI & Mobile Drawer Handler */
(function() {
  function initMobileNav() {
    var toggleBtn = document.getElementById('ae-mobile-toggle');
    var drawer = document.getElementById('ae-mobile-drawer');
    var closeBtn = document.getElementById('ae-mobile-close');
    var backdrop = document.getElementById('ae-mobile-backdrop');

    if (!toggleBtn || !drawer) return;

    function openDrawer() {
      drawer.style.display = 'block';
      setTimeout(function() {
        drawer.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }, 10);
    }

    function closeDrawer() {
      drawer.classList.remove('is-active');
      document.body.style.overflow = '';
      setTimeout(function() {
        drawer.style.display = 'none';
      }, 300);
    }

    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (drawer.classList.contains('is-active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Close on link click
    var drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(function(link) {
      link.addEventListener('click', closeDrawer);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
