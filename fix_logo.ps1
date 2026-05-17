# fix_logo.ps1
$indexFile = "c:\Users\aditya tiwari\Downloads\index.html"
$aboutFile = "c:\Users\aditya tiwari\Downloads\about.html"

$newLogo = '<a href="index.html" class="nav-logo"><img loading="lazy" src="logo.webp" alt="Anshuman Enterprises" style="height:40px;width:40px;object-fit:contain;border-radius:6px;background:#fff;"></a>'

$navLinks = @"
    <div class="nav-links">
      <a href="index.html" class="active">Home</a>
      <a href="products.html">Products</a>
      <a href="about.html">About Us</a>
      <a href="contact.html">Contact</a>
    </div>
"@

# Define the CSS to fix the navigation links color and hover states in index.html
$navCss = @"
    .nav-links { display: flex; align-items: center; gap: 4px; }
    .nav-links a {
      color: rgba(255,255,255,0.75); text-decoration: none; font-size: 13px; font-weight: 500;
      padding: 6px 12px; border-radius: 50px; transition: all 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { color: #fff; background: rgba(255,255,255,0.12); }
"@

function Fix-HtmlFile {
    param([string]$filePath, [bool]$isIndex)
    
    Write-Host "Processing $filePath..."
    $content = [System.IO.File]::ReadAllText($filePath)
    
    # Use regex to find the nav-logo anchor tag and replace its entire content
    # This matches <a ... class="nav-logo"> followed by anything (non-greedy) until </a>
    # The Singleline flag (?s) makes . match newlines
    $regex = '(?s)<a href="index\.html" class="nav-logo">.*?</a>'
    
    if ($content -match $regex) {
        Write-Host "Found logo in $filePath. Replacing..."
        $content = $content -replace $regex, $newLogo
    } else {
        Write-Host "Could not find logo regex match in $filePath."
    }

    # For index.html, also inject the missing nav-links if they aren't there
    if ($isIndex -and $content -notmatch 'class="nav-links"') {
        Write-Host "Injecting nav-links into index.html..."
        # Inject after the newly placed nav-logo
        $content = $content -replace '(<a href="index\.html" class="nav-logo">.*?</a>)', "`$1`n$navLinks"
        
        # Also inject the CSS into the <style> block
        if ($content -match '</style>') {
            $content = $content -replace '(?s)(/\* NAV \*/.*?)(?=})', "`$1`n$navCss`n    "
        }
    }

    [System.IO.File]::WriteAllText($filePath, $content)
    Write-Host "Done with $filePath."
}

Fix-HtmlFile -filePath $indexFile -isIndex $true
Fix-HtmlFile -filePath $aboutFile -isIndex $false
