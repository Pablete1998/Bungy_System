const { chromium, devices } = require('playwright');
const fs = require('fs');
const JSPDF = process.cwd() + '/npmjs/node_modules/jspdf/dist/jspdf.umd.min.js';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const errs = [];
  const mk = async opt => { const ctx = await b.newContext(opt); await ctx.route(/cdnjs\.cloudflare\.com.*jspdf/, r => r.fulfill({ path: JSPDF, contentType: 'application/javascript' })); await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ body: '', contentType: 'text/css' })); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(opt.tag + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(opt.tag + ' console: ' + m.text()); }); return [ctx, p]; };
  for (const [tag, opt] of [['desk', { viewport: { width: 1366, height: 860 } }], ['iphone', devices['iPhone 13']], ['se', devices['iPhone SE']], ['pixel', devices['Pixel 7']]]) {
    // Portada
    let [ctx, p] = await mk({ ...opt, tag: tag + '-web' });
    await p.goto('file://' + process.cwd() + '/test-portada.html'); await p.waitForTimeout(600);
    await p.click('.gate-opt[data-go=web]'); await p.waitForTimeout(1600);
    console.log(tag, 'portada scrollWidth/innerWidth', await p.evaluate(() => document.documentElement.scrollWidth + '/' + innerWidth), 'body margin', await p.evaluate(() => getComputedStyle(document.body).margin));
    await p.screenshot({ path: `ft-${tag}-web.png` });
    await p.click('.pick [data-hero=cam]'); await p.waitForTimeout(400);
    if (await p.isVisible('#burger')) { await p.click('#burger'); await p.waitForTimeout(400); await p.click('.drawer .lang button[data-lang=es]'); await p.keyboard.press('Escape'); await p.waitForTimeout(300); } else { await p.click('.top .lang button[data-lang=es]'); await p.waitForTimeout(300); }
    console.log(tag, 'rope tip ES:', await p.evaluate(() => document.querySelector('#rope-man title').textContent));
    await p.evaluate(() => scrollTo(0, 1500)); await p.waitForTimeout(700);
    console.log(tag, 'quick on:', await p.evaluate(() => document.getElementById('quick').classList.contains('on') + ' vis=' + getComputedStyle(document.getElementById('quick')).visibility));
    if (await p.isVisible('#burger')) { await p.click('#burger'); await p.waitForTimeout(400); console.log(tag, 'drawer focus on close btn:', await p.evaluate(() => document.activeElement.className), 'inert', await p.evaluate(() => document.getElementById('drawer').inert)); await p.keyboard.press('Escape'); }
    await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(700);
    await p.screenshot({ path: `ft-${tag}-web-bottom.png` });
    await ctx.close();
    // App: todas las vistas en ambos idiomas
    [ctx, p] = await mk({ ...opt, tag: tag + '-app' });
    await p.goto('file://' + process.cwd() + '/test-app.html'); await p.waitForTimeout(800);
    for (const lang of ['en', 'es']) {
      await p.locator('.lsw [data-setlang=' + lang + ']').locator('visible=true').first().click();
      for (const role of ['cliente', 'empleado', 'admin']) {
        await p.click('.role[data-role=' + role + ']');
        const tabs = await p.$$eval('.side .nav button', bs => bs.map(x => x.dataset.tab));
        for (const t of tabs) { await p.locator('button[data-tab=' + t + ']').locator('visible=true').first().click({ force: true }); 
          if (t === 'agenda') { await p.click('[data-agv=cal]'); await p.waitForTimeout(150); try { await p.click('[data-day="2026-10-27"]', { timeout: 3000 }); } catch (e) { console.log('DAYFAIL', tag, lang, await p.evaluate(() => document.querySelectorAll('[data-day]').length + ' ' + document.querySelector('.cal-c[data-day]')?.dataset.day + ' head=' + document.querySelector('.head')?.innerText.slice(0, 60))); } await p.click('[data-mon="1"]'); }
          const first = p.locator('.pcard[data-proj], button.row[data-proj]').locator('visible=true').first(); if (await first.count()) await first.click({ force: true });
          const sw = await p.evaluate(() => document.documentElement.scrollWidth + '/' + innerWidth); if (sw.split('/')[0] !== sw.split('/')[1]) console.log('OVERFLOW', tag, lang, role, t, sw);
          if (lang === 'en' && tag === 'desk') await p.screenshot({ path: `ft-app-${role}-${t}.png` });
        }
        if (role === 'cliente') { const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-pdf]')]); await dl.saveAs(`ft-${tag}-${lang}.pdf`); }
        await p.locator('[data-logout]').locator('visible=true').first().click();
      }
    }
    console.log(tag, 'app title', await p.title(), 'lang', await p.evaluate(() => document.documentElement.lang));
    await ctx.close();
    // Web completa: abrir área y sincronizar idioma
    [ctx, p] = await mk({ ...opt, tag: tag + '-full' });
    await p.goto('file:///mnt/project-files/web-bungy/bungy-system-web-completa.html'); await p.waitForTimeout(1000);
    await p.click('.gate-opt.shop'); await p.waitForTimeout(1600);
    console.log(tag, 'full: shop view', await p.evaluate(() => document.body.dataset.view + ' hero=' + getComputedStyle(document.getElementById('inicio')).display));
    await p.evaluate(() => document.querySelector('.top [data-area]').click()); await p.waitForTimeout(800);
    console.log(tag, 'full: area open', await p.evaluate(() => !document.getElementById('area').hidden));
    const fr = p.frames()[1]; await fr.click('.lsw [data-setlang=es]'); await p.waitForTimeout(300);
    console.log(tag, 'full: parent lang after iframe ES ->', await p.evaluate(() => document.documentElement.lang));
    await ctx.close();
  }
  console.log('ERRORS', errs);
  await b.close();
})();
