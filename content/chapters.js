(function(root){
const C=(label,text,effects={},extra={})=>({label,text,effects,...extra});
const S=(id,routes,title,text,choices,when,order=10)=>({id,kind:'story',once:true,routes:routes.split(','),title,text,choices,when,order});
const F=(id,routes,title,text,choices)=>({id,kind:'followup',once:true,routes:routes.split(','),title,text,choices});
const events=[
S('common-letter','all','序章 · 来自澜州的半张账','景和十七年，春。一个走失了同伴的信使在客栈托你带走半张旧账。他说三千石粮消失在澜州河仓，账上却有四个收货处：边军、商栈、流民棚，还有一处只画了黑旗的山口。你可以收下这件事，也可以先只顾自己的生活。',[
 C('收下账页，查清粮去了哪里','信使说，不必急着找谁有罪，先找粮真正到过的地方。你把半张账页压进衣襟。',{'inventory.evidence':1,'flags.letter_kept':true,'stats.insight':1}),
 C('收下，但先找能经营的活路','信使没有催你。能活下去的人，才有机会把故事问到底。',{'inventory.evidence':1,'routes.trade':2,'flags.letter_kept':true}),
 C('将账页托给可信的代书，自己先走','你没有替自己许诺一条道路。代书留下抄本，说哪日想问，仍能从这半张纸开始。',{'inventory.manuscript':1,'flags.letter_kept':false})],null,0),
S('common-cargo','all','河仓疑云 · 四份收条','一位漕帮船工带来四份相互矛盾的收条。官府说粮尽数交接，边军说只收到一半，商栈说自己代存未动，流民却确实靠其中一批熬过了冬天。船工问：先查哪一边，决定接下来谁会先看见你。',[
 C('查商栈的出入库账','你在同一仓号下发现两次入账。商盟愿意协查，但希望你先别公开。',{'routes.trade':3,'inventory.evidence':1,'factions.guild':4,'flags.case_angle':'trade'}),
 C('查官府的领粮印信','公文引用了同一个印，时间却相差两个月。沈砚愿意替你验一验。',{'routes.official':3,'inventory.evidence':1,'relations.shen':5,'flags.case_angle':'official'}),
 C('先问收到粮的流民与山民','粮确实救过命。你也查到有人在救命的粮里混入了牟利的空账。',{'routes.outlaw':2,'routes.medicine':2,'inventory.evidence':1,morality:2,'flags.case_angle':'people'})],{seen:['common-letter'],min:{day:2}},1),
S('common-verdict','all','河仓疑云 · 谁来写结案词','账目终于能够拼合：有人挪走军粮救灾，有人借救灾多报亏空，还有人把真正发到边关的粮改记成沉船。所有人都拿出一段实话，希望你替他们省略另一段。现在你有足够证据，却没有能让所有人都满意的答案。',[
 C('公开证据，区分救济与牟利','你把每批粮的去向列出，拒绝把所有人归进同一个罪名。流民获保，几位经手者仍须受审。案子结了，争论没有。',{'flags.case_resolution':'public',renown:10,'factions.censor':8,'factions.guild':-4,'factions.court':-3,'routes.scholar':4}),
 C('交巡按台，要求先保护证人','沈砚收了原件，也在你的副本上签下接收时辰。你选择依靠制度，仍留下了追问制度的凭据。',{'flags.case_resolution':'court','flags.official_warrant':true,'factions.censor':12,'factions.court':4,'routes.official':5}),
 C('促成补粮与赔付，再移交涉案账目','商盟补上军粮，州府追认救灾份额，做假账的人不得不出资赔付。有人骂你和稀泥，有人终于等到一袋米。',{'flags.case_resolution':'settlement',silver:35,'factions.guild':8,'factions.army':6,'routes.trade':5}),
 C('留下证据，换取各方欠下的人情','你没有让真相消失，只决定它暂时值一个什么价。各方付了银，也开始盘算你哪天会开口。',{'flags.case_resolution':'leverage',silver:90,heat:10,morality:-6,'factions.shadow':8,'routes.outlaw':5})],{seen:['common-cargo'],min:{'inventory.evidence':2,day:6}},2),

S('martial-one','martial','武道一 · 镖旗不护谁','长风镖局给你第一趟真正的护镖活：把一位告老的仓吏送出州界。雇主只买了“路上平安”，没有买“遇事还管”。出城前，仓吏的邻居拦住马车，说他走了，受灾者就再也找不到签字的人。',[
 C('让仓吏把未结事务与责任交代清楚','你没急着发车。告老不是凭空消失，沿途第一次有人真心对镖旗拱手。',{'routes.martial':4,'factions.escort':6,'flags.martial_oath':'protect'}),
 C('按契护送，先保委托人安全','你完成了第一趟镖。许长风说契约不能随手作废，也问你，可想过下一份契要添什么。',{'routes.martial':4,silver:30,'flags.martial_oath':'contract'}),
 C('劝他留下作证，由镖局保护','仓吏答应多留三天。你得到的不是轻松的一趟镖，而是几个开始愿意说话的证人。',{'routes.martial':4,'inventory.evidence':1,'factions.censor':4,'flags.martial_oath':'witness'})],{min:{'routes.martial':8}},11),
S('martial-two','martial','武道二 · 断剑门人','燕停云在青河等你。十年前，他的师兄被指私通山寨逐出门；现在一批旧书信出现，似能证明当年所谓通匪，只是替灾民运粮。剑会不肯为一名已死的弃徒重开公议。',[
 C('替亡者提出公议，先核书信来历','你把剑放在案边，只问谁愿意在证词后署名。燕停云终于将断剑从鞘里抽出半寸。',{'routes.martial':5,'relations.yan':10,'flags.martial_proof':true,'factions.sword':-3}),
 C('请在世证人私下与剑会长老见面','门内多了一场不公开的谈话。没有撤销旧令，却允许你继续寻找原始记录。',{'routes.martial':4,'factions.sword':4,'flags.martial_proof':true,'stats.charm':1}),
 C('先守护证人，不争公议的名分','你租下一间偏院。名分可以以后争，能说出旧事的人不能再失去。',{'routes.martial':4,morality:3,'flags.martial_proof':true},{cost:{silver:20}})],{seen:['martial-one'],cities:['qinghe','songshan'],min:{'routes.martial':18}},12),
S('martial-three','martial','武道三 · 公议前夜','证人即将出面，夜里却来了两批人。一批要你交出信，一批要你带证人离开。剑会长老称公议会毁了山门，燕停云说如果山门必须靠沉默维持，那就该重新立一次门。',[
 C('守住证人，迎接来人','',{'routes.martial':5},{check:{stat:'martial',difficulty:54},success:{text:'你挡住来者，留下一柄带有商栈标记的短刀。旧案的线竟伸进了今日的生意。',effects:{'factions.escort':8,renown:5,'flags.martial_guarded':true}},failure:{text:'你负伤守到天亮，证人没有失踪。燕停云第一次叫你同道。',effects:{health:-20,'relations.yan':8,'flags.martial_guarded':true}}}),
 C('借巡按保护文书封存证据','巡按台接走证人，剑会失去私下处理的余地。你把江湖旧账送进了另一套规则。',{'routes.official':4,'routes.martial':3,'factions.censor':6,'flags.martial_guarded':true},{requires:{flags:{official_warrant:true}}}),
 C('分抄证据寄往多地，再安排转移','来人拿不到所有原件，也再无法只靠一个人的沉默抹去这件事。',{'routes.scholar':3,'routes.martial':3,'inventory.manuscript':1,'flags.martial_guarded':true})],{seen:['martial-two'],min:{'routes.martial':32}},13),
S('martial-four','martial','武道终章 · 一把剑的去处','公议开了整整一天，旧逐令终于撤回。剑会请你留下担任执事，许长风请你共办一条不分贫富的护送线。燕停云则说，天下还很大，未必每件该做的事都要有一块牌匾。',[
 C('留在剑会，推动公议与门规改革','你在旧门规后添上申辩与复核的条款。改一条规矩比赢一场比武更慢，你决定做下去。',{'routes.martial':8,'flags.martial_ending':'reform','factions.sword':15,renown:10},{delay:{id:'after-martial',days:4}}),
 C('与镖局合办护送线','第一面新旗没有绣门派名，只写了“来路可问，去处有人”。你也得认真算清每一趟的成本。',{'routes.martial':8,'flags.martial_ending':'escort','factions.escort':15,silver:60},{delay:{id:'after-martial',days:4}}),
 C('与燕停云继续行走江湖','你把一份公议记录留在山门，带走的是一把不需要别人替你指向的剑。',{'routes.martial':8,'flags.martial_ending':'wander','relations.yan':15,'stats.martial':4},{delay:{id:'after-martial',days:4}})],{seen:['martial-three'],min:{'routes.martial':48}},14),

S('trade-one','trade','行商一 · 第一张长契','唐绮愿把一份长期运粮契交给你。价钱不差，条款却把水灾、封关与官府征调全算作承运者的责任。她说这是旧例，也想看看你会不会在第一笔大单面前认真读完。',[
 C('重议风险共担，再签字','她把准备好的第二份契约取出来，承认自己也在等一个敢谈条款的人。',{'routes.trade':5,'relations.tang':7,'flags.trade_contract':'fair','stats.business':1}),
 C('照签，以完成大单换入盟资格','你拿到预付款，也承担了最难预料的那部分风险。',{'routes.trade':4,silver:35,'flags.trade_contract':'risk','factions.guild':4}),
 C('先接小单，逐步积累履约记录','你把大单推回去，只留下自己确实做得完的部分。唐绮说，小单也要写全。',{'routes.trade':4,silver:15,'flags.trade_contract':'steady','factions.guild':3})],{min:{'routes.trade':8}},21),
S('trade-two','trade','行商二 · 被垄断的码头','到了云州，你发现同盟商号联合租下了所有好泊位，逼小商贩以低价转货。你的货可以进内港，条件是今后不再与无盟凭的船户往来。码头外，杜魁的人正等着回话。',[
 C('联络小船户，共租外港与转运车','路更绕，账更碎，却能让几家原本要散的生意继续做。',{'routes.trade':5,'factions.canal':8,'factions.guild':-3,'flags.trade_port':'open'},{cost:{silver:25}}),
 C('接受内港条件，取得稳妥泊位','你省下转运时间，也失去了一些曾经肯为你连夜开船的人。',{'routes.trade':5,silver:30,'factions.guild':8,'factions.canal':-5,'flags.trade_port':'exclusive'}),
 C('申请公开泊位与排班','官府愿意试行，先要求你拿出完整账目。你请船户们自己选一个记工的人。',{'routes.trade':4,'routes.official':2,'flags.trade_port':'regulated','factions.court':3})],{seen:['trade-one'],cities:['yunzhou','donghai'],min:{'routes.trade':18}},22),
S('trade-three','trade','行商三 · 军需与民食','边军急购冬粮，价格足以让你翻本。河阳却传来减产消息，若这批粮全向北走，本地就得从高价商手里买回。唐绮说只做生意的人，也逃不开决定粮去哪儿。',[
 C('分批供军，保留本地平价份额','',{'routes.trade':5},{check:{stat:'business',difficulty:53},success:{text:'你协调了仓期与船次，虽没赚最多，仍保住两地供应。',effects:{silver:70,'factions.army':7,renown:5,'flags.trade_grain':'balance'}},failure:{text:'转运延误吃掉了利润。粮最终分到了两地，你只拿回了本金之外的一点薄利。',effects:{silver:12,renown:3,'flags.trade_grain':'balance'}}}),
 C('优先完成军需订单','边军按价付款，河阳的质问也随商船一起到来。你决定先承担这份选择的后果。',{'routes.trade':5,silver:100,'factions.army':10,'factions.canal':-4,morality:-2,'flags.trade_grain':'army'}),
 C('优先地方赈售，另找军粮替代来源','你向边军申请缓期。贺闻朔没有骂人，只问下一船最迟什么时候到。',{'routes.trade':5,renown:7,morality:4,'factions.army':-3,'flags.trade_grain':'relief'})],{seen:['trade-two'],min:{'routes.trade':32}},23),
S('trade-four','trade','行商终章 · 一个商盟的规矩','你的商路终于贯通多地。旧商盟愿给你一份专营资格，小商户则盼你办一个任何人都可入的联保账房。两种办法都能赚钱，也都可能被自己人钻空子。决定之后，你要为它制定真正的账。',[
 C('成立开放联保商号，公开担保上限','你不担保没有尽头的风险，却让小商号也能依凭清楚的规则拿到第一笔信用。',{'routes.trade':8,'flags.trade_ending':'open',silver:80,'factions.canal':10,renown:10},{delay:{id:'after-trade',days:4}}),
 C('接受专营资格，经营大型商帮','资源集中到你手中，同行开始看你的价签行事。你获得权力，也接下别人对这份权力的怨。',{'routes.trade':8,'flags.trade_ending':'monopoly',silver:150,'factions.guild':15,morality:-3},{delay:{id:'after-trade',days:4}}),
 C('经营区域合作社，以仓粮稳定地方供应','你把收益的一部分留在仓里。粮不是永远涨价的筹码，也是冬天来时能打开的门。',{'routes.trade':8,'flags.trade_ending':'granary',silver:50,'factions.healers':10,morality:5,'inventory.grain':5},{delay:{id:'after-trade',days:4}})],{seen:['trade-three'],min:{'routes.trade':48}},24),

S('official-one','official','官路一 · 第一次具名','书吏请你替一份灾情清册落名。清册表面完整，却把三处流民聚落并进了邻村，减少的户数正好让赈银收支平衡。他说白身办事，先学会别让上面难做。',[
 C('退回清册，附上实地待核栏目','你没有把没查过的地方直接写成指控，也没有为明显的空缺落名。',{'routes.official':5,'flags.official_first':'verify','factions.censor':5,'stats.learning':1}),
 C('先办临时口粮，再补真实名册','你签的是临时处置具结，责任从此真正在你名下。',{'routes.official':5,'flags.official_first':'act',renown:3,'factions.court':-2}),
 C('照旧册签名，争取以后修正','书吏对你亲近了些。你的第一个名字，落在一份并不真实的清册末尾。',{'routes.official':4,'flags.official_first':'conform','factions.court':7,morality:-3})],{min:{'routes.official':8}},31),
S('official-two','official','官路二 · 京中来信','你在京畿或澜州收到一位京官的引荐。他可以替你补缺，条件是把河仓疑案写作地方管理疏失。沈砚说引荐并不等于陷阱，但别人总希望你先替未来的官位付一笔账。',[
 C('不改案词，只呈可核实的部分','京中没有立刻回信。你留下一条不太快，却仍走得下去的官路。',{'routes.official':5,'factions.censor':8,'flags.official_patron':'independent'}),
 C('接受引荐，但保留完整副本','你开始在两套措辞之间办事，既得到上升机会，也必须记得哪一份才是真账。',{'routes.official':5,'factions.court':7,'inventory.manuscript':1,'flags.official_patron':'patron'}),
 C('请引荐者支持一次公开核查','对方没有答应公开，却允许你调阅原始粮册。你以一个更具体的请求换来一点空间。',{'routes.official':5,'inventory.evidence':1,'flags.official_warrant':true,'flags.official_patron':'negotiate'})],{seen:['official-one'],cities:['jingdu','lanzhou'],min:{'routes.official':18}},32),
S('official-three','official','官路三 · 招安的底稿','黑旗寨愿意交械，官军要求先交头领人名。寨里要求先发有印的免罪文书。底稿将“既往不咎”写成“视情减免”，两边都盼你先把话说得好听一些。',[
 C('明确罪责范围，安排分批交械与见证','',{'routes.official':5},{check:{stat:'learning',difficulty:53},success:{text:'文书没有承诺赦免一切，也没有留下任意清算的口袋。第一批老弱先下了山。',effects:{'factions.blackflag':7,'factions.army':5,'flags.official_amnesty':'clear',renown:5}},failure:{text:'双方仍争执条款。你至少先办成老弱转移，不让谈判破裂立刻变成杀戮。',effects:{'factions.blackflag':3,'flags.official_amnesty':'partial','stats.learning':1}}}),
 C('支持官军先缴械，事后再定罪','官军赞许你的决断。寨里的信不再直接送到你手里。',{'routes.official':5,'factions.army':9,'factions.blackflag':-8,'flags.official_amnesty':'army'}),
 C('暂缓招安，改办山民身份与雇工出路','你把一个立即解决的大问题拆成许多慢事，先让不愿拿刀的人有路可走。',{'routes.official':4,'routes.trade':2,'factions.blackflag':5,'flags.official_amnesty':'livelihood'})],{seen:['official-two'],min:{'routes.official':32}},33),
S('official-four','official','官路终章 · 考成表之外','一年考成将至。你可以用更漂亮的数字换一个京中职位，也可以留任处理还没完的水利、户籍和旧债。调令上没有问百姓是否满意，只问应征税粮完成了几成。',[
 C('按实呈报，申请留任继续治事','你在考成表后附上未完事项，承认成效也承认缺口。升迁慢了，未了的事终于有人继续认领。',{'routes.official':8,'flags.official_ending':'local',renown:12,'factions.court':5,'factions.censor':10},{delay:{id:'after-official',days:4}}),
 C('入京任职，为地方争制度上的改变','你带走的不只是一份履历，还有各处签名的请愿与不能轻易兑付的期待。',{'routes.official':8,'flags.official_ending':'capital','factions.court':15,'stats.learning':3},{delay:{id:'after-official',days:4}}),
 C('辞去职务，保留独立代书与调解工作','印还回去，你的名字仍留在许多能找到你的地方。官路留下的经验，开始服务另一种生活。',{'routes.official':8,'flags.official_ending':'resign','routes.scholar':5,morality:5,renown:8},{delay:{id:'after-official',days:4}})],{seen:['official-three'],min:{'routes.official':48}},34),

S('outlaw-one','outlaw','绿林一 · 入伙之前','罗照夜邀请你到黑旗寨吃一顿饭。饭后不是立刻结盟，而是让你看粮仓、伤房与分账册。她说愿意上山的人各有理由，但不能假装一面义旗底下没有恶人。',[
 C('先订不掳平民、不动救命粮的底线','有人嘲笑你还没入伙就讲条件。罗照夜替你倒满酒，说条件能记下，才配叫同伙。',{'routes.outlaw':5,'relations.luo':7,'flags.outlaw_code':'limit',morality:2}),
 C('先当耳目，不参与分赃','你保留了进退空间，也清楚这种空间不会永远免费。',{'routes.outlaw':4,'factions.shadow':4,'flags.outlaw_code':'distance'}),
 C('照寨规入伙，先取得信任','你喝下盟酒，领到一份分账。名字写进寨册，也从此可能写进官府的另一本册。',{'routes.outlaw':5,silver:25,heat:4,'flags.outlaw_code':'loyalty'})],{min:{'routes.outlaw':8}},41),
S('outlaw-two','outlaw','绿林二 · 铁山的粮车','铁山矿主请官军押送一批“赈济粮”，寨里得到消息却说粮是抵押来的矿工口粮。若劫车，正好坐实官府的匪名；若不劫，寨里这个冬天也不好过。',[
 C('先拿到粮契，再决定如何截车','你从押运账房处找到抵押条款。灾粮的名目掩着一笔不肯见光的旧债。',{'routes.outlaw':5,'inventory.evidence':1,'flags.outlaw_grain':'proof','factions.smith':5}),
 C('只夺回可指认属于矿工的部分','你要求矿工现场认领。粮车少了一截，却没让每一个押车人都变成必须杀掉的敌人。',{'routes.outlaw':5,heat:6,'inventory.grain':3,'flags.outlaw_grain':'return','factions.smith':6}),
 C('强夺整车，以粮稳住寨众','寨仓满了几日。官府布告上的黑旗二字也比从前写得更大。',{'routes.outlaw':6,heat:12,morality:-5,'inventory.grain':5,'flags.outlaw_grain':'seize'})],{seen:['outlaw-one'],cities:['tieshan','yumen'],min:{'routes.outlaw':18}},42),
S('outlaw-three','outlaw','绿林三 · 两位当家','寨主坚持以人质换撤兵，罗照夜主张先放老幼。两人都说自己为全寨负责，分账册与粮仓钥匙却分别握在不同人手里。你被请到议事堂，必须说出下一步。',[
 C('支持释放老幼，以公开粮账争取人心','你把粮账搬到堂前。争执没有结束，但人质终于能走出那道门。',{'routes.outlaw':5,'relations.luo':10,morality:5,'flags.outlaw_council':'luo','factions.blackflag':3}),
 C('建议由各户推举代表共同管粮与交涉','头领们不愿分权，却无法再装作寨里只有他们两人的声音。',{'routes.outlaw':5,'stats.strategy':1,'flags.outlaw_council':'council',renown:4}),
 C('服从寨主，以威慑换谈判筹码','寨主把更重要的差事交给你。孩子们看见你的腰牌时，开始退到墙边。',{'routes.outlaw':5,'factions.blackflag':8,heat:7,morality:-6,'flags.outlaw_council':'chief'})],{seen:['outlaw-two'],min:{'routes.outlaw':32}},43),
S('outlaw-four','outlaw','绿林终章 · 黑旗往何处','围山军暂退，寨里有三条路：接受有条件的招安、转作山路护运，或继续以武力控制山口。没有一种能抹掉过去。罗照夜问你，要让后来的人在山门前看见什么。',[
 C('以成文保障接受招安，追究具体罪责','你们没有获得一张洗清所有人的空白纸，却争到按人按事核验的程序。有人回乡，有人留下受审。',{'routes.outlaw':8,'flags.outlaw_ending':'amnesty',heat:-25,'factions.court':8,'factions.blackflag':5},{requires:{min:{'factions.court':3}},delay:{id:'after-outlaw',days:4}}),
 C('改办山道护运，靠路引与工钱维生','第一份新账不是分赃，而是修桥工钱。旧旗没烧，只从门楼上收进了仓。',{'routes.outlaw':8,'flags.outlaw_ending':'escort',heat:-15,'factions.guild':10,'routes.trade':5},{delay:{id:'after-outlaw',days:4}}),
 C('整合连寨，继续与官府周旋','你成为山口真正的主事人。粮仓与刀都归你调度，选择也再没有能推给的上级。',{'routes.outlaw':8,'flags.outlaw_ending':'rule',heat:18,silver:70,'factions.blackflag':15},{delay:{id:'after-outlaw',days:4}})],{seen:['outlaw-three'],min:{'routes.outlaw':48}},44),

S('scholar-one','scholar','学问一 · 一地的名字','林知意请你为地方志补访谈。官修底本只写田亩、税额与名宦，流民的迁徙、矿工的伤病和河道改迁都被视为不入正史的小事。你要决定先把什么写进去。',[
 C('从乡人的生计与迁徙写起','你在目录里加上一卷“民生”。林知意说，卷名容易写，接下来要让每一页有凭据。',{'routes.scholar':5,'inventory.manuscript':1,'flags.scholar_voice':'people'}),
 C('先订田赋与水道的资料标准','你让底本不再只是逐年照抄的数字，空白栏目也被明确保留下来。',{'routes.scholar':5,'stats.learning':1,'flags.scholar_voice':'records'}),
 C('记录各派互相矛盾的说法','你不急着替所有争议写一个整齐结论，先让不同声音各有自己的姓名。',{'routes.scholar':5,'stats.insight':1,'flags.scholar_voice':'plural'})],{min:{'routes.scholar':8}},51),
S('scholar-two','scholar','学问二 · 白鹿书院的门','临川白鹿书院愿意给你讲席，要求地方志暂缓刊印，以免影响明年的官府资助。孟清和说书院没有资助便难续学田，但一本永不付印的书也养不活它记录的人。',[
 C('接受讲席，约定明确的付印期限','期限写进聘书。你开始在书院里为这句话是否兑现持续奔走。',{'routes.scholar':5,'factions.academy':7,'flags.scholar_school':'inside'}),
 C('自办夜学与民间抄本，不依赖单一资助','来听课的人从船工到商贩都有，你学会把一段文章讲给不看文章的人听。',{'routes.scholar':5,renown:4,'flags.scholar_school':'open'},{cost:{silver:18}}),
 C('分开学术核验与刊印经费，另找合伙者','唐绮愿意资助一部分刻版，但要求账目公开。你接受她这一条。',{'routes.scholar':4,'routes.trade':2,'flags.scholar_school':'cooperate','relations.tang':5})],{seen:['scholar-one'],cities:['linchuan','jingdu'],min:{'routes.scholar':18}},52),
S('scholar-three','scholar','学问三 · 不能删去的一页','地方志写到河仓与矿井，一位资助人要求删去自家名字。其余证据都能保留，唯独这一页会让他的官商关系曝光。删掉便能立即印书，不删，整部书可能被扣。',[
 C('保留已核实的姓名，证据副本分存','你不把怀疑写成定论，也不把定论改成无名。稿子分成几路送出。',{'routes.scholar':5,'factions.censor':5,heat:4,'flags.scholar_page':'full','inventory.manuscript':1}),
 C('先匿名刊行，附明确可复核的档号','名字暂缓，事实与查证路径仍在。你答应将来补回，而不是永远遗忘。',{'routes.scholar':5,'stats.strategy':1,'flags.scholar_page':'archive'}),
 C('另印单页公开，正书继续出版','正书不再替这一页承受全部风险，单页却会沿着你无法完全掌控的路传开。',{'routes.scholar':5,'factions.shadow':4,heat:6,'flags.scholar_page':'leaflet'})],{seen:['scholar-two'],min:{'routes.scholar':32}},53),
S('scholar-four','scholar','学问终章 · 书成之后','地方志终于刻成。朝廷想征你修史，书院想请你做山长，乡民想让你留下继续教孩子。林知意说，一本书并不能替后来的每个人回答问题，但可以告诉他们从哪里开始问。',[
 C('建立开放书库，保留原稿与异议','书库不只收最后的成书，也收勘误、不同证词与没能写完的访谈。真相不再只有一个保管人。',{'routes.scholar':8,'flags.scholar_ending':'library','factions.academy':12,renown:12},{delay:{id:'after-scholar',days:4}}),
 C('赴京修史，把地方经验带进官修典籍','你知道能写进去的未必是全部，仍决定亲自去争那些空白。',{'routes.scholar':8,'flags.scholar_ending':'history','routes.official':5,'factions.court':10,'stats.learning':3},{delay:{id:'after-scholar',days:4}}),
 C('办流动义学，让更多人自己写下见闻','你没有把所有故事都收在自己名下。新的稿子，开始带着不同人的笔迹。',{'routes.scholar':8,'flags.scholar_ending':'school',morality:5,renown:10,'stats.charm':3},{delay:{id:'after-scholar',days:4}})],{seen:['scholar-three'],min:{'routes.scholar':48}},54),

S('medicine-one','medicine','医道一 · 先看病还是先看钱','温见素请你独立看一次诊。病人带来的钱不够一副完整药，药庐又已经赊了许多账。她说医者要守住一条底线，但不能假装药材、伙计和灶火不花银子。',[
 C('先诊治，再按实际情况分期','你把治疗与付款次序分开，也把以后要解决的财务问题认真记下。',{'routes.medicine':5,'relations.wen':6,'flags.medicine_ethic':'care',morality:2}),
 C('核验替代方，降低本次药价','药不以贵为准，你从第一张独立处方开始学会说明适用与不足。',{'routes.medicine':5,'stats.insight':1,'flags.medicine_ethic':'evidence'}),
 C('联络商户设急救公筹','你把一次个人行善，试着改成不依靠某一个人撑到底的办法。',{'routes.medicine':4,'routes.trade':2,'flags.medicine_ethic':'fund','factions.guild':3})],{min:{'routes.medicine':8}},61),
S('medicine-two','medicine','医道二 · 药谷断供','药谷的药农不肯按旧价交货，药行说他们贪心，药农却拿出洪水后翻倍的工钱和损毁的晒场。外地诊棚还在催药，温见素让你亲眼去看药从哪里来。',[
 C('按新成本重订长期供货与灾损分担','你不再把低药价的全部代价压给采药的人。采购的账变复杂，却更能继续做下去。',{'routes.medicine':5,'factions.healers':6,'flags.medicine_supply':'fair'},{cost:{silver:20}}),
 C('帮助重修晒场，换一批平价药','木架晾起，药农把第一批干药先装上你的船。',{'routes.medicine':5,'inventory.medicine':3,'factions.smith':3,'flags.medicine_supply':'repair'}),
 C('整理本地替代药，减少单一路线依赖','你写下替代与禁忌，不把药效不同的两样东西说成完全一样。',{'routes.medicine':5,'inventory.formula':1,'stats.learning':1,'flags.medicine_supply':'substitute'})],{seen:['medicine-one'],cities:['yaogu','nanpu'],min:{'routes.medicine':18}},62),
S('medicine-three','medicine','医道三 · 一城的病','诊棚病人渐多，新的病例大多来自河仓下游。官府担心停运影响粮市，商人担心封河后药也运不进来。你必须同时考虑饮水、分诊、通道与人群的恐慌。',[
 C('建立分诊与净水点，保留必要货运','',{'routes.medicine':5},{check:{stat:'insight',difficulty:54},success:{text:'几份病录合成一幅传播图。你们没有把整座城锁死，也找到了最需处理的水口。',effects:{'factions.healers':10,renown:7,'flags.medicine_outbreak':'contained'}},failure:{text:'分诊起初混乱，你们调整了两次。疫情仍有扩散，却终于不再毫无头绪。',effects:{silver:-18,'stats.insight':2,'flags.medicine_outbreak':'struggle'}}}),
 C('借漕帮船只组织分区转运与供水','你得到了水路上的帮助，也必须防止不同区域在船上再次混到一起。',{'routes.medicine':5,'factions.canal':8,'flags.medicine_outbreak':'river','stats.strategy':1}),
 C('凭河仓公开材料要求联合处置','旧案里的运输与水口记录派上了用场。几方不得不坐到同一张病情图前。',{'routes.medicine':6,'factions.censor':5,'flags.medicine_outbreak':'joint',renown:5},{requires:{flags:{case_resolution:'public'}}})],{seen:['medicine-two'],min:{'routes.medicine':32}},63),
S('medicine-four','medicine','医道终章 · 济世二字','疫势终于缓下。济世堂邀你建立联诊网络，官府想设官办医署，温见素却还记着远处那些从来没有固定医馆的村落。你要选择怎样让这次经验不只停在一座城。',[
 C('建立联诊与药材公筹网络','你订下药价公示、病录保密与转诊协作的规矩。医术之外，终于也有人认真修补看病的路。',{'routes.medicine':8,'flags.medicine_ending':'network','factions.healers':15,renown:12},{delay:{id:'after-medicine',days:4}}),
 C('接受官署任命，建立地方防疫档案','你把每次差点隐瞒掉的数字变成必须上报的栏目。制度未必自行有效，你准备继续盯着它。',{'routes.medicine':8,'flags.medicine_ending':'office','routes.official':5,'factions.court':10,'stats.learning':3},{delay:{id:'after-medicine',days:4}}),
 C('与温见素继续游医，沿路教授基础救护','一只药箱装不下天下的药，你便让更多地方学会先做哪几件有用的事。',{'routes.medicine':8,'flags.medicine_ending':'travel','relations.wen':15,morality:5,'stats.insight':3},{delay:{id:'after-medicine',days:4}})],{seen:['medicine-three'],min:{'routes.medicine':48}},64),

F('after-martial','martial,official','余波 · 新规遇上故人','数日后，一位与你相熟的剑会弟子违反公议程序。他请你私下通融，说自己从前也替你守过一夜门。你立过的规矩，第一次碰到熟人的脸。',[
 C('照新规复核，不让交情代替申辩','他不高兴，却仍有完整的说明机会。规矩第一次不靠陌生人的牺牲站住了脚。',{'factions.sword':3,morality:3,'routes.martial':2}),
 C('先替他补救，再公开说明自己的参与','你没有装作公正无私，也没有把私情藏进无名的处理。',{'stats.strategy':1,'routes.official':2})]),
F('after-trade','trade,scholar','余波 · 不好看的第一季账','商号送来第一季账。收入比预期少，伙计希望你少写几项费用，让出资人安心。你过去要求别人诚实写账的那些话，终于轮到自己兑现。',[
 C('公开真实账目与修正计划','有一位出资人退了，但留下的人开始认真讨论下一季怎么做。',{'routes.trade':3,'stats.business':1,renown:3}),
 C('自己垫付差额，并明确列作借款','账没有变漂亮，只多了一笔可核对的负责人借款。你也得为这笔钱安排回收期限。',{'routes.trade':3,'factions.guild':4},{cost:{silver:25}}),
 C('缩小规模，先让能持续的部分活下去','你不再为庞大的招牌维持虚假的热闹。小一点的生意，仍能做真。',{'routes.trade':2,'stats.strategy':1})]),
F('after-official','official,medicine','余波 · 远处的一份申诉','旧辖区寄来申诉，署名者说你的继任者只照考成表办事。无论你如今在何处，这封信都在问：曾经的承诺，离任后还算不算数？',[
 C('整理原案与处置依据，交给能追问的人','你不假装自己仍握着旧印，却把能让追责继续的材料一件件补齐。',{'routes.official':3,'factions.censor':4,renown:2}),
 C('亲自回信，提供具体申诉路径','你没有许诺立刻解决，只让来信者知道下一封信该送往哪里。',{'routes.scholar':2,'stats.charm':1,morality:2})]),
F('after-outlaw','outlaw,trade','余波 · 旧旗之下','一名旧部借黑旗名义收过路钱，还说无论换什么营生，总有人得替兄弟们把钱挣回来。山下商贩已经来问，这和从前到底有什么不同。',[
 C('退还钱款，公开处理借旗勒索','你先对自己人兑现了山门前的承诺。旧部不全服气，山下却终于肯再走一次这条路。',{'routes.outlaw':3,'factions.guild':5,morality:3,heat:-3}),
 C('将过路费用改成有标准、有用途的护运费','你要求自愿雇用与清楚票据，承认修桥要钱，也承认商贩有不雇你们的权利。',{'routes.trade':3,'stats.business':1,'factions.blackflag':2}),
 C('默认旧部继续收取','你稳住了自己人的分账，也让山下人记住，新招牌并没有带来他们期待的变化。',{'routes.outlaw':3,silver:30,heat:5,morality:-4})]),
F('after-scholar','scholar,official','余波 · 第一份勘误','一名年轻船工指出地方志中一处水道记载错误。那一段是你亲手写的，也是许多人夸赞资料扎实的部分。刻坊问要不要等下次重印再说。',[
 C('立即刊勘误，署明提出者','你的名字旁多了一次公开的错误，也多了一个可以修正错误的办法。',{'routes.scholar':3,'factions.academy':4,morality:3}),
 C('邀请船工共同复核相邻水道','他带来了一本油污斑斑的航记，里面还有许多你没有见过的知识。',{'routes.scholar':3,'stats.learning':2,'factions.canal':3})]),
F('after-medicine','medicine,trade','余波 · 值钱的药方','一位大药商愿高价买断你的方册，保证扩大产量，却要求不再免费抄传。他说只有独家经营，才值得投入稳定的药场。',[
 C('保留公开方册，以质量与服务合作','你没有卖掉抄方的权利，仍能与药商谈药材检验与配送的价钱。',{'routes.medicine':3,'routes.trade':2,'factions.healers':5}),
 C('将高质量制剂授权生产，原方仍公开','成药与原方被清楚区分，商业投入没有成为禁止他人学习的理由。',{'routes.trade':3,silver:40,'stats.business':1}),
 C('拒绝买断，继续依靠联诊共同维护','你拒绝了一笔快钱，也得继续为稳定药源与人员工钱寻找办法。',{'routes.medicine':3,morality:3,'factions.healers':4})])
];
if(typeof module!=='undefined'&&module.exports)module.exports=events;root.SHANHE_CHAPTERS=events;
})(typeof window!=='undefined'?window:globalThis);
