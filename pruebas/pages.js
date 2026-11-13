const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const out = {};
  for (const [name, opts] of [['desk', { viewport: { width: 1366, height: 800 } }], ['se', devices['iPhone SE']], ['i13', devices['iPhone 13']]]) {
    const ctx = await b.newContext(opts); const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    const url = 'file://' + process.cwd() + '/test-portada.html';
    await p.goto(url); await p.waitForTimeout(400);
    const st = async () => p.evaluate(() => ({ hash: location.hash, view: document.body.dataset.view, gate: !document.getElementById('gate').hidden && !document.getElementById('gate').classList.contains('off'),
      hero: getComputedStyle(document.getElementById('inicio')).display, shop: getComputedStyle(document.getElementById('tienda')).display, mat: getComputedStyle(document.getElementById('material')).display,
      y: Math.round(scrollY), ox: document.documentElement.scrollWidth > innerWidth,
      swap: [...document.querySelectorAll('.top .swap')].filter(e => e.offsetParent).map(e => e.textContent.trim()),
      hdr: (() => { const w = document.querySelector('.top .wrap').getBoundingClientRect(); const t = document.querySelector('.top .tools').getBoundingClientRect(); return { right: Math.round(w.right - t.right), fits: t.right <= innerWidth && document.querySelector('.top .logo').getBoundingClientRect().right <= t.left }; })() }));
    const r = {}; r.start = await st();
    await p.click('.gate-opt.shop'); await p.waitForTimeout(1500); r.shop = await st();
    await p.evaluate(() => scrollTo({ top: 900, behavior: 'instant' })); await p.waitForTimeout(300);
    await p.click('.top .swap[data-only="shop"]', { force: true }); await p.waitForTimeout(1500); r.web = await st();
    await p.evaluate(() => scrollTo({ top: 1500, behavior: 'instant' })); await p.waitForTimeout(200);
    await p.click('.top .swap[data-only="web"]', { force: true }); await p.waitForTimeout(1500); r.shop2 = await st();
    await p.evaluate(() => { location.hash = '#plataformas'; }); await p.waitForTimeout(1500); r.plat = await st();
    r.platTop = await p.evaluate(() => Math.round(document.getElementById('plataformas').getBoundingClientRect().top));
    await p.goBack(); await p.waitForTimeout(400); await p.goBack(); await p.waitForTimeout(400); await p.goBack(); await p.waitForTimeout(400); await p.goBack(); await p.waitForTimeout(1500); r.back = await st();
    // deep links on load
    const p2 = await ctx.newPage(); await p2.goto(url + '#contacto'); await p2.waitForTimeout(400);
    r.deepContact = await p2.evaluate(() => ({ view: document.body.dataset.view, gate: document.getElementById('gate').classList.contains('off'), top: Math.round(document.getElementById('contacto').getBoundingClientRect().top) }));
    const p3 = await ctx.newPage(); await p3.goto(url + '#material'); await p3.waitForTimeout(400);
    r.deepMat = await p3.evaluate(() => ({ view: document.body.dataset.view, hero: getComputedStyle(document.getElementById('inicio')).display }));
    // ES
    await p.click('.gate button[data-lang="es"]'); await p.click('.gate-opt.shop'); await p.waitForTimeout(400);
    r.es = await p.evaluate(() => ({ swap: document.querySelector('.top .swap[data-only="shop"] span').textContent, h1: document.querySelector('#tienda h1').textContent, nav: [...document.querySelectorAll('.drawer a[data-only="shop"]')].map(a => a.textContent) }));
    await p.screenshot({ path: `tienda-${name}.png`, fullPage: false });
    r.errs = errs; out[name] = r; await ctx.close();
  }
  console.log(JSON.stringify(out, null, 1)); await b.close();
})();
