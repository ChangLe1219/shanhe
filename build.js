'use strict';
const fs=require('node:fs'),path=require('node:path');
const w=require('./content/world');require('./content/expansion-world')(w);const events=[...require('./content/chapters'),...require('./content/encounters'),...require('./content/expansion-events'),...require('./content/life-events')];
const {validatePack}=require('./engine');
const errors=validatePack({formatVersion:1,events},w);
if(errors.length)throw Error(errors.join('\n'));
const label=p=>{const [a,b]=p.split('.');return ({silver:'银两',health:'健康',renown:'声望',heat:'恶名',morality:'善恶',day:'日数',energy:'行动'})[p]||(a==='stats'?w.stats[b]:a==='routes'?(w.routes.find(r=>r.id===b)?.name+'阅历'):a==='inventory'?(w.goods.find(g=>g.id===b)?.name||w.items[b]||b):a==='factions'?w.factions.find(f=>f.id===b)?.name:a==='relations'?w.people.find(n=>n.id===b)?.name:p);};
const effect=e=>Object.entries(e||{}).map(([k,v])=>`${label(k)} ${k.startsWith('flags.')?'= ':v>0?'+':''}${v}`).join('；')||'无额外数值变化';
const condition=c=>!c?'无':Object.entries(c).map(([k,v])=>{if(k==='min'||k==='max')return Object.entries(v).map(([p,n])=>`${label(p)} ${k==='min'?'≥':'≤'} ${n}`).join('；');if(k==='cities')return '地点：'+v.map(id=>w.cities.find(c=>c.id===id)?.name).join(' / ');if(k==='seen')return '已完成：'+v.join('、');if(k==='flags')return '前置标记：'+JSON.stringify(v);return k+'：'+JSON.stringify(v);}).join('；');
const count=kind=>events.filter(e=>e.kind===kind).length;
const systems=events.filter(e=>e.systemScene).length;
let book=`# 山河局 · 剧情文本全卷\n\n本文件由内容数据自动生成，是可逐段阅读的完整文本底稿。修改时请改 content/ 下的数据，再运行 node build.js 重新生成。\n\n当前包含 ${events.length} 段事件：${count('story')} 段连续篇章、${count('random')} 段随机遭遇、${count('followup')-systems} 段延迟余波与 ${systems} 段系统风波，共 ${events.reduce((n,e)=>n+e.choices.length,0)} 个选择。\n\n系统风波使用本趟货值、护航、距离、产业与家族状态动态结算，选项文字是底稿；实际数额与结果由 systems.js 处理，详见《商路与家族规则》。\n\n`;
for(const [section,kind]of [['第一卷 · 连续命途','story'],['第二卷 · 江湖遭遇','random'],['第三卷 · 余波与系统风波','followup']]){
 book+=`# ${section}\n\n`;
 for(const e of events.filter(e=>e.kind===kind)){
  book+=`## ${e.title}\n\n- ID：\`${e.id}\`\n- 道路：${e.routes.map(id=>w.routes.find(r=>r.id===id)?.name||'共同命途').join('、')}\n- 触发：${condition(e.when)}\n\n${e.text}\n\n`;
  e.choices.forEach((c,i)=>{book+=`### ${i+1}. ${c.label}\n\n`;if(c.cost)book+=`消耗：${effect(c.cost)}。\n\n`;if(c.requires)book+=`额外条件：${condition(c.requires)}。\n\n`;if(c.check){book+=`判定：${w.stats[c.check.stat]} / 难度 ${c.check.difficulty}。\n\n成功：${c.success.text}\n\n成功效果：${effect(c.success.effects)}。\n\n未成：${c.failure.text}\n\n未成效果：${effect(c.failure.effects)}。\n\n`;}else book+=`${c.text}\n\n`;book+=`共同效果：${effect(c.effects)}。\n\n`;for(const x of [c,c.success,c.failure].filter(Boolean)){if(x.delay)book+=`后续：${x.delay.days} 日后「${events.find(e=>e.id===x.delay.id)?.title}」。\n\n`;if(x.next)book+=`立即接续：${x.next}。\n\n`;}});
 }
}
fs.mkdirSync(path.join(__dirname,'docs'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'docs','剧情文本全卷.md'),book);
fs.writeFileSync(path.join(__dirname,'content','full-content.json'),JSON.stringify({formatVersion:1,name:'山河局·万象江湖',events},null,2));
fs.writeFileSync(path.join(__dirname,'docs','事件索引.md'),`# 事件索引\n\n共 ${events.length} 段事件，${events.reduce((n,e)=>n+e.choices.length,0)} 个选择。\n\n| ID | 标题 | 类别 | 道路 |\n| --- | --- | --- | --- |\n`+events.map(e=>`| ${e.id} | ${e.title} | ${{story:'主线',random:'随机',followup:'余波'}[e.kind]} | ${e.routes.map(id=>w.routes.find(r=>r.id===id)?.name||'共通').join(' / ')} |`).join('\n')+'\n');
const target=path.join(__dirname,'dist');fs.mkdirSync(target,{recursive:true});
for(const file of ['index.html','style.css','expansion.css','game.js','engine.js','systems.js','ui-expansion.js'])fs.copyFileSync(path.join(__dirname,file),path.join(target,file));
for(const dir of ['content','docs'])fs.cpSync(path.join(__dirname,dir),path.join(target,dir),{recursive:true});
const chinese=(book.match(/[\u3400-\u9fff]/g)||[]).length;
console.log(JSON.stringify({events:events.length,story:count('story'),random:count('random'),followup:count('followup'),choices:events.reduce((n,e)=>n+e.choices.length,0),storyChineseCharacters:chinese,output:target},null,2));
