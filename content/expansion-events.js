(function(root){
const C=(label,text,effects={},extra={})=>({label,text,effects,...extra});
const E=(id,routes,title,text,choices,when)=>({id,kind:'random',routes:routes.split(','),title,text,choices,when,cooldown:12});
const S=(id,routes,title,text,choices,when,order=80)=>({id,kind:'story',routes:routes.split(','),title,text,choices,when,once:true,order});
const events=[
E('wu-weigh-sword','martial,trade','剑轻一钱','军械铺新铸的护手剑比样剑轻一钱。掌柜称这是改良，镖师却说少的正是最要紧的配重。你被请来试剑，背后还等着一批急发的护航订单。',[
C('做一轮公开的实用测试','几次挡击后，配重问题显了出来。掌柜改了工序，也认了延误的责任。',{'routes.martial':3,'factions.smith':4,'stats.martial':1}),
C('暂停订单，与客户重议交期','你失去急单的额外酬金，却没有让有疑点的剑先到镖师手里。',{'routes.trade':3,'factions.escort':4,morality:2}),
C('向老匠人求教两种配重的区别','你学到轻不等于好，重也不等于稳。好剑必须适合握剑的人。',{'stats.insight':1,'routes.martial':2})]),
E('wu-silent-escort','martial,medicine','不能鸣锣的镖','一车药怕震、一名伤员怕惊，而山口的规矩是护镖必鸣锣亮旗。镖师愿为你停锣，却担心被人误认成没有来头的散客。',[
C('先遣人送信沿路照会','锣没有响，消息先走了一遍。护卫不只靠人人都能看见的声势。',{'routes.martial':3,'factions.escort':3,'stats.strategy':1}),
C('请医者说明需要，另挂急救标记','山口放行，也嘱咐你们回来讲讲伤员是否平安。',{'routes.medicine':3,'factions.healers':4}),
C('让伤员先住驿站，你去安排转运','你把不能同时满足的事拆开办理，没有用赶路的名义逼人硬撑。',{morality:2,'stats.charm':1})]),
E('wu-school-wages','martial,official','授徒也要工钱','拳馆新收许多穷家弟子，负责教初学者的师姐却连续两月没领工钱。馆主说她有大义，不该计较。她收起木剑，准备另寻一份活。',[
C('把授课工钱列为固定支出','教习不再以忍耐换取被夸赞。拳馆也第一次看清自己能接多少弟子。',{'routes.martial':3,'factions.sword':3,'stats.business':1}),
C('协助开设付费夜课补贴基础课','愿意付钱的商户子弟来了，院里得以继续留出免费的位置。',{'routes.trade':3,renown:2}),
C('支持她另寻生计，不以道义挽留','她临走仍把教案留给继任者。选择离开，不等于从前的付出不作数。',{morality:3,'routes.scholar':2})]),
E('wu-old-rival','martial,outlaw','护航队里的旧敌','镖师认出商队新雇的向导，称对方十年前参与过劫镖。向导承认，却说后来救过同一条路上的许多商人。货主只想知道今日还能不能启程。',[
C('核实旧案，再明确本次各自职责','旧责没有被一句改过抹去，本次的担保与边界也终于写清。',{'routes.official':3,'factions.escort':3}),
C('请向导先提供沿途可核实的情报','他报出的塌桥与盘查都对上了。信任从今天能验证的事慢慢开始。',{'routes.outlaw':3,'stats.insight':1}),
C('另换队伍，避免途中爆发冲突','你多花了些准备时间，也没有要求任何人立刻原谅伤害自己的人。',{'routes.martial':2,'stats.strategy':1})]),
E('wu-young-guard','martial','第一次站夜岗','年轻护卫连站三更，不敢说困。他怕承认疲倦便失去第一份护航差事，手握着刀却已在微微打颤。管事赞他有胆气，仍催着换到更远的岗。',[
C('安排轮岗，把疲劳也列入风险','夜岗终于有了可执行的交班表，逞强不再是唯一能证明自己的办法。',{'routes.martial':3,'factions.escort':4}),
C('亲自替他站一更，教如何报备','你告诉他，能及时求援的护卫，比倒下后再被人发现的更可靠。',{'stats.constitution':1,morality:3}),
C('请管事记录工时并补足休息','那份小小的工时簿，后来也替别的护卫说了话。',{'routes.official':2,'routes.scholar':1})]),
E('wu-post-injury','martial,medicine','退下镖线的人','一位镖师伤后握不住长刀，被劝去做无关紧要的杂役。他想教年轻人辨识伏击，却被说只会讲从前。你看见他的路书标着整整三十处避险点。',[
C('请他主持行前路线研判','镖局第一次为不亲自持刀的人设了明确职责。那本路书重新摆上正桌。',{'routes.martial':3,'factions.escort':5}),
C('帮他把路书整理成护航教材','经验没有随一只受伤的手退出江湖，反而得以走到更远的地方。',{'routes.scholar':3,'inventory.manuscript':1}),
C('与医者为他改造练习器具','器具不能让伤势凭空消失，却让他重新找回一部分可以自己完成的动作。',{'routes.medicine':3,'factions.smith':3})]),
E('wu-dock-contest','martial,trade','码头约斗','两家护航队为抢一笔长约约在码头比武。输者半年不得接货，货主看热闹的人比搬货的还多。你发现争的其实是定金一直没到账。',[
C('先查定金去向，再谈谁接长约','欠款的中间人无法再躲在两队人的冲突后面。刀终于先收回鞘。',{'routes.trade':3,'stats.insight':1}),
C('将比武改成协作护运考校','两队被分到同一条试运线路，才发现彼此擅长的是不同路段。',{'routes.martial':3,'factions.escort':3}),
C('先疏散围观者，防止误伤','你没决定谁赢，却让不该为争执受伤的人先离开了刀锋。',{morality:2,'stats.strategy':1})]),

E('trade-porcelain-straw','trade','瓷箱里的稻草','一箱好瓷到了买家手中全碎了，外箱却完好。装箱人省去了几层稻草，说运费按体积收，货主自己也催着装紧些。',[
C('逐层核对包装与承运约定','双方承认各自省下的小钱叠成了大损失。新的装箱标准写进下一单。',{'routes.trade':3,'stats.business':1}),
C('联系窑场回收碎瓷作工艺样本','货没有恢复原价，但你找到一条不把损坏全部倒进河里的去路。',{'routes.trade':2,silver:12,'factions.smith':3}),
C('请老装箱工示范易碎品缓冲','你没有急着责备最末端的工人，先学会了怎样的箱才经得起一程路。',{'stats.insight':1,morality:2})]),
E('trade-cloth-shortage','trade,medicine','港口缺的不是绸','海商嫌你带来的棉布太普通，转头却来问有没有纱布。码头缆工近来受伤多，临川的织造商都在赶绸缎大单，没人愿意留机做薄布。',[
C('按实际需求组织下一批纱布','一条商路从医馆和缆工的需要开始，而非最亮眼的货物开始。',{'routes.trade':3,'factions.healers':4,'stats.business':1}),
C('将耐用棉布卖给修船队','价钱没有绸缎好看，数量却稳定。普通货也有普通人离不开的用途。',{'routes.trade':3,silver:18}),
C('把缺货情况交给织坊共议排产','织坊愿意给薄布留几架机，前提是有人愿签可持续的采购单。',{'routes.official':1,'routes.trade':2,'factions.smith':3})]),
E('trade-stock-corner','trade','买断一条街的盐','同行邀你囤下本地食盐，等缺货再一点点卖。仓里盐很足，招牌上却都写了暂缺。几个小食摊已经打算停炉。',[
C('拒绝囤价，联络外地补货','你没有赚这轮轻松钱，却让一个被人为堵住的缺口重新通起来。',{'routes.trade':3,renown:4,'factions.guild':-2}),
C('调查仓单，把假缺货变成可核事实','一张张未提货的仓单说明，这不是海路被风封住。',{'routes.official':3,'inventory.evidence':1}),
C('只与小摊签平价供应的短契','你从有限的现货里留出一部分，仍须自己承担下一批采购的风险。',{'routes.trade':3,morality:2},{cost:{silver:15}})]),
E('trade-booked-freight','trade,official','同一车位卖了两次','两家商户拿着不同货票来认同一个车位，车行辩称只是排期误会。两边的交期都不能轻易延后，其中一家运的是官署文纸。',[
C('调出定金时序，明确违约赔偿','车行不能再把安排失误变成两个客户彼此争执。',{'routes.trade':3,'stats.business':1}),
C('拆分车次，先走最不能受潮的货','你们重新排了轻重缓急，没人得到全部便利，却都留下一条履约的路。',{'routes.trade':3,'stats.strategy':1}),
C('找熟识船户增加一段水运','水陆换装费了工夫，原本不够的运力却因此多出一截。',{'factions.canal':4,'routes.trade':2})]),
E('trade-return-note','trade,scholar','退货要不要留名','客户退回一批纸，称不够好。纸匠说那是按客户要求做的薄纸，若认下质量差，日后便难再接书院订单。你需要让退货理由准确留下来。',[
C('按规格差异出具退换说明','退货不再等于承认劣质，双方也知道下一份订单该写清什么。',{'routes.trade':3,'factions.smith':3}),
C('分送几家用途不同的买主试用','薄纸不适合装订，却适合临时票签。你找到另一种真实需求。',{'routes.trade':3,silver:15}),
C('请书院与纸匠共同订验纸办法','好坏有了可复核的尺度，不必每次只比谁更有名气。',{'routes.scholar':3,'factions.academy':3})]),
E('trade-escort-small','trade,martial','小货主的保镖费','三个小商人的货值都不高，单独雇镖不划算，拼车却担心一人出事大家赔。镖局说可以合运，但分损办法得先写明。',[
C('逐件登记，按各自申价分摊佣金','共同上路不再意味着共同承担没有边界的债。',{'routes.trade':3,'factions.escort':4}),
C('约定只保关键货，普通货自担风险','他们清楚知道省下的钱换来了什么，不再把便宜误当全保。',{'routes.trade':3,'stats.strategy':1}),
C('由熟人互保，先做一趟短途试运','大合作从小一段路开始，彼此也有机会先看见对方如何做事。',{'routes.martial':2,'stats.charm':1})]),
E('trade-market-news','trade,outlaw','消息也有保质期','齐九卖给你一条缺粮的消息，却没有说消息来自哪天。你发现另一个商队昨夜已经到港，今天的高价未必还等得住明天的你。',[
C('先核船期，再决定是否买消息','你没有用一张旧价签替未来的利润作保。',{'routes.trade':3,'stats.insight':1}),
C('请他以后注明采信日期与范围','齐九说这会让情报更贵，你答应只为能说清边界的消息付钱。',{'routes.outlaw':2,'relations.qi':4}),
C('改做附近城镇的稳定需求','利润不惊人，至少不用追着每一个传闻把盘缠跑空。',{'routes.trade':2,'stats.business':1})]),

E('official-passport','official,trade','通关牒上的旧乡名','一队灾民的文牒写着旧乡名，关吏说名册已无此乡不能放行。乡已经并入邻县，可人并没有因此失去自己是谁。商队怕耽搁，催你别管。',[
C('核对并乡公文，做新旧名对照','一道不必存在的关终于有了可查的处理办法。',{'routes.official':3,'stats.learning':1,renown:2}),
C('请当地里正先作临时担保','他们得以过关，事后仍须补齐手续，责任也有了明确的人接。',{'routes.official':3,'factions.court':2}),
C('留下路费与代书地址','你无法代办所有人的身份，却没让他们只得到一句去别处问。',{morality:3},{cost:{silver:10}})]),
E('official-weighing','official,trade','官秤与市秤','查货时官秤总比市秤重，关吏说民间秤才有问题。每次只差一点，一季累积下来却足以让小商破产。秤砣的封漆看着还很新。',[
C('用标准砝码当众复核','复核显示偏差确实存在，不能再用一次误差推过去。',{'routes.official':3,'factions.censor':4}),
C('整理多家收据证明长期偏差','一笔小钱有了时间的长度，终于能被当成值得追究的问题。',{'routes.scholar':3,'inventory.manuscript':1}),
C('要求此单双秤并验再缴款','你先守住眼前这批货，也为后来人留下了一次可以援引的先例。',{'routes.trade':3,'stats.business':1})]),
E('official-clan-pressure','official','亲戚递来的保状','一位远亲请你在保状上签名，说大家既有亲缘，何必像对陌生人一样问细节。他保证事情不大，却始终不肯把原始借据拿来。',[
C('先核保状责任，再谈亲缘','你把能帮和不能帮的事说清，亲戚不快，也没再拿你的名字作空白担保。',{'routes.official':3,'stats.strategy':1}),
C('另找不需作保的解决办法','你帮他联系分期调解，没有把整个家庭的财物押在一句放心上。',{'routes.trade':2,'stats.charm':1}),
C('婉拒具名，写清拒绝缘由','纸上话并不漂亮，却避免同一份沉默被别人解释成已经同意。',{'routes.scholar':2,morality:2})]),
E('official-small-inn','official,trade','给小客栈的整顿令','客栈收到停业整顿令，问题是夜间登记不全。掌柜承认疏漏，却说昨夜收留的是付不起房钱的灾民，不敢把他们写作正式住客。',[
C('区分安全登记与收费身份','登记终于不必以付得起房钱为前提，客栈也补上了确实欠缺的记录。',{'routes.official':3,renown:2}),
C('帮掌柜补办临时安置流程','好心不再全靠在制度外偷偷做，掌柜也知道下次该找哪一处接洽。',{'routes.official':3,'factions.court':3}),
C('先给暂住者找后续落脚处','整顿要时间，人不能一直站在门外等通知。',{'routes.medicine':2,morality:3})]),
E('official-empty-village','official,scholar','人口增长的空村','报表说村里新增三十户，你实地走过却只见六口灶。书吏说其他人是季节性外出，里正承认只是为了申请一段新渠才把数字写大。',[
C('据实改册，另写真实灌溉需求','你没有以好目的保留假数，也没让改正错误等于永远失去修渠的机会。',{'routes.official':3,'stats.learning':1}),
C('记录常住与季住两种口径','六口灶之外确有来往劳工，两种人数终于各有合适的用途。',{'routes.scholar':3,'inventory.manuscript':1}),
C('请邻村共同申报实际用水','被一份报表分开的需求，转到同一条渠前重新讨论。',{'routes.trade':1,'routes.official':2,'stats.charm':1})]),
E('official-contract-counsel','official,trade','书吏不肯读的契','来签雇工契的农人不识字，书吏说条款是统一格式，无需多念。你看见免责一栏又添了几行细字，写着路上所有损失都由雇工自负。',[
C('逐条读明，再问他是否同意','那人听完后决定换一份活。签名第一次真正发生在知情之后。',{'routes.official':3,morality:3}),
C('要求雇主解释新增免责范围','雇主删了两条不能合理归责于雇工的风险，契才重新放回桌上。',{'routes.trade':3,'stats.business':1}),
C('教他在副本留下识别与见证记号','一次念契不足以改变不识字的处境，但可以让这份契以后仍能找到。',{'routes.scholar':3,'factions.academy':2})]),
E('official-water-order','official,medicine','一口井的排队册','缺水时里正按纳税户先后供水，几户借住的病人排在最末。里正说总要有个顺序，却没有人问过顺序应先照顾谁。',[
C('将急需饮水者另列保障份额','排队仍有次序，活下去却不再全由户籍决定。',{'routes.official':3,'factions.healers':3,morality:2}),
C('增加临时送水，不只争原有份额','几位船工接过水桶，让那份名单不用承担所有供给不足的压力。',{'routes.trade':2,'factions.canal':4}),
C('公开水量与分配依据，征求修订','人们终于知道争的是多少水，也知道自己的意见会记在哪里。',{'routes.scholar':2,'stats.charm':1})]),

E('outlaw-family-pass','outlaw,trade','持黑旗路引的商人','一个商人拿着黑旗路引过山，巡山人却说他的堂兄欠过寨钱，应先替亲戚还。商人说只因同姓便被拉到一起，做什么路引都没有用。',[
C('按具体债契追索，不连坐同行','路引重新有了意义，寨里也得学会把自己的账写清。',{'routes.outlaw':3,'factions.guild':4,morality:2}),
C('让双方登记争议，先准本趟货通过','一场旧债没有截断今日所有人的活路，债主也保留正式追索。',{'routes.official':2,'stats.strategy':1}),
C('帮他们把两个人的往来拆账','亲缘与债务终于各有各的名字，算盘不再只随谁嗓门大而响。',{'routes.trade':3,'stats.business':1})]),
E('outlaw-failed-escort','outlaw,martial','败镖后的分赃','散匪带回一批药箱，寨里有人想买下。卖货人炫耀镖师伤得很重，罗照夜问你，这种便宜是否还该拿整个寨子的粮钱去换。',[
C('拒收，并通知医者寻找伤员','寨里少了一笔便宜药，至少没替下一次袭击提供现银。',{'routes.outlaw':3,'factions.healers':4,morality:3}),
C('先核药源，追回可辨认的货','你拿到商号与箱号，赃物不再只是模糊的山路货。',{'routes.official':2,'inventory.evidence':1}),
C('让药箱留待原主认领','几个人不服，你要求他们把反对的话也记进公账，而非偷偷分走。',{'routes.outlaw':3,'factions.escort':3})]),
E('outlaw-women-ledger','outlaw','灶房也要有名字','山寨议事只给带刀的人留座，灶房的人却负责全寨口粮。粮仓短缺时，头领责备她们不会省，仍不肯让她们看完整的采购账。',[
C('让管粮与做饭的人共同核账','他们发现真正的损耗发生在山下收货，而非灶房多煮的一碗。',{'routes.outlaw':3,'stats.business':1,morality:2}),
C('把后勤代表写进议事规矩','说话的位置不再只由腰间是否有刀决定。',{'routes.official':2,renown:3}),
C('先为灶房补一份可查采购记录','小小的账簿不能立刻改变座次，却让下次问责多了一份实在依据。',{'routes.scholar':3,'inventory.manuscript':1})]),
E('outlaw-safe-house','outlaw,medicine','藏身处的发热者','暗线藏身处来了两名发热逃兵，接应人说不能叫医者，怕位置暴露。逃兵已分不清眼前是谁，仍反复念着一个家乡名字。',[
C('建立中立转诊处，不公开暗线','你把需要救治的人与需要保密的位置分开，不让二者只能二选一。',{'routes.outlaw':3,'factions.healers':4}),
C('请可靠医者隔离诊治','一份信任被用在真实危险前，医者也要求你配合饮水与分诊安排。',{'routes.medicine':3,morality:3}),
C('先记家乡与身份，安排远处求援','你没有许诺什么都能办到，至少不让他们在昏迷后连名字也丢失。',{'routes.scholar':2,'stats.insight':1})]),
E('outlaw-buying-peace','outlaw,official','拿钱买来的平静','巡检私下提出按月交钱便不来搜山。寨主觉得划算，却不肯问为何钱只交给此人、换届后又会怎样。你被请去算这笔长期账。',[
C('拒绝口头许诺，要求可见的合法身份安排','巡检很不高兴，寨里却开始正面讨论从山里走出去究竟需要什么。',{'routes.official':3,'factions.court':-2,'flags.amnesty_contact':true}),
C('限制临时打点，不将其当永久保障','你把期限和用途写清，也明确这笔钱不能代替下一步的生计与身份处理。',{'routes.outlaw':3,'stats.strategy':1}),
C('改与山下村社商议互不侵扰','不必通过同一个人的钱袋，你们仍可能建立一条有限而具体的共同规则。',{'routes.trade':2,'stats.charm':1})]),
E('outlaw-heir-knife','outlaw','当家的儿子','老寨主想把粮仓钥匙交给自己儿子，理由是亲人最可靠。儿子却连寨里多少伤员都不知道，几位常年管粮的旧人已在准备离开。',[
C('要求先受同样考校，再议交接','血缘可以给机会，不能代替对全寨生活的本领与责任。',{'routes.outlaw':3,'factions.blackflag':3,morality:2}),
C('让老管粮人带他做满一个季度','你争到的不是马上否定一个人，而是让继承前先发生真正的学习。',{'routes.scholar':2,'stats.strategy':1}),
C('将钥匙与核账权分开管理','新旧人都不再能独自把整座仓当作自己的箱子。',{'routes.official':3,'stats.learning':1})]),
E('outlaw-road-repair','outlaw,trade','修路之后的收费','寨里修了危险栈道，开始收护路费。第一日收费有票，第三日便有人说出示旧票也算欠账。修路本是好事，名字却正被用坏。',[
C('核销旧票，公开收费时限','寨里少收了一些重复钱，却让人终于敢把新路当成能反复走的路。',{'routes.outlaw':3,'factions.guild':4}),
C('按修路实际成本确定上限','你算清维护与回收，不让一次修路成为永不结束的索取。',{'routes.trade':3,'stats.business':1}),
C('暂停收费，先修正执票办法','短期没钱入账，长期信用却少掉一个继续流血的口子。',{'routes.official':2,morality:2})]),

E('scholar-merchant-diary','scholar,trade','不会写好字的航记','船户的航记被书院退回，说用字粗俗、不宜入藏。你翻开却见每天的水位、粮价和风向都写得很清楚，甚至标出谁的船夜里没回来。',[
C('按原貌整理，再附用字对照','你没有把船户的声音全改成自己的腔调，知识也终于以另一种笔迹入了库。',{'routes.scholar':3,'factions.canal':4}),
C('请船户来讲实际航路','许多漂亮舆图在他的讲述前露出空白，学生们第一次带着问题走向渡口。',{'routes.scholar':3,'stats.learning':1}),
C('做成可供商队使用的简明路册','路册卖得不贵，稿酬却确实交到记录它的人手中。',{'routes.trade':3,silver:12,'factions.academy':2})]),
E('scholar-family-women','scholar','族谱上没有的名字','修谱者将女眷写成某氏，将早夭子写成无名。保管旧信的人说，这些人都有名字，也曾是别人盼着归家的人。你被请来誊清底稿。',[
C('在附录保留姓名与已知经历','你没让谱上只剩能传承职位与田产的人，也给模糊处明确留下待补。',{'routes.scholar':3,morality:3,'inventory.manuscript':1}),
C('请家人分别提供原始信件佐证','一封封旧信把那些只有称谓的地方重新填成人。',{'routes.scholar':3,'stats.insight':1}),
C('将不愿公开的部分由本人家属封存','记录并不意味着所有私事都应供外人观看，保管的边界也被写清。',{'routes.official':2,morality:2})]),
E('scholar-cheap-paper','scholar,trade','贵纸与好文章','讲席称学生必须买指定纸张才能交卷，纸铺恰好是他亲眷开的。贫家学生把字挤在背面，担心纸不合规便连内容也不看。',[
C('建议按内容评卷，统一最低书写要求','纸不再替文章先分高低，指定店铺的生意也终于能被问一问。',{'routes.scholar':3,renown:2}),
C('组织合购普通纸，公开成本','学生自己有了可选的来源，便宜也不再等于只能偷偷用。',{'routes.trade':3,'stats.business':1}),
C('为无力购纸者做一批可重复习字板','练习与正式交卷分开，年轻人至少不用连练错一个字都计算代价。',{'factions.smith':4,'routes.scholar':2},{cost:{silver:12}})]),
E('scholar-corrected-pupil','scholar','弟子当众纠错','你讲到一条河的改道年份，弟子拿着父亲的旧航记提出异议。有人斥他没礼数，劝你先顾师长体面，私下再改。',[
C('当场核对，承认应当更正','弟子松开紧攥的册子，别的学生也知道问题可以怎样提出。',{'routes.scholar':3,'stats.learning':1,morality:2}),
C('一起补查其余相近记录','一次纠错变成共同整理资料，而不是谁赢谁输的表态。',{'routes.scholar':3,'factions.academy':3}),
C('将此次核验过程附在讲义后','以后读到的人既知道结论，也知道错误如何被发现。',{'routes.official':1,'inventory.manuscript':1})]),
E('scholar-private-tutor','scholar,official','只教嫡子的先生','私塾愿收嫡子，却说庶出的孩子应在家学些杂事，免得日后争产。孩子们还分不清族中的说法，已先学会谁该站到后面。',[
C('要求按学习能力收徒，不按母亲身份','这不立即改变宗族继承规则，却把读书与出身之间划出一道清楚界线。',{'routes.scholar':3,morality:4,renown:2}),
C('另请愿教所有子女的先生','家学换了地方，也换了判断一个孩子是否值得投入的标准。',{'routes.scholar':3,'factions.academy':2},{cost:{silver:18}}),
C('先组织共同识字，再谈正式师承','第一堂课就在自家院里，没人先被问是哪一房生的。',{'routes.official':1,morality:3})]),
E('scholar-translation','scholar,trade','译错的一句价','商契把一地的整批价译成了单件价，双方都觉得对方忽然反悔。译者年轻，担心认错便永远没有人再雇。',[
C('把两种语言与计量写在同一页','错误被改正，也有了防止下次再错的具体办法。',{'routes.scholar':3,'stats.learning':1}),
C('让交易先暂停，分别确认原意','你没有催着任何人在没理解的纸上签下名字。',{'routes.trade':3,'stats.charm':1}),
C('协助译者写一份更正说明','他为自己的错误承担责任，也保留了学会做得更好的机会。',{morality:2,'routes.official':2})]),
E('scholar-quiet-record','scholar,medicine','一份不该公开的病录','书院想刊印一组疗效出众的病录，病人姓名与家事也都在其中。医者认为学术有益，病人却不愿让全城知道自己患过什么。',[
C('隐去身份，仅留必要诊疗资料','知识得以交流，病人也没有为配合治病失去自己的生活。',{'routes.scholar':3,'factions.healers':4}),
C('逐一询问当事人可公开的范围','有的人同意，有的人拒绝。最终文本少了些故事性，多了真实的授权。',{'routes.medicine':3,morality:3}),
C('先写方法与统计，不用个体叙事','文章不那么动人，却仍能让别的医者判断经验是否有用。',{'stats.learning':1,'routes.scholar':2})]),

E('medicine-gauze','medicine,trade','便宜纱布的灰','新到纱布价低，展开却有暗灰。供货人说用清水洗洗就能用，诊棚又真的急缺。你必须分清哪些物资能替代、哪些不能省。',[
C('检查批次，先隔离不合格部分','你没有让价格与急迫成为跳过检验的理由，随后也找到能先保障急用的少量合格货。',{'routes.medicine':3,'stats.insight':1}),
C('追溯供货，要求换货并留存样本','样本与货号让这次争执不只剩双方口头保证。',{'routes.trade':3,'inventory.evidence':1}),
C('联系附近医馆短期调剂','你欠下一份可以明确归还的货物人情，诊棚得以先撑过今天。',{'factions.healers':5,'routes.medicine':2})]),
E('medicine-pregnancy-care','medicine','该歇下来的新妇','一位新妇身怀有孕，仍每天帮店里搬箱。家里人说不做重活就算照顾，她却连按时吃饭也做不到。她请你替自己说清需要什么。',[
C('把休息与分工作成具体安排','不再只说多保重，每一项能由谁接手都被讲清。',{'routes.medicine':3,morality:3}),
C('教家人识别需要及时求医的异常','你没有给万能保证，只说明出现哪些情况该立刻找医者。',{'routes.medicine':3,'stats.learning':1}),
C('帮店里找一个短期替工','照顾没有仅靠一个人忍着，实际的工作也有人继续完成。',{'routes.trade':2,'factions.guild':2},{cost:{silver:12}})]),
E('medicine-guard-medicine','medicine,martial','护卫不肯报伤','商队护卫因怕扣工钱，一直把腿伤藏在绑腿下。伤口已红肿，他仍说等走完这程再看。领队以为他只是步子慢。',[
C('先做伤情评估，安排减负与转诊','领队看到明确的风险后同意调岗，护卫也终于肯说疼。',{'routes.medicine':3,'factions.escort':4}),
C('建议护航契写入伤员处理与工钱办法','下一趟不必再靠隐瞒伤势证明自己值得领钱。',{'routes.official':2,'routes.martial':1}),
C('暂时接过他的一部分行囊','你不能替他承受伤口，至少可以先减去肩上的重量。',{'stats.constitution':1,morality:2})]),
E('medicine-child-name','medicine,scholar','产簿上的两个栏','产簿把嫡出婴孩写进正册，庶出只记在附页。接生者担心附页容易散失，病史与用药也会因此断开；管册人却说向来如此。',[
C('统一医疗记录，宗族身份另列','孩子得到同样完整的诊疗依据，族中的称谓不能替代健康档案。',{'routes.medicine':3,morality:3}),
C('给每个家庭一份可保管的副本','一本册子之外又多一条保留线，不再把记忆全押在同一间柜房。',{'routes.scholar':3,'inventory.manuscript':1}),
C('请书吏说明身份与诊疗责任的边界','新条款第一次写清，救治不按正册与附页区分先后。',{'routes.official':3,'factions.healers':3})]),
E('medicine-gift-cure','medicine,official','答谢还是请托','病家送来一件贵礼，附信说想让医者替亲族的伤病证明多写几句。真实病情确有不便，却不足以支持信里要求的全部结论。',[
C('退回贵礼，按实际病情出证','证明不再是买来的好听话，病家仍得到能够支持真实需要的材料。',{'routes.medicine':3,morality:3}),
C('补充功能限制，不夸大病名','你把不能做的事说明白，没有靠加重字眼代替准确描述。',{'routes.official':2,'stats.learning':1}),
C('介绍合适的调解与救济渠道','求助没有被拒在门外，只是被引向更适合解决其难处的地方。',{'routes.scholar':1,'stats.charm':1})]),
E('medicine-old-wound','medicine,martial','旧伤与家业','退役镖师的旧伤在雨季复发，他担心儿子只能继承这一身伤，不能继承自己的镖师身份。你看到他家里保存完好的路书和借宿名册。',[
C('协助整理经验，让后辈从基本功开始','身份不能自动拿到，知识、信任与避险经验却能成为真正的家底。',{'routes.medicine':2,'routes.scholar':2}),
C('请镖局提供见习机会而非直接授职','儿子先从认识道路与承担小任务开始，父亲也不必替他担保尚未练成的本领。',{'routes.martial':3,'factions.escort':4}),
C('先安排旧伤调养与适合的工作','养家不只靠继续硬扛最危险的那份差事。',{'routes.medicine':3,morality:2})]),
E('medicine-water-barge','medicine,trade','药船也需要修缆','诊船上的人想把所有捐款都买成药，船工却指出缆绳已经发脆。捐款人只肯为药材留名，不愿为修船写一笔支出。',[
C('公开解释基础维护也是诊疗成本','新捐单把修缆列在药箱旁，诊船得以安全继续靠岸。',{'routes.medicine':3,'stats.business':1}),
C('找百工盟按公价维修并留检验记录','维修不再是说不清的杂费，船工也得到应有工钱。',{'routes.trade':2,'factions.smith':4}),
C('临时改为岸上诊棚，待船修好再走','服务范围缩小了，却没有拿病人与船工的安全来维持漂漂亮亮的计划。',{morality:3,'routes.medicine':2})]),

S('weave-one','trade,official,scholar','第二卷序 · 四城联保','河仓案后，几座城准备联办一条赈济与军需兼行的商路。唐绮主张联保，巡检要统一文牒，书院要求公开验收。每一项都合理，加起来的手续却可能把小商人挡在路外。你被请来参与制定第一份联保约。',[
C('先区分安全底线与可简化手续','你要求每一栏写明用途，不让表格只是因为从前有便一直增加。',{'flags.weave_started':true,'routes.official':4,'factions.guild':4}),
C('为小商号设置限额试行通道','不必一开始承担整条商路的风险，小商人也能逐步积累履约记录。',{'flags.weave_started':true,'routes.trade':4,renown:3}),
C('建立可更正与申诉的公开副本','联保约第一次写下：出错之后，谁可以说明，向哪里提出修正。',{'flags.weave_started':true,'routes.scholar':4,'inventory.manuscript':1})],{seen:['common-verdict'],min:{day:15}},70),
S('weave-two','all','第二卷合议 · 联保之外的人','联保试行后，已加入者货路顺畅，未加入的小商号却逐渐失去泊位。几家大号希望将临时办法永久化。你发现一条为减少风险而立的规矩，也能变成排除他人的工具。',[
C('保留公开准入与定期复核','联保不再成为传给自己人的永久牌照，后来者仍有可以走进去的阶梯。',{'flags.weave_ending':'open',renown:8,'factions.guild':4,'routes.official':4}),
C('分设公共底线与自愿商业服务','所有人都享有基本通行，额外担保与护航另行明码交易。',{'flags.weave_ending':'layered','routes.trade':5,'factions.canal':6}),
C('限制试行期限，先继续核算真实成本','你不愿用一份好看的结论替尚未明白的影响盖章。',{'flags.weave_ending':'review','routes.scholar':5,'stats.learning':2})],{seen:['weave-one'],min:{day:30}},95),
S('martial-five','martial,trade','武道续 · 合镖之约','几家镖局愿合走长途，争的却是谁有资格收新弟子、谁先赔付损失。你的旧护送经验被当成样板，也有人想借你的名把责任推给最小的镖队。',[
C('按申价与责任分层，赔付上限写清','几家镖局没有立刻亲如一家，却能在一份边界清楚的约上同时落名。',{'routes.martial':5,'factions.escort':6,'flags.joint_escort':true}),
C('先只共用消息，护送与赔付各自负责','合作从能验证的部分开始，没有让名义上的团结遮住实际的风险。',{'routes.martial':4,'stats.strategy':2,'flags.joint_escort':true}),
C('由双方轮流公开复盘失镖与救人','谁都不能只讲漂亮的成功，失败也开始成为共同学习的经验。',{'routes.scholar':3,'routes.martial':3,'flags.joint_escort':true})],{seen:['martial-four'],min:{'routes.martial':62}},81),
S('martial-six','martial,official','武道续终 · 镖旗如何传下去','老镖师要退下，弟子愿接旗，其家人却认为商号既是家产，镖头也该由亲子担任。亲子想学，却尚未能独立应付山路。你要为自己所倡导的护送线安排继任规则。',[
C('家产可传，护镖职务另经考校','一个孩子没有因出身被排除，也没有因出身跳过别人必须完成的基本功。',{'routes.martial':7,'flags.escort_succession':'exam','factions.escort':10,renown:5}),
C('以一季见习与共管作过渡','经验在真正的共同做事中传授，旗仍有人护，责任也不至于忽然悬空。',{'routes.martial':7,'flags.escort_succession':'mentor','stats.strategy':2}),
C('设护运议事，重大风险共同决断','继任不再只是一枚交到谁手里的印，也是一套旁人可以理解的程序。',{'routes.official':4,'routes.martial':4,'flags.escort_succession':'council'})],{seen:['martial-five'],min:{'routes.martial':82}},91),
S('trade-five','trade,medicine','行商续 · 十箱纱布的定价','北庭和药谷同时缺纱布，北庭出价更高，药谷却能提供稳定药材回程货。你可以一次追最高价，也可以把去程与回程算成一条能长期往来的路。',[
C('公开分货，签回程药材采购约','单程利润不再是唯一的算盘，第二趟路也开始有了真实的货与需求。',{'routes.trade':5,'factions.healers':6,silver:35,'flags.cloth_network':true}),
C('优先供边营，向药谷明确下一批期限','你接受高价，也接受一个必须按时兑现的后续承诺。',{'routes.trade':5,silver:65,'factions.army':5,'flags.cloth_network':true}),
C('请两地按最急需用途共同排单','有人不高兴，却不能再把自己的全部需求都写成唯一应当优先的急务。',{'routes.trade':4,'routes.official':2,renown:4,'flags.cloth_network':true})],{seen:['trade-four'],min:{'routes.trade':62}},82),
S('trade-six','trade,official','行商续终 · 保价账房','几次护航失利后，保价赔款快要吃掉联合账房的准备金。出资人要求拒收所有山路货，小商人却说他们本来只能走那些路。你不能让每次承诺都靠下一笔新钱补旧洞。',[
C('公开准备金，按风险明码分层承保','有的货需更多自担，有的路线提高佣金。承诺变少了，却更能真正兑现。',{'routes.trade':7,'flags.insurance_rule':'clear','factions.guild':8,'stats.business':2}),
C('缩小规模，与镖局共同做风险复盘','账房暂时不再招揽最耀眼的大单，先把自己究竟保得住什么弄清。',{'routes.trade':7,'flags.insurance_rule':'steady','factions.escort':8}),
C('退出独家承保，只做可核验的联保撮合','你放弃一部分权力与利润，也拒绝用漂亮名号掩盖无力承担的损失。',{'routes.trade':7,'flags.insurance_rule':'broker',renown:5,'routes.scholar':3})],{seen:['trade-five'],min:{'routes.trade':82}},92),
S('official-five','official,trade','官路续 · 地方产业册','州里要求登记民间产业，理由是统一税额。旧册把同一人异城的铺面重复列作不同富户，又把租房小贩漏在正式渠道之外。你得到一次重新订册的机会。',[
C('分清所有权、经营权与实际规模','一份产业册不再把招牌大就当成获利多，也不把租用摊位当成没有生计。',{'routes.official':5,'flags.estate_register':true,'stats.learning':2}),
C('先公开登记的用途与可申诉处','人们可以知道交出去的资料将被怎样使用，不必只凭一句官府要查便无从发问。',{'routes.official':5,renown:4,'flags.estate_register':true}),
C('联合商户与里正逐区核验','册中的人第一次有机会修正别人替自己写下的数字。',{'routes.trade':3,'routes.official':3,'flags.estate_register':true})],{seen:['official-four'],min:{'routes.official':62}},83),
S('official-six','official,scholar','官路续终 · 门荫不是旧印','一位故交想让子女接替自己的职务，说当年替地方做过许多事，理应给家里留一条路。其子确实聪明，却还没有办过一件独立的案。你自己也将面对同样的问题。',[
C('允许荐举与见习，不直接授旧职','前人的信用打开了第一扇门，后辈仍需凭自己的工作决定能走多远。',{'routes.official':7,'flags.office_legacy':'apprentice','factions.censor':8}),
C('设同等考校，公开来源与回避关系','经验可以传，评判不能只由同一家的长辈关起门作。',{'routes.official':7,'flags.office_legacy':'exam',renown:6}),
C('把家学整理成所有吏员可读的办事册','一家的经历变成更多后来人能学习的办法，未必少了传承，反而多了。',{'routes.scholar':4,'routes.official':4,'flags.office_legacy':'manual','inventory.manuscript':1})],{seen:['official-five'],min:{'routes.official':82}},93),
S('outlaw-five','outlaw,trade','绿林续 · 山下的一间铺','旧寨人在山下开的铺面被要求多付保人钱。乡人怕他们重操旧业，他们又觉得已经放下刀还要受同样怀疑，何必不再拿起来。你须先让今晚不要变成一场冲突。',[
C('逐户建立有限担保，反对无限连坐','信任要靠能核验的行为积累，疑虑也不该变成没有期限的收费理由。',{'routes.outlaw':5,'flags.outlaw_shop':true,'factions.guild':5}),
C('先做公开工钱的修路单','人们看见同一双手可以用来修桥，寨人也得到不用再拿刀证明自己的收入。',{'routes.trade':3,'routes.outlaw':3,'flags.outlaw_shop':true}),
C('让双方留下争议，邀中立见证调解','你没有让任一方独占过去的解释，也没有让今日必须立刻得到全部原谅。',{'routes.official':3,'routes.outlaw':3,'flags.outlaw_shop':true})],{seen:['outlaw-four'],min:{'routes.outlaw':62}},84),
S('outlaw-six','outlaw,official','绿林续终 · 谁来守新规','一位最早支持你的旧部又犯了私收钱的事，理由是自己当年替全寨担过风险。你若处理，旧人可能离心；若不处理，山下那间铺就再也证明不了什么。',[
C('按已定规则处理，记其旧功也追其新责','忠义不再是一张可以不断透支陌生人的旧借据。',{'routes.outlaw':7,'flags.outlaw_accountability':'rule',morality:4,'factions.guild':8}),
C('公开赔偿，撤去其收费职责','你保留他继续生活的出路，也明确他不再能拿着你的旗做这件事。',{'routes.outlaw':7,'flags.outlaw_accountability':'limit',renown:5}),
C('请寨民与山下商户共同复核处置','新的规矩开始允许被影响的人参与，而非只由拿刀的人解释。',{'routes.outlaw':5,'routes.official':3,'flags.outlaw_accountability':'council'})],{seen:['outlaw-five'],min:{'routes.outlaw':82}},94),
S('scholar-five','scholar,trade','学问续 · 家谱与商号谱','家族请你把几代商号写进族谱，想把不光彩的破产与侧室之子的功劳一并删掉。族老说谱是给后人争体面，你却知道后人也得靠它理解自己从哪里来。',[
C('区分可核事实与族中评价','同一件事可以有不同看法，事实本身不再随最后谁得势而消失。',{'routes.scholar':5,'flags.genealogy_method':true,'inventory.manuscript':1}),
C('保留姓名、具体贡献与争议来源','不再只剩嫡庶称谓决定一个人能在纸上留下多少行。',{'routes.scholar':5,morality:3,'flags.genealogy_method':true}),
C('制作公开简谱与封存史料两种版本','有些隐私不必公之于众，但原始资料也不应被借机毁掉。',{'routes.official':2,'routes.scholar':4,'flags.genealogy_method':true})],{seen:['scholar-four'],min:{'routes.scholar':62}},85),
S('scholar-six','scholar,official','学问续终 · 能被后来人改写的书','下一代接手书库，提出几项与你不同的编目办法。旧弟子想替你保住原样，年轻人说尊重前辈不是永远照抄。你必须决定自己的名字会成为一扇门，还是一把锁。',[
C('保留原稿，也允许具名修订','你的书不再只有一种被尊重的方式，后来人也能为自己的修改承担责任。',{'routes.scholar':7,'flags.scholar_inheritance':'revise',renown:6}),
C('订明版本与出处，开放不同编法并存','分歧没有被赶出书库，而是被放进能彼此查到的位置。',{'routes.scholar':7,'flags.scholar_inheritance':'editions','stats.learning':2}),
C('退居校读，交出实际主持权','你仍能提意见，但新一代不必先得到你的完全同意才开始工作。',{'routes.scholar':7,'flags.scholar_inheritance':'retire',morality:3})],{seen:['scholar-five'],min:{'routes.scholar':82}},96),
S('medicine-five','medicine,trade','医道续 · 一家的药账','几处药庐准备合并采购，主管人想优先雇自己的亲眷。他说家人可信，却不肯公开进价。廉价药的理想，第一次被自家人的利益拉到诊桌前。',[
C('进价公开，亲眷参与也须受核验','家人的关系没有被否认，却不再足以代替采购本领与责任。',{'routes.medicine':5,'flags.medicine_procurement':true,'factions.healers':6}),
C('分开采购、验货与付款权限','任何一个人的善意都不能独自守住所有关口，几双能互相追问的手更可靠。',{'routes.trade':3,'routes.medicine':3,'flags.medicine_procurement':true}),
C('先做有期限的小批试单','关系不等于立刻排除，也不等于从第一天就授予无限信任。',{'routes.medicine':5,'stats.strategy':1,'flags.medicine_procurement':true})],{seen:['medicine-four'],min:{'routes.medicine':62}},86),
S('medicine-six','medicine,scholar','医道续终 · 药箱的传人','温见素把旧药箱交给年轻学徒，家人却觉得其中方册属于家产，只该留给亲生子女。学徒能认药、会记录，却没有一句能与血缘相抗的名分。',[
C('家产按约分，行医资格按本领授','子女能学习，学徒也能被承认。药箱里的物与照顾人的责任分别找到合适去处。',{'routes.medicine':7,'flags.medicine_succession':'skill','factions.healers':10}),
C('将基础方册公开，进阶训练继续严谨考校','知识更容易获得，不等于医者可以跳过真正的学习与监督。',{'routes.scholar':4,'routes.medicine':4,'flags.medicine_succession':'open'}),
C('设共同带教，允许家人和门人一起成长','继承不再只在一个赢家与一个被赶走的人之间选择。',{'routes.medicine':7,'flags.medicine_succession':'shared',morality:3})],{seen:['medicine-five'],min:{'routes.medicine':82}},97)
];
const systemScenes=[
 ['road-bandits','trade,martial,outlaw','山口拦路','车队进入狭道，一面没有寨号的旗从树后伸出。对方先看货箱，再看你的护航标记。此刻不能把货物与风险一起藏进一句侥幸。',['交涉通行','设法止损','放弃部分货物撤退']],
 ['road-customs','trade,official','关口验货','关吏要求开箱核单，旁边的小吏则暗示只要把银子压在文牒下，事情可以快很多。合法的收据与省下的时间，此刻需要你选择。',['照明目缴费','私下打点','出示凭照或等待复核']],
 ['road-weather','trade,martial','山雨打车篷','风雨忽然压下，路面变滑。瓷箱与纸包最先经不起颠簸，前方借宿的棚屋又绕了一小段路。',['停靠避雨','冒雨赶路','加固篷架，护货前行']],
 ['estate-tax','trade,official','产业税单','地方送来新税单，其中有几项名目从未公示。管事说先缴钱可免停业，账房却担心从此每次都有人拿着新名目上门。',['先缴付并留票','核账据理周旋','暂时停业整理证据']],
 ['estate-rival','trade,outlaw','同行的借口','同行以你抢走客人为由要求补偿，又说有人能让你的货连续几日进不了门。店里伙计正等你决定是花钱求稳，还是把事情摆到明处。',['补偿息事','请人见证并守住产业','暂停争议货物']],
 ['estate-protection','trade,martial','门前的保护钱','几名来客称这条街归他们照看，铺子做大便该表示诚意。护院看向你，柜上也摆着这一季完整的进出账。',['付钱并记下凭据','依靠护院与关系周旋','停业两日避开冲突']],
 ['estate-audit','trade,official','翻账的差役','差役来查账，揪住一笔异城转运迟交的票据不放。真实问题需要补，借机索取却未必都该认。你要先保住什么。',['缴付争议费用','核验票据与责任','暂停营业补齐材料']],
 ['family-clan','all','亲族登门','婚后第一次有亲族登门，带来礼，也带来一桩想让你照顾的买卖。他们说既是一家人便不必分太清，家中有人期待，也有人担忧。',['当面说清帮助的界线','按公账做一笔小合作','谢礼婉拒请托']],
 ['family-property','all','家产的两种说法','亲族谈起家中产业的分担，话里逐渐分出谁带来多少、谁才有资格作主。原本帮衬的好意，正在变成一家人不敢直说的心事。',['召集家人明确账与责任','以公开小合作重建往来','暂缓争议，先顾生活']],
 ['family-school','all','给孩子请先生','亲族推荐的先生学问不差，却希望子女分房授课。家里第一次需要决定，宗族称谓能否先于孩子的本领决定他们能学什么。',['家人共同议定授课原则','另筹一笔公开学资','暂在家中共同识字']],
 ['family-gossip','all','巷里的议论','邻里对家中婚事与亲族关系议论起来，有人替你夸张好处，也有人编造从未发生的争执。家人想知道，你会如何回应。',['先听家人的真实想法','用公开往来澄清事实','不追闲话，照顾家常']]
];
for(const [id,routes,title,text,options]of systemScenes)events.push({id,kind:'followup',routes:routes.split(','),title,text,choices:options.map(label=>C(label,'具体结果由本次货值、行程、护航、产业防备或家中状况结算。')),systemScene:true});
if(typeof module!=='undefined'&&module.exports)module.exports=events;root.SHANHE_EXPANSION_EVENTS=events;
})(typeof window!=='undefined'?window:globalThis);
