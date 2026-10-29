(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
function put(o,p,v){const keys=p.split('.');let a=o;for(const k of keys.slice(0,-1))a=a[k]??={};a[keys.at(-1)]=v;}
const SAFE=/^(silver|health|renown|heat|morality|stats\.(martial|business|learning|strategy|charm|insight|constitution|luck)|routes\.[a-z]+|factions\.[a-z]+|relations\.[a-z]+|inventory\.[a-z][a-z0-9_]*|flags\.[a-z][a-z0-9_]*)$/;
const BAD=new Set(['__proto__','prototype','constructor']);
function safePath(p){return typeof p==='string'&&SAFE.test(p)&&!p.split('.').some(k=>BAD.has(k));}
class Game {
 constructor(world,events,rng=Math.random){this.w=world;this.events=events;this.rng=rng;this.s=null;}
 random(a){return a[Math.floor(this.rng()*a.length)];}
 create(){
  const o=this.random(this.w.origins),t=this.random(this.w.talents),stats={};
  for(const k in this.w.stats)stats[k]=Math.min(85,25+Math.floor(this.rng()*26)+(o.mods[k]||0)+(t.stat===k?10:0));
  const surname=this.random(['顾','陆','裴','沈','贺','柳','江','楚','叶','宁']);
  const name=surname+this.random(['行舟','知微','怀瑾','长宁','月白','照野','听澜','见山','明棠','归鸿']);
  this.s={version:2,started:false,name,gender:this.random(['男','女']),age:18+Math.floor(this.rng()*9),origin:o.id,talent:t.name,stats,day:1,energy:3,silver:o.silver,health:100,renown:0,heat:0,morality:0,city:o.city,routes:Object.fromEntries(this.w.routes.map(r=>[r.id,0])),factions:Object.fromEntries(this.w.factions.map(f=>[f.id,0])),relations:Object.fromEntries(this.w.people.map(p=>[p.id,0])),skills:Object.fromEntries(this.w.skills.map(k=>[k.id,0])),inventory:{[o.item]:o.item==='medicine'?2:1},assets:[],flags:{},seen:{},recent:[],due:[],pending:null,lastResult:null,log:[],mainRoute:null,workDay:0};
  return this.s;
 }
 start(name){if(!this.s)this.create();this.s.started=true;this.s.name=(name||this.s.name).trim().slice(0,16)||this.s.name;this.log('命途初开',`${this.s.name}从${this.city().name}启程。出身给了你起点，往后的道路由选择写成。`);this.open('common-letter');}
 city(){return this.w.cities.find(c=>c.id===this.s.city);}
 route(){return this.w.routes.find(r=>r.id===this.s.mainRoute);}
 routeLevel(id){return Math.min(4,Math.floor((this.s.routes[id]||0)/25));}
 capacity(){return 30+this.s.assets.filter(a=>a.id==='warehouse').reduce((n,a)=>n+a.level*20,0);}
 cargo(){return this.w.goods.reduce((n,g)=>n+(this.s.inventory[g.id]||0),0);}
 log(title,text){this.s.log.unshift({day:this.s.day,title,text});this.s.log=this.s.log.slice(0,180);}
 settleRoute(){
  const a=Object.entries(this.s.routes).sort((x,y)=>y[1]-x[1]),old=this.s.mainRoute;
  if(a[0][1]>=8&&(!old||a[0][0]===old||a[0][1]>=(this.s.routes[old]||0)+4))this.s.mainRoute=a[0][0];
  if(old!==this.s.mainRoute&&this.s.mainRoute)this.log('道路渐明',`你近日的行事，让人开始以“${this.route().name}中人”称呼你。保持其他道路的往来，命途仍会改变。`);
 }
 apply(e={}){
  for(const [p,v]of Object.entries(e)){
   if(!safePath(p))throw Error('不支持的效果字段：'+p);
   if(p.startsWith('flags.'))put(this.s,p,v);
   else {let n=(get(this.s,p)||0)+v;if(p==='silver'||p.startsWith('inventory.')||p.startsWith('routes.'))n=Math.max(0,n);if(p==='health'||p.startsWith('stats.'))n=clamp(n,0,100);if(p.startsWith('relations.')||p.startsWith('factions.'))n=clamp(n,-100,100);if(p==='heat')n=clamp(n,0,100);if(p==='morality')n=clamp(n,-100,100);put(this.s,p,n);}
  }
  this.settleRoute();
 }
 meets(c){
  if(!c)return true;
  if(c.route&&c.route!==this.s.mainRoute)return false;
  if(c.cities&&!c.cities.includes(this.s.city))return false;
  if(c.tags&&!c.tags.some(t=>this.city().tags.includes(t)))return false;
  if(c.min&&Object.entries(c.min).some(([k,v])=>(get(this.s,k)||0)<v))return false;
  if(c.max&&Object.entries(c.max).some(([k,v])=>(get(this.s,k)||0)>v))return false;
  if(c.flags&&Object.entries(c.flags).some(([k,v])=>this.s.flags[k]!==v))return false;
  if(c.seen&&c.seen.some(id=>!this.s.seen[id]))return false;
  if(c.notSeen&&c.notSeen.some(id=>this.s.seen[id]))return false;
  return true;
 }
 eligible(e){return this.meets(e.when)&&(!e.once||!this.s.seen[e.id])&&(!e.cooldown||!this.s.seen[e.id]||this.s.day-this.s.seen[e.id]>=e.cooldown);}
 availableStories(){return this.events.filter(e=>e.kind==='story'&&this.eligible(e)&&e.id!=='common-letter');}
 probability(c){if(!c.check)return 1;return clamp(.5+((this.s.stats[c.check.stat]||0)-c.check.difficulty)/85+(this.s.stats.luck-40)/600,.12,.94);}
 canChoose(c){return this.meets(c.requires)&&Object.entries(c.cost||{}).every(([p,n])=>(get(this.s,p)||0)>=n);}
 open(id){const e=this.events.find(e=>e.id===id);if(!e)return false;this.s.pending=id;return true;}
 event(){return this.events.find(e=>e.id===this.s.pending);}
 dispatch(route){
  const due=this.s.due.find(d=>d.day<=this.s.day&&!this.s.seen[d.id]);
  if(due){this.s.due=this.s.due.filter(d=>d!==due);return this.open(due.id);}
  const stories=this.availableStories().filter(e=>!route||e.routes.includes(route)||e.routes.length>1||e.routes.includes('all'));
  if(stories.length&&this.rng()<.52){return this.open(stories.sort((a,b)=>(a.order||0)-(b.order||0))[0].id);}
  let pool=this.events.filter(e=>e.kind==='random'&&this.eligible(e)&&!this.s.recent.includes(e.id));
  if(!pool.length)pool=this.events.filter(e=>e.kind==='random'&&this.eligible(e));
  if(!pool.length)return false;
  const weight=e=>(e.weight||1)*(e.routes.includes('all')?1.5:e.routes.includes(route)?4:e.routes.includes(this.s.mainRoute)?3:0.75);
  let roll=this.rng()*pool.reduce((n,e)=>n+weight(e),0);
  return this.open((pool.find(e=>(roll-=weight(e))<=0)||pool.at(-1)).id);
 }
 choose(index){
  const e=this.event(),c=e?.choices[index];if(!c||!this.canChoose(c))return {ok:false,message:'条件或资源不足。'};
  for(const [p,n]of Object.entries(c.cost||{}))this.apply({[p]:-n});
  const p=this.probability(c),pass=!c.check||this.rng()<p;
  this.apply(c.effects);const outcome=pass?c.success:c.failure;this.apply(outcome?.effects);
  this.s.seen[e.id]=this.s.day;this.s.recent=[e.id,...this.s.recent.filter(id=>id!==e.id)].slice(0,12);this.s.pending=null;
  const text=outcome?.text||c.text||'你作出了自己的选择。';
  this.s.lastResult={title:e.title,choice:c.label,text,pass,check:c.check?`${this.w.stats[c.check.stat]}判定 · ${Math.round(p*100)}%`:'',effects:{...c.effects,...outcome?.effects},cost:c.cost||{}};
  this.log(e.title,`${c.label}。${text}`);
  const delayed=outcome?.delay||c.delay;if(delayed)this.s.due.push({id:delayed.id,day:this.s.day+delayed.days});
  const next=outcome?.next||c.next;if(next)this.open(next);
  this.rescue();return {ok:true,...this.s.lastResult};
 }
 ready(){return !!this.s?.started&&!this.s.pending&&this.s.energy>0;}
 act(route){if(!this.ready()||!this.w.routes.some(r=>r.id===route))return false;this.s.energy--;this.apply({['routes.'+route]:1});this.dispatch(route);return true;}
 practice(id){
  const k=this.w.skills.find(k=>k.id===id);if(!this.ready()||!k)return false;
  this.s.energy--;this.s.skills[id]=clamp(this.s.skills[id]+4,0,100);this.apply({['stats.'+k.stat]:1,['routes.'+k.route]:2,...(id==='breath'?{health:4}:{})});
  this.s.lastResult={title:'修习 · '+k.name,text:`你静心修习，${this.w.stats[k.stat]}提高了 1 点，熟练度提高了 4 点。`,effects:{}};this.log('修习本领',this.s.lastResult.text);return true;
 }
 work(){if(!this.ready())return false;this.s.energy--;const income=18+Math.floor(this.s.stats.constitution/10);this.apply({silver:income});this.log('短工谋生',`替脚行卸货半日，净得 ${income} 两。世道再难，也有不必站队的活计。`);this.s.lastResult={title:'靠双手吃饭',text:`获得 ${income} 两，消耗 1 行动。`,effects:{silver:income}};return true;}
 price(id,buy=true){const g=this.w.goods.find(g=>g.id===id);if(!g)return 0;const variation=1+Math.sin(this.s.day*.49+this.w.cities.indexOf(this.city())*.8+this.w.goods.indexOf(g))*.13;const discount=clamp(this.s.stats.business/1000,0,.1);return Math.max(1,Math.round(g.base*this.city().goods[id]*variation*(buy?1.08-discount:.88+discount)));}
 trade(id,qty,buy){
  if(!this.ready()||!this.w.goods.some(g=>g.id===id)||!Number.isInteger(qty)||qty<1||qty>999)return false;
  const price=this.price(id,buy)*qty,have=this.s.inventory[id]||0;
  if(buy&&(this.s.silver<price||this.cargo()+qty>this.capacity())||!buy&&have<qty)return false;
  this.s.energy--;this.apply({silver:buy?-price:price,['inventory.'+id]:buy?qty:-qty,'routes.trade':2});const g=this.w.goods.find(g=>g.id===id);
  this.log(buy?'购入货物':'售出货物',`${this.city().name}：${g.name} ${qty} ${g.unit}，${buy?'花费':'收得'} ${price} 两。`);this.s.lastResult={title:'银货两讫',text:`${buy?'购入':'售出'}${g.name} ${qty} ${g.unit}。${buy?'去别处看看价差，记得算上路费。':'账面入账不等于纯利，别忘记本金。'}`,effects:{}};return true;
 }
 build(id){
  const b=this.w.buildings.find(b=>b.id===id);if(!b||!this.ready())return false;let a=this.s.assets.find(a=>a.id===id&&a.city===this.s.city);const cost=Math.round(b.cost*(1+(a?.level||0)*.7));if(this.s.silver<cost||(a?.level||0)>=5)return false;
  this.s.silver-=cost;this.s.energy--;if(a)a.level++;else this.s.assets.push({id,city:this.s.city,level:1});this.apply({'routes.trade':2});this.log('置办家业',`${this.city().name}的${b.name}升至 ${a?.level||1} 级，花费 ${cost} 两。`);return true;
 }
 travel(id){
  const c=this.w.cities.find(c=>c.id===id);if(!c||!this.ready()||!this.city().links.includes(id)||this.s.silver<8)return false;
  const from=this.city().name;this.s.silver-=8;this.s.energy--;this.s.city=id;this.tick(false);this.log('行旅',`从${from}来到${c.name}，路费 8 两，历时 1 日。${c.desc}`);
  this.s.lastResult={title:'抵达 · '+c.name,text:c.desc,effects:{}};
  if(this.rng()<.6)this.dispatch();return true;
 }
 visit(id){const p=this.w.people.find(p=>p.id===id);if(!p||p.city!==this.s.city||!this.ready())return false;this.s.energy--;this.apply({['relations.'+id]:5+Math.floor(this.s.stats.charm/20),['factions.'+p.faction]:2});this.log('人物往来',`与${p.name}在${this.city().name}叙话。${p.text}`);this.s.lastResult={title:'故人新交 · '+p.name,text:'来往增进了信任。这份信任可能在别的故事里打开新的选择。',effects:{}};return true;}
 useMedicine(){if(!this.s||!this.s.started||this.s.pending||!(this.s.inventory.medicine>0)||this.s.health>=100)return false;this.apply({'inventory.medicine':-1,health:20});this.log('服药调养','用去一箱药材或一份伤药，健康恢复 20 点。');return true;}
 tick(allowEvent=true){
  this.s.day++;this.s.energy=3;
  let net=0;for(const a of this.s.assets){const b=this.w.buildings.find(b=>b.id===a.id);net+=(b.income-b.upkeep)*a.level;if(b.goods){const room=Math.max(0,this.capacity()-this.cargo());this.apply({['inventory.'+b.goods]:Math.min(a.level,room)});}}
  const living=5;this.apply({silver:net-living,health:this.s.silver+net>=living?5:-4,heat:-2});
  if(net)this.log('家业结算',`产业合计净入 ${net} 两；另扣生活费 ${living} 两。`);
  if(this.s.heat>=45&&this.s.day%3===0){this.apply({silver:-15});this.log('风声渐紧','通缉与盘查让你多付了 15 两打点费。降低恶名才能减轻追索。');}
  this.rescue();if(allowEvent){const due=this.s.due.find(d=>d.day<=this.s.day&&!this.s.seen[d.id]);if(due){this.s.due=this.s.due.filter(d=>d!==due);this.open(due.id);}else if(this.rng()<.35)this.dispatch();}
 }
 endDay(){if(!this.s?.started||this.s.pending)return false;this.tick();return true;}
 rescue(){if(this.s.health<=0){this.s.health=35;this.s.silver=Math.floor(this.s.silver*.6);this.log('险死还生','路人将重伤的你送入医馆。医药费取走了四成现银，养伤后健康恢复至 35。');}}
 load(s){
  if(!s||s.version!==2||typeof s.name!=='string'||!s.name.trim()||s.name.length>16||!this.w.cities.some(c=>c.id===s.city))throw Error('这不是当前版本的存档。旧版原型可在 legacy-v1 中打开。');
  const clean=clone(s);for(const k of ['routes','stats','factions','relations','inventory','skills','flags','seen'])if(!clean[k]||typeof clean[k]!=='object'||Array.isArray(clean[k]))throw Error('存档缺少字段：'+k);
  const scan=x=>{if(!x||typeof x!=='object')return;for(const [k,v]of Object.entries(x)){if(BAD.has(k))throw Error('存档含有无效字段');scan(v);}};scan(clean);
  for(const k of ['day','energy','silver','health','renown','heat','morality'])if(!Number.isFinite(clean[k]))throw Error('存档数值无效：'+k);
  for(const id of Object.keys(this.w.stats))if(!Number.isFinite(clean.stats[id])||clean.stats[id]<0||clean.stats[id]>100)throw Error('属性无效');
  if(!this.w.origins.some(o=>o.id===clean.origin)||!this.w.talents.some(t=>t.name===clean.talent)||!['男','女'].includes(clean.gender)||!Number.isInteger(clean.age)||clean.age<18||typeof clean.started!=='boolean')throw Error('人物档案无效');
  for(const [field,ids]of [['routes',this.w.routes.map(x=>x.id)],['skills',this.w.skills.map(x=>x.id)],['factions',this.w.factions.map(x=>x.id)],['relations',this.w.people.map(x=>x.id)]])for(const id of ids)if(!Number.isFinite(clean[field][id]))throw Error('存档缺少数值：'+field+'.'+id);
  for(const k of ['routes','factions','relations','inventory','skills','seen'])for(const v of Object.values(clean[k]))if(!Number.isFinite(v))throw Error('存档数值无效');
  if(!Array.isArray(clean.assets)||clean.assets.some(a=>!this.w.buildings.some(b=>b.id===a.id)||!this.w.cities.some(c=>c.id===a.city)||!Number.isInteger(a.level)||a.level<1||a.level>5))throw Error('产业存档无效');
  if(!Array.isArray(clean.log)||clean.log.some(l=>!l||!Number.isFinite(l.day)||typeof l.title!=='string'||typeof l.text!=='string')||!Array.isArray(clean.due)||!Array.isArray(clean.recent)||!Number.isInteger(clean.energy)||clean.energy<0||clean.energy>3||!Number.isInteger(clean.day)||clean.day<1||clean.silver<0||clean.health<0||clean.health>100)throw Error('存档结构无效');
  if(clean.mainRoute!==null&&!this.w.routes.some(r=>r.id===clean.mainRoute))throw Error('存档道路无效');
  if(clean.pending&&!this.events.some(e=>e.id===clean.pending))throw Error('存档所需的事件不在当前内容库，请先导入相应内容包。');
  if(clean.due.some(d=>!this.events.some(e=>e.id===d.id)||!Number.isFinite(d.day)))throw Error('存档有缺失的后续事件，请先导入相应内容包。');
  this.s=clean;return clean;
 }
}
function validatePack(pack,world,existing=[]){
 const errors=[];if(!pack||pack.formatVersion!==1||!Array.isArray(pack.events)){return ['内容包需要 formatVersion: 1 和 events 数组。'];}
 const ids=new Set(existing.map(e=>e.id)),allIds=new Set([...ids,...pack.events.map(e=>e.id)]),routes=new Set([...world.routes.map(r=>r.id),'all']);
 function effect(x,at,cost=false){if(x===undefined)return;if(!x||typeof x!=='object'||Array.isArray(x)){errors.push(at+' 必须是对象');return;}for(const [p,v]of Object.entries(x)){if(!safePath(p))errors.push(at+' 字段不合法：'+p);if(p.startsWith('flags.')){if(!['boolean','string','number'].includes(typeof v)||cost)errors.push(at+' 标记值不合法');}else if(!Number.isFinite(v)||(cost&&v<0))errors.push(at+' 数值无效：'+p);const [kind,id]=p.split('.');if(kind==='routes'&&!routes.has(id))errors.push(at+' 未知道路：'+id);if(kind==='factions'&&!world.factions.some(f=>f.id===id))errors.push(at+' 未知势力：'+id);if(kind==='relations'&&!world.people.some(n=>n.id===id))errors.push(at+' 未知人物：'+id);}}
 function condition(c,at){if(!c)return;if(typeof c!=='object'||Array.isArray(c)){errors.push(at+' 条件必须是对象');return;}for(const k of Object.keys(c))if(!['min','max','route','cities','tags','flags','seen','notSeen'].includes(k))errors.push(at+' 未知条件：'+k);for(const k of ['min','max'])if(c[k]){const conditions={...c[k]};for(const key of ['day','energy'])if(key in conditions){if(!Number.isFinite(conditions[key]))errors.push(at+' 条件数值无效');delete conditions[key];}effect(conditions,at+'.'+k);}if(c.route&&!routes.has(c.route))errors.push(at+' 未知道路');if(c.cities&&(!Array.isArray(c.cities)||c.cities.some(id=>!world.cities.some(c=>c.id===id))))errors.push(at+' 城市引用无效');for(const k of ['seen','notSeen'])if(c[k]&&(!Array.isArray(c[k])||c[k].some(id=>!allIds.has(id))))errors.push(at+' 事件前置无效');if(c.tags&&(!Array.isArray(c.tags)||c.tags.some(t=>!world.cities.some(c=>c.tags.includes(t)))))errors.push(at+' 地域标签无效');if(c.flags&&(!Object.keys(c.flags).every(k=>safePath('flags.'+k))))errors.push(at+' 标记无效');}
 function follow(x,at){if(!x)return;if(x.next&&!allIds.has(x.next))errors.push(at+' 后续事件不存在：'+x.next);if(x.delay&&(!allIds.has(x.delay.id)||!Number.isInteger(x.delay.days)||x.delay.days<1))errors.push(at+' 延迟事件无效');}
 for(const e of pack.events){
  const at=e.id||'未命名事件';if(!/^[a-z][a-z0-9-]{1,79}$/.test(e.id||'')||ids.has(e.id))errors.push(at+' ID 无效或重复');ids.add(e.id);
  if(!['random','story','followup'].includes(e.kind))errors.push(at+' kind 无效');
  if(typeof e.title!=='string'||typeof e.text!=='string'||!e.text.trim())errors.push(at+' 缺少标题或正文');
  if(!Array.isArray(e.routes)||!e.routes.length||e.routes.some(r=>!routes.has(r)))errors.push(at+' 道路无效');
  if(e.weight!==undefined&&(!Number.isFinite(e.weight)||e.weight<=0))errors.push(at+' 权重无效');
  condition(e.when,at+'.when');
  if(!Array.isArray(e.choices)||e.choices.length<2||e.choices.length>6){errors.push(at+' 应有 2—6 个选择');continue;}
  if(!e.choices.some(c=>!c.requires&&!c.cost))errors.push(at+' 至少一个选择须无门槛，以免卡住');
  e.choices.forEach((c,i)=>{const loc=at+'.choices['+i+']';if(typeof c.label!=='string')errors.push(loc+' 缺少选项文字');effect(c.effects,loc);effect(c.cost,loc+'.cost',true);condition(c.requires,loc);follow(c,loc);if(c.check&&(!world.stats[c.check.stat]||!Number.isFinite(c.check.difficulty)||!c.success||!c.failure))errors.push(loc+' 判定需要有效属性、难度与成功/失败结果');for(const k of ['success','failure'])if(c[k]){if(typeof c[k].text!=='string')errors.push(loc+' 缺少结果正文');effect(c[k].effects,loc+'.'+k);follow(c[k],loc+'.'+k);}if(!c.check&&typeof c.text!=='string')errors.push(loc+' 缺少选择结果 text');});
 }
 return errors;
}
const api={Game,validatePack,get,clone};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ShanheEngine=api;
})(typeof window!=='undefined'?window:globalThis);
