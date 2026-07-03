import type { StoryStyle, StorySegment } from "./types";

/** 城市事实库 — mock 与 prompt 注入共用 */
export interface CityKnowledge {
  nickname: string;
  hook: string;
  localSecret: string;
  landmarks: string[];
  foods: { name: string; detail: string }[];
  myths: { title: string; detail: string }[];
  history: { title: string; detail: string }[];
  tech: { title: string; detail: string }[];
  future2040: string;
}

export const CITY_KNOWLEDGE: Record<string, CityKnowledge> = {
  杭州: {
    nickname: "人间天堂",
    hook: "老杭州人从不问「西湖好不好看」——他们问的是：你吃过知味观的猫耳朵没有？",
    localSecret:
      "河坊街后面的大马弄，早上六点有卖葱包桧的老王，没有招牌，本地人才知道。",
    landmarks: ["西湖", "灵隐寺", "雷峰塔", "龙井村", "河坊街"],
    foods: [
      { name: "西湖醋鱼", detail: "用草鱼、用醋、用火候——三分靠手艺，七分靠西湖的水气" },
      { name: "片儿川", detail: "雪菜、笋片、瘦肉丝，杭州人从小吃到大的「深夜安慰剂」" },
      { name: "龙井虾仁", detail: "明前龙井配河虾，一口下去是茶香，不是调料" },
    ],
    myths: [
      { title: "白蛇传", detail: "雷峰塔下压的不只是白娘子——西湖每一圈涟漪，传说都是一段未了的情" },
      { title: "梁祝化蝶", detail: "万松书院里，祝英台女扮男装读书三年，化蝶的终点就在西湖断桥" },
    ],
    history: [
      { title: "南宋定都", detail: "1127 年汴京陷落，赵构南渡，杭州从「东南形胜」变成「行在临安」，一住就是 150 年" },
      { title: "苏东坡治湖", detail: "他疏浚西湖、筑苏堤，还写了「欲把西湖比西子」——文人治理城市的范本" },
    ],
    tech: [
      { title: "阿里巴巴", detail: "1999 年湖畔花园 16 幢，18 个人起步，改变了十亿人的购物方式" },
      { title: "云栖小镇", detail: "曾经的废矿坑，现在是全球云计算的朝圣之地" },
    ],
    future2040:
      "2040 年的西湖上没有游船了——水面下是透明的磁悬浮观鱼通道，雷峰塔变成了全息历史博物馆，抬头能看见南宋临安城的 AR 复原。",
  },
  上海: {
    nickname: "魔都",
    hook: "外滩的万国建筑群每块砖都有编号——但上海人真正骄傲的是：弄堂里的生煎，比任何米其林都懂这座城市。",
    localSecret:
      "巨鹿路 758 号后面的弄堂，有一家没有名字的生煎店，只开早上 6 点到 9 点，排队的全是附近居民。",
    landmarks: ["外滩", "南京路", "武康路", "田子坊", "豫园"],
    foods: [
      { name: "生煎包", detail: "底脆、肉鲜、汤汁烫嘴——上海早餐的尊严，从大壶春到小杨生煎各领风骚" },
      { name: "本帮红烧肉", detail: "浓油赤酱，甜而不腻，是海派「精致讲究」在餐桌上的表达" },
      { name: "蟹粉小笼", detail: "秋天去南翔，一笼小笼十八个褶，每个褶里包着黄浦江的鲜" },
    ],
    myths: [
      { title: "外滩的龙脉", detail: "老上海人说黄浦江是条卧龙——外滩是龙头，陆家嘴是龙爪，东方明珠是龙珠" },
      { title: "法租界的幽灵", detail: "武康路 40 号的邬达克建筑，深夜有钢琴声，传说是 1930 年代某位失踪的钢琴家" },
    ],
    history: [
      { title: "开埠 1843", detail: "《南京条约》后上海开埠，从小渔村变成远东第一大港，只用了 50 年" },
      { title: "十里洋场", detail: "1920 年代，全球 1/3 的贸易经过上海，旗袍、爵士乐、电影——摩登中国的原点" },
    ],
    tech: [
      { title: "张江高科", detail: "中国芯片的「硅谷」，中芯国际、华虹半导体在这里与世界赛跑" },
      { title: "拼多多", detail: "从长宁区的一间办公室，用 5 年改变了下沉市场的消费逻辑" },
    ],
    future2040:
      "2040 年的陆家嘴，楼宇之间是空中步道网络，黄浦江底跑着超导磁悬浮，外滩的万国建筑每扇窗都是可交互的历史全息屏。",
  },
  成都: {
    nickname: "天府之国",
    hook: "成都人告诉你「慢生活」——但他们凌晨三点还在排队的，是那碗加了两个蛋的肥肠粉。",
    localSecret:
      "宽窄巷子旁边的奎星楼街，有家叫冒椒火辣的小馆，本地人说：游客去锦里，我们在这里。",
    landmarks: ["宽窄巷子", "锦里", "武侯祠", "大熊猫基地", "杜甫草堂"],
    foods: [
      { name: "火锅", detail: "牛油锅底、毛肚七上八下、鸭血烫到起泡——成都人的社交货币" },
      { name: "担担面", detail: "花椒的麻、红油的辣、芽菜的鲜，三位一体" },
      { name: "钟水饺", detail: "甜辣口，皮厚馅大，100 年前挑担叫卖的老味道" },
    ],
    myths: [
      { title: "三星堆", detail: "青铜面具、纵目神树——3000 年前的古蜀文明，比中原文明更神秘" },
      { title: "诸葛亮", detail: "武侯祠里供奉的不只是丞相，是中国人对「鞠躬尽瘁」的集体记忆" },
    ],
    history: [
      { title: "李冰治水", detail: "都江堰两千年无坝引水，让成都平原成为「水旱从人，不知饥馑」的天府" },
      { title: "茶馆文化", detail: "一张竹椅、一碗盖碗茶、一场龙门阵——成都人的公共客厅延续三百年" },
    ],
    tech: [
      { title: "新希望", detail: "从饲料厂到世界 500 强，刘永好兄弟代表了成都民企的韧性" },
      { title: "游戏产业", detail: "腾讯天美、育碧成都——中国游戏美术外包的一半产能在这里" },
    ],
    future2040:
      "2040 年的成都，大熊猫基地扩建成空中生态穹顶，锦江变成可游泳的透明水道，春熙路的裸眼 3D 屏里跑着赛博熊猫。",
  },
  西安: {
    nickname: "千年古都",
    hook: "兵马俑坑里的每一张脸都不一样——但西安人真正自豪的是：城墙根下那碗羊肉泡馍，掰馍要掰一小时。",
    localSecret:
      "洒金桥而不是回民街——本地人去老马家泡馍，自己掰馍，老板只收你掰得够不够细的尊重。",
    landmarks: ["兵马俑", "大雁塔", "古城墙", "钟鼓楼", "华清池"],
    foods: [
      { name: "羊肉泡馍", detail: "自己掰、自己泡——掰馍的过程就是融入西安的方式" },
      { name: "肉夹馍", detail: "白吉馍夹腊汁肉，西安人的「中国汉堡」，从秦朝一路吃到今天" },
      { name: "biangbiang 面", detail: "一根面条可以有一米长，58 画的一个字，面比字还宽" },
    ],
    myths: [
      { title: "骊山女娲", detail: "华清池温泉传说来自女娲补天遗落的五彩石——温泉滑腻洗凝脂" },
      { title: "钟楼的龙", detail: "西安钟楼地下压着一条恶龙，四条街就是它的四条腿" },
    ],
    history: [
      { title: "十三朝古都", detail: "周秦汉唐，中国史上最辉煌的 1000 年，中心都在这一带" },
      { title: "丝绸之路起点", detail: "张骞从这儿出发，驼铃一响，欧亚大陆连在一起" },
    ],
    tech: [
      { title: "硬科技之都", detail: "西飞、西电、光机所——西安是中国军工与航天的心脏" },
      { title: "三星半导体", detail: "西安厂区是三星海外最大的 NAND 闪存生产基地" },
    ],
    future2040:
      "2040 年的西安，明城墙变成环形空中花园，兵马俑坑上方是 AR 复原的秦帝国全景，大雁塔每夜投射唐代长安的全息街景。",
  },
  北京: {
    nickname: "帝都",
    hook: "故宫有 9999 间半屋子——但北京人告诉你：真正懂这座城，从胡同口那碗炸酱面开始。",
    localSecret:
      "北新桥三条胡同里的方砖厂 69 号，炸酱面不加菜码，老北京人点头说：这才对。",
    landmarks: ["故宫", "天安门", "颐和园", "长城", "南锣鼓巷"],
    foods: [
      { name: "北京烤鸭", detail: "全聚德、便宜坊、大董——皮脆肉嫩，卷饼配甜面酱，是北京的名片" },
      { name: "炸酱面", detail: "六必居的黄酱、手擀的面、八样菜码——胡同里的日常史诗" },
      { name: "豆汁儿", detail: "外地人闻了想跑、本地人离了想——这是北京味的忠诚度测试" },
    ],
    myths: [
      { title: "故宫的龙", detail: "太和殿屋脊上十只脊兽，第十只是行什——雷神的化身，只此一处" },
      { title: "什刹海的钟", detail: "传说后海底下镇着一口古钟，每夜三更会响，是元大都的遗响" },
    ],
    history: [
      { title: "元明清三代国都", detail: "800 年建都史，中轴线 7.8 公里，是世界最长的城市轴线" },
      { title: "1949 开国", detail: "天安门城楼上一声宣告，古老帝都变成了现代中国的首都" },
    ],
    tech: [
      { title: "中关村", detail: "1980 年代「电子一条街」，现在是中国的硅谷，字节、百度、小米都在这里" },
      { title: "航天城", detail: "酒泉发射的每一枚火箭，核心部件不少出自北京航天院所" },
    ],
    future2040:
      "2040 年的北京，中轴线是无人驾驶文化走廊，故宫每道门后是可步入的 VR 历史，通州副中心与老城用 15 分钟地下快线相连。",
  },
  重庆: {
    nickname: "山城",
    hook: "重庆没有平面——你以为是 1 楼，走出去可能是 8 楼。导航在这里会沉默三秒。",
    localSecret:
      "洪崖洞旁边的戴家巷崖壁步道，本地人才走这里看江景——游客都在洪崖洞挤电梯。",
    landmarks: ["洪崖洞", "解放碑", "磁器口", "长江索道", "李子坝轻轨站"],
    foods: [
      { name: "重庆小面", detail: "麻辣、胡辣、豌杂——重庆人一天可以三顿面，每顿不同店" },
      { name: "火锅", detail: "九宫格、牛油、毛肚——比成都更野、更麻、更江湖" },
      { name: "酸辣粉", detail: "红薯粉配炸豌豆，解放碑排队的那个味道，是重庆人的乡愁" },
    ],
    myths: [
      { title: "巴蔓子", detail: "战国巴国将军，头可断城不可降——重庆「刚烈」性格的源头" },
      { title: "白帝城", detail: "刘备托孤的白帝城，「朝辞白帝彩云间」写的就是这里" },
    ],
    history: [
      { title: "陪都时期", detail: "抗战八年，重庆是战时首都，轰炸下坚持到了胜利" },
      { title: "三线建设", detail: "1960 年代工业内迁，重庆从消费城市变成重工业基地" },
    ],
    tech: [
      { title: "长安汽车", detail: "中国四大汽车集团之一，新能源转型中的老牌军工背景" },
      { title: "赛力斯", detail: "与华为合作的问界，让重庆成为智能电动车的新高地" },
    ],
    future2040:
      "2040 年的重庆，轻轨在楼宇间织成 3D 交通网，嘉陵江上有悬浮观景台，洪崖洞变成垂直的赛博吊脚楼群。",
  },
  深圳: {
    nickname: "鹏城",
    hook: "1980 年这里还是一个小渔村——现在你脚下每平方公里创造的 GDP，超过世界上大多数国家。",
    localSecret:
      "蛇口海上世界后面的 Old Heaven Bookstore，深圳最早的文化地标之一，本地文艺青年的秘密基地。",
    landmarks: ["平安金融中心", "世界之窗", "大梅沙", "华侨城", "蛇口"],
    foods: [
      { name: "潮汕牛肉火锅", detail: "深圳是潮汕人的第二故乡——八合里海记，鲜切牛肉三秒即食" },
      { name: "肠粉", detail: "深圳早餐的王者，石磨米浆、抽屉蒸、淋酱油——广府与客家融合" },
      { name: "椰子鸡", detail: "深圳发明的新派火锅——文昌鸡配椰子水，是移民城市创新的味觉" },
    ],
    myths: [
      { title: "大鹏所城", detail: "600 年抗倭古城，深圳不是「文化沙漠」——它有自己的根" },
      { title: "梧桐山", detail: "深圳最高峰，传说山中有灵蛇，守护这座年轻城市的野心" },
    ],
    history: [
      { title: "特区 1980", detail: "袁庚在蛇口炸响第一炮，「时间就是金钱」变成时代口号" },
      { title: "移民之城", detail: "1400 万人口，80% 是外来者——全中国野心家的试验场" },
    ],
    tech: [
      { title: "华为", detail: "龙岗坂田，从交换机到 5G 到鸿蒙——中国硬科技的旗帜" },
      { title: "大疆", detail: "南山区的无人机帝国，全球消费级无人机 70% 市场份额" },
    ],
    future2040:
      "2040 年的深圳，前海是亚洲最大的离岸 AI 算力中心，深圳湾大桥下跑着水下胶囊快递，每个社区有 15 分钟无人配送圈。",
  },
  南京: {
    nickname: "六朝古都",
    hook: "南京的城墙绕了三十多公里，但真正读懂这座城，要从一碗鸭血粉丝汤和一段明城墙砖文开始。",
    localSecret:
      "沿明城墙走到台城段，可以同时看见城墙、玄武湖与紫金山，这是理解南京山水城林格局最直接的一段路。",
    landmarks: ["明城墙", "中山陵", "玄武湖", "夫子庙", "紫金山"],
    foods: [
      { name: "鸭血粉丝汤", detail: "鸭血、鸭肠、鸭肝与粉丝同煮，是南京街巷最日常的一碗热汤" },
      { name: "盐水鸭", detail: "皮白肉嫩、咸鲜清香，桂花时节制作的盐水鸭尤其有名" },
      { name: "赤豆元宵", detail: "红豆汤里煮小元宵，甜而温润，是南京传统小吃的另一面" },
    ],
    myths: [
      { title: "金陵王气", detail: "钟山龙蟠、石头虎踞的说法，让南京的山川格局与帝王之都紧密相连" },
      { title: "莫愁女", detail: "莫愁湖因莫愁女传说得名，故事在不同朝代留下多个版本" },
    ],
    history: [
      { title: "六朝建都", detail: "东吴、东晋与南朝宋齐梁陈先后在此建都，奠定金陵文脉" },
      { title: "明代筑城", detail: "明初营建南京城，城砖上的府县和工匠题记至今仍可辨认" },
    ],
    tech: [
      { title: "软件谷", detail: "中国（南京）软件谷集聚通信软件与信息服务产业" },
      { title: "高校科研", detail: "南京大学、东南大学等高校构成重要科研与人才基础" },
    ],
    future2040:
      "2040 年的南京，明城墙数字孪生贯通全线，游客能在同一位置叠看六朝、明代与现代城市景观。",
  },
  广州: {
    nickname: "羊城",
    hook: "广州人把早茶吃成一套时间制度：一盅两件背后，是两千多年港口城市练出的从容与开放。",
    localSecret:
      "从永庆坊沿恩宁路步行到粤剧艺术博物馆，可以在骑楼、西关大屋与粤剧水台之间看见老广州的生活尺度。",
    landmarks: ["广州塔", "陈家祠", "沙面", "越秀山", "永庆坊"],
    foods: [
      { name: "早茶", detail: "虾饺、烧卖、叉烧包配一壶茶，既是早餐也是广州人的社交方式" },
      { name: "肠粉", detail: "米浆现蒸成薄皮，包入肉、蛋或鲜虾，再淋豉油" },
      { name: "云吞面", detail: "竹升面爽脆，云吞讲究鲜虾与猪肉比例，汤底清而有鲜味" },
    ],
    myths: [
      { title: "五羊衔谷", detail: "五位仙人骑羊送来稻穗的传说，留下羊城与穗城之名" },
      { title: "南海神庙", detail: "海上丝绸之路相关祭海传统，让广州的港口记忆带有神话色彩" },
    ],
    history: [
      { title: "海上丝路", detail: "广州长期是中国对外贸易的重要港口，十三行见证清代中西贸易" },
      { title: "近代城市", detail: "沙面建筑群与西关骑楼记录了广州近代商贸和城市生活的变化" },
    ],
    tech: [
      { title: "琶洲", detail: "琶洲人工智能与数字经济试验区集聚互联网与会展产业" },
      { title: "汽车产业", detail: "广州拥有完整汽车制造链，并持续推进新能源与智能网联转型" },
    ],
    future2040:
      "2040 年的广州，珠江两岸形成水陆空一体的公共交通网，骑楼街区通过数字遮阳与微气候系统延续岭南生活。",
  },
  武汉: {
    nickname: "江城",
    hook: "武汉不是一座被江分开的城市，而是三镇被长江和汉江重新缝合的城市。",
    localSecret:
      "从汉口江滩走进黎黄陂路，再转到鄱阳街，可以在很短的步行里看见租界建筑、里分住宅与现代江滩。",
    landmarks: ["黄鹤楼", "长江大桥", "东湖", "江汉关", "武汉大学"],
    foods: [
      { name: "热干面", detail: "碱水面掸熟后拌芝麻酱、萝卜丁与葱花，是武汉过早的代表" },
      { name: "豆皮", detail: "糯米、肉丁和香菇包在蛋皮与豆皮之间，煎出金黄脆面" },
      { name: "排骨藕汤", detail: "粉藕与排骨慢煨，是湖北家庭餐桌上温厚的一锅汤" },
    ],
    myths: [
      { title: "黄鹤传说", detail: "仙人乘黄鹤而去的故事，让黄鹤楼成为江城最持久的文化意象" },
      { title: "伯牙子期", detail: "高山流水遇知音的故事与汉阳古琴台相连" },
    ],
    history: [
      { title: "三镇合一", detail: "武昌、汉口、汉阳各有城市传统，近现代交通与工业把三镇联为武汉" },
      { title: "首义之城", detail: "1911 年武昌起义成为辛亥革命的重要开端" },
    ],
    tech: [
      { title: "中国光谷", detail: "东湖高新区形成光电子信息产业集群，光纤光缆与激光产业基础突出" },
      { title: "高校之城", detail: "武汉高校和科研院所密集，为工程、医学与基础研究提供人才支撑" },
    ],
    future2040:
      "2040 年的武汉，长江与东湖生态廊道连接成城市蓝绿网络，光谷的智能交通系统实时协调三镇通勤。",
  },
};

