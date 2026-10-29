(function(root){
function extend(w){
 if(w.expansionVersion)return w;w.expansionVersion=3;
 w.goods.push(
 {id:'porcelain',name:'瓷器',base:70,unit:'箱',desc:'云州与明州出产，北地需求高；山路颠簸时更易损坏。',fragile:true},
 {id:'cloth',name:'棉布',base:18,unit:'匹',desc:'河阳、临川纺织；海港、山地与塞外缺乏日用布。'},
 {id:'gauze',name:'纱布',base:22,unit:'包',desc:'临川与云州织造；医馆、矿场和边营常年需要。'},
 {id:'paper',name:'纸张',base:20,unit:'刀',desc:'临川刻坊物美价廉，远地官署与书院缺纸。'});
 const extra={lanzhou:[1.1,1.05,1.15,1.1],heyang:[1.4,.6,1.05,1.15],jingdu:[1.5,1.25,1.2,1.2],linchuan:[1.2,.75,.6,.55],beiting:[1.8,1.65,1.8,1.5],shuofang:[1.7,1.75,1.6,1.7],shazhou:[1.85,1.7,1.5,1.8],yumen:[1.7,1.55,1.4,1.5],qinghe:[1.3,1.2,1.35,1.25],songshan:[1.4,1.3,1.4,1.45],yaogu:[1.35,1.25,1.7,1.3],nanpu:[1.2,1.35,1.5,1.4],yunzhou:[.6,1.45,.7,1.2],donghai:[.75,1.6,1.3,1.45],mingzhou:[.65,1.7,1.55,1.6],tieshan:[1.5,1.5,1.75,1.5]};
 for(const c of w.cities){['porcelain','cloth','gauze','paper'].forEach((id,i)=>c.goods[id]=extra[c.id][i]);c.specialties=w.goods.filter(g=>c.goods[g.id]<=.8).map(g=>g.id);c.shortages=w.goods.filter(g=>c.goods[g.id]>=1.4).map(g=>g.id);}
 const meta={shen:['男',28,4,false],tang:['女',24,4,false],du:['男',39,3,true],lin:['女',23,3,false],yan:['男',27,3,false],xu:['男',42,3,true],luo:['女',28,3,false],qi:['男',29,2,false],wen:['女',25,2,false],meng:['男',37,3,true],he:['男',31,4,false],shi:['男',44,2,true],zhou:['男',43,4,true],bai:['女',29,3,false],ahe:['女',27,1,false],su:['女',26,2,false],pei:['女',24,2,false],zhao:['男',26,2,false]};
 for(const p of w.people){const m=meta[p.id];Object.assign(p,{gender:m[0],age:m[1],social:m[2],married:m[3],clan:p.name[0]+'氏',mobile:['guild','escort','healers','academy','shadow'].includes(p.faction),acceptsConcubine:['ahe','su'].includes(p.id)});}
 w.people.push(
 {id:'ning',name:'宁晚晴',gender:'女',age:22,social:2,city:'heyang',faction:'guild',role:'河阳布坊掌柜',clan:'宁氏',acceptsConcubine:true,text:'愿意把一匹布织得结实，也想把往后的日子过得明白。'},
 {id:'qiao',name:'乔青萝',gender:'女',age:21,social:1,city:'songshan',faction:'healers',role:'采药人与山路向导',clan:'乔氏',acceptsConcubine:true,mobile:true,text:'记得每一处药草的根，也记得谁曾替她留过一盏灯。'},
 {id:'xie',name:'谢玉衡',gender:'男',age:25,social:3,city:'donghai',faction:'guild',role:'海货验货师',clan:'谢氏',mobile:true,text:'一箱瓷能验出十种毛病，自己的心事却总说得含糊。'},
 {id:'song',name:'宋知夏',gender:'女',age:23,social:2,city:'linchuan',faction:'academy',role:'抄书人与女学教习',clan:'宋氏',text:'把书上的字教给别人，也把别人的故事写进自己的册子。'},
 {id:'cheng',name:'程见微',gender:'男',age:27,social:2,city:'yaogu',faction:'healers',role:'药材质检师',clan:'程氏',mobile:true,text:'并不善说漂亮话，替人拣药却总多核一遍斤两。'},
 {id:'mu',name:'穆连枝',gender:'女',age:26,social:2,city:'shazhou',faction:'escort',role:'驼队领路人',clan:'穆氏',mobile:true,text:'能带一队人走过荒漠，却不愿谁把自己的来路替她决定。'},
 {id:'lu',name:'卢砚秋',gender:'男',age:24,social:2,city:'yunzhou',faction:'smith',role:'瓷窑制样师',clan:'卢氏',text:'烧坏的器物也留一片，提醒自己好手艺不是从未出错。'},
 {id:'ji',name:'姬明仪',gender:'女',age:24,social:5,city:'jingdu',faction:'court',role:'宗室旁支女史',clan:'姬氏',text:'身份让人不敢说真话，她却偏爱那些能当面指出错处的人。'},
 {id:'yuan',name:'袁肃',gender:'男',age:29,social:4,city:'shuofang',faction:'army',role:'关市巡检',clan:'袁氏',text:'看似只认文牒的章，也会记下赶在关门前没能回来的人。'},
 {id:'tao',name:'陶绾',gender:'女',age:24,social:2,city:'mingzhou',faction:'smith',role:'明州瓷窑东家',clan:'陶氏',acceptsConcubine:false,text:'相信泥土能经得起火，也相信日子应由自己慢慢捏成。'},
 {id:'jiang',name:'姜鸿',gender:'男',age:28,social:1,city:'tieshan',faction:'blackflag',role:'识字的矿工',clan:'姜氏',text:'一双手曾靠挖矿活命，如今也想握得住孩子的笔。'},
 {id:'ye',name:'叶眠溪',gender:'女',age:22,social:2,city:'nanpu',faction:'canal',role:'诊船记账人',clan:'叶氏',acceptsConcubine:true,mobile:true,text:'账册记着药钱，也记着一艘船曾为谁多停过半个时辰。'});
 w.escorts=[
 {id:'none',name:'独自上路',faction:null,power:0,rate:0,coverage:0,desc:'不收护航费；遇匪必有现金、货物或伤势损失。'},
 {id:'escort',name:'长风镖局',faction:'escort',power:70,rate:.035,coverage:.75,desc:'常规保镖，败后按受损申报价的 75% 赔付。'},
 {id:'sword',name:'青岚剑会',faction:'sword',power:88,rate:.06,coverage:.9,minRelation:10,desc:'关系至少 10，战力较强，败后赔付 90%。'},
 {id:'canal',name:'漕帮护运',faction:'canal',power:61,rate:.025,coverage:.55,desc:'熟悉关口与水路，价格低，败后赔付 55%。'},
 {id:'blackflag',name:'黑旗引路',faction:'blackflag',power:76,rate:.03,coverage:.6,minRelation:10,desc:'关系至少 10，擅长山路，败后赔付 60%。'}];
 w.buildings.push({id:'loom',name:'河坊织场',glyph:'织',cost:260,income:18,upkeep:5,materials:{grain:1},product:'cloth',desc:'每七日产棉布，需储备粮食支付工食。'}, {id:'kiln',name:'青釉瓷窑',glyph:'瓷',cost:340,income:24,upkeep:7,materials:{iron:1},product:'porcelain',desc:'每七日烧成瓷器，铁料用于工具与窑具维护。'});
 Object.assign(w.buildings.find(b=>b.id==='clinic'),{materials:{medicine:1}});Object.assign(w.buildings.find(b=>b.id==='workshop'),{materials:{iron:1}});
 Object.assign(w.buildings.find(b=>b.id==='farm'),{product:'grain'});
 w.assetPolicies=[{id:'steady',name:'稳健经营',profit:1,risk:1,desc:'按常规营业，收入与风险平衡。'},{id:'ambitious',name:'扩张揽客',profit:1.4,risk:1.7,desc:'净收入提高，容易遭同行与地方势力注意。'},{id:'benevolent',name:'惠民经营',profit:.8,risk:.7,desc:'收入略低，每七日提升声望，更少招惹纠纷。'}];
 w.practiceModes=[{id:'drill',name:'自行研习',cost:0,gain:5,stat:1,desc:'稳妥提高熟练与本领。'},{id:'tutor',name:'请教名师',cost:28,gain:10,stat:2,desc:'花费学资，成长更快；相关门派关系可减价。'},{id:'spar',name:'实战切磋',cost:8,gain:8,stat:1,desc:'有机会额外提高本领，也可能受轻伤。'}];
 w.socialLabels={1:'平民',2:'良家 / 手艺人',3:'乡绅 / 江湖名门',4:'官宦 / 商族',5:'宗亲 / 显贵'};
 return w;
}
if(typeof module!=='undefined'&&module.exports)module.exports=extend;else extend(root.SHANHE_WORLD);
})(typeof window!=='undefined'?window:globalThis);
