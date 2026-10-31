/*
 * filter.js — 岗位过滤逻辑
 * filterJobs(jobs, userProfile) → 返回过滤后的岗位数组
 *
 * userProfile 字段（来自填表页）：
 *   education  学历（初中及以下 / 高中 / 中专 / 职高 / 大专 / 本科及以上）
 *   health     身体情况（选填文本，如「腿脚不便」「不能熬夜」「对花粉过敏」）
 *
 * 岗位字段（来自 jobs.js，兼容两种命名）：
 *   minEducation / education              最低学历门槛
 *   healthRestrictions / restrictions     身体 / 环境限制
 */
window.APP_DATA = window.APP_DATA || {};

/* 学历等级：初中及以下=1，高中/中专/职高=2，大专=3，本科=4，硕士=5，博士=6（「本科及以上」按最低门槛 4 处理） */
var EDUCATION_LEVELS = {
  "小学": 1,
  "初中": 1,
  "初中及以下": 1,
  "高中": 2,
  "中专": 2,
  "职高": 2,
  "高中/中专/职高": 2,
  "大专": 3,
  "本科": 4,
  "本科及以上": 4,
  "硕士": 5,
  "博士": 6,
  "无强制": 0,
  "中专/高中": 2,
  "高中/初中": 1,
  "高中/大专": 2
};

/* 健康 / 环境限制关键词：
   用户「身体情况」与岗位「身体/环境限制」同时包含同一关键词 → 视为冲突，剔除该岗位 */
var HEALTH_KEYWORDS = [
  // 腿脚 / 站立
  "腿脚不便", "腿脚不方便", "不能久站", "久站", "站立",
  // 作息 / 轮班
  "不能熬夜", "熬夜", "夜班", "晚班", "轮班", "值班",
  // 过敏 / 呼吸道 / 化学
  "过敏", "粉尘", "呼吸道", "哮喘", "化学", "试剂", "臭氧",
  // 视力
  "色弱", "色盲", "用眼", "眼疲劳",
  // 听力
  "听力", "耳朵", "耳部",
  // 腰 / 体力
  "弯腰", "腰伤", "腰椎", "重体力", "搬重", "搬运",
  // 环境 / 外勤
  "外勤", "出差", "下乡", "户外", "工地", "闷热", "潮湿",
  "低温", "风湿", "怕冷", "气味", "皮肤病"
];

function getEducationLevel(edu) {
  return EDUCATION_LEVELS[edu] != null ? EDUCATION_LEVELS[edu] : 0;
}

/* 判断用户身体情况与岗位限制是否命中同一限制关键词 */
function hasHealthConflict(userHealth, jobRestrictions) {
  if (!userHealth || !jobRestrictions) return false;
  return HEALTH_KEYWORDS.some(function (kw) {
    return userHealth.indexOf(kw) !== -1 && jobRestrictions.indexOf(kw) !== -1;
  });
}

/* 专业关键词同义词：把口语化 / 简称的专业扩展成岗位数据里可能出现的专业名或岗位词
   例如「整形科」→ 整形 / 医美 / 医疗美容 / 临床医学 / 医学类 / 外科 */
