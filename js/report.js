/*
 * report.js — 报告生成逻辑
 * generateReport(userProfile, mbtiType, matchedJobs) → 返回完整报告文本字符串（Markdown 格式）
 *
 * 说明：
 * - 「💪个人特长适配」按字面理解填用户填写的个人特长；如需改成岗位适配专业(majors)可替换。
 */
window.APP_DATA = window.APP_DATA || {};

/* 学历等级（与 filter.js / match.js 一致，优先复用） */
var EDUCATION_LEVELS = (window.APP_DATA && window.APP_DATA.EDUCATION_LEVELS) || {
  "初中及以下": 1,
  "高中": 2,
  "中专": 2,
  "职高": 2,
  "高中/中专/职高": 2,
  "大专": 3,
  "本科": 4,
  "本科及以上": 4,
  "硕士": 5,
  "博士": 6
};

/* 城市等级薪资系数（基准 = 二线城市 = 1.0，报告薪资 = 二线基准 × 系数） */
var CITY_COEFFICIENTS = {
  "一线城市": 1.30,
  "新一线城市": 1.15,
  "二线城市": 1.00,
  "三线城市": 0.85,
  "四五线城市": 0.75
};

/* 16 型人格简短概括 */
var MBTI_ARCHETYPE = {
  "ISTJ": "稳健务实的执行者",
  "ISFJ": "细致可靠的守护者",
  "INFJ": "洞察人心的引导者",
  "INTJ": "远见卓识的规划者",
  "ISTP": "冷静灵活的问题解决者",
  "ISFP": "温和细腻的实践者",
  "INFP": "富有理想的调和者",
  "INTP": "逻辑缜密的分析者",
  "ESTP": "果敢灵活的实干家",
  "ESFP": "热情活跃的带动者",
  "ENFP": "充满创意的激励者",
  "ENTP": "敏捷善辩的创新者",
  "ESTJ": "高效务实的组织者",
  "ESFJ": "热心周到的支持者",
  "ENFJ": "富有感染力的领导者",
  "ENTJ": "目标明确的指挥者"
};

/* 单个维度字母对应的职场优势 */
var LETTER_STRENGTH = {
  "E": "外向——善于在团队协作、沟通协调中发挥能量，适合需要多方对接、汇报展示的工作。",
  "I": "内向——擅长深度思考与专注执行，适合需要独立钻研、精细作业的工作。",
  "S": "感觉——关注细节与落地，习惯按规范流程办事，适合讲究准确性与可操作性的工作。",
  "N": "直觉——善于把握整体与趋势，喜欢探索新思路，适合需要规划与创新的工作。",
  "T": "思考——决策理性客观，重视逻辑与公平，适合需要分析判断、标准把控的工作。",
  "F": "情感——重视人际和谐与价值感，体谅他人，适合需要服务、协调、支持的工作。",
  "J": "判断——偏好计划与条理，擅长推进收尾，适合需要统筹安排、闭环管理的工作。",
  "P": "知觉——灵活应变，享受多种可能，适合需要随机调整、快速响应的环境。"
};

function getEduLevel(edu) {
  return EDUCATION_LEVELS[edu] != null ? EDUCATION_LEVELS[edu] : 0;
}

/* 类型 + 简短概括，如 "ISTJ · 稳健务实的执行者" */
function mbtiSummary(type) {
  if (!type) return "未测评";
  var arch = MBTI_ARCHETYPE[type];
  return arch ? type + " · " + arch : type;
}

/* 人格核心优势分析（多行文本） */
function strengthsAnalysis(type) {
  if (!type || type.length !== 4) return "请先完成测评以获取人格分析。";
  var arch = MBTI_ARCHETYPE[type] || "";
  var head = "你属于 " + type + " 型" + (arch ? "（" + arch + "）" : "") + "，在职场中具备以下核心优势：";
  var body = type.split("").map(function (l) {
    return LETTER_STRENGTH[l] ? "· " + LETTER_STRENGTH[l] : null;
  }).filter(Boolean);
  return head + "\n" + body.join("\n");
}

/* 学历适配：高于要求 → 适配；等于 → 达标 */
function educationFit(userEdu, jobEdu) {
  var ul = getEduLevel(userEdu);
  var jl = getEduLevel(jobEdu);
  if (ul > jl) return "适配";
  if (ul === jl && jl > 0) return "达标";
  return "未达标";
}

