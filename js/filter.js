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

/* 学历等级：初中及以下=1，高中/中专/职高=2，大专=3，本科及以上=4 */
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

/* 判断岗位是否匹配用户意向专业（「不限专业」不算具体匹配）：
   既看 majors 字段，也看岗位名称/所属大类，专业填「销售」「计算机」这类非专业名词也能命中 */
function jobMatchesMajor(job, major) {
  if (!job || !major) return false;
  var um = String(major).trim();
  if (um.length < 2) return false;
  var majors = job.majors;
  if (Array.isArray(majors) && majors.length) {
    var hit = majors.some(function (m) {
      if (!m || !m.group || m.group === "不限专业") return false;
      if (m.group.indexOf(um) !== -1) return true;
      if (Array.isArray(m.list)) {
        return m.list.some(function (e) { return e && (e.indexOf(um) !== -1 || um.indexOf(e) !== -1); });
      }
      return false;
    });
    if (hit) return true;
  }
  var nameText = (job.name || "") + " " + (job.category || "");
  return nameText.indexOf(um) !== -1;
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
window.APP_DATA.EDUCATION_LEVELS = EDUCATION_LEVELS;
window.APP_DATA.HEALTH_KEYWORDS = HEALTH_KEYWORDS;