var MAJOR_SYNONYMS = [
  { keys: ["整形", "医美", "医疗美容", "美容", "美容外科", "整形外科"], terms: ["整形", "医美", "医疗美容", "临床医学", "外科"] },
  { keys: ["护理", "护士"], terms: ["护理", "护士", "护理学"] },
  { keys: ["临床", "临床医学", "医生"], terms: ["临床医学", "外科", "内科"] },
  { keys: ["口腔", "牙科"], terms: ["口腔医学", "口腔", "牙科"] },
  { keys: ["药学", "药剂", "制药"], terms: ["药学", "药物制剂", "药剂", "药师", "制药"] },
  { keys: ["医学检验", "检验"], terms: ["医学检验", "检验"] },
  { keys: ["心理"], terms: ["心理", "应用心理", "心理咨询", "心理医生"] },
  { keys: ["计算机", "电脑", "软件", "编程", "程序员", "IT"], terms: ["计算机", "软件", "编程", "程序员", "信息技术", "计算机大类", "IT"] },
  { keys: ["网络", "网络安全", "信息安全"], terms: ["网络", "网络安全", "信息安全", "计算机", "IT"] },
  { keys: ["数据", "大数据", "数据分析"], terms: ["数据", "大数据", "数据分析", "统计", "数据库"] },
  { keys: ["人工智能", "AI", "机器学习", "算法"], terms: ["人工智能", "AI", "算法", "机器学习", "计算机"] },
  { keys: ["会计", "财务", "财会", "审计"], terms: ["会计", "财务", "财会", "审计", "出纳", "财务大类"] },
  { keys: ["金融", "经济", "证券", "投资"], terms: ["金融", "经济", "证券", "投资", "银行", "保险"] },
  { keys: ["法学", "法律", "律师"], terms: ["法学", "法律", "律师", "法务"] },
  { keys: ["中文", "汉语言", "文秘"], terms: ["汉语言文学", "中文", "文秘", "文案", "编辑"] },
  { keys: ["新闻", "传媒", "传播", "新媒体"], terms: ["新闻", "传播", "传媒", "编辑", "记者", "新媒体"] },
  { keys: ["行政", "行政管理"], terms: ["行政管理", "行政", "文职", "管理大类"] },
  { keys: ["人力", "人力资源", "人事"], terms: ["人力资源", "人事", "招聘", "薪酬", "管理大类"] },
  { keys: ["市场", "营销", "市场营销", "销售"], terms: ["市场营销", "市场", "营销", "销售", "运营", "推广"] },
  { keys: ["电商", "电子商务"], terms: ["电子商务", "电商", "运营", "网络营销"] },
  { keys: ["设计", "视觉传达", "平面设计"], terms: ["设计", "视觉传达", "平面设计", "UI", "美工"] },
  { keys: ["机械", "机电"], terms: ["机械", "机械工程", "机电"] },
  { keys: ["电气", "电力", "自动化"], terms: ["电气", "电力", "电工", "自动化", "电子电器"] },
  { keys: ["土木", "建筑", "工程管理"], terms: ["土木", "建筑", "工程管理", "施工", "建筑规划"] },
  { keys: ["物流", "供应链"], terms: ["物流", "仓储", "供应链", "运输"] },
  { keys: ["教育", "师范", "教师"], terms: ["教育", "师范", "教师", "教培", "文教"] },
  { keys: ["英语", "外语", "翻译"], terms: ["英语", "外语", "翻译", "国际贸易"] },
  { keys: ["化学", "化工"], terms: ["化学", "化工", "生物", "制药", "化工生物"] },
  { keys: ["环境", "环保"], terms: ["环保", "环境工程", "生态环境"] },
  { keys: ["汽修", "汽车"], terms: ["汽车", "汽修", "车辆", "机械"] },
  { keys: ["烹饪", "厨师"], terms: ["烹饪", "厨师", "餐饮"] },
  { keys: ["旅游", "酒店"], terms: ["旅游", "酒店", "餐饮"] },
  { keys: ["国际贸易", "贸易", "外贸"], terms: ["贸易", "外贸", "涉外", "进出口"] },
  { keys: ["音乐", "声乐", "乐器"], terms: ["音乐", "声乐", "乐器", "教师"] },
  { keys: ["美术", "绘画"], terms: ["美术", "绘画", "设计", "教师"] },
  { keys: ["体育", "运动", "健身"], terms: ["体育", "运动", "健身", "教练", "教师"] },
  { keys: ["食品", "食品科学", "营养"], terms: ["食品", "食品科学", "食品质量", "营养", "检验"] },
  { keys: ["影视", "编导", "导演"], terms: ["影视", "编导", "导演", "剪辑", "传媒"] },
  { keys: ["播音", "主持"], terms: ["播音", "主持", "演员", "模特", "礼仪"] },
  { keys: ["服装", "纺织"], terms: ["服装", "纺织", "制版"] },
  { keys: ["测绘", "测量"], terms: ["测绘", "测量", "地理信息", "工程测量"] },
  { keys: ["安全工程", "安全"], terms: ["安全", "安全管理", "消防", "EHS", "巡检"] },
  { keys: ["工程造价", "预算", "决算"], terms: ["工程造价", "预算", "决算", "造价", "工程管理"] }
];

/* 把用户填写的专业拆成关键词，并做同义词扩展 */
function expandMajorTerms(major) {
  var parts = String(major || "").split(/[\s,，、/;；|]+/).filter(function (p) { return p.length > 0; });
  var terms = [];
  parts.forEach(function (part) {
    terms.push(part);
    if (part.length > 2) {
      var stripped = part.replace(/(科|学|专业|系)$/, "");
      if (stripped.length >= 2 && stripped !== part) terms.push(stripped);
    }
    // 只采用匹配度最高的一组同义词：
    // 例如「服装设计」优先命中「服装」而不是泛化的「设计」，「机械设计」优先命中「机械」
    var best = null;
    var bestLen = 0;
    var bestPos = Infinity;
    MAJOR_SYNONYMS.forEach(function (m) {
      m.keys.forEach(function (k) {
        var pos = part.indexOf(k);
        if (pos === -1 && part.length >= 2) pos = k.indexOf(part);
        if (pos === -1) return;
        if (k.length > bestLen || (k.length === bestLen && pos < bestPos)) {
          bestLen = k.length;
          bestPos = pos;
          best = m;
        }
      });
    });
    if (best) terms = terms.concat(best.terms);
  });
  return terms.filter(function (t, i) { return t && terms.indexOf(t) === i; });
}

