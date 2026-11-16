from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit
import urllib.request,urllib.error,xml.etree.ElementTree as ET,concurrent.futures,subprocess,json,re
root='https://jeanpiagetsullana.pages.dev/'
# Browser UA; Python-urllib is rejected by the edge.
urllib.request.install_opener(urllib.request.build_opener())
urllib.request._opener.addheaders=[('User-Agent','Mozilla/5.0')]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.assets=[];self.canonical=[];self.noindex=False
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if t=='meta' and a.get('name')=='robots' and 'noindex' in a.get('content',''):self.noindex=True
  if t in ('img','script','iframe') and a.get('src'):self.assets.append(a['src'])
  if t=='link' and a.get('rel') in ('stylesheet','preload','icon'):self.assets.append(a['href'])
urls=[e.text for e in ET.parse('sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assets=set();results=[]
for url in urls:
 r=urllib.request.urlopen(url);html=r.read().decode();p=Parser();p.feed(html)
 assert r.status==200 and r.url==url and p.canonical==[url] and not p.noindex,(url,p.canonical)
 assets.update(urljoin(url,a) for a in p.assets if not urlsplit(a).netloc)
 for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',html,re.S):json.loads(block)
 results.append({'url':url,'http':r.status,'canonical':'OK'})
def asset(url):
 try:
  r=urllib.request.urlopen(url,timeout=30);r.read();return None if r.status==200 else [url,r.status]
 except Exception as e:return [url,str(e)]
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:failures=[x for x in pool.map(asset,assets) if x]
# All original visible markup, styles and scripts remain identical.
for file in Path('.').glob('*.html'):
 old=subprocess.check_output(['git','show','915a44d:'+str(file)]).decode()
 assert old.split('<body',1)[-1]==file.read_text().split('<body',1)[-1],str(file)
assert not subprocess.check_output(['git','diff','915a44d','--','css','js','img','fonts'])
private={}
for route in ['admin','admin.html','js/admin.js','css/admin.css','docs/base-de-datos.md','supabase/config.toml','README.md']:
 try:r=urllib.request.urlopen(root+route);private[route]=r.status
 except urllib.error.HTTPError as e:private[route]=e.code
assert all(x==404 for x in private.values()),private
assert not failures,failures
print(json.dumps({'pages':results,'assets_checked':len(assets),'asset_failures':failures,'private_routes':private,'visible_content_and_assets_unchanged':True},ensure_ascii=False,indent=2))
