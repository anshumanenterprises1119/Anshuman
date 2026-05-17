const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newNavHtml = `  <!-- NEW NAVIGATION START -->
  <nav>
    <div class="nav-inner" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 5%; background: var(--maroon-dark, #3d0e14);">
      <a href="index.html" class="nav-logo" style="text-decoration: none; display: flex; align-items: center;">
        <img src="logo.webp" alt="Anshuman Enterprises Logo" style="height: 50px; width: auto; object-fit: contain;">
      </a>
      <button id="mobile-menu-btn" style="background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; display: flex; align-items: center; z-index: 10001;">
        &#9776;
      </button>
    </div>
  </nav>

  <!-- SIDE SLIDING MENU -->
  <div id="menu-backdrop" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0,0,0,0.6); z-index: 9998; opacity: 0; transition: opacity 0.3s ease;"></div>
  
  <div id="side-menu" style="position: fixed; top: 0; right: -320px; width: 300px; max-width: 85%; height: 100vh; background: #faf7f2; z-index: 9999; display: flex; flex-direction: column; padding: 30px 20px; box-shadow: -5px 0 25px rgba(0,0,0,0.2); transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1); overflow-y: auto;">
    
    <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
      <button id="close-menu-btn" style="background: none; border: none; color: #3d0e14; font-size: 36px; cursor: pointer; line-height: 1;">&times;</button>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 18px; font-size: 20px; font-weight: 600; font-family: 'DM Sans', sans-serif;">
      <a href="index.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">🏠 Home</a>
      <a href="products.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">📦 Products</a>
      <a href="services.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">⚙️ Services</a>
      <a href="faq.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">❓ FAQ</a>
      <a href="about.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">🏢 About Us</a>
      <a href="contact.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">📍 Contact</a>
    </div>

    <div style="margin-top: auto; padding-top: 40px; display: flex; flex-direction: column; gap: 16px;">
      <a href="https://wa.me/917065815743?text=Hello%20Anshuman%20Enterprises" style="background: #25D366; color: #fff; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 10px rgba(37,211,102,0.3);">
        💬 WhatsApp Us
      </a>
      <a href="tel:+917065815743" style="background: #3d0e14; color: #c9a84c; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 10px rgba(61,14,20,0.2);">
        📞 Call Now
      </a>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const menuBtn = document.getElementById("mobile-menu-btn");
      const closeBtn = document.getElementById("close-menu-btn");
      const sideMenu = document.getElementById("side-menu");
      const backdrop = document.getElementById("menu-backdrop");
      const menuLinks = sideMenu.querySelectorAll("a");

      function openMenu() {
        backdrop.style.display = "block";
        setTimeout(() => {
          backdrop.style.opacity = "1";
          sideMenu.style.right = "0";
        }, 10);
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      }

      function closeMenu() {
        sideMenu.style.right = "-320px";
        backdrop.style.opacity = "0";
        setTimeout(() => {
          backdrop.style.display = "none";
        }, 400); // Wait for transition
        document.body.style.overflow = "auto";
      }

      if (menuBtn && closeBtn && sideMenu && backdrop) {
        menuBtn.addEventListener("click", openMenu);
        closeBtn.addEventListener("click", closeMenu);
        backdrop.addEventListener("click", closeMenu);

        // Close menu when a link is clicked
        menuLinks.forEach(link => {
          link.addEventListener("click", closeMenu);
        });
      }
    });
  </script>
  <!-- NEW NAVIGATION END -->`;

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We need to replace the old block injected by update_nav.js
  // It starts with <!-- NEW NAVIGATION START --> and ends with <!-- NEW NAVIGATION END -->
  const oldNavRegex = /<!-- NEW NAVIGATION START -->[\s\S]*?<!-- NEW NAVIGATION END -->/;
  
  if (oldNavRegex.test(content)) {
    content = content.replace(oldNavRegex, newNavHtml);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated to side-menu in: ${file}`);
    updatedCount++;
  } else {
    // If it doesn't have the NEW NAVIGATION block, maybe it has the old <nav> block
    const pureNavRegex = /<nav>[\s\S]*?<\/nav>/;
    if (pureNavRegex.test(content)) {
        content = content.replace(pureNavRegex, newNavHtml);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated to side-menu (from pure nav) in: ${file}`);
        updatedCount++;
    }
  }
}

console.log(`\nSuccessfully injected side-sliding menu on ${updatedCount} pages!`);