/* 解析薪资区间 → [低, 高]（单位 k），兼容 "4.5k-7k / 月" 与 "3200-4500 / 月" */
function parseSalaryRange(salary) {
  if (!salary) return null;
  var s = String(salary).trim();
  var m = s.match(/(\d+(?:\.\d+)?)\s*k?\s*[-–—]\s*(\d+(?:\.\d+)?)\s*k?/i);
  if (!m) return null;
  var a = parseFloat(m[1]);
  var b = parseFloat(m[2]);
  if (!/k/i.test(s)) { a = a / 1000; b = b / 1000; }
  return [a, b];
}

/* 按城市系数调整薪资，输出 "Xk-Yk/月" */
function formatSalary(salary, coefficient) {
  var range = parseSalaryRange(salary);
  if (!range) return salary || "面议";
  var coef = (typeof coefficient === "number") ? coefficient : 1;
  var a = Math.round(range[0] * coef * 10) / 10;
  var b = Math.round(range[1] * coef * 10) / 10;
  return a + "k-" + b + "k/月";
}

/* 城市系数与薪资标签 */
function getCityCoefficient(cityTier) {
  var c = CITY_COEFFICIENTS[cityTier];
  return (typeof c === "number") ? c : 1;
}
function citySalaryLabel(cityTier) {
  return (cityTier && CITY_COEFFICIENTS[cityTier] != null) ? (cityTier + "税前") : "二线城市税前";
}

/* 判断用户是否缺少岗位的硬性证书 */
function hasMissingCert(job, userProfile) {
  if (!job || !job.requiredCert) return false;
  var userCerts = String((userProfile && userProfile.certificates) || "");
  var req = String(job.requiredCert).split(/[、，,；;\/\+]/);
  return req.some(function (c) {
    c = c.trim();
    return c && userCerts.indexOf(c) === -1;
  });
}

/* 判断岗位是否匹配用户专业（「不限专业」不算；也看岗位名称/所属大类） */
function hasMajorMatch(job, userProfile) {
  var major = String((userProfile && userProfile.major) || "").trim();
  if (!major || !job) return false;
  var terms = (window.APP_DATA && typeof window.APP_DATA.expandMajorTerms === "function")
    ? window.APP_DATA.expandMajorTerms(major)
    : [major];
  if (!terms.length) return false;
  var majors = (job.majors) || [];
  if (majors.some(function (m) {
    if (!m || !m.group || m.group === "不限专业") return false;
    if (window.APP_DATA && typeof window.APP_DATA.majorGroupMatches === "function") {
      if (window.APP_DATA.majorGroupMatches(m.group, terms)) return true;
    } else if (terms.some(function (t) { return m.group.indexOf(t) !== -1 || t.indexOf(m.group) !== -1; })) {
      return true;
    }
    if (Array.isArray(m.list)) {
      return m.list.some(function (e) {
        if (window.APP_DATA && typeof window.APP_DATA.majorEntryMatches === "function") {
          return window.APP_DATA.majorEntryMatches(e, terms);
        }
        return e && terms.some(function (t) { return e.indexOf(t) !== -1 || t.indexOf(e) !== -1; });
      });
    }
    return false;
  })) return true;
  var nameText = (job.name || "") + " " + (job.category || "");
  return terms.some(function (t) { return nameText.indexOf(t) !== -1; });
}

/* 判断岗位是否与用户特长匹配 */
function hasStrengthMatch(job, userProfile) {
  if (window.APP_DATA && typeof window.APP_DATA.scoreStrengths === "function") {
    return window.APP_DATA.scoreStrengths((userProfile && userProfile.strengths), job.name, job.work) > 0;
  }
  return false;
}

/* 是否为央国企岗位（数据里以「国企央企岗」板块标识） */
function getJobOwnership(job) {
  return (job && job.category === "国企央企岗") ? "央国企" : "非央国企";
}

