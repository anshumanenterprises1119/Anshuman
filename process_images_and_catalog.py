import os
import sys
import subprocess
import shutil
import re

# 1. Automatically install Pillow if not present
try:
    from PIL import Image
except ImportError:
    print("Pillow library not found. Installing Pillow...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image
    except Exception as e:
        print(f"Error installing Pillow: {e}")
        print("Please run 'pip install Pillow' manually and run this script again.")
        sys.exit(1)

workspace_dir = os.path.dirname(os.path.abspath(__file__))
products_dir = os.path.join(workspace_dir, "images", "products")
gallery_dir = os.path.join(workspace_dir, "images", "gallery")

# Create directories if they do not exist
os.makedirs(products_dir, exist_ok=True)
os.makedirs(gallery_dir, exist_ok=True)

# 2. Mappings for the user's uploaded images in root to their SEO-optimized versions in images/products/
upload_mappings = {
    "Orient Batten Light 2 Feet 20W.jfif": "orient-led-batten-light-2ft-20w.webp",
    "Orient Batten Light 4 Feet 20W.jpg": "orient-led-batten-light-4ft-20w.webp",
    "Orient Batten Light 2 Feet 10W.webp": "orient-led-batten-light-2ft-10w.webp",
    "2-modular-box.webp": "galvanized-iron-2-modular-switch-box.webp",
    "3-modular-box.jfif": "galvanized-iron-3-modular-switch-box.webp",
    "4-modular-box.webp": "galvanized-iron-4-modular-switch-box.webp",
    "6-modular-box.webp": "galvanized-iron-6-modular-switch-box.webp",
    "8-modular-box square": "galvanized-iron-8-modular-square-switch-box.webp",
    "8-modular-box.jpg": "galvanized-iron-8-modular-rectangular-switch-box.webp",
    "12-modular-box.webp": "galvanized-iron-12-modular-switch-box.webp",
    "INDEANA PIPE HEAVY 25MM.jfif": "indeana-heavy-duty-pvc-conduit-pipe-25mm.webp",
    "indeana-pipe-20mm-medium.jfif": "indeana-medium-duty-pvc-conduit-pipe-20mm.webp",
    "indeana-pipe-25 mm-medium.webp": "indeana-medium-duty-pvc-conduit-pipe-25mm.webp",
    "indeana-band-25mm.jfif": "indeana-pvc-conduit-bend-band-25mm.webp",
    "indeana-band-20mm-medium.jpg": "indeana-medium-pvc-conduit-bend-band-20mm.webp",
    "Indeana PVC Band 25mm Heavy Duty (indeana-band-25mm-heavy).jfif": "indeana-heavy-pvc-conduit-bend-band-25mm.webp",
    "fan-box-heavy 700 gram.jfif": "ceiling-fan-junction-box-heavy-duty-700g.webp",
    "concealed-box-heavy.jpg": "concealed-ceiling-junction-box-heavy-duty.webp",
    "fan-box-medium 500 gram.webp": "ceiling-fan-junction-box-medium-duty-500g.webp",
    "concealed-box-medium. 180 gram.jpg": "concealed-ceiling-junction-box-medium-duty-180g.webp",
    "flexible-pipe-20mm.jpg": "pvc-flexible-corrugated-conduit-pipe-20mm.webp",
    "fan-rod-12-inch.webp": "ceiling-fan-downrod-iron-12-inch.webp",
    "tee-cover.jfif": "pvc-conduit-tee-connection-cover.webp",
    "Ceiling Fan Canopy  Cover (fan-cover).jpg": "ceiling-fan-canopy-replacement-cover.webp",
    "screw-0.75-inch.jfif": "premium-threaded-mounting-screws-0-75-inch.webp",
    "screw-1-inch.png": "premium-threaded-mounting-screws-1-inch.webp",
    "screw-1.5-inch.webp": "premium-threaded-mounting-screws-1-5-inch.webp",
    "screw-2-inch.webp": "premium-threaded-mounting-screws-2-inch.webp",
    "screw-2.5 inch.jpeg": "premium-threaded-mounting-screws-2-5-inch.webp",
    "screw-3.jfif": "premium-threaded-mounting-screws-3-inch.webp",
    "pvc-saddle 25mm.webp": "pvc-conduit-pipe-saddle-clamp-25mm.webp",
    "padilite steel grip insutlation tape.webp": "steelgrip-pvc-insulation-tape-pidilite.webp",
    "Thermocol-Sheets-For-Roof-Insulation 50mm.webp": "thermocol-sheets-roof-insulation-50mm.webp",
    "masking-tape.webp": "high-adhesion-masking-tape.webp",
    "self drelling screw 1 inch.jpg": "self-drilling-metal-screws-1-inch.webp",
    "self-drilling-screw 1.5 inch.webp": "self-drilling-metal-screws-1-5-inch.webp",
    "self-drilling-screw-2-inch.jpg": "self-drilling-metal-screws-2-inch.webp",
    "heatex-5kg.jfif": "heatex-adhesive-seal-bond-compound-5kg.webp",
    "keel-1x14-spn.jfif": "concrete-nails-keel-1-inch-14-spn.webp",
    "keel-1-5x14-spn.jfif": "concrete-nails-keel-1-5-inch-14-spn.webp",
    "wall-fix-bond-50g.webp": "wall-fix-rapid-adhesive-bond-50g.webp",
    "wall-fix-bond-18g.jfif": "wall-fix-rapid-adhesive-bond-18g.webp",
    "araldite-1-8kg.webp": "araldite-standard-epoxy-adhesive-1-8kg.webp",
    "zypsem-screw-3-4-white.webp": "zypsem-drywall-screws-3-4-inch-white.webp",
    "wood-cutter-blade-5-30-bosch.webp": "bosch-wood-cutter-circular-saw-blade-5-inch-30t.webp",
    "wood-cutter-blade-4-30-bosch.jfif": "bosch-wood-cutter-circular-saw-blade-4-inch-30t.webp",
    "sattring-keel-1-inch.jfif": "shuttering-concrete-nails-1-inch.webp",
    "sattring-keel-2-inch.jfif": "shuttering-concrete-nails-2-inch.webp",
    "sattring-keel-3-inch.jfif": "shuttering-concrete-nails-3-inch.webp",
    "sattring-keel-4-inch.jfif": "shuttering-concrete-nails-4-inch.webp"
}

# 3. Mappings for the old banner images in root to images/gallery/ with SEO names
banner_mappings = {
    "20798.webp": "fr-frls-house-wiring-cables-wholesale.webp",
    "20859.webp": "electrical-wholesale-distributor-background.webp",
    "20860.webp": "modern-interior-lighting-solutions.webp",
    "20862.webp": "solar-and-electrical-cables-display.webp",
    "20863.webp": "cctv-dvr-camera-security-kit.webp",
    "20864.webp": "mcb-distribution-board-electrical.webp",
    "20865.webp": "led-strip-ceiling-lighting-design.webp",
    "20866.webp": "premium-modular-switch-gold-frame.webp",
    "20867.webp": "premium-modular-electrical-switch.webp",
    "20868.webp": "cctv-security-camera-installation.webp",
    "20869.webp": "mcb-breaker-panel-installation.webp",
    "20870.webp": "pvc-conduit-pipes-fittings.webp"
}

# Normalize case and whitespace of root directory files
root_files = os.listdir(workspace_dir)
root_files_normalized = {f.lower().strip(): f for f in root_files}

print("--- Processing & Converting Product Images ---")
for src_name, dest_name in upload_mappings.items():
    src_norm = src_name.lower().strip()
    if src_norm in root_files_normalized:
        actual_filename = root_files_normalized[src_norm]
        src_path = os.path.join(workspace_dir, actual_filename)
        dest_path = os.path.join(products_dir, dest_name)
        
        try:
            print(f"Converting: {actual_filename} -> images/products/{dest_name}")
            with Image.open(src_path) as img:
                # Convert to RGB if it has alpha channel (for PNG/WEBP to WEBP conversion) or is CMYK
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img = img.convert('RGBA')
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(dest_path, "WEBP", quality=90)
            
            # Remove original file from root
            os.remove(src_path)
        except Exception as e:
            print(f"Error processing {actual_filename}: {e}")
    else:
        print(f"Skipping (not found in root): {src_name}")

print("\n--- Processing & Converting Banner Images ---")
for src_name, dest_name in banner_mappings.items():
    src_norm = src_name.lower().strip()
    if src_norm in root_files_normalized:
        actual_filename = root_files_normalized[src_norm]
        src_path = os.path.join(workspace_dir, actual_filename)
        dest_path = os.path.join(gallery_dir, dest_name)
        
        try:
            print(f"Moving Banner: {actual_filename} -> images/gallery/{dest_name}")
            # The file is already webp, so we can just copy/move it
            shutil.copy2(src_path, dest_path)
            os.remove(src_path)
        except Exception as e:
            print(f"Error processing banner {actual_filename}: {e}")

# Delete unreferenced duplicate files in root
duplicates_to_delete = [
    "20798-1.webp", "20859-1.webp", "20860-1.webp", "20861.webp", "20861-1.webp"
]
print("\n--- Cleaning Up Unreferenced Duplicates ---")
for f in duplicates_to_delete:
    f_norm = f.lower().strip()
    if f_norm in root_files_normalized:
        actual_filename = root_files_normalized[f_norm]
        try:
            print(f"Deleting duplicate: {actual_filename}")
            os.remove(os.path.join(workspace_dir, actual_filename))
        except Exception as e:
            print(f"Error deleting {actual_filename}: {e}")

# 4. Products to delete (those that do not have images)
products_to_remove = [
    "Socket",
    "Fan box light 500G",
    "KEEL 2*14 SPN",
    "WALL CUTTER BLADE 4 INCH BOSCH",
    "WALL CUTTER BLADE 5 INCH BOSCH"
]

def remove_card_by_name(html_content, product_name):
    # Find the h4 tag containing the product name
    pattern = re.compile(rf'<h4\s+[^>]*>\s*{re.escape(product_name)}\s*</h4>', re.IGNORECASE)
    match = pattern.search(html_content)
    if not match:
        return html_content
    
    h4_start = match.start()
    # Trace backward to find the starting <div class="prod-static-card"
    card_start = html_content.rfind('<div class="prod-static-card"', 0, h4_start)
    if card_start == -1:
        return html_content
        
    # Trace forward to find the matching closing </div> of the card by tracking nesting depth
    div_balance = 0
    pos = card_start
    card_end = -1
    while pos < len(html_content):
        if html_content[pos:pos+4] == '<div':
            div_balance += 1
            pos += 4
        elif html_content[pos:pos+6] == '</div>':
            div_balance -= 1
            pos += 6
            if div_balance == 0:
                card_end = pos
                break
        else:
            pos += 1
            
    if card_end != -1:
        print(f"Removed HTML product card for: {product_name}")
        return html_content[:card_start] + html_content[card_end:]
    return html_content

# 5. Update products.html
products_html_path = os.path.join(workspace_dir, "products.html")
if os.path.exists(products_html_path):
    print("\n--- Updating products.html ---")
    with open(products_html_path, "r", encoding="utf-8", errors="ignore") as f:
        html_content = f.read()

    # Remove the cards of the 5 missing products
    for prod_name in products_to_remove:
        html_content = remove_card_by_name(html_content, prod_name)

    # Replace old product image paths with new SEO-optimized image paths
    # (e.g. images/products/2-modular-box.webp -> images/products/galvanized-iron-2-modular-switch-box.webp)
    for old_img, new_img in upload_mappings.items():
        # Match both with/without folder name in case some are referenced differently
        old_base = os.path.splitext(old_img)[0]
        # In HTML, the template refers to the old webp filenames under images/products/
        old_ref = f"images/products/{old_base}.webp"
        new_ref = f"images/products/{new_img}"
        if old_ref in html_content:
            html_content = html_content.replace(old_ref, new_ref)
            print(f"Updated reference: {old_ref} -> {new_ref}")

    # Replace old banner image paths with new SEO-optimized banner paths
    for old_banner, new_banner in banner_mappings.items():
        if f'"{old_banner}"' in html_content:
            html_content = html_content.replace(f'"{old_banner}"', f'"images/gallery/{new_banner}"')
            print(f"Updated banner: {old_banner} -> images/gallery/{new_banner}")
        if f"'{old_banner}'" in html_content:
            html_content = html_content.replace(f"'{old_banner}'", f"'images/gallery/{new_banner}'")
            print(f"Updated banner: {old_banner} -> images/gallery/{new_banner}")

    with open(products_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print("products.html updated successfully!")

# 6. Update index.html
index_html_path = os.path.join(workspace_dir, "index.html")
if os.path.exists(index_html_path):
    print("\n--- Updating index.html ---")
    with open(index_html_path, "r", encoding="utf-8", errors="ignore") as f:
        index_content = f.read()

    for old_banner, new_banner in banner_mappings.items():
        if f'"{old_banner}"' in index_content:
            index_content = index_content.replace(f'"{old_banner}"', f'"images/gallery/{new_banner}"')
            print(f"Updated banner in index.html: {old_banner} -> images/gallery/{new_banner}")
        if f"'{old_banner}'" in index_content:
            index_content = index_content.replace(f"'{old_banner}'", f"'images/gallery/{new_banner}'")
            print(f"Updated banner in index.html: {old_banner} -> images/gallery/{new_banner}")

    with open(index_html_path, "w", encoding="utf-8") as f:
        f.write(index_content)
    print("index.html updated successfully!")

# 7. Update build_products_html.js
js_path = os.path.join(workspace_dir, "build_products_html.js")
if os.path.exists(js_path):
    print("\n--- Updating build_products_html.js ---")
    with open(js_path, "r", encoding="utf-8") as f:
        js_lines = f.readlines()

    new_js_lines = []
    for line in js_lines:
        # Check if line contains any product to remove
        should_keep = True
        for prod in products_to_remove:
            if f"name: '{prod}'" in line or f'name: "{prod}"' in line:
                should_keep = False
                print(f"Removed product from JS database: {prod}")
                break
        
        if should_keep:
            # Check if this line defines a product image and needs a filename update
            for old_img, new_img in upload_mappings.items():
                old_base = os.path.splitext(old_img)[0]
                old_webp_val = f"image: '{old_base}.webp'"
                new_webp_val = f"image: '{new_img}'"
                if old_webp_val in line:
                    line = line.replace(old_webp_val, new_webp_val)
                    print(f"Updated JS image path: {old_webp_val} -> {new_webp_val}")
            new_js_lines.append(line)

    with open(js_path, "w", encoding="utf-8") as f:
        f.writelines(new_js_lines)
    print("build_products_html.js updated successfully!")

# 8. Update gallery_data.json
gallery_path = os.path.join(workspace_dir, "gallery_data.json")
if os.path.exists(gallery_path):
    print("\n--- Updating gallery_data.json ---")
    with open(gallery_path, "r", encoding="utf-8") as f:
        gallery_content = f.read()

    # Replace old gallery links with the new webp gallery links
    gallery_replacements = {
        "images/gallery/20862.jpg": "images/gallery/solar-and-electrical-cables-display.webp",
        "images/gallery/20863.jpg": "images/gallery/cctv-dvr-camera-security-kit.webp"
    }

    for old_val, new_val in gallery_replacements.items():
        if old_val in gallery_content:
            gallery_content = gallery_content.replace(old_val, new_val)
            print(f"Updated gallery item: {old_val} -> {new_val}")

    with open(gallery_path, "w", encoding="utf-8") as f:
        f.write(gallery_content)
    print("gallery_data.json updated successfully!")

print("\n==============================================")
print("IMAGE PROCESSING & CATALOG OPTIMIZATION DONE!")
print("==============================================")
