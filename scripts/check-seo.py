#!/usr/bin/env python3
"""Read-only production SEO check. No forms, databases, credentials or submissions.
Usage: python3 scripts/check-seo.py [--output /path/report.json]
"""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

ORIGIN = 'https://jeanpiagetsullana.pages.dev/'
class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.robots = []
        self.h1 = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonicals.append(attrs.get('href'))
        if tag == 'meta' and attrs.get('name') in ('robots','googlebot','bingbot'):
            self.robots.append(attrs.get('content',''))
        if tag == 'h1':
            self.h1 += 1

def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'JeanPiagetSEOAuditBot/1.0', 'DNT': '1'})
    try:
        response = urllib.request.urlopen(request, timeout=25)
    except urllib.error.HTTPError as error:
        response = error
    return response.status, response.url, response.headers, response.read().decode('utf-8')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    issues, pages = [], []
    code, final, _, xml = fetch(ORIGIN + 'sitemap.xml')
    if code != 200 or final != ORIGIN + 'sitemap.xml':
        raise RuntimeError('Sitemap must return 200 without a redirect')
    urls = [loc.text for loc in ET.fromstring(xml).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    if not urls or len(urls) != len(set(urls)):
        raise RuntimeError('Empty sitemap or duplicate locations')
    for url in urls:
        if not url.startswith(ORIGIN):
            issues.append({'url':url,'error':'Off-site sitemap location'})
            continue
        code, final, headers, html = fetch(url)
        head = Head()
        head.feed(html)
        noindex = any('noindex' in directive.lower() for directive in head.robots + [headers.get('X-Robots-Tag','')])
        passed = code == 200 and final == url and head.canonicals == [url] and not noindex and head.h1 == 1
        row = {'url':url,'http':code,'canonical':head.canonicals,'noindex':noindex,'h1':head.h1,'pass':passed}
        pages.append(row)
        if not passed:
            issues.append(row)
    code, _, _, robots = fetch(ORIGIN + 'robots.txt')
    if code != 200 or 'Sitemap: '+ORIGIN+'sitemap.xml' not in robots:
        issues.append({'error':'robots.txt missing or wrong sitemap declaration'})
    code, _, _, backup = fetch('https://adrinoaimar.github.io/jean-piaget-web/')
    head = Head()
    head.feed(backup)
    backup_excluded = code == 200 and any('noindex' in value.lower() for value in head.robots)
    if not backup_excluded:
        issues.append({'error':'GitHub backup noindex not confirmed'})
    result = {'pages':pages,'github_backup_noindex':backup_excluded,'issues':issues,'pass':not issues,
              'note':'HTTP and metadata checks do not prove search-engine indexing.'}
    payload = json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    if args.output:
        args.output.write_text(payload)
    else:
        print(payload,end='')
    return 0 if not issues else 1

if __name__ == '__main__':
    raise SystemExit(main())
