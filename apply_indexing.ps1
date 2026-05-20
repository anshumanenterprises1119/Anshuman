$htmlFiles = Get-ChildItem -Filter *.html -Path .
$robotsTag = "`n    <meta name=`"robots`" content=`"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`">`n</head>"

$modifiedHtmlCount = 0

# 1. Inject Robots Meta Tag into HTML files
Write-Host "Updating HTML pages with indexing tags..."
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if robots tag already exists
    if ($content -notmatch 'name="robots"') {
        # Insert robots tag before </head>
        $newContent = $content -replace '</head>', $robotsTag
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "Added indexing tags to: $($file.Name)"
        $modifiedHtmlCount++
    } else {
        Write-Host "Indexing tags already exist in: $($file.Name)"
    }
}

# 2. Update Sitemap dates
Write-Host "`nUpdating sitemap.xml..."
$sitemapPath = ".\sitemap.xml"
if (Test-Path $sitemapPath) {
    $sitemapContent = Get-Content $sitemapPath -Raw
    $todayDate = (Get-Date).ToString("yyyy-MM-dd")
    
    # Use regex to replace all existing dates with today's date
    $newSitemapContent = [regex]::Replace($sitemapContent, '<lastmod>.*?</lastmod>', "<lastmod>$todayDate</lastmod>")
    
    Set-Content -Path $sitemapPath -Value $newSitemapContent -Encoding UTF8
    Write-Host "Updated sitemap.xml with today's date ($todayDate) for all pages."
} else {
    Write-Host "sitemap.xml not found!"
}

Write-Host "`nIndexing Update Complete! Modified $modifiedHtmlCount HTML files and the sitemap."
Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
