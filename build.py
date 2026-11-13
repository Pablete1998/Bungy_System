# Genera los HTML finales a partir de fuente/. Uso: python3 build.py
import html
import os
HERE=os.path.dirname(os.path.abspath(__file__)); F=os.path.join(HERE,'fuente'); O=os.path.join(HERE,'salida'); os.makedirs(O,exist_ok=True)
web=open(os.path.join(F,'bungy-portada.html'),encoding='utf-8').read(); app=open(os.path.join(F,'bungy-app.html'),encoding='utf-8').read()
def rep(s,a,b):
    assert a in s, a[:70]; return s.replace(a,b,1)
app_doc='''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>html,body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
'''+app.replace('<div id="root"></div>','</head><body><div id="root"></div>',1)+'</body></html>'
web=rep(web,'<a href="#contacto" data-close data-i="navContact">Contact</a>','<a href="#contacto" data-close data-i="navContact">Contact</a>\n    <a href="#inicio" data-close data-area data-i="navArea">Client area</a>')
web=rep(web,'<a href="#top" data-i="l4">Careers</a>','<a href="#top" data-i="l4">Careers</a><a href="#inicio" data-area data-i="navArea">Client area</a>')
web=rep(web,"navContact: 'Contacto',","navContact: 'Contacto', navArea: 'Área privada', areaBack: '← Volver a la web', areaTitle: 'Área privada · demo con datos de ejemplo',")
css='''
/* Área privada */
.area-btn { background: none; border: 1px solid var(--line); color: var(--text); font: 500 13px/1 var(--body); letter-spacing: .04em; padding: 0 14px; min-height: 40px; cursor: pointer; white-space: nowrap; }
.area-btn:hover { border-color: var(--amber); color: var(--amber); }
.area { position: fixed; inset: 0; z-index: 90; background: var(--night); display: flex; flex-direction: column; }
.area-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: calc(8px + env(safe-area-inset-top, 0px)); padding-bottom: 8px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); background: var(--amber); color: var(--amber-ink); font: 500 12px/1.3 var(--mono); }
.area-bar button { background: var(--night); color: #fff; border: 0; font: 600 13px/1 var(--body); padding: 10px 14px; cursor: pointer; white-space: nowrap; }
.area iframe { flex: 1; width: 100%; border: 0; background: #f4f2f1; }

'''
web=rep(web,'/* Selector de idioma */',css+'/* Selector de idioma */')
overlay='''<div class="area" id="area" hidden>
  <div class="area-bar"><span data-i="areaTitle">Client area · demo with sample data</span><button type="button" id="area-close" data-i="areaBack">← Back to the website</button></div>
  <iframe id="area-frame" title="Private area"></iframe>
</div>
<template id="area-src">'''+html.escape(app_doc)+'''</template>
'''
web=rep(web,'<script>',overlay+'<script>')
js='''
  // Área privada: se abre a pantalla completa sin salir de la web
  const area = document.getElementById('area'), areaFrame = document.getElementById('area-frame');
  const openArea = () => { if (!areaFrame.srcdoc) { const t = document.createElement('textarea'); t.innerHTML = document.getElementById('area-src').innerHTML; areaFrame.srcdoc = t.value; } area.hidden = false; document.body.style.overflow = 'hidden'; };
  const closeArea = () => { area.hidden = true; document.body.style.overflow = ''; };
  document.querySelectorAll('[data-area]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openArea(); }));
  document.getElementById('area-close').addEventListener('click', closeArea);
  // El área privada usa el mismo idioma que la web, en los dos sentidos
  const syncLang = () => { try { areaFrame.contentWindow.postMessage({ bungyLang: document.documentElement.lang }, '*'); } catch (e) {} };
  areaFrame.addEventListener('load', syncLang);
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', syncLang));
  addEventListener('message', e => { const l = e.data && e.data.bungyLang; if ((l === 'en' || l === 'es') && l !== document.documentElement.lang) { const b = document.querySelector('.lang button[data-lang="' + l + '"]'); if (b) b.click(); } });
  if (location.hash === '#area') openArea();
'''
web=rep(web,"  // Cabecera que se compacta al hacer scroll",js+"\n  // Cabecera que se compacta al hacer scroll")
head='''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>html,body{margin:0}img{max-width:100%}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
'''
i=web.index('<div class="grain"')
out=head+web[:i]+'</head>\n<body>\n'+web[i:]+'\n</body>\n</html>\n'
open(os.path.join(O,'bungy-system-web-completa.html'),'w',encoding='utf-8').write(out)
# Portada sola (sin área privada) y área privada sola
web0=open(os.path.join(F,'bungy-portada.html'),encoding='utf-8').read(); i0=web0.index('<div class="grain"')
open(os.path.join(O,'portada.html'),'w',encoding='utf-8').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+web0[:i0]+'</head>\n<body>\n'+web0[i0:]+'\n</body>\n</html>\n')
open(os.path.join(O,'area-privada.html'),'w',encoding='utf-8').write(app_doc)
import shutil; shutil.copyfile(os.path.join(O,'bungy-system-web-completa.html'), os.path.join(O,'index.html'))
print('Generados en', O, ': index.html (= web completa), bungy-system-web-completa.html, portada.html, area-privada.html')