/* 年龄限制参考值：按岗位名称关键词 + 所属板块推断，最终以招聘公告为准 */
function getJobAgeLimit(job) {
  var name = (job && job.name) || "";
  var cat = (job && job.category) || "";

  if (/实习|见习/.test(name)) return "18-25岁（实习/见习岗常见要求）";
  if (/经理|总监|主任|行长|负责人|主管|高管/.test(name)) return "25-45岁（管理岗常见要求）";
  if (/保安|保洁|门卫|司机|搬运|装卸|普工|操作工|流水线|叉车|焊工|电工|厨师|服务员|收银|导购|配送|快递|外卖|建筑|施工|装修/.test(name)) {
    return "18-45岁（一线/体力岗多限45岁以下）";
  }
  if (cat === "机关/事业单位/编外") return "18-35岁（公务员/事业编常见上限35岁，部分岗位放宽至40岁）";
  if (cat === "国企央企岗") return "18-35岁（部分技术/管理岗放宽至40-45岁）";
  if (cat === "银行保险" || cat === "证券金融投资") return "18-35岁（应届/社招岗位略有差异）";
  if (cat === "教育教培" || cat === "医院医疗" || cat === "文教") return "18-60岁（需具备相应资格证书）";
  if (/工厂制造|技工|机械|汽车|建筑规划|印刷包装|化工生物|物流仓储运输|酒店餐饮|百货零售|生产供应链/.test(cat)) {
    return "18-45岁（部分岗位限45岁以下）";
  }
  return "18-60岁（以招聘公告为准）";
}

/* 求职参考链接：央国企走官方招聘平台，事业单位走事业编招聘/人事考试平台，其他岗位走主流招聘网站搜索 */
function getJobSearchLinks(job) {
  var name = (job && job.name) || "";
  var cat = (job && job.category) || "";

  if (cat === "国企央企岗") {
    return [{ label: "国聘网（央企国企官方招聘平台，具体以目标单位官网公告为准）", short: "国聘网", url: "https://www.iguopin.com/" }];
  }
  if (cat.indexOf("机关/事业单位") === 0) {
    return [
      { label: "事业单位招聘考试网", short: "事业单位招聘网", url: "https://www.shiyebian.net/" },
      { label: "中国人事考试网（官方）", short: "中国人事考试网", url: "http://www.cpta.com.cn/" }
    ];
  }
  var q = encodeURIComponent(name);
  return [
    { label: "BOSS直聘", short: "BOSS直聘", url: "https://www.zhipin.com/web/geek/job?query=" + q },
    { label: "猎聘", short: "猎聘", url: "https://www.liepin.com/zhaopin/?key=" + q },
    { label: "智联招聘", short: "智联招聘", url: "https://sou.zhaopin.com/?kw=" + q }
  ];
}

/* 把链接数组转成 Markdown 行内链接，供报告文本展示与复制 */
function linksToMarkdown(links) {
  return (links || []).map(function (l) {
    return "[" + (l.short || l.label) + "](" + l.url + ")";
  }).join(" ");
}