/** 根据城市知识库 + 风格，组装差异化故事 */
export function buildStoryFromKnowledge(
  city: string,
  style: StoryStyle
): Omit<import("./types").CityStory, "city" | "style"> {
  const k = CITY_KNOWLEDGE[city];

  if (!k) {
    return buildGenericStory(city, style);
  }

  switch (style) {
    case "food":
      return {
        title: `${city}：用${k.foods[0].name}读懂一座城`,
        hook: k.hook,
        estimatedMinutes: 5,
        segments: [
          {
            id: "1",
            title: k.foods[0].name,
            content: `${city}的味道，从${k.foods[0].name}开始。${k.foods[0].detail}。${k.localSecret}。`,
            mood: "馋人",
          },
          {
            id: "2",
            title: k.foods[1].name,
            content: `第二站：${k.foods[1].name}。${k.foods[1].detail}。在${city}，吃从来不只是填饱肚子——${k.nickname}的标签，是本地人用几十年吃出来的。`,
            mood: "烟火",
          },
          {
            id: "3",
            title: k.foods[2]?.name ?? "市井小馆",
            content: k.foods[2]
              ? `${k.foods[2].name}：${k.foods[2].detail}。`
              : `每个${city}人心里都有一家小馆，没有名字，没有点评，只有味道。` +
                `如果你问${city}人推荐吃什么，他们大概率不会带你去网红店——${k.localSecret}`,
            mood: "怀旧",
          },
          {
            id: "4",
            title: "带走什么",
            content: `离开${city}，带不走${k.landmarks[0]}的全部，但可以带走一种味道。下次有人问「${city}吃什么」，别说「都挺好」——说${k.foods[0].name}，说${k.localSecret}，这就够了。`,
            mood: "余韵",
          },
        ],
      };

    case "mythology":
      return {
        title: `${city}：${k.myths[0].title}之外的灵`,
        hook: `${k.landmarks[0]}不只是景点——${k.myths[0].detail}。`,
        estimatedMinutes: 5,
        segments: [
          {
            id: "1",
            title: k.myths[0].title,
            content: `${k.myths[0].detail}。在${city}，${k.landmarks.slice(0, 2).join("和")}不只是地标，是活着的传说。`,
            mood: "神秘",
          },
          {
            id: "2",
            title: k.myths[1].title,
            content: k.myths[1].detail,
            mood: "史诗",
          },
          {
            id: "3",
            title: "山水的灵性",
            content: `${city}被称为「${k.nickname}」，不是旅游宣传——是千年传说堆出来的。${k.landmarks[2]}的每一块石头，当地人都愿意讲一个故事。`,
            mood: "空灵",
          },
          {
            id: "4",
            title: "今夜的故事",
            content: `今晚你经过${k.landmarks[0]}，不妨抬头多停三秒。${city}的神话不在书里，在风里、在水里、在本地人不经意的一句话里。`,
            mood: "余韵",
          },
        ],
      };

    case "history":
      return {
        title: `${city}：${k.history[0].title}改变了一切`,
        hook: `${k.history[0].detail}——这是${city}成为「${k.nickname}」的起点。`,
        estimatedMinutes: 6,
        segments: [
          {
            id: "1",
            title: k.history[0].title,
            content: k.history[0].detail,
            mood: "厚重",
          },
          {
            id: "2",
            title: k.history[1].title,
            content: k.history[1].detail,
            mood: "人物",
          },
          {
            id: "3",
            title: "时间的层叠",
            content: `站在${k.landmarks[0]}，你同时站在${k.history[0].title}和${k.history[1].title}的交汇点。${city}像一本翻开了就合不上的书——${k.landmarks.join("、")}，每一页都是不同年代的故事。`,
            mood: "时间",
          },
          {
            id: "4",
            title: "带走什么",
            content: `离开${city}，你带走的不是一个「打卡清单」，是一个历史坐标。${k.history[0].title}——这六个字，比任何攻略都懂${city}。`,
            mood: "余韵",
          },
        ],
      };

    case "tech":
      return {
        title: `${city}：${k.tech[0].title}与${k.nickname}的野心`,
        hook: `${k.tech[0].detail}——${city}不只有${k.landmarks[0]}，还有代码和芯片。`,
        estimatedMinutes: 5,
        segments: [
          {
            id: "1",
            title: k.tech[0].title,
            content: k.tech[0].detail,
            mood: "创新",
          },
          {
            id: "2",
            title: k.tech[1].title,
            content: k.tech[1].detail,
            mood: "野心",
          },
          {
            id: "3",
            title: "传统与迭代",
            content: `${city}最迷人的张力：一边是${k.landmarks[0]}的${k.history[0].title}，一边是${k.tech[0].title}的代码。${k.nickname}不是过去式，是正在发生的未来。`,
            mood: "年轻",
          },
          {
            id: "4",
            title: "2040 预览",
            content: k.future2040,
            mood: "震撼",
          },
        ],
      };

    case "future":
      return {
        title: `${city} 2040：${k.landmarks[0]}的赛博版本`,
        hook: `如果此刻抬头，你看到的${k.landmarks[0]}，在 2040 年会变成什么样？`,
        estimatedMinutes: 5,
        segments: [
          {
            id: "1",
            title: "2040 年的街角",
            content: k.future2040,
            mood: "赛博",
          },
          {
            id: "2",
            title: `${k.landmarks[1]}的重构`,
            content: `2040 年的${k.landmarks[1]}，外壳保留，内核重写。游客戴上轻量 AR 眼镜，看到的是${k.history[0].title}的全息复原——历史和未来叠在同一条时间线上。`,
            mood: "想象",
          },
          {
            id: "3",
            title: "消失与重生",
            content: `${k.foods[0].name}还在，但做法变了——AI 厨师复刻${k.localSecret}里的老味道，同时${k.tech[0].title}的总部就在${k.landmarks[2]}旁边。${city}的2040，是${k.nickname}的赛博进化。`,
            mood: "震撼",
          },
          {
            id: "4",
            title: "此刻的选择",
            content: `你现在站在 2026 年的${city}——${k.future2040.split("。")[0]}。这不是幻想，是这座城市正在走的方向。`,
            mood: "余韵",
          },
        ],
      };

    default: // all
      return {
        title: `${city}：${k.nickname}的另一面`,
        hook: k.hook,
        estimatedMinutes: 6,
        segments: [
          {
            id: "1",
            title: `到达${k.landmarks[0]}`,
            content: `你刚刚进入${city}。在打开任何 App 之前——${k.localSecret}。${k.landmarks[0]}就在不远处，但${city}真正值得听的，是${k.foods[0].name}和${k.myths[0].title}背后的故事。`,
            mood: "好奇",
          },
          {
            id: "2",
            title: k.foods[0].name,
            content: `${k.foods[0].detail}。${k.foods[1].name}也是：${k.foods[1].detail}。在${city}，吃是认识这座城最快的方式。`,
            mood: "烟火",
          },
          {
            id: "3",
            title: k.myths[0].title,
            content: `${k.myths[0].detail}。${k.history[0].title}：${k.history[0].detail}。${city}的厚重，不在博物馆里，在你脚下的每一块砖。`,
            mood: "厚重",
          },
          {
            id: "4",
            title: k.tech[0].title,
            content: `${k.tech[0].detail}。${city}不只有${k.nickname}的过去——${k.tech[1].title}，${k.tech[1].detail}。传统与野心，在这座城市并行。`,
            mood: "惊喜",
          },
          {
            id: "5",
            title: "带走什么",
            content: `离开${city}，带走三样东西：${k.foods[0].name}的味道、${k.landmarks[0]}的一个细节、${k.localSecret}的地址。下次有人问「${city}怎么样」，你有故事可讲。`,
            mood: "余韵",
          },
        ],
      };
  }
}

