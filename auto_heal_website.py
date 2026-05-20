import os
import re
import sys

# Reconfigure stdout to support UTF-8 prints on Windows terminals
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# 1. Comprehensive list of character encoding and emoji corruptions to heal
ENCODING_REPLACEMENTS = {
    'Ã‚©': '©',
    'Ã¢Â­Â': '⭐',
    '📍Â': '📍',
    '🛠 ï¸': '🛠️',
    'â “': '❓',
    '✉ï¸': '✉️',
    '🏠·ï¸': '🏠',
    '🏠 ·ï¸': '🏠',
    '🏠 ·ï¸': '🏠',
    '🏠·ï¸ ': '🏠 ',
    '🏠 ·ï¸ ': '🏠 ',
    'Â©': '©',
    'â€”': '—',
    'â€“': '–',
    'â­': '⭐',
    'Â·': '·',
    'Â ·': '·',
    'â•': '═',
    'â”': '─',
    '📍Â  ': '📍  ',
    '📍Â ': '📍 ',
    '✉️ï¸': '✉️',
    '📞Â': '📞',
    '🏢Â': '🏢',
    '📝Â': '📝',
    '🌐Â': '🌐',
    '⚙️Â': '⚙️',
    '✅Â': '✅',
    '💰Â': '💰',
    '🛡️Â': '🛡️',
    '🔧Â': '🔧',
    '🤝Â': '🤝',
    '🚚Â': '🚚',
    '📶Â': '📶',
}

# 2. Safe, common spelling corrections to auto-heal
SPELLING_REPLACEMENTS = {
    r'\brecieve\b': 'receive',
    r'\brecieving\b': 'receiving',
    r'\brecieves\b': 'receives',
    r'\bseperate\b': 'separate',
    r'\bseperately\b': 'separately',
    r'\bmaintainance\b': 'maintenance',
    r'\bprofessionaly\b': 'professionally',
    r'\buntill\b': 'until',
    r'\bcomming\b': 'coming',
    r'\bsucess\b': 'success',
    r'\bsucessful\b': 'successful',
    r'\bsucessfully\b': 'successfully',
    r'\binstalltion\b': 'installation',
    r'\binstalation\b': 'installation',
    r'\bsolutuon\b': 'solution',
    r'\bsolutuons\b': 'solutions',
    r'\belectical\b': 'electrical',
    r'\belecticaly\b': 'electrically',
    r'\bservise\b': 'service',
    r'\bservises\b': 'services',
    r'\bprodcut\b': 'product',
    r'\bprodcuts\b': 'products',
    r'\bcontracter\b': 'contractor',
    r'\bcontracters\b': 'contractors',
    r'\bsaftey\b': 'safety',
    r'\blihting\b': 'lighting',
    r'\blighing\b': 'lighting',
    r'\bligt\b': 'light',
    r'\bligts\b': 'lights',
    r'\bincorret\b': 'incorrect',
    r'\bdefinately\b': 'definitely',
    r'\boccured\b': 'occurred',
    r'\bocurred\b': 'occurred',
    r'\bneccessary\b': 'necessary',
    r'\bnecesary\b': 'necessary',
    r'\bwritting\b': 'writing',
    r'\brecomend\b': 'recommend',
    r'\brecomended\b': 'recommended',
    r'\bbuisness\b': 'business',
    r'\bbussiness\b': 'business',
    r'\bacrosss\b': 'across',
}

def heal_file(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    original_content = content
    healed_encodings = []
    healed_spellings = []
    
    # Apply encoding fixes
    for old, new in ENCODING_REPLACEMENTS.items():
        if old in content:
            content = content.replace(old, new)
            healed_encodings.append(f"Fixed encoding mismatch: '{old}' -> '{new}'")
            
    # Apply spelling fixes
    for pattern, correction in SPELLING_REPLACEMENTS.items():
        # Match case-insensitively but preserve case in replacement if possible
        # Simple implementation: direct replacement using regex
        compiled = re.compile(pattern, re.IGNORECASE)
        matches = compiled.findall(content)
        if matches:
            content = compiled.sub(correction, content)
            healed_spellings.append(f"Corrected typo '{matches[0]}' -> '{correction}' ({len(matches)} times)")
            
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, healed_encodings, healed_spellings
        
    return False, [], []

def main():
    folder = os.path.dirname(os.path.abspath(__file__))
    html_files = [f for f in os.listdir(folder) if f.endswith('.html')]
    
    print("="*60)
    print("      ANSHUMAN ENTERPRISES - AUTO-HEAL SCRIPT ACTIVE      ")
    print("="*60)
    print(f"Scanning directory: {folder}")
    print(f"Total HTML files found: {len(html_files)}\n")
    
    healed_files_count = 0
    
    for filename in html_files:
        path = os.path.join(folder, filename)
        was_healed, enc_fixes, spell_fixes = heal_file(path)
        
        if was_healed:
            healed_files_count += 1
            print(f"✔️ HEALED: {filename}")
            for fix in enc_fixes:
                print(f"   [Encoding] {fix}")
            for fix in spell_fixes:
                print(f"   [Spelling] {fix}")
            print("-" * 50)
            
    print("="*60)
    if healed_files_count > 0:
        print(f"Scan complete. Automatically healed {healed_files_count} file(s)!")
    else:
        print("Scan complete. Zero errors found! All emojis and spellings are perfect.")
    print("="*60)

if __name__ == '__main__':
    main()
