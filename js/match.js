/*
 * match.js — 岗位匹配打分逻辑
 * matchJobs(filteredJobs, userProfile, mbtiType) → 返回适配岗位（最多 10 个，附 score / scoreDetail）
 *
 * 打分维度（满分 100）：
 *   MBTI 匹配   30 分：岗位 mbtiTypes 含用户 MBTI → 30；不含但同属一大类（如 INTJ/INTP 皆 NT）→ 15
 *   专业匹配   20 分：用户有意向专业且岗位 majors 包含 → 20，否则 0
 *   特长匹配   20 分：用户特长文本与岗位名称/工作内容关键词重叠 → 按命中比例给分
 *   证书匹配   15 分：用户证书文本包含岗位 certificates 中任一 → 15
 *   学历匹配   15 分：用户学历高于岗位要求 → 15，等于 → 10
 */
window.APP_DATA = window.APP_DATA || {};

/* 学历等级（与 filter.js 一致；filter.js 已加载则复用其映射） */
var EDUCATION_LEVELS = (window.APP_DATA && window.APP_DATA.EDUCATION_LEVELS) || {
  "初中及以下": 1,
  "高中": 2,
  "中专": 2,
  "职高": 2,
  "高中/中专/职高": 2,
  "大专": 3,
  "本科及以上": 4
};

function getEduLevel(edu) {
  return EDUCATION_LEVELS[edu] != null ? EDUCATION_LEVELS[edu] : 0;
}

/* ---------- 各维度打分 ---------- */

/* MBTI 大类：取第 2、3 位（S/N + T/F），如 INTJ → "NT" */
function mbtiGroup(type) {
  return type && type.length === 4 ? type[1] + type[2] : "";
}

function scoreMbti(jobMbti, userType) {
  if (!userType || !Array.isArray(jobMbti) || !jobMbti.length) return 0;
  if (jobMbti.indexOf(userType) !== -1) return 30;
  var group = mbtiGroup(userType);
  if (!group) return 0;
  return jobMbti.some(function (t) { return mbtiGroup(t) === group; }) ? 15 : 0;
}

/* 专业匹配：既看 majors 字段，也看岗位名称/所属大类（如专业填「销售」能命中销售岗） */
function scoreMajor(job, userMajor) {
  if (!job || !userMajor) return 0;
  var um = String(userMajor).trim();
  if (um.length < 2) return 0;

  var jobMajors = job.majors;
  if (Array.isArray(jobMajors) && jobMajors.length) {
    var hit = jobMajors.some(function (m) {
      if (!m) return false;
      if (m.group && m.group.indexOf(um) !== -1) return true;  // 大类名匹配
      if (Array.isArray(m.list)) {                              // 细分专业双向包含
        return m.list.some(function (entry) {
          return entry && (entry.indexOf(um) !== -1 || um.indexOf(entry) !== -1);
        });
      }
      return false;
    });
    if (hit) return 20;
  }

  var nameText = (job.name || "") + " " + (job.category || "");
  return nameText.indexOf(um) !== -1 ? 20 : 0;
}

