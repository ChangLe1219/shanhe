/* 世界资料为纯数据。扩写指南见 docs/内容创作指南.md。 */
(function(root){
const world = {
  version:2, title:'山河局', subtitle:'万象江湖', era:'庆国·景和十七年',
  premise:'春汛将至，澜州河仓却少了三千石粮。有人说是贪墨，有人说粮去了边关，也有人说，是一城流民等不到官府开仓。你不过是刚进城的无名客，一笔买卖、一封呈文、一场比武，都可能让你的名字出现在同一本账上。',
  stats:{martial:'武艺',business:'商才',learning:'学识',strategy:'谋略',charm:'交际',insight:'洞察',constitution:'根骨',luck:'气运'},
  routes:[
    {id:'martial',name:'武道',glyph:'剑',color:'#648f87',desc:'修习、护镖、论剑。在师承与道义间，决定为谁拔剑。',ranks:['无名武人','江湖新秀','一方名手','宗门执事','武林宗师'],action:'寻访江湖',stat:'martial'},
    {id:'trade',name:'行商',glyph:'商',color:'#c59b57',desc:'倒货、置产、结盟。赚一城的银，也要看天下的风。',ranks:['走街货郎','坐贾掌柜','商帮骨干','一方巨贾','四海商首'],action:'洽谈买卖',stat:'business'},
    {id:'official',name:'官路',glyph:'印',color:'#aa6e60',desc:'案牍、科举、治事。律法、人情与官位，往往难以兼得。',ranks:['白身听差','县衙书吏','候补县丞','一州能吏','朝堂重臣'],action:'问政当差',stat:'learning'},
    {id:'outlaw',name:'绿林',glyph:'枭',color:'#9182a0',desc:'探路、劫运、经营山寨。义气与恶名，只隔一次抉择。',ranks:['市井游侠','山道耳目','绿林头领','连寨盟主','乱世枭雄'],action:'探访暗巷',stat:'strategy'},
    {id:'scholar',name:'学问',glyph:'卷',color:'#899b63',desc:'访书、讲学、修志。用笔留下真相，也可能改写局势。',ranks:['游学布衣','书院门生','一地名士','书院山长','一代鸿儒'],action:'访书论学',stat:'learning'},
    {id:'medicine',name:'医道',glyph:'杏',color:'#76a39a',desc:'采药、诊病、研方。一个人的病，也许是一座城的病。',ranks:['识药学徒','游方郎中','杏林名医','济世医正','国手大医'],action:'悬壶问诊',stat:'insight'}
  ],
  origins:[
    {id:'poor',name:'寒门书生',text:'父亲把最后两亩薄田典了，换你一身干净衣裳。荐书里没有许诺，只有旧塾师的一句：先学会看见人。',silver:100,city:'lanzhou',mods:{learning:15,insight:6},item:'letter'},
    {id:'merchant',name:'行商遗孤',text:'父亲留下一个空货箱和半张路引。商队都说他死在北地，你却在澜州的账房里见过他的笔迹。',silver:220,city:'lanzhou',mods:{business:15,charm:6},item:'ledger'},
    {id:'soldier',name:'边军余脉',text:'旧军户的门上还挂着褪色的红缨。你见过粮车晚到三天会发生什么，因此不轻信任何一张报捷的公文。',silver:130,city:'beiting',mods:{martial:12,constitution:9},item:'blade'},
    {id:'clan',name:'败落官族',text:'抄家那夜你从后门离去，带走的不是金银，而是一枚没有印面的私章。有人愿替你翻案，也有人盼你永远闭嘴。',silver:150,city:'jingdu',mods:{strategy:10,learning:11},item:'letter'},
    {id:'disciple',name:'山门弃徒',text:'你因替一名“邪道”弟子作证被逐出山门。师父没有收回你的剑，只问：今后无人替你作主，你还敢不敢认错？',silver:115,city:'qinghe',mods:{martial:15,insight:6},item:'blade'},
    {id:'orphan',name:'巷陌孤儿',text:'你替赌坊送过信，也给衙门带过路。你知道城里每一扇门有几道锁，却还不知道哪一扇门肯为你亮灯。',silver:95,city:'yunzhou',mods:{strategy:12,luck:9},item:'lockpick'},
    {id:'herbal',name:'药庐学徒',text:'师娘留下的药箱里，最厚的是赊账本。你照着旧方治好了自己的咳嗽，却治不好乡里被重税压弯的腰。',silver:120,city:'yaogu',mods:{insight:13,learning:8},item:'medicine'},
    {id:'farmer',name:'失地佃户',text:'河水吞了田契上的界石，地主却说租子照旧。你带着一小袋种子上路，要找一个不靠看天吃饭的活法。',silver:100,city:'heyang',mods:{constitution:12,business:9},item:'grain'},
    {id:'boat',name:'船户人家',text:'自小听桨声睡觉，认得水势胜过认字。父亲说江上没有无主的船，也没有真正能把水截住的关卡。',silver:160,city:'nanpu',mods:{business:10,constitution:11},item:'grain'},
    {id:'artisan',name:'匠坊后人',text:'祖父打过宫城的铜钉，父亲却因一批断刀获罪。你带走一卷工图，想证明一把好刀不该先折在账上。',silver:150,city:'tieshan',mods:{insight:11,business:10},item:'tools'},
    {id:'actor',name:'戏班漂客',text:'你在台上扮过清官、贼王与富家少爷。台下人总爱给你赏钱，却从不问卸下妆后，你究竟想做什么。',silver:135,city:'donghai',mods:{charm:15,luck:6},item:'tea'},
    {id:'nomad',name:'塞外归客',text:'母亲的故乡在关内，父亲的坟在关外。你会说两地的话，也承受两地的猜疑。一张通关文牒，是你仅有的家。',silver:175,city:'shazhou',mods:{martial:9,business:7,constitution:5},item:'horse'}
  ],
  talents:[
    {name:'过目不忘',stat:'learning',text:'学识 +10；卷宗里细小的出入很难逃过你的眼。'},
    {name:'筋骨奇佳',stat:'constitution',text:'根骨 +10；长途跋涉和练功都更有底气。'},
    {name:'临危不乱',stat:'strategy',text:'谋略 +10；险局里总能多想一步。'},
    {name:'察言观色',stat:'insight',text:'洞察 +10；你更在意别人没说出口的话。'},
    {name:'长袖善舞',stat:'charm',text:'交际 +10；同一句话，你说出来总更容易被听见。'},
    {name:'天生武骨',stat:'martial',text:'武艺 +10；招式还没学会，身体已先有回应。'},
    {name:'铁算盘',stat:'business',text:'商才 +10；看见的不是货物，而是一条流动的商路。'},
    {name:'逢凶化吉',stat:'luck',text:'气运 +10；命运有时会多给你一条窄路。'},
    {name:'市井耳目',stat:'insight',text:'洞察 +10；茶摊上的闲话偶尔比公文更快。'},
    {name:'言出有信',stat:'charm',text:'交际 +10；别人还记得你多年前兑现的承诺。'},
    {name:'心算如流',stat:'business',text:'商才 +10；你算得清一笔债，也记得一份情。'},
    {name:'百折不回',stat:'constitution',text:'根骨 +10；跌倒之后，你总会再站起来。'}
  ],
  regions:[
    {id:'river',name:'澜江道',desc:'漕粮与私盐同走一条河，王朝的钱袋，也是最先听见裂响的地方。'},
    {id:'capital',name:'中州',desc:'天下诏令出于此地，乡野的哭声却要经过许多道门才能传进来。'},
    {id:'north',name:'朔北',desc:'军镇连着草原，马价、粮价与边境烽火一同涨落。'},
    {id:'west',name:'河西',desc:'驼铃跨过古道，边贸能养活一州，也能养活不见旗号的骑队。'},
    {id:'sword',name:'青岚',desc:'山门众多，乡约与门规并行。哪家的剑更直，要看剑锋指向谁。'},
    {id:'south',name:'岭南',desc:'药材、瘴雨与旧寨。官道没有走到的地方，仍有人守着自己的律法。'},
    {id:'sea',name:'东溟',desc:'海风带来异域货物，港口的税票上看不见所有卸货的船。'},
    {id:'hill',name:'陇山',desc:'铁矿与林场藏在群山里，工匠、逃户、义军在同一条山路上相逢。'}
  ],
  cities:[
    {id:'lanzhou',name:'澜州',region:'river',x:55,y:53,desc:'三江汇流的漕运大城。河仓旧账正在把不相干的人拖进同一场局。',danger:1,goods:{grain:.8,salt:1.05,tea:1.1,silk:1.1,medicine:1.2,iron:1.05},tags:['port','court'],links:['heyang','yunzhou','qinghe','jingdu']},
    {id:'heyang',name:'河阳',region:'river',x:48,y:62,desc:'水网密布的产粮腹地。丰年谷贱伤农，荒年粮仓却未必肯开。',danger:1,goods:{grain:.6,salt:1.2,tea:1,silk:1.2,medicine:1,iron:1.2},tags:['farm'],links:['lanzhou','nanpu','yaogu']},
    {id:'jingdu',name:'京畿',region:'capital',x:61,y:28,desc:'九门之外尽是赶考、谋职、递状的人。物价高，机会也多。',danger:1,goods:{grain:1.5,salt:1.3,tea:1.5,silk:1.6,medicine:1.3,iron:1.2},tags:['court','academy'],links:['lanzhou','linchuan','beiting']},
    {id:'linchuan',name:'临川',region:'capital',x:69,y:43,desc:'书院林立，刻坊通宵。禁书、策论和邸报一起流过纸市。',danger:1,goods:{grain:1.1,salt:1.15,tea:1.1,silk:1.25,medicine:1.2,iron:1.2},tags:['academy'],links:['jingdu','yunzhou','donghai']},
    {id:'beiting',name:'北庭',region:'north',x:49,y:13,desc:'边军大营所在，春天先到的是索粮的文书。',danger:3,goods:{grain:1.65,salt:1.5,tea:1.7,silk:1.1,medicine:1.6,iron:1.45},tags:['military'],links:['jingdu','shuofang','tieshan']},
    {id:'shuofang',name:'朔方',region:'north',x:32,y:13,desc:'长城缺口旁的马市。通关的名册每月都换一种写法。',danger:3,goods:{grain:1.5,salt:1.35,tea:1.8,silk:1.4,medicine:1.3,iron:1.6},tags:['military','frontier'],links:['beiting','shazhou']},
    {id:'shazhou',name:'沙州',region:'west',x:12,y:30,desc:'西域货物的第一座关城，镖局比客栈更多。',danger:3,goods:{grain:1.4,salt:1.3,tea:1.9,silk:1.75,medicine:1.2,iron:1.4},tags:['frontier'],links:['shuofang','yumen']},
    {id:'yumen',name:'玉门',region:'west',x:19,y:48,desc:'黄沙半掩的商镇。向导的信誉比路引更值钱。',danger:3,goods:{grain:1.35,salt:1.2,tea:1.6,silk:1.5,medicine:1.15,iron:1.2},tags:['frontier'],links:['shazhou','qinghe','tieshan']},
    {id:'qinghe',name:'青河',region:'sword',x:37,y:47,desc:'剑会常驻，渡口两岸都是习武人借宿的酒家。',danger:2,goods:{grain:1.1,salt:1.1,tea:.8,silk:1.2,medicine:1.1,iron:1},tags:['sect'],links:['lanzhou','yumen','songshan']},
    {id:'songshan',name:'松山',region:'sword',x:27,y:62,desc:'山门与茶园共处云雾中，一纸逐徒令也会传遍山下集市。',danger:2,goods:{grain:1.1,salt:1.3,tea:.6,silk:1.2,medicine:.9,iron:1.2},tags:['sect','forest'],links:['qinghe','yaogu']},
    {id:'yaogu',name:'药谷',region:'south',x:35,y:80,desc:'春采秋晒的药乡。济世堂收徒，也收无力付诊金的人。',danger:2,goods:{grain:1.1,salt:1.4,tea:.8,silk:1.3,medicine:.55,iron:1.2},tags:['herb','forest'],links:['songshan','heyang','nanpu']},
    {id:'nanpu',name:'南浦',region:'south',x:59,y:84,desc:'水陆转运的小港，药船、盐船与客船常挂着相同的旗。',danger:2,goods:{grain:.95,salt:1.1,tea:.9,silk:1.15,medicine:.75,iron:1.35},tags:['port','herb'],links:['yaogu','heyang','mingzhou']},
    {id:'yunzhou',name:'云州',region:'sea',x:75,y:60,desc:'商铺沿河铺开，钱庄与码头都在争夜市的灯火。',danger:1,goods:{grain:1.1,salt:.8,tea:1.2,silk:.6,medicine:1.15,iron:1.2},tags:['port'],links:['lanzhou','linchuan','donghai']},
    {id:'donghai',name:'东海',region:'sea',x:88,y:43,desc:'开海令颁下的第三年，码头的税册还赶不上海船的数目。',danger:2,goods:{grain:1.3,salt:.6,tea:1.3,silk:.85,medicine:1.1,iron:1.3},tags:['port','sea'],links:['yunzhou','linchuan','mingzhou']},
    {id:'mingzhou',name:'明州',region:'sea',x:85,y:79,desc:'海岛寨与巡检司隔水相望，风季一到，谁都需要对岸的粮。',danger:3,goods:{grain:1.4,salt:.7,tea:1.1,silk:.9,medicine:1.1,iron:1.5},tags:['sea','port'],links:['donghai','nanpu']},
    {id:'tieshan',name:'铁山',region:'hill',x:30,y:31,desc:'昼夜不熄的矿炉。矿契写着产额，没写井下还有多少人。',danger:3,goods:{grain:1.4,salt:1.3,tea:1.2,silk:1.3,medicine:1.4,iron:.55},tags:['mine','forest'],links:['beiting','yumen']}
  ],
  factions:[
    {id:'court',name:'度支与州府',glyph:'府',want:'维持税粮与朝廷体面',fear:'地方揭出亏空，牵连考成',desc:'好官与坏官共用一方印。能否办事，常取决于谁肯承担追责。'},
    {id:'censor',name:'巡按台',glyph:'台',want:'查清旧账，建立独立耳目',fear:'证据过早曝光，惊动京中人物',desc:'以清查为名入城，却未必肯为每一个无名证人担保。'},
    {id:'guild',name:'云平商盟',glyph:'商',want:'货路畅通，取得专营凭照',fear:'价格失控，官府收回商权',desc:'愿意赈灾，也会计算一场赈灾能换来几年免税。'},
    {id:'canal',name:'澜江漕帮',glyph:'舟',want:'码头工食与水上自治',fear:'官军接管渡口，船户失业',desc:'靠河吃饭的一群人，既运官粮，也替走投无路的人运信。'},
    {id:'sword',name:'青岚剑会',glyph:'剑',want:'维护武林公议，保住山门地位',fear:'门内旧案成为外人把柄',desc:'讲规矩的剑客太多，规矩应当保护谁却没有一致答案。'},
    {id:'escort',name:'长风镖局',glyph:'镖',want:'保住镖旗信用与沿途关系',fear:'一趟失镖毁掉十年信誉',desc:'银子能雇到刀，雇不到愿为陌生人留下的镖师。'},
    {id:'blackflag',name:'黑旗连寨',glyph:'寨',want:'粮食、山口与合法身份',fear:'内讧、饥荒、招安后被清算',desc:'逃兵、灾民与真正的劫匪聚在一面旗底下。'},
    {id:'shadow',name:'夜渡社',glyph:'渡',want:'垄断暗线与走私消息',fear:'名单落进巡按或竞争者手中',desc:'谁都能买一段秘密，买来的秘密却不一定只卖给一个人。'},
    {id:'academy',name:'白鹿书院',glyph:'书',want:'办学、修志与议政的话语权',fear:'学田被侵，学生被借作党争',desc:'有人闭门读经，有人开门办义学；两者都说自己在救国。'},
    {id:'healers',name:'济世堂',glyph:'医',want:'药源稳定，疫病不被隐瞒',fear:'廉价药方触动药行生意',desc:'诊桌之外有药价，医德之外有一整条药材商路。'},
    {id:'army',name:'北庭边军',glyph:'军',want:'足饷、军械与过冬粮',fear:'京中疑其拥兵，边关无人接济',desc:'军报上没有写饥饿，但每一处错字都像在催粮。'},
    {id:'smith',name:'百工盟',glyph:'匠',want:'工钱、技术流通与矿井安全',fear:'工图被夺，匠籍世代束缚',desc:'铸刀的人未必想见血，造桥的人也想过桥。'}
  ],
  people:[
    {id:'shen',name:'沈砚',role:'巡按台录事',city:'lanzhou',faction:'censor',text:'每份口供抄三遍，却从不让证人只留一个住处。'},
    {id:'tang',name:'唐绮',role:'云平商盟少东家',city:'lanzhou',faction:'guild',text:'愿意亏银子救急，不肯让救急成为别人赖账的借口。'},
    {id:'du',name:'杜魁',role:'漕帮执事',city:'lanzhou',faction:'canal',text:'谈生意先问船工今天有没有吃饱。'},
    {id:'lin',name:'林知意',role:'地方志编修',city:'linchuan',faction:'academy',text:'不信只有官修史书才有资格记住死人。'},
    {id:'yan',name:'燕停云',role:'逐出山门的剑客',city:'qinghe',faction:'sword',text:'那把断剑是师父折的；他不急着换一把。'},
    {id:'xu',name:'许长风',role:'长风镖局总镖头',city:'qinghe',faction:'escort',text:'留着一面没有绣字的镖旗，专替付不起钱的人走一趟。'},
    {id:'luo',name:'罗照夜',role:'黑旗寨二当家',city:'tieshan',faction:'blackflag',text:'算盘比刀快，手上却总留着最后一口粮。'},
    {id:'qi',name:'齐九',role:'夜渡社掮客',city:'yunzhou',faction:'shadow',text:'从不卖假消息，专卖不完整的真消息。'},
    {id:'wen',name:'温见素',role:'济世堂医者',city:'yaogu',faction:'healers',text:'病人总说等挣到钱再来，她总说先把脉。'},
    {id:'meng',name:'孟清和',role:'白鹿书院讲席',city:'linchuan',faction:'academy',text:'给官员讲经要收束脩，给船工认字只要一盏灯。'},
    {id:'he',name:'贺闻朔',role:'北庭参军',city:'beiting',faction:'army',text:'军报写得工整，家书却总写到一半。'},
    {id:'shi',name:'石问炉',role:'百工盟匠首',city:'tieshan',faction:'smith',text:'谁敢让徒弟下没有支护的井，他就敢把谁的炉子拆了。'},
    {id:'zhou',name:'周望舒',role:'澜州同知',city:'lanzhou',faction:'court',text:'把不想做的事说成不能做，把不能做的事写成已经办妥。'},
    {id:'bai',name:'白簌',role:'海商船主',city:'donghai',faction:'guild',text:'船上收留过三种口音的水手，只认会不会解缆绳。'},
    {id:'ahe',name:'阿禾',role:'流民里正',city:'heyang',faction:'canal',text:'她的名册只记活人，却日日背着越来越厚的旧册。'},
    {id:'su',name:'苏枕河',role:'松山茶庄掌柜',city:'songshan',faction:'guild',text:'能品出三年前的陈茶，也能听出一句话里陈年的怨。'},
    {id:'pei',name:'裴南枝',role:'县衙仵作',city:'nanpu',faction:'court',text:'她见过不会开口的人如何说出最响的证词。'},
    {id:'zhao',name:'赵归尘',role:'落第举子',city:'jingdu',faction:'academy',text:'三次没进的那扇门，他已学会从门外看清。'}
  ],
  goods:[
    {id:'grain',name:'粮食',base:10,unit:'石',desc:'河阳产、北庭缺。赈灾与军需都离不开它。'},
    {id:'salt',name:'食盐',base:24,unit:'担',desc:'沿海便宜，内陆昂贵；官盐凭照是另一门生意。'},
    {id:'tea',name:'茶叶',base:32,unit:'篓',desc:'松山的茶到了塞外，能换回比铜钱更紧俏的货。'},
    {id:'silk',name:'绸缎',base:55,unit:'匹',desc:'云州织造，京畿与河西都愿意出高价。'},
    {id:'medicine',name:'药材',base:30,unit:'箱',desc:'药谷出产；疫时涨价，也会招来非议。'},
    {id:'iron',name:'铁料',base:38,unit:'锭',desc:'矿山便宜，边军、匠坊与山寨都需要。'}
  ],
  items:{letter:'旧荐书',ledger:'半本旧账',blade:'随身短刃',lockpick:'细齿铜钥',medicine:'伤药',grain:'家乡种子',tools:'匠作图谱',tea:'旧戏服',horse:'通关文牒',evidence:'河仓物证',formula:'济世药方',manuscript:'乡野手记',seal:'官盐凭照',swordbook:'无名剑谱'},
  buildings:[
    {id:'shop',name:'街市铺面',glyph:'肆',cost:180,income:12,upkeep:3,desc:'每日净入 9 两/级，积累稳定现金流。'},
    {id:'farm',name:'河畔田庄',glyph:'田',cost:160,income:6,upkeep:2,goods:'grain',desc:'每日净入 4 两与粮食 1 石/级，粮食仍受仓容限制。'},
    {id:'clinic',name:'济民药庐',glyph:'庐',cost:220,income:11,upkeep:4,desc:'每日净入 7 两/级，兼顾生计与行医。'},
    {id:'inn',name:'山道客栈',glyph:'驿',cost:280,income:19,upkeep:5,desc:'每日净入 14 两/级，长途旅行后的落脚生意。'},
    {id:'workshop',name:'百工匠坊',glyph:'坊',cost:250,income:16,upkeep:4,desc:'每日净入 12 两/级，把工图变成家业。'},
    {id:'warehouse',name:'转运货栈',glyph:'仓',cost:140,income:0,upkeep:1,desc:'仓容每级增加 20，每日维护费 1 两/级。'}
  ],
  skills:[
    {id:'sword',name:'归流剑',stat:'martial',route:'martial',desc:'从护镖中悟出的守势，武艺与武道阅历同步成长。'},
    {id:'breath',name:'养元功',stat:'constitution',route:'martial',desc:'调匀气息、强健根骨，练习时恢复少量健康。'},
    {id:'account',name:'合筹术',stat:'business',route:'trade',desc:'习账目、辨货价，商才决定经营判定。'},
    {id:'law',name:'明律篇',stat:'learning',route:'official',desc:'读律例与案卷，为入仕和处理诉讼打底。'},
    {id:'shadow',name:'夜行诀',stat:'strategy',route:'outlaw',desc:'识地势、辨暗号，以谋略应对绿林险局。'},
    {id:'classics',name:'经世策',stat:'learning',route:'scholar',desc:'不只背文章，也学田赋与水利。'},
    {id:'pulse',name:'辨脉录',stat:'insight',route:'medicine',desc:'问诊、辨药，洞察决定诊病与疫事判定。'}
  ]
};
if(typeof module!=='undefined'&&module.exports)module.exports=world;
root.SHANHE_WORLD=world;
})(typeof window!=='undefined'?window:globalThis);
