$destDir = "d:\Downloads\ANSHU\images\brands"
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir
}

$logos = @{
    "polycab" = "https://upload.wikimedia.org/wikipedia/commons/e/e3/Polycab_India_logo.png"
    "havells" = "https://upload.wikimedia.org/wikipedia/commons/1/18/Havells_Logo.svg"
    "kei" = "https://upload.wikimedia.org/wikipedia/commons/e/e0/20-09-41-logo.png"
    "anchor" = "https://upload.wikimedia.org/wikipedia/commons/e/ee/Panasonic_logo.svg"
    "orient" = "https://upload.wikimedia.org/wikipedia/commons/c/cd/Orient_Electric_logo.svg"
    "bosch" = "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch_logo.svg"
    "araldite" = "https://www.aralditeadhesives.ca/images/araldite-logo.png"
    "greatwhite" = "https://greatwhite.life/wp-content/uploads/2020/07/logo.png"
    "paras" = "https://parasrod.com/images/logo.png"
    "legrand" = "https://upload.wikimedia.org/wikipedia/commons/c/c9/Legrand_logo.svg"
    "hikvision" = "https://upload.wikimedia.org/wikipedia/commons/9/91/Hikvision_logo.svg"
    "surya" = "https://upload.wikimedia.org/wikipedia/commons/e/e4/Surya-brand.png"
}

# User-Agent to bypass security filters
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

Write-Host "===================================================="
Write-Host "  ANSHUMAN ENTERPRISES - POWERSHELL LOGO DOWNLOADER"
Write-Host "===================================================="
Write-Host ""

foreach ($key in $logos.Keys) {
    $url = $logos[$key]
    $ext = $url.Substring($url.LastIndexOf('.'))
    $filepath = Join-Path $destDir "$key$ext"
    
    Write-Host "Downloading $key logo from $url..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $filepath -UserAgent $ua -ErrorAction Stop
        Write-Host "[OK] Downloaded: $key$ext"
    } catch {
        Write-Host "[ERROR] Failed to download $key logo: $_"
        
        # Try Clearbit as a fallback if Wikimedia fails
        if ($key -ne "araldite" -and $key -ne "paras" -and $key -ne "greatwhite") {
            $domain = ""
            switch ($key) {
                "polycab" { $domain = "polycab.com" }
                "havells" { $domain = "havells.com" }
                "kei" { $domain = "kei-ind.com" }
                "anchor" { $domain = "panasonic.com" }
                "orient" { $domain = "orientelectric.com" }
                "bosch" { $domain = "bosch.com" }
                "legrand" { $domain = "legrand.com" }
                "hikvision" { $domain = "hikvision.com" }
                "surya" { $domain = "surya.co.in" }
            }
            if ($domain -ne "") {
                $fallbackUrl = "https://logo.clearbit.com/$domain"
                $filepathPng = Join-Path $destDir "$key.png"
                Write-Host "  [TRYING FALLBACK] Attempting Clearbit for $domain..."
                try {
                    Invoke-WebRequest -Uri $fallbackUrl -OutFile $filepathPng -UserAgent $ua -ErrorAction Stop
                    Write-Host "  [OK] Downloaded fallback: $key.png"
                } catch {
                    Write-Host "  [ERROR] Fallback failed: $_"
                }
            }
        }
    }
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "===================================================="
Write-Host "  Branding download process completed."
Write-Host "===================================================="
