/*
 * jobs.js — 岗位数据库
 * 适配：filter.js / match.js / main.js（挂载到 window.APP_DATA）
 *
 * 字段说明（每条岗位 9 个字段，全部保留）：
 *   id            岗位序号
 *   category      所属板块（6 大板块之一）
 *   name          岗位名称
 *   education     最低学历门槛
 *   majors        适配意向专业（大类 + 下属细分专业）
 *                 — list 为空数组 [] 表示「该大类全部专业」；「不限专业」表示全部专业可报
 *   mbti          适配 MBTI（数组）
 *   certificates  适配证书
 *   work          岗位日常工作
 *   workTime      上班时间
 *   salary        薪资参考（二线城市税前）
 *   restrictions  身体 / 环境限制
 */
window.APP_DATA = window.APP_DATA || {};

/* 专业大类 → 下属细分专业（供匹配逻辑扩展用） */
window.APP_DATA.MAJOR_GROUPS = {
  "计算机大类": ["计算机科学与技术", "软件工程", "数据科学与大数据技术", "网络工程", "信息安全", "人工智能", "电子信息工程", "物联网工程", "数字媒体技术"],
  "财会大类": ["会计学", "财务管理", "财政学", "审计学", "税收学"],
  "文法大类": ["汉语言文学", "文秘", "法学", "新闻学", "广告学", "档案学", "图书馆学"],
  "管理大类": ["行政管理", "公共管理", "人力资源管理", "工商管理", "社会工作", "市场营销", "物流管理"],
  "理工环境类": ["统计学", "应用统计学", "环境工程", "城乡规划", "地理信息科学", "土木工程"],
  "统计学类": ["统计学", "应用统计学"],
  "不限专业": [] // 全部专业均可报考
};

/* 6 大板块 */
window.APP_DATA.JOB_CATEGORIES = [
  "机关/事业单位/编外",
  "国企央企岗",
  "企业职能文职",
  "市场新媒体品牌",
  "技术/数据研发助理",
  "生产供应链/服务客服",
  "文职辅助岗",
  "教育教培",
  "医疗美容",
  "公关市场营销",
  "贸易销售",
  "财务",
  "行政人事",
  "文职",
  "客户服务",
  "工厂制造",
  "计算机软硬件",
  "信息技术管理",
  "互联网应用",
  "电子通讯",
  "机械",
  "房地产物业",
  "建筑规划",
  "证券金融投资",
  "律师法务",
  "酒店餐饮",
  "百货零售",
  "物流仓储运输",
  "印刷包装",
  "电子电器电力",
  "化工生物",
  "医院医疗",
  "新闻出版传媒",
  "采购",
  "质量品管",
  "手机通信",
  "公众服务",
  "银行保险",
  "技工",
  "文教",
  "汽车",
  "设计",
  "咨询顾问",
  "其他"
];

