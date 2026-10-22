'use strict';
/* جرد البوفيه — standalone local-first PWA. Does not fetch/mutate old buffet data. */
const VERSION='1.4.1';
const SEED_STATE={"schema":1,"categories":[{"id":"cat-seed-1","name":"بسكوت و كيك"},{"id":"cat-seed-2","name":"شاي و قهوة"},{"id":"cat-seed-3","name":"شيبسي و فشار"},{"id":"cat-seed-4","name":"كانز و عصير"},{"id":"cat-seed-5","name":"مأكولات"}],"products":[{"id":"product-seed-1-1","name":"اوريو صغير","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-1","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-2","name":"اوريو كبير","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-2","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-3","name":"اولكر شاي صغير","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-3","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-4","name":"اولكر شاي كبير","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-4","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-5","name":"اولكر عجوة","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-5","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-6","name":"بسكريم","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-6","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-7","name":"بسكوت شوفان","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-7","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-8","name":"بسكوت هالي","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-8","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-9","name":"توينكز صغير","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-9","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-10","name":"توينكز كبير","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-10","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-11","name":"فرسكا","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-11","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-12","name":"مولتو","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-12","unit":"","price":""}],"deleted":false},{"id":"product-seed-1-13","name":"هوهوز كينج","categoryId":"cat-seed-1","variants":[{"id":"variant-seed-1-13","unit":"","price":""}],"deleted":false},{"id":"product-seed-2-1","name":"اعشااب","categoryId":"cat-seed-2","variants":[{"id":"variant-seed-2-1","unit":"","price":""}],"deleted":false},{"id":"product-seed-2-2","name":"شاي","categoryId":"cat-seed-2","variants":[{"id":"variant-seed-2-2","unit":"","price":""}],"deleted":false},{"id":"product-seed-2-3","name":"قهوة","categoryId":"cat-seed-2","variants":[{"id":"variant-seed-2-3","unit":"","price":""}],"deleted":false},{"id":"product-seed-2-4","name":"كوفي ميكس","categoryId":"cat-seed-2","variants":[{"id":"variant-seed-2-4","unit":"","price":""}],"deleted":false},{"id":"product-seed-2-5","name":"نمرة سكر","categoryId":"cat-seed-2","variants":[{"id":"variant-seed-2-5","unit":"","price":""}],"deleted":false},{"id":"product-seed-2-6","name":"نيسكافيه 3 في 1","categoryId":"cat-seed-2","variants":[{"id":"variant-seed-2-6","unit":"","price":""}],"deleted":false},{"id":"product-seed-3-1","name":"دوريتوس","categoryId":"cat-seed-3","variants":[{"id":"variant-seed-3-1","unit":"","price":""}],"deleted":false},{"id":"product-seed-3-2","name":"شيبسى","categoryId":"cat-seed-3","variants":[{"id":"variant-seed-3-2","unit":"","price":""}],"deleted":false},{"id":"product-seed-3-3","name":"شيتوس","categoryId":"cat-seed-3","variants":[{"id":"variant-seed-3-3","unit":"","price":""}],"deleted":false},{"id":"product-seed-3-4","name":"صن بايتس","categoryId":"cat-seed-3","variants":[{"id":"variant-seed-3-4","unit":"","price":""}],"deleted":false},{"id":"product-seed-3-5","name":"فشار","categoryId":"cat-seed-3","variants":[{"id":"variant-seed-3-5","unit":"","price":""}],"deleted":false},{"id":"product-seed-4-1","name":"عصير","categoryId":"cat-seed-4","variants":[{"id":"variant-seed-4-1","unit":"","price":""}],"deleted":false},{"id":"product-seed-4-2","name":"كانز","categoryId":"cat-seed-4","variants":[{"id":"variant-seed-4-2","unit":"","price":""}],"deleted":false},{"id":"product-seed-4-3","name":"مياه كبيرة","categoryId":"cat-seed-4","variants":[{"id":"variant-seed-4-3","unit":"","price":""}],"deleted":false},{"id":"product-seed-5-1","name":"إندومي","categoryId":"cat-seed-5","variants":[{"id":"variant-seed-5-1","unit":"","price":""}],"deleted":false},{"id":"product-seed-5-2","name":"كاستر","categoryId":"cat-seed-5","variants":[{"id":"variant-seed-5-2","unit":"","price":""}],"deleted":false}],"audits":[],"draft":null,"importCompleted":true,"isDemo":false};
const DB_KEY='gard_elbuffet_v1_state';
const META_KEY='gard_elbuffet_v1_sync';
const CLOUD_KEY='gard_elbuffet_v1_cloud';
const TOKEN_KEY='gard_elbuffet_v1_token';
const BACKUP_KEY='gard_elbuffet_v1_backups';
const UNITS=['قطعة','علبة','كيس','كرتونة','كيلو','جرام','لتر'];
const $=s=>document.querySelector(s);
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e=escapeHtml;
const uniqueId=()=>globalThis.crypto?.randomUUID?.()||('id-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
const deepClone=x=>JSON.parse(JSON.stringify(x));
const num=v=>v===''||v===null||v===undefined?NaN:Number(v);
const validNum=v=>Number.isFinite(num(v))&&num(v)>=0;
const money=n=>Number(n).toLocaleString('en-EG',{maximumFractionDigits:2});
const formatDate=ts=>new Date(ts).toLocaleString('ar-EG',{dateStyle:'medium',timeStyle:'short'});
const blankState=()=>({schema:1,categories:[],products:[],audits:[],draft:null,importCompleted:false,isDemo:false});
const initialSync=()=>({rev:0,base:null,dirty:false});
function loadJson(key,fallback){try{const s=localStorage.getItem(key);return s?JSON.parse(s):fallback}catch{return fallback}}
let state=loadJson(DB_KEY,deepClone(SEED_STATE));
const defaultProfit=()=>({entries:[{id:'officers',name:'حساب الضباط',amount:'',sign:1},{id:'wallet',name:'فلوس المحفظة',amount:'',sign:1},{id:'cash',name:'فلوس الكاش',amount:'',sign:1},{id:'debt',name:'الدين اللي عليك',amount:'',sign:-1},{id:'capital',name:'رأس المال',amount:'',sign:-1}],hospitality:''});
if(!state.profit||!Array.isArray(state.profit.entries))state.profit=defaultProfit();
let sync=loadJson(META_KEY,initialSync());
let cloud=loadJson(CLOUD_KEY,{url:'https://mxdriltuyfovbuswbhfh.supabase.co',key:'sb_publishable_OQZckLE9CVgBEt8LIZH28Q_4L3hJqMV',email:''});
cloud.url='https://mxdriltuyfovbuswbhfh.supabase.co';cloud.key='sb_publishable_OQZckLE9CVgBEt8LIZH28Q_4L3hJqMV';
let token=loadJson(TOKEN_KEY,null);
let page='current',selectedAudit=null,editAudit=null,editBuffer=null,query='',hasTabCollision=false,lastSavedAt=0;
let toastTimeout;
function notice(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),4200)}
function persist(markDirty=true){if(hasTabCollision){notice('البرنامج مفتوح في تبويب تاني. اقفله وحدّث الصفحة قبل التعديل.');return false}
  if(markDirty)sync.dirty=true;
  try{localStorage.setItem(DB_KEY,JSON.stringify(state));localStorage.setItem(META_KEY,JSON.stringify(sync));lastSavedAt=Date.now();updateIndicators();return true}
  catch(err){notice('تعذر الحفظ على الجهاز. صدّر نسخة احتياطية قبل المتابعة.');console.error(err);return false}}
