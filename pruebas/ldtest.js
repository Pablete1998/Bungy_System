const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [tag, ctxOpts] of [['se', devices['iPhone SE']]]) {
    const ctx = await b.newContext(ctxOpts); const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto('file:///tmp/claude-0/-home-claude/dbe36d25-355e-5d63-ad77-0c21a251e430/scratchpad/test-app.html');
    await p.click('[data-setlang=es]');
    await p.click('[data-role=empleado]'); await p.click(tag === 'se' ? '.tabbar [data-tab=material]' : '[data-tab=material]');
    console.log(tag, 'next load:', await p.$eval('.card .ch h2', e => e.textContent), await p.$eval('[data-ldopen]', e => e.textContent));
    await p.screenshot({ path: 'ld-' + tag + '-material.png', fullPage: false });
    await p.click('[data-ldopen]'); await p.waitForTimeout(100);
    console.log(tag, 'mode after open:', await p.$eval('[data-ldmode][aria-pressed=true]', e => e.textContent), 'rows', await p.$$eval('.chk', r => r.length), 'on', await p.$$eval('.chk.on', r => r.length));
    await p.screenshot({ path: 'ld-' + tag + '-carga.png', fullPage: true });
    const first = await p.$('.chk:not(.on)'); await first.click();
    console.log(tag, 'after tick on:', await p.$$eval('.chk.on', r => r.length), await p.$eval('.ldprog .cb-row span', e => e.textContent));
    await p.click('[data-ldmode=lista]');
    console.log(tag, 'lista rows', await p.$$eval('.ldrow', r => r.length), 'fams', await p.$$eval('.fam', r => r.map(x => x.textContent).join(' | ')));
    await p.screenshot({ path: 'ld-' + tag + '-lista.png', fullPage: true });
    await p.selectOption('#ld-item', 'mo1'); await p.fill('#ld-qty', '3'); await p.click('[data-ldadd]');
    console.log(tag, 'after add rows', await p.$$eval('.ldrow', r => r.length), await p.$eval('#toast', e => e.textContent));
    await p.click('[data-ldtpl]'); console.log(tag, 'tpl toast', await p.$eval('#toast', e => e.textContent), 'rows', await p.$$eval('.ldrow', r => r.length));
    const rm = await p.$('[data-ldrm]'); if (rm) { await rm.click(); console.log(tag, 'rm', await p.$eval('#toast', e => e.textContent)); }
    // admin: proyecto terminado p4 en modo vuelta
    await p.click(tag === 'se' ? '.mtop [data-logout]' : '[data-logout]'); await p.click('[data-role=admin]');
    console.log(tag, 'alerts sin devolver:', await p.$$eval('.alert', a => a.filter(x => /sin devolver/i.test(x.textContent)).length));
    await p.click(tag === 'se' ? '.tabbar [data-tab=proyectos]' : '[data-tab=proyectos]'); await p.click('[data-proj=p4]');
    console.log(tag, 'p4 meta', await p.$eval('.ld .meta', e => e.textContent));
    await p.click('[data-ldmode=vuelta]'); console.log(tag, 'vuelta banner', await p.$eval('.ld .cb.bad, .ld .cb.ok', e => e.textContent), 'unreturned', await p.$$eval('.chk:not(.on)', r => r.length));
    await p.screenshot({ path: 'ld-' + tag + '-vuelta.png', fullPage: true });
    await p.click('.chk:not(.on)'); console.log(tag, 'after return', await p.$eval('.ld .cb.bad, .ld .cb.ok', e => e.textContent));
    // English
    await p.click(tag === 'se' ? '.mtop [data-setlang=en]' : '[data-setlang=en]'); await p.click('[data-ldmode=lista]');
    console.log(tag, 'EN:', await p.$eval('.ld .ch h2', e => e.textContent), '|', await p.$$eval('.fam span:first-child', r => r.map(x => x.textContent).join(', ')), '|', await p.$$eval('.ldrow .t', r => r.slice(0, 4).map(x => x.textContent).join(', ')), '|', await p.$eval('.ld .meta', e => e.textContent));
    await p.click(tag === 'se' ? '.tabbar [data-tab=almacen]' : '[data-tab=almacen]'); console.log(tag, 'almacen EN rows', await p.$$eval('tbody tr', r => r.length), await p.$$eval('tbody tr td:first-child', r => r.slice(0, 3).map(x => x.textContent).join(' / ')), await p.$$eval('.seg button', r => r.map(x => x.textContent).join(',')));
    await p.screenshot({ path: 'ld-' + tag + '-almacen-en.png', fullPage: false });
    console.log(tag, 'ERRORS', errs);
    await ctx.close();
  }
  await b.close();
})();