/* 主函数 */
function generateReport(userProfile, mbtiType, matchedJobs, filteredJobs) {
  userProfile = userProfile || {};
  matchedJobs = matchedJobs || [];
  filteredJobs = filteredJobs || [];

  var lines = [];
  var cityCoef = getCityCoefficient(userProfile.cityTier);
  var cityLabel = citySalaryLabel(userProfile.cityTier);

  lines.push("# 个人职业精准适配测评报告");
  lines.push("");

  // 一、个人基础信息
  lines.push("## 一、个人基础信息");
  lines.push("- 测评MBTI人格：" + mbtiSummary(mbtiType));
  lines.push("- 所在城市：" + (userProfile.cityTier || "二线城市"));
  lines.push("- 性别：" + (userProfile.gender || "未填写"));
  lines.push("- 最高学历：" + (userProfile.education || "未填写"));
  lines.push("- 意向专业：" + (userProfile.major || "无"));
  lines.push("- 个人特长：" + (userProfile.strengths || "未填写"));
  lines.push("- 工作经验（实习）：" + (userProfile.experience || "未填写"));
  lines.push("- 所持证书/奖项：" + (userProfile.certificates || "未填写"));
  lines.push("- 身体适配情况：" + (userProfile.health || "无特殊情况"));
  lines.push("");

  // 二、人格核心优势分析
  lines.push("## 二、人格核心优势分析");
  lines.push(strengthsAnalysis(mbtiType));
  lines.push("");

  // 三、岗位适配说明
  lines.push("## 三、岗位适配说明");
  lines.push("本报告已根据你的学历水平、身体/环境限制、个人特长、意向专业与人格类型，综合过滤掉不适配岗位，并按适配度打分排序，为你推荐以下岗位。");
  lines.push("");

  // 计算「接近匹配但未进入推荐」的岗位
  var nearMiss = [];
  var topIds = {};
  matchedJobs.forEach(function (j) { if (j) topIds[j.id] = true; });
  var hasMajor = !!(userProfile.major && String(userProfile.major).trim());
  filteredJobs.forEach(function (job) {
    if (!job || topIds[job.id]) return;
    var majorOk = hasMajorMatch(job, userProfile);
    // 已选意向专业 → 只推荐专业匹配的岗位，不因「特长」推专业外岗位
    if (hasMajor && !majorOk) return;
    var tag = null;
    if (hasMissingCert(job, userProfile)) {
      tag = "缺少证书：" + (job.requiredCert || "相关证书");
    } else if (majorOk || hasStrengthMatch(job, userProfile)) {
      tag = "专业/特长匹配";
    }
    if (tag) nearMiss.push({ job: job, tag: tag });
  });

  if (nearMiss.length) {
    lines.push("以下岗位也与你的条件较为匹配，但未进入推荐前列，可作参考：");
    nearMiss.slice(0, 8).forEach(function (item) {
      lines.push("- " + (item.job.name || "未命名岗位") + "（" + item.tag + "）｜" + linksToMarkdown(getJobSearchLinks(item.job)));
    });
    lines.push("");
  }

  // 四、最优适配岗位推荐
  lines.push("## 四、最优适配岗位推荐");
  lines.push("");
  lines.push("说明：部分岗位对证书有硬性要求，若你缺少对应证书，岗位名称后会标注「（缺少证书）」，建议先取得证书再申请。");
  lines.push("");
  if (matchedJobs.length) {
    matchedJobs.forEach(function (job, i) {
      var mbti = job.mbtiTypes || job.mbti;
      var missingCert = hasMissingCert(job, userProfile);
      lines.push("### " + (i + 1) + ". " + (job.name || "未命名岗位") + (missingCert ? "（缺少证书）" : ""));
      lines.push("✅学历适配：" + educationFit(userProfile.education, job.minEducation || job.education));
      lines.push("🧠人格适配：" + (Array.isArray(mbti) ? mbti.join("、") : (mbti || "不限")) + "（仅职业偏好参考）");
      lines.push("🎖证书奖项适配：" + (job.certificates || "无硬性要求"));
      lines.push("💪个人特长适配：" + (userProfile.strengths || "未填写"));
      lines.push("📌真实工作内容：" + (job.work || "以企业招聘官网JD为准"));
      lines.push("⏰标准上班工时：" + (job.workTime || "以企业招聘官网JD为准"));
      lines.push("💰市场薪资参考：" + formatSalary(job.salary, cityCoef) + "（" + cityLabel + "，市场参考）");
      lines.push("🧓年龄限制：" + getJobAgeLimit(job));
      lines.push("🧭身体/环境限制：" + (job.restrictions || "无特殊限制"));
      lines.push("🔗更多详细参考：" + getJobSearchLinks(job).map(function (l) {
        return l.label + " " + l.url;
      }).join(" ｜ "));
      lines.push("");
    });
  } else {
    lines.push("暂未匹配到完全适配的岗位，建议放宽条件后重新测评。");
    lines.push("");
  }

  // 五、求职忠告
  lines.push("## 五、求职忠告");
  lines.push("岗位选择需要慎重斟酌，建议提前调研行业发展前景，结合自身家庭情况、生活规划综合评估，不要仅凭本次测评结果做决定。");
  lines.push("");

  // 六、免责声明
  lines.push("## 六、免责声明");
  lines.push("本报告基于MBTI人格特质、个人背景、身体条件综合匹配生成，仅作职业规划参考；薪资、工时随城市与企业变动，岗位实际工作内容以企业招聘官网JD为准；如有身体基础疾病，求职请优先遵从医嘱。");
  lines.push("");

  // 结尾寄语
  lines.push("希望给你带来帮助，希望你能找到适配又喜欢的工作，希望你每天开心健康常在！");

  return lines.join("\n");
}

/* 暴露到全局，供 main.js 调用 */
window.generateReport = generateReport;
window.APP_DATA.generateReport = generateReport;

/* 供 main.js 渲染岗位胶囊与详情使用 */
window.REPORT_HELPERS = {
  educationFit: educationFit,
  formatSalary: formatSalary,
  getCityCoefficient: getCityCoefficient,
  citySalaryLabel: citySalaryLabel,
  hasMissingCert: hasMissingCert,
  getJobOwnership: getJobOwnership,
  getJobAgeLimit: getJobAgeLimit,
  getJobSearchLinks: getJobSearchLinks
};