function updateIndicators(){const d=$('#sync-dot');if(d)d.classList.toggle('clean',!sync.dirty);const status=$('#save-status');if(status)status.textContent=sync.dirty?'محفوظ محليًا • ينتظر المزامنة':'محفوظ محليًا'}
function saveCloudSettings(){cloud.url='https://mxdriltuyfovbuswbhfh.supabase.co';cloud.key='sb_publishable_OQZckLE9CVgBEt8LIZH28Q_4L3hJqMV';localStorage.setItem(CLOUD_KEY,JSON.stringify(cloud))}
function saveToken(){if(token)localStorage.setItem(TOKEN_KEY,JSON.stringify(token));else localStorage.removeItem(TOKEN_KEY)}
function ensureDraft(){if(state.draft)return;state.draft={id:uniqueId(),startedAt:new Date().toISOString(),rows:state.products.filter(p=>!p.deleted).map(makeRow)};persist(false)}
function makeRow(p){return{id:p.id,name:p.name,categoryId:p.categoryId||null,categoryName:catName(p.categoryId),variants:p.variants.map(v=>({id:v.id,unit:v.unit,price:v.price??'',qty:''}))}}
function catName(id){return state.categories.find(c=>c.id===id)?.name||'بدون فئة'}
function auditTotal(a){if(!a)return 0;return a.rows.reduce((s,row)=>s+row.variants.reduce((z,v)=>z+(validNum(v.qty)&&validNum(v.price)?num(v.qty)*num(v.price):0),0),0)}
function draftReady(a){return Boolean(a&&a.rows.length&&a.rows.every(r=>r.variants.length&&r.variants.every(v=>Boolean(v.unit)&&validNum(v.qty)&&validNum(v.price))))}
function auditCount(a){return a?.rows.reduce((s,r)=>s+r.variants.length,0)||0}
function completedCount(a){return a?.rows.reduce((s,r)=>s+r.variants.filter(v=>validNum(v.qty)&&validNum(v.price)).length,0)||0}
function snapshotRows(){return state.draft?.rows||[]}
function catSortKey(id){const i=state.categories.findIndex(c=>c.id===id);return i<0?99999:i}
function sortedRows(rows){return [...rows].sort((a,b)=>catSortKey(a.categoryId)-catSortKey(b.categoryId)||a.name.localeCompare(b.name,'ar'))}
function pageTitle(text,actions=''){return`<div class="page-heading"><h2>${text}</h2><div class="actions">${actions}</div></div>`}
function inputFor(v,field,context,editable=true){const value=v[field]??'';if(!editable)return`<span>${e(value)}</span>`;return`<input class="row-input ${field==='price'?'price':''}" type="number" inputmode="decimal" step="any" min="0" placeholder="—" value="${e(value)}" data-action="edit-field" data-ctx="${context}" data-variant="${e(v.id)}" data-field="${field}" aria-label="${field==='price'?'سعر الشراء':'الكمية'} ${e(v.unit)}">`}
function renderInventory(a,{readOnly=false,historyMode=false,archiveMode=false}={}){
 if(historyMode)return renderComparisonInventory(a,{readOnly,historyMode,archiveMode});
 const rows=sortedRows(a?.rows||[]).filter(r=>!query||r.name.includes(query)||r.categoryName.includes(query)||r.variants.some(v=>v.unit.includes(query)));
 if(!rows.length)return `<div class="empty">${query?'لا توجد أصناف تطابق البحث.':'مفيش أصناف حاليًا.'}</div>`;
 let html='<div class="compact-inventory">';let category='';
 for(const r of rows){
  if(category!==r.categoryName){category=r.categoryName;html+=`<h3 class="compact-category">${e(category)}</h3><div class="compact-head"><span>الصنف</span><span>العبوة</span><span>العدد</span><span>السعر</span><span>الإجمالي</span><span></span><span></span></div>`}
  for(let i=0;i<r.variants.length;i++){
   const v=r.variants[i],val=validNum(v.qty)&&validNum(v.price)?money(num(v.qty)*num(v.price)):'—';
   html+=`<div class="compact-row data-row${i===r.variants.length-1?' item-last':''}"><span class="compact-name" title="${e(r.name)}">${e(r.name)}</span>`;
   if(!readOnly)html+=`<select class="compact-unit" data-action="edit-unit" data-row="${e(r.id)}" data-variant="${e(v.id)}" aria-label="عبوة ${e(r.name)}"><option value="" ${!v.unit?'selected':''}>عبوة</option>${[...new Set([...UNITS,'زجاجة','باكت',v.unit])].filter(Boolean).map(u=>`<option value="${e(u)}" ${u===v.unit?'selected':''}>${e(u)}</option>`).join('')}</select>`;
   else html+=`<span class="compact-unit-read">${e(v.unit||'—')}</span>`;
   html+=`<div class="compact-input">${inputFor(v,'qty',editAudit?'archive':'draft',!readOnly)}</div><div class="compact-input">${inputFor(v,'price',editAudit?'archive':'draft',!readOnly)}</div><span class="compact-total">${val}</span>`;
   html+=!readOnly&&!archiveMode?`<button class="compact-icon" data-action="add-variant" data-id="${e(r.id)}" title="إضافة عبوة" aria-label="إضافة عبوة">+</button><button class="compact-icon danger" data-action="delete-variant" data-id="${e(r.id)}" data-variant="${e(v.id)}" title="حذف السطر" aria-label="حذف السطر">×</button>`:'<span></span><span></span>';
   html+='</div>';
  }
 }
 return html+'</div>';
}
function renderComparisonInventory(a,opts){
  let {readOnly=false,historyMode=false,archiveMode=false}=opts;let rows=sortedRows(a?.rows||[]).filter(r=>!query||r.name.includes(query)||r.categoryName.includes(query)||r.variants.some(v=>v.unit.includes(query)));
  if(!rows.length)return `<div class="empty">${query?'لا توجد أصناف تطابق البحث.':'لسه مفيش أصناف. اضغط «إضافة صنف».'}</div>`;
  let html=`<div class="table-wrap"><table class="inventory-table${historyMode?' compare-table':''}"><thead><tr>`;
  if(historyMode)html+='<th>الصنف / الوحدة</th><th>السابق</th><th>الحالي</th><th>الفرق</th><th>القيمة</th>';
  else html+='<th>الصنف / الوحدة</th><th>الكمية</th><th>سعر الشراء</th><th>القيمة</th>';
  html+='</tr></thead><tbody>';
  const groups=new Map();for(const row of rows){const category=row.categoryName||'بدون فئة';if(!groups.has(category))groups.set(category,[]);groups.get(category).push(row)}
  for(const [category,items] of groups){html+=`<tr class="category-heading"><td colspan="${historyMode?5:4}">${e(category)}${!readOnly&&!archiveMode?` <span class="cat-actions"><button data-action="manage-categories" type="button">إدارة الفئات</button></span>`:''}</td></tr>`;
    for(const row of items){
      for(let i=0;i<row.variants.length;i++){
        const v=row.variants[i];const isLast=i===row.variants.length-1;
        const value=validNum(v.qty)&&validNum(v.price)?money(num(v.qty)*num(v.price)):'—';
        html+=`<tr class="data-row${isLast?' item-last':''}"><td><div class="item-name">${i===0?e(row.name):'↳'}</div><span class="variant-name">${e(v.unit)}</span>`;
        if(!readOnly&&!archiveMode&&i===0)html+=`<div class="prod-actions"><button class="link-btn" data-action="product-edit" data-id="${e(row.id)}">تعديل</button><button class="link-btn" data-action="add-variant" data-id="${e(row.id)}">+ عبوة</button><button class="link-btn" data-action="product-delete" data-id="${e(row.id)}">حذف</button></div>`;
        if(!readOnly)html+=`<select class="edit-unit" data-action="edit-unit" data-row="${e(row.id)}" data-variant="${e(v.id)}" aria-label="تغيير الوحدة">${[...new Set([...UNITS,v.unit])].map(u=>`<option value="${e(u)}"${u===v.unit?' selected':''}>${e(u)}</option>`).join('')}</select>`;
        html+='</td>';
        if(historyMode){const old=getPriorVariant(selectedAudit,row.id,v.id);let diff='—',cl='no';if(old){if(old.unit!==v.unit)diff='الوحدة اختلفت';else if(validNum(old.qty)&&validNum(v.qty)){const d=num(v.qty)-num(old.qty);diff=(d>0?'+':'')+money(d);cl=d>0?'up':d<0?'down':'no'}}html+=`<td>${old?e(old.qty):'—'}</td><td>${e(v.qty)}</td><td><span class="delta ${cl}">${diff}</span></td><td>${value}</td>`}
        else html+=`<td>${inputFor(v,'qty',editAudit?'archive':'draft',!readOnly)}</td><td>${inputFor(v,'price',editAudit?'archive':'draft',!readOnly)}</td><td style="text-align:center;font-weight:700">${value}</td>`;
        html+='</tr>';
      }
    }
  }
  return html+'</tbody></table></div>'
}

