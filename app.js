/* Metz Cockpit — salg, Metz Studio og team i ét system */
{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ============ Konstanter ============ */
const STAGES=[{k:'lead',n:'Lead',p:.1,c:'#a1a1aa'},{k:'dialog',n:'Dialog',p:.2,c:'#7c8db5'},{k:'mode',n:'Møde',p:.35,c:'#f5a524'},{k:'tilbud',n:'Tilbud',p:.6,c:'#f26b1f'},{k:'vundet',n:'Vundet',p:1,c:'#22a34a'},{k:'tabt',n:'Tabt',p:0,c:'#e5484d'}];
const ST={};STAGES.forEach((s,i)=>{s.i=i;ST[s.k]=s});
const OPEN=['lead','dialog','mode','tilbud'];
const TYPES={studio:{n:'Metz Studio',s:'Studio',c:'#f26b1f'},adhoc:{n:'Ad hoc-ordre',s:'Ad hoc',c:'#eab308'},'':{n:'Uafklaret',s:'Uafklaret',c:'#a1a1aa'}};
const ORD=[{k:'bekraeftet',n:'Bekræftet'},{k:'produktion',n:'I produktion'},{k:'afsendt',n:'Afsendt'},{k:'leveret',n:'Leveret'},{k:'faktureret',n:'Faktureret'}];
const OM={};ORD.forEach((o,i)=>{o.i=i;OM[o.k]=o});
const SST=[{k:'onboarding',n:'Onboarding',cls:'em'},{k:'live',n:'Live',cls:'ok'},{k:'pause',n:'Pause',cls:''}];
const SSM={};SST.forEach((s,i)=>{s.i=i;SSM[s.k]=s});
const PS=[{k:'plan',n:'Planlagt',c:'#a1a1aa'},{k:'igang',n:'I gang',c:'#f26b1f'},{k:'venter',n:'Venter',c:'#f5a524'},{k:'faerdig',n:'Færdig',c:'#22a34a'}];
const PSM={};PS.forEach((s,i)=>{s.i=i;PSM[s.k]=s});
const IS=[{k:'ny',n:'Ny',c:'#7c8db5'},{k:'vurderes',n:'Vurderes',c:'#f5a524'},{k:'godkendt',n:'Godkendt',c:'#22a34a'},{k:'parkeret',n:'Parkeret',c:'#a1a1aa'}];
const ISM={};IS.forEach(s=>{ISM[s.k]=s});
const CATS=['Metz Studio','Salg','Produkt','Proces','Marketing','Andet'],GAIN=['Kunden','Sælgerne','Metz','Alle'];
const SOURCES=['Inbound','Outbound','LinkedIn','Netværk','Eksisterende kunde','Henvisning','Messe/event'],SEGS=['SMV','Enterprise'];
const DEF_STEPS=['Aftale & kickoff','Kunde: Brandmateriale (logo, farver, fonte)','Kunde: Sortiment valgt','Kunde: Mockups godkendt','Shop oprettet i Notes & logo i BC','Kunde: Brugere, budget & levering','Kunde: Test & godkendelse af shop','Lancering','Aktivering efter 30 dage'];
const DEF_INFO=['Logo i vektorformat (AI, EPS, SVG eller PDF)','Farvekoder (Pantone / HEX)','Brandguide og fonte','Kontaktperson og godkender','Fakturaoplysninger (CVR / EAN)','Leveringsadresse(r)','Medarbejderliste til shoppen','Budget pr. medarbejder','Godkendelse af mockups','Ønsket lanceringsdato'];
const PAL=['#f26b1f','#0ea5e9','#8b5cf6','#10b981','#ef4444','#d97706','#14b8a6','#6366f1','#ec4899','#64748b'];
const BARC=['#f59e0b','#f2aa0c','#eab308','#d2bd0f','#b8c614','#9acb18','#7cc520','#5abc35','#36ad4a','#22a34a'];

/* ============ Ikoner ============ */
const IC={
dash:'<rect x="3.5" y="3.5" width="7" height="8" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.6"/><rect x="13.5" y="11.5" width="7" height="9" rx="1.6"/><rect x="3.5" y="14.5" width="7" height="6" rx="1.6"/>',
pipe:'<rect x="3.5" y="4" width="4.5" height="16" rx="1.4"/><rect x="9.75" y="4" width="4.5" height="11" rx="1.4"/><rect x="16" y="4" width="4.5" height="7" rx="1.4"/>',
orders:'<path d="M9 3.5h6a1 1 0 0 1 1 1V6H8V4.5a1 1 0 0 1 1-1z"/><path d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v13A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 17.5 5H16"/><path d="M9 11h6M9 15h4"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.4 3.3-5.3 6.5-5.3s5.7 1.9 6.5 5.3"/><path d="M15.5 4.7a3.5 3.5 0 0 1 0 6.6M17.6 14.9c1.9.7 3.2 2.4 3.6 5.1"/>',
store:'<path d="M4.5 10v10h15V10"/><path d="M3.5 9.6 5 4h14l1.5 5.6a2.8 2.8 0 0 1-5.6.4 2.8 2.8 0 0 1-5.6 0 2.8 2.8 0 0 1-5.6 0z"/><path d="M10 20v-4.5h4V20"/>',
route:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H16a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h7.5"/>',
folder:'<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h3.6l2 2h7.4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
bulb:'<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.2 1 2.1h5c0-.9.4-1.7 1-2.1A6 6 0 0 0 12 3z"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
bell:'<path d="M6 9a6 6 0 0 1 12 0c0 6.5 2.5 8.5 2.5 8.5h-17S6 15.5 6 9"/><path d="M10.2 20.5a2 2 0 0 0 3.6 0"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
filter:'<path d="M4 5.5h16l-6.2 7.2v5.6L10.2 20v-7.3z"/>',
sort:'<path d="M7.5 4v16M4 7.5 7.5 4 11 7.5M16.5 20V4M13 16.5l3.5 3.5 3.5-3.5"/>',
sliders:'<path d="M4 7h9M18 7h2M4 17h3M11 17h9"/><circle cx="15.5" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
list:'<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.8" cy="6.5" r=".9"/><circle cx="4.8" cy="12" r=".9"/><circle cx="4.8" cy="17.5" r=".9"/>',
cloudUp:'<path d="M7 18.5a4.5 4.5 0 0 1-.7-8.9 6 6 0 0 1 11.5-1.5 4.2 4.2 0 0 1 .2 8.4"/><path d="M12 12.5v7M9.2 15.2 12 12.5l2.8 2.7"/>',
cloudDown:'<path d="M7 18.5a4.5 4.5 0 0 1-.7-8.9 6 6 0 0 1 11.5-1.5 4.2 4.2 0 0 1 .2 8.4"/><path d="M12 12.5v7M9.2 16.8 12 19.5l2.8-2.7"/>',
dots:'<circle cx="5.5" cy="12" r="1.1"/><circle cx="12" cy="12" r="1.1"/><circle cx="18.5" cy="12" r="1.1"/>',
star:'<path d="m12 3.8 2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z"/>',
check:'<path d="m5 12.5 4.3 4.3L19 7.2"/>',
chev:'<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
chevr:'<path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>',
updown:'<path d="m8 9.5 4-4 4 4M8 14.5l4 4 4-4"/>',
x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
up:'<path d="M3.5 16.5 9 11l4 4 7.5-7.5"/><path d="M15 7.5h5.5V13"/>',
down:'<path d="M3.5 7.5 9 13l4-4 7.5 7.5"/><path d="M15 16.5h5.5V11"/>',
cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.2"/><path d="M3.5 9.8h17M8 3v4M16 3v4"/>',
mail:'<rect x="3" y="5" width="18" height="14" rx="2.2"/><path d="m3.8 7 8.2 6 8.2-6"/>',
phone:'<path d="M5.2 3.8h3.6l1.9 4.7-2.4 1.5a11 11 0 0 0 5.7 5.7l1.5-2.4 4.7 1.9v3.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 3.2 6a2 2 0 0 1 2-2.2"/>',
copy:'<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
trash:'<path d="M4.5 7h15M10 11v6M14 11v6M6 7l.9 12.2A1.5 1.5 0 0 0 8.4 20.5h7.2a1.5 1.5 0 0 0 1.5-1.3L18 7M9 7V4.5h6V7"/>',
assign:'<path d="M14.5 5.5 19 10l-4.5 4.5"/><path d="M19 10H9.5a5 5 0 0 0-5 5v3.5"/>',
edit:'<path d="M4 20h4.2L19.3 8.9a2.1 2.1 0 0 0-3-3L5.2 17v3"/><path d="m14.5 7.5 3 3"/>',
menu:'<path d="M4 7h16M4 12h16M4 17h10"/>',
info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.2M12 7.8h.01"/>',
truck:'<path d="M3 6.5h11v9.5H3zM14 9.5h3.8l3.2 3.2v3.3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
arrow:'<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/>',
sparkle:'<path d="M12 3.5l1.9 5.2 5.2 1.9-5.2 1.9L12 17.7l-1.9-5.2-5.2-1.9 5.2-1.9z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
send:'<path d="M20.5 3.5 3.5 10.6l7 2.4 2.4 7z"/><path d="m20.5 3.5-10 9.5"/>',
rocket:'<path d="M5 15c-1.5 1.5-2 4.5-2 6 1.5 0 4.5-.5 6-2"/><path d="M9.5 17.5 6.5 14.5C8 9.5 12 4.5 20 4c-.5 8-5.5 12-10.5 13.5z"/><circle cx="15" cy="9" r="1.6"/>',
flame:'<path d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-3.6 2.6-5.6 3.8-8.8.6 2 1.8 3 2.8 3.4C12 6.6 13.6 4.2 15 3c.3 3.4 3.5 6 3.5 11.2 0 3.7-2.7 6.8-6.5 6.8z"/>',
target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.2"/>'
};
const ic=(n,s=18,w=1.7)=>`<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;

/* ============ Tilstand ============ */
const S={deals:[],studio:[],projects:[],ideas:[],cfg:{target:null,targetRev:null,me:'Tobias',team:['Tobias'],commission:2},tpl:{steps:DEF_STEPS.slice(),info:DEF_INFO.slice()},loaded:false,live:false};
let db=null,dl=null;
const LS=(()=>{try{const s=window.localStorage;s.setItem('_mc','1');s.removeItem('_mc');return s}catch(e){return null}})();
const pref=(k,d)=>{try{const v=LS&&LS.getItem('mc.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}};
const setPref=(k,v)=>{try{LS&&LS.setItem('mc.'+k,JSON.stringify(v))}catch(e){}};
const ALLCOLS=['contact','type','stage','owner','source','score','revenue','value','next','updated'],DEFCOLS=['contact','type','stage','score','value','next','updated'];
const U={view:'dashboard',param:null,
 p:{tab:'open',type:'all',q:'',sort:{k:'next',d:1},mode:pref('pmode','list'),f:{seg:'',owner:'',src:''}},
 o:{tab:'all',q:'',closed:new Set()},c:{tab:'all',q:''},s:{tab:'all',q:''},mx:{all:false},pj:{tab:'alle'},
 id:{tab:'alle',sort:'new',draft:{},edit:null},
 sel:new Set(),cols:(()=>{const c=pref('cols',null);return Array.isArray(c)?c.filter(k=>ALLCOLS.includes(k)):DEFCOLS.slice()})(),dense:!!pref('dense',false),closed:pref('closed',[]),
 drawer:null,pending:false,dpending:false,editTarget:false,bulkDel:false,dragId:null,palIdx:0,palList:[],pjEdit:null,imp:null,tplDraft:null,chart:pref('chart','db')};

/* ============ Hjælpere ============ */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const isoD=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>isoD(new Date());
const nowIso=()=>new Date().toISOString();
const addDays=(iso,n)=>{const d=new Date(iso.slice(0,10)+'T12:00');d.setDate(d.getDate()+n);return isoD(d)};
const daysBetween=(a,b)=>Math.round((new Date(b.slice(0,10)+'T12:00')-new Date(a.slice(0,10)+'T12:00'))/864e5);
const nf=new Intl.NumberFormat('da-DK',{maximumFractionDigits:0});
const isN=v=>typeof v==='number'&&isFinite(v);
const num=v=>isN(v)?v:0;
const kr=n=>isN(n)?nf.format(n)+' kr':'—';
const krs=n=>!isN(n)?'—':Math.abs(n)>=1e6?(n/1e6).toFixed(Math.abs(n)>=1e7?0:1).replace('.',',')+' mio.':Math.abs(n)>=1e4?nf.format(Math.round(n/1e3))+' t.kr.':nf.format(n)+' kr';
const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
const dshort=s=>s?new Date(s.slice(0,10)+'T12:00').toLocaleDateString('da-DK',{day:'numeric',month:'short'}):'';
const dlong=s=>s?new Date(s.slice(0,10)+'T12:00').toLocaleDateString('da-DK',{day:'numeric',month:'long',year:'numeric'}):'';
const rel=iso=>{if(!iso)return '';const d=daysBetween(today(),iso);if(d===0)return 'I dag';if(d===1)return 'I morgen';if(d===-1)return 'I går';if(d>1&&d<7)return 'Om '+d+' dage';if(d<-1&&d>-15)return (-d)+' dage siden';return dshort(iso)};
const ago=iso=>{if(!iso)return '—';const m=Math.round((Date.now()-new Date(iso).getTime())/6e4);if(m<1)return 'lige nu';if(m<60)return m+' min. siden';const h=Math.round(m/60);if(h<24)return h+' t. siden';const d=Math.round(h/24);if(d<2)return 'i går';if(d<7)return d+' dage siden';return dshort(iso)};
const hashS=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)};
const initials=s=>String(s||'?').replace(/[^\p{L}\p{N} ]/gu,' ').trim().split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()||'?';
const coKey=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const sumV=a=>a.reduce((x,d)=>x+num(d.value),0);
const sumF=(a,f)=>a.reduce((x,d)=>x+num(d[f]),0);
const sumR=a=>a.reduce((x,d)=>x+num(d.revenue),0);
const real=a=>a.filter(d=>!d.est),estOnly=a=>a.filter(d=>d.est);
const dgOf=(rev,db)=>isN(rev)&&rev!==0&&isN(db)?db/rev:null;
const pct=v=>isN(v)?(v*100).toFixed(1).replace('.',',')+' %':'—';
const dgCls=v=>!isN(v)?'':v<0?'bad':v<.25?'warn':v>=.4?'ok':'';
const dgBd=v=>isN(v)?`<span class="dg ${dgCls(v)}">${pct(v)}</span>`:'<span class="muted">—</span>';
const estB=d=>d&&d.est?'<span class="est" title="Beløbet er et estimat">ca.</span>':'';
const ymOf=d=>(d.wonDate||'').slice(0,7);
const monthName=k=>{if(!/^\d{4}-\d{2}$/.test(k||''))return 'Uden dato';const [y,m]=k.split('-');return cap(new Date(+y,+m-1,1).toLocaleDateString('da-DK',{month:'long',year:'numeric'}))};
const amt=(d,f='value')=>isN(d[f])?`<span class="${d[f]<0?'neg':''}">${estB(d)}${kr(d[f])}</span>`:'<span class="muted">—</span>';
const firstName=s=>String(s||'').split(/[ ,/]/).filter(Boolean)[0]||'';
const av=(name,cls='')=>`<span class="av ${cls}" style="background:${PAL[hashS(name)%PAL.length]}" title="${esc(name)}">${esc(initials(name))}</span>`;
const co=(name,cls='')=>`<span class="co ${cls}" style="--c:${PAL[hashS(coKey(name))%PAL.length]}" aria-hidden="true">${esc(initials(name))}</span>`;
const lastMonths=n=>{const now=new Date(),out=[];for(let i=n-1;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);out.push({k:d.getFullYear()+'-'+pad(d.getMonth()+1),l:d.toLocaleDateString('da-DK',{month:'short'}).replace('.','')})}return out};
const weekStart=iso=>{const x=new Date(iso.slice(0,10)+'T12:00');x.setDate(x.getDate()-((x.getDay()+6)%7));return isoD(x)};
const lastWeeks=n=>{const w=weekStart(today()),out=[];for(let i=n-1;i>=0;i--)out.push(addDays(w,-7*i));return out};
const niceMax=v=>{if(v<=0)return 1;const e=Math.pow(10,Math.floor(Math.log10(v))),m=v/e;return (m<=1?1:m<=2?2:m<=2.5?2.5:m<=5?5:10)*e};

/* ============ Normalisering ============ */
function normDeal(d){const tr=d.track;const type=(d.type!==undefined&&d.type!==null&&TYPES[d.type]!==undefined)?d.type:(tr==='Studio'?'studio':'');
 return {...d,company:String(d.company||'Uden navn'),title:String(d.title||''),contact:String(d.contact||''),email:String(d.email||''),phone:String(d.phone||''),type,
  segment:d.segment!==undefined?(SEGS.includes(d.segment)?d.segment:''):(SEGS.includes(tr)?tr:''),stage:ST[d.stage]?d.stage:'lead',value:isN(d.value)?d.value:null,
  owner:String(d.owner||S.cfg.me||'Tobias'),source:String(d.source||''),nextStep:String(d.nextStep||''),nextDate:d.nextDate||null,note:String(d.note||''),fav:!!d.fav,
  createdAt:d.createdAt||'',updatedAt:d.updatedAt||'',wonDate:d.wonDate||null,orderStatus:OM[d.orderStatus]?d.orderStatus:'bekraeftet',deadline:d.deadline||null,orderNo:String(d.orderNo||''),revenue:isN(d.revenue)?d.revenue:null,est:!!d.est,legalName:String(d.legalName||''),
  log:Array.isArray(d.log)?d.log.filter(l=>l&&l.t).slice(-50):[]}}
function normStudio(s){return {...s,company:String(s.company||'Uden navn'),contact:String(s.contact||''),email:String(s.email||''),owner:String(s.owner||S.cfg.me||'Tobias'),status:SSM[s.status]?s.status:'onboarding',
  steps:Array.isArray(s.steps)?s.steps.filter(x=>x&&x.t).map(x=>({t:String(x.t),who:x.who==='kunde'?'kunde':'metz',d:!!x.d,at:x.at||null})):[],
  info:Array.isArray(s.info)?s.info.filter(x=>x&&x.t).map(x=>({t:String(x.t),d:!!x.d})):[],
  goLive:s.goLive||null,startDate:s.startDate||null,setupFee:isN(s.setupFee)?s.setupFee:null,shopRevenue:isN(s.shopRevenue)?s.shopRevenue:null,note:String(s.note||''),
  dealId:s.dealId||null,createdAt:s.createdAt||'',updatedAt:s.updatedAt||'',log:Array.isArray(s.log)?s.log.filter(l=>l&&l.t).slice(-60):[]}}
function normP(p){return {...p,title:String(p.title||'Uden navn'),owner:String(p.owner||''),status:PSM[p.status]?p.status:'plan',priority:['Høj','Mellem','Lav'].includes(p.priority)?p.priority:'Mellem',deadline:p.deadline||null,goal:String(p.goal||''),description:String(p.description||''),tasks:Array.isArray(p.tasks)?p.tasks.filter(x=>x&&x.t).map(x=>({t:String(x.t),d:!!x.d})):[]}}
const cl5=v=>Math.min(5,Math.max(1,Math.round(+v)||3));
function normI(i){return {...i,title:String(i.title||'Uden titel'),problem:String(i.problem||''),solution:String(i.solution||''),status:ISM[i.status]?i.status:'ny',impact:cl5(i.impact),effort:cl5(i.effort),category:CATS.includes(i.category)?i.category:'Andet',gainer:GAIN.includes(i.gainer)?i.gainer:'Alle',createdAt:i.createdAt||''}}
function normCfg(){const c=S.cfg;c.me=String(c.me||'Tobias').trim()||'Tobias';c.team=Array.isArray(c.team)?[...new Set(c.team.map(x=>String(x).trim()).filter(Boolean))]:[];if(!c.team.includes(c.me))c.team.unshift(c.me);c.target=isN(c.target)?c.target:null;c.targetRev=isN(c.targetRev)?c.targetRev:null;c.commission=isN(c.commission)?c.commission:2}
const NORM={deals:normDeal,studio:normStudio,projects:normP,ideas:normI};
const tplSteps=()=>(S.tpl.steps&&S.tpl.steps.length?S.tpl.steps:DEF_STEPS).map(l=>{const str=String(l);const m=/^\s*kunde\s*:\s*/i.exec(str);return {t:(m?str.slice(m[0].length):str).trim(),who:m?'kunde':'metz',d:false,at:null}}).filter(x=>x.t);
const tplInfo=()=>(S.tpl.info||DEF_INFO).map(t=>({t:String(t).trim(),d:false})).filter(x=>x.t);

/* ============ Afledte data ============ */
const studioFor=name=>S.studio.find(s=>coKey(s.company)===coKey(name));
const dealsFor=name=>S.deals.filter(d=>coKey(d.company)===coKey(name));
const orders=()=>S.deals.filter(d=>d.type==='adhoc'&&d.stage==='vundet');
const sProgress=s=>{const n=s.steps.length,k=s.steps.filter(x=>x.d).length;return {n,k,p:n?k/n:0,cur:s.steps.findIndex(x=>!x.d)}};
const sMissing=s=>s.info.filter(x=>!x.d).length;
const ownerList=()=>[...new Set([...(S.cfg.team||[]),S.cfg.me,...S.deals.map(d=>d.owner),...S.studio.map(s=>s.owner)].filter(Boolean))];
function score(d){if(d.stage==='vundet')return 10;if(d.stage==='tabt')return 0;let s={lead:2,dialog:4,mode:6,tilbud:7}[d.stage]||2;const t=today();if(d.nextDate)s+=d.nextDate<t?-1:1;if(isN(d.value))s+=1;const age=d.updatedAt?(Date.now()-new Date(d.updatedAt).getTime())/864e5:99;if(age<=7)s+=1;else if(age>30)s-=1;if(d.fav)s+=1;return Math.max(0,Math.min(10,s))}
function scoreText(d){if(d.stage==='vundet')return 'Vundet';if(d.stage==='tabt')return 'Tabt';const p=[ST[d.stage].n],t=today();p.push(d.nextDate?(d.nextDate<t?'næste skridt forfaldent':'næste skridt planlagt'):'intet næste skridt');p.push(isN(d.value)?'har DB-værdi':'mangler DB-værdi');return p.join(' · ')}
function actionItems(){const t=today(),out=[];
 S.deals.forEach(d=>{
  if(d.stage==='vundet'&&!d.type)out.push({pr:0,ic:'info',tone:'warn',t:`${d.company} er vundet`,s:'Vælg om det er Metz Studio eller en ad hoc-ordre',act:'deal:'+d.id});
  if(OPEN.includes(d.stage)&&d.nextDate&&d.nextDate<t)out.push({pr:1,ic:'clock',tone:'bad',t:d.company,s:`${d.nextStep||'Næste skridt'} · forfaldt ${rel(d.nextDate).toLowerCase()}`,act:'deal:'+d.id});
  if(OPEN.includes(d.stage)&&d.nextDate===t)out.push({pr:2,ic:'cal',tone:'em',t:d.company,s:`${d.nextStep||'Næste skridt'} · i dag`,act:'deal:'+d.id});
  if(d.type==='adhoc'&&d.stage==='vundet'&&!['leveret','faktureret'].includes(d.orderStatus)&&d.deadline){const n=daysBetween(t,d.deadline);if(n<=7)out.push({pr:n<0?1:2,ic:'truck',tone:n<0?'bad':'warn',t:`${d.company} · ${d.title||'ordre'}`,s:n<0?`Deadline overskredet (${dshort(d.deadline)})`:`Deadline ${rel(d.deadline).toLowerCase()}`,act:'deal:'+d.id})}
  if(OPEN.includes(d.stage)&&d.updatedAt&&(Date.now()-new Date(d.updatedAt).getTime())/864e5>21)out.push({pr:4,ic:'flame',tone:'',t:d.company,s:`Ingen aktivitet i ${Math.round((Date.now()-new Date(d.updatedAt).getTime())/864e5)} dage`,act:'deal:'+d.id});
 });
 S.studio.filter(s=>s.status==='onboarding').forEach(s=>{const m=sMissing(s);if(m)out.push({pr:3,ic:'store',tone:'warn',t:s.company,s:`Mangler ${m} ${m===1?'punkt':'punkter'} fra kunden`,act:'studio:'+s.id})});
 return out.sort((a,b)=>a.pr-b.pr)}

let confirmDel=null;
/* ============ Datalag ============ */
const clean=o=>JSON.parse(JSON.stringify(o));
const PEND=new Map(),RUN=new Set();
async function write(col,id,data){const k=col+'/'+id;PEND.set(k,data);if(RUN.has(k))return;RUN.add(k);
 try{while(PEND.has(k)){const d=PEND.get(k);PEND.delete(k);try{const ref=db.collection(col).doc(id);if(d===null)await ref.delete();else await ref.set(d)}catch(e){toast('Kunne ikke gemme ('+((e&&e.code)||'fejl')+')',null,'','err')}}}
 finally{RUN.delete(k)}}
async function writeDoc(path,data){const [c,id]=path.split('/');if(db)return write(c,id,clean(data))}
function put(col,obj,opt={}){const now=nowIso();const o={...obj,updatedAt:now};if(opt.create&&!o.createdAt)o.createdAt=now;const full=NORM[col](o);const a=S[col],i=a.findIndex(x=>x.id===full.id);if(i<0)a.push(full);else a[i]=full;schedule();if(!db)return Promise.resolve(full);const {id,...body}=full;return write(col,id,clean(body)).then(()=>full)}
function del(col,obj){S[col]=S[col].filter(x=>x.id!==obj.id);U.sel.delete(obj.id);schedule();if(!db)return Promise.resolve();return write(col,obj.id,null)}
function applySnap(col,snap){const nm=NORM[col],key=id=>col+'/'+id,busy=id=>PEND.has(key(id))||RUN.has(key(id));
 const srv=snap.docs.map(x=>nm({id:x.id,...(x.data()||{})}));
 const out=srv.map(d=>busy(d.id)?S[col].find(x=>x.id===d.id):d).filter(Boolean);
 S[col].forEach(l=>{if(busy(l.id)&&!out.some(o=>o.id===l.id)&&PEND.get(key(l.id))!==null)out.push(l)});
 S[col]=out.filter(d=>PEND.get(key(d.id))!==null)}
const saveCfg=()=>{normCfg();schedule();writeDoc('config/main',S.cfg)};
const saveTpl=()=>{schedule();writeDoc('config/studio',S.tpl)};

/* ============ Render-planlægning ============ */
let rq=0,qt=0;
function schedule(){if(rq)return;rq=requestAnimationFrame(()=>{rq=0;repaint()})}
function repaint(){const ae=document.activeElement,m=$('#main');const editing=ae&&m.contains(ae)&&ae.matches('input:not([data-live]):not([type=checkbox]):not([type=radio]),textarea,select');
 if(editing)U.pending=true;else{U.pending=false;paint()}
 renderChrome();paintDrawer()}
function paint(){const m=$('#main');const ae=document.activeElement;let fid=null,s0=null,s1=null;
 if(ae&&ae.id&&m.contains(ae)){fid=ae.id;try{s0=ae.selectionStart;s1=ae.selectionEnd}catch(e){}}
 const sc=$$('[data-keep-scroll]',m).map(el=>[el.dataset.keepScroll,el.scrollLeft,el.scrollTop]);
 let html;try{html=renderView()}catch(err){console.error(err);html=`<div class="ph"><h1>Ups</h1></div>`+empty('info','Siden kunne ikke tegnes',esc(err&&err.message||String(err)))}
 m.innerHTML=html;
 $$('[data-ind]',m).forEach(el=>{el.indeterminate=true});
 if(fid){const el=document.getElementById(fid);if(el){el.focus({preventScroll:true});if(s0!=null)try{el.setSelectionRange(s0,s1)}catch(e){}}}
 sc.forEach(([k,l,t])=>{const el=m.querySelector(`[data-keep-scroll="${k}"]`);if(el){el.scrollLeft=l;el.scrollTop=t}});
 $$('.tw',m).forEach(el=>{const f=()=>el.classList.toggle('scrolled',el.scrollLeft>2);el.addEventListener('scroll',f,{passive:true});f()})}
function renderView(){if(!S.loaded)return skeleton();const V=VIEWS[U.view]||VIEWS.dashboard;return (db?'':`<div class="banner">${ic('info',16)}<span>Ikke forbundet til databasen i denne visning – ændringer gemmes ikke.</span></div>`)+V.r()}
function renderChrome(){renderSide();renderTop();renderBnav();renderBulk()}
function skeleton(){const row=()=>`<div class="skrow"><div class="sk" style="width:34px;height:34px;border-radius:10px"></div><div class="grow" style="display:grid;gap:7px"><div class="sk" style="width:38%"></div><div class="sk" style="width:22%;height:11px"></div></div><div class="sk" style="width:70px"></div></div>`;return `<div class="skel"><div class="sk" style="width:220px;height:26px"></div><div class="sk" style="width:320px;height:12px"></div><div style="height:12px"></div>${row()}${row()}${row()}${row()}${row()}</div>`}

/* ============ Fælles UI-dele ============ */
const empty=(icn,title,sub,btn='')=>`<div class="empty"><span class="ei">${ic(icn,22)}</span><b>${title}</b><span>${sub}</span>${btn}</div>`;
const stageBd=k=>{const s=ST[k]||ST.lead,cls=k==='vundet'?'ok':k==='tabt'?'bad':k==='tilbud'?'em':'';return `<span class="bd ${cls}"><i style="background:${s.c}"></i>${s.n}</span>`};
const typeBd=t=>{const T=TYPES[t]||TYPES[''];return `<span class="ty ${t||'none'}"><span class="sq" style="background:${T.c}"></span>${T.s}</span>`};
const ordBd=k=>{const o=OM[k]||ORD[0],cls={produktion:'em',afsendt:'warn',leveret:'ok',faktureret:'ok'}[o.k]||'';return `<span class="bd ${cls}">${o.n}</span>`};
const ordDots=k=>{const i=(OM[k]||ORD[0]).i;return `<span class="ordp ${i===ORD.length-1?'fin':''}">${ORD.map((o,j)=>`<i class="${j<=i?'on':''}"></i>`).join('')}</span>`};
const sstBd=k=>{const s=SSM[k]||SST[0];return `<span class="bd ${s.cls}">${s.k==='live'?'<i class="live"></i>':''}${s.n}</span>`};
const scoreHtml=v=>`<span class="score" title="Score ${v} af 10"><span class="bars">${Array.from({length:10},(_,i)=>`<i${i<v?` style="background:${BARC[i]}"`:''}></i>`).join('')}</span><span class="box">${v}/10</span></span>`;
const segBar=(k,n,cls='')=>n?`<span class="sgb ${cls}">${Array.from({length:n},(_,i)=>`<i class="${i<k?'on':''}"></i>`).join('')}</span>`:'';
const tabsHtml=(sc,list,cur,cnt)=>`<div class="tabs" role="tablist">${list.map(([k,n])=>{const c=cnt?cnt(k):null;return `<button class="tab ${cur===k?'on':''}" role="tab" aria-selected="${cur===k}" data-tab="${sc}:${k}">${n}${c!=null?`<span class="n">${c}</span>`:''}</button>`}).join('')}</div>`;
const kpi=(lab,val,o={})=>`<div class="kpi"><div class="kpi-t"><div class="lab">${lab}</div><div class="val">${val}${o.dl||''}</div>${o.hint?`<div class="hint" title="${String(o.title||o.hint).replace(/<[^>]+>/g,'').replace(/"/g,'&quot;')}">${o.hint}</div>`:''}</div>${o.vis||''}</div>`;
const delta=(cur,prev)=>{if(!prev&&!cur)return '';if(!prev)return `<span class="dl up">${ic('up',14,2)}ny</span>`;const p=Math.round((cur-prev)/prev*100);return `<span class="dl ${p>=0?'up':'down'}">${ic(p>=0?'up':'down',14,2)}${Math.abs(p)}%</span>`};
const miniBars=(vals,colors)=>{const m=Math.max(1,...vals);return `<span class="mbars" aria-hidden="true">${vals.map((v,i)=>`<i style="height:${Math.max(8,v/m*100)}%;background:${Array.isArray(colors)?colors[i]:colors};opacity:${v?1:.22}"></i>`).join('')}</span>`};
let gid=0;
function spark(vals,color='#f26b1f',w=118,h=40){const n=vals.length;if(n<2)return '';const max=Math.max(...vals),min=Math.min(...vals),rng=max-min;const pts=vals.map((v,i)=>[+(i*(w/(n-1))).toFixed(1),+(rng?h-5-((v-min)/rng)*(h-12):h-8).toFixed(1)]);
 let d=`M${pts[0][0]},${pts[0][1]}`;for(let i=0;i<n-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;const c1=[(p1[0]+(p2[0]-p0[0])/6).toFixed(1),(p1[1]+(p2[1]-p0[1])/6).toFixed(1)],c2=[(p2[0]-(p3[0]-p1[0])/6).toFixed(1),(p2[1]-(p3[1]-p1[1])/6).toFixed(1)];d+=` C${c1} ${c2} ${p2}`}
 const id='sg'+(++gid),L=pts[n-1];return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${d} L${w},${h} L0,${h}Z" fill="url(#${id})"/><path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${L[0]}" cy="${L[1]}" r="3" fill="${color}" stroke="#fff" stroke-width="1.5"/></svg>`}