function buildGenericStory(
  city: string,
  style: StoryStyle
): Omit<import("./types").CityStory, "city" | "style"> {
  const styleSegments: Record<StoryStyle, StorySegment[]> = {
    all: [
      {
        id: "1",
        title: "先别打开 App",
        content: `你刚刚到达${city}。在搜索「${city}攻略」之前，先告诉我：你想听美食、历史、还是传说？每个城市都有自己的脾气，${city}也不例外——关键是找到它独一无二的那一面。`,
        mood: "好奇",
      },
    ],
    food: [
      {
        id: "1",
        title: "味觉地图",
        content: `${city}的味道，不在点评榜首，而在本地人带你去的那条街。问一个${city}人：「你从小吃到大的那家店叫什么？」——那个答案，比任何攻略都真实。`,
        mood: "烟火",
      },
    ],
    mythology: [
      {
        id: "1",
        title: "地名的秘密",
        content: `${city}这个名字本身，可能就藏着一个传说。查一查它的来历——往往比景点介绍更有意思。`,
        mood: "神秘",
      },
    ],
    history: [
      {
        id: "1",
        title: "时间的起点",
        content: `${city}在历史上至少有一个高光时刻——一次建城、一场战争、一个决定。找到那个节点，你就找到了理解${city}的钥匙。`,
        mood: "厚重",
      },
    ],
    tech: [
      {
        id: "1",
        title: "看不见的引擎",
        content: `${city}可能有一所你没听过的大学、一家低调的工厂、或一个新兴的产业园——它们才是${city}今天的真实脉搏。`,
        mood: "创新",
      },
    ],
    future: [
      {
        id: "1",
        title: "2040 想象",
        content: `想象 2040 年你再次站在${city}的同一个坐标——什么变了？什么还在？最好的城市叙事，是对未来的具体想象，不是空泛的「更智能」。`,
        mood: "赛博",
      },
    ],
  };

  return {
    title: `${city}：等你来讲的故事`,
    hook: `关于${city}，我知道通用模板不够用——配置 API Key 后，AI 会为你生成包含具体地名、店名、典故的专属叙事。`,
    estimatedMinutes: 3,
    segments: styleSegments[style],
  };
}

/** 注入 prompt 的城市事实摘要，帮助 LLM 生成更具体的内容 */
export function getCityFactsForPrompt(city: string): string | null {
  const k = CITY_KNOWLEDGE[city];
  if (!k) return null;

  return [
    `城市别称：${k.nickname}`,
    `地标：${k.landmarks.join("、")}`,
    `必提美食：${k.foods.map((f) => f.name).join("、")}`,
    `神话/传说：${k.myths.map((m) => m.title).join("、")}`,
    `历史节点：${k.history.map((h) => h.title).join("、")}`,
    `科技标签：${k.tech.map((t) => t.title).join("、")}`,
    `本地人秘密：${k.localSecret}`,
  ].join("\n");
}