function deleteVariant(rowId,variantId){
 const p=state.products.find(x=>x.id===rowId);const v=p?.variants.find(x=>x.id===variantId);if(!p||!v)return;
 if(!confirm(`حذف سطر العبوة من «${p.name}»؟`))return;
 if(p.variants.length===1){p.deleted=true;touchRowFromProduct(p)}
 else{p.variants=p.variants.filter(x=>x.id!==variantId);touchRowFromProduct(p)}
 persist();render();notice('اتحذف السطر من الجرد الجديد فقط.');
}
function getPriorVariant(aid,rowId,varId){const audits=state.audits;const idx=audits.findIndex(a=>a.id===aid);if(idx<=0)return null;const prior=audits[idx-1];const row=prior.rows.find(r=>r.id===rowId);return row?.variants.find(v=>v.id===varId)||null}
function renderCurrent(){ensureDraft();const a=editAudit?editBuffer:state.draft;
 const heading=editAudit?'تعديل الجرد المحفوظ':'جدول الجرد الجديد';const headActions=editAudit?'':`<button class="btn small muted" data-action="product-add">+ إضافة صنف</button>`;
 let html=pageTitle(heading,headActions);
 if(editAudit)html+=`<p class="note">أنت بتعدّل جردًا محفوظًا. أي تعديل هنا هيغيّر هذا الجرد فقط، والجرد التالي هتتحدّث مقارنة كمياته تلقائيًا.</p>`;
 html+=`<div class="searchrow"><input id="product-search" class="search" placeholder="بحث عن صنف أو فئة..." value="${e(query)}" aria-label="بحث"></div>`;
 html+=renderInventory(a,{readOnly:false,archiveMode:!!editAudit});
 if(!editAudit)html+=`<div class="actions" style="margin-top:12px"><button class="btn" data-action="product-add">+ إضافة صنف</button><button class="btn" data-action="manage-categories">إدارة الفئات</button></div>`;
 const total=auditTotal(a);const complete=draftReady(a);
 html+=`<div class="moneybar"><span>إجمالي الجرد</span><strong>${money(total)} ج</strong></div>`;
 html+=`<div class="bottom-buttons">${editAudit?`<button class="btn primary" data-action="save-history" ${!complete?'disabled':''}>حفظ التعديل</button><button class="btn muted" data-action="cancel-history-edit">إلغاء</button>`:`<button class="btn primary" data-action="finish-audit" ${!complete?'disabled':''}>إنهاء وحفظ الجرد</button>`}</div>`;
 if(!complete)html+=`<p class="hint" style="margin-top:12px">الخانة الفاضية معناها «لم تُجرد بعد»، أما الصفر فمعناه مفيش بضاعة. لازم تدخل كميات وأسعار كل الأصناف قبل الإنهاء. المسودة محفوظة تلقائيًا.</p>`;
 return html
}
function renderHistory(){if(selectedAudit){const a=state.audits.find(x=>x.id===selectedAudit);if(!a){selectedAudit=null;return renderHistory()}let oldQ=query;query='';let html=pageTitle('تفاصيل الجرد',`<button class="btn small muted" data-action="history-list">رجوع</button>`);
 html+=`<div class="subnav"><span class="chip">${formatDate(a.completedAt)}</span><button class="btn small" data-action="history-edit" data-id="${e(a.id)}">تعديل الجرد</button><button class="btn small" data-action="export-audit" data-id="${e(a.id)}">تصدير Excel</button></div>`;
 html+=renderInventory(a,{readOnly:true,historyMode:true});html+=`<div class="moneybar"><span>إجمالي الجرد</span><strong>${money(auditTotal(a))} ج</strong></div>`;query=oldQ;return html;}
 let html=pageTitle('الجرد السابق',`<button class="btn small muted" data-action="export-latest" ${state.audits.length?'':'disabled'}>تصدير Excel</button>`);
 if(!state.audits.length)return html+`<div class="empty">لسه مفيش جرد محفوظ. ابدأ «جرد جديد» وسجل الكميات ثم اضغط «إنهاء وحفظ الجرد».</div>`;
 for(const a of [...state.audits].reverse())html+=`<div class="history-card"><div><strong>${formatDate(a.completedAt)}</strong><br><span>${a.rows.length} أصناف • ${auditCount(a)} وحدة</span><div class="actions" style="margin-top:8px"><button class="btn small" data-action="history-open" data-id="${e(a.id)}">عرض</button><button class="btn small muted" data-action="history-edit" data-id="${e(a.id)}">تعديل</button></div></div><div class="history-total">${money(auditTotal(a))} ج</div></div>`;
 return html;
}
function renderProfit(){
 if(!state.profit||!Array.isArray(state.profit.entries))state.profit=defaultProfit();
 const p=state.profit;const stock=state.audits.length?state.audits.at(-1):state.draft;
 const stockValue=auditTotal(stock);const cashTotal=p.entries.reduce((sum,x)=>sum+(validNum(x.amount)?num(x.amount)*x.sign:0),0);
 const result=cashTotal+stockValue;
 let html=pageTitle('صافي الربح',`<button class="btn small muted" data-action="profit-add">+ إضافة بند</button>`);
 html+=`<p class="note">دي حسبة قيمة المشروع بعد خصم رأس المال والديون. قيمة البضاعة من ${state.audits.length?'آخر جرد محفوظ':'الجرد الحالي غير المكتمل'}، وباقي الأرقام بتدخلها بنفسك.</p>`;
 html+=`<div class="profit-summary"><span>صافي الربح المحسوب</span><strong class="${result<0?'profit-negative':''}">${money(result)} جنيه</strong></div>`;
 html+=`<div class="profit-stock"><span>+ قيمة البضاعة المتبقية (بسعر الشراء)</span><strong>${money(stockValue)} ج</strong></div>`;
 html+=`<div class="profit-entries">`;
 for(const item of p.entries)html+=`<div class="profit-entry"><input aria-label="اسم البند" class="profit-name" data-profit-id="${e(item.id)}" data-profit-field="name" value="${e(item.name)}"><select aria-label="جمع أو طرح" data-profit-id="${e(item.id)}" data-profit-field="sign"><option value="1" ${item.sign===1?'selected':''}>+ جمع</option><option value="-1" ${item.sign===-1?'selected':''}>− طرح</option></select><input aria-label="قيمة البند" class="profit-amount" type="number" inputmode="decimal" step="any" min="0" placeholder="المبلغ" data-profit-id="${e(item.id)}" data-profit-field="amount" value="${e(item.amount)}"><button class="profit-delete" type="button" aria-label="حذف البند" data-action="profit-delete" data-id="${e(item.id)}">✕</button></div>`;
 html+=`</div><div class="actions" style="margin-top:12px"><button class="btn" data-action="profit-add">+ إضافة بند جديد</button></div>`;
 html+=`<div class="profit-hospitality"><label for="profit-hospitality">تكلفة الضيافة بسعر الشراء (للعرض فقط)</label><input id="profit-hospitality" type="number" inputmode="decimal" min="0" step="any" placeholder="0" value="${e(p.hospitality)}"><p class="fine">الضيافة اللي خرجت من المخزن قللت قيمة البضاعة بالفعل، لذلك لا نطرحها مرة ثانية.</p></div>`;
 html+=`<p class="hint">تنبيه: لو سحبت أرباح أو ضفت رأس مال، سجّل الحركات دي في البنود المناسبة عشان الحسبة تكون دقيقة. القيم محفوظة محليًا وتدخل ضمن النسخ الاحتياطية والمزامنة اليدوية.</p>`;
 return html;
}
function updateProfitTotal(){const p=state.profit;const stock=state.audits.length?state.audits.at(-1):state.draft;const total=auditTotal(stock)+p.entries.reduce((sum,x)=>sum+(validNum(x.amount)?num(x.amount)*x.sign:0),0);const node=document.querySelector('.profit-summary strong');if(node){node.textContent=money(total)+' جنيه';node.classList.toggle('profit-negative',total<0)}}
function render(){document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('#main-content').innerHTML=page==='history'?renderHistory():page==='profit'?renderProfit():renderCurrent();updateIndicators()}
function touchRowFromProduct(p){if(!state.draft)return;const existing=state.draft.rows.find(r=>r.id===p.id);
 if(!existing){if(!p.deleted)state.draft.rows.push(makeRow(p));return}
 if(p.deleted){state.draft.rows=state.draft.rows.filter(r=>r.id!==p.id);return}
 existing.name=p.name;existing.categoryId=p.categoryId;existing.categoryName=catName(p.categoryId);
 const byId=new Map(existing.variants.map(v=>[v.id,v]));existing.variants=p.variants.map(v=>{const before=byId.get(v.id);return before?{...before,unit:v.unit,price:before.unit===v.unit?v.price:'',qty:before.unit===v.unit?before.qty:''}:{id:v.id,unit:v.unit,price:v.price??'',qty:''}})
}
function setRowValue(rowId,variantId,field,value,archive=false){const a=archive?editBuffer:state.draft;
 if(!a)return;const row=a.rows.find(r=>r.variants.some(v=>v.id===variantId));const v=row?.variants.find(x=>x.id===variantId);if(!v)return;
 if(value!==''&&!validNum(value)){notice('اكتب رقمًا صحيحًا صفر أو أكبر.');return}
 v[field]=value;
 if(!archive&&field==='price'){
   const p=state.products.find(p=>p.id===row.id);const vr=p?.variants.find(vr=>vr.id===variantId);if(vr)vr.price=value
 }
 if(archive){a.editedAt=new Date().toISOString();updateSummary(a)}
 else{if(!persist())return;updateSummary(a)}
}
function updateSummary(a){const bar=$('.moneybar strong');if(bar)bar.textContent=money(auditTotal(a))+' ج';
 const save=$('[data-action="finish-audit"]')||$('[data-action="save-history"]');if(save)save.disabled=!draftReady(a);
 // value column can refresh only affected row to avoid losing focus
 document.querySelectorAll('.data-row').forEach(tr=>{const q=tr.querySelector('[data-field="qty"]');const p=tr.querySelector('[data-field="price"]');if(q&&p){const qn=num(q.value),pn=num(p.value),td=tr.querySelector('.compact-total')||tr.querySelector('td:last-child');if(td)td.textContent=validNum(q.value)&&validNum(p.value)?money(qn*pn):'—'}})
}
function saveSnapshotBackup(label){const b=loadJson(BACKUP_KEY,[]);b.unshift({createdAt:new Date().toISOString(),label,state:deepClone(state)});try{localStorage.setItem(BACKUP_KEY,JSON.stringify(b.slice(0,5)))}catch(err){console.warn('Local backup full',err)}}
function finishAudit(){if(!draftReady(state.draft)){notice('كمّل كل الكميات والأسعار الأول.');return}
 if(!confirm('إنهاء الجرد وحفظه في السجل؟'))return;
 saveSnapshotBackup('قبل إنهاء الجرد');
 const audit={id:uniqueId(),startedAt:state.draft.startedAt,completedAt:new Date().toISOString(),rows:deepClone(state.draft.rows)};
 state.audits.push(audit);state.draft=null;selectedAudit=audit.id;page='history';persist();render();notice('اتحفظ الجرد. وتقدر ترجعله وتعدّله في أي وقت.')}