/* 特长同义词映射：用户特长关键词 → 岗位名称/工作内容里可能出现的近义词 */
var SKILL_SYNONYMS = {
  "编程": ["编程", "代码", "开发", "程序", "软件", "程序员", "算法", "Java", "Python", "C语言"],
  "算法": ["算法", "编程", "代码", "开发", "程序", "软件"],
  "代码": ["代码", "编程", "开发", "程序", "软件"],
  "开发": ["开发", "编程", "代码", "程序", "软件", "前端", "后端"],
  "程序": ["程序", "编程", "代码", "开发", "软件"],
  "软件": ["软件", "编程", "代码", "开发", "程序"],
  "前端": ["前端", "网页", "H5", "开发", "编程"],
  "后端": ["后端", "开发", "服务器", "接口", "编程"],
  "数据库": ["数据库", "SQL", "数据", "开发"],
  "数据": ["数据", "数据库", "统计", "报表", "分析"],
  "Excel": ["Excel", "表格", "数据", "办公", "统计"],
  "办公": ["办公", "电脑", "Excel", "Word", "文员", "行政"],
  "电脑": ["电脑", "计算机", "办公", "录入", "打字"],
  "计算机": ["计算机", "电脑", "开发", "软件", "网络"],
  "沟通": ["沟通", "接待", "客服", "客户", "对接", "销售", "讲解"],
  "表达": ["表达", "沟通", "讲解", "授课", "主持", "演讲"],
  "细心": ["细心", "耐心", "严谨", "核对", "校对", "仔细"],
  "耐心": ["耐心", "细心", "看护", "照顾", "陪护"],
  "设计": ["设计", "美工", "PS", "AI", "绘图", "视觉", "原画"],
  "绘画": ["绘画", "设计", "美术", "绘图", "原画", "插画"],
  "美术": ["美术", "设计", "绘画", "绘图", "视觉"],
  "英语": ["英语", "翻译", "外贸", "涉外", "口语"],
  "翻译": ["翻译", "英语", "日语", "韩语", "德语", "法语", "外语"],
  "销售": ["销售", "营销", "客户", "业务", "推广", "谈判"],
  "营销": ["营销", "销售", "推广", "市场", "策划"],
  "驾驶": ["驾驶", "司机", "开车", "车辆"],
  "开车": ["开车", "驾驶", "司机", "车辆"],
  "烹饪": ["烹饪", "厨师", "厨艺", "面点", "切配"],
  "厨艺": ["厨艺", "烹饪", "厨师", "面点"],
  "写作": ["写作", "文案", "编辑", "撰稿", "公文"],
  "文案": ["文案", "写作", "编辑", "策划", "撰稿"],
  "SCI": ["科研", "论文", "研究", "学术", "课题", "实验", "研发", "期刊"],
  "sci": ["科研", "论文", "研究", "学术", "课题", "实验", "研发", "期刊"],
  "论文": ["论文", "科研", "研究", "学术", "发表", "期刊"],
  "科研": ["科研", "研究", "论文", "学术", "课题", "实验", "研发"],
  "学术": ["学术", "科研", "论文", "研究"],
  "研究": ["研究", "科研", "论文", "学术", "调研", "研发"],
  "医学": ["医学", "临床", "医疗", "医生", "医护", "护士", "护理", "医药", "药剂", "针灸", "康复", "病历"],
  "临床": ["临床", "医学", "医疗", "医生", "医护", "护士", "护理", "病历"],
  "医疗": ["医疗", "医学", "临床", "医生", "医护", "护士", "护理"],
  "护理": ["护理", "护士", "医护", "看护", "陪护"],
  "抗压": ["销售", "客户", "客服", "业务", "业绩", "考核", "目标", "投诉", "催收", "加班"],
  "压力": ["销售", "客户", "客服", "业务", "业绩", "考核", "目标", "投诉", "催收", "加班"],
  "韧性": ["销售", "客户", "业务", "业绩", "考核", "目标", "耐心", "坚持"],
  "坚持": ["坚持", "耐心", "目标", "业绩", "考核"],
  "吃苦": ["搬运", "加班"],
  "耐劳": ["搬运", "加班", "吃苦"],
  "责任": ["审核", "校对", "监管", "安全", "财务", "出纳", "仓库", "负责"],
  "负责": ["审核", "校对", "监管", "安全", "财务", "出纳", "仓库", "责任"],
  "团队": ["团队", "协作", "配合", "协调", "对接"],
  "协作": ["协作", "配合", "协调", "团队", "对接"],
  "合作": ["合作", "协作", "配合", "对接", "协调"],
  "学习": ["学习", "培训", "指导", "带教"],
  "执行": ["执行", "落实", "推进", "完成"],
  "分析": ["分析", "数据", "报告", "调研", "评估"],
  "组织": ["组织", "策划", "协调", "统筹", "安排"],
  "管理": ["管理", "组织", "协调", "统筹", "负责"]
};

/* 特长匹配：同义词映射 + 直接子串，按命中比例给分 */
function scoreStrengths(userStrengths, jobName, jobWork) {
  if (!userStrengths) return 0;
  var us = String(userStrengths);
  var text = (jobName || "") + " " + (jobWork || "");

  var matchedCount = 0;
  var totalCount = 0;

  // 同义词组：用户特长文本包含某个 key，就检查岗位文本是否含该组任一近义词
  Object.keys(SKILL_SYNONYMS).forEach(function (key) {
    if (us.indexOf(key) === -1) return;
    totalCount++;
    if (SKILL_SYNONYMS[key].some(function (s) { return text.indexOf(s) !== -1; })) {
      matchedCount++;
    }
  });

  // 若没有命中任何同义词，退化为直接子串匹配
  if (!totalCount) {
    var kws = us.split(/[、，,；;。\s\/]+/).filter(function (s) { return s.length >= 2; });
    if (!kws.length) return 0;
    var directMatched = kws.filter(function (kw) { return text.indexOf(kw) !== -1; }).length;
    return Math.round((20 * directMatched) / kws.length);
  }

  return Math.min(20, Math.round((20 * matchedCount) / totalCount));
}

