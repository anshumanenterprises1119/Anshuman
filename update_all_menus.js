const fs = require('fs');
const path = require('path');

const directory = __dirname;
const newLinks = `      <a href="projects.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">🏢 Projects</a>
      <a href="brands.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">🏷️ Brands</a>
      <a href="blog.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">📝 Blog</a>\n`;

let count = 0;

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(directory, file), 'utf8');
        
        // Skip if already updated
        if (content.includes('href="projects.html" style="color: #3d0e14')) {
            return;
        }
        
        // We look for services.html in the mobile side menu
        const targetStr = '<a href="services.html" style="color: #3d0e14; text-decoration: none; padding-bottom: 12px; border-bottom: 1px solid rgba(61,14,20,0.1);">⚙️ Services</a>';
        
        if (content.includes(targetStr)) {
            // Split and join to handle newlines correctly
            content = content.replace(targetStr, targetStr + '\n' + newLinks);
            fs.writeFileSync(path.join(directory, file), content, 'utf8');
            console.log(`✅ Menu Updated in: ${file}`);
            count++;
        }
    }
});

console.log(`\n🎉 Successfully updated navigation menus in ${count} files!`);
