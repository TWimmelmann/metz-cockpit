// Laver seed.sql ud fra en JSON-eksport af cockpittets data.
// Brug: node make_seed.js data.json ejer@metz.dk "Navn" [leder@metz.dk "Navn"] > seed.sql
const fs = require('fs');
global.window = {};
require('../adapter.js');
const { docToRow, TABLES } = window.MetzAdapter._test;

const [, , file, ownerEmail, ownerName, leaderEmail, leaderName] = process.argv;
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const q = v => v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const lit = obj => `$json$${JSON.stringify(obj)}$json$`;

const out = ['-- Metz Cockpit – data fra den gamle version', 'begin;'];

const members = [[ownerEmail, ownerName, 'saelger']];
if (leaderEmail) members.push([leaderEmail, leaderName || leaderEmail.split('@')[0], 'leder']);
members.forEach(([e, n, r]) => out.push(`insert into public.members (email, name, role) values (${q(String(e).toLowerCase())}, ${q(n)}, ${q(r)}) on conflict (email) do update set name = excluded.name, role = excluded.role;`));

const order = ['deals', 'studio', 'projects', 'ideas'];
order.forEach(col => {
  const spec = TABLES[col], docs = data[col] || {};
  const rows = Object.entries(docs).map(([id, d]) => {
    const doc = Object.assign({}, d);
    if ((col === 'deals' || col === 'studio') && !doc.owner) doc.owner = ownerName;
    const row = docToRow(spec, id, doc);
    if (!row.created_at) row.created_at = doc.createdAt || doc.updatedAt || new Date().toISOString();
    if (!row.updated_at) row.updated_at = doc.updatedAt || row.created_at;
    Object.keys(row).forEach(k => { if ((row[k] === null || row[k] === '') && !['id','company','stage'].includes(k)) delete row[k]; if (k === 'extra' && row[k] && !Object.keys(row[k]).length) delete row[k]; if ((k==='est'||k==='fav') && row[k] === false) delete row[k]; if (Array.isArray(row[k]) && !row[k].length) delete row[k]; });
    return row;
  });
  if (!rows.length) return;
  const allCols = { deals: ['est','fav','log','extra'], studio_shops: ['steps','info','log','extra'], projects: ['tasks','extra'], ideas: ['extra'] }[spec.table] || [];
  const cols = [...new Set(rows.flatMap(r => Object.keys(r)))].filter(c => !allCols.includes(c));
  const coal = allCols.map(c => `coalesce(${c}, ${c === 'extra' ? "'{}'::jsonb" : (c === 'est' || c === 'fav') ? 'false' : "'[]'::jsonb"}) as ${c}`);
  out.push(`insert into public.${spec.table} (${cols.concat(allCols).join(', ')})\nselect ${cols.concat(coal).join(', ')} from jsonb_populate_recordset(null::public.${spec.table}, ${lit(rows)}::jsonb)\non conflict (id) do update set ${cols.concat(allCols).filter(c => c !== 'id').map(c => `${c} = excluded.${c}`).join(', ')};`);
});

const cfg = (data.config && data.config.main) || {};
const main = {}; ['target', 'targetRev', 'commission'].forEach(k => { if (cfg[k] !== undefined) main[k] = cfg[k]; });
out.push(`insert into public.settings (key, data) values (${q('main:' + String(ownerEmail).toLowerCase())}, ${lit(main)}::jsonb) on conflict (key) do update set data = excluded.data;`);
if (data.config && data.config.studio) out.push(`insert into public.settings (key, data) values ('studio', ${lit(data.config.studio)}::jsonb) on conflict (key) do update set data = excluded.data;`);
out.push('commit;');
process.stdout.write(out.join('\n') + '\n');