/* 证书匹配 */
function scoreCertificates(jobCertificates, userCertificates) {
  if (!jobCertificates) return 0;
  var jc = String(jobCertificates).trim();
  if (!jc) return 0;
  if (jc.indexOf("无硬性证书") !== -1 || jc.indexOf("不强制") !== -1 || jc.indexOf("无强制") !== -1) return 15; // 岗位无硬性证书要求 → 不设门槛

  var uc = String(userCertificates || "").trim();
  if (!uc) return 0;

  var certs = jc
    .replace(/（[^）]*）|\([^)]*\)/g, "")       // 去括号说明
    .split(/[、，,；;\/]+/)
    .map(function (s) { return s.replace(/(优先|加分)$/g, "").trim(); })
    .filter(Boolean);

  var userTokens = uc.split(/[、，,；;\/\s]+/).filter(Boolean);
  return certs.some(function (c) {
    return userTokens.some(function (ut) {
      return ut.indexOf(c) !== -1 || c.indexOf(ut) !== -1;
    });
  }) ? 15 : 0;
}

/* 学历匹配 */
function scoreEducation(jobEdu, userEdu) {
  var jl = getEduLevel(jobEdu);
  var ul = getEduLevel(userEdu);
  if (ul > 0 && ul > jl) return 15;
  if (ul > 0 && ul === jl) return 10;
  return 0;
}

/* 科研/学术信号：用户特长含这些词 → 视为强科研背景（如发过 SCI），给科研岗额外加分 */
var RESEARCH_USER_FLAGS = ["SCI", "sci", "论文", "科研", "学术", "发表", "期刊", "课题", "研究"];
var RESEARCH_JOB_FLAGS = ["科研", "研究", "论文", "学术", "课题", "实验", "研发", "期刊", "实验室"];

function hasResearchSignal(strengths) {
  var us = String(strengths || "");
  return RESEARCH_USER_FLAGS.some(function (k) { return us.indexOf(k) !== -1; });
}
function isResearchJob(job) {
  var text = (job.name || "") + " " + (job.work || "");
  return RESEARCH_JOB_FLAGS.some(function (k) { return text.indexOf(k) !== -1; });
}

/* ---------- 主函数 ---------- */
function matchJobs(filteredJobs, userProfile, mbtiType) {
  if (!Array.isArray(filteredJobs) || !filteredJobs.length) return [];
  userProfile = userProfile || {};

  var hasResearch = hasResearchSignal(userProfile.strengths);

  var scored = filteredJobs.map(function (job) {
    var detail = {
      mbti: scoreMbti(job.mbtiTypes || job.mbti, mbtiType),
      major: scoreMajor(job, userProfile.major),
      strengths: scoreStrengths(userProfile.strengths, job.name, job.work),
      certificates: scoreCertificates(job.certificates, userProfile.certificates),
      education: scoreEducation(job.minEducation || job.education, userProfile.education)
    };
    // 科研背景（如发过 SCI）→ 科研岗额外加分，突出学术能力，不与普通特长混同
    var researchBonus = (hasResearch && isResearchJob(job)) ? 10 : 0;
    var total = detail.mbti + detail.major + detail.strengths + detail.certificates + detail.education + researchBonus;
    return { job: job, score: total, detail: detail };
  });

  scored.sort(function (a, b) { return b.score - a.score; });

  // 只推荐「实质适配」岗位：专业匹配或特长匹配（不靠人格/学历凑数）；实在没有实质匹配时退回按总分
  var substantial = scored.filter(function (item) {
    return item.detail.major > 0 || item.detail.strengths > 0;
  });
  if (substantial.length) scored = substantial;

  return scored.slice(0, 10).map(function (item) {
    item.job.score = item.score;          // 附总分
    item.job.scoreDetail = item.detail;   // 附各维度明细
    return item.job;
  });
}

/* 暴露到全局，供 main.js 调用 */
window.matchJobs = matchJobs;
window.APP_DATA.matchJobs = matchJobs;
window.APP_DATA.scoreStrengths = scoreStrengths;
window.APP_DATA.scoreMajor = scoreMajor;
