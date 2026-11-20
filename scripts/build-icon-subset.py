#!/usr/bin/env python3
"""Development only: fonttools==4.68.0, brotli==1.2.1.
Original glyph outlines and metrics. MIT license retained.
Cloudflare uses the committed assets without these dependencies.
"""
from pathlib import Path
import re,shutil
from fontTools.ttLib import TTFont
from fontTools import subset
import argparse
parser=argparse.ArgumentParser(description='Regenerate Phosphor 2.1.1 site subset without network access.')
parser.add_argument('package',type=Path,help='Extracted official @phosphor-icons/web 2.1.1 package')
args=parser.parse_args()
repo=Path(__file__).resolve().parents[1];source=args.package/'src/regular'
css=(source/'style.css').read_text()
used=set()
for p in list(repo.glob('*.html'))+list((repo/'js').glob('*.js')):used.update(re.findall(r'\bph-[a-z0-9-]+',p.read_text()))
blocks=re.findall(r'\.ph\.ph-([a-z0-9-]+):before\s*\{\s*content:\s*"\\([a-f0-9]+)";\s*\}',css)
selected=[(name,code) for name,code in blocks if 'ph-'+name in used]
assert len(selected)==len(used),(used-set('ph-'+n for n,c in selected))
font=TTFont(source/'Phosphor.woff2');options=subset.Options();sub=subset.Subsetter(options=options);sub.populate(unicodes=[int(c,16) for n,c in selected]);sub.subset(font);font.flavor='woff2';font.save(repo/'fonts/phosphor-site-v2.1.1.woff2')
base=css.split('.ph.ph-',1)[0];base=re.sub(r'src:.*?;', 'src: url("../fonts/phosphor-site-v2.1.1.woff2") format("woff2");',base,count=1,flags=re.S).replace('font-display: block','font-display: swap')
base='/* Phosphor Icons 2.1.1, MIT; same original glyphs, subset to site usage. */\n'+base
(repo/'css/phosphor-site.css').write_text(base+'\n'+''.join('.ph.ph-'+n+':before { content: "\\'+c+'"; }\n' for n,c in selected))
shutil.copyfile(args.package/'LICENSE',repo/'fonts/PHOSPHOR-LICENSE.txt')
print(f'Regenerated {len(selected)} original icon glyphs.')
