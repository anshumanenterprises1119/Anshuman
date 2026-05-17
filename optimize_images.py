import os
import glob
import re
try:
    from PIL import Image
except ImportError:
    print("Please install Pillow by running: pip install Pillow")
    exit(1)

def convert_to_webp():
    print("Converting images to WebP...")
    image_files = []
    for ext in ('*.jpg', '*.jpeg', '*.png'):
        image_files.extend(glob.glob(ext))
    
    for img_path in image_files:
        if img_path.endswith('.webp'):
            continue
        try:
            with Image.open(img_path) as img:
                webp_path = os.path.splitext(img_path)[0] + '.webp'
                # Convert and save as webp
                img.save(webp_path, 'webp', quality=85)
                print(f"Converted {img_path} to {webp_path}")
        except Exception as e:
            print(f"Error converting {img_path}: {e}")

def update_html_files():
    print("\nUpdating HTML files...")
    html_files = glob.glob('*.html')
    
    # Regex to find img tags
    img_tag_pattern = re.compile(r'(<img\b[^>]*>)', re.IGNORECASE)
    
    # Regex to find src attributes with jpg/jpeg/png
    src_ext_pattern = re.compile(r'(src=["\'][^"\']*\.)(jpg|jpeg|png)(["\'])', re.IGNORECASE)
    
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        def process_img_tag(match):
            tag = match.group(1)
            
            # Replace extensions in src
            tag = src_ext_pattern.sub(r'\1webp\3', tag)
            
            # Inject loading="lazy" if not present
            if 'loading="lazy"' not in tag.lower():
                # Insert loading="lazy" after <img
                tag = tag.replace('<img', '<img loading="lazy"', 1)
                
            # Add alt tag if not present
            if 'alt=' not in tag.lower():
                tag = tag.replace('<img', '<img alt="Anshuman Enterprises Product"', 1)
                
            return tag
            
        content = img_tag_pattern.sub(process_img_tag, content)
        
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {html_file}")

if __name__ == '__main__':
    convert_to_webp()
    update_html_files()
    print("\nDone! All images converted to WebP and HTML files updated with lazy loading and alt tags.")
