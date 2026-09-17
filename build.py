from pathlib import Path
p=Path(__file__).parent
base=(p/'src/legacy-app.js').read_text()
base=base.replace("'vbna.chapter11.vn'", "'vbna.chapter11.com'")
base=base.replace("value=\"07:00\"", "value=\"13:30\"")
base=base.replace("location.href=params.get('next')||homeForUser(u)", "location.href=safeNext(params.get('next'))||homeForUser(u)")
base=base.replace("let S=load();", "let S=load();")
base=base[:base.index('/* init */')]
parts=['core','public','reports','operations','finance','settings','integration','vbna-directory','member-import']
base+='\n'.join((p/f'src/{f}.js').read_text() for f in parts)
base+='\ndocument.addEventListener(\'DOMContentLoaded\',bootV6);\n})();\n'
(p/'app.js').write_text(base)
for f in p.glob('*.html'):
 s=f.read_text().replace('vbna.chapter11.vn','vbna.chapter11.com')
 s=s.replace('<script defer src="app.js"></script>', '<script defer src="vendor/jszip.min.js"></script><script defer src="vendor/qrcode.js"></script><script defer src="app.js"></script>') if 'vendor/jszip' not in s else s
 if 'v6.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="v6.css"></head>')
 f.write_text(s)