window.APP_DATA.JOBS = [
  /* ============ 一、机关 / 事业单位 / 编外（1–45） ============ */
  {
    id: 1, category: "机关/事业单位/编外", name: "机关综合行政岗（事业单位）", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理", "公共管理", "工商管理"] }, { group: "文法大类", list: ["汉语言文学", "文秘"] }],
    mbti: ["ISTJ", "ISFJ", "ESTJ"], certificates: "计算机一级，秘书职业证书优先",
    work: "负责机关公文收发、文件归档、会议筹备、通知传达、来访接待，撰写工作总结、简报，完成上级交办的各类事务性工作，台账维护",
    workTime: "朝九晚五双休，极少加班", salary: "4.5k-7k / 月", restrictions: "久坐办公，无外勤出差，无重体力，无需熬夜"
  },
  {
    id: 2, category: "机关/事业单位/编外", name: "政务数据统计岗（事业单位）", education: "本科及以上",
    majors: [{ group: "统计学类", list: ["统计学", "应用统计学"] }, { group: "计算机大类", list: ["数据科学与大数据技术", "计算机科学与技术"] }, { group: "管理大类", list: ["公共管理"] }],
    mbti: ["ISTJ", "INTJ", "INTP"], certificates: "统计从业证书、计算机二级优先",
    work: "收集辖区行业上报数据，数据清洗校验，制作统计报表，撰写数据分析简报，维护政务数据台账，配合上级开展数据核查",
    workTime: "朝九晚五双休，季度节点少量加班", salary: "5.5k-8.5k / 月", restrictions: "久坐办公，少量下乡调研，无重体力，不需要高强度加班"
  },
  {
    id: 3, category: "机关/事业单位/编外", name: "市场监管行政执法辅助岗", education: "大专",
    majors: [{ group: "文法大类", list: ["法学"] }, { group: "管理大类", list: ["行政管理"] }, { group: "理工环境类", list: ["食品质量与安全"] }],
    mbti: ["ESTJ", "ISTJ", "ESFJ"], certificates: "行政执法辅助证优先",
    work: "协助正式执法人员开展市场巡查，整理案件资料、录入监管系统，接待群众咨询，整理台账，协助开展宣传活动",
    workTime: "朝九晚五双休，专项检查时段偶尔加班", salary: "4.8k-7.2k / 月", restrictions: "需要短途外勤走访，可短时间走动，无重体力，无夜班"
  },
  {
    id: 4, category: "机关/事业单位/编外", name: "图书馆文献管理员（事业单位）", education: "大专",
    majors: [{ group: "文法大类", list: ["图书馆学", "档案学", "汉语言文学"] }],
    mbti: ["ISFJ", "ISTJ", "INFJ"], certificates: "图书资料专业技术证书优先",
    work: "图书分类编目、文献借阅登记、书籍整理上架、读者咨询接待，馆藏档案维护，阅览室日常管理",
    workTime: "朝九晚五双休，节假日轮值", salary: "4k-6.5k / 月", restrictions: "轻度整理书籍，不需要搬重物，室内安静环境，无夜班"
  },
  {
    id: 5, category: "机关/事业单位/编外", name: "街道便民服务中心窗口岗", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理", "社会工作", "公共事务管理"] }, { group: "不限专业", list: [] }],
    mbti: ["ESFJ", "ISFJ", "ENFJ"], certificates: "无硬性证书，政务服务礼仪培训证书优先",
    work: "接待办事群众，受理社保、民政相关业务材料收取、信息录入，业务咨询解答，材料归档，引导群众办理业务",
    workTime: "朝九晚五双休，月末业务高峰少量加班", salary: "4.3k-6.8k / 月", restrictions: "长时间坐窗口，需要面对面沟通，无外勤出差，无重体力"
  },
  {
    id: 6, category: "机关/事业单位/编外", name: "档案管理专员（档案局编外）", education: "大专",
    majors: [{ group: "文法大类", list: ["档案学", "汉语言文学"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "档案管理员证书优先",
    work: "档案接收、分类、数字化扫描录入、卷宗装订、库房管理，查阅登记，档案保密管理，编制档案目录",
    workTime: "朝九晚五双休，极少加班", salary: "4.4k-6.9k / 月", restrictions: "室内久坐，少量整理纸质档案，无外勤，无熬夜"
  },
  {
    id: 7, category: "机关/事业单位/编外", name: "文旅馆讲解员（文化馆事业单位）", education: "大专",
    majors: [{ group: "管理大类", list: ["旅游管理", "文化产业管理"] }, { group: "文法大类", list: ["汉语言文学"] }],
    mbti: ["ESFJ", "ENFJ", "ENFP"], certificates: "讲解员资格证优先",
    work: "展馆参观接待、现场讲解、维护展厅秩序，撰写讲解词，组织小型文化活动，展厅设备巡检",
    workTime: "轮班制，周末轮值，工作日调休", salary: "4.6k-7.3k / 月", restrictions: "需要长时间站立讲解，正常听力视力，无粉尘"
  },
  {
    id: 8, category: "机关/事业单位/编外", name: "财政所财务辅助岗（乡镇事业单位）", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学", "财务管理", "财政学"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "初级会计证优先",
    work: "乡镇单位票据整理、凭证录入、账务辅助核对，资金台账登记，资料归档，协助年度预决算整理",
    workTime: "朝九晚五双休，年末决算短期加班", salary: "4.7k-7.4k / 月", restrictions: "久坐办公，偶尔下乡送材料，无重体力，不能熬夜"
  },
  {
    id: 9, category: "机关/事业单位/编外", name: "生态环境监测内勤岗", education: "大专",
    majors: [{ group: "理工环境类", list: ["环境工程", "环境科学"] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ", "INTP"], certificates: "环境监测证书优先",
    work: "监测数据录入、报告整理、样品信息登记，档案管理，对接采样人员，填报环保系统报表",
    workTime: "朝九晚五双休，应急任务偶尔加班", salary: "5k-7.8k / 月", restrictions: "室内办公，偶尔去采样点，少量接触试剂，化学品过敏不适合"
  },
  {
    id: 10, category: "机关/事业单位/编外", name: "退役军人服务站专员", education: "大专",
    majors: [{ group: "管理大类", list: ["社会工作", "行政管理"] }, { group: "不限专业", list: [] }],
    mbti: ["ISFJ", "ESFJ", "INFJ"], certificates: "社会工作者证书优先",
    work: "接待退役军人来访咨询，材料收集审核，信息系统录入，走访慰问台账，政策宣传，活动组织",
    workTime: "朝九晚五双休，节日期间少量值守", salary: "4.2k-6.7k / 月", restrictions: "偶尔社区走访外勤，正常沟通能力，无重体力"
  },
  {
    id: 11, category: "机关/事业单位/编外", name: "团委青少年活动干事（事业单位）", education: "本科及以上",
    majors: [{ group: "管理大类", list: ["社会工作", "公共管理"] }, { group: "文法大类", list: ["汉语言文学"] }],
    mbti: ["ENFJ", "ESFJ", "ENFP"], certificates: "无硬性证书",
    work: "策划青少年主题活动、撰写活动方案与新闻稿，对接学校与社区，活动组织执行，资料归档，宣传推文撰写",
    workTime: "朝九晚五双休，活动期周末加班", salary: "5.2k-8.2k / 月", restrictions: "偶尔外出活动组织，体力消耗小，无夜班"
  },
  {
    id: 12, category: "机关/事业单位/编外", name: "不动产登记中心辅助岗", education: "大专",
    majors: [{ group: "文法大类", list: ["法学"] }, { group: "理工环境类", list: ["土地资源管理"] }, { group: "不限专业", list: [] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "不动产登记相关培训证书优先",
    work: "不动产业务资料收取、扫描录入、材料初审，档案整理归档，窗口咨询引导",
    workTime: "朝九晚五双休，业务高峰偶尔延时", salary: "4.5k-7k / 月", restrictions: "窗口久坐，需要和群众沟通，无外勤出差"
  },
  {
    id: 13, category: "机关/事业单位/编外", name: "审计局内勤助理岗", education: "本科及以上",
    majors: [{ group: "财会大类", list: ["审计学", "会计学", "财务管理"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "初级会计证优先",
    work: "审计资料收集整理、凭证复印扫描，底稿录入，审计报告排版校对，台账维护",
    workTime: "朝九晚五双休，审计项目期阶段性加班", salary: "5.4k-8.6k / 月", restrictions: "室内办公，少量跟随审计小组外勤走访，无重体力"
  },
  {
    id: 14, category: "机关/事业单位/编外", name: "融媒体中心采编助理（事业单位）", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["新闻学", "广播电视学", "汉语言文学"] }],
    mbti: ["ENFP", "INFP", "ENFJ"], certificates: "记者证、普通话一级乙等优先",
    work: "新闻素材整理，稿件初写校对，短视频素材剪辑，图片后期，公众号内容编辑，活动素材采集",
    workTime: "轮班，突发新闻需要加班", salary: "5.8k-9k / 月", restrictions: "偶尔外出采访，需要适应临时加班，无重体力"
  },
  {
    id: 15, category: "机关/事业单位/编外", name: "疾控中心资料内勤岗", education: "大专",
    majors: [{ group: "医学类", list: ["预防医学", "公共卫生", "护理学"] }, { group: "不限专业", list: [] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "公共卫生相关证书优先",
    work: "流行病学资料录入，报表汇总，档案整理，电话回访登记，文件收发管理",
    workTime: "朝九晚五双休，疫情应急时段加班", salary: "4.9k-7.6k / 月", restrictions: "室内办公，少量电话沟通，应急期需要加班"
  },
  {
    id: 16, category: "机关/事业单位/编外", name: "规划院绘图资料助理", education: "本科及以上",
    majors: [{ group: "理工环境类", list: ["城乡规划", "地理信息科学"] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ", "INTP"], certificates: "CAD 证书优先",
    work: "规划图纸整理、矢量化处理，项目资料归档，基础图件制作，文字说明整理",
    workTime: "朝九晚五双休，项目交付期加班", salary: "5.7k-8.8k / 月", restrictions: "久坐电脑办公，色弱色盲不适合，无外勤重体力"
  },
  {
    id: 17, category: "机关/事业单位/编外", name: "社区矫正辅助岗（司法局）", education: "大专",
    majors: [{ group: "文法大类", list: ["法学"] }, { group: "管理大类", list: ["社会工作"] }],
    mbti: ["ISFJ", "ESTJ"], certificates: "社会工作证优先",
    work: "矫正对象信息台账维护，电话与上门走访记录，组织集中教育活动，材料撰写归档",
    workTime: "朝九晚五双休，特殊情况值班", salary: "4.4k-6.9k / 月", restrictions: "少量社区外勤走访，正常沟通能力"
  },
  {
    id: 18, category: "机关/事业单位/编外", name: "林业资源普查内勤岗", education: "大专",
    majors: [{ group: "理工环境类", list: ["林学", "地理信息科学"] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ"], certificates: "GIS 证书优先",
    work: "林业普查数据录入、表格汇总，资料归档，图纸整理，外业人员数据核对",
    workTime: "朝九晚五双休，普查季度短期加班", salary: "4.6k-7.2k / 月", restrictions: "偶尔下乡外勤，户外蚊虫，粉尘过敏慎选"
  },
  {
    id: 19, category: "机关/事业单位/编外", name: "基层就业服务专员（公共就业中心）", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理", "社会工作", "人力资源管理"] }, { group: "不限专业", list: [] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "公共就业服务培训证书优先",
    work: "失业登记、求职登记受理，政策咨询，招聘会组织筹备，就业台账录入，补贴材料初审",
    workTime: "朝九晚五双休，招聘会周末加班", salary: "4.4k-6.9k / 月", restrictions: "偶尔外出招聘会现场，无重体力"
  },
  {
    id: 20, category: "机关/事业单位/编外", name: "应急管理局内勤辅助岗", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: [] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "应急管理培训证书优先",
    work: "应急预案资料整理，隐患台账录入，宣传材料排版，会议记录，值班信息登记",
    workTime: "朝九晚五双休，突发事件需要值班", salary: "4.7k-7.3k / 月", restrictions: "室内办公，应急值守，不能熬夜慎选"
  },
  {
    id: 21, category: "机关/事业单位/编外", name: "水利工程资料内勤岗", education: "大专",
    majors: [{ group: "理工环境类", list: ["水利工程"] }, { group: "管理大类", list: [] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ"], certificates: "资料员证书优先",
    work: "水利项目资料收集整理，竣工资料归档，报表填报，图纸扫描，数据台账维护",
    workTime: "朝九晚五双休，项目验收期加班", salary: "4.8k-7.5k / 月", restrictions: "少量工地现场资料核验，工地环境"
  },
  {
    id: 22, category: "机关/事业单位/编外", name: "妇女儿童活动中心干事", education: "大专",
    majors: [{ group: "管理大类", list: ["社会工作"] }, { group: "文法大类", list: ["汉语言文学"] }],
    mbti: ["ENFJ", "ESFJ", "ISFJ"], certificates: "社会工作证书优先",
    work: "妇女儿童主题活动策划，来访接待，活动档案整理，政策宣传，线上社群维护",
    workTime: "朝九晚五双休，活动周末加班", salary: "4.3k-6.8k / 月", restrictions: "偶尔外出社区活动，体力消耗小"
  },
  {
    id: 23, category: "机关/事业单位/编外", name: "统计普查中心普查员（编外）", education: "大专",
    majors: [{ group: "统计学类", list: [] }, { group: "计算机大类", list: [] }, { group: "管理大类", list: [] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "统计培训证书优先",
    work: "经济普查、人口普查数据录入，报表审核，入户走访记录，普查资料归档",
    workTime: "朝九晚五双休，普查阶段外勤走访", salary: "4.6k-7.1k / 月", restrictions: "阶段性入户外勤走访"
  },
  {
    id: 24, category: "机关/事业单位/编外", name: "医保局窗口受理辅助岗", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "文法大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "医保业务培训证书优先",
    work: "医保报销材料收取、信息录入、业务初审，群众咨询解答，档案整理归档",
    workTime: "朝九晚五双休，月末业务高峰延时", salary: "4.4k-6.9k / 月", restrictions: "窗口久坐，高频群众沟通"
  },
  {
    id: 25, category: "机关/事业单位/编外", name: "自然资源局不动产测绘内勤", education: "大专",
    majors: [{ group: "理工环境类", list: ["地理信息科学", "测绘工程"] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ", "INTP"], certificates: "测绘相关证书优先",
    work: "测绘图纸整理，测绘成果资料录入，台账维护，档案数字化",
    workTime: "朝九晚五双休，项目节点加班", salary: "5k-7.8k / 月", restrictions: "偶尔外业现场，户外环境"
  },
  {
    id: 26, category: "机关/事业单位/编外", name: "乡镇宣传干事（编外）", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["新闻学", "汉语言文学"] }],
    mbti: ["ENFP", "ENFJ"], certificates: "无硬性证书",
    work: "乡镇新闻稿件撰写，公众号维护，宣传展板制作，活动拍摄，宣传资料归档",
    workTime: "朝九晚五双休，活动期加班", salary: "4.5k-7k / 月", restrictions: "下乡拍摄外勤，轻度走动"
  },
  {
    id: 27, category: "机关/事业单位/编外", name: "政务大数据中心运维辅助岗", education: "本科及以上",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术", "大数据技术", "网络工程"] }],
    mbti: ["ISTJ", "INTP"], certificates: "计算机二级，软考初级优先",
    work: "政务服务器基础巡检，账号权限管理，系统问题记录，运维文档编写，数据备份协助",
    workTime: "朝九晚五双休，系统故障应急值班", salary: "5.6k-8.7k / 月", restrictions: "机房巡检，应急值班"
  },
  {
    id: 28, category: "机关/事业单位/编外", name: "仲裁委书记员辅助岗", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["法学"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "法律职业资格证优先",
    work: "仲裁庭记录，案卷整理扫描送达，证据材料归档，文书排版校对",
    workTime: "朝九晚五双休，案件密集期加班", salary: "4.9k-7.7k / 月", restrictions: "室内久坐，无外勤体力活"
  },
  {
    id: 29, category: "机关/事业单位/编外", name: "科普馆科普专员", education: "大专",
    majors: [{ group: "理工环境类", list: [] }, { group: "管理大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ESFJ", "ENFJ"], certificates: "科普讲解员证书优先",
    work: "科普展厅接待讲解，科普活动策划，科普材料制作，设备日常巡检",
    workTime: "轮班制，周末轮值调休", salary: "4.4k-6.9k / 月", restrictions: "长时间站立讲解"
  },
  {
    id: 30, category: "机关/事业单位/编外", name: "交通运输局资料内勤岗", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "理工环境类", list: ["交通运输工程"] }],
    mbti: ["ISTJ"], certificates: "资料员证书优先",
    work: "交通项目资料整理归档，报表填报，会议记录，文件收发",
    workTime: "朝九晚五双休，项目验收加班", salary: "4.6k-7.2k / 月", restrictions: "少量工地现场核查"
  },
  {
    id: 31, category: "机关/事业单位/编外", name: "残联服务中心专员", education: "大专",
    majors: [{ group: "管理大类", list: ["社会工作"] }, { group: "不限专业", list: [] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "社会工作者证书优先",
    work: "残疾人补贴材料初审，来访接待，入户走访，活动组织，台账维护",
    workTime: "朝九晚五双休，节日值守", salary: "4.2k-6.7k / 月", restrictions: "阶段性入户走访外勤"
  },
  {
    id: 32, category: "机关/事业单位/编外", name: "国土地籍档案岗", education: "大专",
    majors: [{ group: "文法大类", list: ["档案学"] }, { group: "理工环境类", list: ["土地资源管理"] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "档案管理员证书优先",
    work: "地籍档案数字化扫描，卷宗装订，查阅登记，档案库房管理",
    workTime: "朝九晚五双休", salary: "4.5k-7k / 月", restrictions: "室内办公，少量纸质档案搬运"
  },
  {
    id: 33, category: "机关/事业单位/编外", name: "青少年宫活动助理", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "文法大类", list: [] }],
    mbti: ["ENFJ", "ESFJ"], certificates: "教师资格证优先",
    work: "青少年兴趣活动组织，学员信息登记，活动物料准备，活动档案整理",
    workTime: "周末上班，工作日调休", salary: "4.3k-6.8k / 月", restrictions: "活动现场走动，轻度体力"
  },
  {
    id: 34, category: "机关/事业单位/编外", name: "市场监管局 12315 接线辅助岗", education: "大专",
    majors: [{ group: "文法大类", list: ["法学"] }, { group: "管理大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "无硬性证书",
    work: "投诉热线接听，诉求登记，工单流转，回访记录，资料归档",
    workTime: "轮班制，含晚班", salary: "4.4k-6.9k / 月", restrictions: "高频电话沟通"
  },
  {
    id: 35, category: "机关/事业单位/编外", name: "党史馆资料管理员", education: "大专",
    majors: [{ group: "文法大类", list: ["档案学", "汉语言文学"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "档案管理员证书优先",
    work: "党史文献整理、展品台账管理，参观登记，资料数字化归档",
    workTime: "朝九晚五双休，节假日轮值", salary: "4.3k-6.8k / 月", restrictions: "室内安静办公，少量整理展品"
  },
  {
    id: 36, category: "机关/事业单位/编外", name: "公共资源交易中心受理岗", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "文法大类", list: [] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "无硬性证书",
    work: "招投标项目资料收取，进场登记，开标现场协助，档案整理归档",
    workTime: "朝九晚五双休，开标项目加班", salary: "4.7k-7.3k / 月", restrictions: "开标现场需要到场，短时间外勤"
  },
  {
    id: 37, category: "机关/事业单位/编外", name: "科技局项目管理内勤", education: "本科及以上",
    majors: [{ group: "理工环境类", list: [] }, { group: "计算机大类", list: [] }, { group: "管理大类", list: [] }],
    mbti: ["INTJ", "ISTJ"], certificates: "无硬性证书",
    work: "科技项目申报材料收集，项目台账管理，验收资料整理，会议组织",
    workTime: "朝九晚五双休，申报节点加班", salary: "5.1k-8k / 月", restrictions: "室内办公，少量项目走访"
  },
  {
    id: 38, category: "机关/事业单位/编外", name: "文旅局非物质文化遗产内勤岗", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["汉语言文学", "文化产业管理"] }],
    mbti: ["ISFJ", "INFJ"], certificates: "无硬性证书",
    work: "非遗档案整理，申报材料撰写，传承人信息台账维护，活动协助",
    workTime: "朝九晚五双休", salary: "4.6k-7.1k / 月", restrictions: "偶尔下乡走访传承人"
  },
  {
    id: 39, category: "机关/事业单位/编外", name: "气象局资料内勤岗", education: "大专",
    majors: [{ group: "理工环境类", list: ["大气科学"] }, { group: "计算机大类", list: [] }, { group: "统计学类", list: [] }],
    mbti: ["ISTJ", "INTP"], certificates: "气象观测培训证书优先",
    work: "气象观测报表录入，气象资料归档，数据校验，材料整理",
    workTime: "轮班值守", salary: "4.8k-7.5k / 月", restrictions: "需要轮班值守"
  },
  {
    id: 40, category: "机关/事业单位/编外", name: "供销社综合业务岗", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ESTJ", "ISFJ"], certificates: "无硬性证书",
    work: "基层网点台账管理，项目材料撰写，会议组织，资料归档",
    workTime: "朝九晚五双休", salary: "4.4k-6.9k / 月", restrictions: "偶尔下乡基层网点走访"
  },
  {
    id: 41, category: "机关/事业单位/编外", name: "地震局科普内勤岗", education: "大专",
    majors: [{ group: "理工环境类", list: [] }, { group: "管理大类", list: [] }],
    mbti: ["ISFJ", "ENFJ"], certificates: "科普证书优先",
    work: "防震减灾科普宣传材料制作，活动组织，资料台账维护",
    workTime: "朝九晚五双休", salary: "4.3k-6.8k / 月", restrictions: "偶尔社区科普活动外勤"
  },
  {
    id: 42, category: "机关/事业单位/编外", name: "港澳事务办公室综合内勤岗", education: "本科及以上",
    majors: [{ group: "文法大类", list: [] }, { group: "管理大类", list: [] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "英语四级优先",
    work: "公文撰写翻译，来访接待，会议纪要，档案管理",
    workTime: "朝九晚五双休，外事活动临时加班", salary: "5.2k-8.1k / 月", restrictions: "外事接待，少量陪同外勤"
  },
  {
    id: 43, category: "机关/事业单位/编外", name: "地方志编纂助理岗", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["汉语言文学", "历史学"] }],
    mbti: ["INFJ", "ISTJ"], certificates: "无硬性证书",
    work: "地方史料收集、文字校对，志稿整理，资料数字化归档",
    workTime: "朝九晚五双休", salary: "4.7k-7.4k / 月", restrictions: "室内久坐办公"
  },
  {
    id: 44, category: "机关/事业单位/编外", name: "机关食堂后勤管理岗", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ESTJ", "ISFJ"], certificates: "食品安全管理员证优先",
    work: "食堂食材台账，卫生巡检，供应商对接，就餐管理，资产盘点",
    workTime: "早班，双休轮值", salary: "4.2k-6.6k / 月", restrictions: "需要在食堂走动巡检"
  },
  {
    id: 45, category: "机关/事业单位/编外", name: "政府采购中心辅助岗", education: "大专",
    majors: [{ group: "财会大类", list: [] }, { group: "管理大类", list: [] }, { group: "文法大类", list: [] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "政府采购培训证书优先",
    work: "采购项目资料整理，标书接收归档，会议协助，台账登记",
    workTime: "朝九晚五双休，开标节点加班", salary: "4.8k-7.5k / 月", restrictions: "开标现场到场协助"
  },

  /* ============ 二、国企央企岗（46–75） ============ */
  {
    id: 46, category: "国企央企岗", name: "国企综合行政助理", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理", "工商管理"] }, { group: "文法大类", list: ["汉语言文学"] }],
    mbti: ["ISTJ", "ESFJ"], certificates: "计算机二级优先",
    work: "公文流转，会议组织，固定资产管理，接待来访，行政月报编制",
    workTime: "朝九晚五双休", salary: "5k-8k / 月", restrictions: "室内办公，少量外部对接"
  },
  {
    id: 47, category: "国企央企岗", name: "国企财务助理", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学", "财务管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "初级会计证优先",
    work: "凭证录入，发票审核，银行流水核对，档案装订，辅助预决算",
    workTime: "朝九晚五双休，月末、年末加班", salary: "4.9k-7.8k / 月", restrictions: "久坐电脑办公"
  },
  {
    id: 48, category: "国企央企岗", name: "国企党建专员助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: [] }, { group: "管理大类", list: [] }],
    mbti: ["ISFJ", "ENFJ"], certificates: "党务培训证书优先",
    work: "党建材料撰写，党员信息台账管理，主题党日活动组织，档案归档",
    workTime: "朝九晚五双休，党建迎检加班", salary: "5.3k-8.4k / 月", restrictions: "室内办公，少量基层支部走访"
  },
  {
    id: 49, category: "国企央企岗", name: "国企纪检内勤助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["法学"] }, { group: "管理大类", list: [] }],
    mbti: ["ISTJ", "INTJ"], certificates: "纪检培训证书优先",
    work: "案卷整理，线索台账登记，谈话记录整理，材料归档",
    workTime: "朝九晚五双休，专案阶段加班", salary: "5.5k-8.6k / 月", restrictions: "室内办公"
  },
  {
    id: 50, category: "国企央企岗", name: "国企项目资料员", education: "大专",
    majors: [{ group: "理工环境类", list: ["土木工程"] }, { group: "管理大类", list: [] }],
    mbti: ["ISTJ"], certificates: "资料员证书优先",
    work: "工程项目全套资料收集、组卷、归档，竣工资料编制，图纸管理",
    workTime: "朝九晚五双休，项目验收加班", salary: "5k-8k / 月", restrictions: "偶尔工地现场核验资料"
  },
  {
    id: 51, category: "国企央企岗", name: "国企人力专员", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "人力资源四级优先",
    work: "招聘、入离职手续，员工档案，考勤统计，社保公积金申报",
    workTime: "朝九晚五双休，发薪节点加班", salary: "5.2k-8.2k / 月", restrictions: "办公室沟通岗位"
  },
  {
    id: 52, category: "国企央企岗", name: "国企信息化运维助理", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术", "网络工程"] }],
    mbti: ["ISTJ", "INTP"], certificates: "软考初级优先",
    work: "办公电脑、网络故障排查，信息系统账号维护，运维台账记录",
    workTime: "朝九晚五双休，故障应急值班", salary: "5.4k-8.5k / 月", restrictions: "办公室内巡检设备"
  },
  {
    id: 53, category: "国企央企岗", name: "国企工会干事助理", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "文法大类", list: [] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "工会培训证书优先",
    work: "职工活动策划，困难职工信息台账，福利发放登记，工会档案整理",
    workTime: "朝九晚五双休，活动期周末加班", salary: "4.8k-7.6k / 月", restrictions: "少量线下活动组织"
  },
  {
    id: 54, category: "国企央企岗", name: "国企法务助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["法学"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "法律职业资格证优先",
    work: "合同审核归档，法律检索，诉讼材料整理，制度校对",
    workTime: "朝九晚五双休，项目节点加班", salary: "6.1k-9.7k / 月", restrictions: "室内久坐办公"
  },
  {
    id: 55, category: "国企央企岗", name: "国企招投标助理", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "财会大类", list: [] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "招投标培训证书优先",
    work: "招标文件购买，标书制作排版，投标资料封装，中标资料归档",
    workTime: "朝九晚五双休，投标截止期加班", salary: "5.1k-8k / 月", restrictions: "投标期短期加班"
  },
  {
    id: 56, category: "国企央企岗", name: "国企宣传干事助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["新闻学", "汉语言文学"] }],
    mbti: ["ENFP", "ENFJ"], certificates: "无硬性证书",
    work: "企业新闻稿撰写，公众号运营，宣传片素材整理，活动摄影",
    workTime: "朝九晚五双休，活动期加班", salary: "5.4k-8.5k / 月", restrictions: "项目现场外出拍摄"
  },
  {
    id: 57, category: "国企央企岗", name: "国企市场调研助理", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }, { group: "统计学类", list: [] }],
    mbti: ["INTJ", "ISTJ"], certificates: "无硬性证书",
    work: "行业数据收集整理，竞品调研，问卷汇总，调研报告初稿撰写",
    workTime: "朝九晚五双休", salary: "5.2k-8.2k / 月", restrictions: "少量线下走访调研"
  },
  {
    id: 58, category: "国企央企岗", name: "国企安全管理内勤岗", education: "大专",
    majors: [{ group: "理工环境类", list: ["安全工程"] }, { group: "管理大类", list: [] }],
    mbti: ["ESTJ", "ISTJ"], certificates: "安全员证书优先",
    work: "安全台账维护，安全培训资料整理，隐患记录，报表上报",
    workTime: "朝九晚五双休，安全检查加班", salary: "5k-8k / 月", restrictions: "厂区现场巡检，粉尘慎选"
  },
  {
    id: 59, category: "国企央企岗", name: "国企物资采购助理", education: "大专",
    majors: [{ group: "管理大类", list: ["物流管理", "工商管理"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "采购证书优先",
    work: "供应商信息维护，询价比价，采购订单录入，到货验收核对，档案整理",
    workTime: "朝九晚五双休", salary: "4.9k-7.8k / 月", restrictions: "仓库少量验货走动"
  },
  {
    id: 60, category: "国企央企岗", name: "国企档案管理员", education: "大专",
    majors: [{ group: "文法大类", list: ["档案学"] }, { group: "管理大类", list: [] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "档案管理员证书优先",
    work: "合同、人事、项目档案分类扫描，借阅登记，库房管理",
    workTime: "朝九晚五双休", salary: "4.4k-7k / 月", restrictions: "室内办公"
  },
  {
    id: 61, category: "国企央企岗", name: "国企投融资内勤助理", education: "本科及以上",
    majors: [{ group: "财会大类", list: ["金融学", "财务管理"] }],
    mbti: ["INTJ", "ISTJ"], certificates: "证券从业优先",
    work: "投融资资料整理，数据报表，项目材料归档，会议纪要",
    workTime: "朝九晚五双休，项目节点加班", salary: "6.3k-9.9k / 月", restrictions: "室内久坐办公"
  },
  {
    id: 62, category: "国企央企岗", name: "国企客户服务专员", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "无硬性证书",
    work: "客户来电咨询，工单记录，投诉跟进，客户档案维护",
    workTime: "轮班制", salary: "4.7k-7.5k / 月", restrictions: "电话沟通较多"
  },
  {
    id: 63, category: "国企央企岗", name: "国企计量检测内勤岗", education: "大专",
    majors: [{ group: "理工环境类", list: ["测控技术"] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ", "INTP"], certificates: "计量证书优先",
    work: "检测报告录入，台账维护，检测资料归档，样品信息登记",
    workTime: "朝九晚五双休", salary: "5.1k-8k / 月", restrictions: "少量实验室现场"
  },
  {
    id: 64, category: "国企央企岗", name: "国企园区运营助理", education: "大专",
    majors: [{ group: "管理大类", list: [] }],
    mbti: ["ESTJ", "ESFJ"], certificates: "无硬性证书",
    work: "园区企业对接，园区活动组织，设施报修跟进，台账统计",
    workTime: "朝九晚五双休，园区活动周末加班", salary: "4.9k-7.7k / 月", restrictions: "园区内走动巡检"
  },
  {
    id: 65, category: "国企央企岗", name: "国企法务合同管理岗", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["法学"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "法律职业资格证优先",
    work: "全公司合同台账管理，合同归档，履约跟踪，合同模板修订",
    workTime: "朝九晚五双休", salary: "6k-9.6k / 月", restrictions: "室内办公"
  },
  {
    id: 66, category: "国企央企岗", name: "国企预算管理助理", education: "本科及以上",
    majors: [{ group: "财会大类", list: ["会计学", "财政学"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "初级会计优先",
    work: "部门预算收集汇总，预算报表编制，预算执行台账，资料归档",
    workTime: "朝九晚五双休，预算编制期加班", salary: "5.8k-9.2k / 月", restrictions: "久坐电脑办公"
  },
  {
    id: 67, category: "国企央企岗", name: "国企质量体系内勤岗", education: "大专",
    majors: [{ group: "管理大类", list: ["质量管理"] }],
    mbti: ["ISTJ"], certificates: "内审员证书优先",
    work: "质量体系文件维护，内审资料准备，不符合项台账跟进",
    workTime: "朝九晚五双休，审核期加班", salary: "4.9k-7.7k / 月", restrictions: "厂区少量巡检"
  },
  {
    id: 68, category: "国企央企岗", name: "国企数据统计助理", education: "本科及以上",
    majors: [{ group: "统计学类", list: [] }, { group: "计算机大类", list: ["大数据技术"] }],
    mbti: ["ISTJ", "INTP"], certificates: "计算机二级优先",
    work: "经营数据汇总，报表制作，数据校验，经营分析简报撰写",
    workTime: "朝九晚五双休，月末季度末加班", salary: "5.7k-9k / 月", restrictions: "久坐电脑办公"
  },
  {
    id: 69, category: "国企央企岗", name: "国企公文写作助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["汉语言文学"] }],
    mbti: ["INFJ", "ISTJ"], certificates: "无硬性证书",
    work: "工作总结、汇报材料、领导讲话稿撰写校对，公文流转归档",
    workTime: "朝九晚五双休，迎检加班", salary: "5.6k-8.8k / 月", restrictions: "室内久坐"
  },
  {
    id: 70, category: "国企央企岗", name: "国企车辆管理专员", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "驾驶证优先",
    work: "公车台账管理，用车调度，车辆年检保险登记，维修对接",
    workTime: "朝九晚五双休", salary: "4.5k-7.1k / 月", restrictions: "少量车辆现场查看"
  },
  {
    id: 71, category: "国企央企岗", name: "国企品牌宣传助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["广告学", "新闻学"] }],
    mbti: ["ENFP", "ENFJ"], certificates: "无硬性证书",
    work: "品牌宣传物料制作，短视频素材整理，宣传活动执行，媒体对接",
    workTime: "朝九晚五双休，活动期加班", salary: "5.3k-8.4k / 月", restrictions: "线下活动外勤"
  },
  {
    id: 72, category: "国企央企岗", name: "国企安全培训内勤岗", education: "大专",
    majors: [{ group: "理工环境类", list: ["安全工程"] }, { group: "管理大类", list: [] }],
    mbti: ["ESTJ", "ISFJ"], certificates: "安全员证书优先",
    work: "安全培训课件整理，培训签到台账，考试资料归档，培训通知组织",
    workTime: "朝九晚五双休", salary: "4.8k-7.6k / 月", restrictions: "车间培训现场少量走动"
  },
  {
    id: 73, category: "国企央企岗", name: "国企供应链计划助理", education: "大专",
    majors: [{ group: "管理大类", list: ["供应链管理", "物流管理"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "无硬性证书",
    work: "生产物料计划测算，订单跟踪，库存台账，物料需求统计",
    workTime: "朝九晚五双休", salary: "5k-7.9k / 月", restrictions: "仓库少量核对物料"
  },
  {
    id: 74, category: "国企央企岗", name: "国企接待办专员", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "文法大类", list: [] }],
    mbti: ["ESFJ", "ENFJ"], certificates: "礼仪培训证书优先",
    work: "上级来访接待，行程安排，会务安排，接待物资准备",
    workTime: "朝九晚五双休，临时接待加班", salary: "5k-8k / 月", restrictions: "接待陪同外勤"
  },
  {
    id: 75, category: "国企央企岗", name: "国企环保管理内勤岗", education: "大专",
    majors: [{ group: "理工环境类", list: ["环境工程"] }],
    mbti: ["ISTJ", "INTP"], certificates: "环保管理员证书优先",
    work: "环保台账填报，排污资料整理，环保迎检材料准备，报表上报",
    workTime: "朝九晚五双休，环保检查加班", salary: "5.1k-8k / 月", restrictions: "厂区现场巡检"
  },

  /* ============ 三、企业职能文职类（76–110） ============ */
  {
    id: 76, category: "企业职能文职", name: "行政专员", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理", "工商管理"] }, { group: "文法大类", list: ["文秘"] }],
    mbti: ["ISFJ", "ISTJ", "ESFJ"], certificates: "计算机一级，秘书证",
    work: "负责办公用品采购、会议布置、公文整理、员工考勤统计、接待来访客户，维护办公环境",
    workTime: "朝九晚五双休", salary: "4k-7k / 月", restrictions: "无熬夜、无外勤、无重体力、无高强度加班"
  },
  {
    id: 77, category: "企业职能文职", name: "行政主管助理", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理", "工商管理"] }],
    mbti: ["ISTJ", "ESFJ"], certificates: "计算机二级优先",
    work: "协助主管制定行政制度，统筹会议安排，固定资产管理，各类行政预算统计，对接物业，整理行政月报",
    workTime: "朝九晚五双休", salary: "5k-8k / 月", restrictions: "室内办公，少量对接外部单位，无重体力"
  },
  {
    id: 78, category: "企业职能文职", name: "财务出纳", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学", "财务管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "初级会计证",
    work: "管理现金收支、银行对账、登记资金台账、整理票据、发放员工工资，严格遵守财务制度",
    workTime: "朝九晚五双休", salary: "4.5k-7.5k / 月", restrictions: "不能熬夜、无夜班、无重体力劳动"
  },
  {
    id: 79, category: "企业职能文职", name: "会计助理", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学", "财务管理"] }],
    mbti: ["ISTJ", "INTP"], certificates: "初级会计证优先",
    work: "发票整理、凭证录入，银行流水核对，装订会计档案，辅助月末结账，税务资料准备",
    workTime: "朝九晚五双休，月末报税期加班", salary: "4.8k-7.7k / 月", restrictions: "久坐办公，月末短期加班，无外勤"
  },
  {
    id: 80, category: "企业职能文职", name: "人事招聘专员", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理", "工商管理"] }],
    mbti: ["ESFJ", "ENFJ", "ISFJ"], certificates: "人力资源四级证书",
    work: "发布招聘岗位、筛选简历、邀约面试、接待候选人、整理入职资料、维护招聘台账",
    workTime: "朝九晚五双休", salary: "5k-8k / 月", restrictions: "无需外勤出差，可正常与人沟通"
  },
  {
    id: 81, category: "企业职能文职", name: "人事薪酬绩效专员", education: "本科及以上",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "人力资源三级证书优先",
    work: "每月薪资核算、社保公积金申报，绩效数据统计，考勤核对，员工档案管理",
    workTime: "朝九晚五双休，发薪节点加班", salary: "5.3k-8.4k / 月", restrictions: "久坐电脑办公，发薪期短期加班"
  },
  {
    id: 82, category: "企业职能文职", name: "员工关系专员", education: "本科及以上",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }, { group: "文法大类", list: ["法学"] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "人力资源证书优先",
    work: "劳动合同签订管理，员工入离职手续，劳动纠纷沟通调解，员工活动组织，制度宣导",
    workTime: "朝九晚五双休", salary: "5.2k-8.3k / 月", restrictions: "办公室沟通岗位，无外勤体力工作"
  },
  {
    id: 83, category: "企业职能文职", name: "前台接待", education: "高中/中专/职高",
    majors: [{ group: "管理大类", list: ["酒店管理", "文秘"] }, { group: "不限专业", list: [] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "无硬性证书",
    work: "访客接待、电话转接，快递收发，会议室预约登记，门禁管理，简单行政协助",
    workTime: "朝九晚五双休", salary: "3.8k-6k / 月", restrictions: "需要间断站立接待，正常听力口语，无夜班"
  },
  {
    id: 84, category: "企业职能文职", name: "法务助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["法学"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "法律职业资格证优先",
    work: "合同初审归档，法律案例检索，整理诉讼材料，登记法务台账，制度文本校对",
    workTime: "朝九晚五双休，项目节点加班", salary: "6k-9.5k / 月", restrictions: "室内久坐，无外勤体力活"
  },
  {
    id: 85, category: "企业职能文职", name: "总裁助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["汉语言文学"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ESTJ", "ISFJ"], certificates: "秘书证优先",
    work: "日程安排，会议纪要撰写，文件流转，对外对接，资料汇总，差旅预订",
    workTime: "朝九晚五双休，随领导安排临时加班", salary: "6.5k-10k / 月", restrictions: "偶尔外勤陪同出差，可接受临时加班"
  },
  {
    id: 86, category: "企业职能文职", name: "商务助理", education: "大专",
    majors: [{ group: "管理大类", list: ["工商管理", "国际经济与贸易"] }],
    mbti: ["ESFJ", "ESTJ"], certificates: "商务英语证书优先",
    work: "客户资料整理，合同录入归档，报价单制作，会议记录，对接客户，订单跟进",
    workTime: "朝九晚五双休，客户紧急需求偶尔加班", salary: "5k-8k / 月", restrictions: "少量外勤拜访客户，可以短途出差"
  },
  {
    id: 87, category: "企业职能文职", name: "采购助理", education: "大专",
    majors: [{ group: "管理大类", list: ["物流管理", "工商管理"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "采购证书优先",
    work: "供应商资料维护，询价比价登记，采购订单录入，到货核对，对账，采购档案整理",
    workTime: "朝九晚五双休", salary: "4.7k-7.5k / 月", restrictions: "偶尔仓库验货，短时间走动，无需搬重物"
  },
  {
    id: 88, category: "企业职能文职", name: "后勤专员", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ESTJ"], certificates: "无硬性证书",
    work: "园区设施报修跟进，食堂宿舍管理，资产盘点，后勤供应商对接，安全巡检台账",
    workTime: "朝九晚五双休，应急情况值班", salary: "4.2k-6.8k / 月", restrictions: "厂区内巡检走动，无重体力"
  },
  {
    id: 89, category: "企业职能文职", name: "企业档案管理员", education: "大专",
    majors: [{ group: "文法大类", list: ["档案学"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "档案管理员证优先",
    work: "企业合同、人事、项目档案分类、扫描、装订、借阅登记，库房管理",
    workTime: "朝九晚五双休", salary: "4.1k-6.6k / 月", restrictions: "室内办公，少量搬纸质档案，无粉尘"
  },
  {
    id: 90, category: "企业职能文职", name: "IT 运维助理", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机应用技术", "网络工程"] }],
    mbti: ["ISTP", "INTP"], certificates: "计算机运维证书优先",
    work: "员工电脑故障排查，打印机维护，账号权限管理，设备台账记录，网络基础巡检",
    workTime: "朝九晚五双休，系统故障需要应急处理", salary: "5.2k-8.3k / 月", restrictions: "办公室内走动检修，无重体力"
  },
  {
    id: 91, category: "企业职能文职", name: "质量体系文员", education: "大专",
    majors: [{ group: "管理大类", list: ["质量管理"] }],
    mbti: ["ISTJ"], certificates: "内审员证书优先",
    work: "质量体系文件整理修订，内审资料准备，记录表单归档，不符合项台账跟进",
    workTime: "朝九晚五双休，体系审核期加班", salary: "4.8k-7.6k / 月", restrictions: "偶尔车间巡检，无粉尘，不用搬货"
  },
  {
    id: 92, category: "企业职能文职", name: "固定资产管理员", education: "大专",
    majors: [{ group: "管理大类", list: [] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "无硬性证书",
    work: "全公司固定资产台账，资产入库调拨盘点，报废资料整理，资产标签管理",
    workTime: "朝九晚五双休", salary: "4.4k-7k / 月", restrictions: "公司各区域盘点走动"
  },
  {
    id: 93, category: "企业职能文职", name: "证照管理专员", education: "大专",
    majors: [{ group: "文法大类", list: [] }, { group: "管理大类", list: [] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "无硬性证书",
    work: "公司营业执照、资质证书台账，年检、变更材料准备，证书原件保管，复印件登记",
    workTime: "朝九晚五双休", salary: "4.5k-7.1k / 月", restrictions: "室内办公"
  },
  {
    id: 94, category: "企业职能文职", name: "差旅行政专员", education: "大专",
    majors: [{ group: "管理大类", list: [] }],
    mbti: ["ESFJ", "ISTJ"], certificates: "无硬性证书",
    work: "员工差旅预订，差旅报销单据收集审核，差旅台账统计，服务商对接",
    workTime: "朝九晚五双休", salary: "4.3k-6.9k / 月", restrictions: "室内办公"
  },
  {
    id: 95, category: "企业职能文职", name: "知识产权助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["法学"] }, { group: "理工环境类", list: [] }],
    mbti: ["ISTJ", "INTJ"], certificates: "知识产权师优先",
    work: "商标专利申请材料整理，知识产权台账维护，年费监控，档案归档",
    workTime: "朝九晚五双休", salary: "5.7k-9k / 月", restrictions: "室内办公"
  },
  {
    id: 96, category: "企业职能文职", name: "行政采购文员", education: "大专",
    majors: [{ group: "管理大类", list: [] }],
    mbti: ["ISTJ", "ESFJ"], certificates: "无硬性证书",
    work: "办公用品采购下单，收货入库登记，供应商对账，采购台账维护",
    workTime: "朝九晚五双休", salary: "4.2k-6.8k / 月", restrictions: "仓库少量收货核对"
  },
  {
    id: 97, category: "企业职能文职", name: "内控专员助理", education: "本科及以上",
    majors: [{ group: "财会大类", list: ["审计学", "会计学"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "初级会计优先",
    work: "内控流程资料整理，内控检查底稿，缺陷台账，内控报告校对",
    workTime: "朝九晚五双休，内控审计期加班", salary: "5.5k-8.7k / 月", restrictions: "少量部门访谈外勤"
  },
  {
    id: 98, category: "企业职能文职", name: "会议会务专员", education: "大专",
    majors: [{ group: "管理大类", list: [] }],
    mbti: ["ESFJ", "ESTJ"], certificates: "会务培训证书优先",
    work: "会议场地预订，物料准备，会场布置，签到，会议记录，会后资料归档",
    workTime: "朝九晚五双休，会议期间周末加班", salary: "4.6k-7.2k / 月", restrictions: "会场布置轻度体力"
  },
  {
    id: 99, category: "企业职能文职", name: "招聘项目助理", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ESFJ", "ENFJ"], certificates: "人力资源四级优先",
    work: "校园招聘筹备，宣讲会现场协助，简历筛选，候选人跟进，招聘资料归档",
    workTime: "朝九晚五双休，校招阶段出差加班", salary: "5.1k-8k / 月", restrictions: "校招外勤出差"
  },
  {
    id: 100, category: "企业职能文职", name: "培训专员助理", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ENFJ", "ISFJ"], certificates: "企业培训师优先",
    work: "员工培训课件整理，培训签到台账，培训组织，培训效果资料收集归档",
    workTime: "朝九晚五双休，培训期周末加班", salary: "4.9k-7.8k / 月", restrictions: "培训现场组织"
  },
  {
    id: 101, category: "企业职能文职", name: "税务助理", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学", "税收学"] }],
    mbti: ["ISTJ", "INTP"], certificates: "初级会计优先",
    work: "发票认证，纳税申报辅助，税务资料整理归档，税务台账维护",
    workTime: "朝九晚五双休，征期加班", salary: "5k-7.9k / 月", restrictions: "久坐电脑办公"
  },
  {
    id: 102, category: "企业职能文职", name: "应收应付会计助理", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学"] }],
    mbti: ["ISTJ"], certificates: "初级会计优先",
    work: "应收应付台账登记，对账函整理，往来核对，凭证装订归档",
    workTime: "朝九晚五双休，月末对账加班", salary: "4.9k-7.8k / 月", restrictions: "室内办公"
  },
  {
    id: 103, category: "企业职能文职", name: "工程文员", education: "大专",
    majors: [{ group: "理工环境类", list: ["土木工程"] }, { group: "管理大类", list: [] }],
    mbti: ["ISTJ"], certificates: "资料员证书优先",
    work: "工程项目资料收集，报验资料整理，图纸管理，工程台账维护",
    workTime: "朝九晚五双休，项目验收加班", salary: "4.8k-7.6k / 月", restrictions: "偶尔工地现场"
  },
  {
    id: 104, category: "企业职能文职", name: "资质申报专员助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: [] }, { group: "理工环境类", list: [] }],
    mbti: ["ISTJ", "ESFJ"], certificates: "无硬性证书",
    work: "企业资质申报材料编制，人员证书台账，系统填报，资质维护",
    workTime: "朝九晚五双休，申报节点加班", salary: "5.2k-8.2k / 月", restrictions: "室内办公，少量主管部门对接"
  },
  {
    id: 105, category: "企业职能文职", name: "固定资产会计助理", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学"] }],
    mbti: ["ISTJ"], certificates: "初级会计优先",
    work: "固定资产卡片录入，折旧计提，资产盘点资料整理，资产台账",
    workTime: "朝九晚五双休，年末盘点加班", salary: "4.8k-7.7k / 月", restrictions: "厂区盘点走动"
  },
  {
    id: 106, category: "企业职能文职", name: "企业食堂管理员", education: "大专",
    majors: [{ group: "管理大类", list: [] }],
    mbti: ["ESTJ", "ISFJ"], certificates: "食品安全管理员证优先",
    work: "食堂食材验收，菜单管理，卫生巡检，供应商对账，食堂人员管理",
    workTime: "早班，双休轮值", salary: "4.3k-6.9k / 月", restrictions: "食堂现场走动巡检"
  },
  {
    id: 107, category: "企业职能文职", name: "安保内勤专员", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "保安管理培训证书优先",
    work: "安保值班台账，出入登记资料整理，安保巡检记录，应急预案资料归档",
    workTime: "朝九晚五双休，应急值班", salary: "4.1k-6.7k / 月", restrictions: "园区安保巡检走动"
  },
  {
    id: 108, category: "企业职能文职", name: "车辆管理专员", education: "大专",
    majors: [{ group: "管理大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "驾驶证优先",
    work: "公司车辆调度，车辆保险年检台账，维修登记，油费报销核对",
    workTime: "朝九晚五双休", salary: "4.2k-6.8k / 月", restrictions: "少量车辆现场查看"
  },
  {
    id: 109, category: "企业职能文职", name: "涉外商务助理", education: "本科及以上",
    majors: [{ group: "管理大类", list: ["国际经济与贸易"] }, { group: "外语类", list: [] }],
    mbti: ["ESFJ", "ESTJ"], certificates: "英语六级优先",
    work: "外贸邮件往来，外销合同整理，报关资料协助，客户资料维护",
    workTime: "朝九晚五双休，海外时差偶尔加班", salary: "5.4k-8.5k / 月", restrictions: "少量客户拜访外勤"
  },
  {
    id: 110, category: "企业职能文职", name: "企业文化专员助理", education: "大专",
    majors: [{ group: "文法大类", list: [] }, { group: "管理大类", list: [] }],
    mbti: ["ENFJ", "ESFJ"], certificates: "无硬性证书",
    work: "企业文化活动策划，内刊稿件收集，文化物料制作，员工文化档案整理",
    workTime: "朝九晚五双休，活动周末加班", salary: "4.9k-7.8k / 月", restrictions: "活动现场组织"
  },

  /* ============ 四、市场新媒体品牌类（111–142） ============ */
  {
    id: 111, category: "市场新媒体品牌", name: "文案编辑", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["汉语言文学", "新闻传播"] }],
    mbti: ["INFP", "INFJ", "ENFP"], certificates: "普通话证书、新媒体运营证书优先",
    work: "撰写公众号推文、产品宣传文案、活动软文，校对文字内容，配合运营修改稿件",
    workTime: "大小周，偶尔加班", salary: "6k-10k / 月", restrictions: "久坐办公，无需体力劳动，无夜班"
  },
  {
    id: 112, category: "市场新媒体品牌", name: "新媒体运营", education: "大专",
    majors: [{ group: "管理大类", list: ["电子商务"] }, { group: "文法大类", list: ["网络新媒体"] }],
    mbti: ["ENFP", "ENTP", "ESFJ"], certificates: "新媒体运营证书优先",
    work: "运营短视频与账号，策划短视频选题，剪辑简单视频，回复粉丝留言，统计账号数据",
    workTime: "大小周，偶尔加班", salary: "6k-11k / 月", restrictions: "可少量加班，无需外勤出差"
  },
  {
    id: 113, category: "市场新媒体品牌", name: "短视频剪辑助理", education: "大专",
    majors: [{ group: "计算机大类", list: ["数字媒体技术"] }, { group: "文法大类", list: ["广播电视编导"] }],
    mbti: ["INFP", "ISFP"], certificates: "剪辑相关证书优先",
    work: "素材粗剪、字幕添加、调色，素材库整理，封面制作，配合运营修改成片",
    workTime: "大小周，项目期加班", salary: "5.6k-9k / 月", restrictions: "长时间电脑办公，色弱色盲不适合"
  },
  {
    id: 114, category: "市场新媒体品牌", name: "平面设计助理", education: "大专",
    majors: [{ group: "艺术设计大类", list: ["视觉传达设计", "广告设计"] }],
    mbti: ["INFP", "ISFP", "ENFP"], certificates: "Adobe 设计师证书优先",
    work: "配合设计师完成海报、配图、图片裁切，整理设计素材，修改简单图片",
    workTime: "大小周，偶尔加班", salary: "5.5k-9k / 月", restrictions: "久坐办公，无重体力，无夜班"
  },
  {
    id: 115, category: "市场新媒体品牌", name: "电商运营助理", education: "大专",
    majors: [{ group: "管理大类", list: ["电子商务", "市场营销"] }],
    mbti: ["ESTJ", "ESFJ", "ISTJ"], certificates: "无硬性证书",
    work: "负责商品上下架、订单核对、后台数据统计、回复平台客户消息、整理每日销售报表",
    workTime: "大小周，偶尔加班", salary: "5k-8k / 月", restrictions: "可少量加班，无需外勤出差"
  },
  {
    id: 116, category: "市场新媒体品牌", name: "电商客服主管助理", education: "大专",
    majors: [{ group: "管理大类", list: ["电子商务"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "无硬性证书",
    work: "客服话术整理，客服数据统计，工单汇总，培训新人，客诉跟进记录",
    workTime: "轮班制，有晚班", salary: "4.7k-7.5k / 月", restrictions: "需要长时间线上沟通，有晚班，不能熬夜不适合"
  },
  {
    id: 117, category: "市场新媒体品牌", name: "市场推广助理", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }, { group: "文法大类", list: ["广告学"] }],
    mbti: ["ENFP", "ESFJ"], certificates: "市场营销证书优先",
    work: "市场活动物料准备，活动现场协助，活动数据统计，宣传素材整理，渠道对接",
    workTime: "大小周，活动期周末加班", salary: "5.3k-8.4k / 月", restrictions: "活动需要外勤现场，短时间站立"
  },
  {
    id: 118, category: "市场新媒体品牌", name: "品牌公关助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["广告学", "新闻学"] }],
    mbti: ["ENFJ", "ENFP"], certificates: "公关证书优先",
    work: "媒体资料整理，公关稿件初稿撰写，舆情监测记录，活动对接，媒体台账维护",
    workTime: "大小周，舆情突发需要加班", salary: "6.2k-9.8k / 月", restrictions: "偶尔线下活动外勤，可临时加班"
  },
  {
    id: 119, category: "市场新媒体品牌", name: "小红书内容运营", education: "大专",
    majors: [{ group: "文法大类", list: ["新媒体", "广告学"] }],
    mbti: ["ENFP", "INFP"], certificates: "无硬性证书",
    work: "笔记选题撰写，图片排版，评论维护，数据复盘，达人对接记录",
    workTime: "大小周，偶尔加班", salary: "5.7k-9.2k / 月", restrictions: "久坐电脑办公，无需外勤体力"
  },
  {
    id: 120, category: "市场新媒体品牌", name: "直播场控助理", education: "大专",
    majors: [{ group: "管理大类", list: ["电子商务"] }],
    mbti: ["ESFP", "ESTP"], certificates: "无硬性证书",
    work: "直播间后台商品上下架，弹幕互动，场控记录，直播数据记录，直播物料准备",
    workTime: "晚班直播为主", salary: "5.2k-8.5k / 月", restrictions: "晚班工作，不能熬夜不适合"
  },
  {
    id: 121, category: "市场新媒体品牌", name: "信息流广告优化助理", education: "本科及以上",
    majors: [{ group: "管理大类", list: ["市场营销"] }, { group: "统计学类", list: [] }],
    mbti: ["INTJ", "INTP"], certificates: "无硬性证书",
    work: "广告素材整理，后台数据报表制作，消耗统计，广告效果记录，素材归档",
    workTime: "大小周，投放节点加班", salary: "6.1k-9.6k / 月", restrictions: "久坐办公，投放高峰期加班"
  },
  {
    id: 122, category: "市场新媒体品牌", name: "线下活动执行助理", education: "大专",
    majors: [{ group: "管理大类", list: ["会展经济与管理"] }],
    mbti: ["ESFJ", "ESTP"], certificates: "会展证书优先",
    work: "展会物料清点、现场搭建协助，引导参会人员，活动流程记录，会后物料清点",
    workTime: "项目制，周末活动加班", salary: "5k-8k / 月", restrictions: "活动现场长时间站立走动，轻度体力"
  },
  {
    id: 123, category: "市场新媒体品牌", name: "媒介专员助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["广告学", "新闻传播"] }],
    mbti: ["ENFJ", "ESFJ"], certificates: "无硬性证书",
    work: "媒体资源台账维护，稿件排期跟进，媒体对接，曝光数据汇总整理",
    workTime: "大小周，偶尔加班", salary: "5.8k-9.1k / 月", restrictions: "线上沟通为主，少量线下媒体拜访"
  },
  {
    id: 124, category: "市场新媒体品牌", name: "摄影助理", education: "大专",
    majors: [{ group: "艺术大类", list: ["摄影"] }, { group: "计算机大类", list: ["数字媒体"] }],
    mbti: ["ISFP", "ESFP"], certificates: "摄影证书优先",
    work: "摄影器材整理，场景布置，照片素材筛选分类，简单图片初修",
    workTime: "项目制，外景拍摄需要外出", salary: "4.9k-7.8k / 月", restrictions: "外出拍摄，需要搬摄影器材，体力偏弱慎选"
  },
  {
    id: 125, category: "市场新媒体品牌", name: "电商美工助理", education: "大专",
    majors: [{ group: "艺术设计大类", list: ["视觉传达设计"] }],
    mbti: ["INFP", "ISFP"], certificates: "Adobe 证书优先",
    work: "商品主图、详情页辅助制作，素材整理，图片修图，活动页面配图",
    workTime: "大小周，大促节点加班", salary: "5.4k-8.8k / 月", restrictions: "长时间电脑办公，色弱不适合"
  },
  {
    id: 126, category: "市场新媒体品牌", name: "短视频编导助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["广播电视编导"] }, { group: "艺术大类", list: [] }],
    mbti: ["ENFP", "INFP"], certificates: "无硬性证书",
    work: "短视频脚本撰写，拍摄现场协助，拍摄计划安排，素材整理归档",
    workTime: "大小周，拍摄期加班", salary: "5.9k-9.3k / 月", restrictions: "外景拍摄外勤"
  },
  {
    id: 127, category: "市场新媒体品牌", name: "直播运营助理", education: "大专",
    majors: [{ group: "管理大类", list: ["电子商务"] }],
    mbti: ["ENFP", "ESFJ"], certificates: "无硬性证书",
    work: "直播排期规划，主播对接，直播脚本准备，直播数据复盘，粉丝社群维护",
    workTime: "大小周，晚班直播", salary: "5.3k-8.4k / 月", restrictions: "晚班工作"
  },
  {
    id: 128, category: "市场新媒体品牌", name: "品牌文案助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["汉语言文学", "广告学"] }],
    mbti: ["INFP", "INFJ"], certificates: "无硬性证书",
    work: "品牌故事、品牌宣传文案撰写，品牌手册文字校对，宣传物料文案输出",
    workTime: "大小周，项目节点加班", salary: "5.8k-9.1k / 月", restrictions: "室内久坐办公"
  },
  {
    id: 129, category: "市场新媒体品牌", name: "渠道运营助理", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }],
    mbti: ["ESTJ", "ESFJ"], certificates: "无硬性证书",
    work: "渠道合作资料整理，渠道数据统计，渠道素材分发，合作台账维护",
    workTime: "朝九晚五双休，渠道活动周末加班", salary: "5k-7.9k / 月", restrictions: "少量渠道拜访外勤"
  },
  {
    id: 130, category: "市场新媒体品牌", name: "社群运营助理", education: "大专",
    majors: [{ group: "管理大类", list: ["电子商务"] }],
    mbti: ["ENFP", "ESFJ"], certificates: "无硬性证书",
    work: "用户社群日常维护，话题策划，用户问题解答，社群活动组织，用户数据统计",
    workTime: "大小周，晚间需要维护社群", salary: "4.9k-7.8k / 月", restrictions: "晚间线上维护"
  },
  {
    id: 131, category: "市场新媒体品牌", name: "内容审核助理", education: "大专",
    majors: [{ group: "文法大类", list: [] }, { group: "不限专业", list: [] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "无硬性证书",
    work: "平台图文、短视频内容审核，违规记录登记，审核台账，规则整理",
    workTime: "轮班制，含晚班", salary: "4.5k-7.1k / 月", restrictions: "轮班，长时间屏幕阅读"
  },
  {
    id: 132, category: "市场新媒体品牌", name: "活动策划助理", education: "本科及以上",
    majors: [{ group: "管理大类", list: ["会展经济"] }, { group: "文法大类", list: ["广告学"] }],
    mbti: ["ENFJ", "ENFP"], certificates: "会展证书优先",
    work: "线上线下活动方案初稿撰写，预算测算，物料清单，执行排期，活动复盘整理",
    workTime: "大小周，活动期周末加班", salary: "5.5k-8.7k / 月", restrictions: "活动现场外勤"
  },
  {
    id: 133, category: "市场新媒体品牌", name: "广告投放助理", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }, { group: "统计学类", list: [] }],
    mbti: ["INTJ", "ISTJ"], certificates: "无硬性证书",
    work: "广告账户基础操作，投放报表整理，消耗数据记录，素材归档，效果汇总",
    workTime: "大小周，投放高峰期加班", salary: "5.6k-8.8k / 月", restrictions: "久坐电脑办公"
  },
  {
    id: 134, category: "市场新媒体品牌", name: "达人对接助理", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }],
    mbti: ["ESFJ", "ENFP"], certificates: "无硬性证书",
    work: "达人资源台账维护，达人商务沟通，合作合同整理，排期跟进，效果数据汇总",
    workTime: "大小周，偶尔加班", salary: "5.4k-8.5k / 月", restrictions: "线上沟通为主"
  },
  {
    id: 135, category: "市场新媒体品牌", name: "产品文案助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["汉语言文学"] }],
    mbti: ["INFP", "INFJ"], certificates: "无硬性证书",
    work: "产品说明书、详情页文案撰写，产品卖点梳理，文案校对迭代",
    workTime: "大小周，产品上新加班", salary: "5.7k-9k / 月", restrictions: "室内久坐办公"
  },
  {
    id: 136, category: "市场新媒体品牌", name: "用户研究助理", education: "本科及以上",
    majors: [{ group: "统计学类", list: [] }, { group: "管理大类", list: ["市场营销"] }],
    mbti: ["INTJ", "INTP"], certificates: "无硬性证书",
    work: "用户问卷整理，用户访谈记录，用户画像资料汇总，调研报告初稿撰写",
    workTime: "朝九晚五双休", salary: "5.8k-9.1k / 月", restrictions: "少量用户访谈外勤"
  },
  {
    id: 137, category: "市场新媒体品牌", name: "短视频脚本助理", education: "大专",
    majors: [{ group: "文法大类", list: ["广播电视编导"] }],
    mbti: ["ENFP", "INFP"], certificates: "无硬性证书",
    work: "短视频脚本撰写，分镜整理，台词校对，拍摄脚本归档",
    workTime: "大小周，拍摄期加班", salary: "5.3k-8.4k / 月", restrictions: "偶尔拍摄现场"
  },
  {
    id: 138, category: "市场新媒体品牌", name: "搜索 SEO 优化助理", education: "大专",
    majors: [{ group: "计算机大类", list: [] }, { group: "文法大类", list: [] }],
    mbti: ["INTP", "ISTJ"], certificates: "SEO 证书优先",
    work: "关键词整理，文章优化，网站内容更新，收录数据统计，优化台账",
    workTime: "朝九晚五双休", salary: "5.2k-8.3k / 月", restrictions: "久坐电脑办公"
  },
  {
    id: 139, category: "市场新媒体品牌", name: "品牌舆情监控助理", education: "本科及以上",
    majors: [{ group: "文法大类", list: ["新闻学"] }],
    mbti: ["INFJ", "ISTJ"], certificates: "无硬性证书",
    work: "全网品牌舆情监测，负面信息记录，舆情简报撰写，舆情台账维护",
    workTime: "大小周，突发舆情加班", salary: "5.6k-8.9k / 月", restrictions: "需要不定时监测网络信息"
  },
  {
    id: 140, category: "市场新媒体品牌", name: "线下门店企划助理", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }],
    mbti: ["ESFJ", "ENFP"], certificates: "无硬性证书",
    work: "门店促销活动策划，物料设计对接，门店活动落地协助，活动数据复盘",
    workTime: "大小周，门店活动周末加班", salary: "5k-7.9k / 月", restrictions: "门店现场外勤"
  },
  {
    id: 141, category: "市场新媒体品牌", name: "商品选品助理", education: "大专",
    majors: [{ group: "管理大类", list: ["电子商务"] }],
    mbti: ["ESTJ", "INTP"], certificates: "无硬性证书",
    work: "商品资料收集，竞品价格对比，样品信息登记，选品台账整理",
    workTime: "朝九晚五双休", salary: "5.1k-8k / 月", restrictions: "样品查看，少量仓库走访"
  },
  {
    id: 142, category: "市场新媒体品牌", name: "直播商品链接助理", education: "大专",
    majors: [{ group: "管理大类", list: ["电子商务"] }],
    mbti: ["ISTJ", "ESFJ"], certificates: "无硬性证书",
    work: "直播间商品链接上架，价格库存维护，商品资料录入，直播商品台账",
    workTime: "轮班制，晚班直播", salary: "4.8k-7.7k / 月", restrictions: "直播晚班"
  },

  /* ============ 五、技术 / 数据研发助理（143–178） ============ */
  {
    id: 143, category: "技术/数据研发助理", name: "数据录入员", education: "高中/中专/职高",
    majors: [{ group: "不限专业", list: [] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "计算机基础证书",
    work: "录入业务单据、整理电子档案、核对数据准确性，保证录入零差错",
    workTime: "朝九晚五双休", salary: "3.5k-6k / 月", restrictions: "久坐办公，不能久站，无夜班，无粉尘环境"
  },
  {
    id: 144, category: "技术/数据研发助理", name: "数据分析师助理", education: "本科及以上",
    majors: [{ group: "统计学类", list: ["统计学", "应用统计学"] }, { group: "计算机大类", list: ["数据科学与大数据技术"] }],
    mbti: ["INTJ", "INTP", "ISTJ"], certificates: "计算机二级、SQL 证书优先",
    work: "业务数据提取清洗，制作可视化报表，整理分析文档，数据台账维护",
    workTime: "朝九晚五双休，月末季度末加班", salary: "6.3k-10k / 月", restrictions: "长时间电脑办公，久坐，无外勤体力"
  },
  {
    id: 145, category: "技术/数据研发助理", name: "BI 报表助理", education: "本科及以上",
    majors: [{ group: "统计学类", list: [] }, { group: "计算机大类", list: ["计算机科学与技术", "大数据技术"] }],
    mbti: ["INTP", "ISTJ"], certificates: "BI 证书优先",
    work: "报表模板维护，数据核对，仪表盘更新，数据字典整理，报表文档归档",
    workTime: "朝九晚五双休，结算期加班", salary: "6k-9.7k / 月", restrictions: "久坐电脑办公，无外勤"
  },
  {
    id: 146, category: "技术/数据研发助理", name: "数据库运维助理", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术", "数据库技术"] }],
    mbti: ["INTP", "ISTP"], certificates: "数据库相关证书优先",
    work: "数据备份巡检，日志查看，基础数据查询，运维文档编写归档",
    workTime: "朝九晚五双休，故障需要应急值班", salary: "6.4k-10.2k / 月", restrictions: "室内办公，应急值班，不能熬夜慎选"
  },
  {
    id: 147, category: "技术/数据研发助理", name: "市场数据助理", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }, { group: "统计学类", list: [] }],
    mbti: ["ISTJ", "INTJ"], certificates: "Excel 高级证书优先",
    work: "收集行业竞品数据，整理市场调研问卷，汇总统计表格，撰写数据简报",
    workTime: "朝九晚五双休", salary: "5.2k-8.3k / 月", restrictions: "久坐办公，无外勤体力"
  },

  /* ============ 六、文职辅助岗（148–215） ============ */
  {
    id: 148, category: "文职辅助岗", name: "档案装订", education: "中专",
    majors: [{ group: "文法大类", list: ["档案管理", "文秘"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "档案管理员证、秘书证",
    work: "整理案卷、打孔、装订、贴封条、编号",
    workTime: "朝九晚五，双休", salary: "3200-4500 / 月", restrictions: "久坐，轻度用眼；无重体力，库房注意防尘"
  },
  {
    id: 149, category: "文职辅助岗", name: "档案电子化扫描", education: "中专",
    majors: [{ group: "文法大类", list: ["档案管理", "文秘"] }, { group: "管理大类", list: ["信息管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "档案管理员证、计算机一级",
    work: "拆卷、扫描、图像纠偏、录入文件名、质检",
    workTime: "朝九晚五，双休", salary: "3300-4600 / 月", restrictions: "长时间看电脑，库房防尘；不能严重色弱"
  },
  {
    id: 150, category: "文职辅助岗", name: "纸质文件分类整理", education: "中专",
    majors: [{ group: "文法大类", list: ["文秘", "图书情报"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "秘书证、档案管理员证",
    work: "分拣文件、按年度/类别分组、排序、装袋",
    workTime: "朝九晚五，双休", salary: "3100-4400 / 月", restrictions: "久坐，偶尔搬运文件；对粉尘敏感慎选"
  },
  {
    id: 151, category: "文职辅助岗", name: "资料目录编制", education: "大专",
    majors: [{ group: "文法大类", list: ["档案学", "汉语言"] }, { group: "管理大类", list: ["信息管理"] }],
    mbti: ["ISTJ", "INFJ"], certificates: "档案管理员证",
    work: "核对资料、编写条目、录入目录表、核对页码",
    workTime: "朝九晚五，双休", salary: "3400-4800 / 月", restrictions: "长时间电脑文字录入，用眼较多"
  },
  {
    id: 152, category: "文职辅助岗", name: "过期文件销毁登记", education: "中专",
    majors: [{ group: "文法大类", list: ["文秘"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ"], certificates: "档案管理员证",
    work: "筛选待销毁文件、登记清单、监销、留存销毁记录",
    workTime: "朝九晚五，双休", salary: "3200-4500 / 月", restrictions: "销毁现场粉尘大，呼吸道敏感谨慎"
  },
  {
    id: 153, category: "文职辅助岗", name: "会议签到表整理", education: "中专",
    majors: [{ group: "文法大类", list: ["文秘"] }, { group: "管理大类", list: ["行政"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "秘书证",
    work: "收集签到表、扫描存档、统计缺席人员、录入台账",
    workTime: "朝九晚五，偶有加班（会议延后）", salary: "3100-4400 / 月", restrictions: "基本室内办公，无特殊限制"
  },
  {
    id: 154, category: "文职辅助岗", name: "会议录音转写片段校对", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言", "文秘", "新闻"] }],
    mbti: ["ISFJ", "INFJ"], certificates: "计算机一级、速录证（加分）",
    work: "听录音，核对转写文字，修正错别字、调整语句",
    workTime: "朝九晚五，会议多时加班", salary: "3500-5000 / 月", restrictions: "长时间戴耳机，听力偏弱不宜长时间做"
  },
  {
    id: 155, category: "文职辅助岗", name: "通知初稿文字润色", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言文学", "文秘"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["INFJ", "ISFJ"], certificates: "秘书证、公文写作证书（加分）",
    work: "修改通知语句、调整措辞、统一格式、校对语病",
    workTime: "朝九晚五，紧急通知需临时加班", salary: "3600-5200 / 月", restrictions: "长期电脑阅读，用眼疲劳"
  },
  {
    id: 156, category: "文职辅助岗", name: "表格数据校验", education: "中专",
    majors: [{ group: "财会大类", list: ["会计"] }, { group: "统计学类", list: ["统计"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ"], certificates: "计算机一级、初级统计证（加分）",
    work: "核对表格数字、查找错漏、标记异常数据、反馈修改",
    workTime: "朝九晚五，月底忙会加班", salary: "3300-4700 / 月", restrictions: "长时间盯着数字表格，高度用眼"
  },
  {
    id: 157, category: "文职辅助岗", name: "台账更新录入", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理", "信息管理"] }, { group: "财会大类", list: ["会计"] }],
    mbti: ["ISTJ"], certificates: "计算机一级",
    work: "把业务信息录入台账，定期更新、备份台账",
    workTime: "朝九晚五，月末加班", salary: "3300-4600 / 月", restrictions: "久坐电脑前，手腕易劳损"
  },
  {
    id: 158, category: "文职辅助岗", name: "报表格式统一调整", education: "大专",
    majors: [{ group: "统计学类", list: ["统计"] }, { group: "财会大类", list: ["会计"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ"], certificates: "计算机一级，Excel相关证书加分",
    work: "统一报表字体、行列、页眉，调整排版，检查打印效果",
    workTime: "朝九晚五，报送节点加班", salary: "3400-4800 / 月", restrictions: "长时间电脑操作"
  },
  {
    id: 159, category: "文职辅助岗", name: "数据简单汇总统计", education: "大专",
    majors: [{ group: "统计学类", list: ["统计学"] }, { group: "财会大类", list: ["会计"] }, { group: "管理大类", list: ["工商管理"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "初级统计师、计算机一级",
    work: "收集多份原始数据，求和计数，制作简易汇总表",
    workTime: "朝九晚五，月末/季度末加班", salary: "3600-5100 / 月", restrictions: "长期看大量数字，用眼压力大"
  },
  {
    id: 160, category: "文职辅助岗", name: "对外邮件初稿撰写", education: "大专",
    majors: [{ group: "外语类", list: ["商务英语"] }, { group: "文法大类", list: ["文秘"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "秘书证、商务英语证书（加分）",
    work: "根据需求写对外邮件，核对信息，等待审核发送",
    workTime: "朝九晚五，跨时区沟通偶尔延时", salary: "3700-5300 / 月", restrictions: "室内办公，久坐"
  },
  {
    id: 161, category: "文职辅助岗", name: "内部消息通知编辑", education: "中专",
    majors: [{ group: "文法大类", list: ["文秘"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "秘书证加分",
    work: "撰写内部简短通知，排版，发送到工作群，收集反馈",
    workTime: "朝九晚五，突发事项临时处理", salary: "3200-4600 / 月", restrictions: "室内办公，无特殊限制"
  },
  {
    id: 162, category: "文职辅助岗", name: "来电信息登记归档", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: ["文秘"] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "秘书证加分",
    work: "接听转接电话，记录来电人、事由，录入台账归档",
    workTime: "轮班较少，大多朝九晚五", salary: "3100-4400 / 月", restrictions: "长期接电话，耳部不适人群慎选"
  },
  {
    id: 163, category: "文职辅助岗", name: "来访人员登记整理", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: ["文秘"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "无硬性证书，保安证加分（前台岗）",
    work: "来访登记、核验信息、引导访客，每日整理登记本",
    workTime: "朝九晚五，部分岗位需提前到岗", salary: "3000-4300 / 月", restrictions: "需要站立接待，腿脚不便不适合长时间值守"
  },
  {
    id: 164, category: "文职辅助岗", name: "办公用品盘点", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理", "物流管理"] }],
    mbti: ["ISTJ"], certificates: "仓储管理员证加分",
    work: "清点文具耗材、核对库存、记录短缺，上报采购需求",
    workTime: "朝九晚五，盘点日略忙", salary: "3100-4400 / 月", restrictions: "偶尔搬箱子，弯腰清点货架"
  },
  {
    id: 165, category: "文职辅助岗", name: "耗材申领登记", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "无硬性证书",
    work: "接收申领单，登记领用信息，发放耗材，更新库存",
    workTime: "朝九晚五，双休", salary: "3000-4300 / 月", restrictions: "少量搬取物资，室内"
  },
  {
    id: 166, category: "文职辅助岗", name: "物资入库台账记录", education: "中专",
    majors: [{ group: "管理大类", list: ["物流管理", "行政管理"] }],
    mbti: ["ISTJ"], certificates: "仓储管理员证加分",
    work: "核对到货数量，登记入库信息，贴标识，录入系统",
    workTime: "朝九晚五，到货日加班", salary: "3200-4500 / 月", restrictions: "仓库走动，偶尔搬货；仓库闷热潮湿需注意"
  },
  {
    id: 167, category: "文职辅助岗", name: "物资出库核对", education: "中专",
    majors: [{ group: "管理大类", list: ["物流管理", "行政管理"] }],
    mbti: ["ISTJ"], certificates: "仓储管理员证加分",
    work: "核对出库单据，清点货物，登记出库台账",
    workTime: "朝九晚五，发货高峰期加班", salary: "3200-4500 / 月", restrictions: "仓库走动，搬取货物，体力要求一般"
  },
  {
    id: 168, category: "文职辅助岗", name: "仓库物品摆放规整", education: "中专",
    majors: [{ group: "管理大类", list: ["物流管理"] }],
    mbti: ["ISTJ"], certificates: "仓储管理员证加分",
    work: "整理货架、归类摆放物资、清理通道，保持仓库整齐",
    workTime: "朝九晚五", salary: "3100-4400 / 月", restrictions: "需要弯腰、搬物；仓库粉尘，腰伤、哮喘慎选"
  },
  {
    id: 169, category: "文职辅助岗", name: "固定资产标签核对", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "财会大类", list: ["会计"] }],
    mbti: ["ISTJ"], certificates: "资产管理相关培训证加分",
    work: "现场盘点设备，核对资产标签编号，记录资产状态",
    workTime: "朝九晚五，年度盘点加班", salary: "3300-4700 / 月", restrictions: "需要在办公楼多处走动，爬少量台阶"
  },
  {
    id: 170, category: "文职辅助岗", name: "设备使用登记收集", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "无硬性证书",
    work: "收集设备使用登记表，汇总信息，登记异常情况",
    workTime: "朝九晚五", salary: "3100-4400 / 月", restrictions: "室内办公，偶尔现场查看设备"
  },
  {
    id: 171, category: "文职辅助岗", name: "故障设备信息上报", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "理工环境类", list: ["机电相关"] }],
    mbti: ["ISFJ"], certificates: "无硬性证书",
    work: "收集设备故障描述，拍照记录，填写报修单，跟进维修进度",
    workTime: "朝九晚五，紧急故障临时对接", salary: "3200-4500 / 月", restrictions: "少量现场查看设备，无重体力"
  },
  {
    id: 172, category: "文职辅助岗", name: "会议室预约登记", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: ["文秘"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "秘书证加分",
    work: "登记会议室预约，排期，提醒使用人，冲突协调",
    workTime: "朝九晚五，晚间会议需配合", salary: "3100-4400 / 月", restrictions: "室内办公，偶尔到会议室检查"
  },
  {
    id: 173, category: "文职辅助岗", name: "会前设备调试检查", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "计算机大类", list: ["多媒体技术"] }],
    mbti: ["ISTP", "ISFJ"], certificates: "计算机一级，弱电证书加分",
    work: "会前检查投影、麦克风、网络，调试设备，排查故障",
    workTime: "朝九晚五，会议早到、延时加班", salary: "3300-4700 / 月", restrictions: "需要走动，搬运小型设备"
  },
  {
    id: 174, category: "文职辅助岗", name: "会后场地清理确认", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "无硬性证书",
    work: "会后检查会议室，收话筒、整理桌椅，检查遗留物品",
    workTime: "朝九晚五，会议结束晚则延后下班", salary: "3000-4300 / 月", restrictions: "走动，简单收拾，体力要求低"
  },
  {
    id: 175, category: "文职辅助岗", name: "宣传图片筛选", education: "大专",
    majors: [{ group: "文法大类", list: ["新媒体", "汉语言"] }, { group: "艺术设计大类", list: ["广告设计"] }],
    mbti: ["ISFP", "INFJ"], certificates: "PS证书、新媒体运营证书加分",
    work: "浏览素材，挑选符合宣传主题图片，标记可用/废弃素材",
    workTime: "朝九晚五，活动节点加班", salary: "3500-5000 / 月", restrictions: "长时间看图，用眼量大"
  },
  {
    id: 176, category: "文职辅助岗", name: "图文素材归档", education: "中专",
    majors: [{ group: "文法大类", list: ["档案管理", "新媒体"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "档案管理员证加分",
    work: "图片、文稿素材分类，命名，存入素材库，建立索引",
    workTime: "朝九晚五，双休", salary: "3200-4600 / 月", restrictions: "长期电脑，用眼疲劳"
  },
  {
    id: 177, category: "文职辅助岗", name: "公众号短文校对", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言", "新闻", "新媒体"] }],
    mbti: ["INFJ", "ISFJ"], certificates: "秘书证、新媒体证书加分",
    work: "校对公众号文稿错别字、标点，检查图片排版、链接",
    workTime: "朝九晚五，推文发布节点加班", salary: "3600-5200 / 月", restrictions: "长时间屏幕阅读"
  },
  {
    id: 178, category: "文职辅助岗", name: "活动方案细节核对", education: "大专",
    majors: [{ group: "管理大类", list: ["公共事业管理", "会展", "行政管理"] }],
    mbti: ["ISTJ", "ENTJ"], certificates: "会展策划证书加分",
    work: "核对活动流程、预算、时间节点、物料清单，标记漏洞",
    workTime: "朝九晚五，活动筹备期加班多", salary: "3800-5500 / 月", restrictions: "筹备期需要外出踩点，走动较多"
  },
  {
    id: 179, category: "文职辅助岗", name: "活动报名信息汇总", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ"], certificates: "计算机一级加分",
    work: "收集报名表，整理名单，统计人数，核对联系方式",
    workTime: "朝九晚五，报名截止期加班", salary: "3300-4700 / 月", restrictions: "长时间录入表格"
  },
  {
    id: 180, category: "文职辅助岗", name: "活动回执收集整理", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: ["文秘"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "无硬性证书",
    work: "催收回执，整理回执信息，汇总统计参会情况",
    workTime: "朝九晚五，活动前期加班", salary: "3200-4500 / 月", restrictions: "电脑办公，偶尔电话沟通"
  },
  {
    id: 181, category: "文职辅助岗", name: "合同文本错别字检查", education: "大专",
    majors: [{ group: "文法大类", list: ["法学", "汉语言", "文秘"] }],
    mbti: ["ISTJ", "INFJ"], certificates: "企业法律顾问（加分），秘书证",
    work: "通读合同全文，查找错别字、标点错误，标记表述问题",
    workTime: "朝九晚五，合同集中审核期加班", salary: "3700-5400 / 月", restrictions: "长时间精读长文本，用眼压力大"
  },
  {
    id: 182, category: "文职辅助岗", name: "合同附件整理", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: ["文秘"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "档案管理员证加分",
    work: "收集合同配套附件，排序、复印、装订，和合同归档",
    workTime: "朝九晚五", salary: "3300-4700 / 月", restrictions: "整理纸质材料，少量搬文件"
  },
  {
    id: 183, category: "文职辅助岗", name: "合同到期提醒登记", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: ["法学"] }],
    mbti: ["ISTJ"], certificates: "档案管理员证加分",
    work: "建立合同台账，记录到期时间，提前发送到期提醒",
    workTime: "朝九晚五，双休", salary: "3400-4800 / 月", restrictions: "电脑台账维护，室内办公"
  },
  {
    id: 184, category: "文职辅助岗", name: "发票信息录入", education: "中专",
    majors: [{ group: "财会大类", list: ["会计", "财务管理"] }],
    mbti: ["ISTJ"], certificates: "初级会计证加分",
    work: "识别发票，录入发票代码金额，查验真伪，归档",
    workTime: "朝九晚五，月末、季末加班", salary: "3400-4800 / 月", restrictions: "长时间录入票据，用眼，精细识别"
  },
  {
    id: 185, category: "文职辅助岗", name: "报销单据初审", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学", "财务管理"] }],
    mbti: ["ISTJ"], certificates: "初级会计证",
    work: "检查报销单据完整性，核对票据、签字，不符合则退回",
    workTime: "朝九晚五，报销集中期加班", salary: "3600-5100 / 月", restrictions: "大量纸质单据翻阅，用眼"
  },
  {
    id: 186, category: "文职辅助岗", name: "票据分类粘贴辅助", education: "中专",
    majors: [{ group: "财会大类", list: ["会计"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "无硬性证书，初级会计加分",
    work: "按要求整理票据，分类粘贴到报销粘贴单",
    workTime: "朝九晚五，月底忙", salary: "3100-4400 / 月", restrictions: "精细手工操作，久坐"
  },
  {
    id: 187, category: "文职辅助岗", name: "差旅信息登记", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "计算机一级加分",
    work: "登记出差人员、目的地、时间，整理差旅申请资料",
    workTime: "朝九晚五", salary: "3200-4500 / 月", restrictions: "室内电脑办公"
  },
  {
    id: 188, category: "文职辅助岗", name: "人员考勤核对", education: "中专",
    majors: [{ group: "管理大类", list: ["人力资源管理", "行政管理"] }],
    mbti: ["ISTJ"], certificates: "人力资源管理师（四级加分）",
    work: "导出打卡记录，核对请假、加班，统计考勤异常",
    workTime: "朝九晚五，每月考勤结算加班", salary: "3300-4700 / 月", restrictions: "大量数据核对，电脑久坐"
  },
  {
    id: 189, category: "文职辅助岗", name: "请假条收集归档", education: "中专",
    majors: [{ group: "管理大类", list: ["人力", "行政管理"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "人力四级证书加分",
    work: "收集纸质/电子请假单，核对审批流程，归档录入系统",
    workTime: "朝九晚五", salary: "3100-4400 / 月", restrictions: "室内办公"
  },
  {
    id: 190, category: "文职辅助岗", name: "加班记录统计", education: "中专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ISTJ"], certificates: "人力四级加分",
    work: "收集加班审批单，核对时长，汇总月度加班台账",
    workTime: "朝九晚五，月底结算加班", salary: "3200-4500 / 月", restrictions: "电脑数据处理"
  },
  {
    id: 191, category: "文职辅助岗", name: "简历初步筛选", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "人力资源管理师四级加分",
    work: "阅读简历，对照岗位要求筛选候选人，标记合适人选",
    workTime: "朝九晚五，招聘旺季加班", salary: "3500-5000 / 月", restrictions: "大量阅读简历，用眼量大"
  },
  {
    id: 192, category: "文职辅助岗", name: "面试邀约消息发送", education: "中专",
    majors: [{ group: "管理大类", list: ["人力", "行政管理"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "人力四级加分",
    work: "电话/短信联系候选人，通知面试时间地点，确认到场",
    workTime: "朝九晚五，招聘季偶尔加班", salary: "3300-4700 / 月", restrictions: "频繁打电话，耳朵容易疲劳"
  },
  {
    id: 193, category: "文职辅助岗", name: "面试信息登记", education: "中专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "人力四级加分",
    work: "登记面试人员信息，记录面试结果，录入招聘台账",
    workTime: "朝九晚五，面试日延后下班", salary: "3200-4600 / 月", restrictions: "室内办公，偶尔接待面试者"
  },
  {
    id: 194, category: "文职辅助岗", name: "入职资料收集", education: "中专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "人力四级加分",
    work: "收集新员工身份证、学历证明，核验材料，整理入员工档案",
    workTime: "朝九晚五，集中入职期较忙", salary: "3300-4700 / 月", restrictions: "整理纸质材料，精细核对"
  },
  {
    id: 195, category: "文职辅助岗", name: "离职资料整理", education: "中专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "人力四级加分",
    work: "收集离职表单，核对交接材料，归档员工离职档案",
    workTime: "朝九晚五", salary: "3300-4700 / 月", restrictions: "室内办公"
  },
  {
    id: 196, category: "文职辅助岗", name: "培训通知下发", education: "中专",
    majors: [{ group: "管理大类", list: ["人力", "行政管理"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "人力四级加分",
    work: "撰写培训通知，下发全员，收集报名，解答培训疑问",
    workTime: "朝九晚五，培训前期加班", salary: "3300-4700 / 月", restrictions: "电脑办公+少量电话沟通"
  },
  {
    id: 197, category: "文职辅助岗", name: "培训签到整理", education: "中专",
    majors: [{ group: "管理大类", list: ["人力", "行政管理"] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "人力四级加分",
    work: "培训现场签到，会后整理签到表，统计参训、缺席人员",
    workTime: "朝九晚五，培训当天可能延时", salary: "3200-4500 / 月", restrictions: "培训现场需要到场值守"
  },
  {
    id: 198, category: "文职辅助岗", name: "培训问卷回收统计", education: "中专",
    majors: [{ group: "管理大类", list: ["人力"] }, { group: "统计学类", list: ["统计"] }],
    mbti: ["ISTJ"], certificates: "初级统计证加分",
    work: "回收培训问卷，录入问卷选项，统计满意度结果",
    workTime: "朝九晚五，培训结束后处理", salary: "3300-4700 / 月", restrictions: "大量问卷录入，久坐用眼"
  },
  {
    id: 199, category: "文职辅助岗", name: "制度文档版本备份", education: "大专",
    majors: [{ group: "文法大类", list: ["档案管理"] }, { group: "管理大类", list: ["信息管理"] }],
    mbti: ["ISTJ"], certificates: "档案管理员证、计算机证书加分",
    work: "收集制度文件不同版本，命名区分，云端+本地备份",
    workTime: "朝九晚五，双休", salary: "3400-4800 / 月", restrictions: "电脑文件管理"
  },
  {
    id: 200, category: "文职辅助岗", name: "文档权限登记", education: "大专",
    majors: [{ group: "管理大类", list: ["信息管理", "行政管理"] }],
    mbti: ["ISTJ"], certificates: "计算机证书加分",
    work: "登记文档访问人员，设置文档权限，记录权限变更",
    workTime: "朝九晚五，双休", salary: "3500-4900 / 月", restrictions: "电脑系统操作"
  },
  {
    id: 201, category: "文职辅助岗", name: "云盘文件归类", education: "中专",
    majors: [{ group: "管理大类", list: ["信息管理"] }, { group: "文法大类", list: ["文秘"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "计算机一级加分",
    work: "清理云盘，新建文件夹，移动文件，统一归类整理",
    workTime: "朝九晚五，双休", salary: "3200-4600 / 月", restrictions: "长时间电脑操作"
  },
  {
    id: 202, category: "文职辅助岗", name: "历史资料备份", education: "大专",
    majors: [{ group: "文法大类", list: ["档案管理"] }, { group: "管理大类", list: ["信息管理"] }],
    mbti: ["ISTJ"], certificates: "档案管理员证加分",
    work: "把历史纸质资料扫描、电子资料备份，校验备份完整性",
    workTime: "朝九晚五，定期备份任务", salary: "3400-4800 / 月", restrictions: "电脑+少量纸质整理"
  },
  {
    id: 203, category: "文职辅助岗", name: "外网信息摘抄", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言"] }, { group: "管理大类", list: ["信息管理"] }],
    mbti: ["INFJ", "ISTJ"], certificates: "计算机一级加分",
    work: "检索行业网站，摘抄有用信息，整理摘要文档",
    workTime: "朝九晚五", salary: "3400-4800 / 月", restrictions: "长时间网页浏览，用眼"
  },
  {
    id: 204, category: "文职辅助岗", name: "行业资讯剪贴整理", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: ["文秘"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "无硬性证书",
    work: "保存行业新闻，截图、摘录要点，汇总成资讯简报",
    workTime: "朝九晚五", salary: "3200-4600 / 月", restrictions: "电脑阅读摘录"
  },
  {
    id: 205, category: "文职辅助岗", name: "问题清单汇总", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理", "公共管理"] }],
    mbti: ["ISTJ", "INFJ"], certificates: "无硬性证书",
    work: "收集各岗位上报问题，汇总成清单，分类编号整理",
    workTime: "朝九晚五，检查迎检阶段加班", salary: "3500-5000 / 月", restrictions: "文字整理，电脑办公"
  },
  {
    id: 206, category: "文职辅助岗", name: "整改资料收集", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "档案管理员证加分",
    work: "收集整改报告、佐证材料，核对材料完整性，装订归档",
    workTime: "朝九晚五，迎检期加班", salary: "3300-4700 / 月", restrictions: "翻阅大量纸质材料"
  },
  {
    id: 207, category: "文职辅助岗", name: "检查资料打包", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: ["档案管理"] }],
    mbti: ["ISTJ"], certificates: "档案管理员证加分",
    work: "按检查目录，收集全套资料，排序、打包、贴标签",
    workTime: "朝九晚五，迎检前期加班", salary: "3200-4500 / 月", restrictions: "搬运资料袋，弯腰整理，粉尘"
  },
  {
    id: 208, category: "文职辅助岗", name: "清单编号排序", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }, { group: "文法大类", list: ["档案"] }],
    mbti: ["ISTJ"], certificates: "档案管理员证加分",
    work: "给各类资料清单重新编号，调整顺序，核对序号不重不漏",
    workTime: "朝九晚五", salary: "3100-4400 / 月", restrictions: "精细核对序号，久坐"
  },
  {
    id: 209, category: "文职辅助岗", name: "纸质复印件整理", education: "中专",
    majors: [{ group: "文法大类", list: ["文秘"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "无硬性证书",
    work: "复印文件，分拣复印件，去除废页，按组整理装订",
    workTime: "朝九晚五", salary: "3000-4300 / 月", restrictions: "复印机周边有粉尘、臭氧，呼吸道敏感注意"
  },
  {
    id: 210, category: "文职辅助岗", name: "页码补标", education: "中专",
    majors: [{ group: "文法大类", list: ["档案管理", "文秘"] }],
    mbti: ["ISTJ"], certificates: "档案管理员证加分",
    work: "翻阅资料，给缺少页码的页面手写/打印补标页码，核对顺序",
    workTime: "朝九晚五", salary: "3100-4400 / 月", restrictions: "精细手工，长时间翻纸质材料"
  },
  {
    id: 211, category: "文职辅助岗", name: "页眉页脚统一", education: "中专",
    majors: [{ group: "文法大类", list: ["文秘"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISTJ"], certificates: "计算机一级加分",
    work: "批量打开Word文档，统一修改页眉、页脚、页码格式",
    workTime: "朝九晚五", salary: "3200-4500 / 月", restrictions: "长时间电脑文档编辑"
  },
  {
    id: 212, category: "文职辅助岗", name: "文件命名规范化", education: "中专",
    majors: [{ group: "文法大类", list: ["档案管理"] }, { group: "管理大类", list: ["信息管理"] }],
    mbti: ["ISTJ"], certificates: "档案管理员证加分",
    work: "批量重命名电子文档，统一命名规则，便于检索查找",
    workTime: "朝九晚五", salary: "3200-4500 / 月", restrictions: "电脑批量处理文件，用眼"
  },
  {
    id: 213, category: "文职辅助岗", name: "短信通知批量编辑", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理", "人力"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "无硬性证书",
    work: "编辑短信模板，导入名单，批量发送通知，收集反馈",
    workTime: "朝九晚五，通知节点加班", salary: "3100-4400 / 月", restrictions: "电脑操作，偶尔电话答疑"
  },
  {
    id: 214, category: "文职辅助岗", name: "反馈信息归集", education: "中专",
    majors: [{ group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "无硬性证书",
    work: "收集各方反馈意见，整理汇总，分类登记形成反馈台账",
    workTime: "朝九晚五", salary: "3200-4500 / 月", restrictions: "电脑录入整理"
  },
  {
    id: 215, category: "文职辅助岗", name: "工作备忘整理", education: "中专",
    majors: [{ group: "文法大类", list: ["文秘"] }, { group: "管理大类", list: ["行政管理"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "秘书证加分",
    work: "收集零散工作备忘，整理归档，提炼待办事项清单",
    workTime: "朝九晚五", salary: "3100-4400 / 月", restrictions: "室内电脑办公"
  },

  /* ============ 七、生产供应链 / 服务客服（216–275） ============ */
  {
    id: 216, category: "生产供应链/服务客服", name: "仓储分拣员（电商仓）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "手持 PDA 拣货，按订单把商品从货架取出放入周转箱，归置货架空余位置",
    workTime: "早中班轮班，月休 4 天，大促加班", salary: "3200-4400 / 月", restrictions: "需要仓库走动、偶尔搬轻货；无特殊身体限制，基础体能即可"
  },
  {
    id: 217, category: "生产供应链/服务客服", name: "仓储打包员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "核对拣好的订单商品，套袋、装箱、封胶带、贴快递面单",
    workTime: "轮班，电商大促加班，月休 4 天", salary: "3100-4300 / 月", restrictions: "站立 + 手部重复操作；无特殊身体限制，基础体能即可"
  },
  {
    id: 218, category: "生产供应链/服务客服", name: "仓库理货员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "到货商品上架，整理货架，把乱放商品归位，盘点数量",
    workTime: "长白班为主，月休 4 天", salary: "3000-4200 / 月", restrictions: "走动，偶尔搬货；无特殊身体限制，基础体能即可"
  },
  {
    id: 219, category: "生产供应链/服务客服", name: "商超理货员（连锁超市）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "货架补货，整理排面，把歪掉商品摆正，清理临期商品上报",
    workTime: "早晚轮班，月休 4 天", salary: "2800-3800 / 月", restrictions: "长时间站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 220, category: "生产供应链/服务客服", name: "商超收银员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "不强制，有无均可",
    work: "扫码收银，收款找零，打包顾客商品，整理收银台",
    workTime: "轮班，节假日在岗，月休 4 天", salary: "2900-3900 / 月", restrictions: "久坐站立交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 221, category: "生产供应链/服务客服", name: "商场保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "清扫商场过道，擦拭扶梯，清理垃圾桶，卫生间保洁",
    workTime: "分段早班，月休 4 天", salary: "2600-3600 / 月", restrictions: "长期走动弯腰；无特殊身体限制，基础体能即可"
  },
  {
    id: 222, category: "生产供应链/服务客服", name: "写字楼保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "清扫办公楼层，拖地，倒垃圾，擦拭公共区域门窗",
    workTime: "早班（上班前打扫），月休 4 天", salary: "2700-3700 / 月", restrictions: "弯腰、走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 223, category: "生产供应链/服务客服", name: "小区物业保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "楼道清扫，擦拭扶手，清理园区垃圾，定期清理垃圾桶",
    workTime: "白班，月休 4 天", salary: "2500-3500 / 月", restrictions: "爬低层楼梯；无特殊身体限制，基础体能即可"
  },
  {
    id: 224, category: "生产供应链/服务客服", name: "物业秩序员（小区保安）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可，保安证加分",
    work: "大门值守，登记外来人员车辆，园区巡逻，监控查看",
    workTime: "12 小时两班倒，月休 2-4 天", salary: "2900-4000 / 月", restrictions: "户外室内交替值守；无特殊身体限制，基础体能即可"
  },
  {
    id: 225, category: "生产供应链/服务客服", name: "厂区保安", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可，保安证加分",
    work: "厂区出入口登记，查验出门货物，厂区定点巡逻",
    workTime: "两班倒，月休 2-4 天", salary: "3000-4100 / 月", restrictions: "户外值守；无特殊身体限制，基础体能即可"
  },
  {
    id: 226, category: "生产供应链/服务客服", name: "食堂后厨杂工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "健康证（必须，属于上岗证件，不是技能证书）",
    work: "择菜、清洗食材，清理操作台，清运泔水，打扫后厨",
    workTime: "早中晚分段班，月休 4 天", salary: "2700-3700 / 月", restrictions: "手部经常沾水；无特殊身体限制，基础体能即可"
  },
  {
    id: 227, category: "生产供应链/服务客服", name: "食堂洗碗工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "健康证（必须）",
    work: "回收餐盘，冲洗油污，放入消毒柜，整理干净餐具",
    workTime: "午晚高峰在岗，月休 4 天", salary: "2600-3600 / 月", restrictions: "热水 + 清洁剂，手部皮肤病慎选；其余无特殊身体限制"
  },
  {
    id: 228, category: "生产供应链/服务客服", name: "面包厂包装普工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "健康证（必须）",
    work: "流水线给面包装袋、封口，贴生产日期标签，装箱码放",
    workTime: "长白班 / 两班倒，旺季加班，月休 2-4 天", salary: "3000-4100 / 月", restrictions: "久坐，重复手部动作；无特殊身体限制，基础体能即可"
  },
  {
    id: 229, category: "生产供应链/服务客服", name: "零食厂成品贴标工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "健康证（必须）",
    work: "在零食包装袋粘贴标签，检查漏贴、歪标，不合格挑出",
    workTime: "两班倒，月休 2-4 天", salary: "2900-4000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 230, category: "生产供应链/服务客服", name: "电子厂坐班普工（组装）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "流水线简单组装小件电子产品，按工位固定步骤操作",
    workTime: "两班倒，月休 2-4 天", salary: "3300-4500 / 月", restrictions: "久坐精细手部操作；无特殊身体限制，基础体能即可"
  },
  {
    id: 231, category: "生产供应链/服务客服", name: "电子厂外观检验员（简单目检）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "肉眼查看产品表面划痕、黑点，挑出不良品单独放置",
    workTime: "两班倒，月休 2-4 天", salary: "3200-4400 / 月", restrictions: "用眼，重度色弱不适合；其余无特殊身体限制"
  },
  {
    id: 232, category: "生产供应链/服务客服", name: "快递网点分拣员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "流水线分拣包裹，按目的地分到对应格口，摆放整齐",
    workTime: "中班为主，大促加班，月休 2-4 天", salary: "3200-4400 / 月", restrictions: "站立作业；无特殊身体限制，基础体能即可"
  },
  {
    id: 233, category: "生产供应链/服务客服", name: "快递扫码员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "扫码枪扫描快递面单，确认路由信息，异常包裹单独挑出",
    workTime: "中班，月休 2-4 天", salary: "3100-4300 / 月", restrictions: "站立，手部重复动作；无特殊身体限制，基础体能即可"
  },
  {
    id: 234, category: "生产供应链/服务客服", name: "酒店客房保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "部分门店要求健康证",
    work: "退房客房更换布草，打扫卫生间，吸尘，清理客房垃圾",
    workTime: "白班，旅游旺季加班，月休 4 天", salary: "2800-3900 / 月", restrictions: "需要拉扯床品；无特殊身体限制，基础体能即可"
  },
  {
    id: 235, category: "生产供应链/服务客服", name: "酒店 PA 公共保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "酒店走廊、大堂、电梯清洁，公共卫生间清扫，垃圾清运",
    workTime: "轮班，月休 4 天", salary: "2700-3700 / 月", restrictions: "走动较多；无特殊身体限制，基础体能即可"
  },
  {
    id: 236, category: "生产供应链/服务客服", name: "家政保洁（上门钟点）", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "上门客户家里打扫卫生，擦窗、拖地、清理厨房卫生间",
    workTime: "白班，客户预约时间，月休 4 天", salary: "3200-4500 / 月", restrictions: "弯腰、爬梯子；无特殊身体限制，基础体能即可"
  },
  {
    id: 237, category: "生产供应链/服务客服", name: "生鲜超市理货员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "健康证（必须）",
    work: "蔬果上架，整理排面，挑出腐烂果蔬，清理台面，称重打包",
    workTime: "早班 + 轮班，节假日在岗，月休 3-4 天", salary: "2800-3800 / 月", restrictions: "站立，偶尔搬货；无特殊身体限制，基础体能即可"
  },
  {
    id: 238, category: "生产供应链/服务客服", name: "生鲜杀鱼辅助工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "健康证（必须）",
    work: "协助处理水产，清理台面血水，冲洗地面，清理水产垃圾",
    workTime: "早班，月休 3-4 天", salary: "2900-4000 / 月", restrictions: "接触腥味血水，气味敏感慎选；其余无特殊身体限制"
  },
  {
    id: 239, category: "生产供应链/服务客服", name: "汽车美容学徒 / 擦车工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "车辆冲洗、擦干，擦拭内饰缝隙，清理脚垫垃圾",
    workTime: "轮班，周末忙，月休 4 天", salary: "2800-3900 / 月", restrictions: "经常沾水；无特殊身体限制，基础体能即可"
  },
  {
    id: 240, category: "生产供应链/服务客服", name: "废品站分拣工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "废纸、塑料瓶、金属分类堆放，简单打包，清理场地垃圾",
    workTime: "白班，月休 2-4 天", salary: "2900-4000 / 月", restrictions: "环境粉尘，呼吸道敏感慎选；其余无特殊身体限制"
  },
  {
    id: 241, category: "生产供应链/服务客服", name: "绿化养护工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "绿化带拔草、修剪枯枝，捡拾垃圾，浇水养护绿植",
    workTime: "白班，夏季早开工，月休 4 天", salary: "2700-3700 / 月", restrictions: "户外弯腰作业；无特殊身体限制，基础体能即可"
  },
  {
    id: 242, category: "生产供应链/服务客服", name: "市政道路保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "清扫马路人行道，捡拾路面垃圾，清理垃圾桶",
    workTime: "早班，分段作业，月休 4 天", salary: "2600-3500 / 月", restrictions: "户外风吹日晒；无特殊身体限制，基础体能即可"
  },
  {
    id: 243, category: "生产供应链/服务客服", name: "纸品厂普工（纸盒折叠）", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "卡纸折成纸盒，扣合卡槽，堆叠成品，清理边角废料",
    workTime: "长白班，订单多时加班，月休 2-4 天", salary: "2800-3900 / 月", restrictions: "久坐手部重复动作；无特殊身体限制，基础体能即可"
  },
  {
    id: 244, category: "生产供应链/服务客服", name: "塑料厂修毛边普工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "用小刀修剪塑料产品多余毛边，挑残次品分开存放",
    workTime: "两班倒，月休 2-4 天", salary: "3000-4200 / 月", restrictions: "久坐精细操作；无特殊身体限制，基础体能即可"
  },
  {
    id: 245, category: "生产供应链/服务客服", name: "制衣厂剪线头工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "剪掉成衣表面多余线头，分拣成品衣物放入筐内",
    workTime: "长白班，赶货加班，月休 2-4 天", salary: "2900-4000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 246, category: "生产供应链/服务客服", name: "制衣厂成衣打包工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "折叠成衣，套包装袋，装箱，码放成品纸箱",
    workTime: "长白班，赶货加班，月休 2-4 天", salary: "2900-4000 / 月", restrictions: "久坐 + 偶尔搬箱；无特殊身体限制，基础体能即可"
  },
  {
    id: 247, category: "生产供应链/服务客服", name: "物流周转箱清洗工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "高压水枪冲洗物流塑料筐，去除残留污渍，晾干堆叠",
    workTime: "早班为主，月休 4 天", salary: "2800-3800 / 月", restrictions: "全身容易沾水；无特殊身体限制，基础体能即可"
  },
  {
    id: 248, category: "生产供应链/服务客服", name: "门店仓管助理（连锁生鲜）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "门店后仓收货核对数量，货品入库，整理后仓，登记损耗",
    workTime: "早班，月休 3-4 天", salary: "3000-4100 / 月", restrictions: "走动，偶尔搬货；无特殊身体限制，基础体能即可"
  },
  {
    id: 249, category: "生产供应链/服务客服", name: "洗车店普工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "冲洗车辆、打泡沫、擦洗车身，清理车内垃圾",
    workTime: "轮班，周末忙，月休 4 天", salary: "2800-4000 / 月", restrictions: "长期沾水；无特殊身体限制，基础体能即可"
  },
  {
    id: 250, category: "生产供应链/服务客服", name: "养老院护工助理", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "护工证加分，不强制",
    work: "协助老人送餐、搀扶散步，打扫房间，换洗床品",
    workTime: "轮班，月休 4 天", salary: "3100-4300 / 月", restrictions: "需要协助搀扶老人；无特殊身体限制，基础体能即可"
  },
  {
    id: 251, category: "生产供应链/服务客服", name: "养老院公共保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "清扫养老院走廊、活动室，清理卫生间，清运垃圾",
    workTime: "白班，月休 4 天", salary: "2600-3600 / 月", restrictions: "走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 252, category: "生产供应链/服务客服", name: "图文店装订辅助", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "打印文件整理、裁纸、装订成册，整理成品，清理纸屑",
    workTime: "朝九晚六，订单急时加班，月休 4 天", salary: "2900-4000 / 月", restrictions: "久坐，裁纸小心手部；无特殊身体限制，基础体能即可"
  },
  {
    id: 253, category: "生产供应链/服务客服", name: "图文店前台接待（简单）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "不强制，有无均可",
    work: "接待顾客，登记打印复印需求，整理文件，简单收银",
    workTime: "朝九晚六，月休 4 天", salary: "2800-3800 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 254, category: "生产供应链/服务客服", name: "宠物店保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "清理宠物笼子粪便，拖地消毒，清理店内毛发垃圾",
    workTime: "轮班，月休 4 天", salary: "2700-3700 / 月", restrictions: "动物毛发过敏慎选；其余无特殊身体限制"
  },
  {
    id: 255, category: "生产供应链/服务客服", name: "宠物店货品上架", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "宠物粮、零食、玩具上架，补齐货架，整理凌乱商品",
    workTime: "轮班，月休 4 天", salary: "2700-3700 / 月", restrictions: "站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 256, category: "生产供应链/服务客服", name: "搬家公司辅助工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "跟着师傅打包家具、搬运物品，上下楼，车辆装卸",
    workTime: "白班，订单多时加班，月休 4 天", salary: "3500-4800 / 月", restrictions: "搬重物，腰伤慎选；其余无特殊身体限制"
  },
  {
    id: 257, category: "生产供应链/服务客服", name: "石材厂成品清理普工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "清理石材表面灰尘、泥浆，分类摆放成品，打扫车间",
    workTime: "长白班，月休 2-4 天", salary: "3300-4500 / 月", restrictions: "粉尘较大，呼吸道敏感慎选；其余无特殊身体限制"
  },
  {
    id: 258, category: "生产供应链/服务客服", name: "门窗厂打包普工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "门窗配件分类打包，保护膜包裹型材，贴标识码放",
    workTime: "长白班，订单忙加班，月休 2-4 天", salary: "3200-4400 / 月", restrictions: "偶尔搬运型材；无特殊身体限制，基础体能即可"
  },
  {
    id: 259, category: "生产供应链/服务客服", name: "停车场收费员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "车辆进出收费，抬杆放行，登记车辆，整理收费台账",
    workTime: "12 小时两班倒，月休 4 天", salary: "2800-3800 / 月", restrictions: "岗亭值守；无特殊身体限制，基础体能即可"
  },
  {
    id: 260, category: "生产供应链/服务客服", name: "影院场务", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "不强制，有无均可",
    work: "检票，引导观众入场，散场清理影厅垃圾，检查座椅",
    workTime: "晚班为主，节假日在岗，月休 4 天", salary: "2900-3900 / 月", restrictions: "长时间站立走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 261, category: "生产供应链/服务客服", name: "游泳馆保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "清扫泳池外围地面，清理卫生间，更换垃圾桶，擦拭休息椅",
    workTime: "轮班，夏季忙，月休 4 天", salary: "2700-3700 / 月", restrictions: "环境潮湿；无特殊身体限制，基础体能即可"
  },
  {
    id: 262, category: "生产供应链/服务客服", name: "鲜花店理花辅助", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "修剪枯萎花瓣叶子，清理花桶废水，打扫店内卫生，整理花材",
    workTime: "早班，节日加班，月休 4 天", salary: "2600-3600 / 月", restrictions: "花粉过敏慎选；其余无特殊身体限制"
  },
  {
    id: 263, category: "生产供应链/服务客服", name: "冷库辅助装卸（生鲜仓）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "冷库内搬运生鲜货品，码放托盘，清点货物数量",
    workTime: "白班，月休 2-4 天", salary: "3400-4600 / 月", restrictions: "低温环境，风湿怕冷慎选；其余无特殊身体限制"
  },
  {
    id: 264, category: "生产供应链/服务客服", name: "米粉厂包装普工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "健康证（必须）",
    work: "成品米粉装袋，封口，装箱，贴产品标签",
    workTime: "长白班，旺季加班，月休 2-4 天", salary: "2900-4000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 265, category: "生产供应链/服务客服", name: "工地门卫", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "工地大门人员车辆登记，材料进出核对，夜间值守巡查",
    workTime: "两班倒，月休 2-4 天", salary: "2900-4000 / 月", restrictions: "户外值守；无特殊身体限制，基础体能即可"
  },
  {
    id: 266, category: "生产供应链/服务客服", name: "工地保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "清扫工地临时道路，清理建筑垃圾，洒水降尘",
    workTime: "白班，月休 2-4 天", salary: "2800-3900 / 月", restrictions: "户外粉尘大，呼吸道敏感慎选；其余无特殊身体限制"
  },
  {
    id: 267, category: "生产供应链/服务客服", name: "洗衣厂衣物分拣工", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "回收衣物按颜色、类型分拣，掏出口袋杂物",
    workTime: "长白班，月休 4 天", salary: "2800-3800 / 月", restrictions: "接触潮湿衣物；无特殊身体限制，基础体能即可"
  },
  {
    id: 268, category: "生产供应链/服务客服", name: "洗衣厂衣物折叠打包", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "烘干熨烫后的衣物折叠，套防尘袋，分类堆放",
    workTime: "长白班，月休 4 天", salary: "2800-3800 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 269, category: "生产供应链/服务客服", name: "桶装水送水助理", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "跟随配送师傅搬运桶装水，清点空桶，门店装卸",
    workTime: "白班，夏季订单多加班，月休 4 天", salary: "3200-4400 / 月", restrictions: "搬重物，腰伤慎选；其余无特殊身体限制"
  },
  {
    id: 270, category: "生产供应链/服务客服", name: "游乐场保洁", education: "小学",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，有无均可",
    work: "游乐区捡拾垃圾，擦拭游乐设施，清扫地面，清理卫生间",
    workTime: "轮班，周末节假日在岗，月休 4 天", salary: "2600-3600 / 月", restrictions: "户外；无特殊身体限制，基础体能即可"
  },
  {
    id: 271, category: "生产供应链/服务客服", name: "建材仓库理货员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "小件建材归类摆放，整理货架，清理仓库通道，清点货物",
    workTime: "长白班，月休 4 天", salary: "3100-4200 / 月", restrictions: "偶尔搬建材；无特殊身体限制，基础体能即可"
  },
  {
    id: 272, category: "生产供应链/服务客服", name: "蛋糕店后厨学徒助理", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "健康证（必须）",
    work: "清洗模具、工具，整理原材料，操作台清洁，成品打包",
    workTime: "早班，节假日忙，月休 4 天", salary: "2800-3800 / 月", restrictions: "长时间站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 273, category: "生产供应链/服务客服", name: "快递驿站入库员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，有无均可",
    work: "包裹入库扫码，货架摆放，短信通知取件，整理货架",
    workTime: "下午至晚间，月休 4 天", salary: "3000-4100 / 月", restrictions: "站立走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 274, category: "生产供应链/服务客服", name: "快递驿站出库员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "不强制，有无均可",
    work: "核对取件码，找出包裹，扫码出库，接待取件客户",
    workTime: "下午至晚间，月休 4 天", salary: "3000-4100 / 月", restrictions: "站立接待；无特殊身体限制，基础体能即可"
  },
  {
    id: 275, category: "生产供应链/服务客服", name: "生鲜分拣员（朴朴 / 美团前置仓）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "健康证（必须）",
    work: "根据线上订单拣选蔬果日用品，称重打包，放到待配送区",
    workTime: "早中班轮班，晚高峰忙，月休 4 天", salary: "3200-4400 / 月", restrictions: "仓库走动，站立；无特殊身体限制，基础体能即可"
  },

  /* ============ 八、教育教培（276–282） ============ */
  {
    id: 276, category: "教育教培", name: "私立中小学学科教师（语文 / 数学 / 英语）", education: "本科",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "对应学科教师资格证（硬性）", requiredCert: "教师资格证",
    work: "班级授课、备课批改作业、家校沟通、组织班会，参与月考与教研",
    workTime: "早八晚五，双休，寒暑假，法定节假日", salary: "5000-9000 / 月", restrictions: "长时间站立讲课；无特殊身体限制，基础体能即可"
  },
  {
    id: 277, category: "教育教培", name: "培训机构补习班学科老师（中小学晚辅 / 小班课）", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "教师资格证优先，部分小型机构可入职后考取",
    work: "小班授课、作业辅导、讲解习题，学情反馈家长，维护课堂纪律",
    workTime: "周三至周日上班，周中休，晚上 + 周末为主", salary: "4500-8000（底薪 + 课时提成）", restrictions: "长时间站立讲课；无特殊身体限制，基础体能即可"
  },
  {
    id: 278, category: "教育教培", name: "幼儿园主班幼师", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "幼儿教师资格证（硬性）", requiredCert: "教师资格证",
    work: "设计幼儿教学活动，看护幼儿，组织游戏、手工，和家长沟通，记录幼儿日常",
    workTime: "早八晚五，双休，寒暑假轮休", salary: "3200-5000 / 月", restrictions: "需要蹲起、看护孩子；无特殊身体限制，基础体能即可"
  },
  {
    id: 279, category: "教育教培", name: "幼儿园保育员（幼教配套岗，门槛更低）", education: "高中/初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "保育员证优先，部分园所入职培训考取，健康证必需要",
    work: "照顾幼儿吃饭、午睡，帮孩子穿衣洗漱，玩具教室清洁消毒，配合主班老师看护幼儿",
    workTime: "早八晚五，双休，寒暑假轮休", salary: "2800-3800 / 月", restrictions: "蹲起较多；无特殊身体限制，基础体能即可"
  },
  {
    id: 280, category: "教育教培", name: "培训机构助教（补习班助教，门槛低）", education: "高中/大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，普通话良好即可",
    work: "协助主讲老师维持课堂秩序，批改练习，辅导学生答疑，整理讲义，接待家长",
    workTime: "晚班、周末班为主，周中调休", salary: "3000-4500 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 281, category: "教育教培", name: "私立学校生活老师（寄宿制私立中小学）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "健康证",
    work: "管理寄宿学生宿舍，督促作息，宿舍卫生检查，关心学生生活，处理简单生活问题",
    workTime: "轮班，含晚间值守，月休 4 天，寒暑假轮休", salary: "3000-4200 / 月", restrictions: "夜间值班；无特殊身体限制，基础体能即可"
  },
  {
    id: 282, category: "教育教培", name: "艺术培训机构助教（美术 / 舞蹈）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "协助主教准备教具，辅助孩子练习，维持课堂秩序，课后整理教室，作品收纳",
    workTime: "周末 + 晚间为主，周中休息", salary: "2800-4200 / 月", restrictions: "站立；无特殊身体限制，基础体能即可"
  },

  /* ============ 九、医疗美容（283–290） ============ */
  {
    id: 283, category: "医疗美容", name: "医美主诊医师（医美医生）", education: "本科",
    majors: [{ group: "医学类", list: ["临床医学"] }],
    mbti: ["ISTJ"], certificates: "执业医师证、医美主诊资质（硬性）", requiredCert: "执业医师证",
    work: "面诊求美者，制定医美方案，开展手术 / 光电治疗，书写病历，术后随访",
    workTime: "轮班，一般白天为主，周末在岗", salary: "15k-40k，提成很高", restrictions: "长时间手术站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 284, category: "医疗美容", name: "医美护士（医美治疗护士）", education: "大专",
    majors: [{ group: "医学类", list: ["护理"] }],
    mbti: ["ISFJ"], certificates: "护士执业证（硬性）+ 健康证", requiredCert: "护士执业证",
    work: "术前准备、皮肤消毒，协助医生操作，仪器耗材管理，术后叮嘱客户，诊室消毒",
    workTime: "轮班，周末在岗，月休 4 天", salary: "5000-8000（底薪 + 绩效）", restrictions: "站立操作，接触消毒药剂；无特殊身体限制，基础体能即可"
  },
  {
    id: 285, category: "医疗美容", name: "医美咨询师（现场咨询，医美医院核心销售岗）", education: "中专/高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制，机构内部培训",
    work: "接待上门顾客，沟通需求，讲解医美项目，设计方案，跟进客户，预约项目",
    workTime: "早十晚七，轮班，周末在岗，月休 4 天", salary: "4500-12000（底薪 + 高额提成）", restrictions: "长时间接待沟通；无特殊身体限制，基础体能即可"
  },
  {
    id: 286, category: "医疗美容", name: "医美咨询助理（咨询师助理，门槛更低）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制",
    work: "协助咨询师接待客户，登记信息，整理病历资料，预约排期，客户回访，茶水接待",
    workTime: "早十晚七，轮班，月休 4 天", salary: "3200-4500 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 287, category: "医疗美容", name: "医美前台", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制，健康证优先",
    work: "客户进门接待、分诊引导，接听电话，登记预约，收银，前台物品管理",
    workTime: "早十晚七，轮班，月休 4 天", salary: "3000-4200 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 288, category: "医疗美容", name: "医美治疗师（光电皮肤操作师，非医师）", education: "中专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "美容师证，机构培训考核上岗",
    work: "光电仪器操作（光子、脱毛等皮肤类项目），皮肤基础护理，仪器清洁维护",
    workTime: "早十晚七，轮班，周末在岗", salary: "4000-7000 / 月", restrictions: "长时间站立操作；无特殊身体限制，基础体能即可"
  },
  {
    id: 289, category: "医疗美容", name: "医美医院后勤消毒员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "健康证",
    work: "医疗器械清洗、打包、消毒，手术室 / 治疗室清洁，医疗垃圾分类处理",
    workTime: "白班为主，月休 4 天", salary: "2900-3800 / 月", restrictions: "接触消毒用品；无特殊身体限制，基础体能即可"
  },
  {
    id: 290, category: "医疗美容", name: "医美市场专员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "线上线下活动拓客，社群维护，客户线索跟进，协助落地营销活动",
    workTime: "轮班，偶尔外出，月休 4 天", salary: "3500-9000 / 月", restrictions: "偶尔外出跑市场；无特殊身体限制，基础体能即可"
  },

  /* ============ 生产供应链 / 服务客服 追加（291–321） ============ */
  {
    id: 291, category: "生产供应链/服务客服", name: "连锁奶茶店店员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "健康证（必须）",
    work: "制作饮品、备料、点单收银、清洁操作台、整理物料",
    workTime: "轮班，晚班居多，月休 4 天", salary: "3000-4200 / 月", restrictions: "长时间站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 292, category: "生产供应链/服务客服", name: "中餐服务员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "健康证（必须）",
    work: "引客入座、点菜上菜、收盘、餐桌清洁，简单客诉处理",
    workTime: "午晚班，月休 4 天", salary: "2900-4000 / 月", restrictions: "站立走动多；无特殊身体限制，基础体能即可"
  },
  {
    id: 293, category: "生产供应链/服务客服", name: "传菜员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "健康证（必须）",
    work: "后厨出餐传递到包厢 / 大厅，回收空盘，清理传菜通道",
    workTime: "午晚班，月休 4 天", salary: "2800-3800 / 月", restrictions: "来回走动，端盘子；无特殊身体限制，基础体能即可"
  },
  {
    id: 294, category: "生产供应链/服务客服", name: "后厨切配（帮厨）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "健康证（必须）",
    work: "食材清洗、切菜、备料，厨具清洁，整理冷库食材",
    workTime: "午晚班，月休 4 天", salary: "3000-4200 / 月", restrictions: "站立，小心刀具；无特殊身体限制，基础体能即可"
  },
  {
    id: 295, category: "生产供应链/服务客服", name: "酒店前台接待", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "入住退房办理，登记身份证，接听电话，预订房间，收银",
    workTime: "三班倒，含夜班，月休 4 天", salary: "3200-4500 / 月", restrictions: "轮夜班；无特殊身体限制，基础体能即可"
  },
  {
    id: 296, category: "生产供应链/服务客服", name: "景区票务员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制",
    work: "售票、核验门票，引导游客，解答基础咨询，清点票款",
    workTime: "白班为主，节假日在岗，淡季轮休", salary: "3000-4000 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 297, category: "生产供应链/服务客服", name: "景区运营助理（乐园 / 文旅小镇）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "游客引导，维持项目排队秩序，简单设备检查，场地保洁监督",
    workTime: "轮班，周末节假日上班，月休 4 天", salary: "3100-4300 / 月", restrictions: "户外站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 298, category: "生产供应链/服务客服", name: "4S 店洗车工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制",
    work: "车辆清洗、擦干、内饰吸尘，清洁洗车场地",
    workTime: "白班，周末忙，月休 4 天", salary: "2800-3800 / 月", restrictions: "经常沾水；无特殊身体限制，基础体能即可"
  },
  {
    id: 299, category: "生产供应链/服务客服", name: "4S 店展厅前台", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "客户进门接待，登记来访客户，茶水，转接销售，整理前台资料",
    workTime: "朝九晚六，轮班，月休 4 天", salary: "3000-4200 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 300, category: "生产供应链/服务客服", name: "汽修学徒", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制",
    work: "协助维修师傅拆换配件，工具整理，清理油污，车辆基础检查",
    workTime: "白班，偶尔加班抢修，月休 4 天", salary: "2500-3800 / 月（学徒低，后期上涨）", restrictions: "蹲起多，接触机油；无特殊身体限制，基础体能即可"
  },
  {
    id: 301, category: "生产供应链/服务客服", name: "宠物店美容助理", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "健康证",
    work: "宠物洗澡、吹干，清理美容台，笼舍打扫，宠物用品整理上架",
    workTime: "轮班，周末忙，月休 4 天", salary: "2900-4000 / 月", restrictions: "动物毛发过敏慎选；无特殊身体限制，基础体能即可"
  },
  {
    id: 302, category: "生产供应链/服务客服", name: "宠物医院助理（非兽医）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "健康证",
    work: "宠物保定，笼子清洁消毒，药品耗材整理，接待客户，协助兽医",
    workTime: "轮班，含夜班急诊，月休 4 天", salary: "3200-4500 / 月", restrictions: "接触消毒用品；无特殊身体限制，基础体能即可"
  },
  {
    id: 303, category: "生产供应链/服务客服", name: "地铁安检员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，岗前培训",
    work: "乘客行李安检，引导排队，违禁品检查，维持安检口秩序",
    workTime: "倒班，含早班晚班，月休 4 天", salary: "3000-4100 / 月", restrictions: "长时间站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 304, category: "生产供应链/服务客服", name: "养老机构护理员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "护理员证优先，健康证必需要",
    work: "协助老人洗漱、喂饭、翻身，陪同散步，简单生命体征观察，换洗床品",
    workTime: "轮班，含夜班值守，月休 4 天", salary: "3300-4600 / 月", restrictions: "体力消耗大；无特殊身体限制，基础体能即可"
  },
  {
    id: 305, category: "生产供应链/服务客服", name: "养老社工助理", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "社工证优先，不强制",
    work: "组织老人文娱活动，记录老人情况，对接家属，资料整理归档",
    workTime: "白班为主，月休 4 天", salary: "3000-4200 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 306, category: "生产供应链/服务客服", name: "殡葬服务引导员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制",
    work: "接待家属，告别厅引导，流程讲解，协助办理手续，安抚家属情绪",
    workTime: "轮班，节假日在岗，月休 4 天", salary: "3600-5000 / 月", restrictions: "情绪压力较大；无特殊身体限制，基础体能即可"
  },
  {
    id: 307, category: "生产供应链/服务客服", name: "陵园保洁", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制",
    work: "园区道路清扫、杂草清理、垃圾桶清运，擦拭公共设施",
    workTime: "白班，清明等高峰期加班，月休 4 天", salary: "2600-3500 / 月", restrictions: "户外作业；无特殊身体限制，基础体能即可"
  },
  {
    id: 308, category: "生产供应链/服务客服", name: "外卖骑手（专送）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "身份证、健康证，电动车",
    work: "平台接单，门店取餐，准时配送，和客户沟通，异常订单上报",
    workTime: "分段排班，午晚高峰，月休 4 天", salary: "4000-7000 / 月（多劳多得）", restrictions: "户外骑行，风吹日晒；无特殊身体限制，基础体能即可"
  },
  {
    id: 309, category: "生产供应链/服务客服", name: "快递员（网点派送）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "身份证",
    work: "到港快件分拣、上门派送、收件，客户电话沟通，处理快件问题",
    workTime: "白班为主，双 11 大促加班，月休 4 天", salary: "4200-7000 / 月", restrictions: "户外搬件；无特殊身体限制，基础体能即可"
  },
  {
    id: 310, category: "生产供应链/服务客服", name: "货运司机（4.2 米厢货）", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "C1 驾驶证", requiredCert: "驾驶证",
    work: "按照订单提货送货，装卸协助，检查车辆，签收单据",
    workTime: "白班为主，订单多时加班，月休 4 天", salary: "5000-9000 / 月", restrictions: "长时间开车，偶尔装卸货物；无特殊身体限制，基础体能即可"
  },
  {
    id: 311, category: "生产供应链/服务客服", name: "网约车司机", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "C1 驾照、网约车人证车证", requiredCert: "网约车",
    work: "平台接单，接送乘客，车辆日常检查，保持车内整洁",
    workTime: "自主排班，月休灵活", salary: "4500-8000 / 月", restrictions: "长时间久坐开车；无特殊身体限制，基础体能即可"
  },
  {
    id: 312, category: "生产供应链/服务客服", name: "会展搭建助理", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制",
    work: "展会进场搭建，搬运展具，组装展台，展期现场维护，撤展打包",
    workTime: "项目制，展会期间加班，项目间隙调休", salary: "3500-5000 / 月", restrictions: "体力活；无特殊身体限制，基础体能即可"
  },
  {
    id: 313, category: "生产供应链/服务客服", name: "会展现场接待", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "展馆门口签到、引导来宾，发放资料，接待咨询，维持现场秩序",
    workTime: "展期在岗，非展期轮休", salary: "3200-4400 / 月", restrictions: "长时间站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 314, category: "生产供应链/服务客服", name: "婚庆布置助理", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制",
    work: "婚礼现场花艺、道具搬运，舞台搭建，婚礼结束后拆除清理",
    workTime: "周末、节假日为主，平日调休", salary: "3300-4800 / 月", restrictions: "体力活；无特殊身体限制，基础体能即可"
  },
  {
    id: 315, category: "生产供应链/服务客服", name: "婚庆前台客服", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "接待咨询新人，介绍套餐，预约看场地，跟进客户，整理案例资料",
    workTime: "轮班，周末在岗，月休 4 天", salary: "3200-4500 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 316, category: "生产供应链/服务客服", name: "物业维修学徒", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "电工证后期考取，不强制入职就有",
    work: "跟着师傅，小区水电简单检修，更换灯泡、水龙头，管道疏通，工具整理",
    workTime: "白班，值班待命，月休 4 天", salary: "2800-4000 / 月", restrictions: "爬梯作业；无特殊身体限制，基础体能即可"
  },
  {
    id: 317, category: "生产供应链/服务客服", name: "物业水电维修工（持证）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "低压电工证硬性", requiredCert: "电工证",
    work: "园区、楼栋水电故障排查维修，设备巡检，维修记录填写",
    workTime: "轮班，需要应急值班，月休 4 天", salary: "3800-5500 / 月", restrictions: "登高作业；无特殊身体限制，基础体能即可"
  },
  {
    id: 318, category: "生产供应链/服务客服", name: "物业绿化工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制",
    work: "小区绿植修剪、浇水、除草，施肥，清理枯枝落叶，园林垃圾清运",
    workTime: "白班，夏季早开工，月休 4 天", salary: "2700-3700 / 月", restrictions: "户外作业；无特殊身体限制，基础体能即可"
  },
  {
    id: 319, category: "生产供应链/服务客服", name: "建材门店销售顾问", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "接待到店客户，介绍瓷砖 / 板材等产品，带看样品，跟进客户报价",
    workTime: "轮班，周末在岗，月休 4 天", salary: "3500-8000（底薪 + 提成）", restrictions: "门店走动接待；无特殊身体限制，基础体能即可"
  },
  {
    id: 320, category: "生产供应链/服务客服", name: "装修工地杂工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制",
    work: "材料搬运，工地清扫，垃圾清运，协助师傅打下手",
    workTime: "白班，月休 4 天", salary: "3400-4800 / 月", restrictions: "体力活，粉尘；呼吸道敏感慎选"
  },
  {
    id: 321, category: "生产供应链/服务客服", name: "电商仓库打包发货员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制",
    work: "订单打包、填充、贴快递单，打包成品堆放，纸箱物料整理",
    workTime: "轮班，大促加班，月休 4 天", salary: "3100-4300 / 月", restrictions: "站立手部重复操作；无特殊身体限制，基础体能即可"
  },

  /* ============ 企业职能文职 追加（322–328） ============ */
  {
    id: 322, category: "企业职能文职", name: "在线客服（纯文字，居家 / 办公室）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制",
    work: "线上回复客户咨询，登记问题，售后工单处理，投诉记录上报",
    workTime: "轮班，部分晚班，月休 4 天", salary: "3000-4200 / 月", restrictions: "长期久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 323, category: "企业职能文职", name: "电话客服（回访类，非强销售）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制",
    work: "客户电话回访，信息核对，通知活动，简单答疑，记录客户反馈",
    workTime: "朝九晚六，轮班，月休 4 天", salary: "3100-4300 / 月", restrictions: "久坐，长时间说话；无特殊身体限制，基础体能即可"
  },
  {
    id: 324, category: "企业职能文职", name: "公司行政助理", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "不强制，会基础电脑",
    work: "办公用品采购盘点，会议室预约，快递收发，考勤统计，接待访客",
    workTime: "朝九晚五，双休", salary: "3500-5000 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 325, category: "企业职能文职", name: "人事助理（招聘助理）", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "发布岗位，筛选简历，邀约面试，接待面试者，整理员工资料",
    workTime: "朝九晚五，双休", salary: "3600-5200 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 326, category: "企业职能文职", name: "银行大堂引导员（外包岗）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "不强制",
    work: "引导客户取号，自助机协助操作，分流客户，简单业务咨询指引",
    workTime: "朝九晚五，周末轮休", salary: "3200-4400 / 月", restrictions: "站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 327, category: "企业职能文职", name: "财务助理", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "初级会计证优先，不强制",
    work: "发票整理粘贴，凭证装订，银行回单打印，台账登记，资料归档",
    workTime: "朝九晚五，双休，月底忙时加班", salary: "3400-4800 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 328, category: "企业职能文职", name: "出纳", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "初级会计优先",
    work: "现金收付，银行转账，登记现金银行日记账，保管票据、印章",
    workTime: "朝九晚五，双休", salary: "3600-5200 / 月", restrictions: "久坐，细心要求高；无特殊身体限制，基础体能即可"
  },

  /* ============ 市场新媒体品牌 追加（329） ============ */
  {
    id: 329, category: "市场新媒体品牌", name: "短视频剪辑助理", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "不强制，会基础剪辑软件优先",
    work: "素材整理，粗剪，字幕添加，文件归档，拍摄简单素材",
    workTime: "朝九晚六，忙时加班，月休 4 天", salary: "3500-5000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 二十四、公关市场营销（330–337） ============ */
  {
    id: 330, category: "公关市场营销", name: "公关专员", education: "大专",
    majors: [{ group: "文法大类", list: ["广告学", "传播学"] }, { group: "管理大类", list: ["市场营销"] }],
    mbti: ["ESFJ"], certificates: "无强制，新媒体证书加分",
    work: "品牌公关稿件撰写，媒体对接，舆情监控，活动公关配合，维护媒体关系",
    workTime: "朝九晚六，活动期加班，月休4天", salary: "4000-6500 / 月", restrictions: "偶尔外出参加活动；无特殊身体限制，基础体能即可"
  },
  {
    id: 331, category: "公关市场营销", name: "市场助理/专员", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }, { group: "文法大类", list: ["广告学"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "活动物料准备，线上推广素材整理，数据统计，对接渠道，跟进活动落地",
    workTime: "朝九晚六，活动加班，月休4天", salary: "3600-5500 / 月", restrictions: "偶尔外出；无特殊身体限制，基础体能即可"
  },
  {
    id: 332, category: "公关市场营销", name: "产品/品牌经理", education: "本科",
    majors: [{ group: "管理大类", list: ["市场营销"] }, { group: "文法大类", list: ["广告学"] }],
    mbti: ["ENTJ"], certificates: "无强制",
    work: "品牌定位规划，产品卖点梳理，策划推广方案，监控品牌口碑，跨部门协调",
    workTime: "朝九晚六，项目忙时加班，双休居多", salary: "7000-13000 / 月", restrictions: "久坐开会多；无特殊身体限制，基础体能即可"
  },
  {
    id: 333, category: "公关市场营销", name: "渠道经理", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ENTP"], certificates: "无强制",
    work: "开发合作渠道，维护渠道商，制定渠道政策，跟进渠道回款，解决渠道问题",
    workTime: "外勤多，轮休，月休4天", salary: "6000-11000（底薪+提成）", restrictions: "经常外出跑客户；无特殊身体限制，基础体能即可"
  },
  {
    id: 334, category: "公关市场营销", name: "客户代表/营销代表", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "挖掘客户需求，介绍产品方案，跟进订单，维护老客户，定期回访",
    workTime: "外勤+办公室，月休4天", salary: "4500-9000（底薪+提成）", restrictions: "外出拜访；无特殊身体限制，基础体能即可"
  },
  {
    id: 335, category: "公关市场营销", name: "市场分析/调研", education: "大专",
    majors: [{ group: "统计学类", list: ["统计学"] }, { group: "管理大类", list: ["市场营销"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "设计调研问卷，收集行业竞品数据，整理调研报告，给市场方案提供数据支撑",
    workTime: "朝九晚六，双休", salary: "4200-6500 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 336, category: "公关市场营销", name: "CI设计与策划", education: "大专",
    majors: [{ group: "艺术大类", list: ["视觉传达", "设计"] }],
    mbti: ["ISFP"], certificates: "无强制，会PS/AI",
    work: "企业VI、LOGO、品牌整套视觉形象策划设计，规范品牌视觉使用标准",
    workTime: "朝九晚六，赶稿加班，月休4天", salary: "4800-7500 / 月", restrictions: "长时间对着电脑；无特殊身体限制，基础体能即可"
  },
  {
    id: 337, category: "公关市场营销", name: "广告文案/媒体策划/设计", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言", "广告学"] }, { group: "艺术大类", list: ["视觉设计"] }],
    mbti: ["ENFP"], certificates: "无强制",
    work: "短视频、海报、公众号文案撰写，媒体投放排期，广告素材策划",
    workTime: "朝九晚六，赶项目加班，月休4天", salary: "4300-7000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 二十五、贸易销售（338–345） ============ */
  {
    id: 338, category: "贸易销售", name: "国内贸易", education: "大专",
    majors: [{ group: "管理大类", list: ["国际经济与贸易"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "国内货源对接，询价报价，合同拟定，跟进发货对账，维护国内客户",
    workTime: "朝九晚六，月休4天", salary: "4500-8000（底薪+提成）", restrictions: "偶尔外出看货；无特殊身体限制，基础体能即可"
  },
  {
    id: 339, category: "贸易销售", name: "国外贸易/涉外业务", education: "大专",
    majors: [{ group: "管理大类", list: ["国际经济与贸易"] }, { group: "外语类", list: ["商务英语"] }],
    mbti: ["ESFJ"], certificates: "四六级优先",
    work: "开发海外客户，邮件、跨境平台沟通，外贸单据制作，跟进报关出货",
    workTime: "时差原因偶尔晚班，月休4天", salary: "5000-9500（底薪+提成）", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 340, category: "贸易销售", name: "跟单员", education: "高中",
    majors: [{ group: "管理大类", list: ["国际经济与贸易"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "订单跟进，核对样品、生产进度，对接工厂和客户，核对出货资料",
    workTime: "白班为主，赶订单加班，月休4天", salary: "3600-5000 / 月", restrictions: "坐站交替，偶尔下车间；无特殊身体限制，基础体能即可"
  },
  {
    id: 341, category: "贸易销售", name: "报关员", education: "大专",
    majors: [{ group: "管理大类", list: ["国际经济与贸易", "物流管理"] }],
    mbti: ["ISTJ"], certificates: "报关水平证书优先",
    work: "准备报关资料，向海关申报，跟进查验，处理通关问题，整理单证",
    workTime: "朝九晚六，船期忙时加班，月休4天", salary: "4200-6000 / 月", restrictions: "久坐，资料多；无特殊身体限制，基础体能即可"
  },
  {
    id: 342, category: "贸易销售", name: "销售经理/区域经理/商务经理", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ENTJ"], certificates: "无强制",
    work: "带销售小组，制定区域销售目标，开发大客户，管理下属，复盘业绩",
    workTime: "外勤多，月休4天", salary: "7000-14000（底薪+团队提成）", restrictions: "经常出差拜访客户；无特殊身体限制，基础体能即可"
  },
  {
    id: 343, category: "贸易销售", name: "销售工程师/销售代表", education: "大专",
    majors: [{ group: "理工环境类", list: ["机电", "工科"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "给客户讲解工业产品技术参数，方案演示，对接技术部门，跟进签单",
    workTime: "外勤，偶尔出差，月休4天", salary: "5500-10000（底薪+提成）", restrictions: "出差多；无特殊身体限制，基础体能即可"
  },
  {
    id: 344, category: "贸易销售", name: "销售助理/业务员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "整理客户资料，制作报价单，通知客户活动，协助业务员跟进订单",
    workTime: "朝九晚六，偶尔外出，月休4天", salary: "3300-4800 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 345, category: "贸易销售", name: "商务代表/商务助理/业务助理", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "商务对接，合同归档，会议记录，样品寄送，对账，客户信息登记",
    workTime: "朝九晚六，月休4天", salary: "3400-4900 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 二十六、财务（346–355） ============ */
  {
    id: 346, category: "财务", name: "财务经理/主任", education: "本科",
    majors: [{ group: "财会大类", list: ["会计学", "财务管理"] }],
    mbti: ["ISTJ"], certificates: "中级会计优先",
    work: "统筹全盘账务，财务制度制定，税务筹划，报表审核，管理财务团队",
    workTime: "朝九晚五，双休，月末、季报加班", salary: "8000-15000 / 月", restrictions: "久坐，对细心要求高；无特殊身体限制，基础体能即可"
  },
  {
    id: 347, category: "财务", name: "会计主管", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学"] }],
    mbti: ["ISTJ"], certificates: "中级会计优先",
    work: "审核凭证，核对账务，安排报税，管理会计小组，出具财务报表",
    workTime: "朝九晚五，双休，月底加班", salary: "6000-9500 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 348, category: "财务", name: "注册会计师", education: "本科",
    majors: [{ group: "财会大类", list: ["会计学", "审计学"] }],
    mbti: ["ISTJ"], certificates: "注册会计师CPA证书硬性", requiredCert: "注册会计师CPA证书",
    work: "审计企业账目，出具审计报告，专项审计，财务尽调",
    workTime: "项目制，忙季加班多，淡季调休", salary: "10000-20000+/月", restrictions: "长期久坐、出差；无特殊身体限制，基础体能即可"
  },
  {
    id: 349, category: "财务", name: "审计经理/主管/专员", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学", "审计学"] }],
    mbti: ["ISTJ"], certificates: "初级会计优先",
    work: "内部/外部审计，抽查凭证，查找财务风险，写审计底稿、审计报告",
    workTime: "项目制，经常出差", salary: "5000-9000 / 月", restrictions: "出差多，久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 350, category: "财务", name: "注册审计师", education: "本科",
    majors: [{ group: "财会大类", list: ["会计学", "审计学"] }],
    mbti: ["ISTJ"], certificates: "注册审计相关资质",
    work: "独立负责审计项目，把控审计风险，出具正式审计意见",
    workTime: "项目制，忙季加班出差", salary: "9000-18000 / 月", restrictions: "出差、久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 351, category: "财务", name: "统计", education: "大专",
    majors: [{ group: "统计学类", list: ["统计学"] }],
    mbti: ["ISTJ"], certificates: "统计证优先",
    work: "业务、生产数据收集汇总，做统计台账，制作数据报表，核对数据",
    workTime: "朝九晚五，双休", salary: "3500-5200 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 352, category: "财务", name: "计划", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "产销计划排程，物料需求计划，跟进生产进度，协调交期",
    workTime: "朝九晚五，订单紧张加班，月休4天", salary: "3800-5500 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 353, category: "财务", name: "稽核", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学"] }],
    mbti: ["ISTJ"], certificates: "初级会计优先",
    work: "单据、费用、账务复核，检查流程合规，发现异常上报",
    workTime: "朝九晚五，双休", salary: "3700-5400 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 354, category: "财务", name: "财务分析", education: "本科",
    majors: [{ group: "财会大类", list: ["会计学", "财务管理"] }],
    mbti: ["ISTJ"], certificates: "初级会计优先",
    work: "分析营收、成本、利润，出具财务分析报告，给管理层提供决策数据",
    workTime: "朝九晚五，双休，月底加班", salary: "5500-9000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 355, category: "财务", name: "成本分析/核算", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学"] }],
    mbti: ["ISTJ"], certificates: "初级会计优先",
    work: "产品成本归集核算，料工费统计，成本差异分析，成本台账维护",
    workTime: "朝九晚五，月底加班，月休4天", salary: "4500-7000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 二十七、行政人事（356–361） ============ */
  {
    id: 356, category: "行政人事", name: "行政经理/主管", education: "大专",
    majors: [{ group: "管理大类", list: ["行政管理"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "行政团队管理，行政预算管控，后勤、办公制度搭建，大型活动统筹",
    workTime: "朝九晚五，双休", salary: "5500-8500 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 357, category: "行政人事", name: "办公室主任", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "统筹办公室全部事务，上传下达，会议统筹，接待重要访客，协调各部门",
    workTime: "朝九晚五，双休，临时事项加班", salary: "6000-9500 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 358, category: "行政人事", name: "人力资源经理/专员/助理", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ESFJ"], certificates: "人力资源管理师证加分",
    work: "员工入转调离、员工关系，制度落地，员工档案管理，配合招聘绩效模块",
    workTime: "朝九晚五，双休", salary: "专员4000-6000；经理7500-12000", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 359, category: "行政人事", name: "培训经理/专员/助理", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }, { group: "教育类", list: ["师范"] }],
    mbti: ["ESFJ"], certificates: "培训师证书加分",
    work: "搭建员工培训体系，开发课件，组织新员工、岗位培训，培训效果评估",
    workTime: "朝九晚五，培训日加班，双休", salary: "专员4200-6200；经理7000-11000", restrictions: "需要上台讲课；无特殊身体限制，基础体能即可"
  },
  {
    id: 360, category: "行政人事", name: "薪酬福利经理/专员/助理", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ISTJ"], certificates: "人力证书加分",
    work: "核算工资、社保公积金，福利方案落地，薪酬台账维护，个税申报核对",
    workTime: "朝九晚五，发薪期加班，双休", salary: "专员4100-6000；经理7200-11500", restrictions: "久坐，对细心要求高；无特殊身体限制，基础体能即可"
  },
  {
    id: 361, category: "行政人事", name: "绩效考核经理/专员/助理", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ISTJ"], certificates: "人力证书加分",
    work: "绩效方案制定，绩效数据收集，绩效面谈组织，绩效结果统计归档",
    workTime: "朝九晚五，绩效周期加班，双休", salary: "专员4000-5800；经理7000-10500", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 二十八、文职（362–372） ============ */
  {
    id: 362, category: "文职", name: "图书情报/资料/文档管理", education: "大专",
    majors: [{ group: "文法大类", list: ["图书馆学", "档案学"] }],
    mbti: ["ISTJ"], certificates: "档案管理员证加分",
    work: "图书、档案、技术资料分类编号，借阅登记，资料扫描归档，库房整理",
    workTime: "朝九晚五，双休", salary: "3400-4800 / 月", restrictions: "偶尔整理重物档案；无特殊身体限制，基础体能即可"
  },
  {
    id: 363, category: "文职", name: "文秘/高级文员", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言", "文秘"] }],
    mbti: ["ISFJ"], certificates: "普通话证书加分",
    work: "领导日程安排，公文起草、会议纪要，文件收发归档，接待访客",
    workTime: "朝九晚五，临时加班，双休", salary: "3800-5500 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 364, category: "文职", name: "资料/文档撰写/编辑", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言", "新闻学"] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "项目材料、申报材料、宣传文稿撰写，稿件校对，资料排版整理",
    workTime: "朝九晚五，赶材料加班，月休4天", salary: "3700-5400 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 365, category: "文职", name: "计算机操作员/打字员/文员/校对", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "计算机一级优先",
    work: "文字录入，文稿校对，表格制作，文件扫描、排版",
    workTime: "朝九晚五，月休4天", salary: "3000-4200 / 月", restrictions: "长时间对着电脑；无特殊身体限制，基础体能即可"
  },
  {
    id: 366, category: "文职", name: "收发员/话务员/后勤", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "快递、报刊收发，转接电话，办公物资看管，后勤杂事配合",
    workTime: "白班为主，轮班，月休4天", salary: "2900-4000 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 367, category: "文职", name: "英语翻译", education: "大专",
    majors: [{ group: "外语类", list: ["英语", "翻译"] }],
    mbti: ["ISFJ"], certificates: "四六级、专四专八、CATTI加分",
    work: "笔译合同、资料，会议口译，外文文档校对",
    workTime: "朝九晚五，有外事任务加班，月休4天", salary: "5000-9000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 368, category: "文职", name: "日语翻译", education: "大专",
    majors: [{ group: "外语类", list: ["日语"] }],
    mbti: ["ISFJ"], certificates: "N1优先",
    work: "日语资料笔译，商务对接翻译，视频字幕翻译",
    workTime: "朝九晚五，对日时差偶尔晚班，月休4天", salary: "5200-9500 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 369, category: "文职", name: "法语翻译", education: "大专",
    majors: [{ group: "外语类", list: ["法语"] }],
    mbti: ["ISFJ"], certificates: "法语等级证书优先",
    work: "法语文档翻译，商务沟通翻译，海外资料处理",
    workTime: "朝九晚五，时差加班，月休4天", salary: "5500-10000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 370, category: "文职", name: "德语翻译", education: "大专",
    majors: [{ group: "外语类", list: ["德语"] }],
    mbti: ["ISFJ"], certificates: "德语等级证书优先",
    work: "德语技术文档、商务合同翻译，对接德方客户",
    workTime: "朝九晚五，时差加班，月休4天", salary: "5600-10500 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 371, category: "文职", name: "韩语翻译", education: "大专",
    majors: [{ group: "外语类", list: ["韩语"] }],
    mbti: ["ISFJ"], certificates: "TOPIK高级优先",
    work: "韩语资料笔译，韩企对接翻译，短视频字幕翻译",
    workTime: "朝九晚五，时差晚班，月休4天", salary: "5100-9200 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 372, category: "文职", name: "其它语种翻译", education: "大专",
    majors: [{ group: "外语类", list: ["小语种"] }],
    mbti: ["ISFJ"], certificates: "对应语种等级证优先",
    work: "对应语种资料翻译、商务口译",
    workTime: "朝九晚五，时差加班，月休4天", salary: "5400-11000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 二十九、客户服务（373–379） ============ */
  {
    id: 373, category: "客户服务", name: "客户服务经理", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "客服团队管理，客诉升级处理，服务流程优化，客户满意度管控",
    workTime: "轮班，周末在岗，月休4天", salary: "5500-9000 / 月", restrictions: "需要长时间沟通；无特殊身体限制，基础体能即可"
  },
  {
    id: 374, category: "客户服务", name: "技术支持/客户培训", education: "大专",
    majors: [{ group: "计算机大类", list: [] }, { group: "理工环境类", list: ["工科"] }],
    mbti: ["ESFJ"], certificates: "对应产品技术认证加分",
    work: "远程/上门解决客户产品故障，给客户做产品操作培训，整理知识库",
    workTime: "轮班，偶尔上门出差，月休4天", salary: "4500-7500 / 月", restrictions: "偶尔外勤；无特殊身体限制，基础体能即可"
  },
  {
    id: 375, category: "客户服务", name: "售前/售后服务", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "售前解答产品技术疑问，售后上门检修、退换货跟进，记录故障工单",
    workTime: "轮班，外出上门，月休4天", salary: "4000-6500 / 月", restrictions: "外出上门；无特殊身体限制，基础体能即可"
  },
  {
    id: 376, category: "客户服务", name: "热线咨询", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "接听进线热线，解答业务问题，登记工单，引导客户办理业务",
    workTime: "轮班，含晚班，月休4天", salary: "3100-4500 / 月", restrictions: "久坐，持续说话；无特殊身体限制，基础体能即可"
  },
  {
    id: 377, category: "客户服务", name: "客户关系处理", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "维护重点大客户，客户回访，客情维护，协调资源满足客户合理需求",
    workTime: "朝九晚六，偶尔外勤，月休4天", salary: "4200-6800 / 月", restrictions: "电话沟通多；无特殊身体限制，基础体能即可"
  },
  {
    id: 378, category: "客户服务", name: "客户分析", education: "大专",
    majors: [{ group: "统计学类", list: ["统计学"] }, { group: "管理大类", list: ["市场营销"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "整理客户画像，统计客户消费数据，分析客户流失原因，输出分析报表",
    workTime: "朝九晚六，双休", salary: "4300-6600 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 379, category: "客户服务", name: "投诉处理", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "承接客户投诉，安抚情绪，核查问题，给出解决方案，跟进闭环",
    workTime: "轮班，周末在岗，月休4天", salary: "3500-5200 / 月", restrictions: "情绪压力大；无特殊身体限制，基础体能即可"
  },

  /* ============ 三十、工厂制造（380–393） ============ */
  {
    id: 380, category: "工厂制造", name: "厂长/副厂长", education: "本科",
    majors: [{ group: "理工环境类", list: ["机电", "工业工程"] }],
    mbti: ["ENTJ"], certificates: "安全管理证书加分",
    work: "统筹工厂生产、品质、人员、成本，制定生产计划，把控交付，管理全厂",
    workTime: "白班为主，应急值班，月休4天", salary: "10000-20000+/月", restrictions: "车间巡检走动多；无特殊身体限制，基础体能即可"
  },
  {
    id: 381, category: "工厂制造", name: "厂务管理", education: "大专",
    majors: [{ group: "理工环境类", list: ["机电"] }],
    mbti: ["ISTJ"], certificates: "电工证优先",
    work: "厂区水电、空压机、中央空调、污水处理等厂务设备运维，厂区后勤管理",
    workTime: "轮班，应急值守，月休4天", salary: "4800-7500 / 月", restrictions: "车间巡检，登高；无特殊身体限制，基础体能即可"
  },
  {
    id: 382, category: "工厂制造", name: "车间主任/拉长", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "管理生产线班组，安排产能，管控良率，员工排班，处理产线异常",
    workTime: "白班/两班倒，月休4天", salary: "5000-8000 / 月", restrictions: "长时间在车间走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 383, category: "工厂制造", name: "产品开发", education: "大专",
    majors: [{ group: "理工环境类", list: ["机械", "电子", "材料"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "新品结构、样品开发，打样测试，图纸修改，跟进新品试产",
    workTime: "朝九晚六，试产加班，月休4天", salary: "5500-9000 / 月", restrictions: "坐站交替，车间看样；无特殊身体限制，基础体能即可"
  },
  {
    id: 384, category: "工厂制造", name: "品质管理（QA/QC）", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "质检证书优先",
    work: "来料检验、制程巡检、成品检验，不良品判定，出具品质报表，跟进改善",
    workTime: "两班倒居多，月休4天", salary: "4000-6000 / 月", restrictions: "车间走动，看检产品；无特殊身体限制，基础体能即可"
  },
  {
    id: 385, category: "工厂制造", name: "采购管理", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "供应商开发、比价，下单跟进交期，来料对账，供应商考核",
    workTime: "朝九晚六，月休4天", salary: "4800-7500 / 月", restrictions: "偶尔外出访厂；无特殊身体限制，基础体能即可"
  },
  {
    id: 386, category: "工厂制造", name: "仓储管理", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "叉车证加分",
    work: "仓库出入库管控，库位规划，盘点，物料台账，安排库工工作",
    workTime: "白班，忙时加班，月休4天", salary: "4200-6000 / 月", restrictions: "仓库走动，偶尔搬货；无特殊身体限制，基础体能即可"
  },
  {
    id: 387, category: "工厂制造", name: "物料管理", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "物料需求核算，缺料跟进，物料齐套管控，呆滞物料处理",
    workTime: "白班，赶产加班，月休4天", salary: "4000-5800 / 月", restrictions: "车间仓库来回跑；无特殊身体限制，基础体能即可"
  },
  {
    id: 388, category: "工厂制造", name: "设备管理", education: "大专",
    majors: [{ group: "理工环境类", list: ["机电"] }],
    mbti: ["ISTJ"], certificates: "电工证优先",
    work: "生产设备点检保养，故障维修，设备台账，备品备件管理",
    workTime: "两班倒，应急抢修，月休4天", salary: "5000-8200 / 月", restrictions: "车间维修，登高；无特殊身体限制，基础体能即可"
  },
  {
    id: 389, category: "工厂制造", name: "安全管理", education: "大专",
    majors: [{ group: "理工环境类", list: ["安全工程"] }],
    mbti: ["ESTJ"], certificates: "安全员证硬性", requiredCert: "安全员证",
    work: "车间安全巡检，隐患排查，安全培训，消防管理，工伤应急处理",
    workTime: "白班，应急值班，月休4天", salary: "4800-7800 / 月", restrictions: "车间巡检；无特殊身体限制，基础体能即可"
  },
  {
    id: 390, category: "工厂制造", name: "配色美工", education: "大专",
    majors: [{ group: "艺术大类", list: ["色彩", "设计", "印刷"] }],
    mbti: ["ISFP"], certificates: "无强制",
    work: "产品调色、对色，色样制作，色差管控，色卡归档",
    workTime: "白班，月休4天", salary: "4200-6500 / 月", restrictions: "长时间对色用眼；无特殊身体限制，基础体能即可"
  },
  {
    id: 391, category: "工厂制造", name: "计划/调度/协调员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "生产排程，产能调度，跟进物料和交期，协调产线异常",
    workTime: "白班，订单紧张加班，月休4天", salary: "4100-6000 / 月", restrictions: "车间办公室来回；无特殊身体限制，基础体能即可"
  },
  {
    id: 392, category: "工厂制造", name: "PMC/SMT技术员", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子", "机电"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "SMT贴片机程序调试，上料核对，产线工艺维护，良率改善",
    workTime: "两班倒，月休4天", salary: "4800-7500 / 月", restrictions: "车间站立操作；无特殊身体限制，基础体能即可"
  },
  {
    id: 393, category: "工厂制造", name: "生产控制文员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "会Excel优先",
    work: "生产数据录入，报表统计，工单归档，单据打印分发",
    workTime: "白班，月休4天", salary: "3300-4600 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 三十一、计算机软硬件（394–403） ============ */
  {
    id: 394, category: "计算机软硬件", name: "高级硬件工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["电子信息", "自动化"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "硬件方案设计，原理图PCB评审，硬件故障定位，新品硬件验证",
    workTime: "朝九晚六，项目加班，双休", salary: "12000-22000 / 月", restrictions: "久坐调试；无特殊身体限制，基础体能即可"
  },
  {
    id: 395, category: "计算机软硬件", name: "硬件工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["电子信息"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "原理图绘制，器件选型，样板调试，硬件测试，BOM整理",
    workTime: "朝九晚六，项目加班，双休", salary: "8000-14000 / 月", restrictions: "久坐调试；无特殊身体限制，基础体能即可"
  },
  {
    id: 396, category: "计算机软硬件", name: "硬件测试工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子"] }, { group: "计算机大类", list: [] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "硬件功能、高低温、老化测试，记录bug，写测试报告，回归验证",
    workTime: "朝九晚六，项目加班，双休", salary: "6000-10000 / 月", restrictions: "实验室坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 397, category: "计算机软硬件", name: "软件架构设计师", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术", "软件工程"] }],
    mbti: ["INTJ"], certificates: "无强制",
    work: "整套软件架构方案设计，技术选型，把控项目技术难点，评审代码方案",
    workTime: "朝九晚六，项目忙加班，双休", salary: "15000-30000+/月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 398, category: "计算机软硬件", name: "系统分析师", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术", "软件工程"] }],
    mbti: ["INTJ"], certificates: "无强制",
    work: "梳理业务需求，转化成系统方案，需求评审，对接开发和客户",
    workTime: "朝九晚六，项目加班，双休", salary: "10000-18000 / 月", restrictions: "久坐开会；无特殊身体限制，基础体能即可"
  },
  {
    id: 399, category: "计算机软硬件", name: "交互设计师/可用性分析", education: "大专",
    majors: [{ group: "艺术大类", list: ["工业设计", "数字媒体"] }],
    mbti: ["INFP"], certificates: "无强制",
    work: "APP/网页交互原型设计，用户流程梳理，可用性测试，优化操作体验",
    workTime: "朝九晚六，赶版本加班，双休", salary: "7000-12000 / 月", restrictions: "长时间电脑作图；无特殊身体限制，基础体能即可"
  },
  {
    id: 400, category: "计算机软硬件", name: "高级软件工程师/高级程序员/资深程序员", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术", "软件工程"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "核心模块开发，疑难bug修复，代码评审，指导初级开发",
    workTime: "朝九晚六，版本上线加班，双休", salary: "13000-25000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 401, category: "计算机软硬件", name: "软件工程师/程序员", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "根据需求写代码，单元测试，bug修复，功能迭代开发",
    workTime: "朝九晚六，上线加班，双休", salary: "7000-13000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 402, category: "计算机软硬件", name: "软件测试工程师", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "编写测试用例，功能、接口测试，提交bug，回归测试，输出测试报告",
    workTime: "朝九晚六，版本期加班，双休", salary: "5500-10000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 403, category: "计算机软硬件", name: "数据库开发工程师", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术"] }],
    mbti: ["ISTJ"], certificates: "数据库认证加分",
    work: "数据库表结构设计，SQL开发优化，存储过程编写，数据同步方案",
    workTime: "朝九晚六，项目加班，双休", salary: "9000-16000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 三十二、信息技术管理（404–415） ============ */
  {
    id: 404, category: "信息技术管理", name: "首席技术官CTO/技术总监", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }],
    mbti: ["INTJ"], certificates: "无强制",
    work: "公司整体技术战略规划，技术团队管理，重大技术方案决策",
    workTime: "弹性，经常开会加班", salary: "25000-60000+/月", restrictions: "久坐开会；无特殊身体限制，基础体能即可"
  },
  {
    id: 405, category: "信息技术管理", name: "首席信息官CIO/信息总监", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术", "信息管理"] }],
    mbti: ["INTJ"], certificates: "无强制",
    work: "信息化系统规划，数字化项目统筹，信息安全管控",
    workTime: "弹性，加班多", salary: "22000-50000+/月", restrictions: "久坐开会；无特殊身体限制，基础体能即可"
  },
  {
    id: 406, category: "信息技术管理", name: "信息技术经理/主管", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "IT团队管理，信息化项目推进，服务器、办公系统运维统筹",
    workTime: "朝九晚六，故障应急加班，双休", salary: "9000-15000 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 407, category: "信息技术管理", name: "信息技术专员/助理", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "电脑、打印机维护，账号开通，简单网络排查，IT资产登记",
    workTime: "朝九晚六，故障随叫随到，双休", salary: "4200-6500 / 月", restrictions: "办公室走动处理故障；无特殊身体限制，基础体能即可"
  },
  {
    id: 408, category: "信息技术管理", name: "系统集成/支持/测试", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机相关", "网络工程"] }],
    mbti: ["ISTJ"], certificates: "华为/思科认证加分",
    work: "服务器、监控、弱电系统集成部署，现场调试，售后支持测试",
    workTime: "项目制，出差多，项目间隙调休", salary: "6000-11000 / 月", restrictions: "经常出差，机房部署；无特殊身体限制，基础体能即可"
  },
  {
    id: 409, category: "信息技术管理", name: "MRP/ERP实施顾问", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }, { group: "管理大类", list: ["信息管理"] }],
    mbti: ["ESFJ"], certificates: "ERP认证加分",
    work: "去客户公司上线ERP系统，培训客户，需求配置，问题处理",
    workTime: "项目制，长期驻场出差", salary: "7000-13000 / 月", restrictions: "长期出差；无特殊身体限制，基础体能即可"
  },
  {
    id: 410, category: "信息技术管理", name: "IT项目经理/主管", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }],
    mbti: ["ENTJ"], certificates: "PMP证书加分",
    work: "IT项目排期、资源协调，进度管控，风险把控，对接甲方",
    workTime: "朝九晚六，项目节点加班，双休", salary: "10000-18000 / 月", restrictions: "开会多；无特殊身体限制，基础体能即可"
  },
  {
    id: 411, category: "信息技术管理", name: "IT项目执行/项目组长/协调人员", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "跟进项目任务，同步进度，收集问题，协调开发和客户",
    workTime: "朝九晚六，节点加班，双休", salary: "6500-11000 / 月", restrictions: "开会沟通多；无特殊身体限制，基础体能即可"
  },
  {
    id: 412, category: "信息技术管理", name: "网络工程师", education: "大专",
    majors: [{ group: "计算机大类", list: ["网络工程"] }],
    mbti: ["ISTJ"], certificates: "华为/思科认证加分",
    work: "企业交换机、路由器、防火墙配置，局域网维护，网络故障排查",
    workTime: "朝九晚六，网络故障应急加班，双休", salary: "6500-11500 / 月", restrictions: "机房作业；无特殊身体限制，基础体能即可"
  },
  {
    id: 413, category: "信息技术管理", name: "系统管理员", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }],
    mbti: ["ISTJ"], certificates: "Linux认证加分",
    work: "服务器部署、监控、备份，权限管理，系统补丁更新，故障排查",
    workTime: "轮班，夜间值守，双休轮值", salary: "6000-10500 / 月", restrictions: "需要夜班值守；无特殊身体限制，基础体能即可"
  },
  {
    id: 414, category: "信息技术管理", name: "数据库管理员DBA", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机相关"] }],
    mbti: ["ISTJ"], certificates: "数据库认证加分",
    work: "数据库备份、监控、调优，权限管理，故障恢复",
    workTime: "轮班，夜间应急，双休轮值", salary: "9000-17000 / 月", restrictions: "夜间应急；无特殊身体限制，基础体能即可"
  },
  {
    id: 415, category: "信息技术管理", name: "信息安全工程师", education: "本科",
    majors: [{ group: "计算机大类", list: ["信息安全", "计算机科学与技术"] }],
    mbti: ["ISTJ"], certificates: "CISSP、等保证书加分",
    work: "漏洞扫描，渗透测试，安全策略配置，等保测评，安全事件处置",
    workTime: "朝九晚六，安全事件应急加班，双休", salary: "10000-19000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 三十三、互联网应用（416–425） ============ */
  {
    id: 416, category: "互联网应用", name: "网站运营总监", education: "本科",
    majors: [{ group: "管理大类", list: ["市场营销"] }, { group: "文法大类", list: ["新媒体"] }],
    mbti: ["ENTJ"], certificates: "无强制",
    work: "网站整体运营规划，流量目标制定，运营团队管理，变现策略设计",
    workTime: "朝九晚六，大促加班，双休", salary: "12000-22000 / 月", restrictions: "久坐开会；无特殊身体限制，基础体能即可"
  },
  {
    id: 417, category: "互联网应用", name: "网站运营经理/主管", education: "大专",
    majors: [{ group: "文法大类", list: ["新媒体"] }, { group: "管理大类", list: ["市场营销"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "网站内容、活动、流量运营，数据复盘，管理运营组员",
    workTime: "朝九晚六，活动期加班，双休", salary: "7500-13000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 418, category: "互联网应用", name: "互联网软件开发工程师", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术", "软件工程"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "网站、小程序、后台接口开发，迭代功能，修复bug",
    workTime: "朝九晚六，版本上线加班，双休", salary: "7500-14000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 419, category: "互联网应用", name: "多媒体/游戏开发工程师", education: "本科",
    majors: [{ group: "艺术大类", list: ["数字媒体"] }, { group: "计算机大类", list: ["计算机科学与技术"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "游戏客户端、引擎、多媒体音视频功能开发，资源渲染调试",
    workTime: "朝九晚六，版本节点加班，双休", salary: "9000-18000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 420, category: "互联网应用", name: "网站架构设计师", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术"] }],
    mbti: ["INTJ"], certificates: "无强制",
    work: "网站后端架构设计，高并发方案，服务器集群、缓存方案设计",
    workTime: "朝九晚六，项目加班，双休", salary: "14000-26000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 421, category: "互联网应用", name: "网站维护工程师", education: "大专",
    majors: [{ group: "计算机大类", list: ["计算机相关", "网络工程"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "网站服务器、源码维护，漏洞修复，内容更新，故障排查",
    workTime: "轮班，网站故障随时处理，双休轮值", salary: "5000-8500 / 月", restrictions: "应急处理；无特殊身体限制，基础体能即可"
  },
  {
    id: 422, category: "互联网应用", name: "网站策划/管理", education: "大专",
    majors: [{ group: "文法大类", list: ["广告学", "新媒体"] }],
    mbti: ["ENFP"], certificates: "无强制",
    work: "网站栏目规划，活动策划，页面内容规划，用户路径设计",
    workTime: "朝九晚六，赶活动加班，双休", salary: "5500-9000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 423, category: "互联网应用", name: "网站编辑/论坛维护/内容监管", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言", "新闻学"] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "稿件采编发布，论坛评论审核，违规内容删除，维护社区氛围",
    workTime: "轮班，晚班在岗，月休4天", salary: "4000-6000 / 月", restrictions: "长时间看内容；无特殊身体限制，基础体能即可"
  },
  {
    id: 424, category: "互联网应用", name: "网站推广/优化/SEO", education: "大专",
    majors: [{ group: "文法大类", list: ["新媒体"] }, { group: "管理大类", list: ["市场营销"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "关键词布局，外链建设，网站排名优化，投放推广，流量数据监控",
    workTime: "朝九晚六，双休", salary: "4800-8000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 425, category: "互联网应用", name: "网页设计/制作/美工", education: "大专",
    majors: [{ group: "艺术大类", list: ["视觉传达", "数字媒体"] }],
    mbti: ["ISFP"], certificates: "会PS、AI、HTML优先",
    work: "官网页面设计，banner、详情页制作，简单页面切图",
    workTime: "朝九晚六，赶稿加班，双休", salary: "4800-7800 / 月", restrictions: "长时间电脑作图；无特殊身体限制，基础体能即可"
  },

  /* ============ 三十四、电子通讯（426–438） ============ */
  {
    id: 426, category: "电子通讯", name: "电子工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子信息工程"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "原理图、PCB设计，器件选型，样板调试，测试整改",
    workTime: "朝九晚六，项目加班，双休", salary: "7000-12000 / 月", restrictions: "实验室调试；无特殊身体限制，基础体能即可"
  },
  {
    id: 427, category: "电子通讯", name: "无线电工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["通信工程", "射频"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "射频电路、天线调试，无线信号测试，通信模块开发",
    workTime: "朝九晚六，项目加班，双休", salary: "8500-15000 / 月", restrictions: "实验室调试；无特殊身体限制，基础体能即可"
  },
  {
    id: 428, category: "电子通讯", name: "电子元器件工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子", "材料"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "元器件选型认证，规格核对，替代料评估，供应商样品测试",
    workTime: "朝九晚六，双休", salary: "6500-11000 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 429, category: "电子通讯", name: "电路设计/电子测试/半导体技术", education: "本科",
    majors: [{ group: "理工环境类", list: ["电子", "微电子"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "模拟/数字电路设计，芯片、半导体样品测试，测试方案编写",
    workTime: "朝九晚六，项目加班，双休", salary: "8000-16000 / 月", restrictions: "实验室；无特殊身体限制，基础体能即可"
  },
  {
    id: 430, category: "电子通讯", name: "单片机/DSL/DSP/底层软件开发", education: "大专",
    majors: [{ group: "理工环境类", list: ["自动化", "电子信息"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "单片机、DSP底层C语言开发，驱动编写，硬件联调",
    workTime: "朝九晚六，项目加班，双休", salary: "7500-13500 / 月", restrictions: "久坐调试；无特殊身体限制，基础体能即可"
  },
  {
    id: 431, category: "电子通讯", name: "广播视听设备工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["通信", "音视频"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "广播、音响、会议视听设备安装调试、检修、系统维护",
    workTime: "项目制，外出调试，调休", salary: "6000-10000 / 月", restrictions: "外勤安装；无特殊身体限制，基础体能即可"
  },
  {
    id: 432, category: "电子通讯", name: "电子/电器维修工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子", "机电"] }],
    mbti: ["ISTJ"], certificates: "电工证加分",
    work: "电路板、电器故障检测维修，维修台账，不良分析",
    workTime: "白班，客户报修外出，月休4天", salary: "5000-8500 / 月", restrictions: "拆修设备；无特殊身体限制，基础体能即可"
  },
  {
    id: 433, category: "电子通讯", name: "电子测试工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子信息"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "制定产品测试方案，功能、可靠性测试，出具测试报告，跟进问题整改",
    workTime: "朝九晚六，样品多加班，双休", salary: "5800-9500 / 月", restrictions: "实验室；无特殊身体限制，基础体能即可"
  },
  {
    id: 434, category: "电子通讯", name: "电子技术员", education: "高中",
    majors: [{ group: "理工环境类", list: ["电子"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "样板焊接、测试，协助工程师做实验，记录测试数据",
    workTime: "白班，月休4天", salary: "4000-6000 / 月", restrictions: "车间、实验室；无特殊身体限制，基础体能即可"
  },
  {
    id: 435, category: "电子通讯", name: "工艺工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子", "机械"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "产线工艺流程制定，作业指导书编写，改善良率，解决工艺异常",
    workTime: "白班/两班倒，月休4天", salary: "5500-9000 / 月", restrictions: "产线巡检；无特殊身体限制，基础体能即可"
  },
  {
    id: 436, category: "电子通讯", name: "仪器/仪表/测量工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["测控", "电子"] }],
    mbti: ["ISTJ"], certificates: "计量证加分",
    work: "测试仪器校准，测量方案设计，仪器维护，计量台账管理",
    workTime: "白班，月休4天", salary: "5800-9800 / 月", restrictions: "实验室；无特殊身体限制，基础体能即可"
  },
  {
    id: 437, category: "电子通讯", name: "绘图工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["机械", "电子"] }],
    mbti: ["ISTJ"], certificates: "会CAD、Altium优先",
    work: "绘制机械图纸、PCB图纸，图纸归档，版本更新",
    workTime: "朝九晚六，双休", salary: "4800-7500 / 月", restrictions: "电脑绘图久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 438, category: "电子通讯", name: "通讯/通信工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["通信工程"] }],
    mbti: ["ISTJ"], certificates: "运营商认证加分",
    work: "基站、通信线路、通信设备调试维护，通信故障排查",
    workTime: "外勤多，轮班抢修，月休4天", salary: "6500-11000 / 月", restrictions: "户外基站作业；无特殊身体限制，基础体能即可"
  },

  /* ============ 三十五、机械（439–445） ============ */
  {
    id: 439, category: "机械", name: "机械工程师/模具设计", education: "大专",
    majors: [{ group: "理工环境类", list: ["机械设计", "模具"] }],
    mbti: ["ISTJ"], certificates: "会SolidWorks、UG优先",
    work: "机械结构设计，模具3D/2D图纸绘制，模具跟进试模，修改方案",
    workTime: "朝九晚六，试模加班，双休", salary: "7000-13000 / 月", restrictions: "车间看样；无特殊身体限制，基础体能即可"
  },
  {
    id: 440, category: "机械", name: "机械制图工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["机械制图", "机械"] }],
    mbti: ["ISTJ"], certificates: "CAD证书优先",
    work: "二维工程图绘制，图纸标准化，图纸归档，BOM制作",
    workTime: "朝九晚六，双休", salary: "5000-8000 / 月", restrictions: "电脑绘图久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 441, category: "机械", name: "机械制造工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["机械制造"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "加工工艺编制，工装夹具设计，机加工产线良率改善",
    workTime: "白班，产线异常加班，月休4天", salary: "6000-10000 / 月", restrictions: "车间巡检；无特殊身体限制，基础体能即可"
  },
  {
    id: 442, category: "机械", name: "机电工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["机电一体化"] }],
    mbti: ["ISTJ"], certificates: "低压电工证加分",
    work: "机械设备电气+机械改造调试，自动化设备维护，故障维修",
    workTime: "白班，抢修加班，月休4天", salary: "6500-11000 / 月", restrictions: "车间设备维修；无特殊身体限制，基础体能即可"
  },
  {
    id: 443, category: "机械", name: "结构工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["机械", "力学"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "产品结构设计，强度仿真，结构可靠性测试，开模跟进",
    workTime: "朝九晚六，项目加班，双休", salary: "8000-14000 / 月", restrictions: "久坐画图；无特殊身体限制，基础体能即可"
  },
  {
    id: 444, category: "机械", name: "注塑/电镀工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["材料", "模具"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "注塑工艺调机，电镀药水、工艺管控，不良改善",
    workTime: "两班倒居多，月休4天", salary: "5500-9000 / 月", restrictions: "车间环境，接触化工药水；皮肤敏感慎选"
  },
  {
    id: 445, category: "机械", name: "机电技术员", education: "高中",
    majors: [{ group: "理工环境类", list: ["机电"] }],
    mbti: ["ISTJ"], certificates: "电工证加分",
    work: "协助工程师调试设备，拆装工装，记录设备参数，整理工具",
    workTime: "白班/两班倒，月休4天", salary: "4200-6200 / 月", restrictions: "车间操作；无特殊身体限制，基础体能即可"
  },

  /* ============ 三十六、房地产物业（446–457） ============ */
  {
    id: 446, category: "房地产物业", name: "房地产开发/策划经理", education: "本科",
    majors: [{ group: "管理大类", list: ["房地产", "市场营销"] }],
    mbti: ["ENTJ"], certificates: "无强制",
    work: "楼盘定位、营销总方案，推盘节奏把控，策划团队管理",
    workTime: "朝九晚六，开盘加班，双休", salary: "9000-18000 / 月", restrictions: "经常去楼盘现场；无特殊身体限制，基础体能即可"
  },
  {
    id: 447, category: "房地产物业", name: "房地产开发/策划主管/专员", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销", "房地产"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "楼盘活动策划，宣传物料对接，竞品调研，活动落地执行",
    workTime: "朝九晚六，开盘节点加班，双休", salary: "专员5000-8000；主管7000-12000", restrictions: "跑项目现场；无特殊身体限制，基础体能即可"
  },
  {
    id: 448, category: "房地产物业", name: "商业地产策划/招商/营运", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "商场招商洽谈，商户运营管理，商场活动策划，租金收缴跟进",
    workTime: "轮班，周末在岗，月休4天", salary: "6000-11000（底薪+招商提成）", restrictions: "商场走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 449, category: "房地产物业", name: "房地产评估", education: "大专",
    majors: [{ group: "管理大类", list: ["房地产"] }, { group: "理工环境类", list: ["土木工程"] }],
    mbti: ["ISTJ"], certificates: "房地产估价师证优先",
    work: "实地看房勘察，测算房产价值，撰写评估报告",
    workTime: "白班，外勤看房，双休", salary: "5500-9500 / 月", restrictions: "外出看房；无特殊身体限制，基础体能即可"
  },
  {
    id: 450, category: "房地产物业", name: "房地产中介/置业顾问", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "房源开发，带客户看房，讲解房源，谈判、跟进成交",
    workTime: "轮班，周末忙，月休4天", salary: "4000-12000（底薪+高额提成）", restrictions: "外出带看，经常走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 451, category: "房地产物业", name: "房地产销售人员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "售楼处接待客户，讲解沙盘户型，跟进意向客户，促成认购",
    workTime: "轮班，周末节假日在岗，月休4天", salary: "4500-13000（底薪+提成）", restrictions: "长时间接待；无特殊身体限制，基础体能即可"
  },
  {
    id: 452, category: "房地产物业", name: "高级物业顾问/物业顾问", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "物业证书加分",
    work: "业主接待，诉求登记跟进，物业费催缴，社区客情维护",
    workTime: "轮班，月休4天", salary: "3500-5500 / 月", restrictions: "小区走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 453, category: "房地产物业", name: "物业管理经理/主管", education: "大专",
    majors: [{ group: "管理大类", list: ["物业管理"] }],
    mbti: ["ESTJ"], certificates: "物业经理证优先",
    work: "物业团队管理，小区品质管控，重大客诉处理，对接地产、业委会",
    workTime: "轮班，应急值班，月休4天", salary: "主管5500-8500；经理7500-13000", restrictions: "园区巡检；无特殊身体限制，基础体能即可"
  },
  {
    id: 454, category: "房地产物业", name: "物业管理专员/助理", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "业主资料登记，报修接单跟进，园区巡查记录，台账整理",
    workTime: "轮班，月休4天", salary: "3300-4800 / 月", restrictions: "园区走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 455, category: "房地产物业", name: "物业招商/租赁/租售", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "商铺、公寓房源招商，带客户看房，租赁合同洽谈跟进",
    workTime: "轮班，周末在岗，月休4天", salary: "4000-9000（底薪+提成）", restrictions: "外出带看；无特殊身体限制，基础体能即可"
  },
  {
    id: 456, category: "房地产物业", name: "物业维修", education: "高中",
    majors: [{ group: "理工环境类", list: ["机电"] }],
    mbti: ["ISTJ"], certificates: "低压电工证硬性", requiredCert: "低压电工证",
    work: "小区水电、门窗、公共设施维修，上门业主报修处理",
    workTime: "轮班，24小时应急值班，月休4天", salary: "4000-6000 / 月", restrictions: "登高维修；无特殊身体限制，基础体能即可"
  },
  {
    id: 457, category: "房地产物业", name: "会所管理", education: "大专",
    majors: [{ group: "管理大类", list: ["酒店管理"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "会所人员排班，接待管理，设施维护，会员服务管理",
    workTime: "轮班，晚上在岗，月休4天", salary: "4500-7000 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },

  /* ============ 三十七、建筑规划（458–479） ============ */
  {
    id: 458, category: "建筑规划", name: "城镇规划设计", education: "本科",
    majors: [{ group: "理工环境类", list: ["城乡规划"] }],
    mbti: ["INTJ"], certificates: "注册城乡规划师加分",
    work: "城镇、片区规划方案编制，总平面图设计，规划文本撰写",
    workTime: "朝九晚六，赶规划项目加班，双休", salary: "8500-16000 / 月", restrictions: "电脑画图久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 459, category: "建筑规划", name: "风景园林规划设计", education: "本科",
    majors: [{ group: "理工环境类", list: ["风景园林"] }],
    mbti: ["INFP"], certificates: "无强制",
    work: "公园、小区景观方案设计，园林施工图绘制，植物配置设计",
    workTime: "朝九晚六，赶图加班，双休", salary: "7500-14000 / 月", restrictions: "电脑画图久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 460, category: "建筑规划", name: "园艺工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["园艺", "园林"] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "园林苗木选型，种植方案，养护标准制定，现场苗木指导",
    workTime: "白班，外勤跑工地，月休4天", salary: "5000-8000 / 月", restrictions: "户外工地；花粉过敏慎选"
  },
  {
    id: 461, category: "建筑规划", name: "建筑设计", education: "本科",
    majors: [{ group: "理工环境类", list: ["建筑学"] }],
    mbti: ["INTJ"], certificates: "一级注册建筑师加分",
    work: "建筑方案设计、施工图绘制，和结构、水电专业对接",
    workTime: "朝九晚六，赶图熬夜加班，双休", salary: "9000-18000 / 月", restrictions: "长期电脑画图；无特殊身体限制，基础体能即可"
  },
  {
    id: 462, category: "建筑规划", name: "土木建筑/工民建", education: "大专",
    majors: [{ group: "理工环境类", list: ["土木工程"] }],
    mbti: ["ISTJ"], certificates: "二建、一建加分",
    work: "土建施工技术交底，现场质量、进度管控，图纸会审",
    workTime: "驻工地，月休4天", salary: "6500-11000 / 月", restrictions: "工地户外，粉尘；呼吸道敏感慎选"
  },
  {
    id: 463, category: "建筑规划", name: "绘图/建筑制图", education: "大专",
    majors: [{ group: "理工环境类", list: ["建筑", "土木"] }],
    mbti: ["ISTJ"], certificates: "会CAD优先",
    work: "建筑、结构施工图描图、改图，图纸整理归档",
    workTime: "朝九晚六，赶图加班，双休", salary: "4500-7000 / 月", restrictions: "电脑画图久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 464, category: "建筑规划", name: "结构工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["土木工程"] }],
    mbti: ["ISTJ"], certificates: "注册结构工程师加分",
    work: "建筑结构计算，结构施工图设计，图纸审核",
    workTime: "朝九晚六，赶图加班，双休", salary: "9500-18000 / 月", restrictions: "久坐画图；无特殊身体限制，基础体能即可"
  },
  {
    id: 465, category: "建筑规划", name: "测绘工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["测绘工程"] }],
    mbti: ["ISTJ"], certificates: "测绘证书加分",
    work: "工地放线、地形测量，采集测绘数据，绘制测绘图纸",
    workTime: "外勤为主，野外作业，调休", salary: "6000-10500 / 月", restrictions: "户外日晒雨淋，扛仪器；无特殊身体限制，基础体能即可"
  },
  {
    id: 466, category: "建筑规划", name: "施工管理", education: "大专",
    majors: [{ group: "理工环境类", list: ["土木"] }],
    mbti: ["ESTJ"], certificates: "二建证书加分",
    work: "施工现场管理，进度安排，劳务协调，安全质量管控",
    workTime: "驻工地，月休4天", salary: "7000-12000 / 月", restrictions: "工地现场；粉尘，日晒；呼吸道敏感慎选"
  },
  {
    id: 467, category: "建筑规划", name: "工程监理", education: "大专",
    majors: [{ group: "理工环境类", list: ["土木"] }],
    mbti: ["ISTJ"], certificates: "监理工程师证加分",
    work: "工地巡检，核查施工质量，旁站监理，监理资料整理",
    workTime: "驻工地，月休4天", salary: "5500-9000 / 月", restrictions: "工地走动；粉尘；呼吸道敏感慎选"
  },
  {
    id: 468, category: "建筑规划", name: "工程预决算", education: "大专",
    majors: [{ group: "理工环境类", list: ["工程造价"] }],
    mbti: ["ISTJ"], certificates: "造价师证加分",
    work: "工程量算量，预算、结算编制，投标报价，对账审核",
    workTime: "朝九晚六，结算期加班，双休", salary: "6000-10500 / 月", restrictions: "久坐算量；无特殊身体限制，基础体能即可"
  },
  {
    id: 469, category: "建筑规划", name: "装饰/安装工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["土木", "环艺"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "装修、机电安装图纸交底，现场施工管控，变更签证处理",
    workTime: "驻装修工地，月休4天", salary: "6200-10500 / 月", restrictions: "工地；粉尘、噪音；呼吸道敏感慎选"
  },
  {
    id: 470, category: "建筑规划", name: "道桥设计与施工", education: "本科",
    majors: [{ group: "理工环境类", list: ["道路桥梁工程"] }],
    mbti: ["ISTJ"], certificates: "一建加分",
    work: "道路桥梁图纸设计、现场施工技术管理，试验检测",
    workTime: "项目驻场，长期外勤，调休", salary: "8000-15000 / 月", restrictions: "野外工地；日晒、粉尘；呼吸道敏感慎选"
  },
  {
    id: 471, category: "建筑规划", name: "港口与航道设计与施工", education: "本科",
    majors: [{ group: "理工环境类", list: ["港航"] }],
    mbti: ["ISTJ"], certificates: "一建港航证书加分",
    work: "港口航道设计、码头施工管理，水下工程技术对接",
    workTime: "项目驻场，出差多，调休", salary: "9000-17000 / 月", restrictions: "临水工地；无特殊身体限制，基础体能即可"
  },
  {
    id: 472, category: "建筑规划", name: "水电/管道工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["给排水", "机电"] }],
    mbti: ["ISTJ"], certificates: "电工证加分",
    work: "给排水、强弱电、管道图纸，现场安装管控，调试验收",
    workTime: "工地驻场，月休4天", salary: "6000-10000 / 月", restrictions: "工地；无特殊身体限制，基础体能即可"
  },
  {
    id: 473, category: "建筑规划", name: "给排水工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["给排水"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "建筑给排水方案、施工图设计，给排水系统现场调试",
    workTime: "朝九晚六，赶图加班，双休", salary: "6500-11000 / 月", restrictions: "久坐画图；无特殊身体限制，基础体能即可"
  },
  {
    id: 474, category: "建筑规划", name: "制冷暖通工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["建筑环境与能源"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "中央空调、暖通系统方案设计，现场安装调试",
    workTime: "朝九晚六，项目外勤，双休", salary: "7000-12000 / 月", restrictions: "偶尔跑工地；无特殊身体限制，基础体能即可"
  },
  {
    id: 475, category: "建筑规划", name: "智能楼宇设计与施工", education: "大专",
    majors: [{ group: "理工环境类", list: ["电气", "智能化"] }],
    mbti: ["ISTJ"], certificates: "弱电证书加分",
    work: "监控、门禁、楼宇自控方案设计，现场施工调试",
    workTime: "项目外勤，出差，调休", salary: "6500-11000 / 月", restrictions: "工地、机房；无特殊身体限制，基础体能即可"
  },
  {
    id: 476, category: "建筑规划", name: "岩土工程师/地下工程", education: "本科",
    majors: [{ group: "理工环境类", list: ["岩土", "地质工程"] }],
    mbti: ["ISTJ"], certificates: "注册岩土工程师加分",
    work: "地基勘察，基坑支护方案，地下工程设计，现场勘察",
    workTime: "外勤勘察，项目加班，双休", salary: "10000-20000 / 月", restrictions: "野外勘察；无特殊身体限制，基础体能即可"
  },
  {
    id: 477, category: "建筑规划", name: "安全注册主任", education: "本科",
    majors: [{ group: "理工环境类", list: ["安全工程"] }],
    mbti: ["ESTJ"], certificates: "注册安全工程师硬性", requiredCert: "注册安全工程师",
    work: "项目安全体系搭建，重大安全风险管控，安全方案审批",
    workTime: "驻项目，应急值班，月休4天", salary: "8000-14000 / 月", restrictions: "工地巡检；无特殊身体限制，基础体能即可"
  },
  {
    id: 478, category: "建筑规划", name: "安全员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESTJ"], certificates: "安全员C证硬性", requiredCert: "安全员C证",
    work: "工地安全巡查，隐患整改跟踪，安全交底，安全台账",
    workTime: "驻工地，月休4天", salary: "4800-7500 / 月", restrictions: "工地走动；粉尘；呼吸道敏感慎选"
  },
  {
    id: 479, category: "建筑规划", name: "建材", education: "高中",
    majors: [{ group: "理工环境类", list: ["建材", "土木"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "建材销售，样品对接，工地材料供货跟进，报价对账",
    workTime: "外勤跑工地，月休4天", salary: "4500-9000（底薪+提成）", restrictions: "工地、建材市场走动；粉尘；呼吸道敏感慎选"
  },

  /* ============ 三十八、证券金融投资（480–495） ============ */
  {
    id: 480, category: "证券金融投资", name: "证券投资顾问", education: "本科",
    majors: [{ group: "金融类", list: ["金融", "经济"] }],
    mbti: ["ESTJ"], certificates: "证券从业、投顾证书硬性", requiredCert: "证券从业证、投顾证书",
    work: "给客户做资产配置建议，行情解读，客户维护，投资咨询",
    workTime: "交易日白班，双休（周末值班）", salary: "6000-12000（底薪+提成）", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 481, category: "证券金融投资", name: "证券分析师", education: "本科",
    majors: [{ group: "金融类", list: ["金融", "财会"] }],
    mbti: ["ISTJ"], certificates: "证券分析师证书硬性", requiredCert: "证券分析师证书",
    work: "行业、上市公司深度研究，撰写研报，数据跟踪",
    workTime: "朝九晚六，财报季加班，双休", salary: "9000-18000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 482, category: "证券金融投资", name: "股票/期货操盘手/交易员", education: "大专",
    majors: [{ group: "金融类", list: ["金融"] }],
    mbti: ["ISTJ"], certificates: "期货/证券从业证优先",
    work: "按照交易策略执行下单，盯盘，交易记录，盈亏复盘",
    workTime: "跟随交易时段，轮值", salary: "5000-15000（底薪+交易提成）", restrictions: "长时间盯盘；无特殊身体限制，基础体能即可"
  },
  {
    id: 483, category: "证券金融投资", name: "行业分析", education: "本科",
    majors: [{ group: "金融类", list: ["金融", "经管"] }],
    mbti: ["ISTJ"], certificates: "证券从业加分",
    work: "行业数据收集，产业链调研，行业报告撰写",
    workTime: "朝九晚六，双休", salary: "7000-13000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 484, category: "证券金融投资", name: "股评", education: "本科",
    majors: [{ group: "金融类", list: ["金融"] }],
    mbti: ["ENFP"], certificates: "证券投顾资质硬性", requiredCert: "证券投顾资质",
    work: "行情解读，财经内容产出，线上直播、文稿点评",
    workTime: "交易日为主，周末准备内容", salary: "7000-14000 / 月", restrictions: "久坐，出镜讲解；无特殊身体限制，基础体能即可"
  },
  {
    id: 485, category: "证券金融投资", name: "期货/股票经纪", education: "大专",
    majors: [{ group: "金融类", list: ["金融"] }],
    mbti: ["ESFJ"], certificates: "证券/期货从业硬性", requiredCert: "证券从业证、期货从业证",
    work: "开发客户，开户引导，维护客户，业务推广",
    workTime: "交易日白班，双休值班", salary: "4500-10000（底薪+提成）", restrictions: "电话沟通多；无特殊身体限制，基础体能即可"
  },
  {
    id: 486, category: "证券金融投资", name: "投资管理/顾问", education: "本科",
    majors: [{ group: "金融类", list: ["金融"] }],
    mbti: ["ESTJ"], certificates: "基金从业证书优先",
    work: "客户资产规划，理财产品推介，投资方案沟通",
    workTime: "朝九晚六，双休", salary: "6500-13000（底薪+提成）", restrictions: "久坐沟通；无特殊身体限制，基础体能即可"
  },
  {
    id: 487, category: "证券金融投资", name: "投资顾问/基金经理", education: "本科",
    majors: [{ group: "金融类", list: ["金融"] }],
    mbti: ["INTJ"], certificates: "基金从业，基金经理资质硬性", requiredCert: "基金从业证、基金经理资质",
    work: "基金组合管理，持仓调仓，净值跟踪，投资报告",
    workTime: "交易日为主，财报期加班", salary: "15000-40000+/月", restrictions: "长时间盯盘；无特殊身体限制，基础体能即可"
  },
  {
    id: 488, category: "证券金融投资", name: "注册投资/金融分析师", education: "本科",
    majors: [{ group: "金融类", list: ["金融"] }],
    mbti: ["ISTJ"], certificates: "CFA证书优先",
    work: "企业估值、投融资项目尽调，撰写投资分析报告",
    workTime: "朝九晚六，项目加班，双休", salary: "12000-25000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 489, category: "证券金融投资", name: "资产评估", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学"] }, { group: "金融类", list: ["金融"] }],
    mbti: ["ISTJ"], certificates: "资产评估师证优先",
    work: "实地盘点资产，评估价值，出具资产评估报告",
    workTime: "外勤+办公室，双休", salary: "6000-11000 / 月", restrictions: "外出盘点；无特殊身体限制，基础体能即可"
  },
  {
    id: 490, category: "证券金融投资", name: "融资专员", education: "大专",
    majors: [{ group: "金融类", list: ["金融", "财会"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "对接银行、机构，准备融资资料，跟进贷款审批，整理台账",
    workTime: "朝九晚六，双休", salary: "5000-9000（底薪+融资提成）", restrictions: "外勤对接；无特殊身体限制，基础体能即可"
  },
  {
    id: 491, category: "证券金融投资", name: "融资经理/融资主管", education: "本科",
    majors: [{ group: "金融类", list: ["金融"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "融资渠道拓展，融资方案设计，带融资小组，对接金融机构高层",
    workTime: "外勤多，双休", salary: "8000-16000（底薪+提成）", restrictions: "外出拜访；无特殊身体限制，基础体能即可"
  },
  {
    id: 492, category: "证券金融投资", name: "保险经纪人/保险业务员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "保险执业证硬性", requiredCert: "保险执业证",
    work: "开发客户，讲解保险方案，保单跟进，理赔协助",
    workTime: "自主安排，周末可谈客户", salary: "4000-11000（底薪+提成）", restrictions: "外出拜访客户；无特殊身体限制，基础体能即可"
  },
  {
    id: 493, category: "证券金融投资", name: "证券/期货/黄金/外汇经纪人", education: "大专",
    majors: [{ group: "金融类", list: ["金融"] }],
    mbti: ["ESFJ"], certificates: "对应从业证书硬性", requiredCert: "从业证书",
    work: "开发投资客户，讲解品种规则，维护客户，业务推广",
    workTime: "交易时段在岗，双休值班", salary: "4500-10500（底薪+提成）", restrictions: "电话和线下沟通；无特殊身体限制，基础体能即可"
  },
  {
    id: 494, category: "证券金融投资", name: "金融/经济研究员", education: "本科",
    majors: [{ group: "金融类", list: ["金融", "经济学"] }],
    mbti: ["ISTJ"], certificates: "证券从业加分",
    work: "宏观经济、产业数据跟踪，撰写宏观研究报告",
    workTime: "朝九晚六，双休", salary: "8500-16000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 495, category: "证券金融投资", name: "拍卖师/典当师", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "拍卖师证书/典当相关资质硬性", requiredCert: "拍卖师证书",
    work: "拍卖会主持，典当物品鉴定估价，合同办理，物品保管",
    workTime: "拍卖会时段在岗，日常白班", salary: "5500-10000（底薪+提成）", restrictions: "拍卖站立；无特殊身体限制，基础体能即可"
  },

  /* ============ 三十九、律师法务（496–500） ============ */
  {
    id: 496, category: "律师法务", name: "律师", education: "本科",
    majors: [{ group: "文法大类", list: ["法学"] }],
    mbti: ["ISTJ"], certificates: "法律职业资格证硬性", requiredCert: "法律职业资格证",
    work: "案件对接，出庭，文书起草，案件谈判，证据整理",
    workTime: "弹性，开庭加班，双休", salary: "8000-20000+/月", restrictions: "久坐写文书，开庭；无特殊身体限制，基础体能即可"
  },
  {
    id: 497, category: "律师法务", name: "法律顾问", education: "本科",
    majors: [{ group: "文法大类", list: ["法学"] }],
    mbti: ["ISTJ"], certificates: "法考证书优先",
    work: "企业合同审核，风险防控，法律咨询，纠纷协商处理",
    workTime: "朝九晚六，双休，案件紧急加班", salary: "9000-16000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 498, category: "律师法务", name: "律师/法务助理", education: "大专",
    majors: [{ group: "文法大类", list: ["法学"] }],
    mbti: ["ISFJ"], certificates: "法考通过加分",
    work: "案卷整理，文书初稿，立案材料准备，线上立案，联系当事人",
    workTime: "朝九晚六，双休，开庭加班", salary: "4000-6500 / 月", restrictions: "久坐整理案卷；无特殊身体限制，基础体能即可"
  },
  {
    id: 499, category: "律师法务", name: "法务主管/专员", education: "大专",
    majors: [{ group: "文法大类", list: ["法学"] }],
    mbti: ["ISTJ"], certificates: "法考证书加分",
    work: "公司合同审核，劳动纠纷处理，合规检查，法务台账",
    workTime: "朝九晚五，双休", salary: "专员5500-8500；主管7500-12000", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 500, category: "律师法务", name: "知识产权/专利顾问/专员", education: "大专",
    majors: [{ group: "文法大类", list: ["法学"] }, { group: "理工环境类", list: ["工科"] }],
    mbti: ["ISTJ"], certificates: "专利代理师证加分",
    work: "专利、商标、软著申请对接，检索，答复审查意见，知识产权维权",
    workTime: "朝九晚五，双休", salary: "5500-10000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },

  /* ============ 四十、酒店餐饮（501–512） ============ */
  {
    id: 501, category: "酒店餐饮", name: "酒店经理/餐馆经理", education: "大专",
    majors: [{ group: "管理大类", list: ["酒店管理"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "门店人员排班，营收管控，服务品质管理，客诉处理，成本管控",
    workTime: "轮班，晚班在岗，月休4天", salary: "6000-11000 / 月", restrictions: "长时间门店走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 502, category: "酒店餐饮", name: "大堂副理/楼面经理", education: "高中",
    majors: [{ group: "管理大类", list: ["酒店管理"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "大堂巡查，升级客诉处理，接待重要客人，管理楼面服务员",
    workTime: "轮班，晚班，月休4天", salary: "4500-7000 / 月", restrictions: "站立走动多；无特殊身体限制，基础体能即可"
  },
  {
    id: 503, category: "酒店餐饮", name: "领班", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "健康证",
    work: "带领班组服务员，安排岗位，检查服务，简单客诉处理",
    workTime: "午晚班轮班，月休4天", salary: "3500-5000 / 月", restrictions: "站立走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 504, category: "酒店餐饮", name: "客房服务/楼面服务/行李员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "健康证",
    work: "客房打扫整理、布草更换；楼面看台；帮客人搬运行李",
    workTime: "轮班，月休4天", salary: "2900-4000 / 月", restrictions: "体力走动，搬行李；无特殊身体限制，基础体能即可"
  },
  {
    id: 505, category: "酒店餐饮", name: "前厅接待", education: "高中",
    majors: [{ group: "管理大类", list: ["酒店管理"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "入住退房办理，身份证登记，预订，答疑，收银",
    workTime: "三班倒含夜班，月休4天", salary: "3200-4500 / 月", restrictions: "轮夜班；无特殊身体限制，基础体能即可"
  },
  {
    id: 506, category: "酒店餐饮", name: "商务中心/订房", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "无强制",
    work: "客人打印复印、传真，电话预订房间，订单登记核对",
    workTime: "轮班，月休4天", salary: "3000-4200 / 月", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 507, category: "酒店餐饮", name: "厨师", education: "初中",
    majors: [{ group: "不限专业", list: ["烹饪"] }],
    mbti: ["ISTJ"], certificates: "健康证，厨师证加分",
    work: "菜品制作，备料，把控口味，厨具灶台清洁",
    workTime: "午晚高峰在岗，月休4天", salary: "4500-8000 / 月", restrictions: "厨房高温，站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 508, category: "酒店餐饮", name: "行政主厨/厨师长", education: "高中",
    majors: [{ group: "不限专业", list: ["烹饪"] }],
    mbti: ["ESTJ"], certificates: "厨师证",
    work: "菜单研发，后厨团队管理，食材成本管控，出品质量把控",
    workTime: "午晚班在岗，月休4天", salary: "7000-13000 / 月", restrictions: "厨房高温；无特殊身体限制，基础体能即可"
  },
  {
    id: 509, category: "酒店餐饮", name: "面点师", education: "初中",
    majors: [{ group: "不限专业", list: ["面点烹饪"] }],
    mbti: ["ISTJ"], certificates: "健康证，面点证书加分",
    work: "包子、点心、面食制作，馅料调配，面点间清洁",
    workTime: "早班居多，月休4天", salary: "3800-6000 / 月", restrictions: "早起，站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 510, category: "酒店餐饮", name: "调酒师/茶艺师", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFP"], certificates: "健康证，茶艺/调酒证书加分",
    work: "调制鸡尾酒、冲泡茶水，接待客人，器具清洁",
    workTime: "晚班为主，月休4天", salary: "3500-5500（底薪+小费）", restrictions: "晚班，站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 511, category: "酒店餐饮", name: "服务员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "健康证",
    work: "引客、点菜、上菜、收台，简单客诉安抚",
    workTime: "午晚班，月休4天", salary: "2900-4000 / 月", restrictions: "长时间站立走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 512, category: "酒店餐饮", name: "礼仪/迎宾/司仪", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "门店门口迎宾引导，活动礼仪接待，婚礼/活动司仪主持",
    workTime: "轮班，活动日加班，月休4天", salary: "3200-5000（活动司仪额外提成）", restrictions: "长时间站立；无特殊身体限制，基础体能即可"
  },

  /* ============ 四十一、百货零售（513–522） ============ */
  {
    id: 513, category: "百货零售", name: "商场经理/主管", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销", "连锁管理"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "商场商户管理，活动统筹，现场秩序管理，营收目标管控",
    workTime: "轮班，周末节假日在岗，月休4天", salary: "主管5000-8000；经理7000-12000", restrictions: "商场巡检走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 514, category: "百货零售", name: "店长/卖场经理", education: "高中",
    majors: [{ group: "管理大类", list: ["连锁管理"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "门店排班，库存管控，业绩目标，店员管理，客诉处理",
    workTime: "轮班，周末在岗，月休4天", salary: "5000-9000（底薪+门店提成）", restrictions: "卖场走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 515, category: "百货零售", name: "业务经理/主任", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "渠道客户维护，供货谈判，区域销售目标管理，带业务员",
    workTime: "外勤多，月休4天", salary: "6000-11000（底薪+提成）", restrictions: "外出拜访客户；无特殊身体限制，基础体能即可"
  },
  {
    id: 516, category: "百货零售", name: "店面设计/陈列", education: "大专",
    majors: [{ group: "艺术大类", list: ["视觉设计"] }],
    mbti: ["ISFP"], certificates: "无强制",
    work: "门店橱窗、货架陈列设计，换季陈列调整，陈列标准落地",
    workTime: "轮班，上新加班，月休4天", salary: "4200-7000 / 月", restrictions: "门店走动布置；无特殊身体限制，基础体能即可"
  },
  {
    id: 517, category: "百货零售", name: "营业员/店员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "健康证（食品类）",
    work: "接待顾客，介绍商品，导购，整理货架，盘点",
    workTime: "轮班，周末在岗，月休4天", salary: "3000-4500（底薪+提成）", restrictions: "站立；无特殊身体限制，基础体能即可"
  },
  {
    id: 518, category: "百货零售", name: "收银员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "无强制，健康证（食品商超）",
    work: "扫码收银，对账，小票打印，前台卫生",
    workTime: "轮班，晚班，月休4天", salary: "2800-4000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 519, category: "百货零售", name: "物价员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "商品价格录入，价签核对，调价，物价台账，检查价签合规",
    workTime: "白班，上新日加班，月休4天", salary: "3000-4200 / 月", restrictions: "卖场走动核对价签；无特殊身体限制，基础体能即可"
  },
  {
    id: 520, category: "百货零售", name: "理货员/陈列员/防损员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "补货理货、排面整理；防盗巡逻，监控查看，处理偷窃事件",
    workTime: "轮班，晚班，月休4天", salary: "2800-4000 / 月", restrictions: "长时间卖场走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 521, category: "百货零售", name: "生鲜/食品加工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "健康证硬性",
    work: "生鲜分割、熟食制作，食材打包，操作台清洁，临期检查",
    workTime: "早班居多，轮班，月休4天", salary: "3000-4300 / 月", restrictions: "接触生鲜、低温冷库；无特殊身体限制，基础体能即可"
  },
  {
    id: 522, category: "百货零售", name: "促销员/导购员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESFJ"], certificates: "健康证（食品）",
    work: "在专柜接待顾客，讲解产品，引导成交，清点样品",
    workTime: "轮班，周末节假日在岗，月休4天", salary: "2900-4800（底薪+提成）", restrictions: "长时间站立；无特殊身体限制，基础体能即可"
  },

  /* ============ 四十二、物流仓储运输（523–534） ============ */
  {
    id: 523, category: "物流仓储运输", name: "物流总监", education: "本科",
    majors: [{ group: "管理大类", list: ["物流管理"] }],
    mbti: ["ENTJ"], certificates: "无强制",
    work: "物流整体体系规划，仓储运输成本管控，物流团队管理",
    workTime: "朝九晚六，应急加班，双休", salary: "13000-22000 / 月", restrictions: "开会+仓库巡检；无特殊身体限制，基础体能即可"
  },
  {
    id: 524, category: "物流仓储运输", name: "物流经理/主管", education: "大专",
    majors: [{ group: "管理大类", list: ["物流管理"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "物流调度，承运商管理，异常件处理，物流团队管理",
    workTime: "轮班，大促加班，月休4天", salary: "主管6000-9000；经理8000-13000", restrictions: "仓库走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 525, category: "物流仓储运输", name: "物流专员/助理", education: "高中",
    majors: [{ group: "管理大类", list: ["物流管理"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "物流单据录入，跟踪在途货物，对接快递承运商，异常跟进",
    workTime: "白班，大促加班，月休4天", salary: "3300-4800 / 月", restrictions: "久坐+仓库走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 526, category: "物流仓储运输", name: "供应链总监", education: "本科",
    majors: [{ group: "管理大类", list: ["供应链管理"] }],
    mbti: ["ENTJ"], certificates: "无强制",
    work: "采购、生产、仓储、物流全链路统筹，供应链风险管控",
    workTime: "朝九晚六，项目加班，双休", salary: "15000-28000 / 月", restrictions: "开会多；无特殊身体限制，基础体能即可"
  },
  {
    id: 527, category: "物流仓储运输", name: "供应链经理/主管", education: "大专",
    majors: [{ group: "管理大类", list: ["供应链管理", "物流管理"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "供需计划、库存管控，供应商协同，供应链异常协调",
    workTime: "白班，订单紧张加班，月休4天", salary: "主管7000-11000；经理9000-15000", restrictions: "坐站交替；无特殊身体限制，基础体能即可"
  },
  {
    id: 528, category: "物流仓储运输", name: "供应链专员", education: "大专",
    majors: [{ group: "管理大类", list: ["物流管理", "经管"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "库存数据跟踪，需求统计，单据核对，供应商对账",
    workTime: "白班，月休4天", salary: "4000-6000 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 529, category: "物流仓储运输", name: "货运代理", education: "大专",
    majors: [{ group: "管理大类", list: ["国际经济与贸易", "物流管理"] }],
    mbti: ["ESFJ"], certificates: "无强制",
    work: "对接船公司、航空公司，订舱，制作托书，跟进报关出货",
    workTime: "白班，船期加班，月休4天", salary: "4800-8500（底薪+提成）", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 530, category: "物流仓储运输", name: "集装箱业务操作", education: "大专",
    majors: [{ group: "管理大类", list: ["物流管理", "国际经济与贸易"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "集装箱订舱、放单，核对箱单，跟踪集装箱流转",
    workTime: "白班，船期加班，月休4天", salary: "4500-7500 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 531, category: "物流仓储运输", name: "船务/空运/陆运操作", education: "大专",
    majors: [{ group: "管理大类", list: ["物流管理", "国际经济与贸易"] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "船务文件、空运托单、陆运调度，跟进货物进出",
    workTime: "白班，时差/船期加班，月休4天", salary: "4400-7200 / 月", restrictions: "久坐；无特殊身体限制，基础体能即可"
  },
  {
    id: 532, category: "物流仓储运输", name: "仓库经理/主管/专员", education: "高中",
    majors: [{ group: "管理大类", list: ["物流管理"] }],
    mbti: ["ISTJ"], certificates: "叉车证加分",
    work: "仓库出入库管理、库位规划、盘点；专员负责单据、台账",
    workTime: "白班，大促加班，月休4天", salary: "专员4000-5800；主管5500-8000；经理7500-11000", restrictions: "仓库走动，偶尔搬货；无特殊身体限制，基础体能即可"
  },
  {
    id: 533, category: "物流仓储运输", name: "调度员/理货员", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "叉车证加分",
    work: "车辆调度排车；货物清点、分类、上架理货",
    workTime: "白班，货多加班，月休4天", salary: "3500-5200 / 月", restrictions: "仓库走动；无特殊身体限制，基础体能即可"
  },
  {
    id: 534, category: "物流仓储运输", name: "运输经理/主管/专员", education: "大专",
    majors: [{ group: "管理大类", list: ["物流管理"] }],
    mbti: ["ESTJ"], certificates: "无强制",
    work: "运力安排，司机管理，运输路线规划，在途异常处理",
    workTime: "轮班，夜间应急，月休4天", salary: "专员4200-6200；主管6000-9000；经理8000-13000", restrictions: "电话沟通多；无特殊身体限制，基础体能即可"
  },

  /* ============ 四十三、印刷包装（535–539） ============ */
  {
    id: 535, category: "印刷包装", name: "电分/排版/菲林输出", education: "中专",
    majors: [{ group: "理工环境类", list: ["印刷媒体技术", "数字图文信息处理技术"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "印前制作员、图文处理师",
    work: "图片电分调色、稿件排版、菲林/制版文件输出、核对色彩与版面、修改客户稿件",
    workTime: "以企业JD为准", salary: "4500-7500 / 月", restrictions: "身体要求：无色盲色弱；能长时间盯屏幕；工作环境：车间/图文机房，有电脑辐射，部分车间有油墨气味，需久坐"
  },
  {
    id: 536, category: "印刷包装", name: "打版/调墨", education: "中专",
    majors: [{ group: "理工环境类", list: ["印刷技术", "包装工程"] }],
    mbti: ["ISTP", "ISFP"], certificates: "印刷调色技师、平版印刷工",
    work: "油墨配比调色、印刷打样、跟色、记录油墨配方、调整墨路，核对样品色差",
    workTime: "以企业JD为准", salary: "5000-8000 / 月", restrictions: "身体要求：无色盲色弱；嗅觉正常；工作环境：印刷车间，油墨气味较重，有机器噪音，需要站立作业"
  },
  {
    id: 537, category: "印刷包装", name: "印刷主管", education: "大专",
    majors: [{ group: "理工环境类", list: ["印刷工程", "包装技术与设计"] }],
    mbti: ["ESTJ", "ISTJ"], certificates: "印刷技师、质量管理内审员",
    work: "安排印刷排产、管控品质、管理班组、设备点检、处理生产异常、对接业务",
    workTime: "以企业JD为准", salary: "7000-12000 / 月", restrictions: "身体要求：无色盲色弱，可接受车间巡检走动；工作环境：印刷生产车间，噪音、油墨气味，需要轮班"
  },
  {
    id: 538, category: "印刷包装", name: "印刷技工", education: "初中",
    majors: [{ group: "理工环境类", list: ["印刷媒体技术"] }],
    mbti: ["ISTJ", "ISTP"], certificates: "平版印刷工、柔性版印刷工",
    work: "操作印刷机、上纸、换版、巡检印刷品质、清理机器、简单设备维护",
    workTime: "以企业JD为准", salary: "4800-7500 / 月", restrictions: "身体要求：无基础传染病，手脚灵活；工作环境：印刷车间，噪音大、有油墨溶剂味道，多需要倒班"
  },
  {
    id: 539, category: "印刷包装", name: "装订/晒版师", education: "中专",
    majors: [{ group: "理工环境类", list: ["印刷媒体技术"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "印后制作员、晒版工证",
    work: "PS版晒版、冲洗制版、书刊装订、折页、胶装、裁切、成品整理",
    workTime: "以企业JD为准", salary: "4300-7000 / 月", restrictions: "身体要求：无色盲，手部无残疾；工作环境：制版房有化学药水气味，装订车间粉尘，部分岗位需要站立"
  },

  /* ============ 四十四、电子电器电力（540–561） ============ */
  {
    id: 540, category: "电子电器电力", name: "电路/版图/布线设计", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子信息工程", "微电子", "电气工程"] }],
    mbti: ["INTJ", "INTP"], certificates: "PCB工程师认证、EDA技能证书",
    work: "原理图绘制、PCB版图布局布线、阻抗仿真、输出生产文件、对接板厂打样",
    workTime: "以企业JD为准", salary: "8000-18000 / 月", restrictions: "身体要求：视力良好，可长期久坐；工作环境：办公室研发工位，无尘办公，偶尔进实验室"
  },
  {
    id: 541, category: "电子电器电力", name: "IC工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["微电子", "集成电路设计"] }],
    mbti: ["INTP", "INTJ"], certificates: "集成电路工程师、半导体行业认证",
    work: "芯片前端/后端设计、仿真验证、时序分析、配合流片、测试调试",
    workTime: "以企业JD为准", salary: "15000-40000 / 月", restrictions: "身体要求：视力正常，可承受阶段性加班；工作环境：研发办公室，洁净实验室，极少户外"
  },
  {
    id: 542, category: "电子电器电力", name: "电子工程师/技术员", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子信息工程", "应用电子技术"] }],
    mbti: ["ISTJ", "INTP"], certificates: "电工证、电子设备装接工",
    work: "硬件电路调试、样机测试、BOM制作、解决产线电子不良、样品整改",
    workTime: "以企业JD为准", salary: "6000-12000 / 月", restrictions: "身体要求：无色盲，手部稳定；工作环境：研发实验室+产线，部分产线为无尘车间"
  },
  {
    id: 543, category: "电子电器电力", name: "电气工程师/技术员", education: "大专",
    majors: [{ group: "理工环境类", list: ["电气工程", "电气自动化"] }],
    mbti: ["ESTJ", "ISTJ"], certificates: "低压电工证、高压电工证、PLC工程师证", requiredCert: "电工",
    work: "电控方案设计、PLC编程、控制柜接线调试、设备电气故障排查、现场改造",
    workTime: "以企业JD为准", salary: "7000-14000 / 月", restrictions: "身体要求：无恐高，手脚灵活；工作环境：办公室+工厂现场，部分岗位需要出差，有触电风险区域"
  },
  {
    id: 544, category: "电子电器电力", name: "电路工程师/技术员", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子信息", "电路系统"] }],
    mbti: ["INTP", "ISTJ"], certificates: "电子设备调试证、电工证", requiredCert: "电工",
    work: "模拟/数字电路调试、参数测试、原理图修改、维修故障电路板、测试记录",
    workTime: "以企业JD为准", salary: "6500-13000 / 月", restrictions: "身体要求：视力好，无手抖；工作环境：实验室，少量产线巡检，静电防护要求高"
  },
  {
    id: 545, category: "电子电器电力", name: "电器工程师/技术员", education: "大专",
    majors: [{ group: "理工环境类", list: ["电器工程", "家电技术"] }],
    mbti: ["ISTJ", "ESTP"], certificates: "电工证、家用电器维修证", requiredCert: "电工",
    work: "家电电器方案开发、功能测试、安规测试、产线电器问题改善",
    workTime: "以企业JD为准", salary: "6000-11000 / 月", restrictions: "身体要求：无色盲色弱；工作环境：实验室、家电产线，部分岗位接触样机高压测试"
  },
  {
    id: 546, category: "电子电器电力", name: "激光/光电子技术", education: "大专",
    majors: [{ group: "理工环境类", list: ["光电信息科学与工程", "激光工程"] }],
    mbti: ["INTP", "ISTP"], certificates: "激光设备操作证、光学检验证书",
    work: "激光光路调试、激光设备测试、光学样品打样、参数标定、设备维护",
    workTime: "以企业JD为准", salary: "7500-16000 / 月", restrictions: "身体要求：眼睛不能有基础眼底疾病，不能直视激光；工作环境：无尘光学实验室，严格避光防护"
  },
  {
    id: 547, category: "电子电器电力", name: "家电/数码产品开发工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子信息", "家电工程"] }],
    mbti: ["INTJ", "ESTJ"], certificates: "安规工程师、电工证",
    work: "数码/家电硬件方案开发、结构电子配合、可靠性测试、试产跟进、整改问题",
    workTime: "以企业JD为准", salary: "8000-16000 / 月", restrictions: "身体要求：视力良好；工作环境：研发办公室+可靠性实验室"
  },
  {
    id: 548, category: "电子电器电力", name: "电声/音响工程师/技术员", education: "大专",
    majors: [{ group: "理工环境类", list: ["声学", "电子信息工程"] }],
    mbti: ["ISFP", "INTP"], certificates: "电声测试工程师认证",
    work: "扬声器、麦克风调试，频响测试，调音、腔体设计，音质评价",
    workTime: "以企业JD为准", salary: "7000-14000 / 月", restrictions: "身体要求：听力正常，无听力损伤；工作环境：消音房、实验室，需要安静环境测试"
  },
  {
    id: 549, category: "电子电器电力", name: "无线电技术工程师/技术员", education: "大专",
    majors: [{ group: "理工环境类", list: ["通信工程", "无线电技术"] }],
    mbti: ["ISTJ", "INTP"], certificates: "无线电调试工、射频认证",
    work: "无线模块调试、射频参数测试、天线匹配、EMC整改",
    workTime: "以企业JD为准", salary: "7500-15000 / 月", restrictions: "身体要求：视力正常；工作环境：屏蔽房、实验室，有射频仪器"
  },
  {
    id: 550, category: "电子电器电力", name: "电子元器件工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["微电子", "电子材料"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "元器件可靠性认证",
    work: "元器件选型、规格核对、样品验证、失效分析、供应商技术对接",
    workTime: "以企业JD为准", salary: "7000-13000 / 月", restrictions: "身体要求：视力良好，看微小元件；工作环境：办公室+实验室，显微镜操作多"
  },
  {
    id: 551, category: "电子电器电力", name: "光源/照明工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["光源与照明", "光电工程"] }],
    mbti: ["ISTP", "ISFP"], certificates: "照明设计师、LED工程师证书",
    work: "LED光源方案、配光设计、色温亮度测试、驱动电路调试",
    workTime: "以企业JD为准", salary: "7000-13000 / 月", restrictions: "身体要求：不能畏强光，无色盲；工作环境：光学暗室、实验室"
  },
  {
    id: 552, category: "电子电器电力", name: "电力拖动/自动控制工程师/技术员", education: "大专",
    majors: [{ group: "理工环境类", list: ["自动化", "电气工程"] }],
    mbti: ["ESTJ", "ISTJ"], certificates: "电工证、PLC、变频器调试证书", requiredCert: "电工",
    work: "电机驱动方案设计、自控程序编写、传动设备调试、自动化产线整改",
    workTime: "以企业JD为准", salary: "8000-15000 / 月", restrictions: "身体要求：可接受现场走动巡检；工作环境：工厂车间，有电柜、电机设备，部分出差"
  },
  {
    id: 553, category: "电子电器电力", name: "单片机/ARM/CNC/DLC/DSP/FAE工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["自动化", "电子信息", "嵌入式"] }],
    mbti: ["INTP", "INTJ"], certificates: "嵌入式开发认证、单片机工程师",
    work: "单片机/ARM固件开发、驱动编写、客户技术支持、样品调试、问题排查",
    workTime: "以企业JD为准", salary: "9000-20000 / 月", restrictions: "身体要求：视力良好，可久坐写代码；工作环境：研发办公室，FAE岗位需要频繁出差"
  },
  {
    id: 554, category: "电子电器电力", name: "嵌入式开发工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["电子信息", "自动化", "计算机"] }],
    mbti: ["INTP", "INTJ"], certificates: "嵌入式软件工程师认证",
    work: "底层驱动开发、系统移植、固件调试、软硬件联调、版本维护",
    workTime: "以企业JD为准", salary: "10000-25000 / 月", restrictions: "身体要求：视力正常，可阶段性加班；工作环境：研发办公室，工位电脑开发"
  },
  {
    id: 555, category: "电子电器电力", name: "电池/电源开发工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电源工程", "电化学", "电子信息"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "安规证书、储能工程师",
    work: "开关电源方案、锂电池BMS开发、充放电测试、可靠性验证、热仿真",
    workTime: "以企业JD为准", salary: "9000-18000 / 月", restrictions: "身体要求：无过敏，规范接触电池样品；工作环境：实验室，电池测试区，有起火防护要求"
  },
  {
    id: 556, category: "电子电器电力", name: "电子测试工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子信息", "测控技术"] }],
    mbti: ["ISTJ"], certificates: "电子检验员、可靠性测试证书",
    work: "编写测试用例、电性能测试、记录数据、复测不良、出具测试报告",
    workTime: "以企业JD为准", salary: "6500-12000 / 月", restrictions: "身体要求：视力好，细心；工作环境：实验室，无尘车间居多"
  },
  {
    id: 557, category: "电子电器电力", name: "智能大厦/综合布线/弱电", education: "中专",
    majors: [{ group: "理工环境类", list: ["建筑智能化", "弱电工程"] }],
    mbti: ["ESTP", "ISTJ"], certificates: "弱电工程师、智能楼宇管理师",
    work: "楼宇网线、监控、门禁布线，弱电设备安装调试、故障检修、点位施工",
    workTime: "以企业JD为准", salary: "6000-11000 / 月", restrictions: "身体要求：无恐高，能爬梯；工作环境：写字楼、工地现场，高空作业，多外出"
  },
  {
    id: 558, category: "电子电器电力", name: "电机与电器", education: "大专",
    majors: [{ group: "理工环境类", list: ["电机与电器", "电气工程"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "电工证、电机调试证",
    work: "电机本体设计、绕组计算、性能测试、噪音振动测试、产线不良改善",
    workTime: "以企业JD为准", salary: "7000-13000 / 月", restrictions: "身体要求：听力尚可，能识别电机异响；工作环境：电机实验室、生产车间，有噪音"
  },
  {
    id: 559, category: "电子电器电力", name: "变压器/磁电工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电气工程", "磁性材料"] }],
    mbti: ["ISTJ", "INTP"], certificates: "变压器设计认证、电工证",
    work: "变压器磁芯选型、绕线方案、电感耐压测试、损耗测试、样品打样",
    workTime: "以企业JD为准", salary: "7500-14000 / 月", restrictions: "身体要求：视力良好；工作环境：实验室，车间样品制作区"
  },
  {
    id: 560, category: "电子电器电力", name: "家用电器研发", education: "大专",
    majors: [{ group: "理工环境类", list: ["家电工程", "电子信息"] }],
    mbti: ["INTJ", "ESTJ"], certificates: "安规工程师证书",
    work: "家电新品研发，电子+结构协同开发，可靠性、安全测试，试产跟进",
    workTime: "以企业JD为准", salary: "8500-17000 / 月", restrictions: "身体要求：视力正常；工作环境：研发办公室、可靠性实验室"
  },
  {
    id: 561, category: "电子电器电力", name: "家用电器维修", education: "中专",
    majors: [{ group: "理工环境类", list: ["家电维修", "应用电子"] }],
    mbti: ["ISTP"], certificates: "家用电器维修工、低压电工证",
    work: "上门维修冰箱、空调、洗衣机等家电，检测故障，更换配件，调试交付",
    workTime: "以企业JD为准", salary: "5000-9000 / 月", restrictions: "身体要求：无恐高，体力尚可；工作环境：客户家里、售后门店，外出上门，环境不稳定"
  },

  /* ============ 四十五、化工生物（562–564） ============ */
  {
    id: 562, category: "化工生物", name: "化工生产工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["化学工程与工艺"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "化工总控工、安全员证",
    work: "化工生产工艺管控、参数调整、现场巡检、SOP制定、处理生产异常",
    workTime: "以企业JD为准", salary: "7000-13000 / 月", restrictions: "身体要求：无化学过敏，无基础肺病；工作环境：化工生产厂区，有化学品气味，需穿戴防护服，部分需要倒班"
  },
  {
    id: 563, category: "化工生物", name: "精细化工工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["精细化工", "应用化学"] }],
    mbti: ["INTP", "ISTJ"], certificates: "化工检验员、化工工程师职称",
    work: "配方研发、小试中试、原料配比、样品检测、工艺放大、记录实验数据",
    workTime: "以企业JD为准", salary: "8000-15000 / 月", restrictions: "身体要求：无化学品过敏；工作环境：化工实验室，通风橱作业，有试剂气味"
  },
  {
    id: 564, category: "化工生物", name: "高分子材料工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["高分子材料与工程"] }],
    mbti: ["INTP", "ISTJ"], certificates: "材料检验证书、高分子工程师",
    work: "塑料、胶料配方开发，改性实验，物性测试，挤出注塑工艺调试",
    workTime: "以企业JD为准", salary: "8500-16000 / 月", restrictions: "身体要求：无粉尘、化学过敏；工作环境：实验室 + 材料车间，少量粉尘"
  },

  /* ============ 化工生物 追加（565–570） ============ */
  {
    id: 565, category: "化工生物", name: "化工制药", education: "大专",
    majors: [{ group: "理工环境类", list: ["制药工程", "化学制药"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "药物检验员、GMP内审员",
    work: "原料药合成工艺、制药车间生产管控、洁净区操作、记录批生产记录",
    workTime: "以企业JD为准", salary: "7000-14000 / 月", restrictions: "身体要求：无药物过敏，无传染性疾病；工作环境：GMP洁净车间，恒温恒湿，穿戴无尘服，轮班"
  },
  {
    id: 566, category: "化工生物", name: "化验员 / 检验员", education: "中专",
    majors: [{ group: "理工环境类", list: ["应用化学", "分析检验"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "化学检验员",
    work: "原料、成品取样，理化实验，滴定、色谱检测，填写化验报告单",
    workTime: "以企业JD为准", salary: "4500-7000 / 月", restrictions: "身体要求：无化学试剂过敏，无色盲；工作环境：化验室，有化学试剂，通风环境"
  },
  {
    id: 567, category: "化工生物", name: "化工生产技术员", education: "大专",
    majors: [{ group: "理工环境类", list: ["化工工艺"] }],
    mbti: ["ISTJ"], certificates: "化工总控工证",
    work: "跟着工艺员盯产线，记录工艺参数，取样，协助处理简单生产异常",
    workTime: "以企业JD为准", salary: "5500-9000 / 月", restrictions: "身体要求：无化学过敏；工作环境：化工厂区，倒班，劳保穿戴"
  },
  {
    id: 568, category: "化工生物", name: "化学分析 / 测试", education: "中专",
    majors: [{ group: "理工环境类", list: ["分析化学", "商检技术"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "化学检验员",
    work: "样品前处理，光谱色谱检测，数据记录，出具分析报告，仪器维护",
    workTime: "以企业JD为准", salary: "5000-8500 / 月", restrictions: "身体要求：无色盲，无试剂过敏；工作环境：分析实验室，通风柜，化学试剂环境"
  },
  {
    id: 569, category: "化工生物", name: "生物工程 / 生物制药", education: "大专",
    majors: [{ group: "理工环境类", list: ["生物工程", "生物制药"] }],
    mbti: ["INTP", "ISTJ"], certificates: "微生物检验员、GMP内审员",
    work: "菌种培养、发酵、生物样品检测，洁净车间操作，实验记录",
    workTime: "以企业JD为准", salary: "7500-15000 / 月", restrictions: "身体要求：无生物试剂过敏，无传染病；工作环境：生物洁净实验室，无菌环境"
  },
  {
    id: 570, category: "化工生物", name: "环保技术", education: "大专",
    majors: [{ group: "理工环境类", list: ["环境工程", "环境监测"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "环境监测员、污水处理工、排污管理员",
    work: "废水废气治理调试、水样气样采集检测、环保设备运维、台账上报",
    workTime: "以企业JD为准", salary: "6000-11000 / 月", restrictions: "身体要求：无过敏，可去污水站点巡检；工作环境：污水处理站、废气车间，异味大，部分户外采样"
  },

  /* ============ 四十六、医院医疗（571–583） ============ */
  {
    id: 571, category: "医院医疗", name: "西医 / 中医", education: "本科",
    majors: [{ group: "医学类", list: ["临床医学", "中医学"] }],
    mbti: ["ISTJ", "INFJ"], certificates: "执业医师资格证", requiredCert: "执业医师",
    work: "问诊、查体、开具检查、诊断开药、查房、手术、病历书写",
    workTime: "以企业JD为准", salary: "10000-30000（和职称、医院等级差距大）", restrictions: "身体要求：身体健康，抗压能力强；工作环境：医院门诊、病房、手术室，需要夜班"
  },
  {
    id: 572, category: "医院医疗", name: "内科 / 外科医生 / 专科医生", education: "本科",
    majors: [{ group: "医学类", list: ["临床医学"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "执业医师证、专科规培证", requiredCert: "执业医师",
    work: "接诊病人、查房、手术、病情评估、医嘱下达、抢救、病历",
    workTime: "以企业JD为准", salary: "12000-35000 / 月", restrictions: "身体要求：体力好，能熬夜值班；工作环境：病房、手术室，轮夜班，接触病患"
  },
  {
    id: 573, category: "医院医疗", name: "心理医生", education: "本科",
    majors: [{ group: "医学类", list: ["临床医学", "应用心理学"] }],
    mbti: ["INFJ", "INFP"], certificates: "执业医师（心理方向）、心理治疗师证", requiredCert: "执业医师",
    work: "心理评估、心理咨询、心理治疗、危机干预、病历记录",
    workTime: "以企业JD为准", salary: "8000-20000 / 月", restrictions: "身体要求：情绪稳定，共情能力强；工作环境：心理门诊，安静诊室"
  },
  {
    id: 574, category: "医院医疗", name: "兽医 / 宠物医生", education: "大专",
    majors: [{ group: "医学类", list: ["动物医学"] }],
    mbti: ["ISFP", "ISTJ"], certificates: "执业兽医师证", requiredCert: "执业兽医",
    work: "宠物问诊、体检、打针、手术、驱虫、术后护理、跟宠主沟通",
    workTime: "以企业JD为准", salary: "6000-15000 / 月", restrictions: "身体要求：不对动物毛发、疫苗过敏，不怕动物抓咬；工作环境：宠物医院，猫狗较多，有异味"
  },
  {
    id: 575, category: "医院医疗", name: "医疗技术 / 医学药检验师 / 医疗器械", education: "大专",
    majors: [{ group: "医学类", list: ["医学检验技术", "医疗器械工程"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "检验技师证、医疗器械上岗证",
    work: "标本检验、设备操作、医疗器械维修校准、质控、报告出具",
    workTime: "以企业JD为准", salary: "6000-11000 / 月", restrictions: "身体要求：无传染病，细心；工作环境：检验科、设备科，医院室内，部分需要轮班"
  },
  {
    id: 576, category: "医院医疗", name: "药剂师", education: "大专",
    majors: [{ group: "医学类", list: ["药学", "药物制剂"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "执业药师、药师职称证", requiredCert: "执业药师",
    work: "药房审方、配药发药、药品养护、效期管理、用药指导",
    workTime: "以企业JD为准", salary: "6500-12000 / 月", restrictions: "身体要求：无药物过敏；工作环境：医院药房、药店，室内，部分轮班"
  },
  {
    id: 577, category: "医院医疗", name: "麻醉师", education: "本科",
    majors: [{ group: "医学类", list: ["麻醉学"] }],
    mbti: ["ISTJ"], certificates: "执业医师证（麻醉方向）", requiredCert: "执业医师",
    work: "术前评估、术中麻醉监护、术后镇痛管理、抢救配合",
    workTime: "以企业JD为准", salary: "13000-30000 / 月", restrictions: "身体要求：体力好，长时间站立值守；工作环境：手术室，急诊夜班多"
  },
  {
    id: 578, category: "医院医疗", name: "营养师", education: "大专",
    majors: [{ group: "医学类", list: ["营养学", "食品营养"] }],
    mbti: ["ISFJ", "INFJ"], certificates: "公共营养师",
    work: "膳食方案制定、营养宣教、患者饮食指导、食谱规划",
    workTime: "以企业JD为准", salary: "5000-9000 / 月", restrictions: "身体要求：无特殊；工作环境：医院营养科、健康中心"
  },
  {
    id: 579, category: "医院医疗", name: "护理人员 / 护士", education: "大专",
    majors: [{ group: "医学类", list: ["护理"] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "护士执业资格证", requiredCert: "护士执业",
    work: "打针输液、生命体征监测、执行医嘱、基础护理、巡房、书写护理记录",
    workTime: "以企业JD为准", salary: "5000-10000 / 月", restrictions: "身体要求：无传染性疾病，体力好；工作环境：病房，倒夜班，接触病患"
  },
  {
    id: 580, category: "医院医疗", name: "卫生防疫", education: "大专",
    majors: [{ group: "医学类", list: ["预防医学", "公共卫生"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "公共卫生医师证", requiredCert: "公共卫生医师",
    work: "传染病排查、消杀、流调、健康宣教、采样、防疫台账",
    workTime: "以企业JD为准", salary: "6000-10000 / 月", restrictions: "身体要求：无传染病，可外出下乡采样；工作环境：疾控中心、社区、户外现场"
  },
  {
    id: 581, category: "医院医疗", name: "妇幼保健", education: "大专",
    majors: [{ group: "医学类", list: ["妇幼保健", "护理"] }],
    mbti: ["ISFJ", "ESFJ"], certificates: "妇幼保健上岗证、护士证",
    work: "孕产妇、儿童体检，保健宣教，随访，基础筛查",
    workTime: "以企业JD为准", salary: "5500-9500 / 月", restrictions: "身体要求：有耐心；工作环境：妇幼保健院、社区卫生中心"
  },
  {
    id: 582, category: "医院医疗", name: "针灸推拿", education: "大专",
    majors: [{ group: "医学类", list: ["针灸推拿学"] }],
    mbti: ["ISFJ", "ISTP"], certificates: "中医执业医师 / 康复治疗师证", requiredCert: "执业医师",
    work: "针灸、艾灸、推拿正骨、理疗、康复评估",
    workTime: "以企业JD为准", salary: "6000-12000 / 月", restrictions: "身体要求：手部力量充足，无手部关节疾病；工作环境：理疗诊室"
  },
  {
    id: 583, category: "医院医疗", name: "医院管理人员", education: "本科",
    majors: [{ group: "医学类", list: ["公共事业管理", "临床医学"] }],
    mbti: ["ESTJ"], certificates: "医院管理相关培训证书",
    work: "科室管理、制度落实、质控、人事、后勤协调、行政报表",
    workTime: "以企业JD为准", salary: "8000-18000 / 月", restrictions: "身体要求：抗压能力强；工作环境：医院行政办公室"
  },

  /* ============ 四十七、新闻出版传媒（584–599） ============ */
  {
    id: 584, category: "新闻出版传媒", name: "总编 / 主编", education: "本科",
    majors: [{ group: "文法大类", list: ["汉语言", "新闻传播学"] }],
    mbti: ["ENTJ", "INTJ"], certificates: "出版专业职业资格（高级）",
    work: "内容方向把控、稿件终审、栏目规划、团队管理、对外资源对接",
    workTime: "以企业JD为准", salary: "15000-40000 / 月", restrictions: "身体要求：可长期伏案，抗压；工作环境：编辑部办公室"
  },
  {
    id: 585, category: "新闻出版传媒", name: "编辑 / 作家 / 独立撰稿人", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言文学", "新闻"] }],
    mbti: ["INFP", "INFJ"], certificates: "出版资格证",
    work: "稿件撰写、文稿润色、选题策划、内容修改，撰稿人自主约稿交稿",
    workTime: "以企业JD为准", salary: "6000-18000（撰稿浮动大）", restrictions: "身体要求：视力良好，久坐；工作环境：办公室 / 居家自由办公"
  },
  {
    id: 586, category: "新闻出版传媒", name: "文字编辑", education: "大专",
    majors: [{ group: "文法大类", list: ["汉语言", "新闻"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "出版专业资格证",
    work: "稿件初审、文字修改、语病校对、排版对接、跟进稿件进度",
    workTime: "以企业JD为准", salary: "5500-10000 / 月", restrictions: "身体要求：细心，视力良好；工作环境：编辑部办公室"
  },
  {
    id: 587, category: "新闻出版传媒", name: "美术编辑 / 美工", education: "大专",
    majors: [{ group: "艺术大类", list: ["视觉传达", "美术设计"] }],
    mbti: ["ISFP", "INFP"], certificates: "Adobe设计师证书",
    work: "图文排版、配图、封面设计、版式美化、素材处理",
    workTime: "以企业JD为准", salary: "6000-11000 / 月", restrictions: "身体要求：无色盲色弱；工作环境：办公室电脑工位"
  },
  {
    id: 588, category: "新闻出版传媒", name: "排版设计", education: "中专",
    majors: [{ group: "艺术大类", list: ["数字图文", "视觉传达"] }],
    mbti: ["ISTJ", "ISFP"], certificates: "印前制作员证",
    work: "书籍、画册稿件排版，调整字体行距，输出印刷文件",
    workTime: "以企业JD为准", salary: "5000-9000 / 月", restrictions: "身体要求：无色盲色弱，长期看屏幕；工作环境：图文办公室"
  },
  {
    id: 589, category: "新闻出版传媒", name: "校对 / 录入", education: "中专",
    majors: [{ group: "文法大类", list: ["汉语言", "文秘"] }],
    mbti: ["ISTJ"], certificates: "出版校对相关证书",
    work: "核对文稿错别字、语病、格式错误，文字录入，反复比对原稿",
    workTime: "以企业JD为准", salary: "4200-7000 / 月", restrictions: "身体要求：视力好，极度细心；工作环境：办公室，久坐"
  },
  {
    id: 590, category: "新闻出版传媒", name: "记者 / 新闻采编", education: "本科",
    majors: [{ group: "文法大类", list: ["新闻学", "网络与新媒体"] }],
    mbti: ["ESFP", "ENTP"], certificates: "新闻记者证",
    work: "外出采访、写新闻稿、素材拍摄、选题跟进、稿件报送",
    workTime: "以企业JD为准", salary: "6000-13000 / 月", restrictions: "身体要求：能出差、外勤，体力尚可；工作环境：办公室 + 户外各类采访现场"
  },
  {
    id: 591, category: "新闻出版传媒", name: "出版 / 发行", education: "大专",
    majors: [{ group: "管理大类", list: ["出版发行", "市场营销"] }],
    mbti: ["ESTJ"], certificates: "出版专业资格证",
    work: "图书渠道对接、备货、发货、库存管理、销售回款、渠道维护",
    workTime: "以企业JD为准", salary: "5500-10000 / 月", restrictions: "身体要求：可以外出跑渠道；工作环境：办公室，偶尔去仓库、书商渠道"
  },
  {
    id: 592, category: "新闻出版传媒", name: "影视策划 / 艺术总监", education: "本科",
    majors: [{ group: "艺术大类", list: ["编导", "影视艺术"] }],
    mbti: ["ENTP", "ENFJ"], certificates: "无强制，行业项目经验优先",
    work: "剧本策划、项目立项、风格把控、主创沟通、预算规划",
    workTime: "以企业JD为准", salary: "10000-30000 / 月", restrictions: "身体要求：抗压，跟组熬夜；工作环境：办公室 + 影视拍摄片场"
  },
  {
    id: 593, category: "新闻出版传媒", name: "导演 / 编导", education: "大专",
    majors: [{ group: "艺术大类", list: ["广播电视编导", "导演"] }],
    mbti: ["ENTJ", "ENFP"], certificates: "无强制",
    work: "脚本创作、现场导戏、镜头调度、把控成片效果、后期对接",
    workTime: "以企业JD为准", salary: "12000-40000 / 月", restrictions: "身体要求：体力强，经常熬夜跟组；工作环境：拍摄外景、摄影棚，环境多变"
  },
  {
    id: 594, category: "新闻出版传媒", name: "经纪人 / 星探", education: "大专",
    majors: [{ group: "管理大类", list: ["传媒", "市场营销"] }],
    mbti: ["ENFJ", "ESTP"], certificates: "演出经纪人员资格证",
    work: "艺人对接、商务洽谈、资源对接、行程安排、发掘新人",
    workTime: "以企业JD为准", salary: "7000-20000（浮动极大）", restrictions: "身体要求：社交能力强，经常外出应酬出差；工作环境：办公室、活动现场、商务场合"
  },
  {
    id: 595, category: "新闻出版传媒", name: "演员 / 模特 / 礼仪 / 主持人 / 播音", education: "中专",
    majors: [{ group: "艺术大类", list: ["表演", "播音主持", "服装表演"] }],
    mbti: ["ESFP", "ENFP"], certificates: "主持人证（广电）、演出证",
    work: "出镜表演、走秀、活动礼仪、节目主持、稿件播音录制",
    workTime: "以企业JD为准", salary: "6000-上不封顶（波动很大）", restrictions: "身体要求：形象符合岗位要求，体态良好；工作环境：演播厅、外景、活动现场"
  },
  {
    id: 596, category: "新闻出版传媒", name: "摄影师 / 灯光师 / 摄影录制", education: "中专",
    majors: [{ group: "艺术大类", list: ["摄影摄像", "影视技术"] }],
    mbti: ["ISFP", "ISTP"], certificates: "摄影师职业技能证",
    work: "拍摄照片视频、布光、机位架设、录制素材、设备调试",
    workTime: "以企业JD为准", salary: "6000-15000 / 月", restrictions: "身体要求：体力好，扛设备，可户外；工作环境：影棚、外景，日晒多变"
  },
  {
    id: 597, category: "新闻出版传媒", name: "音效 / 配音", education: "大专",
    majors: [{ group: "艺术大类", list: ["播音", "录音艺术"] }],
    mbti: ["ISFP", "INFP"], certificates: "配音相关技能证书",
    work: "配音录制、音效剪辑、音频降噪、配乐合成、棚内录音",
    workTime: "以企业JD为准", salary: "5500-13000 / 月", restrictions: "身体要求：声带健康，听力正常；工作环境：录音棚，隔音安静环境"
  },
  {
    id: 598, category: "新闻出版传媒", name: "制作 / 剪辑 / 合成 / 冲印", education: "中专",
    majors: [{ group: "艺术大类", list: ["影视后期", "数字媒体"] }],
    mbti: ["ISTJ", "ISFP"], certificates: "视频剪辑技能证书",
    work: "素材剪辑、特效合成、调色、冲印修图、成片输出",
    workTime: "以企业JD为准", salary: "5500-11000 / 月", restrictions: "身体要求：视力良好，久坐；工作环境：后期机房，电脑工位"
  },
  {
    id: 599, category: "新闻出版传媒", name: "造型 / 化妆 / 剧务", education: "无强制",
    majors: [{ group: "艺术大类", list: ["形象设计", "影视化妆"] }],
    mbti: ["ESFP", "ISFP"], certificates: "化妆师职业技能证",
    work: "演员化妆造型、发型打理；剧务负责物资、场地、后勤调度",
    workTime: "以企业JD为准", salary: "5000-10000 / 月", restrictions: "身体要求：能早起跟组，不怕脏累；工作环境：片场、化妆间，外景条件不稳定"
  },

  /* ============ 四十八、采购（600–605） ============ */
  {
    id: 600, category: "采购", name: "采购总监", education: "本科",
    majors: [{ group: "管理大类", list: ["供应链管理", "物流管理"] }],
    mbti: ["ENTJ", "ESTJ"], certificates: "CPPM注册采购经理",
    work: "采购战略制定、供应商资源规划、成本管控、采购团队管理、大额商务谈判",
    workTime: "以企业JD为准", salary: "18000-40000 / 月", restrictions: "身体要求：可出差，抗压；工作环境：办公室，经常外出供应商拜访"
  },
  {
    id: 601, category: "采购", name: "采购经理 / 主管", education: "大专",
    majors: [{ group: "管理大类", list: ["供应链", "采购管理"] }],
    mbti: ["ESTJ"], certificates: "CPPM、CPSM",
    work: "采购计划审核、供应商管理、价格谈判、交期跟进、下属工作安排、异常处理",
    workTime: "以企业JD为准", salary: "10000-20000 / 月", restrictions: "身体要求：可短途出差；工作环境：办公室，工厂、供应商现场巡检"
  },
  {
    id: 602, category: "采购", name: "采购专员 / 助理", education: "大专",
    majors: [{ group: "管理大类", list: ["物流", "供应链", "工商管理"] }],
    mbti: ["ISTJ", "ESFJ"], certificates: "采购师初级证书",
    work: "下达采购订单、跟催交期、对账、样品申请、单据整理、对接供应商",
    workTime: "以企业JD为准", salary: "4800-8000 / 月", restrictions: "身体要求：细心，沟通顺畅；工作环境：办公室为主，偶尔去仓库、供应商"
  },
  {
    id: 603, category: "采购", name: "供应商管理", education: "大专",
    majors: [{ group: "管理大类", list: ["供应链", "质量管理"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "供应商审核员、SQE证书",
    work: "供应商审核、品质考核、辅导改善、年度评估、风险管控",
    workTime: "以企业JD为准", salary: "7000-13000 / 月", restrictions: "身体要求：可以出差到供应商工厂；工作环境：办公室 + 外厂现场审核"
  },
  {
    id: 604, category: "采购", name: "外贸采购", education: "大专",
    majors: [{ group: "管理大类", list: ["国际经济与贸易"] }, { group: "外语类", list: ["商务英语"] }],
    mbti: ["ESTP", "ISTJ"], certificates: "国际贸易单证证、采购证书",
    work: "海外供应商询盘、比价、下采购单、跟进报关、物流、外汇单据",
    workTime: "以企业JD为准", salary: "7000-14000 / 月", restrictions: "身体要求：可接受时差沟通、出差；工作环境：办公室，线上对接海外客户"
  },
  {
    id: 605, category: "采购", name: "材料 / 设备采购管理", education: "大专",
    majors: [{ group: "理工环境类", list: ["机电"] }, { group: "管理大类", list: ["供应链管理"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "采购管理证书",
    work: "原材料、生产设备寻源比价、招标、合同签订、到货验收、售后对接",
    workTime: "以企业JD为准", salary: "6500-12000 / 月", restrictions: "身体要求：看得懂基础设备图纸，可去现场验收；工作环境：办公室 + 车间设备现场"
  },

  /* ============ 四十九、质量品管（606–614） ============ */
  {
    id: 606, category: "质量品管", name: "品质经理 (QA/QC 经理)", education: "大专",
    majors: [{ group: "管理大类", list: ["质量管理"] }, { group: "理工环境类", list: ["材料", "电子"] }],
    mbti: ["ESTJ"], certificates: "ISO内审员、六西格玛、CQE注册质量工程师",
    work: "品质体系搭建、客诉处理、品质团队管理、质量目标管控、审核安排",
    workTime: "以企业JD为准", salary: "9000-18000 / 月", restrictions: "身体要求：可以车间巡检、出差审核；工作环境：办公室 + 生产车间"
  },
  {
    id: 607, category: "质量品管", name: "品质主管 (QA/QC 主管)", education: "大专",
    majors: [{ group: "管理大类", list: ["质量管理"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "内审员、质量工程师",
    work: "检验标准制定、巡检安排、不良判定、跟进改善、报表汇总、对接生产",
    workTime: "以企业JD为准", salary: "7500-14000 / 月", restrictions: "身体要求：车间走动巡检；工作环境：办公室 + 产线"
  },
  {
    id: 608, category: "质量品管", name: "品质工程师 (QA/QC 工程师)", education: "大专",
    majors: [{ group: "理工环境类", list: ["测控", "电子", "材料"] }, { group: "管理大类", list: ["质量管理"] }],
    mbti: ["ISTJ"], certificates: "CQE、ISO内审员",
    work: "不良分析、8D报告、可靠性测试、检验规范编写、制程改善",
    workTime: "以企业JD为准", salary: "7000-13000 / 月", restrictions: "身体要求：细心，能在产线取样；工作环境：实验室、车间、办公室"
  },
  {
    id: 609, category: "质量品管", name: "化验员 / 检验员", education: "中专",
    majors: [{ group: "理工环境类", list: ["分析检验", "化工"] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "化学检验员",
    work: "样品化验、理化检测、记录数据、填写检验报告",
    workTime: "以企业JD为准", salary: "4500-7000 / 月", restrictions: "身体要求：无色盲，无化学过敏；工作环境：化验室"
  },
  {
    id: 610, category: "质量品管", name: "质检员 / 测试员", education: "中专",
    majors: [{ group: "理工环境类", list: ["机电", "电子"] }],
    mbti: ["ISTJ"], certificates: "产品检验员证",
    work: "来料检验、巡检、成品检验，按标准核对外观、功能，挑不良品",
    workTime: "以企业JD为准", salary: "4300-7000 / 月", restrictions: "身体要求：无色盲色弱，视力良好；工作环境：生产车间，部分无尘车间"
  },
  {
    id: 611, category: "质量品管", name: "标准化工程师 (ISO 等)", education: "大专",
    majors: [{ group: "管理大类", list: ["标准化工程", "质量管理"] }],
    mbti: ["ISTJ"], certificates: "ISO体系内审员、标准化工程师",
    work: "企业标准编制、体系文件维护、标准更新、对标国标行标、培训宣导",
    workTime: "以企业JD为准", salary: "8000-15000 / 月", restrictions: "身体要求：可车间、部门走访；工作环境：办公室为主"
  },
  {
    id: 612, category: "质量品管", name: "体系 / 认证工程师 / 审核员 (ISO 等)", education: "大专",
    majors: [{ group: "管理大类", list: ["质量管理", "经管"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "ISO外审员、内审员",
    work: "ISO9001/14001等体系维护、内部审核、对接第三方认证、整改不符合项",
    workTime: "以企业JD为准", salary: "8500-16000 / 月", restrictions: "身体要求：经常出差去各工厂审核；工作环境：办公室 + 全国各地工厂现场"
  },
  {
    id: 613, category: "质量品管", name: "安全 / 健康 / 环境工程师（EHS）", education: "大专",
    majors: [{ group: "理工环境类", list: ["安全工程", "环境工程"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "注册安全工程师、EHS内审员",
    work: "安全隐患排查、消防管理、危化品管控、环保合规、安全培训、应急预案",
    workTime: "以企业JD为准", salary: "7500-14000 / 月", restrictions: "身体要求：可以车间、厂区巡检；工作环境：厂区车间，部分危化区域"
  },
  {
    id: 614, category: "质量品管", name: "物控 / 资材 / 物料 / PMC", education: "大专",
    majors: [{ group: "管理大类", list: ["供应链", "物流管理"] }],
    mbti: ["ISTJ"], certificates: "PMC生产与物料管理证书",
    work: "生产排程、物料需求核算、物料跟进、库存管控、缺料预警、产销协调",
    workTime: "以企业JD为准", salary: "5500-10000 / 月", restrictions: "身体要求：细心，对数字敏感；工作环境：办公室，偶尔仓库盘点"
  },

  /* ============ 五十、手机通信（615–622） ============ */
  {
    id: 615, category: "手机通信", name: "通信技术 / 电信工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["通信工程", "移动通信技术"] }],
    mbti: ["ISTJ", "INTP"], certificates: "通信工程师、华为HCIA/HCIP",
    work: "基站调试、通信线路排查、5G设备维护、通信网络优化、故障抢修",
    workTime: "以企业JD为准", salary: "8000-16000 / 月", restrictions: "身体要求：无恐高，可上基站塔；工作环境：机房、户外基站，高空作业"
  },
  {
    id: 616, category: "手机通信", name: "射频工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["通信工程", "射频微波"] }],
    mbti: ["INTP", "INTJ"], certificates: "射频相关认证",
    work: "射频电路设计、天线调试、匹配仿真、OTA测试、EMC整改",
    workTime: "以企业JD为准", salary: "12000-25000 / 月", restrictions: "身体要求：视力良好；工作环境：屏蔽暗室、研发实验室"
  },
  {
    id: 617, category: "手机通信", name: "手机硬件项目经理", education: "本科",
    majors: [{ group: "理工环境类", list: ["电子信息", "通信"] }],
    mbti: ["ESTJ"], certificates: "PMP项目管理证书",
    work: "手机硬件项目统筹、进度管控、跨部门协调、风险跟进、量产导入",
    workTime: "以企业JD为准", salary: "12000-22000 / 月", restrictions: "身体要求：抗压，阶段性加班；工作环境：研发办公室"
  },
  {
    id: 618, category: "手机通信", name: "手机软件项目经理", education: "本科",
    majors: [{ group: "计算机大类", list: ["计算机科学与技术", "软件工程"] }],
    mbti: ["ESTJ", "ENTJ"], certificates: "PMP、ACP敏捷认证",
    work: "手机系统/APP项目排期、需求管理、研发进度跟进、版本管控",
    workTime: "以企业JD为准", salary: "13000-24000 / 月", restrictions: "身体要求：抗压；工作环境：互联网研发办公室"
  },
  {
    id: 619, category: "手机通信", name: "手机应用开发工程师", education: "大专",
    majors: [{ group: "计算机大类", list: ["软件工程", "移动开发"] }],
    mbti: ["INTP", "INTJ"], certificates: "安卓/iOS开发相关认证",
    work: "手机APP功能开发、接口对接、bug修复、版本迭代、适配调试",
    workTime: "以企业JD为准", salary: "11000-23000 / 月", restrictions: "身体要求：视力正常，长期久坐写代码；工作环境：研发办公室"
  },
  {
    id: 620, category: "手机通信", name: "手机结构工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["机械设计"] }, { group: "艺术大类", list: ["工业设计"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "CAD、Creo技能证书",
    work: "手机壳体结构设计、堆叠、公差分析、模厂对接、跌落可靠性跟进",
    workTime: "以企业JD为准", salary: "10000-20000 / 月", restrictions: "身体要求：看懂3D图纸，细心；工作环境：研发办公室 + 可靠性实验室"
  },
  {
    id: 621, category: "手机通信", name: "手机驱动 / 测试工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["电子信息", "自动化", "测控"] }],
    mbti: ["INTP", "ISTJ"], certificates: "软件测试工程师认证",
    work: "底层驱动调试、手机功能测试、稳定性测试、复现bug、提交问题单",
    workTime: "以企业JD为准", salary: "9000-18000 / 月", restrictions: "身体要求：耐心，反复复测；工作环境：研发实验室"
  },
  {
    id: 622, category: "手机通信", name: "手机维修工程师", education: "中专",
    majors: [{ group: "理工环境类", list: ["通信终端维修", "电子技术"] }],
    mbti: ["ISTP"], certificates: "手机维修技师证",
    work: "手机拆机、换屏、换主板、故障检测、刷机、清洁维修",
    workTime: "以企业JD为准", salary: "5500-10000 / 月", restrictions: "身体要求：手稳，视力好，不手抖；工作环境：维修工作台，静电工位"
  },

  /* ============ 五十一、公众服务（623–631） ============ */
  {
    id: 623, category: "公众服务", name: "保安", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "保安员证",
    work: "门禁值守、巡逻、车辆登记、秩序维护、监控查看",
    workTime: "以企业JD为准", salary: "3500-6000 / 月", restrictions: "身体要求：身体健康，无犯罪记录；工作环境：小区、园区、写字楼岗亭，户外 + 室内，夜班"
  },
  {
    id: 624, category: "公众服务", name: "消防员", education: "高中",
    majors: [{ group: "理工环境类", list: ["消防工程"] }],
    mbti: ["ESTP", "ISTJ"], certificates: "消防员证",
    work: "灭火救援、消防巡查、体能训练、消防宣传、隐患排查",
    workTime: "以企业JD为准", salary: "6000-12000 / 月", restrictions: "身体要求：体能优秀，无基础疾病；工作环境：消防执勤站，火灾现场危险环境"
  },
  {
    id: 625, category: "公众服务", name: "快递员", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESTP"], certificates: "无强制",
    work: "分拣快件、上门派件、揽收快递、扫码录入、和客户沟通",
    workTime: "以企业JD为准", salary: "5000-9000（多劳多得）", restrictions: "身体要求：体力好，会骑电动车；工作环境：户外风吹日晒，网点仓库"
  },
  {
    id: 626, category: "公众服务", name: "旅游 / 导游", education: "高中",
    majors: [{ group: "管理大类", list: ["旅游管理"] }],
    mbti: ["ESFP", "ENFJ"], certificates: "导游资格证",
    work: "带团讲解、行程安排、票务住宿对接、游客接待、应急处理",
    workTime: "以企业JD为准", salary: "4500-10000（淡旺季差距大）", restrictions: "身体要求：长时间走路，体力好；工作环境：景区、旅途大巴，长期外勤"
  },
  {
    id: 627, category: "公众服务", name: "声讯", education: "中专",
    majors: [{ group: "文法大类", list: ["文秘", "客服"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "无强制",
    work: "接听热线、信息登记、咨询解答、工单记录",
    workTime: "以企业JD为准", salary: "4000-7000 / 月", restrictions: "身体要求：口齿清晰，情绪稳定；工作环境：呼叫中心机房，久坐接电话"
  },
  {
    id: 628, category: "公众服务", name: "按摩师 / 美容 / 美发", education: "无强制",
    majors: [{ group: "艺术大类", list: ["美容美体", "形象设计"] }],
    mbti: ["ISFP", "ESFP"], certificates: "美容师、美发师、保健按摩师证",
    work: "美容护肤、烫染剪发、推拿按摩、客户接待、项目推销",
    workTime: "以企业JD为准", salary: "4500-9000（提成制）", restrictions: "身体要求：手部无皮肤病，体力好，长期站立；工作环境：美容院、美发店，室内"
  },
  {
    id: 629, category: "公众服务", name: "家政", education: "无强制",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ"], certificates: "家政服务员证",
    work: "家庭保洁、做饭、收纳、照顾老人小孩等家务服务",
    workTime: "以企业JD为准", salary: "4000-8000 / 月", restrictions: "身体要求：身体健康，无传染病；工作环境：客户家庭内，环境各不相同"
  },
  {
    id: 630, category: "公众服务", name: "裁缝", education: "无强制",
    majors: [{ group: "艺术大类", list: ["服装设计与工艺"] }],
    mbti: ["ISFJ", "ISTP"], certificates: "缝纫工技能证",
    work: "量体裁衣、布料裁剪、缝制衣服、修改服装、锁边熨烫",
    workTime: "以企业JD为准", salary: "4000-7500 / 月", restrictions: "身体要求：视力良好，手巧；工作环境：裁缝工作室，缝纫工位"
  },
  {
    id: 631, category: "公众服务", name: "环卫工", education: "无强制",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "道路清扫、垃圾收集转运、公共区域保洁",
    workTime: "以企业JD为准", salary: "3200-5500 / 月", restrictions: "身体要求：体力好；工作环境：户外道路，日晒雨淋"
  },

  /* ============ 五十二、银行保险（632–642） ============ */
  {
    id: 632, category: "银行保险", name: "银行行长 / 副行长", education: "本科",
    majors: [{ group: "金融类", list: ["金融学", "经济学"] }],
    mbti: ["ENTJ", "ESTJ"], certificates: "银行从业、高级经济师",
    work: "网点经营管理、业绩统筹、团队管理、大客户维护、风险把控",
    workTime: "以企业JD为准", salary: "20000-50000+/月", restrictions: "身体要求：应酬多，抗压；工作环境：银行网点办公室"
  },
  {
    id: 633, category: "银行保险", name: "银行营业部主任", education: "本科",
    majors: [{ group: "金融类", list: ["金融", "财会"] }],
    mbti: ["ESTJ"], certificates: "银行从业资格证",
    work: "营业部排班、厅堂管理、业务督导、客户纠纷处理、指标管控",
    workTime: "以企业JD为准", salary: "12000-25000 / 月", restrictions: "身体要求：沟通能力强；工作环境：银行营业厅"
  },
  {
    id: 634, category: "银行保险", name: "银行客户经理 / 主管", education: "大专",
    majors: [{ group: "金融类", list: ["金融学"] }, { group: "管理大类", list: ["市场营销"] }],
    mbti: ["ESTP", "ENFJ"], certificates: "银行从业、基金从业",
    work: "开发对公/对私客户、存款贷款理财营销、客户维护、贷前调查",
    workTime: "以企业JD为准", salary: "8000-20000（绩效浮动大）", restrictions: "身体要求：经常外出拜访客户，抗压；工作环境：银行办公室 + 外出企业拜访"
  },
  {
    id: 635, category: "银行保险", name: "银行客户专员", education: "大专",
    majors: [{ group: "金融类", list: ["金融", "财会"] }],
    mbti: ["ESFJ"], certificates: "银行从业资格证",
    work: "厅堂接待、引导客户、办理基础业务、产品介绍、资料收集",
    workTime: "以企业JD为准", salary: "5000-9000 / 月", restrictions: "身体要求：耐心，微笑服务；工作环境：银行网点厅堂"
  },
  {
    id: 636, category: "银行保险", name: "理财顾问 / 财务规划师", education: "大专",
    majors: [{ group: "金融类", list: ["金融"] }, { group: "财会大类", list: ["财务管理"] }],
    mbti: ["ENFJ", "ESTJ"], certificates: "理财规划师、基金从业、证券从业",
    work: "给客户做资产配置、理财推介、风险测评、定期客户回访",
    workTime: "以企业JD为准", salary: "7000-18000（提成浮动）", restrictions: "身体要求：擅长沟通，抗压；工作环境：银行 / 理财公司办公室"
  },
  {
    id: 637, category: "银行保险", name: "金融资产评估 / 风险控制", education: "本科",
    majors: [{ group: "金融类", list: ["金融工程", "资产评估", "风控"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "资产评估师、FRM风控证书",
    work: "资产价值评估、信贷风险审核、风控模型复核、风险报告撰写",
    workTime: "以企业JD为准", salary: "9000-20000 / 月", restrictions: "身体要求：对数字敏感，细心；工作环境：办公室，大量报表"
  },
  {
    id: 638, category: "银行保险", name: "银保精算师 / 产品开发", education: "本科",
    majors: [{ group: "金融类", list: ["精算学", "金融"] }, { group: "统计学类", list: ["统计学"] }],
    mbti: ["INTJ", "INTP"], certificates: "精算师资格证",
    work: "保险产品定价、准备金测算、产品条款设计、利润测算",
    workTime: "以企业JD为准", salary: "18000-40000 / 月", restrictions: "身体要求：数学能力强，可长期伏案；工作环境：金融办公室"
  },
  {
    id: 639, category: "银行保险", name: "信贷管理 / 信用调查 / 稽核分析", education: "大专",
    majors: [{ group: "金融类", list: ["金融", "财会"] }],
    mbti: ["ISTJ"], certificates: "银行从业、风控相关证书",
    work: "贷款资料审核、征信调查、贷后跟踪、内部稽核、风险排查",
    workTime: "以企业JD为准", salary: "8000-16000 / 月", restrictions: "身体要求：细心，辨别资料真伪；工作环境：办公室，偶尔实地尽调"
  },
  {
    id: 640, category: "银行保险", name: "预结算 / 清算", education: "大专",
    majors: [{ group: "财会大类", list: ["会计学"] }, { group: "金融类", list: ["金融"] }],
    mbti: ["ISTJ"], certificates: "银行从业、初级会计",
    work: "资金清算、账务核对、交易结算、差错调整、清算报表",
    workTime: "以企业JD为准", salary: "6500-12000 / 月", restrictions: "身体要求：数字敏感，零差错要求高；工作环境：银行后台办公室"
  },
  {
    id: 641, category: "银行保险", name: "保险代理 / 经纪人 / 客户经理", education: "大专",
    majors: [{ group: "金融类", list: ["保险学"] }, { group: "管理大类", list: ["市场营销"] }],
    mbti: ["ENFJ", "ESTP"], certificates: "保险从业人员资格证",
    work: "保险产品销售、客户开发、保单讲解、理赔协助、客户维护",
    workTime: "以企业JD为准", salary: "5000-上不封顶（纯提成波动极大）", restrictions: "身体要求：社交强，抗压，可外勤；工作环境：保险公司办公室、外出拜访"
  },
  {
    id: 642, category: "银行保险", name: "保险核保 / 理赔 / 续期", education: "大专",
    majors: [{ group: "金融类", list: ["保险", "金融"] }, { group: "医学类", list: ["医学"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "保险从业证",
    work: "核保审核投保资料、查勘定损、理赔材料审核、续期保费提醒",
    workTime: "以企业JD为准", salary: "6000-11000 / 月", restrictions: "身体要求：细心，部分理赔岗需要外勤查勘；工作环境：办公室，查勘岗需要外出现场"
  },

  /* ============ 五十三、技工（643–656） ============ */
  {
    id: 643, category: "技工", name: "技工", education: "初中",
    majors: [{ group: "理工环境类", list: ["机电", "数控", "机械"] }],
    mbti: ["ISTJ", "ISTP"], certificates: "对应工种职业技能等级证",
    work: "按照图纸完成产品加工、设备装配、工序作业、自检工件",
    workTime: "以企业JD为准", salary: "5000-9000 / 月", restrictions: "身体要求：手脚灵活，无手部残疾；工作环境：工厂车间，有油污、噪音"
  },
  {
    id: 644, category: "技工", name: "电工", education: "中专",
    majors: [{ group: "理工环境类", list: ["电气自动化"] }],
    mbti: ["ISTJ", "ISTP"], certificates: "低压 / 高压电工特种作业证", requiredCert: "电工",
    work: "电路检修、配电柜维护、线路安装、设备电气故障维修",
    workTime: "以企业JD为准", salary: "5500-10000 / 月", restrictions: "身体要求：无恐高，无癫痫等不适宜电工作业疾病；工作环境：工厂、工地、楼宇，有电危险区域"
  },
  {
    id: 645, category: "技工", name: "钳工 / 机修工 / 钣金工", education: "初中",
    majors: [{ group: "理工环境类", list: ["机械维修", "钣金加工"] }],
    mbti: ["ISTP"], certificates: "钳工证、钣金工证",
    work: "设备拆装维修、零件锉配、钣金折弯、打磨、校正工件",
    workTime: "以企业JD为准", salary: "5200-9500 / 月", restrictions: "身体要求：手部有力，视力好；工作环境：机加工车间，噪音、金属粉尘"
  },
  {
    id: 646, category: "技工", name: "电焊工 / 铆焊工", education: "初中",
    majors: [{ group: "理工环境类", list: ["焊接技术"] }],
    mbti: ["ISTP"], certificates: "焊工特种作业证", requiredCert: "焊工",
    work: "金属焊接、铆接、打磨焊口、探伤前处理",
    workTime: "以企业JD为准", salary: "6000-11000 / 月", restrictions: "身体要求：无眼部基础疾病，不惧怕弧光；工作环境：焊接车间，强光、烟尘，必须劳保防护"
  },
  {
    id: 647, category: "技工", name: "车工 / 磨工 / 铣工 / 冲压工 / 锣工", education: "初中",
    majors: [{ group: "理工环境类", list: ["数控加工"] }],
    mbti: ["ISTJ", "ISTP"], certificates: "车工、铣工技能证",
    work: "操作车床磨床铣床、冲压机，加工金属零件，测量尺寸",
    workTime: "以企业JD为准", salary: "5000-9000 / 月", restrictions: "身体要求：视力良好，反应稳定；工作环境：机加车间，油污、噪音、铁屑"
  },
  {
    id: 648, category: "技工", name: "模具工", education: "中专",
    majors: [{ group: "理工环境类", list: ["模具设计与制造"] }],
    mbti: ["ISTP"], certificates: "模具工技能证",
    work: "模具组装、抛光、修模、试模、模具保养",
    workTime: "以企业JD为准", salary: "6500-12000 / 月", restrictions: "身体要求：手稳，看懂模具图纸；工作环境：模具车间，油污、重物"
  },
  {
    id: 649, category: "技工", name: "水工 / 木工 / 油漆工", education: "初中",
    majors: [{ group: "理工环境类", list: ["建筑施工"] }],
    mbti: ["ISTP"], certificates: "水工、木工、油漆工技能证",
    work: "水管铺设维修、木作加工、墙面木器刷漆打磨",
    workTime: "以企业JD为准", salary: "5000-10000 / 月", restrictions: "身体要求：油漆工不能有油漆过敏；工作环境：装修工地，油漆岗位有刺激性气味"
  },
  {
    id: 650, category: "技工", name: "叉车司机", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "叉车N1特种设备操作证", requiredCert: "叉车",
    work: "仓库货物叉运、堆垛、装卸、盘点转运",
    workTime: "以企业JD为准", salary: "4800-8000 / 月", restrictions: "身体要求：视力正常，反应灵敏；工作环境：仓库厂区，需要留意通道安全"
  },
  {
    id: 651, category: "技工", name: "空调工 / 电梯工 / 锅炉工", education: "中专",
    majors: [{ group: "理工环境类", list: ["暖通", "机电"] }],
    mbti: ["ISTP", "ISTJ"], certificates: "电梯证、锅炉证、制冷证（特种设备证）",
    work: "空调安装维修、电梯维保巡检、锅炉巡检、水处理、设备保养",
    workTime: "以企业JD为准", salary: "5500-10000 / 月", restrictions: "身体要求：电梯工无恐高；锅炉工耐热；工作环境：机房、楼宇、高空井道，部分高温环境"
  },
  {
    id: 652, category: "技工", name: "普工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ"], certificates: "无强制",
    work: "流水线组装、包装、辅助工序、简单手工操作",
    workTime: "以企业JD为准", salary: "4200-7000 / 月", restrictions: "身体要求：身体健康；工作环境：工厂流水线车间，部分无尘车间、两班倒"
  },
  {
    id: 653, category: "技工", name: "搬运 / 清洁 / 厨工", education: "初中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "无强制",
    work: "货物搬运、厂区保洁、后厨洗菜切配、厨房杂活",
    workTime: "以企业JD为准", salary: "3800-6500 / 月", restrictions: "身体要求：搬运岗体力好；厨工无传染病；工作环境：仓库、后厨、厂区公共区域"
  },
  {
    id: 654, category: "技工", name: "切割技工", education: "初中",
    majors: [{ group: "理工环境类", list: ["机械加工"] }],
    mbti: ["ISTP"], certificates: "切割特种作业证", requiredCert: "切割",
    work: "等离子 / 火焰切割板材、下料、清理割渣",
    workTime: "以企业JD为准", salary: "5000-9000 / 月", restrictions: "身体要求：无眼部疾病，做好防护；工作环境：加工车间，高温烟尘"
  },
  {
    id: 655, category: "技工", name: "CNC 技工 / 数控车床操作员", education: "中专",
    majors: [{ group: "理工环境类", list: ["数控技术"] }],
    mbti: ["ISTJ"], certificates: "数控车工技能证",
    work: "装夹工件、调用程序、换刀、尺寸检测、清理机床",
    workTime: "以企业JD为准", salary: "5200-9500 / 月", restrictions: "身体要求：细心，看懂简单图纸；工作环境：数控车间，有切削液、噪音"
  },
  {
    id: 656, category: "技工", name: "烤漆技师", education: "初中",
    majors: [{ group: "理工环境类", list: ["涂装工艺"] }],
    mbti: ["ISFP", "ISTP"], certificates: "涂装工技能证",
    work: "工件打磨、喷漆烤漆、调漆、漆面瑕疵修补",
    workTime: "以企业JD为准", salary: "5500-10000 / 月", restrictions: "身体要求：无油漆、稀释剂过敏；工作环境：烤漆房，密闭，油漆气味重，必须防毒防护"
  },

  /* ============ 五十四、文教（657–663） ============ */
  {
    id: 657, category: "文教", name: "大学教授", education: "博士",
    majors: [{ group: "教育类", list: ["对应学科专业博士"] }],
    mbti: ["INFJ", "INTJ"], certificates: "高校教师资格证", requiredCert: "教师资格",
    work: "授课、科研项目、论文、带研究生、学术会议、课题申报",
    workTime: "以企业JD为准", salary: "12000-30000（职称差距极大）", restrictions: "身体要求：长期伏案科研，抗压；工作环境：大学校园、实验室、教研室"
  },
  {
    id: 658, category: "文教", name: "讲师 / 助教", education: "硕士",
    majors: [{ group: "教育类", list: ["对应学科"] }],
    mbti: ["INFJ", "ISFJ"], certificates: "高校教师资格证", requiredCert: "教师资格",
    work: "上课、批改作业、协助教授科研、实验室辅导、学生答疑",
    workTime: "以企业JD为准", salary: "6000-12000 / 月", restrictions: "身体要求：可以长时间讲课；工作环境：大学教室、教研室"
  },
  {
    id: 659, category: "文教", name: "中学教师", education: "本科",
    majors: [{ group: "教育类", list: ["对应学科师范类"] }],
    mbti: ["ENFJ", "ISFJ"], certificates: "中小学教师资格证", requiredCert: "教师资格",
    work: "备课、上课、批改作业、晚自习、班级管理、教研活动",
    workTime: "以企业JD为准", salary: "6000-11000 / 月", restrictions: "身体要求：声带健康，抗压；工作环境：中学教室、办公室"
  },
  {
    id: 660, category: "文教", name: "小学教师 / 幼教", education: "大专",
    majors: [{ group: "教育类", list: ["小学教育", "学前教育"] }],
    mbti: ["ESFJ", "ISFJ"], certificates: "教师资格证（小学 / 幼儿）", requiredCert: "教师资格",
    work: "授课、看护学生、游戏活动、家校沟通、手工环创",
    workTime: "以企业JD为准", salary: "5000-9000 / 月", restrictions: "身体要求：有耐心，喜欢孩子；工作环境：小学、幼儿园教室"
  },
  {
    id: 661, category: "文教", name: "体育 / 音乐 / 美术教师", education: "本科",
    majors: [{ group: "教育类", list: ["体育教育", "音乐学", "美术学"] }],
    mbti: ["ESFP", "ISFP"], certificates: "教师资格证", requiredCert: "教师资格",
    work: "专业课教学、带队训练、艺术活动排练、课后兴趣辅导",
    workTime: "以企业JD为准", salary: "5500-10000 / 月", restrictions: "身体要求：体育教师体能好；音美老师专业功底达标；工作环境：操场、琴房、美术教室"
  },
  {
    id: 662, category: "文教", name: "院校教务管理人员", education: "本科",
    majors: [{ group: "管理大类", list: ["教育管理"] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "无强制",
    work: "排课、学籍管理、考试安排、教学资料归档、教师协调",
    workTime: "以企业JD为准", salary: "5500-9500 / 月", restrictions: "身体要求：对数字细心；工作环境：学校教务处办公室"
  },
  {
    id: 663, category: "文教", name: "职业教育 / 家教", education: "大专",
    majors: [{ group: "教育类", list: ["对应授课专业"] }],
    mbti: ["ENFJ", "ISFJ"], certificates: "教师资格证优先",
    work: "职业技能授课、上门家教、知识点讲解、习题辅导",
    workTime: "以企业JD为准", salary: "4500-12000（浮动大）", restrictions: "身体要求：表达清晰，有耐心；工作环境：职教教室、学生家中"
  },

  /* ============ 五十五、汽车（664–681） ============ */
  {
    id: 664, category: "汽车", name: "汽车设计工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["车辆工程"] }],
    mbti: ["INTJ"], certificates: "CAD/CAE技能证书",
    work: "整车方案设计、仿真分析、对标竞品、图纸输出、对接零部件",
    workTime: "以企业JD为准", salary: "10000-22000 / 月", restrictions: "身体要求：长期电脑画图；工作环境：车企研发办公室"
  },
  {
    id: 665, category: "汽车", name: "车身 / 造型设计", education: "本科",
    majors: [{ group: "艺术大类", list: ["工业设计"] }, { group: "理工环境类", list: ["车身工程"] }],
    mbti: ["INFP", "INTJ"], certificates: "Alias、CAD设计证书",
    work: "车身曲面造型、A面设计、油泥模型对接、外观评审",
    workTime: "以企业JD为准", salary: "11000-24000 / 月", restrictions: "身体要求：审美良好，无色盲色弱；工作环境：造型研发中心"
  },
  {
    id: 666, category: "汽车", name: "发动机及附件设计", education: "本科",
    majors: [{ group: "理工环境类", list: ["车辆工程", "动力工程"] }],
    mbti: ["INTJ", "ISTJ"], certificates: "CAE仿真证书",
    work: "发动机零部件设计、仿真、耐久分析、台架试验跟进",
    workTime: "以企业JD为准", salary: "11000-23000 / 月", restrictions: "身体要求：细心，看得懂机械图纸；工作环境：研发办公室 + 台架实验室"
  },
  {
    id: 667, category: "汽车", name: "底盘及传动系统工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["车辆工程"] }],
    mbti: ["ISTJ", "INTJ"], certificates: "CAE技能证书",
    work: "底盘悬架、传动部件设计、标定、整车匹配、路试跟进",
    workTime: "以企业JD为准", salary: "10000-22000 / 月", restrictions: "身体要求：可下试验场路试；工作环境：研发办公室 + 试车场地"
  },
  {
    id: 668, category: "汽车", name: "汽车内外饰设计工程师", education: "本科",
    majors: [{ group: "理工环境类", list: ["车辆工程"] }, { group: "艺术大类", list: ["工业设计"] }],
    mbti: ["ISFP", "INTJ"], certificates: "CAD、Catia证书",
    work: "内饰、外饰件结构设计、造型配合、模具对接、可靠性验证",
    workTime: "以企业JD为准", salary: "9500-20000 / 月", restrictions: "身体要求：无色盲色弱；工作环境：研发办公室"
  },
  {
    id: 669, category: "汽车", name: "汽车零部件工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["车辆工程", "机械"] }],
    mbti: ["ISTJ"], certificates: "PPAP、SQE相关证书",
    work: "零部件选型、供应商开发、图纸评审、试产跟进、问题整改",
    workTime: "以企业JD为准", salary: "8500-17000 / 月", restrictions: "身体要求：可以去供应商工厂审核；工作环境：车企办公室 + 零部件供应商现场"
  },
  {
    id: 670, category: "汽车", name: "汽车焊接 / 涂装工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["材料", "车辆工程"] }],
    mbti: ["ISTJ"], certificates: "焊接工程师、涂装工艺证书",
    work: "焊接工艺规划、涂装线工艺调试、缺陷分析、产线改善",
    workTime: "以企业JD为准", salary: "8000-16000 / 月", restrictions: "身体要求：无油漆过敏；工作环境：汽车焊装、涂装车间"
  },
  {
    id: 671, category: "汽车", name: "汽车总装工程师", education: "大专",
    majors: [{ group: "理工环境类", list: ["车辆工程", "机械"] }],
    mbti: ["ESTJ", "ISTJ"], certificates: "工艺工程师相关证书",
    work: "总装工序规划、工装设计、产线节拍优化、装配异常处理",
    workTime: "以企业JD为准", salary: "8000-16000 / 月", restrictions: "身体要求：车间巡检走动；工作环境：整车总装车间"
  },
  {
    id: 672, category: "汽车", name: "汽车试验 / 测试 / 验车员", education: "大专",
    majors: [{ group: "理工环境类", list: ["车辆工程", "测控"] }],
    mbti: ["ISTJ"], certificates: "机动车检测证",
    work: "整车性能测试、耐久试验、检测线验车、记录测试数据",
    workTime: "以企业JD为准", salary: "6500-12000 / 月", restrictions: "身体要求：有驾照，可试车；工作环境：试验场、检测车间"
  },
  {
    id: 673, category: "汽车", name: "4S 店展厅经理", education: "大专",
    majors: [{ group: "管理大类", list: ["市场营销", "汽车服务"] }],
    mbti: ["ESTJ"], certificates: "汽车销售培训证书",
    work: "展厅管理、销售团队管理、客流把控、活动策划、业绩目标跟进",
    workTime: "以企业JD为准", salary: "7000-15000（绩效提成）", restrictions: "身体要求：擅长沟通，抗压；工作环境：4S汽车展厅"
  },
  {
    id: 674, category: "汽车", name: "整车销售 / 顾问 / 业务", education: "高中",
    majors: [{ group: "管理大类", list: ["汽车营销"] }],
    mbti: ["ESFP", "ESTP"], certificates: "汽车营销师证",
    work: "接待客户、介绍车型、试驾邀约、谈价、跟进成交、上牌对接",
    workTime: "以企业JD为准", salary: "5000-15000（提成制，浮动大）", restrictions: "身体要求：外向，能接待客户；工作环境：4S展厅"
  },
  {
    id: 675, category: "汽车", name: "汽车经纪 / 二手车估价师", education: "大专",
    majors: [{ group: "理工环境类", list: ["汽车技术服务"] }],
    mbti: ["ESTP", "ISTJ"], certificates: "二手车鉴定评估师证",
    work: "二手车车况检测、估价、收车、整备、二手车交易对接",
    workTime: "以企业JD为准", salary: "6000-14000 / 月", restrictions: "身体要求：懂车辆故障识别，可外出看车；工作环境：二手车市场、车场"
  },
  {
    id: 676, category: "汽车", name: "汽车维修 / 售后经理 / 主任", education: "大专",
    majors: [{ group: "理工环境类", list: ["汽车检测维修"] }],
    mbti: ["ESTJ"], certificates: "汽车维修工高级证",
    work: "售后班组管理、维修工单调度、客诉处理、配件管控、产值管理",
    workTime: "以企业JD为准", salary: "7500-16000 / 月", restrictions: "身体要求：懂维修技术，沟通能力强；工作环境：4S售后维修车间 + 办公室"
  },
  {
    id: 677, category: "汽车", name: "汽车维修高级技工", education: "中专",
    majors: [{ group: "理工环境类", list: ["汽车检测与维修"] }],
    mbti: ["ISTP"], certificates: "汽车维修工（高级）证",
    work: "汽车故障诊断、发动机底盘维修、电路检修、大修作业",
    workTime: "以企业JD为准", salary: "6500-12000 / 月", restrictions: "身体要求：体力好，不怕油污；工作环境：维修车间，机油油污环境"
  },
  {
    id: 678, category: "汽车", name: "汽车维修顾问 / 接车员", education: "中专",
    majors: [{ group: "管理大类", list: ["汽车服务"] }],
    mbti: ["ESFJ"], certificates: "汽车服务顾问证书",
    work: "接待维修客户、问诊故障、开工单、报价、交车回访",
    workTime: "以企业JD为准", salary: "5000-10000 / 月", restrictions: "身体要求：沟通顺畅，懂基础汽车知识；工作环境：售后接待区"
  },
  {
    id: 679, category: "汽车", name: "汽车美容", education: "无强制",
    majors: [{ group: "不限专业", list: ["汽车美容"] }],
    mbti: ["ISFP"], certificates: "汽车美容师证",
    work: "洗车、打蜡、贴膜、内饰清洁、漆面养护",
    workTime: "以企业JD为准", salary: "4500-8000 / 月", restrictions: "身体要求：无清洗剂过敏，长时间站立；工作环境：美容工位，洗车房"
  },
  {
    id: 680, category: "汽车", name: "汽车零部件销售", education: "中专",
    majors: [{ group: "管理大类", list: ["汽车营销"] }],
    mbti: ["ESTP"], certificates: "无强制",
    work: "汽配客户对接、配件报价、出库发货、老客户维护",
    workTime: "以企业JD为准", salary: "5000-11000 / 月", restrictions: "身体要求：熟悉配件型号；工作环境：汽配门店、仓库"
  },
  {
    id: 681, category: "汽车", name: "驾驶培训", education: "高中",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESTJ", "ISFJ"], certificates: "机动车教练员证",
    work: "科目二、科目三教学，带学员练车，指导考试要点",
    workTime: "以企业JD为准", salary: "5000-10000 / 月", restrictions: "身体要求：驾龄达标，无重大事故记录；工作环境：驾校训练场、道路"
  },

  /* ============ 五十六、设计（682–697） ============ */
  {
    id: 682, category: "设计", name: "平面设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["视觉传达设计"] }],
    mbti: ["ISFP", "INFP"], certificates: "Adobe认证设计师",
    work: "海报、画册、LOGO、宣传单页设计，修改客户稿件、输出文件",
    workTime: "以企业JD为准", salary: "5500-11000 / 月", restrictions: "身体要求：无色盲色弱，长时间看屏幕；工作环境：设计办公室"
  },
  {
    id: 683, category: "设计", name: "动漫设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["动漫设计", "动画"] }],
    mbti: ["INFP", "ISFP"], certificates: "动画设计师技能证",
    work: "角色原画、分镜、人设绘制、动漫插画、设定稿绘制",
    workTime: "以企业JD为准", salary: "6000-13000 / 月", restrictions: "身体要求：无色盲色弱，久坐手绘板；工作环境：动漫工作室"
  },
  {
    id: 684, category: "设计", name: "动画 / 3D 设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["动画", "数字媒体", "三维设计"] }],
    mbti: ["INTP", "ISFP"], certificates: "3Dmax/C4D技能认证",
    work: "三维建模、绑定、动画K帧、渲染、场景搭建",
    workTime: "以企业JD为准", salary: "7000-15000 / 月", restrictions: "身体要求：视力良好，能阶段性加班赶项目；工作环境：设计机房"
  },
  {
    id: 685, category: "设计", name: "游戏设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["游戏设计", "数字媒体"] }],
    mbti: ["ENFP", "INTJ"], certificates: "游戏原画 / 策划相关证书",
    work: "游戏原画、场景角色设计、关卡策划、玩法设定",
    workTime: "以企业JD为准", salary: "8000-20000 / 月", restrictions: "身体要求：创意强，无色盲色弱；工作环境：游戏研发办公室"
  },
  {
    id: 686, category: "设计", name: "展台 / 店面 / 展览设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["展示设计", "环境设计"] }],
    mbti: ["ISFP", "ESTP"], certificates: "会展设计师证",
    work: "展厅展台效果图、施工图设计，对接搭建商，现场跟进布展",
    workTime: "以企业JD为准", salary: "6500-14000 / 月", restrictions: "身体要求：可以去展会现场跟进；工作环境：办公室 + 展会现场"
  },
  {
    id: 687, category: "设计", name: "多媒体设计与开发", education: "大专",
    majors: [{ group: "艺术大类", list: ["数字媒体技术"] }],
    mbti: ["INTP", "ISFP"], certificates: "多媒体设计师证书",
    work: "H5、交互页面、多媒体短片、交互课件制作",
    workTime: "以企业JD为准", salary: "7000-14000 / 月", restrictions: "身体要求：懂设计 + 简单前端；工作环境：设计办公室"
  },
  {
    id: 688, category: "设计", name: "包装设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["视觉传达", "包装设计"] }],
    mbti: ["ISFP"], certificates: "包装设计师认证",
    work: "产品包装外观、结构设计，对接印刷厂，核对印刷稿",
    workTime: "以企业JD为准", salary: "5800-11000 / 月", restrictions: "身体要求：无色盲色弱；工作环境：设计办公室"
  },
  {
    id: 689, category: "设计", name: "工业设计 / 产品外观设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["工业设计"] }],
    mbti: ["INTJ", "ISFP"], certificates: "Rhino、Keyshot技能证书",
    work: "产品外观造型、效果图、手板跟进、评审改款",
    workTime: "以企业JD为准", salary: "8000-17000 / 月", restrictions: "身体要求：审美好，无色盲色弱；工作环境：研发设计办公室"
  },
  {
    id: 690, category: "设计", name: "装璜美术设计 / 室内外设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["环境设计", "室内设计"] }],
    mbti: ["ISFP", "ESTP"], certificates: "室内设计师证",
    work: "家装工装效果图、施工图、预算、对接施工方、工地交底",
    workTime: "以企业JD为准", salary: "6500-14000 / 月", restrictions: "身体要求：可以去工地现场量房；工作环境：办公室 + 装修工地"
  },
  {
    id: 691, category: "设计", name: "服装设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["服装设计与工程"] }],
    mbti: ["ISFP"], certificates: "服装设计师证",
    work: "款式设计、画款式图、选面料、打样、跟进成衣样品",
    workTime: "以企业JD为准", salary: "6000-13000 / 月", restrictions: "身体要求：无色盲色弱，懂面料；工作环境：设计工作室、服装企业"
  },
  {
    id: 692, category: "设计", name: "珠宝 / 饰品设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["珠宝首饰设计"] }],
    mbti: ["ISFP", "INFP"], certificates: "珠宝设计师证书",
    work: "首饰款式手绘、建模渲染、起版跟进、宝石搭配设计",
    workTime: "以企业JD为准", salary: "7000-15000 / 月", restrictions: "身体要求：视力好，精细绘图，无色盲；工作环境：珠宝设计工作室"
  },
  {
    id: 693, category: "设计", name: "家具 / 家居用品设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["家具设计", "工业设计"] }],
    mbti: ["ISFP", "ISTJ"], certificates: "家具设计师证书",
    work: "家具造型结构设计、效果图、对接工厂打样、结构核对",
    workTime: "以企业JD为准", salary: "6500-13000 / 月", restrictions: "身体要求：看得懂结构图纸；工作环境：设计办公室 + 家具工厂"
  },
  {
    id: 694, category: "设计", name: "工艺品 / 玩具设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["产品设计", "玩具设计"] }],
    mbti: ["ISFP", "ENFP"], certificates: "玩具设计师相关证书",
    work: "玩具、工艺品造型设计、开模跟进、配色设计",
    workTime: "以企业JD为准", salary: "6000-12000 / 月", restrictions: "身体要求：创意丰富，无色盲色弱；工作环境：设计办公室"
  },
  {
    id: 695, category: "设计", name: "形象设计", education: "中专",
    majors: [{ group: "艺术大类", list: ["人物形象设计"] }],
    mbti: ["ESFP", "ISFP"], certificates: "形象设计师、化妆师证",
    work: "人像化妆造型、穿搭搭配、整体形象方案、妆造落地",
    workTime: "以企业JD为准", salary: "5000-11000 / 月", restrictions: "身体要求：审美在线，手部无皮肤病；工作环境：影楼、工作室、活动现场"
  },
  {
    id: 696, category: "设计", name: "园艺 / 园林 / 景观设计", education: "大专",
    majors: [{ group: "理工环境类", list: ["园林", "风景园林"] }],
    mbti: ["ISFP", "INTJ"], certificates: "景观设计师证、园林工程师",
    work: "景观方案、施工图绘制，植物配置，现场交底，施工跟进",
    workTime: "以企业JD为准", salary: "7000-14000 / 月", restrictions: "身体要求：可以去项目现场踏勘；工作环境：办公室 + 户外园林工地"
  },
  {
    id: 697, category: "设计", name: "造型 / 雕塑设计", education: "大专",
    majors: [{ group: "艺术大类", list: ["雕塑", "公共艺术"] }],
    mbti: ["ISFP", "INFP"], certificates: "雕塑艺术相关认证",
    work: "雕塑造型创作、泥塑、3D扫描建模、翻模对接",
    workTime: "以企业JD为准", salary: "7000-15000 / 月", restrictions: "身体要求：动手塑造能力强；工作环境：雕塑工作室"
  },

  /* ============ 五十七、咨询顾问（698–704） ============ */
  {
    id: 698, category: "咨询顾问", name: "咨询总监 / 首席咨询师", education: "本科",
    majors: [{ group: "管理大类", list: ["经管", "管理"] }],
    mbti: ["ENTJ"], certificates: "注册管理咨询师",
    work: "咨询项目方案把控、大客户洽谈、团队管理、项目交付把关",
    workTime: "以企业JD为准", salary: "18000-40000+/月", restrictions: "身体要求：高频出差，抗压；工作环境：办公室 + 全国各地客户现场"
  },
  {
    id: 699, category: "咨询顾问", name: "咨询经理 / 主管", education: "本科",
    majors: [{ group: "管理大类", list: ["工商管理"] }],
    mbti: ["ESTJ"], certificates: "管理咨询师证",
    work: "咨询项目统筹、进度管控、小组分工、客户汇报、问题协调",
    workTime: "以企业JD为准", salary: "12000-25000 / 月", restrictions: "身体要求：长期出差；工作环境：客户企业现场为主"
  },
  {
    id: 700, category: "咨询顾问", name: "咨询师", education: "本科",
    majors: [{ group: "管理大类", list: ["经管"] }],
    mbti: ["INTJ", "INFJ"], certificates: "注册管理咨询师",
    work: "企业调研、诊断、撰写咨询报告、落地辅导、方案宣讲",
    workTime: "以企业JD为准", salary: "8000-18000 / 月", restrictions: "身体要求：经常驻场出差；工作环境：客户公司现场"
  },
  {
    id: 701, category: "咨询顾问", name: "专业顾问 / 信息中介", education: "大专",
    majors: [{ group: "不限专业", list: ["对应行业专业"] }],
    mbti: ["ESTP", "ENFJ"], certificates: "行业对应资格证",
    work: "行业信息对接、资源撮合、方案咨询、供需匹配",
    workTime: "以企业JD为准", salary: "7000-16000 / 月", restrictions: "身体要求：社交能力强，可外出对接；工作环境：办公室、商务洽谈场所"
  },
  {
    id: 702, category: "咨询顾问", name: "营销管理顾问", education: "本科",
    majors: [{ group: "管理大类", list: ["市场营销"] }],
    mbti: ["ENTP", "ESTJ"], certificates: "营销师、管理咨询师",
    work: "企业营销诊断、营销方案策划、渠道辅导、团队培训",
    workTime: "以企业JD为准", salary: "9000-20000 / 月", restrictions: "身体要求：出差多；工作环境：客户企业现场"
  },
  {
    id: 703, category: "咨询顾问", name: "人力资源 / 猎头顾问", education: "大专",
    majors: [{ group: "管理大类", list: ["人力资源管理"] }],
    mbti: ["ENFJ", "ESTP"], certificates: "人力资源管理师、猎头相关证书",
    work: "寻访候选人、沟通面试、对接企业HR、跟进offer入职",
    workTime: "以企业JD为准", salary: "7000-20000（提成浮动）", restrictions: "身体要求：擅长沟通，抗压；工作环境：猎头办公室"
  },
  {
    id: 704, category: "咨询顾问", name: "专业培训师", education: "大专",
    majors: [{ group: "管理大类", list: ["对应培训方向专业"] }],
    mbti: ["ENFJ", "ESTJ"], certificates: "企业培训师证",
    work: "课程开发、企业内训授课、学员答疑、培训复盘",
    workTime: "以企业JD为准", salary: "8000-18000 / 月", restrictions: "身体要求：表达流畅，经常外出讲课；工作环境：企业会议室、培训教室"
  },

  /* ============ 五十八、其他（705–713） ============ */
  {
    id: 705, category: "其他", name: "食品类", education: "中专",
    majors: [{ group: "理工环境类", list: ["食品科学与工程"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "食品检验员、食品安全管理员证",
    work: "食品生产、品控、检验、配方、车间管控（岗位细分差异大）",
    workTime: "以企业JD为准", salary: "4500-8500 / 月", restrictions: "身体要求：无传染性疾病，食品岗位健康证；工作环境：食品洁净车间，恒温环境"
  },
  {
    id: 706, category: "其他", name: "造纸类", education: "中专",
    majors: [{ group: "理工环境类", list: ["制浆造纸工程"] }],
    mbti: ["ISTJ"], certificates: "造纸工技能证",
    work: "制浆、抄纸、造纸机操作、工艺管控、品质检验",
    workTime: "以企业JD为准", salary: "5000-9000 / 月", restrictions: "身体要求：无化学品过敏；工作环境：造纸车间，有蒸汽、纸浆气味"
  },
  {
    id: 707, category: "其他", name: "家具制造类", education: "初中",
    majors: [{ group: "理工环境类", list: ["家具制造"] }],
    mbti: ["ISTP", "ISTJ"], certificates: "木工、涂装工证",
    work: "板材开料、打磨、组装、喷漆、家具加工生产",
    workTime: "以企业JD为准", salary: "4800-8500 / 月", restrictions: "身体要求：粉尘岗位做好防护，油漆岗无过敏；工作环境：家具工厂车间，木屑粉尘"
  },
  {
    id: 708, category: "其他", name: "农林牧渔 / 水利类", education: "中专",
    majors: [{ group: "理工环境类", list: ["农学", "畜牧", "水利工程"] }],
    mbti: ["ISTJ", "ISFJ"], certificates: "农艺师、畜牧兽医证、水利技工证",
    work: "种植养殖管护、农田技术指导、水利设施巡检维护、防汛",
    workTime: "以企业JD为准", salary: "4000-8500 / 月", restrictions: "身体要求：能户外劳作，不怕蚊虫日晒；工作环境：农田、养殖场、野外水利站点"
  },
  {
    id: 709, category: "其他", name: "地质 / 矿产类", education: "大专",
    majors: [{ group: "理工环境类", list: ["地质工程", "采矿工程"] }],
    mbti: ["ISTJ", "ISTP"], certificates: "地质勘查证、采矿安全证",
    work: "野外地质勘探、取样测绘、矿山巡检、地质资料整理",
    workTime: "以企业JD为准", salary: "6000-12000 / 月", restrictions: "身体要求：体力强，可长期野外驻场，无恐高；工作环境：野外山区、矿山井下，环境艰苦"
  },
  {
    id: 710, category: "其他", name: "环境保护 / 监测 / 治理类", education: "大专",
    majors: [{ group: "理工环境类", list: ["环境工程", "环境监测"] }],
    mbti: ["ISTJ"], certificates: "环境监测员、注册环保工程师",
    work: "水 / 气 / 土壤采样、实验室检测、污染治理设施运维、环评辅助",
    workTime: "以企业JD为准", salary: "5500-10000 / 月", restrictions: "身体要求：可以外勤采样，无化学过敏；工作环境：实验室 + 野外采样现场"
  },
  {
    id: 711, category: "其他", name: "公务员", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISTJ", "ESTJ"], certificates: "无强制，部分岗位需要法考、注会等",
    work: "公文撰写、窗口业务、政策落实、基层走访、行政事务",
    workTime: "以企业JD为准", salary: "5000-12000（地区、职级差距大）", restrictions: "身体要求：符合公务员体检标准；工作环境：机关办公室，基层岗下乡外勤"
  },
  {
    id: 712, category: "其他", name: "事业单位", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ISFJ", "ISTJ"], certificates: "看岗位要求（教师资格、医师证等）",
    work: "公益服务、技术业务、窗口办理、科研、行政后勤",
    workTime: "以企业JD为准", salary: "4800-11000 / 月", restrictions: "身体要求：符合事业单位体检标准；工作环境：事业单位办公场所"
  },
  {
    id: 713, category: "其他", name: "储备干部 / 培训生 / 管培生", education: "大专",
    majors: [{ group: "不限专业", list: [] }],
    mbti: ["ESTJ", "ENTP"], certificates: "无强制",
    work: "轮岗学习各部门业务、跟着带教人熟悉流程、阶段性考核，定向培养管理岗",
    workTime: "以企业JD为准", salary: "4500-8000 / 月", restrictions: "身体要求：可接受轮岗、车间 / 外勤；工作环境：全公司多部门轮换，车间、办公室都有"
  }
];
