const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newNavHtml = `  <!-- NEW NAVIGATION START -->
  <nav>
    <div class="nav-inner" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 5%;">
      <a href="index.html" class="nav-logo" style="text-decoration: none; display: flex; align-items: center;">
        <img src="logo.webp" alt="Anshuman Enterprises Logo" style="height: 50px; width: auto; object-fit: contain;">
      </a>
      <button id="mobile-menu-btn" style="background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; display: flex; align-items: center;">
        &#9776; <!-- Hamburger Icon -->
      </button>
    </div>
  </nav>

  <!-- FULL SCREEN MENU -->
  <div id="full-screen-menu" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(61, 14, 20, 0.98); z-index: 9999; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
    <button id="close-menu-btn" style="position: absolute; top: 20px; right: 5%; background: none; border: none; color: #c9a84c; font-size: 40px; cursor: pointer;">&times;</button>
    
    <div style="display: flex; flex-direction: column; gap: 24px; text-align: center; font-size: 24px; font-weight: 500; font-family: 'DM Sans', sans-serif;">
      <a href="index.html" style="color: #fff; text-decoration: none; transition: color 0.3s;">Home</a>
      <a href="products.html" style="color: #fff; text-decoration: none; transition: color 0.3s;">Products</a>
      <a href="services.html" style="color: #fff; text-decoration: none; transition: color 0.3s;">Services</a>
      <a href="faq.html" style="color: #fff; text-decoration: none; transition: color 0.3s;">FAQ</a>
      <a href="about.html" style="color: #fff; text-decoration: none; transition: color 0.3s;">About Us</a>
      <a href="contact.html" style="color: #fff; text-decoration: none; transition: color 0.3s;">Contact</a>
    </div>

    <div style="margin-top: 40px; display: flex; flex-direction: column; gap: 16px; align-items: center;">
      <a href="https://wa.me/917065815743?text=Hello%20Anshuman%20Enterprises" style="background: #fff; color: #3d0e14; border: 2px solid #c9a84c; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px;">
        💬 WhatsApp Us
      </a>
      <a href="tel:+917065815743" style="background: #c9a84c; color: #3d0e14; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px;">
        📞 Call Now
      </a>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const menuBtn = document.getElementById("mobile-menu-btn");
      const closeBtn = document.getElementById("close-menu-btn");
      const fullMenu = document.getElementById("full-screen-menu");
      const menuLinks = fullMenu.querySelectorAll("a");

      if (menuBtn && closeBtn && fullMenu) {
        menuBtn.addEventListener("click", () => {
          fullMenu.style.display = "flex";
          document.body.style.overflow = "hidden"; // Prevent scrolling
        });

        closeBtn.addEventListener("click", () => {
          fullMenu.style.display = "none";
          document.body.style.overflow = "auto";
        });

        // Close menu when a link is clicked
        menuLinks.forEach(link => {
          link.addEventListener("click", () => {
            fullMenu.style.display = "none";
            document.body.style.overflow = "auto";
          });
        });
      }
    });
  </script>
  <!-- NEW NAVIGATION END -->`;

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the existing <nav> block
  // We use regex to match <nav> to </nav>
  const navRegex = /<nav>[\s\S]*?<\/nav>/;
  
  if (navRegex.test(content)) {
    // Replace the old nav block with the new one
    content = content.replace(navRegex, newNavHtml);
    
    // Some pages might already have multiple script tags for the menu added from previous runs, we can clean them up if needed, but replace is safe for the main nav block.
    // Ensure we don't duplicate the mobile menu block if it was already added by a previous run
    if (content.indexOf('<!-- NEW NAVIGATION START -->') !== content.lastIndexOf('<!-- NEW NAVIGATION START -->')) {
        // If there are multiple, it means we ran the script before, so we skip adding it again to avoid duplication
        console.log(`Skipping ${file} as it seems to already have the new nav.`);
        continue;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated navigation in: ${file}`);
    updatedCount++;
  }
}

console.log(`\nSuccessfully updated navigation on ${updatedCount} pages!`);
