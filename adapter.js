/* Metz Cockpit – Supabase-adapter.
   Giver app.js samme db-interface som før (collection/doc/onSnapshot/set/delete),
   men læser og skriver til Postgres-tabeller i Supabase. */
(function () {
  'use strict';

  const DATE = 'date', NUM = 'num', INT = 'int', BOOL = 'bool', JSONB = 'json', TS = 'ts', TXT = 'txt';

  // app-felt -> [kolonne, type]
  const TABLES = {
    deals: {
      table: 'deals',
      cols: {
        company: ['company', TXT], legalName: ['legal_name', TXT], title: ['title', TXT], type: ['type', TXT],
        segment: ['segment', TXT], track: ['track', TXT], stage: ['stage', TXT], revenue: ['revenue', NUM],
        value: ['value', NUM], est: ['est', BOOL], owner: ['owner', TXT], source: ['source', TXT],
        contact: ['contact', TXT], email: ['email', TXT], phone: ['phone', TXT], nextStep: ['next_step', TXT],
        nextDate: ['next_date', DATE], note: ['note', TXT], fav: ['fav', BOOL], wonDate: ['won_date', DATE],
        orderStatus: ['order_status', TXT], orderNo: ['order_no', TXT], deadline: ['deadline', DATE],
        log: ['log', JSONB], createdAt: ['created_at', TS], updatedAt: ['updated_at', TS]
      }
    },
    studio: {
      table: 'studio_shops',
      cols: {
        company: ['company', TXT], contact: ['contact', TXT], email: ['email', TXT], dealId: ['deal_id', TXT],
        status: ['status', TXT], startDate: ['start_date', DATE], goLive: ['go_live', DATE],
        setupFee: ['setup_fee', NUM], shopRevenue: ['shop_revenue', NUM], owner: ['owner', TXT], note: ['note', TXT],
        steps: ['steps', JSONB], info: ['info', JSONB], log: ['log', JSONB],
        createdAt: ['created_at', TS], updatedAt: ['updated_at', TS]
      }
    },
    projects: {
      table: 'projects',
      cols: {
        title: ['title', TXT], owner: ['owner', TXT], status: ['status', TXT], priority: ['priority', TXT],
        deadline: ['deadline', DATE], goal: ['goal', TXT], description: ['description', TXT], tasks: ['tasks', JSONB],
        createdAt: ['created_at', TS], updatedAt: ['updated_at', TS]
      }
    },
    ideas: {
      table: 'ideas',
      cols: {
        title: ['title', TXT], problem: ['problem', TXT], solution: ['solution', TXT], status: ['status', TXT],
        impact: ['impact', INT], effort: ['effort', INT], category: ['category', TXT], gainer: ['gainer', TXT],
        author: ['author', TXT], createdAt: ['created_at', TS], updatedAt: ['updated_at', TS]
      }
    }
  };
  const NOT_NULL_TXT = { company: 'Uden navn', title: '' };
  const JSON_DEFAULT = { log: [], steps: [], info: [], tasks: [] };

  function toCol(type, v) {
    if (v === undefined || v === null) return null;
    switch (type) {
      case DATE: { const s = String(v).trim(); return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null; }
      case NUM: { const n = Number(v); return isFinite(n) ? n : null; }
      case INT: { const n = Math.round(Number(v)); return isFinite(n) ? n : null; }
      case BOOL: return !!v;
      case TS: { const d = new Date(v); return isNaN(d) ? null : d.toISOString(); }
      case JSONB: return v;
      default: return String(v);
    }
  }
  function fromCol(type, v) {
    if (v === null || v === undefined) return type === BOOL ? false : null;
    if (type === NUM || type === INT) return Number(v);
    if (type === TS) { const d = new Date(v); return isNaN(d) ? '' : d.toISOString(); }
    return v;
  }
  function docToRow(spec, id, doc) {
    const row = { id: String(id) }, extra = {};
    Object.keys(spec.cols).forEach(k => {
      const [col, type] = spec.cols[k];
      let v = toCol(type, doc[k]);
      if (v === null && type === JSONB) v = JSON_DEFAULT[k] || [];
      if (v === null && type === BOOL) v = false;
      if (v === null && k in NOT_NULL_TXT && (col === 'company' || col === 'title') && spec.table !== 'deals') v = NOT_NULL_TXT[k] || 'Uden navn';
      if (v === null && col === 'company') v = 'Uden navn';
      if (col === 'order_no' && v === '') v = null;
      if (col === 'type' && v === null) v = '';
      if ((col === 'created_at' || col === 'updated_at') && v === null) return; // lad databasen sætte den
      row[col] = v;
    });
    Object.keys(doc).forEach(k => { if (k !== 'id' && !(k in spec.cols) && doc[k] !== undefined) extra[k] = doc[k]; });
    row.extra = extra;
    return row;
  }
  function rowToDoc(spec, row) {
    const doc = Object.assign({}, row.extra || {});
    Object.keys(spec.cols).forEach(k => {
      const [col, type] = spec.cols[k];
      const v = fromCol(type, row[col]);
      if (v !== null && v !== undefined) doc[k] = v;
      else if (type === NUM || type === INT || type === DATE) doc[k] = null;
    });
    return doc;
  }

  function errCode(e) {
    if (!e) return 'fejl';
    if (e.code === '42501' || /row-level security/i.test(e.message || '')) return 'ingen adgang';
    if (e.code === '23505') return 'findes allerede';
    if (e.code === 'PGRST301' || /JWT/i.test(e.message || '')) return 'log ind igen';
    return e.code || 'fejl';
  }

  function makeDb(sb, me) {
    const listeners = {};        // collection -> [fn]
    const cache = {};            // collection -> rows
    const channels = {};
    let cfgDocListeners = [], studioDocListeners = [];
    let mainSettings = null, studioSettings = null;

    function emitCol(col) {
      const spec = TABLES[col], rows = cache[col] || [];
      const snap = { docs: rows.map(r => ({ id: r.id, data: () => rowToDoc(spec, r) })), metadata: { fromCache: false, hasPendingWrites: false } };
      (listeners[col] || []).forEach(fn => { try { fn.ok(snap); } catch (e) { console.error(e); } });
    }
    async function fetchCol(col) {
      const spec = TABLES[col];
      const { data, error } = await sb.from(spec.table).select('*').order('created_at', { ascending: true }).limit(10000);
      if (error) { (listeners[col] || []).forEach(fn => fn.err && fn.err(error)); return; }
      cache[col] = data || [];
      emitCol(col);
    }
    const timers = {};
    function refetchSoon(col, ms) { clearTimeout(timers[col]); timers[col] = setTimeout(() => fetchCol(col), ms == null ? 150 : ms); }

    function subscribeTable(table, onChange) {
      if (channels[table]) return;
      channels[table] = sb.channel('rt-' + table)
        .on('postgres_changes', { event: '*', schema: 'public', table }, onChange)
        .subscribe();
    }

    // ---------- indstillinger ----------
    const mainKey = 'main:' + me.email;
    function cfgSnap() {
      const d = Object.assign({}, (mainSettings && mainSettings.data) || {});
      d.me = me.name;
      d.team = me.members.filter(m => m.active !== false).map(m => m.name);
      return { exists: true, data: () => d, metadata: { fromCache: false } };
    }
    function studioSnap() {
      return { exists: !!studioSettings, data: () => (studioSettings && studioSettings.data) || {}, metadata: { fromCache: false } };
    }
    async function fetchSettings() {
      const { data } = await sb.from('settings').select('*').in('key', [mainKey, 'studio']);
      mainSettings = (data || []).find(r => r.key === mainKey) || null;
      studioSettings = (data || []).find(r => r.key === 'studio') || null;
      cfgDocListeners.forEach(fn => fn(cfgSnap()));
      studioDocListeners.forEach(fn => fn(studioSnap()));
    }
    async function fetchMembers() {
      const { data } = await sb.from('members').select('*').order('created_at');
      if (data) { me.members = data; me.onMembers && me.onMembers(); }
      cfgDocListeners.forEach(fn => fn(cfgSnap()));
    }
    me.refreshMembers = fetchMembers;

    return {
      collection(col) {
        if (col === 'config') { const self = this; return { doc: id => self.doc('config/' + id), onSnapshot() { return () => {}; } }; }
        const spec = TABLES[col];
        return {
          onSnapshot(ok, err) {
            (listeners[col] = listeners[col] || []).push({ ok, err });
            if (cache[col]) setTimeout(() => emitCol(col), 0); else fetchCol(col);
            subscribeTable(spec.table, () => refetchSoon(col));
            return () => { listeners[col] = (listeners[col] || []).filter(x => x.ok !== ok); };
          },
          doc(id) {
            return {
              async set(data) {
                const row = docToRow(spec, id, data || {});
                const { error } = await sb.from(spec.table).upsert(row, { onConflict: 'id' });
                if (error) { refetchSoon(col, 0); const e = new Error(error.message); e.code = errCode(error); throw e; }
              },
              async delete() {
                const { error } = await sb.from(spec.table).delete().eq('id', String(id));
                if (error) { refetchSoon(col, 0); const e = new Error(error.message); e.code = errCode(error); throw e; }
              }
            };
          }
        };
      },
      doc(path) {
        const key = path === 'config/main' ? mainKey : path === 'config/studio' ? 'studio' : null;
        return {
          onSnapshot(ok) {
            if (path === 'config/main') { cfgDocListeners.push(ok); }
            else if (path === 'config/studio') { studioDocListeners.push(ok); }
            if (cfgDocListeners.length + studioDocListeners.length === 1) {
              fetchSettings();
              subscribeTable('settings', () => { clearTimeout(timers.__s); timers.__s = setTimeout(fetchSettings, 150); });
              subscribeTable('members', () => { clearTimeout(timers.__m); timers.__m = setTimeout(fetchMembers, 150); });
            } else setTimeout(() => ok(path === 'config/main' ? cfgSnap() : studioSnap()), 0);
            return () => {};
          },
          async set(data) {
            if (!key) return;
            const d = Object.assign({}, data || {});
            if (key === mainKey) { delete d.me; delete d.team; }
            const { error } = await sb.from('settings').upsert({ key, data: d }, { onConflict: 'key' });
            if (error) { const e = new Error(error.message); e.code = errCode(error); throw e; }
          }
        };
      }
    };
  }

  function makeDownloads() {
    return {
      async save({ filename, data }) {
        const type = /\.json$/i.test(filename) ? 'application/json' : /\.csv$/i.test(filename) ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8';
        const url = URL.createObjectURL(new Blob([data], { type }));
        const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }
    };
  }

  window.MetzAdapter = { install(sb, me) {
    const db = makeDb(sb, me), dl = makeDownloads();
    window.claude = { use: async name => name === 'db' ? db : name === 'downloads' ? dl : null };
  }, _test: { docToRow, rowToDoc, TABLES } };
})();