/* 岗位专业条目与用户关键词匹配：
   正向允许「岗位专业包含用户关键词」；反向只有岗位专业名称足够具体（≥3 字）才允许，
   避免「机械设计」被岗位里的泛化词「设计」误命中 */
function majorEntryMatches(entry, terms) {
  if (!entry) return false;
  return terms.some(function (t) {
    if (!t) return false;
    if (entry === t) return true;
    if (entry.indexOf(t) !== -1) return true;
    return entry.length >= 3 && t.indexOf(entry) !== -1;
  });
}

/* 大类名称匹配，规则同上 */
function majorGroupMatches(group, terms) {
  if (!group) return false;
  return terms.some(function (t) {
    if (!t) return false;
    if (group === t) return true;
    if (group.indexOf(t) !== -1) return true;
    return group.length >= 3 && t.indexOf(group) !== -1;
  });
}

/* 判断岗位是否匹配用户意向专业（「不限专业」不算具体匹配）：
   既看 majors 字段，也看岗位名称/所属大类/工作内容，专业填口语化名称也能命中 */
function jobMatchesMajor(job, major) {
  if (!job || !major) return false;
  var terms = expandMajorTerms(major);
  if (!terms.length) return false;
  var majors = job.majors;
  if (Array.isArray(majors) && majors.length) {
    var hit = majors.some(function (m) {
      if (!m || !m.group || m.group === "不限专业") return false;
      if (majorGroupMatches(m.group, terms)) return true;
      if (Array.isArray(m.list)) {
        return m.list.some(function (e) { return majorEntryMatches(e, terms); });
      }
      return false;
    });
    if (hit) return true;
  }
  var nameText = (job.name || "") + " " + (job.category || "");
  return terms.some(function (t) { return nameText.indexOf(t) !== -1; });
}

/* 主过滤函数 */
function filterJobs(jobs, userProfile) {
  if (!Array.isArray(jobs) || !jobs.length) return [];
  userProfile = userProfile || {};

  var userHealth = String(userProfile.health || userProfile.bodyCondition || "").trim();
  var userEduLevel = getEducationLevel(userProfile.education);
  var userGender = userProfile.gender;
  var userMajor = String(userProfile.major || "").trim();

  return jobs.filter(function (job) {
    // 1. 性别过滤：岗位限性别且与用户不符 → 剔除
    if (job.gender && userGender && job.gender !== userGender) {
      return false;
    }

    // 2. 健康限制过滤：用户身体情况与岗位限制命中同一关键词 → 剔除
    var restrictions = job.healthRestrictions || job.restrictions || "";
    if (userHealth && hasHealthConflict(userHealth, restrictions)) {
      return false;
    }

    // 3. 学历过滤：岗位最低学历高于用户学历 → 剔除（硬性证书改为在报告中标注「缺少证书」，不再剔除）
    var jobEduLevel = getEducationLevel(job.minEducation || job.education);
    if (userEduLevel > 0 && jobEduLevel > userEduLevel) {
      return false;
    }

    // 4. 专业过滤：已选意向专业 → 仅保留专业匹配岗位（避免推荐专业外岗位）
    if (userMajor && !jobMatchesMajor(job, userMajor)) {
      return false;
    }

    // 5. 学历反向过滤：岗位学历明显低于用户（大材小用）→ 剔除（如本科不应匹配小学/初中岗）
    if (userEduLevel > 0 && jobEduLevel > 0 && userEduLevel - jobEduLevel >= 3) {
      return false;
    }

    return true;
  });
}

/* 暴露到全局，供 main.js 调用 */
window.filterJobs = filterJobs;
window.APP_DATA.filterJobs = filterJobs;
window.APP_DATA.jobMatchesMajor = jobMatchesMajor;
window.APP_DATA.expandMajorTerms = expandMajorTerms;
window.APP_DATA.majorEntryMatches = majorEntryMatches;
window.APP_DATA.majorGroupMatches = majorGroupMatches;
window.APP_DATA.MAJOR_SYNONYMS = MAJOR_SYNONYMS;
window.APP_DATA.EDUCATION_LEVELS = EDUCATION_LEVELS;
window.APP_DATA.HEALTH_KEYWORDS = HEALTH_KEYWORDS;
