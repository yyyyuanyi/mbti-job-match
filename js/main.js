/*
 * main.js — 页面流程控制（编排层）
 * 依赖：mbti.js（题目）、jobs.js（岗位）、filter.js（过滤）、match.js（打分）、report.js（报告）
 */
(function () {
  "use strict";

  var QUESTIONS = window.APP_DATA.QUESTIONS || [];
  var OPTIONS = window.APP_DATA.OPTIONS || [];

  var DIM_ORDER = ["EI", "SN", "TF", "JP"];
  var DIM_LETTER = { EI: ["E", "I"], SN: ["S", "N"], TF: ["T", "F"], JP: ["J", "P"] };

  var state = {
    userProfile: null,
    answers: {},
    mbtiType: "",
    matchedJobs: [],
    categories: [],
    reportText: ""
  };

  /* ============ 页面切换：隐藏所有页面，显示指定页面 ============ */
  function showPage(pageId) {
    var pages = document.querySelectorAll(".page");
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove("active");
    }
    var el = document.getElementById(pageId);
    if (el) el.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ============ 意向专业显隐 ============ */
  function initMajorToggle() {
    var wrapper = document.getElementById("major-wrapper");
    var input = document.getElementById("major");
    var radios = document.querySelectorAll('input[name="has-major"]');

    function sync() {
      var checked = document.querySelector('input[name="has-major"]:checked');
      var isYes = checked && checked.value === "yes";
      wrapper.style.display = isYes ? "block" : "none";
      if (!isYes) input.value = "";
    }
    for (var i = 0; i < radios.length; i++) radios[i].addEventListener("change", sync);
    sync();
  }

  /* ============ 渲染问卷（选项值：非常符合=5 … 完全不符合=1） ============ */
  function renderQuestions() {
    var container = document.getElementById("questions-container");
    container.innerHTML = "";

    QUESTIONS.forEach(function (q, idx) {
      var item = document.createElement("div");
      item.className = "question";
      item.id = "q-" + q.id;

      var header = document.createElement("div");
      header.className = "question-header";
      var num = document.createElement("span");
      num.className = "question-num";
      num.textContent = "Q" + (idx + 1);
      var tag = document.createElement("span");
      tag.className = "question-dim";
      tag.textContent = q.dim;
      header.appendChild(num);
      header.appendChild(tag);

      var text = document.createElement("p");
      text.className = "question-text";
      text.textContent = q.text;

      var opts = document.createElement("div");
      opts.className = "options";
      OPTIONS.forEach(function (opt, oi) {
        var label = document.createElement("label");
        label.className = "option";
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "question-" + q.id;
        radio.value = String(5 - oi);
        radio.addEventListener("change", function () {
          state.answers[q.id] = 5 - oi;
          item.classList.remove("error");
        });
        var span = document.createElement("span");
        span.textContent = opt;
        label.appendChild(radio);
        label.appendChild(span);
        opts.appendChild(label);
      });

      item.appendChild(header);
      item.appendChild(text);
      item.appendChild(opts);
      container.appendChild(item);
    });
  }

  /* ============ 计算 MBTI 类型 ============ */
  function calculateMBTI(answers) {
    var type = "";
    DIM_ORDER.forEach(function (dim) {
      var qs = QUESTIONS.filter(function (q) { return q.dim === dim; });
      var sum = 0;
      qs.forEach(function (q) { sum += answers[q.id] || 0; });
      type += (sum >= 15 ? DIM_LETTER[dim][0] : DIM_LETTER[dim][1]);
    });
    return type;
  }

  /* ============ 表单收集与校验 ============ */
  function collectUserProfile() {
    state.userProfile = {
      education: document.getElementById("education").value,
      cityTier: document.getElementById("city-tier").value,
      gender: document.getElementById("gender").value,
      major: document.getElementById("major").value.trim(),
      certificates: document.getElementById("certificates").value.trim(),
      strengths: document.getElementById("strengths").value.trim(),
      health: document.getElementById("health").value.trim()
    };
  }

  function validateForm() {
    if (!document.getElementById("education").value) { alert("请先选择学历。"); return false; }
    if (!document.getElementById("gender").value) { alert("请选择性别。"); return false; }
    if (!document.getElementById("strengths").value.trim()) { alert("「个人特长」为必填项，请填写后再继续。"); return false; }
    return true;
  }

  function validateQuiz() {
    var missing = QUESTIONS.filter(function (q) { return !state.answers[q.id]; });
    if (missing.length) {
      alert("还有 " + missing.length + " 题未作答，请完成全部题目后提交。");
      missing.forEach(function (q) { document.getElementById("q-" + q.id).classList.add("error"); });
      document.getElementById("q-" + missing[0].id).scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }

  /* ============ 过滤 + 匹配 ============ */
  function extractCategories(jobs) {
    var result = [];
    var seen = {};
    jobs.forEach(function (j) {
      var c = j.category;
      if (c && !seen[c]) {
        seen[c] = true;
        var count = jobs.filter(function (x) { return x.category === c; }).length;
        result.push({ name: c, count: count });
      }
    });
    return result;
  }

  function runMatching() {
    var jobs = window.APP_DATA.JOBS || [];
    var filtered = (typeof window.filterJobs === "function")
      ? window.filterJobs(jobs, state.userProfile)
      : jobs;
    state.filteredJobs = filtered;
    state.matchedJobs = (typeof window.matchJobs === "function")
      ? window.matchJobs(filtered, state.userProfile, state.mbtiType)
      : filtered.slice(0, 10);
    state.categories = extractCategories(state.matchedJobs);
  }

  /* ============ 报告渲染 ============ */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* 简易 Markdown → HTML：把报告文本渲染成带标题层级和列表的排版 */
  function markdownToHtml(text) {
    var lines = escapeHtml(text).split("\n");
    var out = [];
    var inList = false;
    function closeList() { if (inList) { out.push("</ul>"); inList = false; } }
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (/^### /.test(line)) { closeList(); out.push("<h3>" + line.slice(4) + "</h3>"); }
      else if (/^## /.test(line)) { closeList(); out.push("<h2>" + line.slice(3) + "</h2>"); }
      else if (/^# /.test(line)) { closeList(); out.push("<h1>" + line.slice(2) + "</h1>"); }
      else if (/^[-·] /.test(line)) { if (!inList) { out.push("<ul>"); inList = true; } out.push("<li>" + line.slice(2) + "</li>"); }
      else if (line === "") { closeList(); }
      else { closeList(); out.push("<div class=\"report-para\">" + line + "</div>"); }
    }
    closeList();
    return out.join("");
  }

  /* 清理动态按钮（查看详情 / 返回分类） */
  function clearDynamicButtons() {
    ["btn-show-jobs", "btn-back-categories"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function renderFullReport() {
    clearDynamicButtons();

    var container = document.getElementById("report-content");
    if (typeof window.generateReport === "function") {
      state.reportText = window.generateReport(state.userProfile, state.mbtiType, state.matchedJobs, state.filteredJobs);
    } else {
      state.reportText = "报告模块未加载。";
    }
    // 把 Markdown 报告文本转成 HTML 排版后渲染
    container.innerHTML = markdownToHtml(state.reportText);
    document.getElementById("btn-copy").style.display = "block";
  }

  function renderCategories() {
    clearDynamicButtons();

    var container = document.getElementById("report-content");
    document.getElementById("btn-copy").style.display = "none";

    var html = '<p class="report-text-block">以下是从你的匹配结果中提取的适配职业大类，点击分类可查看该类岗位：</p>';
    html += '<div class="job-grid">';
    if (state.categories.length) {
      state.categories.forEach(function (c, idx) {
        html += '<div class="job-card job-card-clickable" data-idx="' + idx + '">'
          + '<div class="job-card-head">'
          + '<span class="job-card-title">' + escapeHtml(c.name) + '</span>'
          + '<span class="job-card-match">' + c.count + ' 个岗位</span>'
          + '</div></div>';
      });
    } else {
      html += '<p class="report-text-block">暂未匹配到岗位，建议放宽条件后重新测评。</p>';
    }
    html += '</div>';
    container.innerHTML = html;

    // 给分类卡片绑定点击：查看该分类下的岗位
    var cards = container.querySelectorAll(".job-card-clickable");
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-idx"), 10);
        renderCategoryJobs(state.categories[idx].name);
      });
    }

    if (state.categories.length) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-primary btn-block";
      btn.id = "btn-show-jobs";
      btn.textContent = "查看推荐岗位详情";
      btn.addEventListener("click", renderFullReport);
      container.after(btn);
    }
  }

  /* 分步探索：点击某个职业分类，展示该分类下的岗位 */
  function renderCategoryJobs(categoryName) {
    clearDynamicButtons();

    var container = document.getElementById("report-content");
    document.getElementById("btn-copy").style.display = "none";

    var categoryMatched = (state.matchedJobs || []).filter(function (j) {
      return j.category === categoryName;
    });
    var categoryFiltered = (state.filteredJobs || []).filter(function (j) {
      return j.category === categoryName;
    });

    if (typeof window.generateReport === "function") {
      state.reportText = window.generateReport(state.userProfile, state.mbtiType, categoryMatched, categoryFiltered);
    } else {
      state.reportText = "报告模块未加载。";
    }
    container.innerHTML = markdownToHtml(state.reportText);

    var backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn-ghost btn-block";
    backBtn.id = "btn-back-categories";
    backBtn.textContent = "← 返回职业分类";
    backBtn.addEventListener("click", renderCategories);
    container.after(backBtn);

    document.getElementById("btn-copy").style.display = "block";
  }

  /* ============ 复制报告 ============ */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function copyReport() {
    var text = state.reportText || "";
    if (!text) return;
    function done() {
      var btn = document.getElementById("btn-copy");
      var old = btn.textContent;
      btn.textContent = "已复制 ✓";
      setTimeout(function () { btn.textContent = old; }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  /* ============ 事件绑定 ============ */
  function bindEvents() {
    document.getElementById("btn-next").addEventListener("click", function () {
      if (!validateForm()) return;
      collectUserProfile();
      showPage("page-quiz");
    });

    document.getElementById("btn-submit").addEventListener("click", function () {
      if (!validateQuiz()) return;
      state.mbtiType = calculateMBTI(state.answers);
      runMatching();
      showPage("page-mode");
    });

    document.getElementById("btn-explore").addEventListener("click", function () {
      renderCategories();
      showPage("page-report");
    });

    document.getElementById("btn-direct").addEventListener("click", function () {
      renderFullReport();
      showPage("page-report");
    });

    document.getElementById("btn-copy").addEventListener("click", copyReport);

    document.getElementById("btn-restart").addEventListener("click", function () {
      location.reload();
    });
  }

  /* ============ 初始化：默认显示填表页 ============ */
  function init() {
    showPage("page-form");
    document.getElementById("btn-copy").style.display = "none";
    initMajorToggle();
    renderQuestions();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);

  window.calculateMBTI = calculateMBTI;
})();
