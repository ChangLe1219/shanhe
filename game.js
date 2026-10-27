const SAVE_KEY = 'shanhe-ju-v1';
const ORIGINS = [
  { name:'寒门书生', detail:'家中清贫，靠一封荐书来到澜州。读书与结交是你的本钱。', start:{silver:58,fame:4,favor:2}, mods:{intellect:12,insight:8,charm:3} },
  { name:'行商之子', detail:'跟着商队走过半个庆国，手里有本旧账，父亲却突然失踪。', start:{silver:145,fame:2,favor:3}, mods:{business:16,charm:5,insight:4} },
  { name:'将门旁支', detail:'家族曾在北境立功，如今只剩一块旧令牌和几封人情信。', start:{silver:92,fame:8,favor:4}, mods:{martial:12,strategy:7,physique:8} },
  { name:'官宦遗孤', detail:'父亲死于一桩旧案。你被送到澜州，名字仍在某些人的名册上。', start:{silver:72,fame:5,favor:7}, mods:{intellect:8,strategy:8,insight:10} },
  { name:'江湖门人', detail:'师门不问朝堂，却有人托你查一批失踪的军粮。', start:{silver:66,fame:3,favor:2}, mods:{martial:15,insight:8,physique:6} },
  { name:'皇商旧族', detail:'祖上替内库办过差，家道中落后仍有人暗中盯着你。', start:{silver:125,fame:5,favor:6}, mods:{business:10,strategy:8,charm:6} }
];
const TALENTS = [
  {name:'过目不忘',stat:'intellect',desc:'读卷宗、学政务更快。'},{name:'察言观色',stat:'insight',desc:'更容易看出话里的隐情。'},
  {name:'长袖善舞',stat:'charm',desc:'结交人物时更容易获得好感。'},{name:'铁算盘',stat:'business',desc:'做生意获利更多。'},
  {name:'临危不乱',stat:'strategy',desc:'危机事件中更容易全身而退。'},{name:'筋骨奇佳',stat:'martial',desc:'习武与江湖行动更有优势。'}
];
const STAT_LABELS = {intellect:'才学',martial:'武学',strategy:'谋略',business:'经营',charm:'交际',insight:'洞察',physique:'体魄'};
const PEOPLE = [
  {id:'shen',name:'沈砚',gender:'男',role:'监察院录事',face:'沈',faction:'court'},
  {id:'tang',name:'唐绮',gender:'女',role:'云平码头商会少东家',face:'唐',faction:'guild'},
  {id:'du',name:'杜魁',gender:'男',role:'漕帮堂主',face:'杜',faction:'gang'},
  {id:'lin',name:'林知意',gender:'女',role:'州学教谕之女',face:'林',faction:'court'}
];
const FACTIONS = [{id:'court',name:'州府与监察院',icon:'印'},{id:'guild',name:'云平码头商会',icon:'商'},{id:'gang',name:'澜州漕帮',icon:'舟'}];
const CLUES = ['河仓账目有两种笔迹','运粮船曾在三号码头改道','失踪仓吏留下一枚监察院铜牌'];
const ACTIONS = [
  {id:'investigate',icon:'🔎',name:'追查河仓旧账',tag:'主线调查',desc:'走访码头、翻查旧卷，寻找失粮案线索。'},
  {id:'business',icon:'🪙',name:'经营铺面',tag:'商路经营',desc:'投资货物或稳住商铺，赚银两、攒口碑。'},
  {id:'court',icon:'📜',name:'赴州府当差',tag:'仕途权谋',desc:'处理公文、拜访上官，积累官声与人情。'},
  {id:'network',icon:'🍵',name:'拜访熟人',tag:'人脉交际',desc:'走动于商会、衙门和漕帮之间。'},
  {id:'train',icon:'⚔️',name:'修习本领',tag:'自由成长',desc:'读书、练武或静心，提升短板并恢复心力。'},
  {id:'marry',icon:'🌸',name:'登门议亲',tag:'婚姻家族',desc:'若缘分与家境合适，便为自己谋一桩婚事。'}
];
const freshState = () => ({started:false,day:1,character:null,energy:3,silver:80,fame:0,favor:0,official:0,stress:0,
  stats:{intellect:40,martial:40,strategy:40,business:40,charm:40,insight:40,physique:40},factions:{court:8,guild:5,gang:3},
  relations:{shen:12,tang:10,du:6,lin:12},assets:{shopLevel:1,home:'客栈长租房',warehouse:0},martialSkills:{sword:0,internal:0,footwork:0},
  inventory:{'旧荐书':1,'随身短刃':1,'干粮':3,'伤药':1},recentEvents:[],clues:[],married:false,spouse:'',children:0,childAt:0,caseResolved:'',event:null,log:[]});
