const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;
const outputFilePath = path.join(directoryPath, 'search_data.js');

function stripTags(html) {
    // Remove unwanted blocks entirely
    let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    clean = clean.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');
    clean = clean.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ');
    clean = clean.replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, ' ');
    
    // Replace block elements with spaces to prevent words from merging
    clean = clean.replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|ul|ol|section|article)>/gi, ' ');
    
    // Remove all remaining HTML tags
    clean = clean.replace(/<\/?[^>]+(>|$)/g, ' ');
    
    // Clean up whitespace and newlines
    clean = clean.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    
    return clean;
}

function getTitle(html) {
    const match = html.match(/<title>([^<]*)<\/title>/i);
    return match ? match[1].replace(' | Anshuman Enterprises', '').trim() : '';
}

function buildIndex() {
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.html'));
    const index = [];

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const html = fs.readFileSync(filePath, 'utf8');
        
        const title = getTitle(html);
        const textContent = stripTags(html);
        
        // Determine type based on filename for UX categorization
        let type = 'Page';
        if (file.includes('guide') || file.includes('solution') || file.includes('tips') || file.includes('maintenance')) {
            type = 'Guide';
        } else if (html.includes('products.html') && file !== 'products.html' && file !== 'index.html' && file !== 'blog.html' && !type.includes('Guide')) {
            type = 'Product/Service'; // Simplified heuristic
        }

        index.push({
            url: file,
            title: title || file,
            type: type,
            content: textContent
        });
    });

    const jsOutput = `const globalSearchData = ${JSON.stringify(index)};`;
    fs.writeFileSync(outputFilePath, jsOutput);
    console.log(`Successfully built search index containing ${index.length} pages.`);
}

buildIndex();