function donut(parts,size=46,sw=7){const tot=parts.reduce((a,p)=>a+p[0],0),r=(size-sw)/2,C=2*Math.PI*r,c=size/2;let off=0;const segs=tot?parts.filter(p=>p[0]>0).map(([v,col])=>{const len=v/tot*C;const g=parts.filter(p=>p[0]>0).length>1?1.5:0;const s=`<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-dasharray="${Math.max(0,len-g).toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${c} ${c})"/>`;off+=len;return s}).join(''):'';return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".08" stroke-width="${sw}"/>${segs}</svg>`}
function ring(p,size=132,sw=12,color='#f26b1f',p2=0){const r=(size-sw)/2,C=2*Math.PI*r,c=size/2,arc=(v,op,cls)=>`<circle class="${cls}" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${color}" stroke-opacity="${op}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${(C*Math.min(1,Math.max(0,v))).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${c} ${c})"/>`;return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".09" stroke-width="${sw}"/>${p2>p?arc(p2,.3,'arc arc2'):''}${p>0?arc(p,1,'arc'):''}</svg>`}
const cardH=(title,sub='',right='')=>`<div class="pn-h"><div><h3>${title}</h3>${sub?`<small>${sub}</small>`:''}</div>${right}</div>`;
const nextCell=d=>{const t=today(),late=OPEN.includes(d.stage)&&d.nextDate&&d.nextDate<t,tod=d.nextDate===t;return `<span class="nxc">${d.nextDate?`<span class="dchip ${late?'late':tod?'today':''}">${ic('cal',12)}${rel(d.nextDate)}</span>`:''}<span class="nxt">${esc(d.nextStep||'—')}</span></span>`};

/* ============ Sidebar, topbar, bundnavigation ============ */
function renderSide(){const t=today(),open=S.deals.filter(d=>OPEN.includes(d.stage)),onb=S.studio.filter(s=>s.status==='onboarding'),miss=onb.some(s=>sMissing(s)),actO=orders().filter(o=>!['leveret','faktureret'].includes(o.orderStatus)).length;
 const item=(v,icn,label,cnt,hot)=>`<a class="nav ${U.view===v?'on':''}" href="#${v}" data-go="${v}">${ic(icn)}<span>${label}</span>${cnt?`<span class="cnt ${hot?'hot':''}">${cnt}</span>`:''}</a>`;
 const sec=(k,label,body)=>`<div class="sec ${U.closed.includes(k)?'closed':''}"><button class="sec-h" data-sec="${k}" aria-expanded="${!U.closed.includes(k)}">${ic('chev',14,2)}${label}</button><div class="sec-b">${body}</div></div>`;
 const tl=(k,label)=>{const c=open.filter(d=>d.type===(k==='none'?'':k)).length;return `<button class="nav" data-ptype="${k}"><span class="sq" style="background:${TYPES[k==='none'?'':k].c}"></span><span>${label}</span>${c?`<span class="cnt">${c}</span>`:''}</button>`};
 $('#side').innerHTML=`<button class="ws" data-go="dashboard"><span class="ws-logo">M</span><span class="grow"><b>Metz A/S</b><small>New business cockpit</small></span>${ic('updown',16)}</button>
 <button class="sbox" data-act="palette">${ic('search',16)}<span>Søg</span><span class="kbd">/</span></button>
 ${sec('salg','Salg',item('dashboard','dash','Dashboard')+item('pipeline','pipe','Pipeline',open.length)+item('ordrer','orders','Ordrer',actO)+item('kunder','users','Kunder'))}
 ${sec('studio','Metz Studio',item('studio','store','Studio-kunder',S.studio.length)+item('onboarding','route','Onboarding',onb.length,miss))}
 ${sec('team','Team',item('projekter','folder','Projekter',S.projects.filter(p=>p.status==='igang').length)+item('ideer','bulb','Idéer',S.ideas.filter(i=>i.status==='ny').length))}
 ${sec('typer','Åbne deals pr. type',tl('studio','Metz Studio')+tl('adhoc','Ad hoc-ordrer')+tl('none','Uafklarede'))}
 ${sec('sys','System',item('indstillinger','gear','Indstillinger'))}
 <div class="me">${av(S.cfg.me,'lg')}<div class="grow"><b>${esc(S.cfg.me)}</b><span class="sync ${S.live?'on':''}">${S.live?'Synkroniseret':'Ikke forbundet'}</span></div>${window.metzAuth?`<button class="ib" data-act="logout" aria-label="Log ud" title="Log ud">${ic('x')}</button>`:`<button class="ib" data-go="indstillinger" aria-label="Indstillinger">${ic('dots')}</button>`}</div>`}
function renderTop(){const V=VIEWS[U.view]||VIEWS.dashboard;let crumb=`<b>${V.t}</b>`;
 if(U.view==='studio'&&U.param){const s=S.studio.find(x=>x.id===U.param);crumb=`<a href="#studio" data-go="studio" class="hide-s">Studio-kunder</a><span class="hide-s">${ic('chevr',14)}</span><b>${esc(s?s.company:'Kunde')}</b>`}
 const n=actionItems().length,team=S.cfg.team||[];
 $('#topbar').innerHTML=`<button class="ib hb" data-act="menu" aria-label="Åbn menu">${ic('menu',20)}</button><div class="crumb">${crumb}</div><span class="grow"></span>
 <button class="cmdk hide-m" data-act="palette">${ic('search',16)}<span>Søg efter kunder, deals…</span><span class="kbd">⌘K</span></button>
 <button class="ib only-m" data-act="palette" aria-label="Søg">${ic('search',19)}</button>
 <button class="ib" data-act="bell" aria-label="Kræver handling">${ic('bell',19)}${n?`<span class="bdg">${n>9?'9+':n}</span>`:''}</button>
 <span class="avs hide-m" style="margin:0 6px">${team.slice(0,4).map(x=>av(x)).join('')}${team.length>4?`<span class="av more">+${team.length-4}</span>`:''}</span>
 <button class="btn pri" data-act="newDeal">${ic('plus',16,2.2)}<span class="hide-s">Ny deal</span></button>`}
function renderBnav(){const it=(v,icn,l,b)=>`<a href="#${v}" data-go="${v}" class="${U.view===v?'on':''}">${ic(icn,22)}<span>${l}</span>${b?`<span class="bdg">${b}</span>`:''}</a>`;const ob=S.studio.filter(s=>s.status==='onboarding'&&sMissing(s)).length;
 $('#bnav').innerHTML=it('dashboard','dash','Overblik')+it('pipeline','pipe','Pipeline')+it('studio','store','Studio',ob)+it('ordrer','orders','Ordrer')+`<a href="#" data-act="menu">${ic('menu',22)}<span>Mere</span></a>`}
function renderBulk(){const b=$('#bulk');const valid=[...U.sel].filter(id=>S.deals.some(d=>d.id===id));U.sel=new Set(valid);const n=U.sel.size;
 if(!n||U.view!=='pipeline'){b.hidden=true;U.bulkDel=false;return}
 b.hidden=false;b.innerHTML=`<span class="lbl">Valgt: ${n}</span><span class="vs"></span><button data-bulk="stage">${ic('pipe',16)}Flyt fase</button><button data-bulk="type">${ic('store',16)}Type</button><button data-bulk="owner">${ic('assign',16)}Tildel</button><button data-bulk="fav">${ic('star',16)}Favorit</button><button data-bulk="del" class="${U.bulkDel?'warn':''}">${ic('trash',16)}${U.bulkDel?'Bekræft sletning':'Slet'}</button><span class="vs"></span><button class="dis" data-bulk="clear">Fravælg</button>`}

/* ============ Dashboard ============ */
function vDash(){const t=today(),y=t.slice(0,4),D=S.deals,open=D.filter(d=>OPEN.includes(d.stage)),won=D.filter(d=>d.stage==='vundet'),lost=D.filter(d=>d.stage==='tabt');
 const wonY=won.filter(d=>(d.wonDate||d.updatedAt||'').startsWith(y)),realY=real(wonY),wonSum=sumV(realY),estSum=sumV(estOnly(wonY)),estRev=sumR(estOnly(wonY)),revY=sumR(realY),dgY=dgOf(revY,wonSum),tgtD=num(S.cfg.target),pipe=sumV(open),wpipe=open.reduce((a,d)=>a+num(d.value)*ST[d.stage].p,0);
 const ms=lastMonths(8),ser=ms.map(m=>sumV(real(won).filter(d=>(d.wonDate||'').startsWith(m.k))));
 const st=S.studio,live=st.filter(s=>s.status==='live').length,onb=st.filter(s=>s.status==='onboarding'),miss=onb.reduce((a,s)=>a+sMissing(s),0);
 const ord=orders(),act=ord.filter(o=>!['leveret','faktureret'].includes(o.orderStatus)),soon=act.filter(o=>o.deadline&&daysBetween(t,o.deadline)<=7);
 const h=new Date().getHours(),greet=h<5?'God nat':h<10?'Godmorgen':h<12?'God formiddag':h<18?'God eftermiddag':'God aften';
 const ds=cap(new Date().toLocaleDateString('da-DK',{weekday:'long',day:'numeric',month:'long'}));
 return `<div class="ph"><div class="grow"><h1>${greet}, ${esc(S.cfg.me)}</h1><p class="sub">${ds} · ${open.length} åbne deals · ${onb.length} Studio-kunder i onboarding · ${act.length} aktive ordrer</p></div><div class="ph-a"><button class="btn" data-act="newIdea">${ic('bulb',16)}Ny idé</button><button class="btn soft" data-act="newDeal">${ic('plus',16,2)}Ny deal</button></div></div>
 <div class="kpis">
 ${kpi('Vundet DB '+y,krs(wonSum),{dl:delta(ser[7],ser[6]),vis:ser.some(v=>v)?spark(ser):'',hint:tgtD?`${Math.round(wonSum/tgtD*100)} % af årsmålet`:`DG ${pct(dgY)}`,title:`Omsætning ${krs(revY)} · DG ${pct(dgY)}${tgtD?` · mål ${kr(tgtD)}`:''}${estSum?` · +${krs(estSum)} DB forventet`:''}`})}
 ${kpi('Åben pipeline',krs(pipe),{vis:miniBars(OPEN.map(k=>open.filter(d=>d.stage===k).length),OPEN.map(k=>ST[k].c)),hint:`Vægtet ${krs(wpipe)} · ${open.length} deals`})}
 ${kpi('Metz Studio',`${live}<small>live</small>`,{vis:donut([[live,'#22a34a'],[onb.length,'#f26b1f'],[st.length-live-onb.length,'#c4c4cc']]),hint:`${onb.length} i onboarding · ${miss} mangler`})}
 ${kpi('Ad hoc-ordrer',`${act.length}<small>aktive</small>`,{vis:miniBars(ORD.map(o=>ord.filter(x=>x.orderStatus===o.k).length),'#eab308'),hint:soon.length?`<span class="warn-t">${soon.length} med deadline inden 7 dage</span>`:'Ingen deadlines i 7 dage'})}
 </div>
 <div class="grid">
 <section class="pn s7">${actionCard()}</section>
 <section class="pn s5">${goalCard(wonSum,estSum,won,lost,dgY,revY,realY,estRev)}</section>
 <section class="pn s8">${monthCard(won)}</section>
 <section class="pn s4">${funnelCard()}</section>
 <section class="pn s6">${onbCard(onb)}</section>
 <section class="pn s6">${ordersCard(act)}</section>
 <section class="pn s6">${projCard()}</section>
 <section class="pn s6">${ideaCard()}</section>
 </div>`}
function actionCard(){const it=actionItems();return cardH('Kræver handling',it.length?`${it.length} ${it.length===1?'ting venter':'ting venter'} på dig`:'Alt er under kontrol')+(it.length?`<ul class="acts-l">${it.slice(0,7).map(a=>`<li><button class="act-i" data-open="${a.act}"><span class="act-ic ${a.tone}">${ic(a.ic,16)}</span><span class="grow"><b>${esc(a.t)}</b><small>${esc(a.s)}</small></span>${ic('chevr',16)}</button></li>`).join('')}</ul>${it.length>7?`<p class="more-l">+${it.length-7} flere under klokken øverst</p>`:''}`:empty('check','Ingen åbne punkter','Forfaldne opgaver, manglende kundeinfo og deadlines dukker op her.'))}
function goalCard(wonSum,estSum,won,lost,dgY,revY,realY,estRev){const y=today().slice(0,4),tgt=num(S.cfg.target),tgr=num(S.cfg.targetRev),withV=(realY||[]).filter(d=>isN(d.value)),avg=withV.length?Math.round(sumV(withV)/withV.length):null,wr=won.length+lost.length?Math.round(won.length/(won.length+lost.length)*100)+' %':'—';
 const daysLeft=Math.max(0,Math.round((new Date(+y,11,31)-new Date(today()+'T00:00:00'))/864e5)),wLeft=Math.max(1,daysLeft/7);
 const row=(lab,val,est,goal,color,cls)=>{if(!goal)return `<div class="gl-row nogoal"><div class="ringw sm ${cls}">${ring(0,96,9,color)}<div class="ring-l"><b>—</b></div></div><div class="gtx"><div class="g1"><span>${lab}</span></div><b class="g2">${kr(val)}</b><small class="g3">Intet mål sat endnu – tryk “Ret mål”</small></div></div>`;
  const p=val/goal,p2=(val+est)/goal,miss=goal-val-est,missR=goal-val;
  const st=missR<=0?`<span class="ok-t">${ic('check',13,2.4)}Målet er nået</span>`:miss<=0?`<span class="ok-t">${ic('check',13,2.4)}Nås med de forventede ordrer</span>`:`Mangler <b>${kr(miss)}</b>${daysLeft?` · <span class="pace">≈ ${krs(miss/wLeft)} pr. uge</span>`:''}`;
  return `<div class="gl-row"><div class="ringw sm ${cls}">${ring(p,96,9,color,p2)}<div class="ring-l"><b>${Math.round(p*100)}%</b>${est?`<small>${Math.round(p2*100)} % inkl.</small>`:''}</div></div><div class="gtx"><div class="g1"><span>${lab}</span><span>mål ${kr(goal)}</span></div><b class="g2">${kr(val)}</b>${est?`<small class="g3 est-t">+${kr(est)} forventet</small>`:''}<small class="g3">${st}</small></div></div>`};
 return cardH('Årsmål '+y,daysLeft?`${daysLeft} dage tilbage af året`:'Året er slut',`<button class="btn sm" data-act="editTarget">${ic('edit',14)}${U.editTarget?'Luk':'Ret mål'}</button>`)+
 (U.editTarget?`<div class="inl2"><label class="fl">DB-mål (kr)<input class="in" id="tgv" type="number" inputmode="numeric" value="${tgt||''}" placeholder="Fx 700000" data-enter="saveTarget"></label><label class="fl">Omsætningsmål (kr)<input class="in" id="tgr" type="number" inputmode="numeric" value="${tgr||''}" placeholder="Fx 1500000" data-enter="saveTarget"></label><button class="btn pri" data-act="saveTarget">Gem</button></div>`:'')+
 `<div class="goal2">${row('DB',wonSum,estSum,tgt,'#f26b1f','')}${row('Omsætning',revY,estRev||0,tgr,'currentColor','rev')}</div><dl class="kv3"><div><dt>Dækningsgrad</dt><dd>${pct(dgY)}</dd></div><div><dt>Snit-DB pr. ordre</dt><dd>${isN(avg)?kr(avg):'—'}</dd></div><div><dt>Win rate</dt><dd>${wr}</dd></div></dl>`}
function monthCard(won){const M=U.chart==='rev'?'rev':'db',f=M==='rev'?(d=>num(d.revenue)):(d=>num(d.value)),SM=a=>a.reduce((x,d)=>x+f(d),0),ms=lastMonths(12);
 const rows=ms.map(m=>{const w=won.filter(d=>(d.wonDate||'').startsWith(m.k)),r=real(w);return {...m,s:SM(r.filter(d=>d.type==='studio')),a:SM(r.filter(d=>d.type==='adhoc')),u:SM(r.filter(d=>!d.type)),e:SM(estOnly(w)),n:w.length}});
 const max=Math.max(...rows.map(r=>Math.max(0,r.s)+Math.max(0,r.a)+Math.max(0,r.u)+Math.max(0,r.e)));
 const tog=`<div class="seg sm-seg" role="group" aria-label="Vis">${[['db','DB'],['rev','Omsætning']].map(([k,n])=>`<button class="${M===k?'on':''}" data-chart="${k}">${n}</button>`).join('')}</div>`;
 const leg=`<span class="leg"><span><i style="background:#f26b1f"></i>Studio</span><span><i style="background:#eab308"></i>Ad hoc</span><span><i class="lest"></i>Forventet</span></span>`;
 const head=`<div class="pn-h"><div><h3>${M==='rev'?'Omsætning':'Vundet DB'} pr. måned</h3><small>Sidste 12 måneder</small></div><div class="ch-r">${leg}${tog}</div></div>`;
 if(!max)return head+empty('pipe','Ingen vundne beløb endnu','Når vundne ordrer har beløb, vises de her – delt op på Studio og ad hoc.');
 const top=niceMax(max),ticks=[0,.25,.5,.75,1].map(x=>top*x),P=v=>Math.max(0,v);
 return head+`<div class="chart"><div class="gls">${ticks.map(v=>`<div class="gl" style="bottom:${v/top*100}%"><span>${v?krs(v).replace(' kr',''):'0'}</span></div>`).join('')}</div><div class="cols">${rows.map(r=>{const tot=P(r.s)+P(r.a)+P(r.u)+P(r.e);const hh=(tot/top*100).toFixed(1);return `<div class="mc" tabindex="0" style="--h:${hh}%"><div class="stk" style="height:${hh}%">${P(r.s)?`<i style="flex:${P(r.s)};background:#f26b1f"></i>`:''}${P(r.a)?`<i style="flex:${P(r.a)};background:#eab308"></i>`:''}${P(r.u)?`<i style="flex:${P(r.u)};background:#c4c4cc"></i>`:''}${P(r.e)?`<i class="e" style="flex:${P(r.e)}"></i>`:''}</div><span class="ml">${r.l}</span><div class="tip"><b>${cap(r.l)}</b><span><i style="background:#f26b1f"></i>Studio ${kr(r.s)}</span><span><i style="background:#eab308"></i>Ad hoc ${kr(r.a)}</span>${r.u?`<span><i style="background:#c4c4cc"></i>Uafklaret ${kr(r.u)}</span>`:''}${r.e?`<span><i class="lest"></i>Forventet ${kr(r.e)}</span>`:''}<em>${r.n} ${r.n===1?'ordre':'ordrer'}</em></div></div>`}).join('')}</div></div>`}
function funnelCard(){const rows=OPEN.concat('vundet').map(k=>{const ds=S.deals.filter(d=>d.stage===k);return {k,c:ds.length,v:sumV(real(ds))}}),m=Math.max(1,...rows.map(r=>r.c));
 return cardH('Pipeline pr. fase','Antal · DB')+`<div class="fun">${rows.map(r=>`<button class="fun-r" data-funnel="${r.k}"><span class="fun-l"><i style="background:${ST[r.k].c}"></i>${ST[r.k].n}</span><span class="fun-t"><span style="width:${r.c?Math.max(5,r.c/m*100):0}%;background:${ST[r.k].c}"></span></span><span class="fun-v"><b>${r.c}</b> · ${krs(r.v)}</span></button>`).join('')}</div>`}
function onbCard(onb){return cardH('Metz Studio · onboarding',`${onb.length} ${onb.length===1?'kunde':'kunder'} i gang`,`<a class="lnk" href="#onboarding" data-go="onboarding">Overblik ${ic('arrow',14)}</a>`)+(onb.length?`<ul class="ol">${onb.map(s=>{const pr=sProgress(s),m=sMissing(s),cur=s.steps[pr.cur];return `<li><button class="ol-i" data-open="studio:${s.id}">${co(s.company)}<span class="grow"><b>${esc(s.company)}</b><small>${cur?`${cur.who==='kunde'?'Venter på kunden':'Næste'}: ${esc(cur.t)}`:'Alle trin klaret'}</small>${segBar(pr.k,pr.n,pr.k===pr.n?'full':'')}</span><span class="ol-r">${m?`<span class="bd warn">${m} mangler</span>`:'<span class="bd ok">Komplet</span>'}<small class="muted">${Math.round(pr.p*100)} %</small></span></button></li>`}).join('')}</ul>`:empty('store','Ingen kunder i onboarding','Når en Metz Studio-deal vindes, oprettes onboardingen automatisk.'))}
function ordersCard(act){const t=today(),rows=act.slice().sort((a,b)=>(a.deadline||'9999').localeCompare(b.deadline||'9999')).slice(0,6);return cardH('Ad hoc-ordrer på vej',`${act.length} aktive`,`<a class="lnk" href="#ordrer" data-go="ordrer">Alle ordrer ${ic('arrow',14)}</a>`)+(rows.length?`<ul class="ol">${rows.map(o=>`<li><button class="ol-i" data-open="deal:${o.id}">${co(o.company)}<span class="grow"><b>${esc(o.company)}</b><small>${esc(o.title||'Ad hoc-ordre')}</small></span><span class="ol-r">${ordBd(o.orderStatus)}<small class="${o.deadline&&o.deadline<t?'bad-t':'muted'}">${o.deadline?rel(o.deadline):'Ingen deadline'}</small></span></button></li>`).join('')}</ul>`:empty('orders','Ingen aktive ordrer','Vundne ad hoc-deals lander her med status og deadline.'))}
function projCard(){const act=S.projects.filter(p=>p.status!=='faerdig').sort((a,b)=>(a.status==='igang'?0:1)-(b.status==='igang'?0:1)||(a.deadline||'9999').localeCompare(b.deadline||'9999')).slice(0,4);return cardH('Team-projekter',`${S.projects.filter(p=>p.status==='igang').length} i gang`,`<a class="lnk" href="#projekter" data-go="projekter">Alle ${ic('arrow',14)}</a>`)+(act.length?`<ul class="ol">${act.map(p=>{const n=p.tasks.length,k=p.tasks.filter(x=>x.d).length;return `<li><button class="ol-i" data-open="proj:${p.id}"><span class="act-ic">${ic('folder',16)}</span><span class="grow"><b>${esc(p.title)}</b><small>${PSM[p.status].n}${n?` · ${k}/${n} opgaver`:''}${p.deadline?` · ${dshort(p.deadline)}`:''}</small>${n?segBar(k,Math.min(n,12),k===n?'full':''):''}</span>${ic('chevr',16)}</button></li>`}).join('')}</ul>`:empty('folder','Ingen aktive projekter','Opret et projekt, fx optimering af Metz Studio.'))}
function ideaCard(){const list=S.ideas.slice().sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')).slice(0,4);return cardH('Nyeste idéer',`${S.ideas.length} i alt`,`<a class="lnk" href="#ideer" data-go="ideer">Alle ${ic('arrow',14)}</a>`)+(list.length?`<ul class="ol">${list.map(i=>`<li><button class="ol-i" data-open="idea:${i.id}"><span class="act-ic ${i.impact>=4&&i.effort<=2?'ok':''}">${ic('bulb',16)}</span><span class="grow"><b>${esc(i.title)}</b><small>${esc(i.category)} · effekt ${i.impact} · indsats ${i.effort}</small></span><span class="bd"><i style="background:${ISM[i.status].c}"></i>${ISM[i.status].n}</span></button></li>`).join('')}</ul>`:empty('bulb','Ingen idéer endnu','Skriv den første idé ned i fast format.',`<button class="btn soft" data-act="newIdea">${ic('plus',16,2)}Ny idé</button>`))}

/* ============ Pipeline ============ */
const TABF={open:d=>OPEN.includes(d.stage),fav:d=>d.fav,new:d=>!!d.createdAt&&daysBetween(d.createdAt,today())<=14,over:d=>OPEN.includes(d.stage)&&!!d.nextDate&&d.nextDate<today(),hot:d=>OPEN.includes(d.stage)&&score(d)>=7,won:d=>d.stage==='vundet',lost:d=>d.stage==='tabt',all:()=>true};
const SORTF={company:d=>d.company.toLowerCase(),contact:d=>d.contact.toLowerCase()||'~',type:d=>d.type||'~',stage:d=>ST[d.stage].i,owner:d=>d.owner.toLowerCase(),source:d=>d.source||'~',score:d=>score(d),revenue:d=>num(d.revenue),value:d=>num(d.value),next:d=>d.nextDate||'9999-99-99',updated:d=>d.updatedAt||''};
const PCOLS=[
 {k:'contact',l:'Kontakt',r:d=>d.contact?`<span class="cell2"><b>${esc(d.contact)}</b>${d.email?`<small>${esc(d.email)}</small>`:''}</span>`:'<span class="muted">—</span>'},
 {k:'type',l:'Type',r:d=>typeBd(d.type)},
 {k:'stage',l:'Fase',r:d=>stageBd(d.stage)},
 {k:'owner',l:'Ansvarlig',r:d=>`<span class="own">${av(d.owner,'sm')}${esc(d.owner)}</span>`},
 {k:'source',l:'Kilde',r:d=>d.source?esc(d.source):'<span class="muted">—</span>'},
 {k:'score',l:'Score',r:d=>scoreHtml(score(d))},
 {k:'revenue',l:'Omsætning',num:1,r:d=>amt(d,'revenue')},
 {k:'value',l:'DB',num:1,r:d=>isN(d.value)?`<b class="w6">${amt(d,'value')}</b>`:'<span class="muted">—</span>'},
 {k:'next',l:'Næste skridt',wrap:1,r:nextCell},
 {k:'updated',l:'Opdateret',r:d=>`<span class="muted">${ago(d.updatedAt)}</span>`}];
function pBase(){const P=U.p,f=P.f;let r=S.deals;if(P.type!=='all')r=r.filter(d=>d.type===(P.type==='none'?'':P.type));
 if(f.seg)r=r.filter(d=>f.seg==='—'?!d.segment:d.segment===f.seg);if(f.owner)r=r.filter(d=>d.owner===f.owner);if(f.src)r=r.filter(d=>f.src==='—'?!d.source:d.source===f.src);
 if(P.q){const q=P.q.toLowerCase();r=r.filter(d=>[d.company,d.title,d.contact,d.email,d.nextStep,d.note,d.source,d.orderNo,d.legalName].join(' ').toLowerCase().includes(q))}return r}
const byNext=(a,b)=>(a.nextDate||'9999').localeCompare(b.nextDate||'9999')||a.company.localeCompare(b.company,'da');
function pRows(){const P=U.p,f=SORTF[P.sort.k]||SORTF.next;return pBase().filter(TABF[P.tab]||TABF.open).sort((a,b)=>{const x=f(a),y=f(b);return ((x<y?-1:x>y?1:0)*P.sort.d)||a.company.localeCompare(b.company,'da')})}
function vPipe(){const P=U.p,t=today(),base=pBase(),open=S.deals.filter(d=>OPEN.includes(d.stage)),pipe=sumV(open),w=open.reduce((a,d)=>a+num(d.value)*ST[d.stage].p,0),over=open.filter(d=>d.nextDate&&d.nextDate<t),tod=open.filter(d=>d.nextDate===t),hot=open.filter(d=>score(d)>=7);
 const wk=lastWeeks(8),nw=wk.map(x=>open.filter(d=>d.createdAt&&weekStart(d.createdAt)===x).length),tc=['studio','adhoc',''].map(k=>open.filter(d=>d.type===k).length),dist=Array.from({length:11},(_,i)=>open.filter(d=>score(d)===i).length);
 const tabs=[['open','Åbne'],['fav','Favoritter'],['new','Nye'],['over','Forfaldne'],['hot','Varme'],['won','Vundne'],['lost','Tabte'],['all','Alle']];
 const fc=['seg','owner','src'].filter(k=>P.f[k]).length;
 return `<div class="ph"><div class="grow"><h1>Pipeline<span>${open.length}</span></h1><p class="sub">Alle salgsmuligheder – Metz Studio og ad hoc i samme flow.</p></div></div>
 <div class="kpis">
 ${kpi('Åbne deals',open.length,{dl:nw[7]?`<span class="dl up">${ic('up',14,2)}${nw[7]} ny${nw[7]===1?'':'e'}</span>`:'',vis:miniBars(tc,['#f26b1f','#eab308','#c4c4cc']),hint:`${tc[0]} Studio · ${tc[1]} ad hoc · ${tc[2]} uafkl.`})}
 ${kpi('Pipeline-værdi',krs(pipe),{vis:miniBars(OPEN.map(k=>sumV(open.filter(d=>d.stage===k))||open.filter(d=>d.stage===k).length*.0001),OPEN.map(k=>ST[k].c)),hint:`Vægtet ${krs(w)}`})}
 ${kpi('Forfaldne næste skridt',over.length,{dl:over.length?`<span class="dl down">${ic('clock',14,2)}handling</span>`:'',hint:`${tod.length} planlagt i dag`})}
 ${kpi('Varme deals',hot.length,{vis:miniBars(dist,BARC.slice(0,10).concat('#22a34a')),hint:'Score 7+ ud af 10'})}
 </div>
 ${tabsHtml('p',tabs,P.tab,k=>base.filter(TABF[k]).length)}
 <div class="tb"><label class="search">${ic('search',16)}<input data-live data-q="p" id="pq" type="search" placeholder="Søg i pipeline…" value="${esc(P.q)}" autocomplete="off"><span class="kbd">/</span></label>
 <div class="seg" role="group" aria-label="Type">${[['all','Alle'],['studio','Studio'],['adhoc','Ad hoc'],['none','Uafklaret']].map(([k,n])=>`<button class="${P.type===k?'on':''}" data-ptype="${k}">${k!=='all'?`<span class="sq" style="background:${TYPES[k==='none'?'':k].c}"></span>`:''}${n}</button>`).join('')}</div>
 <button class="ib ${fc?'on':''}" data-act="filter" aria-label="Filtrér" title="Filtrér">${ic('filter')}${fc?`<span class="bdg">${fc}</span>`:''}</button>
 <button class="ib" data-act="sortMenu" aria-label="Sortér" title="Sortér">${ic('sort')}</button>
 <button class="ib hide-s" data-act="viewMenu" aria-label="Visning" title="Kolonner og tæthed">${ic('sliders')}</button>
 <span class="grow"></span>
 <div class="seg ico">${[['list','list','Liste'],['board','pipe','Board']].map(([k,i,n])=>`<button class="${P.mode===k?'on':''}" data-pmode="${k}" aria-label="${n}" title="${n}">${ic(i,16)}</button>`).join('')}</div>
 <button class="btn hide-s ico-s" data-act="import" title="Importér fra Excel">${ic('cloudUp',16)}<span class="tx">Importér</span></button>
 <button class="btn hide-s ico-s" data-act="export" data-what="pipeline" title="Eksportér til CSV">${ic('cloudDown',16)}<span class="tx">Eksportér</span></button>
 <button class="btn soft" data-act="newDeal">${ic('plus',16,2)}Tilføj deal</button></div>
 ${chipsRow()}
 ${P.mode==='board'?pBoard(base):pTable(pRows())}`}
function chipsRow(){const f=U.p.f,ch=[];if(f.seg)ch.push(['seg','Segment: '+(f.seg==='—'?'uden':f.seg)]);if(f.owner)ch.push(['owner','Ansvarlig: '+f.owner]);if(f.src)ch.push(['src','Kilde: '+(f.src==='—'?'uden':f.src)]);return ch.length?`<div class="chips">${ch.map(([k,l])=>`<button class="chip" data-unf="${k}">${esc(l)}${ic('x',13,2)}</button>`).join('')}<button class="chip clear" data-unf="all">Ryd filtre</button></div>`:''}
function pTable(rows){const P=U.p,C=PCOLS.filter(c=>U.cols.includes(c.k));
 if(!rows.length)return `<div class="tw">${empty('inbox','Ingen deals her',P.q||P.type!=='all'||['seg','owner','src'].some(k=>P.f[k])?'Prøv at rydde søgning eller filtre.':'Tilføj en deal for at komme i gang.',`<button class="btn soft" data-act="newDeal">${ic('plus',16,2)}Tilføj deal</button>`)}</div>`;
 const allSel=rows.every(d=>U.sel.has(d.id)),some=rows.some(d=>U.sel.has(d.id));
 const ar=k=>P.sort.k===k?`<span class="ar">${P.sort.d>0?'↑':'↓'}</span>`:'';
 return `<div class="tw resp ${U.dense?'dense':''}" data-keep-scroll="pt"><table class="t"><thead><tr><th class="c0 stick"><input type="checkbox" class="cb" data-selall ${allSel?'checked':''} ${!allSel&&some?'data-ind':''} aria-label="Vælg alle"></th><th class="c1 stick sortable" data-sort="company">Virksomhed${ar('company')}</th>${C.map(c=>`<th class="sortable ${c.num?'num':''}" data-sort="${c.k}">${c.l}${ar(c.k)}</th>`).join('')}<th class="cz"></th></tr></thead>
 <tbody>${rows.map(d=>`<tr class="${U.sel.has(d.id)?'sel':''}" data-open="deal:${d.id}"><td class="c0 stick"><input type="checkbox" class="cb" data-sel="${d.id}" ${U.sel.has(d.id)?'checked':''} aria-label="Vælg ${esc(d.company)}"></td><td class="c1 stick"><span class="cname">${co(d.company)}<span><b>${esc(d.company)}${d.fav?` <span class="star">${ic('star',13,2)}</span>`:''}</b><small>${esc(d.title||d.nextStep||'—')}</small></span></span></td>${C.map(c=>`<td class="${c.num?'num':''} ${c.wrap?'wrap':''}">${c.r(d)}</td>`).join('')}<td class="cz"><button class="ib sm" data-rowmenu="${d.id}" aria-label="Flere handlinger">${ic('dots')}</button></td></tr>`).join('')}</tbody></table></div>
 <div class="mlist">${rows.map(mRow).join('')}</div>`}
const mRow=d=>{const t=today();return `<div class="mrow ${U.sel.has(d.id)?'sel':''}" data-open="deal:${d.id}" role="button" tabindex="0">${co(d.company)}<div class="grow"><div class="mr1"><b>${esc(d.company)}${d.fav?` <span class="star">${ic('star',12,2)}</span>`:''}</b>${stageBd(d.stage)}</div><small>${esc(d.title||d.nextStep||d.contact||'—')}</small><div class="mr2">${typeBd(d.type)}${isN(d.value)?`<span class="w6">${krs(d.value)}</span>`:''}${d.nextDate?`<span class="dchip ${OPEN.includes(d.stage)&&d.nextDate<t?'late':d.nextDate===t?'today':''}">${ic('cal',12)}${rel(d.nextDate)}</span>`:''}</div></div></div>`};
function pBoard(base){return `<div class="board" data-keep-scroll="pb">${STAGES.map(s=>{let ds=base.filter(d=>d.stage===s.k).sort(byNext);const total=ds.length,sum=sumV(real(ds));let more=0;if(s.k==='vundet'){ds=ds.slice().sort((a,b)=>(b.wonDate||b.updatedAt||'').localeCompare(a.wonDate||a.updatedAt||''));if(ds.length>8){more=ds.length-8;ds=ds.slice(0,8)}}
 return `<div class="bcol" data-stage-col="${s.k}"><div class="bch"><span class="bct"><i style="background:${s.c}"></i>${s.n}<span class="n">${total}</span></span><small>${krs(sum)}${OPEN.includes(s.k)?` · ${Math.round(s.p*100)} %`:''}</small></div>${ds.map(bCard).join('')||'<div class="bempty">Træk en deal hertil</div>'}${more?`<button class="badd" data-go="ordrer">${ic('arrow',14,2)}${more} flere – se alle under Ordrer</button>`:''}<button class="badd" data-act="newDeal" data-stage="${s.k}" data-new="1">${ic('plus',14,2)}Tilføj</button></div>`}).join('')}</div>`}
const bCard=d=>{const t=today();return `<div class="bcard" draggable="true" data-drag="${d.id}" data-open="deal:${d.id}" tabindex="0"><div class="bc1">${typeBd(d.type)}${d.fav?`<span class="star">${ic('star',13,2)}</span>`:''}</div><b>${esc(d.company)}</b><p>${esc(d.title||d.nextStep||d.contact||'—')}</p><div class="bc2">${isN(d.value)?`<span class="w6">${estB(d)}${krs(d.value)}</span>`:''}${d.nextDate?`<span class="dchip ${OPEN.includes(d.stage)&&d.nextDate<t?'late':''}">${ic('cal',12)}${rel(d.nextDate)}</span>`:''}${av(d.owner,'xs')}</div></div>`};

/* ============ Ordrer ============ */
const OTAB={active:o=>!['leveret','faktureret'].includes(o.orderStatus),soon:o=>!!o.deadline&&!['leveret','faktureret'].includes(o.orderStatus)&&daysBetween(today(),o.deadline)<=7,done:o=>o.orderStatus==='leveret',inv:o=>o.orderStatus==='faktureret',all:()=>true};
function oBase(){let r=orders();const q=U.o.q.toLowerCase();if(q)r=r.filter(o=>[o.company,o.title,o.contact,o.note,o.orderNo,o.legalName].join(' ').toLowerCase().includes(q));return r}
function vOrders(){const t=today(),y=t.slice(0,4),all=orders(),base=oBase(),rows=base.filter(OTAB[U.o.tab]||OTAB.all),closed=U.o.closed;
 const allY=all.filter(o=>(o.wonDate||o.updatedAt||'').startsWith(y)),rY=real(allY),eY=estOnly(all),revY=sumR(rY),dbY=sumV(rY),dgY=dgOf(revY,dbY);
 const ms=lastMonths(8),serR=ms.map(m=>sumR(real(all).filter(o=>ymOf(o)===m.k))),serD=ms.map(m=>sumV(real(all).filter(o=>ymOf(o)===m.k)));
 const act=all.filter(OTAB.active),soon=all.filter(OTAB.soon);
 const groups=new Map();rows.forEach(o=>{const k=ymOf(o)||'—';if(!groups.has(k))groups.set(k,[]);groups.get(k).push(o)});
 const keys=[...groups.keys()].sort((a,b)=>a==='—'?1:b==='—'?-1:b.localeCompare(a));
 const sortO=(a,b)=>(a.orderNo||'~').localeCompare(b.orderNo||'~')||a.company.localeCompare(b.company,'da');
 const sub=g=>{const r=real(g),rev=sumR(r),db=sumV(r),e=estOnly(g);return {rev,db,dg:dgOf(rev,db),n:g.length,erev:sumR(e),edb:sumV(e)}};
 const tot=sub(rows);
 const nextB=o=>{const nx=ORD[OM[o.orderStatus].i+1];return nx?`<button class="btn sm" data-oadv="${o.id}" title="Sæt til ${nx.n}">${nx.n}${ic('arrow',13)}</button>`:''};
 const dl=o=>{const late=o.deadline&&o.deadline<t&&!['leveret','faktureret'].includes(o.orderStatus);return o.deadline?`<span class="dchip ${late?'late':''}">${ic('cal',12)}${dshort(o.deadline)}</span>`:'<span class="muted">—</span>'};
 const row=o=>`<tr data-open="deal:${o.id}"><td class="c1p ono">${esc(o.orderNo||'—')}</td><td><span class="cname">${co(o.company)}<span><b>${esc(o.company)}${studioFor(o.company)?' <span class="ty studio mini">Studio-kunde</span>':''}</b><small>${esc(o.title||'Ad hoc-ordre')}</small></span></span></td><td>${ordBd(o.orderStatus)}</td><td class="num">${amt(o,'revenue')}</td><td class="num"><b class="w6">${amt(o,'value')}</b></td><td class="num">${dgBd(dgOf(o.revenue,o.value))}</td><td>${dl(o)}</td><td class="cz">${nextB(o)}</td></tr>`;
 const sumCell=(v,e)=>`<td class="num"><b>${kr(v)}</b>${e?`<small class="est-t est-s">+${krs(e)} forv.</small>`:''}</td>`;
 const grpRow=k=>{const g=groups.get(k),s=sub(g),isC=closed.has(k);return `<tr class="grp ${isC?'closed':''}" data-grp="${k}"><td class="c1p" colspan="3"><button class="grp-b" data-grp="${k}" aria-expanded="${!isC}">${ic('chev',15,2)}<b>${monthName(k)}</b><span class="grp-n">${s.n} ${s.n===1?'ordre':'ordrer'}</span></button></td>${sumCell(s.rev,s.erev)}${sumCell(s.db,s.edb)}<td class="num">${dgBd(s.dg)}</td><td colspan="2"></td></tr>`+(isC?'':g.slice().sort(sortO).map(row).join(''))};
 const mGrp=k=>{const g=groups.get(k),s=sub(g),isC=closed.has(k);return `<button class="mgrp ${isC?'closed':''}" data-grp="${k}">${ic('chev',14,2)}<b>${monthName(k)}</b><span class="grow"></span><span>${krs(s.rev)} · DB ${krs(s.db)} · ${pct(s.dg)}</span></button>`+(isC?'':g.slice().sort(sortO).map(o=>`<div class="mrow" data-open="deal:${o.id}" role="button" tabindex="0">${co(o.company)}<div class="grow"><div class="mr1"><b>${esc(o.company)}</b>${ordBd(o.orderStatus)}</div><small>${esc(o.title||'Ad hoc-ordre')}${o.orderNo?' · '+esc(o.orderNo):''}</small><div class="mr2">${isN(o.revenue)?`<span>${estB(o)}${krs(o.revenue)}</span>`:''}${isN(o.value)?`<span class="w6">DB ${krs(o.value)}</span>`:''}${isN(o.revenue)||isN(o.value)?dgBd(dgOf(o.revenue,o.value)):'<span class="muted" style="font-size:12.5px">Ingen beløb endnu</span>'}</div></div></div>`).join(''))};
 return `<div class="ph"><div class="grow"><h1>Ordrer<span>${all.length}</span></h1><p class="sub">Ad hoc-ordrer pr. måned med omsætning, DB og dækningsgrad. Studio-shops styres under Metz Studio.</p></div><div class="ph-a"><button class="btn" data-act="import" data-mode="notes">${ic('cloudUp',16)}Indsæt fra Notes</button><button class="btn hide-s" data-act="export" data-what="orders">${ic('cloudDown',16)}Eksportér</button><button class="btn soft" data-act="newOrder">${ic('plus',16,2)}Ny ordre</button></div></div>
 <div class="kpis">${kpi('Omsætning '+y,krs(revY),{dl:delta(serR[7],serR[6]),vis:serR.some(v=>v)?spark(serR,'#eab308'):'',hint:num(S.cfg.targetRev)?`${Math.round(revY/num(S.cfg.targetRev)*100)} % af årsmålet`:`${rY.length} ordrer i år`,title:`${rY.length} ordrer i år${num(S.cfg.targetRev)?` · mål ${kr(num(S.cfg.targetRev))}`:''}`})}${kpi('DB '+y,krs(dbY),{dl:delta(serD[7],serD[6]),vis:serD.some(v=>v)?spark(serD):'',hint:`DG ${pct(dgY)}`})}${kpi('Forventet',eY.length?'+'+krs(sumR(eY)):'—',{hint:eY.length?`DB +${krs(sumV(eY))} · ${esc(eY.map(o=>o.company).join(', '))}`:'Ingen estimater lige nu'})}${kpi('Aktive ordrer',act.length,{vis:miniBars(ORD.map(o=>all.filter(x=>x.orderStatus===o.k).length),'#eab308'),hint:soon.length?`<span class="warn-t">${soon.length} med deadline inden 7 dage</span>`:'Ingen deadlines i 7 dage'})}</div>
 ${tabsHtml('o',[['all','Alle'],['active','Aktive'],['soon','Deadline snart'],['done','Leveret'],['inv','Faktureret']],U.o.tab,k=>base.filter(OTAB[k]).length)}
 <div class="tb"><label class="search">${ic('search',16)}<input data-live data-q="o" id="oq" type="search" placeholder="Søg kunde, ordre eller ordrenr…" value="${esc(U.o.q)}" autocomplete="off"></label><span class="grow"></span>${keys.length>1?`<button class="btn sm ghost" data-act="grpAll">${closed.size?'Fold alle ud':'Fold alle sammen'}</button>`:''}</div>
 ${rows.length?`<div class="tw resp" data-keep-scroll="ot"><table class="t ot"><thead><tr><th class="c1p">Ordrenr.</th><th>Kunde</th><th>Status</th><th class="num">Omsætning</th><th class="num">DB</th><th class="num">DG</th><th>Deadline</th><th class="cz"></th></tr></thead><tbody>${keys.map(grpRow).join('')}</tbody><tfoot><tr><td class="c1p">I alt</td><td>${rows.length} ${rows.length===1?'ordre':'ordrer'}</td><td></td>${sumCell(tot.rev,tot.erev)}${sumCell(tot.db,tot.edb)}<td class="num">${dgBd(tot.dg)}</td><td></td><td class="cz"></td></tr></tfoot></table></div>
 <div class="mlist">${keys.map(mGrp).join('')}<div class="mtot"><span>I alt · ${rows.length} ordrer</span><b>${kr(tot.rev)} · DB ${kr(tot.db)} · ${pct(tot.dg)}</b></div></div>`:`<div class="tw">${empty('orders','Ingen ordrer her','Indsæt din ordreliste fra Notes, eller vind en ad hoc-deal.',`<button class="btn soft" data-act="import" data-mode="notes">${ic('cloudUp',16,2)}Indsæt fra Notes</button>`)}</div>`}`}

/* ============ Kunder ============ */
function accounts(){const m=new Map(),get=n=>{const k=coKey(n);if(!m.has(k))m.set(k,{key:k,name:n,deals:[],studio:null});return m.get(k)};S.deals.forEach(d=>get(d.company).deals.push(d));S.studio.forEach(s=>{get(s.company).studio=s});
 return [...m.values()].map(a=>{const won=a.deals.filter(d=>d.stage==='vundet'),open=a.deals.filter(d=>OPEN.includes(d.stage));const hasS=!!a.studio||won.some(d=>d.type==='studio'),hasA=won.some(d=>d.type==='adhoc');const rel=hasS?'studio':hasA?'adhoc':won.length?'kunde':open.length?'prospect':'lost';
  const contact=(a.studio&&a.studio.contact)||(a.deals.find(d=>d.contact)||{}).contact||'';const last=[...a.deals.map(d=>d.updatedAt),a.studio&&a.studio.updatedAt].filter(Boolean).sort().pop()||'';const owner=(a.deals.slice().sort((x,y)=>(y.updatedAt||'').localeCompare(x.updatedAt||''))[0]||a.studio||{}).owner||S.cfg.me;
  const rw=real(won),wonDb=sumV(rw),wonRev=sumR(rw);
  return {...a,won,open,hasS,hasA,rel,contact,last,owner,wonDb,wonRev,dg:dgOf(wonRev,wonDb),estDb:sumV(estOnly(won)),openDb:sumV(open),orders:won.filter(d=>d.type==='adhoc').length,legal:[...new Set(a.deals.map(d=>d.legalName).filter(n=>n&&coKey(n)!==a.key))]}})}
const relBd=a=>{const o=[];if(a.hasS)o.push('<span class="ty studio"><span class="sq" style="background:#f26b1f"></span>Studio-kunde</span>');if(a.hasA)o.push(`<span class="ty adhoc"><span class="sq" style="background:#eab308"></span>Ad hoc${a.orders>1?' ×'+a.orders:''}</span>`);if(!o.length)o.push(a.rel==='kunde'?'<span class="ty none">Kunde · type uafklaret</span>':a.rel==='prospect'?'<span class="ty none">Prospekt</span>':'<span class="bd bad">Tabt</span>');return o.join(' ')};
const CTAB={all:()=>true,studio:a=>a.hasS,adhoc:a=>a.hasA,prospect:a=>a.rel==='prospect',lost:a=>a.rel==='lost'};
function vCustomers(){const all=accounts();let base=all;const q=U.c.q.toLowerCase();if(q)base=base.filter(a=>(a.name+' '+a.contact+' '+a.legal.join(' ')).toLowerCase().includes(q));const rows=base.filter(CTAB[U.c.tab]||CTAB.all).sort((a,b)=>(b.wonDb-a.wonDb)||(b.openDb-a.openDb)||a.name.localeCompare(b.name,'da'));
 const cust=all.filter(a=>a.won.length||a.studio),top=cust.slice().sort((a,b)=>b.wonDb-a.wonDb)[0],tRev=all.reduce((x,a)=>x+a.wonRev,0),tDb=all.reduce((x,a)=>x+a.wonDb,0);
 return `<div class="ph"><div class="grow"><h1>Kunder<span>${all.length}</span></h1><p class="sub">Én række pr. virksomhed – samlet fra deals, ordrer og Studio-shops. Sorteret efter DB.</p></div><div class="ph-a"><button class="btn soft" data-act="newDeal">${ic('plus',16,2)}Ny deal</button></div></div>
 <div class="kpis">${kpi('Kunder',cust.length,{vis:donut([[all.filter(a=>a.hasS).length,'#f26b1f'],[all.filter(a=>a.hasA&&!a.hasS).length,'#eab308'],[all.filter(a=>a.rel==='kunde').length,'#c4c4cc']]),hint:top&&top.wonDb?`Størst: ${esc(top.name)}`:'Har vundet mindst én sag'})}${kpi('Omsætning',krs(tRev),{hint:`DB ${krs(tDb)} · DG ${pct(dgOf(tRev,tDb))}`})}${kpi('Studio-kunder',all.filter(a=>a.hasS).length,{hint:`${all.filter(a=>a.hasS&&a.hasA).length} har også ad hoc-ordrer`})}${kpi('Prospekter',all.filter(a=>a.rel==='prospect').length,{hint:'Kun åbne sager'})}</div>
 ${tabsHtml('c',[['all','Alle'],['studio','Studio-kunder'],['adhoc','Ad hoc-kunder'],['prospect','Prospekter'],['lost','Tabte']],U.c.tab,k=>base.filter(CTAB[k]).length)}
 <div class="tb"><label class="search">${ic('search',16)}<input data-live data-q="c" id="cq" type="search" placeholder="Søg virksomhed eller kontakt…" value="${esc(U.c.q)}" autocomplete="off"></label><span class="grow"></span><button class="btn hide-s" data-act="export" data-what="customers">${ic('cloudDown',16)}Eksportér</button></div>
 ${rows.length?`<div class="tw resp" data-keep-scroll="ct"><table class="t"><thead><tr><th class="c1p">Virksomhed</th><th>Relation</th><th class="num">Omsætning</th><th class="num">DB</th><th class="num">DG</th><th class="num">Ordrer</th><th class="num">Åbne sager</th><th>Seneste aktivitet</th></tr></thead><tbody>${rows.map(a=>`<tr data-open="acct:${esc(a.key)}"><td class="c1p"><span class="cname">${co(a.name)}<span><b>${esc(a.name)}</b><small>${esc(a.contact||(a.legal[0]||'—'))}</small></span></span></td><td>${relBd(a)}</td><td class="num">${a.wonRev?kr(a.wonRev):'<span class="muted">—</span>'}</td><td class="num">${a.wonDb?`<b class="w6">${kr(a.wonDb)}</b>`:'<span class="muted">—</span>'}${a.estDb?`<small class="est-t est-s">+${krs(a.estDb)} forv.</small>`:''}</td><td class="num">${dgBd(a.dg)}</td><td class="num">${a.orders||'<span class="muted">0</span>'}</td><td class="num">${a.open.length?`${a.open.length} <span class="muted">· ${krs(a.openDb)}</span>`:'<span class="muted">0</span>'}</td><td class="muted">${ago(a.last)}</td></tr>`).join('')}</tbody></table></div>
 <div class="mlist">${rows.map(a=>`<div class="mrow" data-open="acct:${esc(a.key)}" role="button" tabindex="0">${co(a.name)}<div class="grow"><div class="mr1"><b>${esc(a.name)}</b>${a.wonDb?`<span class="w6">${krs(a.wonDb)}</span>`:''}</div><small>${esc(a.contact||(a.legal[0]||'—'))}</small><div class="mr2">${relBd(a)}${a.wonRev?`<span class="muted" style="font-size:12.5px">Oms. ${krs(a.wonRev)}</span>`:''}${dgBd(a.dg)}</div></div></div>`).join('')}</div>`:`<div class="tw">${empty('users','Ingen kunder her','Prøv en anden fane eller søgning.')}</div>`}`}

/* ============ Metz Studio ============ */
const STAB={all:()=>true,onboarding:s=>s.status==='onboarding',live:s=>s.status==='live',pause:s=>s.status==='pause'};
function vStudio(){if(U.param)return vStudioDetail(U.param);const all=S.studio;let base=all;const q=U.s.q.toLowerCase();if(q)base=base.filter(s=>(s.company+' '+s.contact).toLowerCase().includes(q));
 const rows=base.filter(STAB[U.s.tab]||STAB.all).sort((a,b)=>SSM[a.status].i-SSM[b.status].i||a.company.localeCompare(b.company,'da'));
 const live=all.filter(s=>s.status==='live'),onb=all.filter(s=>s.status==='onboarding'),miss=onb.reduce((a,s)=>a+sMissing(s),0),avg=onb.length?Math.round(onb.reduce((a,s)=>a+sProgress(s).p,0)/onb.length*100):0,rev=sumF(all,'shopRevenue'),prov=rev*num(S.cfg.commission)/100;
 return `<div class="ph"><div class="grow"><h1>Metz Studio<span>${all.length}</span></h1><p class="sub">Shops med fast sortiment – fra aftale til aktiv shop. Ad hoc-ordrer holdes adskilt under Ordrer.</p></div><div class="ph-a"><button class="btn" data-go="onboarding">${ic('route',16)}Onboarding-overblik</button><button class="btn soft" data-act="newStudio">${ic('plus',16,2)}Ny Studio-kunde</button></div></div>
 <div class="kpis">${kpi('Live shops',live.length,{vis:donut([[live.length,'#22a34a'],[onb.length,'#f26b1f'],[all.length-live.length-onb.length,'#c4c4cc']]),hint:`af ${all.length} Studio-kunder`})}${kpi('I onboarding',onb.length,{vis:onb.length?miniBars(onb.map(s=>Math.max(4,Math.round(sProgress(s).p*100))),'#f26b1f'):'',hint:`I snit ${avg} % klar`})}${kpi('Mangler fra kunder',miss,{hint:miss?`Fordelt på ${onb.filter(s=>sMissing(s)).length} kunder`:'Intet udestående'})}${kpi('Provision (est.)',krs(prov),{hint:`${S.cfg.commission} % af ${krs(rev)} shopomsætning`})}</div>
 ${tabsHtml('s',[['all','Alle'],['onboarding','Onboarding'],['live','Live'],['pause','Pause']],U.s.tab,k=>base.filter(STAB[k]).length)}
 <div class="tb"><label class="search">${ic('search',16)}<input data-live data-q="s" id="sq" type="search" placeholder="Søg Studio-kunder…" value="${esc(U.s.q)}" autocomplete="off"></label><span class="grow"></span><button class="btn hide-s" data-act="export" data-what="studio">${ic('cloudDown',16)}Eksportér</button></div>
 ${rows.length?`<div class="tw resp" data-keep-scroll="stt"><table class="t"><thead><tr><th class="c1p">Kunde</th><th>Status</th><th>Fremdrift</th><th>Nuværende trin</th><th class="num">Mangler</th><th>Go-live</th><th class="num">Shopomsætning</th><th>Ansvarlig</th><th>Opdateret</th></tr></thead><tbody>${rows.map(s=>{const pr=sProgress(s),m=sMissing(s),cur=s.steps[pr.cur];return `<tr data-open="studio:${s.id}"><td class="c1p"><span class="cname">${co(s.company)}<span><b>${esc(s.company)}</b><small>${esc(s.contact||'—')}</small></span></span></td><td>${sstBd(s.status)}</td><td><span class="prg">${segBar(pr.k,pr.n,pr.k===pr.n?'full':'')}<small>${pr.k}/${pr.n}</small></span></td><td class="wrap">${cur?`<span class="cur-s"><span class="who ${cur.who}">${cur.who==='kunde'?'Kunde':'Metz'}</span>${esc(cur.t)}</span>`:'<span class="ok-t">Alle trin klaret</span>'}</td><td class="num">${m?`<span class="bd warn">${m}</span>`:'<span class="bd ok">0</span>'}</td><td>${s.goLive?dshort(s.goLive):'<span class="muted">—</span>'}</td><td class="num">${isN(s.shopRevenue)?kr(s.shopRevenue):'<span class="muted">—</span>'}</td><td><span class="own">${av(s.owner,'sm')}${esc(s.owner)}</span></td><td class="muted">${ago(s.updatedAt)}</td></tr>`}).join('')}</tbody></table></div>
 <div class="mlist">${rows.map(s=>{const pr=sProgress(s),m=sMissing(s);return `<div class="mrow" data-open="studio:${s.id}" role="button" tabindex="0">${co(s.company)}<div class="grow"><div class="mr1"><b>${esc(s.company)}</b>${sstBd(s.status)}</div><small>${esc(s.contact||'—')}</small><div class="mr2">${segBar(pr.k,pr.n,pr.k===pr.n?'full':'')}<span class="muted" style="font-size:12.5px">${pr.k}/${pr.n}</span>${m?`<span class="bd warn">${m} mangler</span>`:''}</div></div></div>`}).join('')}</div>`:`<div class="tw">${empty('store','Ingen Studio-kunder her','Vind en Metz Studio-deal, eller opret en Studio-kunde manuelt.',`<button class="btn soft" data-act="newStudio">${ic('plus',16,2)}Ny Studio-kunde</button>`)}</div>`}`}
function vStudioDetail(id){const s=S.studio.find(x=>x.id===id);if(!s)return empty('store','Studio-kunden findes ikke','Den kan være slettet.',`<button class="btn" data-go="studio">Til Studio-kunder</button>`);
 const pr=sProgress(s),miss=sMissing(s),t=today(),days=s.startDate?daysBetween(s.startDate,t):null,adhoc=dealsFor(s.company).filter(d=>d.type==='adhoc'),prov=isN(s.shopRevenue)?s.shopRevenue*num(S.cfg.commission)/100:null;
 const F=(l,inp,w)=>`<label class="fl ${w?'w':''}">${l}${inp}</label>`,I=(k,type='text',ph='',x='')=>`<input class="in" id="sf-${k}" data-sf="${k}" type="${type}" value="${esc(s[k]??'')}" placeholder="${ph}" ${x}>`;
 return `<div class="sd-hero">${co(s.company,'xl')}<div class="grow"><div class="dtags">${sstBd(s.status)}${miss?`<span class="bd warn">${miss} mangler fra kunden</span>`:'<span class="bd ok">Info komplet</span>'}</div><h1>${esc(s.company)}</h1><p class="sub">${[s.contact,s.owner&&'Ansvarlig: '+s.owner,s.startDate&&'Startet '+dlong(s.startDate)].filter(Boolean).map(esc).join(' · ')||'Metz Studio-kunde'}</p></div><div class="ph-a"><button class="btn" data-act="cview" data-id="${s.id}">${ic('eye',16)}Kundevisning</button><button class="btn soft" data-act="cmail" data-id="${s.id}">${ic('mail',16)}Kopiér statusmail</button><button class="ib" data-act="studioMenu" data-id="${s.id}" aria-label="Flere handlinger">${ic('dots')}</button></div></div>
 <div class="kpis">${kpi('Fremdrift',`${Math.round(pr.p*100)}<small>%</small>`,{vis:donut([[pr.k,'#22a34a'],[pr.n-pr.k,'#e4e4e7']]),hint:`${pr.k} af ${pr.n} trin klaret`})}${kpi('Mangler fra kunden',miss,{hint:miss?'Send en statusmail':'Alt er modtaget'})}${kpi('Dage siden start',days??'—',{hint:s.goLive?'Go-live '+dlong(s.goLive):'Ingen go-live dato'})}${kpi('Provision',prov!=null?krs(prov):'—',{hint:`${S.cfg.commission} % af shopomsætning`})}</div>
 ${s.status==='onboarding'&&pr.n&&pr.k===pr.n?`<div class="nudge">${ic('rocket',18)}<span class="grow"><b>Alle trin er klaret.</b> <span>Er shoppen i luften? Sæt status til Live.</span></span><button class="btn pri sm" data-sstatus="${s.id}:live">Sæt til Live</button></div>`:''}
 <div class="sd"><div class="sd-l">
 <section class="pn">${cardH('Onboarding',`${pr.k}/${pr.n} trin · tryk på et trin for at markere det`,'<span class="leg"><span><i class="lm"></i>Metz</span><span><i class="lk"></i>Kunden</span></span>')}<ol class="steps">${s.steps.map((x,i)=>`<li class="step ${x.d?'done':''} ${i===pr.cur?'cur':''}"><button class="ck" data-step="${s.id}:${i}" aria-label="${x.d?'Fortryd':'Marker som klaret'}: ${esc(x.t)}">${x.d?ic('check',15,2.6):i+1}</button><div class="st-b"><b>${esc(x.t)}</b><small>${x.d?'Klaret'+(x.at?' '+dshort(x.at):''):i===pr.cur?(x.who==='kunde'?'Venter på kunden':'Næste skridt for Metz'):'Afventer'}</small></div><span class="who ${x.who}">${x.who==='kunde'?'Kunde':'Metz'}</span></li>`).join('')||'<li class="muted">Ingen trin – tilføj dem i Indstillinger.</li>'}</ol></section>
 <section class="pn">${cardH('Mangler fra kunden',`${s.info.length-miss} af ${s.info.length} modtaget`,`<button class="btn sm" data-act="cmail" data-id="${s.id}">${ic('copy',14)}Statusmail</button>`)}<div class="chk-l">${s.info.map((x,i)=>`<div class="chk ${x.d?'got':''}"><button class="cbx ${x.d?'on':''}" data-info="${s.id}:${i}" aria-label="Modtaget: ${esc(x.t)}">${x.d?ic('check',12,3):''}</button><span class="grow" data-info="${s.id}:${i}">${esc(x.t)}</span><button class="ib sm rm" data-info-del="${s.id}:${i}" aria-label="Fjern punkt">${ic('x',14)}</button></div>`).join('')}</div><div class="noteadd"><input class="in" id="infoNew" placeholder="Tilføj punkt, fx størrelsesguide…" data-enter="addInfo" data-id="${s.id}"><button class="btn" data-act="addInfo" data-id="${s.id}" aria-label="Tilføj">${ic('plus',15,2)}</button></div></section>
 </div><div class="sd-r">
 <section class="pn">${cardH('Shop')}<div class="sstat">${SST.map(x=>`<button class="${s.status===x.k?'on '+x.k:''}" data-sstatus="${s.id}:${x.k}">${x.n}</button>`).join('')}</div><div class="fg">${F('Virksomhed',I('company'),1)}${F('Kontaktperson',I('contact'))}${F('E-mail',I('email','email','','inputmode="email"'))}${F('Ansvarlig',`<select class="in" id="sf-owner" data-sf="owner">${ownerList().map(o=>`<option ${o===s.owner?'selected':''}>${esc(o)}</option>`).join('')}</select>`)}${F('Startdato',I('startDate','date'))}${F('Go-live dato',I('goLive','date'))}${F('Setup-pris (kr)',I('setupFee','number','Fx 15000','inputmode="numeric" min="0"'))}${F('Shopomsætning (kr)',I('shopRevenue','number','Årlig omsætning','inputmode="numeric" min="0"'))}${F('Note',`<textarea class="in" id="sf-note" data-sf="note" rows="3" placeholder="Aftaler, særlige ønsker…">${esc(s.note)}</textarea>`,1)}</div>${prov!=null?`<p class="prov">${ic('sparkle',15)}<span>Din provision: <b>${kr(prov)}</b> (${S.cfg.commission} % af ${kr(s.shopRevenue)})</span></p>`:''}</section>
 <section class="pn">${cardH('Ad hoc-ordrer',`Uden om shoppen · ${adhoc.length}`,`<button class="btn sm" data-act="newOrderFor" data-company="${esc(s.company)}" data-contact="${esc(s.contact)}">${ic('plus',14,2)}Ny</button>`)}${adhoc.length?`<ul class="ol">${adhoc.map(o=>`<li><button class="ol-i" data-open="deal:${o.id}"><span class="act-ic">${ic('orders',16)}</span><span class="grow"><b>${esc(o.title||'Ad hoc-ordre')}</b><small>${o.stage==='vundet'?OM[o.orderStatus].n:ST[o.stage].n}${o.deadline?' · deadline '+dshort(o.deadline):''}</small></span><span class="w6">${krs(o.value)}</span></button></li>`).join('')}</ul>`:'<p class="muted sm-p">Ingen ad hoc-ordrer endnu – fx julegaver eller event-merch, der ikke går gennem shoppen.</p>'}</section>
 <section class="pn">${cardH('Aktivitet')}<div class="noteadd"><input class="in" id="snote" placeholder="Skriv en note og tryk Enter…" data-enter="addNote" data-kind="studio" data-id="${s.id}"><button class="btn" data-act="addNote" data-kind="studio" data-id="${s.id}" aria-label="Gem note">${ic('send',15)}</button></div><ul class="tl">${[...s.log].reverse().slice(0,25).map(l=>`<li class="${l.k==='note'?'em':''}"><span>${esc(l.t)}</span><time>${ago(l.at)}</time></li>`).join('')||'<li><span class="muted">Ingen aktivitet endnu</span></li>'}</ul></section>
 </div></div>`}
function vOnb(){const list=S.studio.filter(s=>U.mx.all||s.status==='onboarding').sort((a,b)=>sProgress(a).p-sProgress(b).p||a.company.localeCompare(b.company,'da')),tpl=tplSteps(),n=Math.max(tpl.length,...list.map(s=>s.steps.length),0);
 const head=Array.from({length:n},(_,i)=>{const T=tpl[i];return `<th class="mxh"><span class="mxn">${i+1}</span><span class="mxt">${esc(T?T.t:'Trin '+(i+1))}</span>${T&&T.who==='kunde'?'<span class="who kunde">Kunde</span>':''}</th>`}).join('');
 return `<div class="ph"><div class="grow"><h1>Onboarding-overblik<span>${list.length}</span></h1><p class="sub">Metz Studio-kunder i onboarding. Tryk på et trin for at markere det som klaret – perfekt til salgsmødet.</p></div><div class="ph-a"><label class="tgl"><input type="checkbox" data-mxall ${U.mx.all?'checked':''}><span></span>Vis også live og pause</label></div></div>
 <div class="mx-leg"><span><i class="dotc sm done">${ic('check',9,3.4)}</i>Klaret</span><span><i class="dotc sm cur"></i>Nuværende</span><span><i class="dotc sm"></i>Afventer</span><span><i class="dotc sm kunde"></i>Stiplet = kunden skal levere</span></div>
 ${list.length?`<div class="mx" data-keep-scroll="mx"><table><thead><tr><th class="mx0" style="text-align:left">Kunde</th>${head}<th class="mxh"><span class="mxt">Mangler</span></th><th class="mxh"><span class="mxt">Go-live</span></th></tr></thead><tbody>${list.map(s=>{const pr=sProgress(s),m=sMissing(s);return `<tr><td class="mx0"><button class="mxc" data-open="studio:${s.id}">${co(s.company,'sm')}<span><b>${esc(s.company)}</b><small>${Math.round(pr.p*100)} % · ${SSM[s.status].n}</small></span></button></td>${Array.from({length:n},(_,i)=>{const x=s.steps[i];if(!x)return '<td class="na"></td>';return `<td class="st ${x.d?'done':''} ${i===0?'first':''} ${i===s.steps.length-1?'last':''}"><button class="dotc ${x.d?'done':''} ${i===pr.cur?'cur':''} ${x.who==='kunde'?'kunde':''}" data-step="${s.id}:${i}" title="${esc(x.t)}${x.d&&x.at?' · klaret '+dshort(x.at):''}" aria-label="${esc(s.company)}: ${esc(x.t)}${x.d?' (klaret)':''}">${x.d?ic('check',12,3):''}</button></td>`}).join('')}<td class="mxm">${m?`<span class="bd warn">${m}</span>`:'<span class="bd ok">0</span>'}</td><td class="mxm">${s.goLive?dshort(s.goLive):'<span class="muted">—</span>'}</td></tr>`}).join('')}</tbody></table></div>
 <div class="grid one"><section class="pn s12">${cardH('Det mangler vi fra kunderne','Tryk på et punkt, når det er modtaget · kopiér en statusmail direkte til kunden')}${missBlock(list)}</section></div>`:`<div class="tw">${empty('route','Ingen kunder i onboarding','Når du vinder en Metz Studio-deal, starter onboardingen her automatisk.',`<button class="btn soft" data-act="newStudio">${ic('plus',16,2)}Ny Studio-kunde</button>`)}</div>`}`}
function missBlock(list){const w=list.filter(s=>sMissing(s));return w.length?`<div class="missg">${w.map(s=>`<div class="miss-c"><div class="miss-h">${co(s.company,'sm')}<b>${esc(s.company)}</b><span class="grow"></span><button class="btn sm" data-act="cmail" data-id="${s.id}">${ic('copy',14)}Statusmail</button></div><div class="miss-chips">${s.info.map((x,i)=>x.d?'':`<button class="mchip" data-info="${s.id}:${i}" title="Marker som modtaget">${esc(x.t)}${ic('check',12,2.4)}</button>`).join('')}</div></div>`).join('')}</div>`:`<p class="muted sm-p">Alle kunder i onboarding har leveret det, de skal.</p>`}
function statusMail(s){const pr=sProgress(s),miss=s.info.filter(x=>!x.d),first=firstName(s.contact),done=s.steps.filter(x=>x.d),next=s.steps[pr.cur];
 return ['Emne: Status på jeres Metz Studio-shop','',`Hej ${first||'der'},`,'','Her er en kort status på opsætningen af jeres Metz Studio-shop.','',`Fremdrift: ${pr.k} af ${pr.n} trin er klar (${Math.round(pr.p*100)} %)`,...done.map(x=>'✓ '+x.t),...(next?[`→ Næste: ${next.t}${next.who==='kunde'?' (venter på jer)':''}`]:[]),'',...(miss.length?['For at komme videre mangler vi følgende fra jer:',...miss.map(x=>'• '+x.t),'']:['Vi har alt, hvad vi skal bruge fra jer – tak!','']),...(s.goLive?[`Forventet lancering: ${dlong(s.goLive)}`,'']:[]),'Sig endelig til, hvis I har spørgsmål.','','Venlig hilsen',S.cfg.me,'Metz A/S'].join('\n')}
function custView(s){const pr=sProgress(s),miss=s.info.filter(x=>!x.d),first=firstName(s.contact);
 modal(`<div class="mh"><div><h2>Kundevisning</h2><p class="muted">Sådan ser status ud for ${esc(s.company)}. Kopiér den som mail og send den til kunden.</p></div><button class="ib" data-close aria-label="Luk">${ic('x')}</button></div><div class="mb"><div class="portal"><div class="pt-h"><span class="ws-logo sm">M</span><div><b>Metz Studio</b><small>Status for ${esc(s.company)}</small></div></div><h3>Hej${first?' '+esc(first):''}</h3><p>Jeres shop er <b>${Math.round(pr.p*100)} %</b> klar${s.goLive?` · forventet lancering ${dlong(s.goLive)}`:''}.</p><div class="pt-bar"><span style="width:${pr.p*100}%"></span></div><ol class="pt-steps">${s.steps.map((x,i)=>`<li class="${x.d?'done':i===pr.cur?'cur':''}"><span class="pt-ck">${x.d?ic('check',12,2.8):i+1}</span><span class="grow">${esc(x.t)}</span>${!x.d&&x.who==='kunde'?'<em>Venter på jer</em>':''}</li>`).join('')}</ol>${miss.length?`<div class="pt-miss"><b>Det mangler vi fra jer</b><ul>${miss.map(x=>`<li>${esc(x.t)}</li>`).join('')}</ul></div>`:`<div class="pt-ok">${ic('check',16,2.4)}Vi har alt, hvad vi skal bruge fra jer.</div>`}<div class="pt-f">${av(S.cfg.me,'sm')}<span>Din kontakt hos Metz: <b>${esc(S.cfg.me)}</b></span></div></div></div><div class="mf"><button class="btn" data-close>Luk</button><button class="btn pri" data-act="cmail" data-id="${s.id}">${ic('copy',16)}Kopiér som mail</button></div>`,'wide')}

/* ============ Projekter & idéer ============ */
function vProj(){const t=today(),tf=k=>k==='alle'?()=>true:p=>p.status===k,rows=S.projects.filter(tf(U.pj.tab)).sort((a,b)=>(PSM[a.status].i===3)-(PSM[b.status].i===3)||(a.deadline||'9999').localeCompare(b.deadline||'9999'));
 return `<div class="ph"><div class="grow"><h1>Team-projekter<span>${S.projects.length}</span></h1><p class="sub">Interne projekter som optimering af Metz Studio – med ansvarlig, deadline og opgaver.</p></div><div class="ph-a"><button class="btn soft" data-act="newProj">${ic('plus',16,2)}Nyt projekt</button></div></div>
 ${tabsHtml('pj',[['alle','Alle']].concat(PS.map(s=>[s.k,s.n])),U.pj.tab,k=>S.projects.filter(tf(k)).length)}
 ${rows.length?`<div class="cards">${rows.map(p=>{const n=p.tasks.length,k=p.tasks.filter(x=>x.d).length,nx=p.tasks.find(x=>!x.d),late=p.deadline&&p.deadline<t&&p.status!=='faerdig';return `<button class="pcard" data-open="proj:${p.id}"><span class="pc1"><span class="bd"><i style="background:${PSM[p.status].c}"></i>${PSM[p.status].n}</span><span class="prio ${p.priority==='Høj'?'hi':''}">${esc(p.priority)} prioritet</span></span><b>${esc(p.title)}</b>${p.goal?`<span class="pdesc">${esc(p.goal)}</span>`:''}<span class="pbar"><span style="width:${n?k/n*100:0}%"></span></span><span class="pc2"><span>${n?`${k} af ${n} opgaver`:'Ingen opgaver endnu'}</span>${p.deadline?`<span class="dchip ${late?'late':''}">${ic('cal',12)}${dshort(p.deadline)}</span>`:''}${p.owner?av(p.owner,'xs'):''}</span>${nx?`<span class="pnx">${ic('arrow',13)}${esc(nx.t)}</span>`:''}</button>`}).join('')}</div>`:`<div class="tw">${empty('folder','Ingen projekter her','Opret et projekt og del det op i opgaver.',`<button class="btn soft" data-act="newProj">${ic('plus',16,2)}Nyt projekt</button>`)}</div>`}`}
function vIdeas(){const I=U.id,d=I.edit||I.draft||{};
 const sel=(n,arr,v)=>`<select class="in" name="${n}" id="if-${n}">${arr.map(x=>`<option ${x===v?'selected':''}>${esc(x)}</option>`).join('')}</select>`;
 const rate=(n,v)=>`<div class="rate" role="radiogroup">${[1,2,3,4,5].map(i=>`<label><input type="radio" name="${n}" value="${i}" ${+v===i?'checked':''}><span>${i}</span></label>`).join('')}</div>`;
 const list=S.ideas.filter(i=>I.tab==='alle'||i.status===I.tab).sort(I.sort==='score'?(a,b)=>(b.impact*2-b.effort)-(a.impact*2-a.effort)||(b.createdAt||'').localeCompare(a.createdAt||''):(a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
 return `<div class="ph"><div class="grow"><h1>Idéer<span>${S.ideas.length}</span></h1><p class="sub">Skriv idéen ned med det samme – altid i samme format, så den er nem at vurdere og gøre til et projekt.</p></div></div>
 <div class="ideas"><form id="ifm" class="pn iform"><h3>${I.edit?'Rediger idé':'Ny idé'}</h3><p>${I.edit?'Ret felterne og gem.':'Syv felter – altid det samme format.'}</p><div class="fg">
 <label class="fl">1 · Titel<input class="in" id="if-title" name="title" required autocomplete="off" value="${esc(d.title||'')}" placeholder="Kort navn på idéen"></label>
 <label class="fl">2 · Problem – hvad løser den?<textarea class="in" id="if-problem" name="problem" rows="3" placeholder="Hvad er udfordringen i dag?">${esc(d.problem||'')}</textarea></label>
 <label class="fl">3 · Idé – hvordan løser vi det?<textarea class="in" id="if-solution" name="solution" rows="3" placeholder="Det konkrete forslag">${esc(d.solution||'')}</textarea></label>
 <label class="fl">4 · Hvem gavner den?${sel('gainer',GAIN,d.gainer||'Kunden')}</label>
 <label class="fl">5 · Kategori${sel('category',CATS,d.category||'Metz Studio')}</label>
 <div class="fl">6 · Effekt (1 = lille, 5 = stor)${rate('impact',d.impact||3)}</div>
 <div class="fl">7 · Indsats (1 = let, 5 = tung)${rate('effort',d.effort||3)}</div>
 ${I.edit?`<label class="fl">Status<select class="in" name="status" id="if-status">${IS.map(s=>`<option value="${s.k}" ${s.k===d.status?'selected':''}>${s.n}</option>`).join('')}</select></label>`:''}
 </div><div class="row-end">${I.edit?`<button type="button" class="btn danger" data-act="delIdea" style="margin-right:auto">${ic('trash',15)}Slet</button><button type="button" class="btn" data-act="cancelIdea">Annuller</button>`:''}<button class="btn pri">${ic('check',16,2)}${I.edit?'Gem ændringer':'Gem idé'}</button></div></form>
 <div class="ilist"><div class="tb"><div class="seg">${[['alle','Alle']].concat(IS.map(s=>[s.k,s.n])).map(([k,n])=>`<button class="${I.tab===k?'on':''}" data-itab="${k}">${n}</button>`).join('')}</div><span class="grow"></span><select class="in" id="isort" style="width:auto;height:36px" aria-label="Sortering"><option value="new" ${I.sort==='new'?'selected':''}>Nyeste først</option><option value="score" ${I.sort==='score'?'selected':''}>Bedste score først</option></select></div>
 ${list.length?`<div class="icards">${list.map(i=>`<div class="icard" data-open="idea:${i.id}" role="button" tabindex="0"><span class="pc1"><span class="bd"><i style="background:${ISM[i.status].c}"></i>${ISM[i.status].n}</span><span class="prio">${esc(i.category)}</span></span><b>${esc(i.title)}</b>${i.impact>=4&&i.effort<=2?`<span class="qw">${ic('flame',12,2)}Quick win</span>`:''}<dl class="idl"><dt>Problem</dt><dd>${esc(i.problem||'—')}</dd><dt>Idé</dt><dd>${esc(i.solution||'—')}</dd></dl><div class="iscore"><span>Effekt <b>${i.impact}</b></span><span>Indsats <b>${i.effort}</b></span><span>${esc(i.gainer)}</span>${i.projectId?'<span class="bd ok">Projekt</span>':`<button type="button" class="btn sm" data-mk="${i.id}">${ic('folder',14)}Gør til projekt</button>`}</div></div>`).join('')}</div>`:empty('bulb','Ingen idéer her','Skriv den første idé i formularen.')}
 </div></div>`}

/* ============ Indstillinger ============ */
function teamLocalPanel(){const c=S.cfg;return `<section class="pn">${cardH('Team','Bruges til ansvarlig og tildeling')}<div class="teamc">${c.team.map(n=>`<span class="tchip">${av(n,'xs')}${esc(n)}${n!==c.me?`<button class="rmx" data-team-del="${esc(n)}" aria-label="Fjern ${esc(n)}">${ic('x',11,2.4)}</button>`:''}</span>`).join('')}</div><div class="noteadd"><input class="in" id="teamNew" placeholder="Tilføj kollega…" data-enter="addTeam" autocomplete="off"><button class="btn" data-act="addTeam" aria-label="Tilføj">${ic('plus',15,2)}</button></div></section>`}
function teamAuthPanel(){const A=window.metzAuth,ms=(A.members||[]).slice().sort((a,b)=>(a.role===b.role?0:a.role==='leder'?-1:1)||a.name.localeCompare(b.name,'da'));
 return `<section class="pn">${cardH('Team',A.isLeader?'Kun personer på listen kan logge ind':'Personer med adgang til cockpittet')}<div class="mem">${ms.map(m=>`<div class="mem-r">${av(m.name,'sm')}<span class="grow"><b>${esc(m.name)}</b><small>${esc(m.email)}</small></span><span class="bd ${m.role==='leder'?'em':''}">${m.role==='leder'?'Leder':'Sælger'}</span>${A.isLeader&&m.email!==A.email?`<button class="ib" data-mem-del="${esc(m.email)}" aria-label="Fjern ${esc(m.name)}">${ic('x',14)}</button>`:''}</div>`).join('')}</div>
 ${A.isLeader?`<div class="mem-add"><input class="in" id="memName" placeholder="Navn" autocomplete="off"><input class="in" id="memEmail" type="email" placeholder="navn@metz.dk" autocomplete="off" data-enter="addMember"><select class="in" id="memRole"><option value="saelger">Sælger</option><option value="leder">Leder</option></select><button class="btn" data-act="addMember">${ic('plus',15,2)}Tilføj</button></div><p class="muted sm-p">Nye kolleger logger ind med et link på mail. Sælgere redigerer egne deals, lederen alle. Alle ser hele pipelinen.</p>`:'<p class="muted sm-p">Din leder styrer, hvem der har adgang.</p>'}</section>`}
function vSettings(){const c=S.cfg,tp=U.tplDraft||{};
 return `<div class="ph"><div class="grow"><h1>Indstillinger</h1><p class="sub">Mål, team og din Metz Studio-proces.</p></div></div><div class="setg">
 <section class="pn">${cardH('Profil og mål')}<div class="fg">${window.metzAuth?`<div class="fl w">Logget ind som<div class="mem-r">${av(c.me,'sm')}<span class="grow"><b>${esc(c.me)}</b><small>${esc(window.metzAuth.email)} · ${window.metzAuth.isLeader?'Leder':'Sælger'}</small></span><button class="btn sm" data-act="logout">Log ud</button></div></div>`:`<label class="fl w">Dit navn<input class="in" id="cf-me" data-cfg="me" value="${esc(c.me)}"></label>`}<label class="fl">Årsmål DB (kr)<input class="in" id="cf-target" data-cfg="target" type="number" inputmode="numeric" value="${c.target??''}"></label><label class="fl">Årsmål omsætning (kr)<input class="in" id="cf-targetRev" data-cfg="targetRev" type="number" inputmode="numeric" value="${c.targetRev??''}"></label><label class="fl">Studio-provision (%)<input class="in" id="cf-commission" data-cfg="commission" type="number" step="0.1" inputmode="decimal" value="${c.commission??''}"></label></div><p class="muted sm-p">Navnet bruges i statusmails til kunder og som standard-ansvarlig.</p></section>
 ${window.metzAuth?teamAuthPanel():teamLocalPanel()}
 <section class="pn s-wide">${cardH('Metz Studio-skabelon','Bruges, når en ny Studio-kunde oprettes')}<div class="fg"><label class="fl">Onboarding-trin <small>Ét trin pr. linje. Start linjen med “Kunde:”, hvis kunden skal levere.</small><textarea class="in" rows="10" id="tpl-steps" data-tpl="steps">${esc(tp.steps??S.tpl.steps.join('\n'))}</textarea></label><label class="fl">Info vi skal bruge fra kunden <small>Ét punkt pr. linje.</small><textarea class="in" rows="10" id="tpl-info" data-tpl="info">${esc(tp.info??S.tpl.info.join('\n'))}</textarea></label></div><div class="row-end"><button class="btn ghost" data-act="tplReset">Gendan standard</button><button class="btn pri" data-act="tplSave">${ic('check',16,2)}Gem skabelon</button></div></section>
 <section class="pn s-wide">${cardH('Data')}<div class="data-l"><button class="btn" data-act="export" data-what="pipeline">${ic('cloudDown',16)}Pipeline (CSV)</button><button class="btn" data-act="export" data-what="orders">${ic('cloudDown',16)}Ordrer (CSV)</button><button class="btn" data-act="export" data-what="studio">${ic('cloudDown',16)}Studio-kunder (CSV)</button><button class="btn" data-act="backup">${ic('copy',16)}Backup (JSON)</button></div><p class="muted sm-p">${S.deals.length} deals · ${S.studio.length} Studio-kunder · ${S.projects.length} projekter · ${S.ideas.length} idéer. ${window.metzAuth?'Data gemmes i Supabase (Postgres) og kræver login.':'Data gemmes i dette artefakt og er privat, indtil du deler det.'}</p></section>
 </div>`}

const VIEWS={dashboard:{t:'Dashboard',ic:'dash',r:vDash},pipeline:{t:'Pipeline',ic:'pipe',r:vPipe},ordrer:{t:'Ordrer',ic:'orders',r:vOrders},kunder:{t:'Kunder',ic:'users',r:vCustomers},studio:{t:'Metz Studio',ic:'store',r:vStudio},onboarding:{t:'Onboarding',ic:'route',r:vOnb},projekter:{t:'Projekter',ic:'folder',r:vProj},ideer:{t:'Idéer',ic:'bulb',r:vIdeas},indstillinger:{t:'Indstillinger',ic:'gear',r:vSettings}};

/* ============ Drawer ============ */
function curDeal(){const D=U.drawer;return D&&D.kind==='deal'&&D.id?S.deals.find(x=>x.id===D.id):null}
function openDeal(id,preset={}){U.drawer={kind:'deal',id:id||null,arm:false,draft:id?null:{company:'',title:'',contact:'',email:'',phone:'',type:'',segment:'',stage:'lead',value:null,owner:S.cfg.me,source:'',nextStep:'',nextDate:null,note:'',deadline:null,orderStatus:'bekraeftet',...preset}};closePop();paintDrawer(true);showDrawer();if(!id)setTimeout(()=>{const el=$('#drawer [data-f=company]');if(el&&!el.value)el.focus()},320)}
function openAcct(key){U.drawer={kind:'acct',id:key};closePop();paintDrawer(true);showDrawer()}
function showDrawer(){const d=$('#drawer');d.classList.add('open');d.setAttribute('aria-hidden','false');$('#dscrim').classList.add('open')}
function closeDrawer(){U.drawer=null;const d=$('#drawer');d.classList.remove('open');d.setAttribute('aria-hidden','true');$('#dscrim').classList.remove('open')}
function paintDrawer(force){if(!U.drawer)return;const dr=$('#drawer'),ae=document.activeElement;if(!force&&ae&&dr.contains(ae)&&ae.matches('input:not([type=checkbox]),textarea,select')){U.dpending=true;return}U.dpending=false;
 let html='';if(U.drawer.kind==='deal'){const d=U.drawer.id?S.deals.find(x=>x.id===U.drawer.id):U.drawer.draft;if(!d){closeDrawer();return}html=dealDrawer(d,!U.drawer.id)}else{const a=accounts().find(x=>x.key===U.drawer.id);if(!a){closeDrawer();return}html=acctDrawer(a)}
 const b=dr.querySelector('.db'),sc=b?b.scrollTop:0;dr.innerHTML=html;const nb=dr.querySelector('.db');if(nb&&!force)nb.scrollTop=sc}
function dealDrawer(d,isNew){const studio=d.type==='studio'?studioFor(d.company):null,sc=score(d),dg=dgOf(d.revenue,d.value),meta=[d.orderNo&&'Ordre '+d.orderNo,d.legalName&&coKey(d.legalName)!==coKey(d.company)?'Notes: '+d.legalName:''].filter(Boolean);
 const F=(l,inp,w)=>`<label class="fl ${w?'w':''}">${l}${inp}</label>`;
 const I=(k,type='text',ph='',x='')=>`<input class="in" data-f="${k}" id="df-${k}" type="${type}" value="${esc(d[k]??'')}" placeholder="${ph}" ${x}>`;
 const SEL=(k,opts)=>`<select class="in" data-f="${k}" id="df-${k}">${opts.map(([v,n])=>`<option value="${esc(v)}" ${String(d[k]??'')===String(v)?'selected':''}>${esc(n)}</option>`).join('')}</select>`;
 return `<div class="dh">${co(d.company||'?','lg')}<div class="grow"><div class="dtags">${typeBd(d.type)}${isNew?'':stageBd(d.stage)}${d.segment?`<span class="bd">${esc(d.segment)}</span>`:''}${d.est?'<span class="bd warn">Estimat</span>':''}</div><h2>${esc(d.company||'Ny deal')}</h2><p class="muted">${esc(d.title||(isNew?'Udfyld felterne og opret dealen':d.contact||'—'))}</p>${meta.length?`<p class="muted sm">${meta.map(esc).join(' · ')}</p>`:''}</div>${isNew?'':`<button class="ib ${d.fav?'on':''}" data-act="favDeal" aria-label="Favorit" title="Favorit">${d.fav?`<span class="star">${ic('star',18,2)}</span>`:ic('star',18)}</button>`}<button class="ib" data-act="closeDrawer" aria-label="Luk">${ic('x')}</button></div>
 <div class="db">
 ${isNew?'':`<div class="sub-h">Fase</div><div class="stp">${STAGES.map(s=>`<button class="${s.k===d.stage?'cur':''} ${d.stage!=='tabt'&&s.k!=='tabt'&&ST[d.stage].i>s.i?'done':''} ${s.k==='vundet'?'won':''} ${s.k==='tabt'?'lost':''}" data-stage="${s.k}">${s.n}</button>`).join('')}</div>`}
 <div class="sub-h">Type</div><div class="tsel">${['studio','adhoc',''].map(k=>`<button class="topt ${d.type===k?'on':''}" data-dtype="${k||'none'}"><span class="sq" style="background:${TYPES[k].c}"></span><span><b>${TYPES[k].n}</b><small>${k==='studio'?'Shop · onboarding':k==='adhoc'?'Enkeltordre':'Ikke afklaret endnu'}</small></span></button>`).join('')}</div>
 ${!isNew&&d.stage==='vundet'&&d.type==='studio'?(studio?(()=>{const pr=sProgress(studio);return `<button class="linkcard" data-open="studio:${studio.id}">${ic('store',20)}<span class="grow"><b>Metz Studio-onboarding · ${SSM[studio.status].n}</b><small>${pr.k}/${pr.n} trin · ${sMissing(studio)} mangler fra kunden</small>${segBar(pr.k,pr.n,pr.k===pr.n?'full':'')}</span>${ic('chevr',16)}</button>`})():`<button class="linkcard" data-act="mkStudioFromDeal">${ic('store',20)}<span class="grow"><b>Opret Studio-onboarding</b><small>Kunden findes ikke som Studio-kunde endnu</small></span>${ic('plus',16)}</button>`):''}
 ${!isNew&&d.stage==='vundet'&&d.type==='adhoc'?`<div class="sub-h">Ordrestatus</div><div class="ostp">${ORD.map(o=>`<button class="${o.k===d.orderStatus?'cur':''} ${OM[d.orderStatus].i>o.i?'done':''}" data-ostatus="${o.k}"><i></i>${o.n}</button>`).join('')}</div>`:''}
 ${!isNew&&d.stage==='vundet'&&(isN(d.revenue)||isN(d.value))?`<div class="amts"><div><small>Omsætning</small><b>${estB(d)}${kr(d.revenue)}</b></div><div><small>DB</small><b class="${num(d.value)<0?'neg':''}">${estB(d)}${kr(d.value)}</b></div><div><small>Dækningsgrad</small><b>${pct(dg)}</b></div></div>`:''}
 <div class="sub-h">Detaljer</div><div class="fg">
 ${F('Virksomhed *',I('company','text','Fx Novo Nordisk','autocomplete="off"'),1)}
 ${F('Sag / emne',I('title','text','Fx julegaver 2026','autocomplete="off"'),1)}
 ${F('Kontaktperson',I('contact','text','','autocomplete="off"'))}
 ${F('Ansvarlig',SEL('owner',ownerList().map(o=>[o,o])))}
 ${F('E-mail',I('email','email','navn@firma.dk','inputmode="email" autocomplete="off"'))}
 ${F('Telefon',I('phone','tel','','inputmode="tel" autocomplete="off"'))}
 ${F('Segment',SEL('segment',[['','—'],['SMV','SMV'],['Enterprise','Enterprise']]))}
 ${F('Kilde',SEL('source',[['','—']].concat([...new Set([...SOURCES,d.source].filter(Boolean))].map(s=>[s,s]))))}
 ${F('Omsætning (kr)',I('revenue','number','Fx 110000','inputmode="numeric" step="100"'))}
 ${F('DB (kr)',I('value','number','Fx 44000','inputmode="numeric" step="100"'))}
 <label class="tgl w estl"><input type="checkbox" data-f="est" id="df-est" ${d.est?'checked':''}><span></span>Beløbene er et estimat${isN(dg)?` <em class="muted">· DG ${pct(dg)}</em>`:''}</label>
 ${F('Ordrenr.',I('orderNo','text','Fx 261119141','inputmode="numeric" autocomplete="off"'))}
 ${isNew?F('Fase',SEL('stage',STAGES.map(s=>[s.k,s.n]))):F('Kundens deadline',I('deadline','date'))}
 ${F('Næste skridt',I('nextStep','text','Fx send tilbud','autocomplete="off"'))}
 ${F('Dato for næste skridt',I('nextDate','date'))}
 ${F('Navn i Notes',I('legalName','text','Fx MAERSK TANKERS A/S','autocomplete="off"'),1)}
 ${F('Note',`<textarea class="in" data-f="note" id="df-note" rows="3" placeholder="Behov, beslutningstagere, kontekst…">${esc(d.note)}</textarea>`,1)}
 </div>
 ${!isNew&&(d.email||d.phone)?`<div class="qc">${d.email?`<button class="qbtn" data-copy="${esc(d.email)}">${ic('mail',15)}${esc(d.email)}${ic('copy',14)}</button>`:''}${d.phone?`<button class="qbtn" data-copy="${esc(d.phone)}">${ic('phone',15)}${esc(d.phone)}${ic('copy',14)}</button>`:''}</div>`:''}
 ${isNew?'':`<div class="sub-h">Score <span class="hint-i" title="Beregnes ud fra fase, næste skridt, DB-værdi, aktivitet og favorit">${ic('info',14)}</span></div><div class="scorebox">${scoreHtml(sc)}<span class="muted">${scoreText(d)}</span></div>
 <div class="sub-h">Aktivitet</div><div class="noteadd"><input class="in" id="dnote" placeholder="Skriv en note og tryk Enter…" data-enter="addNote" data-kind="deal" autocomplete="off"><button class="btn" data-act="addNote" data-kind="deal" aria-label="Gem note">${ic('send',15)}</button></div>
 <ul class="tl">${[...d.log].reverse().slice(0,25).map(l=>`<li class="${l.k==='note'?'em':''}"><span>${esc(l.t)}</span><time>${ago(l.at)}</time></li>`).join('')}<li><span>${d.createdAt?'Deal oprettet':'Overført fra første version af cockpittet'}</span><time>${d.createdAt?dlong(d.createdAt):''}</time></li></ul>`}
 </div>
 <div class="df">${isNew?`<button class="btn pri" data-act="createDeal">${ic('check',16,2)}Opret deal</button><button class="btn ghost" data-act="closeDrawer">Annuller</button>`:`<span class="saved">${ic('check',14,2.4)}Gemmes automatisk · ${ago(d.updatedAt)}</span><span class="grow"></span><button class="btn danger" data-act="delDeal">${ic('trash',16)}${U.drawer.arm?'Bekræft sletning':'Slet'}</button>`}</div>`}
function acctDrawer(a){const ds=a.deals.slice().sort((x,y)=>(y.wonDate||y.updatedAt||'').localeCompare(x.wonDate||x.updatedAt||''));
 return `<div class="dh">${co(a.name,'lg')}<div class="grow"><div class="dtags">${relBd(a)}</div><h2>${esc(a.name)}</h2><p class="muted">${esc(a.contact||'Ingen kontaktperson')}</p>${a.legal.length?`<p class="muted sm">Notes: ${esc(a.legal.join(' · '))}</p>`:''}</div><button class="ib" data-act="closeDrawer" aria-label="Luk">${ic('x')}</button></div><div class="db">
 <div class="mini-k"><div><small>Omsætning</small><b>${krs(a.wonRev)}</b></div><div><small>DB</small><b>${krs(a.wonDb)}</b></div><div><small>DG</small><b>${pct(a.dg)}</b></div></div>
 ${a.estDb||a.openDb?`<p class="muted sm-p">${[a.estDb&&`+${krs(a.estDb)} DB forventet`,a.openDb&&`${krs(a.openDb)} i åben pipeline`].filter(Boolean).join(' · ')}</p>`:''}
 ${a.studio?(()=>{const pr=sProgress(a.studio);return `<button class="linkcard" data-open="studio:${a.studio.id}">${ic('store',20)}<span class="grow"><b>Metz Studio · ${SSM[a.studio.status].n}</b><small>${pr.k}/${pr.n} trin · ${sMissing(a.studio)} mangler fra kunden</small>${segBar(pr.k,pr.n,pr.k===pr.n?'full':'')}</span>${ic('chevr',16)}</button>`})():''}
 <div class="sub-h">Sager og ordrer <span class="muted">${ds.length}</span></div>
 ${ds.length?`<ul class="ol">${ds.map(d=>`<li><button class="ol-i" data-open="deal:${d.id}"><span class="grow"><b>${esc(d.title||TYPES[d.type].n)}</b><small>${[d.orderNo&&'#'+d.orderNo,d.stage==='vundet'&&d.type==='adhoc'?OM[d.orderStatus].n:ST[d.stage].n,d.wonDate&&d.stage==='vundet'?monthName(ymOf(d)):ago(d.updatedAt)].filter(Boolean).map(esc).join(' · ')}</small></span>${typeBd(d.type)}<span class="ol-amt">${isN(d.value)?`<b>${estB(d)}${krs(d.value)}</b>`:'<b class="muted">—</b>'}${isN(d.revenue)?`<small>${krs(d.revenue)}</small>`:''}</span></button></li>`).join('')}</ul>`:'<p class="muted sm-p">Ingen sager endnu.</p>'}
 <div class="acts-row"><button class="btn soft" data-act="newDealFor" data-company="${esc(a.name)}" data-contact="${esc(a.contact)}">${ic('plus',15,2)}Ny deal</button><button class="btn" data-act="newOrderFor" data-company="${esc(a.name)}" data-contact="${esc(a.contact)}">${ic('orders',15)}Ny ad hoc-ordre</button>${a.studio?'':`<button class="btn" data-act="mkStudioFor" data-company="${esc(a.name)}" data-contact="${esc(a.contact)}">${ic('store',15)}Gør til Studio-kunde</button>`}</div>
 </div>`}
function fieldVal(t){const k=t.dataset.f;if(t.type==='checkbox')return t.checked;let v=t.value;if(k==='value'||k==='revenue'){v=String(v).trim()===''?null:Math.round(+v);if(!isN(v))v=null}else if(k==='nextDate'||k==='deadline')v=v||null;else v=String(v).trim();return v}
function dealField(t){const D=U.drawer;if(!D)return;const k=t.dataset.f,v=fieldVal(t);if(!D.id){D.draft[k]=v;return}const d=S.deals.find(x=>x.id===D.id);if(!d)return;
 if(k==='company'&&!v){t.value=d.company;toast('Virksomhed skal være udfyldt',null,'','err');return}
 if((d[k]??null)===(v??null))return;const n={...d,[k]:v,log:d.log.slice()};
 const L=x=>n.log.push({at:nowIso(),t:x});
 if(k==='value')L('DB sat til '+kr(v));else if(k==='revenue')L('Omsætning sat til '+kr(v));else if(k==='est')L(v?'Markeret som estimat':'Beløb bekræftet');else if(k==='orderNo'&&v)L('Ordrenr. '+v);else if(k==='owner')L('Tildelt '+v);else if(k==='nextStep'&&v)L('Næste skridt: '+v);else if(k==='deadline'&&v)L('Deadline sat til '+dshort(v));
 put('deals',n);if(k==='est'||k==='value'||k==='revenue')setTimeout(()=>paintDrawer(),0)}
function createDeal(){const D=U.drawer;if(!D||D.id)return;const d=D.draft;$$('#drawer [data-f]').forEach(el=>{d[el.dataset.f]=fieldVal(el)});if(!d.company){toast('Skriv virksomhedens navn',null,'','err');const el=$('#drawer [data-f=company]');el&&el.focus();return}
 const id=uid('d'),n={...d,id,log:[{at:nowIso(),t:'Deal oprettet'}]};if(n.stage==='vundet')n.wonDate=today();
 put('deals',n,{create:true});U.drawer={kind:'deal',id,arm:false,draft:null};paintDrawer(true);
 if(n.stage==='vundet'&&n.type==='studio')ensureStudio(n);else toast(`${n.company} er oprettet`)}
function setDealType(raw){const k=raw==='none'?'':raw,D=U.drawer;if(!D||D.kind!=='deal')return;if(!D.id){$$('#drawer [data-f]').forEach(el=>{D.draft[el.dataset.f]=fieldVal(el)});D.draft.type=k;paintDrawer(true);return}
 const d=S.deals.find(x=>x.id===D.id);if(!d||d.type===k)return;put('deals',{...d,type:k,log:[...d.log,{at:nowIso(),t:'Type: '+TYPES[k].n}]});if(k==='studio'&&d.stage==='vundet')ensureStudio({...d,type:k})}
async function setStage(d,k){if(!d||d.stage===k)return;let type=d.type;if(k==='vundet'&&!type){type=await pickType(d);if(type==null)return}
 const prev=S.deals.find(x=>x.id===d.id)||d,n={...prev,stage:k,type,log:[...prev.log,{at:nowIso(),t:`Fase: ${ST[prev.stage].n} → ${ST[k].n}`}]};
 if(type!==prev.type)n.log.push({at:nowIso(),t:'Type: '+TYPES[type].n});
 n.wonDate=k==='vundet'?(prev.wonDate||today()):null;put('deals',n);if(U.drawer)U.drawer.arm=false;
 if(k==='vundet'&&type==='studio'){ensureStudio(n);return}
 toast(`${n.company} → ${ST[k].n}${k==='vundet'&&type==='adhoc'?' · lagt under Ordrer':''}`,()=>put('deals',prev),'Fortryd')}
function setOrderStatus(d,k){if(!d||d.orderStatus===k)return;const prev={...d};put('deals',{...d,orderStatus:k,log:[...d.log,{at:nowIso(),t:'Ordrestatus: '+OM[k].n}]});toast(`${d.company} · ${OM[k].n}`,()=>put('deals',prev),'Fortryd')}
function advOrder(id){const d=S.deals.find(x=>x.id===id);if(!d)return;const nx=ORD[OM[d.orderStatus].i+1];if(nx)setOrderStatus(d,nx.k)}
function ensureStudio(n){const ex=studioFor(n.company);if(ex){toast(`${n.company} er allerede Studio-kunde`,()=>{closeDrawer();go('studio',ex.id)},'Åbn');return ex}
 const steps=tplSteps();if(steps.length){steps[0].d=true;steps[0].at=today()}
 const s={id:uid('s'),company:n.company,contact:n.contact||'',email:n.email||'',owner:n.owner||S.cfg.me,status:'onboarding',steps,info:tplInfo(),goLive:null,startDate:today(),setupFee:null,shopRevenue:null,note:'',dealId:n.id||null,log:[{at:nowIso(),t:n.id?'Onboarding oprettet fra vundet deal':'Studio-kunde oprettet'}]};
 put('studio',s,{create:true});toast(`Metz Studio-onboarding oprettet for ${n.company}`,()=>{closeDrawer();go('studio',s.id)},'Åbn');return s}
function pickType(d){return new Promise(res=>{let done=false;const dg=modal(`<div class="mh"><div><h2>Tillykke – ${esc(d.company)} er vundet</h2><p class="muted">Hvad blev det til? Det afgør, hvor kunden lander i systemet.</p></div><button class="ib" data-close aria-label="Luk">${ic('x')}</button></div><div class="mb"><div class="bigopts"><button class="bigopt" data-pick="studio"><span class="bo-ic st">${ic('store',22)}</span><b>Metz Studio</b><small>Shop med fast sortiment. Opretter automatisk en onboarding med trin og tjekliste.</small></button><button class="bigopt" data-pick="adhoc"><span class="bo-ic ah">${ic('orders',22)}</span><b>Ad hoc-ordre</b><small>Enkeltordre. Lægges under Ordrer med status og deadline.</small></button></div></div>`);
 const fin=v=>{if(done)return;done=true;dg.removeEventListener('close',onC);dg._pick=null;if(dg.open)dg.close();res(v)},onC=()=>fin(null);dg.addEventListener('close',onC);dg._pick=fin})}

/* ============ Studio-handlinger ============ */
const studioById=id=>S.studio.find(x=>x.id===id);
function toggleStep(ref){const [id,i]=ref.split(':'),s=studioById(id);if(!s)return;const ix=+i,x=s.steps[ix];if(!x)return;const steps=s.steps.map((y,j)=>j===ix?{...y,d:!y.d,at:!y.d?today():null}:y),now=!x.d;
 const n={...s,steps,log:[...s.log,{at:nowIso(),t:(now?'✓ ':'Fortrudt: ')+x.t}]};put('studio',n);const pr=sProgress(n);
 if(now&&pr.k===pr.n&&n.status==='onboarding')toast(`Alle trin klaret for ${s.company}`,()=>setStudioStatus(id+':live'),'Sæt til Live');else toast(now?`✓ ${x.t}`:`Fortrudt: ${x.t}`,()=>put('studio',s),'Fortryd')}
function toggleInfo(ref){const [id,i]=ref.split(':'),s=studioById(id);if(!s)return;const ix=+i,x=s.info[ix];if(!x)return;const info=s.info.map((y,j)=>j===ix?{...y,d:!y.d}:y);put('studio',{...s,info,log:[...s.log,{at:nowIso(),t:(x.d?'Mangler igen: ':'Modtaget: ')+x.t}]});if(!x.d)toast('Modtaget: '+x.t,()=>put('studio',s),'Fortryd')}
function delInfo(ref){const [id,i]=ref.split(':'),s=studioById(id);if(!s)return;const ix=+i,x=s.info[ix];if(!x)return;put('studio',{...s,info:s.info.filter((y,j)=>j!==ix)});toast('Fjernet: '+x.t,()=>put('studio',s),'Fortryd')}
function setStudioStatus(ref){const [id,k]=ref.split(':'),s=studioById(id);if(!s||!SSM[k]||s.status===k)return;const n={...s,status:k,log:[...s.log,{at:nowIso(),t:'Status: '+SSM[k].n}]};if(k==='live'&&!s.goLive)n.goLive=today();put('studio',n);toast(k==='live'?`${s.company} er live 🎉`:`${s.company} · ${SSM[k].n}`,()=>put('studio',s),'Fortryd')}
function studioField(t){const s=studioById(U.param);if(!s)return;const k=t.dataset.sf;let v=t.value;if(k==='setupFee'||k==='shopRevenue'){v=String(v).trim()===''?null:Math.max(0,Math.round(+v));if(!isN(v))v=null}else if(k==='goLive'||k==='startDate')v=v||null;else v=String(v).trim();
 if(k==='company'&&!v){t.value=s.company;toast('Virksomhed skal være udfyldt',null,'','err');return}if((s[k]??null)===(v??null))return;const n={...s,[k]:v,log:s.log.slice()};if(k==='goLive'&&v)n.log.push({at:nowIso(),t:'Go-live sat til '+dlong(v)});if(k==='shopRevenue'&&v!=null)n.log.push({at:nowIso(),t:'Shopomsætning: '+kr(v)});put('studio',n)}
function newStudioModal(preset={}){modal(`<form id="fns"><div class="mh"><div><h2>Ny Studio-kunde</h2><p class="muted">Starter en onboarding med trin og tjekliste fra din skabelon.</p></div><button type="button" class="ib" data-close aria-label="Luk">${ic('x')}</button></div><div class="mb"><div class="fg"><label class="fl w">Virksomhed *<input class="in" name="company" required value="${esc(preset.company||'')}" autocomplete="off"></label><label class="fl">Kontaktperson<input class="in" name="contact" value="${esc(preset.contact||'')}" autocomplete="off"></label><label class="fl">E-mail<input class="in" name="email" type="email" autocomplete="off"></label><label class="fl">Startdato<input class="in" name="startDate" type="date" value="${today()}"></label><label class="fl">Forventet go-live<input class="in" name="goLive" type="date"></label></div></div><div class="mf"><button type="button" class="btn" data-close>Annuller</button><button class="btn pri">${ic('check',16,2)}Opret og åbn</button></div></form>`)}

/* ============ Projekter (dialog) ============ */
function openProj(id){const p=id?S.projects.find(x=>x.id===id):null;U.pjEdit={id:p?p.id:null,tasks:p?p.tasks.map(x=>({...x})):[],arm:false};const v=p||{status:'plan',priority:'Mellem',owner:S.cfg.me};
 modal(`<form id="fpj"><div class="mh"><h2>${p?'Rediger projekt':'Nyt projekt'}</h2><button type="button" class="ib" data-close aria-label="Luk">${ic('x')}</button></div><div class="mb"><div class="fg">
 <label class="fl w">Projekt *<input class="in" name="title" required value="${esc(v.title||'')}" placeholder="Fx Optimering af Metz Studio" autocomplete="off"></label>
 <label class="fl">Ansvarlig<select class="in" name="owner">${ownerList().map(o=>`<option ${o===(v.owner||S.cfg.me)?'selected':''}>${esc(o)}</option>`).join('')}</select></label>
 <label class="fl">Status<select class="in" name="status">${PS.map(s=>`<option value="${s.k}" ${s.k===v.status?'selected':''}>${s.n}</option>`).join('')}</select></label>
 <label class="fl">Prioritet<select class="in" name="priority">${['Høj','Mellem','Lav'].map(x=>`<option ${x===v.priority?'selected':''}>${x}</option>`).join('')}</select></label>
 <label class="fl">Deadline<input class="in" type="date" name="deadline" value="${esc(v.deadline||'')}"></label>
 <label class="fl w">Mål / succeskriterie<input class="in" name="goal" value="${esc(v.goal||'')}" autocomplete="off"></label>
 <label class="fl w">Beskrivelse<textarea class="in" name="description" rows="3">${esc(v.description||'')}</textarea></label>
 <div class="fl w">Opgaver<ul class="tasks" id="pjt">${pjTasks()}</ul><div class="noteadd"><input class="in" id="pjn" placeholder="Ny opgave – tryk Enter…" data-enter="addTask" autocomplete="off"><button type="button" class="btn" data-act="addTask" aria-label="Tilføj opgave">${ic('plus',15,2)}</button></div></div>
 </div></div><div class="mf">${p?`<button type="button" class="btn danger" data-act="delProj" style="margin-right:auto">${ic('trash',16)}Slet</button>`:''}<button type="button" class="btn" data-close>Annuller</button><button class="btn pri">${ic('check',16,2)}${p?'Gem':'Opret projekt'}</button></div></form>`)}
function pjTasks(){const T=U.pjEdit.tasks;return T.length?T.map((x,i)=>`<li class="${x.d?'done':''}"><button type="button" class="cbx ${x.d?'on':''}" data-ptask="${i}" aria-label="${x.d?'Fortryd':'Marker som færdig'}">${x.d?ic('check',12,3):''}</button><span class="grow">${esc(x.t)}</span><button type="button" class="ib sm" data-ptask-del="${i}" aria-label="Fjern">${ic('x',14)}</button></li>`).join(''):'<li class="muted">Ingen opgaver endnu</li>'}
function makeProject(i){const id=uid('p');put('projects',{id,title:i.title,owner:S.cfg.me,status:'plan',priority:i.impact>=4?'Høj':'Mellem',deadline:null,goal:'',description:[i.problem&&'Problem: '+i.problem,i.solution&&'Idé: '+i.solution].filter(Boolean).join('\n\n'),tasks:[]},{create:true});put('ideas',{...i,status:'godkendt',projectId:id});toast('Projekt oprettet fra idéen',()=>go('projekter'),'Se projekt')}

/* ============ Popovers, modals, toast ============ */
function openPop(anchor,html,o={}){const p=$('#pop');if(!p.hidden&&anchor.hasAttribute('data-pa-open')){closePop();return}closePop();p.innerHTML=html;p.hidden=false;anchor.setAttribute('data-pa-open','');
 const r=anchor.getBoundingClientRect(),pw=p.offsetWidth,ph=p.offsetHeight,vw=innerWidth,vh=innerHeight;let x=o.align==='right'?r.right-pw:r.left;x=Math.max(8,Math.min(x,vw-pw-8));let y=o.up?r.top-ph-8:r.bottom+6;if(!o.up&&y+ph>vh-8)y=r.top-ph-6;if(y<8)y=Math.min(vh-ph-8,r.bottom+6);p.style.left=x+'px';p.style.top=Math.max(8,y)+'px'}
function closePop(){const p=$('#pop');p.hidden=true;$$('[data-pa-open]').forEach(x=>x.removeAttribute('data-pa-open'))}
function modal(html,cls=''){const d=$('#dlg');d.className='m '+cls;d.innerHTML=html;if(!d.open){try{d.showModal()}catch(e){d.setAttribute('open','')}}return d}
function closeModal(){const d=$('#dlg');if(d.open)d.close()}
let tT=0;function toast(msg,fn,label='Fortryd',tone=''){const t=$('#toast');t.className='toast '+(tone||'')+($('#bulk').hidden?'':' up');t.innerHTML=`<span class="tic">${ic(tone==='err'?'info':'check',13,2.6)}</span><span class="tm">${esc(msg)}</span>${fn?`<button type="button" class="tbtn">${esc(label||'Fortryd')}</button>`:''}`;t.hidden=false;if(fn)t.querySelector('.tbtn').onclick=()=>{t.hidden=true;fn()};clearTimeout(tT);tT=setTimeout(()=>{t.hidden=true},fn?6500:3200)}
async function copyOrShow(txt,msg,title){try{await navigator.clipboard.writeText(txt);toast(msg);return}catch(e){}modal(`<div class="mh"><div><h2>${esc(title||'Kopiér tekst')}</h2><p class="muted">Kopiering blev blokeret her – markér teksten og kopiér den manuelt.</p></div><button class="ib" data-close aria-label="Luk">${ic('x')}</button></div><div class="mb"><textarea class="in mailbox" id="cpy" readonly>${esc(txt)}</textarea></div><div class="mf"><button class="btn pri" data-close>Færdig</button></div>`,'wide');setTimeout(()=>{const a=$('#cpy');if(a){a.focus();a.select()}},60)}
function rowMenu(el){const d=S.deals.find(x=>x.id===el.dataset.rowmenu);if(!d)return;openPop(el,`<button class="mi" data-pa="rmopen:${d.id}">${ic('eye',16)}Åbn detaljer</button><button class="mi" data-pa="rmfav:${d.id}">${ic('star',16)}${d.fav?'Fjern favorit':'Marker som favorit'}</button>${d.contact||d.email||d.phone?`<button class="mi" data-pa="rmcopy:${d.id}">${ic('copy',16)}Kopiér kontaktinfo</button>`:''}<hr><div class="pmh">Flyt til</div><div class="mstages">${STAGES.map(s=>`<button class="ms ${s.k===d.stage?'on':''}" data-pa="rmstage:${d.id}:${s.k}"><i style="background:${s.c}"></i>${s.n}</button>`).join('')}</div><hr><button class="mi danger" data-pa="rmdel:${d.id}">${ic('trash',16)}Slet deal</button>`,{align:'right'})}
function openBell(el){const it=actionItems();openPop(el,`<div class="pmh">Kræver handling · ${it.length}</div>${it.length?it.slice(0,12).map(a=>`<button class="mi ni" data-open="${a.act}"><span class="act-ic ${a.tone}">${ic(a.ic,15)}</span><span class="grow"><b>${esc(a.t)}</b><small>${esc(a.s)}</small></span></button>`).join(''):`<div class="pop-empty">${ic('check',22,2)}<span>Intet kræver din opmærksomhed lige nu</span></div>`}`,{align:'right'})}
function openFilter(el){const f=U.p.f,owners=ownerList(),srcs=[...new Set([...SOURCES,...S.deals.map(d=>d.source).filter(Boolean)])];const sel=(k,opts)=>`<select class="in" data-pf="${k}">${opts.map(([v,n])=>`<option value="${esc(v)}" ${f[k]===v?'selected':''}>${esc(n)}</option>`).join('')}</select>`;
 openPop(el,`<div class="pmh">Filtrér pipeline</div><div class="pf"><label class="fl">Segment${sel('seg',[['','Alle'],['SMV','SMV'],['Enterprise','Enterprise'],['—','Uden segment']])}</label><label class="fl">Ansvarlig${sel('owner',[['','Alle']].concat(owners.map(o=>[o,o])))}</label><label class="fl">Kilde${sel('src',[['','Alle']].concat(srcs.map(s=>[s,s]),[['—','Uden kilde']]))}</label><button class="btn sm" data-pa="fclear:1">Nulstil filtre</button></div>`)}
const SORTS=[['next','Næste skridt'],['company','Virksomhed'],['value','DB'],['score','Score'],['stage','Fase'],['updated','Senest opdateret']];
function openSort(el){openPop(el,`<div class="pmh">Sortér efter</div>${SORTS.map(([k,n])=>`<button class="mi ${U.p.sort.k===k?'act':''}" data-pa="sort:${k}">${n}${U.p.sort.k===k?`<span class="grow"></span><span class="muted">${U.p.sort.d>0?'Stigende ↑':'Faldende ↓'}</span>`:''}</button>`).join('')}`)}
function openViewMenu(el){openPop(el,`<div class="pmh">Tæthed</div><div class="seg full"><button class="${!U.dense?'on':''}" data-pa="dense:0">Normal</button><button class="${U.dense?'on':''}" data-pa="dense:1">Kompakt</button></div><div class="pmh">Kolonner</div>${PCOLS.map(c=>`<label class="mi chkrow"><input type="checkbox" class="cb" data-col="${c.k}" ${U.cols.includes(c.k)?'checked':''}>${c.l}</label>`).join('')}`,{align:'right'})}
function studioMenu(el){const s=studioById(el.dataset.id);if(!s)return;const deal=s.dealId?S.deals.find(d=>d.id===s.dealId):dealsFor(s.company).find(d=>d.type==='studio');openPop(el,`${deal?`<button class="mi" data-pa="smdeal:${deal.id}">${ic('pipe',16)}Åbn den vundne deal</button>`:''}<button class="mi" data-pa="smacct:${esc(coKey(s.company))}">${ic('users',16)}Se kundekort</button><button class="mi" data-pa="smtpl:${s.id}">${ic('route',16)}Tilføj manglende trin fra skabelon</button><hr><button class="mi danger" data-pa="smdel:${s.id}">${ic('trash',16)}Slet Studio-kunde</button>`,{align:'right'})}
function popAction(el){const [k,...rest]=el.dataset.pa.split(':'),v=rest.join(':');const ids=[...U.sel],ds=ids.map(id=>S.deals.find(x=>x.id===id)).filter(Boolean);
 switch(k){
 case 'bstage':{closePop();const copies=ds.map(d=>({...d}));ds.forEach(d=>{const n={...d,stage:v,log:[...d.log,{at:nowIso(),t:`Fase: ${ST[d.stage].n} → ${ST[v].n}`}],wonDate:v==='vundet'?(d.wonDate||today()):null};put('deals',n);if(v==='vundet'&&d.type==='studio')ensureStudio(n)});const miss=v==='vundet'?ds.filter(d=>!d.type).length:0;U.sel.clear();toast(`${ds.length} flyttet til ${ST[v].n}${miss?` · vælg type for ${miss}`:''}`,()=>copies.forEach(d=>put('deals',d)),'Fortryd');break}
 case 'btype':{closePop();const t=v==='none'?'':v,copies=ds.map(d=>({...d}));ds.forEach(d=>{const n={...d,type:t,log:[...d.log,{at:nowIso(),t:'Type: '+TYPES[t].n}]};put('deals',n);if(t==='studio'&&d.stage==='vundet')ensureStudio(n)});toast(`${ds.length} sat til ${TYPES[t].n}`,()=>copies.forEach(d=>put('deals',d)),'Fortryd');break}
 case 'bowner':{closePop();const copies=ds.map(d=>({...d}));ds.forEach(d=>put('deals',{...d,owner:v,log:[...d.log,{at:nowIso(),t:'Tildelt '+v}]}));toast(`${ds.length} tildelt ${v}`,()=>copies.forEach(d=>put('deals',d)),'Fortryd');break}
 case 'rmopen':closePop();openDeal(v);break;
 case 'rmfav':{closePop();const d=S.deals.find(x=>x.id===v);if(d)put('deals',{...d,fav:!d.fav});break}
 case 'rmcopy':{closePop();const d=S.deals.find(x=>x.id===v);if(d)copyOrShow([d.contact,d.company,d.email,d.phone].filter(Boolean).join('\n'),'Kontaktinfo kopieret','Kontaktinfo');break}
 case 'rmstage':{closePop();const [id,st]=v.split(':'),d=S.deals.find(x=>x.id===id);if(d)setStage(d,st);break}
 case 'rmdel':{const d=S.deals.find(x=>x.id===v);if(!d){closePop();break}if(!el.dataset.arm){el.dataset.arm='1';el.innerHTML=`${ic('trash',16)}Klik igen for at slette`;break}closePop();del('deals',d);toast(`${d.company} slettet`,()=>put('deals',d),'Fortryd');break}
 case 'sort':{U.p.sort=U.p.sort.k===v?{k:v,d:-U.p.sort.d}:{k:v,d:['value','score','updated'].includes(v)?-1:1};closePop();schedule();break}
 case 'dense':{U.dense=v==='1';setPref('dense',U.dense);$$('#pop [data-pa^="dense"]').forEach(b=>b.classList.toggle('on',b.dataset.pa===el.dataset.pa));schedule();break}
 case 'fclear':{U.p.f={seg:'',owner:'',src:''};closePop();schedule();break}
 case 'smdeal':closePop();openDeal(v);break;
 case 'smacct':closePop();openAcct(v);break;
 case 'smtpl':{closePop();const s=studioById(v);if(!s)break;const have=new Set(s.steps.map(x=>x.t.toLowerCase())),add=tplSteps().filter(x=>!have.has(x.t.toLowerCase())),haveI=new Set(s.info.map(x=>x.t.toLowerCase())),addI=tplInfo().filter(x=>!haveI.has(x.t.toLowerCase()));if(!add.length&&!addI.length){toast('Kunden har allerede alle trin og punkter');break}put('studio',{...s,steps:[...s.steps,...add],info:[...s.info,...addI]});toast(`${add.length} trin og ${addI.length} punkter tilføjet`,()=>put('studio',s),'Fortryd');break}
 case 'smdel':{const s=studioById(v);if(!s){closePop();break}if(!el.dataset.arm){el.dataset.arm='1';el.innerHTML=`${ic('trash',16)}Klik igen for at slette`;break}closePop();del('studio',s);go('studio');toast(`${s.company} slettet som Studio-kunde`,()=>{put('studio',s)},'Fortryd');break}
 }}
function bulk(k,el){const ds=[...U.sel].map(id=>S.deals.find(x=>x.id===id)).filter(Boolean);if(!ds.length){U.sel.clear();schedule();return}
 if(k==='clear'){U.sel.clear();U.bulkDel=false;schedule();return}
 if(k==='fav'){const all=ds.every(d=>d.fav);ds.forEach(d=>put('deals',{...d,fav:!all}));toast(all?`${ds.length} fjernet fra favoritter`:`${ds.length} markeret som favorit`);return}
 if(k==='del'){if(!U.bulkDel){U.bulkDel=true;renderBulk();return}U.bulkDel=false;const copies=ds.map(d=>({...d}));ds.forEach(d=>del('deals',d));U.sel.clear();toast(`${ds.length} slettet`,()=>copies.forEach(d=>put('deals',d)),'Fortryd');return}
 if(k==='stage')openPop(el,`<div class="pmh">Flyt ${ds.length} til</div>${STAGES.map(s=>`<button class="mi" data-pa="bstage:${s.k}"><i class="dot" style="background:${s.c}"></i>${s.n}</button>`).join('')}`,{up:true});
 if(k==='type')openPop(el,`<div class="pmh">Sæt type for ${ds.length}</div>${['studio','adhoc',''].map(t=>`<button class="mi" data-pa="btype:${t||'none'}"><span class="sq" style="background:${TYPES[t].c}"></span>${TYPES[t].n}</button>`).join('')}`,{up:true});
 if(k==='owner')openPop(el,`<div class="pmh">Tildel ${ds.length} til</div>${ownerList().map(o=>`<button class="mi" data-pa="bowner:${esc(o)}">${av(o,'xs')}${esc(o)}</button>`).join('')}`,{up:true})}

/* ============ Palette (⌘K) ============ */
function openPalette(){const p=$('#pal');p.innerHTML=`<div class="pal-in">${ic('search',19)}<input id="palq" placeholder="Søg efter kunder, deals, projekter eller sider…" autocomplete="off" aria-label="Søg"><span class="kbd">esc</span></div><div class="pal-r" id="palr"></div><div class="pal-f hide-s"><span><span class="kbd">↑</span><span class="kbd">↓</span> naviger</span><span><span class="kbd">↵</span> åbn</span><span><span class="kbd">⌘K</span> åbn og luk</span></div>`;closePop();closeSide();if(!p.open){try{p.showModal()}catch(e){p.setAttribute('open','')}}U.palIdx=0;palSearch();setTimeout(()=>{const i=$('#palq');i&&i.focus()},20)}
function palItems(q){q=q.trim().toLowerCase();const out=[],m=x=>!q||String(x).toLowerCase().includes(q);
 Object.entries(VIEWS).filter(([k,v])=>m(v.t)).slice(0,q?4:9).forEach(([k,v])=>out.push({g:'Sider',ic:v.ic,t:v.t,s:'',ref:'go:'+k}));
 if(q){S.deals.filter(d=>m([d.company,d.title,d.contact,d.email,d.orderNo,d.legalName].join(' '))).slice(0,8).forEach(d=>out.push({g:'Deals og ordrer',co:d.company,t:d.company,s:[d.orderNo&&'#'+d.orderNo,d.title,ST[d.stage].n,isN(d.value)?'DB '+krs(d.value):''].filter(Boolean).join(' · '),ref:'deal:'+d.id}));
  S.studio.filter(s=>m([s.company,s.contact].join(' '))).slice(0,4).forEach(s=>out.push({g:'Metz Studio',co:s.company,t:s.company,s:`${SSM[s.status].n} · ${Math.round(sProgress(s).p*100)} % klar`,ref:'studio:'+s.id}));
  S.projects.filter(p=>m(p.title)).slice(0,3).forEach(p=>out.push({g:'Projekter',ic:'folder',t:p.title,s:PSM[p.status].n,ref:'proj:'+p.id}));
  S.ideas.filter(i=>m(i.title+' '+i.problem)).slice(0,3).forEach(i=>out.push({g:'Idéer',ic:'bulb',t:i.title,s:ISM[i.status].n,ref:'idea:'+i.id}));
  out.push({g:'Handlinger',ic:'plus',t:`Opret deal “${q}”`,s:'Ny salgsmulighed',ref:'new:'+q})}
 else out.push({g:'Handlinger',ic:'plus',t:'Opret deal',s:'Genvej: N',ref:'new:'},{g:'Handlinger',ic:'bulb',t:'Skriv en idé',s:'Idé-formularen',ref:'go:ideer'},{g:'Handlinger',ic:'store',t:'Ny Studio-kunde',s:'Start en onboarding',ref:'studio-new:'});
 return out}
function palSearch(){const inp=$('#palq'),q=inp?inp.value:'',it=palItems(q);U.palList=it;U.palIdx=Math.max(0,Math.min(U.palIdx,it.length-1));let g='';
 $('#palr').innerHTML=it.length?it.map((x,i)=>{const h=x.g!==g?`<div class="pal-g">${x.g}</div>`:'';g=x.g;return h+`<button class="pal-i ${i===U.palIdx?'act':''}" data-pal="${i}">${x.co?co(x.co,'sm'):`<span class="pal-ic">${ic(x.ic||'arrow',16)}</span>`}<span class="grow"><b>${esc(x.t)}</b>${x.s?`<small>${esc(x.s)}</small>`:''}</span>${ic('chevr',15)}</button>`}).join(''):`<div class="pop-empty">Ingen resultater for “${esc(q)}”</div>`;
 const a=$('#palr .pal-i.act');if(a)a.scrollIntoView({block:'nearest'})}
function palGo(i){const x=U.palList[i];if(!x)return;$('#pal').close();const ix=x.ref.indexOf(':'),k=x.ref.slice(0,ix),v=x.ref.slice(ix+1);if(k==='go')go(v);else if(k==='new')openDeal(null,{company:v});else if(k==='studio-new')newStudioModal();else openRef(x.ref)}

/* ============ Import / eksport ============ */
const HMAP={virksomhed:'company',firma:'company',company:'company',kunde:'company',sag:'title',emne:'title',titel:'title',beskrivelse:'title',ordretekst:'title',kontakt:'contact',kontaktperson:'contact',contact:'contact',navn:'contact','e-mail':'email',email:'email',mail:'email',telefon:'phone',tlf:'phone',phone:'phone',type:'type',fase:'stage',stage:'stage',db:'value','dækningsbidrag':'value','omsætning':'revenue',oms:'revenue','beløb':'revenue',value:'value',kilde:'source',source:'source',segment:'segment','næste skridt':'nextStep',note:'note',noter:'note',ordrenr:'orderNo','ordrenr.':'orderNo',ordre:'orderNo',ordrenummer:'orderNo'};
const LEGAL_RE=/(^|\s)(a\/s|aps|p\/s|i\/s|k\/s|ivs|amba|a\.m\.b\.a\.?|ab|as|oy|gmbh|ltd\.?|inc\.?|bv)(?=\s|$)/gi;
const GENERIC=new Set(['holding','group','gruppen','koncern','denmark','danmark','nordic','norden','the','og','and','electronics','services','service','international','europe','copenhagen','københavn','scandinavia','danish']);
const coTokens=s=>String(s||'').toLowerCase().replace(LEGAL_RE,' ').replace(/[^\p{L}\p{N}]+/gu,' ').split(' ').filter(w=>w&&!GENERIC.has(w));
const parseDK=s=>{s=String(s??'').trim();if(!s||!/\d/.test(s)||/%\s*$/.test(s))return null;const neg=/^-|-$|^\(.*\)$/.test(s);const v=+s.replace(/[^\d,]/g,'').replace(',','.');return isFinite(v)?Math.round(neg?-v:v):null};
function cleanName(raw){const s=String(raw||'').replace(LEGAL_RE,' ').replace(/\s{2,}/g,' ').trim().replace(/[,.\-–]+$/,'').trim();if(!s)return String(raw||'').trim();const caps=s===s.toUpperCase();return caps?s.split(' ').map(w=>/\d/.test(w)||(w.length<=3&&!['THE','AND','OG','FOR','AF'].includes(w))?w:w.charAt(0)+w.slice(1).toLowerCase()).join(' '):s}
function matchCompany(raw){const rk=coKey(raw);if(!rk)return null;const ds=S.deals;let d=ds.find(x=>coKey(x.legalName)===rk||coKey(x.company)===rk);if(d)return d.company;const st=S.studio.find(x=>coKey(x.company)===rk);if(st)return st.company;
 d=ds.find(x=>{const l=coKey(x.legalName);return l.length>=6&&(l.startsWith(rk)||rk.startsWith(l))});if(d)return d.company;
 const rt=coTokens(raw);if(!rt.length)return null;const names=[...new Set([...ds.map(x=>x.company),...S.studio.map(x=>x.company)])];
 for(const n of names){const nt=coTokens(n);if(!nt.length)continue;const [a,b]=rt.length<=nt.length?[rt,nt]:[nt,rt];if(a.every(w=>b.includes(w)))return n}return null}
const NOTES_ROW=/^\s*(\d{9})(?=\s|$)/;
function orderDate(no,ymk){const y='20'+no.slice(0,2),a=+no.slice(2,4),b=+no.slice(4,6),gm=ymk?+ymk.slice(5,7):0,gy=ymk?ymk.slice(0,4):y;
 if(gm){if(a===gm&&b>=1&&b<=31)return `${gy}-${pad(a)}-${pad(b)}`;if(b===gm&&a>=1&&a<=31)return `${gy}-${pad(b)}-${pad(a)}`;return `${gy}-${pad(gm)}-01`}
 return a>=1&&a<=12&&b>=1&&b<=31?`${y}-${pad(a)}-${pad(b)}`:null}
function parseNotes(lines){let ymk=null;const out=[];
 for(const raw of lines){const l=raw.replace(/ /g,' ');if(!NOTES_ROW.test(l)){const g=/(?:^|\s)(20\d{2})\s*-\s*(\d{1,2})(?!\d)/.exec(l);if(g)ymk=g[1]+'-'+pad(+g[2]);continue}
  const cells=l.includes('\t')?l.split('\t').map(c=>c.trim()):l.trim().split(/\s{2,}/).map(c=>c.trim());const i=cells.findIndex(c=>/^\d{9}$/.test(c));if(i<0)continue;
  const no=cells[i],legal=cells[i+1]||'',title=cells[i+2]||'';const rest=cells.slice(i+3);while(rest.length&&(/%\s*$/.test(rest[rest.length-1])||rest[rest.length-1]===''))rest.pop();
  let rev=null,db=null;if(rest.length>=2){rev=parseDK(rest[0]);db=parseDK(rest[1])}else if(rest.length===1){const v=parseDK(rest[0]);if(v!=null&&v<0)db=v;else rev=v}
  out.push({orderNo:no,legal,title,revenue:rev,value:db,date:orderDate(no,ymk)})}
 return out}
function parseImport(txt){const lines=String(txt||'').split(/\r?\n/).filter(l=>l.trim());if(!lines.length)return {mode:'',rows:[]};
 const nr=lines.filter(l=>NOTES_ROW.test(l)).length;if(nr&&nr>=Math.ceil(lines.length*.4))return {mode:'notes',rows:parseNotes(lines)};
 const sep=lines[0].includes('\t')?'\t':lines[0].includes(';')?';':',';const cells=l=>l.split(sep).map(c=>c.trim().replace(/^"(.*)"$/,'$1'));
 let head=cells(lines[0]).map(h=>HMAP[h.toLowerCase()]||null),start=1;if(!head.includes('company')){head=['company','contact','email','phone'];start=0}
 return {mode:'table',rows:lines.slice(start).map(l=>{const c=cells(l),o={};head.forEach((k,i)=>{if(k&&c[i])o[k]=c[i]});if(!o.company)return null;
  if(o.value!=null)o.value=parseDK(o.value);if(o.revenue!=null)o.revenue=parseDK(o.revenue);
  if(o.type){const t=o.type.toLowerCase();o.type=t.includes('studio')?'studio':(t.includes('ad')||t.includes('hoc'))?'adhoc':''}
  if(o.stage){const s=o.stage.toLowerCase();o.stage=(STAGES.find(x=>x.n.toLowerCase()===s||x.k===s)||{}).k||'lead'}
  if(o.segment)o.segment=SEGS.find(x=>x.toLowerCase()===o.segment.toLowerCase())||'';return o}).filter(Boolean)}}
function resolveRow(r,mode){const ex=r.orderNo?S.deals.find(d=>d.orderNo===r.orderNo):null;if(ex)return {kind:'upd',ex,company:ex.company};
 if(mode!=='notes')return {kind:'new',company:r.company};
 const company=matchCompany(r.legal)||cleanName(r.legal),isStudio=/metz\s*studio/i.test(r.title||'');
 if(isStudio){const sd=S.deals.find(d=>d.type==='studio'&&!d.orderNo&&coKey(d.company)===coKey(company));if(sd)return {kind:'link',ex:sd,company}}
 return {kind:'new',company,isStudio}}
function openImport(mode){U.imp=null;modal(`<div class="mh"><div><h2>${mode==='notes'?'Indsæt ordreliste fra Notes':'Importér'}</h2><p class="muted">Kopiér ordrelisten fra Notes – eller rækker fra Excel med overskrifter – og indsæt dem herunder. Kendte ordrenumre bliver opdateret, nye bliver oprettet.</p></div><button class="ib" data-close aria-label="Luk">${ic('x')}</button></div><div class="mb"><textarea class="in" id="impText" rows="8" placeholder="2026 - 11&#10;261119141&#9;Dinex A/S&#9;Rollerball - 100stk&#9;110.000&#9;44.000&#9;40,00%&#10;261120141&#9;BCG NORDIC&#9;End of year merchandise&#9;&#9;&#9;0,00%"></textarea><p class="muted sm-p">Notes-format genkendes automatisk: ordrenr., kunde, beskrivelse, omsætning, DB. Månedslinjer som “2026 - 11” bruges som dato. Excel-kolonner der genkendes: Virksomhed, Sag, Kontakt, E-mail, Type, Fase, Omsætning, DB, Ordrenr., Kilde, Note.</p><div id="impPrev"></div></div><div class="mf"><button class="btn" data-close>Annuller</button><button class="btn pri" data-act="doImport" id="impBtn" disabled>Importér</button></div>`,'wide');setTimeout(()=>{const a=$('#impText');a&&a.focus()},60)}
function impPreview(){const P=parseImport($('#impText').value);U.imp=P;const b=$('#impBtn'),rows=P.rows;const R=rows.map(r=>resolveRow(r,P.mode)),nNew=R.filter(x=>x.kind==='new').length,nUpd=R.length-nNew;
 b.disabled=!rows.length;b.textContent=rows.length?(P.mode==='notes'?`Gem ${rows.length} ordrer`:`Importér ${rows.length}`):'Importér';
 $('#impPrev').innerHTML=rows.length?`<div class="imp-ok">${ic('check',16,2.4)}${P.mode==='notes'?'Notes-ordreliste genkendt':'Tabel genkendt'} · ${nNew} nye · ${nUpd} opdateres</div><div style="overflow-x:auto;max-height:280px"><table class="imp-t"><thead><tr>${P.mode==='notes'?'<th>Ordrenr.</th>':''}<th>Kunde</th><th>${P.mode==='notes'?'Ordre':'Kontakt'}</th><th class="num">Omsætning</th><th class="num">DB</th><th></th></tr></thead><tbody>${rows.slice(0,60).map((r,i)=>`<tr>${P.mode==='notes'?`<td>${esc(r.orderNo)}</td>`:''}<td class="wr2"><b>${esc(R[i].company||r.company||'')}</b>${P.mode==='notes'&&r.legal&&coKey(r.legal)!==coKey(R[i].company)?`<br><small class="muted">${esc(r.legal)}</small>`:''}</td><td class="wr">${esc(P.mode==='notes'?r.title:(r.contact||'—'))}</td><td class="num">${kr(r.revenue)}</td><td class="num">${kr(r.value)}</td><td>${R[i].kind==='new'?'<span class="bd em">Ny</span>':'<span class="bd ok">Opdateres</span>'}</td></tr>`).join('')}</tbody></table></div>${rows.length>60?`<p class="muted sm-p">+ ${rows.length-60} flere</p>`:''}`:''}
async function doImport(){const P=U.imp;if(!P||!P.rows.length)return;const b=$('#impBtn');b.disabled=true;let i=0,nNew=0,nUpd=0;const cm=today().slice(0,7);
 for(const r of P.rows){i++;b.textContent=`Gemmer ${i}/${P.rows.length}…`;const R=resolveRow(r,P.mode);
  if(R.kind!=='new'){const d=R.ex,has=r.revenue!=null||r.value!=null,n={...d,orderNo:d.orderNo||r.orderNo||'',legalName:d.legalName||r.legal||'',stage:'vundet',wonDate:d.wonDate||r.date||today()};
   if(has){n.revenue=r.revenue;n.value=r.value;n.est=false}if(!d.title&&r.title)n.title=r.title;
   if(['orderNo','legalName','stage','wonDate','revenue','value','est','title'].some(k=>(d[k]??null)!==(n[k]??null))){n.log=[...d.log,{at:nowIso(),t:has?`Opdateret fra Notes: ${kr(r.revenue)} · DB ${kr(r.value)}`:'Koblet til ordre '+r.orderNo}];await put('deals',n);nUpd++}}
  else if(P.mode==='notes'){const has=r.revenue!=null||r.value!=null,date=r.date||today();await put('deals',{id:'o'+r.orderNo,createdAt:date+'T09:00:00.000Z',company:R.company,legalName:r.legal||'',title:r.title||'',orderNo:r.orderNo,revenue:r.revenue,value:r.value,type:R.isStudio?'studio':'adhoc',stage:'vundet',wonDate:date,orderStatus:date.slice(0,7)<cm&&has?'faktureret':'bekraeftet',owner:S.cfg.me,log:[{at:nowIso(),t:'Importeret fra Notes'}]},{create:true});nNew++}
  else{const n={stage:'lead',type:'',...r,id:uid('d'),owner:S.cfg.me,log:[{at:nowIso(),t:'Importeret'}]};if(n.stage==='vundet')n.wonDate=today();await put('deals',n,{create:true});nNew++}
  await new Promise(z=>setTimeout(z,50))}
 closeModal();toast(`${nNew} nye · ${nUpd} opdateret`);go(P.mode==='notes'?'ordrer':'pipeline')}
const csvOf=rows=>'﻿'+rows.map(r=>r.map(c=>'"'+String(c??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
async function saveFile(name,data,fallbackMsg){if(dl){try{await dl.save({filename:name,data});toast('Filen er klar');return}catch(e){if(e&&e.code==='declined')return}}copyOrShow(data.replace(/^﻿/,''),fallbackMsg,'Kopiér data')}
function exportWhat(w){const t=today();
 if(w==='orders'){const r=[['Måned','Ordrenr.','Kunde','Navn i Notes','Ordre','Status','Omsætning','DB','DG %','Estimat','Deadline','Studio-kunde','Note']].concat(orders().slice().sort((a,b)=>(b.wonDate||'').localeCompare(a.wonDate||'')||(a.orderNo||'').localeCompare(b.orderNo||'')).map(o=>{const g=dgOf(o.revenue,o.value);return [ymOf(o),o.orderNo,o.company,o.legalName,o.title,OM[o.orderStatus].n,o.revenue??'',o.value??'',isN(g)?(g*100).toFixed(1).replace('.',','):'',o.est?'Ja':'',o.deadline||'',studioFor(o.company)?'Ja':'Nej',o.note]}));return saveFile(`metz-ordrer-${t}.csv`,csvOf(r),'Ordrer kopieret som CSV – indsæt i Excel')}
 if(w==='studio'){const r=[['Kunde','Status','Fremdrift','Nuværende trin','Mangler fra kunden','Go-live','Setup-pris','Shopomsætning','Kontakt','Ansvarlig']].concat(S.studio.map(s=>{const pr=sProgress(s),cur=s.steps[pr.cur];return [s.company,SSM[s.status].n,`${pr.k}/${pr.n}`,cur?cur.t:'Alle klaret',s.info.filter(x=>!x.d).map(x=>x.t).join(', '),s.goLive||'',s.setupFee??'',s.shopRevenue??'',s.contact,s.owner]}));return saveFile(`metz-studio-${t}.csv`,csvOf(r),'Studio-kunder kopieret som CSV')}
 if(w==='customers'){const r=[['Virksomhed','Relation','Kontakt','Navne i Notes','Omsætning','DB','DG %','Ad hoc-ordrer','Åbne sager','Åben pipeline','Ansvarlig']].concat(accounts().map(a=>[a.name,[a.hasS&&'Studio',a.hasA&&'Ad hoc'].filter(Boolean).join(' + ')||(a.rel==='prospect'?'Prospekt':a.rel==='lost'?'Tabt':'Kunde'),a.contact,a.legal.join(', '),a.wonRev,a.wonDb,isN(a.dg)?(a.dg*100).toFixed(1).replace('.',','):'',a.orders,a.open.length,a.openDb,a.owner]));return saveFile(`metz-kunder-${t}.csv`,csvOf(r),'Kunder kopieret som CSV')}
 const rows=U.view==='pipeline'?pRows():S.deals;const r=[['Virksomhed','Sag','Ordrenr.','Kontakt','E-mail','Telefon','Type','Fase','Omsætning','DB','Estimat','Ansvarlig','Kilde','Segment','Næste skridt','Dato','Score','Note']].concat(rows.map(d=>[d.company,d.title,d.orderNo,d.contact,d.email,d.phone,TYPES[d.type].n,ST[d.stage].n,d.revenue??'',d.value??'',d.est?'Ja':'',d.owner,d.source,d.segment,d.nextStep,d.nextDate||'',score(d),d.note]));return saveFile(`metz-pipeline-${t}.csv`,csvOf(r),'Pipeline kopieret som CSV – indsæt i Excel')}
function backup(){const data=JSON.stringify({exported:nowIso(),deals:S.deals,studio:S.studio,projects:S.projects,ideas:S.ideas,cfg:S.cfg,tpl:S.tpl},null,2);if(dl){dl.save({filename:`metz-cockpit-backup-${today()}.json`,data}).then(()=>toast('Backup er klar')).catch(e=>{if(!e||e.code!=='declined')copyOrShow(data,'Backup kopieret','Backup')})}else copyOrShow(data,'Backup kopieret til udklipsholderen','Backup')}

/* ============ Navigation ============ */
function parseHash(){const h=decodeURIComponent(location.hash.slice(1));const m=/^studio-(.+)$/.exec(h);if(m)return ['studio',m[1]];return [VIEWS[h]?h:'dashboard',null]}
function setView(v,p){const changed=v!==U.view||p!==U.param;U.view=v;U.param=p;if(changed){U.sel.clear();U.bulkDel=false;closePop();window.scrollTo(0,0)}closeSide();paint();renderChrome()}
function go(v,p=null){setView(v,p);const h=p?v+'-'+p:v;if(location.hash!=='#'+h){try{location.hash=h}catch(e){}}}
function openRef(ref){closePop();const ix=ref.indexOf(':'),k=ref.slice(0,ix),id=ref.slice(ix+1);
 if(k==='deal')openDeal(id);else if(k==='studio'){closeDrawer();go('studio',id)}else if(k==='acct')openAcct(id);else if(k==='proj')openProj(id);else if(k==='idea'){const i=S.ideas.find(x=>x.id===id);if(i){U.id.edit={...i};closeDrawer();go('ideer');paint();window.scrollTo({top:0,behavior:'smooth'})}}}
function toggleSide(){const s=$('#side');const o=!s.classList.contains('open');s.classList.toggle('open',o);$('#scrim').classList.toggle('open',o)}
function closeSide(){$('#side').classList.remove('open');$('#scrim').classList.remove('open')}

/* ============ Handlinger ============ */
function act(name,el,e){
 switch(name){
 case 'menu':e&&e.preventDefault();toggleSide();break;
 case 'palette':openPalette();break;
 case 'bell':openBell(el);break;
 case 'newDeal':{const pre={};if(el&&el.dataset.new&&el.dataset.stage)pre.stage=el.dataset.stage;if(U.view==='pipeline'&&U.p.type!=='all')pre.type=U.p.type==='none'?'':U.p.type;openDeal(null,pre);break}
 case 'newOrder':openDeal(null,{type:'adhoc',stage:'vundet'});break;
 case 'newOrderFor':openDeal(null,{type:'adhoc',stage:'vundet',company:el.dataset.company||'',contact:el.dataset.contact||''});break;
 case 'newDealFor':openDeal(null,{company:el.dataset.company||'',contact:el.dataset.contact||''});break;
 case 'newStudio':newStudioModal();break;
 case 'mkStudioFor':closeDrawer();newStudioModal({company:el.dataset.company,contact:el.dataset.contact});break;
 case 'mkStudioFromDeal':{const d=curDeal();if(d)ensureStudio(d);break}
 case 'newIdea':U.id.edit=null;go('ideer');setTimeout(()=>{const t=$('#if-title');t&&t.focus()},60);break;
 case 'closeDrawer':closeDrawer();break;
 case 'createDeal':createDeal();break;
 case 'favDeal':{const d=curDeal();if(d)put('deals',{...d,fav:!d.fav});break}
 case 'delDeal':{const d=curDeal();if(!d)break;if(!U.drawer.arm){U.drawer.arm=true;paintDrawer(true);break}closeDrawer();del('deals',d);toast(`${d.company} slettet`,()=>put('deals',d),'Fortryd');break}
 case 'addNote':{const kind=el.dataset.kind;const inp=kind==='deal'?$('#dnote'):$('#snote');const txt=inp&&inp.value.trim();if(!txt)break;inp.value='';if(kind==='deal'){const d=curDeal();if(d)put('deals',{...d,log:[...d.log,{at:nowIso(),t:txt,k:'note'}]})}else{const s=studioById(el.dataset.id);if(s)put('studio',{...s,log:[...s.log,{at:nowIso(),t:txt,k:'note'}]})}if(kind==='deal')setTimeout(()=>{paintDrawer(true);const i=$('#dnote');i&&i.focus()},0);break}
 case 'addInfo':{const s=studioById(el.dataset.id),inp=$('#infoNew'),txt=inp&&inp.value.trim();if(!s||!txt)break;inp.value='';put('studio',{...s,info:[...s.info,{t:txt,d:false}]});setTimeout(()=>{const i=$('#infoNew');i&&i.focus()},30);break}
 case 'cview':{const s=studioById(el.dataset.id);if(s)custView(s);break}
 case 'cmail':{const s=studioById(el.dataset.id);if(s){copyOrShow(statusMail(s),'Statusmail kopieret – indsæt den i Outlook','Statusmail til '+s.company);put('studio',{...s,log:[...s.log,{at:nowIso(),t:'Statusmail kopieret'}]})}break}
 case 'studioMenu':studioMenu(el);break;
 case 'editTarget':U.editTarget=!U.editTarget;paint();if(U.editTarget)setTimeout(()=>{const i=$('#tgv');i&&i.focus()},20);break;
 case 'saveTarget':{const rd=id=>{const e=$(id),t=e?String(e.value).trim():'';return t===''?null:Math.round(+t)},v=rd('#tgv'),r=rd('#tgr');if((v!=null&&!(v>0))||(r!=null&&!(r>0))){toast('Skriv beløb større end 0',null,'','err');break}if(v==null&&r==null){toast('Skriv mindst ét mål',null,'','err');break}S.cfg.target=v;S.cfg.targetRev=r;U.editTarget=false;document.activeElement&&document.activeElement.blur();saveCfg();toast('Årsmål gemt');paint();break}
 case 'filter':openFilter(el);break;
 case 'sortMenu':openSort(el);break;
 case 'viewMenu':openViewMenu(el);break;
 case 'import':openImport(el&&el.dataset.mode);break;
 case 'grpAll':{const c=U.o.closed;if(c.size)c.clear();else orders().forEach(o=>c.add(ymOf(o)||'—'));paint();break}
 case 'doImport':doImport();break;
 case 'export':exportWhat(el.dataset.what);break;
 case 'backup':backup();break;
 case 'newProj':openProj(null);break;
 case 'addTask':{const inp=$('#pjn'),txt=inp&&inp.value.trim();if(!txt||!U.pjEdit)break;U.pjEdit.tasks.push({t:txt,d:false});inp.value='';$('#pjt').innerHTML=pjTasks();inp.focus();break}
 case 'delProj':{const P=U.pjEdit;if(!P||!P.id)break;if(!P.arm){P.arm=true;el.innerHTML=`${ic('trash',16)}Klik igen for at slette`;break}const p=S.projects.find(x=>x.id===P.id);closeModal();if(p){del('projects',p);toast(`${p.title} slettet`,()=>put('projects',p),'Fortryd')}break}
 case 'delIdea':{const i=U.id.edit;if(!i)break;if(!el.dataset.arm){el.dataset.arm='1';el.innerHTML=`${ic('trash',15)}Klik igen`;break}U.id.edit=null;del('ideas',i);toast(`${i.title} slettet`,()=>put('ideas',i),'Fortryd');break}
 case 'cancelIdea':U.id.edit=null;paint();break;
 case 'logout':{if(window.metzAuth)window.metzAuth.signOut();break}
 case 'addMember':{const A=window.metzAuth;if(!A)break;const n=($('#memName')||{}).value||'',e=(($('#memEmail')||{}).value||'').trim().toLowerCase(),r=($('#memRole')||{}).value;if(!n.trim()||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)){toast('Skriv navn og en gyldig e-mail',null,'','err');break}A.addMember({name:n,email:e,role:r}).then(()=>{toast(n.trim()+' kan nu logge ind');paint()}).catch(err=>toast('Kunne ikke tilføje: '+((err&&err.message)||'fejl'),null,'','err'));break}
 case 'addTeam':{const inp=$('#teamNew'),v=inp&&inp.value.trim();if(!v)break;if(!S.cfg.team.includes(v))S.cfg.team=[...S.cfg.team,v];inp.value='';saveCfg();toast(v+' tilføjet til teamet');break}
 case 'tplSave':{const st=($('#tpl-steps')||{}).value,inf=($('#tpl-info')||{}).value;const steps=String(st||'').split('\n').map(x=>x.trim()).filter(Boolean),info=String(inf||'').split('\n').map(x=>x.trim()).filter(Boolean);if(!steps.length){toast('Skabelonen skal have mindst ét trin',null,'','err');break}S.tpl={steps,info};U.tplDraft=null;document.activeElement&&document.activeElement.blur();saveTpl();toast('Skabelon gemt – bruges til nye Studio-kunder');break}
 case 'tplReset':U.tplDraft={steps:DEF_STEPS.join('\n'),info:DEF_INFO.join('\n')};paint();toast('Standard indsat – tryk Gem skabelon for at bruge den');break;
 }}

/* ============ Events ============ */
document.addEventListener('click',e=>{const t=e.target;if(!(t instanceof Element))return;
 const pop=$('#pop');if(!pop.hidden&&!pop.contains(t)&&!t.closest('[data-pa-open]'))closePop();
 const A=s=>t.closest(s);let el;
 if(t.closest('#pal')){if(t===$('#pal')){$('#pal').close();return}if(el=A('[data-pal]'))palGo(+el.dataset.pal);return}
 if(t===$('#dlg')){closeModal();return}
 if(el=A('[data-close]')){e.preventDefault();closeModal();return}
 if(el=A('[data-pick]')){const d=$('#dlg');d._pick&&d._pick(el.dataset.pick);return}
 if(el=A('[data-sel]')){e.stopPropagation();const id=el.dataset.sel;if(el.checked)U.sel.add(id);else U.sel.delete(id);U.bulkDel=false;schedule();return}
 if(el=A('[data-selall]')){const rows=pRows();if(el.checked)rows.forEach(d=>U.sel.add(d.id));else rows.forEach(d=>U.sel.delete(d.id));schedule();return}
 if(el=A('[data-rowmenu]')){e.preventDefault();rowMenu(el);return}
 if(el=A('[data-oadv]')){advOrder(el.dataset.oadv);return}
 if(el=A('[data-pa]')){popAction(el);return}
 if(el=A('[data-bulk]')){bulk(el.dataset.bulk,el);return}
 if(el=A('[data-go]')){e.preventDefault();if(el.closest('#drawer'))closeDrawer();go(el.dataset.go);return}
 if(el=A('[data-ptype]')){e.preventDefault();U.p.type=el.dataset.ptype;U.sel.clear();if(U.view!=='pipeline'){U.p.tab='open';go('pipeline')}else schedule();closeSide();return}
 if(el=A('[data-sec]')){const k=el.dataset.sec;U.closed=U.closed.includes(k)?U.closed.filter(x=>x!==k):[...U.closed,k];setPref('closed',U.closed);renderSide();return}
 if(el=A('[data-tab]')){const [sc,k]=el.dataset.tab.split(':');U[sc].tab=k;U.sel.clear();schedule();return}
 if(el=A('[data-itab]')){U.id.tab=el.dataset.itab;paint();return}
 if(el=A('[data-grp]')){const k=el.dataset.grp,c=U.o.closed;if(c.has(k))c.delete(k);else c.add(k);paint();return}
 if(el=A('[data-chart]')){U.chart=el.dataset.chart;setPref('chart',U.chart);paint();return}
 if(el=A('[data-sort]')){const k=el.dataset.sort;U.p.sort=U.p.sort.k===k?{k,d:-U.p.sort.d}:{k,d:['value','score','updated'].includes(k)?-1:1};schedule();return}
 if(el=A('[data-pmode]')){U.p.mode=el.dataset.pmode;setPref('pmode',U.p.mode);U.sel.clear();schedule();return}
 if(el=A('[data-unf]')){const k=el.dataset.unf;if(k==='all')U.p.f={seg:'',owner:'',src:''};else U.p.f[k]='';schedule();return}
 if(el=A('[data-funnel]')){U.p.tab=el.dataset.funnel==='vundet'?'won':'open';U.p.type='all';go('pipeline');return}
 if(el=A('[data-stage]')){if(el.dataset.new)return act('newDeal',el,e);const d=curDeal();if(d)setStage(d,el.dataset.stage);return}
 if(el=A('[data-dtype]')){setDealType(el.dataset.dtype);return}
 if(el=A('[data-ostatus]')){const d=curDeal();if(d)setOrderStatus(d,el.dataset.ostatus);return}
 if(el=A('[data-step]')){toggleStep(el.dataset.step);return}
 if(el=A('[data-info-del]')){delInfo(el.dataset.infoDel);return}
 if(el=A('[data-info]')){toggleInfo(el.dataset.info);return}
 if(el=A('[data-sstatus]')){setStudioStatus(el.dataset.sstatus);return}
 if(el=A('[data-mk]')){e.stopPropagation();const i=S.ideas.find(x=>x.id===el.dataset.mk);if(i)makeProject(i);return}
 if(el=A('[data-ptask]')){const i=+el.dataset.ptask;if(U.pjEdit&&U.pjEdit.tasks[i]){U.pjEdit.tasks[i].d=!U.pjEdit.tasks[i].d;$('#pjt').innerHTML=pjTasks()}return}
 if(el=A('[data-ptask-del]')){const i=+el.dataset.ptaskDel;if(U.pjEdit){U.pjEdit.tasks.splice(i,1);$('#pjt').innerHTML=pjTasks()}return}
 if(el=A('[data-mem-del]')){const A2=window.metzAuth,em=el.dataset.memDel;if(A2&&confirmDel!==em){confirmDel=em;toast('Tryk igen for at fjerne adgangen');setTimeout(()=>{confirmDel=null},3000);return}confirmDel=null;A2&&A2.removeMember(em).then(()=>{toast('Adgang fjernet');paint()}).catch(err=>toast('Kunne ikke fjerne: '+((err&&err.message)||'fejl'),null,'','err'));return}
 if(el=A('[data-team-del]')){const n=el.dataset.teamDel;S.cfg.team=S.cfg.team.filter(x=>x!==n);saveCfg();return}
 if(el=A('[data-copy]')){copyOrShow(el.dataset.copy,'Kopieret','Kopiér');return}
 if(el=A('[data-act]')){act(el.dataset.act,el,e);return}
 if(el=A('[data-open]')){openRef(el.dataset.open);return}
 if(t.closest('#scrim')){closeSide();return}
 if(t.closest('#dscrim')){closeDrawer();return}
});
document.addEventListener('change',e=>{const t=e.target;
 if(t.matches('#drawer [data-f]')){dealField(t);return}
 if(t.matches('[data-sf]')){studioField(t);return}
 if(t.matches('[data-cfg]')){const k=t.dataset.cfg;let v=t.value;if(k==='me'){v=String(v).trim();if(!v){t.value=S.cfg.me;return}const old=S.cfg.me;S.cfg.team=S.cfg.team.map(x=>x===old?v:x)}else{v=String(v).trim()===''?null:+v;if(v!=null&&!isFinite(v))return}S.cfg[k]=v;saveCfg();toast('Gemt');return}
 if(t.matches('[data-pf]')){U.p.f[t.dataset.pf]=t.value;schedule();return}
 if(t.matches('[data-col]')){const k=t.dataset.col;U.cols=t.checked?ALLCOLS.filter(c=>c===k||U.cols.includes(c)):U.cols.filter(c=>c!==k);setPref('cols',U.cols);schedule();return}
 if(t.id==='isort'){U.id.sort=t.value;paint();return}
 if(t.matches('[data-mxall]')){U.mx.all=t.checked;paint();return}
});
document.addEventListener('input',e=>{const t=e.target;
 if(t.matches('[data-live][data-q]')){U[t.dataset.q].q=t.value;clearTimeout(qt);qt=setTimeout(()=>{paint();renderChrome()},110);return}
 if(t.matches('#drawer [data-f]')&&U.drawer&&!U.drawer.id){U.drawer.draft[t.dataset.f]=fieldVal(t);return}
 if(t.form&&t.form.id==='ifm'&&!U.id.edit){U.id.draft=Object.fromEntries(new FormData(t.form));return}
 if(t.matches('[data-tpl]')){U.tplDraft=U.tplDraft||{};U.tplDraft[t.dataset.tpl]=t.value;return}
 if(t.id==='palq'){U.palIdx=0;palSearch();return}
 if(t.id==='impText'){impPreview();return}
});
document.addEventListener('submit',e=>{const f=e.target;
 if(f.id==='ifm'){e.preventDefault();const fd=new FormData(f),g=k=>String(fd.get(k)||'').trim();if(!g('title')){toast('Giv idéen en titel',null,'','err');return}
  const base=U.id.edit||{id:uid('i'),createdAt:nowIso(),status:'ny'};const n={...base,title:g('title'),problem:g('problem'),solution:g('solution'),gainer:g('gainer'),category:g('category'),impact:cl5(g('impact')),effort:cl5(g('effort'))};if(U.id.edit)n.status=g('status')||base.status;
  const was=!!U.id.edit;U.id.edit=null;U.id.draft={};document.activeElement&&document.activeElement.blur();put('ideas',n,{create:!was});paint();toast(was?'Idé gemt':'Idé gemt – godt tænkt');return}
 if(f.id==='fpj'){e.preventDefault();const fd=new FormData(f),g=k=>String(fd.get(k)||'').trim();if(!g('title'))return;const P=U.pjEdit,pend=($('#pjn')||{}).value;if(pend&&pend.trim())P.tasks.push({t:pend.trim(),d:false});
  const old=P.id?S.projects.find(x=>x.id===P.id):null;const n={...(old||{}),id:P.id||uid('p'),title:g('title'),owner:g('owner'),status:g('status'),priority:g('priority'),deadline:g('deadline')||null,goal:g('goal'),description:g('description'),tasks:P.tasks.map(x=>({t:x.t,d:!!x.d}))};
  closeModal();put('projects',n,{create:!P.id});toast(P.id?'Projekt gemt':'Projekt oprettet');return}
 if(f.id==='fns'){e.preventDefault();const fd=new FormData(f),g=k=>String(fd.get(k)||'').trim();const company=g('company');if(!company)return;const ex=studioFor(company);closeModal();if(ex){toast(`${company} er allerede Studio-kunde`);go('studio',ex.id);return}
  const s={id:uid('s'),company,contact:g('contact'),email:g('email'),owner:S.cfg.me,status:'onboarding',steps:tplSteps(),info:tplInfo(),goLive:g('goLive')||null,startDate:g('startDate')||today(),setupFee:null,shopRevenue:null,note:'',dealId:null,log:[{at:nowIso(),t:'Studio-kunde oprettet'}]};
  put('studio',s,{create:true});go('studio',s.id);toast(`${company} er oprettet som Studio-kunde`);return}
});
document.addEventListener('keydown',e=>{const t=e.target,typing=t.matches&&t.matches('input,textarea,select,[contenteditable]');
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();const p=$('#pal');if(p.open)p.close();else openPalette();return}
 if(t.id==='palq'){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const n=U.palList.length;if(!n)return;U.palIdx=(U.palIdx+(e.key==='ArrowDown'?1:-1)+n)%n;palSearch()}else if(e.key==='Enter'){e.preventDefault();palGo(U.palIdx)}return}
 if(e.key==='Enter'&&t.matches&&t.matches('[data-enter]')){e.preventDefault();act(t.dataset.enter,t,e);return}
 if(e.key==='Enter'&&t.matches&&t.matches('#drawer input[data-f]')){e.preventDefault();if(U.drawer&&!U.drawer.id)createDeal();else t.blur();return}
 if(e.key==='Escape'){if(!$('#pop').hidden){closePop();return}if($('#dlg').open||$('#pal').open)return;if(U.drawer){closeDrawer();return}if(U.sel.size){U.sel.clear();schedule();return}closeSide();return}
 if(typing)return;
 if(e.key==='Enter'&&t.matches&&t.matches('[data-open]')){e.preventDefault();openRef(t.dataset.open);return}
 if(e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.key==='/'){e.preventDefault();const s=$('#main [data-live]');if(s)s.focus();else openPalette();return}
 if(e.key==='n'||e.key==='N'){e.preventDefault();openDeal(null);return}
});
document.addEventListener('focusout',()=>setTimeout(()=>{if(U.pending||U.dpending)repaint()},0));
document.addEventListener('dragstart',e=>{const c=e.target.closest&&e.target.closest('[data-drag]');if(!c)return;U.dragId=c.dataset.drag;c.classList.add('drag');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',U.dragId)}catch(_){}});
document.addEventListener('dragover',e=>{const col=e.target.closest&&e.target.closest('[data-stage-col]');if(!col||!U.dragId)return;e.preventDefault();$$('.bcol.over').forEach(x=>{if(x!==col)x.classList.remove('over')});col.classList.add('over')});
document.addEventListener('drop',e=>{const col=e.target.closest&&e.target.closest('[data-stage-col]');if(!col||!U.dragId)return;e.preventDefault();const d=S.deals.find(x=>x.id===U.dragId);U.dragId=null;$$('.bcol.over').forEach(x=>x.classList.remove('over'));if(d)setStage(d,col.dataset.stageCol)});
document.addEventListener('dragend',()=>{U.dragId=null;$$('.bcol.over,.bcard.drag').forEach(x=>x.classList.remove('over','drag'))});
addEventListener('hashchange',()=>{const [v,p]=parseHash();if(v!==U.view||p!==U.param)setView(v,p)});
addEventListener('resize',closePop);
document.addEventListener('scroll',e=>{const p=$('#pop');if(!p.hidden&&!(e.target instanceof Node&&p.contains(e.target)))closePop()},true);
$('#dlg').addEventListener('close',()=>{U.pjEdit=null});

/* ============ Start ============ */
{const [v,p]=parseHash();U.view=v;U.param=p}
renderChrome();paint();
const lt=setTimeout(()=>{if(!S.loaded){S.loaded=true;schedule()}},10000);
const use=n=>{try{return window.claude&&typeof window.claude.use==='function'?Promise.resolve(window.claude.use(n)):Promise.resolve(null)}catch(e){return Promise.resolve(null)}};
use('db').then(d=>{if(!d){S.loaded=true;clearTimeout(lt);schedule();return}db=d;S.live=true;const got=new Set(),ready=k=>{got.add(k);if(got.size>=4&&!S.loaded){S.loaded=true;clearTimeout(lt)}};
 ['deals','studio','projects','ideas'].forEach(c=>{try{db.collection(c).onSnapshot(s=>{applySnap(c,s);ready(c);schedule()},()=>{ready(c);S.live=false;schedule()})}catch(e){ready(c)}});
 try{db.doc('config/main').onSnapshot(s=>{if(s.exists){S.cfg={...S.cfg,...(s.data()||{})};normCfg()}schedule()},()=>{})}catch(e){}
 try{db.doc('config/studio').onSnapshot(s=>{if(s.exists){const v=s.data()||{};if(Array.isArray(v.steps)&&v.steps.length)S.tpl.steps=v.steps.map(String);if(Array.isArray(v.info))S.tpl.info=v.info.map(String)}schedule()},()=>{})}catch(e){}
}).catch(()=>{S.loaded=true;clearTimeout(lt);schedule()});
use('downloads').then(x=>{dl=x||null}).catch(()=>{});
}
