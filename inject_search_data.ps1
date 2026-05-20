$directory = "C:\Users\aditya tiwari\Downloads\ANSHU"
$files = Get-ChildItem -Path $directory -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    # Check if search_data.js is already present
    if ($content -notmatch "search_data.js") {
        # Check if search.js is present
        if ($content -match '<script src="search.js" defer></script>') {
            $content = $content -replace '<script src="search.js" defer></script>', "<script src=`"search_data.js`" defer></script>`n    <script src=`"search.js`" defer></script>"
            $changed = $true
        } else {
            # Inject both before </body>
            $content = $content -replace "</body>", "<script src=`"search_data.js`" defer></script>`n    <script src=`"search.js`" defer></script>`n</body>"
            $changed = $true
        }
    }
    
    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Updated $($file.Name) with search_data.js script tag."
    } else {
        Write-Host "No changes needed for $($file.Name)."
    }
}