function updateArchivedAudit(){if(!editAudit||!editBuffer||!draftReady(editBuffer))return;if(!confirm('حفظ التعديلات على الجرد القديم؟'))return;const i=state.audits.findIndex(x=>x.id===editAudit);if(i<0)return;saveSnapshotBackup('قبل تعديل جرد قديم');editBuffer.editedAt=new Date().toISOString();state.audits[i]=deepClone(editBuffer);selectedAudit=editAudit;editAudit=null;editBuffer=null;page='history';persist();render();notice('اتحفظ التعديل، والفروق اتحدثت تلقائيًا.')}
function optionHtml(options,current){return options.map(({id,name})=>`<option value="${e(id)}"${id===current?' selected':''}>${e(name)}</option>`).join('')}
function modal(title,body){$('#modal-root').innerHTML=`<div class="overlay" id="overlay"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h2 id="modal-title">${e(title)}</h2><button class="close" data-action="close-modal" aria-label="إغلاق">×</button></div>${body}</div></div>`}
function closeModal(){$('#modal-root').innerHTML=''}
function activeCategories(){return [{id:'',name:'بدون فئة'},...state.categories.map(c=>({id:c.id,name:c.name}))]}
function openProductForm(id=null){const p=id?state.products.find(p=>p.id===id):null;if(id&&!p)return;
 const variants=(p?.variants||[{id:uniqueId(),unit:'قطعة',price:''}]).map(v=>({...v}));
 const markup=`<form id="product-form" data-product="${e(id||'')}"><div class="field"><label>اسم الصنف</label><input id="product-name" required maxlength="130" value="${e(p?.name||'')}" placeholder="مثل: شيبسي"></div><div class="field"><label>الفئة</label><select id="product-category">${optionHtml(activeCategories(),p?.categoryId||'')}</select></div><button type="button" class="btn small muted" data-action="category-add-inline">+ فئة جديدة</button><h3>وحدات الصنف وأسعار الشراء</h3><p>لو عندك كرتونة وأكياس مفردة، ضيف سطر لكل واحدة بسعر مستقل. مفيش تحويل كراتين لأكياس.</p><div id="variant-form-rows">${variants.map(v=>variantFormRow(v)).join('')}</div><button type="button" class="btn small muted" data-action="variant-form-add">+ وحدة أخرى لنفس الصنف</button><div class="modal-actions"><button class="btn primary" type="submit">حفظ الصنف</button><button class="btn muted" type="button" data-action="close-modal">إلغاء</button></div></form>`;
 modal(id?'تعديل الصنف':'إضافة صنف',markup)
}
function variantFormRow(v){const units=[...new Set([...UNITS,v.unit])];return`<div class="unit-row" data-id="${e(v.id)}"><div class="field"><label>الوحدة</label><select class="variant-unit">${units.map(u=>`<option value="${e(u)}" ${u===v.unit?'selected':''}>${e(u)}</option>`).join('')}</select></div><div class="field"><label>سعر الشراء (ج)</label><input type="number" inputmode="decimal" min="0" step="any" class="variant-price" placeholder="سعر الوحدة" value="${e(v.price)}"></div><button class="btn danger small" type="button" data-action="variant-form-delete">حذف</button></div>`}
function saveProduct(form){const id=form.dataset.product;const name=$('#product-name').value.trim();const categoryId=$('#product-category').value||null;
 const rows=[...document.querySelectorAll('#variant-form-rows .unit-row')];const variants=rows.map(el=>({id:el.dataset.id,unit:el.querySelector('.variant-unit').value,price:el.querySelector('.variant-price').value}));
 if(!name){notice('اكتب اسم الصنف.');return}if(!variants.length){notice('لازم تضيف وحدة واحدة على الأقل.');return}
 if(new Set(variants.map(x=>x.unit)).size!==variants.length){notice('مينفعش نفس الوحدة تتكرر للصنف الواحد.');return}
 if(variants.some(v=>v.price!==''&&!validNum(v.price))){notice('اكتب سعر شراء صحيح لكل وحدة.');return}
 if(state.products.some(p=>p.id!==id&&!p.deleted&&p.name.trim().toLocaleLowerCase('ar')===name.toLocaleLowerCase('ar'))){notice('الصنف ده موجود بالفعل.');return}
 if(id){const p=state.products.find(p=>p.id===id);p.name=name;p.categoryId=categoryId;p.variants=variants;touchRowFromProduct(p)}
 else{const p={id:uniqueId(),name,categoryId,variants,deleted:false};state.products.push(p);touchRowFromProduct(p)}
 if(persist()){closeModal();render();notice('اتحفظ الصنف في جدول الجرد.')}
}
function openCategoryModal(){modal('إدارة الفئات',`<div class="field"><label>اسم فئة جديدة</label><div class="actions"><input id="new-category-name" class="search" style="flex:1;min-width:110px;width:auto" placeholder="اسم الفئة"><button class="btn primary" data-action="category-create">إضافة</button></div></div><div id="category-list">${state.categories.length?state.categories.map(c=>`<div class="flex-between" style="border-bottom:1px solid #d6d6c7;padding:10px 0"><strong>${e(c.name)}</strong><span class="actions"><button class="btn small" data-action="category-rename" data-id="${e(c.id)}">تعديل</button><button class="btn small danger" data-action="category-delete" data-id="${e(c.id)}">حذف</button></span></div>`).join(''):'<p>مفيش فئات مضافة.</p>'}</div>`)}
function createCategory(name){const n=name.trim();if(!n||n.length>80){notice('اكتب اسم فئة صحيح.');return null}if(state.categories.some(c=>c.name===n)){notice('الفئة موجودة.');return null}const c={id:uniqueId(),name:n};state.categories.push(c);persist();return c}
function renameCategory(id){const c=state.categories.find(c=>c.id===id);if(!c)return;const next=prompt('اكتب اسم الفئة الجديد:',c.name);if(next===null)return;const newName=next.trim();if(!newName){notice('الاسم مينفعش يكون فاضي.');return}if(state.categories.some(o=>o.id!==id&&o.name===newName)){notice('في فئة بنفس الاسم.');return}c.name=newName;
 for(const r of state.draft?.rows||[])if(r.categoryId===id)r.categoryName=newName;
 persist();openCategoryModal();render()}
function deleteCategory(id){const c=state.categories.find(c=>c.id===id);if(!c)return;const count=state.products.filter(p=>p.categoryId===id&&!p.deleted).length;
 if(!confirm(`حذف فئة «${c.name}»؟\n${count} صنف هيتنقل لـ «بدون فئة». الجرد القديم هيفضل زي ما هو.`))return;
 state.categories=state.categories.filter(x=>x.id!==id);for(const p of state.products)if(p.categoryId===id)p.categoryId=null;
 for(const r of state.draft?.rows||[])if(r.categoryId===id){r.categoryId=null;r.categoryName='بدون فئة'}
 persist();openCategoryModal();render();notice('اتحذفت الفئة من القائمة الحالية فقط.')}
function deleteProduct(id){const p=state.products.find(p=>p.id===id);if(!p)return;
 if(!confirm(`حذف «${p.name}» من الجرد الجديد؟\nهيفضل موجود في كل الجردات القديمة ومش هتتغير قيمتها.`))return;
 p.deleted=true;touchRowFromProduct(p);persist();render();notice('الصنف اتحذف من الجرد الجديد فقط؛ الأرشيف محفوظ.')}
function addVariant(id){const p=state.products.find(p=>p.id===id);if(!p)return;
 // Add an unselected packaging row. The user chooses its unit, quantity and price.
 p.variants.push({id:uniqueId(),unit:'',price:''});touchRowFromProduct(p);persist();render();notice('اتضاف سطر جديد. اختار الوحدة واكتب الكمية والسعر.')}
