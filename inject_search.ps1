$files = Get-ChildItem -Path "C:\Users\aditya tiwari\Downloads\ANSHU" -Filter *.html
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -notmatch "search.js") {
        $content = $content -replace "</body>", "<script src=`"search.js`" defer></script>`n</body>"
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated $($file.Name)"
    }
}
