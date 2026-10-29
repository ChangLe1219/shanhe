(function(root){
'use strict';
function install(Game){
const P=Game.prototype,base={};for(const k of ['create','start','load','ready','apply','event','choose','probability','build','act','useMedicine'])base[k]=P[k];
const cp=x=>JSON.parse(JSON.stringify(x)),cap=(v,a,b)=>Math.max(a,Math.min(b,v));
const ACHIEVEMENTS=[
 {id:'first-step',category:'江湖人生',icon:'行',name:'初入江湖',desc:'开始你的第一段人生。',goal:1,measure:g=>Number(g.s.started)},
 {id:'first-choice',category:'江湖人生',icon:'择',name:'落下第一子',desc:'作出一次会留下回响的选择。',goal:1,measure:g=>g.s.achievementBook.stats.choices},
 {id:'hundred-choices',category:'江湖人生',icon:'卷',name:'百转人生',desc:'累计作出一百次选择。',goal:100,measure:g=>g.s.achievementBook.stats.choices},
 {id:'many-stories',category:'江湖人生',icon:'闻',name:'见多识广',desc:'亲历四十段不同事件。',goal:40,measure:g=>Object.keys(g.s.seen).length},
 {id:'all-paths',category:'江湖人生',icon:'道',name:'六道皆行',desc:'武道、行商、官路、绿林、学问与医道均有所涉。',goal:6,measure:g=>Object.values(g.s.routes).filter(v=>v>0).length},
 {id:'route-master',category:'江湖人生',icon:'峰',name:'一艺登峰',desc:'任一道路阅历达到一百。',goal:100,measure:g=>Math.max(0,...Object.values(g.s.routes))},
 {id:'first-travel',category:'行旅经营',icon:'途',name:'行路初远',desc:'抵达三座不同城镇。',goal:3,measure:g=>g.s.achievementBook.stats.visitedCities.length},
 {id:'world-traveler',category:'行旅经营',icon:'山',name:'行遍八方',desc:'抵达八座不同城镇。',goal:8,measure:g=>g.s.achievementBook.stats.visitedCities.length},
 {id:'all-cities',category:'行旅经营',icon:'河',name:'踏遍山河',desc:'走过天下十六城。',goal:16,measure:g=>g.s.achievementBook.stats.visitedCities.length},
 {id:'many-trades',category:'行旅经营',icon:'算',name:'铁算盘',desc:'完成五十笔买卖。',goal:50,measure:g=>g.s.achievementBook.stats.tradeDeals},
 {id:'trade-profit',category:'行旅经营',icon:'利',name:'商有厚利',desc:'累计实现买卖毛利五千两。',goal:5000,measure:g=>g.s.achievementBook.stats.tradeProfit},
 {id:'first-estate',category:'行旅经营',icon:'业',name:'开张大吉',desc:'置办第一处产业。',goal:1,measure:g=>g.s.assets.length},
 {id:'estate-network',category:'行旅经营',icon:'铺',name:'遍地生根',desc:'在五座城镇置办产业。',goal:5,measure:g=>new Set(g.s.assets.map(a=>a.city)).size},
 {id:'estate-growth',category:'行旅经营',icon:'兴',name:'百业兴旺',desc:'名下产业总规模达到十级。',goal:10,measure:g=>g.s.assets.reduce((n,a)=>n+a.level,0)},
 {id:'practice-30',category:'修习人脉',icon:'勤',name:'勤学不辍',desc:'完成三十次修习或闭关。',goal:30,measure:g=>g.s.achievementBook.stats.practiceSessions},
 {id:'skill-max',category:'修习人脉',icon:'熟',name:'技近乎道',desc:'任一项本领熟练度达到一百。',goal:100,measure:g=>Math.max(0,...Object.values(g.s.skills))},
 {id:'known-20',category:'修习人脉',icon:'友',name:'四海皆故人',desc:'结识二十位人物。',goal:20,measure:g=>g.s.known.length},
 {id:'close-friend',category:'修习人脉',icon:'信',name:'莫逆之交',desc:'与一位故人好感达到八十。',goal:80,measure:g=>Math.max(0,...Object.values(g.s.relations))},
 {id:'home',category:'家族传承',icon:'家',name:'安家立业',desc:'为家人置办一处宅邸。',goal:1,measure:g=>Number(!!g.s.family.home)},
 {id:'married',category:'家族传承',icon:'缘',name:'良缘相守',desc:'与一位伴侣结为正配。',goal:1,measure:g=>Number(g.s.family.members.some(n=>n.ownerId===g.s.actorId&&['wife','husband'].includes(n.role)))},
 {id:'many-children',category:'家族传承',icon:'子',name:'多子多福',desc:'同一代家主养育十名子女。',goal:10,measure:g=>g.s.family.members.filter(n=>n.fatherId===g.s.actorId||n.motherId===g.s.actorId).length},
 {id:'both-lineages',category:'家族传承',icon:'嫡',name:'嫡庶同堂',desc:'同一代家主留下嫡出与庶出子女。',goal:1,measure:g=>{const k=g.s.family.members.filter(n=>n.fatherId===g.s.actorId||n.motherId===g.s.actorId);return Number(k.some(n=>n.lineage==='嫡')&&k.some(n=>n.lineage==='庶'));}},
 {id:'three-generations',category:'家族传承',icon:'承',name:'三世同堂',desc:'家族传承至第三代。',goal:3,measure:g=>g.s.generation},
 {id:'succession',category:'家族传承',icon:'薪',name:'薪火相传',desc:'完成一次正式传家。',goal:1,measure:g=>g.s.family.history.length},
 {id:'faithful',category:'家族传承',icon:'心',name:'痴情种',desc:'一生只有正配、未纳妾室，并与伴侣相守至人生落幕。',goal:1,measure:g=>{const s=g.s,sp=s.family.members.filter(n=>n.ownerId===s.actorId&&['wife','husband'].includes(n.role)),conc=s.family.members.some(n=>n.ownerId===s.actorId&&n.role==='concubine');return Number(!s.alive&&sp.length>0&&!conc);}},
 {id:'eighty-years',category:'家族传承',icon:'松',name:'松鹤延年',desc:'年满八十岁。',goal:80,measure:g=>g.ageNow()},
 {id:'centenarian',category:'家族传承',icon:'百',name:'百岁老人',desc:'年满一百岁。',goal:100,measure:g=>g.ageNow()},
 {id:'good-name',category:'江湖人生',icon:'名',name:'流芳一方',desc:'江湖声望达到一百。',goal:100,measure:g=>g.s.renown},
 {id:'kind-heart',category:'江湖人生',icon:'善',name:'仁心有报',desc:'善名积累至八十。',goal:80,measure:g=>g.s.morality},
 {id:'notorious',category:'江湖人生',icon:'影',name:'恶名远扬',desc:'恶名积累至八十。',goal:80,measure:g=>g.s.heat}
];
P.setupSystems=function(){
 const s=this.s;s.systemsVersion=5;s.known??=[];s.locations??={};s.letters??=[];s.markets??={};s.basis??={};s.tradeLedger??=[];s.journey??=null;s.incident??=null;s.travelHistory??=[];s.estateLedger??=[];s.estateDay??=0;s.ageAtDay??=1;s.generation??=1;s.actorId??='founder';s.alive??=true;s.legacy??={};s.identities??={office:0,sect:0,sectLeader:false};s.peopleExtra??=[];s.meetCooldown??={};s.brothelVisits??=0;s.redeemedCodes??=[];
 s.family??={home:null,members:[],pregnancies:[],heir:null,history:[],fertility:true};
 s.achievementBook??={unlocked:{},stats:{}};if(!s.achievementBook||typeof s.achievementBook!=='object'||Array.isArray(s.achievementBook))s.achievementBook={unlocked:{},stats:{}};if(!s.achievementBook.unlocked||typeof s.achievementBook.unlocked!=='object'||Array.isArray(s.achievementBook.unlocked))s.achievementBook.unlocked={};if(!s.achievementBook.stats||typeof s.achievementBook.stats!=='object'||Array.isArray(s.achievementBook.stats))s.achievementBook.stats={};const tradeProfit=(s.tradeLedger||[]).reduce((n,x)=>n+Math.max(0,x.profit||0),0);for(const [key,value]of Object.entries({choices:Object.keys(s.seen||{}).length,practiceSessions:0,tradeDeals:(s.tradeLedger||[]).length,tradeProfit}))if(!Number.isFinite(s.achievementBook.stats[key])||s.achievementBook.stats[key]<0)s.achievementBook.stats[key]=value;const hadVisited=Array.isArray(s.achievementBook.stats.visitedCities),visited=hadVisited?s.achievementBook.stats.visitedCities.filter(id=>this.w.cities.some(c=>c.id===id)):[s.city,...(s.travelHistory||[]).map(x=>x.to)].filter(id=>this.w.cities.some(c=>c.id===id));s.achievementBook.stats.visitedCities=[...new Set(visited)];
 if(!s.family.members.some(n=>n.id===s.actorId))s.family.members.push({id:s.actorId,name:s.name,gender:s.gender,birthDay:s.ageAtDay-s.age*360,role:'家主',generation:s.generation});
 const actor=s.family.members.find(n=>n.id===s.actorId);if(actor){actor.name=s.name;actor.gender=s.gender;if(s.actorId==='founder')actor.birthDay=s.ageAtDay-s.age*360;}
 for(const p of this.people()){s.relations[p.id]??=0;s.locations[p.id]??=p.city;if(s.relations[p.id]>0&&!s.known.includes(p.id))s.known.push(p.id);}
 for(const a of s.assets)this.initAsset(a);
 return s;
};
P.create=function(){base.create.call(this);return this.setupSystems();};
P.start=function(name){base.start.call(this,name);const n=this.s.family.members.find(n=>n.id===this.s.actorId);if(n){n.name=this.s.name;n.gender=this.s.gender;n.birthDay=this.s.ageAtDay-this.s.age*360;}return this.s;};
P.load=function(input){
 const s=cp(input);if(!s||s.version!==2)return base.load.call(this,s);
 for(const p of this.w.people)if(s.relations&&!(p.id in s.relations))s.relations[p.id]=0;
 base.load.call(this,s);this.setupSystems();
 const a=this.s,err=msg=>{throw Error('扩展存档无效：'+msg);};
 const scan=x=>{if(!x||typeof x!=='object')return;for(const [k,v]of Object.entries(x)){if(['__proto__','constructor','prototype'].includes(k))err('非法字段');scan(v);}};scan(a);
 if(!Array.isArray(a.known)||!Array.isArray(a.peopleExtra)||!Array.isArray(a.letters)||!Array.isArray(a.tradeLedger)||!Array.isArray(a.estateLedger)||!Array.isArray(a.family.members)||!Array.isArray(a.family.pregnancies)||!Array.isArray(a.redeemedCodes)||a.redeemedCodes.some(x=>typeof x!=='string'||!x||x.length>40)||new Set(a.redeemedCodes).size!==a.redeemedCodes.length||!a.meetCooldown||typeof a.meetCooldown!=='object'||Array.isArray(a.meetCooldown)||Object.entries(a.meetCooldown).some(([id,day])=>!this.w.cities.some(c=>c.id===id)||!Number.isFinite(day)||day<0)||!Number.isInteger(a.brothelVisits)||a.brothelVisits<0)err('集合结构');
 for(const [city,goods]of Object.entries(a.markets)){if(!this.w.cities.some(c=>c.id===city))err('货市城市');for(const v of Object.values(goods))if(!Number.isFinite(v.stock)||v.stock<0||!Number.isFinite(v.base)||v.base<=0)err('货市数值');}
 if(a.journey){const j=a.journey;if(!Array.isArray(j.path)||j.path.some(id=>!this.w.cities.some(c=>c.id===id))||!this.w.escorts.some(e=>e.id===j.escort)||['remaining','value','fee','elapsed','total','distance','compensated','danger'].some(k=>!Number.isFinite(j[k])||j[k]<0)||!Array.isArray(j.logs)||j.logs.some(l=>typeof l!=='string'))err('行旅');if(j.unitValues&&Object.values(j.unitValues).some(v=>!Number.isFinite(v)||v<0))err('保价');}
 if(a.incident&&(!['road','estate','family'].includes(a.incident.type)||!this.events.some(e=>e.id===a.incident.eventId)))err('待决风波');
 if(!Number.isInteger(a.generation)||a.generation<1||!Number.isFinite(a.ageAtDay)||typeof a.alive!=='boolean')err('世代');
 if(a.family.home&&(!this.w.cities.some(c=>c.id===a.family.home.city)||!Number.isInteger(a.family.home.level)||a.family.home.level<1))err('宅邸');
 const ids=new Set();for(const n of a.family.members){if(!n||!/^([a-z][a-z0-9_]*)$/.test(n.id||'')||ids.has(n.id)||typeof n.name!=='string'||!Number.isFinite(n.birthDay)||!['男','女'].includes(n.gender)||!['家主','wife','husband','concubine','嫡出','庶出','退居长辈','先辈'].includes(n.role)||!Number.isInteger(n.generation)||n.generation<1||n.lineage&&!['嫡','庶'].includes(n.lineage))err('族谱');ids.add(n.id);if(n.education&&Object.entries(n.education).some(([id,v])=>!this.w.routes.some(r=>r.id===id)||!Number.isFinite(v)||v<0||v>100))err('家学');}
 if(!ids.has(a.actorId))err('当前家主');
 for(const p of a.peopleExtra)if(!p||!/^([a-z][a-z0-9_]*)$/.test(p.id||'')||typeof p.name!=='string'||!['男','女'].includes(p.gender)||!this.w.cities.some(c=>c.id===p.city)||!this.w.factions.some(f=>f.id===p.faction)||!Number.isFinite(p.age))err('人物');
 for(const city of Object.values(a.locations))if(!this.w.cities.some(c=>c.id===city))err('人物行踪');
 for(const b of Object.values(a.basis))if(!b||!Number.isFinite(b.qty)||b.qty<0||!Number.isFinite(b.value)||b.value<0)err('货物成本');
 for(const n of a.family.pregnancies)if(!ids.has(n.parentId)||!Number.isFinite(n.due))err('孕期');
 for(const x of a.assets)if(!Number.isFinite(x.security)||x.security<0||x.security>3||!Number.isFinite(x.reputation)||!Number.isFinite(x.disrupted)||!this.w.assetPolicies.some(p=>p.id===x.policy)||['materials','products'].some(k=>Object.entries(x[k]).some(([id,v])=>!this.w.goods.some(g=>g.id===id)||!Number.isFinite(v)||v<0)))err('产业运营');
 for(const x of a.tradeLedger)if(!x||!Number.isFinite(x.day)||!Number.isFinite(x.qty)||typeof x.buy!=='boolean'||!this.w.cities.some(c=>c.id===x.city)||!this.w.goods.some(g=>g.id===x.good)||!Number.isFinite(x.total)||!Number.isFinite(x.cost)||x.profit!==null&&!Number.isFinite(x.profit))err('交易账');
 for(const x of a.estateLedger)if(!x||['day','income','expenses','living','production'].some(k=>!Number.isFinite(x[k])))err('产业日结');
 return a;
};
P.people=function(){return [...this.w.people,...(this.s?.peopleExtra||[])];};
P.person=function(id){return this.people().find(p=>p.id===id);};
P.personCity=function(id){return this.s.locations[id]||this.person(id)?.city;};
P.personAge=function(p){return p.age+Math.floor((this.s.day-(p.sinceDay||1))/360);};
P.ageNow=function(){return this.s.age+Math.floor((this.s.day-this.s.ageAtDay)/360);};
P.ready=function(){return base.ready.call(this)&&!this.s.journey&&this.s.alive;};
P.free=function(){return !!this.s?.started&&!this.s.pending&&!this.s.journey&&this.s.alive;};
P.achievementList=function(){const unlocked=this.s?.achievementBook?.unlocked||{};return ACHIEVEMENTS.map(a=>({id:a.id,category:a.category,icon:a.icon,name:a.name,desc:a.desc,goal:a.goal,progress:Math.max(0,Math.min(a.goal,Math.floor(a.measure(this)||0))),unlocked:!!unlocked[a.id],record:unlocked[a.id]||null}));};
P.checkAchievements=function(){const book=this.s?.achievementBook;if(!book||!this.s.started)return [];const newly=[];for(const a of ACHIEVEMENTS)if(!book.unlocked[a.id]&&a.measure(this)>=a.goal){const record={day:this.s.day,actor:this.s.name,generation:this.s.generation,age:this.ageNow()};book.unlocked[a.id]=record;newly.push({...a,record});}return newly;};
P.act=function(route){if(this.ready())this.s.lastResult=null;return base.act.call(this,route);};
P.useMedicine=function(){return this.free()&&base.useMedicine.call(this);};
P.apply=function(e){base.apply.call(this,e);if(this.s?.known)for(const key of Object.keys(e||{}))if(key.startsWith('relations.')){const id=key.split('.')[1];if(this.person(id)&&!this.s.known.includes(id))this.s.known.push(id);}};
P.probability=function(c){const p=base.probability.call(this,c);if(!c.check)return p;const best=Math.max(0,...this.w.skills.filter(k=>k.stat===c.check.stat).map(k=>this.s.skills[k.id]||0));return cap(p+Math.floor(best/25)*.015,.12,.97);};
P.result=function(title,text,effects={}){this.s.lastResult={title,text,effects};this.log(title,text);return true;};
P.marketEntry=function(city,id){const c=this.w.cities.find(c=>c.id===city);const baseStock=Math.max(8,Math.round(42/c.goods[id]));const m=this.s.markets[city]??={};return m[id]??={stock:baseStock,base:baseStock};};
P.stock=function(id,city=this.s.city){return this.marketEntry(city,id).stock;};
P.priceAt=function(id,city=this.s.city,buy=true){
 const g=this.w.goods.find(g=>g.id===id),c=this.w.cities.find(c=>c.id===city);if(!g||!c)return 0;
 const m=this.marketEntry(city,id),supply=cap(1+(m.base-m.stock)/m.base*.35,.7,1.5),wave=1+Math.sin(this.s.day*.19+this.w.cities.indexOf(c)*.8+this.w.goods.indexOf(g))*.09;
 const skill=cap(this.s.stats.business/1000+(this.s.skills.account||0)/4000,0,.12);
 return Math.max(1,Math.round(g.base*c.goods[id]*supply*wave*(buy?1.1-skill:.86+skill)));
};
P.price=function(id,buy=true){return this.priceAt(id,this.s.city,buy);};
P.trade=function(id,qty,buy){
 const g=this.w.goods.find(g=>g.id===id);if(!this.free()||!g||!Number.isInteger(qty)||qty<1||qty>999)return false;
 const unit=this.price(id,buy),sum=unit*qty,have=this.s.inventory[id]||0,m=this.marketEntry(this.s.city,id);
 if(buy&&(this.s.silver<sum||this.cargo()+qty>this.capacity()||m.stock<qty)||!buy&&have<qty)return false;
 let b=this.s.basis[id]??={qty:have,value:0},cost=0;if(buy){b.qty+=qty;b.value+=sum;}else{cost=Math.round(b.qty?b.value*Math.min(qty,b.qty)/b.qty:0);b.value=Math.max(0,b.value-cost);b.qty=Math.max(0,b.qty-qty);}
 m.stock+=buy?-qty:qty;this.apply({silver:buy?-sum:sum,['inventory.'+id]:buy?qty:-qty,'routes.trade':2});
 const row={day:this.s.day,city:this.s.city,good:id,qty,buy,total:sum,cost,profit:buy?null:sum-cost};this.s.tradeLedger.unshift(row);this.s.tradeLedger=this.s.tradeLedger.slice(0,80);
 return this.result(buy?'购货入仓':'售货结账',`${this.city().name}：${g.name} ${qty}${g.unit}，${buy?'支出':'收得'} ${sum}两。${buy?'已记入成本账。':`货物账面毛利 ${sum-cost}两，尚需扣除行旅与护航开支。`}`);
};
P.maxBuyQuantity=function(id){const p=this.price(id),free=Math.max(0,this.capacity()-this.cargo());return Math.max(0,Math.min(this.stock(id),free,Math.floor(this.s.silver/Math.max(1,p))));};
P.buyAll=function(id){const qty=Math.min(this.stock(id),Math.max(0,this.capacity()-this.cargo()));if(!qty||this.s.silver<this.price(id)*qty)return false;return this.trade(id,qty,true);};
P.sellAll=function(id){const qty=this.s.inventory[id]||0;return qty>0&&this.trade(id,qty,false);};
P.pathTo=function(target){
 const cities=this.w.cities,dist=Object.fromEntries(cities.map(c=>[c.id,Infinity])),prev={};dist[this.s.city]=0;const left=new Set(cities.map(c=>c.id));
 while(left.size){let id=[...left].sort((a,b)=>dist[a]-dist[b])[0];left.delete(id);if(id===target)break;const a=cities.find(c=>c.id===id);for(const link of a.links){const b=cities.find(c=>c.id===link);const days=Math.max(1,Math.round(Math.hypot(a.x-b.x,a.y-b.y)/13))+(Math.max(a.danger,b.danger)>=3?1:0);if(dist[id]+days<dist[link]){dist[link]=dist[id]+days;prev[link]=id;}}}
 if(!Number.isFinite(dist[target])||target===this.s.city)return null;const path=[target];while(path[0]!==this.s.city)path.unshift(prev[path[0]]);return {path,days:dist[target],distance:dist[target]*80};
};
P.cargoValue=function(){return this.w.goods.reduce((n,g)=>n+(this.s.inventory[g.id]||0)*this.price(g.id),0);};
P.quoteTravel=function(target,escort='none'){
 const path=this.pathTo(target),guard=this.w.escorts.find(g=>g.id===escort);if(!path||!guard)return null;
 const value=this.cargoValue(),danger=Math.max(...path.path.map(id=>this.w.cities.find(c=>c.id===id).danger));
 const relation=guard.faction?this.s.factions[guard.faction]:0,eligible=!guard.minRelation||relation>=guard.minRelation;
 const baseFee=path.days*8,commission=guard.id==='none'?0:Math.ceil(value*guard.rate*(1+path.days*.18)+path.days*3);
 return {...path,value,danger,baseFee,commission,total:baseFee+commission,guard,eligible:eligible&&relation>-35};
};
P.travel=function(target,options={}){
 const escort=typeof options==='string'?options:options.escort||'none',q=this.quoteTravel(target,escort);if(!this.ready()||!q||!q.eligible||this.s.silver<q.total)return false;
 this.s.silver-=q.total;this.s.energy--;this.s.journey={from:this.s.city,to:target,path:q.path,total:q.days,remaining:q.days,elapsed:0,distance:q.distance,escort,value:q.value,fee:q.total,compensated:0,danger:q.danger,logs:[],manifest:Object.fromEntries(this.w.goods.map(g=>[g.id,this.s.inventory[g.id]||0])),unitValues:Object.fromEntries(this.w.goods.map(g=>[g.id,this.price(g.id)]))};
 return this.result('启程 · '+this.w.cities.find(c=>c.id===target).name,`预计 ${q.days}日、${q.distance}里，路费 ${q.baseFee}两，${q.guard.name}${q.commission?'佣金 '+q.commission+'两':''}。路上的风险与结算会逐日记录。`);
};
P.openIncident=function(type,eventId,context={}){if(this.s.pending||this.s.incident)return false;if(!this.events.some(e=>e.id===eventId))return false;this.s.incident={type,eventId,...context};this.s.pending=eventId;return true;};
P.continueJourney=function(){
 const s=this.s,j=s.journey;if(!s.started||!s.alive||!j||s.pending)return false;
 if(j.remaining===0){this.arrive();return true;}this.tick(false);j.elapsed++;j.remaining=Math.max(0,j.remaining-1);
 if(!s.alive||s.pending)return true;
 const chance=cap(.10+j.danger*.055+(j.value>800?.06:0),.1,.38);
 if(this.rng()<chance){const kind=this.random(['bandits','bandits','customs','weather']);this.openIncident('road','road-'+kind,{kind});}
 if(!s.pending&&j.remaining===0)this.arrive();return true;
};
P.arrive=function(){const j=this.s.journey;if(!j)return;this.s.city=j.to;this.s.energy=3;this.s.travelHistory.unshift({...j,day:this.s.day});this.s.travelHistory=this.s.travelHistory.slice(0,20);this.s.journey=null;this.result('抵达 · '+this.city().name,`行旅 ${j.elapsed}日，路费与佣金共 ${j.fee}两。${j.logs.join(' ')}${this.city().desc}`);};
P.lossCargo=function(fraction){let value=0,units=0;const j=this.s.journey;for(const g of this.w.goods){const have=this.s.inventory[g.id]||0;if(!have)continue;const n=Math.min(have,Math.max(1,Math.ceil(have*fraction*(g.fragile?1.2:1))));this.s.inventory[g.id]-=n;units+=n;const unit=j?.unitValues?.[g.id]||this.priceAt(g.id,j?.from||this.s.city);value+=Math.round(n*unit);const b=this.s.basis[g.id];if(b?.qty){const used=Math.min(n,b.qty)/b.qty;b.value=Math.round(b.value*(1-used));b.qty=Math.max(0,b.qty-n);}}
 return {units,value};};
P.event=function(){
 const e=base.event.call(this);if(!e||!this.s.incident)return e;const x=cp(e),i=this.s.incident;
 if(i.type==='road'){
  const j=this.s.journey,g=this.w.escorts.find(g=>g.id===j?.escort)||this.w.escorts[0];x.text+=`\n\n本趟：货物申价 ${j?.value||0}两，护航 ${g.name}，尚余 ${j?.remaining||0}日。`;
  if(i.kind==='bandits'){x.choices[0].label=g.id==='none'?'交现金止损（仍需付出代价）':'交由护航队迎敌';if(g.id==='none'){const fee=Math.min(this.s.silver,Math.max(8,Math.ceil((j.value||40)*.08)));if(fee)x.choices[0].cost={silver:fee};x.choices[0].label+=fee?` · ${fee}两`:'';}x.choices[1].label=g.id==='none'?'凭本领与人脉保住大半货（仍有损失）':'主动让出少量货，避免交战';}
  if(i.kind==='customs'){const fee=Math.max(5,Math.ceil(j.value*.04));x.choices[0].label=`核单缴费 · ${fee}两`;x.choices[0].cost={silver:fee};x.choices[1].label=`私下打点 · ${Math.ceil(fee*.6)}两`;x.choices[1].cost={silver:Math.ceil(fee*.6)};}
 }
 if(i.type==='estate'){const a=this.s.assets.find(a=>a.key===i.key),b=this.w.buildings.find(b=>b.id===a?.id);x.text+=`\n\n涉及：${this.w.cities.find(c=>c.id===a?.city)?.name} · ${b?.name} ${a?.level}级。`;const fee=Math.max(10,Math.ceil((b?.cost||100)*(a?.level||1)*.06));x.choices[0].cost={silver:fee};x.choices[0].label+=` · ${fee}两`;}
 if(i.type==='family')x.text+=i.personId?`\n\n此事与你的家眷 ${this.person(i.personId)?.name||''} 有关。`:'';
 return x;
};
P.choose=function(index){
 if(!this.s.incident)return base.choose.call(this,index);
 const e=this.event(),c=e?.choices[index];if(!c||!this.canChoose(c))return {ok:false};for(const [k,n]of Object.entries(c.cost||{}))this.apply({[k]:-n});
 const incident=this.s.incident;this.s.pending=null;this.s.incident=null;
 let text='';
 if(incident.type==='road'){
  const j=this.s.journey,g=this.w.escorts.find(g=>g.id===j.escort);if(incident.kind==='bandits'){
   if(index===0&&g.id!=='none'){
    const chance=cap(.35+g.power/220+this.s.stats.martial/600+(this.s.factions[g.faction]||0)/500-j.danger*.045,.25,.94),win=this.rng()<chance;
    if(win){this.apply({['factions.'+g.faction]:2,'routes.martial':1});text=`${g.name}击退拦路者，货物完好。此战胜算约 ${Math.round(chance*100)}%。`;}
    else{const loss=this.lossCargo(.2+this.rng()*.25),left=Math.max(0,j.value-j.compensated),paid=Math.min(left,Math.floor(loss.value*g.coverage));j.compensated+=paid;this.apply({silver:paid,health:-6});text=`护航队失利，损失 ${loss.units}件货，核定损价 ${loss.value}两，依保价赔付 ${paid}两。`;}
   }else if(index===0&&g.id==='none'){
    if(c.cost){text='你交出约定现金，对方让开道路；未损货，银钱已付。';}else{const l=this.lossCargo(.12);this.apply({health:l.units?0:-5});text=`无钱可交，损失 ${l.units}件货${l.units?'':'并受轻伤'}。`;}
   }else{
    const influence=Math.max(this.s.factions.blackflag,this.s.factions.shadow,0),ability=(this.s.stats.strategy+this.s.stats.martial+this.s.stats.charm)/3;
    const l=this.lossCargo(cap(.35-ability/450-influence/500,.06,.35));if(!l.units)this.apply({silver:-Math.min(this.s.silver,8),health:-5});text=`你${index===1?'设法周旋':'选择撤退'}，凭本领与关系减少损失，仍丢下 ${l.units}件货${l.units?'':'，并付出盘缠与轻伤'}。`;
   }
  }else if(incident.kind==='customs'){
   if(index===0){this.apply({'factions.court':1});text='按公开名目缴清关费，取得收据。';}
   else if(index===1){this.apply({heat:4,morality:-2});text='小吏收下了打点钱，未留下票据。今后若查此关，你也可能被问到。';}
   else{const exempt=this.s.inventory.seal>0||this.s.factions.court>=20;if(exempt)text='你出示凭照或请相识官员核验，盘查后放行。';else{j.remaining++;j.total++;text='你拒绝私下付钱，留下等候复核，行程增加 1 日。';}}
  }else{if(index===0){j.remaining++;j.total++;text='你等雨势减弱，行程增加 1 日，货物得以保全。';}else if(index===1){const l=this.lossCargo(.06);text=`冒雨赶路，受潮或颠坏 ${l.units}件货。`;}else{this.apply({health:-6});text='你带人加固车篷，货物保住，身体受了些劳累。';}}
  j.logs.push(text);this.result(e.title,text);if(j.remaining===0)this.arrive();
 }else if(incident.type==='estate'){
  const a=this.s.assets.find(a=>a.key===incident.key);if(a){const protection=a.security*6+Math.max(0,this.s.factions.court,this.s.factions.guild)/4;
   if(index===0){a.reputation=Math.min(100,a.reputation+4);text='你拿钱解决眼前纠纷，保存票据，产业继续营业。';}
   else if(index===1){const skill=(this.s.stats.learning+this.s.stats.business+this.s.stats.strategy)/3,win=this.rng()<cap(.25+(skill+protection)/160,.2,.9);if(win){a.reputation=Math.min(100,a.reputation+8);this.apply({renown:2});text='你凭账目、人脉与护院守住产业，没有额外赔付。';}else{a.disrupted=4;this.apply({silver:-Math.max(8,a.level*12)});text='周旋未成，赔付部分费用，产业停业 4 日整顿。';}}
   else{a.disrupted=2;this.apply({'factions.guild':-2});text='你暂停营业两日，整理证据并撤下有争议的货，避免冲突扩大。';}}
  this.result(e.title,text);
 }else{
  if(incident.eventId==='family-school'){
   if(index===0){for(const n of this.children()){n.education??={};n.education.scholar=Math.min(100,(n.education.scholar||0)+3);}this.apply({morality:2,'factions.academy':2});text='你与家人议定所有孩子都有授业机会，子女各增3点学问家学，亲族也同意按此安排。';}
   else if(index===1){this.apply({silver:25});text='亲族愿共同出一笔公开学资，家中收得25两，约定专列在下一期的读书账里。';}
   else{this.apply({health:4});text='你们先留半日共同识字，不急着按房支分开。先生与学资可以再议，孩子今天已经开始学。';}
  }else if(incident.eventId==='family-gossip'){
   if(index===0){this.apply({health:5,morality:1});text='家人终于有机会先讲自己的感受，而非替外面的传闻作答。你们商定了哪些事情愿意公开。';}
   else if(index===1){this.apply({renown:3});text='你拿出能够说明的事实，澄清了几处传闻；家中不愿公开的私事仍妥善保留。声望增加3。';}
   else{this.apply({health:5});text='你谢绝替家中编故事的人，留出时间照顾家常。不让每一句闲话都决定一家人的安排。';}
  }else if(index===0){this.apply({renown:2,morality:1});text='你召集家人，当面把来往、分担和界线说清。亲族的帮助与责任都有了明白约定。';}
  else if(index===1){const p=this.person(incident.personId),chance=cap(.4+this.s.stats.business/180+(p?this.s.relations[p.id]:0)/500,.4,.9);if(this.rng()<chance){this.apply({silver:25,'factions.guild':2});text='公开的小合作顺利回款，净得25两，也留下完整的账。';}else{this.apply({silver:-15,health:-3});text='亲族合作出现周转问题，你承担15两损失与一段劳心。亲缘并不自动消除经营风险。';}}
  else{this.apply({health:5});text='你没有让亲族替全家决定，谢过来意，先照顾眼前的日常。';}this.result(e.title,text);
 }
 this.rescue();return {ok:true,...this.s.lastResult};
};
P.initAsset=function(a){a.key=a.city+'_'+a.id;a.policy??='steady';a.security??=0;a.reputation??=50;a.disrupted??=0;a.weekReady??=true;a.materials??={};a.products??={};const b=this.w.buildings.find(b=>b.id===a.id);for(const [id,n]of Object.entries(b?.materials||{}))a.materials[id]??=n*a.level*2;return a;};
P.build=function(id){const b=this.w.buildings.find(x=>x.id===id);if(!this.free()||!b)return false;let a=this.s.assets.find(x=>x.id===id&&x.city===this.s.city);const cost=Math.round(b.cost*(1+(a?.level||0)*.7));if(this.s.silver<cost||(a?.level||0)>=5)return false;this.s.silver-=cost;if(a)a.level++;else this.s.assets.push(a={id,city:this.s.city,level:1});this.initAsset(a);this.s.flags.owns_assets=true;this.apply({'routes.trade':2});this.result('置办家业',`${this.city().name}的${b.name}升至${a.level}级，花费${cost}两。置业不占日常行动；初始附两轮原料，可在运营页补货、调整经营方针与护院。`);return true;};
P.assetOperation=function(key,operation,value){
 const a=this.s.assets.find(a=>a.key===key),b=this.w.buildings.find(b=>b.id===a?.id);if(!a||!this.ready())return false;
 if(operation==='policy'){if(!this.w.assetPolicies.some(p=>p.id===value))return false;a.policy=value;}
 else if(operation==='security'){const cost=45*(a.security+1);if(a.security>=3||this.s.silver<cost)return false;this.s.silver-=cost;a.security++;}
 else if(operation==='supply'){const inputs=Object.entries(b.materials||{});if(!inputs.length)return false;const cost=inputs.reduce((n,[id,q])=>n+Math.ceil(this.priceAt(id,a.city)*q*a.level*4*1.1),0);if(this.s.silver<cost)return false;this.s.silver-=cost;for(const [id,q]of inputs)a.materials[id]=(a.materials[id]||0)+q*a.level*4;a.weekReady=true;a.supplyPaused=false;}
 else if(operation==='collect'){if(a.city!==this.s.city)return false;let n=0;for(const [id,q]of Object.entries(a.products)){const take=Math.min(q,this.capacity()-this.cargo());if(take>0){this.s.inventory[id]=(this.s.inventory[id]||0)+take;a.products[id]-=take;n+=take;}}if(!n)return false;}
 else if(operation==='repair'){if(this.s.silver<20||!a.disrupted)return false;this.s.silver-=20;a.disrupted=0;}
 else return false;
 this.s.energy--;return this.result('产业运营',`${this.w.cities.find(c=>c.id===a.city).name} · ${b.name}：已完成${{policy:'调整方针',security:'添置护院',supply:'采购四轮原料',collect:'提取产出',repair:'修复复业'}[operation]}。`);
};
P.practice=function(id,mode='drill'){
 const k=this.w.skills.find(k=>k.id===id),m=this.w.practiceModes.find(m=>m.id===mode);if(!k||!m||!this.ready())return false;
 const tuition=m.id==='tutor'?Math.max(16,m.cost-Math.floor(Math.max(0,this.s.factions[k.route==='martial'?'sword':k.route==='trade'?'guild':k.route==='medicine'?'healers':'academy'])/10)):m.cost;
 if(this.s.silver<tuition)return false;this.s.energy--;this.s.silver-=tuition;const legacy=this.s.legacy[k.route]||0;
 const gain=m.gain+(legacy?2:0),before=this.s.skills[id];this.s.skills[id]=cap(before+gain,0,100);this.apply({['stats.'+k.stat]:m.stat,['routes.'+k.route]:2+(legacy?1:0),...(id==='breath'?{health:5}:{})});
 let text=`${m.name}：熟练 +${this.s.skills[id]-before}，${this.w.stats[k.stat]} +${m.stat}${legacy?'，承家学助益':''}。`;
 if(m.id==='spar'){if(this.rng()<.3){this.apply({health:-8});text+='切磋受轻伤，健康 -8。';}else{this.apply({['stats.'+k.stat]:1});text+='切磋有悟，再提高本领 1 点。';}}
 if(Math.floor(before/25)<Math.floor(this.s.skills[id]/25)){this.apply({renown:2});text+='突破一个熟练境界，相关事件判定得到额外助益。';}
 return this.result('修习 · '+k.name,text);
};
P.retreat=function(id,days=7){if(!this.ready()||!this.w.skills.some(k=>k.id===id)||![7,30].includes(days)||this.s.silver<days*3)return false;this.s.silver-=days*3;const k=this.w.skills.find(k=>k.id===id);let n=0;for(;n<days&&!this.s.pending&&this.s.alive;n++){this.tick(false);if(this.s.pending||!this.s.alive)break;this.s.skills[id]=cap(this.s.skills[id]+1,0,100);if(n%3===0)this.apply({['stats.'+k.stat]:1,['routes.'+k.route]:1});}this.result('闭关修习',`已修习 ${n}日；食宿另按每日结算。${this.s.pending?'有要事来报，闭关暂止。':''}`);return true;};
P.visit=function(id,mode='talk'){
 const p=this.person(id);if(!p||!this.ready())return false;const local=this.personCity(id)===this.s.city,known=this.s.known.includes(id);if(!local&&!known)return false;
 let gain=local?5+Math.floor(this.s.stats.charm/20):3+Math.floor(this.s.stats.charm/30),cost=local?0:3;
 if(mode==='gift'){cost+=16;gain+=5;}if(mode==='ask'){cost+=6;gain+=2;}
 if(this.s.silver<cost)return false;this.s.silver-=cost;this.s.energy--;this.apply({['relations.'+id]:gain,['factions.'+p.faction]:mode==='ask'?3:1});
 if(!this.s.known.includes(id))this.s.known.push(id);
 if(!local)this.s.letters.push({to:id,day:this.s.day+2,mode});
 if(mode==='ask'){const city=this.w.cities.find(c=>c.id===this.personCity(id)),good=this.w.goods.find(g=>city.shortages.includes(g.id));this.apply({'stats.insight':1});return this.result('托问近况',`${p.name}说：${city.name}${good?'近来缺'+good.name:'货价尚平'}。所处势力愿意承接合规往来，你们的交情也更近一些。`);}
 return this.result(local?(known?'登门叙话':'初次结识'):'书信拜访',`${local?'你与':'你寄信给远在'+this.w.cities.find(c=>c.id===this.personCity(id)).name+'的'}${p.name}，好感增加 ${gain}。${mode==='gift'?'薄礼附着一份心意。':''}${!local?'约两日后会有回信。':p.text}`);
};
P.socialGathering=function(){
 const s=this.s,city=s.city,last=s.meetCooldown[city]||0;if(!this.free()||s.silver<8||last>0&&s.day-last<14)return false;
 const surnames=['顾','宁','宋','陶','程','乔','林','沈','叶','谢','周','陆','许','秦','唐','温'],given=['照溪','知远','明秋','听雨','惜年','归宁','怀瑾','见川','望舒','清晏','书意','云归','晚棠','青禾','砚秋','南枝'];
 const used=new Set(this.people().map(p=>p.name));let made=[];const genders=s.gender==='男'?['女','女','男']:['男','男','女'];
 for(let i=0;i<genders.length;i++){let name;for(let tries=0;tries<30;tries++){name=this.random(surnames)+this.random(given);if(!used.has(name))break;}used.add(name);const id='meet'+s.day+'_'+(s.peopleExtra.length+i),social=1+Math.floor(this.rng()*3),faction=this.random(this.w.factions.filter(f=>['guild','academy','healers','escort','canal','smith'].includes(f.id))).id,p={id,name,gender:genders[i],age:20+Math.floor(this.rng()*11),sinceDay:s.day,social,city,faction,role:this.random(['茶社来客','书画雅集新友','行旅商客','曲社听众','地方文会宾客']),clan:name[0]+'氏',acceptsConcubine:social<=2,text:this.random(['借一盏茶说起一路见闻，话音轻，却很认真。','谈到家乡的河与市集，眉眼里有未走完的远路。','记得每个人的名字，也愿意听人把话讲完。','正打算在此地多住些时日，看看能否遇见志同道合的人。'])};s.peopleExtra.push(p);s.relations[id]=0;s.locations[id]=city;made.push(p);}
 s.silver-=8;s.meetCooldown[city]=s.day;return this.result('雅集识新友',`花去茶资8两，在${this.city().name}的雅集认识了几位新面孔：${made.map(p=>`${p.name}（${p.gender}，${p.age}岁）`).join('、')}。人物已记入本城名录；登门叙话后才会成为熟人。雅集两周可再访一次，不消耗行动。`);
};
P.brothelAction=function(kind){
 const s=this.s;if((kind==='network'?!this.ready():!this.free())||this.ageNow()<18||!['listen','poem','network'].includes(kind))return false;
 if(kind==='listen'){const cost=8;if(s.silver<cost)return false;s.silver-=cost;this.apply({health:4,'stats.charm':1});s.brothelVisits++;return this.result('红袖坊 · 琵琶声里',this.random(['帘外雨声渐密，曲中人唱的是客子归乡。你听完一阕，心绪稍定，交际与健康各有小益。','一曲《折柳》唱到末句，满堂都静了片刻。你留下茶钱，也把疲惫放下些许。','席间说书人讲到商队过关，几句细节竟与你的行旅颇有相通。你记下这段见闻，养回几分精神。'])+'花费8两，不消耗行动。');}
 if(kind==='poem'){const cost=12;if(s.silver<cost)return false;s.silver-=cost;const gain=2+Math.floor(this.rng()*3);this.apply({'stats.learning':1,'stats.charm':1,'routes.scholar':1});s.brothelVisits++;return this.result('红袖坊 · 诗笺酬答',`你以一首短诗换来一段新曲。掌柜把客人遗落的诗稿也借你一观，学识与交际略有长进。花费${cost}两，不消耗行动。`);}
 const cost=24;if(s.silver<cost)return false;const old=this.people().filter(p=>p.gender!==s.gender&&this.personAge(p)>=18&&!s.known.includes(p.id)&&!p.married&&this.personCity(p.id)===s.city);let p=old.length?this.random(old):null;
 if(!p){const surname=this.random(['顾','宁','宋','陶','程','乔','林','沈','叶','谢']),given=this.random(['照溪','知远','明秋','听雨','惜年','归宁','怀瑾','见川','望舒','清晏','书意','晚棠']);p={id:'salon'+s.day+'_'+(s.peopleExtra.length+1),name:surname+given,gender:s.gender==='男'?'女':'男',age:21+Math.floor(this.rng()*9),sinceDay:s.day,social:2,city:s.city,faction:this.random(this.w.factions.filter(f=>['guild','academy','healers','escort'].includes(f.id))).id,role:'红袖坊常客 / 艺人',clan:surname+'氏',acceptsConcubine:true,text:'不愿被旁人的传闻定义，谈起自己的行当时倒有说不完的细节。'};s.peopleExtra.push(p);s.locations[p.id]=s.city;s.relations[p.id]=0;}
 s.silver-=cost;s.energy--;s.brothelVisits++;if(!s.known.includes(p.id))s.known.push(p.id);this.apply({['relations.'+p.id]:10,'stats.charm':1});return this.result('红袖坊 · 引见新识',`掌柜为你引见了${p.name}。你们谈曲艺、行旅与各自的打算，彼此留下名帖；可在人脉簿继续拜访。花费${cost}两并消耗1行动。这里提供成年人的社交、曲艺与茶酒互动，不描写露骨内容。`);
};
P.redeemCode=function(code,entries){
 const s=this.s,name=String(code||'').trim();if(!this.free()||!name||name.length>40||s.redeemedCodes.includes(name)||!Array.isArray(entries)||!entries.length)return false;
 const allowed=new Set(['silver','health','renown','morality','heat','energy']);for(const r of this.w.routes)allowed.add('routes.'+r.id);for(const k in this.w.stats)allowed.add('stats.'+k);for(const k of this.w.skills)allowed.add('skills.'+k.id);for(const k of this.w.goods)allowed.add('inventory.'+k.id);for(const p of this.people())allowed.add('relations.'+p.id);for(const f of this.w.factions)allowed.add('factions.'+f.id);
 if(entries.some(x=>!Array.isArray(x)||!allowed.has(x[0])||!Number.isInteger(x[1])||x[1]<=0||x[1]>1000000))return false;
 for(const [key,value]of entries){if(key==='energy')s.energy=Math.min(3,s.energy+value);else this.apply({[key]:value});}s.redeemedCodes.push(name);this.result('兑换成功 · '+name,`已按兑换码增加${entries.map(([k,v])=>`${k} +${v}`).join('、')}。每个兑换码在当前存档中仅能使用一次。`);return true;
};
P.household=function(){return this.s.family.members.filter(n=>!n.deathDay&&n.ownerId===this.s.actorId&&['wife','husband','concubine'].includes(n.role));};
P.children=function(){return this.s.family.members.filter(n=>n.fatherId===this.s.actorId||n.motherId===this.s.actorId);};
P.homeCost=function(){return Math.ceil(120*Math.pow((this.s.family.home?.level||0)+1,1.45));};
P.buildHome=function(){const cost=this.homeCost();if(!this.ready()||this.s.silver<cost)return false;this.s.silver-=cost;this.s.energy--;if(!this.s.family.home)this.s.family.home={city:this.s.city,level:1};else this.s.family.home.level++;return this.result('安家置宅',`宅邸设在${this.w.cities.find(c=>c.id===this.s.family.home.city).name}，扩至 ${this.s.family.home.level}进院落。家眷可在此安居，每进可容纳三位配偶；子女另计。`);};
P.marriageReason=function(id,role='wife'){
 const p=this.person(id),s=this.s;if(!p)return '尚未相识';if(!s.known.includes(id))return '先结识对方';if(!this.free())return '先处理当前事务或抵达城镇';if(p.gender===s.gender)return '此处列出异性婚配';if(this.personAge(p)<18)return '尚未成年';if(p.married||s.family.members.some(n=>n.pid===id))return '已有婚约或已入族谱';if(!s.family.home)return '先安家置宅';
 if(role==='concubine'){if(!this.household().some(n=>['wife','husband'].includes(n.role)))return '先结为正配';if(p.social>2)return '身份不适合以侧室身份入家';if(!p.acceptsConcubine)return '对方只愿正式结亲';if(s.relations[id]<45)return '侧室需好感至少45';}else{if(this.household().some(n=>['wife','husband'].includes(n.role)))return '已有正配';if(s.relations[id]<100)return '正配需好感满100';}
 if(this.household().length>=s.family.home.level*3)return '需扩建宅邸';const fee=role==='concubine'?100:180;if(s.silver<fee)return '婚礼与安家费用不足'+fee+'两';if(s.energy<1)return '今日行动不足';return '';
};
P.marry=function(id,role='wife'){
 if(!['wife','concubine'].includes(role))return false;
 if(this.marriageReason(id,role))return false;const p=this.person(id),fee=role==='concubine'?100:180;this.s.silver-=fee;this.s.energy--;const actual=role==='concubine'?'concubine':this.s.gender==='男'?'wife':'husband';
 const node={id:'spouse'+this.s.family.members.length,pid:id,name:p.name,gender:p.gender,birthDay:this.s.day-this.personAge(p)*360,role:actual,ownerId:this.s.actorId,generation:this.s.generation,joined:this.s.day,nextPregnancy:this.s.day+30,effortDay:this.s.day,effortCount:0};this.s.family.members.push(node);this.s.locations[id]=this.s.family.home.city;
 this.apply({['factions.'+p.faction]:4,renown:2,'flags.household':true});this.result('红笺入户',`${p.name}与你议定婚事，${actual==='concubine'?'以侧室之礼入家':'结为正配'}。亲族从此有了新的往来，家用也会增加。`);
 this.openIncident('family','family-clan',{personId:id});return true;
};
P.familyTime=function(){if(!this.ready()||!this.s.family.home||this.s.city!==this.s.family.home.city)return false;this.s.energy--;for(const n of this.household())this.apply({['relations.'+n.pid]:4});this.apply({health:10});return this.result('一院灯火','你留出半日与家人吃饭、叙话。家眷好感各增4，健康恢复10。');};
P.familyEffort=function(id){
 const n=this.household().find(x=>x.id===id),s=this.s;if(!n||!this.free()||!s.family.home||s.city!==s.family.home.city||!s.family.fertility||s.family.pregnancies.some(x=>x.parentId===n.id))return false;
 if(n.effortDay!==s.day){n.effortDay=s.day;n.effortCount=0;}const count=n.effortCount||0,spouseAge=Math.floor((s.day-n.birthDay)/360),age=this.ageNow(),eligible=age>=18&&age<=65&&spouseAge>=18&&(s.gender==='男'?spouseAge<=43:age<=43)&&s.health>=30;
 if(!eligible)return false;if(count>=2&&s.energy<1)return false;if(count>=2)s.energy--;n.effortCount=count+1;
 const pregnant=this.rng()<.12;if(pregnant){s.family.pregnancies.push({parentId:n.id,ownerId:s.actorId,due:s.day+270});n.nextPregnancy=s.day+630;}
 return this.result('相伴努力 · '+n.name,`今日第${n.effortCount}次相伴${n.effortCount===3?'（消耗1行动）':'（不消耗行动）'}。每次主动努力有12%受孕机会；自然受孕为符合条件时每月24%。${pregnant?'传来有孕喜讯，预计九个月后添丁。':s.family.pregnancies.some(x=>x.parentId===n.id)?'已有身孕，安心静候即可。':'此番未有喜讯，仍可在今日继续相伴。'}`);
};
P.educate=function(id,route){const n=this.children().find(n=>n.id===id);if(!n||!this.ready()||(this.s.day-n.birthDay)/360<3||this.s.day-(n.lastEducation||-100)<10||!this.w.routes.some(r=>r.id===route)||this.s.silver<12)return false;this.s.silver-=12;this.s.energy--;n.lastEducation=this.s.day;n.education??={};n.education[route]=Math.min(100,(n.education[route]||0)+5);return this.result('家学有继',`${n.name}修习${this.w.routes.find(r=>r.id===route).name}家学，积累5点传习。子女成年传家后化为初始本领与成长助力。`);};
P.designateHeir=function(id){const n=this.children().find(n=>n.id===id);if(!n||!this.free())return false;this.s.family.heir=id;return this.result('立下传家约',`你指定${n.name}为传人。现在可先培养，满18岁后可正式传家；若家主寿尽，也会按约安排。`);};
P.succeed=function(id=this.s.family.heir){
 const s=this.s,n=this.children().find(n=>n.id===id);if(!n||s.pending||s.journey||Math.floor((s.day-n.birthDay)/360)<18)return false;
 const oldName=s.name,oldId=s.actorId,oldRoutes=cp(s.routes),lead=s.identities.sectLeader,old=s.family.members.find(n=>n.id===oldId);if(old){old.role=s.alive?'退居长辈':'先辈';old.retired=s.day;}
 s.family.history.push({name:oldName,day:s.day,actorId:oldId,heir:n.name,wealth:s.silver});s.name=n.name;s.gender=n.gender;s.age=Math.floor((s.day-n.birthDay)/360);s.ageAtDay=n.birthDay+s.age*360;s.actorId=n.id;s.generation++;s.origin='clan';s.alive=true;s.family.heir=null;
 const training=n.education||{};for(const k in s.stats)s.stats[k]=cap(25+Math.floor(this.rng()*18)+Math.floor((n.genes?.[k]||40)/8),25,65);
 s.legacy={};for(const r of this.w.routes){const value=training[r.id]||0;s.routes[r.id]=Math.min(8,Math.floor(value/12));if(oldRoutes[r.id]>=18)s.legacy[r.id]=1;s.stats[r.stat]=cap(s.stats[r.stat]+Math.floor(value/10),0,85);}
 for(const k of this.w.skills)s.skills[k.id]=Math.min(20,Math.floor((training[k.route]||0)/4));
 for(const id in s.relations)s.relations[id]=Math.round(s.relations[id]*.3);for(const id in s.factions)s.factions[id]=Math.round(s.factions[id]*.4);
 s.identities={office:0,sect:lead?Math.max(1,Math.floor((training.martial||0)/20)):0,sectLeader:lead&&((training.martial||0)>=25)};s.renown=Math.floor(s.renown*.25);s.heat=Math.floor(s.heat*.3);s.health=100;s.mainRoute=null;s.pending=null;s.lastResult=null;s.energy=3;
 this.result('薪火相传',`${oldName}将现银、货物、产业与宅邸完整交给${n.name}。官位与普通门派身份不继承；家学、人脉与门荫留下成长助力。${lead?(s.identities.sectLeader?'具备家学的传人承接掌门之位。':'掌门之位暂由门中议事，不强授尚未具备本领的后辈。'):''}`);
 this.seedGenerationPeople();return true;
};
P.seedGenerationPeople=function(){const suffix=String.fromCharCode(96+Math.min(26,this.s.generation));for(let i=0;i<6;i++){const city=this.random(this.w.cities),gender=i%2?'男':'女',id='kin'+suffix+String.fromCharCode(97+i);if(this.person(id))continue;const p={id,name:this.random(['顾','宁','宋','陶','程','乔'])+this.random(['照溪','知远','明秋','听雨','惜年','归宁']),gender,age:20+Math.floor(this.rng()*8),sinceDay:this.s.day,social:i===5?4:2,city:city.id,faction:this.random(['guild','academy','healers','escort']),role:'新一代游历者',clan:'新交之家',acceptsConcubine:i===0||i===2,mobile:true,text:'旧一代的故事已听过许多，自己的来路才刚开始。'};this.s.peopleExtra.push(p);this.s.relations[id]=0;this.s.locations[id]=city.id;}};
P.foundSect=function(){if(!this.ready()||this.s.routes.martial<100||this.s.renown<20||this.s.silver<500||this.s.identities.sectLeader)return false;this.s.silver-=500;this.s.energy--;this.s.identities.sectLeader=true;this.s.identities.sect=5;return this.result('开宗立派','你以自有家业设立山门，承担弟子工食与授业之责。掌门属于可安排传承的最高身份；普通门人身份仍须后辈自行取得。');};
P.advanceTime=function(days){if(!this.free()||![30,90,360].includes(days))return false;const start=this.s.day;for(let i=0;i<days&&this.s.alive&&!this.s.pending;i++)this.tick(false);this.result('岁时流转',`过去了 ${this.s.day-start}日，产业、家用、往来和生育均按日结算。${this.s.pending?'有要事来报，快进暂止。':''}${!this.s.alive?'家主寿尽，请从传家页安排成年后辈。':''}`);return true;};
P.tick=function(allowEvent=true){
 const s=this.s;if(!s.alive)return;s.day++;s.energy=3;let income=0,expenses=0,production=0;s.flags.owns_assets=s.assets.length>0;s.flags.household=this.household().length>0;s.flags.has_children=this.children().length>0;
 for(const goods of Object.values(s.markets))for(const m of Object.values(goods)){if(m.stock<m.base)m.stock=Math.min(m.base,m.stock+1);else if(m.stock>m.base)m.stock=Math.max(m.base,m.stock-1);}
 for(const a of s.assets){this.initAsset(a);const b=this.w.buildings.find(b=>b.id===a.id),policy=this.w.assetPolicies.find(p=>p.id===a.policy);let supplied=a.weekReady;
  if(s.day%7===0){for(const [id,q]of Object.entries(b.materials||{}))if((a.materials[id]||0)<q*a.level)supplied=false;if(supplied)for(const [id,q]of Object.entries(b.materials||{}))a.materials[id]-=q*a.level;}
  a.weekReady=supplied;a.supplyPaused=!supplied;if(a.disrupted>0){a.disrupted--;expenses+=b.upkeep*a.level;continue;}
  if(!supplied){expenses+=b.upkeep*a.level;continue;}
  const gain=Math.round((b.income-b.upkeep)*a.level*policy.profit);income+=gain;expenses+=a.security;
  if(b.product&&s.day%7===0){a.products[b.product]=Math.min(200,(a.products[b.product]||0)+a.level*2);production+=a.level*2;}
  if(policy.id==='benevolent'&&s.day%7===0)s.renown++;
 }
 const livingMembers=s.family.members.filter(n=>!n.deathDay&&n.id!==s.actorId),familyFee=livingMembers.filter(n=>['wife','husband','concubine'].includes(n.role)).length+Math.ceil(livingMembers.filter(n=>(s.day-n.birthDay)/360<18).length*.5)+livingMembers.filter(n=>n.role==='退居长辈').length, living=3+familyFee+Math.max(0,(s.family.home?.level||0)-1);
 const stipend=(s.identities.office||0)*3,healthy=s.silver+income+stipend>=expenses+living;this.apply({silver:income+stipend-expenses-living,health:healthy?3:-4,heat:-2});
 s.estateLedger.unshift({day:s.day,income,stipend,expenses,living,production});s.estateLedger=s.estateLedger.slice(0,45);
 if(s.heat>=45&&s.day%3===0){this.apply({silver:-15});this.log('风声渐紧','盘查多付15两打点费。');}
 for(const l of s.letters.filter(l=>l.day<=s.day)){const p=this.person(l.to);this.apply({['relations.'+l.to]:1});this.log('远方回信',`${p?.name||'故人'}从${this.w.cities.find(c=>c.id===this.personCity(l.to))?.name}回信，问候了近况。`);}s.letters=s.letters.filter(l=>l.day>s.day);
 for(const n of s.family.members)if(n.pid&&!n.deathDay&&(s.day-n.birthDay)/360>=76){n.deathDay=s.day;s.family.pregnancies=s.family.pregnancies.filter(p=>p.parentId!==n.id);this.log('家中讣告',`${n.name}寿终，姓名与一生留在族谱中。`);}
 if(s.day%30===0){
  const mobile=this.people().filter(p=>p.mobile&&!s.family.members.some(n=>n.pid===p.id));if(mobile.length&&this.rng()<.6){const p=this.random(mobile),at=this.w.cities.find(c=>c.id===this.personCity(p.id));s.locations[p.id]=this.random(at.links);if(s.known.includes(p.id))this.log('故人行踪',`${p.name}来信说将去${this.w.cities.find(c=>c.id===s.locations[p.id]).name}小住。`);}
  for(const n of this.household()){if(!s.family.fertility||s.day<n.nextPregnancy||s.family.pregnancies.some(x=>x.parentId===n.id))continue;const age=n.gender==='女'?(s.day-n.birthDay)/360:this.ageNow();if(age<18||age>43||this.ageNow()>65||s.journey||s.city!==s.family.home?.city||!healthy)continue;if(this.rng()<.24){s.family.pregnancies.push({parentId:n.id,ownerId:s.actorId,due:s.day+270});n.nextPregnancy=s.day+630;this.log('家有喜讯',`${n.gender==='女'?n.name:s.name}有孕，预计九个月后添丁。`);}}
  if(s.family.members.length>1&&!s.pending&&!s.journey&&this.rng()<.08)this.openIncident('family',this.random(['family-clan','family-property','family-school','family-gossip']),{personId:this.household()[0]?.pid});
 }
 for(const pregnancy of [...s.family.pregnancies])if(pregnancy.due<=s.day){const parent=s.family.members.find(n=>n.id===pregnancy.parentId),owner=s.family.members.find(n=>n.id===pregnancy.ownerId),name=(owner?.name||s.name)[0]+this.random(['知安','承宁','明舒','怀瑾','见溪','长青','望川','晚棠']);let actual=name;if(s.family.members.some(n=>n.name===name))actual=name+String(s.family.members.length);
  const node={id:'child'+s.family.members.length,name:actual,gender:this.random(['男','女']),birthDay:s.day,role:parent?.role==='concubine'?'庶出':'嫡出',lineage:parent?.role==='concubine'?'庶':'嫡',fatherId:owner?.gender==='男'?pregnancy.ownerId:parent?.id,motherId:owner?.gender==='女'?pregnancy.ownerId:parent?.id,generation:(owner?.generation||s.generation)+1,education:{},genes:cp(s.stats)};s.family.members.push(node);s.family.pregnancies=s.family.pregnancies.filter(p=>p!==pregnancy);this.log('家有新丁',`${parent?.name||owner?.name}一房添了${node.gender==='男'?'男孩':'女孩'}，取名${actual}，记为${node.lineage}出。`);}
 if(s.day%7===0&&!s.pending&&!s.journey&&s.assets.length&&s.day-s.estateDay>=7){const a=this.random(s.assets),policy=this.w.assetPolicies.find(p=>p.id===a.policy);if(this.rng()<.22*policy.risk*(1-a.security*.18)){s.estateDay=s.day;this.openIncident('estate',this.random(['estate-tax','estate-rival','estate-protection','estate-audit']),{key:a.key});}}
 if(s.routes.official>=25)s.identities.office=Math.max(s.identities.office,Math.min(4,Math.floor(s.routes.official/25)));if(s.routes.martial>=25&&!s.identities.sectLeader)s.identities.sect=Math.max(s.identities.sect,Math.min(4,Math.floor(s.routes.martial/25)));
 this.rescue();const lifespan=Math.min(105,70+Math.floor(s.stats.constitution/4)+Math.floor(s.stats.luck/6));if(this.ageNow()>=lifespan){s.alive=false;s.health=0;const actor=s.family.members.find(n=>n.id===s.actorId);if(actor)actor.deathDay=s.day;s.pending=null;s.incident=null;s.journey=null;this.log('一生落幕',`${s.name}享年${this.ageNow()}岁。家业留在族谱中，可由成年子女接续。`);}
 if(!s.alive||s.pending)return;const due=s.due.find(d=>d.day<=s.day&&!s.seen[d.id]);if(due){s.due=s.due.filter(d=>d!==due);this.open(due.id);}else if(allowEvent&&!s.journey&&this.rng()<.25)this.dispatch();
};
P.endDay=function(){if(!this.free())return false;this.tick();return true;};
P.rescue=function(){if(this.s.health<=0&&this.s.alive){this.s.health=35;this.s.silver=Math.floor(this.s.silver*.6);this.log('险死还生','医馆救治后健康恢复35，现银减少四成。');}};
const track=(name,success,record)=>{const original=P[name];if(typeof original!=='function')return;P[name]=function(...args){const result=original.apply(this,args);if(success(result)&&this.s?.achievementBook)record.call(this,result,args);return result;};};
track('choose',result=>!!result?.ok,function(){this.s.achievementBook.stats.choices++;});
track('practice',Boolean,function(){this.s.achievementBook.stats.practiceSessions++;});
track('retreat',Boolean,function(){this.s.achievementBook.stats.practiceSessions++;});
track('trade',Boolean,function(){const stats=this.s.achievementBook.stats,row=this.s.tradeLedger[0];stats.tradeDeals++;if(row?.profit>0)stats.tradeProfit+=row.profit;});
const arrive=P.arrive;P.arrive=function(...args){arrive.apply(this,args);const stats=this.s?.achievementBook?.stats;if(stats?.visitedCities&&!stats.visitedCities.includes(this.s.city))stats.visitedCities.push(this.s.city);};
}
if(typeof module!=='undefined'&&module.exports)module.exports=install;else install(root.ShanheEngine.Game);
})(typeof window!=='undefined'?window:globalThis);