function changeVariantUnit(vid,unit){const a=editAudit?editBuffer:state.draft;
 if(!a)return;const row=a.rows.find(r=>r.variants.some(v=>v.id===vid));const v=row?.variants.find(x=>x.id===vid);
 if(!v||v.unit===unit)return;if(row.variants.some(x=>x.id!==vid&&x.unit===unit)){notice('الوحدة دي موجودة بالفعل تحت الصنف.');render();return}
 v.unit=unit;v.price='';v.qty='';if(!editAudit){const p=state.products.find(x=>x.id===row.id);const pv=p?.variants.find(x=>x.id===vid);if(pv){pv.unit=unit;pv.price=''}persist()}else a.editedAt=new Date().toISOString();
 render();notice('الوحدة اتغيرت. اكتب سعر الشراء والكمية من جديد؛ مفيش تحويل تلقائي.')}
function openImportModal(){modal('استيراد الأصناف مرة واحدة',`<p>اختار ملف النسخة الاحتياطية JSON اللي صدّرته من برنامج «البوفيه». البرنامج هيقرأ <b>أسماء الأصناف والفئات فقط</b>، ومش هيستورد أسعار أو مبيعات أو ضباط أو تحصيلات، ومش هيعدّل ملفك الأصلي.</p><div class="field"><label>ملف النسخة الاحتياطية (.json)</label><input id="import-file" type="file" accept=".json,application/json"></div><div class="sheet-info">الاستيراد متاح مرة واحدة. تقدر تضيف أصناف جديدة بعد كده من شاشة الجرد.</div><div class="modal-actions"><button class="btn primary" data-action="import-file-run">استيراد الأسماء والفئات</button><button class="btn muted" data-action="close-modal">إلغاء</button></div>`)}
async function importBuffetFile(){if(state.importCompleted){notice('تم الاستيراد مسبقًا.');return}const f=$('#import-file')?.files?.[0];if(!f){notice('اختار الملف الأول.');return}if(f.size>20_000_000){notice('الملف أكبر من الحد المسموح للاستيراد.');return}
 let raw;try{raw=JSON.parse(await f.text())}catch{notice('الملف مش JSON صحيح.');return}
 const source=raw?.state&&typeof raw.state==='object'?raw.state:raw;
 if(!Array.isArray(source?.products)||!Array.isArray(source?.cats)){notice('الملف مش نسخة احتياطية معروفة من برنامج البوفيه.');return}
 const names=[...new Set([...source.cats,...source.products.map(p=>p?.cat)].filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim()))];
 const active=source.products.filter(p=>p&&typeof p.name==='string'&&p.name.trim()&&!p.catalogDeleted&&!p.deleted);
 if(!active.length){notice('مفيش أصناف ظاهرة في النسخة الاحتياطية.');return}
 if(!confirm(`استيراد ${active.length} صنف و${names.length} فئة؟\nلن ننقل المبيعات أو حسابات الضباط أو أسعار الشراء.`))return;
 saveSnapshotBackup('قبل استيراد أصناف برنامج البوفيه');
 const catMap=new Map(state.categories.map(c=>[c.name,c.id]));for(const name of names){if(!catMap.has(name)){const id=uniqueId();state.categories.push({id,name});catMap.set(name,id)}}
 let added=0;for(const x of active){const name=x.name.trim();if(state.products.some(p=>!p.deleted&&p.name.trim()===name))continue;
 const u='قطعة';const p={id:uniqueId(),name,categoryId:catMap.get(String(x.cat||'').trim())||null,variants:[{id:uniqueId(),unit:u,price:''}],deleted:false};state.products.push(p);touchRowFromProduct(p);added++}
 state.importCompleted=true;if(persist()){closeModal();render();notice(`اتضاف ${added} صنف. اكتب سعر شراء كل وحدة من جدول الجرد.`)}
}
function openExportBackup(){const payload={fileType:'GARD_ELBUFFET_BACKUP',version:1,createdAt:new Date().toISOString(),state:deepClone(state)};
 downloadFile('gard-elbuffet-backup-'+new Date().toISOString().slice(0,10)+'.json','application/json;charset=utf-8',JSON.stringify(payload,null,2));notice('تم تجهيز النسخة الاحتياطية للتنزيل.')}
function downloadFile(name,type,data){const blob=data instanceof Blob?data:new Blob([data],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)}
function openRestoreBackup(){modal('استرجاع نسخة احتياطية',`<p>ملف جرد البوفيه فقط. هنعمل نسخة أمان محلية قبل الاسترجاع، ومش هننقل الملف للسيرفر تلقائيًا.</p><div class="field"><label>ملف الجرد JSON</label><input id="restore-file" type="file" accept=".json,application/json"></div><div class="modal-actions"><button class="btn danger" data-action="restore-file-run">استرجاع</button><button class="btn muted" data-action="close-modal">إلغاء</button></div>`)}
async function restoreBackup(){const f=$('#restore-file')?.files?.[0];if(!f)return notice('اختار الملف.');let b;try{b=JSON.parse(await f.text())}catch{return notice('ملف غير صالح.')}
 if(b?.fileType!=='GARD_ELBUFFET_BACKUP'||b.version!==1||!validState(b.state))return notice('الملف ليس نسخة احتياطية صحيحة لبرنامج الجرد.');
 if(!confirm('استرجاع الجرد من الملف؟ ده هيستبدل البيانات المحلية الحالية. هيتم الاحتفاظ بنسخة أمان قبل الاسترجاع.'))return;
 saveSnapshotBackup('قبل الاسترجاع');state=deepClone(b.state);editAudit=null;selectedAudit=null;sync.dirty=true;if(persist()){closeModal();page='current';render();notice('تم الاسترجاع محليًا. اضغط مزامنة بنفسك لو محتاج ترفعه.')}
}
function validState(s){return Boolean(s&&s.schema===1&&Array.isArray(s.products)&&Array.isArray(s.categories)&&Array.isArray(s.audits)&&(s.draft===null||s.draft&&Array.isArray(s.draft.rows)))}


