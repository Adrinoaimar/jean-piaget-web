#!/bin/sh
# Cloudflare Pages: publish only the institutional site, never admin or backend.
set -eu
rm -rf dist
mkdir -p dist
for page in index nosotros niveles admision contacto galeria vida-escolar innovacion jean-piaget taller-familiar privacidad terminos tambogrande 404; do
  cp "$page.html" dist/
done
cp -R img fonts dist/
mkdir -p dist/css dist/js
for file in styles creative brand fonts school-photos family-landing; do cp "css/$file.css" dist/css/; done
for file in main form-config family-landing metrics; do cp "js/$file.js" dist/js/; done
for file in robots.txt sitemap.xml _headers _routes.json datos-institucionales.json contacto.vcf; do
  if [ -f "$file" ]; then cp "$file" dist/; fi
done
# Search Console verification files are public by design.
for file in google*.html; do
  if [ -f "$file" ]; then cp "$file" dist/; fi
done

# IndexNow host verification is intentionally public (not an account credential).
if [ -f indexnow-key.txt ]; then
  indexnow_key=$(tr -d '\r\n' < indexnow-key.txt)
  case "$indexnow_key" in ''|*[!a-zA-Z0-9-]*) echo "Invalid IndexNow key" >&2; exit 1;; esac
  [ "${#indexnow_key}" -ge 8 ] && [ "${#indexnow_key}" -le 128 ]
  printf '%s' "$indexnow_key" > "dist/$indexnow_key.txt"
fi
# Preserve Bing verification when an official verification file is supplied.
if [ -f BingSiteAuth.xml ]; then cp BingSiteAuth.xml dist/; fi

# Cloudflare canonical paths: avoid a redirect for every internal navigation.
# Source HTML retains .html links so GitHub Pages continues to work as backup.
for page in dist/*.html; do
  sed -i 's/href="index.html/href=".\//g' "$page"
  for route in nosotros niveles admision contacto galeria vida-escolar innovacion jean-piaget taller-familiar privacidad terminos; do
    sed -i "s/href=\"$route.html/href=\"$route/g" "$page"
  done
done