let state = loadState(), toastTimer;
function loadState(){try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY));if(!raw)return freshState();const base=freshState();return {...base,...raw,stats:{...base.stats,...raw.stats},factions:{...base.factions,...raw.factions},relations:{...base.relations,...raw.relations},assets:{...base.assets,...raw.assets},martialSkills:{...base.martialSkills,...raw.martialSkills},inventory:{...base.inventory,...raw.inventory},recentEvents:raw.recentEvents||[]}}catch{return freshState()}}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state))}catch{}}
function rand(list){return list[Math.floor(Math.random()*list.length)]}
function clamp(value,min=0,max=100){return Math.max(min,Math.min(max,value))}
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
function addLog(message){state.log.unshift({day:state.day,message});state.log=state.log.slice(0,6)}
function generateCharacter(){
  const origin=rand(ORIGINS),talent=rand(TALENTS),gender=rand(['男','女']);
  const names=gender==='男'?['顾行舟','裴知远','陆承安','萧景澄','沈怀瑾','贺云章']:['顾明棠','裴令仪','陆清和','萧知微','沈月白','贺兰音'];
  const stats={};Object.keys(STAT_LABELS).forEach(key=>stats[key]=clamp(25+Math.floor(Math.random()*31)+(origin.mods[key]||0)));
  stats[talent.stat]=clamp(stats[talent.stat]+10);
  state.character={name:rand(names),gender,origin:origin.name,originDetail:origin.detail,talent:talent.name,talentDesc:talent.desc};
  state.stats=stats;state.silver=origin.start.silver;state.fame=origin.start.fame;state.favor=origin.start.favor;
  state.assets={shopLevel:1,home:origin.name==='皇商旧族'?'祖宅偏院':origin.name==='行商之子'?'商队货栈':'客栈长租房',warehouse:0};
  state.martialSkills={sword:origin.name==='江湖门人'?18:0,internal:origin.name==='将门旁支'?12:0,footwork:0};
  state.inventory={'旧荐书':origin.name==='寒门书生'||origin.name==='官宦遗孤'?1:0,'随身短刃':1,'干粮':3,'伤药':1};
  if(origin.name==='皇商旧族')state.inventory['旧商号印信']=1;if(origin.name==='江湖门人')state.inventory['师门腰牌']=1;
  state.recentEvents=[];
  state.day=1;state.energy=3;state.started=false;state.clues=[];state.married=false;state.spouse='';state.children=0;state.childAt=0;
  state.official=0;state.stress=0;state.caseResolved='';state.event=null;state.log=[];state.factions={court:8,guild:5,gang:3};state.relations={shen:12,tang:10,du:6,lin:12};render();
}
function dateText(){const year=17+Math.floor((state.day-1)/30),d=(state.day-1)%30;return '景和'+year+'年 · '+['春','春','夏','夏','秋','秋','冬','冬','冬','冬'][Math.floor(d/3)]+'月'+(d+1)+'日'}
function eligibleSuitor(){if(state.married)return null;return PEOPLE.filter(p=>p.gender!==state.character.gender&&state.relations[p.id]>=35).sort((a,b)=>state.relations[b.id]-state.relations[a.id])[0]||null}
function rankName(){if(state.official>=75)return '州府重臣';if(state.official>=48)return '六品官';if(state.official>=25)return '九品官';if(state.official>=10)return '候补官';return '布衣'}
function render(){
  document.getElementById('creation').classList.toggle('hidden',state.started);document.getElementById('game').classList.toggle('hidden',!state.started);
  document.getElementById('silver').textContent=state.silver;document.getElementById('fame').textContent=state.fame;document.getElementById('day-label').textContent=state.started?dateText():'未开局';
  if(!state.character)generateCharacter();renderCreation();if(state.started)renderGame();
}
function renderCreation(){
  const c=state.character,o=ORIGINS.find(x=>x.name===c.origin),t=TALENTS.find(x=>x.name===c.talent);
  document.getElementById('origin-card').innerHTML='<div class="origin-emblem">'+(c.gender==='男'?'公子':'姑娘')+'</div><div class="origin-copy"><div><span class="origin-name">'+c.origin+'</span><span class="gender-pill">'+c.gender+'</span><span class="talent-pill">天赋 · '+c.talent+'</span></div><p>'+c.originDetail+'</p><small>'+t.desc+' · 起始银两 '+o.start.silver+' · 初始人情 '+o.start.favor+'</small></div>';
  document.getElementById('attribute-roll').innerHTML=Object.entries(STAT_LABELS).map(([k,l])=>'<div class="roll-stat"><span>'+l+'</span><b>'+state.stats[k]+'</b><i><em style="width:'+state.stats[k]+'%"></em></i></div>').join('');
}
function renderGame(){
  const c=state.character;document.getElementById('portrait').textContent=c.name.slice(0,1);document.getElementById('character-name').textContent=c.name;
  document.getElementById('identity-kicker').textContent=c.gender+' · '+c.origin+' · '+c.talent;document.getElementById('identity-desc').textContent=c.originDetail;
  document.getElementById('energy').textContent=state.energy;document.getElementById('energy-fill').style.width=(state.energy/3*100)+'%';document.getElementById('date-kicker').textContent=dateText();
  document.getElementById('scene-title').textContent=state.caseResolved?'旧案已了，澜州仍有新局':'澜州城里，风声渐紧';
  document.getElementById('scene-copy').textContent=state.caseResolved?'河仓案的结局是：'+state.caseResolved+' 商路重新热闹起来，衙门里却有人记住了你的名字。新的机会与旧的恩怨，都还在城中发酵。':'入城不久，河仓失粮案的风声传遍了茶楼。州府说是账目差错，码头商人说有人截了运粮船，漕帮却只说那晚河上起了雾。你在茶楼听见账册有异，决定从这条线索查起。';
  document.getElementById('quest-copy').textContent=state.caseResolved?'这桩旧账已留下结局。你仍可自由经营、交友、入仕或成家。':'去年冬天，澜州河仓少了三千石军粮。账册、码头与一名失踪仓吏，指向三股互不信任的势力。';
  document.getElementById('clue-count').textContent=state.clues.length+' / 3';document.getElementById('clue-fill').style.width=(state.clues.length/3*100)+'%';
  document.getElementById('clue-list').innerHTML=CLUES.map((x,i)=>'<div class="clue '+(state.clues.includes(i)?'found':'')+'"><span>'+(state.clues.includes(i)?'✓':'·')+'</span>'+(state.clues.includes(i)?x:'待发现的线索')+'</div>').join('');
  document.getElementById('stats-list').innerHTML=Object.entries(STAT_LABELS).map(([k,l])=>'<div class="stat-line"><span>'+l+'</span><i><em style="width:'+state.stats[k]+'%"></em></i><b>'+state.stats[k]+'</b></div>').join('');
  document.getElementById('rank-label').textContent=rankName();document.getElementById('favor').textContent=state.favor;document.getElementById('official').textContent=state.official;document.getElementById('stress').textContent=state.stress;
  document.getElementById('faction-list').innerHTML=FACTIONS.map(f=>'<div class="faction-row"><span class="faction-icon">'+f.icon+'</span><span>'+f.name+'</span><b>'+state.factions[f.id]+'</b><i><em style="width:'+state.factions[f.id]+'%"></em></i></div>').join('');
  renderProfile();renderPeople();renderActions();renderEvent();renderResolution();
  document.getElementById('chronicle').innerHTML=state.log.length?state.log.map(x=>'<div class="chronicle-item"><span>第'+x.day+'日</span><p>'+x.message+'</p></div>').join(''):'<div class="empty-note">澜州的故事，正等你落下第一笔。</div>';
  document.getElementById('end-day').disabled=!!state.event;
}
function renderProfile(){
  const a=state.assets, upgradeCost=120+(a.shopLevel-1)*110;
  document.getElementById('asset-content').innerHTML='<div class="asset-row"><span>现银</span><b>🪙 '+state.silver+' 两</b></div><div class="asset-row"><span>自营铺面</span><b>澜州杂货铺 · Lv.'+a.shopLevel+'</b></div><div class="asset-row"><span>居所</span><b>'+a.home+'</b></div><div class="asset-row"><span>仓储</span><b>'+a.warehouse+' 间</b></div><div class="asset-row"><span>估算家业</span><b>约 '+(state.silver+a.shopLevel*100+a.warehouse*45)+' 两</b></div>';
  const upgrade=document.getElementById('expand-shop');upgrade.textContent='扩建铺面 · '+upgradeCost+' 两';upgrade.disabled=state.silver<upgradeCost;
  const skills=[['sword','剑术'],['internal','内功'],['footwork','轻身功']];
  document.getElementById('martial-summary').innerHTML='<div class="martial-rating"><span>武学根骨</span><b>'+state.stats.martial+'</b><small>体魄 '+state.stats.physique+' · 实战潜力 '+Math.min(100,Math.floor((state.stats.martial+state.stats.physique+skills.reduce((n,x)=>n+state.martialSkills[x[0]],0))/3))+'</small></div>';
  document.getElementById('martial-skills').innerHTML=skills.map(([key,label])=>'<div class="skill-row"><span>'+label+'</span><i><em style="width:'+state.martialSkills[key]+'%"></em></i><b>'+Math.floor(state.martialSkills[key]/20)+'阶</b><small>熟练 '+state.martialSkills[key]+' / 100</small></div>').join('');
  const itemNotes={'旧荐书':'入仕时可作为引荐凭据','随身短刃':'普通防身兵器','干粮':'旅途中备用','伤药':'探索受伤时可用','旧商号印信':'祖上留下的商号凭信','师门腰牌':'江湖身份凭证','账册残页':'河仓案的重要物证','证人证词':'可以佐证账册的口供'};
  const items=Object.entries(state.inventory).filter(([,count])=>count>0);
  document.getElementById('inventory-list').innerHTML=items.length?items.map(([name,count])=>'<div class="inventory-item"><span class="item-icon">'+(name.includes('账')||name.includes('证')?'📜':name.includes('短刃')?'🗡️':name.includes('药')?'🧴':name.includes('干粮')?'🍞':'🎒')+'</span><span><b>'+name+'</b><small>'+(itemNotes[name]||'随身物品')+'</small></span><strong>×'+count+'</strong></div>').join(''):'<div class="empty-note">行囊空空，往后的旅途会慢慢添上故事。</div>';
}
function renderPeople(){
  document.getElementById('people-list').innerHTML=PEOPLE.map(p=>'<div class="person-row"><span class="person-avatar">'+p.face+'</span><span class="person-copy"><b>'+p.name+(state.spouse===p.name?' · 配偶':'')+'</b><small>'+p.role+'</small></span><span class="affinity">♡ '+state.relations[p.id]+'</span></div>').join('');
  document.getElementById('family-card').innerHTML=state.married?'<div class="family-heading">🏮 家有归处 <span>已成婚</span></div><p>你与'+state.spouse+'互为倚靠。家中安稳，也让你在城里多了一份牵挂。</p><div class="family-foot">子女 <b>'+(state.children?state.children+' 人':'尚无')+'</b> · 家业有人承继</div>':'<div class="family-heading">🏮 家族与传承 <span>待续</span></div><p>人脉深厚、家业稳定之后，可以登门议亲。成家会带来新的盟友，也会让你的选择牵动家人。</p>';
}
function renderActions(){
  const suitor=eligibleSuitor();
  document.getElementById('action-grid').innerHTML=ACTIONS.map(a=>{
    let disabled=state.energy<=0||!!state.event,desc=a.desc;
    if(a.id==='marry'){if(!suitor){disabled=true;desc=state.married?'你已与'+state.spouse+'结为连理。':'先与合适的人多来往，缘分深了再登门议亲。'}else desc='与'+suitor.name+'相识已深，可登门议亲。';}
    return '<button class="action-card '+(disabled?'disabled':'')+'" data-action="'+a.id+'" '+(disabled?'disabled':'')+'><span class="action-icon">'+a.icon+'</span><span class="action-meta"><small>'+a.tag+'</small><b>'+a.name+'</b><em>'+desc+'</em></span><span class="action-cost">1 行程</span></button>';
  }).join('');
}
function renderEvent(){
  const box=document.getElementById('event-box');if(!state.event){box.classList.add('hidden');box.innerHTML='';return}box.classList.remove('hidden');
  box.innerHTML='<div class="event-kicker">突发 · 需要你定夺</div><h3>'+state.event.title+'</h3><p>'+state.event.text+'</p><div class="event-choices">'+state.event.choices.map((x,i)=>'<button class="choice-button" data-choice="'+i+'"><b>'+x.label+'</b><small>'+x.note+'</small></button>').join('')+'</div>';
}
function renderResolution(){
  const box=document.getElementById('resolution-box');if(state.clues.length<3||state.caseResolved){box.classList.add('hidden');box.innerHTML='';return}box.classList.remove('hidden');
  box.innerHTML='<div class="event-kicker">主线抉择 · 河仓旧账</div><h3>三条线索，拼出一张利益网</h3><p>旧账指向州府粮款、商会船契与漕帮夜渡。你已查出谁动了粮，却还要决定把证据交给谁。</p><div class="event-choices"><button class="choice-button" data-ending="court"><b>递交监察院</b><small>官声与朝廷信任上升，得罪漕帮。</small></button><button class="choice-button" data-ending="guild"><b>公开账册，逼各方交代</b><small>百姓声望与商会态度上升，州府不悦。</small></button><button class="choice-button" data-ending="private"><b>暂存证据，留作筹码</b><small>获得银两与人情，往后仍可能被旧案牵制。</small></button></div>';
}
function renderTabs(tab){
  document.querySelectorAll('.profile-tab').forEach(button=>button.classList.toggle('active',button.dataset.tab===tab));
  document.querySelectorAll('.profile-view').forEach(view=>view.classList.toggle('hidden',view.id!=='tab-'+tab));
}
function runBusiness(){
  const roll=Math.random(),bonus=Math.floor(state.stats.business/10)+(state.assets.shopLevel-1)*9;
  let label,delta,fame=0;
  if(roll<.13){label='一位富家小姐进店挑货，胭脂、绸缎和香料都要了几份';delta=54+Math.floor(Math.random()*68)+bonus;fame=2;}
  else if(roll<.31){label='外地客商临时补货，一次买走一批常用货';delta=30+Math.floor(Math.random()*46)+bonus;}
  else if(roll<.71){label='附近街坊陆续来买些日用品';delta=7+Math.floor(Math.random()*30)+bonus;}
  else if(roll<.86){label='一批货在仓里受潮，折价清出去才没全赔';delta=-(12+Math.floor(Math.random()*30));}
  else if(roll<.94){label='下雨天客人稀少，伙计工钱和灯油倒照常支出';delta=-(4+Math.floor(Math.random()*13));}
  else{label='熟客替你介绍了一笔急单，买家多付了定金';delta=26+Math.floor(Math.random()*37)+bonus;fame=1;state.favor=clamp(state.favor+2);}
  const levelBonus=Math.floor((state.assets.shopLevel-1)*8);
  if(delta>0)delta+=levelBonus;
  state.silver=Math.max(0,state.silver+delta);state.fame=clamp(state.fame+fame);state.stats.business=clamp(state.stats.business+1);
  const result=label+'，今日'+(delta>=0?'净入':'亏损')+Math.abs(delta)+' 两。';
  addLog(result);return result;
}
function rollActionEvent(action){
  if(Math.random()>.2)return;
  const pools={
    investigate:['witness','falseLead','rumor','bribe'],
    business:['extortion','guildOrder','badCargo','rival'],
    court:['bribe','petition','audit','rumor'],
    network:['invitation','rumor','blackmail','teacher'],
    train:['teacher','sparring','medicine','rumor'],
    marry:['invitation','rumor']
  };
  const available=(pools[action]||pools.network).filter(id=>!state.recentEvents.includes(id));
  const type=rand(available.length?available:pools[action]||pools.network);
  state.recentEvents.push(type);state.recentEvents=state.recentEvents.slice(-2);triggerEvent(type);
}
function triggerEvent(type){
  const events={
    bribe:{title:'一封没有署名的银票',text:'州府书吏把一张银票压在卷宗下，说只要把河仓案的几页账目“抄错”，往后办事便有人照应。',choices:[
      {label:'收下银票',note:'银两增加，官声与监察院信任受损。',effects:{silver:38,official:-7,faction:{court:-8},stress:3}},
      {label:'当面退回，记下他的名字',note:'官声上升，但书吏会记恨你。',effects:{official:5,fame:4,faction:{court:4},stress:2}},
      {label:'不收也不揭穿，先留个人情',note:'人情增加，心里多一层负担。',effects:{favor:8,stress:5}}]},
    extortion:{title:'码头上的“过路钱”',text:'漕帮的人拦住你的货车，说澜州规矩是每批货都要交一份“河道钱”。他们的目光落在你的商铺账本上。',choices:[
      {label:'付钱过关',note:'花银两换取漕帮照应。',effects:{silver:-24,faction:{gang:9},stress:-2}},
      {label:'请商会出面谈规矩',note:'增加商会人情，商会会记下这次互助。',effects:{faction:{guild:7,gang:-3},favor:3}},
      {label:'拿出州府批文据理力争',note:'官声略升，可能让帮会盯上你。',effects:{official:3,faction:{court:3,gang:-7},stress:5}}]},
    witness:{title:'证人想要一条退路',text:'失踪仓吏的妹妹愿意交出一页账底，但她担心家人被牵连。她只信任肯先替她安排退路的人。',choices:[
      {label:'花银子安排她离城',note:'获得线索与证人信任。',effects:{silver:-18,clue:true,favor:5,fame:3}},
      {label:'请沈砚用监察院名义保护她',note:'获得线索，朝廷更信任你。',effects:{clue:true,faction:{court:9},relations:{shen:8},official:2}},
      {label:'先不暴露身份，暗中跟踪',note:'洞察与谋略够高时可能获得线索，压力增加。',effects:{clueCheck:true,stress:5}}]},
    invitation:{title:'两张请帖，同一场夜宴',text:'商会设宴款待新贵，州府师爷也托人邀你去听琴。两边都说“只是吃顿便饭”，桌上却坐着不同的人。',choices:[
      {label:'去商会夜宴',note:'商会关系与经营机会提升。',effects:{faction:{guild:10},favor:5,silver:12}},
      {label:'赴州府雅集',note:'官声、人情提升，也会引起商会猜疑。',effects:{faction:{court:8,guild:-2},official:3,favor:4}},
      {label:'两边都不去，找杜魁喝酒',note:'漕帮好感上升，可能听到码头消息。',effects:{faction:{gang:10},relations:{du:8},clueChance:true}}]},
    guildOrder:{title:'商会递来一笔急单',text:'商会急着给北境军需凑齐一批冬衣和药材，唐绮愿意把订单交给你，但交货期限很紧。',choices:[
      {label:'接下订单，先垫货款',note:'投入银两换取高额回款与商会信任。',effects:{silver:-22,faction:{guild:10},relations:{tang:5},fame:4}},
      {label:'只做其中一半，稳妥交货',note:'小赚一笔，不必冒太大风险。',effects:{silver:28,faction:{guild:5},favor:2}},
      {label:'转给熟悉的商户，收一笔佣金',note:'收益较少，但多一份人情。',effects:{silver:18,favor:5}}]},
    badCargo:{title:'库房里少了一箱货',text:'伙计盘点时发现一箱香料不翼而飞。账房说昨夜有人见过漕帮的船，也有人说是新雇的搬运工动了手脚。',choices:[
      {label:'按规矩报官',note:'追回部分损失，官府留意到你的铺面。',effects:{silver:15,faction:{court:4,gang:-2}}},
      {label:'私下找杜魁问清楚',note:'可能换来补偿，也会欠漕帮一个人情。',effects:{silver:8,relations:{du:6},faction:{gang:4}}},
      {label:'认赔并整顿库房',note:'损失银两，但经营能力得到锻炼。',effects:{silver:-20,stress:-3}}]},
    rival:{title:'隔壁新铺开张',text:'新来的绸缎铺用低价抢客，伙计建议你跟着降价；唐绮却说澜州人看重的是货真价实。',choices:[
      {label:'暂时降价，守住客流',note:'少赚一些，保住街坊口碑。',effects:{silver:12,fame:4,faction:{guild:2}}},
      {label:'推出自家招牌货',note:'经营能力越高，卖得越好。',effects:{silver:Math.floor(state.stats.business/2),fame:7,stats:{business:2}}},
      {label:'请商会调停，约定公平市价',note:'获得商会支持，但要付一笔会费。',effects:{silver:-8,faction:{guild:9},favor:3}}]},
    falseLead:{title:'茶楼里的假消息',text:'有人声称见过失踪仓吏，带你绕了半座城后却开口索要“问路钱”。你意识到这可能是有人故意放出的烟幕。',choices:[
      {label:'给钱打发他',note:'损失少量银两，避免惹出更大麻烦。',effects:{silver:-8}},
      {label:'追问消息来源',note:'洞察高时可拆穿谎言，提升声望。',effects:{insightCheck:true,fame:2}},
      {label:'借沈砚的名义带他回衙门',note:'官府关系上升，但人情会被记下。',effects:{faction:{court:5},favor:-2}}]},
    petition:{title:'百姓递来一纸诉状',text:'一户船工人家说，河仓失粮后他们被扣了三个月工钱。州府师爷提醒你，若追查下去会碰到仓场主事。',choices:[
      {label:'替他们把诉状送进州府',note:'官声提升，也会得罪仓场主事。',effects:{official:5,fame:7,faction:{court:3},stress:3}},
      {label:'请商会先垫付工钱',note:'商会态度变好，欠下一份人情。',effects:{faction:{guild:5},favor:4,silver:-12}},
      {label:'暂时收下诉状，等查案有进展再办',note:'保留证据，不立刻站队。',effects:{clueChance:true,favor:2}}]},
    audit:{title:'账房被叫去核账',text:'州府突然要核查你的铺面账册。师爷暗示，只要送些礼，许多手续可以省去。',choices:[
      {label:'按账册逐项配合',note:'守住清白，耗费一些心力。',effects:{official:4,fame:3,stress:4}},
      {label:'递上一封礼金',note:'手续很快办妥，但留下把柄。',effects:{silver:-18,favor:4,official:-3}},
      {label:'请商会出面作保',note:'商会替你担保，也会要求你以后互相照应。',effects:{faction:{guild:7},favor:3}}]},
    rumor:{title:'一则牵动三方的传言',text:'茶摊上有人说，北境军械的采购名单里出现了澜州商会的名字。消息半真半假，却已经传到衙门和码头。',choices:[
      {label:'托熟人查证',note:'多一份人情，消息未必可靠。',effects:{favor:4,clueChance:true}},
      {label:'把消息卖给商会',note:'得到银两，州府会觉得你站错了边。',effects:{silver:22,faction:{guild:5,court:-3}}},
      {label:'装作没听见',note:'不卷入风波，恢复一些心力。',effects:{stress:-4}}]},
    teacher:{title:'旧师访城',text:'一位云游武师在客栈住下，看出你根骨不错，愿意指点一招，但要你先帮他找回遗失的药囊。',choices:[
      {label:'花钱买下他的指点',note:'银两换来武学进境。',effects:{silver:-15,skill:{internal:18},martial:2}},
      {label:'答应帮他寻药囊',note:'获得武师好感与一包伤药。',effects:{skill:{sword:10,footwork:8},item:{伤药:1},favor:3}},
      {label:'婉拒，专心自己的修习',note:'不花钱，静心恢复。',effects:{stress:-5}}]},
    sparring:{title:'漕帮的切磋邀约',text:'杜魁的手下在河边练拳，邀你下场试试。赢了能交个朋友，输了也不至于丢命。',choices:[
      {label:'以武会友',note:'武学高时收益更大，否则会受点轻伤。',effects:{sparCheck:true,relations:{du:5},faction:{gang:4}}},
      {label:'只旁观，不下场',note:'观察招式，积累武学心得。',effects:{skill:{sword:5,footwork:5},insight:1}},
      {label:'请他们喝酒赔礼',note:'花银两换来漕帮人情。',effects:{silver:-10,relations:{du:8},faction:{gang:3}}}]}
  };state.event=events[type]||null;
}
function addClue(){const id=[0,1,2].find(x=>!state.clues.includes(x));if(id!==undefined){state.clues.push(id);state.inventory['账册残页']=(state.inventory['账册残页']||0)+1;addLog('查案有了进展：'+CLUES[id]+'。证物已收进行囊。')}}
function applyEffects(e){
  ['silver','fame','favor','official','stress'].forEach(k=>{if(e[k])state[k]=k==='silver'?Math.max(0,state[k]+e[k]):clamp(state[k]+e[k])});
  if(e.faction)Object.entries(e.faction).forEach(([k,v])=>state.factions[k]=clamp(state.factions[k]+v));
  if(e.relations)Object.entries(e.relations).forEach(([k,v])=>state.relations[k]=clamp(state.relations[k]+v));
  if(e.stats)Object.entries(e.stats).forEach(([k,v])=>state.stats[k]=clamp(state.stats[k]+v));
  if(e.skill)Object.entries(e.skill).forEach(([k,v])=>state.martialSkills[k]=clamp(state.martialSkills[k]+v));
  if(e.item)Object.entries(e.item).forEach(([k,v])=>state.inventory[k]=(state.inventory[k]||0)+v);
  if(e.clue){addClue();state.inventory['证人证词']=(state.inventory['证人证词']||0)+1}if(e.clueCheck){if(state.stats.insight+state.stats.strategy>100)addClue();else state.fame=clamp(state.fame+2)}
  if(e.clueChance&&Math.random()<.55)addClue();
  if(e.insightCheck){if(state.stats.insight>55){state.fame=clamp(state.fame+5);addLog('你识破了假消息背后的托词。')}else state.stress=clamp(state.stress+3)}
  if(e.sparCheck){if(state.stats.martial+state.stats.physique>105){state.martialSkills.sword=clamp(state.martialSkills.sword+14);state.fame=clamp(state.fame+3)}else{state.stress=clamp(state.stress+5);state.inventory['伤药']=(state.inventory['伤药']||0)+1}}
}
function completeAction(id){
  if(state.energy<=0||state.event)return;state.energy--;
  const s=state.stats;
  if(id==='investigate'){
    if(!state.caseResolved){addClue();state.fame=clamp(state.fame+2);state.stress=clamp(state.stress+2)}
    else{state.favor=clamp(state.favor+3);state.fame=clamp(state.fame+2);addLog('你继续追查城中传闻，替一名小吏洗清了嫌疑。')}
  }else if(id==='business'){
    runBusiness();
  }else if(id==='court'){
    state.official=clamp(state.official+4+Math.floor(s.intellect/30));state.favor=clamp(state.favor+2);state.factions.court=clamp(state.factions.court+3);s.intellect=clamp(s.intellect+1);addLog('你在州府办妥一件差事，官声与监察院信任有所提升。');
  }else if(id==='network'){
    const p=rand(PEOPLE),gain=5+Math.floor(s.charm/18);state.relations[p.id]=clamp(state.relations[p.id]+gain);state.favor=clamp(state.favor+3);state.factions[p.faction]=clamp(state.factions[p.faction]+2);addLog('你与'+p.name+'喝茶叙话，好感增加 '+gain+'。');
  }else if(id==='train'){
    const focus=document.getElementById('practice-style').value,labels={sword:'剑术',internal:'内功',footwork:'轻身功'};
    const gain=10+Math.floor(s.martial/12);state.martialSkills[focus]=clamp(state.martialSkills[focus]+gain);s.martial=clamp(s.martial+1);if(focus==='internal')s.physique=clamp(s.physique+1);
    state.stress=clamp(state.stress-4);addLog('你修习'+labels[focus]+'，熟练度提升 '+gain+'，心力恢复一些。');
  }else if(id==='marry'){
    const p=eligibleSuitor();if(!p){state.energy++;return}const cost=Math.max(40,80-Math.floor(state.relations[p.id]/2));if(state.silver<cost){state.energy++;toast('礼金不足，需要 '+cost+' 两。');render();return}
    state.silver-=cost;state.married=true;state.spouse=p.name;state.childAt=state.day+12;state.factions[p.faction]=clamp(state.factions[p.faction]+8);state.fame=clamp(state.fame+4);state.favor=clamp(state.favor+5);addLog('你与'+p.name+'结为连理，两家从此多了一份共同进退的牵挂。');
  }
  if(!state.event)state.stress=clamp(state.stress+(id==='train'?0:1));
  if(!state.event)rollActionEvent(id);
  if(state.event)addLog(state.event.title+'，需要你做出选择。');
  if(!state.event)toast('行程已记下，城中局势也随之变化。');render();save();
}
function chooseEvent(index){if(!state.event)return;const choice=state.event.choices[index];if(!choice)return;applyEffects(choice.effects);state.event=null;addLog('你选择：'+choice.label+'。');toast(choice.label);render();save()}
function resolveCase(ending){
  if(state.clues.length<3||state.caseResolved)return;
  if(ending==='court'){state.caseResolved='你将证据交给监察院，州府两名官员被查办。';state.factions.court=clamp(state.factions.court+22);state.factions.gang=clamp(state.factions.gang-14);state.official=clamp(state.official+15);state.fame=clamp(state.fame+12)}
  if(ending==='guild'){state.caseResolved='账册公之于众，商会退回粮款，州府不得不向百姓交代。';state.factions.guild=clamp(state.factions.guild+18);state.factions.court=clamp(state.factions.court-12);state.fame=clamp(state.fame+20);state.silver+=35}
  if(ending==='private'){state.caseResolved='你暂存了证据，换得一笔封口银与几方人情，旧案仍是未完之局。';state.silver+=90;state.favor=clamp(state.favor+16);state.stress=clamp(state.stress+12);state.factions.court=clamp(state.factions.court-5)}
  addLog('河仓旧案有了结局：'+state.caseResolved);toast('主线结局已记录');render();save();
}
function endDay(){
  if(state.event)return;state.day++;state.energy=3;
  if(state.married&&state.children===0&&state.day>=state.childAt){state.children=1;state.fame=clamp(state.fame+3);state.favor=clamp(state.favor+2);addLog('家中添了一名孩子。你开始想，澜州这盘棋要留给怎样的后人。')}
  else if(state.married&&state.children>0&&Math.random()<.035&&state.children<3){state.children++;addLog('家中又添了一名孩子，祖宅里多了笑声。')}
  const news=rand(['州府贴出新的商税告示，商会几位掌柜连夜去了衙门。','北边来了一队换防军，客栈里多了几张生面孔。','河面涨水，码头搬运费翻了一成，漕帮开始清点船只。','州学放榜，几名新科生受到州府与商会同时邀请。','监察院的黑骑进城半日，带走一名账房先生后便悄然离开。']);
  addLog(news);state.stress=clamp(state.stress-1);render();save();toast(news);
}
document.getElementById('reroll-button').addEventListener('click',()=>{generateCharacter();toast('命格已重新抽取');save()});
document.getElementById('begin-button').addEventListener('click',()=>{state.started=true;state.clues=[0];state.inventory['账册残页']=1;addLog(state.character.name+'以'+state.character.origin+'的身份来到澜州，在茶楼听见河仓账目有异。');render();save()});
document.getElementById('action-grid').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)completeAction(b.dataset.action)});
document.getElementById('event-box').addEventListener('click',e=>{const b=e.target.closest('[data-choice]');if(b)chooseEvent(Number(b.dataset.choice))});
document.getElementById('resolution-box').addEventListener('click',e=>{const b=e.target.closest('[data-ending]');if(b)resolveCase(b.dataset.ending)});
document.querySelector('.profile-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)renderTabs(b.dataset.tab)});
document.getElementById('expand-shop').addEventListener('click',()=>{
  const cost=120+(state.assets.shopLevel-1)*110;if(state.silver<cost)return;
  state.silver-=cost;state.assets.shopLevel++;state.assets.warehouse++;state.fame=clamp(state.fame+2);
  addLog('你花 '+cost+' 两扩建铺面，添了仓房，之后接大单的机会也增加了。');toast('铺面已扩建至 Lv.'+state.assets.shopLevel);render();save();
});
document.getElementById('end-day').addEventListener('click',endDay);
document.getElementById('reset-button').addEventListener('click',()=>{if(confirm('重新生成角色并从澜州重新开始？当前存档会清空。')){localStorage.removeItem(SAVE_KEY);state=freshState();generateCharacter();save();toast('新的人生已经备好')}});
if(!state.character)generateCharacter();else render();
