/* Metz Cockpit – login med e-mail-link (Supabase Auth) og opstart af appen */
(function () {
  'use strict';
  const C = window.METZ_CONFIG || {};
  const root = document.getElementById('auth');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function screen(html) { root.hidden = false; root.innerHTML = `<div class="au-card"><div class="au-logo"><span>M</span><div><b>Metz Cockpit</b><small>New business</small></div></div>${html}</div>`; }

  if (!C.url || !C.anonKey || /YOUR_/.test(C.url + C.anonKey)) {
    screen(`<h1>Mangler opsætning</h1><p>Udfyld Supabase-URL og nøgle i <code>config.js</code>.</p>`);
    return;
  }
  const sb = window.supabase.createClient(C.url, C.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' } });
  window.metzSupabase = sb;

  function loginForm(msg, err) {
    screen(`<h1>Log ind</h1><p>Skriv din arbejdsmail, så sender vi dig et login-link. Ingen adgangskode.</p>
      <form id="au-f" novalidate><label class="au-l">E-mail<input id="au-e" type="email" autocomplete="email" inputmode="email" placeholder="navn@metz.dk" required></label>
      <button class="au-b" id="au-btn" type="submit">Send login-link</button></form>
      ${msg ? `<p class="au-ok">${msg}</p>` : ''}${err ? `<p class="au-err">${err}</p>` : ''}`);
    const f = document.getElementById('au-f'), e = document.getElementById('au-e'), b = document.getElementById('au-btn');
    try { e.value = localStorage.getItem('metz-last-email') || ''; } catch (_) {}
    setTimeout(() => e.focus(), 50);
    f.addEventListener('submit', async ev => {
      ev.preventDefault();
      const email = e.value.trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { loginForm('', 'Skriv en gyldig e-mailadresse.'); return; }
      b.disabled = true; b.textContent = 'Sender…';
      try { localStorage.setItem('metz-last-email', email); } catch (_) {}
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname, shouldCreateUser: true } });
      if (error) { loginForm('', /rate|seconds/i.test(error.message) ? 'Vent et øjeblik, før du beder om et nyt link.' : 'Kunne ikke sende linket: ' + esc(error.message)); return; }
      loginForm(`Tjek din indbakke – vi har sendt et login-link til <b>${esc(email)}</b>. Linket virker én gang.`);
    });
  }

  function noAccess(email) {
    screen(`<h1>Ingen adgang endnu</h1><p><b>${esc(email)}</b> er ikke tilføjet til teamet. Bed din leder om at tilføje dig under Indstillinger → Team.</p><button class="au-b ghost" id="au-out">Log ud</button>`);
    document.getElementById('au-out').onclick = async () => { await sb.auth.signOut(); loginForm(); };
  }

  let started = false, starting = false;
  async function start(session) {
    if (started || starting) return;
    starting = true;
    const email = (session.user.email || '').toLowerCase();
    const { data: members, error } = await sb.from('members').select('*').order('created_at');
    const meRow = (members || []).find(m => m.email === email && m.active !== false);
    if (error || !meRow) { starting = false; noAccess(email); return; }
    started = true;
    const me = {
      email, name: meRow.name, role: meRow.role, members: members || [],
      get isLeader() { return this.role === 'leder'; },
      async signOut() { await sb.auth.signOut(); location.replace(location.pathname); },
      async addMember(m) {
        const row = { email: String(m.email || '').trim().toLowerCase(), name: String(m.name || '').trim(), role: m.role === 'leder' ? 'leder' : 'saelger', active: true };
        const { error } = await sb.from('members').upsert(row, { onConflict: 'email' });
        if (error) throw error; await me.refreshMembers();
      },
      async removeMember(email) {
        const { error } = await sb.from('members').delete().eq('email', email);
        if (error) throw error; await me.refreshMembers();
      }
    };
    me.onMembers = () => { const r = me.members.find(m => m.email === email); if (r) { me.name = r.name; me.role = r.role; } };
    window.metzAuth = me;
    window.MetzAdapter.install(sb, me);
    root.hidden = true; root.innerHTML = '';
    const s = document.createElement('script'); s.src = 'app.js?v=' + (C.version || '1'); document.body.appendChild(s);
  }

  sb.auth.onAuthStateChange((ev, session) => {
    if (session && !started) start(session);
    if (ev === 'SIGNED_OUT' && started) location.replace(location.pathname);
  });
  sb.auth.getSession().then(({ data }) => { if (data.session) start(data.session); else loginForm(); });
})();