function clearExampleData(){if(!state.isDemo)return;if(!confirm('مسح كل بيانات المثال التجريبية من جهازك؟ سيتم عمل نسخة أمان محلية أولًا. لو أضفت بياناتك الحقيقية بعد تجربة المثال، ستُمسح هي أيضًا.'))return;saveSnapshotBackup('قبل مسح المثال التجريبي');state=blankState();selectedAudit=null;editAudit=null;editBuffer=null;page='current';persist();render();notice('اتمسحت بيانات المثال من الجهاز. ابدأ بياناتك الحقيقية الآن.')}
function loadExampleData(){
 if(state.products.length||state.audits.length||state.draft?.rows.length)return notice('الأمثلة بتتضاف بس لما البرنامج يكون فاضي.');
 if(!confirm('تضيف مثال تجريبي فيه جرد سابق و4 أصناف؟ دي مش بضاعة البوفيه الحقيقية.'))return;
 const catalog=[
  {cat:'مقرمشات',name:'شيبسي',var:[['كرتونة',180,1,2],['كيس',9,8,5]]},
  {cat:'مشروبات باردة',name:'بيبسي',var:[['كرتونة',300,2,1],['علبة',15,3,6]]},
  {cat:'مواد خام',name:'سكر',var:[['كيلو',35,4,3]]},
  {cat:'حلويات',name:'مولتو',var:[['قطعة',12,12,10]]}
 ];
 const oldRows=[];
 for(const x of catalog){let c=state.categories.find(c=>c.name===x.cat);if(!c){c={id:uniqueId(),name:x.cat};state.categories.push(c)}
   const variants=x.var.map(u=>({id:uniqueId(),unit:u[0],price:String(u[1])}));
   const p={id:uniqueId(),name:x.name,categoryId:c.id,deleted:false,variants};state.products.push(p);
   oldRows.push({id:p.id,name:p.name,categoryId:c.id,categoryName:c.name,variants:variants.map((v,i)=>({...v,qty:String(x.var[i][2])}))});
 }
 const prev=new Date(Date.now()-86400000*2).toISOString();state.audits=[{id:uniqueId(),startedAt:prev,completedAt:prev,rows:oldRows}];
 state.draft=null;state.isDemo=true;ensureDraft();state.draft.rows.forEach(r=>{const spec=catalog.find(x=>x.name===r.name);r.variants.forEach((v,i)=>v.qty=String(spec.var[i][3]))});
 persist();render();notice('جهزت مثال: شيبسي كرتونة وكيس وبيبسي وسكر ومولتو، مع جرد سابق.');
}
/* Self-contained XLSX writer with UTF-8 inline strings. No external network dependency. */
const U8=new TextEncoder();
const xml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function excelCol(n){let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s}
function makeSheet(rows){const out=rows.map((row,ri)=>`<row r="${ri+1}">${row.map((v,ci)=>{const cell=excelCol(ci)+(ri+1);if(typeof v==='number'&&Number.isFinite(v))return`<c r="${cell}" s="${ri===0?1:2}"><v>${v}</v></c>`;return`<c r="${cell}" s="${ri===0?1:0}" t="inlineStr"><is><t>${xml(v)}</t></is></c>`}).join('')}</row>`).join('');return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView rightToLeft="1" workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="19"/><cols><col min="1" max="1" width="25" customWidth="1"/><col min="2" max="3" width="18" customWidth="1"/><col min="4" max="8" width="18" customWidth="1"/></cols><sheetData>${out}</sheetData></worksheet>`}
function zipFiles(files){const chunks=[];const central=[];let off=0;let sum=0;const len=x=>x.length;
 const crc32=buf=>{let c=-1;for(let i=0;i<buf.length;i++){c^=buf[i];for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^-1)>>>0};
 const w16=(buf,off,v)=>{buf[off]=v&255;buf[off+1]=v>>>8&255};const w32=(buf,off,v)=>{w16(buf,off,v);w16(buf,off+2,v>>>16)};
 for(const [filename,content] of files){const name=U8.encode(filename),data=U8.encode(content),crc=crc32(data),local=new Uint8Array(30+name.length),dir=new Uint8Array(46+name.length);
 w32(local,0,0x04034b50);w16(local,4,20);w16(local,6,0x800);w32(local,14,crc);w32(local,18,data.length);w32(local,22,data.length);w16(local,26,name.length);local.set(name,30);
 w32(dir,0,0x02014b50);w16(dir,4,20);w16(dir,6,20);w16(dir,8,0x800);w32(dir,16,crc);w32(dir,20,data.length);w32(dir,24,data.length);w16(dir,28,name.length);w32(dir,42,off);dir.set(name,46);
 chunks.push(local,data);central.push(dir);off+=local.length+data.length;sum+=dir.length}
 const end=new Uint8Array(22);w32(end,0,0x06054b50);w16(end,8,files.length);w16(end,10,files.length);w32(end,12,sum);w32(end,16,off);
 return new Blob([...chunks,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
function makeXlsx(a){const rows=[['الفئة','الصنف','الوحدة','كمية الجرد السابق','كمية الجرد الحالي','فرق الكمية','سعر الشراء','قيمة الصنف']];const idx=state.audits.findIndex(x=>x.id===a.id);const old=idx>0?state.audits[idx-1]:null;
 for(const r of sortedRows(a.rows)){for(const v of r.variants){const oldV=old?.rows.find(x=>x.id===r.id)?.variants.find(x=>x.id===v.id);const sameUnit=Boolean(oldV&&oldV.unit===v.unit);rows.push([r.categoryName,r.name,v.unit,sameUnit?num(oldV.qty):oldV?'وحدة مختلفة':'—',num(v.qty),sameUnit?num(v.qty)-num(oldV.qty):'—',num(v.price),num(v.qty)*num(v.price)])}}
 rows.push(['','','','','','','إجمالي الجرد',auditTotal(a)]);
 const summary=[['جرد البوفيه',''],['تاريخ الجرد',formatDate(a.completedAt)],['عدد الأصناف',a.rows.length],['عدد الوحدات',auditCount(a)],['إجمالي قيمة البضاعة (جنيه)',auditTotal(a)],['ملاحظة','الفروق كمية فقط، لا تعني عجزًا؛ لا توجد مبيعات/مشتريات في البرنامج.']];
 const content=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
 const rels=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
 const wb=`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets><sheet name="تفاصيل الجرد" sheetId="1" r:id="rId1"/><sheet name="الملخص" sheetId="2" r:id="rId2"/></sheets></workbook>`;
 const wrels=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
 const styles=`<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF39523E"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1"/><xf numFmtId="2" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs></styleSheet>`;
 return zipFiles([['[Content_Types].xml',content],['_rels/.rels',rels],['xl/workbook.xml',wb],['xl/_rels/workbook.xml.rels',wrels],['xl/styles.xml',styles],['xl/worksheets/sheet1.xml',makeSheet(rows)],['xl/worksheets/sheet2.xml',makeSheet(summary)]])}
function exportXlsx(id){const a=state.audits.find(x=>x.id===id);if(!a)return notice('اختار جردًا محفوظًا.');const filename='gard-elbuffet-'+a.completedAt.slice(0,10)+'.xlsx';downloadFile(filename,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',makeXlsx(a));notice('تم تجهيز تقرير Excel للتنزيل.')}
/* Optional dedicated Supabase instance. No access to the sales Buffet app. */
function cloudBase(){const url=cloud.url.trim().replace(/\/$/,'');if(!/^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(url))throw new Error('اكتب رابط Supabase الصحيح (https://…supabase.co)');if(!cloud.key.trim())throw new Error('مفتاح Publishable/Anon مطلوب.');return url}
async function apiFetch(path,{method='GET',body,auth=true}={}){const base=cloudBase();const headers={'apikey':cloud.key,'Content-Type':'application/json'};if(auth){await ensureAuth();headers['Authorization']='Bearer '+token.access_token}
 let res;try{res=await fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'})}catch{throw new Error('تعذر الاتصال بالسيرفر. بيانات الجهاز محفوظة.')}
 const txt=await res.text();let data;try{data=txt?JSON.parse(txt):null}catch{data={message:txt}};
 if(!res.ok){if(res.status===401){throw new Error('جلسة الدخول انتهت. سجّل دخول من إعدادات المزامنة من غير مسح أي بيانات.')}
 if(JSON.stringify(data).includes('REVISION_CONFLICT'))throw new Error('تغيرت بيانات السيرفر أثناء المزامنة. البيانات المحلية محفوظة؛ أعد المزامنة.');
 throw new Error(data?.msg||data?.message||data?.error_description||'السيرفر رفض الطلب ('+res.status+')')}
 return data}
async function ensureAuth(){if(!token?.access_token||!token?.refresh_token)throw new Error('سجّل دخول حساب الجرد أولًا من إعدادات المزامنة.');if(Date.now()<(token.expires_at||0)-60000)return;
 const base=cloudBase();let response;try{response=await fetch(base+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'apikey':cloud.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:token.refresh_token})})}catch{throw new Error('مفيش إنترنت لتجديد الدخول. بيانات الجرد محفوظة محليًا.')}
 const data=await response.json();if(!response.ok||!data.access_token){token=null;saveToken();throw new Error('لازم تسجيل دخول تاني للمزامنة فقط، ومش هتتمسح بياناتك.')}
 token={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Date.now()+data.expires_in*1000,userId:data.user?.id||token.userId};saveToken()}
async function authPassword(action,email,password){const base=cloudBase();if(!email||!password)throw new Error('اكتب الإيميل وكلمة السر.');const endpoint=action==='signup'?'/auth/v1/signup':'/auth/v1/token?grant_type=password';
 let resp;try{resp=await fetch(base+endpoint,{method:'POST',headers:{apikey:cloud.key,'Content-Type':'application/json'},body:JSON.stringify({email,password})})}catch{throw new Error('تعذر الاتصال بالسيرفر. جرب بعد الاتصال بالإنترنت.')}
 const data=await resp.json();if(!resp.ok)throw new Error(data.msg||data.error_description||data.message||'تعذر الدخول');
 cloud.email=email;saveCloudSettings();if(!data.access_token){notice('الحساب اتعمل؛ راجع البريد لتأكيد الإيميل ثم سجّل دخول.');return}
 if(sync.userId && sync.userId!==data.user.id){sync=initialSync();sync.dirty=true;}sync.userId=data.user.id;localStorage.setItem(META_KEY,JSON.stringify(sync));token={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Date.now()+(data.expires_in||3600)*1000,userId:data.user.id};saveToken();notice('تم ربط الجهاز بالحساب. المزامنة يدوية فقط عند الضغط على «مزامنة الآن».');closeModal()}
function openSyncModal(){modal('ربط الجهاز والمزامنة',`<p>سحابة الجرد مستقلة عن برنامج المبيعات. سجّل دخول مرة واحدة؛ الجهاز يفضل مربوط. المزامنة يدوية فقط لما تضغط «مزامنة الآن».</p><div class="sheet-info">${sync.dirty?'عندك تغييرات محفوظة على الجهاز لم تُرفع بعد.':'لا توجد تغييرات محلية معلقة حسب آخر مزامنة.'}<br>رقم النسخة على السيرفر عند هذا الجهاز: ${sync.rev}<br>الحساب: ${e(cloud.email||'لم يُحدد')} ${token?'• مُسجل':'• غير مُسجل'}</div><p class="fine">سحابة جرد البوفيه المستقلة متوصلة تلقائيًا. سجّل الدخول مرة واحدة. زر المزامنة اليدوية متاح عند الحاجة فقط.</p><div class="field"><label>إيميل الحساب الواحد</label><input id="cloud-email" type="email" dir="ltr" value="${e(cloud.email)}"></div><div class="field"><label>كلمة المرور</label><input type="password" id="cloud-password" autocomplete="off" placeholder="كلمة سر الحساب"></div><div class="actions"><button class="btn small muted" data-action="cloud-save">حفظ الإعدادات</button><button class="btn small" data-action="cloud-login">تسجيل دخول</button><button class="btn small" data-action="cloud-signup">إنشاء حساب</button></div><div class="modal-actions"><button class="btn primary" data-action="cloud-sync">⇄ مزامنة الآن</button><button class="btn muted" data-action="close-modal">إغلاق</button></div><hr style="border:0;border-top:1px solid #d6d6c7;margin:18px 0"><div class="actions"><button class="btn small" data-action="backup-export">تنزيل نسخة احتياطية</button><button class="btn small" data-action="backup-restore">استرجاع نسخة احتياطية</button><button class="btn small danger" data-action="factory-reset">إعادة ضبط المصنع (29 صنف)</button></div><p class="fine">المزامنة يدوية فقط، ولا يحصل رفع أو تنزيل بمجرد فتح البرنامج أو رجوع الإنترنت. لا تمسح بيانات المتصفح لو فيه تغييرات معلّقة. في حالة التعارض بين جهازين هتختار بنفسك.</p>`)}
function readCloudFields(){const field=$('#cloud-email');if(field)cloud.email=field.value.trim();saveCloudSettings()}
function factoryState(){const fresh=deepClone(SEED_STATE);fresh.profit=defaultProfit();return fresh}
async function factoryReset(){
 if(!confirm('تأكيد إعادة ضبط جرد البوفيه؟\nهتتمسح الجردات السابقة والكميات والأسعار وبنود الربح من نسخة الجرد، وترجع الـ29 صنف الأصليين فقط. العملية لا تمس برنامج المبيعات.'))return;
 if(!confirm('تأكيد نهائي: هل تريد تصفير كل بيانات الجرد والرجوع لنسخة جديدة تمامًا؟'))return;
 // Keep a local recovery copy, and preserve the account/revision to prevent accidental cross-account writes.
 saveSnapshotBackup('قبل تصفير الجرد وإرجاع 29 صنف');
 const next=factoryState();
 if(token?.userId){
  if(!navigator.onLine){notice('التصفير الشامل يحتاج إنترنت لتصفير السحابة أيضًا. لم يتغير شيء.');return}
  try{
   const remote=await fetchRemote();
   const revision=await pushRemote(remote.revision,next);
   state=next;sync={rev:revision,base:deepClone(next),dirty:false,userId:token.userId};
  }catch(err){notice('فشل تصفير السحابة، ولم يتم تغيير البيانات المحلية: '+(err.message||''));return}
 }else{
  // The signed-out local reset is not represented as a clean cloud state.
  state=next;sync={...initialSync(),dirty:true,userId:sync.userId||null};
 }
 selectedAudit=null;editAudit=null;editBuffer=null;page='current';query='';
 if(!persist(false)){notice('فشل الحفظ المحلي. لم يتم حذف النسخة الاحتياطية.');return}
 closeModal();render();notice('تم التصفير ورجعت الـ29 صنف، والكميات والأسعار والجرد السابق فاضية.');
}
async function fetchRemote(){const user=token?.userId;if(!user)throw new Error('حساب الجرد مش معروف. سجل دخول الأول.');const data=await apiFetch('/rest/v1/inventory_documents?select=revision,snapshot&owner_id=eq.'+encodeURIComponent(user),{auth:true});
 if(!Array.isArray(data))throw new Error('رد السيرفر غير متوقع. تأكد من تثبيت الجدول وRLS.');return data.length?{revision:Number(data[0].revision),snapshot:data[0].snapshot}:{revision:0,snapshot:blankState()}}
async function pushRemote(expected,snapshot){const result=await apiFetch('/rest/v1/rpc/inventory_commit',{method:'POST',body:{expected_revision:expected,new_snapshot:snapshot},auth:true});
 const row=Array.isArray(result)?result[0]:result;if(!row||!Number.isInteger(Number(row.revision)))throw new Error('رد السيرفر مش واضح؛ البيانات المحلية محفوظة. راجع المزامنة قبل المحاولة التالية.');return Number(row.revision)}
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const hasIdArray=x=>Array.isArray(x)&&x.every(z=>isObj(z)&&typeof z.id==='string');
function mergeThree(base,local,remote,path=[],conflicts=[]){
 if(equal(local,remote))return deepCloneOrMissing(local);
 if(equal(local,base))return deepCloneOrMissing(remote);
 if(equal(remote,base))return deepCloneOrMissing(local);
 if(path.join('.')==='draft'&&local?.id!==remote?.id){conflicts.push({path,local,remote});return deepCloneOrMissing(remote)}
 if((local===undefined||remote===undefined)&&!equal(local,remote)){conflicts.push({path,local,remote});return deepCloneOrMissing(remote)}
 if(Array.isArray(local)&&Array.isArray(remote)&&[base||[],local,remote].every(hasIdArray)){
   const b=new Map((base||[]).map(x=>[x.id,x])),l=new Map(local.map(x=>[x.id,x])),r=new Map(remote.map(x=>[x.id,x]));
   const keys=[...new Set([...r.keys(),...l.keys(),...b.keys()])];return keys.map(k=>mergeThree(b.get(k),l.get(k),r.get(k),[...path,k],conflicts)).filter(x=>x!==undefined)
 }
 if(isObj(local)&&isObj(remote)&&(isObj(base)||base===undefined)){
   const all=[...new Set([...Object.keys(remote),...Object.keys(local),...Object.keys(base||{})])];const o={};
   for(const key of all){const v=mergeThree(base?.[key],local[key],remote[key],[...path,key],conflicts);if(v!==undefined)o[key]=v}return o
 }
 conflicts.push({path,local,remote});return deepCloneOrMissing(remote)
}
function deepCloneOrMissing(x){return x===undefined?undefined:deepClone(x)}
function atPath(root,parts){let value=root;for(const p of parts){if(Array.isArray(value))value=value.find(x=>x.id===p);else value=value?.[p]}return value}
function applyChoice(root,path,value){let o=root;for(let i=0;i<path.length-1;i++){o=Array.isArray(o)?o.find(x=>x.id===path[i]):o?.[path[i]];if(o===undefined)return}const key=path.at(-1);if(Array.isArray(o)){const idx=o.findIndex(x=>x.id===key);if(value===undefined){if(idx>=0)o.splice(idx,1)}else if(idx>=0)o[idx]=deepClone(value);else o.push(deepClone(value))}else if(value===undefined)delete o[key];else o[key]=deepClone(value)}
function readablePath(path,local,remote){const field=path.at(-1);const fields={qty:'الكمية',price:'سعر الشراء',unit:'الوحدة',name:'الاسم',categoryName:'الفئة',id:'هوية المسودة',draft:'مسودة الجرد',completedAt:'تاريخ الجرد',rows:'صفوف الجرد',variants:'العبوات'};let name='';
 for(const obj of [local,remote]){for(const group of [...(obj?.draft?.rows||[]),...(obj?.products||[]),...(obj?.audits||[]).flatMap(a=>a.rows||[])]){if(path.includes(group.id))name=group.name||name}}
 return(name?name+' — ':'')+(fields[field]||field||'البيانات')}
function conflictLabel(v){if(v===undefined)return'محذوف';if(v===null)return'بدون';if(typeof v==='object')return JSON.stringify(v).slice(0,130);return String(v)}
let pendingMerge=null;
function showConflicts(remote,merged,conflicts){pendingMerge={remote,merged,conflicts,local:deepClone(state)};
 let html=`<div class="conflict"><strong>اتوجد ${conflicts.length} تعارض بين الجهاز والسيرفر.</strong><p>لا حاجة اتمسحت. هنعمل نسخة أمان قبل التطبيق. اختار القيمة اللي عايزها في كل تعارض، وبعدها اضغط حفظ ومزامنة.</p></div><div style="max-height:48vh;overflow:auto">`;
 conflicts.forEach((c,i)=>{html+=`<div class="choice-line"><strong>${i+1}. ${e(readablePath(c.path,state,remote.snapshot))}</strong><div class="field"><label>اختار القيمة الصحيحة</label><select data-conflict-choice="${i}"><option value="remote">السيرفر: ${e(conflictLabel(c.remote))}</option><option value="local">الجهاز: ${e(conflictLabel(c.local))}</option></select></div></div>`});
 html+=`</div><div class="modal-actions"><button class="btn primary" data-action="conflict-apply">حفظ القرارات ومزامنة</button><button class="btn muted" data-action="close-modal">إلغاء — احتفظ بالبيانات</button></div>`;modal('حل تعارض المزامنة',html)
}
let syncing=false;
async function syncNow(){if(syncing)return;syncing=true;try{
 readCloudFields();await ensureAuth();const remote=await fetchRemote();if(!validState(remote.snapshot))throw new Error('بيانات السيرفر غير متوافقة. مش هنستبدل بيانات الجهاز.');
 if(remote.revision===sync.rev){
   if(sync.dirty || (remote.revision===0 && state.products.length>0)){const newRev=await pushRemote(remote.revision,deepClone(state));sync.rev=newRev;sync.base=deepClone(state);sync.dirty=false;persist(false);notice('تم رفع بيانات الجرد بنجاح.')}
   else if(remote.revision===0&&state.products.length===0){notice('لسه مفيش بيانات للمزامنة.')}
   else notice('الجهاز والسيرفر متزامنين بالفعل.');
   openSyncModal();return;
 }
 if(!sync.dirty){saveSnapshotBackup('قبل تنزيل آخر بيانات السيرفر');state=deepClone(remote.snapshot);sync.rev=remote.revision;sync.base=deepClone(state);sync.dirty=false;selectedAudit=null;editAudit=null;persist(false);closeModal();render();notice('تم تنزيل آخر جرد من السيرفر، من غير أي تعديل مالي.');return}
 const conflicts=[];const merged=mergeThree(sync.base||blankState(),state,remote.snapshot,[],conflicts);
 if(!conflicts.length){saveSnapshotBackup('قبل دمج تحديثات الأجهزة');const newRev=await pushRemote(remote.revision,merged);state=deepClone(merged);sync.rev=newRev;sync.base=deepClone(state);sync.dirty=false;selectedAudit=null;editAudit=null;persist(false);closeModal();render();notice('تم دمج التعديلات من الجهازين ومزامنتها بنجاح.');return}
 showConflicts(remote,merged,conflicts)
 }catch(err){notice(err.message||'المزامنة لم تكتمل، والبيانات محفوظة محليًا.');console.error(err)}finally{syncing=false}}

async function resolveConflicts(){if(!pendingMerge)return;const req=pendingMerge;for(let i=0;i<req.conflicts.length;i++){const choice=document.querySelector(`[data-conflict-choice="${i}"]`)?.value;if(choice==='local')applyChoice(req.merged,req.conflicts[i].path,req.conflicts[i].local)}
 try{saveSnapshotBackup('قبل حل تعارض بين جهازين');const rev=await pushRemote(req.remote.revision,req.merged);state=deepClone(req.merged);sync.rev=rev;sync.base=deepClone(state);sync.dirty=false;pendingMerge=null;editAudit=null;selectedAudit=null;page='current';persist(false);closeModal();render();notice('اتحلت التعارضات واتحفظ الجرد على السيرفر.')}catch(err){notice(err.message||'لم تنجح المزامنة، كل البيانات ما زالت محفوظة محليًا.')}
}
async function performAuth(action){try{readCloudFields();await authPassword(action,cloud.email,$('#cloud-password').value)}catch(err){notice(err.message);console.error(err)}}

/* UI events; all destructive actions require an explicit confirmation. */
document.addEventListener('click',async event=>{
 const nav=event.target.closest('[data-page]');if(nav){if(editAudit&&nav.dataset.page!==page&&!confirm('التغييرات غير المحفوظة في الجرد القديم هتتلغي، تكمل؟'))return;page=nav.dataset.page;editAudit=null;editBuffer=null;selectedAudit=null;query='';render();return}
 const el=event.target.closest('[data-action]');if(!el)return;const act=el.dataset.action,id=el.dataset.id;
 try{switch(act){
 case 'close-modal':closeModal();pendingMerge=null;break;
 case 'product-add':openProductForm();break;
 case 'product-edit':openProductForm(id);break;
 case 'product-delete':deleteProduct(id);break;
 case 'add-variant':addVariant(id);break;
 case 'delete-variant':deleteVariant(id,el.dataset.variant);break;
 case 'manage-categories':openCategoryModal();break;
 case 'category-create':{const c=createCategory($('#new-category-name')?.value||'');if(c){openCategoryModal();render();notice('اتضافت الفئة.')}break}
 case 'category-rename':renameCategory(id);break;
 case 'category-delete':deleteCategory(id);break;
 case 'category-add-inline':{const name=prompt('اسم الفئة الجديدة:');if(name!==null){const c=createCategory(name);if(c){const select=$('#product-category');select.insertAdjacentHTML('beforeend',`<option value="${e(c.id)}">${e(c.name)}</option>`);select.value=c.id;notice('اتضافت الفئة.')}}break}
 case 'variant-form-add':{const holder=$('#variant-form-rows'),used=[...holder.querySelectorAll('.variant-unit')].map(e=>e.value),unit=UNITS.find(u=>!used.includes(u));if(!unit)return notice('كل الوحدات مستخدمة.');holder.insertAdjacentHTML('beforeend',variantFormRow({id:uniqueId(),unit,price:''}));break}
 case 'variant-form-delete':{const holder=$('#variant-form-rows');if(holder.children.length<=1)return notice('لازم وحدة واحدة على الأقل.');el.closest('.unit-row').remove();break}




 case 'profit-add':state.profit.entries.push({id:uniqueId(),name:'بند جديد',amount:'',sign:1});persist();render();break;
 case 'profit-delete':{const item=state.profit.entries.find(x=>x.id===id);if(item&&confirm('حذف بند «'+item.name+'» من حساب صافي الربح؟')){state.profit.entries=state.profit.entries.filter(x=>x.id!==id);persist();render()}break}
 case 'finish-audit':finishAudit();break;
 case 'history-list':selectedAudit=null;render();break;
 case 'history-open':selectedAudit=id;query='';render();break;
 case 'history-edit':{const archive=state.audits.find(x=>x.id===id);if(!archive)return;editAudit=id;editBuffer=deepClone(archive);page='current';selectedAudit=id;query='';render();break}
 case 'save-history':updateArchivedAudit();break;
 case 'cancel-history-edit':editAudit=null;editBuffer=null;page='history';render();break;
 case 'export-audit':exportXlsx(id);break;
 case 'export-latest':{const a=state.audits.at(-1);if(a)exportXlsx(a.id);break}
 case 'cloud-save':readCloudFields();notice('اتحفظت إعدادات الاتصال على الجهاز.');break;
 case 'cloud-login':await performAuth('login');break;
 case 'cloud-signup':await performAuth('signup');break;
 case 'cloud-sync':await syncNow();break;
 case 'conflict-apply':await resolveConflicts();break;
 case 'backup-export':openExportBackup();break;
 case 'backup-restore':openRestoreBackup();break;
 case 'factory-reset':await factoryReset();break;
 case 'restore-file-run':await restoreBackup();break;
 default:break
 }}catch(err){console.error(err);notice(err.message||'حصل خطأ؛ بيانات الجهاز لسه محفوظة.')}
});
document.addEventListener('submit',event=>{if(event.target.id==='product-form'){event.preventDefault();saveProduct(event.target)}});
document.addEventListener('input',event=>{
 const el=event.target;
 if(el.id==='profit-hospitality'){state.profit.hospitality=el.value;persist();return}
 if(el.dataset.profitId&&el.dataset.profitField!=='sign'){const item=state.profit.entries.find(x=>x.id===el.dataset.profitId);if(item){item[el.dataset.profitField]=el.value;persist();updateProfitTotal()}return}
 if(el.id==='product-search'){
   query=el.value;const start=el.selectionStart,end=el.selectionEnd;render();const input=$('#product-search');input?.focus();if(input)input.setSelectionRange(start,end);return
 }
 if(el.dataset.action==='edit-field'){
   const ctx=el.dataset.ctx,variant=el.dataset.variant,field=el.dataset.field;setRowValue(null,variant,field,el.value,ctx==='archive');return
 }
});
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.dataset.profitId&&el.dataset.profitField==='sign'){const item=state.profit.entries.find(x=>x.id===el.dataset.profitId);if(item){item.sign=Number(el.value)===-1?-1:1;persist();updateProfitTotal()}return}
 if(el.dataset.action==='edit-unit')changeVariantUnit(el.dataset.variant,el.value);
 if(el.matches('.variant-unit')){const row=el.closest('.unit-row');if(row){const p=row.querySelector('.variant-price');if(p)p.value=''}}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#overlay'))closeModal()});
document.addEventListener('click',event=>{if(event.target.id==='overlay')closeModal()});
$('#sync-open').addEventListener('click',openSyncModal);
window.addEventListener('storage',e=>{if(e.key===DB_KEY&&e.newValue!==JSON.stringify(state)){hasTabCollision=true;notice('في تعديل من تبويب تاني. حدّث الصفحة أولًا عشان متكتبش فوق البيانات الجديدة.')}});
if(!validState(state)){state=deepClone(SEED_STATE);state.profit=defaultProfit();sync=initialSync();persist(false)}
// Repair a previously saved empty local catalog (Safari/PWA storage can be separate).
// Do not overwrite real inventory, previous counts, or a nonempty catalog.
if(state.products.length===0 && state.audits.length===0 &&
   (!state.draft || !state.draft.rows || state.draft.rows.length===0)){
  state.categories=deepClone(SEED_STATE.categories);
  state.products=deepClone(SEED_STATE.products);
  state.draft=null;
  state.importCompleted=true;
  sync.dirty=true;
  persist(false);
}
updateIndicators();render();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('SW:',err)));
window.__gardTest={getState:()=>deepClone(state),getSync:()=>deepClone(sync),auditTotal,makeXlsx,mergeThree,validState};

